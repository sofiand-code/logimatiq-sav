/* ============================================================================
   MACHINES STORE — Registre des machines (localStorage)
   ========================================================================== */

const KEY = 'logimatiq_machines_v1';

export function getMachines() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

export function getMachinesByModel(model) {
  return getMachines().filter(m => m.model === model);
}

export function getMachineById(id) {
  return getMachines().find(m => m.id === id) || null;
}

export function getMachineBySerial(serial) {
  return getMachines().find(
    m => m.serialNumber.trim().toLowerCase() === serial.trim().toLowerCase()
  ) || null;
}

export function addMachine(data) {
  const machines = getMachines();
  const machine = {
    id:           crypto.randomUUID(),
    serialNumber: data.serialNumber.trim().toUpperCase(),
    model:        data.model,          // 'epimat' | 'vetimat' | ...
    modelLabel:   data.modelLabel || data.model.toUpperCase(),
    location:     (data.location || '').trim(),
    clientName:   (data.clientName || '').trim(),
    addedAt:      new Date().toISOString(),
  };
  machines.unshift(machine);
  localStorage.setItem(KEY, JSON.stringify(machines));
  return machine;
}

export function deleteMachine(id) {
  const updated = getMachines().filter(m => m.id !== id);
  localStorage.setItem(KEY, JSON.stringify(updated));
}
