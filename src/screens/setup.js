/* ============================================================================
   SETUP — Guide de mise en service EPIMAT
   Basé sur : User & Installation Manual EPIMAT EN.pdf
              SIM Card Replacement and APN Setup Procedure.pdf
              initialisation badges kalistrut.pdf
              Manuel Maintenance EPIMAT_eng.pdf
   ========================================================================== */
import { t, getLang } from '../i18n.js';

const STORAGE_KEY = 'logimatiq_setup_checks_v2';

/* ---- Définition des phases et étapes ---- */
const PHASES = [
  {
    id: 'physique',
    label: 'Installation physique',
    label_en: 'Physical installation',
    color: '#0F4C81',
    icon: `<path stroke-linecap="round" stroke-linejoin="round"
             d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5
                M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4"/>`,
    steps: [
      {
        id: 'p1_1',
        title: 'Choisir l\'emplacement',
        title_en: 'Choose the location',
        detail: 'Prévoir au minimum 10 à 15 cm de dégagement à l\'arrière et sur les côtés de la machine pour la ventilation et l\'accès maintenance.',
        detail_en: 'Allow at least 10 to 15 cm of clearance at the back and sides of the machine for ventilation and maintenance access.',
        warn: null,
      },
      {
        id: 'p1_2',
        title: 'Amener la machine à son emplacement',
        title_en: 'Move the machine to its location',
        detail: 'Utiliser un transpalette ou un chariot élévateur. La base de la machine est renforcée pour ce type de manutention.',
        detail_en: 'Use a pallet truck or forklift. The machine base is reinforced for this type of handling.',
        warn: null,
      },
      {
        id: 'p1_3',
        title: 'Stabiliser la machine (4 pieds réglables)',
        title_en: 'Stabilize the machine (4 adjustable feet)',
        detail: 'Régler les 4 pieds d\'appui situés aux coins de la machine avec une clé hexagonale taille 8. La machine doit être parfaitement d\'aplomb et stable.',
        detail_en: 'Adjust the 4 support feet located at the corners of the machine using a size 8 hex key. The machine must be perfectly level and stable.',
        warn: null,
      },
      {
        id: 'p1_4',
        title: 'Brancher l\'alimentation secteur',
        title_en: 'Connect the mains power',
        detail: 'Brancher le câble secteur fourni (livré dans la partie inférieure de la machine) sur une prise 220V (100/240V AC, 150W max, fusible 15A). Passer le câble par le passage prévu dans le châssis.',
        detail_en: 'Connect the provided power cable (located in the lower part of the machine) to a 220V outlet (100/240V AC, 150W max, 15A fuse). Route the cable through the designated opening in the chassis.',
        warn: '⚠ Ne pas encore allumer la machine — laisser le switch arrière du PC sur OFF.',
        warn_en: '⚠ Do not turn on the machine yet — leave the rear PC switch set to OFF.',
      },
    ],
  },
  {
    id: 'demarrage',
    label: 'Démarrage du PC',
    label_en: 'PC startup',
    color: '#1E6CB8',
    icon: `<rect x="2" y="3" width="20" height="14" rx="2"/>
           <path stroke-linecap="round" d="M8 21h8M12 17v4"/>`,
    steps: [
      {
        id: 'p2_1',
        title: 'Mettre le switch d\'alimentation PC sur ON',
        title_en: 'Set the PC power switch to ON',
        detail: 'Le switch ON/OFF se trouve à l\'arrière du boîtier PC, à côté du câble secteur. Le passer en position ON.',
        detail_en: 'The ON/OFF switch is located at the back of the PC case, next to the power cable. Set it to the ON position.',
        warn: null,
      },
      {
        id: 'p2_2',
        title: 'Appuyer sur le bouton Power du PC',
        title_en: 'Press the PC Power button',
        detail: 'La LED du PC (bleue ou verte) doit s\'allumer. Attendre le démarrage complet de Windows, environ 90 secondes.',
        detail_en: 'The PC LED (blue or green) should light up. Wait for Windows to fully start, approximately 90 seconds.',
        warn: null,
      },
      {
        id: 'p2_3',
        title: 'Vérifier que le logiciel DistEPI démarre automatiquement',
        title_en: 'Verify that DistEPI software starts automatically',
        detail: 'Le logiciel DistEPI.exe (situé dans C:\\EPI\\) doit se lancer automatiquement au démarrage de Windows et s\'afficher sur l\'écran tactile de la machine.',
        detail_en: 'The DistEPI.exe software (located in C:\\EPI\\) must launch automatically when Windows starts and display on the machine\'s touchscreen.',
        warn: 'Si DistEPI ne démarre pas tout seul, le lancer manuellement depuis C:\\EPI\\DistEPI.exe',
        warn_en: 'If DistEPI does not start on its own, launch it manually from C:\\EPI\\DistEPI.exe',
      },
      {
        id: 'p2_4',
        title: 'Vérifier l\'affichage de l\'écran tactile',
        title_en: 'Check the touchscreen display',
        detail: 'L\'écran tactile de la machine doit afficher l\'interface de sélection des EPI. Le voyant de l\'écran doit être vert.',
        detail_en: 'The machine\'s touchscreen must display the PPE selection interface. The screen indicator light must be green.',
        warn: 'Si voyant rouge ou écran noir → voir le diagnostic "Problème d\'écran" dans l\'application.',
        warn_en: 'If indicator is red or screen is black → see the "Screen problem" diagnostic in the app.',
      },
    ],
  },
  {
    id: 'modem',
    label: 'Configuration réseau / Modem',
    label_en: 'Network / Modem configuration',
    color: '#059669',
    icon: `<path stroke-linecap="round" stroke-linejoin="round"
             d="M8.111 16.404a5.5 5.5 0 0 1 7.778 0M12 20h.01m-7.08-7.071c3.904-3.905
                10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>`,
    steps: [
      {
        id: 'p3_1',
        title: 'Localiser le modem Four-Faith F3827',
        title_en: 'Locate the Four-Faith F3827 modem',
        detail: 'Le modem est situé à l\'intérieur de la machine, dans le tableau de bord. Il s\'agit d\'un boîtier avec plusieurs LEDs visibles sur la face avant.',
        detail_en: 'The modem is located inside the machine, in the control panel. It is a box with several LEDs visible on the front panel.',
        warn: null,
      },
      {
        id: 'p3_2',
        title: 'Insérer la carte SIM (si pas déjà en place)',
        title_en: 'Insert the SIM card (if not already in place)',
        detail: 'Mettre hors tension le modem avant d\'insérer la SIM. Insérer la carte SIM (format nano-SIM) dans le slot prévu, en respectant l\'orientation (encoche). Remettre sous tension.',
        detail_en: 'Power off the modem before inserting the SIM. Insert the SIM card (nano-SIM format) into the designated slot, respecting the orientation (notch). Power back on.',
        warn: '⚠ Toujours couper l\'alimentation du modem avant de manipuler la SIM.',
        warn_en: '⚠ Always cut modem power before handling the SIM card.',
      },
      {
        id: 'p3_3',
        title: 'Configurer l\'APN via le logiciel Logimatiq',
        title_en: 'Configure the APN via Logimatiq software',
        detail: 'Sur le PC de la machine, lancer C:\\EPI\\setup_config_routeur_four_faith_1.0.0.17.exe. Répondre "Oui" à la question de connexion via routeur Logimatiq. L\'APN est configuré automatiquement (matooma.m2m par défaut). Si besoin de changer : accéder à http://192.168.1.1 (login : logimatiq / mazaltov) → SETUP → WAN Setup → saisir l\'APN fourni par Logimatiq.',
        detail_en: 'On the machine PC, run C:\\EPI\\setup_config_routeur_four_faith_1.0.0.17.exe. Answer "Yes" to the Logimatiq router connection question. The APN is configured automatically (matooma.m2m by default). To change it: go to http://192.168.1.1 (login: logimatiq / mazaltov) → SETUP → WAN Setup → enter the APN provided by Logimatiq.',
        warn: 'L\'APN dépend de l\'opérateur SIM fourni avec la machine. En cas de doute, contacter le SAV Logimatiq.',
        warn_en: 'The APN depends on the SIM operator provided with the machine. If in doubt, contact Logimatiq Support.',
      },
      {
        id: 'p3_4',
        title: 'Vérifier les LEDs du modem',
        title_en: 'Check the modem LEDs',
        detail: 'Après configuration, contrôler les LEDs du modem Four-Faith :\n• PWR (bleu fixe) = alimentation OK\n• SIM (allumé) = carte SIM détectée\n• SYS (clignotant) = système actif\n• Signal (plusieurs LEDs) = qualité signal réseau\n• Online (bleu FIXE) = connecté à Internet ✓\n• ETH (clignotant) = communication avec la machine OK ✓\nLes LEDs Online et ETH sont les plus importantes.',
        detail_en: 'After configuration, check the Four-Faith modem LEDs:\n• PWR (solid blue) = power OK\n• SIM (lit) = SIM card detected\n• SYS (blinking) = system active\n• Signal (multiple LEDs) = network signal quality\n• Online (solid blue) = connected to Internet ✓\n• ETH (blinking) = communication with machine OK ✓\nThe Online and ETH LEDs are the most important.',
        warn: 'Si Online ne s\'allume pas au bout de 2 minutes → voir diagnostic "Problème Internet/Modem" dans l\'application.',
        warn_en: 'If Online does not light up after 2 minutes → see "Internet/Modem problem" diagnostic in the app.',
      },
    ],
  },
  {
    id: 'extranet',
    label: 'Configuration extranet EPIMAT',
    label_en: 'EPIMAT extranet configuration',
    color: '#7C3AED',
    icon: `<path stroke-linecap="round" stroke-linejoin="round"
             d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9
                c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9
                a9 9 0 0 1 9-9"/>`,
    steps: [
      {
        id: 'p4_1',
        title: 'Se connecter à l\'extranet EPIMAT',
        title_en: 'Log in to the EPIMAT extranet',
        detail: 'Depuis n\'importe quel navigateur web, aller sur https://epimat.logimatiq.com/client\nSe connecter avec l\'identifiant et le mot de passe fournis par Logimatiq à la livraison.',
        detail_en: 'From any web browser, go to https://epimat.logimatiq.com/client\nLog in with the username and password provided by Logimatiq at delivery.',
        warn: 'La base de données client (machine, articles, profils) est créée et configurée par Logimatiq avant la livraison. En cas de problème de connexion → contacter le SAV au 07 45 28 44 83.',
        warn_en: 'The customer database (machine, items, profiles) is created and configured by Logimatiq before delivery. If connection problems occur → contact Support at 07 45 28 44 83.',
      },
      {
        id: 'p4_2',
        title: 'Vérifier que la machine est bien présente',
        title_en: 'Verify the machine is listed',
        detail: 'Aller dans le menu "Machines". La machine doit déjà être présente dans le système — Logimatiq l\'a pré-créée avant livraison. Vérifier le numéro de série affiché et le modèle (EPIMAT 36 ou 62 colonnes).',
        detail_en: 'Go to the "Machines" menu. The machine should already be in the system — Logimatiq pre-created it before delivery. Verify the displayed serial number and model (EPIMAT 36 or 62 columns).',
        warn: 'Si la machine n\'apparaît pas dans l\'extranet → contacter Logimatiq au 07 45 28 44 83.',
        warn_en: 'If the machine does not appear in the extranet → contact Logimatiq at 07 45 28 44 83.',
      },
      {
        id: 'p4_3',
        title: 'Créer les articles (EPI) à distribuer',
        title_en: 'Create the PPE items to distribute',
        detail: 'Pour chaque article à distribuer, renseigner : désignation, référence fournisseur, code-barres, fournisseur, code article, famille (gants/lunettes/chaussures…), taille, prix unitaire HT, alerte stock (seuil email).',
        detail_en: 'For each item to distribute, fill in: designation, supplier reference, barcode, supplier, item code, family (gloves/goggles/shoes…), size, unit price excl. tax, stock alert (email threshold).',
        warn: null,
      },
      {
        id: 'p4_4',
        title: 'Créer les profils employés',
        title_en: 'Create employee profiles',
        detail: 'Créer les profils de quota : définir pour chaque article la quantité autorisée ("Allowed qty") et la périodicité en jours ("Periodicity"). Exemple : 1 paire de gants par trimestre = quantité 1 / fréquence 90.\nProfils par défaut disponibles : LEADER (accès illimité tout), UNLIMITED (accès sans quota).',
        detail_en: 'Create quota profiles: define for each item the allowed quantity ("Allowed qty") and periodicity in days ("Periodicity"). Example: 1 pair of gloves per quarter = quantity 1 / frequency 90.\nDefault profiles available: LEADER (unlimited access to all), UNLIMITED (access without quota).',
        warn: null,
      },
      {
        id: 'p4_5',
        title: 'Créer les employés',
        title_en: 'Create employees',
        detail: 'Pour chaque employé : saisir nom, prénom, numéro de badge, numéro matricule, site, service, profil attribué, accès machines autorisés.',
        detail_en: 'For each employee: enter last name, first name, badge number, employee ID, site, department, assigned profile, authorized machine access.',
        warn: 'Le numéro de badge saisi ici doit correspondre exactement au numéro lu par la machine (voir étape d\'initialisation des badges).',
        warn_en: 'The badge number entered here must exactly match the number read by the machine (see badge initialization step).',
      },
      {
        id: 'p4_6',
        title: 'Affecter les articles aux emplacements machine',
        title_en: 'Assign items to machine locations',
        detail: 'Dans la configuration de la machine, affecter chaque article à sa colonne/niveau/bac correspondant. Vérifier que le plan de chargement correspond à la disposition physique dans le tambour.',
        detail_en: 'In the machine configuration, assign each item to its corresponding column/level/bin. Verify that the loading plan matches the physical arrangement in the drum.',
        warn: null,
      },
    ],
  },
  {
    id: 'badges',
    label: 'Initialisation des badges',
    label_en: 'Badge initialization',
    color: '#D97706',
    icon: `<path stroke-linecap="round" stroke-linejoin="round"
             d="M10 6H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-5
                m-4 0V5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2v1m-4 0h4"/>`,
    steps: [
      {
        id: 'p5_1',
        title: 'Présenter le badge devant le lecteur',
        title_en: 'Present the badge to the reader',
        detail: 'Si l\'écran affiche "INITIALISATION BADGE — Tapez votre code !", le badge n\'est pas encore initialisé sur cette machine. Passer à l\'étape suivante.',
        detail_en: 'If the screen shows "INITIALISATION BADGE — Tapez votre code!", the badge has not yet been initialized on this machine. Proceed to the next step.',
        warn: null,
      },
      {
        id: 'p5_2',
        title: 'Saisir le code du badge à 7 chiffres',
        title_en: 'Enter the 7-digit badge code',
        detail: 'Saisir le numéro imprimé sur le badge, COMPLÉTÉ PAR DES ZÉROS À GAUCHE pour obtenir exactement 7 chiffres.\nExemples :\n• Badge "529545" → taper 0529545\n• Badge "1234" → taper 0001234\n• Badge "14" → taper 0000014',
        detail_en: 'Enter the number printed on the badge, PADDED WITH LEADING ZEROS to get exactly 7 digits.\nExamples:\n• Badge "529545" → enter 0529545\n• Badge "1234" → enter 0001234\n• Badge "14" → enter 0000014',
        warn: '⚠ Toujours 7 chiffres. Un code incomplet ou erroné refusera l\'initialisation.',
        warn_en: '⚠ Always 7 digits. An incomplete or incorrect code will reject initialization.',
      },
      {
        id: 'p5_3',
        title: 'Vérifier le nom affiché et valider',
        title_en: 'Verify the displayed name and confirm',
        detail: 'Après saisie du code, l\'écran affiche le nom de l\'employé associé à ce badge dans l\'extranet. Vérifier que le nom correspond bien à la personne, puis appuyer sur OK pour valider.',
        detail_en: 'After entering the code, the screen displays the employee name linked to this badge in the extranet. Verify the name matches the person, then press OK to confirm.',
        warn: 'Si le nom ne correspond pas ou si "inconnu" s\'affiche → vérifier que l\'employé est bien créé dans l\'extranet avec le bon numéro de badge.',
        warn_en: 'If the name does not match or "unknown" is displayed → verify the employee is created in the extranet with the correct badge number.',
      },
      {
        id: 'p5_4',
        title: 'Répéter pour chaque badge',
        title_en: 'Repeat for each badge',
        detail: 'Répéter les étapes précédentes pour tous les badges des employés. Un badge déjà initialisé sera directement reconnu sans redemander le code.',
        detail_en: 'Repeat the previous steps for all employee badges. A badge that has already been initialized will be recognized directly without asking for the code again.',
        warn: null,
      },
    ],
  },
  {
    id: 'chargement',
    label: 'Chargement initial de la machine',
    label_en: 'Initial machine loading',
    color: '#DC2626',
    icon: `<path stroke-linecap="round" stroke-linejoin="round"
             d="M20 7l-8-4-8 4m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>`,
    steps: [
      {
        id: 'p6_1',
        title: 'Remplir les bacs du tambour',
        title_en: 'Fill the drum bins',
        detail: 'Ouvrir la porte frontale. Utiliser le bouton "Drum rotation" (rotation manuelle du tambour) pour faire défiler les colonnes et remplir chaque bac avec les articles correspondants selon le plan d\'affectation défini dans l\'extranet.',
        detail_en: 'Open the front door. Use the "Drum rotation" button (manual drum rotation) to scroll through columns and fill each bin with the corresponding items according to the assignment plan defined in the extranet.',
        warn: null,
      },
      {
        id: 'p6_2',
        title: 'Mettre à jour le stock dans le logiciel',
        title_en: 'Update stock in the software',
        detail: 'Passer un badge opérateur devant le lecteur → accéder au menu → appuyer sur "FULL UP THE MACHINE". Le logiciel enregistre alors le stock complet pour toutes les colonnes.',
        detail_en: 'Swipe an operator badge in front of the reader → access the menu → press "FULL UP THE MACHINE". The software will then record full stock for all columns.',
        warn: null,
      },
      {
        id: 'p6_3',
        title: 'Corriger le stock colonne par colonne si besoin',
        title_en: 'Correct stock column by column if needed',
        detail: 'Si certaines colonnes ne sont pas entièrement remplies : appuyer sur le numéro de colonne concerné → appuyer sur le numéro du niveau à ajuster → appuyer sur OK pour sauvegarder. Procéder colonne par colonne avant de quitter le menu.',
        detail_en: 'If some columns are not fully filled: press the column number → press the level number to adjust → press OK to save. Process column by column before exiting the menu.',
        warn: 'Toujours appuyer sur OK avant de changer de colonne ou quitter, sinon la modification n\'est pas enregistrée.',
        warn_en: 'Always press OK before changing columns or exiting, otherwise the change is not saved.',
      },
      {
        id: 'p6_4',
        title: 'Vérifier les stocks dans l\'extranet',
        title_en: 'Verify stock in the extranet',
        detail: 'Dans l\'extranet → menu "Stocks" → onglet "Machine" : l\'indicateur doit être vert (stock complet) ou afficher le bon pourcentage de remplissage. Rouge = aucun article enregistré.',
        detail_en: 'In the extranet → "Stocks" menu → "Machine" tab: the indicator must be green (full stock) or show the correct fill percentage. Red = no items recorded.',
        warn: null,
      },
    ],
  },
  {
    id: 'validation',
    label: 'Tests et validation finale',
    label_en: 'Testing and final validation',
    color: '#10B981',
    icon: `<path stroke-linecap="round" stroke-linejoin="round"
             d="m9 12 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>`,
    steps: [
      {
        id: 'p7_1',
        title: 'Effectuer un cycle complet de test',
        title_en: 'Perform a complete test cycle',
        detail: 'Passer un badge employé → choisir une famille d\'articles → sélectionner un article → appuyer sur Terminer. La machine doit tourner le tambour vers la bonne colonne, ouvrir la trappe et distribuer l\'article.',
        detail_en: 'Swipe an employee badge → choose an item family → select an item → press Done. The machine must rotate the drum to the correct column, open the hatch and dispense the item.',
        warn: 'Si la trappe ne s\'ouvre pas ou si le tambour ne tourne pas → voir les diagnostics dans l\'application.',
        warn_en: 'If the hatch does not open or the drum does not rotate → see the diagnostics in the app.',
      },
      {
        id: 'p7_2',
        title: 'Vérifier la synchronisation avec le serveur',
        title_en: 'Verify server synchronization',
        detail: 'Dans le logiciel DistEPI, l\'icône réseau doit être en vert = synchronisation serveur OK. La distribution de test doit apparaître dans l\'extranet sous "Editions" → "Consommation".',
        detail_en: 'In DistEPI software, the network icon must be green = server sync OK. The test dispense must appear in the extranet under "Editions" → "Consommation".',
        warn: 'Si pas de synchronisation → vérifier la LED Online du modem (doit être fixe).',
        warn_en: 'If no synchronization → check the modem Online LED (must be solid).',
      },
      {
        id: 'p7_3',
        title: 'Test automatique complet (Test Grafcet.exe)',
        title_en: 'Full automatic test (Test Grafcet.exe)',
        detail: 'Sur le PC machine, ouvrir C:\\EPI\\Test Grafcet.exe. Sélectionner le type de machine → "Init Grafcet" (réponse attendue : 0) → "Init Motor" (réponse : 0) → "Test Machine". La machine effectue des distributions aléatoires sur tous les emplacements automatiquement.',
        detail_en: 'On the machine PC, open C:\\EPI\\Test Grafcet.exe. Select the machine type → "Init Grafcet" (expected response: 0) → "Init Motor" (response: 0) → "Test Machine". The machine performs random dispenses on all locations automatically.',
        warn: 'Ce test est optionnel mais recommandé pour valider mécaniquement tous les emplacements.',
        warn_en: 'This test is optional but recommended to mechanically validate all locations.',
      },
      {
        id: 'p7_4',
        title: 'Noter le numéro de série de la machine',
        title_en: 'Note the machine serial number',
        detail: 'Le numéro de série se trouve sur l\'étiquette argentée à l\'arrière de la machine. Le noter et le communiquer à Logimatiq. Il sera nécessaire pour toute demande de SAV.',
        detail_en: 'The serial number is on the silver label at the back of the machine. Note it and communicate it to Logimatiq. It will be required for any support request.',
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

  /* Mémoriser les phases ouvertes avant re-rendu */
  const openPhases = new Set(
    PHASES.filter(p => {
      const el = document.getElementById('phase-content-' + p.id);
      return el && el.style.display !== 'none';
    }).map(p => p.id)
  );

  list.innerHTML = `
    <!-- Progression globale -->
    <div class="bg-white border border-slate-200 rounded-2xl p-4 mb-5 shadow-sm">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-bold uppercase tracking-widest text-slate-400">${t('Progression')}</span>
        <span class="text-sm font-black" style="color:#0F4C81">${done} / ${total} ${t('étapes')}</span>
      </div>
      <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-500"
             style="width:${pct}%;background:#0F4C81"></div>
      </div>
      ${done === total ? `
      <div class="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
        <p class="text-sm font-black text-emerald-700">${t('✓ Installation complète !')}</p>
        <p class="text-xs text-emerald-500 mt-0.5">${t('La machine est prête à l\'utilisation.')}</p>
      </div>` : ''}
    </div>

    <!-- Phases -->
    ${PHASES.map(phase => renderPhase(phase, checked)).join('')}

    <!-- Reset -->
    <button id="btn-setup-reset"
      class="w-full border border-slate-200 text-slate-400 font-semibold
             text-xs py-3 rounded-2xl mt-1 mb-6">
      ${t('Réinitialiser la checklist')}
    </button>`;

  /* Restaurer les phases qui étaient ouvertes */
  PHASES.forEach(p => {
    if (openPhases.has(p.id)) {
      const content = document.getElementById('phase-content-' + p.id);
      const arrow   = document.getElementById('phase-arrow-' + p.id);
      if (content) content.style.display = 'block';
      if (arrow)   arrow.style.transform  = 'rotate(90deg)';
    }
  });

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
    if (confirm(t('Réinitialiser toute la checklist d\'installation ?'))) {
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
  const lang       = getLang();
  const phaseLabel = (lang === 'en' && phase.label_en) ? phase.label_en : phase.label;

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
          <div class="font-black text-slate-900 text-sm">${phaseLabel}</div>
          <div class="text-[11px] font-medium mt-0.5 ${allDone ? 'text-emerald-500' : 'text-slate-400'}">
            ${allDone ? t('✓ Complété') : `${phaseDone} / ${phaseTotal} ${t('étapes')}`}
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
  const lang      = getLang();
  const stepTitle = (lang === 'en' && step.title_en) ? step.title_en : step.title;
  const stepDetail = (lang === 'en' && step.detail_en) ? step.detail_en : step.detail;
  const stepWarn  = (lang === 'en' && step.warn_en)  ? step.warn_en  : step.warn;
  const lines     = stepDetail.split('\n');

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
          ${stepTitle}
        </div>
        ${!isChecked ? `
        <div class="mt-1.5 space-y-1">
          ${lines.map(l => l.trim()
            ? `<p class="text-[11px] text-slate-500 leading-relaxed">${l}</p>`
            : '').join('')}
        </div>
        ${stepWarn ? `
        <div class="mt-2 flex items-start gap-1.5 bg-amber-50 border border-amber-200
                    rounded-xl px-2.5 py-2">
          <p class="text-[10px] text-amber-700 font-semibold leading-relaxed">${stepWarn}</p>
        </div>` : ''}` : ''}
      </div>
    </label>`;
}

/* ---- localStorage ---- */
function getChecked() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
