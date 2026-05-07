/* ============================================================================
   KB — Base de connaissances (recherche par titre / tag)
   ========================================================================== */

const KB_ENTRIES = [
  { id: 'kb1', title: 'Manuel maintenance EPIMAT',       tags: ['epimat', 'maintenance', 'pdf'], type: 'pdf', file: 'Manuel Maintenance EPIMAT_eng.pdf' },
  { id: 'kb2', title: 'Tuto EPIMAT (procédures)',         tags: ['epimat', 'tuto', 'pdf'],        type: 'pdf', file: 'tuto EPIMAT.pdf' },
  { id: 'kb3', title: 'Initialisation badges Kalistrut',  tags: ['badge', 'distepi', 'pdf'],      type: 'pdf', file: 'initialisation badges kalistrut .pdf' },
  { id: 'kb4', title: 'Remplacement carte SIM & APN',     tags: ['gsm', 'modem', 'sim'],          type: 'pdf', file: 'SIM Card Replacement and APN Setup Procedure.pdf' },
  { id: 'kb5', title: 'Tutoriel Vetimat Kalistrut',       tags: ['vetimat', 'tuto'],              type: 'pdf', file: 'Tutoriel vetimat KALISTRUT.pdf' },
  { id: 'kb6', title: 'Tuto tresse',                      tags: ['tresse'],                       type: 'pdf', file: 'tuto tresse.pdf' },
];

export function renderKB() {
  const q = (document.getElementById('kb-search')?.value || '').toLowerCase().trim();
  const filtered = KB_ENTRIES.filter(e =>
    !q || e.title.toLowerCase().includes(q) || e.tags.some(t => t.includes(q))
  );
  const list = document.getElementById('kb-list');
  if (!filtered.length) {
    list.innerHTML = `<p class="text-sm text-slate-500 text-center py-10">Aucun résultat.</p>`;
    return;
  }
  list.innerHTML = filtered.map(e => `
    <button class="tap-card w-full bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3 text-left">
      <div class="w-10 h-12 bg-rose-50 rounded-md flex items-center justify-center text-rose-600 font-bold text-[10px]">${e.type.toUpperCase()}</div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-slate-900 text-sm">${e.title}</div>
        <div class="text-[11px] text-slate-500 truncate">${e.tags.map(t => '#' + t).join(' ')}</div>
      </div>
      <svg viewBox="0 0 24 24" class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/>
      </svg>
    </button>
  `).join('');
}
