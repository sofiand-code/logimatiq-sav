/* ============================================================================
   STATE — État applicatif global + navigation entre écrans
   ========================================================================== */

export const STATE = {
  currentScreen:  'splash',
  machineId:      null,   // 'epimat' | 'vetimat' | ...
  symptomId:      null,
  treeRoot:       null,
  history:        [],     // pile des nodeIds visités
  answers:        [],     // réponses choisies (label)
  estimatedSteps: 6,
  profile:        null,   // legacy (remplacé par user-store)
  currentMachine: null,   // { id, serialNumber, model, location, clientName }
};

/**
 * Affiche l'écran demandé et déclenche son rendu si nécessaire.
 * @param {string} name - identifiant de l'écran (splash|home|symptoms|diag|kb|history)
 * @param {Function} [onRender] - callback appelé après l'affichage (injection des renderers)
 */
export function nav(name, onRender) {
  STATE.currentScreen = name;
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  const el = document.getElementById('screen-' + name);
  if (el) el.classList.add('active');
  if (onRender) onRender(name);
}
