/* ============================================================================
   FICHES D'INTERVENTION — remplacement de pièces EPIMAT (onglet Fiches)
   Chaque texte est une paire { fr, en } ; npm run check-trees vérifie qu'aucune
   traduction ne manque et que chaque image existe dans public/.
   `solutions` : conclusions des arbres qui ouvrent cette fiche (« Voir la fiche »).
   Sources (non affichées) : FI = fiches d'intervention Logimatiq (juillet 2026),
   D24 = doc maintenance 2024, MF12 = manuel maintenance 2012, E17 = kit écran 17",
   REP = réponses de l'équipe Logimatiq (octobre 2026).
   Jamais d'identifiant (mot de passe du modem…) ni de prix ici : dépôt public.
   ========================================================================== */

const L = (fr, en) => ({ fr, en });
const IMG = (file, fr, en) => ({ file, fr, en });

export const FICHE_FAMILIES = {
  pc:     { label: L('PC', 'PC'),                       color: '#7C3AED', bg: '#F5F3FF' },
  ecran:  { label: L('Écran', 'Screen'),                color: '#0F4C81', bg: '#EFF5FB' },
  badge:  { label: L('Badge', 'Badge'),                 color: '#D97706', bg: '#FFFBEB' },
  modem:  { label: L('Modem', 'Modem'),                 color: '#059669', bg: '#ECFDF5' },
  trappe: { label: L('Trappe', 'Hatch'),                color: '#C2410C', bg: '#FFF7ED' },
  alim:   { label: L('Alimentation', 'Power'),          color: '#DC2626', bg: '#FEF2F2' },
  cartes: { label: L('Cartes', 'Boards'),               color: '#0891B2', bg: '#ECFEFF' },
  annexe: { label: L('Références', 'References'),       color: '#475569', bg: '#F1F5F9' },
};

const VALIDER = L('À valider avec Logimatiq', 'To confirm with Logimatiq');
const HOTLINE = L(
  "L'intervention se fait en liaison téléphonique avec le SAV Logimatiq, qui désigne la pièce et valide chaque geste.",
  'The work is done on the phone with Logimatiq Support, who identifies the part and approves each step.');

