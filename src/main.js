/* ============================================================================
   MAIN — Point d'entrée. Branche tous les écrans et démarre sur Splash.
   ========================================================================== */
import './style.css';
import { nav, STATE } from './state.js';
import { DATA } from './data/tree.js';
import { getUser, clearUser } from './data/user-store.js';
import { renderHome } from './screens/home.js';
import { renderSymptoms } from './screens/symptoms.js';
import { startDiagnostic, diagBack, confirmAbort, renderDiag } from './screens/diag.js';
import { renderKB } from './screens/kb.js';
import { renderHistory } from './screens/history.js';
import { renderSetup } from './screens/setup.js';
import { renderLogin } from './screens/login.js';
import { renderMachineSelect } from './screens/machine-select.js';
import { renderStats } from './screens/stats.js';
import { getLang, setLang, onLangChange, t, applyI18n, langToggleHTML, bindLangToggle } from './i18n.js';

/* ---- Fonction de navigation centrale ---- */
function navigate(name) {
  nav(name, (screenName) => {
    if (screenName === 'home')    renderHome(openMachine, () => navigate('setup'), () => navigate('stats'), logout);
    if (screenName === 'kb')      renderKB();
    if (screenName === 'history') renderHistory();
    if (screenName === 'setup')   renderSetup();
    if (screenName === 'stats')   renderStats();
  });
  applyI18n();
}

/* ---- Re-rendu complet à la volée lors d'un changement de langue ---- */
function rerender() {
  const s = STATE.currentScreen;
  if      (s === 'home')           renderHome(openMachine, () => navigate('setup'), () => navigate('stats'), logout);
  else if (s === 'diag')           renderDiag(navigate);
  else if (s === 'symptoms')       renderSymptoms(STATE.machineId, (symptomId) => startDiagnostic(symptomId, navigate));
  else if (s === 'machine-select') renderMachineSelect(STATE.machineId, (machine) => {
    STATE.currentMachine = machine;
    renderSymptoms(STATE.machineId, (symptomId) => startDiagnostic(symptomId, navigate));
    navigate('symptoms');
  });
  else if (s === 'history')  renderHistory();
  else if (s === 'setup')    renderSetup();
  else if (s === 'stats')    renderStats();
  else if (s === 'register') renderLogin((user) => { STATE.profile = user?.role || null; navigate('home'); });
  applyI18n();
  updateLangToggleHome();
}

/* ---- Met à jour tous les boutons langue (splash + home) ---- */
function updateLangToggleHome() {
  const lang = getLang();

  /* Bouton home header */
  const el = document.getElementById('btn-lang');
  if (el) {
    el.innerHTML = `
      <span class="${lang === 'fr' ? 'text-brand-700 font-black' : 'text-slate-400'}">FR</span>
      <span class="text-slate-300">|</span>
      <span class="${lang === 'en' ? 'text-brand-700 font-black' : 'text-slate-400'}">EN</span>`;
  }

  /* Bouton splash */
  const frEl = document.getElementById('splash-lang-fr');
  const enEl = document.getElementById('splash-lang-en');
  if (frEl) frEl.style.color = lang === 'fr' ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,.35)';
  if (enEl) enEl.style.color = lang === 'en' ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,.35)';
}

/* ---- Ouvrir sélection de machine → symptômes ---- */
function openMachine(machineId) {
  STATE.machineId = machineId;
  navigate('machine-select');
  renderMachineSelect(machineId, (machine) => {
    STATE.currentMachine = machine;
    renderSymptoms(machineId, (symptomId) => startDiagnostic(symptomId, navigate));
    navigate('symptoms');
  });
}

/* ---- Relancer un diagnostic récent ---- */
function restartSymptom(symptomId) {
  const machineId = Object.keys(DATA.symptoms).find(mid =>
    DATA.symptoms[mid].some(s => s.id === symptomId)
  );
  if (machineId) STATE.machineId = machineId;
  startDiagnostic(symptomId, navigate);
}

/* ---- Déconnexion ---- */
function logout() {
  if (confirm(t('Se déconnecter ?'))) {
    clearUser();
    navigate('register');
    renderLogin((user) => {
      STATE.profile = user?.role || null;
      navigate('home');
    });
  }
}

/* ---- Événements globaux ---- */
document.addEventListener('DOMContentLoaded', () => {

  /* Splash → vérifier si déjà connecté */
  document.getElementById('btn-splash-start')?.addEventListener('click', () => {
    if (getUser()) {
      navigate('home');
    } else {
      navigate('register');
      renderLogin((user) => {
        STATE.profile = user?.role || null;
        navigate('home');
      });
    }
  });

  /* Retour depuis machine-select */
  document.getElementById('btn-machine-back')
    ?.addEventListener('click', () => navigate('home'));

  /* Bouton retour dans le diagnostic */
  document.getElementById('btn-diag-back')
    ?.addEventListener('click', () => diagBack(navigate));

  /* Bouton Quitter dans le diagnostic */
  document.getElementById('btn-diag-quit')
    ?.addEventListener('click', () => confirmAbort(navigate));

  /* Bouton SAV flottant */
  document.getElementById('fab-sav')
    ?.addEventListener('click', () => {
      window.location.href = 'tel:0745284483';
    });

  /* Bottom nav & tous les boutons data-nav */
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.nav));
  });

  /* Search KB (input live) */
  document.getElementById('kb-search')
    ?.addEventListener('input', renderKB);

  /* Toggle langue — splash */
  document.getElementById('btn-splash-lang')?.addEventListener('click', () => {
    setLang(getLang() === 'fr' ? 'en' : 'fr');
  });

  /* Toggle langue — header home */
  document.getElementById('btn-lang')?.addEventListener('click', () => {
    setLang(getLang() === 'fr' ? 'en' : 'fr');
  });

  /* Changer la langue → re-rendre l'écran courant */
  onLangChange(() => rerender());

  /* Init nav labels i18n */
  applyI18n();
  updateLangToggleHome();

  /* Démarrage */
  navigate('splash');
});
