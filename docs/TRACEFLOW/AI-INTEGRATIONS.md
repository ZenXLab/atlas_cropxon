# TRACEFLOW AI Integrations

> **Last Updated:** 2025-12-10  
> **Version:** 1.0.0-beta

---

## NeuroRouter Architecture

The NeuroRouter is TRACEFLOW's intelligent AI task routing system that selects the optimal LLM for each analysis task.

```
┌─────────────────────────────────────────────────────────────────┐
│                      NEUROROUTER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────┐                                               │
│   │   Incoming  │                                               │
│   │   Request   │                                               │
│   └──────┬──────┘                                               │
│          │                                                       │
│          ▼                                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              TASK CLASSIFIER                             │   │
│   │                                                          │   │
│   │  Analyzes:                                               │   │
│   │  • Task type (summary, analysis, code, vision)           │   │
│   │  • Complexity (simple, medium, complex)                  │   │
│   │  • Required capabilities (text, vision, code)            │   │
│   │  • Latency requirements (realtime, async)                │   │
│   │  • Cost budget                                           │   │
│   └──────────────────────────┬──────────────────────────────┘   │
│                              │                                   │
│          ┌───────────────────┼───────────────────┐              │
│          ▼                   ▼                   ▼              │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│   │   SPEED     │    │   QUALITY   │    │  SPECIALTY  │        │
│   │   TIER      │    │   TIER      │    │   TIER      │        │
│   │             │    │             │    │             │        │
│   │ Gemini Flash│    │ Gemini Pro  │    │ GPT-5 Mini  │        │
│   │ Flash-Lite  │    │ GPT-5       │    │ Claude      │        │
│   └─────────────┘    └─────────────┘    └─────────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Supported AI Providers

### 1. Lovable AI Gateway (Primary)

**Endpoint:** `https://ai.gateway.lovable.dev/v1/chat/completions`  
**Auth:** `LOVABLE_API_KEY` (auto-provisioned)

| Model | Best For | Cost | Speed |
|-------|----------|------|-------|
| `google/gemini-2.5-flash` | General analysis, summaries | $ | Fast |
| `google/gemini-2.5-flash-lite` | Classification, simple tasks | $ | Fastest |
| `google/gemini-2.5-pro` | Vision, complex reasoning | $$$ | Medium |
| `openai/gpt-5` | Deep reasoning, complex tasks | $$$$ | Slow |
| `openai/gpt-5-mini` | Code, balanced tasks | $$ | Fast |
| `openai/gpt-5-nano` | High-volume simple tasks | $ | Fastest |

### 2. Direct Provider Access (Optional)

For enterprise deployments requiring direct API access:

| Provider | API Key Secret | Use Case |
|----------|----------------|----------|
| OpenAI | `OPENAI_API_KEY` | Code analysis, complex reasoning |
| Google | `GOOGLE_GEMINI_API_KEY` | Vision, multimodal |
| Anthropic | `ANTHROPIC_API_KEY` | Code review, safety-critical |
| DeepSeek | `DEEPSEEK_API_KEY` | Cost-effective reasoning |

---

## Task Type Routing

```typescript
// Model selection logic in NeuroRouter
const MODEL_ROUTING: Record<string, ModelConfig> = {
  // ============ SPEED TIER (Fast + Cheap) ============
  'session_summary': {
    model: 'google/gemini-2.5-flash',
    maxTokens: 500,
    temperature: 0.7,
  },
  'quick_classification': {
    model: 'google/gemini-2.5-flash-lite',
    maxTokens: 100,
    temperature: 0.3,
  },
  'event_categorization': {
    model: 'google/gemini-2.5-flash-lite',
    maxTokens: 200,
    temperature: 0.3,
  },
  
  // ============ QUALITY TIER (Deep Analysis) ============
  'root_cause_analysis': {
    model: 'google/gemini-2.5-pro',
    maxTokens: 2000,
    temperature: 0.5,
  },
  'journey_causality': {
    model: 'google/gemini-2.5-pro',
    maxTokens: 1500,
    temperature: 0.6,
  },
  'complex_diagnosis': {
    model: 'openai/gpt-5',
    maxTokens: 2000,
    temperature: 0.4,
  },
  
  // ============ VISION TIER ============
  'ui_screenshot_analysis': {
    model: 'google/gemini-2.5-pro',
    maxTokens: 1000,
    temperature: 0.5,
    supportsVision: true,
  },
  'heatmap_interpretation': {
    model: 'google/gemini-2.5-pro',
    maxTokens: 800,
    temperature: 0.5,
    supportsVision: true,
  },
  'component_anomaly': {
    model: 'google/gemini-2.5-pro',
    maxTokens: 1000,
    temperature: 0.4,
    supportsVision: true,
  },
  
  // ============ CODE TIER ============
  'code_fix_suggestion': {
    model: 'openai/gpt-5-mini',
    maxTokens: 1500,
    temperature: 0.3,
  },
  'code_review': {
    model: 'openai/gpt-5-mini',
    maxTokens: 2000,
    temperature: 0.3,
  },
  'technical_recommendation': {
    model: 'openai/gpt-5-mini',
    maxTokens: 1000,
    temperature: 0.4,
  },
};
```

