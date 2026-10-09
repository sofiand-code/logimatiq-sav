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
    title: 'Présentation EPIMAT : mise en service',
    title_en: 'EPIMAT presentation: installation',
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
  const list = document.getElementById('kb-list');
  if (openFicheId && FICHES.some(f => f.id === openFicheId)) { renderFichePage(list, FICHES.find(f => f.id === openFicheId)); return; }

  const q = (document.getElementById('kb-search')?.value || '').toLowerCase().trim();
  const lang = getLang();
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

  list.querySelectorAll('[data-fiche-open]').forEach(btn =>
    btn.addEventListener('click', () => { openFicheId = btn.dataset.ficheOpen; renderFiches(); list.scrollTop = 0; })
  );
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
}

function renderFicheCard(f) {
  const fam = FICHE_FAMILIES[f.family];
  const thumb = f.etapes.find(s => s.img)?.img;
  return `
    <button data-fiche-open="${f.id}"
      class="tap-card w-full bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-3 text-left shadow-sm">
      <div class="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center" style="background:${fam.bg}">
        ${thumb ? `<img src="/${esc(thumb.file)}" alt="" loading="lazy" class="w-full h-full object-cover"/>` : ''}
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-black text-slate-900 text-sm leading-snug">${esc(tr(f.title))}</div>
        <div class="text-[11px] text-slate-500 mt-0.5">${esc(tr(f.subtitle))}</div>
        <div class="flex items-center gap-1.5 mt-1.5">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" style="background:${fam.bg};color:${fam.color}">${esc(tr(fam.label))}</span>
          <span class="text-[10px] font-bold text-slate-400">${f.etapes.length} ${t('étapes')}</span>
        </div>
      </div>
      <svg viewBox="0 0 24 24" class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/>
      </svg>
    </button>`;
}

/* Fiche ouverte en pleine page : intro, avant de commencer, étapes avec grandes photos, contrôle final */
function renderFichePage(list, f) {
  const fam = FICHE_FAMILIES[f.family];
  const bigImg = (m) => `
    <figure class="mt-3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
      <button type="button" data-zoom="/${esc(m.file)}" data-alt="${esc(tr(m))}" class="relative block w-full">
        <img src="/${esc(m.file)}" alt="${esc(tr(m))}" loading="lazy" decoding="async"
             class="w-full" style="max-height:62vh;object-fit:contain;background:#f8fafc"/>
        <span class="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-slate-500">
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="m20 20-3.5-3.5M11 8v6M8 11h6"/>
          </svg>
        </span>
      </button>
      <figcaption class="text-[11px] text-slate-500 font-medium text-center py-2 px-3">${esc(tr(m))}</figcaption>
    </figure>`;
  const box = (title, items, cls, icon) => !items.length ? '' : `
    <div class="rounded-2xl border p-4 ${cls}">
      <p class="text-[11px] font-black uppercase tracking-widest mb-2">${esc(title)}</p>
      <ul class="space-y-1.5">${items.map(s => `
        <li class="flex items-start gap-2 text-[13px] leading-relaxed">${icon}<span>${esc(tr(s))}</span></li>`).join('')}
      </ul>
    </div>`;
  const check = '<svg viewBox="0 0 24 24" class="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4.5 4.5L19 7"/></svg>';
  const dot = `<span class="mt-0.5 shrink-0" style="color:${fam.color}">▸</span>`;

  list.innerHTML = `
    <button data-fiche-back class="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 py-1">
      <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6"/></svg>
      ${t('Toutes les fiches')}
    </button>

    <div class="rounded-3xl p-5 text-white shadow-md" style="background:${fam.color}">
      <span class="text-[10px] font-black uppercase tracking-widest" style="color:rgba(255,255,255,.75)">${esc(tr(fam.label))} · ${f.etapes.length} ${t('étapes')}</span>
      <h3 class="text-lg font-black leading-snug mt-1">${esc(tr(f.title))}</h3>
      <p class="text-[13px] mt-1" style="color:rgba(255,255,255,.85)">${esc(tr(f.subtitle))}</p>
    </div>

    <p class="text-[13px] text-slate-700 leading-relaxed px-1">${esc(tr(f.intro))}</p>
    <p class="text-[12px] text-slate-500 leading-relaxed px-1">${esc(tr(HOTLINE))}</p>

    ${box(t('Avant de commencer'), f.avant, 'border-slate-200 bg-white text-slate-700', dot)}

    ${f.etapes.map((s, i) => `
      <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex items-center gap-3">
          <span class="w-9 h-9 rounded-xl flex items-center justify-center text-base font-black text-white shrink-0" style="background:${fam.color}">${i + 1}</span>
          <div class="min-w-0">
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">${t('Étape')} ${i + 1} / ${f.etapes.length}</p>
            <h4 class="text-[15px] font-black text-slate-900 leading-snug">${esc(tr(s.titre))}</h4>
          </div>
        </div>
        <p class="text-[14px] text-slate-700 leading-relaxed mt-3">${esc(tr(s.texte))}</p>
        ${s.attention ? `
        <div class="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-2">
          <svg viewBox="0 0 24 24" class="w-4 h-4 mt-0.5 shrink-0 text-amber-600" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>
          <p class="text-[13px] text-amber-900 leading-relaxed">${esc(tr(s.attention))}</p>
        </div>` : ''}
        ${s.img ? bigImg(s.img) : ''}
      </section>`).join('')}

    ${box(t('Contrôle final'), f.verifier, 'border-sky-200 bg-sky-50 text-sky-900', check)}
    ${box(t('À valider avec Logimatiq'), f.valider, 'border-emerald-200 bg-emerald-50 text-emerald-900', check)}

    <button data-fiche-back class="w-full bg-white border-2 border-slate-200 rounded-2xl py-3.5 text-sm font-bold text-slate-600">
      ${t('Toutes les fiches')}
    </button>`;

  list.querySelectorAll('[data-fiche-back]').forEach(btn =>
    btn.addEventListener('click', () => { openFicheId = null; renderFiches(); list.scrollTop = 0; })
  );
  bindZoom(list);
  list.scrollTop = 0;
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
