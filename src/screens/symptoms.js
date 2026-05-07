/* ============================================================================
   SYMPTOMS — Liste des symptômes d'une machine
   ========================================================================== */
import { DATA } from '../data/tree.js';
import { ICONS } from '../components/icons.js';

/**
 * Remplit l'écran Symptômes pour la machine sélectionnée.
 * @param {string} machineId
 * @param {Function} onStart - callback(symptomId)
 */
export function renderSymptoms(machineId, onStart) {
  const m = DATA.machines.find(x => x.id === machineId);
  document.getElementById('sym-machine-label').textContent = m ? m.name : machineId;

  const symptoms = DATA.symptoms[machineId] || [];
  const list = document.getElementById('symptoms-list');
  list.innerHTML = symptoms.map(s => `
    <button data-symptom="${s.id}" class="tap-card w-full bg-white rounded-2xl p-4 border border-slate-200 flex items-center gap-3 text-left">
      <div class="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
        ${ICONS[s.icon] || ICONS.screen}
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-slate-900 text-sm">${s.title}</div>
        <div class="text-[11px] text-slate-500 mt-0.5">${s.category}</div>
      </div>
      <svg viewBox="0 0 24 24" class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/>
      </svg>
    </button>
  `).join('');

  list.querySelectorAll('[data-symptom]').forEach(btn => {
    btn.addEventListener('click', () => onStart(btn.dataset.symptom));
  });
}
