/* ============================================================================
   DIAG — Moteur de diagnostic : question / action / solution
   ========================================================================== */
import { DATA } from '../data/tree.js';
import { STATE } from '../state.js';
import { renderMedia } from '../components/media.js';
import { saveDiagnostic } from '../components/history-store.js';
import { findSymptom } from './home.js';
import { t, tNode, tAnswer, tStep } from '../i18n.js';

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
  if (confirm(t('Quitter ce diagnostic ?'))) navFn('home');
}

export function renderDiag(navFn) {
  const nodeId = STATE.history[STATE.history.length - 1];
  const n = DATA.nodes[nodeId];
  const stepN = STATE.history.length;
  const total = Math.max(STATE.estimatedSteps, stepN);

  document.getElementById('diag-step-label').textContent =
    `${t('Étape')} ${stepN} / ${total}`;

  /* Barre de progression */
  const bar = document.getElementById('progress-bar');
  bar.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const seg = document.createElement('div');
    seg.className = 'h-1 flex-1 rounded-full transition-all duration-300 '
      + (i < stepN ? 'bg-brand-600' : 'bg-slate-200');
    bar.appendChild(seg);
  }

  /* Bouton SAV flottant — visible sauf sur solution */
  const fab = document.getElementById('fab-sav');
  if (fab) fab.style.display = n?.type === 'solution' ? 'none' : 'flex';

  const body = document.getElementById('diag-body');
  if (!n) {
    body.innerHTML = `<p class="text-slate-400 text-sm">${t('Nœud introuvable.')}</p>`;
    return;
  }

  if      (n.type === 'question')  body.innerHTML = renderQuestion(n, nodeId);
  else if (n.type === 'action')    body.innerHTML = renderAction(n, nodeId);
  else if (n.type === 'solution')  body.innerHTML = renderSolution(n, nodeId);

  wireEvents(n, navFn);
}

/* ------------------------------------------------------------------ */
/* Templates                                                           */
/* ------------------------------------------------------------------ */

function renderQuestion(n, nodeId) {
  return `
    <div class="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-[10px] font-black
                uppercase tracking-widest px-3 py-1.5 rounded-full border border-brand-100">
      <svg viewBox="0 0 24 24" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3">
        <circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>
      </svg>
      ${t('Question')}
    </div>
    <h2 class="mt-3 text-2xl font-black text-slate-900 leading-tight">
      ${tNode(nodeId, 'title', n.title)}
    </h2>
    ${(tNode(nodeId, 'help', n.help) || '')
      ? `<p class="mt-2 text-sm text-slate-500 leading-relaxed">${tNode(nodeId, 'help', n.help)}</p>`
      : ''}
    ${renderMedia(n.media)}
    <div class="mt-5 space-y-2.5" id="answers-list">
      ${n.answers.map((a, i) => answerBtn(a, i, nodeId)).join('')}
    </div>`;
}

function answerBtn(a, i, nodeId) {
  const label = tAnswer(nodeId, i, a.label);
  const dot = a.color === 'green' ? '#22C55E'
            : a.color === 'red'   ? '#EF4444'
            : a.color === 'gray'  ? '#94A3B8'
            : null;
  return `
    <button data-next="${a.next}" data-label="${label.replace(/"/g, '&quot;')}"
      class="answer-btn w-full bg-white border-2 border-slate-200 rounded-2xl p-4
             flex items-center gap-3.5 text-left shadow-sm">
      ${dot
        ? `<span class="w-4 h-4 rounded-full shrink-0" style="background:${dot}"></span>`
        : `<span class="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 text-xs font-black
                        flex items-center justify-center shrink-0">
             ${String.fromCharCode(65 + i)}
           </span>`}
      <span class="flex-1 font-semibold text-slate-800 text-sm">${label}</span>
      <svg viewBox="0 0 24 24" class="w-5 h-5 text-slate-300 shrink-0" fill="none"
           stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/>
      </svg>
    </button>`;
}

