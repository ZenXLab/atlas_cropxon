import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// LLM Configurations with their strengths
const LLM_CONFIGS = {
  openai: {
    url: "https://api.openai.com/v1/chat/completions",
    models: {
      default: "gpt-4o",
      reasoning: "gpt-4o",
      fast: "gpt-4o-mini",
    },
    strengths: ["general", "code_analysis", "summarization", "fast_response"],
    costPerToken: 0.00003,
  },
  claude: {
    url: "https://api.anthropic.com/v1/messages",
    models: {
      default: "claude-sonnet-4-20250514",
      reasoning: "claude-sonnet-4-20250514",
      code: "claude-sonnet-4-20250514",
    },
    strengths: ["code_analysis", "detailed_reasoning", "long_context", "safety"],
    costPerToken: 0.000024,
  },
  gemini: {
    url: "https://generativelanguage.googleapis.com/v1beta/models",
    models: {
      default: "gemini-2.5-flash",
      vision: "gemini-2.5-pro",
      fast: "gemini-2.5-flash",
    },
    strengths: ["vision", "multimodal", "ui_analysis", "fast_response"],
    costPerToken: 0.00001,
  },
  deepseek: {
    url: "https://api.deepseek.com/v1/chat/completions",
    models: {
      default: "deepseek-chat",
      reasoning: "deepseek-reasoner",
    },
    strengths: ["reasoning", "math", "complex_analysis", "cost_effective"],
    costPerToken: 0.000014,
  },
};

// Task type to LLM routing logic
const TASK_ROUTING = {
  session_summary: { primary: "openai", fallback: "claude", reason: "Fast summarization with context understanding" },
  root_cause_analysis: { primary: "deepseek", fallback: "claude", reason: "Deep reasoning for complex analysis" },
  code_fix_suggestion: { primary: "claude", fallback: "openai", reason: "Best at code analysis and suggestions" },
  ui_visual_analysis: { primary: "gemini", fallback: "openai", reason: "Vision capabilities for UI analysis" },
  ux_issue_detection: { primary: "gemini", fallback: "claude", reason: "Multimodal analysis for UX patterns" },
  journey_analysis: { primary: "deepseek", fallback: "openai", reason: "Complex reasoning for user journeys" },
  sentiment_analysis: { primary: "openai", fallback: "claude", reason: "Fast sentiment classification" },
  general: { primary: "openai", fallback: "claude", reason: "General purpose tasks" },
};

interface NeuroRouterRequest {
  task_type: string;
  prompt: string;
  context?: any;
  prefer_llm?: string;
  require_vision?: boolean;
  max_tokens?: number;
  temperature?: number;
}

async function callOpenAI(prompt: string, systemPrompt: string, model: string, maxTokens: number, temperature: number) {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI error: ${error}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0]?.message?.content || "",
    usage: data.usage,
  };
}

async function callClaude(prompt: string, systemPrompt: string, model: string, maxTokens: number, temperature: number) {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude error: ${error}`);
  }

  const data = await response.json();
  return {
    content: data.content[0]?.text || "",
    usage: { input_tokens: data.usage?.input_tokens || 0, output_tokens: data.usage?.output_tokens || 0 },
  };
}

async function callGemini(prompt: string, systemPrompt: string, model: string, maxTokens: number, temperature: number) {
  const apiKey = Deno.env.get("GOOGLE_GEMINI_API_KEY");
  if (!apiKey) throw new Error("GOOGLE_GEMINI_API_KEY not configured");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini error: ${error}`);
  }

  const data = await response.json();
  return {
    content: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
    usage: { total_tokens: data.usageMetadata?.totalTokenCount || 0 },
  };
}

async function callDeepSeek(prompt: string, systemPrompt: string, model: string, maxTokens: number, temperature: number) {
  const apiKey = Deno.env.get("DEEPSEEK_API_KEY");
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY not configured");

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek error: ${error}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0]?.message?.content || "",
    usage: data.usage,
  };
}

