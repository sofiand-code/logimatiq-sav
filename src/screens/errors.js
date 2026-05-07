/* ============================================================================
   ERRORS — Recherche de codes erreur EPIMAT
   ========================================================================== */
import { ERROR_CODES } from '../data/errors.js';

export function renderErrors(query) {
  const q = (query || document.getElementById('errors-search')?.value || '').toLowerCase().trim();
  const filtered = q
    ? ERROR_CODES.filter(e =>
        e.code.toLowerCase().includes(q) ||
        e.label.toLowerCase().includes(q) ||
        e.tags.some(t => t.includes(q))
      )
    : ERROR_CODES;

  const list = document.getElementById('errors-list');
  if (!list) return;

  if (!filtered.length) {
    list.innerHTML = `
      <div class="text-center py-10">
        <p class="text-sm text-slate-400 font-medium">Aucun code pour "${q}"</p>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map(e => `
    <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div class="flex items-start gap-3">
        <span class="shrink-0 font-black text-xs px-2.5 py-1.5 rounded-xl whitespace-nowrap"
              style="background:#FEF2F2;color:#DC2626">${e.code}</span>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-slate-900 text-sm leading-snug">${e.label}</div>
          <p class="text-[11px] text-slate-500 mt-1.5 leading-relaxed">${e.desc}</p>
          <div class="mt-2 flex flex-wrap gap-1">
            ${e.tags.map(t =>
              `<span class="text-[10px] bg-slate-100 text-slate-400 font-medium px-2 py-0.5 rounded-lg">#${t}</span>`
            ).join('')}
          </div>
        </div>
      </div>
    </div>`).join('');
}
