/* ============================================================================
   HISTORY — Affichage de l'historique des diagnostics terminés
   ========================================================================== */
import { loadHistory, outcomePill, formatDate } from '../components/history-store.js';
import { findSymptom } from './home.js';

export function renderHistory() {
  const list = document.getElementById('history-list');
  const arr  = loadHistory();

  if (!arr.length) {
    list.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
          <svg viewBox="0 0 24 24" class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 7v5l3 2"/>
          </svg>
        </div>
        <p class="font-bold text-slate-400 text-sm">Aucun diagnostic terminé</p>
        <p class="text-xs text-slate-300 mt-1">Les diagnostics complétés apparaîtront ici</p>
      </div>`;
    return;
  }

  const total    = arr.length;
  const resolved = arr.filter(x => x.outcome === 'resolved').length;
  const rate     = Math.round((resolved / total) * 100);

  const stats = `
    <div class="grid grid-cols-3 gap-2.5 mb-5">
      <div class="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm text-center">
        <div class="text-2xl font-black text-slate-900">${total}</div>
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total</div>
      </div>
      <div class="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm text-center">
        <div class="text-2xl font-black text-emerald-500">${resolved}</div>
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Résolus</div>
      </div>
      <div class="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm text-center">
        <div class="text-2xl font-black text-brand-600">${rate}%</div>
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Taux</div>
      </div>
    </div>`;

  list.innerHTML = stats + arr.map(h => {
    const sym  = findSymptom(h.symptomId);
    const pill = outcomePill(h.outcome);
    return `
      <div class="bg-white border border-slate-100 rounded-2xl p-4 mb-2.5 shadow-sm">
        <div class="flex items-start justify-between gap-2">
          <div class="font-bold text-slate-900 text-sm leading-snug flex-1">${sym ? sym.title : h.symptomId}</div>
          <span class="text-[10px] font-black ${pill} px-2.5 py-1 rounded-full shrink-0">
            ${h.outcome === 'resolved' ? 'Résolu' : h.outcome === 'sav' ? 'SAV' : 'Pièce'}
          </span>
        </div>
        <div class="text-[11px] text-slate-400 font-medium mt-1">${formatDate(h.date)} · ${h.path.length} étapes</div>
        ${h.answers?.length ? `
          <div class="mt-2.5 flex flex-wrap gap-1">
            ${h.answers.slice(-4).map(a =>
              `<span class="text-[10px] bg-slate-100 text-slate-500 font-medium px-2 py-0.5 rounded-lg">${a}</span>`
            ).join('')}
          </div>` : ''}
      </div>`;
  }).join('');
}
