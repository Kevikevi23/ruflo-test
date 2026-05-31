import { hospital } from './scenarios/hospital.js';
import { creditUnion } from './scenarios/credit-union.js';
import { waterUtility } from './scenarios/water-utility.js';

const SCENARIOS = { hospital, 'credit-union': creditUnion, 'water-utility': waterUtility };
const STORAGE_KEY = 'oic_drill_state';
const TICK_MS = 1000; // 1 real second = 1 simulated minute

// --- State ---
let state = null;
let timerInterval = null;

// --- DOM refs ---
const views = {
  select: document.getElementById('view-select'),
  game: document.getElementById('view-game'),
  end: document.getElementById('view-end')
};
const el = {
  cards: document.getElementById('scenario-cards'),
  resumeBanner: document.getElementById('resume-banner'),
  btnResume: document.getElementById('btn-resume'),
  btnDiscard: document.getElementById('btn-discard'),
  clock: document.getElementById('clock'),
  budget: document.getElementById('budget'),
  scoreC: document.getElementById('score-c'),
  scoreT: document.getElementById('score-t'),
  scoreR: document.getElementById('score-r'),
  nodeTitle: document.getElementById('node-title'),
  nodeDesc: document.getElementById('node-desc'),
  nodeOptions: document.getElementById('node-options'),
  decisionPanel: document.getElementById('decision-panel'),
  consequencePanel: document.getElementById('consequence-panel'),
  consequenceText: document.getElementById('consequence-text'),
  consequenceEffects: document.getElementById('consequence-effects'),
  btnContinue: document.getElementById('btn-continue'),
  btnLog: document.getElementById('btn-log'),
  logDrawer: document.getElementById('log-drawer'),
  logOverlay: document.getElementById('log-overlay'),
  logEntries: document.getElementById('log-entries'),
  btnExportLog: document.getElementById('btn-export-log'),
  btnCloseLog: document.getElementById('btn-close-log'),
  endGrade: document.getElementById('end-grade'),
  endScores: document.getElementById('end-scores'),
  endSummary: document.getElementById('end-summary'),
  endLetter: document.getElementById('end-letter'),
  endLog: document.getElementById('end-log'),
  btnNewDrill: document.getElementById('btn-new-drill')
};

// --- Views ---
function showView(name) {
  Object.values(views).forEach((v) => v.classList.remove('active'));
  views[name].classList.add('active');
}

// --- Formatting ---
function fmtTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function fmtMoney(amount) {
  return '$' + Math.max(0, amount).toLocaleString('en-JM');
}

function fmtElapsed(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// --- Persistence ---
function saveState() {
  if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

// --- Scenario Select ---
function renderSelectScreen() {
  el.cards.innerHTML = '';
  Object.values(SCENARIOS).forEach((sc) => {
    const card = document.createElement('div');
    card.className = 'scenario-card';
    card.innerHTML = `
      <h2>${sc.name}</h2>
      <div class="sector">${sc.sector}</div>
      <div class="incident-preview">${sc.incident}</div>
      <div class="card-meta">
        <span>${sc.recordCount.toLocaleString()} records at risk</span>
        <span>Budget: ${fmtMoney(sc.startingBudget)}</span>
        <span>${fmtTime(sc.startingTime)} on the clock</span>
      </div>
    `;
    card.addEventListener('click', () => startDrill(sc.id));
    el.cards.appendChild(card);
  });

  const saved = loadState();
  if (saved && saved.status === 'active') {
    el.resumeBanner.hidden = false;
    el.btnResume.onclick = () => { state = saved; resumeDrill(); };
    el.btnDiscard.onclick = () => { clearState(); el.resumeBanner.hidden = true; };
  } else {
    el.resumeBanner.hidden = true;
  }
}

// --- Start / Resume ---
function startDrill(scenarioId) {
  const sc = SCENARIOS[scenarioId];
  state = {
    scenarioId,
    timeRemaining: sc.startingTime,
    budget: sc.startingBudget,
    scores: { compliance: 50, containment: 50, reputation: 50 },
    currentNodeIndex: 0,
    tags: [],
    decisionLog: [],
    startedAt: new Date().toISOString(),
    status: 'active'
  };
  saveState();
  resumeDrill();
}

function resumeDrill() {
  showView('game');
  updateStatusBar();
  showCurrentNode();
  startTimer();
}

// --- Timer ---
function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    if (!state || state.status !== 'active') { stopTimer(); return; }
    state.timeRemaining = Math.max(0, state.timeRemaining - 1);
    updateClock();
    saveState();
    if (state.timeRemaining <= 0) {
      state.status = 'timed_out';
      saveState();
      stopTimer();
      endDrill();
    }
  }, TICK_MS);
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