---

## AI Analysis Pipelines

### Session Summary Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                 SESSION SUMMARY PIPELINE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1. FETCH SESSION DATA                                          │
│   ├── Session metadata (device, location, duration)             │
│   ├── Events (first 50-100 events)                              │
│   └── UX issues detected                                         │
│                                                                  │
│   2. PREPROCESS                                                  │
│   ├── Remove PII (email, names masked)                          │
│   ├── Compress event sequences                                   │
│   └── Extract key moments (clicks, errors, rage)                │
│                                                                  │
│   3. AI ANALYSIS (Gemini Flash)                                  │
│   ├── Generate TL;DR (1-2 sentences)                            │
│   ├── Identify user intent                                       │
│   ├── Classify session outcome (success/frustration/abandon)   │
│   └── List key friction points                                   │
│                                                                  │
│   4. STORE RESULTS                                               │
│   ├── Update traceflow_sessions.ai_summary                      │
│   └── Log to neurorouter_logs                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Root Cause Analysis Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│               ROOT CAUSE ANALYSIS PIPELINE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1. IDENTIFY HIGH-FRUSTRATION SESSIONS                          │
│   ├── frustration_score > 70                                     │
│   ├── rage_click_count > 3                                       │
│   └── error_count > 0                                            │
│                                                                  │
│   2. GATHER CONTEXT                                              │
│   ├── Full event timeline                                        │
│   ├── Error stack traces                                         │
│   ├── Network request failures                                   │
│   └── Similar sessions (pattern matching)                        │
│                                                                  │
│   3. AI ANALYSIS (Gemini Pro)                                    │
│   ├── Identify primary root cause                               │
│   ├── List contributing factors                                  │
│   ├── Map to specific component/page                            │
│   └── Suggest remediation steps                                  │
│                                                                  │
│   4. CREATE UX ISSUE                                             │
│   ├── Insert into traceflow_ux_issues                           │
│   ├── Set severity based on impact                              │
│   └── Generate engineering ticket                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Code Fix Suggestion Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│               CODE FIX SUGGESTION PIPELINE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1. EXTRACT ERROR CONTEXT                                       │
│   ├── Error message and stack trace                             │
│   ├── Component/element selector                                 │
│   ├── User action sequence leading to error                     │
│   └── Browser/device context                                     │
│                                                                  │
│   2. PATTERN MATCHING                                            │
│   ├── Match against known issue patterns                        │
│   ├── Check similar resolved issues                             │
│   └── Identify affected component type                          │
│                                                                  │
│   3. AI CODE ANALYSIS (GPT-5 Mini)                               │
│   ├── Diagnose probable code issue                              │
│   ├── Generate fix suggestion (diff format)                     │
│   ├── Provide implementation guidance                           │
│   └── Estimate impact of fix                                     │
│                                                                  │
│   4. OUTPUT                                                      │
│   ├── Code snippet with fix                                     │
│   ├── Confidence score (0-100)                                  │
│   └── Related documentation links                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Prompt Engineering

### Session Summary Prompt

```typescript
const SESSION_SUMMARY_PROMPT = `
You are an expert UX analyst. Analyze this user session and provide insights.

SESSION DATA:
- Device: {{device_type}} ({{browser}} on {{os}})
- Duration: {{duration_seconds}}s
- Pages visited: {{page_count}}
- Frustration score: {{frustration_score}}/100
- Errors encountered: {{error_count}}

