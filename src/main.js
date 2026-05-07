/* ============================================================================
   MAIN — Point d'entrée. Branche tous les écrans et démarre sur Splash.
   ========================================================================== */
import './style.css';
import { nav, STATE } from './state.js';
import { DATA } from './data/tree.js';
import { renderHome, findSymptom } from './screens/home.js';
import { renderSymptoms } from './screens/symptoms.js';
import { startDiagnostic, diagBack, confirmAbort } from './screens/diag.js';
import { renderKB } from './screens/kb.js';
import { renderHistory } from './screens/history.js';

/* ---- Fonction de navigation centrale ---- */
function navigate(name) {
  nav(name, (screenName) => {
    if (screenName === 'home')    renderHome(openMachine, restartSymptom);
    if (screenName === 'kb')      renderKB();
    if (screenName === 'history') renderHistory();
  });
}

/* ---- Ouvrir la liste des symptômes d'une machine ---- */
function openMachine(machineId) {
  STATE.machineId = machineId;
  renderSymptoms(machineId, (symptomId) => startDiagnostic(symptomId, navigate));
  navigate('symptoms');
}

/* ---- Relancer un diagnostic récent ---- */
function restartSymptom(symptomId) {
  const machineId = Object.keys(DATA.symptoms).find(mid =>
    DATA.symptoms[mid].some(s => s.id === symptomId)
  );
  if (machineId) STATE.machineId = machineId;
  startDiagnostic(symptomId, navigate);
}

/* ---- Événements des boutons globaux (header diag, bottom nav) ---- */
document.addEventListener('DOMContentLoaded', () => {
  // Splash -> Home
  document.querySelector('[data-nav="home"]')
    ?.addEventListener('click', () => navigate('home'));

  // Bouton retour dans l'écran diagnostic
  document.getElementById('btn-diag-back')
    ?.addEventListener('click', () => diagBack(navigate));

  // Bouton Quitter dans l'écran diagnostic
  document.getElementById('btn-diag-quit')
    ?.addEventListener('click', () => confirmAbort(navigate));

  // Bottom nav
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.nav));
  });

  // Search KB (input live)
  document.getElementById('kb-search')
    ?.addEventListener('input', renderKB);

  // Démarrage
  navigate('splash');
});
