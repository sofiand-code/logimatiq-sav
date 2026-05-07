/* ============================================================================
   SYMPTOMS — Liste des symptômes d'une machine
   ========================================================================== */
import { DATA } from '../data/tree.js';
import { ICONS } from '../components/icons.js';

const CATEGORY_COLORS = {
  'Affichage': 'bg-blue-50 text-blue-600',
  'Réseau':    'bg-emerald-50 text-emerald-600',
  'Badge':     'bg-amber-50 text-amber-600',
  '—':         'bg-slate-100 text-slate-400',
};

export function renderSymptoms(machineId, onStart) {
  const m = DATA.machines.find(x => x.id === machineId);
  document.getElementById('sym-machine-label').textContent = m ? m.name : machineId;

  const symptoms = DATA.symptoms[machineId] || [];
  const list = document.getElementById('symptoms-list');
  list.innerHTML = symptoms.map((s, i) => {
    const catStyle = CATEGORY_COLORS[s.category] || 'bg-slate-100 text-slate-500';
    return `
      <button data-symptom="${s.id}"
        class="tap-card w-full bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 text-left">
        <div class="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
          ${ICONS[s.icon] || ICONS.screen}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-black text-slate-900 text-sm leading-snug">${s.title}</div>
          <span class="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${catStyle}">
            ${s.category}
          </span>
        </div>
        <div class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/>
          </svg>
        </div>
      </button>`;
  }).join('');

  list.querySelectorAll('[data-symptom]').forEach(btn =>
    btn.addEventListener('click', () => onStart(btn.dataset.symptom))
  );
}
