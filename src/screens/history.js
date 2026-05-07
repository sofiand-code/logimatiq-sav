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
      <div class="text-center py-16 text-slate-500">
        <div class="inline-flex w-14 h-14 rounded-2xl bg-slate-100 items-center justify-center mb-3">
          <svg viewBox="0 0 24 24" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 7v5l3 2"/>
          </svg>
        </div>
        <p class="text-sm">Aucun diagnostic terminé pour le moment.</p>
      </div>`;
    return;
  }

  // Mini statistiques
  const total    = arr.length;
  const resolved = arr.filter(x => x.outcome === 'resolved').length;
  const rate     = Math.round((resolved / total) * 100);

  const stats = `
    <div class="grid grid-cols-3 gap-2 mb-4">
      <div class="bg-white rounded-2xl p-3 border border-slate-200 text-center">
        <div class="text-xl font-bold text-slate-900">${total}</div>
        <div class="text-[10px] text-slate-500 uppercase tracking-wider">Total</div>
      </div>
      <div class="bg-white rounded-2xl p-3 border border-slate-200 text-center">
        <div class="text-xl font-bold text-emerald-600">${resolved}</div>
        <div class="text-[10px] text-slate-500 uppercase tracking-wider">Résolus</div>
      </div>
      <div class="bg-white rounded-2xl p-3 border border-slate-200 text-center">
        <div class="text-xl font-bold text-brand-600">${rate}%</div>
        <div class="text-[10px] text-slate-500 uppercase tracking-wider">Taux</div>
      </div>
    </div>`;

  list.innerHTML = stats + arr.map(h => {
    const sym = findSymptom(h.symptomId);
    return `
      <div class="bg-white border border-slate-200 rounded-2xl p-3.5 mb-2">
        <div class="flex items-center justify-between gap-2">
          <div class="font-semibold text-slate-900 text-sm">${sym ? sym.title : h.symptomId}</div>
          <span class="text-[11px] ${outcomePill(h.outcome)} px-2 py-0.5 rounded-full whitespace-nowrap">
            ${h.outcome === 'resolved' ? 'Résolu' : h.outcome === 'sav' ? 'SAV' : 'Pièce'}
          </span>
        </div>
        <div class="text-[11px] text-slate-500 mt-0.5">${formatDate(h.date)} · ${h.path.length} étapes</div>
        ${h.answers && h.answers.length ? `
          <div class="mt-2 flex flex-wrap gap-1">
            ${h.answers.slice(-4).map(a => `<span class="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">${a}</span>`).join('')}
          </div>` : ''}
      </div>`;
  }).join('');
}
