/* ============================================================================
   DIAG — Moteur de diagnostic : question / action / solution
   ========================================================================== */
import { DATA } from '../data/tree.js';
import { STATE } from '../state.js';
import { renderMedia } from '../components/media.js';
import { saveDiagnostic } from '../components/history-store.js';

/* ---- Estimation de profondeur (barre de progression) ---- */
function estimateDepth(rootId) {
  let max = 0;
  function rec(id, d) {
    if (d > 10) return;
    max = Math.max(max, d);
    const n = DATA.nodes[id];
    if (!n) return;
    if (n.type === 'question') n.answers.forEach(a => rec(a.next, d + 1));
    else if (n.next) rec(n.next, d + 1);
  }
  rec(rootId, 1);
  return Math.min(max, 8);
}

/* ---- Démarre un nouveau diagnostic ---- */
export function startDiagnostic(symptomId, navFn) {
  const sym = Object.values(DATA.symptoms)
    .flat()
    .find(s => s.id === symptomId);
  if (!sym) return;
  STATE.symptomId      = symptomId;
  STATE.treeRoot       = sym.rootNode;
  STATE.history        = [sym.rootNode];
  STATE.answers        = [];
  STATE.estimatedSteps = estimateDepth(sym.rootNode);
  renderDiag(navFn);
  navFn('diag');
}

/* ---- Avancer dans l'arbre ---- */
export function diagAdvance(nextId, answerLabel, navFn) {
  STATE.answers.push(answerLabel);
  STATE.history.push(nextId);
  renderDiag(navFn);
}

/* ---- Reculer d'une étape ---- */
export function diagBack(navFn) {
  if (STATE.history.length <= 1) {
    navFn('symptoms');
    return;
  }
  STATE.history.pop();
  STATE.answers.pop();
  renderDiag(navFn);
}

/* ---- Quitter le diagnostic ---- */
export function confirmAbort(navFn) {
  if (confirm('Quitter ce diagnostic ?')) navFn('home');
}

/* ---- Rendu principal ---- */
export function renderDiag(navFn) {
  const n = DATA.nodes[STATE.history[STATE.history.length - 1]];
  const stepN = STATE.history.length;

  document.getElementById('diag-step-label').textContent = `Étape ${stepN}`;

  // Barre de progression
  const bar = document.getElementById('progress-bar');
  const total = Math.max(STATE.estimatedSteps, stepN);
  bar.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const seg = document.createElement('div');
    seg.className = 'h-1.5 flex-1 rounded-full progress-step ' + (i < stepN ? 'bg-brand-600' : 'bg-slate-200');
    bar.appendChild(seg);
  }

  const body = document.getElementById('diag-body');
  if (!n) { body.innerHTML = '<p class="text-slate-500">Node introuvable.</p>'; return; }

  if (n.type === 'question') body.innerHTML = renderQuestion(n);
  else if (n.type === 'action') body.innerHTML = renderAction(n);
  else if (n.type === 'solution') body.innerHTML = renderSolution(n);

  // Branche les événements après l'injection du HTML
  wireEvents(n, navFn);
}

/* ---- Templates HTML ---- */
function renderQuestion(n) {
  return `
    <p class="text-xs uppercase tracking-wider text-brand-600 font-semibold">Question</p>
    <h2 class="mt-1 text-2xl font-bold text-slate-900 leading-tight">${n.title}</h2>
    ${n.help ? `<p class="mt-2 text-sm text-slate-600">${n.help}</p>` : ''}
    ${renderMedia(n.media)}
    <div class="mt-6 space-y-2.5" id="answers-list">
      ${n.answers.map((a, i) => answerButton(a, i)).join('')}
    </div>
  `;
}

function answerButton(a, i) {
  const colorDot = a.color === 'green' ? 'bg-emerald-500'
                 : a.color === 'red'   ? 'bg-rose-500'
                 : a.color === 'gray'  ? 'bg-slate-400'
                 : null;
  return `
    <button data-next="${a.next}" data-label="${a.label.replace(/"/g, '&quot;')}"
      class="answer-btn w-full bg-white border-2 border-slate-200 hover:border-brand-500 hover:bg-brand-50 rounded-2xl p-4 flex items-center gap-3 text-left">
      ${colorDot
        ? `<span class="w-4 h-4 rounded-full ${colorDot} ring-2 ring-white shadow"></span>`
        : `<span class="w-7 h-7 rounded-full border-2 border-slate-300 text-slate-500 text-xs font-semibold flex items-center justify-center">${String.fromCharCode(65 + i)}</span>`
      }
      <span class="flex-1 font-semibold text-slate-900">${a.label}</span>
      <svg viewBox="0 0 24 24" class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/>
      </svg>
    </button>
  `;
}

