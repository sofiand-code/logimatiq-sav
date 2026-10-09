/* ============================================================================
   FAULTS DATA — Pannes récurrentes EPIMAT
   severity : 'critical' | 'high' | 'normal'
   step.photo : true = badge "📷 Photo à venir"
   step.debes : true = badge "🖥 DEBES"
   step.sav   : true = badge "📞 SAV"
   ========================================================================== */

export const FAULTS_CATEGORIES = [
  {
    id: 'alimentation',
    label: 'Alimentation',
    label_en: 'Power',
    color: '#DC2626',
    bg: '#FEF2F2',
    icon: `<path stroke-linecap="round" stroke-linejoin="round"
             d="M13 10V3L4 14h7v7l9-11h-7z"/>`,
  },
  {
    id: 'tambour',
    label: 'Tambour',
    label_en: 'Drum',
    color: '#0F4C81',
    bg: '#EFF5FB',
    icon: `<path stroke-linecap="round" stroke-linejoin="round"
             d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581
                m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"/>`,
  },
  {
    id: 'trappe',
    label: 'Trappe',
    label_en: 'Hatch',
    color: '#D97706',
    bg: '#FFFBEB',
    icon: `<path stroke-linecap="round" stroke-linejoin="round"
             d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16 2.286 6.857L21 12l-5.714 2.143L13 21
                l-2.286-6.857L5 12l5.714-2.143L13 3z"/>`,
  },
  {
    id: 'moteur',
    label: 'Moteur',
    label_en: 'Motor',
    color: '#059669',
    bg: '#ECFDF5',
    icon: `<path stroke-linecap="round" stroke-linejoin="round"
             d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066
                c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426
                1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37
                2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724
                1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0
                0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573
                c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
           <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>`,
  },
  {
    id: 'logiciel',
    label: 'PC / Logiciel',
    label_en: 'PC / Software',
    color: '#7C3AED',
    bg: '#F5F3FF',
    icon: `<rect x="2" y="3" width="20" height="14" rx="2"/>
           <path stroke-linecap="round" d="M8 21h8M12 17v4"/>`,
  },
  {
    id: 'badge',
    label: 'Badge',
    label_en: 'Badge',
    color: '#0891B2',
    bg: '#ECFEFF',
    icon: `<path stroke-linecap="round" stroke-linejoin="round"
             d="M10 6H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0
                0-2-2h-5m-4 0V5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2v1m-4 0h4"/>`,
  },
];

