/* ============================================================================
   HOME — Grille des machines + diagnostics récents
   ========================================================================== */
import { DATA } from '../data/tree.js';
import { ICONS } from '../components/icons.js';
import { loadHistory, outcomePill, formatDate } from '../components/history-store.js';

// Dégradés de couleur par machine
const MACHINE_STYLES = {
  epimat:   { bg: 'from-brand-600 to-brand-700',   light: 'bg-brand-50',   text: 'text-brand-600'   },
  distepi:  { bg: 'from-brand-500 to-brand-600',   light: 'bg-brand-50',   text: 'text-brand-500'   },
  gsm:      { bg: 'from-emerald-500 to-emerald-700', light: 'bg-emerald-50', text: 'text-emerald-600' },
  pc:       { bg: 'from-slate-600 to-slate-800',   light: 'bg-slate-100',  text: 'text-slate-600'   },
  badge:    { bg: 'from-amber-500 to-amber-600',   light: 'bg-amber-50',   text: 'text-amber-600'   },
  colonnes: { bg: 'from-rose-500 to-rose-700',     light: 'bg-rose-50',    text: 'text-rose-600'    },
};

export function renderHome(onOpenMachine, onRestartSymptom) {
  // Grille des machines
  const grid = document.getElementById('machine-grid');
  grid.innerHTML = DATA.machines.map(m => {
    const s = MACHINE_STYLES[m.id] || MACHINE_STYLES.epimat;
    const count = (DATA.symptoms[m.id] || []).length;
    return `
      <button data-machine="${m.id}"
        class="tap-card bg-white rounded-3xl p-4 text-left border border-slate-100 shadow-sm overflow-hidden relative">
        <!-- fond décoratif -->
        <div class="absolute top-0 right-0 w-20 h-20 rounded-bl-3xl bg-gradient-to-br ${s.bg} opacity-10"></div>
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br ${s.bg} text-white flex items-center justify-center shadow-md mb-3">
          ${ICONS[m.icon] || ICONS.machine}
        </div>
        <div class="font-black text-slate-900 text-sm leading-tight">${m.name}</div>
        <div class="text-[11px] ${s.text} font-semibold mt-0.5">${count} symptôme${count > 1 ? 's' : ''}</div>
      </button>`;
  }).join('');

  grid.querySelectorAll('[data-machine]').forEach(btn =>
    btn.addEventListener('click', () => onOpenMachine(btn.dataset.machine))
  );

  // Diagnostics récents
  const recents = loadHistory().slice(0, 2);
  const list = document.getElementById('recent-list');
  if (!recents.length) {
    list.innerHTML = `<p class="text-sm text-slate-400 font-medium py-2">Aucun diagnostic récent.</p>`;
    return;
  }
  list.innerHTML = recents.map(h => {
    const sym = findSymptom(h.symptomId);
    const pill = outcomePill(h.outcome);
    return `
      <button data-symptom="${h.symptomId}"
        class="tap-card w-full bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center gap-3 text-left">
        <div class="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
          ${ICONS.screen}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-bold text-slate-900 truncate">${sym ? sym.title : h.symptomId}</div>
          <div class="text-[11px] text-slate-400 mt-0.5">${formatDate(h.date)}</div>
        </div>
        <span class="text-[10px] font-bold ${pill} px-2.5 py-1 rounded-full shrink-0">
          ${h.outcome === 'resolved' ? 'Résolu' : h.outcome === 'sav' ? 'SAV' : 'Pièce'}
        </span>
      </button>`;
  }).join('');

  list.querySelectorAll('[data-symptom]').forEach(btn =>
    btn.addEventListener('click', () => onRestartSymptom(btn.dataset.symptom))
  );
}

export function findSymptom(id) {
  for (const machineId of Object.keys(DATA.symptoms)) {
    const found = (DATA.symptoms[machineId] || []).find(s => s.id === id);
    if (found) return found;
  }
  return null;
}
