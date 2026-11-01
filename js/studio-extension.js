/**
 * AB AGENT STUDIO - Integrated Extension Script
 * Drives the embedded Studio on launchpad.html
 */

(function () {
  'use strict';

  const SAMPLE_SOLUTIONS = {
    ecommerce: {
      prompt: "We are an e-commerce company looking for an IT solution that includes AI agents for customer support, order management, and inventory management. Provide a complete solution with delivery approach, cost breakdown, and human intelligence required.",
      modelName: "Claude 3.5 Sonnet",
      meta: {
        solutionName: "E-commerce AI Agent Solution",
        preparedFor: "Client Business",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        preparedBy: "AB Agent Studio"
      },
      responseAi: {
        title: "Comprehensive IT Solution for E-commerce Business",
        sections: [
          {
            title: "1. Solution Overview",
            body: "We propose an AI-powered, scalable solution for your e-commerce business that leverages intelligent agents for customer support, order management, and inventory management. This solution will enhance operational efficiency, improve customer experience, and drive business growth."
          },
          {
            title: "2. Key Components",
            body: `<ul>
              <li><strong>AI Agents:</strong> Customer Support, Order Management, Inventory Management</li>
              <li><strong>Technology Stack:</strong> Cloud-based, Microservices, AI/ML, Data Analytics</li>
              <li><strong>Integration:</strong> Seamless integration with existing systems and third-party services</li>
              <li><strong>Scalability:</strong> Designed to grow with your business</li>
            </ul>`
          },
          {
            title: "3. AI Agents Details",
            body: `<p><strong>Customer Support Agent</strong></p>
            <ul>
              <li>24/7 customer support</li>
              <li>FAQs, order tracking, returns & refunds</li>
              <li>Multi-language support</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Order Management Agent</strong></p>
            <ul>
              <li>Automated order processing</li>
              <li>Order tracking & notifications</li>
              <li>Exception handling</li>
            </ul>
            <p style="margin-top: 8px;"><strong>Inventory Management Agent</strong></p>
            <ul>
              <li>Real-time inventory tracking</li>
              <li>Demand forecasting</li>
              <li>Low stock alerts & replenishment</li>
            </ul>`
          }
        ]
      },
      solutionPlan: {
        title: "Business Solution & Delivery Plan",
        executiveSummary: "This solution leverages AI agents to automate and optimize key business functions including customer support, order management, and inventory management. The proposed solution is scalable, secure, and designed to improve efficiency and customer satisfaction.",
        scope: [
          {
            module: "Customer Support",
            desc: "AI-driven customer support and engagement",
            agent: "Customer Support Agent",
            features: "24/7 Support, FAQs, Order Tracking, Returns & Refunds"
          },
          {
            module: "Order Management",
            desc: "Automated order processing and tracking",
            agent: "Order Management Agent",
            features: "Order Processing, Tracking, Notifications, Exception Handling"
          },
          {
            module: "Inventory Management",
            desc: "Real-time inventory tracking and management",
            agent: "Inventory Management Agent",
            features: "Real-time Tracking, Forecasting, Low Stock Alerts"
          }
        ],
        phases: [
          { num: "Phase 1", title: "Discovery & Planning", duration: "1-2 Weeks", icon: "📋", green: false },
          { num: "Phase 2", title: "Design & Architecture", duration: "2-3 Weeks", icon: "📐", green: true },
          { num: "Phase 3", title: "Development & Integration", duration: "6-8 Weeks", icon: "</>", green: false },
          { num: "Phase 4", title: "Testing & Deployment", duration: "2-3 Weeks", icon: "✓", green: true },
          { num: "Phase 5", title: "Support & Optimization", duration: "Ongoing", icon: "🎧", green: false }
        ],
        costItems: [
          { comp: "AI Agent Development", desc: "Development of 3 AI Agents", cost: "$25,000" },
          { comp: "System Integration", desc: "Integration with existing systems", cost: "$15,000" },
          { comp: "Cloud & Infrastructure", desc: "Cloud setup and ongoing costs (3 months)", cost: "$9,000" },
          { comp: "UI/UX Design", desc: "User interface and experience design", cost: "$6,000" },
          { comp: "Testing & QA", desc: "Quality assurance and testing", cost: "$5,000" },
          { comp: "Project Management", desc: "Project management and reporting", cost: "$5,000" }
        ],
        totalCost: "$65,000",
        humanIntelligence: [
          { role: "Project Manager", resp: "Project planning, coordination and reporting", effort: "80" },
          { role: "Business Analyst", resp: "Requirement gathering, analysis and documentation", effort: "60" },
          { role: "AI/ML Engineer", resp: "AI model development and optimization", effort: "120" },
          { role: "Backend Developer", resp: "System development and integration", effort: "160" },
          { role: "Frontend Developer", resp: "UI development and integration", effort: "80" },
          { role: "QA Engineer", resp: "Testing and quality assurance", effort: "80" },
          { role: "Support Engineer", resp: "Deployment and post-launch support", effort: "40" }
        ]
      }
    },
    banking: {
      prompt: "We are a UK retail financial organisation looking to deploy sovereign AI agents for loan underwriting, automated fraud alerts, and FCA compliance auditing.",
      modelName: "GPT-4o",
      meta: {
        solutionName: "FinTech Compliance & Lending AI Solution",
        preparedFor: "UK Retail Bank Group",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        preparedBy: "AB Agent Studio"
      },
      responseAi: {
        title: "Autonomous Banking Workflows & Regulatory AI Architecture",
        sections: [
          {
            title: "1. Solution Overview",
            body: "Enterprise-grade intelligent automation stack enabling real-time risk assessment, automated credit underwriting, and continuous compliance telemetry adhering strictly to UK FCA principles."
          },
          {
            title: "2. Core Autonomous Agents",
            body: `<ul>
              <li><strong>Loan Decisioning Agent:</strong> Multimodal income & bank statement verification, instant credit scoring.</li>
              <li><strong>Fraud Watchdog Agent:</strong> Anomaly detection across transaction streams with sub-second alert triggers.</li>
              <li><strong>FCA Compliance Sentinel:</strong> Continuous policy checking, audit trail generation, and explainability reporting.</li>
            </ul>`
          }
        ]
      },
      solutionPlan: {
        title: "Banking Solution Architecture & Delivery Blueprint",
        executiveSummary: "Deploys sovereign LLM agents running in secure private cloud VPCs, accelerating loan turnaround by 78% while guaranteeing verifiable auditability.",
        scope: [
          { module: "Credit Underwriting", desc: "Automated statement ingestion & scoring", agent: "Loan Decisioning Agent", features: "Income validation, Risk scoring, Instant decisions" },
          { module: "Fraud Telemetry", desc: "Real-time anomaly scoring", agent: "Fraud Watchdog Agent", features: "Graph transaction analysis, Instant freeze hooks" },
          { module: "Regulatory Audit", desc: "Explainable AI compliance logs", agent: "FCA Compliance Sentinel", features: "Audit trail, Rule compliance validation" }
        ],
        phases: [
          { num: "Phase 1", title: "Security & FCA Audit", duration: "3 Weeks", icon: "🛡️", green: false },
          { num: "Phase 2", title: "Private Cloud VPC", duration: "4 Weeks", icon: "☁️", green: true },
          { num: "Phase 3", title: "Model Fine-tuning", duration: "6 Weeks", icon: "</>", green: false },
          { num: "Phase 4", title: "Pilot Shadowing", duration: "4 Weeks", icon: "✓", green: true },
          { num: "Phase 5", title: "Enterprise Rollout", duration: "Ongoing", icon: "🚀", green: false }
        ],
        costItems: [
          { comp: "Security & VPC Architecture", desc: "FCA compliant enclave", cost: "$35,000" },
          { comp: "Agentic Underwriting Engine", desc: "Document AI & scoring agents", cost: "$40,000" },
          { comp: "Integration with Core Banking", desc: "REST & ISO20022 connectors", cost: "$25,000" },
          { comp: "Testing & Pen-Testing", desc: "CREST-certified penetration test", cost: "$12,000" }
        ],
        totalCost: "$112,000",
        humanIntelligence: [
          { role: "Enterprise Architect", resp: "Security enclave & system governance", effort: "100" },
          { role: "Lead AI Engineer", resp: "Model fine-tuning & prompt safeguarding", effort: "140" },
          { role: "Compliance Specialist", resp: "FCA policy mapping & legal verification", effort: "60" },
          { role: "FinTech Integration Lead", resp: "Core banking API pipelines", effort: "120" }
        ]
      }
    }
  };

  let currentSolution = SAMPLE_SOLUTIONS.ecommerce;

  function initStudioExtension() {
    bindPromptControls();
    bindThemeAndModal();
    bindExportActions();
    renderSolutionData();
  }

  function bindPromptControls() {
    const input = document.getElementById('ext-prompt-input');
    const charTag = document.getElementById('ext-char-count');
    const runBtn = document.getElementById('ext-btn-run');
    const clearBtn = document.getElementById('ext-btn-clear');
    const exBtn = document.getElementById('ext-btn-examples');
    const modelSelect = document.getElementById('ext-model-select');

    if (input && charTag) {
      input.addEventListener('input', () => {
        charTag.textContent = `${input.value.length} / 4000`;
      });
    }

    if (clearBtn && input) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        if (charTag) charTag.textContent = '0 / 4000';
      });
    }

    if (exBtn && input) {
      exBtn.addEventListener('click', () => {
        const isEcom = input.value.includes('e-commerce');
        const next = isEcom ? SAMPLE_SOLUTIONS.banking : SAMPLE_SOLUTIONS.ecommerce;
        input.value = next.prompt;
        if (charTag) charTag.textContent = `${next.prompt.length} / 4000`;
        currentSolution = next;
        renderSolutionData();
      });
    }

    if (runBtn) {
      runBtn.addEventListener('click', () => {
        executeRunPrompt();
      });
    }
  }

  function bindThemeAndModal() {
    const themeBtn = document.getElementById('ext-theme-toggle');
    const studioContainer = document.getElementById('ab-studio-container');
    const settingsBtn = document.getElementById('ext-nav-settings');
    const modal = document.getElementById('ext-api-modal');
    const closeBtn = document.getElementById('ext-modal-close');
    const saveBtn = document.getElementById('ext-save-api-key');

    if (themeBtn && studioContainer) {
      themeBtn.addEventListener('click', () => {
        studioContainer.classList.toggle('studio-dark-theme');
      });
    }

    const openSettings = () => {
      if (modal) modal.classList.add('open');
      const p = document.getElementById('ext-cfg-provider');
      const k = document.getElementById('ext-cfg-api-key');
      if (p) p.value = extRuntimeAiConfig.provider;
      if (k) k.value = extRuntimeAiConfig.apiKey;
    };

    const closeSettings = () => {
      if (modal) modal.classList.remove('open');
    };

    if (settingsBtn) settingsBtn.addEventListener('click', openSettings);
    if (closeBtn) closeBtn.addEventListener('click', closeSettings);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeSettings();
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const p = document.getElementById('ext-cfg-provider').value;
        const k = document.getElementById('ext-cfg-api-key').value;
        extRuntimeAiConfig.provider = p;
        extRuntimeAiConfig.apiKey = k;
        closeSettings();
        alert(`AI Engine configured in session: ${p.toUpperCase()}`);
      });
    }
  }

  function bindExportActions() {
    const copyBtn = document.getElementById('ext-copy-response');
    const regenBtn = document.getElementById('ext-regenerate');
    const docBtn = document.getElementById('ext-export-word');
    const xlsBtn = document.getElementById('ext-export-excel');
    const topExpBtn = document.getElementById('ext-top-export');
    const solExpBtn = document.getElementById('ext-sol-export');

    const downloadReport = (format) => {
      const sol = currentSolution;
      const content = `ACTIVE BRAINS - AGENT STUDIO SOLUTION REPORT\n` +
        `Solution: ${sol.meta.solutionName}\nClient: ${sol.meta.preparedFor}\nDate: ${sol.meta.date}\n\n` +
        `Summary: ${sol.solutionPlan.executiveSummary}\n\n` +
        `Estimated Total: ${sol.solutionPlan.totalCost}\n`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ActiveBrains_Solution_${Date.now()}.${format === 'excel' ? 'csv' : 'txt'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    if (docBtn) docBtn.addEventListener('click', () => downloadReport('doc'));
    if (xlsBtn) xlsBtn.addEventListener('click', () => downloadReport('excel'));
    if (topExpBtn) topExpBtn.addEventListener('click', () => downloadReport('txt'));
    if (solExpBtn) solExpBtn.addEventListener('click', () => downloadReport('doc'));

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const text = document.getElementById('ext-ai-content').innerText;
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.textContent = '✓ Copied';
          setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
        });
      });
    }

    if (regenBtn) {
      regenBtn.addEventListener('click', () => {
        executeRunPrompt();
      });
    }
  }

  async function executeRunPrompt() {
    const input = document.getElementById('ext-prompt-input');
    const runBtn = document.getElementById('ext-btn-run');
    const modelSelect = document.getElementById('ext-model-select');
    const selectedModel = modelSelect ? modelSelect.value : 'Claude 3.5 Sonnet';

    const text = input.value.trim();
    if (!text) {
      alert("Please enter a solution prompt.");
      return;
    }

    runBtn.disabled = true;
    runBtn.innerHTML = `<span>⏳</span> Generating...`;

    const provider = extRuntimeAiConfig.provider || 'simulated';
    const apiKey = extRuntimeAiConfig.apiKey;

    if (provider !== 'simulated' && apiKey) {
      try {
        await callLiveModel(provider, apiKey, selectedModel, text);
        runBtn.disabled = false;
        runBtn.innerHTML = `▷ Run`;
        return;
      } catch (e) {
        console.warn("Live API fallback:", e);
        alert(`API notice: ${e.message}. Using built-in Active Brains generator.`);
      }
    }

    setTimeout(() => {
      runBtn.disabled = false;
      runBtn.innerHTML = `▷ Run`;

      const isBank = /bank|finan|loan|fca|credit|fraud/i.test(text);
      const activeSample = isBank ? SAMPLE_SOLUTIONS.banking : SAMPLE_SOLUTIONS.ecommerce;

      currentSolution = JSON.parse(JSON.stringify(activeSample));
      currentSolution.prompt = text;
      currentSolution.modelName = selectedModel;
      currentSolution.meta.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      renderSolutionData();
    }, 700);
  }

  async function callLiveModel(provider, key, model, prompt) {
    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are AB Agent Studio by Active Brains Technologies. Generate structured IT architectures and delivery approaches.' },
            { role: 'user', content: prompt }
          ]
        })
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      const output = data.choices[0].message.content;
      document.getElementById('ext-ai-content').innerHTML = `<p>${output.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`;
      document.getElementById('ext-model-tag').textContent = `Response generated by ${model} (Live API)`;
      return output;
    }
  }

  function renderSolutionData() {
    const sol = currentSolution;

    // Left Panel
    const title = document.getElementById('ext-ai-title');
    const content = document.getElementById('ext-ai-content');
    const modelTag = document.getElementById('ext-model-tag');
    const headerTag = document.getElementById('ext-header-tag');

    if (title) title.textContent = sol.responseAi.title;
    if (modelTag) modelTag.textContent = `Response generated by ${sol.modelName}`;
    if (headerTag) headerTag.textContent = `${sol.modelName} Response`;

    if (content) {
      let html = '';
      sol.responseAi.sections.forEach(s => {
        html += `<h5>${s.title}</h5><div>${s.body}</div>`;
      });
      content.innerHTML = html;
    }

    // Right Panel
    const sName = document.getElementById('ext-meta-name');
    const sClient = document.getElementById('ext-meta-client');
    const sDate = document.getElementById('ext-meta-date');
    const sBy = document.getElementById('ext-meta-by');
    const sSummary = document.getElementById('ext-exec-summary');

    if (sName) sName.textContent = sol.meta.solutionName;
    if (sClient) sClient.textContent = sol.meta.preparedFor;
    if (sDate) sDate.textContent = sol.meta.date;
    if (sBy) sBy.textContent = sol.meta.preparedBy;
    if (sSummary) sSummary.textContent = sol.solutionPlan.executiveSummary;

    // Scope table
    const scopeBody = document.getElementById('ext-scope-body');
    if (scopeBody) {
      scopeBody.innerHTML = sol.solutionPlan.scope.map(sc => `
        <tr>
          <td><strong style="color: var(--studio-text-main);">${sc.module}</strong></td>
          <td>${sc.desc}</td>
          <td>${sc.agent}</td>
          <td>${sc.features}</td>
        </tr>
      `).join('');
    }

    // Phases
    const phasesEl = document.getElementById('ext-phases-container');
    if (phasesEl) {
      let pHtml = '';
      sol.solutionPlan.phases.forEach((p, idx) => {
        pHtml += `
          <div class="studio-flow-box ${p.green ? 'green' : ''}">
            <span class="studio-flow-phase">${p.num}</span>
            <span class="studio-flow-name">${p.title}</span>
            <span class="studio-flow-dur">${p.icon} (${p.duration})</span>
          </div>
        `;
        if (idx < sol.solutionPlan.phases.length - 1) {
          pHtml += `<span class="studio-flow-arrow">→</span>`;
        }
      });
      phasesEl.innerHTML = pHtml;
    }

    // Cost table
    const costBody = document.getElementById('ext-cost-body');
    const totalEl = document.getElementById('ext-total-cost');
    if (costBody) {
      costBody.innerHTML = sol.solutionPlan.costItems.map(c => `
        <tr>
          <td><strong style="color: var(--studio-text-main);">${c.comp}</strong></td>
          <td>${c.desc}</td>
          <td style="font-weight: 600; color: var(--studio-text-main); text-align: right;">${c.cost}</td>
        </tr>
      `).join('');
    }
    if (totalEl) totalEl.textContent = sol.solutionPlan.totalCost;

    // Human table
    const humanBody = document.getElementById('ext-human-body');
    if (humanBody) {
      humanBody.innerHTML = sol.solutionPlan.humanIntelligence.map(h => `
        <tr>
          <td><strong style="color: var(--studio-text-main);">${h.role}</strong></td>
          <td>${h.resp}</td>
          <td style="text-align: right; font-weight: 600; color: var(--studio-text-main);">${h.effort}</td>
        </tr>
      `).join('');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStudioExtension);
  } else {
    initStudioExtension();
  }
})();
