/* ============================================================================
   DATA — Machines, arbres de diagnostic, nodes
   L'arbre EPIMAT est fidèlement transcrit depuis le board Miro.
   Les autres machines sont des placeholders à compléter (Sprint S3/S4).
   ========================================================================== */
export const DATA = {
  machines: [
    { id: 'epimat',   name: 'EPIMAT',        icon: 'machine',  color: 'bg-brand-600' },
    { id: 'distepi',  name: 'DistEPI',        icon: 'cabinet',  color: 'bg-brand-500' },
    { id: 'gsm',      name: 'Routeur GSM',    icon: 'antenna',  color: 'bg-emerald-600' },
    { id: 'pc',       name: 'PC',             icon: 'pc',       color: 'bg-slate-700' },
    { id: 'badge',    name: 'Lecteur badge',  icon: 'badge',    color: 'bg-amber-600' },
    { id: 'colonnes', name: 'Colonnes',       icon: 'pillar',   color: 'bg-rose-600' },
  ],

  // Liste des symptômes (= entrées d'arbre) par machine
  symptoms: {
    epimat: [
      { id: 't.epimat.screen', title: "Écran noir / pas d'image / synchro", category: 'Affichage', rootNode: 'q1',  icon: 'screen'  },
      { id: 't.epimat.modem',  title: 'Problème modem GSM (online)',         category: 'Réseau',    rootNode: 'qm1', icon: 'antenna' },
      { id: 't.epimat.badge',  title: 'Badge non lu / mauvais numéro',       category: 'Badge',     rootNode: 'qb1', icon: 'badge'   },
    ],
    distepi:  [{ id: 't.distepi.placeholder', title: 'À compléter', category: '—', rootNode: 'tbd', icon: 'cabinet' }],
    gsm:      [{ id: 't.gsm.placeholder',     title: 'À compléter', category: '—', rootNode: 'tbd', icon: 'antenna' }],
    pc:       [{ id: 't.pc.placeholder',      title: 'À compléter', category: '—', rootNode: 'tbd', icon: 'pc'      }],
    badge:    [{ id: 't.badge.placeholder',   title: 'À compléter', category: '—', rootNode: 'tbd', icon: 'badge'   }],
    colonnes: [{ id: 't.colonnes.placeholder',title: 'À compléter', category: '—', rootNode: 'tbd', icon: 'pillar'  }],
  },

  // Tous les nodes (questions, actions, solutions). Repris du Miro EPIMAT.
  nodes: {

    /* ------------------------------------------------------------------ */
    /* Branche racine — Écran noir ou pas ?                                */
    /* ------------------------------------------------------------------ */
    q1: {
      type: 'question',
      title: "L'écran est-il noir ?",
      help: "Regarde l'écran principal de la machine.",
      answers: [
        { label: 'Oui, écran noir',                      next: 'q2'  },
        { label: "Non, l'écran affiche quelque chose",   next: 'q10' },
      ]
    },

    /* ------------------------------------------------------------------ */
    /* Écran NOIR                                                          */
    /* ------------------------------------------------------------------ */
    q2: {
      type: 'question',
      title: "Le câble d'alimentation de la machine est branché ?",
      media: { type: 'photo', label: 'Vue arrière de la machine' },
      answers: [
        { label: 'Oui, branché',    next: 'q3'     },
        { label: 'Non, débranché',  next: 'a_plug' },
      ]
    },
    a_plug: {
      type: 'action',
      title: 'Brancher le câble',
      steps: [
        "Vérifier que la prise murale fonctionne",
        "Brancher fermement le câble côté machine et côté secteur",
      ],
      next: 'q_works_after_plug'
    },
    q_works_after_plug: {
      type: 'question',
      title: 'La machine fonctionne ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved' },
        { label: 'Non', next: 'q3'           },
      ]
    },
    q3: {
      type: 'question',
      title: 'Le voyant de la multiprise est allumé ?',
      answers: [
        { label: 'Oui', next: 'a_reset_open'       },
        { label: 'Non', next: 'sol_sav_multiprise'  },
      ]
    },
    a_reset_open: {
      type: 'action',
      title: 'Réinitialiser et ouvrir la machine',
      steps: [
        "Débrancher la machine",
        "Attendre 20 secondes",
        "Rebrancher la machine",
        "Ouvrir le capot de la machine",
      ],
      media: { type: 'video', label: "Procédure d'ouverture (45 s)" },
      next: 'q_voyant'
    },
    q_voyant: {
      type: 'question',
      title: "De quelle couleur est le voyant de l'écran ?",
      help: "Regarder la LED du moniteur (en façade).",
      answers: [
        { label: 'Vert',    next: 'q_pc_led',            color: 'green' },
        { label: 'Rouge',   next: 'a_change_screen_alim', color: 'red'   },
        { label: 'Éteint',  next: 'a_change_fuse',        color: 'gray'  },
      ]
    },

    /* Vert -> vérifier LED PC / lecteur badge */
    q_pc_led: {
      type: 'question',
      title: 'La LED du PC ou du lecteur de badge est-elle allumée ?',
      answers: [
        { label: 'Oui', next: 'a_check_vga'  },
        { label: 'Non', next: 'sol_change_pc' },
      ]
    },
    a_check_vga: {
      type: 'action',
      title: 'Vérifier le câble vidéo',
      steps: [
        "Vérifier le branchement côté écran",
        "Vérifier le branchement côté PC",
        "Si nécessaire, remplacer le câble vidéo VGA",
      ],
      media: { type: 'photo', label: 'Connecteur VGA' },
      next: 'q_works_after_vga'
    },
    q_works_after_vga: {
      type: 'question',
      title: 'La machine fonctionne ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved'          },
        { label: 'Non', next: 'sol_change_pc_or_screen' },
      ]
    },

    /* Rouge -> changer alimentation écran */
    a_change_screen_alim: {
      type: 'action',
      title: "Changer l'alimentation de l'écran",
      steps: [
        "Débrancher le bloc d'alimentation de l'écran",
        "Brancher un bloc d'alimentation neuf de référence équivalente",
      ],
      media: { type: 'pdf', label: 'Fiche réf. alim écran 17"', file: 'tuto EPIMAT.pdf' },
      next: 'q_works_after_screen_alim'
    },
    q_works_after_screen_alim: {
      type: 'question',
      title: 'La machine fonctionne ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved'    },
        { label: 'Non', next: 'sol_change_screen' },
      ]
    },

    /* Éteint -> remplacer le fusible */
    a_change_fuse: {
      type: 'action',
      title: 'Remplacer le fusible du bloc alim',
      steps: [
        "Localiser l'emplacement du fusible sur le bloc d'alimentation",
        "Ouvrir le porte-fusible",
        "Remplacer par un fusible neuf de même calibre",
      ],
      media: { type: 'photo', label: 'Emplacement fusible' },
      next: 'q_works_after_fuse'
    },
    q_works_after_fuse: {
      type: 'question',
      title: 'La machine fonctionne ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved'  },
        { label: 'Non', next: 'sol_change_alim' },
      ]
    },

    /* ------------------------------------------------------------------ */
    /* Écran allumé — que s'affiche-t-il ?                                */
    /* ------------------------------------------------------------------ */
    q10: {
      type: 'question',
      title: "Que s'affiche-t-il à l'écran ?",
      answers: [
        { label: 'Écran "No sync"',               next: 'a_reset_simple', preview: 'No sync'   },
        { label: 'Problème de synchronisation',   next: 'q_voyant_b',     preview: 'Prob sync' },
        { label: 'Bureau Windows',                next: 'q_bw_choice',    preview: 'Windows'   },
      ]
    },

    /* No sync */
    a_reset_simple: {
      type: 'action',
      title: 'Réinitialiser la machine',
      steps: [
        "Débrancher la machine",
        "Attendre 20 secondes",
        "Rebrancher la machine",
      ],
      next: 'q_still_nosync'
    },
    q_still_nosync: {
      type: 'question',
      title: 'Toujours un problème de synchro ?',
      answers: [
        { label: "Non, c'est rentré dans l'ordre", next: 'sol_resolved'    },
        { label: 'Oui, toujours',                  next: 'sol_change_screen' },
      ]
    },

    /* Prob sync */
    q_voyant_b: {
      type: 'question',
      title: "De quelle couleur est le voyant de l'écran ?",
      answers: [
        { label: 'Vert',    next: 'q_pc_led_b',            color: 'green' },
        { label: 'Rouge',   next: 'sol_change_pc_or_screen', color: 'red'   },
        { label: 'Éteint',  next: 'a_turn_on_pc',            color: 'gray'  },
      ]
    },
    q_pc_led_b: {
      type: 'question',
      title: 'La LED du PC est-elle allumée ?',
      answers: [
        { label: 'Oui', next: 'a_check_vga'  },
        { label: 'Non', next: 'a_turn_on_pc' },
      ]
    },
    a_turn_on_pc: {
      type: 'action',
      title: 'Allumer le PC',
      steps: [
        "Appuyer sur le bouton d'allumage en façade",
        "Si toujours éteint : vérifier le bouton d'alimentation à l'arrière du PC",
      ],
      media: { type: 'photo', label: 'Boutons façade et arrière du PC' },
      next: 'q_pc_led_after_press'
    },
    q_pc_led_after_press: {
      type: 'question',
      title: 'La LED du PC est-elle maintenant allumée ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved'  },
        { label: 'Non', next: 'sol_change_pc' },
      ]
    },

    /* Bureau Windows */
    q_bw_choice: {
      type: 'question',
      title: 'Que se passe-t-il sur le bureau Windows ?',
      answers: [
        { label: 'Pas de connexion / modem', next: 'qm1'       },
        { label: 'Mauvais numéro de badge',  next: 'a_distepi' },
      ]
    },

    /* ------------------------------------------------------------------ */
    /* Modem GSM                                                           */
    /* ------------------------------------------------------------------ */
    qm1: {
      type: 'question',
      title: "Le voyant 'online' du modem est allumé ?",
      media: { type: 'photo', label: 'LED online du routeur GSM' },
      answers: [
        { label: 'Oui', next: 'sol_change_modem' },
        { label: 'Non', next: 'a_check_rj45'     },
      ]
    },
    a_check_rj45: {
      type: 'action',
      title: 'Vérifier le câble RJ45',
      steps: [
        "Vérifier le branchement RJ45 ethernet entre le PC et le modem",
        "Vérifier le port COM 4 (badge) côté PC",
        "Reconnecter si nécessaire",
      ],
      media: { type: 'pdf', label: 'Schéma de câblage', file: 'Manuel Maintenance EPIMAT_eng.pdf' },
      next: 'q_modem_works'
    },
    q_modem_works: {
      type: 'question',
      title: 'Le modem est-il en ligne maintenant ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved'    },
        { label: 'Non', next: 'sol_change_modem' },
      ]
    },

    /* ------------------------------------------------------------------ */
    /* Badge / DISTEPI                                                     */
    /* ------------------------------------------------------------------ */
    qb1: {
      type: 'question',
      title: "Le badge n'est pas reconnu ?",
      answers: [
        { label: 'Mauvais numéro affiché', next: 'a_distepi'   },
        { label: 'Pas de lecture du tout', next: 'a_check_rj45' },
      ]
    },
    a_distepi: {
      type: 'action',
      title: 'Réassigner le numéro de badge',
      steps: [
        "Sur le bureau, double-cliquer sur l'icône DISTEPI",
        "Aller dans AUTOMAT INI",
        "Sélectionner CHANGER NUMERO BADGE",
        "Saisir le nouveau numéro et valider",
      ],
      media: { type: 'pdf', label: 'Initialisation badges Kalistrut', file: 'initialisation badges kalistrut .pdf' },
      next: 'q_distepi_works'
    },
    q_distepi_works: {
      type: 'question',
      title: 'Le badge est-il maintenant reconnu ?',
      answers: [
        { label: 'Oui', next: 'sol_resolved'  },
        { label: 'Non', next: 'sol_change_pc' },
      ]
    },

    /* ------------------------------------------------------------------ */
    /* Solutions                                                           */
    /* ------------------------------------------------------------------ */
    sol_resolved: {
      type: 'solution', outcome: 'resolved', icon: 'check',
      title: 'Problème résolu',
      message: "La machine fonctionne à nouveau. Pense à clôturer le ticket SAV si applicable."
    },
    sol_sav_multiprise: {
      type: 'solution', outcome: 'sav',
      title: "Problème d'alimentation amont",
      message: "Le voyant de la multiprise est éteint : vérifier le disjoncteur du local. Si OK, contacter le SAV.",
      sav: true,
    },
    sol_change_pc: {
      type: 'solution', outcome: 'replace', icon: 'wrench',
      title: 'Changer le PC',
      message: "Le PC ne démarre plus. Le remplacer puis contacter le SAV pour suivi.",
      sav: true,
    },
    sol_change_screen: {
      type: 'solution', outcome: 'replace',
      title: "Changer l'écran",
      message: "L'écran reste défaillant. Le remplacer puis contacter le SAV.",
      sav: true,
    },
    sol_change_pc_or_screen: {
      type: 'solution', outcome: 'replace',
      title: "Changer le PC ou l'écran",
      message: "Si possible, tester avec un autre écran. Sinon, prévoir le remplacement et contacter le SAV.",
      sav: true,
    },
    sol_change_alim: {
      type: 'solution', outcome: 'replace',
      title: "Changer l'alimentation",
      message: "Le bloc d'alimentation est HS. Le remplacer puis contacter le SAV.",
      sav: true,
    },
    sol_change_modem: {
      type: 'solution', outcome: 'replace',
      title: 'Changer le modem GSM',
      message: "Le modem ne se connecte plus. Le remplacer puis contacter le SAV.",
      sav: true,
    },

    /* Placeholder pour les machines non encore complétées */
    tbd: {
      type: 'solution', outcome: 'info',
      title: 'Arbre à compléter',
      message: "Cette machine n'a pas encore d'arbre de diagnostic. Ajoute un arbre via la base de connaissances."
    }
  }
};
