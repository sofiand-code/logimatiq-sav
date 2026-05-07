/* ============================================================================
   MACHINE SELECT — Sélection / ajout d'une machine avant diagnostic
   ========================================================================== */
import { getMachinesByModel, addMachine, deleteMachine } from '../data/machines-store.js';
import { getUser } from '../data/user-store.js';

const MODEL_LABELS = {
  epimat:   'EPIMAT',
  vetimat:  'VETIMAT',
  logiciel: 'EPIMAT Logiciel',
};

export function renderMachineSelect(modelId, onSelect) {
  const label    = MODEL_LABELS[modelId] || modelId.toUpperCase();
  const machines = getMachinesByModel(modelId);
  const user     = getUser();
  const container = document.getElementById('machine-select-body');
  if (!container) return;

  /* Mise à jour du label modèle dans le header */
  const modelLabelEl = document.getElementById('machine-select-model');
  if (modelLabelEl) modelLabelEl.textContent = label;

  if (machines.length === 0) {
    /* Aucune machine enregistrée → afficher directement le formulaire d'ajout */
    renderAddForm(container, modelId, label, user, onSelect, false);
    return;
  }

  /* Liste des machines existantes */
  container.innerHTML = `
    <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
      Machines enregistrées (${machines.length})
    </p>
    <div class="space-y-2.5" id="machine-list">
      ${machines.map(m => `
        <button data-machine-id="${m.id}"
          class="tap-card w-full bg-white border border-slate-200 rounded-2xl p-4
                 flex items-center gap-4 text-left shadow-sm">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
               style="background:#EFF5FB;color:#0F4C81">
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path stroke-linecap="round" d="M8 21h8M12 17v4"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-black text-slate-900 text-base">${m.serialNumber}</div>
            <div class="text-xs text-slate-400 mt-0.5">
              ${m.modelLabel}${m.location ? ' · ' + m.location : ''}${m.clientName ? ' · ' + m.clientName : ''}
            </div>
          </div>
          <svg viewBox="0 0 24 24" class="w-5 h-5 text-slate-300 shrink-0"
               fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/>
          </svg>
        </button>`).join('')}
    </div>

    <button id="btn-add-new-machine"
      class="mt-4 w-full border-2 border-dashed border-slate-200 rounded-2xl py-4
             flex items-center justify-center gap-2 text-sm font-bold text-slate-400 tap-card">
      <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/>
      </svg>
      Nouvelle machine
    </button>`;

  /* Sélectionner une machine */
  container.querySelectorAll('[data-machine-id]').forEach(btn =>
    btn.addEventListener('click', () => {
      const id = btn.dataset.machineId;
      const machine = machines.find(m => m.id === id);
      if (machine) onSelect(machine);
    })
  );

  /* Ajouter une nouvelle machine */
  document.getElementById('btn-add-new-machine')?.addEventListener('click', () => {
    renderAddForm(container, modelId, label, user, onSelect, true);
  });
}

/* ---- Formulaire d'ajout de machine ---- */
function renderAddForm(container, modelId, label, user, onSelect, showBack) {
  container.innerHTML = `
    ${showBack ? `
    <button id="btn-back-list"
      class="flex items-center gap-2 text-sm font-bold text-brand-600 mb-4">
      ← Retour à la liste
    </button>` : ''}

    <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
      Enregistrer une machine ${label}
    </p>

    <div class="space-y-3">
      <div>
        <label class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
          Numéro de série *
        </label>
        <input id="ms-serial" type="text" placeholder="Ex : EPM-2024-0042"
          class="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3.5
                 text-sm font-bold text-slate-800 outline-none focus:border-brand-400
                 placeholder:text-slate-300 uppercase"/>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
          Site / Emplacement
        </label>
        <input id="ms-location" type="text" placeholder="Ex : Entrepôt Paris, Rayon 3…"
          class="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3.5
                 text-sm font-medium text-slate-800 outline-none focus:border-brand-400
                 placeholder:text-slate-300"/>
      </div>

      ${user?.role !== 'client' ? `
      <div>
        <label class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
          Client / Société
        </label>
        <input id="ms-client" type="text" placeholder="Nom du client final"
          value="${user?.companyName || ''}"
          class="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3.5
                 text-sm font-medium text-slate-800 outline-none focus:border-brand-400
                 placeholder:text-slate-300"/>
      </div>` : ''}

      <p id="ms-error" class="text-xs text-rose-500 font-semibold hidden">
        ⚠ Le numéro de série est obligatoire.
      </p>

      <button id="btn-save-machine"
        class="w-full btn-primary font-bold py-4 rounded-2xl text-sm shadow-sm">
        Enregistrer et continuer →
      </button>
    </div>`;

  /* Auto-uppercase du numéro de série */
  document.getElementById('ms-serial')?.addEventListener('input', e => {
    const pos = e.target.selectionStart;
    e.target.value = e.target.value.toUpperCase();
    e.target.setSelectionRange(pos, pos);
  });

  document.getElementById('btn-back-list')?.addEventListener('click', () => {
    renderMachineSelect(modelId, onSelect);
  });

  document.getElementById('btn-save-machine')?.addEventListener('click', () => {
    const serial   = document.getElementById('ms-serial')?.value.trim().toUpperCase();
    const location = document.getElementById('ms-location')?.value.trim();
    const client   = document.getElementById('ms-client')?.value.trim()
                     || user?.companyName || '';

    if (!serial) {
      document.getElementById('ms-error')?.classList.remove('hidden');
      return;
    }
    document.getElementById('ms-error')?.classList.add('hidden');

    const machine = addMachine({
      serialNumber: serial,
      model:        modelId,
      modelLabel:   label,
      location,
      clientName:   client,
    });
    onSelect(machine);
  });
}
