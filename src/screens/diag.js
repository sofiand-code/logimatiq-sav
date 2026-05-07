/* ============================================================================
   DIAG — Moteur de diagnostic : question / action / solution
   ========================================================================== */
import { DATA } from '../data/tree.js';
import { STATE } from '../state.js';
import { renderMedia } from '../components/media.js';
import { saveDiagnostic } from '../components/history-store.js';

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

export function startDiagnostic(symptomId, navFn) {
  const sym = Object.values(DATA.symptoms).flat().find(s => s.id === symptomId);
  if (!sym) return;
  STATE.symptomId      = symptomId;
  STATE.treeRoot       = sym.rootNode;
  STATE.history        = [sym.rootNode];
  STATE.answers        = [];
  STATE.estimatedSteps = estimateDepth(sym.rootNode);
  renderDiag(navFn);
  navFn('diag');
}

export function diagAdvance(nextId, answerLabel, navFn) {
  STATE.answers.push(answerLabel);
  STATE.history.push(nextId);
  renderDiag(navFn);
}

export function diagBack(navFn) {
  if (STATE.history.length <= 1) { navFn('symptoms'); return; }
  STATE.history.pop();
  STATE.answers.pop();
  renderDiag(navFn);
}

export function confirmAbort(navFn) {
  if (confirm('Quitter ce diagnostic ?')) navFn('home');
}

export function renderDiag(navFn) {
  const n = DATA.nodes[STATE.history[STATE.history.length - 1]];
  const stepN = STATE.history.length;

  document.getElementById('diag-step-label').textContent = `${stepN} / ${Math.max(STATE.estimatedSteps, stepN)}`;

  // Barre de progression
  const bar = document.getElementById('progress-bar');
  const total = Math.max(STATE.estimatedSteps, stepN);
  bar.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const seg = document.createElement('div');
    seg.className = 'h-1 flex-1 rounded-full transition-all duration-300 '
      + (i < stepN ? 'bg-brand-600' : 'bg-slate-200');
    bar.appendChild(seg);
  }

  const body = document.getElementById('diag-body');
  if (!n) { body.innerHTML = '<p class="text-slate-400">Nœud introuvable.</p>'; return; }

  if (n.type === 'question')  body.innerHTML = renderQuestion(n);
  else if (n.type === 'action')   body.innerHTML = renderAction(n);
  else if (n.type === 'solution') body.innerHTML = renderSolution(n);

  wireEvents(n, navFn);
}

/* ---- Templates HTML ---- */

function renderQuestion(n) {
  return `
    <div class="inline-flex items-center gap-1.5 bg-brand-50 text-brand-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
      <svg viewBox="0 0 24 24" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
      Question
    </div>
    <h2 class="mt-3 text-2xl font-black text-slate-900 leading-tight">${n.title}</h2>
    ${n.help ? `<p class="mt-2 text-sm text-slate-500 leading-relaxed">${n.help}</p>` : ''}
    ${renderMedia(n.media)}
    <div class="mt-5 space-y-2.5" id="answers-list">
      ${n.answers.map((a, i) => answerButton(a, i)).join('')}
    </div>
  `;
}

function answerButton(a, i) {
  const dot = a.color === 'green' ? 'bg-emerald-400'
            : a.color === 'red'   ? 'bg-rose-400'
            : a.color === 'gray'  ? 'bg-slate-300'
            : null;
  const letter = String.fromCharCode(65 + i);
  return `
    <button data-next="${a.next}" data-label="${a.label.replace(/"/g, '&quot;')}"
      class="answer-btn w-full bg-white border-2 border-slate-100 rounded-2xl p-4 flex items-center gap-3.5 text-left shadow-sm">
      ${dot
        ? `<span class="w-5 h-5 rounded-full ${dot} shrink-0 shadow-sm"></span>`
        : `<span class="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 text-xs font-black flex items-center justify-center shrink-0">${letter}</span>`
      }
      <span class="flex-1 font-semibold text-slate-800 text-sm">${a.label}</span>
      <svg viewBox="0 0 24 24" class="w-5 h-5 text-slate-300 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/>
      </svg>
    </button>`;
}

