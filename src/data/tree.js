/* ============================================================================
   DATA — Logimatiq SAV
   3 arbres EPIMAT complets : Écran, Internet/Modem, Badge
   Préfixes de nœuds : s_ (screen) · i_ (internet) · b_ (badge)
   ========================================================================== */
export const DATA = {
  machines: [
    { id: 'epimat',   name: 'EPIMAT',          icon: 'machine', color: 'bg-brand-600'   },
    { id: 'logiciel', name: 'Logiciel EPIMAT',  icon: 'pc',      color: 'bg-brand-500'   },
  ],

  symptoms: {
    epimat: [
      {
        id: 't.epimat.screen',
        title: "Écran noir / pas d'image / synchro",
        category: 'Affichage',
        rootNode: 's_debut',
        icon: 'screen',
      },
      {
        id: 't.epimat.internet',
        title: 'Pas de connexion internet / modem hors ligne',
        category: 'Réseau',
        rootNode: 'i_debut',
        icon: 'antenna',
      },
      {
        id: 't.epimat.badge',
        title: 'Badge non lu / mauvais numéro / lecture erratique',
        category: 'Badge',
        rootNode: 'b_debut',
        icon: 'badge',
      },
    ],
    logiciel: [
      { id: 't.log.demarrage',  title: 'Le logiciel ne démarre pas / plante', category: 'Logiciel', rootNode: 'tbd', icon: 'pc'      },
      { id: 't.log.synchro',    title: 'Erreur de synchronisation logicielle', category: 'Logiciel', rootNode: 'tbd', icon: 'antenna' },
      { id: 't.log.impression', title: 'Problème d\'impression',               category: 'Logiciel', rootNode: 'tbd', icon: 'screen'  },
      { id: 't.log.config',     title: 'Configuration / paramétrage initial',  category: 'Config',   rootNode: 'tbd', icon: 'badge'   },
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
      help: 'Vérifier que le câble d\'alimentation principal est bien connecté à la multiprise.',
      answers: [
        { label: 'Oui, branchée',   next: 's_led_ecran'  },
        { label: 'Non, débranchée', next: 's_brancher'   },
      ],
    },

    s_brancher: {
      type: 'action',
      title: 'Brancher la machine au secteur',
      steps: [
        'Vérifier que la multiprise est allumée (voyant rouge allumé)',
        'Brancher fermement le câble d\'alimentation côté machine',
        'Brancher l\'autre extrémité dans la multiprise',
        'Patienter 10 secondes',
      ],
      next: 's_led_ecran',
    },

    /* ---- LED écran : branche principale ---- */
    s_led_ecran: {
      type: 'question',
      title: 'Quelle est la couleur du voyant LED de l\'écran ?',
      help: 'Petit voyant situé en façade du moniteur, en bas ou sur le côté.',
      answers: [
        { label: 'Rouge',                                next: 's_rouge_pc_led',  color: 'red'   },
        { label: 'Éteint (aucune LED)',                  next: 's_eteint_cable',  color: 'gray'  },
        { label: 'Vert (image visible, autre problème)', next: 's_vert_symptome', color: 'green' },
      ],
    },


    /* ==================================================================
       BRANCHE ROUGE — LED écran rouge
       ================================================================== */

    s_rouge_pc_led: {
      type: 'question',
      title: 'La LED du PC est-elle allumée ?',
      help: 'Voyant lumineux sur la façade du boîtier PC intégré dans la machine.',
      answers: [
        { label: 'Oui, LED PC allumée',  next: 's_rouge_rebrancher_vga' },
        { label: 'Non, PC éteint',       next: 's_rouge_pc_ventilo'   },
      ],
    },

    /* PC éteint : ventilo + switch arrière + bouton power */
    s_rouge_pc_ventilo: {
      type: 'action',
      title: 'Vérifier l\'alimentation du PC',
      steps: [
        'Écouter ou regarder si le ventilateur du PC tourne (grilles d\'aération)',
        'Aller à l\'arrière du boîtier PC',
        'Repérer le petit interrupteur ON/OFF près de la prise secteur du PC',
        'Passer ce switch sur OFF, attendre 5 secondes, puis remettre sur ON',
        'Revenir en façade et appuyer sur le bouton Power du PC',
        'Attendre 15 secondes',
      ],
      next: 's_rouge_pc_demarre',
    },

    s_rouge_pc_demarre: {
      type: 'question',
      title: 'Le PC a-t-il démarré ? (LED allumée)',
      answers: [
        { label: 'Oui, LED allumée',     next: 's_rouge_rebrancher_vga' },
        { label: 'Non, toujours éteint', next: 'sol_changer_pc'   },
      ],
    },

    /* PC allumé : rebrancher VGA */
    s_rouge_rebrancher_vga: {
      type: 'action',
      title: 'Débrancher et rebrancher le câble VGA',
      steps: [
        'Localiser le câble VGA (connecteur bleu à vis) entre l\'écran et le PC',
        'Débrancher le câble côté écran, puis côté PC',
        'Rebrancher fermement des deux côtés et serrer les vis moletées',
        'Attendre 10 secondes',
      ],
      next: 's_rouge_vga_result',
    },

    s_rouge_vga_result: {
      type: 'question',
      title: 'L\'image est-elle revenue sur l\'écran ?',
      answers: [
        { label: 'Oui, image OK',  next: 'sol_resolved' },
        { label: 'Non, toujours rouge', next: 's_rouge_changer_vga' },
      ],
    },

    s_rouge_changer_vga: {
      type: 'action',
      title: 'Remplacer le câble VGA',
      steps: [
        'Débrancher l\'ancien câble VGA des deux côtés',
        'Brancher un câble VGA neuf côté PC, puis côté écran',
        'Serrer les vis moletées',
        'Attendre le retour de l\'image (10 secondes)',
      ],
      next: 's_rouge_apres_changer_vga',
    },

    s_rouge_apres_changer_vga: {
      type: 'question',
      title: 'L\'image est-elle maintenant visible ?',
      answers: [
        { label: 'Oui, image OK',      next: 'sol_resolved' },
        { label: 'Non, écran rouge',   next: 'sol_changer_ecran' },
      ],
    },


    /* ==================================================================
       BRANCHE ÉTEINT — LED écran éteinte
       ================================================================== */

    s_eteint_cable: {
      type: 'question',
      title: 'Le câble d\'alimentation de l\'écran est-il bien branché ?',
      help: 'Vérifier le câble reliant l\'écran à la multiprise ou au bloc d\'alimentation.',
      answers: [
        { label: 'Oui, branché',      next: 's_eteint_multiprise' },
        { label: 'Non, débranché',    next: 's_eteint_brancher_cable'   },
      ],
    },

    s_eteint_brancher_cable: {
      type: 'action',
      title: 'Brancher le câble alimentation de l\'écran',
      steps: [
        'Localiser le câble d\'alimentation de l\'écran',
        'Brancher fermement l\'extrémité côté écran',
        'Brancher l\'autre extrémité dans la multiprise',
      ],
      next: 's_eteint_multiprise',
    },

    s_eteint_multiprise: {
      type: 'question',
      title: 'La LED rouge de la multiprise est-elle allumée ?',
      help: 'La multiprise doit afficher un voyant rouge pour indiquer qu\'elle est sous tension.',
      answers: [
        { label: 'Oui, LED rouge allumée',  next: 's_eteint_changer_alim' },
        { label: 'Non, multiprise éteinte', next: 'sol_disjoncteur'   },
      ],
    },

    s_eteint_changer_alim: {
      type: 'action',
      title: 'Remplacer l\'alimentation de l\'écran',
      steps: [
        'Localiser le bloc d\'alimentation de l\'écran (boîtier noir sur le câble)',
        'Débrancher l\'alimentation défaillante',
        'Brancher une alimentation neuve de même référence',
        'Rallumer l\'écran',
      ],
      next: 's_eteint_alim_result',
    },

    s_eteint_alim_result: {
      type: 'question',
      title: 'L\'écran s\'est-il allumé ?',
      answers: [
        { label: 'Oui, écran allumé', next: 'sol_resolved' },
        { label: 'Non, toujours éteint', next: 'sol_changer_ecran' },
      ],
    },


    /* ==================================================================
       BRANCHE VERT — image visible, autre problème
       ================================================================== */

    s_vert_symptome: {
      type: 'question',
      title: 'Quel est le problème exact ?',
      answers: [
        { label: 'Scintillement ou problème de couleur',    next: 's_vert_vga'        },
        { label: 'Écran tactile ne répond pas',             next: 's_vert_usb'        },
        { label: 'DistEPI n\'est pas lancé (bureau visible)', next: 's_vert_distepi'  },
        { label: 'Mauvaise résolution d\'affichage',        next: 's_vert_resolution' },
        { label: 'Écran figé / gelé / bloqué',             next: 's_vert_redemarrer' },
      ],
    },

    /* Scintillement → VGA */
    s_vert_vga: {
      type: 'action',
      title: 'Vérifier le câble VGA',
      steps: [
        'Localiser le câble VGA (connecteur bleu) entre l\'écran et le PC',
        'Débrancher et rebrancher fermement des deux côtés',
        'Serrer les vis moletées',
      ],
      next: 's_vert_vga_result',
    },
    s_vert_vga_result: {
      type: 'question',
      title: 'Le problème d\'image a-t-il disparu ?',
      answers: [
        { label: 'Oui, image stable',      next: 'sol_resolved' },
        { label: 'Non, problème persiste', next: 'sol_changer_ecran'  },
      ],
    },

    /* Tactile → USB */
    s_vert_usb: {
      type: 'action',
      title: 'Vérifier le câble USB entre l\'écran et le PC',
      steps: [
        'Localiser le câble USB reliant l\'écran au PC (nécessaire pour le tactile)',
        'Débrancher et rebrancher fermement des deux côtés',
        'Si possible, essayer un autre port USB sur le PC',
      ],
      next: 's_vert_usb_result',
    },
    s_vert_usb_result: {
      type: 'question',
      title: 'L\'écran tactile répond-il maintenant ?',
      answers: [
        { label: 'Oui, tactile OK',        next: 'sol_resolved' },
        { label: 'Non, toujours inactif',  next: 'sol_changer_ecran'  },
      ],
    },

    /* DistEPI non lancé */
    s_vert_distepi: {
      type: 'action',
      title: 'Lancer le logiciel DistEPI',
      steps: [
        'Sur le bureau Windows, trouver l\'icône DistEPI',
        'Double-cliquer dessus pour lancer l\'application',
        'Attendre le chargement complet (environ 30 secondes)',
      ],
      next: 's_vert_distepi_result',
    },
    s_vert_distepi_result: {
      type: 'question',
      title: 'DistEPI s\'est-il lancé correctement ?',
      answers: [
        { label: 'Oui, DistEPI lancé',     next: 'sol_resolved' },
        { label: 'Non, ne s\'ouvre pas',   next: 'sol_redemarrer_pc'  },
      ],
    },

    /* Mauvaise résolution */
    s_vert_resolution: {
      type: 'action',
      title: 'Corriger la résolution (1280 × 720)',
      steps: [
        'Faire un clic droit sur le bureau Windows',
        'Cliquer sur "Paramètres d\'affichage"',
        'Dans Résolution, sélectionner 1280 × 720',
        'Cliquer sur "Conserver les modifications"',
      ],
      next: 's_vert_resolution_result',
    },
    s_vert_resolution_result: {
      type: 'question',
      title: 'La résolution est-elle correcte maintenant ?',
      answers: [
        { label: 'Oui, affichage correct',  next: 'sol_resolved' },
        { label: 'Non, toujours incorrecte', next: 'sol_redemarrer_pc'  },
      ],
    },

    /* Figé / gelé */
    s_vert_redemarrer: {
      type: 'action',
      title: 'Redémarrer la machine',
      steps: [
        'Cliquer sur Démarrer → Arrêter → Redémarrer',
        'Si l\'écran est figé : maintenir le bouton Power 5 secondes pour forcer l\'arrêt',
        'Rallumer avec le bouton Power',
        'Attendre le redémarrage complet de Windows',
        'Vérifier que DistEPI se relance automatiquement',
      ],
      next: 's_vert_redemarrer_result',
    },
    s_vert_redemarrer_result: {
      type: 'question',
      title: 'La machine fonctionne-t-elle correctement après redémarrage ?',
      answers: [
        { label: 'Oui, tout est OK',        next: 'sol_resolved' },
        { label: 'Non, problème persiste',  next: 'sol_changer_pc'  },
      ],
    },


    /* ====================================================================
       ARBRE 2 — INTERNET / MODEM  (préfixe i_)
       Point d'entrée : i_debut
       ==================================================================== */

    i_debut: {
      type: 'question',
      title: 'Quel est le problème ?',
      help: 'Regarder la LED bleue "online" sur le modem Four-Faith F3827.',
      answers: [
        { label: 'LED "online" du modem éteinte',                 next: 'i_reboot_modem'   },
        { label: 'LED "online" allumée mais erreur synchro DistEPI', next: 'i_connexion_distante' },
        { label: 'Déconnexions fréquentes / signal instable',     next: 'i_signal_faible'  },
      ],
    },

    /* ==================================================================
       BRANCHE LED ONLINE ÉTEINTE
       ================================================================== */

    i_reboot_modem: {
      type: 'action',
      title: 'Redémarrer le modem',
      steps: [
        'Localiser l\'interrupteur ON/OFF sur le boîtier d\'alimentation du modem',
        'Passer le switch sur OFF (ou débrancher la prise secteur)',
        'Attendre 30 secondes',
        'Rallumer (switch sur ON ou rebrancher)',
        'Attendre 2 à 3 minutes que le modem se reconnecte au réseau GSM',
      ],
      next: 'i_reboot_result',
    },
    i_reboot_result: {
      type: 'question',
      title: 'La LED "online" est-elle maintenant allumée ?',
      answers: [
        { label: 'Oui, LED bleue allumée',  next: 'sol_resolved' },
        { label: 'Non, toujours éteinte',   next: 'i_antennes_check'   },
      ],
    },

    i_antennes_check: {
      type: 'action',
      title: 'Vérifier les 2 antennes du modem',
      steps: [
        'Vérifier que les 2 antennes GSM sont bien vissées sur le modem',
        'Si une antenne est desserrée, la revisser fermement',
        'Attendre 1 minute et observer la LED online',
      ],
      media: { type: 'photo', label: 'Câblage et antennes du modem Four-Faith', file: 'cablage_du_modem.png' },
      next: 'i_antennes_result',
    },
    i_antennes_result: {
      type: 'question',
      title: 'La LED "online" s\'est-elle allumée ?',
      answers: [
        { label: 'Oui, LED allumée',      next: 'sol_resolved' },
        { label: 'Non, toujours éteinte', next: 'i_sim_led'   },
      ],
    },

    i_sim_led: {
      type: 'question',
      title: 'La LED SIM du modem est-elle allumée ?',
      help: 'Voyant "SIM" sur la face avant du modem (voir photo).',
      media: { type: 'photo', label: 'LEDs du modem — repérer la LED SIM', file: 'sens_insertion_sim.png' },
      answers: [
        { label: 'Oui, LED SIM allumée',  next: 'i_setup_grizzly' },
        { label: 'Non, LED SIM éteinte',  next: 'i_reinsertion_sim'  },
      ],
    },

    i_reinsertion_sim: {
      type: 'action',
      title: 'Réinsérer la carte SIM',
      steps: [
        'Éteindre le modem',
        'Localiser le petit trou d\'éjection SIM sur le modem',
        'Insérer un pin, rivet ou bout de bille de stylo dans le trou pour faire ressortir la SIM',
        'Retirer la SIM et nettoyer les contacts dorés avec un chiffon sec',
        'Réinsérer la SIM et rallumer le modem',
        'Attendre 2 à 3 minutes',
      ],
      media: { type: 'photo', label: 'Sortir la SIM avec un pin', file: 'sortir_la_sim_du_modem.png' },
      next: 'i_sim_result',
    },
    i_sim_result: {
      type: 'question',
      title: 'La LED SIM est-elle maintenant allumée ?',
      answers: [
        { label: 'Oui, LED SIM allumée',  next: 'i_setup_grizzly' },
        { label: 'Non, toujours éteinte', next: 'sol_changer_modem' },
      ],
    },

    i_setup_grizzly: {
      type: 'action',
      title: 'Lancer le setup Grizzly (setup17)',
      steps: [
        'Sur le bureau Windows, ouvrir le programme Grizzly Setup17',
        'Suivre la procédure de reconfiguration — le programme remet automatiquement l\'APN (wbdata / matooma / orange)',
        'Attendre la fin du setup et le redémarrage automatique du modem si demandé',
        'Attendre 2 à 3 minutes puis observer la LED online',
      ],
      media: { type: 'photo', label: 'Interface APN du modem (192.168.1.1)', files: ['interface_web_modem_setup.png', 'interface_web_setup_apn_modem.png'] },
      next: 'i_setup_result',
    },
    i_setup_result: {
      type: 'question',
      title: 'La LED "online" est-elle maintenant allumée ?',
      answers: [
        { label: 'Oui, LED bleue allumée',  next: 'sol_resolved' },
        { label: 'Non, toujours éteinte',   next: 'sol_changer_modem'   },
      ],
    },

    /* ==================================================================
       BRANCHE ERREUR SYNCHRO DISTEPI (LED online allumée)
       ================================================================== */

    i_connexion_distante: {
      type: 'question',
      title: 'Peut-on se connecter à distance au PC de la machine ?',
      help: 'Si la connexion à distance fonctionne, le câble RJ45 n\'est pas en cause.',
      answers: [
        { label: 'Oui, connexion distance OK',  next: 'i_clientsynch' },
        { label: 'Non, pas de connexion distance', next: 'i_rj45_check'  },
      ],
    },

    i_rj45_check: {
      type: 'action',
      title: 'Vérifier le câble RJ45 (PC ↔ Modem)',
      steps: [
        'Localiser le câble RJ45 reliant le PC au modem',
        'Débrancher et rebrancher aux deux extrémités jusqu\'au clic',
        'Vérifier que le PC Windows indique bien une connexion internet',
      ],
      next: 'i_rj45_result',
    },
    i_rj45_result: {
      type: 'question',
      title: 'Le PC Windows a-t-il maintenant accès à internet ?',
      answers: [
        { label: 'Oui, internet OK',         next: 'i_clientsynch' },
        { label: 'Non, toujours sans réseau', next: 'sol_changer_modem' },
      ],
    },

    i_clientsynch: {
      type: 'action',
      title: 'Tester avec ClientSynch DB EPI (Grizzly)',
      steps: [
        'Sur le bureau Windows, ouvrir le logiciel ClientSynch DB EPI',
        'Lancer le test de réception et d\'envoi de données',
        'Observer si le test passe ou échoue',
      ],
      media: { type: 'photo', label: 'ClientSynch DB EPI — procédure (photos à venir)' },
      next: 'i_clientsynch_result',
    },
    i_clientsynch_result: {
      type: 'question',
      title: 'Le test ClientSynch a-t-il réussi ?',
      answers: [
        { label: 'Oui, test OK',       next: 'i_reboot_pc_distepi' },
        { label: 'Non, test échoue',   next: 'sol_sav_serveur'   },
      ],
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
    },
    i_reboot_distepi_result: {
      type: 'question',
      title: 'DistEPI fonctionne correctement après redémarrage ?',
      answers: [
        { label: 'Oui, synchro OK',         next: 'sol_resolved' },
        { label: 'Non, erreur persiste',     next: 'sol_sav_serveur'  },
      ],
    },

    /* ==================================================================
       BRANCHE SIGNAL INSTABLE / DÉCONNEXIONS FRÉQUENTES
       ================================================================== */

    i_signal_faible: {
      type: 'action',
      title: 'Vérifier les antennes et repositionner le modem',
      steps: [
        'Vérifier que les 2 antennes GSM sont bien vissées sur le modem',
        'Redresser les antennes verticalement',
        'Si possible, rapprocher le modem d\'une fenêtre pour améliorer le signal GSM',
        'Tester avec un téléphone mobile pour évaluer la force du signal dans la pièce',
      ],
      next: 'i_signal_result',
    },
    i_signal_result: {
      type: 'question',
      title: 'La connexion est-elle stable maintenant ?',
      answers: [
        { label: 'Oui, connexion stable',    next: 'sol_resolved' },
        { label: 'Non, toujours instable',   next: 'sol_antenne_ext'   },
      ],
    },


    /* ====================================================================
       ARBRE 3 — LECTEUR DE BADGE  (préfixe b_)
       Point d'entrée : b_debut
       ==================================================================== */

    b_debut: {
      type: 'question',
      title: 'La LED du lecteur de badge est-elle allumée ?',
      help: 'Le lecteur est branché en USB sur le PC — si LED éteinte, le PC est probablement éteint.',
      answers: [
        { label: 'Oui, LED allumée',   next: 'b_symptome' },
        { label: 'Non, LED éteinte',   next: 'b_pc_led'   },
      ],
    },

    /* ==================================================================
       BRANCHE LED ÉTEINTE
       ================================================================== */

    b_pc_led: {
      type: 'question',
      title: 'La LED du PC est-elle allumée ?',
      help: 'Voyant lumineux sur la façade du boîtier PC intégré.',
      answers: [
        { label: 'Non, PC éteint',      next: 'b_allumer_pc'   },
        { label: 'Oui, PC allumé',      next: 'b_usb_rebranch' },
      ],
    },

    b_allumer_pc: {
      type: 'action',
      title: 'Allumer le PC',
      steps: [
        'Appuyer sur le bouton Power en façade du boîtier PC',
        'Si rien ne se passe, aller à l\'arrière du PC',
        'Vérifier le switch ON/OFF et le passer sur ON',
        'Revenir en façade et réappuyer sur le bouton Power',
        'Attendre 15 secondes',
      ],
      next: 'b_usb_rebranch',
    },

    b_usb_rebranch: {
      type: 'action',
      title: 'Débrancher et rebrancher le câble USB du lecteur',
      steps: [
        'Débrancher le câble USB du lecteur côté PC',
        'Attendre 5 secondes',
        'Rebrancher fermement sur le même port USB',
        'Observer si la LED du lecteur s\'allume',
      ],
      next: 'b_led_apres_usb',
    },

    b_led_apres_usb: {
      type: 'question',
      title: 'La LED du lecteur est-elle maintenant allumée ?',
      answers: [
        { label: 'Oui, LED allumée',      next: 'b_symptome' },
        { label: 'Non, toujours éteinte', next: 'b_autre_port_usb'   },
      ],
    },

    b_autre_port_usb: {
      type: 'action',
      title: 'Essayer un autre port USB',
      steps: [
        'Débrancher le câble USB du lecteur',
        'Le brancher sur un autre port USB du PC',
        'Observer si la LED du lecteur s\'allume',
      ],
      next: 'b_led_autre_port',
    },

    b_led_autre_port: {
      type: 'question',
      title: 'La LED s\'est-elle allumée sur le nouveau port ?',
      answers: [
        { label: 'Oui, LED allumée',      next: 'b_symptome' },
        { label: 'Non, toujours éteinte', next: 'sol_changer_lecteur' },
      ],
    },

    /* ==================================================================
       BRANCHE LED ALLUMÉE — Quel est le problème ?
       ================================================================== */

    b_symptome: {
      type: 'question',
      title: 'Quel est le problème avec le badge ?',
      answers: [
        { label: 'Badge non lu — aucune réaction',         next: 'b_port_com'      },
        { label: 'Badge lu mais mauvais numéro affiché',   next: 'b_mauvais_notepad' },
        { label: 'Lecture aléatoire / intermittente',      next: 'b_alea_badge'    },
      ],
    },

    /* --- Badge non lu : port COM → Notepad --- */

    b_port_com: {
      type: 'action',
      title: 'Vérifier le port COM (Gestionnaire de périphériques)',
      steps: [
        'Clic droit sur "Ce PC" → Gérer → Gestionnaire de périphériques',
        'Ouvrir "Ports (COM & LPT)" → noter le numéro COM du lecteur (ex : COM1)',
        'Ouvrir le fichier AUTOMAT INI sur le bureau',
        'Dans la section [port com], vérifier que "port lecteur badge" = même numéro',
        'Si différent, corriger le numéro et sauvegarder AUTOMAT INI',
      ],
      media: { type: 'photo', label: 'Gestionnaire périphériques & AUTOMAT INI (photos à venir)' },
      next: 'b_port_com_result',
    },

    b_port_com_result: {
      type: 'question',
      title: 'Le lecteur est-il maintenant reconnu (réaction au passage du badge) ?',
      answers: [
        { label: 'Oui',  next: 'b_notepad_langue' },
        { label: 'Non',  next: 'b_notepad_langue',               },
      ],
    },

    b_notepad_langue: {
      type: 'action',
      title: 'Préparer le test Notepad — passer le clavier en anglais',
      steps: [
        'Cliquer sur la langue en bas à droite de la barre des tâches Windows',
        'Sélectionner "ENG" (anglais) comme langue de saisie',
        'Ouvrir le Bloc-notes (Notepad) : Démarrer → Notepad',
        'Cliquer dans la zone de texte du Bloc-notes',
      ],
      next: 'b_notepad_test',
    },

    b_notepad_test: {
      type: 'action',
      title: 'Tester la lecture du badge sur Notepad',
      steps: [
        'Dans le Bloc-notes (clavier en anglais), passer le badge devant le lecteur',
        'Observer ce qui s\'affiche dans la zone de texte',
      ],
      next: 'b_notepad_result',
    },

    b_notepad_result: {
      type: 'question',
      title: 'Que s\'affiche-t-il dans le Bloc-notes ?',
      answers: [
        { label: 'Des caractères hex apparaissent (ex: 3A8F12B4)', next: 'b_admin_base' },
        { label: 'Rien ne s\'affiche',                             next: 'b_reprogrammer'   },
      ],
    },

    b_admin_base: {
      type: 'action',
      title: 'Corriger le nombre de caractères dans Admin Base',
      steps: [
        'Dans DistEPI, aller dans "Admin Base"',
        'Repérer le paramètre nombre de caractères du badge',
        'Compter le nombre de caractères lus dans le Bloc-notes',
        'Corriger le paramètre pour qu\'il corresponde (ex : mettre 8 si Notepad lit 8 caractères)',
        'Sauvegarder et redémarrer DistEPI',
      ],
      media: { type: 'photo', label: 'Admin Base — paramètre nb caractères (photos à venir)' },
      next: 'b_admin_result',
    },

    b_admin_result: {
      type: 'question',
      title: 'Le badge est-il maintenant reconnu dans DistEPI ?',
      answers: [
        { label: 'Oui, badge OK',          next: 'sol_resolved' },
        { label: 'Non, toujours ignoré',   next: 'sol_changer_lecteur'   },
      ],
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
    },

    b_reprogrammer_result: {
      type: 'question',
      title: 'Le lecteur lit-il correctement sur le Bloc-notes ?',
      answers: [
        { label: 'Oui, caractères visibles', next: 'b_admin_base' },
        { label: 'Non, toujours rien',        next: 'sol_changer_lecteur'  },
      ],
    },

    /* --- Mauvais numéro --- */

    b_mauvais_notepad: {
      type: 'action',
      title: 'Vérifier le numéro lu — test Notepad (clavier anglais)',
      steps: [
        'Passer le clavier Windows en anglais (barre des tâches → ENG)',
        'Ouvrir le Bloc-notes et passer le badge devant le lecteur',
        'Comparer le numéro affiché avec celui imprimé sur le badge',
      ],
      next: 'b_mauvais_result',
    },

    b_mauvais_result: {
      type: 'question',
      title: 'Le numéro lu dans le Bloc-notes correspond-il au badge ?',
      answers: [
        { label: 'Oui, même numéro — mal renseigné en BDD', next: 'b_corriger_bdd' },
        { label: 'Non, numéro différent — lecteur à reprogrammer', next: 'b_reprogrammer' },
      ],
    },

    b_corriger_bdd: {
      type: 'action',
      title: 'Corriger le numéro dans la base de données',
      steps: [
        'Dans DistEPI, aller dans "Admin Base"',
        'Trouver le salarié concerné',
        'Corriger le numéro de badge enregistré avec le numéro exact du badge physique',
        'Sauvegarder et retester',
      ],
      next: 'b_bdd_result',
    },

    b_bdd_result: {
      type: 'question',
      title: 'Le badge est-il maintenant correctement reconnu ?',
      answers: [
        { label: 'Oui',  next: 'sol_resolved' },
        { label: 'Non',  next: 'sol_changer_lecteur'   },
      ],
    },

    /* --- Lecture aléatoire / intermittente --- */

    b_alea_badge: {
      type: 'action',
      title: 'Tester avec un autre badge',
      steps: [
        'Prendre un autre badge Kalistrut disponible',
        'Le passer devant le lecteur',
        'Observer si la lecture est stable avec cet autre badge',
      ],
      next: 'b_alea_badge_result',
    },

    b_alea_badge_result: {
      type: 'question',
      title: 'L\'autre badge fonctionne-t-il correctement ?',
      answers: [
        { label: 'Oui, lecture stable',            next: 'sol_badge_defaillant' },
        { label: 'Non, même problème',             next: 'b_alea_usb'   },
        { label: 'Pas d\'autre badge disponible',  next: 'b_alea_usb'                           },
      ],
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
    },

    b_alea_usb_result: {
      type: 'question',
      title: 'La lecture est-elle stable maintenant ?',
      answers: [
        { label: 'Oui, lecture stable',     next: 'sol_resolved' },
        { label: 'Non, toujours aléatoire', next: 'sol_changer_lecteur'   },
      ],
    },


    /* ====================================================================
       SOLUTIONS COMMUNES
       ==================================================================== */

    sol_resolved: {
      type: 'solution', outcome: 'resolved',
      title: 'Problème résolu',
      message: 'La machine fonctionne à nouveau correctement. Pensez à clôturer le ticket SAV si applicable.',
    },
    sol_disjoncteur: {
      type: 'solution', outcome: 'sav',
      title: 'Problème secteur / disjoncteur',
      message: 'Le voyant de la multiprise est éteint. Vérifier le disjoncteur du tableau électrique du local. Si le disjoncteur est OK, contacter le SAV.',
      sav: true,
    },
    sol_changer_pc: {
      type: 'solution', outcome: 'replace',
      title: 'Changer le PC intégré',
      message: 'Le PC ne démarre plus malgré les vérifications. Remplacer le PC et contacter le SAV pour suivi.',
      sav: true,
    },
    sol_changer_ecran: {
      type: 'solution', outcome: 'replace',
      title: 'Changer l\'écran',
      message: 'L\'écran reste défaillant après vérifications. Le remplacer et contacter le SAV.',
      sav: true,
    },
    sol_changer_pc_ecran: {
      type: 'solution', outcome: 'replace',
      title: 'Changer PC ou écran',
      message: 'Si possible tester avec un autre écran pour isoler le composant défaillant. Contacter le SAV pour remplacement.',
      sav: true,
    },
    sol_changer_alim: {
      type: 'solution', outcome: 'replace',
      title: 'Changer le bloc alimentation',
      message: 'Le bloc d\'alimentation est défaillant. Le remplacer et contacter le SAV.',
      sav: true,
    },
    sol_changer_modem: {
      type: 'solution', outcome: 'replace',
      title: 'Changer le modem GSM',
      message: 'Le modem ne se connecte plus malgré les vérifications. Le remplacer et contacter le SAV.',
      sav: true,
    },
    sol_antenne_ext: {
      type: 'solution', outcome: 'sav',
      title: 'Installer une antenne externe',
      message: 'Le signal GSM est insuffisant dans ce local. Une antenne externe déportée est nécessaire. Contacter le SAV pour installation.',
      sav: true,
    },
    sol_changer_lecteur: {
      type: 'solution', outcome: 'replace',
      title: 'Changer le lecteur de badge',
      message: 'Le lecteur de badge est défaillant. Le remplacer et contacter le SAV pour reconfiguration.',
      sav: true,
    },
    sol_badge_incompatible: {
      type: 'solution', outcome: 'info',
      title: 'Badge incompatible',
      message: 'Ce type de badge n\'est pas compatible avec le lecteur EPIMAT. Commander des badges 125 kHz HID Kalistrut auprès du SAV.',
      sav: true,
    },
    sol_badge_defaillant: {
      type: 'solution', outcome: 'replace',
      title: 'Badge défaillant — à remplacer',
      message: 'Ce badge spécifique est défaillant (les autres badges fonctionnent). Remplacer le badge auprès du SAV.',
      sav: true,
    },
    sol_redemarrer_pc: {
      type: 'solution', outcome: 'sav',
      title: 'Redémarrer le PC',
      message: 'Le logiciel EPIMAT ne répond plus. Redémarrer le PC (Démarrer → Redémarrer). Si le problème persiste après redémarrage, contacter le SAV.',
      sav: false,
    },
    sol_sav_serveur: {
      type: 'solution', outcome: 'sav',
      title: 'Problème serveur Logimatiq',
      message: 'Le test ClientSynch DB EPI échoue : le problème vient du serveur Logimatiq ou de la base de données SQL. Contacter le SAV Logimatiq pour intervention sur le serveur.',
      sav: true,
    },

    /* Placeholder machines non développées */
    tbd: {
      type: 'solution', outcome: 'info',
      title: 'Arbre à compléter',
      message: 'Cette machine n\'a pas encore d\'arbre de diagnostic. Contacter le SAV directement.',
    },
  },
};
