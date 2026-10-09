/* ============================================================================
   MEDIA — Rendu des slots photo / vidéo / pdf dans les nodes
   ========================================================================== */

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Retourne le HTML du bloc média d'un node.
 * @param {{ type: string, label: string, file?: string, files?: string[] } | undefined} m
 * @param {string} [label] légende traduite (par défaut : m.label)
 */
export function renderMedia(m, label = m?.label) {
  if (!m) return '';
  const l = esc(label);

  if (m.type === 'photo') {
    const files = m.files || (m.file ? [m.file] : []);
    if (files.length > 0) {
      return files.map(f => `
        <div class="mt-4 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <button type="button" data-zoom="/${esc(f)}" data-alt="${l}" class="relative block w-full">
            <img src="/${esc(f)}" alt="${l}" loading="lazy" decoding="async"
                 class="w-full object-cover"
                 style="max-height:260px;object-fit:contain;background:#f8fafc"/>
            <span class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-slate-500">
              <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="m20 20-3.5-3.5M11 8v6M8 11h6"/>
              </svg>
            </span>
          </button>
          <p class="text-[10px] text-slate-400 font-medium text-center py-1.5 px-2 bg-slate-50">${l}</p>
        </div>`).join('');
    }
    return `
      <div class="mt-4 rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 aspect-[16/10] flex flex-col items-center justify-center">
        <svg viewBox="0 0 24 24" class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="m21 16-4-4-7 7"/></svg>
        <p class="mt-2 px-4 text-xs text-slate-500 text-center">${l}</p>
      </div>`;
  }

  if (m.type === 'video') {
    return `
      <div class="mt-4 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video flex items-center justify-center relative">
        <div class="absolute inset-0 bg-gradient-to-br from-brand-700/40 to-brand-900/60"></div>
        <button class="relative z-10 w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 24 24" class="w-6 h-6 text-brand-700 ml-0.5" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <p class="absolute bottom-2 left-3 right-3 text-xs text-white/80">Vidéo : ${l}</p>
      </div>`;
  }

  if (m.type === 'pdf') {
    return `
      <button class="mt-4 w-full bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-3 text-left">
        <div class="w-10 h-12 bg-rose-50 rounded-md flex items-center justify-center text-rose-600 font-bold text-[10px]">PDF</div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold text-slate-900 truncate">${l}</div>
          <div class="text-[11px] text-slate-500 truncate">${esc(m.file || 'document.pdf')}</div>
        </div>
        <svg viewBox="0 0 24 24" class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v12m0 0-4-4m4 4 4-4M6 20h12"/></svg>
      </button>`;
  }

  return '';
}

/**
 * Plusieurs photos d'un même nœud : grille de vignettes (2 ou 3 colonnes), chacune agrandissable.
 * @param {{ file: string, label: string }[]} items légendes déjà traduites
 */
export function renderMediaGrid(items) {
  const cols = items.length === 3 || items.length > 4 ? 3 : 2;
  return `
    <div class="mt-4 grid gap-2" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">
      ${items.map(({ file, label }) => `
        <figure class="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col">
          <button type="button" data-zoom="/${esc(file)}" data-alt="${esc(label)}" class="relative block w-full">
            <img src="/${esc(file)}" alt="${esc(label)}" loading="lazy" decoding="async"
                 class="w-full" style="height:${cols === 3 ? 130 : 150}px;object-fit:contain;background:#f8fafc"/>
            <span class="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 shadow flex items-center justify-center text-slate-500">
              <svg viewBox="0 0 24 24" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="m20 20-3.5-3.5M11 8v6M8 11h6"/>
              </svg>
            </span>
          </button>
          <figcaption class="text-[10px] leading-snug text-slate-500 font-medium text-center px-1.5 py-1.5">${esc(label)}</figcaption>
        </figure>`).join('')}
    </div>`;
}

/**
 * Affiche une image en plein écran : elle occupe tout l'écran ; la toucher
 * l'agrandit encore (on fait alors défiler) ; le bouton × ou le fond ferme.
 */
export function openZoom(src, alt) {
  const ov = document.createElement('div');
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.style.cssText = 'position:fixed;inset:0;z-index:1000;display:flex;overflow:auto;'
    + 'background:rgba(15,23,42,.94);-webkit-overflow-scrolling:touch';
  ov.innerHTML = `
    <img src="${esc(src)}" alt="${esc(alt)}" style="margin:auto;max-width:none;cursor:zoom-in"/>
    <button type="button" aria-label="×"
      style="position:fixed;top:max(12px, env(safe-area-inset-top));right:12px;width:44px;height:44px;
             border-radius:9999px;background:rgba(255,255,255,.95);color:#0f172a;font-size:26px;
             line-height:44px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.3)">×</button>`;
  const img = ov.querySelector('img');
  let zoomed = false;

  /* Taille « plein écran » calculée (agrandit aussi les petites images) */
  const fit = () => {
    if (!img.naturalWidth) return;
    const s = Math.min(ov.clientWidth / img.naturalWidth, ov.clientHeight / img.naturalHeight) * (zoomed ? 2.5 : 1);
    img.style.width  = Math.round(img.naturalWidth * s) + 'px';
    img.style.height = Math.round(img.naturalHeight * s) + 'px';
    img.style.cursor = zoomed ? 'zoom-out' : 'zoom-in';
  };
  const prevOverflow = document.body.style.overflow;
  const close = () => {
    ov.remove();
    document.body.style.overflow = prevOverflow;
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', fit);
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };

  img.addEventListener('load', fit);
  img.addEventListener('click', (e) => { e.stopPropagation(); zoomed = !zoomed; fit(); });
  ov.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
  window.addEventListener('resize', fit);
  document.body.style.overflow = 'hidden';
  document.body.appendChild(ov);
  if (img.complete) fit();
}

/** Rend les images d'un conteneur agrandissables au toucher (appeler après chaque rendu). */
export function bindZoom(root = document) {
  root?.querySelectorAll('[data-zoom]').forEach(el =>
    el.addEventListener('click', () => openZoom(el.dataset.zoom, el.dataset.alt || '')));
}
