/* ============================================================================
   SETUP — Guide de mise en service EPIMAT
   Basé sur : User & Installation Manual EPIMAT EN.pdf
              SIM Card Replacement and APN Setup Procedure.pdf
              initialisation badges kalistrut.pdf
              Manuel Maintenance EPIMAT_eng.pdf
   ========================================================================== */

const STORAGE_KEY = 'logimatiq_setup_checks_v2';

/* ---- Définition des phases et étapes ---- */
const PHASES = [
  {
    id: 'physique',
    label: 'Installation physique',
    color: '#0F4C81',
    icon: `<path stroke-linecap="round" stroke-linejoin="round"
             d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5
                M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4"/>`,
    steps: [
      {
        id: 'p1_1',
        title: 'Choisir l\'emplacement',
        detail: 'Prévoir au minimum 10 à 15 cm de dégagement à l\'arrière et sur les côtés de la machine pour la ventilation et l\'accès maintenance.',
        warn: null,
      },
      {
        id: 'p1_2',
        title: 'Amener la machine à son emplacement',
        detail: 'Utiliser un transpalette ou un chariot élévateur. La base de la machine est renforcée pour ce type de manutention.',
        warn: null,
      },
      {
        id: 'p1_3',
        title: 'Stabiliser la machine (4 pieds réglables)',
        detail: 'Régler les 4 pieds d\'appui situés aux coins de la machine avec une clé hexagonale taille 8. La machine doit être parfaitement d\'aplomb et stable.',
        warn: null,
      },
      {
        id: 'p1_4',
        title: 'Brancher l\'alimentation secteur',
        detail: 'Brancher le câble secteur fourni (livré dans la partie inférieure de la machine) sur une prise 220V (100/240V AC, 150W max, fusible 15A). Passer le câble par le passage prévu dans le châssis.',
        warn: '⚠ Ne pas encore allumer la machine — laisser le switch arrière du PC sur OFF.',
      },
    ],
  },
  {
    id: 'demarrage',
    label: 'Démarrage du PC',
    color: '#1E6CB8',
    icon: `<rect x="2" y="3" width="20" height="14" rx="2"/>
           <path stroke-linecap="round" d="M8 21h8M12 17v4"/>`,
    steps: [
      {
        id: 'p2_1',
        title: 'Mettre le switch d\'alimentation PC sur ON',
        detail: 'Le switch ON/OFF se trouve à l\'arrière du boîtier PC, à côté du câble secteur. Le passer en position ON.',
        warn: null,
      },
      {
        id: 'p2_2',
        title: 'Appuyer sur le bouton Power du PC',
        detail: 'La LED du PC (bleue ou verte) doit s\'allumer. Attendre le démarrage complet de Windows, environ 90 secondes.',
        warn: null,
      },
      {
        id: 'p2_3',
        title: 'Vérifier que le logiciel DistEPI démarre automatiquement',
        detail: 'Le logiciel DistEPI.exe (situé dans C:\\EPI\\) doit se lancer automatiquement au démarrage de Windows et s\'afficher sur l\'écran tactile de la machine.',
        warn: 'Si DistEPI ne démarre pas tout seul, le lancer manuellement depuis C:\\EPI\\DistEPI.exe',
      },
      {
        id: 'p2_4',
        title: 'Vérifier l\'affichage de l\'écran tactile',
        detail: 'L\'écran tactile de la machine doit afficher l\'interface de sélection des EPI. Le voyant de l\'écran doit être vert.',
        warn: 'Si voyant rouge ou écran noir → voir le diagnostic "Problème d\'écran" dans l\'application.',
      },
    ],
  },
  {
    id: 'modem',
    label: 'Configuration réseau / Modem',
    color: '#059669',
    icon: `<path stroke-linecap="round" stroke-linejoin="round"
             d="M8.111 16.404a5.5 5.5 0 0 1 7.778 0M12 20h.01m-7.08-7.071c3.904-3.905
                10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>`,
    steps: [
      {
        id: 'p3_1',
        title: 'Localiser le modem Four-Faith F3827',
        detail: 'Le modem est situé à l\'intérieur de la machine, dans le tableau de bord. Il s\'agit d\'un boîtier avec plusieurs LEDs visibles sur la face avant.',
        warn: null,
      },
      {
        id: 'p3_2',
        title: 'Insérer la carte SIM (si pas déjà en place)',
        detail: 'Mettre hors tension le modem avant d\'insérer la SIM. Insérer la carte SIM (format nano-SIM) dans le slot prévu, en respectant l\'orientation (encoche). Remettre sous tension.',
        warn: '⚠ Toujours couper l\'alimentation du modem avant de manipuler la SIM.',
      },
      {
        id: 'p3_3',
        title: 'Configurer l\'APN via le logiciel Logimatiq',
        detail: 'Sur le PC de la machine, lancer C:\\EPI\\setup_config_routeur_four_faith_1.0.0.17.exe. Répondre "Oui" à la question de connexion via routeur Logimatiq. L\'APN est configuré automatiquement (matooma.m2m par défaut). Si besoin de changer : accéder à http://192.168.1.1 (login : logimatiq / mazaltov) → SETUP → WAN Setup → saisir l\'APN fourni par Logimatiq.',
        warn: 'L\'APN dépend de l\'opérateur SIM fourni avec la machine. En cas de doute, contacter le SAV Logimatiq.',
      },
      {
        id: 'p3_4',
        title: 'Vérifier les LEDs du modem',
        detail: 'Après configuration, contrôler les LEDs du modem Four-Faith :\n• PWR (bleu fixe) = alimentation OK\n• SIM (allumé) = carte SIM détectée\n• SYS (clignotant) = système actif\n• Signal (plusieurs LEDs) = qualité signal réseau\n• Online (bleu FIXE) = connecté à Internet ✓\n• ETH (clignotant) = communication avec la machine OK ✓\nLes LEDs Online et ETH sont les plus importantes.',
        warn: 'Si Online ne s\'allume pas au bout de 2 minutes → voir diagnostic "Problème Internet/Modem" dans l\'application.',
      },
    ],
  },
  {
    id: 'extranet',
    label: 'Configuration extranet EPIMAT',
    color: '#7C3AED',
    icon: `<path stroke-linecap="round" stroke-linejoin="round"
             d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9
                c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9
                a9 9 0 0 1 9-9"/>`,
    steps: [
      {
        id: 'p4_1',
        title: 'Se connecter à l\'extranet EPIMAT',
        detail: 'Depuis n\'importe quel navigateur web, aller sur https://epimat.logimatiq.com/client\nSe connecter avec l\'identifiant et le mot de passe fournis par Logimatiq.',
        warn: 'Identifiants fournis par Logimatiq à la livraison. En cas de perte → contacter le SAV.',
      },
      {
        id: 'p4_2',
        title: 'Créer / vérifier la machine dans le système',
        detail: 'Aller dans le menu "Machines". Vérifier que la machine est présente (elle peut être pré-créée par Logimatiq). Si absent : créer une nouvelle machine en renseignant le numéro de série et le modèle (EPIMAT 36 ou 62 colonnes).',
        warn: null,
      },
      {
        id: 'p4_3',
        title: 'Créer les articles (EPI) à distribuer',
        detail: 'Pour chaque article à distribuer, renseigner : désignation, référence fournisseur, code-barres, fournisseur, code article, famille (gants/lunettes/chaussures…), taille, prix unitaire HT, alerte stock (seuil email).',
        warn: null,
      },
      {
        id: 'p4_4',
        title: 'Créer les profils employés',
        detail: 'Créer les profils de quota : définir pour chaque article la quantité autorisée ("Allowed qty") et la périodicité en jours ("Periodicity"). Exemple : 1 paire de gants par trimestre = quantité 1 / fréquence 90.\nProfils par défaut disponibles : LEADER (accès illimité tout), UNLIMITED (accès sans quota).',
        warn: null,
      },
      {
        id: 'p4_5',
        title: 'Créer les employés',
        detail: 'Pour chaque employé : saisir nom, prénom, numéro de badge, numéro matricule, site, service, profil attribué, accès machines autorisés.',
        warn: 'Le numéro de badge saisi ici doit correspondre exactement au numéro lu par la machine (voir étape d\'initialisation des badges).',
      },
      {
        id: 'p4_6',
        title: 'Affecter les articles aux emplacements machine',
        detail: 'Dans la configuration de la machine, affecter chaque article à sa colonne/niveau/bac correspondant. Vérifier que le plan de chargement correspond à la disposition physique dans le tambour.',
        warn: null,
      },
    ],
  },
  {
    id: 'badges',
    label: 'Initialisation des badges',
    color: '#D97706',
    icon: `<path stroke-linecap="round" stroke-linejoin="round"
             d="M10 6H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-5
                m-4 0V5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2v1m-4 0h4"/>`,
    steps: [
      {
        id: 'p5_1',
        title: 'Présenter le badge devant le lecteur',
        detail: 'Si l\'écran affiche "INITIALISATION BADGE — Tapez votre code !", le badge n\'est pas encore initialisé sur cette machine. Passer à l\'étape suivante.',
        warn: null,
      },
      {
        id: 'p5_2',
        title: 'Saisir le code du badge à 7 chiffres',
        detail: 'Saisir le numéro imprimé sur le badge, COMPLÉTÉ PAR DES ZÉROS À GAUCHE pour obtenir exactement 7 chiffres.\nExemples :\n• Badge "529545" → taper 0529545\n• Badge "1234" → taper 0001234\n• Badge "14" → taper 0000014',
        warn: '⚠ Toujours 7 chiffres. Un code incomplet ou erroné refusera l\'initialisation.',
      },
      {
        id: 'p5_3',
        title: 'Vérifier le nom affiché et valider',
        detail: 'Après saisie du code, l\'écran affiche le nom de l\'employé associé à ce badge dans l\'extranet. Vérifier que le nom correspond bien à la personne, puis appuyer sur OK pour valider.',
        warn: 'Si le nom ne correspond pas ou si "inconnu" s\'affiche → vérifier que l\'employé est bien créé dans l\'extranet avec le bon numéro de badge.',
      },
      {
        id: 'p5_4',
        title: 'Répéter pour chaque badge',
        detail: 'Répéter les étapes précédentes pour tous les badges des employés. Un badge déjà initialisé sera directement reconnu sans redemander le code.',
        warn: null,
      },
    ],
  },
  {
    id: 'chargement',
    label: 'Chargement initial de la machine',
    color: '#DC2626',
    icon: `<path stroke-linecap="round" stroke-linejoin="round"
             d="M20 7l-8-4-8 4m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>`,
    steps: [
      {
        id: 'p6_1',
        title: 'Remplir les bacs du tambour',
        detail: 'Ouvrir la porte frontale. Utiliser le bouton "Drum rotation" (rotation manuelle du tambour) pour faire défiler les colonnes et remplir chaque bac avec les articles correspondants selon le plan d\'affectation défini dans l\'extranet.',
        warn: null,
      },
      {
        id: 'p6_2',
        title: 'Mettre à jour le stock dans le logiciel',
        detail: 'Passer un badge opérateur devant le lecteur → accéder au menu → appuyer sur "FULL UP THE MACHINE". Le logiciel enregistre alors le stock complet pour toutes les colonnes.',
        warn: null,
      },
      {
        id: 'p6_3',
        title: 'Corriger le stock colonne par colonne si besoin',
        detail: 'Si certaines colonnes ne sont pas entièrement remplies : appuyer sur le numéro de colonne concerné → appuyer sur le numéro du niveau à ajuster → appuyer sur OK pour sauvegarder. Procéder colonne par colonne avant de quitter le menu.',
        warn: 'Toujours appuyer sur OK avant de changer de colonne ou quitter, sinon la modification n\'est pas enregistrée.',
      },
      {
        id: 'p6_4',
        title: 'Vérifier les stocks dans l\'extranet',
        detail: 'Dans l\'extranet → menu "Stocks" → onglet "Machine" : l\'indicateur doit être vert (stock complet) ou afficher le bon pourcentage de remplissage. Rouge = aucun article enregistré.',
        warn: null,
      },
    ],
  },
  {
    id: 'validation',
    label: 'Tests et validation finale',
    color: '#10B981',
    icon: `<path stroke-linecap="round" stroke-linejoin="round"
             d="m9 12 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>`,
    steps: [
      {
        id: 'p7_1',
        title: 'Effectuer un cycle complet de test',
        detail: 'Passer un badge employé → choisir une famille d\'articles → sélectionner un article → appuyer sur Terminer. La machine doit tourner le tambour vers la bonne colonne, ouvrir la trappe et distribuer l\'article.',
        warn: 'Si la trappe ne s\'ouvre pas ou si le tambour ne tourne pas → voir les diagnostics dans l\'application.',
      },
      {
        id: 'p7_2',
        title: 'Vérifier la synchronisation avec le serveur',
        detail: 'Dans le logiciel DistEPI, l\'icône réseau doit être en vert = synchronisation serveur OK. La distribution de test doit apparaître dans l\'extranet sous "Editions" → "Consommation".',
        warn: 'Si pas de synchronisation → vérifier la LED Online du modem (doit être fixe).',
      },
      {
        id: 'p7_3',
        title: 'Test automatique complet (Test Grafcet.exe)',
        detail: 'Sur le PC machine, ouvrir C:\\EPI\\Test Grafcet.exe. Sélectionner le type de machine → "Init Grafcet" (réponse attendue : 0) → "Init Motor" (réponse : 0) → "Test Machine". La machine effectue des distributions aléatoires sur tous les emplacements automatiquement.',
        warn: 'Ce test est optionnel mais recommandé pour valider mécaniquement tous les emplacements.',
      },
      {
        id: 'p7_4',
        title: 'Noter le numéro de série de la machine',
        detail: 'Le numéro de série se trouve sur l\'étiquette argentée à l\'arrière de la machine. Le noter et le communiquer à Logimatiq. Il sera nécessaire pour toute demande de SAV.',
        warn: null,
      },
    ],
  },
];

