/* ============================================================================
   KB — Base de connaissances : fiches d'intervention + documents + codes erreur
   ========================================================================== */
import { renderErrors } from './errors.js';
import { t, getLang } from '../i18n.js';
import { FICHES, FICHE_FAMILIES, HOTLINE } from '../data/fiches-data.js';
import { bindZoom } from '../components/media.js';

/* ----------------------------------------------------------------------------
   AJOUTER UN PDF  → copier le fichier dans public/docs/  puis ajouter une
                     ligne ci-dessous avec  type:'pdf', file:'nom-du-fichier.pdf'
                     (dépôt public : aucun document interne, aucun identifiant)
   AJOUTER UNE VIDÉO → ajouter une ligne avec type:'video', url:'https://...'
   Les procédures de remplacement sont des fiches intégrées : src/data/fiches-data.js
   ---------------------------------------------------------------------------- */
const KB_ENTRIES = [
  {
    id: 'kb4',
    title: 'Remplacement carte SIM & APN',
    title_en: 'SIM card replacement & APN setup',
    tags: ['gsm', 'modem', 'sim', 'apn'],
    type: 'pdf',
    file: 'SIM Card Replacement and APN Setup Procedure.pdf',
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
let openFicheId = null;   // accordéon : une seule fiche ouverte à la fois

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tr = (pair) => (getLang() === 'en' ? pair.en : pair.fr) || pair.fr;

/** Ouvre une fiche (depuis une conclusion de diagnostic) ; l'appelant navigue ensuite vers 'kb'. */
export function openFiche(id) {
  activeTab = 'fiches';
  openFicheId = id;
  const input = document.getElementById('kb-search');
  if (input) input.value = '';
}

/** Fiche liée à une conclusion d'arbre (champ `solutions` des fiches). */
export function ficheForSolution(nodeId) {
  return FICHES.find(f => f.solutions.includes(nodeId)) || null;
}

export function renderKB() {
  renderTabBar();
  if (activeTab === 'fiches') renderFiches();
  else renderErrorsTab();
}

/* ------------------------------------------------------------------ */
const TAB_ICONS = {
  fiches: '<svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/></svg>',
  erreurs: '<svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>',
};

function renderTabBar() {
  const bar = document.getElementById('kb-tabs');
  if (!bar) return;
  const tab = (id, label) => `
    <button data-tab="${id}"
      class="flex-1 py-2 text-xs font-black rounded-xl transition-all inline-flex items-center justify-center gap-1.5
             ${activeTab === id ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}">
      ${TAB_ICONS[id]} ${label}
    </button>`;
  bar.innerHTML = tab('fiches', t("Fiches d'intervention")) + tab('erreurs', t('Codes erreur'));

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

/* ---- Onglet Fiches : fiches d'intervention + documents ---- */
function renderFiches() {
  const q = (document.getElementById('kb-search')?.value || '').toLowerCase().trim();
  const lang = getLang();
  const list = document.getElementById('kb-list');

  const fiches = FICHES.filter(f => !q
    || [f.title, f.subtitle, FICHE_FAMILIES[f.family].label].some(p => tr(p).toLowerCase().includes(q)));
  const docs = KB_ENTRIES.filter(e => !q
    || ((lang === 'en' && e.title_en) || e.title).toLowerCase().includes(q) || e.tags.some(tag => tag.includes(q)));

  if (!fiches.length && !docs.length) {
    list.innerHTML = `
      <div class="text-center py-10">
        <p class="text-sm text-slate-400 font-medium">${t('Aucun résultat pour')} "${esc(q)}"</p>
      </div>`;
    return;
  }

  list.innerHTML = `
    ${fiches.length ? `<p class="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">${t("Fiches d'intervention")}</p>` : ''}
    ${fiches.map(renderFicheCard).join('')}
    ${docs.length ? `<p class="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 pt-3">${t('Documents')}</p>` : ''}
    ${docs.map(renderDocCard).join('')}`;

  list.querySelectorAll('[data-fiche-toggle]').forEach(btn =>
    btn.addEventListener('click', () => {
      const id = btn.dataset.ficheToggle;
      openFicheId = openFicheId === id ? null : id;
      renderFiches();
    })
  );
  bindZoom(list);
  list.querySelectorAll('[data-kb-id]').forEach(btn =>
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const entry = KB_ENTRIES.find(en => en.id === btn.dataset.kbId);
      if (!entry) return;
      const url = entry.type === 'video' ? entry.url : '/docs/' + encodeURIComponent(entry.file);
      /* Sur iOS PWA, window.open(_blank) est bloqué → on utilise un <a> */
      const a = document.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    })
  );

  if (openFicheId) list.querySelector(`[data-fiche="${openFicheId}"]`)?.scrollIntoView({ block: 'start' });
}

function renderFicheCard(f) {
  const fam = FICHE_FAMILIES[f.family];
  const isOpen = openFicheId === f.id;
  return `
    <div data-fiche="${f.id}" class="rounded-2xl overflow-hidden shadow-sm border ${isOpen ? 'border-slate-300' : 'border-slate-200'} bg-white">
      <button data-fiche-toggle="${f.id}" class="w-full text-left tap-card flex items-center gap-3 p-4"
              style="${isOpen ? `background:${fam.bg}` : ''}">
        <div class="w-1.5 self-stretch rounded-full shrink-0" style="background:${fam.color}"></div>
        <div class="flex-1 min-w-0">
          <div class="font-black text-slate-900 text-sm leading-snug">${esc(tr(f.title))}</div>
          <div class="text-[11px] text-slate-500 mt-1">${esc(tr(f.subtitle))}</div>
          <span class="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style="background:${fam.bg};color:${fam.color}">${esc(tr(fam.label))}</span>
        </div>
        <svg viewBox="0 0 24 24" class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200"
             style="transform:rotate(${isOpen ? '90' : '0'}deg)" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/>
        </svg>
      </button>
      ${isOpen ? renderFicheDetail(f, fam) : ''}
    </div>`;
}

function renderFicheDetail(f, fam) {
  const media = f.media.map(m => `
    <figure class="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
      <button type="button" data-zoom="/${esc(m.file)}" data-alt="${esc(tr(m))}" class="block w-full">
        <img src="/${esc(m.file)}" alt="${esc(tr(m))}" loading="lazy" decoding="async"
             class="w-full" style="height:150px;object-fit:contain;background:#f8fafc"/>
      </button>
      <figcaption class="text-[10px] text-slate-500 font-medium text-center py-1.5 px-2">${esc(tr(m))}</figcaption>
    </figure>`).join('');

  const block = (b) => {
    const items = b.items.map(tr);
    if (b.kind === 'steps') return `
      <div>
        <p class="text-[10px] font-black uppercase tracking-widest mb-2" style="color:${fam.color}">${esc(tr(b.title))}</p>
        <ol class="space-y-2">${items.map((s, i) => `
          <li class="flex items-start gap-2.5">
            <span class="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-0.5" style="background:${fam.color}">${i + 1}</span>
            <span class="text-[12px] text-slate-700 leading-relaxed">${esc(s)}</span>
          </li>`).join('')}
        </ol>
      </div>`;
    if (b.kind === 'warn') return `
      <div class="rounded-xl border border-amber-200 bg-amber-50 p-3">
        <p class="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-1">${esc(tr(b.title))}</p>
        ${items.map(s => `<p class="text-[12px] text-amber-900 leading-relaxed">${esc(s)}</p>`).join('')}
      </div>`;
    if (b.kind === 'check') return `
      <div class="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
        <p class="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1.5">${esc(tr(b.title))}</p>
        <ul class="space-y-1">${items.map(s => `
          <li class="flex items-start gap-2 text-[12px] text-emerald-900">
            <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4.5 4.5L19 7"/></svg>
            <span>${esc(s)}</span>
          </li>`).join('')}
        </ul>
      </div>`;
    return `
      <div>
        <p class="text-[10px] font-black uppercase tracking-widest mb-1.5" style="color:${fam.color}">${esc(tr(b.title))}</p>
        <ul class="space-y-1">${items.map(s => `
          <li class="flex items-start gap-2 text-[12px] text-slate-700 leading-relaxed">
            <span class="mt-0.5 shrink-0" style="color:${fam.color}">▸</span><span>${esc(s)}</span>
          </li>`).join('')}
        </ul>
      </div>`;
  };

  return `
    <div class="border-t border-slate-100 px-4 pt-3 pb-4 space-y-4">
      <p class="text-[11px] text-slate-500 leading-relaxed">${esc(tr(HOTLINE))}</p>
      ${media ? `<div class="grid grid-cols-2 gap-2">${media}</div>` : ''}
      ${f.blocks.map(block).join('')}
    </div>`;
}

function renderDocCard(e) {
  const title = (getLang() === 'en' && e.title_en) ? e.title_en : e.title;
  const isVideo = e.type === 'video';
  const icon = isVideo
    ? `<div class="w-12 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 gap-1" style="background:#FFF7ED">
         <svg viewBox="0 0 24 24" class="w-5 h-5" style="color:#EA580C" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>
         <span class="text-[9px] font-black" style="color:#EA580C">${e.duration || 'VIDEO'}</span>
       </div>`
    : `<div class="w-12 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 gap-1" style="background:#FEF2F2">
         <svg viewBox="0 0 24 24" class="w-5 h-5" style="color:#DC2626" fill="none" stroke="currentColor" stroke-width="2">
           <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"/>
         </svg>
         <span class="text-[9px] font-black" style="color:#DC2626">PDF</span>
       </div>`;
  return `
    <button data-kb-id="${e.id}"
      class="tap-card w-full bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 text-left shadow-sm">
      ${icon}
      <div class="flex-1 min-w-0">
        <div class="font-bold text-slate-900 text-sm leading-snug">${esc(title)}</div>
        <div class="text-[11px] text-slate-400 mt-1 truncate">${e.tags.map(tag => '#' + tag).join(' ')}</div>
      </div>
      <svg viewBox="0 0 24 24" class="w-5 h-5 text-slate-300 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/>
      </svg>
    </button>`;
}

/* ---- Onglet Codes erreur ---- */
function renderErrorsTab() {
  const q = document.getElementById('kb-search')?.value || '';
  renderErrors(q);
}