function renderAction(n, nodeId) {
  const steps = n.steps.map((s, i) => tStep(nodeId, i, s));
  return `
    <div class="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest
                px-3 py-1.5 rounded-full border"
         style="background:#FFFBEB;color:#D97706;border-color:#FDE68A">
      <svg viewBox="0 0 24 24" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2
             M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/>
      </svg>
      ${t('Procédure')}
    </div>
    <h2 class="mt-3 text-2xl font-black text-slate-900 leading-tight">
      ${tNode(nodeId, 'title', n.title)}
    </h2>
    ${renderMedia(n.media)}
    <ol class="mt-5 space-y-2.5">
      ${steps.map((s, i) => `
        <li class="flex gap-3.5 items-start bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span class="w-7 h-7 shrink-0 rounded-xl text-white text-xs font-black
                        flex items-center justify-center" style="background:#0F4C81">${i + 1}</span>
          <span class="text-sm text-slate-700 pt-0.5 leading-relaxed">${s}</span>
        </li>`).join('')}
    </ol>
    <div class="mt-6 grid grid-cols-2 gap-3">
      <button id="btn-back"
        class="bg-white border-2 border-slate-200 text-slate-600 font-bold py-4 rounded-2xl text-sm">
        ${t('← Retour')}
      </button>
      <button id="btn-next" data-next="${n.next}" data-label="${t('Procédure faite')}"
        class="btn-primary font-bold py-4 rounded-2xl text-sm shadow-sm">
        ${t("C'est fait ✓")}
      </button>
    </div>`;
}

function renderSolution(n, nodeId) {
  saveDiagnostic(STATE, n);
  const isOK  = n.outcome === 'resolved';
  const isSav = !!n.sav;

  const headerStyle = isOK ? 'background:#0F4C81;' : 'background:#DC2626;';

  const iconOK = `<svg viewBox="0 0 24 24" class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="2.5">
    <circle cx="12" cy="12" r="9"/>
    <path stroke-linecap="round" stroke-linejoin="round" d="m8.5 12 2.5 2.5L16 9.5"/>
  </svg>`;
  const iconKO = `<svg viewBox="0 0 24 24" class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="2.5">
    <circle cx="12" cy="12" r="9"/>
    <path stroke-linecap="round" d="M12 8v5M12 16h.01"/>
  </svg>`;

  const pathLabels = STATE.answers.filter(Boolean).slice(-6);
  const reportText = generateReport(n, nodeId);

  const solTitle   = tNode(nodeId, 'title',   n.title);
  const solMessage = tNode(nodeId, 'message', n.message);

  const outcomeLabel = n.outcome === 'resolved'
    ? t('Résolu')
    : n.outcome === 'sav' ? t('SAV') : t('Pièce');

  return `
    <!-- Résultat -->
    <div class="rounded-3xl overflow-hidden mb-5 shadow-md" style="${headerStyle}">
      <div class="px-6 pt-6 pb-5 text-white text-center">
        <div class="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
             style="background:rgba(255,255,255,.2)">
          ${isOK ? iconOK : iconKO}
        </div>
        <h2 class="text-xl font-black">${solTitle}</h2>
        <p class="mt-2 text-sm leading-relaxed" style="color:rgba(255,255,255,.8)">${solMessage}</p>
      </div>
    </div>

    ${pathLabels.length ? `
    <div class="bg-white border border-slate-200 rounded-2xl p-4 mb-4 shadow-sm">
      <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5">
        ${t('Cheminement du diagnostic')}
      </p>
      <div class="flex flex-wrap gap-1.5">
        ${pathLabels.map(l =>
          `<span class="text-[11px] bg-slate-100 text-slate-600 font-medium px-2.5 py-1 rounded-lg">${l}</span>`
        ).join('')}
      </div>
    </div>` : ''}

    <!-- Rapport partageable -->
    <button id="btn-share-report"
      data-report="${encodeURIComponent(reportText)}"
      class="w-full bg-white border-2 border-slate-200 rounded-2xl py-3.5 mb-4
             flex items-center justify-center gap-2 text-sm font-bold text-slate-600 shadow-sm tap-card">
      <svg viewBox="0 0 24 24" class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342
             m0 2.684a3 3 0 1 1 0-2.684m0 2.684 6.632 3.316m-6.632-6 6.632-3.316
             m0 0a3 3 0 1 0 5.367-2.684 3 3 0 0 0-5.367 2.684zm0 9.316a3 3 0 1 0 5.368 2.684
             3 3 0 0 0-5.368-2.684z"/>
      </svg>
      <span id="share-btn-label">${t('Copier le rapport')}</span>
    </button>

    <div class="space-y-2.5">
      ${isSav ? `
      <button id="btn-sav"
        class="w-full text-white font-bold py-4 rounded-2xl text-sm shadow-sm flex items-center justify-center gap-2"
        style="background:#DC2626;">
        <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round"
            d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21
               l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502
               l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
        </svg>
        ${t('Contacter le SAV Logimatiq')}
      </button>` : ''}
      <button id="btn-restart"
        class="w-full bg-white border-2 border-slate-200 text-slate-600 font-bold py-4 rounded-2xl text-sm">
        ${t('Refaire ce diagnostic')}
      </button>
      <button id="btn-home"
        class="w-full btn-primary font-bold py-4 rounded-2xl text-sm shadow-sm">
        ${t('Terminer')}
      </button>
    </div>`;
}

