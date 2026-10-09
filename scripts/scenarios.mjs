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
  { nom: 'Écran rouge, VGA neuf, PC en marche → changer l\'écran (E3)', statut: 'validé',
    symptome: 't.epimat.screen', reponses: ['Rouge', 'Oui, LED PC allumée', 'Non, toujours rouge', 'Oui, le PC est en marche'],
    attendu: 'sol_changer_ecran' },
  { nom: 'Écran rouge, PC qui reste éteint, multiprise intérieure éteinte → arbre Alimentation', statut: 'validé',
    symptome: 't.epimat.screen', reponses: ['Rouge', 'Non, PC éteint', 'Non, toujours éteint', 'Non, multiprise éteinte'],
    attendu: 'a_debut' },
  { nom: 'Écran éteint seul, câble branché, multiprise intérieure éteinte → arbre Alimentation (E1)', statut: 'validé',
    symptome: 't.epimat.screen', reponses: ['Éteint', "seul l'écran", 'Oui, branché', 'Non, multiprise éteinte'],
    attendu: 'a_debut' },
  { nom: 'Écran vert, mauvaise résolution → corriger la résolution (E4)', statut: 'validé',
    symptome: 't.epimat.screen', reponses: ['Vert', 'Image abîmée', 'Mauvaise résolution'],
    attendu: 's_vert_resolution' },
  { nom: 'Tactile muet, autre port USB sans effet, « Écran tactile HID » absent → changer l\'écran (É3, É6)', statut: 'validé',
    symptome: 't.epimat.screen', reponses: ['Vert', 'tactile ne répond pas', 'Non, toujours inactif', "Non, il n'apparaît pas"], attendu: 'sol_changer_ecran' },
  { nom: 'Tactile muet mais détecté par Windows, redémarrage de la machine sans effet → changer l\'écran (É7)', statut: 'validé',
    symptome: 't.epimat.screen', reponses: ['Vert', 'tactile ne répond pas', 'Non, toujours inactif', 'Oui, il apparaît', 'Non, toujours inactif'], attendu: 'sol_changer_ecran' },
  { nom: 'Écran figé, redémarrage de la machine (interrupteur général) sans effet → changer le PC (É2, É5)', statut: 'validé',
    symptome: 't.epimat.screen', reponses: ['Vert', 'figé', 'Non, problème persiste'], attendu: 'sol_changer_pc' },

  /* ---- Alimentation ---- */
  { nom: 'Prise du local sans courant, disjoncteur réarmé sans effet → problème secteur', statut: 'validé',
    symptome: 't.epimat.alim', reponses: ['Non', 'Non'], attendu: 'sol_disjoncteur' },
  { nom: 'Coupe-circuit qui redéclenche aussitôt → ne pas insister, SAV', statut: 'validé',
    symptome: 't.epimat.alim', reponses: ['Oui', 'Non', 'Oui, un bouton est sorti', 'Oui, il redéclenche'], attendu: 'sol_court_circuit' },
  { nom: 'Prise OK, interrupteur général, coupe-circuits et fusible OK, toujours éteinte → changer l\'alimentation générale', statut: 'validé',
    symptome: 't.epimat.alim', reponses: ['Oui', 'Non', 'Non', 'Non'], attendu: 'sol_changer_alim_generale' },

  /* ---- Badge ---- */
  { nom: 'Badge jamais lu, un autre badge marche → reprogrammer le lecteur (B3)', statut: 'validé',
    symptome: 't.epimat.badge', reponses: ['Oui, LED allumée', 'Rien : pas de bip', "Oui, l'autre badge est lu", 'nouveau type de badge'],
    attendu: 'b_reprogrammer' },
  { nom: 'Badge refusé, même numéro que celui imprimé → corriger dans l\'extranet (B4)', statut: 'validé',
    symptome: 't.epimat.badge', reponses: ['Oui, LED allumée', 'Badge lu mais refusé', 'Non', 'Oui, même numéro'],
    attendu: 'b_corriger_bdd' },
  { nom: 'Écran « INITIALISATION BADGE », mauvais nom → vérifier le salarié dans l\'extranet (B8)', statut: 'validé',
    symptome: 't.epimat.badge', reponses: ['Oui, LED allumée', 'INITIALISATION BADGE', 'Non, nom faux'],
    attendu: 'b_salarie_extranet' },
  { nom: 'LED du lecteur éteinte, PC allumé, deux ports USB, absent du Gestionnaire de périphériques → changer le lecteur (B12)', statut: 'validé',
    symptome: 't.epimat.badge', reponses: ['Non, LED éteinte', 'Oui, PC allumé', 'Non, toujours éteinte', 'Non, toujours éteinte', 'Non, rien ne change'],
    attendu: 'sol_changer_lecteur' },
  { nom: 'LED du lecteur éteinte, PC qui ne démarre pas, multiprise éteinte → arbre Alimentation', statut: 'validé',
    symptome: 't.epimat.badge', reponses: ['Non, LED éteinte', 'Non, PC éteint', 'Non, toujours éteint', 'Non, multiprise éteinte'],
    attendu: 'a_debut' },

  /* ---- Internet / modem ---- */
  { nom: 'Online éteinte, redémarrage et antennes sans effet, SIM détectée → relever l\'APN avant de reconfigurer (I4)', statut: 'validé',
    symptome: 't.epimat.internet', reponses: ['Non, au moins un', 'Oui', 'Oui, il clignote', 'Oui, SIM allumé', 'Oui', 'Non, éteint', 'Non, toujours éteinte', 'Non, toujours éteinte'],
    attendu: 'i_lire_apn' },
  { nom: 'Voyants normaux, synchro relancée en échec, page EPIMAT bloquée mais Google s\'ouvre → serveur Logimatiq (M9, M11)', statut: 'validé',
    symptome: 't.epimat.internet', reponses: ['Oui, tous normaux', 'Erreur de synchronisation', 'Non, erreur', 'Non', 'Oui'],
    attendu: 'sol_sav_serveur' },
  { nom: 'Voyant PWR éteint, multiprise intérieure éteinte → arbre Alimentation (M5)', statut: 'validé',
    symptome: 't.epimat.internet', reponses: ['Non, au moins un', 'Non, modem éteint', 'Non, multiprise éteinte'], attendu: 'a_debut' },
  { nom: 'PWR éteint, multiprise allumée, jack et bloc d\'alimentation changés sans effet → changer le modem (M16)', statut: 'validé',
    symptome: 't.epimat.internet', reponses: ['Non, au moins un', 'Non, modem éteint', 'Oui, LED rouge', 'Non', 'Non, toujours éteint'], attendu: 'sol_changer_modem' },
  { nom: 'Voyants normaux, déconnexions malgré antennes, reset sans effet → changer le modem (M14)', statut: 'validé',
    symptome: 't.epimat.internet', reponses: ['Oui, tous normaux', 'Déconnexions', 'Non, toujours instable', 'Non'], attendu: 'sol_changer_modem' },
  { nom: 'Voyant SYS figé, toujours figé après redémarrage → changer le modem (M3)', statut: 'validé',
    symptome: 't.epimat.internet', reponses: ['Non, au moins un', 'Oui', 'Non, fixe ou éteint', 'Non, toujours fixe', 'Non'], attendu: 'sol_changer_modem' },
  { nom: 'Aucune barre de signal malgré antennes et position → antenne externe (M4)', statut: 'validé',
    symptome: 't.epimat.internet', reponses: ['Non, au moins un', 'Oui', 'Oui, il clignote', 'Oui, SIM allumé', 'Non, aucune barre', 'Non, toujours aucune'], attendu: 'sol_antenne_ext' },
  { nom: 'Online toujours éteint après redémarrage, antennes et APN → le SAV vérifie la ligne SIM (M7)', statut: 'validé',
    symptome: 't.epimat.internet', reponses: ['Non, au moins un', 'Oui', 'Oui, il clignote', 'Oui, SIM allumé', 'Oui', 'Non, éteint', 'Non, toujours éteinte', 'Non, toujours éteinte', 'Non, toujours éteinte', 'Non, toujours éteint'], attendu: 'sol_sav_sim' },
  { nom: 'ETH éteint, câble rebranché, PC allumé, autre câble sans effet → changer le modem (M6)', statut: 'validé',
    symptome: 't.epimat.internet', reponses: ['Non, au moins un', 'Oui', 'Oui, il clignote', 'Oui, SIM allumé', 'Oui', 'Oui', 'Non, éteint ou fixe', 'Non, toujours sans réseau', 'Oui, PC allumé', 'Non, toujours éteint', 'Non'], attendu: 'sol_changer_modem' },

  /* ---- Tambour (lot 4) ---- */
  { nom: '« Disjoncteur déclenché » → réarmer le coupe-circuit 24 V (A2, A3)', statut: 'validé',
    symptome: 't.epimat.tambour', reponses: ['Disjoncteur déclenché'], attendu: 't_coupe_circuit_24v' },
  { nom: 'EN PANNE, le tambour tourne au bouton, trappes fermées → câble SCSI d\'abord (T6)', statut: 'validé',
    symptome: 't.epimat.tambour', reponses: ['EN PANNE', 'Oui, il tourne', 'Oui, toutes fermées'], attendu: 't_cable_scsi' },
  { nom: 'Sécu tambour éteint sur un EPIMAT 14 → SAV (pas de test EPI 05)', statut: 'validé',
    symptome: 't.epimat.tambour', reponses: ['EN PANNE', 'Oui, il tourne', 'Oui, toutes fermées', 'Non', 'Oui, tous verts', 'Non, il est éteint', 'portes à gâche'],
    attendu: 'sol_sav_epi02' },
  { nom: 'Arrêt décalé → régler la vitesse lente (T4)', statut: 'validé',
    symptome: 't.epimat.tambour', reponses: ['décalé'], attendu: 't_vitesse' },

  /* ---- Trappe (lot 4) ---- */
  { nom: 'Trappe qui ne s\'ouvre pas dans DEBES, SCSI OK, EPIMAT 14 → SAV', statut: 'validé',
    symptome: 't.epimat.trappe', reponses: ['Problème de distribution', 'Non', 'Non', 'portes à gâche'], attendu: 'sol_sav_epi02' },
  { nom: 'Trappe motorisée EPIMAT 13 qui ne s\'ouvre toujours pas → la condamner dans DistEPI, puis SAV (R4)', statut: 'validé',
    symptome: 't.epimat.trappe', reponses: ['Problème de distribution', 'Non', 'Non', 'trappes (EPIMAT 13)', 'Oui, motorisée', 'Non'],
    attendu: 'sol_condamner_trappe' },

  /* ---- Logiciel (lot 5) ---- */
  { nom: 'Logiciel : écran « EN PANNE » → arbre Tambour (rotation manuelle)', statut: 'validé',
    symptome: 't.log.demarrage', reponses: ['EN PANNE'], attendu: 't_rotation_manuelle' },
  { nom: "Logiciel : salarié créé dans l'extranet absent de la machine → lancer une synchronisation (Maj + L)", statut: 'validé',
    symptome: 't.log.synchro', reponses: ["créé dans l'extranet"], attendu: 'ls_intervalle' },
  { nom: 'Logiciel : lecteur de badge non pris en compte → TypeLecteurBadge = 10', statut: 'validé',
    symptome: 't.log.config', reponses: ['lecteur de badge'], attendu: 'lc_badge' },
];

