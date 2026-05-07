/* ============================================================================
   ERRORS — Codes erreur EPIMAT et procédures associées
   ========================================================================== */

export const ERROR_CODES = [
  /* ---- Réseau / Modem ---- */
  {
    code: 'ERR_SYNC_01',
    label: 'Perte de synchronisation modem',
    desc: 'Le modem a perdu la connexion au serveur Logimatiq. Vérifier la LED Online du modem : elle doit être fixe (verte ou bleue).',
    diag: 'epimat.internet',
    tags: ['modem', 'réseau', 'sync', 'led'],
  },
  {
    code: 'ERR_SYNC_02',
    label: 'Modem non détecté',
    desc: 'Le logiciel EPIMAT ne détecte pas le modem USB/GSM. Vérifier le câble USB et relancer le service Windows.',
    diag: 'epimat.internet',
    tags: ['modem', 'usb', 'détection'],
  },
  {
    code: 'ERR_NET_01',
    label: 'Serveur inaccessible',
    desc: 'Impossible de joindre le serveur Logimatiq. Vérifier la connexion Internet et les paramètres APN de la carte SIM.',
    diag: 'epimat.internet',
    tags: ['réseau', 'serveur', 'apn', 'sim'],
  },
  {
    code: 'ERR_NET_02',
    label: 'Timeout connexion',
    desc: 'La connexion au serveur expire. Signal GSM faible ou APN incorrect. Vérifier la couverture réseau et reconfigurer l\'APN.',
    diag: 'epimat.internet',
    tags: ['réseau', 'timeout', 'gsm', 'apn'],
  },

  /* ---- Badge ---- */
  {
    code: 'ERR_BADGE_01',
    label: 'Lecteur badge non détecté',
    desc: 'Le lecteur badge n\'est pas reconnu par Windows. Vérifier le câble USB et les pilotes dans le Gestionnaire de périphériques.',
    diag: 'epimat.badge',
    tags: ['badge', 'lecteur', 'usb', 'pilote'],
  },
  {
    code: 'ERR_BADGE_02',
    label: 'Badge non autorisé',
    desc: 'Le badge présenté n\'est pas dans la base de données. Vérifier l\'initialisation via DISTEPI (voir fiche "Initialisation badges Kalistrut").',
    diag: 'epimat.badge',
    tags: ['badge', 'autorisation', 'distepi'],
  },
  {
    code: 'ERR_BADGE_03',
    label: 'Erreur de lecture badge',
    desc: 'Lecture impossible ou aléatoire. Badge endommagé, distance trop grande (>5 cm), ou interférence magnétique. Tester avec un autre badge.',
    diag: 'epimat.badge',
    tags: ['badge', 'lecture', 'distance'],
  },

  /* ---- Écran ---- */
  {
    code: 'ERR_SCREEN_01',
    label: 'Écran noir au démarrage',
    desc: 'L\'écran reste noir après allumage. Vérifier l\'alimentation de l\'écran, le câble VGA et l\'état du PC (bouton Power).',
    diag: 'epimat.screen',
    tags: ['écran', 'noir', 'alimentation', 'vga'],
  },
  {
    code: 'ERR_SCREEN_02',
    label: 'Écran figé / gelé',
    desc: 'L\'interface ne répond plus. Effectuer un redémarrage du PC via un appui long sur le bouton Power (5 sec), puis relancer.',
    diag: 'epimat.screen',
    tags: ['écran', 'figé', 'gel', 'redémarrage'],
  },
  {
    code: 'ERR_SCREEN_03',
    label: 'Voyant écran rouge fixe',
    desc: 'Le PC est éteint ou n\'envoie pas de signal vidéo. Vérifier que le PC est allumé et que le câble VGA est bien branché des deux côtés.',
    diag: 'epimat.screen',
    tags: ['écran', 'voyant', 'rouge', 'vga', 'pc'],
  },

  /* ---- Imprimante ---- */
  {
    code: 'ERR_PRINT_01',
    label: 'Imprimante non détectée',
    desc: 'L\'imprimante thermique n\'est pas reconnue par Windows. Vérifier l\'alimentation, le câble USB et les pilotes.',
    diag: null,
    tags: ['imprimante', 'usb', 'thermique'],
  },
  {
    code: 'ERR_PRINT_02',
    label: 'Bourrage papier / pas d\'impression',
    desc: 'Le papier est coincé ou le rouleau est mal inséré. Ouvrir le capot de l\'imprimante, retirer le rouleau et le réinsérer côté thermique vers le bas.',
    diag: null,
    tags: ['imprimante', 'papier', 'bourrage', 'rouleau'],
  },

  /* ---- Logiciel ---- */
  {
    code: 'ERR_SOFT_01',
    label: 'Application EPIMAT ne démarre pas',
    desc: 'Le logiciel ne se lance pas au démarrage Windows. Vérifier la présence du raccourci de démarrage et les services en cours (Task Manager).',
    diag: null,
    tags: ['logiciel', 'démarrage', 'windows', 'service'],
  },
  {
    code: 'ERR_SOFT_02',
    label: 'Comptage incorrect ou incohérent',
    desc: 'Les données de comptage ne correspondent pas à la réalité. Vérifier la calibration des capteurs et la cohérence des paramètres dans l\'interface.',
    diag: null,
    tags: ['comptage', 'capteur', 'calibration', 'données'],
  },
  {
    code: 'ERR_DB_01',
    label: 'Base de données corrompue',
    desc: 'Données locales inaccessibles ou corrompues. Ne pas tenter de réparer manuellement. Contacter le SAV Logimatiq pour une réinitialisation sécurisée.',
    diag: null,
    tags: ['base', 'données', 'corruption', 'sav'],
  },
  {
    code: 'ERR_TIME_01',
    label: 'Heure système incorrecte',
    desc: 'L\'heure du PC n\'est pas synchronisée, ce qui peut perturber les logs et la connexion serveur. Vérifier les paramètres NTP dans Windows.',
    diag: null,
    tags: ['heure', 'ntp', 'synchronisation', 'windows'],
  },
];