export const FICHES = [
  {
    id: 'pc', family: 'pc', src: ['FI', 'D24 p.10', 'REP'], solutions: ['sol_changer_pc'],
    title: L('Remplacement du PC', 'Replacing the PC'),
    subtitle: L('PC en bas du châssis, façade ouverte', 'PC at the bottom of the frame, front open'),
    media: [IMG('arbres/pc_emplacement.jpg', 'Le PC est dans le compartiment du bas (entouré en rouge)', 'The PC is in the bottom compartment (circled in red)')],
    blocks: [
      { kind: 'list', title: L('Repères', 'Landmarks'), items: [
        L('Câbles du PC : alimentation, VGA (écran), USB (lecteur de badge et écran tactile), câble SCSI blanc (carte Advantech), Ethernet vers le modem', 'PC cables: power, VGA (screen), USB (badge reader and touchscreen), white SCSI cable (Advantech board), Ethernet to the modem'),
        L('Le câble SCSI blanc est fragile : broches à ne pas plier', 'The white SCSI cable is fragile: do not bend the pins'),
      ] },
      { kind: 'steps', title: L('Dépose', 'Removal'), items: [
        L("Couper l'alimentation : interrupteur général rouge O / I sur O (sans voyant, à côté du porte-fusible), ou débrancher la prise", 'Switch off the power: red O / I main switch to O (no indicator, next to the fuse holder), or unplug the machine'),
        L('Débrancher tous les câbles : alimentation, VGA, USB (badge, écran tactile), SCSI blanc, Ethernet du modem', 'Unplug all the cables: power, VGA, USB (badge, touchscreen), white SCSI, modem Ethernet'),
        L('Sortir le PC de son logement en partie basse', 'Take the PC out of its housing at the bottom'),
      ] },
      { kind: 'steps', title: L('Repose', 'Refitting'), items: [
        L('Installer le PC fourni et rebrancher tous les câbles ; vérifier que le SCSI blanc est bien enfoncé (broches non pliées)', 'Install the supplied PC and plug all the cables back in; check that the white SCSI cable is fully seated (pins not bent)'),
        L("Switch arrière sur ON, puis bouton Power : Windows démarre et DistEPI se lance tout seul (sinon C:\\EPI\\DistEPI.exe)", 'Rear switch to ON, then the Power button: Windows starts and DistEPI launches by itself (otherwise C:\\EPI\\DistEPI.exe)'),
        L('Vérifier le bon fonctionnement avec DEBES, puis faire une distribution test', 'Check that everything works with DEBES, then run a test dispensing'),
      ] },
      { kind: 'check', title: VALIDER, items: [L('Test de distribution avec Logimatiq', 'Test dispensing with Logimatiq')] },
    ],
  },
  {
    id: 'ecran', family: 'ecran', src: ['D24 p.3', 'E17', 'REP'], solutions: ['sol_changer_ecran'],
    title: L("Remplacement de l'écran", 'Replacing the screen'),
    subtitle: L('Écran tactile 17 pouces (kit extérieur)', '17-inch touchscreen (external kit)'),
    media: [IMG('arbres/ecran_cables.jpg', "Derrière l'écran : arrivée des câbles USB, alimentation et VGA", 'Behind the screen: USB, power and VGA cable connections')],
    blocks: [
      { kind: 'steps', title: L('Dépose', 'Removal'), items: [
        L('Retirer la plaque protectrice', 'Remove the protective plate'),
        L("Débrancher les 3 câbles au dos de l'écran : USB (tactile), alimentation, VGA", 'Unplug the 3 cables at the back of the screen: USB (touch), power, VGA'),
        L("Dévisser l'écran (fixé sur les goujons M4)", 'Unscrew the screen (fixed on the M4 studs)'),
      ] },
      { kind: 'steps', title: L('Repose', 'Refitting'), items: [
        L('Fixer le nouvel écran, rebrancher USB, alimentation et VGA (vis moletées serrées)', 'Fix the new screen, plug USB, power and VGA back in (thumbscrews tightened)'),
        L("L'écran 17 pouces s'allume tout seul : vérifier le voyant « Power Led » au dos (vert = image)", 'The 17-inch screen turns on by itself: check the "Power Led" indicator at the back (green = image)'),
        L('Résolution : 1280 × 720 pour le 17 pouces (800 × 600 pour un écran 8 pouces)', 'Resolution: 1280 × 720 for the 17-inch screen (800 × 600 for an 8-inch screen)'),
      ] },
      { kind: 'check', title: VALIDER, items: [L("Tester le tactile dans DistEPI", 'Test touch input in DistEPI')] },
    ],
  },
  {
    id: 'lecteur', family: 'badge', src: ['D24 p.8', 'REP'], solutions: ['sol_changer_lecteur'],
    title: L('Remplacement du lecteur de badge', 'Replacing the badge reader'),
    subtitle: L('Lecteur USB Elatec TWN4, sur la façade', 'Elatec TWN4 USB reader, on the front'),
    media: [IMG('arbres/lecteur_remplacement.jpg', "Le lecteur vu de l'intérieur de la porte (entouré en orange)", 'The reader seen from inside the door (circled in orange)')],
    blocks: [
      { kind: 'steps', title: L('Remplacement', 'Replacement'), items: [
        L("Débrancher le câble du lecteur et le démonter de la façade", 'Unplug the reader cable and remove the reader from the front'),
        L('Reporter la connectique sur le nouveau lecteur, le fixer et le rebrancher en USB', 'Move the connector over to the new reader, fix it and plug it back in via USB'),
        L("Passer un badge : le lecteur doit biper", 'Present a badge: the reader must beep'),
        L("S'il ne lit pas ce type de badge : le reprogrammer avec AppBlaster (arbre Badge, « Reprogrammer le lecteur »)", 'If it does not read this type of badge: reprogram it with AppBlaster (Badge tree, "Reprogram the reader")'),
      ] },
      { kind: 'check', title: VALIDER, items: [L('Badge reconnu dans DistEPI', 'Badge recognized in DistEPI')] },
    ],
  },
  {
    id: 'modem', family: 'modem', src: ['FI', 'D24 p.4', 'REP'], solutions: ['sol_changer_modem'],
    title: L('Remplacement du modem GSM', 'Replacing the GSM modem'),
    subtitle: L('Routeur 4G Four-Faith, collé au tableau', 'Four-Faith 4G router, stuck to the panel'),
    media: [
      IMG('arbres/modem_emplacement.jpg', 'Emplacement du modem dans la machine (entouré en rouge)', 'Location of the modem in the machine (circled in red)'),
      IMG('arbres/modem_connecteurs.jpg', 'Connecteurs : 2 antennes, alimentation (PWR), RJ45 du PC sur ETH', 'Connectors: 2 antennas, power (PWR), RJ45 from the PC on ETH'),
    ],
    blocks: [
      { kind: 'list', title: L('Repères', 'Landmarks'), items: [
        L('4 câbles : 2 antennes vissées, 1 alimentation (jack rond, pas d\'interrupteur), 1 RJ45 vers le PC', '4 cables: 2 screwed antennas, 1 power (round jack, no switch), 1 RJ45 to the PC'),
        L('Voyants : PWR bleu fixe = alimenté ; SIM = carte détectée ; Online bleu fixe = internet ; ETH clignote = échange avec le PC', 'Indicators: PWR steady blue = powered; SIM = card detected; Online steady blue = internet; ETH blinking = traffic with the PC'),
      ] },
      { kind: 'steps', title: L('Remplacement', 'Replacement'), items: [
        L("Avant tout : relever l'APN du modem en place (navigateur du PC → 192.168.1.1 → Setup), même s'il n'a plus internet", 'First of all: note the APN of the current modem (PC browser → 192.168.1.1 → Setup), even if it has no internet'),
        L('Débrancher les 4 câbles', 'Unplug the 4 cables'),
        L("Décoller l'ancien modem du scratch (il faut forcer) et récupérer la carte SIM", 'Unstick the old modem from the hook-and-loop pad (it takes some force) and recover the SIM card'),
        L('Insérer la SIM dans le nouveau modem, le coller, rebrancher 2 antennes, alimentation et RJ45', 'Insert the SIM into the new modem, stick it on, plug 2 antennas, power and RJ45 back in'),
        L("Mettre sous tension et contrôler les voyants ; si Online ne s'allume pas sous 2 minutes : configurer l'APN (fiche suivante), avec le même APN si la SIM n'a pas changé", 'Power on and check the indicators; if Online does not light up within 2 minutes: configure the APN (next sheet), with the same APN if the SIM has not changed'),
      ] },
      { kind: 'check', title: VALIDER, items: [
        L('SIM à réutiliser ou à remplacer', 'SIM to reuse or replace'),
        L("APN et remontée de la synchronisation dans l'extranet", 'APN and synchronization showing in the extranet'),
      ] },
    ],
  },
  {
    id: 'sim', family: 'modem', src: ['FI', 'SIM', 'REP'], solutions: [],
    title: L('Remplacement de la carte SIM', 'Replacing the SIM card'),
    subtitle: L('Modem alimentation coupée', 'Modem power off'),
    media: [
      IMG('sortir_la_sim_du_modem.png', "Faire sortir la SIM avec une pointe dans le trou d'éjection", 'Push the SIM out with a pointed tool in the ejection hole'),
      IMG('sens_insertion_sim.png', "Voyants du modem et sens d'insertion de la SIM", 'Modem indicators and SIM insertion direction'),
    ],
    blocks: [
      { kind: 'warn', title: L('Sécurité', 'Safety'), items: [L("Toujours couper l'alimentation du modem avant de retirer ou d'insérer la SIM (sinon elle peut ne pas être détectée)", 'Always switch the modem power off before removing or inserting the SIM (otherwise it may not be detected)')] },
      { kind: 'steps', title: L('Remplacement', 'Replacement'), items: [
        L("Débrancher le jack d'alimentation du modem", "Unplug the modem's power jack"),
        L("Éjecter la SIM avec un stylo ou une pointe", 'Eject the SIM with a pen or a pointed tool'),
        L("Insérer la nouvelle SIM dans le bon sens (encoche)", 'Insert the new SIM the right way round (notch)'),
        L('Rebrancher, vérifier le voyant SIM, puis Online', 'Plug back in, check the SIM indicator, then Online'),
      ] },
      { kind: 'check', title: VALIDER, items: [L("Nouvelle SIM : demander son APN au SAV", 'New SIM: ask Support for its APN')] },
    ],
  },
  {
    id: 'apn', family: 'modem', src: ['FI', 'SIM p.8-10', 'REP'], solutions: [],
    title: L("Configuration de l'APN", 'Configuring the APN'),
    subtitle: L('Après un changement de modem ou de SIM', 'After changing the modem or the SIM'),
    media: [
      IMG('arbres/routeur_apn.jpg', "Programme Logimatiq : choisir l'APN dans la liste", 'Logimatiq program: choose the APN from the list'),
      IMG('interface_web_setup_apn_modem.png', 'Interface du modem (192.168.1.1) : menu Setup, champ APN', 'Modem interface (192.168.1.1): Setup menu, APN field'),
    ],
    blocks: [
      { kind: 'steps', title: L('Méthode à privilégier : programme Logimatiq', 'Preferred method: Logimatiq program'), items: [
        L('Sur le PC, lancer C:\\EPI\\setup_config_routeur_four_faith_1.0.0.17.exe', 'On the PC, run C:\\EPI\\setup_config_routeur_four_faith_1.0.0.17.exe'),
        L("« La connexion à Internet est-elle fournie par un routeur installé par Logimatiq ? » : Oui", '"La connexion à Internet est-elle fournie par un routeur installé par Logimatiq ?" (internet provided by a Logimatiq router?): "Oui" (Yes)'),
        L("Choisir l'APN dans la liste (le même qu'avant si la SIM n'a pas changé), « Enregistrer les paramètres et Fermer »", 'Choose the APN from the list (the same as before if the SIM has not changed), "Enregistrer les paramètres et Fermer" (Save settings and Close)'),
      ] },
      { kind: 'steps', title: L('Secours : interface web du modem', 'Fallback: modem web interface'), items: [
        L('Navigateur du PC → 192.168.1.1 (identifiants : fournis par Logimatiq)', 'PC browser → 192.168.1.1 (credentials: provided by Logimatiq)'),
        L("Setup → saisir l'APN → valider", 'Setup → enter the APN → confirm'),
        L('Attendre le voyant Online bleu fixe (1 à 2 minutes)', 'Wait for the Online indicator to be steady blue (1 to 2 minutes)'),
      ] },
      { kind: 'check', title: VALIDER, items: [L('Test de synchronisation par Logimatiq', 'Synchronization test by Logimatiq')] },
    ],
  },
  {
    id: 'epi05', family: 'trappe', src: ['FI', 'D24 p.5', 'MF12 p.5-6'], solutions: ['sol_changer_epi05'],
    title: L("Remplacement d'une carte de trappe EPI 05", 'Replacing an EPI 05 hatch board'),
    subtitle: L('EPIMAT 13 — une carte par trappe, derrière la façade', 'EPIMAT 13 — one board per hatch, behind the front'),
    media: [
      IMG('fiches/epi05_capot_3vis.jpg', 'Capot de protection : 3 vis M4 (clé de 7 mm)', 'Protective cover: 3 M4 screws (7 mm wrench)'),
      IMG('fiches/epi05_nappe40.jpg', 'Débrancher la nappe 40 fils', 'Unplug the 40-wire ribbon cable'),
      IMG('fiches/epi05_2vis_fendues.jpg', 'Carte fixée par 2 vis M4 à tête fendue', 'Board held by 2 slotted-head M4 screws'),
      IMG('fiches/epi05_cavaliers.jpg', "Cavaliers d'adressage (exemple : porte 6)", 'Address jumpers (example: door 6)'),
    ],
    blocks: [
      { kind: 'list', title: L('Repères et outils', 'Landmarks and tools'), items: [
        L("Face intérieure de la façade : une carte EPI 05 par trappe, sous un capot, reliées par la nappe 40 fils", 'Inside of the front: one EPI 05 board per hatch, under a cover, linked by the 40-wire ribbon cable'),
        L('Clé de 7 mm, tournevis plat, machine consignée', '7 mm wrench, flat screwdriver, machine locked out'),
      ] },
      { kind: 'steps', title: L('Dépose', 'Removal'), items: [
        L('Dévisser les 3 vis M4 du capot (clé de 7 mm)', 'Unscrew the 3 M4 screws of the cover (7 mm wrench)'),
        L('Débrancher la nappe 40 fils de la carte', 'Unplug the 40-wire ribbon cable from the board'),
        L('Dévisser les 2 vis M4 à tête fendue ; garder les rondelles grower', 'Unscrew the 2 slotted-head M4 screws; keep the spring washers'),
      ] },
      { kind: 'warn', title: L('Adressage', 'Addressing'), items: [L("Avant la repose : reprendre exactement les cavaliers et switches de l'ancienne carte (n° de la porte, broches 1 → 13 de droite à gauche)", 'Before refitting: copy exactly the jumpers and switches of the old board (door number, pins 1 → 13 from right to left)')] },
      { kind: 'steps', title: L('Repose', 'Refitting'), items: [
        L('Reposer la carte avec les 2 vis M4 et leurs rondelles', 'Refit the board with the 2 M4 screws and their washers'),
        L('Rebrancher la nappe 40 fils, puis remonter le capot (3 vis M4)', 'Plug the 40-wire ribbon cable back in, then refit the cover (3 M4 screws)'),
      ] },
      { kind: 'check', title: VALIDER, items: [
        L('N° de porte et configuration des cavaliers', 'Door number and jumper configuration'),
        L('Test ouverture / fermeture dans DEBES', 'Open / close test in DEBES'),
      ] },
    ],
  },
  {
    id: 'moteur', family: 'trappe', src: ['FI', 'MF12 p.5-7'], solutions: [],
    title: L("Remplacement d'un moteur de trappe", 'Replacing a hatch motor'),
    subtitle: L('EPIMAT 13 — motoréducteur 24 V DC + pignon M1 + équerre', 'EPIMAT 13 — 24 V DC gear motor + M1 pinion + bracket'),
    media: [
      IMG('arbres/moteur_trappe.jpg', 'Moteur de trappe et sa carte EPI 05', 'Hatch motor and its EPI 05 board'),
      IMG('fiches/moteur_trappe_schema.jpg', 'Ensemble moteur de trappe : motoréducteur, pignon M1, équerre', 'Hatch motor assembly: gear motor, M1 pinion, bracket'),
    ],
    blocks: [
      { kind: 'list', title: L('Outils', 'Tools'), items: [L('Clé plate de 8 mm, machine consignée', '8 mm open-end wrench, machine locked out')] },
      { kind: 'steps', title: L('Dépose', 'Removal'), items: [
        L("Accéder à l'ensemble moteur (retirer le capot si besoin, clé de 7 mm)", 'Reach the motor assembly (remove the cover if needed, 7 mm wrench)'),
        L('Débrancher le connecteur du moteur', 'Unplug the motor connector'),
        L('Dévisser les 2 vis M5 (clé de 8 mm) ; garder les rondelles contact', 'Unscrew the 2 M5 screws (8 mm wrench); keep the lock washers'),
      ] },
      { kind: 'steps', title: L('Repose', 'Refitting'), items: [
        L("Mettre en place le nouvel ensemble moteur et son équerre, rebrancher le connecteur", 'Fit the new motor assembly and its bracket, plug the connector back in'),
        L("Aucun jeu entre le pignon M1 et la crémaillère blanche : pousser l'ensemble vers la trappe avant de serrer", 'No play between the M1 pinion and the white rack: push the assembly towards the hatch before tightening'),
        L('Serrer les 2 vis M5', 'Tighten the 2 M5 screws'),
      ] },
      { kind: 'check', title: VALIDER, items: [L('Test ouverture / fermeture complet dans DEBES', 'Full open / close test in DEBES')] },
    ],
  },
  {
    id: 'alim', family: 'alim', src: ['FI', 'MF12 p.10-11', 'REP'], solutions: ['sol_changer_alim_generale'],
    title: L('Alimentation générale et fusibles', 'Main power supply and fuses'),
    subtitle: L('230 V AC → 24 V / 5 V DC, en haut de la platine coulissante', '230 V AC → 24 V / 5 V DC, at the top of the sliding plate'),
    media: [
      IMG('arbres/alim_generale_fusibles.jpg', 'Alimentation générale : coupe-circuits 24 V (3 A) et 5 V (1 A)', 'Main power supply: 24 V (3 A) and 5 V (1 A) circuit breakers'),
      IMG('arbres/fusible_cache_noir.jpg', 'Interrupteur général O / I (sans voyant) et porte-fusible à cache noir', 'O / I main switch (no indicator) and black-cover fuse holder'),
      IMG('arbres/fusible_sorti.jpg', 'Le fusible dans son porte-fusible', 'The fuse in its holder'),
    ],
    blocks: [
      { kind: 'steps', title: L("D'abord réarmer", 'Reset first'), items: [
        L('Coulisser la platine vers l\'avant ; réarmer le coupe-circuit sorti (24 V = « disjoncteur tambour », ou 5 V)', 'Slide the plate forward; reset the popped-out circuit breaker (24 V = "drum circuit breaker", or 5 V)'),
        L("S'il redéclenche aussitôt : court-circuit, ne pas insister → SAV", 'If it trips again immediately: short circuit, do not insist → Support'),
      ] },
      { kind: 'steps', title: L('Fusible', 'Fuse'), items: [
        L('Couper le secteur : débrancher la prise de la machine', 'Cut the mains: unplug the machine'),
        L('Sortir le porte-fusible (cache noir) avec un tournevis plat', 'Pull out the fuse holder (black cover) with a flat screwdriver'),
        L('Remplacer le fusible grillé : 4 A minimum, 5 A maximum', 'Replace the blown fuse: 4 A minimum, 5 A maximum'),
      ] },
      { kind: 'steps', title: L("Changer l'alimentation générale", 'Replacing the main power supply'), items: [
        L('Machine débranchée, dévisser le bloc', 'Machine unplugged, unscrew the unit'),
        L('Poser le bloc neuf et rebrancher les borniers en respectant les tensions', 'Fit the new unit and reconnect the terminal blocks, respecting the voltages'),
        L('Remettre sous tension ; interrupteur général sur I', 'Power on again; main switch on I'),
      ] },
      { kind: 'check', title: VALIDER, items: [L('Remplacement du fusible 4-5 A', 'Replacement of the 4-5 A fuse')] },
    ],
  },
  {
    id: 'epi01', family: 'cartes', src: ['FI', 'CI01'], solutions: [],
    title: L('Remplacement de la carte principale EPI 01', 'Replacing the EPI 01 main board'),
    subtitle: L('Carte des entrées / sorties, en bas de la platine', 'Input / output board, at the bottom of the plate'),
    media: [
      IMG('arbres/platine_epi01.jpg', "Platine tirée vers l'avant : la carte EPI 01 à droite", 'Plate pulled forward: the EPI 01 board on the right'),
      IMG('fiches/epi01_carte.jpg', 'Carte EPI 01 (kit de dépannage)', 'EPI 01 board (repair kit)'),
    ],
    blocks: [
      { kind: 'steps', title: L('Procédure', 'Procedure'), items: [
        L('Éteindre la machine', 'Switch the machine off'),
        L("Coulisser la platine électrique vers l'avant", 'Slide the electrical plate forward'),
        L('Débrancher les connecteurs (ils sont détrompés) et retirer la carte EPI 01', 'Unplug the connectors (they are keyed) and remove the EPI 01 board'),
        L('Brancher la nouvelle carte, sans oublier le câble SCSI blanc du PC', 'Connect the new board, without forgetting the white SCSI cable from the PC'),
        L('Allumer la machine', 'Switch the machine on'),
        L("Rebrancher la nappe (intérieur de la façade) sur chaque carte EPI 05 des trappes, avec contrôle de la hotline en simultané", 'Plug the ribbon cable (inside the front) back into each EPI 05 hatch board, with the hotline checking at the same time'),
      ] },
      { kind: 'check', title: VALIDER, items: [
        L('Contrôle en télémaintenance simultanée', 'Simultaneous remote check'),
        L('Test complet : trappes et rotation du tambour', 'Full test: hatches and drum rotation'),
      ] },
    ],
  },
  {
    id: 'gr76', family: 'cartes', src: ['FI', 'VL p.1', 'REP'], solutions: [],
    title: L('Vitesse du tambour (GR76) et commande de rotation (EPI RT)', 'Drum speed (GR76) and rotation control (EPI RT)'),
    subtitle: L('Cartes du tableau électrique', 'Electrical panel boards'),
    media: [IMG('arbres/gr76_potentiometre.jpg', 'Carte GR76 : potentiomètre bleu de la vitesse lente', 'GR76 board: blue low-speed potentiometer')],
    blocks: [
      { kind: 'list', title: L('Carte GR76 — vitesse lente', 'GR76 board — low speed'), items: [
        L('Carte à dissipateur noir (« GR 74 » sur les anciennes photos : même carte)', 'Board with a black heat sink ("GR 74" on old photos: same board)'),
        L("Réglage : potentiomètre bleu 1 tour, sens horaire = plus lent, antihoraire = plus rapide, un quart de tour entre chaque test", 'Adjustment: blue single-turn potentiometer, clockwise = slower, counterclockwise = faster, a quarter turn between each test'),
      ] },
      { kind: 'steps', title: L('Changer une carte (GR76 ou EPI RT)', 'Replacing a board (GR76 or EPI RT)'), items: [
        L('Machine consignée, platine coulissée vers l\'avant', 'Machine locked out, plate slid forward'),
        L('Repérer et débrancher les connecteurs (détrompés)', 'Mark and unplug the connectors (keyed)'),
        L('Poser la carte neuve, rebrancher, revisser', 'Fit the new board, plug back in, screw back'),
      ] },
      { kind: 'check', title: VALIDER, items: [
        L("Réglage de vitesse par essais successifs (un quart de tour par test)", 'Speed adjustment by successive tests (a quarter turn per test)'),
        L('Test de rotation et de la sécurité de façade', 'Rotation and front safety test'),
      ] },
    ],
  },
  {
    id: 'references', family: 'annexe', src: ['KIT', 'MF12'], solutions: [],
    title: L('Références des pièces et localisation', 'Part references and location'),
    subtitle: L('Kit de dépannage EPIMAT', 'EPIMAT repair kit'),
    media: [IMG('fiches/kit_detail.jpg', 'Contenu du kit de dépannage', 'Contents of the repair kit')],
    blocks: [
      { kind: 'list', title: L('Références (kit de dépannage)', 'References (repair kit)'), items: [
        L('EPI 01 : carte principale (entrées / sorties)', 'EPI 01: main board (inputs / outputs)'),
        L('EPI 05 : carte de trappe (ouverture / fermeture)', 'EPI 05: hatch board (open / close)'),
        L('LOG 03 : capteurs optiques de position du tambour', 'LOG 03: drum position optical sensors'),
        L('LOG 04 : arrêt du tambour en position (CP1)', 'LOG 04: drum stop on position (CP1)'),
        L('EPI RT : rotation manuelle et sécurité', 'EPI RT: manual rotation and safety'),
        L('GR76 : vitesse lente du tambour', 'GR76: drum low speed'),
        L('FLAPPER SOLENOID : électro-aimant du verrou de trappe', 'FLAPPER SOLENOID: hatch lock electromagnet'),
        L('T HANDLE : serrure à poignée ¼ de tour', 'T HANDLE: quarter-turn handle lock'),
        L('NAPPE40-8HE10-2700 : nappe 40 fils des trappes', 'NAPPE40-8HE10-2700: 40-wire hatch ribbon cable'),
        L('NAPPE14-3HE10-2400 : nappe 14 fils du tambour', 'NAPPE14-3HE10-2400: 14-wire drum ribbon cable'),
      ] },
      { kind: 'list', title: L('Où sont les pièces', 'Where the parts are'), items: [
        L('Bas du châssis : PC', 'Bottom of the frame: PC'),
        L('Tableau électrique (platine coulissante) : alimentation, EPI 01, GR76, modem', 'Electrical panel (sliding plate): power supply, EPI 01, GR76, modem'),
        L('Façade : écran, lecteur de badge, cartes EPI 05, moteurs de trappe', 'Front: screen, badge reader, EPI 05 boards, hatch motors'),
        L('Haut du châssis (sous le toit) : LOG 03 / LOG 04, moteur du tambour M1, bouton de rotation', 'Top of the frame (under the roof): LOG 03 / LOG 04, M1 drum motor, rotation button'),
      ] },
    ],
  },
];

export { HOTLINE };
