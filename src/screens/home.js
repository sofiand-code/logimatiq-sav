/* ============================================================================
   HOME — Grille des machines + diagnostics récents
   ========================================================================== */
import { DATA } from '../data/tree.js';
import { ICONS } from '../components/icons.js';
import { loadHistory, outcomePill, formatDate } from '../components/history-store.js';

/**
 * Rend la grille des machines et la liste des diagnostics récents.
 * @param {Function} onOpenMachine  - callback(machineId)
 * @param {Function} onRestartSymptom - callback(symptomId)
 */
export function renderHome(onOpenMachine, onRestartSymptom) {
  // Grille des machines
  const grid = document.getElementById('machine-grid');
  grid.innerHTML = DATA.machines.map(m => `
    <button data-machine="${m.id}" class="tap-card bg-white rounded-2xl p-4 text-left border border-slate-200 shadow-sm">
      <div class="w-11 h-11 ${m.color} rounded-xl text-white flex items-center justify-center">
        ${ICONS[m.icon] || ICONS.machine}
      </div>
      <div class="mt-3 font-semibold text-slate-900 text-sm">${m.name}</div>
      <div class="text-[11px] text-slate-500">${(DATA.symptoms[m.id] || []).length} symptôme(s)</div>
    </button>
  `).join('');
  grid.querySelectorAll('[data-machine]').forEach(btn => {
    btn.addEventListener('click', () => onOpenMachine(btn.dataset.machine));
  });

  // Diagnostics récents
  const recents = loadHistory().slice(0, 2);
  const list = document.getElementById('recent-list');
  if (!recents.length) {
    list.innerHTML = `<p class="text-sm text-slate-500">Pas encore de diagnostic terminé.</p>`;
    return;
  }
  list.innerHTML = recents.map(h => {
    const sym = findSymptom(h.symptomId);
    return `
      <button data-symptom="${h.symptomId}" class="tap-card w-full bg-white rounded-2xl p-3 border border-slate-200 flex items-center gap-3 text-left">
        <div class="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">${ICONS.screen}</div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold text-slate-900 truncate">${sym ? sym.title : h.symptomId}</div>
          <div class="text-[11px] text-slate-500">${formatDate(h.date)} · ${h.outcomeLabel}</div>
        </div>
        <span class="text-xs ${outcomePill(h.outcome)} px-2 py-0.5 rounded-full">
          ${h.outcome === 'resolved' ? 'Résolu' : h.outcome === 'sav' ? 'SAV' : 'Pièce'}
        </span>
      </button>`;
  }).join('');
  list.querySelectorAll('[data-symptom]').forEach(btn => {
    btn.addEventListener('click', () => onRestartSymptom(btn.dataset.symptom));
  });
}

/* Recherche d'un symptôme dans toutes les machines */
export function findSymptom(id) {
  for (const machineId of Object.keys(DATA.symptoms)) {
    const found = (DATA.symptoms[machineId] || []).find(s => s.id === id);
    if (found) return found;
  }
  return null;
}