/* ================================================================== */
/*  Rendu principal                                                     */
/* ================================================================== */
export function renderSetup() {
  const checked = getChecked();
  const total   = PHASES.reduce((acc, p) => acc + p.steps.length, 0);
  const done    = PHASES.reduce((acc, p) =>
    acc + p.steps.filter(s => checked.includes(s.id)).length, 0);
  const pct     = total ? Math.round((done / total) * 100) : 0;

  const list = document.getElementById('setup-list');
  if (!list) return;

  list.innerHTML = `
    <!-- Progression globale -->
    <div class="bg-white border border-slate-200 rounded-2xl p-4 mb-5 shadow-sm">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-bold uppercase tracking-widest text-slate-400">Progression</span>
        <span class="text-sm font-black" style="color:#0F4C81">${done} / ${total} étapes</span>
      </div>
      <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-500"
             style="width:${pct}%;background:#0F4C81"></div>
      </div>
      ${done === total ? `
      <div class="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
        <p class="text-sm font-black text-emerald-700">✓ Installation complète !</p>
        <p class="text-xs text-emerald-500 mt-0.5">La machine est prête à l'utilisation.</p>
      </div>` : ''}
    </div>

    <!-- Phases -->
    ${PHASES.map(phase => renderPhase(phase, checked)).join('')}

    <!-- Reset -->
    <button id="btn-setup-reset"
      class="w-full border border-slate-200 text-slate-400 font-semibold
             text-xs py-3 rounded-2xl mt-1 mb-6">
      Réinitialiser la checklist
    </button>`;

  /* Événements checkbox */
  list.querySelectorAll('[data-step-id]').forEach(label => {
    label.addEventListener('click', (e) => {
      e.preventDefault();
      const id      = label.dataset.stepId;
      const current = getChecked();
      const updated = current.includes(id)
        ? current.filter(x => x !== id)
        : [...current, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      renderSetup();
    });
  });

  /* Accordéon phases */
  list.querySelectorAll('[data-phase-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const phaseId  = btn.dataset.phaseToggle;
      const content  = document.getElementById('phase-content-' + phaseId);
      const arrow    = document.getElementById('phase-arrow-' + phaseId);
      const isOpen   = content.style.display !== 'none';
      content.style.display = isOpen ? 'none' : 'block';
      arrow.style.transform  = isOpen ? 'rotate(0deg)' : 'rotate(90deg)';
    });
  });

  /* Reset */
  document.getElementById('btn-setup-reset')?.addEventListener('click', () => {
    if (confirm('Réinitialiser toute la checklist d\'installation ?')) {
      localStorage.removeItem(STORAGE_KEY);
      renderSetup();
    }
  });
}

