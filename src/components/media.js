/* ============================================================================
   MEDIA — Rendu des slots photo / vidéo / pdf dans les nodes
   ========================================================================== */

/**
 * Retourne le HTML du bloc média d'un node.
 * @param {{ type: string, label: string, file?: string } | undefined} m
 */
export function renderMedia(m) {
  if (!m) return '';

  if (m.type === 'photo') {
    return `
      <div class="mt-4 rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 aspect-[16/10] flex flex-col items-center justify-center">
        <svg viewBox="0 0 24 24" class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="m21 16-4-4-7 7"/></svg>
        <p class="mt-2 text-xs text-slate-500">Photo : ${m.label}</p>
      </div>`;
  }

  if (m.type === 'video') {
    return `
      <div class="mt-4 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video flex items-center justify-center relative">
        <div class="absolute inset-0 bg-gradient-to-br from-brand-700/40 to-brand-900/60"></div>
        <button class="relative z-10 w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 24 24" class="w-6 h-6 text-brand-700 ml-0.5" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <p class="absolute bottom-2 left-3 right-3 text-xs text-white/80">Vidéo : ${m.label}</p>
      </div>`;
  }

  if (m.type === 'pdf') {
    return `
      <button class="mt-4 w-full bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-3 text-left">
        <div class="w-10 h-12 bg-rose-50 rounded-md flex items-center justify-center text-rose-600 font-bold text-[10px]">PDF</div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold text-slate-900 truncate">${m.label}</div>
          <div class="text-[11px] text-slate-500 truncate">${m.file || 'document.pdf'}</div>
        </div>
        <svg viewBox="0 0 24 24" class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v12m0 0-4-4m4 4 4-4M6 20h12"/></svg>
      </button>`;
  }

  return '';
}
