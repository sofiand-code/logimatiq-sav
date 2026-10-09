/* ============================================================================
   SCÉNARIOS DE TEST — « panne X → l'app doit conclure Y » (lus par check-trees)
   Chaque scénario part d'un symptôme et suit les réponses données (un extrait du
   libellé suffit) ; les procédures (actions) s'enchaînent seules. Il doit arriver
   sur le nœud `attendu`. statut : 'validé' (par Sofian) ou 'à valider'.
   Un scénario dont le symptôme n'existe pas dans tree.js (lot pas encore en ligne)
   est ignoré.
   ========================================================================== */
export const SCENARIOS = [
  /* ---- Écran ---- */
  { nom: 'Écran rouge, VGA neuf, PC en marche → changer l\'écran (E3)', statut: 'à valider',
    symptome: 't.epimat.screen', reponses: ['Oui, branchée', 'Rouge', 'Oui, LED PC allumée', 'Non, toujours rouge', 'Non, écran rouge', 'Oui, le PC est en marche'],
    attendu: 'sol_changer_ecran' },
  { nom: 'Écran rouge, PC qui reste éteint, multiprise intérieure éteinte → arbre Alimentation', statut: 'à valider',
    symptome: 't.epimat.screen', reponses: ['Oui, branchée', 'Rouge', 'Non, PC éteint', 'Non, toujours éteint', 'Non, multiprise éteinte'],
    attendu: 'a_debut' },
  { nom: 'Écran éteint seul, câble branché, multiprise intérieure éteinte → arbre Alimentation (E1)', statut: 'à valider',
    symptome: 't.epimat.screen', reponses: ['Oui, branchée', 'Éteint', "seul l'écran", 'Oui, branché', 'Non, multiprise éteinte'],
    attendu: 'a_debut' },
  { nom: 'Écran vert, mauvaise résolution → corriger la résolution (E4)', statut: 'à valider',
    symptome: 't.epimat.screen', reponses: ['Oui, branchée', 'Vert', 'Image abîmée', 'Mauvaise résolution'],
    attendu: 's_vert_resolution' },

  /* ---- Alimentation ---- */
  { nom: 'Prise du local sans courant, disjoncteur réarmé sans effet → problème secteur', statut: 'à valider',
    symptome: 't.epimat.alim', reponses: ['Non', 'Non'], attendu: 'sol_disjoncteur' },
  { nom: 'Coupe-circuit qui redéclenche aussitôt → ne pas insister, SAV', statut: 'à valider',
    symptome: 't.epimat.alim', reponses: ['Oui', 'Non', 'Oui, un bouton est sorti', 'Oui, il redéclenche'], attendu: 'sol_court_circuit' },
  { nom: 'Prise OK, interrupteur général, coupe-circuits et fusible OK, toujours éteinte → changer l\'alimentation générale', statut: 'à valider',
    symptome: 't.epimat.alim', reponses: ['Oui', 'Non', 'Non', 'Non'], attendu: 'sol_changer_alim_generale' },

  /* ---- Badge ---- */
  { nom: 'Badge jamais lu, un autre badge marche → reprogrammer le lecteur (B3)', statut: 'à valider',
    symptome: 't.epimat.badge', reponses: ['Oui, LED allumée', 'Rien : pas de bip', "Oui, l'autre badge est lu", 'nouveau type de badge'],
    attendu: 'b_reprogrammer' },
  { nom: 'Badge refusé, même numéro que celui imprimé → corriger dans l\'extranet (B4)', statut: 'à valider',
    symptome: 't.epimat.badge', reponses: ['Oui, LED allumée', 'Badge lu mais refusé', 'Non', 'Oui, même numéro'],
    attendu: 'b_corriger_bdd' },
  { nom: 'Écran « INITIALISATION BADGE », mauvais nom → vérifier le salarié dans l\'extranet (B8)', statut: 'à valider',
    symptome: 't.epimat.badge', reponses: ['Oui, LED allumée', 'INITIALISATION BADGE', 'Non, nom faux'],
    attendu: 'b_salarie_extranet' },
  { nom: 'LED du lecteur éteinte, PC qui ne démarre pas, multiprise éteinte → arbre Alimentation', statut: 'à valider',
    symptome: 't.epimat.badge', reponses: ['Non, LED éteinte', 'Non, PC éteint', 'Non, toujours éteint', 'Non, multiprise éteinte'],
    attendu: 'a_debut' },

  /* ---- Internet / modem ---- */
  { nom: 'Online éteinte, redémarrage et antennes sans effet, SIM détectée → relever l\'APN avant de reconfigurer (I4)', statut: 'à valider',
    symptome: 't.epimat.internet', reponses: ['éteinte', 'Oui', 'Non, toujours éteinte', 'Non, toujours éteinte', 'Oui, LED SIM allumée'],
    attendu: 'i_lire_apn' },
  { nom: 'Erreur de synchro, ETH clignote, pas de logiciel de connexion à distance → câble RJ45 (I5)', statut: 'à valider',
    symptome: 't.epimat.internet', reponses: ['allumée mais erreur', 'Oui, elle clignote', 'Pas de logiciel'],
    attendu: 'i_rj45_check' },

  /* ---- Tambour (lot 4) ---- */
  { nom: '« Disjoncteur déclenché » → réarmer le coupe-circuit 24 V (A2, A3)', statut: 'à valider',
    symptome: 't.epimat.tambour', reponses: ['Disjoncteur déclenché'], attendu: 't_coupe_circuit_24v' },
  { nom: 'EN PANNE, le tambour tourne au bouton, trappes fermées → câble SCSI d\'abord (T6)', statut: 'à valider',
    symptome: 't.epimat.tambour', reponses: ['EN PANNE', 'Oui, il tourne', 'Oui, toutes fermées'], attendu: 't_cable_scsi' },
  { nom: 'Sécu tambour éteint sur un EPIMAT 14 → SAV (pas de test EPI 05)', statut: 'à valider',
    symptome: 't.epimat.tambour', reponses: ['EN PANNE', 'Oui, il tourne', 'Oui, toutes fermées', 'Non', 'Oui, tous verts', 'Non, il est éteint', 'portes à gâche'],
    attendu: 'sol_sav_epi02' },
  { nom: 'Arrêt décalé → régler la vitesse lente (T4)', statut: 'à valider',
    symptome: 't.epimat.tambour', reponses: ['décalé'], attendu: 't_vitesse' },

  /* ---- Trappe (lot 4) ---- */
  { nom: 'Trappe qui ne s\'ouvre pas dans DEBES, SCSI OK, EPIMAT 14 → SAV', statut: 'à valider',
    symptome: 't.epimat.trappe', reponses: ['Problème de distribution', 'Non', 'Non', 'portes à gâche'], attendu: 'sol_sav_epi02' },
  { nom: 'Trappe motorisée EPIMAT 13 qui ne s\'ouvre toujours pas → la condamner dans DistEPI, puis SAV (R4)', statut: 'à valider',
    symptome: 't.epimat.trappe', reponses: ['Problème de distribution', 'Non', 'Non', 'trappes (EPIMAT 13)', 'Oui, motorisée', 'Non'],
    attendu: 'sol_condamner_trappe' },

  /* ---- Logiciel (lot 5) ---- */
  { nom: 'Logiciel : écran « EN PANNE » → arbre Tambour (rotation manuelle)', statut: 'à valider',
    symptome: 't.log.demarrage', reponses: ['EN PANNE'], attendu: 't_rotation_manuelle' },
  { nom: "Logiciel : salarié créé dans l'extranet absent de la machine → lancer une synchronisation (Maj + L)", statut: 'à valider',
    symptome: 't.log.synchro', reponses: ["créé dans l'extranet"], attendu: 'ls_intervalle' },
  { nom: 'Logiciel : lecteur de badge non pris en compte → TypeLecteurBadge = 10', statut: 'à valider',
    symptome: 't.log.config', reponses: ['lecteur de badge'], attendu: 'lc_badge' },
];

/* Règles vérifiées sur TOUS les chemins possibles : depuis les points d'entrée, on ne peut
   pas atteindre `cible` sans passer par l'un des nœuds `garde` (ou la réponse `viaReponse`). */
export const REGLES = [
  { nom: 'Alimentation avant pièce : pas de « changer le PC » sans contrôle de la multiprise (ou image visible)',
    cible: ['sol_changer_pc'], garde: ['s_rouge_multiprise', 'b_multiprise', 's_vert_symptome', 's_vert_erreur'] },   // image ou message d'erreur visibles = PC alimenté
  { nom: 'Câble SCSI vérifié avant de changer une carte EPI 05 ou LOG 03 / LOG 04',
    cible: ['sol_changer_epi05', 'sol_changer_log03'], garde: ['t_cable_scsi', 't_pos_scsi', 't_vit_scsi', 'tr_scsi', 'tr_capteur_scsi'] },
  { nom: 'EPIMAT 14 : aucune étape EPI 05 sans la réponse « trappes (EPIMAT 13) »',
    cible: ['t_test_epi05', 'tr_motorisee', 'tr_verif_moteur', 'tr_verif_verrou', 'sol_changer_epi05'], viaReponse: /trappes \(EPIMAT 13\)/ },
];
