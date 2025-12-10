# TRACEFLOW Edge Functions

> **Last Updated:** 2025-12-10  
> **Runtime:** Deno (Supabase Edge Functions)

---

## Functions Overview

| Function | Purpose | Auth Required |
|----------|---------|---------------|
| `traceflow-capture` | Ingest events from SDK | No (API Key) |
| `traceflow-ai-analyze` | Trigger AI analysis | Yes (JWT) |
| `traceflow-neurorouter` | Multi-LLM routing | Yes (JWT) |
| `traceflow-export` | Export session data | Yes (JWT) |
| `traceflow-webhooks` | Outbound webhooks | Internal |

---

## `traceflow-capture`

Main event ingestion endpoint for SDK.

**Path:** `/functions/v1/traceflow-capture`  
**Method:** `POST`  
**Auth:** API Key (X-Traceflow-Key header)

### Request Schema

```typescript
interface CaptureRequest {
  session_id: string;
  visitor_id?: string;
  events: TraceflowEvent[];
  metadata?: {
    user_agent?: string;
    screen_resolution?: string;
    referrer?: string;
  };
}

interface TraceflowEvent {
  type: 'click' | 'scroll' | 'error' | 'pageview' | 'custom' | 'recording';
  timestamp: number;
  data: Record<string, any>;
}
```

### Implementation