// --- Status Bar ---
function updateStatusBar() {
  updateClock();
  updateBudget();
  updateScores();
}

function updateClock() {
  el.clock.textContent = fmtTime(state.timeRemaining);
  el.clock.classList.remove('warning', 'danger');
  if (state.timeRemaining <= 120) el.clock.classList.add('danger');
  else if (state.timeRemaining <= 480) el.clock.classList.add('warning');
}

function updateBudget() {
  el.budget.textContent = fmtMoney(state.budget);
  const sc = SCENARIOS[state.scenarioId];
  const pct = state.budget / sc.startingBudget;
  el.budget.classList.remove('warning', 'danger');
  if (pct <= 0.1) el.budget.classList.add('danger');
  else if (pct <= 0.3) el.budget.classList.add('warning');
}

function updateScores() {
  el.scoreC.textContent = clampScore(state.scores.compliance);
  el.scoreT.textContent = clampScore(state.scores.containment);
  el.scoreR.textContent = clampScore(state.scores.reputation);
}

function clampScore(v) { return Math.max(0, Math.min(100, Math.round(v))); }

// --- Decision Nodes ---
function getScenario() { return SCENARIOS[state.scenarioId]; }

function getAvailableNodes() {
  const sc = getScenario();
  return sc.nodes.filter((node) => {
    if (state.decisionLog.some((d) => d.nodeId === node.id)) return false;
    if (node.requiredTags.length && !node.requiredTags.every((t) => state.tags.includes(t))) return false;
    if (node.excludedByTags.length && node.excludedByTags.some((t) => state.tags.includes(t))) return false;
    return true;
  });
}

function showCurrentNode() {
  const available = getAvailableNodes();
  if (available.length === 0 || state.status !== 'active') {
    state.status = 'completed';
    saveState();
    stopTimer();
    endDrill();
    return;
  }

  const node = available[0]; // next in sequence
  el.decisionPanel.hidden = false;
  el.consequencePanel.hidden = true;
  el.nodeTitle.textContent = node.title;
  el.nodeDesc.textContent = node.description;
  el.nodeOptions.innerHTML = '';

  node.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    const canAfford = state.budget >= opt.budgetCost;
    const hasTime = state.timeRemaining >= opt.timeCost;
    btn.disabled = !canAfford || !hasTime;

    let costParts = [];
    if (opt.timeCost > 0) costParts.push(`${fmtElapsed(opt.timeCost)} time`);
    if (opt.budgetCost > 0) costParts.push(`${fmtMoney(opt.budgetCost)} budget`);

    btn.innerHTML = `
      ${opt.label}
      ${costParts.length ? `<span class="option-cost">${costParts.join(' · ')}</span>` : ''}
    `;

    if (!canAfford) btn.title = 'Insufficient budget';
    else if (!hasTime) btn.title = 'Not enough time remaining';

    btn.addEventListener('click', () => chooseOption(node, opt));
    el.nodeOptions.appendChild(btn);
  });
}

