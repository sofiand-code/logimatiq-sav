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
    symptoms: [
      'Aucun voyant allumé, écran noir',
      'Machine ne répond à rien',
    ],
    steps: [
      { text: 'Vérifier que la prise murale / multiprise est allumée (voyant rouge allumé)', photo: false, debes: false },
      { text: 'Ouvrir la machine et localiser les coupe-circuits (disjoncteurs) — généralement en haut du tableau électrique', photo: true, debes: false },
      { text: 'Réarmer les coupe-circuits en appuyant dessus (position ON)', photo: true, debes: false },
      { text: 'Si le disjoncteur se redéclenche immédiatement → court-circuit probable, ne pas réarmer', photo: false, debes: false },
      { text: 'Vérifier et remplacer le fusible si grillé (4A min / 5A max)', photo: true, debes: false },
    ],
    sav: false,
  },
  {
    id: 'f_disjoncteur',
    category: 'alimentation',
    title: 'Écran affiche "Disjoncteur déclenché"',
    title_en: 'Screen shows "Circuit breaker tripped"',
    severity: 'critical',
    symptoms: [
      'Message d\'alerte sur l\'écran tactile',
      'Machine partiellement allumée mais bloquée',
    ],
    steps: [
      { text: 'Ouvrir la porte frontale de la machine', photo: false, debes: false },
      { text: 'Localiser les coupe-circuits dans le tableau électrique', photo: true, debes: false },
      { text: 'Appuyer sur les boutons coupe-circuits pour les réarmer (position ON)', photo: true, debes: false },
      { text: 'Redémarrer DistEPI si le message persiste après réarmement', photo: false, debes: false },
      { text: 'Si le disjoncteur se redéclenche → risque de surcharge ou court-circuit → SAV', photo: false, debes: false },
    ],
    sav: true,
  },
  {
    id: 'f_fusible',
    category: 'alimentation',
    title: 'Fusible grillé',
    title_en: 'Blown fuse',
    severity: 'high',
    symptoms: [
      'Courant présent mais un circuit ne fonctionne pas',
      'Moteur ou trappe sans alimentation',
    ],
    steps: [
      { text: 'Identifier le fusible concerné dans le tableau électrique', photo: true, debes: false },
      { text: 'Couper l\'alimentation générale avant d\'intervenir', photo: false, debes: false },
      { text: 'Retirer le fusible et vérifier visuellement s\'il est grillé (filament fondu)', photo: false, debes: false },
      { text: 'Remplacer par un fusible identique : 4A minimum, 5A maximum', photo: false, debes: false },
      { text: 'Remettre l\'alimentation et tester', photo: false, debes: false },
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
    symptoms: [
      'Aucune rotation au démarrage d\'un cycle',
      'Écran affiche "En panne"',
      'Bruit moteur absent',
    ],
    steps: [
      { text: 'Appuyer sur le bouton de rotation manuelle (en haut à droite ou gauche de la machine) pour tester le moteur indépendamment du logiciel', photo: true, debes: false },
      { text: 'Si le tambour tourne manuellement → le moteur et le circuit électronique sont OK → problème de communication logiciel/machine', photo: false, debes: false },
      { text: 'Vérifier le câble SCSI blanc (carte Advantech PC → carte EPI01) : s\'assurer que tous les pins sont bien enfoncés des deux côtés', photo: true, debes: false },
      { text: 'Débrancher et rebrancher le câble SCSI fermement', photo: false, debes: false },
      { text: 'Si tambour ne tourne pas manuellement → vérifier le disjoncteur / coupe-circuits', photo: true, debes: false },
      { text: 'Vérifier et remplacer le fusible (4-5A) si nécessaire', photo: false, debes: false },
      { text: 'Ouvrir DEBES → tester les sorties moteur pour confirmer le diagnostic', photo: true, debes: true },
    ],
    sav: true,
  },
  {
    id: 'f_tambour_mauvaise_position',
    category: 'tambour',
    title: 'Tambour en mauvaise position / colonne erronée',
    title_en: 'Drum in wrong position / wrong column',
    severity: 'high',
    symptoms: [
      'Distribution sur la mauvaise colonne',
      'Décalage entre logiciel et position réelle du tambour',
      'Erreur de position répétée',
    ],
    steps: [
      { text: 'Ouvrir DEBES → section capteurs de position du tambour', photo: true, debes: true },
      { text: 'Observer les 6 voyants de position (un par trou du disque)', photo: true, debes: true },
      { text: 'Lire la position : voyant ÉTEINT = trou détecté. Additionner les valeurs : T1=1, T2=2, T3=4, T4=8, T5=16, T6=32', photo: false, debes: false },
      { text: 'Vérifier que la position lue correspond à la colonne physique réelle', photo: false, debes: false },
      { text: 'Nettoyer le capteur optique (poussière, peluche de tissu) si un voyant ne répond pas', photo: false, debes: false },
      { text: 'Recalibrer le tambour via DEBES si la position est décalée de façon systématique', photo: false, debes: true },
    ],
    sav: false,
  },
  {
    id: 'f_tambour_bloque',
    category: 'tambour',
    title: 'Tambour bloqué / coincé mécaniquement',
    title_en: 'Drum jammed / mechanically stuck',
    severity: 'critical',
    symptoms: [
      'Tentative de rotation mais blocage immédiat',
      'Bruit moteur anormal (grince, force)',
      'Erreur mécanique sur l\'écran',
    ],
    steps: [
      { text: 'Couper l\'alimentation avant toute intervention mécanique', photo: false, debes: false },
      { text: 'Ouvrir la porte frontale et inspecter visuellement le tambour', photo: false, debes: false },
      { text: 'Rechercher un article coincé entre le tambour et la structure', photo: false, debes: false },
      { text: 'Retirer l\'obstacle manuellement avec précaution', photo: false, debes: false },
      { text: 'Vérifier que les rails du tambour ne sont pas endommagés', photo: false, debes: false },
      { text: 'Remettre sous tension et tester la rotation manuelle', photo: true, debes: false },
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
    symptoms: [
      'Cycle de distribution lancé mais trappe reste fermée',
      'L\'employé attend sans recevoir l\'article',
    ],
    steps: [
      { text: 'Vérifier dans DEBES l\'état du capteur de trappe (entrée)', photo: true, debes: true },
      { text: 'Tester la commande d\'ouverture depuis DEBES (sortie solénoïde)', photo: true, debes: true },
      { text: 'Inspecter visuellement si un article est coincé dans le mécanisme de trappe', photo: false, debes: false },
      { text: 'Vérifier le câble de commande du solénoïde de trappe', photo: false, debes: false },
      { text: 'Si la commande est envoyée mais la trappe ne bouge pas → solénoïde ou vérin HS → SAV', photo: false, debes: false },
    ],
    sav: true,
  },
  {
    id: 'f_fermer_trappe',
    category: 'trappe',
    title: 'Écran affiche "Fermer la trappe"',
    title_en: 'Screen shows "Close the hatch"',
    severity: 'high',
    symptoms: [
      'Message bloquant sur l\'écran tactile',
      'Impossible de lancer un cycle',
      'La trappe semble pourtant fermée',
    ],
    steps: [
      { text: 'Vérifier physiquement que la trappe est bien fermée et en butée', photo: false, debes: false },
      { text: 'Ouvrir et refermer la trappe manuellement pour vérifier le verrouillage', photo: false, debes: false },
      { text: 'Ouvrir DEBES → vérifier l\'entrée capteur de trappe (doit changer d\'état à l\'ouverture/fermeture)', photo: true, debes: true },
      { text: 'Si le capteur ne change pas d\'état → nettoyer le capteur (peluches, poussière)', photo: false, debes: false },
      { text: 'Vérifier le câble du capteur de trappe (connexion sur la carte EPI01)', photo: false, debes: false },
      { text: 'Si capteur défaillant après nettoyage → remplacement nécessaire → SAV', photo: false, debes: false },
    ],
    sav: false,
  },
  {
    id: 'f_pb_distribution',
    category: 'trappe',
    title: 'Écran affiche "Problème de distribution"',
    title_en: 'Screen shows "Distribution error"',
    severity: 'high',
    symptoms: [
      'Message d\'erreur en cours de cycle',
      'Cycle interrompu avant la fin',
      'Article non distribué',
    ],
    steps: [
      { text: 'Vérifier qu\'aucun article n\'est coincé dans le mécanisme ou la trappe', photo: false, debes: false },
      { text: 'Ouvrir DEBES → vérifier les capteurs de trappe ET de position tambour', photo: true, debes: true },
      { text: 'Confirmer que la position tambour lue est cohérente avec la colonne demandée', photo: false, debes: true },
      { text: 'Fermer DEBES et redémarrer DistEPI', photo: false, debes: false },
      { text: 'Relancer un cycle test depuis le logiciel', photo: false, debes: false },
      { text: 'Si erreur persiste → redémarrer le PC complet', photo: false, debes: false },
    ],
    sav: false,
  },

  /* ============================== MOTEUR ================================= */
  {
    id: 'f_vitesse_lente',
    category: 'moteur',
    title: 'Tambour tourne lentement → machine passe "En panne"',
    title_en: 'Drum rotates slowly → machine goes to fault',
    severity: 'critical',
    symptoms: [
      'Rotation anormalement lente',
      'La machine passe en panne après quelques tours',
      'Bruit moteur anormal (bourdonnement)',
    ],
    steps: [
      { text: 'Vérifier qu\'aucun obstacle physique ne ralentit le tambour (article coincé, rail endommagé)', photo: false, debes: false },
      { text: 'Vérifier le fusible moteur (4-5A)', photo: true, debes: false },
      { text: 'Vérifier la tension d\'alimentation du moteur', photo: false, debes: false },
      { text: 'Ouvrir DEBES → observer les retours moteur et les temps de cycle', photo: true, debes: true },
      { text: 'Si alimentation correcte, tambour libre et DEBES ne montre rien d\'anormal → moteur en fin de vie → SAV', photo: false, debes: false },
    ],
    sav: true,
  },
  {
    id: 'f_moteur_hs',
    category: 'moteur',
    title: 'Moteur hors service — aucune réponse',
    title_en: 'Motor out of service — no response',
    severity: 'critical',
    symptoms: [
      'Bouton manuel sans effet',
      'Aucun bruit moteur',
      'DEBES ne détecte aucun retour moteur',
    ],
    steps: [
      { text: 'Vérifier alimentation générale et fusibles', photo: true, debes: false },
      { text: 'Ouvrir DEBES → envoyer une commande moteur et observer la réponse', photo: true, debes: true },
      { text: 'Vérifier le connecteur d\'alimentation du moteur (débrancher/rebrancher)', photo: false, debes: false },
      { text: 'Si aucune réponse après toutes ces vérifications → moteur HS → remplacement → SAV', photo: false, debes: false },
    ],
    sav: true,
  },

  /* ============================ PC / LOGICIEL ============================ */
  {
    id: 'f_ecran_en_panne',
    category: 'logiciel',
    title: 'Écran affiche "En panne"',
    title_en: 'Screen shows "Out of order"',
    severity: 'critical',
    symptoms: [
      'Message "En panne" bloquant',
      'Machine hors service, impossible de distribuer',
    ],
    steps: [
      { text: 'Relever le code ou message d\'erreur complet affiché à l\'écran', photo: false, debes: false },
      { text: 'Redémarrer DistEPI sans redémarrer le PC (fermer et relancer C:\\EPI\\DistEPI.exe)', photo: false, debes: false },
      { text: 'Si persiste → ouvrir DEBES pour identifier la source : moteur, capteur, communication', photo: true, debes: true },
      { text: 'Vérifier le câble SCSI (carte Advantech PC → carte EPI01)', photo: true, debes: false },
      { text: 'Rebrancher fermement le câble SCSI des deux côtés', photo: false, debes: false },
      { text: 'Si aucune amélioration → redémarrer le PC complet', photo: false, debes: false },
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
      'Le logiciel se ferme inopinément',
      'Écran Windows visible au lieu de DistEPI',
      'Erreur au lancement',
    ],
    steps: [
      { text: 'Relancer manuellement : double-clic sur C:\\EPI\\DistEPI.exe', photo: false, debes: false },
      { text: 'Vérifier la connexion réseau → LED Online du modem doit être fixe bleue', photo: false, debes: false },
      { text: 'Vérifier l\'espace disque sur C:\\ (doit avoir > 1 Go libre)', photo: false, debes: false },
      { text: 'Redémarrer le PC (Start → Arrêter → Redémarrer)', photo: false, debes: false },
      { text: 'Si crash récurrent après redémarrage → contacter SAV Logimatiq', photo: false, debes: false },
    ],
    sav: false,
  },
  {
    id: 'f_cable_scsi',
    category: 'logiciel',
    title: 'Câble SCSI déconnecté / mal enfoncé',
    title_en: 'SCSI cable disconnected / not fully seated',
    severity: 'high',
    symptoms: [
      'Tambour tourne manuellement mais pas via logiciel',
      'DistEPI ne contrôle pas la machine',
      'DEBES ne lit aucun capteur',
    ],
    steps: [
      { text: 'Ouvrir le boîtier PC de la machine', photo: true, debes: false },
      { text: 'Localiser le câble SCSI blanc reliant la carte Advantech (PC) à la carte EPI01', photo: true, debes: false },
      { text: 'Vérifier que le câble est bien enfoncé côté carte Advantech — tous les pins doivent être insérés', photo: true, debes: false },
      { text: 'Vérifier l\'autre extrémité sur la carte EPI01', photo: true, debes: false },
      { text: 'Débrancher et rebrancher fermement des deux côtés', photo: false, debes: false },
      { text: 'Redémarrer DistEPI et tester', photo: false, debes: false },
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
    symptoms: [
      'Aucune réaction quand le badge est présenté',
      'LED du lecteur allumée mais pas de retour',
    ],
    steps: [
      { text: 'Vérifier que la LED du lecteur de badge est allumée (si éteinte → problème USB)', photo: false, debes: false },
      { text: 'Tester dans Notepad (clavier EN) : présenter le badge et vérifier si des caractères s\'affichent', photo: false, debes: false },
      { text: 'Si rien dans Notepad → vérifier le port COM dans le Gestionnaire de périphériques', photo: false, debes: false },
      { text: 'Vérifier dans AUTOMAT.INI que "port lecteur badge" correspond au bon numéro COM', photo: false, debes: false },
      { text: 'Débrancher/rebrancher le câble USB du lecteur', photo: false, debes: false },
    ],
    sav: false,
  },
  {
    id: 'f_badge_mauvais_numero',
    category: 'badge',
    title: 'Badge lu mais mauvais numéro affiché',
    title_en: 'Badge read but wrong number displayed',
    severity: 'normal',
    symptoms: [
      'Badge présenté → numéro différent de celui imprimé',
      'Employé "inconnu" dans le logiciel',
    ],
    steps: [
      { text: 'Tester dans Notepad (clavier EN) : noter exactement ce qui s\'affiche', photo: false, debes: false },
      { text: 'Comparer le numéro Notepad avec celui imprimé sur le badge', photo: false, debes: false },
      { text: 'Si différent → reprogrammer le lecteur de badge', photo: false, debes: false },
      { text: 'Si identique → corriger le numéro dans la base de données (Admin Base dans DistEPI)', photo: false, debes: false },
    ],
    sav: false,
  },
];
