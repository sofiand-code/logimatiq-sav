/* ============================================================================
   MAIN — Point d'entrée. Branche tous les écrans et démarre sur Splash.
   ========================================================================== */
import './style.css';
import { nav, STATE } from './state.js';
import { DATA } from './data/tree.js';
import { getUser, clearUser } from './data/user-store.js';
import { renderHome } from './screens/home.js';
import { renderSymptoms } from './screens/symptoms.js';
import { startDiagnostic, diagBack, confirmAbort } from './screens/diag.js';
import { renderKB } from './screens/kb.js';
import { renderHistory } from './screens/history.js';
import { renderSetup } from './screens/setup.js';
import { renderLogin } from './screens/login.js';
import { renderMachineSelect } from './screens/machine-select.js';
import { renderStats } from './screens/stats.js';

/* ---- Fonction de navigation centrale ---- */
function navigate(name) {
  nav(name, (screenName) => {
    if (screenName === 'home')    renderHome(openMachine, restartSymptom, () => navigate('setup'), () => navigate('stats'), logout);
    if (screenName === 'kb')      renderKB();
    if (screenName === 'history') renderHistory();
    if (screenName === 'setup')   renderSetup();
    if (screenName === 'stats')   renderStats();
  });
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
  if (confirm('Se déconnecter ?')) {
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

  /* Démarrage */
  navigate('splash');
});
