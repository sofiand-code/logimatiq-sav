/* ============================================================================
   PROFILE — Sélection du profil utilisateur (première ouverture)
   ========================================================================== */

const STORAGE_KEY = 'logimatiq_profile';

const PROFILES = [
  {
    id: 'client',
    label: 'Client',
    desc: 'Utilisateur de la machine EPIMAT',
    color: '#0F4C81',
    iconPath: 'M16 14a4 4 0 1 0-8 0M12 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
  },
  {
    id: 'tech_reseller',
    label: 'Technicien revendeur',
    desc: 'Technicien d\'un distributeur Logimatiq',
    color: '#059669',
    iconPath: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3-3a1 1 0 0 0-1.4-1.4l-2.3 2.3-1-1a1 1 0 0 0-1.3 0zM3 21v-3.5A3.5 3.5 0 0 1 6.5 14H11M7 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0z',
  },
  {
    id: 'tech_logimatiq',
    label: 'Technicien Logimatiq',
    desc: 'Équipe technique interne Logimatiq',
    color: '#D97706',
    iconPath: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
  },
];

export function renderProfile(onSelect) {
  const list = document.getElementById('profile-list');
  list.innerHTML = PROFILES.map(p => `
    <button data-profile="${p.id}"
      class="tap-card w-full bg-white border-2 border-slate-200 rounded-3xl p-5
             flex items-center gap-4 text-left shadow-sm">
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
           style="background:${p.color}18">
        <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="${p.color}" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="${p.iconPath}"/>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-black text-slate-900 text-base">${p.label}</div>
        <div class="text-sm text-slate-400 font-medium mt-0.5">${p.desc}</div>
      </div>
      <svg viewBox="0 0 24 24" class="w-5 h-5 text-slate-300 shrink-0"
           fill="none" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/>
      </svg>
    </button>`).join('');

  list.querySelectorAll('[data-profile]').forEach(btn =>
    btn.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, btn.dataset.profile);
      onSelect(btn.dataset.profile);
    })
  );
}

export function getProfile() {
  return localStorage.getItem(STORAGE_KEY);
}

export function getProfileMeta() {
  const id = getProfile();
  return PROFILES.find(p => p.id === id) || null;
}

export function getProfileLabel() {
  const meta = getProfileMeta();
  return meta ? meta.label : null;
}
