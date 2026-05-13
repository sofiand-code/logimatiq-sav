/* ============================================================================
   HOME — Grille des machines + diagnostics récents
   ========================================================================== */
import { DATA } from '../data/tree.js';
import { ICONS } from '../components/icons.js';
import { getUser, getRoleLabel } from '../data/user-store.js';
import { t, tSymptom } from '../i18n.js';

const MACHINE_STYLES = {
  epimat:   { bg: '#0F4C81', light: '#EFF5FB', text: '#0F4C81' },
  logiciel: { bg: '#1E6CB8', light: '#EFF5FB', text: '#1E6CB8' },
  vetimat:  { bg: '#059669', light: '#ECFDF5', text: '#059669' },
};

export function renderHome(onOpenMachine, onSetup, onStats, onEditProfile) {
  /* ---- Infos utilisateur dans le header ---- */
  const user = getUser();
  const userInfoEl = document.getElementById('home-user-info');
  if (userInfoEl && user) {
    userInfoEl.innerHTML = `
      <span class="font-black text-slate-900 text-sm truncate">${user.companyName}</span>
      <span class="text-[10px] text-slate-400 font-medium truncate">${user.staffName} · ${t(getRoleLabel(user.role))}</span>`;
  }
  const profileBadge = document.getElementById('home-profile-badge');
  if (profileBadge) profileBadge.onclick = () => onEditProfile?.();

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
          ${hasContent ? `${count} diagnostic${count > 1 ? 's' : ''}` : t('Bientôt disponible')}
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

  /* ---- Bouton Statistiques ---- */
  document.getElementById('btn-stats')
    ?.addEventListener('click', () => onStats?.());

}

export function findSymptom(id) {
  for (const machineId of Object.keys(DATA.symptoms)) {
    const found = (DATA.symptoms[machineId] || []).find(s => s.id === id);
    if (found) return found;
  }
  return null;
}
