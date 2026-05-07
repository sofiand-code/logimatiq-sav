/* ============================================================================
   HOME — Grille des machines + diagnostics récents
   ========================================================================== */
import { DATA } from '../data/tree.js';
import { ICONS } from '../components/icons.js';
import { loadHistory, outcomePill, formatDate } from '../components/history-store.js';
import { getProfileMeta } from './profile.js';

const MACHINE_STYLES = {
  epimat:   { bg: '#0F4C81', light: '#EFF5FB', text: '#0F4C81' },
  logiciel: { bg: '#1E6CB8', light: '#EFF5FB', text: '#1E6CB8' },
  vetimat:  { bg: '#059669', light: '#ECFDF5', text: '#059669' },
};

export function renderHome(onOpenMachine, onRestartSymptom, onSetup) {
  /* ---- Badge profil dans le header ---- */
  const profileMeta = getProfileMeta();
  const profileBadge = document.getElementById('home-profile-badge');
  if (profileBadge && profileMeta) {
    profileBadge.style.background = profileMeta.color + '18';
    profileBadge.style.color      = profileMeta.color;
    profileBadge.title            = profileMeta.label;
    profileBadge.innerHTML = `
      <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="${profileMeta.iconPath}"/>
      </svg>`;
  }

  /* ---- Grille machines ---- */
  const grid = document.getElementById('machine-grid');
  grid.innerHTML = DATA.machines.map(m => {
    const s = MACHINE_STYLES[m.id] || MACHINE_STYLES.epimat;
    const count = (DATA.symptoms[m.id] || []).length;
    const hasContent = DATA.symptoms[m.id]?.some(s => s.rootNode !== 'tbd');
    return `
      <button data-machine="${m.id}"
        class="tap-card bg-white rounded-3xl p-4 text-left border border-slate-200 shadow-sm ${!hasContent ? 'opacity-60' : ''}">
        <div class="w-12 h-12 rounded-2xl text-white flex items-center justify-center mb-3 shadow-sm"
             style="background:${s.bg}">
          ${ICONS[m.icon] || ICONS.machine}
        </div>
        <div class="font-black text-slate-900 text-sm leading-tight">${m.name}</div>
        <div class="text-[11px] font-semibold mt-0.5" style="color:${s.text}">
          ${hasContent ? `${count} diagnostic${count > 1 ? 's' : ''}` : 'Bientôt disponible'}
        </div>
      </button>`;
  }).join('');

  grid.querySelectorAll('[data-machine]').forEach(btn =>
    btn.addEventListener('click', () => onOpenMachine(btn.dataset.machine))
  );

  /* ---- Carte Guide de mise en service ---- */
  const setupCard = document.getElementById('setup-card');
  if (setupCard) {
    setupCard.addEventListener('click', () => onSetup?.());
  }

  /* ---- Récents ---- */
  const recents = loadHistory().slice(0, 2);
  const list = document.getElementById('recent-list');
  if (!recents.length) {
    list.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-center">
        <p class="text-sm text-slate-400 font-medium">Aucun diagnostic récent</p>
        <p class="text-xs text-slate-300 mt-1">Les diagnostics terminés apparaîtront ici</p>
      </div>`;
    return;
  }
  list.innerHTML = recents.map(h => {
    const sym = findSymptom(h.symptomId);
    return `
      <button data-symptom="${h.symptomId}"
        class="tap-card w-full bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex items-center gap-3 text-left">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
             style="background:#EFF5FB;color:#0F4C81">
          ${ICONS.screen}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-bold text-slate-900 truncate">${sym ? sym.title : h.symptomId}</div>
          <div class="text-[11px] text-slate-400 mt-0.5">${formatDate(h.date)}</div>
        </div>
        <span class="text-[10px] font-bold ${outcomePill(h.outcome)} px-2.5 py-1 rounded-full shrink-0">
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
