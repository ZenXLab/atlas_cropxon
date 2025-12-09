import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyzeRequest {
  session_id?: string;
  analysis_type: "session_summary" | "root_cause" | "ux_scan" | "journey_analysis";
  context?: any;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const request: AnalyzeRequest = await req.json();
    const { session_id, analysis_type, context } = request;

    console.log(`[AI Analyze] Type: ${analysis_type}, Session: ${session_id}`);

    // Fetch session data if session_id provided
    let sessionData = null;
    let eventsData = null;

    if (session_id) {
      const { data: session } = await supabase
        .from("traceflow_sessions")
        .select("*")
        .eq("session_id", session_id)
        .single();
      sessionData = session;

      const { data: events } = await supabase
        .from("traceflow_events")
        .select("*")
        .eq("session_id", session_id)
        .order("timestamp", { ascending: true })
        .limit(200);
      eventsData = events;
    }

    // Call NeuroRouter for intelligent analysis
    const neuroRouterUrl = `${supabaseUrl}/functions/v1/traceflow-neurorouter`;
    
    let taskType = "general";
    let prompt = "";

    switch (analysis_type) {
      case "session_summary":
        taskType = "session_summary";
        prompt = `Analyze this user session and provide a summary:

Session Info:
- Duration: ${sessionData?.duration_ms ? Math.round(sessionData.duration_ms / 1000) : 'ongoing'}s
- Pages visited: ${sessionData?.page_count || 1}
- Events: ${eventsData?.length || 0}
- Rage clicks: ${sessionData?.rage_click_count || 0}
- Dead clicks: ${sessionData?.dead_click_count || 0}
- Errors: ${sessionData?.error_count || 0}
- Frustration score: ${sessionData?.frustration_score || 0}/100

Event Timeline (last 50):
${JSON.stringify(eventsData?.slice(-50).map(e => ({
  type: e.event_type,
  page: e.page_url?.split('/').pop(),
  element: e.element_text?.substring(0, 30),
  time: e.timestamp,
})), null, 2)}

Provide:
1. A one-sentence TL;DR
2. Key frustration moments (3-5 bullet points)
3. What the user was trying to accomplish
4. Likely issues they encountered`;
        break;

      case "root_cause":
        taskType = "root_cause_analysis";
        prompt = `Perform root cause analysis on this session:

Session had ${sessionData?.rage_click_count || 0} rage clicks and ${sessionData?.error_count || 0} errors.
Frustration score: ${sessionData?.frustration_score || 0}/100

Error events:
${JSON.stringify(eventsData?.filter(e => e.event_type === 'error' || e.event_type === 'rage_click'), null, 2)}

All events around frustration points:
${JSON.stringify(eventsData?.slice(-30), null, 2)}

Provide:
1. Root cause identification (be specific - mention components, selectors, likely code issues)
2. Technical explanation of what went wrong
3. Suggested code fix with component/file hints
4. Confidence score (0-100%)`;
        break;

      case "ux_scan":
        taskType = "ux_issue_detection";
        prompt = `Analyze UX issues across sessions:

Recent UX issues detected:
${JSON.stringify(context?.issues || [], null, 2)}

Common problem pages:
${JSON.stringify(context?.problem_pages || [], null, 2)}

Identify:
1. Critical UX issues that need immediate attention
2. Pattern analysis (what types of issues are most common)
3. Revenue impact estimation
4. Prioritized fix recommendations`;
        break;

      case "journey_analysis":
        taskType = "journey_analysis";
        prompt = `Analyze user journey and conversion funnel:

Funnel steps and drop-offs:
${JSON.stringify(context?.funnel_data || [], null, 2)}

User journey patterns:
${JSON.stringify(context?.journey_patterns || [], null, 2)}

Analyze:
1. Where users are dropping off and WHY (causality)
2. Conversion optimization opportunities
3. Predicted improvement if issues are fixed
4. A/B test recommendations`;
        break;
    }

    // Call NeuroRouter
    const neuroResponse = await fetch(neuroRouterUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.get("Authorization") || "",
      },
      body: JSON.stringify({
        task_type: taskType,
        prompt,
        context: { sessionData, eventsData: eventsData?.slice(-50) },
      }),
    });

    if (!neuroResponse.ok) {
      const error = await neuroResponse.text();
      throw new Error(`NeuroRouter error: ${error}`);
    }

    const aiResult = await neuroResponse.json();

    // Update session with AI analysis if applicable
    if (session_id && sessionData) {
      const updateData: any = {
        ai_analysis_status: "completed",
        updated_at: new Date().toISOString(),
      };

      if (analysis_type === "session_summary") {
        updateData.ai_summary = aiResult.content;
      } else if (analysis_type === "root_cause") {
        updateData.ai_root_cause = aiResult.content;
      }

      await supabase
        .from("traceflow_sessions")
        .update(updateData)
        .eq("session_id", session_id);
    }

    console.log(`[AI Analyze] Completed using ${aiResult.llm_used}/${aiResult.model_used} in ${aiResult.latency_ms}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        analysis_type,
        result: aiResult.content,
        llm_used: aiResult.llm_used,
        model_used: aiResult.model_used,
        routing_reason: aiResult.routing_reason,
        latency_ms: aiResult.latency_ms,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[AI Analyze] Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
