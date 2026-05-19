# Groq API Reference

Reference for using Groq in DataLatte agent scripts. Source: console.groq.com/docs

---

## Models

| Model ID | Speed | Context | Max Completion | Status |
|---|---|---|---|---|
| `llama-3.3-70b-versatile` | Fast | 128K | 32,768 | Production |
| `meta-llama/llama-4-scout-17b-16e-instruct` | Fast | 131K | 8,192 | Production |
| `llama-3.1-8b-instant` | Fastest | 128K | 8,000 | Production |
| `openai/gpt-oss-120b` | Fast | 128K | 16,384 | Production |
| `openai/gpt-oss-20b` | Fast | 128K | 16,384 | Production |
| `qwen/qwen3-32b` | Fast | 32K | 16,384 | Production |
| `groq/compound` | Fast | 128K | 8,192 | Production |
| `groq/compound-mini` | Fastest | 128K | 8,192 | Production |
| `llama-3.3-70b-specdec` | Fastest | 8K | 8,192 | Production |
| `llama-3.2-11b-vision-preview` | Fast | 128K | 8,192 | Preview |
| `llama-3.2-90b-vision-preview` | Fast | 128K | 8,192 | Preview |
| `whisper-large-v3` | — | — | — | Audio |
| `distil-whisper-large-v3-en` | — | — | — | Audio |

---

## Rate Limits (Free Plan)

> **Key fact:** Cached tokens do NOT count against rate limits.

| Model | RPM | RPD | TPM | TPD |
|---|---|---|---|---|
| `llama-3.3-70b-versatile` | 30 | 1,000 | 12,000 | 100,000 |
| `meta-llama/llama-4-scout-17b-16e-instruct` | 30 | 1,000 | 30,000 | 500,000 |
| `llama-3.1-8b-instant` | 30 | 14,400 | 6,000 | 500,000 |
| `openai/gpt-oss-120b` | 30 | 1,000 | 8,000 | 200,000 |
| `openai/gpt-oss-20b` | 30 | 1,000 | 8,000 | 200,000 |
| `qwen/qwen3-32b` | 30 | 1,000 | 6,000 | 500,000 |
| `groq/compound` | 20 | 250 | 70,000 | *(not listed)* |
| `groq/compound-mini` | 20 | 250 | 70,000 | *(not listed)* |

**Column definitions:**
- **RPM** = Requests per minute
- **RPD** = Requests per day
- **TPM** = Tokens per minute
- **TPD** = Tokens per day (cumulative daily cap)

### Critical constraints for agent scripts

- `qwen/qwen3-32b` and `llama-3.1-8b-instant` have **6K TPM** — `max_tokens` must stay ≤ 4,000 or single requests will exceed the per-minute quota and always fail.
- `llama-3.3-70b-versatile` has **100K TPD** — at ~3,000 tokens/article that is ~33 articles before daily cap. This model will exhaust first.
- `groq/compound` and `groq/compound-mini` have only **250 RPD** — use as fallback, not primary, or they run out by mid-day.
- `meta-llama/llama-4-scout-17b-16e-instruct` has the best balance: 30K TPM + 500K TPD.

### Rate limit headers

```
x-ratelimit-limit-requests
x-ratelimit-limit-tokens
x-ratelimit-remaining-requests
x-ratelimit-remaining-tokens
x-ratelimit-reset-requests       # e.g. "2s", "1m30s"
x-ratelimit-reset-tokens
retry-after                      # seconds to wait on 429
```

### Model order used in DataLatte agents

```javascript
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',                    // best quality — 12K TPM, 100K TPD
  'meta-llama/llama-4-scout-17b-16e-instruct',  // 30K TPM, 500K TPD — highest throughput
  'openai/gpt-oss-120b',                        // 8K TPM, 200K TPD
  'openai/gpt-oss-20b',                         // 8K TPM, 200K TPD
  'groq/compound',                              // 70K TPM, 250 RPD cap
  'qwen/qwen3-32b',                             // 6K TPM, 500K TPD — max_tokens ≤ 4000
  'llama-3.1-8b-instant',                       // 6K TPM, 500K TPD — max_tokens ≤ 4000
  'groq/compound-mini',                         // 70K TPM, 250 RPD cap
];
```

---

## OpenAI Compatibility

Base URL: `https://api.groq.com/openai/v1`

Groq is drop-in compatible with the OpenAI SDK. Change only the base URL and API key:

```javascript
const OpenAI = require('openai');
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});
```

### Unsupported OpenAI parameters

These parameters are accepted but **ignored** (no error, silently dropped):

