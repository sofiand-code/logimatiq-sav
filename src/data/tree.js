/* ============================================================================
   DATA — Logimatiq SAV
   3 arbres EPIMAT complets : Écran, Internet/Modem, Badge
   Préfixes de nœuds : s_ (screen) · i_ (internet) · b_ (badge)
   ========================================================================== */
export const DATA = {
  machines: [
    { id: 'epimat',   name: 'EPIMAT',          icon: 'machine', color: 'bg-brand-600'   },
    { id: 'logiciel', name: 'Logiciel EPIMAT',  icon: 'pc',      color: 'bg-brand-500'   },
    { id: 'vetimat',  name: 'VETIMAT',          icon: 'pillar',  color: 'bg-emerald-600' },
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
        { label: 'Rouge',                      next: 's_rouge_pc_led',   color: 'red'   },
        { label: 'Éteint (aucune LED)',        next: 's_eteint_cable',   color: 'gray'  },
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
        { label: 'Oui, LED PC allumée',  next: 's_rouge_rebrancher_vga', color: 'green' },
        { label: 'Non, PC éteint',       next: 's_rouge_pc_ventilo',     color: 'red'   },
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
        { label: 'Oui, LED allumée',     next: 's_rouge_rebrancher_vga', color: 'green' },
        { label: 'Non, toujours éteint', next: 'sol_changer_pc',         color: 'red'   },
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
        { label: 'Oui, image OK',  next: 'sol_resolved',         color: 'green' },
        { label: 'Non, toujours rouge', next: 's_rouge_changer_vga', color: 'red' },
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
        { label: 'Oui, image OK',      next: 'sol_resolved',    color: 'green' },
        { label: 'Non, écran rouge',   next: 'sol_changer_ecran', color: 'red' },
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
        { label: 'Oui, branché',      next: 's_eteint_multiprise',     color: 'green' },
        { label: 'Non, débranché',    next: 's_eteint_brancher_cable',  color: 'red'   },
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
        { label: 'Oui, LED rouge allumée',  next: 's_eteint_changer_alim', color: 'green' },
        { label: 'Non, multiprise éteinte', next: 'sol_disjoncteur',        color: 'red'   },
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
        { label: 'Oui, écran allumé', next: 'sol_resolved',    color: 'green' },
        { label: 'Non, toujours éteint', next: 'sol_changer_ecran', color: 'red' },
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
        { label: 'Oui, image stable',      next: 'sol_resolved',     color: 'green' },
        { label: 'Non, problème persiste', next: 'sol_changer_ecran', color: 'red'  },
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
        { label: 'Oui, tactile OK',        next: 'sol_resolved',     color: 'green' },
        { label: 'Non, toujours inactif',  next: 'sol_changer_ecran', color: 'red'  },
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
        { label: 'Oui, DistEPI lancé',     next: 'sol_resolved',     color: 'green' },
        { label: 'Non, ne s\'ouvre pas',   next: 'sol_redemarrer_pc', color: 'red'  },
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
        { label: 'Oui, affichage correct',  next: 'sol_resolved',      color: 'green' },
        { label: 'Non, toujours incorrecte', next: 'sol_redemarrer_pc', color: 'red'  },
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
        { label: 'Oui, tout est OK',        next: 'sol_resolved',  color: 'green' },
        { label: 'Non, problème persiste',  next: 'sol_changer_pc', color: 'red'  },
      ],
    },


    /* ====================================================================
       ARBRE 2 — INTERNET / MODEM  (préfixe i_)
       Point d'entrée : i_debut
       ==================================================================== */

    i_debut: {
      type: 'question',
      title: 'Quel est le problème de connexion ?',
      answers: [
        { label: 'Pas de connexion du tout',          next: 'i_voyant_online'    },
        { label: 'Connexion lente ou instable',        next: 'i_lente_cause'     },
        { label: 'Déconnexions fréquentes',            next: 'i_signal'          },
        { label: 'Message "No sync" sur l\'écran',    next: 'i_nosync_reset'    },
      ],
    },

    /* --- Pas de connexion --- */
    i_voyant_online: {
      type: 'question',
      title: 'Le voyant "online" du modem GSM est-il allumé ?',
      help: 'LED verte ou bleue étiquetée "online" ou "WAN" sur le routeur.',
      media: { type: 'photo', label: 'LED online du routeur GSM' },
      answers: [
        { label: 'Oui, LED online allumée',   next: 'i_logiciel_ouvert'   },
        { label: 'Non, LED online éteinte',   next: 'i_voyant_power'      },
        { label: 'Modem absent / introuvable', next: 'i_rj45'             },
      ],
    },
    i_voyant_power: {
      type: 'question',
      title: 'Le modem est-il alimenté ? (LED "power" allumée)',
      answers: [
        { label: 'Oui, LED power allumée',   next: 'i_attente_connexion' },
        { label: 'Non, modem éteint',        next: 'i_alim_modem'        },
      ],
    },
    i_alim_modem: {
      type: 'action',
      title: 'Vérifier l\'alimentation du modem',
      steps: [
        'Vérifier que le câble d\'alimentation du modem est bien branché',
        'Vérifier la prise ou la multiprise utilisée',
        'Si le modem a un interrupteur, le passer sur ON',
      ],
      next: 'i_modem_allume',
    },
    i_modem_allume: {
      type: 'question',
      title: 'Le modem s\'est allumé ?',
      answers: [
        { label: 'Oui',  next: 'i_attente_connexion' },
        { label: 'Non',  next: 'sol_changer_modem'   },
      ],
    },
    i_attente_connexion: {
      type: 'action',
      title: 'Attendre la connexion GSM',
      steps: [
        'Le modem peut prendre 2 à 3 minutes pour se connecter au réseau',
        'Observer la LED "online" : elle doit clignoter puis devenir fixe',
        'Ne pas éteindre ou débrancher pendant cette phase',
      ],
      next: 'i_online_apres_attente',
    },
    i_online_apres_attente: {
      type: 'question',
      title: 'La LED "online" est-elle maintenant allumée ?',
      answers: [
        { label: 'Oui, LED allumée',        next: 'i_logiciel_ouvert'   },
        { label: 'Non, toujours éteinte',   next: 'i_sim'               },
      ],
    },
    i_sim: {
      type: 'question',
      title: 'La carte SIM est-elle correctement insérée dans le modem ?',
      answers: [
        { label: 'Oui, SIM insérée',    next: 'i_sim_reinsertion'   },
        { label: 'Non / incertain',     next: 'i_inserer_sim'       },
      ],
    },
    i_inserer_sim: {
      type: 'action',
      title: 'Insérer la carte SIM',
      steps: [
        'Éteindre le modem',
        'Localiser le slot SIM (souvent sous un cache ou sur le côté)',
        'Insérer la carte SIM en respectant l\'orientation (encoche)',
        'Rallumer le modem et attendre 3 minutes',
      ],
      media: { type: 'pdf', label: 'Procédure remplacement SIM', file: 'SIM Card Replacement and APN Setup Procedure.pdf' },
      next: 'i_online_apres_attente',
    },
    i_sim_reinsertion: {
      type: 'action',
      title: 'Réinsérer la carte SIM',
      steps: [
        'Éteindre le modem',
        'Retirer délicatement la carte SIM',
        'Nettoyer les contacts dorés avec un chiffon sec',
        'Réinsérer la SIM et rallumer le modem',
        'Attendre 3 minutes',
      ],
      next: 'i_online_apres_reinsertion',
    },
    i_online_apres_reinsertion: {
      type: 'question',
      title: 'La connexion est rétablie ?',
      answers: [
        { label: 'Oui',  next: 'sol_resolved'      },
        { label: 'Non',  next: 'sol_changer_modem' },
      ],
    },

    /* LED online allumée mais pas de connexion logicielle */
    i_logiciel_ouvert: {
      type: 'question',
      title: 'Le logiciel EPIMAT est-il lancé sur le PC ?',
      answers: [
        { label: 'Oui, il tourne',     next: 'i_rj45'               },
        { label: 'Non, fermé',         next: 'i_demarrer_logiciel'  },
      ],
    },
    i_demarrer_logiciel: {
      type: 'action',
      title: 'Démarrer le logiciel EPIMAT',
      steps: [
        'Double-cliquer sur l\'icône EPIMAT sur le bureau',
        'Attendre le chargement complet',
        'Vérifier que la barre de statut indique "Connecté"',
      ],
      next: 'i_logiciel_result',
    },
    i_logiciel_result: {
      type: 'question',
      title: 'La connexion est rétablie dans EPIMAT ?',
      answers: [
        { label: 'Oui',  next: 'sol_resolved' },
        { label: 'Non',  next: 'i_rj45'       },
      ],
    },
    i_rj45: {
      type: 'action',
      title: 'Vérifier le câble RJ45 (PC ↔ Modem)',
      steps: [
        'Repérer le câble RJ45 reliant le PC au modem',
        'Débrancher puis rebrancher aux deux extrémités jusqu\'au clic',
        'Vérifier également le port COM4 (lecteur de badge) sur le PC',
        'Si le câble est endommagé, le remplacer',
      ],
      media: { type: 'pdf', label: 'Schéma de câblage EPIMAT', file: 'Manuel Maintenance EPIMAT_eng.pdf' },
      next: 'i_rj45_result',
    },
    i_rj45_result: {
      type: 'question',
      title: 'La connexion fonctionne maintenant ?',
      answers: [
        { label: 'Oui',  next: 'sol_resolved'         },
        { label: 'Non',  next: 'i_reboot_pc'           },
      ],
    },
    i_reboot_pc: {
      type: 'action',
      title: 'Redémarrer le PC',
      steps: [
        'Démarrer → Arrêter → Redémarrer',
        'Attendre le redémarrage complet de Windows',
        'Relancer le logiciel EPIMAT',
        'Patienter 1 minute et vérifier la connexion',
      ],
      next: 'i_reboot_result',
    },
    i_reboot_result: {
      type: 'question',
      title: 'La connexion est rétablie après redémarrage ?',
      answers: [
        { label: 'Oui',  next: 'sol_resolved'      },
        { label: 'Non',  next: 'sol_changer_modem' },
      ],
    },

    /* --- Connexion lente --- */
    i_lente_cause: {
      type: 'question',
      title: 'Depuis quand la connexion est-elle lente ?',
      answers: [
        { label: 'Depuis l\'installation (toujours lente)', next: 'i_apn'        },
        { label: 'Depuis peu (était rapide avant)',          next: 'i_reboot_pc'  },
        { label: 'Après une coupure de courant',             next: 'i_rj45'      },
      ],
    },
    i_apn: {
      type: 'action',
      title: 'Vérifier la configuration APN du modem',
      steps: [
        'Ouvrir un navigateur internet sur le PC',
        'Saisir l\'adresse 192.168.1.1 (ou celle du modem)',
        'Se connecter à l\'interface d\'administration',
        'Vérifier les paramètres APN selon votre opérateur (voir fiche)',
        'Sauvegarder et redémarrer le modem',
      ],
      media: { type: 'pdf', label: 'Procédure APN & SIM', file: 'SIM Card Replacement and APN Setup Procedure.pdf' },
      next: 'i_apn_result',
    },
    i_apn_result: {
      type: 'question',
      title: 'La connexion est-elle normale maintenant ?',
      answers: [
        { label: 'Oui',  next: 'sol_resolved'      },
        { label: 'Non',  next: 'sol_changer_modem' },
      ],
    },

    /* --- Déconnexions fréquentes --- */
    i_signal: {
      type: 'question',
      title: 'Y a-t-il du réseau GSM dans le bâtiment ?',
      help: 'Tester avec un téléphone mobile dans la même pièce.',
      answers: [
        { label: 'Oui, bon signal mobile',     next: 'i_antenne_modem' },
        { label: 'Signal faible ou absent',    next: 'sol_antenne_ext' },
      ],
    },
    i_antenne_modem: {
      type: 'action',
      title: 'Vérifier et orienter l\'antenne du modem',
      steps: [
        'Vérifier que l\'antenne GSM est bien vissée sur le modem',
        'Redresser l\'antenne verticalement',
        'Si possible, rapprocher le modem d\'une fenêtre',
        'Tester sur 10 minutes',
      ],
      next: 'i_antenne_result',
    },
    i_antenne_result: {
      type: 'question',
      title: 'Les déconnexions ont diminué ?',
      answers: [
        { label: 'Oui, connexion stable',    next: 'sol_resolved'      },
        { label: 'Non, toujours instable',   next: 'sol_changer_modem' },
      ],
    },

    /* --- No sync via internet --- */
    i_nosync_reset: {
      type: 'action',
      title: 'Réinitialiser la machine (No sync)',
      steps: [
        'Éteindre l\'EPIMAT complètement',
        'Attendre 30 secondes',
        'Rallumer et attendre le démarrage complet',
        'Vérifier que le modem "online" est allumé',
      ],
      next: 'i_nosync_result',
    },
    i_nosync_result: {
      type: 'question',
      title: 'Le message "No sync" a disparu ?',
      answers: [
        { label: 'Oui',    next: 'sol_resolved'      },
        { label: 'Non',    next: 'i_voyant_online'   },
      ],
    },


    /* ====================================================================
       ARBRE 3 — LECTEUR DE BADGE  (préfixe b_)
       Point d'entrée : b_debut
       ==================================================================== */

    b_debut: {
      type: 'question',
      title: 'Quel est le problème avec le badge ?',
      answers: [
        { label: 'Le badge n\'est pas lu du tout',        next: 'b_lecteur_led'     },
        { label: 'Le badge affiche un mauvais numéro',    next: 'b_mauvais_numero'  },
        { label: 'Lecture aléatoire / intermittente',     next: 'b_lecture_alea'    },
        { label: 'Le lecteur ne s\'allume pas',           next: 'b_alim'            },
      ],
    },

    /* --- Badge non lu --- */
    b_lecteur_led: {
      type: 'question',
      title: 'La LED du lecteur de badge est-elle allumée ?',
      help: 'LED verte ou rouge visible sur la face du lecteur.',
      answers: [
        { label: 'Oui, allumée',   next: 'b_type_badge'    },
        { label: 'Non, éteinte',   next: 'b_alim'          },
      ],
    },
    b_alim: {
      type: 'question',
      title: 'Le câble du lecteur est-il bien branché au PC ?',
      answers: [
        { label: 'Oui, branché',      next: 'b_port_com'           },
        { label: 'Non / douteux',     next: 'b_rebrancher_lecteur' },
      ],
    },
    b_rebrancher_lecteur: {
      type: 'action',
      title: 'Rebrancher le lecteur de badge',
      steps: [
        'Débrancher le câble USB ou RJ45 du lecteur sur le PC',
        'Attendre 5 secondes',
        'Rebrancher fermement',
        'Vérifier que la LED du lecteur s\'allume',
      ],
      next: 'b_led_apres_rebranchement',
    },
    b_led_apres_rebranchement: {
      type: 'question',
      title: 'La LED du lecteur est maintenant allumée ?',
      answers: [
        { label: 'Oui',  next: 'b_type_badge'          },
        { label: 'Non',  next: 'sol_changer_lecteur'   },
      ],
    },
    b_port_com: {
      type: 'action',
      title: 'Vérifier le port COM du lecteur',
      steps: [
        'Vérifier le câble RJ45 entre le lecteur et le port COM4 du PC',
        'Débrancher / rebrancher le câble RJ45',
        'Si un câble USB est utilisé, l\'essayer sur un autre port USB',
        'Redémarrer le logiciel EPIMAT après rebranchement',
      ],
      media: { type: 'pdf', label: 'Schéma câblage lecteur badge', file: 'Manuel Maintenance EPIMAT_eng.pdf' },
      next: 'b_port_result',
    },
    b_port_result: {
      type: 'question',
      title: 'Le lecteur est maintenant reconnu ?',
      answers: [
        { label: 'Oui, LED allumée',   next: 'b_type_badge'        },
        { label: 'Non',               next: 'sol_changer_lecteur'  },
      ],
    },

    /* Type de badge */
    b_type_badge: {
      type: 'question',
      title: 'Quel type de badge utilisez-vous ?',
      answers: [
        { label: 'Badge Kalistrut (gris/blanc, fourni Logimatiq)',  next: 'b_approche'        },
        { label: 'Badge Mifare / autre technologie',                next: 'b_compatible'      },
        { label: 'Je ne sais pas',                                  next: 'b_approche'        },
      ],
    },
    b_compatible: {
      type: 'question',
      title: 'Le badge est-il de technologie 125 kHz HID ?',
      help: 'Vérifier l\'inscription sur le badge ou sa fiche produit.',
      answers: [
        { label: 'Oui, 125 kHz HID',      next: 'b_approche'           },
        { label: 'Non / autre technologie', next: 'sol_badge_incompatible' },
        { label: 'Inconnu',               next: 'b_approche'           },
      ],
    },
    b_approche: {
      type: 'question',
      title: 'Comment présentez-vous le badge au lecteur ?',
      answers: [
        { label: 'À moins de 5 cm, face au lecteur',     next: 'b_nettoyer'    },
        { label: 'À plus de 10 cm',                       next: 'b_distance'   },
        { label: 'De côté ou de dos',                     next: 'b_orientation' },
      ],
    },
    b_distance: {
      type: 'action',
      title: 'Ajuster la distance de lecture',
      steps: [
        'Approcher le badge à 3-8 cm du centre du lecteur',
        'Tenir le badge face au lecteur (côté imprimé vers vous)',
        'Maintenir immobile pendant 1 à 2 secondes',
        'Un bip et la LED verte indiquent une lecture réussie',
      ],
      next: 'b_distance_result',
    },
    b_distance_result: {
      type: 'question',
      title: 'Le badge est-il maintenant lu ?',
      answers: [
        { label: 'Oui',  next: 'sol_resolved'         },
        { label: 'Non',  next: 'b_nettoyer'           },
      ],
    },
    b_orientation: {
      type: 'action',
      title: 'Corriger l\'orientation du badge',
      steps: [
        'Tenir le badge horizontalement, face imprimée vers vous',
        'Le présenter face au lecteur (pas de biais, pas de dos)',
        'Distance : 3-8 cm',
        'Attendre 1-2 secondes sans bouger',
      ],
      next: 'b_orientation_result',
    },
    b_orientation_result: {
      type: 'question',
      title: 'Le badge est-il lu ?',
      answers: [
        { label: 'Oui',  next: 'sol_resolved'       },
        { label: 'Non',  next: 'b_nettoyer'         },
      ],
    },
    b_nettoyer: {
      type: 'action',
      title: 'Nettoyer le lecteur et le badge',
      steps: [
        'Éteindre la machine',
        'Essuyer la surface du lecteur avec un chiffon microfibre sec',
        'Nettoyer également le badge (surtout les zones de contact)',
        'Rallumer et réessayer',
      ],
      next: 'b_nettoyer_result',
    },
    b_nettoyer_result: {
      type: 'question',
      title: 'Le badge est-il lu après nettoyage ?',
      answers: [
        { label: 'Oui',  next: 'sol_resolved'        },
        { label: 'Non',  next: 'sol_changer_lecteur' },
      ],
    },

    /* --- Mauvais numéro --- */
    b_mauvais_numero: {
      type: 'question',
      title: 'Le numéro affiché correspond-il à l\'étiquette du badge ?',
      help: 'Comparer le numéro à l\'écran avec celui imprimé sur le badge.',
      answers: [
        { label: 'Non, numéro différent',    next: 'b_distepi'          },
        { label: 'Oui, numéro identique',    next: 'b_reassigner'       },
      ],
    },
    b_distepi: {
      type: 'action',
      title: 'Corriger le numéro dans DISTEPI',
      steps: [
        'Sur le bureau Windows, double-cliquer sur l\'icône DISTEPI',
        'Aller dans AUTOMAT INI',
        'Sélectionner CHANGER NUMERO BADGE',
        'Saisir le numéro correct (inscrit sur le badge)',
        'Valider et fermer',
      ],
      media: { type: 'pdf', label: 'Initialisation badges Kalistrut', file: 'initialisation badges kalistrut .pdf' },
      next: 'b_distepi_result',
    },
    b_reassigner: {
      type: 'action',
      title: 'Réassigner le badge à ce poste',
      steps: [
        'Sur le bureau Windows, double-cliquer sur l\'icône DISTEPI',
        'Aller dans AUTOMAT INI',
        'Sélectionner ASSIGNER BADGE',
        'Approcher le badge du lecteur quand demandé',
        'Confirmer l\'assignation',
      ],
      media: { type: 'pdf', label: 'Initialisation badges Kalistrut', file: 'initialisation badges kalistrut .pdf' },
      next: 'b_distepi_result',
    },
    b_distepi_result: {
      type: 'question',
      title: 'Le badge est-il maintenant correctement reconnu ?',
      answers: [
        { label: 'Oui',                            next: 'sol_resolved'        },
        { label: 'Non, problème persiste',         next: 'b_reboot_distepi'   },
      ],
    },
    b_reboot_distepi: {
      type: 'action',
      title: 'Redémarrer DISTEPI et le PC',
      steps: [
        'Fermer complètement le logiciel DISTEPI',
        'Redémarrer le PC (Démarrer → Redémarrer)',
        'Après redémarrage, rouvrir DISTEPI',
        'Réessayer la lecture du badge',
      ],
      next: 'b_reboot_result',
    },
    b_reboot_result: {
      type: 'question',
      title: 'Le badge fonctionne après redémarrage ?',
      answers: [
        { label: 'Oui',  next: 'sol_resolved'        },
        { label: 'Non',  next: 'sol_changer_lecteur' },
      ],
    },

    /* --- Lecture aléatoire --- */
    b_lecture_alea: {
      type: 'question',
      title: 'Dans quelles circonstances la lecture échoue-t-elle ?',
      answers: [
        { label: 'Avec ce badge uniquement',        next: 'b_test_autre_badge' },
        { label: 'Avec tous les badges',            next: 'b_nettoyer'         },
        { label: 'Lecture en double (2 bips)',      next: 'b_lecture_double'   },
      ],
    },
    b_test_autre_badge: {
      type: 'question',
      title: 'Pouvez-vous tester avec un autre badge Kalistrut ?',
      answers: [
        { label: 'Oui → l\'autre badge fonctionne',   next: 'sol_badge_defaillant' },
        { label: 'Oui → l\'autre badge échoue aussi', next: 'b_nettoyer'           },
        { label: 'Non, pas d\'autre badge disponible', next: 'b_nettoyer'          },
      ],
    },
    b_lecture_double: {
      type: 'action',
      title: 'Corriger la lecture en double',
      steps: [
        'Présenter le badge une seule fois, brièvement (1 seconde)',
        'Retirer immédiatement après le premier bip',
        'Ne pas maintenir le badge contre le lecteur',
        'Si le problème persiste, vérifier le paramètre "anti-double lecture" dans DISTEPI',
      ],
      media: { type: 'pdf', label: 'Initialisation badges Kalistrut', file: 'initialisation badges kalistrut .pdf' },
      next: 'b_double_result',
    },
    b_double_result: {
      type: 'question',
      title: 'La lecture en double a disparu ?',
      answers: [
        { label: 'Oui',  next: 'sol_resolved'        },
        { label: 'Non',  next: 'sol_changer_lecteur' },
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

    /* Placeholder machines non développées */
    tbd: {
      type: 'solution', outcome: 'info',
      title: 'Arbre à compléter',
      message: 'Cette machine n\'a pas encore d\'arbre de diagnostic. Contacter le SAV directement.',
    },
  },
};
