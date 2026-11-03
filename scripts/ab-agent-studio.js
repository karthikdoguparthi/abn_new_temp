#!/usr/bin/env node

/**
 * ============================================================================
 * Active Brains Technologies - AB Agent Studio (Agentic Core Engine)
 * ============================================================================
 * 
 * An autonomous, multi-agent AI engine that synthesizes end-to-end enterprise
 * solutions, multi-agent architectures, phased delivery schedules, effort
 * estimations, and cost breakdowns from business requirements.
 * 
 * Runs in both:
 * 1. CLI Mode: Interactive terminal prompt or single-command analysis.
 * 2. Module / API Mode: Can be imported or wired directly to endpoints/spaces.
 * 
 * Supports:
 * - Live Google Gemini API (via GEMINI_API_KEY environment variable or argument)
 * - Offline / Autonomous Active Brains Architecture Mesh Synthesizer
 * 
 * Usage:
 *   node scripts/ab-agent-studio.js "Design a customer service solution for Capital Pooling & Asset Management"
 *   node scripts/ab-agent-studio.js --interactive
 *   node scripts/ab-agent-studio.js --currency=GBP "Real estate tenant onboarding agent mesh"
 *   node scripts/ab-agent-studio.js --json "Healthcare clinical triage"
 * ============================================================================
 */

'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ============================================================================
// Currencies & Conversion Configuration
// ============================================================================
const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, name: 'US Dollar' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.78, name: 'British Pound' },
  INR: { code: 'INR', symbol: '₹', rate: 84.0, name: 'Indian Rupee' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
  AUD: { code: 'AUD', symbol: 'A$', rate: 1.52, name: 'Australian Dollar' },
  AED: { code: 'AED', symbol: 'AED ', rate: 3.67, name: 'UAE Dirham' }
};

function formatCurrency(baseUsd, currencyCode = 'USD') {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = Math.round(baseUsd * curr.rate);
  return `${curr.symbol}${converted.toLocaleString()}`;
}

// ============================================================================
// Safe HTML & String Extraction Utilities
// ============================================================================
function stripHtml(input) {
  if (!input) return '';
  let str = String(input);
  let prev;
  do {
    prev = str;
    str = str.replace(/<[^>]*>/g, '');
  } while (str !== prev);
  return str.trim();
}

function deriveTopic(promptText) {
  if (!promptText || !promptText.trim()) return 'Enterprise AI';
  let clean = promptText.trim()
    .replace(/^(?:please\s+)?(?:design|build|create|develop|generate|architect)\s+(?:an?\s+)?(?:ai\s+|customer\s+service\s+|enterprise\s+)?(?:solution|system|platform|agent\s+mesh)?\s*(?:for|to)?\s*/i, '')
    .replace(/^(?:an?\s+)?(?:ai\s+|customer\s+service\s+|enterprise\s+)?(?:solution|system|platform)\s+for\s+/i, '')
    .replace(/\s*(?:agent\s+mesh|solution|platform|system|mesh)\s*$/i, '')
    .replace(/[.!?:;]+$/, '')
    .trim();

  // Capitalize words
  return clean.replace(/\b\w/g, c => c.toUpperCase()) || 'Tailored Enterprise AI';
}

function parseCostString(costStr) {
  if (!costStr) return 0;
  // Match range numbers (e.g. $22,000–$32,000 or $26,000)
  const numbers = costStr.match(/\$?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?|\d+(?:\.\d+)?)/g);
  let numVal = 0;
  if (numbers && numbers.length > 0) {
    const cleanNums = numbers.map(n => Number(n.replace(/[^0-9.]/g, ''))).filter(n => !isNaN(n) && n > 0);
    if (cleanNums.length >= 2) {
      numVal = Math.round((cleanNums[0] + cleanNums[1]) / 2);
    } else if (cleanNums.length === 1) {
      numVal = cleanNums[0];
    }
  }
  // Sanity check
  if (numVal > 150000) numVal = 32000;
  return numVal;
}