function chooseOption(node, opt) {
  // Apply costs
  state.timeRemaining = Math.max(0, state.timeRemaining - opt.timeCost);
  state.budget = Math.max(0, state.budget - opt.budgetCost);

  // Apply score effects
  state.scores.compliance += opt.scoreEffect.compliance;
  state.scores.containment += opt.scoreEffect.containment;
  state.scores.reputation += opt.scoreEffect.reputation;

  // Add tags
  opt.tags.forEach((t) => { if (!state.tags.includes(t)) state.tags.push(t); });

  // Compute elapsed time
  const sc = getScenario();
  const elapsed = sc.startingTime - state.timeRemaining;

  // Log the decision
  state.decisionLog.push({
    timestamp: elapsed,
    nodeId: node.id,
    nodeTitle: node.title,
    optionId: opt.id,
    optionLabel: opt.label,
    consequence: opt.consequence,
    timeCost: opt.timeCost,
    budgetCost: opt.budgetCost,
    scoreEffect: { ...opt.scoreEffect }
  });

  saveState();
  updateStatusBar();
  showConsequence(opt);
}

function showConsequence(opt) {
  el.decisionPanel.hidden = true;
  el.consequencePanel.hidden = false;
  el.consequenceText.textContent = opt.consequence;

  el.consequenceEffects.innerHTML = '';
  const effects = [
    { label: 'Compliance', val: opt.scoreEffect.compliance },
    { label: 'Containment', val: opt.scoreEffect.containment },
    { label: 'Reputation', val: opt.scoreEffect.reputation }
  ];
  effects.forEach((e) => {
    if (e.val === 0) return;
    const tag = document.createElement('span');
    tag.className = 'effect-tag ' + (e.val > 0 ? 'positive' : 'negative');
    tag.textContent = `${e.label} ${e.val > 0 ? '+' : ''}${e.val}`;
    el.consequenceEffects.appendChild(tag);
  });

  if (opt.timeCost > 0) {
    const tag = document.createElement('span');
    tag.className = 'effect-tag cost';
    tag.textContent = `${fmtElapsed(opt.timeCost)} spent`;
    el.consequenceEffects.appendChild(tag);
  }
  if (opt.budgetCost > 0) {
    const tag = document.createElement('span');
    tag.className = 'effect-tag cost';
    tag.textContent = `${fmtMoney(opt.budgetCost)} spent`;
    el.consequenceEffects.appendChild(tag);
  }
}

el.btnContinue.addEventListener('click', () => {
  if (state.timeRemaining <= 0) {
    state.status = 'timed_out';
    saveState();
    stopTimer();
    endDrill();
  } else {
    showCurrentNode();
  }
});

// --- Decision Log ---
el.btnLog.addEventListener('click', () => {
  renderLogEntries();
  el.logDrawer.classList.add('open');
  el.logOverlay.classList.add('open');
});

el.btnCloseLog.addEventListener('click', closeLog);
el.logOverlay.addEventListener('click', closeLog);

function closeLog() {
  el.logDrawer.classList.remove('open');
  el.logOverlay.classList.remove('open');
}