/* Règles vérifiées sur TOUS les chemins possibles : depuis les points d'entrée, on ne peut
   pas atteindre `cible` sans passer par l'un des nœuds `garde` (ou la réponse `viaReponse`). */
export const REGLES = [
  { nom: 'Alimentation avant pièce : pas de « changer le PC » sans contrôle de la multiprise (ou image visible)',
    cible: ['sol_changer_pc'], garde: ['s_rouge_multiprise', 'b_multiprise', 's_vert_symptome', 's_vert_erreur'] },   // image ou message d'erreur visibles = PC alimenté
  { nom: 'Câble SCSI vérifié avant de changer une carte EPI 05 ou LOG 03 / LOG 04',
    cible: ['sol_changer_epi05', 'sol_changer_log03'], garde: ['t_cable_scsi', 't_pos_scsi', 't_vit_scsi', 'tr_scsi', 'tr_capteur_scsi'] },
  { nom: 'Alimentation avant pièce : pas de « changer le modem » sans voyant PWR allumé ou multiprise intérieure vérifiée',
    cible: ['sol_changer_modem'], garde: ['i_sys_led', 'i_alim_modem', 'i_tous_ok', 'i_eth_led'] },
  { nom: 'EPIMAT 14 : aucune étape EPI 05 sans la réponse « trappes (EPIMAT 13) »',
    cible: ['t_test_epi05', 'tr_motorisee', 'tr_verif_moteur', 'tr_verif_verrou', 'sol_changer_epi05'], viaReponse: /trappes \(EPIMAT 13\)/ },
];
