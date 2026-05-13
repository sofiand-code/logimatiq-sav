/* ============================================================================
   KB — Base de connaissances (Fiches PDF + Codes erreur)
   ========================================================================== */
import { renderErrors } from './errors.js';
import { t } from '../i18n.js';

/* ----------------------------------------------------------------------------
   AJOUTER UN PDF  → copier le fichier dans public/docs/  puis ajouter une
                     ligne ci-dessous avec  type:'pdf', file:'nom-du-fichier.pdf'
   AJOUTER UNE VIDÉO → ajouter une ligne avec type:'video', url:'https://...'
   ---------------------------------------------------------------------------- */
const KB_ENTRIES = [
  {
    id: 'kb1',
    title: 'Manuel maintenance EPIMAT',
    title_en: 'EPIMAT maintenance manual',
    tags: ['epimat', 'maintenance', 'pdf'],
    type: 'pdf',
    file: 'Manuel Maintenance EPIMAT_eng.pdf',
  },
  {
    id: 'kb2',
    title: 'Tuto EPIMAT (procédures)',
    title_en: 'EPIMAT tutorial (procedures)',
    tags: ['epimat', 'tuto', 'pdf'],
    type: 'pdf',
    file: 'tuto EPIMAT.pdf',
  },
  {
    id: 'kb3',
    title: 'Initialisation badges Kalistrut',
    title_en: 'Kalistrut badge initialization',
    tags: ['badge', 'distepi', 'pdf'],
    type: 'pdf',
    file: 'initialisation badges kalistrut .pdf',
  },
  {
    id: 'kb4',
    title: 'Remplacement carte SIM & APN',
    title_en: 'SIM card replacement & APN setup',
    tags: ['gsm', 'modem', 'sim', 'apn'],
    type: 'pdf',
    file: 'SIM Card Replacement and APN Setup Procedure.pdf',
  },
  {
    id: 'kb5',
    title: 'Tutoriel Vetimat Kalistrut',
    title_en: 'Kalistrut Vetimat tutorial',
    tags: ['vetimat', 'kalistrut', 'tuto'],
    type: 'pdf',
    file: 'Tutoriel vetimat KALISTRUT.pdf',
  },
  {
    id: 'kb6',
    title: 'Tuto tresse',
    title_en: 'Cable braid tutorial',
    tags: ['tresse', 'epimat'],
    type: 'pdf',
    file: 'tuto tresse.pdf',
  },
  {
    id: 'kb7',
    title: 'Manuel utilisateur EPIMAT (EN)',
    title_en: 'EPIMAT user manual (EN)',
    tags: ['epimat', 'installation', 'user'],
    type: 'pdf',
    file: 'User & installation Manual EPIMAT EN.pdf',
  },

  /* ---- VIDÉOS ---- */
  /* Pour ajouter une vidéo YouTube, décommenter et adapter le bloc ci-dessous :

  {
    id: 'v1',
    title: 'Présentation EPIMAT — mise en service',
    title_en: 'EPIMAT presentation — installation',
    tags: ['epimat', 'installation', 'vidéo'],
    type: 'video',
    url: 'https://www.youtube.com/watch?v=XXXXXXXX',
    duration: '4 min',
  },

  */
];

let activeTab = 'fiches'; // 'fiches' | 'erreurs'

export function renderKB() {
  renderTabBar();
  if (activeTab === 'fiches') renderFiches();
  else renderErrorsTab();
}

