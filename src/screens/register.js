/* ============================================================================
   REGISTER — Inscription / édition du profil utilisateur
   ========================================================================== */
import { saveUser, getUser, ROLES } from '../data/user-store.js';

export function renderRegister(onDone) {
  const existing = getUser();
  const isEdit   = !!existing;

  const container = document.getElementById('register-body');
  if (!container) return;

  container.innerHTML = `
    <div class="text-center mb-6">
      <div class="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
           style="background:rgba(255,255,255,.15)">
        <svg viewBox="0 0 24 24" class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <h2 class="text-2xl font-black text-white">${isEdit ? 'Mon profil' : 'Créer votre profil'}</h2>
      <p class="text-sm mt-1" style="color:rgba(255,255,255,.55);">
        ${isEdit ? 'Modifier vos informations' : 'Pour identifier vos diagnostics et assurer le suivi'}
      </p>
    </div>

    <!-- Formulaire -->
    <div class="space-y-3">
      <!-- Société -->
      <div>
        <label class="text-xs font-bold uppercase tracking-widest mb-1.5 block"
               style="color:rgba(255,255,255,.6)">Société / Organisation *</label>
        <input id="reg-company" type="text" placeholder="Ex : Kalistrut, ACME Corp…"
          value="${existing?.companyName || ''}"
          class="w-full bg-white rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-800
                 outline-none border-2 border-transparent focus:border-amber-400
                 placeholder:text-slate-300"/>
      </div>

      <!-- Nom -->
      <div>
        <label class="text-xs font-bold uppercase tracking-widest mb-1.5 block"
               style="color:rgba(255,255,255,.6)">Nom du technicien / responsable *</label>
        <input id="reg-name" type="text" placeholder="Ex : Jean Dupont"
          value="${existing?.staffName || ''}"
          class="w-full bg-white rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-800
                 outline-none border-2 border-transparent focus:border-amber-400
                 placeholder:text-slate-300"/>
      </div>

      <!-- Rôle -->
      <div>
        <label class="text-xs font-bold uppercase tracking-widest mb-1.5 block"
               style="color:rgba(255,255,255,.6)">Rôle *</label>
        <div class="space-y-2" id="reg-roles">
          ${ROLES.map(r => `
            <label class="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 cursor-pointer
                          border-2 transition-all ${existing?.role === r.id ? 'border-amber-400' : 'border-transparent'}">
              <input type="radio" name="reg-role" value="${r.id}"
                ${existing?.role === r.id ? 'checked' : ''}
                class="accent-amber-400 w-4 h-4 shrink-0"/>
              <div>
                <div class="font-bold text-slate-900 text-sm">${r.label}</div>
                <div class="text-xs text-slate-400">${r.desc}</div>
              </div>
            </label>`).join('')}
        </div>
      </div>

      <p id="reg-error" class="text-xs text-amber-300 font-semibold hidden">
        ⚠ Veuillez remplir tous les champs obligatoires.
      </p>

      <button id="reg-submit"
        class="w-full btn-accent font-bold py-4 rounded-2xl text-base mt-2 shadow-lg">
        ${isEdit ? 'Enregistrer les modifications' : 'Créer mon profil →'}
      </button>

      ${isEdit ? `
      <button id="reg-cancel"
        class="w-full text-center text-sm font-semibold py-3"
        style="color:rgba(255,255,255,.4)">
        Annuler
      </button>` : ''}
    </div>`;

  /* Highlight du rôle sélectionné */
  container.querySelectorAll('input[name="reg-role"]').forEach(radio => {
    radio.addEventListener('change', () => {
      container.querySelectorAll('#reg-roles label').forEach(l => {
        l.classList.toggle('border-amber-400', l.querySelector('input')?.checked);
        l.classList.toggle('border-transparent', !l.querySelector('input')?.checked);
      });
    });
  });

  /* Submit */
  document.getElementById('reg-submit')?.addEventListener('click', () => {
    const company = document.getElementById('reg-company')?.value.trim();
    const name    = document.getElementById('reg-name')?.value.trim();
    const role    = container.querySelector('input[name="reg-role"]:checked')?.value;
    const error   = document.getElementById('reg-error');

    if (!company || !name || !role) {
      error?.classList.remove('hidden');
      return;
    }
    error?.classList.add('hidden');
    const user = saveUser({ companyName: company, staffName: name, role });
    onDone(user);
  });

  document.getElementById('reg-cancel')?.addEventListener('click', () => onDone(existing));
}
