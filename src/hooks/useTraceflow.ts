import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Types
export interface TraceflowSession {
  id: string;
  session_id: string;
  tenant_id: string | null;
  user_id: string | null;
  start_time: string;
  end_time: string | null;
  duration_ms: number | null;
  page_count: number;
  event_count: number;
  rage_click_count: number;
  dead_click_count: number;
  error_count: number;
  frustration_score: number;
  device_type: string;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  ai_summary: string | null;
  ai_root_cause: string | null;
  ai_suggested_fix: string | null;
  ai_analysis_status: string;
  created_at: string;
}

export interface TraceflowEvent {
  id: string;
  session_id: string;
  event_type: string;
  page_url: string | null;
  element_selector: string | null;
  element_text: string | null;
  x_position: number | null;
  y_position: number | null;
  timestamp: string;
  metadata: any;
}

export interface TraceflowUXIssue {
  id: string;
  issue_type: string;
  severity: string;
  page_url: string;
  element_selector: string | null;
  occurrence_count: number;
  affected_sessions: number;
  estimated_revenue_impact: number;
  status: string;
  ai_diagnosis: string | null;
  ai_suggested_fix: string | null;
  first_seen: string;
  last_seen: string;
}

export interface NeuroRouterLog {
  id: string;
  task_type: string;
  selected_llm: string;
  selected_model: string;
  routing_reason: string;
  latency_ms: number;
  success: boolean;
  created_at: string;
}

// Hooks
export function useTraceflowSessions(options?: { 
  limit?: number; 
  minFrustration?: number;
  dateRange?: { from: Date; to: Date };
}) {
  return useQuery({
    queryKey: ["traceflow-sessions", options],
    queryFn: async () => {
      let query = supabase
        .from("traceflow_sessions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(options?.limit || 50);

      if (options?.minFrustration) {
        query = query.gte("frustration_score", options.minFrustration);
      }

      if (options?.dateRange) {
        query = query
          .gte("created_at", options.dateRange.from.toISOString())
          .lte("created_at", options.dateRange.to.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TraceflowSession[];
    },
    staleTime: 30000,
  });
}

export function useTraceflowSession(sessionId: string) {
  return useQuery({
    queryKey: ["traceflow-session", sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("traceflow_sessions")
        .select("*")
        .eq("session_id", sessionId)
        .single();
      if (error) throw error;
      return data as TraceflowSession;
    },
    enabled: !!sessionId,
  });
}

export function useTraceflowEvents(sessionId: string) {
  return useQuery({
    queryKey: ["traceflow-events", sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("traceflow_events")
        .select("*")
        .eq("session_id", sessionId)
        .order("timestamp", { ascending: true });
      if (error) throw error;
      return data as TraceflowEvent[];
    },
    enabled: !!sessionId,
  });
}

export function useTraceflowUXIssues(options?: { 
  status?: string; 
  severity?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["traceflow-ux-issues", options],
    queryFn: async () => {
      let query = supabase
        .from("traceflow_ux_issues")
        .select("*")
        .order("occurrence_count", { ascending: false })
        .limit(options?.limit || 50);

      if (options?.status) {
        query = query.eq("status", options.status);
      }

      if (options?.severity) {
        query = query.eq("severity", options.severity);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TraceflowUXIssue[];
    },
    staleTime: 30000,
  });
}

export function useTraceflowStats() {
  return useQuery({
    queryKey: ["traceflow-stats"],
    queryFn: async () => {
      // Get session stats
      const { data: sessions } = await supabase
        .from("traceflow_sessions")
        .select("frustration_score, rage_click_count, dead_click_count, error_count, created_at")
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Get UX issues count
      const { count: openIssues } = await supabase
        .from("traceflow_ux_issues")
        .select("*", { count: "exact", head: true })
        .eq("status", "open");

      // Get critical issues
      const { count: criticalIssues } = await supabase
        .from("traceflow_ux_issues")
        .select("*", { count: "exact", head: true })
        .eq("severity", "critical")
        .eq("status", "open");

      const sessionCount = sessions?.length || 0;
      const avgFrustration = sessionCount > 0 
        ? sessions!.reduce((sum, s) => sum + (s.frustration_score || 0), 0) / sessionCount 
        : 0;
      const totalRageClicks = sessions?.reduce((sum, s) => sum + (s.rage_click_count || 0), 0) || 0;
      const totalDeadClicks = sessions?.reduce((sum, s) => sum + (s.dead_click_count || 0), 0) || 0;

      return {
        sessions24h: sessionCount,
        avgFrustration: Math.round(avgFrustration),
        rageClicks24h: totalRageClicks,
        deadClicks24h: totalDeadClicks,
        openIssues: openIssues || 0,
        criticalIssues: criticalIssues || 0,
      };
    },
    staleTime: 60000,
  });
}

export function useNeuroRouterLogs(limit: number = 20) {
  return useQuery({
    queryKey: ["neurorouter-logs", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("traceflow_neurorouter_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as NeuroRouterLog[];
    },
    staleTime: 10000,
  });
}

export function useAnalyzeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, analysisType }: { sessionId: string; analysisType: string }) => {
      const { data, error } = await supabase.functions.invoke("traceflow-ai-analyze", {
        body: { session_id: sessionId, analysis_type: analysisType },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["traceflow-session", variables.sessionId] });
    },
  });
}

// Heatmap data aggregation
export function useTraceflowHeatmap(pageUrl: string, options?: { dateRange?: { from: Date; to: Date } }) {
  return useQuery({
    queryKey: ["traceflow-heatmap", pageUrl, options],
    queryFn: async () => {
      let query = supabase
        .from("traceflow_events")
        .select("x_position, y_position, event_type, viewport_width, viewport_height")
        .eq("page_url", pageUrl)
        .in("event_type", ["click", "rage_click", "dead_click"])
        .not("x_position", "is", null)
        .not("y_position", "is", null);

      if (options?.dateRange) {
        query = query
          .gte("timestamp", options.dateRange.from.toISOString())
          .lte("timestamp", options.dateRange.to.toISOString());
      }

      const { data, error } = await query.limit(1000);
      if (error) throw error;

      // Transform to heatmap data points
      return (data || []).map(e => ({
        x: e.x_position,
        y: e.y_position,
        value: e.event_type === "rage_click" ? 3 : e.event_type === "dead_click" ? 2 : 1,
        type: e.event_type,
      }));
    },
    enabled: !!pageUrl,
    staleTime: 60000,
  });
}