KEY EVENTS:
{{events_summary}}

Provide:
1. TL;DR: A one-sentence summary of what the user tried to do and whether they succeeded
2. User Intent: What was the user's primary goal?
3. Outcome: success | partial | frustrated | abandoned
4. Key Friction Points: List 1-3 specific issues the user encountered
5. Recommendation: One actionable suggestion to improve this journey

Format as JSON:
{
  "tldr": "...",
  "intent": "...",
  "outcome": "...",
  "frictionPoints": ["..."],
  "recommendation": "..."
}
`;
```

### Root Cause Prompt

```typescript
const ROOT_CAUSE_PROMPT = `
You are a senior UX engineer investigating a user experience issue.

ISSUE DETECTED:
- Type: {{issue_type}}
- Severity: {{severity}}
- Affected component: {{component_selector}}
- Occurrence count: {{occurrence_count}}

SESSION CONTEXT:
- User was on page: {{page_url}}
- Action taken: {{user_action}}
- Result: {{result}}

ERROR DETAILS (if applicable):
{{error_stack}}

EVENT SEQUENCE LEADING TO ISSUE:
{{event_sequence}}

Analyze and provide:
1. Root Cause: The fundamental reason this issue occurs
2. Technical Details: Specific component/code area causing the problem
3. Impact Assessment: How this affects user experience and business metrics
4. Fix Recommendation: Specific technical solution with code example if applicable
5. Prevention Strategy: How to prevent similar issues in the future

Be specific and actionable. Reference the exact selectors and components involved.
`;
```

---

## Cost Optimization

### Token Budget Management

```typescript
interface TokenBudget {
  task_type: string;
  max_input_tokens: number;
  max_output_tokens: number;
  estimated_cost_per_call: number;
}

const TOKEN_BUDGETS: Record<string, TokenBudget> = {
  session_summary: {
    task_type: 'session_summary',
    max_input_tokens: 2000,
    max_output_tokens: 500,
    estimated_cost_per_call: 0.001, // $0.001
  },
  root_cause_analysis: {
    task_type: 'root_cause_analysis',
    max_input_tokens: 4000,
    max_output_tokens: 2000,
    estimated_cost_per_call: 0.015, // $0.015
  },
  code_fix: {
    task_type: 'code_fix',
    max_input_tokens: 3000,
    max_output_tokens: 1500,
    estimated_cost_per_call: 0.008, // $0.008
  },
};
```

### Cost Tracking

```sql
-- Monthly cost report query
SELECT 
  DATE_TRUNC('day', created_at) as date,
  model_selected,
  COUNT(*) as requests,
  SUM(total_tokens) as total_tokens,
  SUM(cost_estimate) as estimated_cost
FROM neurorouter_logs
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at), model_selected
ORDER BY date DESC, estimated_cost DESC;
```

---

## Rate Limiting

### Per-Model Limits

| Model | Requests/min | Tokens/min |
|-------|--------------|------------|
| gemini-2.5-flash | 60 | 100,000 |
| gemini-2.5-pro | 30 | 50,000 |
| gpt-5-mini | 40 | 80,000 |
| gpt-5 | 20 | 40,000 |

### Error Handling

```typescript
async function callWithRetry(
  model: string, 
  prompt: string, 
  maxRetries = 3
): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(LOVABLE_AI_GATEWAY, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }] }),
      });

      if (response.status === 429) {
        // Rate limited - exponential backoff
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Rate limited. Waiting ${waitTime}ms before retry ${attempt}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      if (response.status === 402) {
        throw new Error('AI credits exhausted. Please upgrade your plan.');
      }

      if (!response.ok) {
        throw new Error(`AI request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';

    } catch (error) {
      if (attempt === maxRetries) throw error;
      console.error(`Attempt ${attempt} failed:`, error);
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## MCP (Model Context Protocol) Integration

TRACEFLOW leverages MCP connectors for enhanced context:

### Connected MCPs

| MCP | Purpose | Data Accessed |
|-----|---------|---------------|
| **Atlassian** | Issue linking | Jira tickets, Confluence docs |

### Future MCP Integrations

| MCP | Purpose |
|-----|---------|
| Linear | Issue tracking integration |
| GitHub | Code context for fixes |
| Notion | Documentation context |
| Slack | Alert notifications |