| Parameter | Note |
|---|---|
| `logprobs` | Not supported |
| `logit_bias` | Not supported |
| `top_logprobs` | Not supported |
| `messages[].name` | Not supported |
| `n` | Only `n=1` works; other values fail |

### Behavioral differences

- `temperature: 0` is silently converted to `1e-8` (Groq minimum)
- Structured outputs via `response_format: { type: "json_object" }` are supported

---

## Text Generation API

**Endpoint:** `POST https://api.groq.com/openai/v1/chat/completions`

### Request parameters

| Parameter | Type | Description |
|---|---|---|
| `model` | string | Required. Model ID from the models table above |
| `messages` | array | Required. `[{ role: "user"\|"assistant"\|"system", content: "..." }]` |
| `temperature` | float | 0–2, default 1. Controls randomness. 0 → 1e-8 |
| `max_completion_tokens` | int | Max tokens in response (also accepted as `max_tokens`) |
| `top_p` | float | Nucleus sampling, default 1 |
| `stop` | string\|array | Stop sequences |
| `stream` | bool | Enable SSE streaming |
| `response_format` | object | `{ "type": "json_object" }` for structured output |

### Minimal Node.js example (no SDK)

```javascript
const https = require('https');

function callGroq(prompt, maxTokens = 4000) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: maxTokens,
    });
    const req = https.request('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}
```

---

## Tool Use

Supported on: `llama-3.3-70b-versatile`, `qwen/qwen3-32b`, and other production models.

### Tool definition

```javascript
const tools = [{
  type: 'function',
  function: {
    name: 'get_weather',
    description: 'Get current temperature for a location',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string', description: 'City and country' },
      },
      required: ['location'],
    },
  },
}];
```

### Request

```javascript
const response = await client.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
  messages: [{ role: 'user', content: 'What is the weather in Paris?' }],
  tools,
  tool_choice: 'auto',
});
```

### Response when model wants to call a tool

```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "tool_calls": [{
        "id": "call_abc123",
        "type": "function",
        "function": {
          "name": "get_weather",
          "arguments": "{\"location\": \"Paris, France\"}"
        }
      }]
    },
    "finish_reason": "tool_calls"
  }]
}
```

### Parallel tool calls

The model may return multiple `tool_calls` in a single response. Execute all in parallel and return results as separate `tool` role messages.

---

## Error Codes

| HTTP | Meaning | Action |
|---|---|---|
| `200` | Success | — |
| `206` | Partial content (streaming incomplete) | Retry or handle partial |
| `400` | Bad request — malformed JSON or missing field | Fix the request |
| `401` | Invalid or missing API key | Check `GROQ_API_KEY` |
| `403` | Forbidden — access denied | Check account/key permissions |
| `404` | Model not found or wrong endpoint | Check model ID |
| `413` | Request too large | Reduce prompt size |
| `422` | Unprocessable — semantic error in valid JSON | Fix parameter values |
| `424` | Failed dependency — upstream model error | Retry |
| `429` | Rate limited | Wait `retry-after` seconds, then retry |
| `498` | API key revoked | Generate new key at console.groq.com |
| `499` | Request cancelled by client | — |
| `500` | Internal server error | Retry with backoff |
| `502` | Bad gateway | Retry with backoff |
| `503` | Service unavailable | Retry with backoff |

### 429 error codes (inside `error.code`)

| Code | Meaning |
|---|---|
| `rate_limit_exceeded` | TPM or RPM limit hit — short wait (seconds) |
| `tokens_quota_exceeded` | TPD limit hit — wait until midnight UTC |
| `model_decommissioned` | Model removed — switch to another |

### Retry pattern used in DataLatte agents

```javascript
for (const model of GROQ_MODELS) {
  const res = await callGroq(model, body);
  if (res.status === 200) return res.data.choices[0].message.content;
  const code = res.data?.error?.code;
  // continue to next model on rate limit or decommission
  if (res.status === 429 || code === 'rate_limit_exceeded' || code === 'model_decommissioned') continue;
  throw new Error(`Groq error ${res.status}`);
}
throw new Error('All Groq models unavailable');
```

---

## Token Tracking Pattern

All DataLatte agent scripts track Groq tokens to stdout so GitHub Actions logs capture them:

```javascript
let _groqTokens = 0;

// In the success path of callGroq:
_groqTokens += res.data?.usage?.total_tokens ?? 0;

// At the end of main():
run().then(() => {
  console.log(`GROQ_TOKENS: ${_groqTokens}`);
}).catch(async (e) => {
  console.log(`GROQ_TOKENS: ${_groqTokens}`);
  // ...
});
```

The admin API (`/api/admin/agents`) parses `GROQ_TOKENS:` from job logs and surfaces it in the admin token budget panel.