/* ------------------------------------------------------------------ */
function renderTabBar() {
  const bar = document.getElementById('kb-tabs');
  if (!bar) return;
  bar.innerHTML = `
    <button data-tab="fiches"
      class="flex-1 py-2 text-xs font-black rounded-xl transition-all
             ${activeTab === 'fiches'
               ? 'bg-brand-600 text-white shadow-sm'
               : 'text-slate-400 hover:text-slate-600'}">
      📄 ${t('Fiches PDF')}
    </button>
    <button data-tab="erreurs"
      class="flex-1 py-2 text-xs font-black rounded-xl transition-all
             ${activeTab === 'erreurs'
               ? 'bg-brand-600 text-white shadow-sm'
               : 'text-slate-400 hover:text-slate-600'}">
      🔴 ${t('Codes erreur')}
    </button>`;

  bar.querySelectorAll('[data-tab]').forEach(btn =>
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      const input = document.getElementById('kb-search');
      if (input) {
        input.placeholder = activeTab === 'fiches'
          ? t('écran noir, modem, badge…')
          : t('ERR_SYNC, badge, réseau…');
        input.value = '';
      }
      renderKB();
    })
  );
}

/* ---- Onglet Fiches PDF + Vidéos ---- */
function renderFiches() {
  const q = (document.getElementById('kb-search')?.value || '').toLowerCase().trim();
  const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';

  const filtered = KB_ENTRIES.filter(e => {
    if (!q) return true;
    const title = (e.title_en && lang === 'en') ? e.title_en : e.title;
    return title.toLowerCase().includes(q) || e.tags.some(tag => tag.includes(q));
  });

  const list = document.getElementById('kb-list');

  if (!filtered.length) {
    list.innerHTML = `
      <div class="text-center py-10">
        <p class="text-sm text-slate-400 font-medium">${t('Aucun résultat pour')} "${q}"</p>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map(e => {
    const title = (e.title_en && lang === 'en') ? e.title_en : e.title;
    const isVideo = e.type === 'video';

    const icon = isVideo
      ? `<!-- Icône vidéo -->
         <div class="w-12 h-14 rounded-xl flex flex-col items-center justify-center
                     shrink-0 gap-1" style="background:#FFF7ED">
           <svg viewBox="0 0 24 24" class="w-5 h-5" style="color:#EA580C"
                fill="currentColor">
             <path d="M8 5.14v14l11-7-11-7z"/>
           </svg>
           <span class="text-[9px] font-black" style="color:#EA580C">${e.duration || 'VIDEO'}</span>
         </div>`
      : `<!-- Icône PDF -->
         <div class="w-12 h-14 rounded-xl flex flex-col items-center justify-center
                     shrink-0 gap-1" style="background:#FEF2F2">
           <svg viewBox="0 0 24 24" class="w-5 h-5" style="color:#DC2626"
                fill="none" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round"
               d="M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414
                  A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"/>
           </svg>
           <span class="text-[9px] font-black" style="color:#DC2626">PDF</span>
         </div>`;

    return `
      <button data-kb-id="${e.id}"
        class="tap-card w-full bg-white border border-slate-200 rounded-2xl p-4
               flex items-center gap-4 text-left shadow-sm">
        ${icon}
        <div class="flex-1 min-w-0">
          <div class="font-bold text-slate-900 text-sm leading-snug">${title}</div>
          <div class="text-[11px] text-slate-400 mt-1 truncate">
            ${e.tags.map(tag => '#' + tag).join(' ')}
          </div>
        </div>
        <svg viewBox="0 0 24 24" class="w-5 h-5 text-slate-300 shrink-0"
             fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/>
        </svg>
      </button>`;
  }).join('');

  /* ---- Gestionnaire de clic : ouvrir PDF ou vidéo ---- */
  list.querySelectorAll('[data-kb-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const entry = KB_ENTRIES.find(en => en.id === btn.dataset.kbId);
      if (!entry) return;

      const url = entry.type === 'video'
        ? entry.url
        : '/docs/' + encodeURIComponent(entry.file);

      /* Sur iOS PWA, window.open(_blank) est bloqué → on utilise un <a> */
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  });
}

/* ---- Onglet Codes erreur ---- */
function renderErrorsTab() {
  const q = document.getElementById('kb-search')?.value || '';
  renderErrors(q);
}
