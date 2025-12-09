import React, { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CaptureEvent {
  session_id: string;
  event_type: string;
  page_url?: string;
  element_selector?: string;
  element_text?: string;
  x_position?: number;
  y_position?: number;
  viewport_width?: number;
  viewport_height?: number;
  device_type?: string;
  browser?: string;
  os?: string;
  metadata?: any;
  timestamp?: string;
}

interface TraceflowCaptureOptions {
  enabled?: boolean;
  batchSize?: number;
  flushInterval?: number;
  excludeSelectors?: string[];
  excludeUrls?: string[];
  captureClicks?: boolean;
  capturePageviews?: boolean;
  captureErrors?: boolean;
  captureScrollDepth?: boolean;
}

const defaultOptions: TraceflowCaptureOptions = {
  enabled: true,
  batchSize: 10,
  flushInterval: 5000,
  excludeSelectors: [],
  excludeUrls: ['/admin', '/traceflow/dashboard'],
  captureClicks: true,
  capturePageviews: true,
  captureErrors: true,
  captureScrollDepth: true,
};

// Generate or retrieve session ID
function getSessionId(): string {
  const key = 'traceflow_session_id';
  let sessionId = sessionStorage.getItem(key);
  
  if (!sessionId) {
    sessionId = `tf_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem(key, sessionId);
  }
  
  return sessionId;
}

// Get device info
function getDeviceInfo() {
  const ua = navigator.userAgent;
  
  let deviceType = 'desktop';
  if (/Mobi|Android/i.test(ua)) deviceType = 'mobile';
  else if (/Tablet|iPad/i.test(ua)) deviceType = 'tablet';
  
  let browser = 'unknown';
  if (/Chrome/i.test(ua)) browser = 'Chrome';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Safari/i.test(ua)) browser = 'Safari';
  else if (/Edge/i.test(ua)) browser = 'Edge';
  
  let os = 'unknown';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Mac/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iOS/i.test(ua)) os = 'iOS';
  
  return { deviceType, browser, os, userAgent: ua };
}

// Get element selector
function getElementSelector(element: HTMLElement): string {
  const parts: string[] = [];
  let el: HTMLElement | null = element;
  
  while (el && el !== document.body) {
    let selector = el.tagName.toLowerCase();
    
    if (el.id) {
      selector = `#${el.id}`;
      parts.unshift(selector);
      break;
    }
    
    if (el.className && typeof el.className === 'string') {
      const classes = el.className.split(' ').filter(c => c && !c.startsWith('hover:'));
      if (classes.length) {
        selector += `.${classes.slice(0, 2).join('.')}`;
      }
    }
    
    parts.unshift(selector);
    el = el.parentElement;
    
    if (parts.length >= 4) break;
  }
  
  return parts.join(' > ');
}