export const FAULTS = [

  /* ============================= ALIMENTATION ============================= */
  {
    id: 'f_no_power',
    category: 'alimentation',
    title: 'Plus de courant — machine complètement éteinte',
    title_en: 'No power — machine completely off',
    severity: 'critical',
    diag: 't.epimat.alim',
    symptoms: [
      'Aucun voyant allumé, écran noir',
      'Machine ne répond à rien',
    ],
    symptoms_en: [
      'No indicator lit, black screen',
      'Machine does not respond at all',
    ],
    steps: [
      { text: 'Vérifier que la prise du local a du courant (tester avec un autre appareil) ; sinon, réarmer le disjoncteur du local', text_en: "Check that the room's wall outlet has power (test with another device); if not, reset the room's circuit breaker" },
      { text: 'Vérifier le câble secteur de la machine (il sort en bas), côté machine et côté prise', text_en: "Check the machine's mains cable (it comes out at the bottom), on the machine side and on the outlet side" },
      { text: "Ouvrir la façade et coulisser la platine du tableau électrique : l'interrupteur général rouge O / I (sans voyant), à côté du porte-fusible, doit être sur I", text_en: 'Open the front and slide the electrical panel plate forward: the red O / I main switch (no indicator light), next to the fuse holder, must be on I' },
      { text: "Sur l'alimentation générale (en haut de la platine), réarmer un coupe-circuit 24 V (3 A) ou 5 V (1 A) sorti ; s'il redéclenche aussitôt, ne pas insister : SAV", text_en: 'On the main power supply (top of the plate), reset a 24 V (3 A) or 5 V (1 A) circuit breaker that has popped out; if it trips again immediately, do not insist: Support' },
      { text: 'Débrancher la machine, puis contrôler le fusible du porte-fusible (cache noir, tournevis plat) : 4 A minimum, 5 A maximum', text_en: 'Unplug the machine, then check the fuse in the fuse holder (black cover, flat screwdriver): 4 A minimum, 5 A maximum' },
      { text: "Toujours éteinte : l'alimentation générale est à changer (SAV)", text_en: 'Still off: the main power supply must be replaced (Support)' },
    ],
    sav: true,
  },
  {
    id: 'f_disjoncteur',
    category: 'alimentation',
    title: 'Écran affiche "Disjoncteur déclenché"',
    title_en: 'Screen shows "Circuit breaker tripped"',
    severity: 'critical',
    symptoms: [
      "Message « Disjoncteur déclenché » sur l'écran tactile",
      'Machine allumée mais le tambour ne tourne plus',
    ],
    symptoms_en: [
      'Message "Disjoncteur déclenché" (circuit breaker tripped) on the touchscreen',
      'Machine on but the drum no longer turns',
    ],
    steps: [
      { text: "Ouvrir la façade et coulisser la platine du tableau électrique vers l'avant", text_en: 'Open the front and slide the electrical panel plate forward' },
      { text: "Sur l'alimentation générale, réarmer le coupe-circuit 24 V (3 A) : c'est le « disjoncteur tambour » des manuels", text_en: 'On the main power supply, reset the 24 V (3 A) circuit breaker: it is the "drum circuit breaker" of the manuals' },
      { text: "S'il redéclenche aussitôt : court-circuit ou blocage probable, ne pas insister, appeler le SAV", text_en: 'If it trips again immediately: probable short circuit or jam, do not insist, call Support' },
      { text: 'Faire faire un tour complet au tambour avec le bouton « Drum rotation » pour recaler les EPI — mains hors de la machine pendant la rotation', text_en: 'Turn the drum one full revolution with the "Drum rotation" button to realign the items — hands out of the machine during rotation' },
    ],
    sav: true,
  },
  {
    id: 'f_fusible',
    category: 'alimentation',
    title: 'Fusible grillé',
    title_en: 'Blown fuse',
    severity: 'high',
    diag: 't.epimat.alim',
    symptoms: [
      'Machine éteinte alors que la prise du local a du courant',
      'Multiprise intérieure éteinte (voyant rouge éteint) avec l\'interrupteur général sur I',
    ],
    symptoms_en: [
      "Machine off although the room's wall outlet has power",
      'Internal power strip off (red indicator off) with the main switch on I',
    ],
    steps: [
      { text: 'Débrancher la prise de la machine', text_en: 'Unplug the machine' },
      { text: "Sur l'alimentation générale, sortir le porte-fusible (cache noir) avec un tournevis plat", text_en: 'On the main power supply, pull out the fuse holder (black cover) with a flat screwdriver' },
      { text: "Contrôler le fusible ; s'il est grillé, le remplacer : 4 A minimum, 5 A maximum", text_en: 'Check the fuse; if it is blown, replace it: 4 A minimum, 5 A maximum' },
      { text: 'Remettre le porte-fusible, rebrancher la prise et vérifier que la machine s\'allume', text_en: 'Put the fuse holder back, plug the machine in and check that it turns on' },
    ],
    sav: false,
  },

  /* ============================== TAMBOUR ================================ */
  {
    id: 'f_tambour_tourne_pas',
    category: 'tambour',
    title: 'Tambour ne tourne pas du tout',
    title_en: 'Drum does not rotate at all',
    severity: 'critical',
    diag: 't.epimat.tambour',
    symptoms: [
      'Écran « EN PANNE »',
      'Le tambour ne tourne plus pendant une distribution',
    ],
    symptoms_en: [
      '"EN PANNE" (out of order) screen',
      'The drum no longer turns during a dispensing',
    ],
    steps: [
      { text: 'Tester le bouton « Drum rotation » (en haut du châssis, à l\'avant droit) — mains hors de la machine pendant la rotation', text_en: 'Test the "Drum rotation" button (top of the frame, front right) — hands out of the machine during rotation' },
      { text: 'Il ne tourne pas : réarmer le coupe-circuit 24 V de l\'alimentation générale (le « disjoncteur tambour »), puis faire un tour complet ; s\'il redéclenche aussitôt → SAV', text_en: 'It does not turn: reset the 24 V circuit breaker of the main power supply (the "drum circuit breaker"), then do a full revolution; if it trips again immediately → Support' },
      { text: 'Il tourne : vérifier que toutes les trappes sont bien fermées', text_en: 'It turns: check that all hatches are properly closed' },
      { text: 'Vérifier le câble SCSI blanc (PC ↔ carte EPI 01), à chaud : bien enfoncé des deux côtés, au besoin le débrancher complètement et le remettre', text_en: 'Check the white SCSI cable (PC ↔ EPI 01 board), with the machine on: fully seated at both ends, unplug it completely and plug it back in if needed' },
      { text: 'Puis DEBES (DistEPI fermé avec Maj + F) : voyants FCPF et « Sécu tambour OK »', text_en: 'Then DEBES (DistEPI closed with Shift + F): FCPF and "Sécu tambour OK" (drum safety OK) indicators', debes: true },
    ],
    sav: true,
  },
  {
    id: 'f_tambour_mauvaise_position',
    category: 'tambour',
    title: 'Tambour en mauvaise position / colonne erronée',
    title_en: 'Drum in wrong position / wrong column',
    severity: 'high',
    diag: 't.epimat.tambour',
    symptoms: [
      'Distribution sur la mauvaise colonne',
      'Le tambour dépasse la colonne ou s\'arrête décalé',
    ],
    symptoms_en: [
      'Dispensing from the wrong column',
      'The drum overshoots the column or stops off-position',
    ],
    steps: [
      { text: 'Dans DEBES, lire « Position Colonne » : capteurs CPT1 à CPT6, voyant éteint = trou = bit à 1 (CPT1 = 1, CPT2 = 2, CPT3 = 4, CPT4 = 8, CPT5 = 16, CPT6 = 32)', text_en: 'In DEBES, read "Position Colonne" (column position): sensors CPT1 to CPT6, indicator off = hole = bit set to 1 (CPT1 = 1, CPT2 = 2, CPT3 = 4, CPT4 = 8, CPT5 = 16, CPT6 = 32)', debes: true },
      { text: 'Position fausse : vérifier d\'abord le câble SCSI (PC ↔ carte EPI 01)', text_en: 'Wrong position: first check the SCSI cable (PC ↔ EPI 01 board)' },
      { text: 'Puis nettoyer le disque au pinceau et vérifier l\'alignement des circuits LOG 03 / LOG 04', text_en: 'Then clean the disc with a brush and check the alignment of the LOG 03 / LOG 04 circuits' },
      { text: 'Arrêt décalé : régler la vitesse lente (potentiomètre bleu de la carte GR76, un quart de tour à la fois)', text_en: 'Off-position stop: adjust the low speed (blue potentiometer of the GR76 board, a quarter turn at a time)' },
      { text: 'Pas de recalibrage à faire : au lancement de DistEPI, le tambour s\'initialise seul (capteur CP1)', text_en: 'No recalibration needed: when DistEPI starts, the drum initializes by itself (CP1 sensor)' },
    ],
    sav: false,
  },
  {
    id: 'f_tambour_bloque',
    category: 'tambour',
    title: 'Tambour bloqué / coincé mécaniquement',
    title_en: 'Drum jammed / mechanically stuck',
    severity: 'critical',
    diag: 't.epimat.tambour',
    symptoms: [
      'Un article ou un objet bloque le tambour',
      'Le coupe-circuit 24 V a déclenché',
    ],
    symptoms_en: [
      'An item or an object is jamming the drum',
      'The 24 V circuit breaker has tripped',
    ],
    steps: [
      { text: 'Retirer l\'article ou l\'objet coincé', text_en: 'Remove the jammed item or object' },
      { text: 'Réarmer le coupe-circuit 24 V de l\'alimentation générale s\'il a déclenché', text_en: 'Reset the 24 V circuit breaker of the main power supply if it has tripped' },
      { text: 'Faire un tour complet avec le bouton « Drum rotation » pour recaler les EPI — mains hors de la machine', text_en: 'Do a full revolution with the "Drum rotation" button to realign the items — hands out of the machine' },
      { text: 'Faire une distribution test', text_en: 'Run a test dispensing' },
    ],
    sav: true,
  },

  /* ============================== TRAPPE ================================= */
  {
    id: 'f_trappe_ouvre_pas',
    category: 'trappe',
    title: 'Trappe ne s\'ouvre pas',
    title_en: 'Hatch does not open',
    severity: 'critical',
    diag: 't.epimat.trappe',
    symptoms: [
      'La LED de la trappe s\'allume mais la trappe reste bloquée',
      'L\'employé ne reçoit pas l\'article',
    ],
    symptoms_en: [
      'The hatch LED lights up but the hatch stays locked',
      'The employee does not receive the item',
    ],
    steps: [
      { text: 'Dans DEBES (DistEPI fermé avec Maj + F) : « Trappe N Ouvrir » puis « N Fermer » ; même test sur l\'EPIMAT 14 (portes)', text_en: 'In DEBES (DistEPI closed with Shift + F): "Trappe N Ouvrir" (open hatch N) then "N Fermer" (close N); same test on the EPIMAT 14 (doors)', debes: true },
      { text: 'Elle ne bouge pas : vérifier le câble SCSI (PC ↔ carte EPI 01)', text_en: 'It does not move: check the SCSI cable (PC ↔ EPI 01 board)' },
      { text: 'EPIMAT 13 : trappe à moteur → connecteur MOTOR et pignon / crémaillère ; trappe manuelle → connecteur LOCK (électro-aimant), sur la carte EPI 05', text_en: 'EPIMAT 13: motorized hatch → MOTOR connector and pinion / rack; manual hatch → LOCK connector (electromagnet), on the EPI 05 board' },
      { text: 'EPIMAT 14 (portes à gâche, cartes EPI 02) : SAV', text_en: 'EPIMAT 14 (latch doors, EPI 02 boards): Support' },
      { text: 'Toujours bloquée : condamner la trappe dans DistEPI pour continuer à utiliser la machine, puis SAV', text_en: 'Still locked: disable the hatch in DistEPI to keep using the machine, then Support' },
    ],
    sav: true,
  },
  {
    id: 'f_fermer_trappe',
    category: 'trappe',
    title: 'Écran affiche "Fermer la trappe"',
    title_en: 'Screen shows "Fermer la trappe" (close the hatch)',
    severity: 'high',
    diag: 't.epimat.trappe',
    symptoms: [
      'Message « Fermer la trappe » à l\'écran',
      'La trappe semble pourtant fermée',
    ],
    symptoms_en: [
      '"Fermer la trappe" (close the hatch) message on the screen',
      'The hatch nevertheless looks closed',
    ],
    steps: [
      { text: 'Vérifier qu\'aucun article n\'empêche la fermeture, puis refermer la trappe', text_en: 'Check that no item prevents it from closing, then close the hatch' },
      { text: 'Dans DEBES, le voyant FCPF de cette trappe doit s\'allumer quand on la ferme à la main', text_en: 'In DEBES, the FCPF indicator of this hatch must light up when you close it by hand', debes: true },
      { text: 'Il reste éteint : vérifier le câble SCSI (PC ↔ carte EPI 01)', text_en: 'It stays off: check the SCSI cable (PC ↔ EPI 01 board)' },
      { text: 'Toujours éteint : EPIMAT 13 → changer la carte EPI 05 (reprendre ses cavaliers et switches) ; EPIMAT 14 → SAV', text_en: 'Still off: EPIMAT 13 → replace the EPI 05 board (copy its jumpers and switches); EPIMAT 14 → Support' },
    ],
    sav: false,
  },
  {
    id: 'f_pb_distribution',
    category: 'trappe',
    title: 'Écran affiche "Problème de distribution"',
    title_en: 'Screen shows "Problème de distribution" (dispensing problem)',
    severity: 'high',
    diag: 't.epimat.trappe',
    symptoms: [
      'Message « Problème de distribution » après validation d\'un EPI',
      'Article non distribué',
    ],
    symptoms_en: [
      '"Problème de distribution" (dispensing problem) message after an item is confirmed',
      'Item not dispensed',
    ],
    steps: [
      { text: 'Noter le numéro de la trappe (trappe 1 = en bas) et la tester dans DEBES', text_en: 'Note the hatch number (hatch 1 = bottom) and test it in DEBES', debes: true },
      { text: 'Elle s\'ouvre et se ferme : vérifier qu\'aucun article ne la gêne et refaire une distribution', text_en: 'It opens and closes: check that no item is in the way and dispense again' },
      { text: 'Elle ne s\'ouvre pas : voir la fiche « Trappe ne s\'ouvre pas »', text_en: 'It does not open: see the "Hatch does not open" sheet' },
      { text: 'Casier vide : corriger le stock (badge de maintenance → Vider / Remplir) ; si ça se reproduit, vérifier la position du tambour', text_en: 'Empty compartment: correct the stock (maintenance badge → "Vider / Remplir" (Empty / Fill)); if it happens again, check the drum position' },
    ],
    sav: false,
  },

  /* ============================== MOTEUR ================================= */
  {
    id: 'f_vitesse_lente',
    category: 'moteur',
    title: 'Tambour qui dépasse la colonne ou s\'arrête décalé',
    title_en: 'Drum overshoots the column or stops off-position',
    severity: 'high',
    diag: 't.epimat.tambour',
    symptoms: [
      'Le tambour s\'arrête à côté de la colonne',
      'Il dépasse la colonne demandée',
    ],
    symptoms_en: [
      'The drum stops next to the column',
      'It overshoots the requested column',
    ],
    steps: [
      { text: 'Sur le tableau électrique, carte GR76 (dissipateur noir ; « GR 74 » sur les anciennes photos, même carte)', text_en: 'On the electrical panel, GR76 board (black heat sink; "GR 74" on old photos, same board)' },
      { text: 'Potentiomètre bleu : sens horaire = plus lent, antihoraire = plus rapide ; un quart de tour entre chaque test', text_en: 'Blue potentiometer: clockwise = slower, counterclockwise = faster; a quarter turn between each test' },
      { text: 'Tester dans DEBES avec « Vitesse Lente TAMBOUR » et « Rotation TAMBOUR » — mains hors de la machine', text_en: 'Test in DEBES with "Vitesse Lente TAMBOUR" (drum low speed) and "Rotation TAMBOUR" (drum rotation) — hands out of the machine', debes: true },
      { text: 'Toujours décalé : nettoyer le disque au pinceau et vérifier l\'alignement LOG 03 / LOG 04', text_en: 'Still off-position: clean the disc with a brush and check the LOG 03 / LOG 04 alignment' },
    ],
    sav: false,
  },
  {
    id: 'f_moteur_hs',
    category: 'moteur',
    title: 'Moteur du tambour sans réponse',
    title_en: 'Drum motor not responding',
    severity: 'critical',
    diag: 't.epimat.tambour',
    symptoms: [
      'Le bouton « Drum rotation » est sans effet',
      'Même après réarmement du coupe-circuit 24 V',
    ],
    symptoms_en: [
      'The "Drum rotation" button has no effect',
      'Even after resetting the 24 V circuit breaker',
    ],
    steps: [
      { text: 'Vérifier que la machine est sous tension (sinon : fiche « Plus de courant »)', text_en: 'Check that the machine is powered (otherwise: "No power" sheet)' },
      { text: 'Réarmer le coupe-circuit 24 V de l\'alimentation générale ; s\'il redéclenche aussitôt, ne pas insister', text_en: 'Reset the 24 V circuit breaker of the main power supply; if it trips again immediately, do not insist' },
      { text: 'Toujours rien : SAV (coupe-circuit 24 V, moteur M1, carte de rotation EPI RT, carte GR76)', text_en: 'Still nothing: Support (24 V circuit breaker, M1 motor, EPI RT rotation board, GR76 board)' },
    ],
    sav: true,
  },

  /* ============================ PC / LOGICIEL ============================ */
  {
    id: 'f_ecran_en_panne',
    category: 'logiciel',
    title: 'Écran affiche "En panne"',
    title_en: 'Screen shows "EN PANNE" (out of order)',
    severity: 'critical',
    diag: 't.epimat.tambour',
    symptoms: [
      'Message « EN PANNE » bloquant',
      'Machine hors service, impossible de distribuer',
    ],
    symptoms_en: [
      'Blocking "EN PANNE" (out of order) message',
      'Machine out of service, cannot dispense',
    ],
    steps: [
      { text: '« EN PANNE » vient presque toujours du tambour : suivre le diagnostic Tambour', text_en: '"EN PANNE" almost always comes from the drum: follow the Drum diagnostic' },
      { text: 'Tester le bouton « Drum rotation » ; s\'il ne tourne pas, réarmer le coupe-circuit 24 V', text_en: 'Test the "Drum rotation" button; if it does not turn, reset the 24 V circuit breaker' },
      { text: 'S\'il tourne : trappes fermées, puis câble SCSI (PC ↔ carte EPI 01), puis DEBES', text_en: 'If it turns: hatches closed, then SCSI cable (PC ↔ EPI 01 board), then DEBES' },
    ],
    sav: true,
  },
  {
    id: 'f_distepi_crash',
    category: 'logiciel',
    title: 'DistEPI plante ou ne démarre pas',
    title_en: 'DistEPI crashes or won\'t start',
    severity: 'high',
    symptoms: [
      'Le logiciel se ferme ou se bloque',
      'Bureau Windows visible au lieu de DistEPI',
    ],
    symptoms_en: [
      'The software closes or freezes',
      'Windows desktop visible instead of DistEPI',
    ],
    steps: [
      { text: 'Fermer DistEPI (Maj + F, clavier branché), puis le relancer : icône du bureau ou C:\\EPI\\DistEPI.exe', text_en: 'Close DistEPI (Shift + F, keyboard plugged in), then restart it: desktop icon or C:\\EPI\\DistEPI.exe' },
      { text: 'Toujours en défaut : redémarrer le distributeur (Démarrer → Arrêter → Redémarrer)', text_en: 'Still faulty: restart the dispenser (Start → Shut down → Restart)' },
      { text: 'Toujours en défaut après redémarrage : contacter le SAV Logimatiq', text_en: 'Still faulty after the restart: contact Logimatiq Support' },
    ],
    sav: true,
  },
  {
    id: 'f_cable_scsi',
    category: 'logiciel',
    title: 'Câble SCSI mal enfoncé',
    title_en: 'SCSI cable not fully seated',
    severity: 'high',
    diag: 't.epimat.tambour',
    symptoms: [
      'Certains capteurs s\'allument dans DEBES et d\'autres non',
      'Tout semble bon mais le tambour ne tourne pas',
      'Petites pannes bizarres et intermittentes',
    ],
    symptoms_en: [
      'Some sensors light up in DEBES and others do not',
      'Everything looks fine but the drum does not turn',
      'Small strange, intermittent faults',
    ],
    steps: [
      { text: 'C\'est presque le premier contrôle à faire quand le PC communique mal avec la machine', text_en: 'It is almost the first check to do when the PC communicates poorly with the machine' },
      { text: 'Repérer le câble SCSI blanc entre le PC (carte Advantech) et la carte EPI 01 du tableau électrique', text_en: 'Find the white SCSI cable between the PC (Advantech board) and the EPI 01 board of the electrical panel' },
      { text: 'Vérifier qu\'il est bien enfoncé des deux côtés ; au besoin, le débrancher complètement et le remettre — pas besoin d\'éteindre', text_en: 'Check that it is fully seated at both ends; if needed, unplug it completely and plug it back in — no need to switch off' },
      { text: 'DEBES, case STATUS : « NoDevice … - OK » ; sinon, corriger le numéro de la carte Advantech dans C:\\EPI\\AUTOMAT.INI', text_en: 'DEBES, STATUS box: "NoDevice … - OK"; otherwise, correct the Advantech board number in C:\\EPI\\AUTOMAT.INI', debes: true },
    ],
    sav: false,
  },

  /* =============================== BADGE ================================= */
  {
    id: 'f_badge_non_lu',
    category: 'badge',
    title: 'Badge non reconnu / pas de réaction',
    title_en: 'Badge not recognized / no reaction',
    severity: 'high',
    diag: 't.epimat.badge',
    symptoms: [
      'Aucune réaction quand le badge est présenté',
      'LED du lecteur éteinte, ou bip sans réaction à l\'écran',
    ],
    symptoms_en: [
      'No reaction when the badge is presented',
      'Reader LED off, or a beep with no reaction on screen',
    ],
    steps: [
      { text: 'LED du lecteur éteinte : vérifier que le PC est allumé, puis débrancher / rebrancher l\'USB du lecteur, puis essayer un autre port USB', text_en: "Reader LED off: check that the PC is on, then unplug / replug the reader's USB cable, then try another USB port" },
      { text: 'Bip mais rien à l\'écran : redémarrer le distributeur', text_en: 'Beep but nothing on screen: restart the dispenser' },
      { text: 'Aucune réaction : essayer un autre badge (un badge qui n\'a jamais marché peut demander de reprogrammer le lecteur pour son type, MIFARE…)', text_en: 'No reaction: try another badge (a badge that never worked may require reprogramming the reader for its type, MIFARE…)' },
      { text: 'Aucun badge lu : test Bloc-notes, clavier Windows en anglais ; rien ne s\'affiche → reprogrammer le lecteur (SAV)', text_en: 'No badge read: Notepad test, Windows keyboard in English; nothing appears → reprogram the reader (Support)' },
    ],
    sav: false,
  },
  {
    id: 'f_badge_mauvais_numero',
    category: 'badge',
    title: 'Badge lu mais mauvais numéro affiché',
    title_en: 'Badge read but wrong number displayed',
    severity: 'normal',
    diag: 't.epimat.badge',
    symptoms: [
      'Badge présenté → numéro différent de celui imprimé',
      'Salarié refusé ou mauvais nom',
    ],
    symptoms_en: [
      'Badge presented → number different from the one printed',
      'Employee refused or wrong name',
    ],
    steps: [
      { text: 'Lancer une synchronisation : clavier branché, Maj + L, bouton « Synchroniser » (LED Online du modem bleue fixe)', text_en: 'Run a synchronization: keyboard plugged in, Shift + L, "Synchroniser" (Synchronize) button (modem Online LED steady blue)' },
      { text: 'Passer le badge : comparer le numéro affiché en haut de l\'écran de DistEPI avec celui imprimé sur le badge', text_en: 'Present the badge: compare the number displayed at the top of the DistEPI screen with the one printed on the badge' },
      { text: 'Même numéro → corriger le numéro de badge du salarié dans l\'extranet (Salariés → fiche), puis synchroniser', text_en: "Same number → correct the employee's badge number in the extranet (Salariés → record), then synchronize" },
      { text: 'Numéro différent → reprogrammer le lecteur de badge (SAV)', text_en: 'Different number → reprogram the badge reader (Support)' },
    ],
    sav: false,
  },
];