function renderAction(n) {
  return `
    <p class="text-xs uppercase tracking-wider text-accent-600 font-semibold">Procédure à suivre</p>
    <h2 class="mt-1 text-2xl font-bold text-slate-900 leading-tight">${n.title}</h2>
    ${renderMedia(n.media)}
    <ol class="mt-5 space-y-3">
      ${n.steps.map((s, i) => `
        <li class="flex gap-3 items-start bg-white border border-slate-200 rounded-xl p-3.5">
          <span class="w-7 h-7 shrink-0 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center">${i + 1}</span>
          <span class="text-sm text-slate-800 pt-0.5">${s}</span>
        </li>
      `).join('')}
    </ol>
    <div class="mt-7 grid grid-cols-2 gap-2.5">
      <button id="btn-back" class="bg-white border-2 border-slate-200 text-slate-700 font-semibold py-3.5 rounded-2xl">Retour</button>
      <button id="btn-next" data-next="${n.next}" data-label="Procédure faite" class="btn-primary font-semibold py-3.5 rounded-2xl">C'est fait</button>
    </div>
  `;
}

function renderSolution(n) {
  saveDiagnostic(STATE, n);
  const isOK   = n.outcome === 'resolved';
  const isSav  = !!n.sav;
  const icon   = isOK
    ? `<svg viewBox="0 0 24 24" class="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="m8.5 12 2.5 2.5L16 9.5"/></svg>`
    : `<svg viewBox="0 0 24 24" class="w-10 h-10 text-rose-600" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 8v5M12 16h.01"/></svg>`;
  const ringColor = isOK ? 'bg-emerald-50' : 'bg-rose-50';
  const pathLabels = STATE.answers.filter(Boolean).slice(-6);

  return `
    <div class="text-center pt-3">
      <div class="inline-flex w-20 h-20 ${ringColor} rounded-2xl items-center justify-center">${icon}</div>
      <h2 class="mt-4 text-2xl font-bold text-slate-900">${n.title}</h2>
      <p class="mt-2 text-sm text-slate-600 max-w-xs mx-auto">${n.message}</p>
    </div>
    ${pathLabels.length ? `
      <div class="mt-6 bg-white border border-slate-200 rounded-2xl p-4">
        <p class="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Cheminement</p>
        <div class="flex flex-wrap gap-1.5">
          ${pathLabels.map(l => `<span class="text-[11px] bg-slate-100 text-slate-700 px-2 py-1 rounded-md">${l}</span>`).join('')}
        </div>
      </div>` : ''}
    <div class="mt-6 space-y-2.5">
      ${isSav ? `<button id="btn-sav" class="w-full bg-rose-600 active:bg-rose-700 text-white font-semibold py-3.5 rounded-2xl">Créer un ticket SAV</button>` : ''}
      <button id="btn-restart" class="w-full bg-white border-2 border-slate-200 text-slate-700 font-semibold py-3.5 rounded-2xl">Refaire ce diagnostic</button>
      <button id="btn-home" class="w-full btn-primary font-semibold py-3.5 rounded-2xl">Terminer</button>
    </div>
  `;
}

/* ---- Branchement des événements après rendu ---- */
function wireEvents(n, navFn) {
  // Réponses d'une question
  document.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      diagAdvance(btn.dataset.next, btn.dataset.label, navFn);
    });
  });

  // Retour dans une action
  const btnBack = document.getElementById('btn-back');
  if (btnBack) btnBack.addEventListener('click', () => diagBack(navFn));

  // Solution — ticket SAV
  const btnSav = document.getElementById('btn-sav');
  if (btnSav) btnSav.addEventListener('click', () => alert('Ouverture du formulaire ticket SAV (à brancher)'));

  // Solution — refaire
  const btnRestart = document.getElementById('btn-restart');
  if (btnRestart) btnRestart.addEventListener('click', () => startDiagnostic(STATE.symptomId, navFn));

  // Solution — terminer
  const btnHome = document.getElementById('btn-home');
  if (btnHome) btnHome.addEventListener('click', () => navFn('home'));
}