/* ---- Rendu d'une phase ---- */
function renderPhase(phase, checked) {
  const phaseDone  = phase.steps.filter(s => checked.includes(s.id)).length;
  const phaseTotal = phase.steps.length;
  const allDone    = phaseDone === phaseTotal;

  return `
    <div class="mb-3">
      <!-- En-tête de phase (accordéon) -->
      <button data-phase-toggle="${phase.id}"
        class="w-full flex items-center gap-3 bg-white border border-slate-200
               rounded-2xl px-4 py-3.5 text-left shadow-sm tap-card">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
             style="background:${phase.color}18">
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="${phase.color}" stroke-width="2">
            ${phase.icon}
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-black text-slate-900 text-sm">${phase.label}</div>
          <div class="text-[11px] font-medium mt-0.5 ${allDone ? 'text-emerald-500' : 'text-slate-400'}">
            ${allDone ? '✓ Complété' : `${phaseDone} / ${phaseTotal} étapes`}
          </div>
        </div>
        <svg id="phase-arrow-${phase.id}" viewBox="0 0 24 24"
             class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200"
             style="transform:rotate(0deg)"
             fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/>
        </svg>
      </button>

      <!-- Contenu de la phase -->
      <div id="phase-content-${phase.id}" style="display:none" class="mt-1.5 space-y-1.5">
        ${phase.steps.map(step => renderStep(step, checked, phase.color)).join('')}
      </div>
    </div>`;
}

