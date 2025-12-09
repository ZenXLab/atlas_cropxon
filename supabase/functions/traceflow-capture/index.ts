import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

interface CaptureRequest {
  events: CaptureEvent[];
  session_info?: {
    session_id: string;
    device_type?: string;
    browser?: string;
    os?: string;
    user_agent?: string;
    ip_address?: string;
    country?: string;
    city?: string;
  };
}

// Detect rage clicks (3+ clicks in same area within 1 second)
function detectRageClicks(events: CaptureEvent[]): CaptureEvent[] {
  const clickEvents = events.filter(e => e.event_type === 'click');
  const rageClicks: CaptureEvent[] = [];
  
  for (let i = 0; i < clickEvents.length - 2; i++) {
    const window = clickEvents.slice(i, i + 3);
    const times = window.map(e => new Date(e.timestamp || Date.now()).getTime());
    const timeDiff = times[2] - times[0];
    
    if (timeDiff < 1000) {
      // Check if clicks are in similar position (within 50px)
      const positions = window.map(e => ({ x: e.x_position || 0, y: e.y_position || 0 }));
      const maxDist = Math.max(
        Math.abs(positions[0].x - positions[1].x),
        Math.abs(positions[0].x - positions[2].x),
        Math.abs(positions[0].y - positions[1].y),
        Math.abs(positions[0].y - positions[2].y)
      );
      
      if (maxDist < 50) {
        rageClicks.push({
          ...window[0],
          event_type: 'rage_click',
          metadata: { ...window[0].metadata, click_count: 3, time_span_ms: timeDiff },
        });
      }
    }
  }
  
  return rageClicks;
}

// Detect dead clicks (clicks on non-interactive elements)
function detectDeadClicks(events: CaptureEvent[]): CaptureEvent[] {
  const deadClicks: CaptureEvent[] = [];
  
  for (const event of events) {
    if (event.event_type === 'click') {
      const selector = event.element_selector || '';
      const isInteractive = 
        selector.includes('button') ||
        selector.includes('a[') ||
        selector.includes('input') ||
        selector.includes('[onclick]') ||
        selector.includes('[role="button"]');
      
      if (!isInteractive && selector) {
        deadClicks.push({
          ...event,
          event_type: 'dead_click',
          metadata: { ...event.metadata, original_selector: selector },
        });
      }
    }
  }
  
  return deadClicks;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const request: CaptureRequest = await req.json();
    const { events, session_info } = request;

    console.log(`[Capture] Received ${events.length} events for session ${session_info?.session_id}`);

    // Ensure session exists
    if (session_info?.session_id) {
      const { data: existingSession } = await supabase
        .from("traceflow_sessions")
        .select("id")
        .eq("session_id", session_info.session_id)
        .single();

      if (!existingSession) {
        await supabase.from("traceflow_sessions").insert({
          session_id: session_info.session_id,
          device_type: session_info.device_type,
          browser: session_info.browser,
          os: session_info.os,
          user_agent: session_info.user_agent,
          ip_address: session_info.ip_address,
          country: session_info.country,
          city: session_info.city,
        });
        console.log(`[Capture] Created new session: ${session_info.session_id}`);
      }
    }

    // Process and enrich events
    const enrichedEvents: CaptureEvent[] = [...events];
    
    // Detect rage clicks
    const rageClicks = detectRageClicks(events);
    enrichedEvents.push(...rageClicks);
    
    // Detect dead clicks
    const deadClicks = detectDeadClicks(events);
    enrichedEvents.push(...deadClicks);

    // Insert all events
    const eventsToInsert = enrichedEvents.map(event => ({
      session_id: event.session_id,
      event_type: event.event_type,
      page_url: event.page_url,
      element_selector: event.element_selector,
      element_text: event.element_text?.substring(0, 500),
      x_position: event.x_position,
      y_position: event.y_position,
      viewport_width: event.viewport_width,
      viewport_height: event.viewport_height,
      device_type: event.device_type,
      browser: event.browser,
      os: event.os,
      metadata: event.metadata || {},
      timestamp: event.timestamp || new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from("traceflow_events")
      .insert(eventsToInsert);

    if (insertError) {
      console.error("[Capture] Insert error:", insertError);
      throw insertError;
    }

    // Calculate frustration score
    const rageClickCount = rageClicks.length;
    const deadClickCount = deadClicks.length;
    const errorCount = events.filter(e => e.event_type === 'error').length;
    const frustrationScore = Math.min(100, (rageClickCount * 20) + (deadClickCount * 10) + (errorCount * 15));

    // Update session stats
    if (session_info?.session_id) {
      await supabase
        .from("traceflow_sessions")
        .update({
          frustration_score: frustrationScore,
          updated_at: new Date().toISOString(),
        })
        .eq("session_id", session_info.session_id);
    }

    // If frustration score is high, queue for AI analysis
    if (frustrationScore >= 50) {
      await supabase.from("traceflow_ai_queue").insert({
        task_type: "session_analysis",
        priority: frustrationScore >= 80 ? 1 : 3,
        payload: {
          session_id: session_info?.session_id,
          frustration_score: frustrationScore,
          rage_clicks: rageClickCount,
          dead_clicks: deadClickCount,
          errors: errorCount,
        },
      });
      console.log(`[Capture] Queued high-frustration session for AI analysis: ${session_info?.session_id}`);
    }

    // Create/update UX issues for rage and dead clicks
    if (rageClicks.length > 0 || deadClicks.length > 0) {
      for (const click of [...rageClicks, ...deadClicks]) {
        const { data: existingIssue } = await supabase
          .from("traceflow_ux_issues")
          .select("id, occurrence_count")
          .eq("issue_type", click.event_type)
          .eq("page_url", click.page_url || '')
          .eq("element_selector", click.element_selector || '')
          .single();

        if (existingIssue) {
          await supabase
            .from("traceflow_ux_issues")
            .update({
              occurrence_count: existingIssue.occurrence_count + 1,
              last_seen: new Date().toISOString(),
              severity: existingIssue.occurrence_count >= 10 ? 'critical' : 
                       existingIssue.occurrence_count >= 5 ? 'high' : 'medium',
            })
            .eq("id", existingIssue.id);
        } else {
          await supabase.from("traceflow_ux_issues").insert({
            issue_type: click.event_type,
            page_url: click.page_url || '',
            element_selector: click.element_selector || '',
            severity: 'medium',
            metadata: click.metadata,
          });
        }
      }
    }

    console.log(`[Capture] Processed ${eventsToInsert.length} events (${rageClicks.length} rage, ${deadClicks.length} dead)`);

    return new Response(
      JSON.stringify({
        success: true,
        events_processed: eventsToInsert.length,
        rage_clicks_detected: rageClicks.length,
        dead_clicks_detected: deadClicks.length,
        frustration_score: frustrationScore,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[Capture] Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