function renderAction(n) {
  return `
    <div class="inline-flex items-center gap-1.5 bg-accent-500/10 text-accent-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
      <svg viewBox="0 0 24 24" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>
      Procédure
    </div>
    <h2 class="mt-3 text-2xl font-black text-slate-900 leading-tight">${n.title}</h2>
    ${renderMedia(n.media)}
    <ol class="mt-5 space-y-2.5">
      ${n.steps.map((s, i) => `
        <li class="flex gap-3.5 items-start bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <span class="w-7 h-7 shrink-0 rounded-xl bg-brand-600 text-white text-xs font-black flex items-center justify-center">${i + 1}</span>
          <span class="text-sm text-slate-700 pt-0.5 leading-relaxed">${s}</span>
        </li>`).join('')}
    </ol>
    <div class="mt-6 grid grid-cols-2 gap-3">
      <button id="btn-back"
        class="bg-white border-2 border-slate-200 text-slate-600 font-bold py-4 rounded-2xl text-sm">
        ← Retour
      </button>
      <button id="btn-next" data-next="${n.next}" data-label="Procédure faite"
        class="btn-primary font-bold py-4 rounded-2xl text-sm shadow-md">
        C'est fait ✓
      </button>
    </div>`;
}

function renderSolution(n) {
  saveDiagnostic(STATE, n);
  const isOK  = n.outcome === 'resolved';
  const isSav = !!n.sav;

  const iconOK = `<svg viewBox="0 0 24 24" class="w-9 h-9" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="m8.5 12 2.5 2.5L16 9.5"/></svg>`;
  const iconKO = `<svg viewBox="0 0 24 24" class="w-9 h-9" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 8v5M12 16h.01"/></svg>`;

  const pathLabels = STATE.answers.filter(Boolean).slice(-6);

  return `
    <!-- Bloc résultat -->
    <div class="rounded-3xl overflow-hidden mb-5 ${isOK ? 'bg-emerald-500' : 'bg-rose-500'} text-white p-6 text-center shadow-lg">
      <div class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
        ${isOK ? iconOK : iconKO}
      </div>
      <h2 class="text-2xl font-black">${n.title}</h2>
      <p class="mt-2 text-sm opacity-90 leading-relaxed">${n.message}</p>
    </div>

    ${pathLabels.length ? `
      <div class="bg-white border border-slate-100 rounded-2xl p-4 mb-5 shadow-sm">
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Cheminement</p>
        <div class="flex flex-wrap gap-1.5">
          ${pathLabels.map(l => `<span class="text-[11px] bg-slate-100 text-slate-600 font-medium px-2.5 py-1 rounded-lg">${l}</span>`).join('')}
        </div>
      </div>` : ''}

    <div class="space-y-2.5">
      ${isSav ? `
        <button id="btn-sav"
          class="w-full bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-md text-sm flex items-center justify-center gap-2">
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" d="M12 4v16M4 12h16"/></svg>
          Créer un ticket SAV
        </button>` : ''}
      <button id="btn-restart"
        class="w-full bg-white border-2 border-slate-200 text-slate-600 font-bold py-4 rounded-2xl text-sm">
        Refaire ce diagnostic
      </button>
      <button id="btn-home"
        class="w-full btn-primary font-bold py-4 rounded-2xl text-sm shadow-md">
        Terminer
      </button>
    </div>`;
}

function wireEvents(n, navFn) {
  document.querySelectorAll('[data-next]').forEach(btn =>
    btn.addEventListener('click', () => diagAdvance(btn.dataset.next, btn.dataset.label, navFn))
  );
  document.getElementById('btn-back')
    ?.addEventListener('click', () => diagBack(navFn));
  document.getElementById('btn-sav')
    ?.addEventListener('click', () => alert('Ouverture du formulaire ticket SAV (à brancher)'));
  document.getElementById('btn-restart')
    ?.addEventListener('click', () => startDiagnostic(STATE.symptomId, navFn));
  document.getElementById('btn-home')
    ?.addEventListener('click', () => navFn('home'));
}
