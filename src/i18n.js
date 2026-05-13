/* ============================================================================
   I18N — Moteur de traduction FR ↔ EN
   ========================================================================== */
import { EN } from './locales/en.js';

const STORAGE_KEY = 'sav_lang';
let _lang = localStorage.getItem(STORAGE_KEY) || 'fr';
const _listeners = new Set();

export function getLang() { return _lang; }

export function setLang(lang) {
  if (lang !== 'fr' && lang !== 'en') return;
  _lang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  _listeners.forEach(fn => fn(lang));
}

export function onLangChange(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

/** Traduit une chaîne UI (clé = texte français) */
export function t(frStr) {
  if (_lang === 'fr') return frStr;
  return EN.ui[frStr] ?? frStr;
}

/** Traduit un champ d'un nœud de l'arbre (title, help, message) */
export function tNode(nodeId, field, frValue) {
  if (_lang === 'fr') return frValue;
  const v = EN.nodes[nodeId]?.[field];
  return v !== undefined ? v : frValue;
}

/** Traduit le titre d'un symptôme (par son id) */
export function tSymptom(symptomId, frTitle) {
  if (_lang === 'fr') return frTitle;
  return EN.symptoms?.[symptomId] ?? frTitle;
}

/** Traduit le label d'une réponse (par index) */
export function tAnswer(nodeId, index, frLabel) {
  if (_lang === 'fr') return frLabel;
  const arr = EN.nodes[nodeId]?.answers;
  return arr?.[index] ?? frLabel;
}

/** Traduit une étape de procédure (par index) */
export function tStep(nodeId, index, frStep) {
  if (_lang === 'fr') return frStep;
  const arr = EN.nodes[nodeId]?.steps;
  return arr?.[index] ?? frStep;
}

/** Met à jour tous les éléments [data-i18n] dans le DOM */
export function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
}

/** HTML du bouton toggle langue (adapté à l'arrière-plan) */
export function langToggleHTML(theme = 'dark') {
  const isDark = theme === 'dark';
  const base = isDark
    ? 'border-white/30 text-white/70 hover:border-white/60'
    : 'border-slate-200 text-slate-500 hover:border-slate-400';
  const activeFr = isDark ? 'text-white font-black' : 'text-slate-900 font-black';
  const activeEn = isDark ? 'text-white font-black' : 'text-slate-900 font-black';
  return `
    <button id="lang-toggle"
      class="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition-colors ${base}">
      <span class="${_lang === 'fr' ? activeFr : 'opacity-40'}">FR</span>
      <span class="opacity-30">|</span>
      <span class="${_lang === 'en' ? activeEn : 'opacity-40'}">EN</span>
    </button>`;
}

/** Lie le bouton toggle (appeler après chaque rendu) */
export function bindLangToggle() {
  document.getElementById('lang-toggle')?.addEventListener('click', () => {
    setLang(_lang === 'fr' ? 'en' : 'fr');
  });
}