// ============================================================================
// Multi-Agent Architecture Engine (Autonomous Offline Synthesizer)
// ============================================================================
class ABAgentStudioEngine {
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.GEMINI_API_KEY || '';
    this.currency = options.currency || 'USD';
    this.model = options.model || 'gemini-1.5-flash';
  }

  /**
   * Main agent entrypoint: evaluates prompt and delegates to Live LLM or Autonomous Mesh.
   */
  async solve(promptText, overrideCurrency = null) {
    const currency = overrideCurrency || this.currency;
    const cleanPrompt = (promptText || '').trim();

    if (!cleanPrompt) {
      throw new Error('Please provide a business scenario or problem statement.');
    }

    if (this.apiKey) {
      try {
        return await this.solveWithLiveGemini(cleanPrompt, currency);
      } catch (err) {
        // Fallback gracefully to offline autonomous engine
        return this.solveAutonomous(cleanPrompt, currency, `(Fallback from live API: ${err.message})`);
      }
    }

    return this.solveAutonomous(cleanPrompt, currency);
  }

  /**
   * Live Gemini Multi-Agent Synthesis
   */
  async solveWithLiveGemini(prompt, currency) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const systemInstruction = "You are the Senior Enterprise Solution Architect at Active Brains Technologies. Produce a clean, comprehensive, production-grade business architecture proposal formatted in structured HTML (h3, p, ul, ol, li). Never output raw markdown code fences, chain-of-thought, or scratchpads. Ensure all mandatory sections (Executive Overview, Solution Architecture, Autonomous Agent Mesh, Security & Governance, Implementation Roadmap, Cost Breakdown, Human Resources, Assumptions, and Outcomes) are included with granular technical detail.";

    const promptPayload = `Client Business Requirement: "${prompt}".

Synthesize an exhaustive, client-ready enterprise solution in clean HTML following this exact architecture:

<h3>1. Executive Overview</h3>
<p>[Detailed statement of client problem, operational bottlenecks, business objectives, and strategic benefits.]</p>
<p>[Target transformation metrics and verifiable outcomes tailored directly to this domain.]</p>

<h3>2. Solution Architecture</h3>
<p>[Comprehensive end-to-end architecture detailing event-driven data flow, multi-agent orchestration mesh, zero-trust perimeter, and microservices boundary.]</p>
<ul>
  <li><strong>Multi-Agent Orchestration Mesh:</strong> [Autonomous coordinator managing intent, dynamic task decomposition, and inter-agent communication protocols]</li>
  <li><strong>RAG & Semantic Retrieval:</strong> [Vector database topology, real-time embeddings, hybrid BM25/vector search, and context filtering]</li>
  <li><strong>VPC & Cloud Topology:</strong> [Zero-trust containerized microservices running on isolated multi-zone Kubernetes/OpenShift with HSM key management]</li>
</ul>

<h3>3. Autonomous Multi-Agent Mesh</h3>
<ul>
  <li><strong>[Domain-Specific Agent 1]:</strong> [Role, autonomous decision tooling, and integration hooks]</li>
  <li><strong>[Domain-Specific Agent 2]:</strong> [Role, autonomous decision tooling, and integration hooks]</li>
  <li><strong>[Domain-Specific Agent 3]:</strong> [Role, autonomous decision tooling, and integration hooks]</li>
</ul>

<h3>4. Technical Integrations, Security & Governance</h3>
<p>[Deep integration with client APIs, SWIFT/FIX/FHIR/ERP protocols, automated audit telemetry, and regulatory standards (GDPR, SOC 2 Type II, ISO 27001).] </p>
<ul>
  <li><strong>Data Encryption & Privacy:</strong> [AES-256 at rest, TLS 1.3 in transit, and client-managed HSM envelope keys]</li>
  <li><strong>Human-in-the-Loop Safeguards:</strong> [Configurable approval gates for high-value or edge-case transactions]</li>
  <li><strong>Audit Trails:</strong> [Cryptographically immutable transaction logs and explainable decision trees]</li>
</ul>

<h3>5. Phased Implementation Roadmap</h3>
<ol>
  <li><strong>Phase 1 (1-2 Weeks) - Discovery & Systems Audit:</strong> Complete technical baseline, security audit, and API schema mapping. Deliverable: Architecture Blueprint.</li>
  <li><strong>Phase 2 (2-3 Weeks) - Architecture & Mesh Topology Design:</strong> Containerized VPC setup, vector RAG indexing, and agent prompt guardrails. Deliverable: Prototype Sandbox.</li>
  <li><strong>Phase 3 (6-8 Weeks) - Core Agent Engineering & Integration:</strong> Autonomous agent mesh implementation and core transactional ERP connectors. Deliverable: Staging Integration.</li>
  <li><strong>Phase 4 (2-3 Weeks) - Pilot Shadowing, Pen-testing & UAT:</strong> Model hallucination testing, security penetration tests, and operational shadowing. Deliverable: Production Sign-off.</li>
  <li><strong>Phase 5 (Ongoing) - Enterprise Rollout & Continuous Optimization:</strong> Enterprise SLA monitoring, 24/7 telemetry, and periodic model fine-tuning. Deliverable: Live Operations.</li>
</ol>

<h3>6. Tailored Cost Breakdown</h3>
<p>Estimated investment for full enterprise delivery (single estimated USD per line):</p>
<ul>
  <li><strong>[Custom Component 1] ($26,000):</strong> [Client-specific description referencing their agents]</li>
  <li><strong>[Custom Component 2] ($15,000):</strong> [Integration with client-specific enterprise tools/APIs]</li>
  <li><strong>[Custom Component 3] ($9,000):</strong> [Dedicated cloud infrastructure/VPC]</li>
  <li><strong>[Custom Component 4] ($6,500):</strong> [Custom operator portal & UX interfaces]</li>
  <li><strong>[Custom Component 5] ($5,000):</strong> [Security, QA & regulatory compliance verification]</li>
  <li><strong>[Custom Component 6] ($5,000):</strong> [Project management & handover governance]</li>
</ul>

<h3>7. Human Intelligence Allocation</h3>
<ul>
  <li><strong>Project Manager:</strong> [Specific responsibilities for this client domain] (80 hours)</li>
  <li><strong>[Domain Specialist Solutions Architect]:</strong> [Domain-specific architecture and acceptance mapping] (75 hours)</li>
  <li><strong>AI/ML Engineer:</strong> [Model fine-tuning, RAG pipelines, and agent guardrails] (130 hours)</li>
  <li><strong>Backend Integration Engineer:</strong> [Client database connectors and event pipelines] (155 hours)</li>
  <li><strong>Frontend UX Engineer:</strong> [Custom operator workbench & customer touchpoints] (85 hours)</li>
  <li><strong>QA & Compliance Specialist:</strong> [Domain regulatory audits, pen-testing & QA] (80 hours)</li>
  <li><strong>Support & DevOps Engineer:</strong> [Cloud deployment, monitoring & telemetry] (40 hours)</li>
</ul>

<h3>8. Assumptions & Dependencies</h3>
<ul>
  <li>Client will provide secure API credentials and sandbox environments for testing.</li>
  <li>Third-party core system APIs support webhook notifications or streaming event triggers.</li>
  <li>Subject matter experts will participate in bi-weekly design review and UAT shadowing sessions.</li>
</ul>

<h3>9. Expected Business Outcomes</h3>
<ul>
  <li>Target 65%+ reduction in manual operational and customer service overhead.</li>
  <li>Sub-second query resolution and autonomous processing for standard business requests.</li>
  <li>Complete verifiable audit compliance and zero data leakage across autonomous agents.</li>
</ul>`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ parts: [{ text: promptPayload }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 2500 }
      })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    const rawHtml = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return this.parseHtmlToSolution(rawHtml, prompt, currency, this.model);
  }

  /**
   * Autonomous Active Brains Architecture Mesh (Offline Synthesizer)
   */
  solveAutonomous(promptText, currency = 'USD', fallbackNote = '') {
    const topic = deriveTopic(promptText);
    const t = promptText.toLowerCase();

    let domainName = topic;
    let targetOrg = `${topic} Enterprise`;
    let agents = [];
    let modules = [];
    let costMultiplier = 1.0;

    if (t.includes('capital pooling') || t.includes('asset management') || t.includes('treasury') || t.includes('fund')) {
      domainName = "Capital Pooling & Asset Management";
      targetOrg = "Asset Management & Treasury Enterprise";
      costMultiplier = 1.35;
      agents = [
        { name: "Liquidity Optimization Agent", role: "Real-time cash sweep execution, intercompany pooling, and yield optimization algorithms.", tools: "FIX/SWIFT gateways, multi-currency ledger APIs" },
        { name: "Asset Allocation & Portfolio Agent", role: "Autonomous risk-weighted rebalancing, valuation simulations, and yield modeling.", tools: "Custodial databases, PMS feeds, risk matrices" },
        { name: "Compliance & Regulatory Sentinel", role: "Continuous KYC/AML screening, capital adequacy audits, and Basel III reporting.", tools: "Sanctions databases, immutable compliance ledgers" }
      ];
      modules = [
        { name: "Liquidity Optimization", desc: "Automated sweeps, pooling, and multi-currency liquidity balancing" },
        { name: "Portfolio Asset Management", desc: "Real-time fund valuation, rebalancing triggers, and yield analytics" },
        { name: "Regulatory Compliance", desc: "Autonomous sanctions checking, KYC/AML screening, and audit logs" }
      ];
    } else if (t.includes('real estate') || t.includes('property') || t.includes('tenant') || t.includes('mls') || t.includes('broker')) {
      domainName = "Real Estate & Property Management";
      targetOrg = "Enterprise Real Estate Brokerage";
      costMultiplier = 1.1;
      agents = [
        { name: "Listing & MLS Query Agent", role: "Natural language search across MLS/IDX boards with multi-criteria filtering.", tools: "RESO Web API, vector embeddings of listings" },
        { name: "Viewing & Escrow Coordinator", role: "Autonomous tour scheduling, lockbox credential dispatch, and buyer follow-ups.", tools: "Calendly/Google Calendar APIs, SMS gateways" },
        { name: "Transaction & Lease Agent", role: "Automated lease drafting, disclosure checklist validation, and e-signatures.", tools: "DocuSign/HelloSign APIs, document parsing" }
      ];
      modules = [
        { name: "Property Discovery", desc: "Semantic listing lookup and automated buyer matching" },
        { name: "Tour Coordination", desc: "Automated scheduling, calendar sync, and identity verification" },
        { name: "Digital Closing", desc: "Automated document generation and compliance audit trails" }
      ];
    } else if (t.includes('insurance') || t.includes('claim') || t.includes('policy')) {
      domainName = "Insurance & Claims Management";
      targetOrg = "Insurance Enterprise Client";
      costMultiplier = 1.2;
      agents = [
        { name: "FNOL Intake & Triage Agent", role: "Omnichannel claims ingestion, photo damage classification, and fraud pre-scoring.", tools: "Computer vision APIs, Guidewire ClaimCenter" },
        { name: "Policy Verification Agent", role: "Instantaneous coverage entitlement checks, deductible validation, and limits review.", tools: "Core policy databases, Duck Creek connectors" },
        { name: "Adjuster Copilot Agent", role: "Repair estimate drafting, subrogation recommendations, and settlement checks.", tools: "Parts pricing databases, claims rules engine" }
      ];
      modules = [
        { name: "FNOL Ingestion", desc: "Multimodal damage reporting, OCR, and automated triage" },
        { name: "Coverage Adjudication", desc: "Sub-second policy validation and entitlement verification" },
        { name: "Settlement Orchestration", desc: "Straight-through payout routing and adjuster workflows" }
      ];
    } else {
      domainName = `${topic} Operations`;
      targetOrg = `${topic} Enterprise`;
      agents = [
        { name: `${topic} Orchestrator Agent`, role: "Primary business intent classification, priority scheduling, and straight-through routing.", tools: "Core enterprise APIs, task queue" },
        { name: `${topic} Analytical Agent`, role: "Contextual document processing, anomaly detection, and decision support.", tools: "Vector RAG database, semantic models" },
        { name: `${topic} Compliance & Audit Agent`, role: "Policy enforcement, immutable execution logging, and SLA verification.", tools: "Audit telemetry, security event bus" }
      ];
      modules = [
        { name: `${topic} Core Process`, desc: "Automated intake, routing, and cognitive orchestration" },
        { name: "Intelligence & Analytics", desc: "Real-time decision validation and knowledge retrieval" },
        { name: "Governance & Security", desc: "Role-based controls, audit trails, and compliance reporting" }
      ];
    }

    const baseCostItems = [
      { comp: "Autonomous Multi-Agent Mesh Core", desc: `Development of 3 specialized ${domainName} AI agents`, baseCost: Math.round(26000 * costMultiplier) },
      { comp: "Enterprise Systems & API Integration", desc: "Connectors to core databases, ERP/CRM, and external services", baseCost: Math.round(15000 * costMultiplier) },
      { comp: "Cloud Infrastructure & Private VPC", desc: "Zero-trust containerized environment, HSM encryption & monitoring", baseCost: Math.round(9000 * costMultiplier) },
      { comp: "Operator Workbench & Portal UX", desc: "Human-in-the-loop oversight console and administrative dashboard", baseCost: Math.round(6500 * costMultiplier) },
      { comp: "Security, QA & Regulatory Auditing", desc: "Penetration testing, compliance verification (SOC 2, GDPR, ISO)", baseCost: Math.round(5000 * costMultiplier) },
      { comp: "Project Management & Enablement", desc: "Agile delivery governance, documentation, and operational handover", baseCost: Math.round(5000 * costMultiplier) }
    ];

    const totalCostUsd = baseCostItems.reduce((acc, c) => acc + c.baseCost, 0);

    const phases = [
      { num: "Phase 1", title: "Discovery & System Architecture Audit", duration: "1-2 Weeks", deliverables: "Technical baseline, schema mappings, security criteria" },
      { num: "Phase 2", title: "Agent Mesh Topology & Security Design", duration: "2-3 Weeks", deliverables: "VPC setup, agent persona specifications, API contracts" },
      { num: "Phase 3", title: "Core Engineering & Backend Integration", duration: "6-8 Weeks", deliverables: "Autonomous agent mesh, RAG index, enterprise connectors" },
      { num: "Phase 4", title: "Shadowing, Penetration Testing & UAT", duration: "2-3 Weeks", deliverables: "Pilot validation, human-in-the-loop calibration, sign-off" },
      { num: "Phase 5", title: "Enterprise Rollout & Continuous Telemetry", duration: "Ongoing", deliverables: "24/7 SLA governance, performance tuning, model updates" }
    ];

    const humanIntelligence = [
      { role: "Project Manager", resp: "Sprint management, risk mitigation, and enterprise milestone reporting", effort: 80 },
      { role: `${topic} Solutions Architect`, resp: "Topology governance, system boundaries, and enterprise integration", effort: 75 },
      { role: "AI/ML Engineer", resp: "Model prompt engineering, agent orchestration, and guardrail validation", effort: 130 },
      { role: "Backend Developer", resp: "System connectors, database pipelines, and webhook APIs", effort: 155 },
      { role: "Frontend UX Developer", resp: "Operator dashboard, approval workbench, and user interfaces", effort: 85 },
      { role: "QA & Compliance Engineer", resp: "Penetration testing, regulatory audits, and quality assurance", effort: 80 },
      { role: "Support & DevOps Lead", resp: "Cloud provisioning, CI/CD pipelines, and telemetry monitoring", effort: 40 }
    ];

    return {
      metadata: {
        solutionName: `${topic} AI Solution`,
        domain: domainName,
        targetOrg: targetOrg,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        engine: fallbackNote ? `AB Autonomous Engine ${fallbackNote}` : "Active Brains Autonomous Agent Studio",
        currency: currency
      },
      executiveSummary: `Tailored specifically for ${targetOrg}, this enterprise solution establishes an Active Brains autonomous multi-agent mesh for ${topic.toLowerCase()}. Engineered for resilient enterprise operations, the platform combines real-time system integration, explainable decision guardrails, and cryptographic auditability to deliver measurable operational acceleration while strictly maintaining regulatory compliance.`,
      agents: agents,
      modules: modules,
      phases: phases,
      costs: {
        currency: currency,
        items: baseCostItems.map(item => ({
          component: item.comp,
          description: item.desc,
          costUsd: item.baseCost,
          formattedCost: formatCurrency(item.baseCost, currency)
        })),
        totalUsd: totalCostUsd,
        formattedTotal: formatCurrency(totalCostUsd, currency)
      },
      humanIntelligence: humanIntelligence
    };
  }

  /**
   * Parses live HTML output from LLM into structured Solution object
   */
  parseHtmlToSolution(html, promptText, currency, modelName) {
    const topic = deriveTopic(promptText);

    // 1. Executive Summary
    let execSummary = '';
    const execMatch = html.match(/<h3>1\.\s*Executive Overview[^<]*<\/h3>([\s\S]*?)(?:<h3>|$)/i);
    if (execMatch) {
      const pMatches = execMatch[1].match(/<p>([\s\S]*?)<\/p>/gi);
      if (pMatches) execSummary = pMatches.map(p => stripHtml(p)).join(' ');
    }
    if (!execSummary) {
      const allP = html.match(/<p>([\s\S]*?)<\/p>/gi);
      if (allP) execSummary = allP.slice(0, 2).map(p => stripHtml(p)).join(' ');
    }

    // 2. Agents
    let agents = [];
    const sec2Match = html.match(/<h3>2\.\s*Autonomous Multi-Agent Mesh[^<]*<\/h3>([\s\S]*?)(?:<h3>|$)/i);
    const agentScopeHtml = sec2Match ? sec2Match[1] : html;
    const agentRegex = /<li>\s*<strong>([^<:]+):?<\/strong>\s*:?\s*([^<]+)<\/li>/gi;
    let match;
    while ((match = agentRegex.exec(agentScopeHtml)) !== null) {
      const aName = match[1].trim();
      const aDesc = stripHtml(match[2]);
      if (aName && aDesc && !aName.startsWith('Phase') && !aName.includes('$') && !aName.includes('Project Manager')) {
        agents.push({ name: aName, role: aDesc });
      }
    }

    // 3. Costs
    const sec5Match = html.match(/<h3>5\.\s*Tailored Cost Breakdown[^<]*<\/h3>([\s\S]*?)(?:<h3>|$)/i);
    const costHtml = sec5Match ? sec5Match[1] : html;
    const costRegex = /<li>\s*<strong>([^<($]+)\s*\(([^)]+)\)\s*:?<\/strong>\s*:?\s*([^<]+)<\/li>/gi;
    let cMatch;
    const costItems = [];
    let totalUsd = 0;
    while ((cMatch = costRegex.exec(costHtml)) !== null) {
      const comp = stripHtml(cMatch[1]);
      const costStr = cMatch[2].trim();
      const desc = stripHtml(cMatch[3]);
      const numVal = parseCostString(costStr);
      if (comp && numVal > 0) {
        costItems.push({
          component: comp,
          description: desc,
          costUsd: numVal,
          formattedCost: formatCurrency(numVal, currency)
        });
        totalUsd += numVal;
      }
    }

    // If costs couldn't be parsed, fallback to default sensible items
    if (costItems.length === 0) {
      const fallback = this.solveAutonomous(promptText, currency);
      return fallback;
    }

    // 4. Phases
    const phases = [];
    const sec4Match = html.match(/<h3>4\.\s*Phased Delivery Approach[^<]*<\/h3>([\s\S]*?)(?:<h3>|$)/i);
    const phaseHtml = sec4Match ? sec4Match[1] : html;
    const phaseRegex = /<li>\s*<strong>Phase\s*(\d+)\s*\(([^)]+)\)\s*[-:]?\s*([^:<]+):?<\/strong>\s*:?\s*([^<]+)<\/li>/gi;
    let pMatch;
    while ((pMatch = phaseRegex.exec(phaseHtml)) !== null) {
      phases.push({
        num: `Phase ${pMatch[1]}`,
        duration: pMatch[2].trim(),
        title: stripHtml(pMatch[3]),
        deliverables: stripHtml(pMatch[4])
      });
    }

    // 5. Human Intelligence
    const humanIntelligence = [];
    const sec6Match = html.match(/<h3>6\.\s*Human Intelligence Allocation[^<]*<\/h3>([\s\S]*?)(?:<h3>|$)/i);
    const humanHtml = sec6Match ? sec6Match[1] : html;
    const humanRegex = /<li>\s*<strong>([^<:]+):?<\/strong>\s*:?\s*([^<]+)<\/li>/gi;
    let hMatch;
    while ((hMatch = humanRegex.exec(humanHtml)) !== null) {
      const role = stripHtml(hMatch[1]);
      const fullText = stripHtml(hMatch[2]);
      const hoursMatch = fullText.match(/\(?(\d+)\s*hours?\.?\)?/i);
      const effort = hoursMatch ? Number(hoursMatch[1]) : 80;
      const cleanResp = fullText.replace(/\(?\d+\s*hours?\.?\)?/i, '').trim().replace(/[.,]$/, '');
      humanIntelligence.push({ role, resp: cleanResp || fullText, effort });
    }

    return {
      metadata: {
        solutionName: `${topic} AI Solution`,
        domain: topic,
        targetOrg: `${topic} Enterprise`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        engine: `Google Gemini (${modelName}) via Active Brains Engine`,
        currency: currency
      },
      executiveSummary: execSummary,
      agents: agents,
      phases: phases.length > 0 ? phases : [
        { num: "Phase 1", title: "Discovery & System Audit", duration: "1-2 Weeks", deliverables: "Technical discovery and requirements sign-off" },
        { num: "Phase 2", title: "Architecture & Mesh Topology", duration: "2-3 Weeks", deliverables: "Security, RAG pipelines, API designs" },
        { num: "Phase 3", title: "Agent Engineering & Integration", duration: "6-8 Weeks", deliverables: "Core agents & backend connectivity" },
        { num: "Phase 4", title: "Pilot Shadowing & Validation", duration: "2-3 Weeks", deliverables: "QA, penetration testing, user acceptance" },
        { num: "Phase 5", title: "Production Rollout", duration: "Ongoing", deliverables: "24/7 SLA governance & performance tuning" }
      ],
      costs: {
        currency: currency,
        items: costItems,
        totalUsd: totalUsd,
        formattedTotal: formatCurrency(totalUsd, currency)
      },
      humanIntelligence: humanIntelligence.length > 0 ? humanIntelligence : [
        { role: "Project Manager", resp: "Sprint planning and agile management", effort: 80 },
        { role: `${topic} Solutions Architect`, resp: "Architecture and enterprise system integration", effort: 75 },
        { role: "AI/ML Engineer", resp: "Agent fine-tuning and guardrail tuning", effort: 130 },
        { role: "Backend Developer", resp: "API pipelines and database connectors", effort: 155 },
        { role: "Frontend UX Developer", resp: "Operator workbench UI", effort: 80 },
        { role: "QA Engineer", resp: "Compliance audits and pen-testing", effort: 80 },
        { role: "Support Engineer", resp: "Cloud provisioning and monitoring", effort: 40 }
      ]
    };
  }
}

