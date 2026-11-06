/**
 * ============================================================================
 * Active Brains Technologies - Serverless SLM Agent Studio API
 * ============================================================================
 * Vercel Serverless Function: POST /api/studio
 * 
 * Executes enterprise solution synthesis grounded in Active Brains' actual
 * service and architecture catalog. Supports:
 * 1. SLM Providers: Groq / Cerebras / OpenRouter / Together (Llama 3.2 3B, Phi-3.5 Mini)
 * 2. Google Gemini (1.5 Flash, 2.0 Flash)
 * 3. Autonomous Active Brains Deterministic Engine (Offline / zero-credential fallback)
 * ============================================================================
 */

'use strict';

const { ABAgentStudioEngine, formatCurrency, CURRENCIES } = require('../scripts/ab-agent-studio.js');

// Rate Limiter: max 15 requests per minute per IP to prevent abuse on Vercel
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 15;
const ipRequestHistory = new Map();

function isRateLimited(clientIp) {
  if (!clientIp) return false;
  const now = Date.now();
  const timestamps = ipRequestHistory.get(clientIp) || [];
  const active = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);

  if (active.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestHistory.set(clientIp, active);
    return true;
  }
  active.push(now);
  ipRequestHistory.set(clientIp, active);

  if (ipRequestHistory.size > 2000) {
    for (const [ip, list] of ipRequestHistory.entries()) {
      if (!list.length || now - list[list.length - 1] > RATE_LIMIT_WINDOW_MS) {
        ipRequestHistory.delete(ip);
      }
    }
  }
  return false;
}