/* ------------------------------------------------------------------ */
/* Génération du rapport texte                                         */
/* ------------------------------------------------------------------ */
function generateReport(n, nodeId) {
  const sym  = findSymptom(STATE.symptomId);
  const machine = DATA.machines?.find(m => m.id === STATE.machineId);
  const now  = new Date().toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  const steps = STATE.answers.filter(Boolean);

  return [
    t('🔧 RAPPORT DIAGNOSTIC LOGIMATIQ'),
    '─────────────────────────────',
    `${t('Machine  :')} ${machine?.name || STATE.machineId || 'N/A'}`,
    `${t('Problème :')} ${sym?.title || STATE.symptomId || 'N/A'}`,
    `${t('Date     :')} ${now}`,
    '',
    `📋 ${steps.length > 0 ? steps.length : 0} ${t('étapes') !== 'étapes' ? t('étapes') : 'étapes'} :`,
    ...steps.map((a, i) => `  ${i + 1}. ${a}`),
    '',
    '📌 Conclusion :',
    tNode(nodeId, 'title', n.title),
    tNode(nodeId, 'message', n.message),
    '',
    '─────────────────────────────',
    t('Généré par Logimatiq SAV App'),
  ].join('\n');
}

/* ------------------------------------------------------------------ */
/* Événements                                                          */
/* ------------------------------------------------------------------ */
function wireEvents(n, navFn) {
  document.querySelectorAll('[data-next]').forEach(btn =>
    btn.addEventListener('click', () => diagAdvance(btn.dataset.next, btn.dataset.label, navFn))
  );
  document.getElementById('btn-back')
    ?.addEventListener('click', () => diagBack(navFn));

  /* Rapport partageable */
  document.getElementById('btn-share-report')
    ?.addEventListener('click', async (e) => {
      const btn   = e.currentTarget;
      const text  = decodeURIComponent(btn.dataset.report || '');
      const label = document.getElementById('share-btn-label');
      try {
        if (navigator.share) {
          await navigator.share({ title: t('Rapport diagnostic Logimatiq'), text });
        } else {
          await navigator.clipboard.writeText(text);
          if (label) {
            label.textContent = t('✓ Copié !');
            setTimeout(() => { label.textContent = t('Copier le rapport'); }, 2000);
          }
        }
      } catch {
        /* Annulé par l'utilisateur — ne rien faire */
      }
    });

  document.getElementById('btn-sav')
    ?.addEventListener('click', () => {
      window.location.href = 'tel:0745284483';
    });
  document.getElementById('btn-restart')
    ?.addEventListener('click', () => startDiagnostic(STATE.symptomId, navFn));
  document.getElementById('btn-home')
    ?.addEventListener('click', () => navFn('home'));
}