/* ---- Rendu d'une étape ---- */
function renderStep(step, checked, color) {
  const isChecked = checked.includes(step.id);
  const lines     = step.detail.split('\n');

  return `
    <label data-step-id="${step.id}"
      class="flex items-start gap-3.5 bg-white border rounded-2xl p-4 shadow-sm cursor-pointer tap-card
             ${isChecked ? 'border-emerald-200' : 'border-slate-200'}">
      <!-- Checkbox custom -->
      <div class="mt-0.5 shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center
                  transition-all duration-150"
           style="${isChecked
             ? `background:${color};border-color:${color}`
             : 'border-color:#CBD5E1'}">
        ${isChecked ? `
        <svg viewBox="0 0 12 12" class="w-3 h-3 text-white" fill="none"
             stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2 6 3 3 5-5"/>
        </svg>` : ''}
      </div>

      <!-- Contenu -->
      <div class="flex-1 min-w-0">
        <div class="font-bold text-sm leading-snug ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}">
          ${step.title}
        </div>
        ${!isChecked ? `
        <div class="mt-1.5 space-y-1">
          ${lines.map(l => l.trim()
            ? `<p class="text-[11px] text-slate-500 leading-relaxed">${l}</p>`
            : '').join('')}
        </div>
        ${step.warn ? `
        <div class="mt-2 flex items-start gap-1.5 bg-amber-50 border border-amber-200
                    rounded-xl px-2.5 py-2">
          <p class="text-[10px] text-amber-700 font-semibold leading-relaxed">${step.warn}</p>
        </div>` : ''}` : ''}
      </div>
    </label>`;
}

/* ---- localStorage ---- */
function getChecked() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
