/* ============================================================================
   FAULTS — Pannes récurrentes EPIMAT
   ========================================================================== */
import { FAULTS, FAULTS_CATEGORIES } from '../data/faults-data.js';
import { t, getLang } from '../i18n.js';

let activeCategory = 'all';
let searchQuery    = '';
let openFaultId    = null; // accordéon : une seule panne ouverte à la fois

/* ---- Entrée principale ---- */
export function renderFaults() {
  _renderSearch();
  _renderCategoryBar();
  _renderList();
}

/* ------------------------------------------------------------------ */
/*  Barre de recherche                                                  */
/* ------------------------------------------------------------------ */
function _renderSearch() {
  const input = document.getElementById('faults-search');
  if (!input) return;
  input.placeholder = t('Rechercher une panne…');
  /* Brancher l'événement une seule fois */
  if (!input.dataset.bound) {
    input.dataset.bound = '1';
    input.addEventListener('input', () => {
      searchQuery = input.value.toLowerCase().trim();
      _renderList();
    });
  }
}

/* ------------------------------------------------------------------ */
/*  Barre de catégories (filtre)                                        */
/* ------------------------------------------------------------------ */
function _renderCategoryBar() {
  const bar = document.getElementById('faults-categories');
  if (!bar) return;
  const lang = getLang();

  const all = { id: 'all', label: t('Tout'), label_en: 'All', color: '#0F4C81', bg: '#EFF5FB' };
  const cats = [all, ...FAULTS_CATEGORIES];

  bar.innerHTML = cats.map(c => {
    const label = (lang === 'en' && c.label_en) ? c.label_en : c.label;
    const active = activeCategory === c.id;
    return `
      <button data-cat="${c.id}"
        class="flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
        style="${active
          ? `background:${c.color};color:#fff`
          : `background:${c.bg || '#F1F5F9'};color:${c.color}`}">
        ${label}
      </button>`;
  }).join('');

  bar.querySelectorAll('[data-cat]').forEach(btn =>
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      openFaultId = null;
      _renderCategoryBar();
      _renderList();
    })
  );
}

/* ------------------------------------------------------------------ */
/*  Liste des pannes filtrées                                           */
/* ------------------------------------------------------------------ */
function _renderList() {
  const list = document.getElementById('faults-list');
  if (!list) return;
  const lang = getLang();

  const filtered = FAULTS.filter(f => {
    const catOk = activeCategory === 'all' || f.category === activeCategory;
    if (!catOk) return false;
    if (!searchQuery) return true;
    const title = (lang === 'en' && f.title_en) ? f.title_en : f.title;
    return title.toLowerCase().includes(searchQuery)
      || f.symptoms.some(s => s.toLowerCase().includes(searchQuery));
  });

  if (!filtered.length) {
    list.innerHTML = `
      <div class="text-center py-12">
        <div class="text-4xl mb-3">🔍</div>
        <p class="text-sm font-bold text-slate-500">${t('Aucune panne trouvée')}</p>
        <p class="text-xs text-slate-400 mt-1">${t('Essayez un autre mot-clé')}</p>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map(f => _renderFaultCard(f, lang)).join('');

  /* Accordéon */
  list.querySelectorAll('[data-fault-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.faultToggle;
      openFaultId = openFaultId === id ? null : id;
      _renderList();
    });
  });

  /* Bouton SAV */
  list.querySelectorAll('[data-call-sav]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = 'tel:0745284483';
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Rendu d'une carte de panne                                          */
/* ------------------------------------------------------------------ */
function _renderFaultCard(f, lang) {
  const cat      = FAULTS_CATEGORIES.find(c => c.id === f.category);
  const title    = (lang === 'en' && f.title_en) ? f.title_en : f.title;
  const isOpen   = openFaultId === f.id;
  const severity = _severityBadge(f.severity);

  return `
    <div class="mb-2.5">
      <!-- En-tête carte -->
      <button data-fault-toggle="${f.id}"
        class="w-full text-left tap-card rounded-2xl overflow-hidden shadow-sm
               border transition-all duration-200
               ${isOpen ? 'border-slate-300' : 'border-slate-200 bg-white'}">

        <!-- Bande couleur catégorie -->
        <div class="flex items-center gap-3 p-4"
             style="${isOpen ? `background:${cat?.bg || '#F8FAFC'}` : ''}">

          <!-- Icône catégorie -->
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
               style="background:${cat?.color || '#94A3B8'}18">
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none"
                 stroke="${cat?.color || '#94A3B8'}" stroke-width="2">
              ${cat?.icon || ''}
            </svg>
          </div>

          <!-- Titre + badges -->
          <div class="flex-1 min-w-0">
            <div class="font-black text-slate-900 text-sm leading-snug pr-2">${title}</div>
            <div class="flex items-center gap-1.5 mt-1.5 flex-wrap">
              ${severity}
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style="background:${cat?.bg};color:${cat?.color}">
                ${(lang === 'en' && cat?.label_en) ? cat.label_en : (cat?.label || '')}
              </span>
            </div>
          </div>

          <!-- Flèche -->
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200"
               style="transform:rotate(${isOpen ? '90' : '0'}deg)"
               fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/>
          </svg>
        </div>

        <!-- Contenu déplié -->
        ${isOpen ? _renderFaultDetail(f, lang, cat) : ''}
      </button>
    </div>`;
}

/* ------------------------------------------------------------------ */
/*  Détail déplié d'une panne                                           */
/* ------------------------------------------------------------------ */
function _renderFaultDetail(f, lang, cat) {
  const symptoms = f.symptoms.map(s => `
    <li class="flex items-start gap-2 text-[11px] text-slate-600">
      <span class="mt-0.5 shrink-0" style="color:${cat?.color}">▸</span>${s}
    </li>`).join('');

  const steps = f.steps.map((s, i) => `
    <div class="flex items-start gap-3">
      <!-- Numéro -->
      <div class="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black
                  shrink-0 mt-0.5 text-white"
           style="background:${cat?.color || '#94A3B8'}">
        ${i + 1}
      </div>
      <!-- Texte + badges -->
      <div class="flex-1 min-w-0 pt-0.5">
        <p class="text-[12px] text-slate-700 leading-relaxed font-medium">${s.text}</p>
        <div class="flex flex-wrap gap-1.5 mt-1.5">
          ${s.photo ? `
            <span class="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
              📷 ${t('Photo à venir')}
            </span>` : ''}
          ${s.debes ? `
            <span class="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200">
              🖥 DEBES
            </span>` : ''}
        </div>
      </div>
    </div>`).join('');

  return `
    <div class="border-t border-slate-100 bg-white">
      <!-- Symptômes -->
      <div class="px-4 pt-3 pb-2">
        <p class="text-[10px] font-black uppercase tracking-widest mb-2"
           style="color:${cat?.color}">${t('Symptômes')}</p>
        <ul class="space-y-1">${symptoms}</ul>
      </div>

      <!-- Séparateur -->
      <div class="mx-4 border-t border-slate-100"></div>

      <!-- Étapes -->
      <div class="px-4 pt-3 pb-4">
        <p class="text-[10px] font-black uppercase tracking-widest mb-3 text-slate-400">
          ${t('Étapes de résolution')}
        </p>
        <div class="space-y-3">${steps}</div>
      </div>

      <!-- Bouton SAV si nécessaire -->
      ${f.sav ? `
      <div class="px-4 pb-4">
        <button data-call-sav
          class="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                 text-white text-sm font-black shadow-sm"
          style="background:#DC2626">
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round"
              d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502
                 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1
                 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21
                 3 14.284 3 6V5z"/>
          </svg>
          ${t('Appeler le SAV Logimatiq')}
        </button>
      </div>` : ''}
    </div>`;
}

/* ------------------------------------------------------------------ */
/*  Badge de sévérité                                                   */
/* ------------------------------------------------------------------ */
function _severityBadge(severity) {
  const map = {
    critical: { label: t('Critique'),  label_en: 'Critical', bg: '#FEF2F2', color: '#DC2626' },
    high:     { label: t('Urgent'),    label_en: 'Urgent',   bg: '#FFFBEB', color: '#D97706' },
    normal:   { label: t('Courant'),   label_en: 'Common',   bg: '#F0FDF4', color: '#16A34A' },
  };
  const s = map[severity] || map.normal;
  return `
    <span class="text-[10px] font-black px-2 py-0.5 rounded-full"
          style="background:${s.bg};color:${s.color}">
      ${s.label}
    </span>`;
}
