/* ============================================================================
   SETUP — Guide de mise en service EPIMAT (checklist interactive)
   ========================================================================== */

const STORAGE_KEY = 'logimatiq_setup_checks';

const SETUP_STEPS = [
  /* ---- Installation physique ---- */
  {
    id: 's1', group: 'Installation physique',
    title: 'Fixer la machine au mur / sur le support',
    desc: 'Utiliser les 4 vis M6 fournies. Vérifier la verticalité avec un niveau.',
  },
  {
    id: 's2', group: 'Installation physique',
    title: 'Brancher l\'alimentation secteur 220V',
    desc: 'Câble d\'alimentation fourni. Vérifier que le switch arrière du PC est sur OFF avant de brancher.',
  },
  {
    id: 's3', group: 'Installation physique',
    title: 'Connecter l\'écran au boîtier PC (câble VGA)',
    desc: 'Serrer les vis molettes du connecteur VGA pour éviter les déconnexions.',
  },
  {
    id: 's4', group: 'Installation physique',
    title: 'Connecter le lecteur badge (câble USB)',
    desc: 'Brancher sur un port USB du boîtier PC. LED rouge sur le lecteur = alimentation OK.',
  },

  /* ---- Démarrage PC ---- */
  {
    id: 's5', group: 'Démarrage PC',
    title: 'Passer le switch alimentation sur ON',
    desc: 'Interrupteur ON/OFF à l\'arrière du boîtier PC (à côté du câble secteur).',
  },
  {
    id: 's6', group: 'Démarrage PC',
    title: 'Appuyer sur le bouton Power',
    desc: 'LED bleue ou verte doit s\'allumer. Attendre le chargement complet de Windows (environ 90 secondes).',
  },
  {
    id: 's7', group: 'Démarrage PC',
    title: 'Vérifier que Windows démarre correctement',
    desc: 'Le bureau Windows doit apparaître et le logiciel EPIMAT se lancer automatiquement.',
  },

  /* ---- Configuration réseau ---- */
  {
    id: 's8', group: 'Configuration réseau',
    title: 'Insérer la carte SIM dans le modem GSM',
    desc: 'Format nano-SIM. Vérifier l\'orientation (encoche). Voir la fiche "Remplacement carte SIM & APN".',
  },
  {
    id: 's9', group: 'Configuration réseau',
    title: 'Configurer l\'APN de l\'opérateur',
    desc: 'Suivre la procédure "SIM Card Replacement and APN Setup". LED Online du modem doit être fixe.',
  },
  {
    id: 's10', group: 'Configuration réseau',
    title: 'Vérifier la synchronisation avec le serveur',
    desc: 'Dans le logiciel EPIMAT, l\'icône réseau doit être en vert = connexion serveur OK.',
  },

  /* ---- Configuration badges ---- */
  {
    id: 's11', group: 'Configuration badges',
    title: 'Initialiser les badges dans DISTEPI',
    desc: 'Suivre le tutoriel "Initialisation badges Kalistrut". Créer les utilisateurs et assigner les badges.',
  },
  {
    id: 's12', group: 'Configuration badges',
    title: 'Tester le lecteur badge',
    desc: 'Passer un badge initialisé devant le lecteur. Un bip + LED verte = lecture OK.',
  },

  /* ---- Validation finale ---- */
  {
    id: 's13', group: 'Validation finale',
    title: 'Effectuer un cycle complet de test',
    desc: 'Badge → comptage → synchronisation. Vérifier que les données remontent correctement sur le serveur.',
  },
  {
    id: 's14', group: 'Validation finale',
    title: 'Tester l\'impression du ticket (si présente)',
    desc: 'Insérer un rouleau de papier thermique (côté brillant vers le bas) et lancer un test d\'impression.',
  },
  {
    id: 's15', group: 'Validation finale',
    title: 'Noter le numéro de série',
    desc: 'Étiquette argentée à l\'arrière de la machine. À communiquer systématiquement au SAV Logimatiq.',
  },
];

export function renderSetup() {
  const checked = getChecked();
  const total = SETUP_STEPS.length;
  const done = SETUP_STEPS.filter(s => checked.includes(s.id)).length;
  const pct = Math.round((done / total) * 100);
  const groups = [...new Set(SETUP_STEPS.map(s => s.group))];

  const list = document.getElementById('setup-list');
  if (!list) return;

  list.innerHTML = `
    <!-- Barre de progression -->
    <div class="bg-white border border-slate-200 rounded-2xl p-4 mb-5 shadow-sm">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-bold uppercase tracking-widest text-slate-400">Progression</span>
        <span class="text-sm font-black text-brand-600">${done} / ${total}</span>
      </div>
      <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-500"
             style="width:${pct}%;background:#0F4C81"></div>
      </div>
      ${done === total ? `
      <p class="text-xs font-bold text-emerald-600 text-center mt-2.5">
        ✓ Installation complète !
      </p>` : ''}
    </div>

    ${groups.map(group => `
      <div class="mb-5">
        <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 px-1">
          ${group}
        </h3>
        <div class="space-y-2">
          ${SETUP_STEPS.filter(s => s.group === group).map(s => {
            const isChecked = checked.includes(s.id);
            return `
              <label class="flex items-start gap-3.5 bg-white border border-slate-200
                            rounded-2xl p-4 shadow-sm cursor-pointer tap-card">
                <div class="mt-0.5 shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center
                            transition-all duration-150 cursor-pointer
                            ${isChecked
                              ? 'border-brand-600'
                              : 'border-slate-300'}"
                     style="${isChecked ? 'background:#0F4C81' : ''}">
                  ${isChecked ? `<svg viewBox="0 0 12 12" class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m2 6 3 3 5-5"/>
                  </svg>` : ''}
                  <input type="checkbox" data-step="${s.id}" ${isChecked ? 'checked' : ''}
                    class="sr-only">
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-bold text-sm leading-snug
                              ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}">
                    ${s.title}
                  </div>
                  <p class="text-[11px] text-slate-400 mt-0.5 leading-relaxed">${s.desc}</p>
                </div>
              </label>`;
          }).join('')}
        </div>
      </div>`).join('')}

    <!-- Reset -->
    <button id="btn-setup-reset"
      class="w-full border border-slate-200 text-slate-400 font-semibold text-sm py-3 rounded-2xl mt-2 mb-5">
      Réinitialiser la checklist
    </button>`;

  /* Événements cases à cocher */
  list.querySelectorAll('[data-step]').forEach(cb => {
    cb.closest('label').addEventListener('click', () => {
      const id = cb.dataset.step;
      const current = getChecked();
      const updated = current.includes(id)
        ? current.filter(x => x !== id)
        : [...current, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      renderSetup();
    });
  });

  document.getElementById('btn-setup-reset')?.addEventListener('click', () => {
    if (confirm('Réinitialiser toute la checklist ?')) {
      localStorage.removeItem(STORAGE_KEY);
      renderSetup();
    }
  });
}

function getChecked() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
