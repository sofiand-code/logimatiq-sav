/* ============================================================================
   LOGIN — Connexion avec login / mot de passe géré par Logimatiq
   ========================================================================== */
import { checkLogin, saveUser } from '../data/user-store.js';

export function renderLogin(onDone) {
  const container = document.getElementById('register-body');
  if (!container) return;

  container.innerHTML = `
    <div class="text-center mb-8">
      <div class="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
           style="background:rgba(255,255,255,.15)">
        <svg viewBox="0 0 24 24" class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <h2 class="text-2xl font-black text-white">Connexion</h2>
      <p class="text-sm mt-1" style="color:rgba(255,255,255,.5);">
        Identifiants fournis par Logimatiq
      </p>
    </div>

    <div class="space-y-3">
      <div>
        <label class="text-xs font-bold uppercase tracking-widest mb-1.5 block"
               style="color:rgba(255,255,255,.6)">Identifiant</label>
        <input id="login-user" type="text" placeholder="Votre login"
          autocomplete="username"
          class="w-full bg-white rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-800
                 outline-none border-2 border-transparent focus:border-amber-400
                 placeholder:text-slate-300"/>
      </div>

      <div>
        <label class="text-xs font-bold uppercase tracking-widest mb-1.5 block"
               style="color:rgba(255,255,255,.6)">Mot de passe</label>
        <input id="login-pass" type="password" placeholder="Votre mot de passe"
          autocomplete="current-password"
          class="w-full bg-white rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-800
                 outline-none border-2 border-transparent focus:border-amber-400
                 placeholder:text-slate-300"/>
      </div>

      <p id="login-error" class="text-xs text-amber-300 font-semibold hidden text-center pt-1">
        ⚠ Identifiant ou mot de passe incorrect.
      </p>

      <button id="login-submit"
        class="w-full btn-accent font-bold py-4 rounded-2xl text-base mt-2 shadow-lg">
        Se connecter →
      </button>

      <p class="text-center text-xs pt-2" style="color:rgba(255,255,255,.3);">
        Contactez Logimatiq pour obtenir vos identifiants<br/>
        07 45 28 44 83
      </p>
    </div>`;

  /* Connexion au Enter */
  container.querySelectorAll('input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('login-submit')?.click();
    });
  });

  document.getElementById('login-submit')?.addEventListener('click', () => {
    const login    = document.getElementById('login-user')?.value;
    const password = document.getElementById('login-pass')?.value;
    const error    = document.getElementById('login-error');

    const match = checkLogin(login, password);
    if (!match) {
      error?.classList.remove('hidden');
      document.getElementById('login-pass').value = '';
      return;
    }
    error?.classList.add('hidden');
    const user = saveUser({
      companyName: match.companyName,
      staffName:   match.staffName,
      role:        match.role,
    });
    onDone(user);
  });
}