const ACTIVE_BRAINS_SYSTEM_PROMPT = `You are an Enterprise Solution Architect working exclusively for Active Brains Technologies.
Your responsibility is to design comprehensive, technically realistic, commercially viable business solutions grounded in Active Brains' actual consulting, enterprise engineering, and AI capabilities.

ACTIVE BRAINS PRACTICE & TECHNOLOGY CATALOG:
- Practices: Centre of Excellence (CoE), Hybrid Systems Integration, Architecture Assurance & Design Review, Managed Application Operations, Continuous Support & AMC, Offshore & Nearshore Delivery, Specialist Capability Planning.
- Core Tech Platforms: Microsoft Fabric, Microsoft Purview, Microsoft Copilot Studio, AWS Bedrock, Google Vertex AI, Dynamics 365 Finance & CRM, Mobile & Web Engineering.

MANDATORY OUTPUT STRUCTURE (Use Markdown headings):
### 1. Executive Overview
- Business problem, proposed solution, business objectives, expected outcomes.

### 2. Solution Architecture
- Architecture topology, Multi-Agent Mesh, data flow, integration and deployment topology (VPC, zero-trust, Kubernetes).

### 3. Functional Modules
- Table with columns: Module | AI Agent Involved | Description | Key Features.

### 4. Technical Architecture
- Frontend, Backend, Database, AI/SLM Models, Cloud Infrastructure, Security & Governance.

### 5. Implementation Roadmap
- 5 Phases with durations, activities, and deliverables:
  * Phase 1 (1-2 Wks): Discovery & Infrastructure Audit
  * Phase 2 (2-3 Wks): Multi-Agent Architecture & Security Design
  * Phase 3 (6-8 Wks): Core Agent Engineering & Systems Integration
  * Phase 4 (2-3 Wks): Pilot Shadowing, Security Pen-Testing & UAT
  * Phase 5 (Ongoing): Production Rollout & Continuous Optimization

### 6. Estimated Cost Breakdown
- Itemized table with Development, AI Engineering, Core Systems Integration, Cloud & Security, UI/UX, and Testing. Provide individual line items and a mathematical total. Default currency is USD unless specified.

### 7. Human Intelligence Required
- Table: Role | Responsibility | Effort (Hours).

### 8. Assumptions, Dependencies & Expected Outcomes
- Assumptions and measurable business ROI.`;

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  // Parse Body safely
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (err) {
    return res.status(400).json({ ok: false, error: 'Invalid JSON body' });
  }

  if (!body || typeof body !== 'object' || !body.prompt) {
    return res.status(400).json({ ok: false, error: 'Missing required field: prompt' });
  }

  const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
  if (isRateLimited(clientIp)) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ ok: false, error: 'Rate limit exceeded. Please wait a minute.' });
  }

  const promptText = String(body.prompt).trim();
  if (promptText.length < 3 || promptText.length > 5000) {
    return res.status(400).json({ ok: false, error: 'Prompt must be between 3 and 5000 characters.' });
  }

  const currency = (body.currency || 'USD').toUpperCase();
  const requestedModel = (body.model || 'ab-slm-agent').toLowerCase();
  const apiKey = (body.apiKey || '').trim();

  // Check for Serverless SLM Provider (Groq / Cerebras / OpenRouter / Gemini env)
  const GROQ_API_KEY = process.env.GROQ_API_KEY || (apiKey.startsWith('gsk_') ? apiKey : null);
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || (apiKey.startsWith('AIza') ? apiKey : null);

  // 1. If Groq SLM is available (Llama 3.2 3B / 1B / Phi)
  if (GROQ_API_KEY && (requestedModel.includes('slm') || requestedModel.includes('llama') || requestedModel.includes('groq'))) {
    try {
      const slmModel = requestedModel.includes('1b') ? 'llama-3.2-1b-preview' : 'llama-3.2-3b-preview';
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: slmModel,
          messages: [
            { role: 'system', content: ACTIVE_BRAINS_SYSTEM_PROMPT },
            { role: 'user', content: `Design an enterprise solution for: ${promptText}\nPreferred Currency: ${currency}` }
          ],
          temperature: 0.3,
          max_tokens: 3000
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || '';
        return res.status(200).json({
          ok: true,
          provider: 'groq-slm',
          model: `Active Brains SLM (${slmModel})`,
          rawOutput: text,
          currency
        });
      }
    } catch (err) {
      console.warn('Groq SLM execution failed, falling back to autonomous synthesizer:', err.message);
    }
  }

  // 2. If Gemini API is available
  if (GEMINI_API_KEY && (requestedModel.includes('gemini') || !GROQ_API_KEY)) {
    try {
      const geminiModel = requestedModel.includes('2.0') ? 'gemini-2.0-flash' : 'gemini-1.5-flash';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${ACTIVE_BRAINS_SYSTEM_PROMPT}\n\nClient Business Requirement:\n${promptText}\nCurrency: ${currency}` }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 3500
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return res.status(200).json({
          ok: true,
          provider: 'gemini',
          model: `Google Gemini (${geminiModel})`,
          rawOutput: text,
          currency
        });
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to autonomous engine:', err.message);
    }
  }

  // 3. Autonomous Active Brains Architecture Engine (Deterministic Grounded SLM Engine)
  try {
    const engine = new ABAgentStudioEngine({ currency });
    const rawSol = await engine.solve(promptText, currency);

    // Format into standard Studio solution structure
    const solution = {
      domain: rawSol.metadata.domain,
      modelName: 'Active Brains SLM Agent (Edge Synthesizer)',
      meta: {
        solutionName: rawSol.metadata.solutionName,
        preparedFor: rawSol.metadata.targetOrganization,
        date: rawSol.metadata.date,
        preparedBy: rawSol.metadata.preparedBy
      },
      responseAi: {
        title: `${rawSol.metadata.solutionName} - Strategic Architecture`,
        sections: [
          {
            title: `1. Active Brains SLM Architecture Overview`,
            body: `<p>${rawSol.executiveSummary}</p>`
          },
          {
            title: `2. Autonomous Multi-Agent Topology`,
            body: `<ul>${rawSol.agents.map(a => `<li><strong>${a.name}:</strong> ${a.role}</li>`).join('')}</ul>`
          }
        ]
      },
      solutionPlan: {
        title: "Business Solution & Delivery Plan",
        executiveSummary: rawSol.executiveSummary,
        scope: rawSol.modules.map(m => ({
          module: m.name,
          agent: m.agent,
          desc: m.desc,
          features: m.features
        })),
        phases: rawSol.phases.map(p => ({
          name: p.name,
          dur: p.duration,
          desc: p.activities,
          deliverables: p.deliverables
        })),
        costItems: rawSol.costs.items.map(c => ({
          comp: c.component,
          cost: c.formattedCost,
          baseCost: c.costUsd,
          desc: c.description
        })),
        totalCost: rawSol.costs.totalUsd,
        humanResources: rawSol.humanIntelligence.map(h => ({
          role: h.role,
          desc: h.responsibility,
          hours: String(h.effortHours)
        }))
      }
    };

    return res.status(200).json({
      ok: true,
      provider: 'active-brains-slm',
      model: 'Active Brains SLM Agent (Edge Synthesizer)',
      solution,
      currency
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: 'Failed to synthesize solution: ' + err.message
    });
  }
};
