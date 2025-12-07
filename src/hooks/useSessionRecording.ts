import { useEffect, useRef, useCallback } from "react";
import { record, EventType } from "rrweb";
import { supabase } from "@/integrations/supabase/client";

interface UseSessionRecordingOptions {
  enabled?: boolean;
  sampleRate?: number;
  checkoutEveryNms?: number;
}

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("rrweb_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem("rrweb_session_id", sessionId);
  }
  return sessionId;
};

export const useSessionRecording = (options: UseSessionRecordingOptions = {}) => {
  const { enabled = true, checkoutEveryNms = 30000 } = options;
  const eventsRef = useRef<any[]>([]);
  const stopFnRef = useRef<(() => void) | null>(null);
  const recordingIdRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string>(getSessionId());
  const startTimeRef = useRef<Date>(new Date());
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Save events to database
  const saveEvents = useCallback(async (isFinal = false) => {
    if (eventsRef.current.length === 0) return;

    const eventsCopy = [...eventsRef.current];
    const sessionId = sessionIdRef.current;
    const now = new Date();
    const duration = now.getTime() - startTimeRef.current.getTime();

    // Count unique pages
    const pages = new Set<string>();
    eventsCopy.forEach((event) => {
      if (event.type === EventType.Meta && event.data?.href) {
        pages.add(event.data.href);
      }
    });

    const recordingData = {
      session_id: sessionId,
      events: eventsCopy,
      start_time: startTimeRef.current.toISOString(),
      end_time: isFinal ? now.toISOString() : null,
      duration_ms: duration,
      page_count: Math.max(1, pages.size),
      event_count: eventsCopy.length,
      metadata: {
        userAgent: navigator.userAgent,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        url: window.location.pathname,
      },
      updated_at: now.toISOString(),
    };

    try {
      if (recordingIdRef.current) {
        // Update existing recording
        const { error } = await supabase
          .from("session_recordings")
          .update(recordingData)
          .eq("id", recordingIdRef.current);

        if (error) {
          console.error("Error updating session recording:", error);
        } else {
          console.log(`Updated recording ${recordingIdRef.current} with ${eventsCopy.length} events`);
        }
      } else {
        // Create new recording
        const { data, error } = await supabase
          .from("session_recordings")
          .insert(recordingData)
          .select("id")
          .single();

        if (error) {
          console.error("Error saving session recording:", error);
        } else if (data) {
          recordingIdRef.current = data.id;
          console.log(`Created new recording ${data.id} with ${eventsCopy.length} events`);
        }
      }
    } catch (err) {
      console.error("Failed to save session recording:", err);
    }
  }, []);

  // Start recording
  const startRecording = useCallback(() => {
    if (stopFnRef.current) return; // Already recording

    console.log("Starting rrweb session recording...");
    startTimeRef.current = new Date();
    eventsRef.current = [];
    recordingIdRef.current = null;

    stopFnRef.current = record({
      emit: (event) => {
        eventsRef.current.push(event);
      },
      checkoutEveryNms,
      sampling: {
        mousemove: true,
        mouseInteraction: true,
        scroll: 150,
        media: 800,
        input: "last",
      },
      recordCanvas: false,
      collectFonts: false,
      inlineStylesheet: true,
      maskAllInputs: true,
      maskInputOptions: {
        password: true,
        email: false,
      },
    });

    // Save events periodically
    saveIntervalRef.current = setInterval(() => {
      saveEvents(false);
    }, 10000); // Save every 10 seconds
  }, [checkoutEveryNms, saveEvents]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (stopFnRef.current) {
      stopFnRef.current();
      stopFnRef.current = null;
    }

    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
      saveIntervalRef.current = null;
    }

    // Final save
    saveEvents(true);
    console.log("Stopped rrweb session recording");
  }, [saveEvents]);

  useEffect(() => {
    if (!enabled) return;

    startRecording();

    // Save on page unload
    const handleUnload = () => {
      stopRecording();
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
      stopRecording();
    };
  }, [enabled, startRecording, stopRecording]);

  return {
    sessionId: sessionIdRef.current,
    startRecording,
    stopRecording,
    eventCount: eventsRef.current.length,
  };
};
