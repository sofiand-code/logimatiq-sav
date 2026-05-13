/* ============================================================================
   SYMPTOMS — Liste des symptômes d'une machine
   ========================================================================== */
import { DATA } from '../data/tree.js';
import { ICONS } from '../components/icons.js';
import { t } from '../i18n.js';

const CATEGORY_BADGE = {
  'Affichage': { bg: '#EFF5FB', color: '#0F4C81' },
  'Réseau':    { bg: '#ECFDF5', color: '#059669' },
  'Badge':     { bg: '#FFFBEB', color: '#D97706' },
  'Logiciel':  { bg: '#EFF5FB', color: '#1E6CB8' },
  'Config':    { bg: '#F5F3FF', color: '#7C3AED' },
  '—':         { bg: '#F1F5F9', color: '#94A3B8' },
};

export function renderSymptoms(machineId, onStart) {
  const m = DATA.machines.find(x => x.id === machineId);
  document.getElementById('sym-machine-label').textContent = m ? m.name : machineId;

  const symptoms = DATA.symptoms[machineId] || [];
  const list = document.getElementById('symptoms-list');

  list.innerHTML = symptoms.map(s => {
    const cat = CATEGORY_BADGE[s.category] || CATEGORY_BADGE['—'];
    const disabled = s.rootNode === 'tbd';
    const catLabel = t(s.category);
    return `
      <button data-symptom="${s.id}" ${disabled ? 'disabled' : ''}
        class="tap-card w-full bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex items-center gap-4 text-left ${disabled ? 'opacity-50' : ''}">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
             style="background:#EFF5FB;color:#0F4C81">
          ${ICONS[s.icon] || ICONS.screen}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-black text-slate-900 text-sm leading-snug">${s.title}</div>
          <span class="inline-block mt-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                style="background:${cat.bg};color:${cat.color}">
            ${disabled ? t('Bientôt disponible') : catLabel}
          </span>
        </div>
        ${!disabled ? `
        <div class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/>
          </svg>
        </div>` : ''}
      </button>`;
  }).join('');

  list.querySelectorAll('[data-symptom]:not([disabled])').forEach(btn =>
    btn.addEventListener('click', () => onStart(btn.dataset.symptom))
  );
}