function renderLogEntries() {
  el.logEntries.innerHTML = '';
  if (!state || !state.decisionLog.length) {
    el.logEntries.innerHTML = '<p style="color: var(--text-dim); padding: 1rem; font-size: 0.85rem;">No decisions yet.</p>';
    return;
  }
  state.decisionLog.forEach((d) => {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
      <div class="log-time">${fmtElapsed(d.timestamp)} into incident</div>
      <div class="log-title">${d.nodeTitle}</div>
      <div class="log-choice">${d.optionLabel}</div>
      <div class="log-costs">${d.timeCost > 0 ? fmtElapsed(d.timeCost) + ' · ' : ''}${d.budgetCost > 0 ? fmtMoney(d.budgetCost) : 'No cost'}</div>
    `;
    el.logEntries.appendChild(entry);
  });
}

el.btnExportLog.addEventListener('click', () => {
  if (!state) return;
  const sc = getScenario();
  let text = `OIC Drill Decision Log\n`;
  text += `Scenario: ${sc.name}\n`;
  text += `Date: ${new Date(state.startedAt).toLocaleDateString()}\n\n`;
  state.decisionLog.forEach((d, i) => {
    text += `${i + 1}. [${fmtElapsed(d.timestamp)}] ${d.nodeTitle}\n`;
    text += `   Decision: ${d.optionLabel}\n`;
    text += `   Outcome: ${d.consequence}\n`;
    text += `   Cost: ${d.timeCost > 0 ? fmtElapsed(d.timeCost) : '0m'} time, ${fmtMoney(d.budgetCost)} budget\n\n`;
  });

  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `oic-drill-log-${state.scenarioId}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
});

// --- End Screen ---
function endDrill() {
  stopTimer();
  closeLog();
  showView('end');

  const sc = getScenario();
  const c = clampScore(state.scores.compliance);
  const t = clampScore(state.scores.containment);
  const r = clampScore(state.scores.reputation);
  const avg = Math.round((c + t + r) / 3);

  let grade, gradeLabel;
  if (avg >= 85) { grade = 'A'; gradeLabel = 'Exemplary response'; }
  else if (avg >= 70) { grade = 'B'; gradeLabel = 'Competent response with minor gaps'; }
  else if (avg >= 55) { grade = 'C'; gradeLabel = 'Adequate but notable weaknesses'; }
  else if (avg >= 40) { grade = 'D'; gradeLabel = 'Poor response, significant failures'; }
  else { grade = 'F'; gradeLabel = 'Critical failures across multiple areas'; }

  el.endGrade.innerHTML = `
    <div class="grade-letter grade-${grade}">${grade}</div>
    <div class="grade-label">${gradeLabel} (average: ${avg}/100)</div>
  `;

  el.endScores.innerHTML = [
    { name: 'Compliance', val: c, cls: 'compliance' },
    { name: 'Containment', val: t, cls: 'containment' },
    { name: 'Reputation', val: r, cls: 'reputation' }
  ].map((s) => `
    <div class="score-row">
      <span class="score-name">${s.name}</span>
      <div class="score-bar-bg"><div class="score-bar-fill ${s.cls}" style="width: ${s.val}%"></div></div>
      <span class="score-num">${s.val}</span>
    </div>
  `).join('');

  // After-action summary
  const good = [];
  const missed = [];
  const tags = state.tags;

  if (tags.includes('notified_oic')) good.push('Notified the Office of the Information Commissioner');
  else missed.push('Failed to notify the OIC as required under Section 22 of the Data Protection Act');

  if (tags.includes('reported_cirt') || tags.includes('reported_police')) good.push('Reported to law enforcement or JaCIRT');
  else missed.push('Did not report to law enforcement or the Cyber Incidents Response Team');

  if (tags.includes('isolated_systems') || tags.includes('bucket_secured') || tags.includes('revoked_access'))
    good.push('Took swift containment action');
  else missed.push('Delayed containment, allowing the breach scope to expand');

  if (tags.includes('preserved_evidence') || tags.includes('forensic_analysis'))
    good.push('Preserved evidence and conducted forensic analysis');
  else if (tags.includes('evidence_compromised') || tags.includes('evidence_destroyed'))
    missed.push('Evidence was compromised or destroyed during the response');

  if (tags.includes('notified_patients') || tags.includes('notified_members') || tags.includes('notified_customers'))
    good.push('Notified affected data subjects');
  else missed.push('Failed to notify affected individuals about the breach');

  if (tags.includes('public_statement') || tags.includes('media_briefing'))
    good.push('Managed media communications proactively');
  else if (tags.includes('denied_breach') || tags.includes('no_comment'))
    missed.push('Mishandled media communications');

  if (tags.includes('offered_support') || tags.includes('offered_protection'))
    good.push('Provided support services to affected individuals');
  else missed.push('Did not offer adequate support to affected individuals');

  if (tags.includes('security_audit') || tags.includes('independent_audit') || tags.includes('independent_review'))
    good.push('Commissioned an independent post incident review');
  else if (tags.includes('no_review'))
    missed.push('Did not conduct a post incident review');

  if (tags.includes('legal_consulted')) good.push('Sought legal advice during the response');
  if (tags.includes('paid_ransom')) missed.push('Paid a ransom, potentially funding criminal activity');

  let summaryHtml = '<h3>After Action Summary</h3>';
  if (good.length) {
    summaryHtml += `<div class="summary-section good"><h4>What went well</h4><ul>${good.map((g) => `<li>${g}</li>`).join('')}</ul></div>`;
  }
  if (missed.length) {
    summaryHtml += `<div class="summary-section bad"><h4 class="missed">What was missed</h4><ul>${missed.map((m) => `<li>${m}</li>`).join('')}</ul></div>`;
  }
  el.endSummary.innerHTML = summaryHtml;

  // OIC Breach Notification Letter
  el.endLetter.textContent = generateOICLetter(sc, state);

  // Full decision log
  let logHtml = '';
  state.decisionLog.forEach((d, i) => {
    logHtml += `<div class="log-entry">
      <div class="log-time">${fmtElapsed(d.timestamp)} into incident</div>
      <div class="log-title">${i + 1}. ${d.nodeTitle}</div>
      <div class="log-choice">${d.optionLabel}</div>
      <div style="font-size:0.8rem;color:var(--text-dim);margin-top:0.25rem">${d.consequence}</div>
    </div>`;
  });
  el.endLog.innerHTML = logHtml;

  clearState();
}

function generateOICLetter(sc, st) {
  const today = new Date().toLocaleDateString('en-JM', { year: 'numeric', month: 'long', day: 'numeric' });
  const discoveryDate = new Date(st.startedAt).toLocaleDateString('en-JM', { year: 'numeric', month: 'long', day: 'numeric' });

  const measures = st.decisionLog
    .map((d) => `- ${d.optionLabel}`)
    .join('\n');

  const dataCategories = sc.dataAtRisk;
  const notifiedOIC = st.tags.includes('notified_oic');
  const notifiedSubjects = st.tags.includes('notified_patients') || st.tags.includes('notified_members') || st.tags.includes('notified_customers');

  return `BREACH NOTIFICATION
Pursuant to Section 22 of the Data Protection Act, 2020

Date: ${today}

The Information Commissioner
Office of the Information Commissioner
Kingston, Jamaica

Dear Commissioner,

RE: NOTIFICATION OF PERSONAL DATA BREACH

I write on behalf of ${sc.name} to formally notify the Office of the Information Commissioner of a personal data breach, as required under Section 22 of the Data Protection Act, 2020.

1. NATURE OF THE BREACH

${sc.incident}

2. DATE OF DISCOVERY

The breach was discovered on ${discoveryDate}.

${notifiedOIC ? 'Initial notification was submitted to the OIC without undue delay following discovery.' : 'We acknowledge that notification to the OIC was delayed beyond the timeframe contemplated by the Act.'}

3. CATEGORIES OF PERSONAL DATA AFFECTED

The following categories of personal data were involved:
${dataCategories}

4. ESTIMATED NUMBER OF DATA SUBJECTS AFFECTED

Approximately ${sc.recordCount.toLocaleString()} individuals are believed to be affected.

5. MEASURES TAKEN IN RESPONSE

The following measures were taken during the incident response:
${measures}

6. NOTIFICATION OF DATA SUBJECTS

${notifiedSubjects ? 'Affected data subjects have been notified of the breach and provided with guidance on protective measures they may take.' : 'Notification of data subjects is pending or was not completed during the response period.'}

7. CONTACT INFORMATION

For further enquiries regarding this breach, please contact:

Data Protection Officer
${sc.name}
Kingston, Jamaica

We remain committed to cooperating fully with the Office of the Information Commissioner and will provide any additional information as requested.

Yours faithfully,

______________________________
Data Protection Officer
${sc.name}`;
}

// --- New Drill ---
el.btnNewDrill.addEventListener('click', () => {
  state = null;
  showView('select');
  renderSelectScreen();
});

// --- Init ---
renderSelectScreen();