// ============================================================================
// CLI Presentation Formatter
// ============================================================================
function printSolutionTerminal(sol) {
  const line = '═'.repeat(74);
  const thin = '─'.repeat(74);

  console.log(`\n${line}`);
  console.log(`  ACTIVE BRAINS AGENT STUDIO - ENTERPRISE SOLUTION OUTPUT`);
  console.log(`${line}`);
  console.log(`  Solution Name : ${sol.metadata.solutionName}`);
  console.log(`  Domain        : ${sol.metadata.domain}`);
  console.log(`  Client Target : ${sol.metadata.targetOrg}`);
  console.log(`  Date          : ${sol.metadata.date}`);
  console.log(`  Engine        : ${sol.metadata.engine}`);
  console.log(`  Currency      : ${sol.metadata.currency}`);
  console.log(`${thin}`);
  console.log(`\n1. EXECUTIVE SUMMARY`);
  console.log(`   ${sol.executiveSummary.replace(/\n+/g, '\n   ')}\n`);

  console.log(`2. AUTONOMOUS MULTI-AGENT MESH (${sol.agents.length} Agents)`);
  sol.agents.forEach((ag, idx) => {
    console.log(`   [${idx + 1}] ${ag.name}`);
    console.log(`       Role: ${ag.role}`);
    if (ag.tools) console.log(`       Tools/Integrations: ${ag.tools}`);
  });
  console.log('');

  console.log(`3. PHASED DELIVERY APPROACH`);
  sol.phases.forEach(p => {
    console.log(`   • ${p.num} (${p.duration}): ${p.title}`);
    if (p.deliverables) console.log(`     -> ${p.deliverables}`);
  });
  console.log('');

  console.log(`4. ESTIMATED COST BREAKDOWN (${sol.costs.currency})`);
  sol.costs.items.forEach(c => {
    const pad = ' '.repeat(Math.max(2, 50 - c.component.length));
    console.log(`   • ${c.component}${pad}${c.formattedCost}`);
    console.log(`     ${c.description}`);
  });
  console.log(`${thin}`);
  console.log(`   TOTAL ESTIMATED INVESTMENT : ${sol.costs.formattedTotal}`);
  console.log(`${thin}\n`);

  console.log(`5. HUMAN INTELLIGENCE ALLOCATION`);
  sol.humanIntelligence.forEach(h => {
    const pad = ' '.repeat(Math.max(2, 38 - h.role.length));
    console.log(`   • ${h.role}${pad}${h.effort} hrs  (${h.resp})`);
  });
  console.log(`\n${line}\n`);
}

