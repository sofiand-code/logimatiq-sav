/* ============================================================================
   HISTORY STORE — Persistance localStorage des diagnostics terminés
   Clé : logimatiq_sav_history_v1
   ========================================================================== */

const STORAGE_KEY = 'logimatiq_sav_history_v1';

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * Enregistre un diagnostic terminé.
 * @param {{ machineId, symptomId, history, answers }} state
 * @param {{ outcome: string, title: string }} solutionNode
 */
export function saveDiagnostic(state, solutionNode) {
  /* Enrichissement avec les infos user + machine */
  let companyName = null, staffName = null, userId = null;
  let machineSerial = null, machineModelLabel = null, clientName = null;
  try {
    const user = JSON.parse(localStorage.getItem('logimatiq_user_v1'));
    if (user) { companyName = user.companyName; staffName = user.staffName; userId = user.id; }
  } catch { /* silencieux */ }
  if (state.currentMachine) {
    machineSerial     = state.currentMachine.serialNumber;
    machineModelLabel = state.currentMachine.modelLabel;
    clientName        = state.currentMachine.clientName;
  }

  const arr = loadHistory();
  arr.unshift({
    date:             new Date().toISOString(),
    machineId:        state.machineId,
    machineSerial,
    machineModelLabel,
    clientName:       clientName || companyName,
    symptomId:        state.symptomId,
    path:             [...state.history],
    answers:          [...state.answers],
    outcome:          solutionNode.outcome,
    outcomeLabel:     solutionNode.title,
    companyName,
    staffName,
    userId,
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(0, 100)));
}

/* Helpers de présentation */
export function outcomePill(o) {
  if (o === 'resolved') return 'bg-emerald-100 text-emerald-700';
  if (o === 'sav')      return 'bg-rose-100 text-rose-700';
  return 'bg-amber-100 text-amber-700';
}

export function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}
