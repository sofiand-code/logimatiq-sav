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
import { renderProfile, getProfile } from './screens/profile.js';
import { renderSetup } from './screens/setup.js';

/* ---- Fonction de navigation centrale ---- */
function navigate(name) {
  nav(name, (screenName) => {
    if (screenName === 'home')    renderHome(openMachine, restartSymptom, () => navigate('setup'));
    if (screenName === 'kb')      renderKB();
    if (screenName === 'history') renderHistory();
    if (screenName === 'setup')   renderSetup();
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

/* ---- Événements globaux ---- */
document.addEventListener('DOMContentLoaded', () => {

  /* Splash → vérifier si profil déjà défini */
  document.getElementById('btn-splash-start')?.addEventListener('click', () => {
    if (getProfile()) {
      navigate('home');
    } else {
      navigate('profile');
      renderProfile((profile) => {
        STATE.profile = profile;
        navigate('home');
      });
    }
  });

  /* Bouton profil dans le header home → rechoisir son profil */
  document.getElementById('home-profile-badge')?.addEventListener('click', () => {
    navigate('profile');
    renderProfile((profile) => {
      STATE.profile = profile;
      navigate('home');
    });
  });

  /* Bouton retour dans l'écran diagnostic */
  document.getElementById('btn-diag-back')
    ?.addEventListener('click', () => diagBack(navigate));

  /* Bouton Quitter dans l'écran diagnostic */
  document.getElementById('btn-diag-quit')
    ?.addEventListener('click', () => confirmAbort(navigate));

  /* Bouton SAV flottant */
  document.getElementById('fab-sav')
    ?.addEventListener('click', () => alert('Contacter le SAV Logimatiq\n📞 +33 X XX XX XX XX'));

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