```typescript
// supabase/functions/traceflow-capture/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-traceflow-key',
};

interface CapturePayload {
  session_id: string;
  visitor_id?: string;
  events: any[];
  metadata?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const payload: CapturePayload = await req.json();
    const { session_id, visitor_id, events, metadata } = payload;

    // Validate required fields
    if (!session_id || !events?.length) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get IP and geolocation
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    let geoData = {};
    
    try {
      const geoRes = await fetch(`http://ip-api.com/json/${clientIP}`);
      geoData = await geoRes.json();
    } catch (e) {
      console.error('Geolocation lookup failed:', e);
    }

    // Upsert session
    const sessionData = {
      session_id,
      visitor_id,
      user_agent: metadata?.user_agent,
      ip_address: clientIP,
      country_code: geoData.countryCode,
      city: geoData.city,
      geolocation: geoData.lat ? { lat: geoData.lat, lng: geoData.lon } : null,
      updated_at: new Date().toISOString(),
    };

    await supabase
      .from('traceflow_sessions')
      .upsert(sessionData, { onConflict: 'session_id' });

    // Process events
    let rageClickCount = 0;
    let deadClickCount = 0;
    let errorCount = 0;

    const processedEvents = events.map(event => {
      // Detect rage clicks (rapid clicks in same area)
      if (event.type === 'click') {
        // Rage click detection logic here
      }
      
      if (event.type === 'error') errorCount++;

      return {
        session_id,
        event_type: event.type,
        page_url: event.data?.page_url,
        element_text: event.data?.element_text,
        element_selector: event.data?.selector,
        x_position: event.data?.x,
        y_position: event.data?.y,
        metadata: event.data,
        timestamp: new Date(event.timestamp).toISOString(),
      };
    });

    // Batch insert events
    if (processedEvents.length > 0) {
      await supabase.from('traceflow_events').insert(processedEvents);
    }

    // Calculate frustration score
    const frustrationScore = Math.min(100, 
      (rageClickCount * 15) + (deadClickCount * 10) + (errorCount * 20)
    );

    // Update session metrics
    await supabase
      .from('traceflow_sessions')
      .update({
        rage_click_count: rageClickCount,
        dead_click_count: deadClickCount,
        error_count: errorCount,
        frustration_score: frustrationScore,
      })
      .eq('session_id', session_id);

    // Queue for AI analysis if high frustration
    if (frustrationScore > 70) {
      await supabase.from('traceflow_ai_queue').insert({
        session_id,
        task_type: 'session_summary',
        priority: Math.max(1, 10 - Math.floor(frustrationScore / 10)),
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        events_processed: processedEvents.length,
        frustration_score: frustrationScore 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Capture error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## `traceflow-ai-analyze`

Trigger AI analysis for a session.

**Path:** `/functions/v1/traceflow-ai-analyze`  
**Method:** `POST`  
**Auth:** JWT Required

### Request Schema

```typescript
interface AnalyzeRequest {
  session_id: string;
  analysis_type: 'summary' | 'root_cause' | 'journey' | 'code_fix';
}
```

### Implementation

```typescript
// supabase/functions/traceflow-ai-analyze/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

// Model selection by task type
const MODEL_ROUTING: Record<string, string> = {
  summary: "google/gemini-2.5-flash",
  root_cause: "google/gemini-2.5-pro",
  journey: "google/gemini-2.5-flash",
  code_fix: "openai/gpt-5-mini",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { session_id, analysis_type } = await req.json();
    const startTime = Date.now();

    // Fetch session data
    const { data: session } = await supabase
      .from('traceflow_sessions')
      .select('*')
      .eq('session_id', session_id)
      .single();

    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch events
    const { data: events } = await supabase
      .from('traceflow_events')
      .select('*')
      .eq('session_id', session_id)
      .order('timestamp', { ascending: true })
      .limit(100);

    // Select model based on task
    const model = MODEL_ROUTING[analysis_type] || "google/gemini-2.5-flash";

    // Build prompt based on analysis type
    const prompts: Record<string, string> = {
      summary: `Analyze this user session and provide a brief TL;DR summary. Focus on:
        - What the user was trying to accomplish
        - Key friction points encountered
        - Overall session quality (frustrated, neutral, successful)
        
        Session data: ${JSON.stringify({ session, events: events?.slice(0, 50) })}`,
      
      root_cause: `Analyze this session to identify the root cause of user frustration.
        Frustration score: ${session.frustration_score}/100
        Rage clicks: ${session.rage_click_count}
        Errors: ${session.error_count}
        
        Events: ${JSON.stringify(events)}
        
        Provide:
        1. Primary root cause
        2. Contributing factors
        3. Specific page/component causing issues`,
      
      code_fix: `Based on this session with UX issues, suggest code fixes:
        Issues detected: Rage clicks on elements, dead clicks, errors
        Events: ${JSON.stringify(events?.filter(e => e.event_type === 'error' || e.event_type === 'click'))}
        
        Provide specific code suggestions to fix the identified issues.`,
    };

    // Call AI Gateway
    const aiResponse = await fetch(LOVABLE_AI_GATEWAY, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are an expert UX analyst specializing in digital experience intelligence.' },
          { role: 'user', content: prompts[analysis_type] || prompts.summary }
        ],
        max_tokens: 1000,
      }),
    });

    const aiData = await aiResponse.json();
    const analysis = aiData.choices?.[0]?.message?.content || 'Analysis failed';

    // Log to neurorouter_logs
    const latency = Date.now() - startTime;
    await supabase.from('neurorouter_logs').insert({
      task_type: analysis_type,
      model_selected: model,
      provider: model.startsWith('google') ? 'google' : 'openai',
      latency_ms: latency,
      input_tokens: aiData.usage?.prompt_tokens,
      output_tokens: aiData.usage?.completion_tokens,
      total_tokens: aiData.usage?.total_tokens,
      session_id,
      success: true,
    });

    // Update session with analysis
    await supabase
      .from('traceflow_sessions')
      .update({
        ai_analyzed: true,
        ai_summary: analysis_type === 'summary' ? analysis : undefined,
        ai_root_cause: analysis_type === 'root_cause' ? analysis : undefined,
      })
      .eq('session_id', session_id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis,
        model_used: model,
        latency_ms: latency 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI analysis error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## `traceflow-neurorouter`

Multi-LLM intelligent routing for various AI tasks.

**Path:** `/functions/v1/traceflow-neurorouter`  
**Method:** `POST`  
**Auth:** JWT Required

### Implementation

```typescript
// supabase/functions/traceflow-neurorouter/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

interface NeuroRouterRequest {
  task_type: string;
  prompt: string;
  context?: Record<string, any>;
  preferred_model?: string;
}

// Intelligent model selection
function selectModel(taskType: string, preferredModel?: string): string {
  if (preferredModel) return preferredModel;

  const modelMap: Record<string, string> = {
    // Fast, cost-effective tasks
    'session_summary': 'google/gemini-2.5-flash',
    'quick_analysis': 'google/gemini-2.5-flash',
    'classification': 'google/gemini-2.5-flash-lite',
    
    // Deep reasoning tasks
    'root_cause_analysis': 'google/gemini-2.5-pro',
    'complex_diagnosis': 'google/gemini-2.5-pro',
    
    // Vision/UI tasks
    'ui_visual_analysis': 'google/gemini-2.5-pro',
    'screenshot_analysis': 'google/gemini-2.5-pro',
    'heatmap_interpretation': 'google/gemini-2.5-pro',
    
    // Code tasks
    'code_fix_suggestion': 'openai/gpt-5-mini',
    'code_review': 'openai/gpt-5-mini',
    'technical_recommendation': 'openai/gpt-5-mini',
    
    // Journey/behavioral
    'journey_analysis': 'google/gemini-2.5-flash',
    'funnel_analysis': 'google/gemini-2.5-flash',
    'user_intent': 'google/gemini-2.5-flash',
  };

  return modelMap[taskType] || 'google/gemini-2.5-flash';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const { task_type, prompt, context, preferred_model }: NeuroRouterRequest = await req.json();

    const model = selectModel(task_type, preferred_model);
    const provider = model.startsWith('google') ? 'google' : model.startsWith('openai') ? 'openai' : 'anthropic';

    console.log(`NeuroRouter: Routing ${task_type} to ${model}`);

    const response = await fetch(LOVABLE_AI_GATEWAY, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { 
            role: 'system', 
            content: `You are an AI assistant specialized in ${task_type.replace(/_/g, ' ')}. 
                      Provide clear, actionable insights based on the data provided.` 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI Gateway error: ${response.status} - ${errorText}`);
      
      // Handle rate limiting
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const latency = Date.now() - startTime;

    return new Response(
      JSON.stringify({
        success: true,
        result: data.choices?.[0]?.message?.content,
        metadata: {
          model_used: model,
          provider,
          task_type,
          latency_ms: latency,
          tokens: {
            input: data.usage?.prompt_tokens,
            output: data.usage?.completion_tokens,
            total: data.usage?.total_tokens,
          }
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('NeuroRouter error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## Configuration

### `supabase/config.toml`

```toml
[project]
id = "wnentybljoyjhizsdhrt"

[functions.traceflow-capture]
verify_jwt = false

[functions.traceflow-ai-analyze]
verify_jwt = true

[functions.traceflow-neurorouter]
verify_jwt = true

[functions.traceflow-export]
verify_jwt = true
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin operations | Yes |
| `LOVABLE_API_KEY` | Lovable AI Gateway key (auto-provisioned) | Yes |
| `OPENAI_API_KEY` | Direct OpenAI access (optional fallback) | No |
| `ANTHROPIC_API_KEY` | Claude API access (optional) | No |