export function useTraceflowCapture(options: TraceflowCaptureOptions = {}) {
  const opts = { ...defaultOptions, ...options };
  const sessionId = useRef(getSessionId());
  const eventQueue = useRef<CaptureEvent[]>([]);
  const deviceInfo = useRef(getDeviceInfo());
  const lastScrollDepth = useRef(0);
  const sessionStarted = useRef(false);
  
  // Flush events to backend
  const flushEvents = useCallback(async () => {
    if (eventQueue.current.length === 0) return;
    
    const events = [...eventQueue.current];
    eventQueue.current = [];
    
    try {
      await supabase.functions.invoke('traceflow-capture', {
        body: {
          events,
          session_info: {
            session_id: sessionId.current,
            ...deviceInfo.current,
          },
        },
      });
      console.log(`[TraceflowCapture] Flushed ${events.length} events`);
    } catch (error) {
      console.error('[TraceflowCapture] Flush error:', error);
      // Re-queue failed events
      eventQueue.current = [...events, ...eventQueue.current];
    }
  }, []);
  
  // Add event to queue
  const captureEvent = useCallback((event: Omit<CaptureEvent, 'session_id' | 'timestamp'>) => {
    const fullEvent: CaptureEvent = {
      ...event,
      session_id: sessionId.current,
      timestamp: new Date().toISOString(),
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      ...deviceInfo.current,
    };
    
    eventQueue.current.push(fullEvent);
    
    // Flush if batch size reached
    if (eventQueue.current.length >= (opts.batchSize || 10)) {
      flushEvents();
    }
  }, [flushEvents, opts.batchSize]);
  
  // Start session
  const startSession = useCallback(() => {
    if (sessionStarted.current) return;
    sessionStarted.current = true;
    
    captureEvent({
      event_type: 'session_start',
      page_url: window.location.pathname,
      metadata: {
        referrer: document.referrer,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
      },
    });
  }, [captureEvent]);
  
  // Capture pageview
  const capturePageview = useCallback(() => {
    if (!opts.capturePageviews) return;
    
    const pageUrl = window.location.pathname;
    if (opts.excludeUrls?.some(url => pageUrl.startsWith(url))) return;
    
    captureEvent({
      event_type: 'pageview',
      page_url: pageUrl,
      metadata: {
        title: document.title,
        search: window.location.search,
        hash: window.location.hash,
      },
    });
  }, [captureEvent, opts.capturePageviews, opts.excludeUrls]);
  
  useEffect(() => {
    if (!opts.enabled) return;
    
    startSession();
    capturePageview();
    
    // Click handler
    const handleClick = (e: MouseEvent) => {
      if (!opts.captureClicks) return;
      
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const selector = getElementSelector(target);
      if (opts.excludeSelectors?.some(s => selector.includes(s))) return;
      
      captureEvent({
        event_type: 'click',
        page_url: window.location.pathname,
        element_selector: selector,
        element_text: target.textContent?.substring(0, 100) || undefined,
        x_position: e.clientX,
        y_position: e.clientY,
      });
    };
    
    // Error handler
    const handleError = (e: ErrorEvent) => {
      if (!opts.captureErrors) return;
      
      captureEvent({
        event_type: 'error',
        page_url: window.location.pathname,
        metadata: {
          message: e.message,
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno,
        },
      });
    };
    
    // Scroll handler (throttled)
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      if (!opts.captureScrollDepth) return;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollHeight > 0 ? Math.round((window.scrollY / scrollHeight) * 100) : 0;
        
        // Only capture if scroll depth increased significantly
        if (scrollPercent > lastScrollDepth.current + 25) {
          lastScrollDepth.current = scrollPercent;
          captureEvent({
            event_type: 'scroll_depth',
            page_url: window.location.pathname,
            metadata: { depth_percent: scrollPercent },
          });
        }
      }, 500);
    };
    
    // Add listeners
    document.addEventListener('click', handleClick, { capture: true });
    window.addEventListener('error', handleError);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Flush interval
    const flushIntervalId = setInterval(flushEvents, opts.flushInterval || 5000);
    
    // Flush on page unload
    const handleUnload = () => {
      captureEvent({
        event_type: 'session_end',
        page_url: window.location.pathname,
      });
      // Use sendBeacon for reliable delivery
      if (eventQueue.current.length > 0) {
        const payload = JSON.stringify({
          events: eventQueue.current,
          session_info: {
            session_id: sessionId.current,
            ...deviceInfo.current,
          },
        });
        navigator.sendBeacon(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/traceflow-capture`,
          new Blob([payload], { type: 'application/json' })
        );
      }
    };
    
    window.addEventListener('beforeunload', handleUnload);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
      window.removeEventListener('error', handleError);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleUnload);
      clearInterval(flushIntervalId);
      clearTimeout(scrollTimeout);
      flushEvents();
    };
  }, [opts.enabled, opts.captureClicks, opts.captureErrors, opts.captureScrollDepth, 
      opts.excludeSelectors, opts.flushInterval, startSession, capturePageview, captureEvent, flushEvents]);
  
  return {
    sessionId: sessionId.current,
    captureEvent,
    flushEvents,
  };
}

// Provider component for app-wide capture
export function TraceflowCaptureProvider({ 
  children, 
  options 
}: { 
  children: React.ReactNode; 
  options?: TraceflowCaptureOptions;
}): JSX.Element {
  useTraceflowCapture(options);
  return React.createElement(React.Fragment, null, children);
}