// ============================================================================
// CLI Execution Handler
// ============================================================================
async function runCli() {
  const args = process.argv.slice(2);

  let currency = 'USD';
  let isJson = false;
  let isInteractive = false;
  let promptParts = [];

  for (const arg of args) {
    if (arg.startsWith('--currency=')) {
      currency = arg.split('=')[1].toUpperCase();
    } else if (arg === '--json') {
      isJson = true;
    } else if (arg === '--interactive' || arg === '-i') {
      isInteractive = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Active Brains Technologies - AB Agent Studio Agentic CLI

Usage:
  node scripts/ab-agent-studio.js "<prompt>" [options]

Options:
  --currency=USD|GBP|INR|EUR|AUD|AED   Specify output currency (Default: USD)
  --json                              Output raw structured JSON
  --interactive, -i                   Interactive prompt prompt session
  --help, -h                          Show this help guide

Examples:
  node scripts/ab-agent-studio.js "Design a customer service solution for Capital Pooling & Asset Management"
  node scripts/ab-agent-studio.js --currency=GBP "Real estate brokerage listing and viewing agent mesh"
  node scripts/ab-agent-studio.js --json "Healthcare clinical triage"
      `);
      return;
    } else {
      promptParts.push(arg);
    }
  }

  const engine = new ABAgentStudioEngine({ currency });

  if (isInteractive || promptParts.length === 0) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('\n✦ Welcome to Active Brains AB Agent Studio');
    console.log('Enter your business requirement (or type "exit" to quit):\n');

    const askPrompt = () => {
      rl.question('Business Scenario > ', async (input) => {
        const clean = (input || '').trim();
        if (clean.toLowerCase() === 'exit' || clean.toLowerCase() === 'quit') {
          rl.close();
          return;
        }
        if (!clean) {
          askPrompt();
          return;
        }

        try {
          console.log('\n⏳ Synthesizing autonomous agent solution...\n');
          const sol = await engine.solve(clean, currency);
          if (isJson) {
            console.log(JSON.stringify(sol, null, 2));
          } else {
            printSolutionTerminal(sol);
          }
        } catch (err) {
          console.error('Error generating solution:', err.message);
        }

        askPrompt();
      });
    };

    askPrompt();
  } else {
    const promptText = promptParts.join(' ');
    try {
      const sol = await engine.solve(promptText, currency);
      if (isJson) {
        console.log(JSON.stringify(sol, null, 2));
      } else {
        printSolutionTerminal(sol);
      }
    } catch (err) {
      console.error('Error:', err.message);
      process.exit(1);
    }
  }
}

// Module export for programmatic use in APIs, endpoints, or space integrations
module.exports = {
  ABAgentStudioEngine,
  CURRENCIES,
  formatCurrency,
  deriveTopic
};

// Direct script execution
if (require.main === module) {
  runCli();
}
