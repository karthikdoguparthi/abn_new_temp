/**
 * AB AGENT STUDIO - Dynamic Solution & AI Engine (v3 Full-Width)
 * Dynamically synthesizes real enterprise architectures based on the user's custom business prompt
 * or uploaded statement document across multiple AI models (Claude, GPT-4o, Gemini, DeepSeek, or Active Brains)
 */

(function () {
  'use strict';

  let currentSolution = null;
  // Solution run history for user comparison
  let solutionHistory = [];
  // Active selected currency state
  let currentCurrency = 'USD';
  const CURRENCY_MAP = {
    USD: { code: 'USD', symbol: '$', rate: 1.0, name: 'US Dollar' },
    GBP: { code: 'GBP', symbol: '£', rate: 0.78, name: 'British Pound' },
    INR: { code: 'INR', symbol: '₹', rate: 84.0, name: 'Indian Rupee' },
    EUR: { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
    AUD: { code: 'AUD', symbol: 'A$', rate: 1.52, name: 'Australian Dollar' },
    AED: { code: 'AED', symbol: 'AED ', rate: 3.67, name: 'UAE Dirham' }
  };

  function formatCurrencyAmount(baseUsdAmount, currCode = currentCurrency) {
    const curr = CURRENCY_MAP[currCode] || CURRENCY_MAP.USD;
    const converted = Math.round(baseUsdAmount * curr.rate);
    return `${curr.symbol}${converted.toLocaleString()}`;
  }

  // Runtime in-memory security context for sensitive configuration (zero web storage persistence)
  let runtimeAiConfig = {
    provider: 'gemini',
    apiKey: ''
  };


  function init() {
    bindPromptEvents();
    bindModelModalEvents();
    bindThemeToggle();
    bindExportEvents();
    bindCurrencySelector();
    bindHistoryDrawer();

    const promptInput = document.getElementById('prompt-input');
    const modelSelect = document.getElementById('model-select');
    const initialModel = modelSelect ? modelSelect.value : 'Claude 3.5 Sonnet';

    if (promptInput && promptInput.value.trim()) {
      generateDynamicSolution(promptInput.value.trim(), initialModel);
    } else {
      // Clean initial slate
      renderEmptyState();
    }
  }

  function renderEmptyState() {
    currentSolution = null;
    const aiTitle = document.getElementById('ai-response-title');
    const aiContent = document.getElementById('ai-response-content');
    const planExecSummary = document.getElementById('plan-exec-summary');
    const scopeTbody = document.getElementById('scope-table-body');
    const costTbody = document.getElementById('cost-table-body');
    const humanTbody = document.getElementById('human-table-body');
    const totalCostEl = document.getElementById('total-cost-val');

    const metaSolName = document.getElementById('meta-sol-name');
    const metaClient = document.getElementById('meta-client');
    const metaDate = document.getElementById('meta-date');
    const metaBy = document.getElementById('meta-by');

    if (metaSolName) metaSolName.textContent = "Tailored Enterprise Solution";
    if (metaClient) metaClient.textContent = "Client Enterprise";
    if (metaDate) metaDate.textContent = "—";
    if (metaBy) metaBy.textContent = "AB Agent Studio";

    if (aiTitle) aiTitle.textContent = "AI Solution Reasoning";
    if (aiContent) {
      aiContent.innerHTML = `
        <div style="padding: 30px 10px; text-align: center; color: var(--studio-text-muted);">
          <div style="font-size: 2.2rem; margin-bottom: 12px; color: var(--studio-accent-orange);">✦</div>
          <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--studio-text-main); margin-bottom: 8px;">Awaiting Business Scenario</h4>
          <p style="max-width: 420px; margin: 0 auto; line-height: 1.5; font-size: 0.85rem;">
            Type a business statement above or click <strong>Attach Statement</strong> to upload an RFP or problem statement. Select your AI model and click <strong>Run</strong>.
          </p>
        </div>
      `;
    }
    if (planExecSummary) {
      planExecSummary.textContent = "Enter your business scenario or administrative statement above to generate a tailored Active Brains solution, scope table, delivery timeline, and cost breakdown.";
    }
    if (scopeTbody) {
      scopeTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 24px; color: var(--studio-text-muted);">No scope generated yet. Enter a scenario and click Run.</td></tr>`;
    }
    if (costTbody) {
      costTbody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 24px; color: var(--studio-text-muted);">No cost breakdown calculated yet.</td></tr>`;
    }
    if (humanTbody) {
      humanTbody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 24px; color: var(--studio-text-muted);">No effort hours calculated yet.</td></tr>`;
    }
    if (totalCostEl) totalCostEl.textContent = "$0";
  }

  function bindPromptEvents() {
    const promptInput = document.getElementById('prompt-input');
    const charCount = document.getElementById('char-count');
    const runBtn = document.getElementById('btn-run');
    const clearBtn = document.getElementById('btn-clear');
    const attachBtn = document.getElementById('btn-attach');
    const fileUpload = document.getElementById('file-statement-upload');
    const attachedFileName = document.getElementById('attached-file-name');

    if (promptInput && charCount) {
      charCount.textContent = `${promptInput.value.length} / 4000`;
      promptInput.addEventListener('input', () => {
        charCount.textContent = `${promptInput.value.length} / 4000`;
      });
    }

    if (clearBtn && promptInput) {
      clearBtn.addEventListener('click', () => {
        promptInput.value = '';
        if (charCount) charCount.textContent = '0 / 4000';
        if (attachedFileName) attachedFileName.style.display = 'none';
        currentSolution = null;
        renderEmptyState();
        promptInput.focus();
      });
    }

    // Attach File / Business Statement Document
    if (attachBtn && fileUpload) {
      attachBtn.addEventListener('click', () => {
        fileUpload.click();
      });

      fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          if (typeof content === 'string') {
            // Populate prompt with the file content
            const snippet = content.trim().substring(0, 3800);
            promptInput.value = snippet;
            if (charCount) charCount.textContent = `${promptInput.value.length} / 4000`;
            if (attachedFileName) {
              attachedFileName.textContent = `✓ Attached: ${file.name} (${Math.round(file.size / 1024)} KB)`;
              attachedFileName.style.display = 'inline-block';
            }
            // Auto run solution generation
            handleRunPrompt();
          }
        };
        reader.readAsText(file);
      });
    }

    if (runBtn) {
      runBtn.addEventListener('click', () => {
        handleRunPrompt();
      });
    }
  }


  function bindCurrencySelector() {
    const currSelect = document.getElementById('currency-select');
    if (currSelect) {
      currSelect.value = currentCurrency;
      currSelect.addEventListener('change', (e) => {
        currentCurrency = e.target.value;
        if (currentSolution) {
          renderCurrentSolution();
        }
      });
    }
  }

  function bindHistoryDrawer() {
    const toggleBtn = document.getElementById('btn-history-toggle');
    const drawer = document.getElementById('history-drawer');
    const closeBtn = document.getElementById('history-drawer-close');
    const clearBtn = document.getElementById('btn-clear-history');

    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', () => {
        drawer.classList.toggle('open');
      });
    }

    if (closeBtn && drawer) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('open');
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear your solution run history?")) {
          solutionHistory = [];
          renderHistoryDrawer();
        }
      });
    }
  }

  function addSolutionToHistory(sol) {
    if (!sol) return;
    const historyItem = {
      id: 'run_' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      prompt: sol.prompt,
      modelName: sol.modelName,
      solutionName: sol.meta.solutionName,
      domain: sol.domain,
      targetOrg: sol.meta.preparedFor,
      totalCost: sol.solutionPlan.totalCost,
      currency: currentCurrency,
      formattedTotal: formatCurrencyAmount(
        typeof sol.solutionPlan.totalCost === 'number'
          ? sol.solutionPlan.totalCost
          : Number(String(sol.solutionPlan.totalCost).replace(/[^0-9.]/g, '')) || 0,
        currentCurrency
      ),
      solution: sol
    };

    // Prepend to history (newest first, max 25 runs)
    solutionHistory.unshift(historyItem);
    if (solutionHistory.length > 25) {
      solutionHistory.pop();
    }

    renderHistoryDrawer();
  }

  function renderHistoryDrawer() {
    const container = document.getElementById('history-items-container');
    const countBadge = document.getElementById('history-counter-badge');
    const drawerCount = document.getElementById('history-drawer-count');

    const count = solutionHistory.length;
    if (drawerCount) drawerCount.textContent = count;
    if (countBadge) {
      countBadge.textContent = count;
      countBadge.style.display = count > 0 ? 'inline-flex' : 'none';
    }

    if (!container) return;

    if (count === 0) {
      container.innerHTML = `
        <div class="history-empty-state">
          <p>No runs generated yet.</p>
          <small>Run a scenario above and each generation will automatically be archived here to inspect or restore for comparison.</small>
        </div>
      `;
      return;
    }

    container.innerHTML = solutionHistory.map((item, idx) => {
      const isActive = currentSolution && currentSolution.prompt === item.prompt;
      return `
        <div class="history-card ${isActive ? 'active-run' : ''}" data-history-idx="${idx}">
          <div class="history-card-top">
            <span class="history-card-time">Run #${count - idx} • ${item.timestamp}</span>
            <span class="history-card-model">${item.modelName}</span>
          </div>
          <div class="history-card-title">${item.solutionName}</div>
          <div class="history-card-prompt">"${item.prompt}"</div>
          <div class="history-card-meta">
            <span class="history-card-cost">${item.formattedTotal}</span>
            <div class="history-card-actions">
              <button class="history-card-btn btn-load-run" data-run-idx="${idx}" type="button">Compare / View</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind click events on history cards
    container.querySelectorAll('.btn-load-run').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const runIdx = Number(btn.getAttribute('data-run-idx'));
        loadHistoryRun(runIdx);
      });
    });

    container.querySelectorAll('.history-card').forEach(card => {
      card.addEventListener('click', () => {
        const runIdx = Number(card.getAttribute('data-history-idx'));
        loadHistoryRun(runIdx);
      });
    });
  }

  function loadHistoryRun(idx) {
    const item = solutionHistory[idx];
    if (!item || !item.solution) return;

    currentSolution = item.solution;
    const promptInput = document.getElementById('prompt-input');
    const charCount = document.getElementById('char-count');
    if (promptInput) {
      promptInput.value = item.prompt;
      if (charCount) charCount.textContent = `${item.prompt.length} / 4000`;
    }

    renderCurrentSolution();
    renderHistoryDrawer();

    const drawer = document.getElementById('history-drawer');
    if (drawer) drawer.classList.remove('open');
  }

  function bindThemeToggle() {
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('studio-dark-theme');
      });
    }
  }

  function bindModelModalEvents() {
    const settingsBtn = document.getElementById('nav-settings');
    const modalBackdrop = document.getElementById('api-config-modal');
    const modalClose = document.getElementById('modal-close');
    const saveBtn = document.getElementById('btn-save-api-key');

    const openModal = () => {
      if (modalBackdrop) modalBackdrop.classList.add('open');
      const providerEl = document.getElementById('cfg-provider');
      const keyEl = document.getElementById('cfg-api-key');
      if (providerEl) providerEl.value = runtimeAiConfig.provider;
      if (keyEl) keyEl.value = runtimeAiConfig.apiKey;
    };

    const closeModal = () => {
      if (modalBackdrop) modalBackdrop.classList.remove('open');
    };

    if (settingsBtn) settingsBtn.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const provider = document.getElementById('cfg-provider').value;
        const key = document.getElementById('cfg-api-key').value.trim();
        runtimeAiConfig.provider = provider;
        runtimeAiConfig.apiKey = key;
        closeModal();
        alert(`AI configuration updated in active session! Provider mode: ${provider.toUpperCase()}`);
      });
    }
  }

  function bindExportEvents() {
    const btnDocx = document.getElementById('btn-export-word');
    const btnXlsx = document.getElementById('btn-export-excel');
    const btnTopExport = document.getElementById('btn-top-export');
    const btnSolExport = document.getElementById('btn-sol-export');

    const downloadSolution = (format) => {
      if (!currentSolution) {
        alert("Please run a solution first before exporting.");
        return;
      }
      const sol = currentSolution;
      const totalNum = typeof sol.solutionPlan.totalCost === 'number'
        ? sol.solutionPlan.totalCost
        : Number(String(sol.solutionPlan.totalCost).replace(/[^0-9.]/g, '')) || 0;
      const formattedTotalStr = formatCurrencyAmount(totalNum, currentCurrency);

      if (format === 'excel') {
        // True CSV format compatible with Microsoft Excel
        const escapeCsv = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
        let csv = `Active Brains Technologies - Agent Studio Solution Report\n`;
        csv += `Solution Name,${escapeCsv(sol.meta.solutionName)}\n`;
        csv += `Client / Prepared For,${escapeCsv(sol.meta.preparedFor)}\n`;
        csv += `Date,${escapeCsv(sol.meta.date)}\n`;
        csv += `Prepared By,${escapeCsv(sol.meta.preparedBy)}\n`;
        csv += `Currency,${escapeCsv(currentCurrency)}\n`;
        csv += `Total Estimated Cost,${escapeCsv(formattedTotalStr)}\n\n`;

        csv += `EXECUTIVE SUMMARY\n`;
        csv += `${escapeCsv(sol.solutionPlan.executiveSummary)}\n\n`;

        csv += `SOLUTION SCOPE & MODULES\n`;
        csv += `Module,AI Agent Involved,Description,Key Features\n`;
        (sol.solutionPlan.scope || []).forEach(sc => {
          csv += `${escapeCsv(sc.module)},${escapeCsv(sc.agent)},${escapeCsv(sc.desc)},${escapeCsv(sc.features)}\n`;
        });
        csv += `\n`;

        csv += `ESTIMATED COST BREAKDOWN\n`;
        csv += `Cost Component,Description,Estimated Cost (${currentCurrency})\n`;
        (sol.solutionPlan.costItems || []).forEach(c => {
          const costNum = c.baseCost || (typeof c.cost === 'string' ? Number(c.cost.replace(/[^0-9.]/g, '')) : c.cost) || 0;
          csv += `${escapeCsv(c.comp)},${escapeCsv(c.desc)},${escapeCsv(formatCurrencyAmount(costNum, currentCurrency))}\n`;
        });
        csv += `Total,,${escapeCsv(formattedTotalStr)}\n\n`;

        if (sol.solutionPlan.humanResources && sol.solutionPlan.humanResources.length) {
          csv += `HUMAN INTELLIGENCE REQUIRED\n`;
          csv += `Role,Responsibility,Effort (Hours)\n`;
          sol.solutionPlan.humanResources.forEach(hr => {
            csv += `${escapeCsv(hr.role)},${escapeCsv(hr.desc)},${escapeCsv(hr.hours)}\n`;
          });
          csv += `\n`;
        }

        if (sol.solutionPlan.phases && sol.solutionPlan.phases.length) {
          csv += `IMPLEMENTATION ROADMAP & DELIVERABLES\n`;
          csv += `Phase,Duration,Key Activities,Deliverables\n`;
          sol.solutionPlan.phases.forEach(p => {
            csv += `${escapeCsv(p.name)},${escapeCsv(p.dur)},${escapeCsv(p.desc)},${escapeCsv(p.deliverables)}\n`;
          });
        }

        const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sol.meta.solutionName.replace(/\s+/g, '_')}_ActiveBrains.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }

      if (format === 'doc') {
        // Formatted Word document (HTML format compatible with Microsoft Word .doc)
        let htmlDoc = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">`;
        htmlDoc += `<head><meta charset="utf-8"><title>${sol.meta.solutionName}</title>`;
        htmlDoc += `<style>
          body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.6; }
          h1 { color: #f35009; font-size: 20pt; border-bottom: 2px solid #f35009; padding-bottom: 6px; }
          h2 { color: #0f172a; font-size: 14pt; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px; }
          th { background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
          td { border: 1px solid #cbd5e1; padding: 8px; vertical-align: top; }
          .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; margin-bottom: 20px; }
          .badge { font-weight: bold; color: #f35009; }
        </style></head><body>`;

        htmlDoc += `<h1>Active Brains Technologies - Agent Studio Solution Report</h1>`;
        htmlDoc += `<div class="meta-box">`;
        htmlDoc += `<p><strong>Solution Name:</strong> ${sol.meta.solutionName}<br>`;
        htmlDoc += `<strong>Prepared For:</strong> ${sol.meta.preparedFor}<br>`;
        htmlDoc += `<strong>Date:</strong> ${sol.meta.date}<br>`;
        htmlDoc += `<strong>Prepared By:</strong> ${sol.meta.preparedBy}<br>`;
        htmlDoc += `<strong>Total Project Cost:</strong> <span class="badge">${formattedTotalStr}</span></p>`;
        htmlDoc += `</div>`;

        htmlDoc += `<h2>1. Executive Summary</h2>`;
        htmlDoc += `<p>${sol.solutionPlan.executiveSummary}</p>`;

        htmlDoc += `<h2>2. Solution Scope & Modules</h2>`;
        htmlDoc += `<table><thead><tr><th>Module</th><th>AI Agent Involved</th><th>Description</th><th>Key Features</th></tr></thead><tbody>`;
        (sol.solutionPlan.scope || []).forEach(sc => {
          htmlDoc += `<tr><td><strong>${sc.module}</strong></td><td>${sc.agent}</td><td>${sc.desc}</td><td>${sc.features}</td></tr>`;
        });
        htmlDoc += `</tbody></table>`;

        htmlDoc += `<h2>3. Implementation Roadmap</h2>`;
        htmlDoc += `<table><thead><tr><th>Phase</th><th>Duration</th><th>Activities</th><th>Deliverables</th></tr></thead><tbody>`;
        (sol.solutionPlan.phases || []).forEach(p => {
          htmlDoc += `<tr><td><strong>${p.name}</strong></td><td>${p.dur}</td><td>${p.desc}</td><td>${p.deliverables}</td></tr>`;
        });
        htmlDoc += `</tbody></table>`;

        htmlDoc += `<h2>4. Estimated Cost Breakdown (${currentCurrency})</h2>`;
        htmlDoc += `<table><thead><tr><th>Cost Component</th><th>Description</th><th>Estimated Cost</th></tr></thead><tbody>`;
        (sol.solutionPlan.costItems || []).forEach(c => {
          const costNum = c.baseCost || (typeof c.cost === 'string' ? Number(c.cost.replace(/[^0-9.]/g, '')) : c.cost) || 0;
          htmlDoc += `<tr><td><strong>${c.comp}</strong></td><td>${c.desc}</td><td>${formatCurrencyAmount(costNum, currentCurrency)}</td></tr>`;
        });
        htmlDoc += `<tr><td colspan="2"><strong>Total Estimated Project Cost</strong></td><td><strong>${formattedTotalStr}</strong></td></tr>`;
        htmlDoc += `</tbody></table>`;

        if (sol.solutionPlan.humanResources && sol.solutionPlan.humanResources.length) {
          htmlDoc += `<h2>5. Human Intelligence Required</h2>`;
          htmlDoc += `<table><thead><tr><th>Role</th><th>Responsibility</th><th>Effort (Hours)</th></tr></thead><tbody>`;
          sol.solutionPlan.humanResources.forEach(hr => {
            htmlDoc += `<tr><td><strong>${hr.role}</strong></td><td>${hr.desc}</td><td>${hr.hours}</td></tr>`;
          });
          htmlDoc += `</tbody></table>`;
        }

        htmlDoc += `</body></html>`;

        const blob = new Blob(['\ufeff', htmlDoc], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sol.meta.solutionName.replace(/\s+/g, '_')}_ActiveBrains.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }
    };

    if (btnDocx) btnDocx.addEventListener('click', () => downloadSolution('doc'));
    if (btnXlsx) btnXlsx.addEventListener('click', () => downloadSolution('excel'));
    if (btnTopExport) btnTopExport.addEventListener('click', () => downloadSolution('txt'));
    if (btnSolExport) btnSolExport.addEventListener('click', () => downloadSolution('doc'));

    const copyBtn = document.getElementById('btn-copy-response');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const bodyText = document.getElementById('ai-response-content').innerText;
        navigator.clipboard.writeText(bodyText).then(() => {
          copyBtn.innerHTML = '✓ Copied';
          setTimeout(() => { copyBtn.innerHTML = '📋 Copy'; }, 2000);
        });
      });
    }

    const regenBtn = document.getElementById('btn-regenerate');
    if (regenBtn) {
      regenBtn.addEventListener('click', () => {
        handleRunPrompt();
      });
    }
  }

  function getFriendlyModelName(modelVal) {
    if (!modelVal) return 'Google Gemini';
    const val = modelVal.toLowerCase();
    if (val.includes('1.5-flash') || val.includes('flash-latest')) return 'Google Gemini 1.5 Flash';
    if (val.includes('1.5-pro') || val.includes('pro-latest')) return 'Google Gemini 1.5 Pro';
    if (val.includes('2.0-flash')) return 'Google Gemini 2.0 Flash';
    if (val.includes('gemini-pro')) return 'Google Gemini Pro';
    if (val.includes('gemini')) return 'Google Gemini';
    // Fallback friendly formatting
    return modelVal.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  async function handleRunPrompt() {
    const promptInput = document.getElementById('prompt-input');
    const runBtn = document.getElementById('btn-run');
    const modelSelect = document.getElementById('model-select');
    const rawSelectedModel = modelSelect ? modelSelect.value : 'gemini-1.5-flash';
    const friendlyModel = getFriendlyModelName(rawSelectedModel);

    const userPrompt = promptInput.value.trim();
    if (!userPrompt) {
      alert("Please enter a business scenario or upload a file first.");
      promptInput.focus();
      return;
    }

    runBtn.disabled = true;
    runBtn.innerHTML = `<span class="prompt-sparkle">⏳</span> Generating...`;

    const provider = runtimeAiConfig.provider || 'gemini';
    const apiKey = runtimeAiConfig.apiKey;

    // Live AI API Integration (Gemini, Anthropic, or OpenAI)
    if (apiKey && (provider === 'gemini' || apiKey.startsWith('AIza') || provider === 'openai' || provider === 'anthropic')) {
      try {
        const liveAiResult = await callLiveAiModel(provider, apiKey, rawSelectedModel, userPrompt);
        const htmlContent = typeof liveAiResult === 'object' ? liveAiResult.html : liveAiResult;
        
        generateDynamicSolution(userPrompt, friendlyModel, htmlContent);
        runBtn.disabled = false;
        runBtn.innerHTML = `▷ Run`;
        return;
      } catch (err) {
        console.warn("Live Gemini API call error:", err);
        alert(`Gemini API Error: ${err.message}`);
        runBtn.disabled = false;
        runBtn.innerHTML = `▷ Run`;
        return;
      }
    }

    // Dynamic generation
    setTimeout(() => {
      runBtn.disabled = false;
      runBtn.innerHTML = `▷ Run`;
      generateDynamicSolution(userPrompt, friendlyModel);
    }, 600);
  }

  async function callLiveAiModel(provider, key, model, prompt) {
    // 1. Google Gemini Live API
    if (provider === 'gemini' || key.startsWith('AIza')) {
      const cleanKey = key.trim();

      // Auto-discover exact model IDs enabled on the user's Google AI Studio project
      // Strictly exclude any 'gemma' open-weights models to ensure genuine Google Gemini models
      let candidateModels = [];
      try {
        const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`);
        if (listRes.ok) {
          const listData = await listRes.json();
          if (Array.isArray(listData.models)) {
            candidateModels = listData.models
              .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
              .map(m => m.name.replace(/^models\//, ''))
              .filter(name => !name.toLowerCase().includes('gemma') && !name.toLowerCase().includes('embedding'));
          }
        }
      } catch (e) {
        console.warn("ListModels query error:", e);
      }

      // Prioritize chosen model or flash
      const chosen = model.replace(/^models\//, '');
      if (chosen && candidateModels.includes(chosen)) {
        candidateModels = [chosen, ...candidateModels.filter(m => m !== chosen)];
      }

      // Ensure standard Gemini models are front of the queue
      const preferredGeminiList = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-pro',
        'gemini-1.5-pro-latest',
        'gemini-2.0-flash',
        'gemini-2.0-flash-exp'
      ];

      candidateModels = [
        ...preferredGeminiList.filter(m => candidateModels.includes(m)),
        ...candidateModels.filter(m => !preferredGeminiList.includes(m))
      ];

      if (candidateModels.length === 0) {
        candidateModels = preferredGeminiList;
      }

      console.log("Candidate Gemini models to execute:", candidateModels);

      let lastError = null;

      for (const targetModel of candidateModels) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${cleanKey}`;
          
          const systemInstruction = "You are the Senior Enterprise Solution Architect at Active Brains Technologies. Your output will be presented directly to C-level enterprise clients. Produce a comprehensive, technically thorough, production-grade business architecture proposal formatted in clean HTML (h3, h4, p, ul, ol, li). Never output raw markdown fences, chain-of-thought, or scratchpads. Ensure all 10 mandatory enterprise solution sections are fully articulated with granular technical details.";

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
<p>Estimated investment for full enterprise delivery (single USD estimate per line item):</p>
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
  <li><strong>Project Manager:</strong> [Agile sprint governance, milestone reporting, and stakeholder delivery] (80 hours)</li>
  <li><strong>Enterprise Solutions Architect:</strong> [Topology governance, security guardrails, and enterprise integration] (75 hours)</li>
  <li><strong>AI/ML Engineer:</strong> [Agent fine-tuning, RAG indexing, and prompt safety guardrails] (130 hours)</li>
  <li><strong>Backend Integration Engineer:</strong> [API connectors, database pipelines, and event queues] (155 hours)</li>
  <li><strong>Frontend UX Engineer:</strong> [Custom operator workbench, approval forms, and monitoring UI] (85 hours)</li>
  <li><strong>QA & Compliance Specialist:</strong> [Penetration testing, regulatory audits, and quality assurance] (80 hours)</li>
  <li><strong>Support & DevOps Engineer:</strong> [Cloud provisioning, CI/CD pipelines, and telemetry monitoring] (40 hours)</li>
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
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: systemInstruction }]
              },
              contents: [{
                parts: [{ text: promptPayload }]
              }],
              generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 2500
              }
            })
          });

          if (res.ok) {
            const data = await res.json();
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              return {
                html: rawText,
                usedModel: targetModel
              };
            }
          } else {
            const errJson = await res.json().catch(() => ({}));
            lastError = errJson.error?.message || `${res.status} ${res.statusText}`;
            console.warn(`Gemini model ${targetModel} attempt failed:`, lastError);

            if (res.status === 400 && lastError.toLowerCase().includes('api_key_invalid')) {
              throw new Error("Invalid API Key provided. Please verify your key in API Settings.");
            }
          }
        } catch (callErr) {
          if (callErr.message && callErr.message.includes('Invalid API Key')) {
            throw callErr;
          }
          lastError = callErr.message;
        }
      }

      throw new Error(lastError || "Could not connect to Gemini API models.");
    } else if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: model.includes('4o') ? 'gpt-4o' : 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an elite Enterprise AI Solution Architect at Active Brains Technologies. Given the user business problem, formulate a structured IT solution detailing architecture, autonomous agent roles, integrations, and administrative quote/breakdown in HTML formatted sections (h3, p, ul, li).'
            },
            { role: 'user', content: prompt }
          ]
        })
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      return data.choices[0].message.content;
    } else if (provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1200,
          system: 'You are an elite Enterprise AI Solution Architect at Active Brains Technologies. Generate a structured IT solution with agent details and administrative process automation in clean HTML (h3, p, ul, li).',
          messages: [{ role: 'user', content: prompt }]
        })
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      return data.content[0].text;
    }
    return null;
  }

  /**
   * Cleans, formats and parses live AI text into executive-grade HTML
   * Aggressively removes any leaked chain-of-thought, markdown backticks, or scratchpad artifacts
   */
  function formatExecutiveAiResponse(rawText) {
    if (!rawText) return "<p>No response content generated.</p>";

    let text = rawText.trim();

    // 1. Strip markdown fences (```html ... ``` or ``` ...)
    text = text.replace(/```html[\s\S]*?```/gi, match => match.replace(/```html/gi, '').replace(/```/g, ''));
    text = text.replace(/```[\s\S]*?```/gi, match => match.replace(/```/g, ''));
    text = text.replace(/```/g, '');

    // 2. Remove accidental inline backticks like `+ 2 thorough paragraphs.+`
    text = text.replace(/`\s*\+\s*[^`]+`|\+[^`\n]+\+/g, '');
    text = text.replace(/`([^`]+)`/g, '$1');

    // 3. Filter out leaked chain-of-thought/scratchpad tokens and intro banners
    const leakedPatterns = [
      /^Live\s+[^\n]+Reasoning Output/gim,
      /\*\s*Role:[^*\n]+/gi,
      /\*\s*Business Requirement:[^*\n]+/gi,
      /\*\s*Output Structure:[^*\n]+/gi,
      /\*\s*Constraint:[^*\n]+/gi,
      /\*\s*Target Industry:[^*\n]+/gi,
      /\*\s*Core Problem:[^*\n]+/gi,
      /\*\s*Solution Concept:[^*\n]+/gi,
      /\*\s*Architecture Style:[^*\n]+/gi,
      /\*\s*Strategic Goals?:[^*\n]+/gi,
      /\*\s*Check tone:[^*\n]+/gi,
      /\*\s*Check HTML tags:[^*\n]+/gi,
      /\*\s*\*Client:\*[^*]+/gi,
      /\*\s*\*Solution:\*[^*]+/gi,
      /\*\s*\*Architecture:\*[^*]+/gi,
      /\*\s*\*Section \d+:[^*]+/gi,
      /\*\s*\*Agent \d+:[^*]+/gi,
      /Enterprise\s+gemma[^\n]+/gi,
      /Senior Enterprise AI Solution Architect at Active Brains[^\n]+/gi
    ];

    leakedPatterns.forEach(pattern => {
      text = text.replace(pattern, '');
    });

    // If there is an executive heading <h3>, strip any leading pre-scratchpad text preceding it
    const firstH3Index = text.search(/<h[23]/i);
    if (firstH3Index > 0) {
      const leadingSnippet = text.substring(0, firstH3Index);
      // If the leading snippet contains bullet asterisks, prompt fragments, or role notes, discard it
      if (leadingSnippet.includes('*') || leadingSnippet.includes('Role') || leadingSnippet.includes('Output') || leadingSnippet.includes('Reasoning')) {
        text = text.substring(firstH3Index);
      }
    }

    // 4. Convert markdown headers if present
    text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gim, '<h3>$1</h3>');
    text = text.replace(/^# (.*$)/gim, '<h3>$1</h3>');

    // 5. Convert markdown bold and list items
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/^\s*\*\s+(.*$)/gim, '<li>$1</li>');
    text = text.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>');

    // 6. Clean dangling asterisks or bullet leftovers
    text = text.replace(/^\s*\*\s*/gm, '');

    // Wrap consecutive <li> into <ul> if not inside a <ul>
    text = text.replace(/(<li>.*?<\/li>(\s*<li>.*?<\/li>)*)/gis, match => {
      return `<ul>${match}</ul>`;
    });

    // Clean multiple nested ul tags if duplicate regex matched
    text = text.replace(/<ul>\s*<ul>/gi, '<ul>').replace(/<\/ul>\s*<\/ul>/gi, '</ul>');

    // Clean empty paragraphs or stray punctuation
    text = text.replace(/<p>\s*<\/p>/gi, '');
    text = text.replace(/^\s*[\*\+]\s*$/gm, '');

    // If text does not contain HTML block tags, format lines as paragraphs
    if (!text.includes('<h3') && !text.includes('<p') && !text.includes('<ul')) {
      const paragraphs = text.split(/\n\s*\n/).map(p => {
        const trimmed = p.trim();
        return trimmed ? `<p>${trimmed}</p>` : '';
      }).filter(Boolean).join('\n');
      text = paragraphs;
    }

    return text.trim();
  }

  /**
   * DYNAMIC SOLUTION SYNTHESIS
   */
  
  /**
   * Parses live AI reasoning output (HTML) and extracts real tailored agents,
   * executive summary, and modules directly into the structured Solution Plan.
   */
  /**
   * Safe HTML text extractor avoiding regex sanitization vulnerabilities.
   */
  function stripHtml(input) {
    if (!input) return '';
    // Convergent multi-pass loop safely strips HTML tags in all browser and headless runtimes
    let str = String(input);
    let previous;
    do {
      previous = str;
      str = str.replace(/<[^>]*>/g, '');
    } while (str !== previous);
    return str.trim();
  }

  function parseLiveAiToTailoredSolution(html, promptText, modelName) {
    const combined = (promptText + ' ' + html).toLowerCase();

    // 1. Executive Summary: extract text under section 1
    let execSummary = '';
    const execMatch = html.match(/<h3>1\.\s*Executive Overview[^<]*<\/h3>([\s\S]*?)(?:<h3>|$)/i);
    if (execMatch) {
      const pMatches = execMatch[1].match(/<p>([\s\S]*?)<\/p>/gi);
      if (pMatches && pMatches.length > 0) {
        const cleanParas = pMatches.map(p => stripHtml(p)).filter(Boolean);
        execSummary = cleanParas.join(' ');
      }
    }
    if (!execSummary) {
      const allP = html.match(/<p>([\s\S]*?)<\/p>/gi);
      if (allP && allP.length > 0) {
        execSummary = allP.slice(0, 2).map(p => stripHtml(p)).join(' ');
      }
    }

    // 2. Extract Agents specifically from Section 2
    let extractedAgents = [];
    const sec2Match = html.match(/<h3>2\.\s*Autonomous Multi-Agent Mesh[^<]*<\/h3>([\s\S]*?)(?:<h3>|$)/i);
    const agentScopeHtml = sec2Match ? sec2Match[1] : html;
    
    const agentRegex = /<li>\s*<strong>([^<:]+):?<\/strong>\s*:?\s*([^<]+)<\/li>/gi;
    let match;
    while ((match = agentRegex.exec(agentScopeHtml)) !== null) {
      const aName = match[1].trim();
      const aDesc = stripHtml(match[2]);
      if (aName && aDesc && !aName.startsWith('Phase') && !aName.includes('$') && !aName.includes('Project Manager')) {
        extractedAgents.push({ name: aName, desc: aDesc });
      }
    }

    if (extractedAgents.length === 0) {
      const genericRegex = /<li>\s*<strong>([^<:]*Agent[^<:]*):?<\/strong>\s*:?\s*([^<]+)<\/li>/gi;
      let gMatch;
      while ((gMatch = genericRegex.exec(html)) !== null) {
        const aName = gMatch[1].trim();
        const aDesc = stripHtml(gMatch[2]);
        if (aName && aDesc) {
          extractedAgents.push({ name: aName, desc: aDesc });
        }
      }
    }

    // 3. Detect Domain, Solution Name, and Target Organization
    // Dynamically derive client topic and name strictly from promptText to avoid sticking to previous response concepts
    let derivedTopic = derivePromptTopic(promptText);
    const pLower = (promptText || '').toLowerCase();

    let solutionName = `${derivedTopic} AI Solution`;
    let targetOrg = `${derivedTopic} Enterprise`;
    let domainName = derivedTopic;

    // Only apply domain specialty aliases if user's prompt explicitly mentions it
    if (pLower.includes('capital pooling') || pLower.includes('asset management')) {
      solutionName = "Capital Pooling & Asset Management AI Solution";
      targetOrg = "Asset Management & Treasury Enterprise";
      domainName = "Capital Pooling & Asset Management";
    } else if (pLower.includes('real estate') || pLower.includes('property') || pLower.includes('broker') || pLower.includes('mls') || pLower.includes('realtor') || pLower.includes('tenant') || pLower.includes('lease')) {
      solutionName = derivedTopic ? `${derivedTopic} Solution` : "Real Estate AI Agent Solution";
      targetOrg = "Enterprise Real Estate Brokerage";
      domainName = "Real Estate & Property Management";
    } else if (pLower.includes('insurance') || pLower.includes('claims') || pLower.includes('policy') || pLower.includes('underwriting')) {
      solutionName = derivedTopic ? `${derivedTopic} Solution` : "Insurance AI Agent Solution";
      targetOrg = "Insurance Enterprise Client";
      domainName = "Insurance & Claims Management";
    } else if (pLower.includes('health') || pLower.includes('clinic') || pLower.includes('hospital') || pLower.includes('doctor') || pLower.includes('patient') || pLower.includes('ehr')) {
      solutionName = derivedTopic ? `${derivedTopic} Solution` : "Healthcare & Clinical AI Solution";
      targetOrg = "Healthcare Enterprise";
      domainName = "Healthcare & Clinical Systems";
    } else if (pLower.includes('bank') || pLower.includes('fintech') || pLower.includes('investment') || pLower.includes('fca') || pLower.includes('fraud') || pLower.includes('kyc')) {
      solutionName = derivedTopic ? `${derivedTopic} Solution` : "FinTech & Banking AI Solution";
      targetOrg = "Financial Institution Client";
      domainName = "Banking & FinTech";
    } else if (pLower.includes('commerce') || pLower.includes('retail') || pLower.includes('store') || pLower.includes('shop') || pLower.includes('order')) {
      solutionName = derivedTopic ? `${derivedTopic} Solution` : "E-commerce AI Agent Solution";
      targetOrg = "Client Business";
      domainName = "E-commerce & Retail";
    } else if (pLower.includes('tablet') || pLower.includes('factory') || pLower.includes('hardware') || pLower.includes('manufactur') || pLower.includes('assembly')) {
      solutionName = derivedTopic ? `${derivedTopic} Solution` : "Manufacturing & Plant AI Solution";
      targetOrg = "Manufacturing Enterprise";
      domainName = "Hardware & Plant Automation";
    } else if (pLower.includes('logistic') || pLower.includes('freight') || pLower.includes('shipping') || pLower.includes('warehouse') || pLower.includes('fleet')) {
      solutionName = derivedTopic ? `${derivedTopic} Solution` : "Logistics & Supply Chain AI Solution";
      targetOrg = "Global Logistics Operator";
      domainName = "Logistics & Supply Chain";
    } else if (pLower.includes('legal') || pLower.includes('contract') || pLower.includes('compliance')) {
      solutionName = derivedTopic ? `${derivedTopic} Solution` : "Legal & Compliance AI Solution";
      targetOrg = "Legal & Professional Services";
      domainName = "Legal & Contract Intelligence";
    } else {
      if (extractedAgents.length > 0) {
        const firstMod = extractedAgents[0].name.replace(/\s*Agent\s*$/i, '').trim();
        solutionName = `${firstMod} AI Agent Solution`;
      } else {
        solutionName = `${derivedTopic} AI Solution`;
      }
      targetOrg = `${derivedTopic} Enterprise`;
      domainName = derivedTopic;
    }

    // 4. Build Scope Table rows from Extracted Agents
    let scope = [];
    if (extractedAgents.length > 0) {
      scope = extractedAgents.map(ag => {
        const modName = ag.name.replace(/\s*Agent\s*$/i, '').trim() || ag.name;
        const parts = ag.desc.split(/[.;]/).map(s => s.trim()).filter(Boolean);
        const shortDesc = parts[0] || ag.desc;
        const features = parts.length > 1 ? parts.slice(1, 4).join(', ') : 'Automated processing, real-time API sync, exception routing, audit logging';
        return {
          module: modName,
          desc: shortDesc,
          agent: ag.name,
          features: features
        };
      });
    }

    // 5. Build Delivery Phases (Priority 1: Extract from Section 4; Priority 2: Domain-synthesized)
    let phases = [];
    const sec4Match = html.match(/<h3>4\.\s*Phased Delivery Approach[^<]*<\/h3>([\s\S]*?)(?:<h3>|$)/i);
    const phaseHtml = sec4Match ? sec4Match[1] : html;
    
    const phaseRegex = /<li>\s*<strong>Phase\s*(\d+)\s*\(([^)]+)\)\s*[-:]?\s*([^:<]+):?<\/strong>\s*:?\s*([^<]+)<\/li>/gi;
    let pMatch;
    const icons = ['📋', '📐', '</>', '✓', '🎧'];
    let pIdx = 0;
    while ((pMatch = phaseRegex.exec(phaseHtml)) !== null) {
      phases.push({
        num: `Phase ${pMatch[1]}`,
        duration: pMatch[2].trim(),
        title: stripHtml(pMatch[3]),
        desc: stripHtml(pMatch[4]),
        icon: icons[pIdx % icons.length],
        green: (pIdx === 1 || pIdx === 3)
      });
      pIdx++;
    }

    // Fallback if not extracted from LLM
    if (phases.length === 0) {
      if (domainName.includes('Real Estate')) {
        phases = [
          { num: "Phase 1", title: "Brokerage Workflow & MLS Audit", duration: "1-2 Weeks", icon: "📋", green: false },
          { num: "Phase 2", title: "Real Estate Architecture & Vector Pipeline", duration: "2-3 Weeks", icon: "📐", green: true },
          { num: "Phase 3", title: "Agent Mesh & DocuSign Connector", duration: "6-8 Weeks", icon: "</>", green: false },
          { num: "Phase 4", title: "Agent Pilot & Broker Shadowing", duration: "2-3 Weeks", icon: "✓", green: true },
          { num: "Phase 5", title: "Enterprise Brokerage Rollout", duration: "Ongoing", icon: "🎧", green: false }
        ];
      } else if (domainName.includes('Insurance')) {
        phases = [
          { num: "Phase 1", title: "Discovery & Policy Audit", duration: "1-2 Weeks", icon: "📋", green: false },
          { num: "Phase 2", title: "Guidewire & LLM Architecture", duration: "2-3 Weeks", icon: "📐", green: true },
          { num: "Phase 3", title: "Agent Mesh & FNOL Integration", duration: "6-8 Weeks", icon: "</>", green: false },
          { num: "Phase 4", title: "Security & Adjuster Pilot", duration: "2-3 Weeks", icon: "✓", green: true },
          { num: "Phase 5", title: "Enterprise Rollout & Optimization", duration: "Ongoing", icon: "🎧", green: false }
        ];
      } else if (domainName.includes('Banking') || domainName.includes('FinTech')) {
        phases = [
          { num: "Phase 1", title: "Security & Regulatory Audit", duration: "1-2 Weeks", icon: "📋", green: false },
          { num: "Phase 2", title: "VPC & Architecture Design", duration: "2-3 Weeks", icon: "📐", green: true },
          { num: "Phase 3", title: "Core Banking & Agent Ingestion", duration: "6-8 Weeks", icon: "</>", green: false },
          { num: "Phase 4", title: "Underwriting Shadowing & QA", duration: "2-3 Weeks", icon: "✓", green: true },
          { num: "Phase 5", title: "Production Rollout & Auditing", duration: "Ongoing", icon: "🎧", green: false }
        ];
      } else if (domainName.includes('Healthcare')) {
        phases = [
          { num: "Phase 1", title: "Clinical Intake & HIPAA Audit", duration: "1-2 Weeks", icon: "📋", green: false },
          { num: "Phase 2", title: "EHR/FHIR Architecture Design", duration: "2-3 Weeks", icon: "📐", green: true },
          { num: "Phase 3", title: "Triage & Scheduling Agent Mesh", duration: "6-8 Weeks", icon: "</>", green: false },
          { num: "Phase 4", title: "Clinical Shadowing & Validation", duration: "2-3 Weeks", icon: "✓", green: true },
          { num: "Phase 5", title: "Hospital Rollout & Monitoring", duration: "Ongoing", icon: "🎧", green: false }
        ];
      } else if (domainName.includes('E-commerce')) {
        phases = [
          { num: "Phase 1", title: "Discovery & Planning", duration: "1-2 Weeks", icon: "📋", green: false },
          { num: "Phase 2", title: "Design & Architecture", duration: "2-3 Weeks", icon: "📐", green: true },
          { num: "Phase 3", title: "Development & Integration", duration: "6-8 Weeks", icon: "</>", green: false },
          { num: "Phase 4", title: "Testing & Deployment", duration: "2-3 Weeks", icon: "✓", green: true },
          { num: "Phase 5", title: "Support & Optimization", duration: "Ongoing", icon: "🎧", green: false }
        ];
      } else {
        phases = [
          { num: "Phase 1", title: "Discovery & Workflow Audit", duration: "1-2 Weeks", icon: "📋", green: false },
          { num: "Phase 2", title: "Architecture & Wireframing", duration: "2-3 Weeks", icon: "📐", green: true },
          { num: "Phase 3", title: "ERP Integration & Agent Mesh", duration: "6-8 Weeks", icon: "</>", green: false },
          { num: "Phase 4", title: "Testing & Pilot Deployment", duration: "2-3 Weeks", icon: "✓", green: true },
          { num: "Phase 5", title: "Rollout & Ongoing Support", duration: "Ongoing", icon: "🎧", green: false }
        ];
      }
    }

    // 6. Cost breakdown and Headcount (Priority 1: Extract from Section 5 & 6; Priority 2: Domain-synthesized)
    const sec5Match = html.match(/<h3>5\.\s*Tailored Cost Breakdown[^<]*<\/h3>([\s\S]*?)(?:<h3>|$)/i);
    const costHtml = sec5Match ? sec5Match[1] : html;
    
    const costRegex = /<li>\s*<strong>([^<($]+)\s*\(([^)]+)\)\s*:?<\/strong>\s*:?\s*([^<]+)<\/li>/gi;
    let cMatch;
    const extractedCosts = [];
    let extractedTotalCost = 0;
    while ((cMatch = costRegex.exec(costHtml)) !== null) {
      const comp = stripHtml(cMatch[1]);
      const costStr = cMatch[2].trim();
      const desc = stripHtml(cMatch[3]);

      // Parse cost safely: if range like "$22,000–$32,000" or "$22,000-$32,000", average the low and high
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

      // Sanity clamp: single IT solution component should be between $1,000 and $150,000
      if (numVal > 150000) {
        numVal = 32000;
      }

      if (comp && numVal > 0) {
        extractedCosts.push({
          comp: comp,
          desc: desc,
          baseCost: numVal
        });
        extractedTotalCost += numVal;
      }
    }

    // Extract Human Intelligence from Section 6
    const sec6Match = html.match(/<h3>6\.\s*Human Intelligence Allocation[^<]*<\/h3>([\s\S]*?)(?:<h3>|$)/i);
    const humanHtml = sec6Match ? sec6Match[1] : html;

    const humanRegex = /<li>\s*<strong>([^<:]+):?<\/strong>\s*:?\s*([^<]+)<\/li>/gi;
    let hMatch;
    const extractedHumans = [];
    while ((hMatch = humanRegex.exec(humanHtml)) !== null) {
      const role = stripHtml(hMatch[1]);
      const fullText = stripHtml(hMatch[2]);
      const hoursMatch = fullText.match(/\(?(\d+)\s*hours?\.?\)?/i);
      if (hoursMatch) {
        const effortHours = hoursMatch[1];
        const cleanResp = fullText.replace(/\(?\d+\s*hours?\.?\)?/i, '').trim().replace(/[.,]$/, '');
        extractedHumans.push({
          role: role,
          resp: cleanResp || fullText,
          effort: effortHours
        });
      }
    }

    const agentCount = extractedAgents.length || 3;
    let costItems = [];
    let totalCost = 67500;
    let humanIntelligence = [];

    if (extractedCosts.length >= 3) {
      costItems = extractedCosts;
      totalCost = extractedTotalCost;
    } else if (domainName.includes('Real Estate')) {
      costItems = [
        { comp: "Real Estate Agent Mesh", desc: `Development of ${agentCount} real estate & MLS agents`, baseCost: 29500 },
        { comp: "MLS, IDX & DocuSign Integration", desc: "Bidirectional MLS board feeds, transaction coordinator sync", baseCost: 17400 },
        { comp: "Cloud & Image Hosting Infrastructure", desc: "Private cloud setup with listing embeddings (3 months)", baseCost: 9200 },
        { comp: "Brokerage & Buyer Portal UI", desc: "Operator workbench, client viewing scheduler, and mobile web UI", baseCost: 6800 },
        { comp: "Fair Housing & Regulatory QA", desc: "Automated bias auditing, penetration testing, and compliance", baseCost: 5500 },
        { comp: "Project Management & Training", desc: "Broker onboarding, technical coordination, and SLA governance", baseCost: 5000 }
      ];
      totalCost = 73400;
    } else if (domainName.includes('Insurance')) {
      costItems = [
        { comp: "Insurance AI Agent Mesh", desc: `Development of ${agentCount} Insurance AI Agents`, baseCost: 28000 },
        { comp: "Core Systems Integration", desc: "Integration with Guidewire / Duck Creek / policy databases", baseCost: 16000 },
        { comp: "Cloud & Security Infrastructure", desc: "Private HIPAA/SOC-2 compliant VPC (3 months)", baseCost: 9500 },
        { comp: "UI/UX & Adjuster Portal", desc: "Claims review dashboard, audit view, and operator interface", baseCost: 6500 },
        { comp: "Testing & Regulatory QA", desc: "Model hallucination safeguards and penetration testing", baseCost: 5000 },
        { comp: "Project Management", desc: "Project governance, technical coordination and reporting", baseCost: 5000 }
      ];
      totalCost = 70000;
    } else {
      costItems = [
        { comp: "AI Agent Development", desc: `Development of ${agentCount} dedicated AI Agents`, baseCost: 26000 },
        { comp: "System Integration", desc: "Integration with existing enterprise systems & APIs", baseCost: 16000 },
        { comp: "Cloud & Infrastructure", desc: "Private cloud setup and ongoing compute (3 months)", baseCost: 9000 },
        { comp: "UI/UX Design", desc: "User interface, operator console, and experience design", baseCost: 6500 },
        { comp: "Testing & QA", desc: "Security validation, regression, and quality assurance", baseCost: 5000 },
        { comp: "Project Management", desc: "Project management, agile sprints, and handover", baseCost: 5000 }
      ];
      totalCost = 67500;
    }

    if (extractedHumans.length >= 3) {
      humanIntelligence = extractedHumans;
    } else if (domainName.includes('Real Estate')) {
      humanIntelligence = [
        { role: "Project Manager", resp: "Real estate sprint governance and brokerage executive reporting", effort: "80" },
        { role: "PropTech Solutions Architect", resp: "MLS integration mapping and transaction workflow topology", effort: "75" },
        { role: "AI/ML Engineer", resp: "Listing embedding search, fine-tuning, and prompt safety guardrails", effort: "135" },
        { role: "Backend Integration Engineer", resp: "Lockbox APIs, DocuSign webhooks, and CRM data pipelines", effort: "155" },
        { role: "Frontend UX Developer", resp: "Broker dashboard and client-facing viewing scheduler", effort: "80" },
        { role: "QA & Compliance Specialist", resp: "Fair Housing compliance auditing and security QA", effort: "80" },
        { role: "Support & DevOps Lead", resp: "Cloud deployment and real-time listing feed monitoring", effort: "40" }
      ];
    } else if (domainName.includes('Insurance')) {
      humanIntelligence = [
        { role: "Project Manager", resp: "Project planning, coordination and reporting", effort: "80" },
        { role: "Insurance Solutions Analyst", resp: "Policy workflow mapping and acceptance testing", effort: "65" },
        { role: "AI/ML Engineer", resp: "Agent fine-tuning, RAG indexing and prompt safety", effort: "130" },
        { role: "Backend Integration Engineer", resp: "Policy database APIs and webhook pipelines", effort: "150" },
        { role: "Frontend Developer", resp: "Operator workbench and customer service UI", effort: "80" },
        { role: "QA & Compliance Engineer", resp: "SOC-2/NAIC compliance testing and quality assurance", effort: "80" },
        { role: "Support Engineer", resp: "Deployment and post-launch support", effort: "40" }
      ];
    } else {
      humanIntelligence = [
        { role: "Project Manager", resp: "Project planning, coordination and reporting", effort: "80" },
        { role: "Enterprise Solution Architect", resp: "Oversees topology, agent guardrails, and enterprise integration", effort: "75" },
        { role: "AI/ML Engineer", resp: "Model prompt tuning, agent orchestration, and evaluation", effort: "125" },
        { role: "Backend Developer", resp: "System connectors, database pipelines, and webhook APIs", effort: "155" },
        { role: "Frontend Developer", resp: "Operator dashboard and UI integration", effort: "80" },
        { role: "QA Engineer", resp: "Testing and compliance quality assurance", effort: "80" },
        { role: "Support Engineer", resp: "Deployment and post-launch support", effort: "40" }
      ];
    }

    return {
      solutionName: solutionName,
      preparedFor: targetOrg,
      domainName: domainName,
      solutionPlan: {
        title: "Business Solution & Delivery Plan",
        executiveSummary: execSummary || `This tailored solution deploys autonomous AI agents to automate core operational processes. Engineered on Active Brains enterprise principles, the system drastically cuts administrative overhead, accelerates turnaround, and provides verifiable auditability.`,
        scope: scope,
        phases: phases,
        costItems: costItems,
        totalCost: totalCost,
        humanIntelligence: humanIntelligence
      }
    };
  }


  function generateDynamicSolution(promptText, modelName, rawLiveAiOutput = null) {
    let responseAi = {};
    let solutionPlan = null;
    let solutionName = "";
    let preparedFor = "";
    let domainName = "";

    if (rawLiveAiOutput) {
      const formattedOutput = formatExecutiveAiResponse(rawLiveAiOutput);
      const parsedAiSolution = parseLiveAiToTailoredSolution(formattedOutput, promptText, modelName);
      
      domainName = parsedAiSolution.domainName;
      solutionName = parsedAiSolution.solutionName;
      preparedFor = parsedAiSolution.preparedFor;
      solutionPlan = parsedAiSolution.solutionPlan;

      // If scope wasn't parsed from HTML, fall back to semantic analyzer
      if (!solutionPlan.scope || solutionPlan.scope.length === 0) {
        const fallbackAnalysis = analyzeBusinessPrompt(promptText);
        const fallbackPlan = buildActiveBrainsSolutionPlan(fallbackAnalysis, promptText);
        solutionPlan.scope = fallbackPlan.scope;
      }

      responseAi = {
        title: `${solutionName} - Strategic Architecture`,
        sections: [
          {
            title: `Enterprise ${modelName} Solution Architecture`,
            body: formattedOutput
          }
        ]
      };
    } else {
      const analysis = analyzeBusinessPrompt(promptText);
      domainName = analysis.domainName;
      solutionName = `${analysis.domainName} Solution`;
      preparedFor = analysis.targetOrg;
      responseAi = buildModelPerspectiveResponse(analysis, modelName, promptText);
      solutionPlan = buildActiveBrainsSolutionPlan(analysis, promptText);
    }

    currentSolution = {
      prompt: promptText,
      modelName: modelName,
      domain: domainName,
      meta: {
        solutionName: solutionName,
        preparedFor: preparedFor,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        preparedBy: "AB Agent Studio"
      },
      responseAi: responseAi,
      solutionPlan: solutionPlan
    };

    renderCurrentSolution();
    addSolutionToHistory(currentSolution);
  }

  /**
   * Semantic Analysis of custom user input (fully dynamic and customer-tailored)
   */
  function derivePromptTopic(promptText) {
    if (!promptText || !promptText.trim()) return "Enterprise AI";
    let clean = promptText.trim()
      .replace(/^(?:please\s+)?(?:design|build|create|develop|generate|architect)\s+(?:an?\s+)?(?:ai\s+|customer\s+service\s+|enterprise\s+)?(?:solution|system|platform|agent\s+mesh)?\s*(?:for|to)?\s*/i, "")
      .replace(/^(?:an?\s+)?(?:ai\s+|customer\s+service\s+|enterprise\s+)?(?:solution|system|platform)\s+for\s+/i, "")
      .replace(/\s*(?:agent\s+mesh|solution|platform|system|mesh)\s*$/i, "")
      .replace(/[.!?:;]+$/, "")
      .trim();
    return clean.replace(/\b\w/g, c => c.toUpperCase()) || "Tailored Enterprise AI";
  }

  function analyzeBusinessPrompt(text) {
    const t = text.toLowerCase();
    const topic = derivePromptTopic(text);
    const words = topic.split(/\s+/).filter(Boolean);
    const primaryToken = words.slice(0, 2).join(" ");
    const secondaryToken = words.length > 2 ? words.slice(-2).join(" ") : words[0];

    let domainName = `${topic} Solution`;
    let targetOrg = `${topic} Enterprise`;
    let agents = [];
    let modules = [];
    let baseMultiplier = 1.15;

    // Domain-specialized templates if explicit match, otherwise 100% dynamic token synthesis
    if (t.includes('capital pooling') || t.includes('asset management') || t.includes('treasury') || t.includes('fund')) {
      domainName = "Capital Pooling & Asset Management";
      targetOrg = "Asset Management & Treasury Enterprise";
      baseMultiplier = 1.35;
      agents = [
        { name: "Liquidity Optimization Agent", role: "Real-time cash sweep execution, intercompany pooling, and yield optimization algorithms." },
        { name: "Asset Allocation & Portfolio Agent", role: "Autonomous risk-weighted rebalancing, valuation simulations, and yield modeling." },
        { name: "Compliance & Regulatory Sentinel", role: "Continuous KYC/AML screening, capital adequacy audits, and Basel III reporting." }
      ];
      modules = [
        { name: "Liquidity Optimization", desc: "Automated sweeps, pooling, and multi-currency liquidity balancing", features: "Real-time Fix/SWIFT sync, multi-currency ledger hooks" },
        { name: "Portfolio Asset Management", desc: "Real-time fund valuation, rebalancing triggers, and yield analytics", features: "Custodial databases, PMS feeds, risk matrices" },
        { name: "Regulatory Compliance", desc: "Autonomous sanctions checking, KYC/AML screening, and audit logs", features: "Sanctions databases, immutable compliance ledgers" }
      ];
    } else if (t.includes('real estate') || t.includes('property') || t.includes('tenant') || t.includes('mls') || t.includes('broker')) {
      domainName = "Real Estate & Property Management";
      targetOrg = "Enterprise Real Estate Brokerage";
      baseMultiplier = 1.15;
      agents = [
        { name: "Listing & MLS Query Agent", role: "Natural language search across MLS/IDX boards with multi-criteria filtering." },
        { name: "Viewing & Escrow Coordinator", role: "Autonomous tour scheduling, lockbox credential dispatch, and buyer follow-ups." },
        { name: "Transaction & Lease Agent", role: "Automated lease drafting, disclosure checklist validation, and e-signatures." }
      ];
      modules = [
        { name: "Property Discovery", desc: "Semantic listing lookup and automated buyer matching", features: "RESO Web API, vector embeddings of listings" },
        { name: "Tour Coordination", desc: "Automated scheduling, calendar sync, and identity verification", features: "Calendly/Google Calendar APIs, SMS gateways" },
        { name: "Digital Closing", desc: "Automated document generation and compliance audit trails", features: "DocuSign/HelloSign APIs, document parsing" }
      ];
    } else if (t.includes('insurance') || t.includes('claim') || t.includes('policy') || t.includes('underwrit')) {
      domainName = "Insurance AI Agent";
      targetOrg = "Insurance Enterprise Client";
      baseMultiplier = 1.2;
      agents = [
        { name: "FNOL Intake & Triage Agent", role: "Omnichannel claims ingestion, photo damage classification, and fraud pre-scoring." },
        { name: "Policy Verification Agent", role: "Instantaneous coverage entitlement checks, deductible validation, and limits review." },
        { name: "Underwriting & Adjudication Agent", role: "Real-time risk scoring, applicant history cross-checks, and repair rating." }
      ];
      modules = [
        { name: "FNOL Intake & Telemetry", desc: "Automated FNOL intake, fraud telemetry, and damage assessment", features: "FNOL Intake, Photo Evidence Validation, Severity Routing" },
        { name: "Policy Administration", desc: "Automated policy renewals, endorsements, and customer inquiries", features: "Real-time Policy Query, Endorsements, Automated Validation" },
        { name: "Underwriting Support", desc: "Risk parameter validation, registry cross-checks, and rating", features: "Actuarial Data Ingestion, Fraud Check, Automated Risk Scoring" }
      ];
    } else if (t.includes('tablet') || (t.includes('factory') && (t.includes('manufactur') || t.includes('administrative') || t.includes('quote')))) {
      domainName = "Tablet Manufacturing & Plant Administration";
      targetOrg = "Tablet Manufacturing Factory";
      baseMultiplier = 1.25;
      agents = [
        { name: "Administrative Process & ERP Agent", role: "Automated quotation generation, invoice reconciliation, and procurement sign-offs." },
        { name: "Bill of Materials (BOM) & Inventory Agent", role: "Real-time tablet components tracking (SoC, displays, batteries, chassis) and supplier orders." },
        { name: "Plant Floor Compliance & QA Agent", role: "ISO 9001 compliance audit trails, shift handovers, and administrative labor tracking." }
      ];
      modules = [
        { name: "Administrative Quotation & Billing", desc: "Automated RFQ processing, vendor quoting, and finance administration", features: "Automated RFQ Parsing, Cost Modeler, ERP Connectors" },
        { name: "BOM & Component Supply Chain", desc: "Tablet hardware component telemetry, lead time tracking, and auto-replenish", features: "Component Serial Tracking, Supplier Catalog Sync" },
        { name: "Regulatory & Quality Governance", desc: "Digital administrative records, device serialization, and warranty dispatch", features: "ISO 9001 Audit Logs, Quality Telemetry" }
      ];
    } else if (t.includes('health') || t.includes('clinic') || t.includes('hospital') || t.includes('doctor') || t.includes('patient')) {
      domainName = "Healthcare & Clinical Systems";
      targetOrg = "Healthcare Enterprise";
      baseMultiplier = 1.25;
      agents = [
        { name: "Patient Triage Agent", role: "Symptom intake, urgency categorization, and clinical routing." },
        { name: "Clinical Scheduling Agent", role: "Doctor rota balancing, patient appointment booking, and reminders." },
        { name: "EHR Integration Agent", role: "FHIR/HL7 sync, secure record indexing, and HIPAA/NHS compliance." }
      ];
      modules = [
        { name: "Patient Intake & Triage", desc: "Automated clinical triage and risk classification", features: "Symptom Checker, Triage Protocol, Urgent Routing" },
        { name: "Practitioner Scheduling", desc: "Intelligent scheduling matching patient acuity with specialists", features: "Calendar Balancing, Smart Reminders, Rota Sync" },
        { name: "Health Record Interop", desc: "Secure encrypted sync with existing EHR/EMR databases", features: "FHIR/HL7 Encrypted Transport, Zero-Trust Storage" }
      ];
    } else if (t.includes('bank') || t.includes('financ') || t.includes('loan') || t.includes('credit') || t.includes('fca') || t.includes('kyc') || t.includes('aml')) {
      domainName = "Banking & FinTech";
      targetOrg = "Financial Institution";
      baseMultiplier = 1.4;
      agents = [
        { name: "Underwriting & Credit Agent", role: "Real-time financial statement ingestion and credit score assessment." },
        { name: "Fraud & AML Telemetry Agent", role: "Continuous graph transaction anomaly detection." },
        { name: "Regulatory Compliance Sentinel", role: "Automated FCA/GDPR audit trail generation and policy checks." }
      ];
      modules = [
        { name: "Credit Decisioning", desc: "Autonomous document verification and underwriting approval", features: "Real-time Ingestion, Credit Scoring, Risk Trees" },
        { name: "Fraud Telemetry", desc: "Sub-second transaction risk evaluation", features: "Graph Anomaly Detection, Blacklist Checks" },
        { name: "Regulatory Governance", desc: "Explainable compliance logs and audit verification", features: "FCA/GDPR Audit Trails, Zero-Knowledge Verification" }
      ];
    } else if (t.includes('logistic') || t.includes('freight') || t.includes('shipping') || t.includes('warehouse') || t.includes('delivery') || t.includes('fleet')) {
      domainName = "Logistics & Supply Chain";
      targetOrg = "Supply Chain Operations";
      baseMultiplier = 1.15;
      agents = [
        { name: "Route Optimization Agent", role: "Dynamic GPS and traffic-aware dispatch route calculation." },
        { name: "Warehouse Stock Agent", role: "Real-time RFID/barcode tracking and automated restocking." },
        { name: "Carrier Dispatch Agent", role: "Automated consignment booking and carrier rate negotiation." }
      ];
      modules = [
        { name: "Dynamic Fleet Routing", desc: "Real-time fuel and traffic route optimization", features: "GPS Telemetry, Multi-stop TSP Routing" },
        { name: "Warehouse Automation", desc: "Inventory telemetry, bin assignment, and dispatch staging", features: "RFID Tracking, Reorder Automation" },
        { name: "Carrier Engagement", desc: "Automated carrier dispatch hooks and exception reporting", features: "Rate Engine, Consignment API Sync" }
      ];
    } else {
      // 100% Dynamic Topic Synthesis for ANY custom user prompt
      domainName = `${topic} Solution`;
      targetOrg = `${topic} Enterprise`;
      baseMultiplier = 1.15;
      agents = [
        {
          name: `${primaryToken} Orchestration Agent`,
          role: `Autonomous intake, semantic intent verification, and cognitive event routing for ${topic.toLowerCase()}.`
        },
        {
          name: `${secondaryToken} Execution & Integration Agent`,
          role: `Straight-through execution, transactional consistency checks, and core systems synchronization.`
        },
        {
          name: `${words[0]} Intelligence & Compliance Sentinel`,
          role: `Continuous policy enforcement, zero-trust cryptographic audit trails, and SLA anomaly alerts.`
        }
      ];
      modules = [
        {
          name: `${primaryToken} Workflow Engine`,
          desc: `Automated intake, routing, and real-time event pipeline for ${topic.toLowerCase()}`,
          features: "Real-time Event Hooks, Intent Classification, Dead-letter Queues"
        },
        {
          name: `${secondaryToken} Integration Suite`,
          desc: `Direct bidirectional connectors and secure enterprise API sync`,
          features: "REST/GraphQL Webhooks, Microservices Mesh, Atomic Ledger Sync"
        },
        {
          name: "Security & Regulatory Governance",
          desc: `Compliance telemetry, automated audit logs, and exception routing`,
          features: "SOC 2 / GDPR Telemetry, Role-Based Access, Immutable Logs"
        }
      ];
    }

    return { domainName, targetOrg, topic, agents, modules, baseMultiplier };
  }

  function buildModelPerspectiveResponse(analysis, modelName, promptText) {
    let modelTone = "";
    if (modelName.includes("Claude")) {
      modelTone = "Deterministic state trees, boundary verification, and administrative safety compliance.";
    } else if (modelName.includes("GPT-4o")) {
      modelTone = "Event-driven microservices, real-time tool calling, and ERP API connectors.";
    } else if (modelName.includes("Gemini")) {
      modelTone = "High-context multimodal ingestion of technical factory diagrams and vendor quotation PDFs.";
    } else {
      modelTone = "Cost-optimized open-weights reasoning with dedicated inference containerization.";
    }

    const agentsListHtml = analysis.agents.map(a => `
      <li><strong>${a.name}:</strong> ${a.role}</li>
    `).join('');

    return {
      title: `${analysis.domainName} AI Architecture & Agent Specification`,
      sections: [
        {
          title: `1. Strategic Architecture (${modelName})`,
          body: `Synthesized for your operational requirement: <em>"${promptText.substring(0, 160)}${promptText.length > 160 ? '...' : ''}"</em>. This solution provides autonomous orchestration across administrative and production pipelines with human-in-the-loop validation checkpoints.`
        },
        {
          title: `2. Designated Autonomous Agents`,
          body: `<ul>${agentsListHtml}</ul>`
        },
        {
          title: `3. Technology Stack & Deployment Strategy`,
          body: `<p><strong>Model Engine:</strong> ${modelName} (${modelTone})</p>
          <ul style="margin-top: 6px;">
            <li><strong>Runtime:</strong> Secure sovereign cloud VPC or on-premise container cluster (OpenShift / Kubernetes)</li>
            <li><strong>ERP Integration:</strong> REST webhooks and SAP / Dynamics 365 / Oracle financial connectors</li>
            <li><strong>Data Governance:</strong> Role-based access control (RBAC), end-to-end encrypted telemetry, and ISO audit logging</li>
          </ul>`
        }
      ]
    };
  }

  function buildActiveBrainsSolutionPlan(analysis, promptText) {
    const costMult = analysis.baseMultiplier || 1.15;
    const topic = analysis.topic || derivePromptTopic(promptText);
    const words = topic.split(/\s+/).filter(Boolean);
    const primaryToken = words.slice(0, 2).join(" ");
    const secondaryToken = words.length > 2 ? words.slice(-2).join(" ") : words[0];

    const agentDevCost = Math.round(27000 * costMult);
    const integrationCost = Math.round(16000 * costMult);
    const cloudCost = Math.round(9500 * costMult);
    const uxCost = Math.round(6500 * costMult);
    const qaCost = Math.round(5500 * costMult);
    const pmCost = Math.round(5000 * costMult);
    const totalEst = agentDevCost + integrationCost + cloudCost + uxCost + qaCost + pmCost;

    const scope = analysis.modules.map((m, idx) => {
      const assignedAgent = analysis.agents[idx] ? analysis.agents[idx].name : `${primaryToken} Autonomous Agent`;
      return {
        module: m.name,
        desc: m.desc,
        agent: assignedAgent,
        features: m.features || `Automated processing, exception routing, audit logging, and administrative escalation`
      };
    });

    const phases = [
      { num: "Phase 1", title: `${primaryToken} Discovery & Systems Audit`, duration: "1-2 Weeks", icon: "📋", green: false },
      { num: "Phase 2", title: `${topic} Topology & Architecture Design`, duration: "2-3 Weeks", icon: "📐", green: true },
      { num: "Phase 3", title: `${secondaryToken} Agent Mesh & Core Integration`, duration: "6-8 Weeks", icon: "</>", green: false },
      { num: "Phase 4", title: "Pilot Shadowing, Penetration Testing & UAT", duration: "2-3 Weeks", icon: "✓", green: true },
      { num: "Phase 5", title: `${primaryToken} Rollout & Continuous Optimization`, duration: "Ongoing", icon: "🎧", green: false }
    ];

    const costItems = [
      { comp: `${primaryToken} Agent Mesh Core`, desc: `Engineering, prompt fine-tuning, and guardrails for ${analysis.agents.length} dedicated agents`, baseCost: agentDevCost },
      { comp: `${secondaryToken} Integration Suite`, desc: `Secure enterprise connectors, transactional webhooks, and core sync`, baseCost: integrationCost },
      { comp: "Cloud Infrastructure & Private VPC", desc: "Zero-trust containerized environment, HSM encryption & monitoring", baseCost: cloudCost },
      { comp: "Operator Workbench & Portal UX", desc: "Human-in-the-loop oversight console and administrative dashboard", baseCost: uxCost },
      { comp: "Security, QA & Regulatory Auditing", desc: "Penetration testing, compliance verification (SOC 2, GDPR, ISO)", baseCost: qaCost },
      { comp: "Project Management & Enablement", desc: "Agile delivery governance, documentation, and operational handover", baseCost: pmCost }
    ];

    const humanIntelligence = [
      { role: "Project Manager", resp: "Sprint management, risk mitigation, and enterprise milestone reporting", effort: "80" },
      { role: `${primaryToken} Solutions Architect`, resp: "Topology governance, system boundaries, and enterprise integration", effort: `${Math.round(75 * costMult)}` },
      { role: "AI/ML Engineer", resp: "Model prompt engineering, agent orchestration, and guardrail validation", effort: `${Math.round(130 * costMult)}` },
      { role: "Backend Developer", resp: "System connectors, database pipelines, and webhook APIs", effort: `${Math.round(155 * costMult)}` },
      { role: "Frontend UX Developer", resp: "Operator dashboard, approval workbench, and user interfaces", effort: `${Math.round(85 * costMult)}` },
      { role: "QA & Compliance Engineer", resp: "Penetration testing, regulatory audits, and quality assurance", effort: `${Math.round(80 * costMult)}` },
      { role: "Support & DevOps Lead", resp: "Cloud provisioning, CI/CD pipelines, and telemetry monitoring", effort: "40" }
    ];

    const executiveSummary = `Tailored specifically for ${analysis.targetOrg}, this enterprise solution establishes an Active Brains autonomous multi-agent mesh for ${topic.toLowerCase()}. Engineered for resilient enterprise operations, the platform combines real-time system integration, explainable decision guardrails, and cryptographic auditability to deliver measurable operational acceleration while strictly maintaining regulatory compliance.`;

    const technicalArchitecture = {
      overview: `The solution is architected upon a resilient, zero-trust cloud-native microservices foundation orchestrated via Kubernetes. Specialized API gateways and high-throughput streaming buses interface with existing client enterprise cores with end-to-end encryption.`,
      components: [
        `Multi-agent mesh runtime with isolated sandboxing and deterministic state transitions`,
        `Hybrid RAG pipeline combining vector embeddings and keyword indexes for sub-second retrieval`,
        `Dedicated private VPC with Hardware Security Module (HSM) envelope encryption`
      ],
      security: [
        `AES-256 at rest, TLS 1.3 in transit with customer-managed keys (CMK)`,
        `Role-Based Access Control (RBAC) and immutable audit logging for all autonomous operations`,
        `Compliance safeguards adhering to SOC 2 Type II, ISO 27001, and regional data privacy standards`
      ]
    };

    const assumptions = [
      `Client enterprise will provide staging sandbox credentials and API specifications during Phase 1.`,
      `Core record-keeping systems support asynchronous webhooks or RESTful connectivity for bidirectional synchronization.`,
      `Designated operational stakeholders will participate in scheduled bi-weekly sprint reviews and UAT validation.`
    ];

    const businessOutcomes = [
      `Target 65%+ reduction in manual operational processing times and inquiry backlogs.`,
      `Sub-second automated decision validation with zero-latency data synchronization.`,
      `Complete cryptographic auditability and explainable AI decision tracking across all workflows.`
    ];

    return {
      title: "Business Solution & Delivery Plan",
      executiveSummary: executiveSummary,
      technicalArchitecture: technicalArchitecture,
      scope: scope,
      phases: phases,
      costItems: costItems,
      totalCost: totalEst,
      humanIntelligence: humanIntelligence,
      assumptions: assumptions,
      businessOutcomes: businessOutcomes
    };
  }

  function renderCurrentSolution() {
    if (!currentSolution) return;
    const sol = currentSolution;

    // Left Panel
    const aiTitle = document.getElementById('ai-response-title');
    const aiContent = document.getElementById('ai-response-content');
    const responseModelTag = document.getElementById('response-model-tag');
    const responseHeaderTag = document.getElementById('response-header-tag');

    if (aiTitle) aiTitle.textContent = sol.responseAi.title;
    if (responseModelTag) responseModelTag.textContent = `Response generated for ${sol.modelName} by Active Brains Engine`;
    if (responseHeaderTag) responseHeaderTag.textContent = `${sol.modelName} Response`;

    if (aiContent) {
      let html = '';
      sol.responseAi.sections.forEach(s => {
        html += `<h3>${s.title}</h3><div>${s.body}</div>`;
      });
      aiContent.innerHTML = html;
    }

    // Right Panel
    const metaSolName = document.getElementById('meta-sol-name');
    const metaClient = document.getElementById('meta-client');
    const metaDate = document.getElementById('meta-date');
    const metaBy = document.getElementById('meta-by');
    const planExecSummary = document.getElementById('plan-exec-summary');

    if (metaSolName) metaSolName.textContent = sol.meta.solutionName;
    if (metaClient) metaClient.textContent = sol.meta.preparedFor;
    if (metaDate) metaDate.textContent = sol.meta.date;
    if (metaBy) metaBy.textContent = sol.meta.preparedBy;
    if (planExecSummary) planExecSummary.textContent = sol.solutionPlan.executiveSummary;

    // Scope Table
    const scopeTbody = document.getElementById('scope-table-body');
    if (scopeTbody) {
      scopeTbody.innerHTML = sol.solutionPlan.scope.map(sc => `
        <tr>
          <td><strong style="color: var(--studio-text-main);">${sc.module}</strong></td>
          <td>${sc.desc}</td>
          <td>${sc.agent}</td>
          <td>${sc.features}</td>
        </tr>
      `).join('');
    }

    // Phases & Granular Deliverables
    const phasesContainer = document.getElementById('delivery-phases-container');
    const phaseDetailsContainer = document.getElementById('phase-details-container');

    if (phasesContainer) {
      let phaseHtml = '';
      sol.solutionPlan.phases.forEach((p, idx) => {
        phaseHtml += `
          <div class="flow-step-box ${p.green ? 'green' : ''}">
            <span class="flow-step-phase">${p.num}</span>
            <span class="flow-step-title">${p.title}</span>
            <span class="flow-step-duration">${p.icon} (${p.duration})</span>
          </div>
        `;
        if (idx < sol.solutionPlan.phases.length - 1) {
          phaseHtml += `<span class="flow-arrow">→</span>`;
        }
      });
      phasesContainer.innerHTML = phaseHtml;
    }

    if (phaseDetailsContainer) {
      phaseDetailsContainer.innerHTML = `
        <table class="studio-table" aria-label="Phase Deliverables Matrix">
          <thead>
            <tr>
              <th style="width: 15%;">Phase</th>
              <th style="width: 25%;">Focus &amp; Milestones</th>
              <th style="width: 15%;">Duration</th>
              <th style="width: 45%;">Activities &amp; Key Deliverables</th>
            </tr>
          </thead>
          <tbody>
            ${sol.solutionPlan.phases.map(p => `
              <tr>
                <td><strong>${p.num}</strong></td>
                <td><strong style="color: var(--studio-text-main);">${p.title}</strong></td>
                <td>${p.duration}</td>
                <td>${p.desc || p.deliverables || 'Architecture baseline, testing validation, security criteria, and operational sign-off.'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    // Technical Architecture & Security Summary
    const techSummaryContainer = document.getElementById('tech-architecture-summary-container');
    if (techSummaryContainer && sol.solutionPlan.technicalArchitecture) {
      const ta = sol.solutionPlan.technicalArchitecture;
      techSummaryContainer.innerHTML = `
        <h3 class="plan-section-title">4. Technical Architecture, Security &amp; Governance</h3>
        <p class="plan-lead-p">${ta.overview}</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 10px;">
          <div style="background: var(--studio-surface-alt, #f8fafc); border: 1px solid var(--studio-border, #e2e8f0); border-radius: var(--studio-radius-sm); padding: 12px 14px;">
            <strong style="font-size: 0.8125rem; color: #16a34a; display: block; margin-bottom: 6px; text-transform: uppercase;">Technical Foundation &amp; Topology</strong>
            <ul style="font-size: 0.8rem; line-height: 1.5; color: var(--studio-text-main); padding-left: 18px;">
              ${ta.components.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
          <div style="background: var(--studio-surface-alt, #f8fafc); border: 1px solid var(--studio-border, #e2e8f0); border-radius: var(--studio-radius-sm); padding: 12px 14px;">
            <strong style="font-size: 0.8125rem; color: #16a34a; display: block; margin-bottom: 6px; text-transform: uppercase;">Security, Compliance &amp; Audit Controls</strong>
            <ul style="font-size: 0.8rem; line-height: 1.5; color: var(--studio-text-main); padding-left: 18px;">
              ${ta.security.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }

    // Cost Table
    const costTbody = document.getElementById('cost-table-body');
    const totalCostEl = document.getElementById('total-cost-val');
    const costColHeader = document.getElementById('cost-col-header');
    const currMeta = CURRENCY_MAP[currentCurrency] || CURRENCY_MAP.USD;

    if (costColHeader) {
      costColHeader.textContent = `Estimated Cost (${currMeta.code})`;
    }

    if (costTbody) {
      costTbody.innerHTML = sol.solutionPlan.costItems.map(c => {
        const costNum = c.baseCost || (typeof c.cost === 'string' ? Number(c.cost.replace(/[^0-9.]/g, '')) : c.cost) || 0;
        const formattedCost = formatCurrencyAmount(costNum, currentCurrency);
        return `
        <tr>
          <td><strong style="color: var(--studio-text-main);">${c.comp}</strong></td>
          <td>${c.desc}</td>
          <td style="font-weight: 600; color: var(--studio-text-main); text-align: right;">${formattedCost}</td>
        </tr>
      `;
      }).join('');
    }

    if (totalCostEl) {
      const totalNum = typeof sol.solutionPlan.totalCost === 'number'
        ? sol.solutionPlan.totalCost
        : Number(String(sol.solutionPlan.totalCost).replace(/[^0-9.]/g, '')) || 0;
      totalCostEl.textContent = formatCurrencyAmount(totalNum, currentCurrency);
    }

    // Human Intelligence Table
    const humanTbody = document.getElementById('human-table-body');
    if (humanTbody) {
      humanTbody.innerHTML = sol.solutionPlan.humanIntelligence.map(h => `
        <tr>
          <td><strong style="color: var(--studio-text-main);">${h.role}</strong></td>
          <td>${h.resp}</td>
          <td style="text-align: right; font-weight: 600; color: var(--studio-text-main);">${h.effort}</td>
        </tr>
      `).join('');
    }

    // Assumptions and Business Outcomes Lists
    const assumptionsList = document.getElementById('plan-assumptions-list');
    const outcomesList = document.getElementById('plan-outcomes-list');

    if (assumptionsList) {
      const assumptions = sol.solutionPlan.assumptions || [
        "Client enterprise will provide secure API credentials and sandbox environments.",
        "Core systems support RESTful or event-driven webhook connectors.",
        "Subject matter experts will participate in bi-weekly design reviews and UAT validation."
      ];
      assumptionsList.innerHTML = assumptions.map(a => `<li>${a}</li>`).join('');
    }

    if (outcomesList) {
      const outcomes = sol.solutionPlan.businessOutcomes || [
        "Target 65%+ reduction in operational inquiry and exception handling backlog.",
        "Sub-second automated validation with complete ledger synchronization.",
        "Verifiable cryptographic auditability across all autonomous agent decisions."
      ];
      outcomesList.innerHTML = outcomes.map(o => `<li>${o}</li>`).join('');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
