/* ============================================================================
   DATA — Logimatiq SAV
   3 arbres EPIMAT : Écran, Internet / modem, Badge
   Préfixes de nœuds : s_ (screen) · i_ (internet) · b_ (badge)
   Types : question (answers → next) · action (steps → next) · solution (outcome)

   Refonte d'octobre 2026 (lots 1 et 2). Chaque nœud porte un champ `src`,
   non affiché dans l'app, qui cite ses sources :
     T     arbres validés sur le terrain (mai 2026)
     D24   doc maintenance 2024 (tableau des pannes p.1, fiches de remplacement)
     E17   procédure « Remplacement écran 8 par 17 pouces »
     ME15  manuel de maintenance EN (2015)
     MU18  manuel d'installation et d'utilisation (2018)
     DS    paramètres de DistEPI
     PR    prérequis réseau EPIMAT
     SIM   procédure SIM / APN (2026)
     IM    installation du modem
     IB    initialisation des badges
     REP   réponses de l'équipe Logimatiq (octobre 2026)
     LOG   logique de diagnostic déduite des sources, à valider sur le terrain
   Images : public/arbres/ (media : un objet, ou une liste d'objets).
   Après toute modification : npm run check-trees
   ========================================================================== */
export const DATA = {
  machines: [
    { id: 'epimat', name: 'EPIMAT', icon: 'machine', color: 'bg-brand-600' },
    { id: 'logiciel', name: 'Logiciel EPIMAT', icon: 'pc', color: 'bg-brand-500' },
  ],

  symptoms: {
    epimat: [
      { id: 't.epimat.screen', title: "Écran noir / pas d'image / écran figé", category: 'Affichage', rootNode: 's_debut', icon: 'screen' },
      { id: 't.epimat.internet', title: 'Pas de connexion internet / modem hors ligne', category: 'Réseau', rootNode: 'i_debut', icon: 'antenna' },
      { id: 't.epimat.badge', title: 'Badge non lu / non reconnu / mauvais numéro', category: 'Badge', rootNode: 'b_debut', icon: 'badge' },
    ],
    logiciel: [
      { id: 't.log.demarrage', title: 'Le logiciel ne démarre pas / plante', category: 'Logiciel', rootNode: 'tbd', icon: 'pc' },
      { id: 't.log.synchro', title: 'Erreur de synchronisation logicielle', category: 'Logiciel', rootNode: 'tbd', icon: 'antenna' },
      { id: 't.log.impression', title: "Problème d'impression", category: 'Logiciel', rootNode: 'tbd', icon: 'screen' },
      { id: 't.log.config', title: 'Configuration / paramétrage initial', category: 'Config', rootNode: 'tbd', icon: 'badge' },
    ],
    vetimat: [
      { id: 't.vet.ph', title: 'À compléter', category: '—', rootNode: 'tbd', icon: 'pillar' },
    ],
  },

  nodes: {

    /* ====================================================================
       ARBRE 1 — ÉCRAN  (préfixe s_)
       Point d'entrée : s_debut
       ==================================================================== */
    s_debut: {
      type: 'question',
      title: 'La machine est-elle branchée au secteur ?',
      help: "Vérifier que le câble d'alimentation principal est bien connecté à la multiprise.",
      answers: [
        { label: 'Oui, branchée', next: 's_led_ecran' },
        { label: 'Non, débranchée', next: 's_brancher' },
      ],
      src: ['T'],
    },
    s_brancher: {
      type: 'action',
      title: 'Brancher la machine au secteur',
      steps: [
        'Vérifier que la multiprise est allumée (voyant rouge allumé)',
        "Brancher fermement le câble d'alimentation côté machine (câble fourni, sortie en partie basse)",
        "Brancher l'autre extrémité dans la multiprise",
        'Patienter 10 secondes',
      ],
      next: 's_led_ecran',
      src: ['T', 'MU18 p.4'],
    },
    s_led_ecran: {
      type: 'question',
      title: "Quelle est la couleur du voyant LED de l'écran ?",
      help: 'Petit voyant situé en façade du moniteur, en bas ou sur le côté.',
      answers: [
        { label: 'Rouge', next: 's_rouge_pc_led', color: 'red' },
        { label: 'Éteint (aucune LED)', next: 's_eteint_machine', color: 'gray' },
        { label: 'Vert (image visible, autre problème)', next: 's_vert_symptome', color: 'green' },
      ],
      src: ['T'],
    },

    /* ---- Branche rouge — LED écran rouge ---- */
    s_rouge_pc_led: {
      type: 'question',
      title: 'La LED du PC est-elle allumée ?',
      help: 'Voyant lumineux sur la façade du boîtier PC intégré dans la machine.',
      media: { type: 'photo', label: 'Le PC est dans le compartiment du bas de la machine (entouré en rouge)', file: 'arbres/pc_emplacement.jpg' },
      answers: [
        { label: 'Oui, LED PC allumée', next: 's_rouge_rebrancher_vga' },
        { label: 'Non, PC éteint', next: 's_rouge_pc_ventilo' },
      ],
      src: ['T'],
    },
    s_rouge_pc_ventilo: {
      type: 'action',
      title: "Vérifier l'alimentation du PC",
      steps: [
        'Écouter ou regarder si le ventilateur du PC tourne',
        "Aller à l'arrière du boîtier PC",
        "Repérer l'interrupteur ON/OFF près de la prise secteur du PC",
        'Passer ce switch sur OFF, attendre 5 secondes, puis remettre sur ON',
        'Revenir en façade et appuyer sur le bouton Power du PC',
        'Attendre 15 secondes',
      ],
      media: { type: 'photo', label: 'Le PC est dans le compartiment du bas de la machine (entouré en rouge)', file: 'arbres/pc_emplacement.jpg' },
      next: 's_rouge_pc_demarre',
      src: ['T'],
    },
    s_rouge_pc_demarre: {
      type: 'question',
      title: 'Le PC a-t-il démarré ? (LED allumée)',
      answers: [
        { label: 'Oui, LED allumée', next: 's_rouge_rebrancher_vga' },
        { label: 'Non, toujours éteint', next: 'sol_changer_pc' },
      ],
      src: ['T'],
    },
    s_rouge_rebrancher_vga: {
      type: 'action',
      title: 'Débrancher et rebrancher le câble VGA',
      help: "Les 3 câbles de l'écran (USB, alimentation, VGA) arrivent au même endroit derrière l'écran.",
      steps: [
        "Localiser le câble VGA (connecteur bleu à vis) entre l'écran et le PC",
        'Débrancher le câble côté écran, puis côté PC',
        'Rebrancher fermement des deux côtés et serrer les vis moletées',
        'Attendre 10 secondes',
      ],
      media: { type: 'photo', label: "Derrière l'écran (kit 17 pouces) : arrivée des câbles USB, alimentation et VGA", file: 'arbres/ecran_cables.jpg' },
      next: 's_rouge_vga_result',
      src: ['T', 'E17'],
    },
    s_rouge_vga_result: {
      type: 'question',
      title: "L'image est-elle revenue sur l'écran ?",
      answers: [
        { label: 'Oui, image OK', next: 'sol_resolved' },
        { label: 'Non, toujours rouge', next: 's_rouge_changer_vga' },
      ],
      src: ['T'],
    },
    s_rouge_changer_vga: {
      type: 'action',
      title: 'Remplacer le câble VGA',
      steps: [
        "Débrancher l'ancien câble VGA des deux côtés",
        'Brancher un câble VGA neuf côté PC, puis côté écran',
        'Serrer les vis moletées',
        "Attendre le retour de l'image (10 secondes)",
      ],
      media: { type: 'photo', label: "Derrière l'écran (kit 17 pouces) : arrivée des câbles USB, alimentation et VGA", file: 'arbres/ecran_cables.jpg' },
      next: 's_rouge_apres_changer_vga',
      src: ['T'],
    },
    s_rouge_apres_changer_vga: {
      type: 'question',
      title: "L'image est-elle maintenant visible ?",
      answers: [
        { label: 'Oui, image OK', next: 'sol_resolved' },
        { label: 'Non, écran rouge', next: 'sol_changer_pc_ecran' },
      ],
      src: ['T'],
    },

    /* ---- Branche éteinte — LED écran éteinte : machine, câble, puis alimentation
       (l'écran 17 pouces s'allume seul : pas d'étape bouton marche)
       (« tout semble éteint » → sol_disjoncteur en attendant l'arbre Alimentation) ---- */
    s_eteint_machine: {
      type: 'question',
      title: 'Le reste de la machine est-il sous tension ?',
      help: 'LED du PC, voyant du lecteur de badge, voyants du modem.',
      answers: [
        { label: 'Non, tout semble éteint', next: 'sol_disjoncteur' },
        { label: "Oui, seul l'écran est éteint", next: 's_eteint_cable' },
      ],
      src: ['D24 p.1', 'REP'],
    },
    s_eteint_cable: {
      type: 'question',
      title: "Le câble d'alimentation est-il bien branché côté écran et côté bloc d'alimentation ?",
      help: "Il arrive derrière l'écran avec les câbles USB et VGA.",
      media: { type: 'photo', label: "Derrière l'écran (kit 17 pouces) : arrivée des câbles USB, alimentation et VGA", file: 'arbres/ecran_cables.jpg' },
      answers: [
        { label: 'Oui, branché', next: 's_eteint_multiprise' },
        { label: 'Non, débranché', next: 's_eteint_brancher_cable' },
      ],
      src: ['T', 'E17'],
    },
    s_eteint_brancher_cable: {
      type: 'action',
      title: "Brancher le câble d'alimentation de l'écran",
      steps: [
        "Brancher fermement l'extrémité côté écran",
        "Vérifier le branchement côté bloc d'alimentation et côté multiprise",
      ],
      media: { type: 'photo', label: "Derrière l'écran (kit 17 pouces) : arrivée des câbles USB, alimentation et VGA", file: 'arbres/ecran_cables.jpg' },
      next: 's_eteint_cable_result',
      src: ['T'],
    },
    s_eteint_cable_result: {
      type: 'question',
      title: "L'écran s'allume-t-il ?",
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 's_eteint_multiprise' },
      ],
      src: ['LOG'],
    },
    s_eteint_multiprise: {
      type: 'question',
      title: 'La LED rouge de la multiprise est-elle allumée ?',
      help: "La multiprise doit afficher un voyant rouge pour indiquer qu'elle est sous tension.",
      answers: [
        { label: 'Oui, LED rouge allumée', next: 's_eteint_changer_alim' },
        { label: 'Non, multiprise éteinte', next: 'sol_disjoncteur' },
      ],
      src: ['T'],
    },
    s_eteint_changer_alim: {
      type: 'action',
      title: "Remplacer l'alimentation de l'écran",
      steps: [
        "Localiser le bloc d'alimentation de l'écran (boîtier noir sur le câble)",
        "Débrancher l'alimentation défaillante",
        'Brancher une alimentation neuve de même référence',
        "Rallumer l'écran",
      ],
      next: 's_eteint_alim_result',
      src: ['T'],
    },
    s_eteint_alim_result: {
      type: 'question',
      title: "L'écran s'est-il allumé ?",
      answers: [
        { label: 'Oui, écran allumé', next: 'sol_changer_alim' },
        { label: 'Non, toujours éteint', next: 'sol_changer_ecran' },
      ],
      src: ['T'],
    },

    /* ---- Branche verte — image visible, autre problème ---- */
    s_vert_symptome: {
      type: 'question',
      title: 'Quel est le problème ?',
      answers: [
        { label: "L'écran tactile ne répond pas", next: 's_vert_usb' },
        { label: 'Image abîmée : scintillement, couleurs, écran cassé', next: 's_vert_image' },
        { label: "DistEPI n'est pas affiché (bureau Windows visible)", next: 's_vert_distepi' },
        { label: 'Écran figé / bloqué', next: 's_vert_redemarrer' },
        { label: "Message d'erreur Windows ou BIOS", next: 's_vert_erreur' },
      ],
      src: ['T', 'D24 p.1'],
    },
    s_vert_image: {
      type: 'question',
      title: "Que voit-on à l'écran ?",
      answers: [
        { label: 'Scintillement ou couleurs anormales', next: 's_vert_vga' },
        { label: 'Mauvaise résolution (image trop grande ou coupée)', next: 's_vert_resolution' },
        { label: 'Écran cassé ou fissuré', next: 'sol_changer_ecran' },
      ],
      src: ['T', 'D24 p.1'],
    },
    s_vert_vga: {
      type: 'action',
      title: 'Vérifier le câble VGA',
      steps: [
        "Localiser le câble VGA (connecteur bleu) entre l'écran et le PC",
        'Débrancher et rebrancher fermement des deux côtés',
        'Serrer les vis moletées',
      ],
      media: { type: 'photo', label: "Derrière l'écran (kit 17 pouces) : arrivée des câbles USB, alimentation et VGA", file: 'arbres/ecran_cables.jpg' },
      next: 's_vert_vga_result',
      src: ['T'],
    },
    s_vert_vga_result: {
      type: 'question',
      title: "Le problème d'image a-t-il disparu ?",
      answers: [
        { label: 'Oui, image stable', next: 'sol_resolved' },
        { label: 'Non, problème persiste', next: 'sol_changer_ecran' },
      ],
      src: ['T'],
    },
    s_vert_usb: {
      type: 'action',
      title: "Vérifier le câble USB entre l'écran et le PC",
      steps: [
        "Localiser le câble USB reliant l'écran au PC (nécessaire pour le tactile)",
        'Débrancher et rebrancher fermement des deux côtés',
        'Si possible, essayer un autre port USB sur le PC',
      ],
      media: { type: 'photo', label: "Derrière l'écran (kit 17 pouces) : arrivée des câbles USB, alimentation et VGA", file: 'arbres/ecran_cables.jpg' },
      next: 's_vert_usb_result',
      src: ['T', 'E17'],
    },
    s_vert_usb_result: {
      type: 'question',
      title: "L'écran tactile répond-il maintenant ?",
      answers: [
        { label: 'Oui, tactile OK', next: 'sol_resolved' },
        { label: 'Non, toujours inactif', next: 'sol_changer_ecran' },
      ],
      src: ['T'],
    },
    s_vert_distepi: {
      type: 'action',
      title: 'Lancer le logiciel DistEPI',
      steps: [
        "Sur le bureau Windows, double-cliquer sur l'icône DistEPI",
        "Si l'icône est absente : lancer C:\\EPI\\DistEPI.exe",
        'Attendre le chargement complet (environ 30 secondes)',
      ],
      next: 's_vert_distepi_result',
      src: ['T', 'ME15 p.18'],
    },
    s_vert_distepi_result: {
      type: 'question',
      title: "DistEPI s'est-il lancé correctement ?",
      answers: [
        { label: 'Oui, DistEPI lancé', next: 'sol_resolved' },
        { label: "Non, ne s'ouvre pas", next: 's_redemarrer_distrib' },
      ],
      src: ['T'],
    },
    s_vert_resolution: {
      type: 'action',
      title: 'Corriger la résolution (1280 × 720)',
      steps: [
        'Faire un clic droit sur le bureau Windows',
        "Cliquer sur « Paramètres d'affichage »",
        'Dans Résolution, sélectionner 1280 × 720',
        'Cliquer sur « Conserver les modifications »',
      ],
      next: 's_vert_resolution_result',
      src: ['T'],
    },
    s_vert_resolution_result: {
      type: 'question',
      title: 'La résolution est-elle correcte maintenant ?',
      answers: [
        { label: 'Oui, affichage correct', next: 'sol_resolved' },
        { label: 'Non, toujours incorrecte', next: 's_redemarrer_distrib' },
      ],
      src: ['T'],
    },
    s_redemarrer_distrib: {
      type: 'action',
      title: 'Redémarrer le distributeur',
      steps: [
        'Démarrer → Arrêter → Redémarrer',
        "Si l'écran est figé : maintenir le bouton Power du PC 5 secondes, puis rallumer",
        'Attendre le démarrage complet de Windows et de DistEPI',
      ],
      next: 's_redemarrer_distrib_result',
      src: ['D24 p.1', 'T'],
    },
    s_redemarrer_distrib_result: {
      type: 'question',
      title: "Après redémarrage, DistEPI s'affiche-t-il correctement ?",
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'sol_sav' },
      ],
      src: ['D24 p.1'],
    },
    s_vert_redemarrer: {
      type: 'action',
      title: 'Redémarrer la machine',
      steps: [
        'Cliquer sur Démarrer → Arrêter → Redémarrer',
        "Si l'écran est figé : maintenir le bouton Power 5 secondes pour forcer l'arrêt",
        'Rallumer avec le bouton Power',
        'Attendre le redémarrage complet de Windows',
        'Vérifier que DistEPI se relance automatiquement',
      ],
      next: 's_vert_redemarrer_result',
      src: ['T'],
    },
    s_vert_redemarrer_result: {
      type: 'question',
      title: 'La machine fonctionne-t-elle correctement après redémarrage ?',
      answers: [
        { label: 'Oui, tout est OK', next: 'sol_resolved' },
        { label: 'Non, problème persiste', next: 'sol_changer_pc' },
      ],
      src: ['T'],
    },
    s_vert_erreur: {
      type: 'action',
      title: 'Noter le message, puis redémarrer le distributeur',
      steps: [
        "Photographier ou noter le message d'erreur",
        'Démarrer → Arrêter → Redémarrer (ou bouton Power 5 secondes)',
        'Attendre le démarrage complet',
      ],
      next: 's_vert_erreur_result',
      src: ['D24 p.1'],
    },
    s_vert_erreur_result: {
      type: 'question',
      title: "Le message d'erreur a-t-il disparu ?",
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non, il revient', next: 'sol_changer_pc' },
      ],
      src: ['D24 p.1'],
    },

    /* ====================================================================
       ARBRE 2 — INTERNET / MODEM  (préfixe i_)
       Point d'entrée : i_debut
       ==================================================================== */
    i_debut: {
      type: 'question',
      title: 'Quel est le problème ?',
      help: 'Voyants du modem Four-Faith : Online bleu fixe = internet OK ; ETH clignotant = liaison avec le PC OK.',
      media: [
        { type: 'photo', label: 'Emplacement du modem dans la machine (entouré en rouge)', file: 'arbres/modem_emplacement.jpg' },
        { type: 'photo', label: 'Voyants du modem : ETH, Online, signal, SIM, SYS, PWR', file: 'sens_insertion_sim.png' },
      ],
      answers: [
        { label: 'LED « Online » éteinte', next: 'i_pwr_led' },
        { label: 'LED « Online » allumée mais erreur de synchro DistEPI', next: 'i_eth_led' },
        { label: 'Déconnexions fréquentes / signal instable', next: 'i_signal_faible' },
      ],
      src: ['T', 'SIM p.12'],
    },

    /* ---- LED « Online » éteinte ---- */
    i_pwr_led: {
      type: 'question',
      title: 'La LED PWR du modem est-elle allumée (bleu fixe) ?',
      media: { type: 'photo', label: 'Voyants du modem : ETH, Online, signal, SIM, SYS, PWR', file: 'sens_insertion_sim.png' },
      answers: [
        { label: 'Oui', next: 'i_reboot_modem' },
        { label: 'Non, modem éteint', next: 'i_alim_modem' },
      ],
      src: ['SIM p.12'],
    },
    i_alim_modem: {
      type: 'action',
      title: "Vérifier l'alimentation du modem",
      steps: [
        "Vérifier que le jack d'alimentation est bien enfoncé dans le modem",
        'Vérifier que son adaptateur secteur est branché et sous tension',
        'Attendre 2 à 3 minutes',
      ],
      media: { type: 'photo', label: 'Connecteurs du modem : 2 antennes, alimentation (PWR) et câble RJ45 du PC sur ETH', file: 'arbres/modem_connecteurs.jpg' },
      next: 'i_alim_modem_result',
      src: ['IM p.1', 'D24 p.4'],
    },
    i_alim_modem_result: {
      type: 'question',
      title: "La LED PWR s'allume-t-elle ?",
      answers: [
        { label: 'Oui', next: 'i_reboot_result' },
        { label: 'Non', next: 'sol_changer_modem' },
      ],
      src: ['SIM p.12'],
    },
    i_reboot_modem: {
      type: 'action',
      title: 'Redémarrer le modem',
      steps: [
        "Débrancher l'alimentation du modem (jack), ou le passer sur OFF s'il a un interrupteur",
        'Attendre 30 secondes',
        "Rebrancher l'alimentation",
        'Attendre 2 à 3 minutes que le modem se reconnecte au réseau mobile',
      ],
      media: { type: 'photo', label: 'Connecteurs du modem : 2 antennes, alimentation (PWR) et câble RJ45 du PC sur ETH', file: 'arbres/modem_connecteurs.jpg' },
      next: 'i_reboot_result',
      src: ['T', 'IM p.1', 'D24 p.4'],
    },
    i_reboot_result: {
      type: 'question',
      title: 'La LED « Online » est-elle maintenant allumée ?',
      answers: [
        { label: 'Oui, LED bleue allumée', next: 'sol_resolved' },
        { label: 'Non, toujours éteinte', next: 'i_antennes_check' },
      ],
      src: ['T'],
    },
    i_antennes_check: {
      type: 'action',
      title: 'Vérifier les 2 antennes du modem',
      steps: [
        'Vérifier que les 2 antennes sont bien vissées sur le modem',
        'Si une antenne est desserrée, la revisser fermement',
        'Attendre 1 minute et observer la LED Online',
      ],
      media: { type: 'photo', label: 'Connecteurs du modem : 2 antennes, alimentation (PWR) et câble RJ45 du PC sur ETH', file: 'arbres/modem_connecteurs.jpg' },
      next: 'i_antennes_result',
      src: ['T', 'IM p.1'],
    },
    i_antennes_result: {
      type: 'question',
      title: "La LED « Online » s'est-elle allumée ?",
      answers: [
        { label: 'Oui, LED allumée', next: 'sol_resolved' },
        { label: 'Non, toujours éteinte', next: 'i_sim_led' },
      ],
      src: ['T'],
    },
    i_sim_led: {
      type: 'question',
      title: 'La LED SIM du modem est-elle allumée ?',
      help: 'LED SIM bleue = carte SIM détectée.',
      media: { type: 'photo', label: 'Voyants du modem : ETH, Online, signal, SIM, SYS, PWR', file: 'sens_insertion_sim.png' },
      answers: [
        { label: 'Oui, LED SIM allumée', next: 'i_setup_grizzly' },
        { label: 'Non, LED SIM éteinte', next: 'i_reinsertion_sim' },
      ],
      src: ['T', 'SIM p.12'],
    },
    i_reinsertion_sim: {
      type: 'action',
      title: 'Réinsérer la carte SIM',
      steps: [
        "Couper l'alimentation du modem",
        "Faire ressortir la SIM avec un stylo ou une pointe (trou d'éjection)",
        'Nettoyer les contacts dorés avec un chiffon sec',
        'Réinsérer la SIM dans le bon sens, puis rallumer le modem',
        'Attendre 2 à 3 minutes',
      ],
      media: { type: 'photo', label: "Faire sortir la SIM avec une pointe dans le trou d'éjection", file: 'sortir_la_sim_du_modem.png' },
      next: 'i_sim_result',
      src: ['T', 'SIM p.4'],
    },
    i_sim_result: {
      type: 'question',
      title: 'La LED SIM est-elle maintenant allumée ?',
      answers: [
        { label: 'Oui, LED SIM allumée', next: 'i_setup_grizzly' },
        { label: 'Non, toujours éteinte', next: 'sol_changer_modem' },
      ],
      src: ['T'],
    },
    i_setup_grizzly: {
      type: 'action',
      title: 'Relancer la configuration du routeur (programme Logimatiq)',
      steps: [
        'Lancer setup_config_routeur_four_faith_1.0.0.17.exe (dossier C:\\EPI)',
        'Contrôle de compte : Oui, puis Suivant, Suivant, Installer',
        '« La connexion à Internet est-elle fournie par un routeur installé par Logimatiq ? » : Oui',
        "Choisir l'APN de la carte SIM dans la liste (wbdata, matooma.m2m, orange…), puis « Enregistrer les paramètres et Fermer »",
        '« Configuration terminée avec succès » : OK, puis « Non, je préfère redémarrer plus tard » et Terminer',
        'Attendre 2 à 3 minutes et observer la LED Online',
      ],
      media: [
        { type: 'photo', label: 'Question « La connexion à Internet est-elle fournie par un routeur installé par Logimatiq ? » : répondre Oui', file: 'arbres/routeur_acces_internet.jpg' },
        { type: 'photo', label: "Choisir l'APN de la carte SIM dans la liste", file: 'arbres/routeur_apn.jpg' },
      ],
      next: 'i_setup_result',
      src: ['T', 'SIM p.8-10'],
    },
    i_setup_result: {
      type: 'question',
      title: 'La LED « Online » est-elle maintenant allumée ?',
      answers: [
        { label: 'Oui, LED bleue allumée', next: 'sol_resolved' },
        { label: 'Non, toujours éteinte', next: 'sol_changer_modem' },
      ],
      src: ['T'],
    },

    /* ---- LED « Online » allumée mais erreur de synchro DistEPI ---- */
    i_eth_led: {
      type: 'question',
      title: 'La LED ETH du modem clignote-t-elle ?',
      help: 'ETH clignotant = le modem échange avec le PC de la machine.',
      media: { type: 'photo', label: 'Voyants du modem : ETH, Online, signal, SIM, SYS, PWR', file: 'sens_insertion_sim.png' },
      answers: [
        { label: 'Oui, elle clignote', next: 'i_connexion_distante' },
        { label: 'Non, éteinte ou fixe', next: 'i_rj45_check' },
      ],
      src: ['SIM p.12'],
    },
    i_connexion_distante: {
      type: 'question',
      title: 'Peut-on se connecter à distance au PC de la machine ?',
      help: "Si la connexion à distance fonctionne, le câble RJ45 n'est pas en cause.",
      answers: [
        { label: 'Oui, connexion distance OK', next: 'i_test_url' },
        { label: 'Non, pas de connexion distance', next: 'i_rj45_check' },
      ],
      src: ['T'],
    },
    i_test_url: {
      type: 'action',
      title: "Tester l'accès au serveur EPIMAT depuis le PC",
      steps: [
        'Sur le PC de la machine, ouvrir Internet Explorer',
        'Aller sur https://epimat.logimatiq.com',
        "Vérifier que la page s'ouvre sans avertissement de certificat",
      ],
      next: 'i_test_url_result',
      src: ['PR p.3-4'],
    },
    i_test_url_result: {
      type: 'question',
      title: "La page s'ouvre-t-elle normalement ?",
      help: "Si Internet Explorer accède à l'adresse EPIMAT, les applications EPIMAT fonctionnent (prérequis réseau).",
      answers: [
        { label: 'Oui', next: 'i_clientsynch' },
        { label: 'Non', next: 'sol_sav' },
      ],
      src: ['PR p.3'],
    },
    i_rj45_check: {
      type: 'action',
      title: 'Vérifier le câble RJ45 (PC ↔ modem)',
      steps: [
        'Localiser le câble RJ45 reliant le PC au port ETH du modem',
        "Débrancher et rebrancher aux deux extrémités jusqu'au clic",
        'Vérifier que le PC Windows indique bien une connexion internet',
      ],
      media: { type: 'photo', label: 'Connecteurs du modem : 2 antennes, alimentation (PWR) et câble RJ45 du PC sur ETH', file: 'arbres/modem_connecteurs.jpg' },
      next: 'i_rj45_result',
      src: ['T', 'IM p.1'],
    },
    i_rj45_result: {
      type: 'question',
      title: 'Le PC Windows a-t-il maintenant accès à internet ?',
      answers: [
        { label: 'Oui, internet OK', next: 'i_clientsynch' },
        { label: 'Non, toujours sans réseau', next: 'sol_changer_modem' },
      ],
      src: ['T'],
    },
    i_clientsynch: {
      type: 'action',
      title: 'Tester avec ClientSynch DB EPI (Grizzly)',
      steps: [
        'Sur le bureau Windows, ouvrir le logiciel ClientSynch DB EPI',
        "Lancer le test de réception et d'envoi de données",
        'Observer si le test passe ou échoue',
      ],
      media: { type: 'photo', label: 'ClientSynch DB EPI — procédure (photos à venir)' },
      next: 'i_clientsynch_result',
      src: ['T'],
    },
    i_clientsynch_result: {
      type: 'question',
      title: 'Le test ClientSynch a-t-il réussi ?',
      answers: [
        { label: 'Oui, test OK', next: 'i_reboot_pc_distepi' },
        { label: 'Non, test échoue', next: 'sol_sav_serveur' },
      ],
      src: ['T'],
    },
    i_reboot_pc_distepi: {
      type: 'action',
      title: 'Redémarrer le PC',
      steps: [
        'Cliquer sur Démarrer → Arrêter → Redémarrer',
        'Attendre le redémarrage complet de Windows',
        'Vérifier que DistEPI se relance et que la synchro fonctionne',
      ],
      next: 'i_reboot_distepi_result',
      src: ['T'],
    },
    i_reboot_distepi_result: {
      type: 'question',
      title: 'DistEPI fonctionne-t-il correctement après redémarrage ?',
      answers: [
        { label: 'Oui, synchro OK', next: 'sol_resolved' },
        { label: 'Non, erreur persiste', next: 'sol_sav_serveur' },
      ],
      src: ['T'],
    },

    /* ---- Signal instable / déconnexions fréquentes ---- */
    i_signal_faible: {
      type: 'action',
      title: 'Vérifier les antennes et repositionner le modem',
      help: 'Les LED de signal (barres au centre du modem) : plus il y en a, meilleur est le signal.',
      steps: [
        'Vérifier que les 2 antennes sont bien vissées sur le modem',
        'Redresser les antennes verticalement',
        "Si possible, rapprocher le modem d'une fenêtre",
        'Tester avec un téléphone mobile la force du signal dans la pièce',
      ],
      media: { type: 'photo', label: 'Connecteurs du modem : 2 antennes, alimentation (PWR) et câble RJ45 du PC sur ETH', file: 'arbres/modem_connecteurs.jpg' },
      next: 'i_signal_result',
      src: ['T', 'SIM p.12'],
    },
    i_signal_result: {
      type: 'question',
      title: 'La connexion est-elle stable maintenant ?',
      answers: [
        { label: 'Oui, connexion stable', next: 'sol_resolved' },
        { label: 'Non, toujours instable', next: 'sol_antenne_ext' },
      ],
      src: ['T'],
    },

    /* ====================================================================
       ARBRE 3 — LECTEUR DE BADGE  (préfixe b_)
       Point d'entrée : b_debut
       ==================================================================== */
    b_debut: {
      type: 'question',
      title: 'La LED du lecteur de badge est-elle allumée ?',
      help: 'Le lecteur est branché en USB sur le PC : si la LED est éteinte, le PC est probablement éteint.',
      media: { type: 'photo', label: 'Le lecteur de badge (entouré en rouge)', file: 'arbres/badge_lecteur.jpg' },
      answers: [
        { label: 'Oui, LED allumée', next: 'b_symptome' },
        { label: 'Non, LED éteinte', next: 'b_pc_led' },
      ],
      src: ['T'],
    },

    /* ---- LED du lecteur éteinte ---- */
    b_pc_led: {
      type: 'question',
      title: 'La LED du PC est-elle allumée ?',
      media: { type: 'photo', label: 'Le PC est dans le compartiment du bas de la machine (entouré en rouge)', file: 'arbres/pc_emplacement.jpg' },
      answers: [
        { label: 'Non, PC éteint', next: 'b_allumer_pc' },
        { label: 'Oui, PC allumé', next: 'b_usb_rebranch' },
      ],
      src: ['T'],
    },
    b_allumer_pc: {
      type: 'action',
      title: 'Allumer le PC',
      steps: [
        'Appuyer sur le bouton Power en façade du boîtier PC',
        "Si rien ne se passe, passer le switch ON/OFF à l'arrière sur ON",
        'Réappuyer sur le bouton Power',
        'Attendre 15 secondes',
      ],
      media: { type: 'photo', label: 'Le PC est dans le compartiment du bas de la machine (entouré en rouge)', file: 'arbres/pc_emplacement.jpg' },
      next: 'b_led_apres_pc',
      src: ['T'],
    },
    b_led_apres_pc: {
      type: 'question',
      title: 'La LED du lecteur est-elle maintenant allumée ?',
      answers: [
        { label: 'Oui', next: 'b_symptome' },
        { label: 'Non', next: 'b_usb_rebranch' },
      ],
      src: ['LOG'],
    },
    b_usb_rebranch: {
      type: 'action',
      title: 'Débrancher et rebrancher le câble USB du lecteur',
      steps: [
        'Débrancher le câble USB du lecteur côté PC',
        'Attendre 5 secondes',
        'Rebrancher fermement sur le même port USB',
        "Observer si la LED du lecteur s'allume",
      ],
      next: 'b_led_apres_usb',
      src: ['T', 'D24 p.1'],
    },
    b_led_apres_usb: {
      type: 'question',
      title: 'La LED du lecteur est-elle maintenant allumée ?',
      answers: [
        { label: 'Oui, LED allumée', next: 'b_symptome' },
        { label: 'Non, toujours éteinte', next: 'b_autre_port_usb' },
      ],
      src: ['T'],
    },
    b_autre_port_usb: {
      type: 'action',
      title: 'Essayer un autre port USB',
      steps: [
        'Débrancher le câble USB du lecteur',
        'Le brancher sur un autre port USB du PC',
        "Observer si la LED du lecteur s'allume",
      ],
      next: 'b_led_autre_port',
      src: ['T'],
    },
    b_led_autre_port: {
      type: 'question',
      title: "La LED s'est-elle allumée sur le nouveau port ?",
      answers: [
        { label: 'Oui, LED allumée', next: 'b_symptome' },
        { label: 'Non, toujours éteinte', next: 'sol_changer_lecteur' },
      ],
      src: ['T', 'D24 p.1'],
    },

    /* ---- LED du lecteur allumée — que se passe-t-il au passage du badge ? ---- */
    b_symptome: {
      type: 'question',
      title: 'Que se passe-t-il quand on présente le badge ?',
      help: 'Le lecteur émet un bip quand il lit un badge.',
      answers: [
        { label: 'Rien : pas de bip, aucune réaction', next: 'b_autre_badge' },
        { label: "Bip, mais rien ne se passe à l'écran", next: 'b_bip_redemarrer' },
        { label: "L'écran demande « INITIALISATION BADGE — Tapez votre code ! »", next: 'b_init_badge' },
        { label: 'Badge lu mais refusé, mauvais nom ou mauvais numéro', next: 'b_sync' },
        { label: 'Lecture aléatoire / intermittente', next: 'b_alea_badge' },
      ],
      src: ['T', 'D24 p.1', 'IB p.1'],
    },

    /* ---- Aucune réaction : autre badge, puis test Bloc-notes ---- */
    b_autre_badge: {
      type: 'action',
      title: 'Tester avec un autre badge',
      steps: [
        "Prendre un badge qui fonctionne (badge de maintenance ou badge d'un collègue)",
        'Le présenter devant le lecteur',
        "Écouter le bip et regarder l'écran",
      ],
      next: 'b_autre_badge_result',
      src: ['LOG'],
    },
    b_autre_badge_result: {
      type: 'question',
      title: "L'autre badge est-il lu ?",
      answers: [
        { label: "Oui, l'autre badge est lu", next: 'b_badge_deja_ok' },
        { label: "Non, aucun badge n'est lu", next: 'b_notepad_langue' },
      ],
      src: ['LOG'],
    },
    b_badge_deja_ok: {
      type: 'question',
      title: 'Le premier badge a-t-il déjà fonctionné sur cette machine ?',
      answers: [
        { label: 'Oui, il marchait avant', next: 'sol_badge_defaillant' },
        { label: "Non, c'est un nouveau type de badge", next: 'sol_badge_incompatible' },
      ],
      src: ['LOG'],
    },
    b_notepad_langue: {
      type: 'action',
      title: 'Préparer le test Notepad — passer le clavier en anglais',
      help: 'Le lecteur USB fonctionne comme un clavier : il « tape » le numéro du badge.',
      steps: [
        'Cliquer sur la langue en bas à droite de la barre des tâches Windows',
        'Sélectionner « ENG » (anglais) comme langue de saisie',
        'Ouvrir le Bloc-notes (Notepad) : Démarrer → Notepad',
        'Cliquer dans la zone de texte du Bloc-notes',
      ],
      next: 'b_notepad_test',
      src: ['T', 'DS p.10', 'REP'],
    },
    b_notepad_test: {
      type: 'action',
      title: 'Tester la lecture du badge sur Notepad',
      steps: [
        'Dans le Bloc-notes (clavier en anglais), passer le badge devant le lecteur',
        "Observer ce qui s'affiche dans la zone de texte",
      ],
      next: 'b_notepad_result',
      src: ['T'],
    },
    b_notepad_result: {
      type: 'question',
      title: "Que s'affiche-t-il dans le Bloc-notes ?",
      answers: [
        { label: 'Des caractères apparaissent (ex : 3A8F12B4)', next: 'b_admin_base' },
        { label: "Rien ne s'affiche", next: 'b_reprogrammer' },
      ],
      src: ['T'],
    },
    b_admin_base: {
      type: 'action',
      title: 'Corriger le nombre de caractères dans Admin Base',
      steps: [
        'Dans DistEPI, aller dans « Admin Base »',
        'Repérer le paramètre nombre de caractères du badge',
        'Compter le nombre de caractères lus dans le Bloc-notes',
        "Corriger le paramètre pour qu'il corresponde",
        'Sauvegarder et redémarrer DistEPI',
      ],
      media: { type: 'photo', label: 'Admin Base — paramètre nb caractères (photos à venir)' },
      next: 'b_admin_result',
      src: ['T'],
    },
    b_admin_result: {
      type: 'question',
      title: 'Le badge est-il maintenant reconnu dans DistEPI ?',
      answers: [
        { label: 'Oui, badge OK', next: 'sol_resolved' },
        { label: 'Non, toujours ignoré', next: 'sol_changer_lecteur' },
      ],
      src: ['T'],
    },
    b_reprogrammer: {
      type: 'action',
      title: 'Reprogrammer le lecteur de badge',
      steps: [
        'Ouvrir le logiciel de programmation du lecteur',
        'Suivre la procédure de reprogrammation',
        'Retester avec le Bloc-notes après reprogrammation',
      ],
      media: { type: 'photo', label: 'Procédure reprogrammation lecteur (tuto à venir)' },
      next: 'b_reprogrammer_result',
      src: ['T'],
    },
    b_reprogrammer_result: {
      type: 'question',
      title: 'Le lecteur lit-il correctement sur le Bloc-notes ?',
      answers: [
        { label: 'Oui, caractères visibles', next: 'b_admin_base' },
        { label: 'Non, toujours rien', next: 'sol_changer_lecteur' },
      ],
      src: ['T'],
    },

    /* ---- Bip mais rien à l'écran ---- */
    b_bip_redemarrer: {
      type: 'action',
      title: 'Redémarrer le distributeur',
      steps: [
        'Démarrer → Arrêter → Redémarrer',
        'Attendre le démarrage complet de Windows et de DistEPI',
        'Représenter le badge',
      ],
      next: 'b_bip_result',
      src: ['D24 p.1'],
    },
    b_bip_result: {
      type: 'question',
      title: 'Le badge fonctionne-t-il après redémarrage ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'b_notepad_langue' },
      ],
      src: ['D24 p.1'],
    },

    /* ---- Écran « INITIALISATION BADGE » (première utilisation) ---- */
    b_init_badge: {
      type: 'action',
      title: 'Initialiser le badge (première utilisation sur cette machine)',
      steps: [
        'Saisir le numéro inscrit sur le badge, en ajoutant des 0 devant pour avoir 7 chiffres',
        'Exemples : badge 529545 → 0529545 ; badge 14 → 0000014',
        'Vérifier le nom affiché, puis valider avec OK',
      ],
      media: { type: 'photo', label: 'Écran « INITIALISATION BADGE » : saisir le numéro du badge sur 7 chiffres', file: 'arbres/badge_initialisation.jpg' },
      next: 'b_init_result',
      src: ['IB p.1'],
    },
    b_init_result: {
      type: 'question',
      title: "Le bon nom s'affiche-t-il ?",
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non, nom faux ou inconnu', next: 'b_salarie_extranet' },
      ],
      src: ['IB p.1'],
    },
    b_salarie_extranet: {
      type: 'action',
      title: "Vérifier le salarié dans l'extranet EPIMAT",
      steps: [
        'Se connecter à https://epimat.logimatiq.com/client',
        'Salariés → rechercher le salarié',
        "Vérifier le numéro de badge (7 chiffres), le profil et l'accès à cette machine",
        'Corriger et enregistrer',
        'Sur la machine, lancer une synchronisation : clavier branché sur le PC, Maj + L (menu maintenance), puis bouton « Synchroniser »',
      ],
      next: 'b_salarie_result',
      src: ['MU18 p.7', 'MU18 p.12-13', 'REP'],
    },
    b_salarie_result: {
      type: 'question',
      title: 'Le badge est-il reconnu maintenant ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'sol_sav' },
      ],
      src: ['LOG'],
    },

    /* ---- Badge lu mais refusé / mauvais nom / mauvais numéro ---- */
    b_sync: {
      type: 'action',
      title: 'Lancer une synchronisation et vérifier la connexion 4G',
      steps: [
        'Vérifier que la LED Online du modem est bleue fixe (sinon : arbre Internet / modem)',
        'Brancher un clavier sur le PC de la machine',
        'Maj + L pour ouvrir le menu maintenance, puis cliquer sur le bouton « Synchroniser »',
        'Attendre la fin de la synchronisation, puis représenter le badge',
      ],
      next: 'b_sync_result',
      src: ['D24 p.1', 'REP'],
    },
    b_sync_result: {
      type: 'question',
      title: 'Le badge est-il reconnu maintenant ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'b_mauvais_notepad' },
      ],
      src: ['D24 p.1'],
    },
    b_mauvais_notepad: {
      type: 'action',
      title: 'Vérifier le numéro lu — test Notepad (clavier anglais)',
      steps: [
        'Passer le clavier Windows en anglais (barre des tâches → ENG)',
        'Ouvrir le Bloc-notes et passer le badge devant le lecteur',
        'Comparer le numéro affiché avec celui imprimé sur le badge',
      ],
      next: 'b_mauvais_result',
      src: ['T', 'MU18 p.12'],
    },
    b_mauvais_result: {
      type: 'question',
      title: 'Le numéro lu dans le Bloc-notes correspond-il au badge ?',
      answers: [
        { label: 'Oui, même numéro — mal renseigné en base', next: 'b_corriger_bdd' },
        { label: 'Non, numéro différent — lecteur à reprogrammer', next: 'b_reprogrammer' },
      ],
      src: ['T'],
    },
    b_corriger_bdd: {
      type: 'action',
      title: 'Corriger le numéro de badge du salarié',
      steps: [
        'Extranet EPIMAT → Salariés → fiche du salarié → Modifier',
        'Corriger le numéro de badge avec le numéro exact du badge physique',
        'Enregistrer',
        'Sur la machine : Maj + L (menu maintenance), bouton « Synchroniser », puis retester le badge',
      ],
      next: 'b_bdd_result',
      src: ['T', 'MU18 p.12-13', 'REP'],
    },
    b_bdd_result: {
      type: 'question',
      title: 'Le badge est-il maintenant correctement reconnu ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'sol_changer_lecteur' },
      ],
      src: ['T'],
    },

    /* ---- Lecture aléatoire / intermittente ---- */
    b_alea_badge: {
      type: 'action',
      title: 'Tester avec un autre badge',
      steps: [
        'Prendre un autre badge disponible',
        'Le passer devant le lecteur',
        'Observer si la lecture est stable avec cet autre badge',
      ],
      next: 'b_alea_badge_result',
      src: ['T'],
    },
    b_alea_badge_result: {
      type: 'question',
      title: "L'autre badge fonctionne-t-il correctement ?",
      answers: [
        { label: 'Oui, lecture stable', next: 'sol_badge_defaillant' },
        { label: 'Non, même problème', next: 'b_alea_usb' },
        { label: "Pas d'autre badge disponible", next: 'b_alea_usb' },
      ],
      src: ['T'],
    },
    b_alea_usb: {
      type: 'action',
      title: 'Vérifier le câble USB du lecteur',
      steps: [
        'Débrancher le câble USB du lecteur',
        'Inspecter le câble (pliures, dommages visibles)',
        'Rebrancher fermement ou remplacer le câble si abîmé',
        'Tester la lecture de plusieurs badges',
      ],
      next: 'b_alea_usb_result',
      src: ['T'],
    },
    b_alea_usb_result: {
      type: 'question',
      title: 'La lecture est-elle stable maintenant ?',
      answers: [
        { label: 'Oui, lecture stable', next: 'sol_resolved' },
        { label: 'Non, toujours aléatoire', next: 'sol_changer_lecteur' },
      ],
      src: ['T'],
    },

    /* ====================================================================
       SOLUTIONS COMMUNES
       ==================================================================== */
    sol_resolved: {
      type: 'solution', outcome: 'resolved',
      title: 'Problème résolu',
      message: 'La machine fonctionne à nouveau correctement. Pensez à clôturer le ticket SAV si applicable.',
      src: ['T'],
    },
    sol_sav: {
      type: 'solution', outcome: 'sav',
      title: 'Contacter le SAV',
      message: 'Le problème persiste après les vérifications. Contacter le SAV Logimatiq en lui transmettant le rapport du diagnostic.',
      sav: true,
      src: ['D24 p.1'],
    },
    sol_disjoncteur: {
      type: 'solution', outcome: 'sav',
      title: 'Problème secteur / disjoncteur',
      message: "La machine ou la multiprise n'est pas alimentée. Vérifier les branchements et le disjoncteur du tableau électrique du local. Si le disjoncteur est OK, contacter le SAV.",
      sav: true,
      src: ['T', 'D24 p.1'],
    },
    sol_changer_pc: {
      type: 'solution', outcome: 'replace',
      title: 'Changer le PC intégré',
      message: 'Le PC ne démarre plus malgré les vérifications. Remplacer le PC, puis vérifier le bon fonctionnement avec DEBES, et contacter le SAV.',
      media: { type: 'photo', label: 'Le PC est dans le compartiment du bas de la machine (entouré en rouge)', file: 'arbres/pc_emplacement.jpg' },
      sav: true,
      src: ['T', 'D24 p.10'],
    },
    sol_changer_ecran: {
      type: 'solution', outcome: 'replace',
      title: "Changer l'écran",
      message: "L'écran reste défaillant après vérifications. Le remplacer (retirer la plaque protectrice, débrancher, dévisser) et contacter le SAV.",
      sav: true,
      src: ['T', 'D24 p.3'],
    },
    sol_changer_pc_ecran: {
      type: 'solution', outcome: 'replace',
      title: 'Changer PC ou écran',
      message: 'Si possible, tester avec un autre écran pour isoler le composant défaillant. Contacter le SAV pour remplacement.',
      sav: true,
      src: ['T'],
    },
    sol_changer_alim: {
      type: 'solution', outcome: 'replace',
      title: "Changer le bloc d'alimentation de l'écran",
      message: "L'écran se rallume avec une alimentation neuve : l'ancien bloc était défaillant. Signaler la pièce remplacée au SAV.",
      sav: true,
      src: ['T'],
    },
    sol_changer_modem: {
      type: 'solution', outcome: 'replace',
      title: 'Changer le modem GSM',
      message: 'Le modem ne se connecte plus malgré les vérifications. Le remplacer (récupérer la SIM, débrancher alimentation et antennes) et contacter le SAV.',
      sav: true,
      src: ['T', 'D24 p.4'],
    },
    sol_antenne_ext: {
      type: 'solution', outcome: 'sav',
      title: 'Installer une antenne externe',
      message: 'Le signal GSM est insuffisant dans ce local. Une antenne externe déportée est nécessaire. Contacter le SAV pour installation.',
      sav: true,
      src: ['T'],
    },
    sol_sav_serveur: {
      type: 'solution', outcome: 'sav',
      title: 'Problème serveur Logimatiq',
      message: 'Le test ClientSynch DB EPI échoue : le problème vient du serveur Logimatiq ou de la base de données SQL. Contacter le SAV Logimatiq.',
      sav: true,
      src: ['T'],
    },
    sol_changer_lecteur: {
      type: 'solution', outcome: 'replace',
      title: 'Changer le lecteur de badge',
      message: "Le lecteur de badge est défaillant. Le remplacer (reporter la connectique sur le nouveau lecteur), vérifier le bip au passage d'un badge, et contacter le SAV.",
      media: { type: 'photo', label: "Le lecteur de badge vu de l'intérieur de la porte (entouré en orange)", file: 'arbres/lecteur_remplacement.jpg' },
      sav: true,
      src: ['T', 'D24 p.8'],
    },
    sol_badge_incompatible: {
      type: 'solution', outcome: 'sav',
      title: 'Badge incompatible : reprogrammer le lecteur',
      message: "Le lecteur n'est pas programmé pour ce type de badge (MIFARE…). Il faut reprogrammer le lecteur de badge pour qu'il le lise : contacter le SAV.",
      sav: true,
      src: ['LOG', 'REP'],
    },
    sol_badge_defaillant: {
      type: 'solution', outcome: 'replace',
      title: 'Badge défaillant — à remplacer',
      message: 'Ce badge spécifique est défaillant (les autres badges fonctionnent). Remplacer le badge auprès du SAV.',
      sav: true,
      src: ['T'],
    },

    /* Placeholder machines non développées */
    tbd: {
      type: 'solution', outcome: 'info',
      title: 'Arbre à compléter',
      message: "Cette machine n'a pas encore d'arbre de diagnostic. Contacter le SAV directement.",
    },
  },
};
