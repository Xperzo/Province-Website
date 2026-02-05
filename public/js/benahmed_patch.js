(function () {
  if (typeof FILIERES === 'undefined') return;

  const normalize = str => String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-\u036f]/g, '');

  // Cibles Industrie & Maintenance (auto, électromécanique)
  const TARGETS = new Set([
    'reparateur de vehicules automobiles',
    'reparateur de vehicule automobile (maalem)',
    'reparation des engins a moteurs (option automobile)',
    'reparation des engins a moteurs option automobile',
    'technicien specialise en diagnostic & electronique embarquee',
    'technicien specialise en diagnostic et electronique embarquee',
    'electromecanique des systemes automatises'
  ]);

  // Cibles BTP : toutes les filières du complexe BTP doivent être en secteur "Bâtiment & TP"
  const BTP_LABELS = [
    "Génie Civil (1ère année)",
    "Génie Civil option Bâtiments (2ème année)",
    "Génie Civil option Travaux Publics (2ème année)",
    "Génie Civil option Méthodes (2ème année)",
    "Génie Civil option Laboratoire (2ème année)",
    "Géomètre Topographe (1ère année)",
    "Géomètre Topographe (2ème année)",
    "Maintenance des Engins du BTP (1ère année)",
    "Maintenance des Engins du BTP (2ème année)",
    "Bâtiment (1ère année)",
    "Bâtiment option Métreur (2ème année)",
    "Bâtiment Option Projeteur (2ème année)",
    "Gros œuvre (1ère année)",
    "Gros œuvre (2ème année)",
    "Electricité de Bâtiment (Spécialisation 1ère année)",
    "Conducteur d'Engins BTP (1ère année)",
    "Grutier à Tour et Mobile (1ère année)",
    "Maintenance des engins lourds et véhicules industriels (1ère année)",
    "HSE en BTP (1ère année)",
    "Parcours Collégial Electricité de Bâtiment",
    "Parcours Collégial Peintre",
    "Parcours Collégial Plombier de bâtiment",
    "Parcours Collégial Pose de carrelage sol et mur",
    "Parcours Collégial Tâcheron"
  ];
  const BTP_TARGETS = new Set(BTP_LABELS.map(normalize));

  FILIERES.forEach(f => {
    if (!f || !f.titre) return;
    const titre = normalize(f.titre);

    // Forcer Industrie & Maintenance pour les filières auto / électromécanique
    if (TARGETS.has(titre)) {
      f.secteur = 'Industrie & Maintenance';
    }

    // Forcer le secteur BTP pour toutes les filières du complexe BTP
    if (BTP_TARGETS.has(titre)) {
      f.secteur = 'Bâtiment & TP';
    }
  });
})();