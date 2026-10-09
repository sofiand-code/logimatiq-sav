/* ============================================================================
   DATA — Logimatiq SAV
   9 arbres EPIMAT : Écran, Internet / modem, Badge, Alimentation, Tambour, Trappe, Logiciel : démarrage, Logiciel : synchronisation, Logiciel : configuration
   Préfixes de nœuds : s_ (écran) · i_ (internet / modem) · b_ (badge) · a_ (alimentation) · t_ (tambour) · tr_ (trappe) · ld_ (logiciel : démarrage) · ls_ (logiciel : synchronisation) · lc_ (logiciel : configuration)
   Types : question (answers → next) · action (steps → next) · solution (outcome)

   Refonte d'octobre 2026 (lots 1, 2, 3, 4, 5). Chaque nœud porte un champ `src`,
   non affiché dans l'app, qui cite ses sources :
     T     arbres validés sur le terrain (mai 2026)
     R     repères de l'équipe Logimatiq
     D24   doc maintenance 2024 (tableau des pannes p.1, fiches de remplacement)
     E17   procédure « Remplacement écran 8 par 17 pouces »
     MF12  manuel de maintenance FR (2012)
     ME15  manuel de maintenance EN (2015)
     MU18  manuel d'installation et d'utilisation (2018)
     DS    paramètres de DistEPI
     PR    prérequis réseau EPIMAT
     SIM   procédure SIM / APN (2026)
     IM    installation du modem
     IB    initialisation des badges
     TU    tutoriel EPIMAT (distribution)
     FI    fiches d'intervention
     REP   réponses de l'équipe Logimatiq (octobre 2026)
     LOG   logique de diagnostic déduite des sources, à valider sur le terrain
     E05   procédure « EPI 05 sécurité tambour HS »
     VL    procédure de réglage de la vitesse lente (carte GR76)
     L34   réglage des circuits LOG 03 / LOG 04
     L04   remplacement du circuit LOG 04
     KIT   mallette du kit de dépannage
     PAP   câblage du moteur pas à pas et de son contrôleur
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
      { id: 't.epimat.alim', title: 'Machine hors tension / plus de courant', category: 'Alimentation', rootNode: 'a_debut', icon: 'power' },
      { id: 't.epimat.screen', title: "Écran noir / pas d'image / écran figé", category: 'Affichage', rootNode: 's_debut', icon: 'screen' },
      { id: 't.epimat.internet', title: 'Pas de connexion internet / modem hors ligne', category: 'Réseau', rootNode: 'i_debut', icon: 'antenna' },
      { id: 't.epimat.badge', title: 'Badge non lu / non reconnu / mauvais numéro', category: 'Badge', rootNode: 'b_debut', icon: 'badge' },
      { id: 't.epimat.tambour', title: '« EN PANNE » / tambour bloqué ou mal positionné', category: 'Tambour', rootNode: 't_debut', icon: 'drum' },
      { id: 't.epimat.trappe', title: 'Trappe bloquée / « Problème de distribution » / casier vide', category: 'Trappe', rootNode: 'tr_debut', icon: 'hatch' },
    ],
    logiciel: [
      { id: 't.log.demarrage', title: 'Le logiciel ne démarre pas / plante', category: 'Logiciel', rootNode: 'ld_debut', icon: 'pc' },
      { id: 't.log.synchro', title: 'Erreur de synchronisation logicielle', category: 'Logiciel', rootNode: 'ls_debut', icon: 'antenna' },
      { id: 't.log.config', title: 'Configuration / paramétrage initial', category: 'Config', rootNode: 'lc_debut', icon: 'badge' },
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
      help: "Vérifier que le câble d'alimentation de la machine est bien branché à la prise du local.",
      answers: [
        { label: 'Oui, branchée', next: 's_led_ecran' },
        { label: 'Non, débranchée', next: 's_brancher' },
      ],
      src: ['T', 'REP'],
    },
    s_brancher: {
      type: 'action',
      title: 'Brancher la machine au secteur',
      steps: [
        "Brancher fermement le câble d'alimentation côté machine (câble fourni, sortie en partie basse)",
        "Brancher l'autre extrémité dans la prise du local",
        'Patienter 10 secondes',
      ],
      next: 's_led_ecran',
      src: ['T', 'MU18 p.4', 'REP'],
    },
    s_led_ecran: {
      type: 'question',
      title: "Quelle est la couleur du voyant LED de l'écran ?",
      help: "Voyant « Power Led » au dos de l'écran, au-dessus des boutons de réglage (voir les photos).",
      media: [
        { type: 'photo', label: 'Voyant éteint', file: 'arbres/led_ecran_eteinte.jpg' },
        { type: 'photo', label: 'Voyant rouge', file: 'arbres/led_ecran_rouge.jpg' },
        { type: 'photo', label: 'Voyant vert', file: 'arbres/led_ecran_verte.jpg' },
      ],
      answers: [
        { label: 'Rouge', next: 's_rouge_pc_led', color: 'red' },
        { label: 'Éteint (aucune LED)', next: 's_eteint_machine', color: 'gray' },
        { label: 'Vert (image visible, autre problème)', next: 's_vert_symptome', color: 'green' },
      ],
      src: ['T', 'REP'],
    },

    /* ---- Branche rouge : LED écran rouge ---- */
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
        { label: 'Non, toujours éteint', next: 's_rouge_multiprise' },
      ],
      src: ['T', 'REP'],
    },
    s_rouge_multiprise: {
      type: 'question',
      title: 'La LED rouge de la multiprise intérieure est-elle allumée ?',
      help: "Multiprise blanche sur la platine du tableau électrique, dans la machine (ouvrir la façade, coulisser la platine vers l'avant). Le PC y est branché : si elle est éteinte, la panne vient de l'alimentation, pas du PC.",
      media: { type: 'photo', label: 'Platine du tableau électrique : la multiprise intérieure (blanche) est au milieu, sous la carte EPI RT', file: 'arbres/platine_tableau_electrique.jpg' },
      answers: [
        { label: 'Oui, LED rouge allumée', next: 'sol_changer_pc' },
        { label: 'Non, multiprise éteinte', next: 'a_debut' },
      ],
      src: ['REP', 'MF12 p.10-11'],
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
        { label: 'Non, écran rouge', next: 's_rouge_pc_verif' },
      ],
      src: ['T', 'REP'],
    },
    s_rouge_pc_verif: {
      type: 'question',
      title: 'Le PC est-il bien allumé et en marche ?',
      help: "LED du PC allumée et ventilateur qui tourne. Souvent, le PC s'est éteint ou ne marche plus.",
      media: { type: 'photo', label: 'Le PC est dans le compartiment du bas de la machine (entouré en rouge)', file: 'arbres/pc_emplacement.jpg' },
      answers: [
        { label: 'Oui, le PC est en marche', next: 'sol_changer_ecran' },
        { label: 'Non, ou je ne sais pas', next: 's_rouge_pc_relancer' },
      ],
      src: ['REP'],
    },
    s_rouge_pc_relancer: {
      type: 'action',
      title: 'Relancer le PC',
      steps: [
        "Aller à l'arrière du boîtier PC",
        'Passer le switch ON/OFF sur OFF, attendre 5 secondes, puis le remettre sur ON',
        'Revenir en façade et appuyer sur le bouton Power du PC',
        'Attendre 15 secondes',
      ],
      media: { type: 'photo', label: 'Le PC est dans le compartiment du bas de la machine (entouré en rouge)', file: 'arbres/pc_emplacement.jpg' },
      next: 's_rouge_pc_relancer_result',
      src: ['T', 'REP'],
    },
    s_rouge_pc_relancer_result: {
      type: 'question',
      title: 'Que se passe-t-il ?',
      answers: [
        { label: "L'image est revenue", next: 'sol_resolved' },
        { label: "Le PC a démarré, mais toujours pas d'image", next: 'sol_changer_ecran' },
        { label: 'Le PC reste éteint', next: 's_rouge_multiprise' },
      ],
      src: ['REP', 'LOG'],
    },

    /* ---- Branche éteinte, LED écran éteinte : machine (→ arbre Alimentation), câble, puis alimentation de l'écran
       (l'écran 17 pouces s'allume seul : pas d'étape bouton marche) ---- */
    s_eteint_machine: {
      type: 'question',
      title: 'Le reste de la machine est-il sous tension ?',
      help: 'LED du PC, voyant du lecteur de badge, voyants du modem.',
      answers: [
        { label: 'Non, tout semble éteint', next: 'a_debut' },
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
      title: 'La LED rouge de la multiprise intérieure est-elle allumée ?',
      help: "Multiprise blanche sur la platine du tableau électrique, dans la machine (ouvrir la façade, coulisser la platine vers l'avant). Son voyant rouge allumé = elle est sous tension.",
      media: { type: 'photo', label: 'Platine du tableau électrique : la multiprise intérieure (blanche) est au milieu, sous la carte EPI RT', file: 'arbres/platine_tableau_electrique.jpg' },
      answers: [
        { label: 'Oui, LED rouge allumée', next: 's_eteint_changer_alim' },
        { label: 'Non, multiprise éteinte', next: 'a_debut' },
      ],
      src: ['T', 'REP', 'MF12 p.10-11'],
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

    /* ---- Branche verte : image visible, autre problème ---- */
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
      title: "Corriger la résolution de l'écran",
      steps: [
        'Faire un clic droit sur le bureau Windows',
        "Cliquer sur « Paramètres d'affichage »",
        'Dans Résolution, choisir 1280 × 720 pour un écran 17 pouces, 800 × 600 pour un écran 8 pouces',
        'Cliquer sur « Conserver les modifications »',
      ],
      next: 's_vert_resolution_result',
      src: ['T', 'REP'],
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
      title: 'Les 6 voyants du modem sont-ils tous normaux ?',
      help: 'Normal : PWR bleu fixe, SYS clignote, SIM allumé, au moins une barre de signal allumée, Online bleu fixe, ETH clignote (le câble RJ45 relie le PC allumé au modem).',
      media: [
        { type: 'photo', label: 'Emplacement du modem dans la machine (entouré en rouge)', file: 'arbres/modem_emplacement.jpg' },
        { type: 'photo', label: 'Voyants du modem : ETH, Online, signal, SIM, SYS, PWR', file: 'sens_insertion_sim.png' },
      ],
      answers: [
        { label: 'Oui, tous normaux', next: 'i_tous_ok' },
        { label: "Non, au moins un voyant n'est pas normal", next: 'i_pwr_led' },
      ],
      src: ['SIM p.12', 'REP'],
    },

    /* ---- Tous les voyants normaux : synchro DistEPI ou déconnexions ---- */
    i_tous_ok: {
      type: 'question',
      title: 'Tous les voyants sont normaux : quel est le problème ?',
      answers: [
        { label: 'Erreur de synchronisation dans DistEPI', next: 'i_relancer_synchro' },
        { label: 'Déconnexions fréquentes', next: 'i_signal_faible' },
      ],
      src: ['REP'],
    },
    i_relancer_synchro: {
      type: 'action',
      title: 'Relancer une synchronisation',
      steps: [
        'Brancher un clavier sur le PC de la machine',
        'Maj + L ouvre le menu maintenance de DistEPI',
        'Appuyer sur « Synchroniser »',
        'Attendre le message « synchro effectué »',
      ],
      next: 'i_relancer_synchro_result',
      src: ['REP', 'DS p.4'],
    },
    i_relancer_synchro_result: {
      type: 'question',
      title: 'La synchronisation a-t-elle réussi ?',
      answers: [
        { label: 'Oui, « synchro effectué »', next: 'sol_resolved' },
        { label: 'Non, erreur de synchronisation', next: 'i_test_url' },
      ],
      src: ['REP'],
    },

    /* ---- Au moins un voyant anormal : contrôle voyant par voyant (PWR, SYS, SIM, signal, Online, ETH) ---- */
    i_pwr_led: {
      type: 'question',
      title: 'Le voyant PWR est-il bleu fixe ?',
      help: 'Les voyants se contrôlent dans cet ordre : PWR, SYS, SIM, signal, Online, ETH.',
      media: { type: 'photo', label: 'Voyants du modem : ETH, Online, signal, SIM, SYS, PWR', file: 'sens_insertion_sim.png' },
      answers: [
        { label: 'Oui', next: 'i_sys_led' },
        { label: 'Non, modem éteint', next: 'i_multiprise_modem' },
      ],
      src: ['SIM p.12', 'REP'],
    },
    i_multiprise_modem: {
      type: 'question',
      title: 'La LED rouge de la multiprise intérieure est-elle allumée ?',
      help: "Multiprise blanche sur la platine du tableau électrique, dans la machine (ouvrir la façade, coulisser la platine vers l'avant). Le modem y est branché : si elle est éteinte, la panne vient de l'alimentation, pas du modem.",
      media: { type: 'photo', label: 'Platine du tableau électrique : la multiprise intérieure (blanche) est au milieu, sous la carte EPI RT', file: 'arbres/platine_tableau_electrique.jpg' },
      answers: [
        { label: 'Oui, LED rouge allumée', next: 'i_alim_modem' },
        { label: 'Non, multiprise éteinte', next: 'a_debut' },
      ],
      src: ['REP'],
    },
    i_sys_led: {
      type: 'question',
      title: 'Le voyant SYS clignote-t-il ?',
      help: 'SYS qui clignote = le système du modem fonctionne.',
      media: { type: 'photo', label: 'Voyants du modem : ETH, Online, signal, SIM, SYS, PWR', file: 'sens_insertion_sim.png' },
      answers: [
        { label: 'Oui, il clignote', next: 'i_sim_led' },
        { label: 'Non, fixe ou éteint', next: 'i_reboot_sys' },
      ],
      src: ['SIM p.12', 'REP'],
    },
    i_reboot_sys: {
      type: 'action',
      title: 'Redémarrer le modem',
      steps: [
        "Débrancher l'alimentation du modem (jack) : il n'a pas d'interrupteur",
        'Attendre 30 secondes',
        "Rebrancher l'alimentation",
        'Attendre 2 à 3 minutes',
      ],
      media: { type: 'photo', label: 'Connecteurs du modem : 2 antennes, alimentation (PWR) et câble RJ45 du PC sur ETH', file: 'arbres/modem_connecteurs.jpg' },
      next: 'i_sys_result',
      src: ['REP', 'IM p.1'],
    },
    i_sys_result: {
      type: 'question',
      title: 'Le voyant SYS clignote-t-il maintenant ?',
      answers: [
        { label: 'Oui', next: 'i_debut' },
        { label: 'Non, toujours fixe ou éteint', next: 'i_reset_modem' },
      ],
      src: ['REP'],
    },
    i_signal_led: {
      type: 'question',
      title: 'Au moins une barre de signal est-elle allumée ?',
      help: 'Barres au centre du modem. Aucune barre = le modem ne capte pas le réseau mobile.',
      media: { type: 'photo', label: 'Voyants du modem : ETH, Online, signal, SIM, SYS, PWR', file: 'sens_insertion_sim.png' },
      answers: [
        { label: 'Oui', next: 'i_online_led' },
        { label: 'Non, aucune barre', next: 'i_signal_aucun' },
      ],
      src: ['SIM p.12', 'REP'],
    },
    i_signal_aucun: {
      type: 'action',
      title: 'Aider le modem à capter le réseau',
      steps: [
        'Vérifier que les 2 antennes sont bien vissées sur le modem',
        'Redresser les antennes verticalement',
        "Si possible, rapprocher le modem d'une fenêtre",
        'Vérifier avec un téléphone mobile que le réseau passe dans la pièce',
        'Attendre 1 à 2 minutes',
      ],
      media: { type: 'photo', label: 'Connecteurs du modem : 2 antennes, alimentation (PWR) et câble RJ45 du PC sur ETH', file: 'arbres/modem_connecteurs.jpg' },
      next: 'i_signal_aucun_result',
      src: ['T', 'IM p.1', 'REP'],
    },
    i_signal_aucun_result: {
      type: 'question',
      title: 'Au moins une barre de signal est-elle allumée maintenant ?',
      answers: [
        { label: 'Oui', next: 'i_debut' },
        { label: 'Non, toujours aucune barre', next: 'sol_antenne_ext' },
      ],
      src: ['REP'],
    },
    i_online_led: {
      type: 'question',
      title: 'Le voyant Online est-il bleu fixe ?',
      help: 'Online bleu fixe = le modem est connecté à internet.',
      media: { type: 'photo', label: 'Voyants du modem : ETH, Online, signal, SIM, SYS, PWR', file: 'sens_insertion_sim.png' },
      answers: [
        { label: 'Oui', next: 'i_eth_led' },
        { label: 'Non, éteint', next: 'i_reboot_modem' },
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
        { label: 'Oui', next: 'i_debut' },
        { label: 'Non', next: 'i_bloc_modem' },
      ],
      src: ['SIM p.12'],
    },
    i_bloc_modem: {
      type: 'action',
      title: "Essayer un autre bloc d'alimentation",
      steps: [
        "Débrancher le bloc d'alimentation du modem de la multiprise intérieure",
        'Le remplacer par un autre bloc identique (même tension, même jack)',
        'Rebrancher le jack dans le modem et attendre 1 minute',
      ],
      media: { type: 'photo', label: 'Connecteurs du modem : 2 antennes, alimentation (PWR) et câble RJ45 du PC sur ETH', file: 'arbres/modem_connecteurs.jpg' },
      next: 'i_bloc_modem_result',
      src: ['REP'],
    },
    i_bloc_modem_result: {
      type: 'question',
      title: 'Le voyant PWR est-il maintenant bleu fixe ?',
      answers: [
        { label: 'Oui', next: 'i_debut' },
        { label: 'Non, toujours éteint', next: 'sol_changer_modem' },
      ],
      src: ['REP'],
    },
    i_reboot_modem: {
      type: 'action',
      title: 'Redémarrer le modem',
      steps: [
        "Débrancher l'alimentation du modem (jack) : il n'a pas d'interrupteur",
        'Attendre 30 secondes',
        "Rebrancher l'alimentation",
        'Attendre 2 à 3 minutes que le modem se reconnecte au réseau mobile',
      ],
      media: { type: 'photo', label: 'Connecteurs du modem : 2 antennes, alimentation (PWR) et câble RJ45 du PC sur ETH', file: 'arbres/modem_connecteurs.jpg' },
      next: 'i_reboot_result',
      src: ['T', 'IM p.1', 'D24 p.4', 'REP'],
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
        { label: 'Non, toujours éteinte', next: 'i_lire_apn' },
      ],
      src: ['T'],
    },
    i_sim_led: {
      type: 'question',
      title: 'Le voyant SIM est-il allumé ?',
      help: 'SIM allumé = carte SIM détectée.',
      media: { type: 'photo', label: 'Voyants du modem : ETH, Online, signal, SIM, SYS, PWR', file: 'sens_insertion_sim.png' },
      answers: [
        { label: 'Oui, SIM allumé', next: 'i_signal_led' },
        { label: 'Non, SIM éteint', next: 'i_reinsertion_sim' },
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
        { label: 'Oui, LED SIM allumée', next: 'i_debut' },
        { label: 'Non, toujours éteinte', next: 'i_reset_modem' },
      ],
      src: ['T'],
    },
    i_lire_apn: {
      type: 'action',
      title: "Relever l'APN actuel du modem",
      help: "Le modem répond même sans internet : il suffit d'être devant la machine.",
      steps: [
        "Sur le PC de la machine, ouvrir un navigateur et aller à l'adresse 192.168.1.1",
        'Se connecter avec les identifiants du modem (procédure SIM Logimatiq)',
        "Menu Setup : noter l'APN affiché",
      ],
      media: { type: 'photo', label: 'Interface du modem (192.168.1.1) : menu Setup, champ APN', file: 'interface_web_setup_apn_modem.png' },
      next: 'i_setup_grizzly',
      src: ['REP', 'SIM'],
    },
    i_setup_grizzly: {
      type: 'action',
      title: 'Relancer la configuration du routeur (programme Logimatiq)',
      steps: [
        'Lancer setup_config_routeur_four_faith_1.0.0.17.exe (dossier C:\\EPI)',
        'Contrôle de compte : Oui, puis Suivant, Suivant, Installer',
        '« La connexion à Internet est-elle fournie par un routeur installé par Logimatiq ? » : Oui',
        "Choisir l'APN dans la liste (wbdata, matooma.m2m, orange…) : le même que celui relevé si la carte SIM n'a pas changé ; avec une nouvelle SIM, demander son APN au SAV ; puis « Enregistrer les paramètres et Fermer »",
        '« Configuration terminée avec succès » : OK, puis « Non, je préfère redémarrer plus tard » et Terminer',
        'Attendre 2 à 3 minutes et observer la LED Online',
      ],
      media: [
        { type: 'photo', label: 'Question « La connexion à Internet est-elle fournie par un routeur installé par Logimatiq ? » : répondre Oui', file: 'arbres/routeur_acces_internet.jpg' },
        { type: 'photo', label: "Choisir l'APN de la carte SIM dans la liste", file: 'arbres/routeur_apn.jpg' },
      ],
      next: 'i_setup_result',
      src: ['T', 'SIM p.8-10', 'REP'],
    },
    i_setup_result: {
      type: 'question',
      title: 'La LED « Online » est-elle maintenant allumée ?',
      answers: [
        { label: 'Oui, LED bleue allumée', next: 'sol_resolved' },
        { label: 'Non, toujours éteinte', next: 'i_reset_online' },
      ],
      src: ['T'],
    },
    i_reset_online: {
      type: 'action',
      title: 'Réinitialiser le modem (bouton RST)',
      help: "Dernier essai avant de faire changer le modem : le reset efface la configuration, il faut ensuite remettre l'APN.",
      steps: [
        "Relever l'APN du modem avant le reset (navigateur du PC → 192.168.1.1 → Setup), s'il n'est pas déjà noté",
        'Sur la face des voyants du modem, repérer le petit trou marqué RST',
        "Enfoncer une pointe (trombone, stylo fin) dans le trou et rester appuyé jusqu'à ce que les voyants changent (ils s'éteignent ou clignotent ensemble)",
        'Relâcher, puis attendre que le modem redémarre (2 à 3 minutes)',
        "Remettre l'APN : relancer setup_config_routeur_four_faith (dossier C:\\EPI), répondre Oui à « routeur installé par Logimatiq » et choisir le même APN",
        'Attendre 2 à 3 minutes et regarder le voyant Online',
      ],
      media: { type: 'photo', label: 'Voyants du modem : ETH, Online, signal, SIM, SYS, PWR', file: 'sens_insertion_sim.png' },
      next: 'i_reset_online_result',
      src: ['REP'],
    },
    i_reset_online_result: {
      type: 'question',
      title: 'Le voyant Online est-il maintenant bleu fixe ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non, toujours éteint', next: 'sol_sav_sim' },
      ],
      src: ['REP'],
    },
    i_reset_modem: {
      type: 'action',
      title: 'Réinitialiser le modem (bouton RST)',
      help: "Dernier essai avant de changer le modem : le reset efface la configuration, il faut ensuite remettre l'APN.",
      steps: [
        "Relever l'APN du modem avant le reset (navigateur du PC → 192.168.1.1 → Setup), si l'interface répond",
        'Sur la face des voyants du modem, repérer le petit trou marqué RST',
        "Enfoncer une pointe (trombone, stylo fin) dans le trou et rester appuyé jusqu'à ce que les voyants changent (ils s'éteignent ou clignotent ensemble)",
        'Relâcher, puis attendre que le modem redémarre (2 à 3 minutes)',
        "Remettre l'APN : relancer setup_config_routeur_four_faith (dossier C:\\EPI), répondre Oui à « routeur installé par Logimatiq » et choisir le même APN",
        'Attendre 2 à 3 minutes',
      ],
      media: { type: 'photo', label: 'Voyants du modem : ETH, Online, signal, SIM, SYS, PWR', file: 'sens_insertion_sim.png' },
      next: 'i_reset_result',
      src: ['REP'],
    },
    i_reset_result: {
      type: 'question',
      title: 'Le modem fonctionne-t-il maintenant ?',
      help: 'Les 6 voyants sont normaux et la connexion ne coupe plus.',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'sol_changer_modem' },
      ],
      src: ['REP'],
    },
    i_eth_led: {
      type: 'question',
      title: 'Le voyant ETH clignote-t-il ?',
      help: 'ETH clignote quand le câble RJ45 relie le PC allumé au modem : le modem échange avec le PC.',
      media: { type: 'photo', label: 'Voyants du modem : ETH, Online, signal, SIM, SYS, PWR', file: 'sens_insertion_sim.png' },
      answers: [
        { label: 'Oui, il clignote', next: 'i_tous_ok' },
        { label: 'Non, éteint ou fixe', next: 'i_rj45_check' },
      ],
      src: ['SIM p.12', 'REP'],
    },
    i_test_url: {
      type: 'action',
      title: "Tester l'accès au serveur EPIMAT depuis le PC",
      steps: [
        "Sur le PC de la machine, ouvrir un navigateur internet (n'importe lequel)",
        'Aller sur https://epimat.logimatiq.com',
        "Vérifier que la page s'ouvre sans avertissement de certificat",
      ],
      next: 'i_test_url_result',
      src: ['PR p.3-4', 'REP'],
    },
    i_test_url_result: {
      type: 'question',
      title: "La page s'ouvre-t-elle normalement ?",
      help: "Si le navigateur accède à l'adresse EPIMAT, les applications EPIMAT fonctionnent (prérequis réseau).",
      answers: [
        { label: 'Oui', next: 'i_clientsynch' },
        { label: 'Non', next: 'i_test_autre_site' },
      ],
      src: ['PR p.3'],
    },
    i_test_autre_site: {
      type: 'action',
      title: 'Ouvrir un autre site internet',
      steps: [
        'Dans le même navigateur, aller sur https://www.google.fr',
      ],
      next: 'i_test_autre_site_result',
      src: ['REP'],
    },
    i_test_autre_site_result: {
      type: 'question',
      title: "Le site s'ouvre-t-il ?",
      help: "Oui : internet marche, c'est le serveur Logimatiq qui ne répond pas. Non : le PC n'arrive pas à aller sur internet.",
      answers: [
        { label: 'Oui', next: 'sol_sav_serveur' },
        { label: 'Non', next: 'sol_sav' },
      ],
      src: ['REP'],
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
        { label: 'Non, toujours sans réseau', next: 'i_eth_pc' },
      ],
      src: ['T'],
    },
    i_eth_pc: {
      type: 'question',
      title: 'Le PC de la machine est-il allumé ?',
      help: "Le voyant ETH ne clignote pas si le PC est éteint. PC allumé : sa LED est allumée et l'écran affiche une image.",
      media: { type: 'photo', label: 'Le PC est dans le compartiment du bas de la machine (entouré en rouge)', file: 'arbres/pc_emplacement.jpg' },
      answers: [
        { label: 'Oui, PC allumé', next: 'i_rj45_autre' },
        { label: 'Non, PC éteint', next: 'i_allumer_pc' },
      ],
      src: ['REP'],
    },
    i_allumer_pc: {
      type: 'action',
      title: 'Allumer le PC',
      steps: [
        'Appuyer sur le bouton Power en façade du boîtier PC',
        "Si rien ne se passe, passer le switch ON/OFF à l'arrière sur ON",
        'Réappuyer sur le bouton Power',
        'Attendre que Windows et DistEPI démarrent',
      ],
      media: { type: 'photo', label: 'Le PC est dans le compartiment du bas de la machine (entouré en rouge)', file: 'arbres/pc_emplacement.jpg' },
      next: 'i_pc_demarre',
      src: ['T', 'REP'],
    },
    i_pc_demarre: {
      type: 'question',
      title: 'Le PC a-t-il démarré ?',
      answers: [
        { label: 'Oui', next: 'i_debut' },
        { label: 'Non, toujours éteint', next: 'b_multiprise' },
      ],
      src: ['T', 'REP'],
    },
    i_rj45_autre: {
      type: 'action',
      title: 'Essayer un autre câble RJ45',
      steps: [
        'Remplacer le câble RJ45 entre le PC et le port ETH du modem par un autre câble',
        "Enfoncer chaque bout jusqu'au clic",
        'Attendre 1 minute et regarder le voyant ETH',
      ],
      next: 'i_rj45_autre_result',
      src: ['REP'],
    },
    i_rj45_autre_result: {
      type: 'question',
      title: 'Le voyant ETH clignote-t-il maintenant ?',
      answers: [
        { label: 'Oui', next: 'i_debut' },
        { label: 'Non, toujours éteint ou fixe', next: 'i_reset_modem' },
      ],
      src: ['REP'],
    },
    i_clientsynch: {
      type: 'action',
      title: 'Tester avec ClientSynch DB EPI (Grizzly)',
      steps: [
        'Sur le bureau Windows, ouvrir le logiciel ClientSynch DB EPI',
        "Lancer le test de réception et d'envoi de données",
        'Observer si le test passe ou échoue',
      ],
      media: { type: 'photo', label: 'ClientSynch DB EPI : procédure (photos à venir)' },
      next: 'i_clientsynch_result',
      src: ['T', 'REP'],
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
        { label: 'Non, toujours instable', next: 'i_reset_modem' },
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
      next: 'b_pc_demarre',
      src: ['T'],
    },
    b_pc_demarre: {
      type: 'question',
      title: 'Le PC a-t-il démarré ? (LED allumée)',
      answers: [
        { label: 'Oui, LED allumée', next: 'b_led_apres_pc' },
        { label: 'Non, toujours éteint', next: 'b_multiprise' },
      ],
      src: ['T', 'REP'],
    },
    b_multiprise: {
      type: 'question',
      title: 'La LED rouge de la multiprise intérieure est-elle allumée ?',
      help: "Multiprise blanche sur la platine du tableau électrique, dans la machine (ouvrir la façade, coulisser la platine vers l'avant). Le PC y est branché : si elle est éteinte, la panne vient de l'alimentation, pas du PC.",
      media: { type: 'photo', label: 'Platine du tableau électrique : la multiprise intérieure (blanche) est au milieu, sous la carte EPI RT', file: 'arbres/platine_tableau_electrique.jpg' },
      answers: [
        { label: 'Oui, LED rouge allumée', next: 'sol_changer_pc' },
        { label: 'Non, multiprise éteinte', next: 'a_debut' },
      ],
      src: ['REP', 'MF12 p.10-11'],
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

    /* ---- LED du lecteur allumée : que se passe-t-il au passage du badge ? ---- */
    b_symptome: {
      type: 'question',
      title: 'Que se passe-t-il quand on présente le badge ?',
      help: 'Le lecteur émet un bip quand il lit un badge.',
      answers: [
        { label: 'Rien : pas de bip, aucune réaction', next: 'b_autre_badge' },
        { label: "Bip, mais rien ne se passe à l'écran", next: 'b_bip_redemarrer' },
        { label: "L'écran affiche « INITIALISATION BADGE » et « Tapez votre code ! »", next: 'b_init_badge' },
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
        { label: "Non, c'est un nouveau type de badge", next: 'b_reprogrammer' },
      ],
      src: ['LOG'],
    },
    b_notepad_langue: {
      type: 'action',
      title: 'Préparer le test Bloc-notes : passer le clavier en anglais',
      help: 'Le lecteur USB fonctionne comme un clavier : il « tape » le numéro du badge.',
      steps: [
        'Cliquer sur la langue en bas à droite de la barre des tâches Windows',
        'Sélectionner « ENG » (anglais) comme langue de saisie',
        'Ouvrir le Bloc-notes (Notepad) : Démarrer → Notepad',
        'Cliquer dans la zone de texte du Bloc-notes',
      ],
      media: { type: 'photo', label: 'Barre des tâches Windows : choisir ENG, Anglais (États-Unis)', file: 'arbres/clavier_anglais.png' },
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
      title: 'Corriger le nombre de chiffres du badge dans Admin Base',
      help: 'Admin Base (C:\\EPI\\AdminBase.exe) administre la base de données EPIMAT sur le PC de la machine : ne toucher à aucun autre bouton (Supprimer Base, Restaurer Base…).',
      steps: [
        'Compter le nombre de chiffres lus dans le Bloc-notes',
        'Lancer C:\\EPI\\AdminBase.exe',
        'Cliquer sur « Connecter la base » : le voyant passe à « CONNECTE » (vert)',
        'Dans le champ sous « Format Badge » (ex. F00:XXXXXXX), chaque X est un chiffre du badge : mettre autant de X que de chiffres lus',
        'Cliquer sur le bouton « Format Badge » pour valider, puis redémarrer DistEPI',
      ],
      media: [
        { type: 'photo', label: 'Dossier C:\\EPI : AdminBase.exe', file: 'arbres/adminbase_exe.png' },
        { type: 'photo', label: 'Admin Base connecté (voyant « CONNECTE ») : champ « Format Badge » en bas à droite, un X par chiffre', file: 'arbres/adminbase_format_badge.png' },
      ],
      next: 'b_admin_result',
      src: ['T', 'REP'],
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
      title: 'Reprogrammer le lecteur (1/2) : trouver la technologie du badge',
      help: "Lecteur Elatec TWN4, programmé avec AppBlaster sur le PC de la machine. On charge d'abord le firmware « Tracer », qui écrit la technologie du badge.",
      steps: [
        'Ouvrir le dossier C:\\EPI\\TWN4DevPack480 Nouveau et lancer AppBlaster.exe',
        '« Program Firmware Image » → « Select Image » → dossier Firmware → TWN4_xKx480_TRC229_Multi_Tracer.bix',
        'Cliquer « Program Image » et attendre « Done. »',
        'Clavier Windows en anglais (ENG), ouvrir le Bloc-notes et passer le badge',
        'Noter la technologie affichée (ex. ISO14443A/MIFARE Classic)',
      ],
      media: [
        { type: 'photo', label: 'Dossier TWN4DevPack480 : AppBlaster.exe et son menu (« Program Firmware Image », « New Project (Configurable) »)', file: 'arbres/twn4_appblaster.png' },
        { type: 'photo', label: 'Dossier Firmware : choisir TWN4_xKx480_TRC229_Multi_Tracer.bix', file: 'arbres/twn4_tracer.png' },
        { type: 'photo', label: '« Program Image » terminé : « Done. »', file: 'arbres/twn4_program_done.png' },
        { type: 'photo', label: 'Bloc-notes : le lecteur écrit la technologie du badge (ici MIFARE Classic) et son UID (masqué)', file: 'arbres/twn4_bloc_notes.png' },
      ],
      next: 'b_reprog_projet',
      src: ['REP'],
    },
    b_reprog_projet: {
      type: 'action',
      title: 'Reprogrammer le lecteur (2/2) : le programmer pour cette technologie',
      steps: [
        'Dans AppBlaster : « New Project (Configurable) » → double-cliquer sur le modèle « Multi Keyboard V4.80, App Standard V2.04 »',
        "« Transponder Types » → choisir la catégorie (ex. MIFARE) puis le type (ex. MIFARE Classic) → double-cliquer pour l'ajouter dans « Active Transponder Types »",
        'Sous le type ajouté, « Output Format » : Hexadecimal ou Decimal selon le numéro attendu',
        'Cliquer « Create Image », puis « Program Image », et attendre « Done. »',
        'Retester dans le Bloc-notes (clavier en anglais) en passant le badge',
      ],
      media: [
        { type: 'photo', label: 'New Project (Configurable) : modèle « Multi Keyboard V4.80, App Standard V2.04 »', file: 'arbres/twn4_modele.png' },
        { type: 'photo', label: 'Transponder Types : MIFARE → MIFARE Classic, ajouté dans « Active Transponder Types »', file: 'arbres/twn4_transponder.png' },
        { type: 'photo', label: 'Output Format : Hexadecimal ou Decimal', file: 'arbres/twn4_output_format.png' },
        { type: 'photo', label: '« Create Image » puis « Program Image » : « Done. » en bas', file: 'arbres/twn4_program_ok.png' },
      ],
      next: 'b_reprogrammer_result',
      src: ['REP'],
    },
    b_reprogrammer_result: {
      type: 'question',
      title: 'Dans le Bloc-notes, le numéro lu est-il celui du badge ?',
      answers: [
        { label: 'Oui', next: 'b_admin_base' },
        { label: "Non : numéro différent ou à l'envers", next: 'b_reprog_iterer' },
        { label: "Rien ne s'affiche", next: 'sol_changer_lecteur' },
      ],
      src: ['REP'],
    },
    b_reprog_iterer: {
      type: 'action',
      title: 'Ajuster le format de sortie du lecteur',
      help: "Certains numéros de badge sont lus à l'envers : il faut parfois plusieurs essais.",
      steps: [
        'Dans le projet AppBlaster, changer « Output Format » (Hexadecimal ↔ Decimal)',
        'Ou, dans « Bit Manipulation », cocher « Reverse Byte Order »',
        '« Create Image », « Program Image », puis retester dans le Bloc-notes',
        "Recommencer jusqu'à obtenir le bon numéro",
      ],
      media: { type: 'photo', label: 'Bit Manipulation : « Reverse Byte Order »', file: 'arbres/twn4_reverse_byte.png' },
      next: 'b_reprog_iterer_result',
      src: ['REP'],
    },
    b_reprog_iterer_result: {
      type: 'question',
      title: 'Le numéro lu est-il maintenant le bon ?',
      answers: [
        { label: 'Oui', next: 'b_admin_base' },
        { label: 'Non, toujours pas', next: 'sol_sav' },
      ],
      src: ['REP'],
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
      help: "Cet écran apparaît quand la machine ne trouve pas le numéro du badge : badge nouveau, ou numéro mal saisi dans l'extranet.",
      steps: [
        "Le salarié tape son numéro de matricule, celui de sa fiche dans l'extranet",
        'Certains clients mettent comme matricule le numéro inscrit sur le badge (par exemple sur 7 chiffres, zéros devant : 529545 → 0529545)',
        'Vérifier le nom affiché, puis valider avec OK',
      ],
      media: { type: 'photo', label: 'Écran « INITIALISATION BADGE » : le salarié tape son matricule', file: 'arbres/badge_initialisation.jpg' },
      next: 'b_init_result',
      src: ['IB p.1', 'REP'],
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
        "Vérifier le numéro de badge (7 chiffres ; attention aux fautes de frappe), le profil et l'accès à cette machine",
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
        'Attendre le message « synchro effectué », puis représenter le badge',
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
      title: 'Vérifier le numéro lu par le lecteur',
      steps: [
        'Passer le badge devant le lecteur',
        "Le numéro lu s'affiche en haut de l'écran de DistEPI",
        'Le comparer avec le numéro imprimé sur le badge',
      ],
      next: 'b_mauvais_result',
      src: ['MU18 p.12', 'REP'],
    },
    b_mauvais_result: {
      type: 'question',
      title: 'Le numéro lu dans le Bloc-notes correspond-il au badge ?',
      answers: [
        { label: 'Oui, même numéro : il est mal saisi dans la base', next: 'b_corriger_bdd' },
        { label: 'Non, numéro différent : le lecteur est à reprogrammer', next: 'b_reprogrammer' },
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
       ARBRE 4 — ALIMENTATION  (préfixe a_) — EPIMAT 13 et 14
       Point d'entrée : a_debut (aussi depuis l'arbre Écran : « tout semble éteint »)
       ==================================================================== */
    a_debut: {
      type: 'question',
      title: 'La prise du local qui alimente la machine a-t-elle du courant ?',
      help: 'Tester la prise avec un autre appareil.',
      answers: [
        { label: 'Oui', next: 'a_cable_machine' },
        { label: 'Non', next: 'a_disjoncteur_local' },
      ],
      src: ['D24 p.1', 'REP'],
    },
    a_disjoncteur_local: {
      type: 'action',
      title: 'Vérifier le disjoncteur du tableau électrique du local',
      steps: [
        'Repérer le disjoncteur qui alimente la prise',
        "Le réarmer s'il est déclenché",
      ],
      next: 'a_disjoncteur_result',
      src: ['D24 p.1', 'T'],
    },
    a_disjoncteur_result: {
      type: 'question',
      title: 'Le courant est-il revenu à la prise ?',
      answers: [
        { label: 'Oui', next: 'a_cable_machine' },
        { label: 'Non', next: 'sol_disjoncteur' },
      ],
      src: ['LOG'],
    },
    a_cable_machine: {
      type: 'action',
      title: 'Vérifier le câble secteur de la machine',
      steps: [
        'Le câble fourni sort par la partie inférieure de la machine',
        "Vérifier qu'il est bien enfoncé côté machine et côté prise",
      ],
      next: 'a_interrupteur',
      src: ['MU18 p.4', 'D24 p.1'],
    },
    a_interrupteur: {
      type: 'action',
      title: "Vérifier l'interrupteur général de la machine",
      help: "Il n'a pas de voyant : seule sa position compte.",
      steps: [
        "Ouvrir la façade et coulisser la platine du tableau électrique vers l'avant",
        "Sur l'alimentation générale, repérer l'interrupteur rouge O / I, à côté du porte-fusible",
        "S'il est sur O, le mettre sur I",
      ],
      media: { type: 'photo', label: "L'interrupteur général rouge O / I (sans voyant), à côté du porte-fusible", file: 'arbres/fusible_cache_noir.jpg' },
      next: 'a_machine_ok',
      src: ['REP', 'FI'],
    },
    a_machine_ok: {
      type: 'question',
      title: 'La machine est-elle sous tension maintenant ?',
      help: 'LED du PC, écran, LED du lecteur de badge.',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'a_coupe_circuits' },
      ],
      src: ['LOG'],
    },

    /* ---- Dans la machine : alimentation générale (coupe-circuits, fusible) ---- */
    a_coupe_circuits: {
      type: 'question',
      title: "Sur l'alimentation générale, un coupe-circuit est-il déclenché ?",
      help: "Ouvrir la façade, coulisser la platine du tableau électrique vers l'avant. L'alimentation générale (230 VAC → 24 / 5 V DC) est en haut, avec 2 fusibles réarmables : 24 V (3 A) et 5 V (1 A).",
      media: { type: 'photo', label: 'Alimentation générale, en haut de la platine : fusibles réarmables 24 V (3 A) et 5 V (1 A)', file: 'arbres/alim_generale_fusibles.jpg' },
      answers: [
        { label: 'Oui, un bouton est sorti', next: 'a_rearmer' },
        { label: 'Non', next: 'a_fusible' },
      ],
      src: ['MF12 p.10-11', 'FI'],
    },
    a_rearmer: {
      type: 'action',
      title: 'Réarmer le coupe-circuit',
      steps: [
        'Appuyer sur le bouton du coupe-circuit déclenché',
        "Observer s'il redéclenche aussitôt",
      ],
      media: { type: 'photo', label: 'Alimentation générale, en haut de la platine : fusibles réarmables 24 V (3 A) et 5 V (1 A)', file: 'arbres/alim_generale_fusibles.jpg' },
      next: 'a_rearmer_result',
      src: ['FI', 'D24 p.1'],
    },
    a_rearmer_result: {
      type: 'question',
      title: 'Le coupe-circuit redéclenche-t-il aussitôt ?',
      answers: [
        { label: 'Oui, il redéclenche', next: 'sol_court_circuit' },
        { label: 'Non, il tient', next: 'a_machine_ok2' },
      ],
      src: ['FI'],
    },
    a_machine_ok2: {
      type: 'question',
      title: 'La machine fonctionne-t-elle normalement ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'a_fusible' },
      ],
      src: ['LOG'],
    },
    a_fusible: {
      type: 'action',
      title: 'Contrôler le fusible 4 A min / 5 A max',
      steps: [
        'Couper le secteur : débrancher la prise de la machine',
        "Sur l'alimentation générale, sortir le porte-fusible (cache noir) avec un tournevis plat",
        "Contrôler le fusible ; s'il est grillé, le remplacer par un fusible de 4 A minimum, 5 A maximum",
        'Remettre le porte-fusible, puis rebrancher la prise',
      ],
      media: [
        { type: 'photo', label: 'Sortir le porte-fusible (cache noir) avec un tournevis plat', file: 'arbres/fusible_cache_noir.jpg' },
        { type: 'photo', label: 'Le fusible dans son porte-fusible', file: 'arbres/fusible_sorti.jpg' },
      ],
      next: 'a_fusible_result',
      src: ['R', 'FI', 'REP'],
    },
    a_fusible_result: {
      type: 'question',
      title: "La machine s'allume-t-elle ?",
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'sol_changer_alim_generale' },
      ],
      src: ['LOG'],
    },

    /* ====================================================================
       ARBRE 5 — TAMBOUR  (préfixe t_) — EPIMAT 13 et 14 (cartes EPI 05 : EPIMAT 13 seulement)
       Point d'entrée : t_debut
       ==================================================================== */
    t_debut: {
      type: 'question',
      title: 'Quel est le problème du tambour ?',
      answers: [
        { label: "L'écran indique « EN PANNE » / le tambour ne tourne plus", next: 't_rotation_manuelle' },
        { label: "L'écran affiche « Disjoncteur déclenché »", next: 't_coupe_circuit_24v' },
        { label: "Le tambour s'arrête sur la mauvaise colonne", next: 't_position' },
        { label: "Le tambour dépasse la colonne ou s'arrête décalé", next: 't_vitesse' },
        { label: 'Un article ou un objet bloque le tambour', next: 't_bloque' },
      ],
      src: ['D24 p.1', 'REP'],
    },
    t_rotation_manuelle: {
      type: 'question',
      title: 'Le tambour tourne-t-il avec le bouton « Drum rotation » (rotation manuelle) ?',
      help: "Bouton en haut du châssis, à l'avant droit. Sécurité : ne jamais mettre les mains dans la machine pendant une rotation du tambour.",
      answers: [
        { label: 'Non, il ne tourne pas', next: 't_coupe_circuit_24v' },
        { label: 'Oui, il tourne', next: 't_trappes_fermees' },
      ],
      src: ['D24 p.1', 'MU18 p.46', 'MF12 p.2', 'REP'],
    },
    t_coupe_circuit_24v: {
      type: 'action',
      title: "Réarmer le coupe-circuit 24 V de l'alimentation générale",
      help: "C'est le « disjoncteur tambour » des manuels.",
      steps: [
        "Coulisser la platine du tableau électrique vers l'avant",
        'Si le bouton du coupe-circuit 24 V (3 A) est sorti, appuyer pour le réarmer',
        "S'il redéclenche aussitôt, ne pas insister",
      ],
      media: { type: 'photo', label: 'Alimentation générale, en haut de la platine : fusibles réarmables 24 V (3 A) et 5 V (1 A)', file: 'arbres/alim_generale_fusibles.jpg' },
      next: 't_coupe_result',
      src: ['D24 p.1', 'MF12 p.11', 'REP'],
    },
    t_coupe_result: {
      type: 'question',
      title: 'Le tambour tourne-t-il maintenant avec le bouton « Drum rotation » ?',
      help: 'Sécurité : ne jamais mettre les mains dans la machine pendant une rotation du tambour.',
      answers: [
        { label: 'Oui', next: 't_recaler' },
        { label: 'Non', next: 'sol_sav_tambour' },
      ],
      src: ['D24 p.1', 'REP'],
    },
    t_recaler: {
      type: 'action',
      title: 'Recaler les EPI',
      help: "Pas de recalibrage du tambour à faire : au lancement de DistEPI, il s'initialise seul (il va à la colonne la plus proche pour valider le capteur CP1 et connaître son numéro de colonne). Sécurité : ne jamais mettre les mains dans la machine pendant une rotation du tambour.",
      steps: [
        'Avec le bouton « Drum rotation », faire faire un tour complet au tambour',
      ],
      next: 't_test_distrib',
      src: ['D24 p.1', 'REP'],
    },
    t_test_distrib: {
      type: 'question',
      title: 'La distribution test fonctionne-t-elle ?',
      help: 'Passer un badge, choisir une famille puis un article, OK, puis Terminer.',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'sol_sav' },
      ],
      src: ['TU p.1-2'],
    },
    t_trappes_fermees: {
      type: 'question',
      title: 'Toutes les trappes sont-elles bien fermées ?',
      help: "Le tambour ne tourne pas tant qu'une trappe n'est pas détectée fermée.",
      answers: [
        { label: 'Non, une trappe est ouverte ou mal fermée', next: 't_fermer_trappe' },
        { label: 'Oui, toutes fermées', next: 't_cable_scsi' },
      ],
      src: ['D24 p.1', 'ME15 p.16'],
    },
    t_fermer_trappe: {
      type: 'action',
      title: 'Fermer la trappe',
      steps: [
        "Retirer l'article ou l'obstacle qui empêche la fermeture",
        'Refermer la trappe',
      ],
      next: 't_fermer_result',
      src: ['D24 p.1'],
    },
    t_fermer_result: {
      type: 'question',
      title: 'La machine fonctionne-t-elle à nouveau ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 't_cable_scsi' },
      ],
      src: ['LOG'],
    },
    t_cable_scsi: {
      type: 'action',
      title: 'Vérifier le câble SCSI blanc (PC ↔ carte EPI 01)',
      help: "C'est la liaison entre le PC et la machine. Mal enfoncé, il donne des pannes bizarres : certains capteurs s'allument et d'autres non, le tambour ne tourne pas alors que tout semble bon. C'est presque le premier contrôle à faire. Pas besoin d'éteindre la machine.",
      steps: [
        'Repérer le câble SCSI blanc entre le PC (carte Advantech) et la carte EPI 01 du tableau électrique',
        "Vérifier qu'il est bien enfoncé des deux côtés",
        'Au besoin, le débrancher complètement puis le rebrancher fermement',
      ],
      media: { type: 'photo', label: "Platine du tableau électrique tirée vers l'avant : la carte EPI 01 est à droite, avec ses nappes", file: 'arbres/platine_epi01.jpg' },
      next: 't_cable_scsi_result',
      src: ['REP', 'MF12 p.11'],
    },
    t_cable_scsi_result: {
      type: 'question',
      title: 'La machine fonctionne-t-elle à nouveau ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 't_ouvrir_debes' },
      ],
      src: ['LOG'],
    },
    t_ouvrir_debes: {
      type: 'action',
      title: 'Ouvrir DEBES',
      help: 'Case STATUS : « NoDevice … - OK » = le PC dialogue avec la carte Advantech. Sinon, le numéro de la carte Advantech est mal renseigné dans C:\\EPI\\AUTOMAT.INI : le technicien le corrige.',
      steps: [
        'Brancher un clavier sur le PC de la machine',
        'Fermer DistEPI : touches Maj + F',
        'Lancer C:\\EPI\\DebesEPI.exe',
        'À la fin des tests : fermer DEBES (bouton « Fermeture ») et relancer DistEPI',
      ],
      media: { type: 'photo', label: 'DEBES : boutons de rotation du tambour et des trappes ; voyants FCPF (trappe fermée), CPT1 à CPT6 (position), Sécu tambour OK', file: 'arbres/debes_ecran.jpg' },
      next: 't_debes_fcpf',
      src: ['REP', 'ME15 p.18', 'D24 p.2'],
    },
    t_debes_fcpf: {
      type: 'question',
      title: 'Dans DEBES, les voyants FCPF (trappes fermées) sont-ils tous verts ?',
      help: 'FCPF1 à FCPF13 : capteur « trappe fermée » de chaque trappe ou porte.',
      media: { type: 'photo', label: 'DEBES : boutons de rotation du tambour et des trappes ; voyants FCPF (trappe fermée), CPT1 à CPT6 (position), Sécu tambour OK', file: 'arbres/debes_ecran.jpg' },
      answers: [
        { label: 'Non, un voyant FCPF est éteint', next: 'tr_capteur' },
        { label: 'Oui, tous verts', next: 't_secu_tambour' },
      ],
      src: ['ME15 p.15-16'],
    },
    t_secu_tambour: {
      type: 'question',
      title: 'Dans DEBES, le voyant « Sécu tambour OK » est-il vert ?',
      help: "S'il est éteint alors que toutes les trappes sont fermées, une carte de trappe bloque la sécurité du tambour.",
      media: { type: 'photo', label: 'DEBES : boutons de rotation du tambour et des trappes ; voyants FCPF (trappe fermée), CPT1 à CPT6 (position), Sécu tambour OK', file: 'arbres/debes_ecran.jpg' },
      answers: [
        { label: 'Non, il est éteint', next: 't_modele_secu' },
        { label: 'Oui, il est vert', next: 'sol_sav_tambour' },
      ],
      src: ['D24 p.2', 'E05 p.1', 'REP'],
    },
    t_modele_secu: {
      type: 'question',
      title: 'La machine a-t-elle des trappes (EPIMAT 13) ou des portes à gâche (EPIMAT 14) ?',
      help: "Ça se voit sur la façade : l'EPIMAT 14 a des portes manuelles à gâche, pilotées par des cartes EPI 02.",
      media: { type: 'photo', label: 'EPIMAT 13 : façade à trappes, avec les moteurs de trappe (manuel 2012)', file: 'arbres/epimat13_trappes.jpg' },
      answers: [
        { label: 'Des trappes (EPIMAT 13)', next: 't_test_epi05' },
        { label: 'Des portes à gâche (EPIMAT 14)', next: 'sol_sav_epi02' },
      ],
      src: ['REP'],
    },
    t_test_epi05: {
      type: 'action',
      title: 'Trouver la carte EPI 05 qui bloque le tambour',
      help: 'Sécurité : ne jamais mettre les mains dans la machine pendant une rotation du tambour.',
      steps: [
        'Porte ouverte, retirer le capot des cartes EPI 05',
        'Débrancher toutes les cartes EPI 05',
        'Sur la carte à tester, mettre la configuration de test (DIP)',
        'Brancher cette carte seule',
        'Dans DEBES, lancer « Rotation TAMBOUR » : si le tambour tourne, la carte est bonne',
        "Remettre sa configuration d'origine et recommencer avec la carte suivante",
      ],
      media: [
        { type: 'photo', label: 'Les cartes EPI 05, une par trappe, derrière la façade (EPIMAT 13)', file: 'arbres/epi05_cartes.jpg' },
        { type: 'photo', label: 'Carte EPI 05 : interrupteurs DIP de configuration', file: 'arbres/epi05_dip_test.jpg' },
      ],
      next: 't_test_epi05_result',
      src: ['E05 p.1-2', 'D24 p.1', 'D24 p.5', 'REP'],
    },
    t_test_epi05_result: {
      type: 'question',
      title: 'Avez-vous trouvé la carte EPI 05 qui empêche la rotation ?',
      answers: [
        { label: 'Oui', next: 'sol_changer_epi05' },
        { label: 'Non', next: 'sol_sav_tambour' },
      ],
      src: ['E05 p.2'],
    },
    t_position: {
      type: 'action',
      title: 'Lire la position du tambour dans DEBES',
      steps: [
        'Fermer DistEPI (Maj + F, clavier branché) et lancer DEBES (C:\\EPI\\DebesEPI.exe)',
        'Regarder la case « Position Colonne » (« Column Position » sur les anciennes versions)',
        'Elle est calculée par les capteurs CPT1 à CPT6 (circuit LOG 03) : voyant éteint = trou du disque = bit à 1',
        'Poids : CPT1 = 1, CPT2 = 2, CPT3 = 4, CPT4 = 8, CPT5 = 16, CPT6 = 32 (ex : CPT3 et CPT6 éteints = 36)',
        'Comparer avec la colonne réellement face à la trappe',
      ],
      media: { type: 'photo', label: 'DEBES : boutons de rotation du tambour et des trappes ; voyants FCPF (trappe fermée), CPT1 à CPT6 (position), Sécu tambour OK', file: 'arbres/debes_ecran.jpg' },
      next: 't_position_result',
      src: ['ME15 p.15-16', 'REP'],
    },
    t_position_result: {
      type: 'question',
      title: 'La position affichée correspond-elle à la colonne réelle ?',
      answers: [
        { label: 'Oui', next: 't_arret_cp1' },
        { label: 'Non', next: 't_pos_scsi' },
      ],
      src: ['ME15 p.15'],
    },
    t_pos_scsi: {
      type: 'action',
      title: 'Vérifier le câble SCSI blanc (PC ↔ carte EPI 01)',
      help: "Mal enfoncé, ce câble donne des pannes bizarres : certains capteurs s'allument et d'autres non. Pas besoin d'éteindre la machine.",
      steps: [
        'Repérer le câble SCSI blanc entre le PC (carte Advantech) et la carte EPI 01 du tableau électrique',
        "Vérifier qu'il est bien enfoncé des deux côtés",
        'Au besoin, le débrancher complètement puis le rebrancher fermement',
      ],
      media: { type: 'photo', label: "Platine du tableau électrique tirée vers l'avant : la carte EPI 01 est à droite, avec ses nappes", file: 'arbres/platine_epi01.jpg' },
      next: 't_pos_scsi_result',
      src: ['REP', 'MF12 p.11'],
    },
    t_pos_scsi_result: {
      type: 'question',
      title: 'La position affichée dans DEBES est-elle juste maintenant ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 't_aligner_log03' },
      ],
      src: ['LOG'],
    },
    t_arret_cp1: {
      type: 'question',
      title: "Le tambour s'arrête-t-il bien en face de la colonne ?",
      help: "L'arrêt sur position est donné par le capteur CP1 (circuit LOG 04) quand la fente du disque passe dans la fourche.",
      answers: [
        { label: 'Oui', next: 'sol_sav' },
        { label: "Non, il s'arrête décalé", next: 't_vitesse' },
      ],
      src: ['ME15 p.16', 'L34 p.2'],
    },
    t_aligner_log03: {
      type: 'action',
      title: "Nettoyer le disque, puis vérifier l'alignement des capteurs LOG 03 et LOG 04",
      steps: [
        'Nettoyer le disque du tambour au pinceau pour enlever la poussière',
        'Les 2 circuits sont au-dessus du tambour, au centre, sur une équerre fixée à la barre oméga',
        'LOG 03 : les 6 capteurs doivent être alignés sur les trous du disque',
        'LOG 04 : la fourche doit être alignée sur la fente du disque, sans frotter le disque',
        'Si besoin, desserrer le circuit et le décaler légèrement',
      ],
      media: { type: 'photo', label: 'Les circuits LOG 03 / LOG 04 au-dessus du tambour, sur leur équerre', file: 'arbres/log03_log04.jpg' },
      next: 't_aligner_result',
      src: ['L34 p.1-2', 'MF12 p.12', 'ME15 p.13-14', 'REP'],
    },
    t_aligner_result: {
      type: 'question',
      title: 'La position est-elle juste maintenant ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'sol_changer_log03' },
      ],
      src: ['LOG'],
    },
    t_vitesse: {
      type: 'action',
      title: 'Régler la vitesse lente du tambour (carte GR76)',
      help: "Le tambour dépasse la colonne ou s'arrête décalé : on règle sa vitesse lente. Sécurité : ne jamais mettre les mains dans la machine pendant une rotation du tambour.",
      steps: [
        "Sur le tableau électrique, repérer la carte GR76 (dissipateur noir ; « GR 74 » sur les photos des anciens manuels, c'est la même carte)",
        'Potentiomètre bleu 1 tour : sens horaire = plus lent, sens antihoraire = plus rapide',
        "Tourner d'un quart de tour entre chaque test",
        'Tester dans DEBES (DistEPI fermé avec Maj + F) avec « Vitesse Lente TAMBOUR » et « Rotation TAMBOUR »',
      ],
      media: { type: 'photo', label: 'Carte GR76 : potentiomètre bleu de la vitesse lente', file: 'arbres/gr76_potentiometre.jpg' },
      next: 't_vitesse_result',
      src: ['VL p.1', 'ME15 p.15', 'REP'],
    },
    t_vitesse_result: {
      type: 'question',
      title: "Le tambour s'arrête-t-il correctement sur chaque colonne ?",
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 't_vit_scsi' },
      ],
      src: ['LOG'],
    },
    t_vit_scsi: {
      type: 'action',
      title: 'Vérifier le câble SCSI blanc (PC ↔ carte EPI 01)',
      help: "Mal enfoncé, ce câble donne des pannes bizarres : certains capteurs s'allument et d'autres non. Pas besoin d'éteindre la machine.",
      steps: [
        'Repérer le câble SCSI blanc entre le PC (carte Advantech) et la carte EPI 01 du tableau électrique',
        "Vérifier qu'il est bien enfoncé des deux côtés",
        'Au besoin, le débrancher complètement puis le rebrancher fermement',
      ],
      media: { type: 'photo', label: "Platine du tableau électrique tirée vers l'avant : la carte EPI 01 est à droite, avec ses nappes", file: 'arbres/platine_epi01.jpg' },
      next: 't_vit_scsi_result',
      src: ['REP', 'MF12 p.11'],
    },
    t_vit_scsi_result: {
      type: 'question',
      title: "Le tambour s'arrête-t-il correctement maintenant ?",
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 't_aligner_log03' },
      ],
      src: ['LOG'],
    },
    t_bloque: {
      type: 'action',
      title: 'Dégager le tambour',
      help: 'Sécurité : ne jamais mettre les mains dans la machine pendant une rotation du tambour.',
      steps: [
        "Retirer l'article ou l'objet coincé",
        "Si le coupe-circuit 24 V de l'alimentation générale a déclenché, le réarmer",
        'Faire faire un tour complet au tambour avec le bouton « Drum rotation » pour recaler les EPI',
      ],
      next: 't_test_distrib',
      src: ['D24 p.1', 'REP'],
    },

    /* ====================================================================
       ARBRE 6 — TRAPPE  (préfixe tr_) — EPIMAT 13 ; EPIMAT 14 (portes, EPI 02) → SAV après le test DEBES
       Point d'entrée : tr_debut (aussi depuis l'arbre Tambour : voyant FCPF éteint)
       ==================================================================== */
    tr_debut: {
      type: 'question',
      title: 'Quel est le problème de trappe ?',
      answers: [
        { label: "L'écran affiche « Problème de distribution » après validation d'un EPI", next: 'tr_debes_test' },
        { label: "La LED de la trappe s'allume mais la trappe reste bloquée", next: 'tr_debes_test' },
        { label: "La trappe s'ouvre mais le casier est vide", next: 'tr_casier_vide' },
        { label: "Une trappe ne se referme pas, ou l'écran affiche « Fermer la trappe »", next: 'tr_capteur' },
      ],
      src: ['D24 p.1', 'REP'],
    },
    tr_debes_test: {
      type: 'action',
      title: 'Tester la trappe (ou la porte) dans DEBES',
      help: "Même test sur l'EPIMAT 13 (trappes) et l'EPIMAT 14 (portes).",
      steps: [
        'Noter le numéro de la trappe (trappe 1 = en bas)',
        'Fermer DistEPI (Maj + F, clavier branché) et lancer DEBES (C:\\EPI\\DebesEPI.exe)',
        'Cliquer « Trappe N Ouvrir » puis « N Fermer »',
        'Observer les voyants FCPF N (trappe fermée) et FCPO (trappe ouverte)',
        'À la fin : fermer DEBES (« Fermeture ») et relancer DistEPI',
      ],
      media: { type: 'photo', label: 'DEBES : boutons de rotation du tambour et des trappes ; voyants FCPF (trappe fermée), CPT1 à CPT6 (position), Sécu tambour OK', file: 'arbres/debes_ecran.jpg' },
      next: 'tr_debes_result',
      src: ['ME15 p.15-16', 'ME15 p.4', 'REP'],
    },
    tr_debes_result: {
      type: 'question',
      title: "La trappe s'ouvre-t-elle et se referme-t-elle avec DEBES ?",
      answers: [
        { label: 'Oui', next: 'tr_obstacle' },
        { label: 'Non', next: 'tr_scsi' },
      ],
      src: ['ME15 p.15'],
    },
    tr_scsi: {
      type: 'action',
      title: 'Vérifier le câble SCSI blanc (PC ↔ carte EPI 01)',
      help: "Mal enfoncé, ce câble donne des pannes bizarres : certains capteurs s'allument et d'autres non. Pas besoin d'éteindre la machine.",
      steps: [
        'Repérer le câble SCSI blanc entre le PC (carte Advantech) et la carte EPI 01 du tableau électrique',
        "Vérifier qu'il est bien enfoncé des deux côtés",
        'Au besoin, le débrancher complètement puis le rebrancher fermement',
      ],
      media: { type: 'photo', label: "Platine du tableau électrique tirée vers l'avant : la carte EPI 01 est à droite, avec ses nappes", file: 'arbres/platine_epi01.jpg' },
      next: 'tr_scsi_result',
      src: ['REP', 'MF12 p.11'],
    },
    tr_scsi_result: {
      type: 'question',
      title: "La trappe s'ouvre-t-elle et se referme-t-elle maintenant avec DEBES ?",
      answers: [
        { label: 'Oui', next: 'tr_obstacle' },
        { label: 'Non', next: 'tr_modele' },
      ],
      src: ['LOG'],
    },
    tr_modele: {
      type: 'question',
      title: 'La machine a-t-elle des trappes (EPIMAT 13) ou des portes à gâche (EPIMAT 14) ?',
      help: "Ça se voit sur la façade : l'EPIMAT 14 a des portes manuelles à gâche, pilotées par des cartes EPI 02.",
      media: { type: 'photo', label: 'EPIMAT 13 : façade à trappes, avec les moteurs de trappe (manuel 2012)', file: 'arbres/epimat13_trappes.jpg' },
      answers: [
        { label: 'Des trappes (EPIMAT 13)', next: 'tr_motorisee' },
        { label: 'Des portes à gâche (EPIMAT 14)', next: 'sol_sav_epi02' },
      ],
      src: ['REP'],
    },
    tr_obstacle: {
      type: 'action',
      title: 'Vérifier la trappe, puis refaire une distribution',
      steps: [
        "Vérifier qu'aucun article ne gêne l'ouverture ou la fermeture",
        'Refaire une distribution test',
      ],
      next: 'tr_obstacle_result',
      src: ['D24 p.1'],
    },
    tr_obstacle_result: {
      type: 'question',
      title: 'La distribution fonctionne-t-elle ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'sol_condamner_trappe' },
      ],
      src: ['LOG'],
    },
    tr_motorisee: {
      type: 'question',
      title: "La trappe s'ouvre-t-elle seule (trappe motorisée) ?",
      help: "Sur l'EPIMAT 13, les trappes sont à moteur ou manuelles selon la machine (paramètre MANUEL de DistEPI).",
      answers: [
        { label: 'Oui, motorisée', next: 'tr_verif_moteur' },
        { label: "Non, l'utilisateur l'ouvre après déverrouillage", next: 'tr_verif_verrou' },
      ],
      src: ['DS p.4', 'PAP', 'REP'],
    },
    tr_verif_moteur: {
      type: 'action',
      title: 'Vérifier le moteur de la trappe',
      steps: [
        'Retirer le capot de protection (3 vis M4, clé de 7 mm)',
        'Vérifier le connecteur MOTOR sur la carte EPI 05 de la trappe',
        "Vérifier qu'il n'y a pas de jeu entre le pignon du moteur et la crémaillère blanche de la trappe",
        'Retester dans DEBES',
      ],
      media: { type: 'photo', label: 'Moteur de trappe et sa carte EPI 05 (EPIMAT 13)', file: 'arbres/moteur_trappe.jpg' },
      next: 'tr_moteur_result',
      src: ['MF12 p.5-7'],
    },
    tr_moteur_result: {
      type: 'question',
      title: 'La trappe fonctionne-t-elle ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'sol_condamner_trappe' },
      ],
      src: ['LOG'],
    },
    tr_verif_verrou: {
      type: 'action',
      title: 'Vérifier le verrou électrique de la trappe',
      steps: [
        'Retirer le capot de protection (3 vis M4, clé de 7 mm)',
        'Vérifier le connecteur LOCK (électro-aimant) sur la carte EPI 05 de la trappe',
        "Retester l'ouverture dans DEBES",
      ],
      media: { type: 'photo', label: 'Carte EPI 05 : connecteurs MOTOR et LOCK en bas', file: 'arbres/epi05_carte.jpg' },
      next: 'tr_verrou_result',
      src: ['ME15 p.6', 'KIT p.3'],
    },
    tr_verrou_result: {
      type: 'question',
      title: 'La trappe fonctionne-t-elle ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'sol_condamner_trappe' },
      ],
      src: ['LOG'],
    },
    tr_casier_vide: {
      type: 'action',
      title: 'Vérifier le stock de cet emplacement',
      steps: [
        "Noter la colonne et l'étage concernés",
        'Corriger le stock depuis le menu de remplissage (badge de maintenance → Vider / Remplir)',
        "Vérifier le contenu de l'emplacement dans l'extranet (Machines)",
      ],
      next: 'tr_casier_result',
      src: ['MU18 p.46', 'LOG'],
    },
    tr_casier_result: {
      type: 'question',
      title: 'Le problème se reproduit-il sur cet emplacement ?',
      answers: [
        { label: 'Non', next: 'sol_resolved' },
        { label: 'Oui', next: 't_position' },
      ],
      src: ['LOG'],
    },
    tr_capteur: {
      type: 'question',
      title: "Dans DEBES, le voyant FCPF de cette trappe s'allume-t-il quand on la ferme à la main ?",
      help: "FCPF = capteur « trappe fermée ». Si DEBES n'est pas ouvert : fermer DistEPI (Maj + F), puis lancer C:\\EPI\\DebesEPI.exe.",
      media: { type: 'photo', label: 'DEBES : boutons de rotation du tambour et des trappes ; voyants FCPF (trappe fermée), CPT1 à CPT6 (position), Sécu tambour OK', file: 'arbres/debes_ecran.jpg' },
      answers: [
        { label: 'Non, il reste éteint', next: 'tr_capteur_scsi' },
        { label: 'Oui', next: 'tr_debes_test' },
      ],
      src: ['ME15 p.16', 'REP'],
    },
    tr_capteur_scsi: {
      type: 'action',
      title: 'Vérifier le câble SCSI blanc (PC ↔ carte EPI 01)',
      help: "Mal enfoncé, ce câble donne des pannes bizarres : certains capteurs s'allument et d'autres non. Pas besoin d'éteindre la machine.",
      steps: [
        'Repérer le câble SCSI blanc entre le PC (carte Advantech) et la carte EPI 01 du tableau électrique',
        "Vérifier qu'il est bien enfoncé des deux côtés",
        'Au besoin, le débrancher complètement puis le rebrancher fermement',
      ],
      media: { type: 'photo', label: "Platine du tableau électrique tirée vers l'avant : la carte EPI 01 est à droite, avec ses nappes", file: 'arbres/platine_epi01.jpg' },
      next: 'tr_capteur_scsi_result',
      src: ['REP', 'MF12 p.11'],
    },
    tr_capteur_scsi_result: {
      type: 'question',
      title: "Le voyant FCPF s'allume-t-il maintenant quand la trappe est fermée ?",
      answers: [
        { label: 'Oui', next: 'tr_debes_test' },
        { label: 'Non, il reste éteint', next: 'tr_modele_capteur' },
      ],
      src: ['LOG'],
    },
    tr_modele_capteur: {
      type: 'question',
      title: 'La machine a-t-elle des trappes (EPIMAT 13) ou des portes à gâche (EPIMAT 14) ?',
      help: "Ça se voit sur la façade : l'EPIMAT 14 a des portes manuelles à gâche, pilotées par des cartes EPI 02.",
      media: { type: 'photo', label: 'EPIMAT 13 : façade à trappes, avec les moteurs de trappe (manuel 2012)', file: 'arbres/epimat13_trappes.jpg' },
      answers: [
        { label: 'Des trappes (EPIMAT 13)', next: 'sol_changer_epi05' },
        { label: 'Des portes à gâche (EPIMAT 14)', next: 'sol_sav_epi02' },
      ],
      src: ['REP'],
    },

    /* ====================================================================
       ARBRE 7 — LOGICIEL : DÉMARRAGE  (préfixe ld_)
       Point d'entrée : ld_debut
       ==================================================================== */
    ld_debut: {
      type: 'question',
      title: 'Que se passe-t-il ?',
      answers: [
        { label: 'DistEPI ne se lance pas (bureau Windows visible)', next: 's_vert_distepi' },
        { label: 'DistEPI se ferme tout seul ou se bloque', next: 'ld_redemarrer_distepi' },
        { label: "L'écran indique « EN PANNE »", next: 't_rotation_manuelle' },
        { label: "Message d'erreur Windows ou BIOS", next: 's_vert_erreur' },
      ],
      src: ['D24 p.1'],
    },
    ld_redemarrer_distepi: {
      type: 'action',
      title: 'Redémarrer DistEPI',
      steps: [
        'Fermer DistEPI (Maj + F, clavier branché)',
        'Le relancer (icône du bureau ou C:\\EPI\\DistEPI.exe)',
      ],
      next: 'ld_redemarrer_result',
      src: ['D24 p.1', 'ME15 p.18', 'REP'],
    },
    ld_redemarrer_result: {
      type: 'question',
      title: 'DistEPI fonctionne-t-il normalement ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 's_redemarrer_distrib' },
      ],
      src: ['D24 p.1'],
    },

    /* ====================================================================
       ARBRE 8 — LOGICIEL : SYNCHRONISATION  (préfixe ls_)
       Point d'entrée : ls_debut
       ==================================================================== */
    ls_debut: {
      type: 'question',
      title: 'Quel est le symptôme ?',
      answers: [
        { label: "Un salarié, un article ou un profil créé dans l'extranet n'arrive pas sur la machine", next: 'ls_intervalle' },
        { label: "Les articles n'apparaissent pas dans le choix", next: 'ls_casiers' },
        { label: "Les distributions n'arrivent pas dans l'extranet", next: 'ls_online' },
        { label: "Message d'erreur de synchronisation", next: 'ls_online' },
      ],
      src: ['D24 p.1', 'DS p.4'],
    },
    ls_intervalle: {
      type: 'action',
      title: 'Lancer une synchronisation',
      steps: [
        "La machine récupère les nouveautés de l'extranet à intervalle régulier (paramètre IntervalGSMServer)",
        'Pour ne pas attendre : clavier branché sur le PC, Maj + L (menu maintenance), puis bouton « Synchroniser »',
        'Attendre le message « synchro effectué »',
      ],
      next: 'ls_intervalle_result',
      src: ['DS p.4', 'REP'],
    },
    ls_intervalle_result: {
      type: 'question',
      title: 'La nouveauté est-elle arrivée sur la machine ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'ls_online' },
      ],
      src: ['LOG'],
    },
    ls_casiers: {
      type: 'action',
      title: "Vérifier la configuration des casiers dans l'extranet",
      steps: [
        'Extranet → Machines → cliquer sur la machine',
        "Vérifier que l'article est bien affecté à un casier, une colonne ou un étage",
        "Vérifier le remplissage de l'emplacement",
      ],
      next: 'ls_casiers_result',
      src: ['D24 p.1', 'MU18 p.28-40'],
    },
    ls_casiers_result: {
      type: 'question',
      title: 'Les articles apparaissent-ils maintenant ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'ls_online' },
      ],
      src: ['LOG'],
    },
    ls_online: {
      type: 'question',
      title: 'La LED « Online » du modem est-elle bleue fixe ?',
      answers: [
        { label: 'Non', next: 'i_pwr_led' },
        { label: 'Oui', next: 'i_eth_led' },
      ],
      src: ['D24 p.1', 'SIM p.12'],
    },

    /* ====================================================================
       ARBRE 9 — LOGICIEL : CONFIGURATION DE DISTEPI  (préfixe lc_)
       Point d'entrée : lc_debut
       ==================================================================== */
    lc_debut: {
      type: 'question',
      title: 'Que faut-il vérifier dans les paramètres DistEPI ?',
      help: "Pour ouvrir les paramètres, avec un clavier branché sur le PC : Maj + L ouvre le menu maintenance, puis cliquer dans le coin en haut à droite de l'écran, dans la zone blanche vide, pour faire apparaître le menu caché.",
      answers: [
        { label: "L'écran tactile ne réagit pas dans DistEPI", next: 'lc_tactile' },
        { label: "Le lecteur de badge n'est pas pris en compte", next: 'lc_badge' },
        { label: 'La machine ne se synchronise pas avec le cloud', next: 'lc_cloud' },
        { label: 'Le nombre de casiers ne correspond pas à la machine', next: 'lc_type' },
      ],
      src: ['DS', 'REP'],
    },
    lc_tactile: {
      type: 'action',
      title: 'Vérifier le paramètre « EcranTactile »',
      steps: [
        'Paramètres DistEPI → onglet Machine',
        '« EcranTactile » doit être activé',
        'Enregistrer et redémarrer DistEPI',
      ],
      next: 'lc_result',
      src: ['DS p.2'],
    },
    lc_badge: {
      type: 'action',
      title: 'Vérifier le type de lecteur de badge',
      steps: [
        'Paramètres DistEPI → onglet Badge → « TypeLecteurBadge » doit être à 10 (lecteur USB en émulation clavier)',
        'Enregistrer et redémarrer DistEPI',
      ],
      next: 'lc_result',
      src: ['DS p.10', 'REP'],
    },
    lc_cloud: {
      type: 'action',
      title: 'Vérifier les paramètres cloud',
      steps: [
        '« MachineServeur » : toujours coché pour les machines en cloud',
        '« VersionGSM » : activé pour le cloud',
        '« VersionHTML5 » : obligatoire pour le cloud',
        'Enregistrer et redémarrer DistEPI',
      ],
      next: 'lc_result',
      src: ['DS p.4-5'],
    },
    lc_type: {
      type: 'action',
      title: 'Vérifier le type de machine',
      steps: [
        'Paramètres DistEPI → onglet Type → « Machine1 »',
        'TYPE 1 = 32 casiers, 2 = 90, 3 = 180, 4 = 126, 5 = 252, 6 = Mix ou 468, 8 = 432, 10 = 806 ou Mix 806, 12 = Slim/Baby',
        'Enregistrer et redémarrer DistEPI',
      ],
      next: 'lc_result',
      src: ['DS p.9'],
    },
    lc_result: {
      type: 'question',
      title: 'Le problème est-il réglé ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'sol_sav' },
      ],
      src: ['LOG'],
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
      message: "La prise du local n'est pas alimentée. Vérifier les branchements et le disjoncteur du tableau électrique du local. Si le disjoncteur est OK, contacter le SAV.",
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
    sol_changer_alim: {
      type: 'solution', outcome: 'replace',
      title: "Changer le bloc d'alimentation de l'écran",
      message: "L'écran se rallume avec une alimentation neuve : l'ancien bloc était défaillant. Signaler la pièce remplacée au SAV.",
      sav: true,
      src: ['T'],
    },
    sol_changer_alim_generale: {
      type: 'solution', outcome: 'replace',
      title: "Changer l'alimentation générale",
      message: "L'alimentation générale (230 VAC → 24 / 5 V DC, en haut de la platine du tableau électrique) ne délivre plus de tension. La remplacer et contacter le SAV.",
      media: { type: 'photo', label: "Platine du tableau électrique : l'alimentation générale est en haut", file: 'arbres/platine_tableau_electrique.jpg' },
      sav: true,
      src: ['MF12 p.10-11', 'FI'],
    },
    sol_court_circuit: {
      type: 'solution', outcome: 'sav',
      title: 'Court-circuit ou blocage : ne pas insister',
      message: 'Le coupe-circuit redéclenche aussitôt : court-circuit ou blocage probable. Ne pas réarmer à nouveau. Contacter le SAV.',
      sav: true,
      src: ['FI'],
    },
    sol_changer_modem: {
      type: 'solution', outcome: 'replace',
      title: 'Changer le modem GSM',
      message: 'Le modem ne se connecte plus malgré les vérifications. Avant de le débrancher, relever son APN (navigateur du PC → 192.168.1.1 → Setup) : le nouveau modem doit avoir le même APN si on garde la même carte SIM. Le remplacer (récupérer la SIM, débrancher alimentation et antennes) et contacter le SAV.',
      sav: true,
      src: ['T', 'D24 p.4', 'REP'],
    },
    sol_sav_sim: {
      type: 'solution', outcome: 'sav',
      title: 'Faire vérifier la ligne de la carte SIM',
      message: 'SIM détectée et signal présent, mais le modem ne se connecte pas à internet malgré la reconfiguration : la ligne peut être suspendue ou sans forfait. Le SAV Logimatiq vérifie la ligne ; si elle est active, il fera changer le modem.',
      sav: true,
      src: ['REP'],
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
      message: 'Internet fonctionne, mais le serveur Logimatiq ne répond pas (page EPIMAT ou test ClientSynch DB EPI en échec) : le problème vient du serveur ou de la base de données. Contacter le SAV Logimatiq.',
      sav: true,
      src: ['T', 'REP'],
    },
    sol_changer_lecteur: {
      type: 'solution', outcome: 'replace',
      title: 'Changer le lecteur de badge',
      message: "Le lecteur de badge est défaillant. Le remplacer (reporter la connectique sur le nouveau lecteur), vérifier le bip au passage d'un badge, et contacter le SAV.",
      media: { type: 'photo', label: "Le lecteur de badge vu de l'intérieur de la porte (entouré en orange)", file: 'arbres/lecteur_remplacement.jpg' },
      sav: true,
      src: ['T', 'D24 p.8'],
    },
    sol_badge_defaillant: {
      type: 'solution', outcome: 'replace',
      title: 'Badge défaillant à remplacer',
      message: 'Ce badge spécifique est défaillant (les autres badges fonctionnent). Remplacer le badge auprès du SAV.',
      sav: true,
      src: ['T'],
    },
    sol_sav_tambour: {
      type: 'solution', outcome: 'sav',
      title: 'Tambour : intervention SAV',
      message: 'À vérifier par le SAV : coupe-circuit 24 V (disjoncteur tambour), moteur M1, carte rotation tambour (EPI RT), carte vitesse lente (GR76).',
      sav: true,
      src: ['D24 p.6-7', 'ME15 p.19'],
    },
    sol_changer_epi05: {
      type: 'solution', outcome: 'replace',
      title: 'Changer la carte trappe EPI 05',
      message: "Carte EPI 05 défectueuse. La remplacer (kit dépannage) en reprenant exactement les cavaliers et switches de l'ancienne carte (« ne pas oublier de changer les cavaliers »). Contacter le SAV.",
      media: { type: 'photo', label: 'Carte EPI 05 : connecteurs MOTOR et LOCK en bas', file: 'arbres/epi05_carte.jpg' },
      sav: true,
      src: ['D24 p.5', 'MF12 p.5-6', 'ME15 p.5-7'],
    },
    sol_changer_log03: {
      type: 'solution', outcome: 'replace',
      title: 'Changer le capteur disque tambour (LOG 03 / LOG 04)',
      message: 'Remplacer le circuit en cause (LOG 03 : capteurs CPT1-CPT6 ; LOG 04 : CP1, nappe 14 fils vers la carte principale). Contacter le SAV.',
      sav: true,
      src: ['L04', 'MF12 p.12', 'D24 p.9'],
    },
    sol_sav_epi02: {
      type: 'solution', outcome: 'sav',
      title: 'EPIMAT 14 : à faire vérifier par le SAV',
      message: "Sur l'EPIMAT 14 (portes à gâche, cartes EPI 02), la suite du diagnostic n'est pas encore décrite dans l'app. Contacter le SAV en lui transmettant le rapport du diagnostic.",
      sav: true,
      src: ['REP'],
    },
    sol_condamner_trappe: {
      type: 'solution', outcome: 'sav',
      title: 'Trappe défectueuse : la condamner, puis SAV',
      message: 'Condamner cette trappe dans DistEPI pour continuer à utiliser la machine, puis contacter le SAV pour la réparation.',
      sav: true,
      src: ['D24 p.1', 'REP'],
    },

    /* Placeholder machines non développées */
    tbd: {
      type: 'solution', outcome: 'info',
      title: 'Arbre à compléter',
      message: "Cette machine n'a pas encore d'arbre de diagnostic. Contacter le SAV directement.",
    },
  },
};