function selectLLM(taskType: string, requireVision: boolean, preferLlm?: string): { llm: string; model: string; reason: string } {
  // If vision is required, always use Gemini
  if (requireVision) {
    return { 
      llm: "gemini", 
      model: LLM_CONFIGS.gemini.models.vision, 
      reason: "Vision capabilities required for UI/image analysis" 
    };
  }

  // If user prefers a specific LLM
  if (preferLlm && LLM_CONFIGS[preferLlm as keyof typeof LLM_CONFIGS]) {
    const config = LLM_CONFIGS[preferLlm as keyof typeof LLM_CONFIGS];
    return { 
      llm: preferLlm, 
      model: config.models.default, 
      reason: `User preference: ${preferLlm}` 
    };
  }

  // Route based on task type
  const routing = TASK_ROUTING[taskType as keyof typeof TASK_ROUTING] || TASK_ROUTING.general;
  const primaryLlm = routing.primary;
  const config = LLM_CONFIGS[primaryLlm as keyof typeof LLM_CONFIGS];
  
  // Select appropriate model variant
  let model = config.models.default;
  if (taskType === "root_cause_analysis" && 'reasoning' in config.models) {
    model = (config.models as any).reasoning;
  } else if (taskType === "code_fix_suggestion" && 'code' in config.models) {
    model = (config.models as any).code;
  }

  return { llm: primaryLlm, model, reason: routing.reason };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    const request: NeuroRouterRequest = await req.json();
    const { task_type, prompt, context, prefer_llm, require_vision, max_tokens = 2000, temperature = 0.3 } = request;

    console.log(`[NeuroRouter] Task: ${task_type}, Vision: ${require_vision}, Prefer: ${prefer_llm || 'auto'}`);

    // Select the best LLM for this task
    const selection = selectLLM(task_type, require_vision || false, prefer_llm);
    console.log(`[NeuroRouter] Selected: ${selection.llm}/${selection.model} - ${selection.reason}`);

    // Build system prompt based on task type
    const systemPrompts: Record<string, string> = {
      session_summary: "You are a UX analyst AI. Analyze the user session data and provide a concise, actionable summary of what happened, key frustration points, and potential issues. Be specific and mention exact elements/actions.",
      root_cause_analysis: "You are a senior debugging engineer. Analyze the session data and events to identify the root cause of user frustration or errors. Provide technical details, trace the issue to likely code components, and suggest specific fixes.",
      code_fix_suggestion: "You are an expert frontend developer. Based on the UX issue described, provide specific code fixes with file paths and line references. Include the exact code changes needed.",
      ui_visual_analysis: "You are a UI/UX expert with computer vision capabilities. Analyze the visual UI elements and identify any issues like overlapping elements, hidden content, layout shifts, or accessibility problems.",
      ux_issue_detection: "You are a UX researcher. Identify usability issues, friction points, and opportunities for improvement. Prioritize by impact on user experience and conversion.",
      journey_analysis: "You are a conversion optimization expert. Analyze the user journey, identify drop-off points, explain WHY users are dropping off, and suggest specific improvements to increase conversion.",
      sentiment_analysis: "You are a sentiment analysis expert. Analyze the feedback/voice transcript and extract sentiment, key topics, and actionable insights.",
      general: "You are an intelligent AI assistant helping analyze digital experience data.",
    };

    const systemPrompt = systemPrompts[task_type] || systemPrompts.general;
    const fullPrompt = context ? `${prompt}\n\nContext:\n${JSON.stringify(context, null, 2)}` : prompt;

    let result;
    let usage;

    // Call the selected LLM
    switch (selection.llm) {
      case "openai":
        result = await callOpenAI(fullPrompt, systemPrompt, selection.model, max_tokens, temperature);
        break;
      case "claude":
        result = await callClaude(fullPrompt, systemPrompt, selection.model, max_tokens, temperature);
        break;
      case "gemini":
        result = await callGemini(fullPrompt, systemPrompt, selection.model, max_tokens, temperature);
        break;
      case "deepseek":
        result = await callDeepSeek(fullPrompt, systemPrompt, selection.model, max_tokens, temperature);
        break;
      default:
        throw new Error(`Unknown LLM: ${selection.llm}`);
    }

    const latencyMs = Date.now() - startTime;

    // Log the routing decision
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from("traceflow_neurorouter_logs").insert({
      task_type,
      task_complexity: require_vision ? "vision" : "moderate",
      selected_llm: selection.llm,
      selected_model: selection.model,
      routing_reason: selection.reason,
      input_tokens: result.usage?.input_tokens || result.usage?.prompt_tokens || 0,
      output_tokens: result.usage?.output_tokens || result.usage?.completion_tokens || 0,
      latency_ms: latencyMs,
      success: true,
    });

    console.log(`[NeuroRouter] Completed in ${latencyMs}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        content: result.content,
        llm_used: selection.llm,
        model_used: selection.model,
        routing_reason: selection.reason,
        latency_ms: latencyMs,
        usage: result.usage,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[NeuroRouter] Error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
