
(function () {
  const $ = s => document.querySelector(s);
  const byId = id => document.getElementById(id);
  const qs = k => new URLSearchParams(location.search).get(k) || "";
  
  // RÉCUPÉRER LE SLUG DE L'URL (supporte "slug" et "filiere")
  function getSlugFromUrl() {
    const params = new URLSearchParams(location.search);
    // Essayer "filiere" d'abord (utilisé par l'admin), puis "slug"
    return params.get("filiere") || params.get("slug") || "";
  }

  // =======================
  // IMAGES PAR FILIERE
  // =======================
  window.FILIERE_IMAGES = {
    "assistant-administratif-option-gestion": "https://staffmatch.com/static/60c86305e4a2c24eb6e5eb14a16d2c61/d8f37/fd25f6e9153b8dbdd1332615.jpg",
    "bureau-detude-en-construction-metallique": "https://www.cours-gratuit.com/images/121/13026/id-13026-01.jpg",
    "certification-microsoft-office-specialist-en-access": "https://images.credly.com/images/fa9d334c-ebc6-41db-85a5-d6089b1e406b/twitter_thumb_201604_MOS-Access-Expert-Badge.png",
    "certification-microsoft-office-specialiste-en-outlook": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_kEPikMQLO4B9iq9Btv5oQ_cKg2ISJCQceA&s",
    "certification-microsoft-office-specialiste-en-powerpoint": "https://www.vtutor.org/cdn/shop/files/powerpointassociate2019.png?v=1692566018",
    "infrastructure-digitale-option-cyber-securite": "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/5AxXJDzaX3lxU6LTS4bN7t/cb0b7f31ee0b2f400719333328095337/GettyImages-2175168300.jpg?w=1500&h=680&q=60&fit=fill&f=faces&fm=jpg&fl=progressive&auto=format%2Ccompress&dpr=1&w=1000",
    "reparateur-de-vehicule-automobile-maalem": "https://listival.com/wp-content/uploads/2023/09/Car-Repair-Shop.jpeg",
    "electricit-d-installation": "https://images.prismic.io/lebonartisan/ad161e1fd45f75c807e91a5078763035904d4399_article-installation-electrique.jpg?auto=compress,format",
    "construction-m-tallique": "https://www.formation-industrie.bzh/images/medias/Construction_metallique_AdobeStock_66055915.jpeg",
    "froid-commercial-et-climatisation": "https://cdn.energierecrute.com/public/img/fiches_metiers/frigoriste.jpg",
    "fabrication-m-canique": "http://127.0.0.1:5500/WhatsApp%20Image%202025-11-29%20at%2022.16.40.jpeg",
    "m-thodes-en-fabrication-m-canique": "https://www.har-tech.com/wp-content/uploads/2022/01/technicien-usinage.jpeg",
    "assistant-administratif-option-commerce": "https://staffmatch.com/static/60c86305e4a2c24eb6e5eb14a16d2c61/d8f37/fd25f6e9153b8dbdd1332615.jpg",
    "assistant-administratif-option-comptabilit": "https://img.figarocms.net/cadremploi-edito/Ztltvrzzk9ZrXA8c_Analystefinancier.jpg?auto=format,compress&rect=0,432,5184,2592&w=800&h=400",
    "gestion-des-entreprises": "https://miage.ma/wp-content/uploads/2022/09/Gestion-des-Entreprises-1.jpg",
    "gestion-des-entreprises-option-comptabilit-et-finance": "https://www.je-change-de-metier.com/images/contents/metiers-comptabilite-bien-paye-analyste-financier.png",
    "gestion-des-entreprises-option-commerce-et-marketing": "https://www.orientaction-groupe.com/wp-content/uploads/2023/11/COMMERCIAL-FICHE-POSTE-ORIENTACTION.jpg",
    "gestion-des-entreprises-option-ressources-humaines": "https://f.hellowork.com/edito/sites/5/2021/09/22189-768x432.jpg",
    "electricit-de-maintenance-industrielle": "https://f.hellowork.com/obs-static-images/seo/ObsJob/technicien-de-maintenance-electrique.jpg",
    "electrom-canique-des-syst-mes-automatis-s": "https://www.inforoutefpt.org/images/formations/5-5281-ogImage.jpg",
    "r-paration-des-engins-moteurs-option-automobile": "https://www.educatel.fr/wp-content/uploads/2021/04/metier-devenir-mecanicien-auto-6.jpg",
    "technicien-sp-cialis-en-diagnostic-et-electronique-embarqu-e": "https://www.afpa.fr/documents/89025196/151491078/controle+technique.png/a3d3ee2e-3d24-f434-c275-0d480db75367?t=1678719273000",
    "certification-microsoft-office-sp-cialiste-en-excel": "https://images.credly.com/images/9d2bcbe6-519f-4ed0-ad34-aca077421568/twitter_thumb_201604_MOS_Excel.png",
     "d-veloppement-digital": "https://blog.lesjeudis.com/wp-content/uploads/2024/05/developpeur-informatique.png",
    "d-veloppement-digital-option-applications-mobiles": "https://blog.lesjeudis.com/wp-content/uploads/2024/05/developpeur-informatique.png",
    "d-veloppement-digital-option-web-full-stack": "https://blog.lesjeudis.com/wp-content/uploads/2024/05/developpeur-informatique.png",
    "infrastructure-digitale-option-syst-mes-et-r-seaux": "https://cdn-elpac.nitrocdn.com/cajkzGoPmgvOZOogAgaDIwOcFzwYjrjw/assets/images/optimized/rev-2dc178c/e-volve.fr/wp-content/uploads/elementor/thumbs/5-metiers-de-it.png-qymwqf0jzoi5d9luj8cub4gcj0jh4ye8x0cllcnkio.webp",
    "arts-culinaires": "https://magazine.plus-que-pro.fr/uploads/2022/09/art-culinaire-definition.jpg",
    "arts-culinaires-option-cuisine-gastronomique": "https://magazine.plus-que-pro.fr/uploads/2022/09/art-culinaire-definition.jpg",
    "arts-culinaires-option-cuisine-marocaine": "https://magazine.plus-que-pro.fr/uploads/2022/09/art-culinaire-definition.jpg",
    "agent-de-restauration": "https://magazine.plus-que-pro.fr/uploads/2022/09/art-culinaire-definition.jpg",
    "management-hotellier": "https://butler-academy.com/wp-content/uploads/2023/06/receptionists-5975962_1280.jpg",
    "management-hotellier-option-gestion-hoteliere": "https://butler-academy.com/wp-content/uploads/2023/06/receptionists-5975962_1280.jpg",
    "service-de-restauration-arts-de-table": "https://stelo-formation.fr/wp-content/uploads/2021/12/services-et-arts-de-la-table.jpg",
    "certification-microsoft-office-specialist-en-word": "https://images.credly.com/images/238bc0c8-e93e-4f61-aba2-255ca4e0f220/MOS_Word_Expert1.png",
    "electricite-de-batiment": "https://www.samsic-emploi.fr/sites/samsic-emploi/files/styles/image_contenu/public/2025-05/Electricien%20batiment_0.png?itok=MLv_k-V5",
    "m-canicien-g-n-ral-polyvalent": "https://f.maformation.fr/edito/sites/3/2018/05/77.jpeg",
    "electricit-d-entretien-industriel": "https://f.hellowork.com/obs-static-images/seo/ObsJob/technicien-de-maintenance-electrique.jpg",
    "r-parateur-de-v-hicules-automobiles": "https://listival.com/wp-content/uploads/2023/09/Car-Repair-Shop.jpeg",
    "infographie": "https://www.hack-academy.fr/wp-content/uploads/2024/04/20240404_660ea31a28248.jpg",
    "agent-socio-educatif": "https://www.studycdn.space/sites/default/files/article/2022-06/arton71662.png",
    "assistant-administratif": "https://staffmatch.com/static/60c86305e4a2c24eb6e5eb14a16d2c61/d8f37/fd25f6e9153b8dbdd1332615.jpg",
    "educateur-specialise-dans-la-petite-enfance": "https://www.centre-pedagogique-sherwood.com/wp-content/uploads/2023/11/iStock-1170395430-min.webp",
    "coiffure-femmes": "https://www.je-change-de-metier.com/images/contents/metiers-accessibles-cap-coiffure.png",
    "ouvrier-sp-cialis-en-coupe-et-couture": "https://www.je-change-de-metier.com/images/contents/metiers-accessibles-cap-coiffure.png",
    "programme-innovation-entrepreneuriale": "https://f2.hespress.com/wp-content/uploads/2022/04/innovation.jpg",

    "genie-civil-1ere-annee": "https://www.directemploi.com/uploads/article/120191023175647_pte.jpg",
    "genie-civil-option-batiments-2eme-annee": "https://www.directemploi.com/uploads/article/120191023175647_pte.jpg",
    "genie-civil-option-travaux-publics-2eme-annee": "https://www.directemploi.com/uploads/article/120191023175647_pte.jpg",
    "genie-civil-option-methodes-2eme-annee": "https://www.directemploi.com/uploads/article/120191023175647_pte.jpg",
    "genie-civil-option-laboratoire-2eme-annee": "https://www.directemploi.com/uploads/article/120191023175647_pte.jpg",
    "geometre-topographe-1ere-annee": "https://www.emploisnb.ca/occupations/sites/default/files/styles/16_9_image/public/2023-10/2231.jpg?itok=iohUjZVs",
    "geometre-topographe-2eme-annee": "https://www.emploisnb.ca/occupations/sites/default/files/styles/16_9_image/public/2023-10/2231.jpg?itok=iohUjZVs",
    "maintenance-des-engins-du-btp-1ere-annee": "https://laconstruction.fr/app/uploads/2023/01/mecanicien_d_engins-1.png",
    "maintenance-des-engins-du-btp-2eme-annee": "https://laconstruction.fr/app/uploads/2023/01/mecanicien_d_engins-1.png",
    "batiment-1ere-annee": "https://rebondir.fr/wp-content/uploads/sites/3/2023/10/REB_Secteur-batiment-1024x576.jpg",
    "batiment-option-metreur-2eme-annee": "https://rebondir.fr/wp-content/uploads/sites/3/2023/10/REB_Secteur-batiment-1024x576.jpg",
    "batiment-option-projeteur-2eme-annee": "https://rebondir.fr/wp-content/uploads/sites/3/2023/10/REB_Secteur-batiment-1024x576.jpg",
    "gros-oeuvre-1ere-annee": "https://www.btpcfa-na.fr/wp-content/uploads/2023/07/AdobeStock_331598222-1.jpeg",
    "gros-oeuvre-2eme-annee": "https://www.btpcfa-na.fr/wp-content/uploads/2023/07/AdobeStock_331598222-1.jpeg",
    "electricite-de-batiment-specialisation-1ere-annee": "https://www.samsic-emploi.fr/sites/samsic-emploi/files/styles/image_contenu/public/2025-05/Electricien%20batiment_0.png?itok=MLv_k-V5",
    "conducteur-d-engins-btp-1ere-annee": "https://catrformation.fr/wp-content/uploads/2018/12/Conducteur-d%E2%80%99Engins-Quelles-Sont-Les-Perspectives-d%E2%80%99Avenir-CAT-R-Formations-IDF.jpg",
    "grutier-tour-mobile-1ere-annee": "https://www.abskill.com/wp-content/uploads/2021/10/Titre-professionnel-Conducteur-de-grue-a-tour-min.jpg",
    "maintenance-des-engins-lourds-et-vehicules-industriels-1ere-annee": "https://laconstruction.fr/app/uploads/2023/01/mecanicien_d_engins-1.png",
    "hse-en-btp-1ere-annee": "https://www.interaction-interim.com/sites/default/files/2022-01/Technicien%20HSE.png",
    "parcours-collegial-electricite-de-batiment": "https://www.samsic-emploi.fr/sites/samsic-emploi/files/styles/image_contenu/public/2025-05/Electricien%20batiment_0.png?itok=MLv_k-V5",
    "parcours-collegial-peintre": "https://www.samsic-emploi.fr/sites/samsic-emploi/files/styles/image_contenu/public/2025-05/Peintre%20en%20b%C3%A2timent.png?itok=FINTQc8F",
    "parcours-collegial-plombier-de-batiment": "https://plombier.com/assets/img/conseils/conseils-plombier.jpg",
    "parcours-collegial-pose-de-carrelage-sol-et-mur": "https://carreleur.en-ligne.me/comptabilite-en-ligne/i/fd-carreleur1.jpg",
    "parcours-collegial-tacheron": "https://espace-competences.constructys.fr/media/metiers/images/Cheffe_d%C3%A9quipe_b%C3%A2timent_2lofDvX.webp",

    "menuiserie-metallique": "https://metallerie-campan-benoit.com/uploads/media/images/cms/medias/thumb_/cms/medias/650d9080eca48_images_large.jpeg",
    "menuiserie": "https://www.obat.fr/blog/wp-content/uploads/2020/10/metier-menuisier-1280x720.jpg",
    "menuiserie-aluminium": "https://cdn.prod.website-files.com/65bb54b8af340ad59dcd9007/65eac94d4b60e2654cfab1e7_Design%20sans%20titre%20(53).webp",
    "menuiserie-option-aluminium-et-bois": "https://img.batiweb.com/repo-images/article/41489/menuiseriealu.jpg",

    "operateur-polyvalent-construction-metallique": "https://www.har-tech.com/wp-content/uploads/2022/11/machiniste-conventionnel.jpeg",
  "monteur-en-reseaux-electriques": "https://espace-competences.constructys.fr/media/metiers/images/Monteureuse_en_r%C3%A9seaux_d%C3%A9nergie.webp",
  "peinture-batiment": "https://www.batipole.com/sites/default/files/2025-02/Peinture_batiment.jpg",
  "plomberie-sanitaire": "https://urgenceartisans.fr/wp-content/uploads/2024/02/Plombier-a-le-oeuvre-dans-une-salle-de-bain-plomberie-sanitaire-service-de-reparation-.jpg",
  "pose-de-carrelage-sol-et-mur": "https://vss.astrocenter.fr/habitatpresto/pictures/29594768-adobestock-271883431.jpg",
  "voirie": "https://www.sogelink.com/wp-content/uploads/2021/08/La-solution-de-gestion-de-permission-de-voirie.jpeg",
  "hse-hygiene-securite-environnement": "https://www.lonasante.com/wp-content/uploads/2023/11/Metier-de-lIngenieur-HSE-Hygiene-Securite-Environnement.jpg",
  
  "mecanicien-engins-de-chantier-1ere-annee": "https://www.jobboom.com/carriere/wp-content/uploads/2014/03/mecanique_engin.jpg",
  "mecanicien-engins-de-chantier-2eme-annee": "https://www.jobboom.com/carriere/wp-content/uploads/2014/03/mecanique_engin.jpg",
  "diagnostic-et-electronique-embarquee": "https://isatfes.artisanat.gov.ma/wp-content/uploads/2023/02/diagnostic-750x420.jpg",
  "management-hotellier-option-hebergement": "https://www.purple-campus.com/media/2023/08/RH.BTS_.Management-hotellerie-restauration-unite%CC%81-he%CC%81bergement-e1698663868706.png",
  "management-hotellier-option-restauration": "https://www.cite-formations-tours.fr/wp-content/uploads/2020/01/service-en-salle-formation-tours-1000x620.jpg",
  
  // adults
  "fc-bureautique-avancee-entreprises":"https://fcmicro.net/wp-content/uploads/2023/07/Services-Maintenance-informatique.jpg",
   "ql-techniques-vente-relation-client-settat":"https://www.igensia-alternance.fr/app/uploads/sites/2/2024/06/igensia-alternance-article-commerce-vente-relation-clients-metiers-relation-client-header.jpg",
   "fc-comptabilite-gestion-pme-settat":"https://www.comptablejgc.com/wp-content/uploads/2021/10/business-3167295_1280.jpg",
   "cs-developpement-digital-cours-soir-settat":"https://f.hellowork.com/obs-static-images/seo/ObsJob/developpeur-web.jpg",
   "ql-bureautique-base-internet-benahmed":"https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/3SziUD3GiFk6nbN4qOl4wU/e47457762d0e81d3a5975cf2e5001ce9/GettyImages-2114011643.jpg?w=1500&h=680&q=60&fit=fill&f=faces&fm=jpg&fl=progressive&auto=format%2Ccompress&dpr=1&w=1000",
   "fc-gestion-stocks-magasins-benahmed":"https://a.storyblok.com/f/123939/2240x1260/378424a140/commerce-et-comptabilite.png/m/1200x0",
   "ql-maintenance-electrique-base-benahmed":"https://www.formation-industrie.bzh/images/medias/Electricite_industrielle_Electricite_industrielle.jpeg",
   "fc-hse-chantier-btp-elbrouj":"https://www.blog-qhse.com/hubfs/BTP-BKG.png",
   "ql-lecture-plans-metres-btp-elbrouj":"https://f.maformation.fr/edito/sites/3/2022/03/lecture-plan.jpeg",
    "cs-gestion-entreprises-cours-soir-settat": "https://miage.ma/wp-content/uploads/2022/09/Gestion-des-Entreprises-1.jpg",
};



  const G = {
    ESTABLISSEMENTS: (typeof ESTABLISSEMENTS !== "undefined" ? ESTABLISSEMENTS : []),
    FILIERES: (typeof FILIERES !== "undefined" ? FILIERES : [])
  };

  // AJOUT : fonction pour charger les formations admin dans FILIERES
  function loadAdminFormations() {
    try {
      const adminFormations = JSON.parse(localStorage.getItem("ADMIN_FORMATIONS")) || [];
      const adminImages = JSON.parse(localStorage.getItem("ADMIN_FILIERE_IMAGES")) || {};
      
      // Ajouter les formations admin à FILIERES si pas déjà présent
      adminFormations.forEach(f => {
        const exists = G.FILIERES.some(existing => existing.slug === f.slug);
        if (!exists) {
          G.FILIERES.push(f);
        }
      });
      
      // Ajouter les images admin
      Object.assign(window.FILIERE_IMAGES, adminImages);
      
      console.log("Formations admin chargées:", adminFormations.length);
    } catch (e) {
      console.error("Erreur chargement formations admin:", e);
    }
  }

  // Charger les formations admin dès le début
  loadAdminFormations();

  const I = {
    cap: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 2 8l10 5 8-4.1V15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 12v3c0 2 3 3 6 3s6-1 6-3v-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    day: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 2v4M16 2v4M3 9h18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    diploma: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16v10H4z" stroke="currentColor" stroke-width="1.6"/><path d="M8 7V5a4 4 0 1 1 8 0v2" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="2.4" stroke="currentColor" stroke-width="1.6"/></svg>`
  };

  // -------- Détection secteur (comme avant)
  function detectSector(ff) {
    // 1) Si la filière a déjà un secteur renseigné, on le garde
    if (ff && ff.secteur && String(ff.secteur).trim()) {
      return ff.secteur.trim();
    }

    // 2) Texte sur lequel on va chercher des mots-clés
    const txt = (
      (ff?.titre || "") + " " +
      (ff?.extrait || "") + " " +
      (ff?.tabs?.presentation || "")
    ).toLowerCase();

    const rules = [
      // 1. Arts et Industries Graphiques
      [
        "Arts et Industries Graphiques",
        [
          "graphique", "graphisme", "infographie", "maquette",
          "mise en page", "paow", "illustration", "design graphique",
          "industries graphiques", "imprimerie", "pré-presse"
        ]
      ],

      // 2. Digital et Intelligence Artificielle
      [
        "Digital et Intelligence Artificielle",
        [
          "digital", "informatique", "developer", "développeur",
          "programmation", "programmateur", "dev",
          "full stack", "frontend", "backend", "web",
          "cloud", "data", "réseau", "réseaux",
          "infrastructure", "it", "application",
          "intelligence artificielle", "ia", "ai"
        ]
      ],

      // 3. Génie Electrique
      [
        "Génie Electrique",
        [
          "électric", "electrique", "électrotechnique",
          "électromécanique", "automatismes", "automatisés",
          "câblage", "installation électrique",
          "maintenance électrique", "courant fort", "courant faible"
        ]
      ],

      // 4. Génie Mécanique
      [
        "Génie Mécanique",
        [
          "mécanique", "mecanique", "fabrication mécanique",
          "maintenance industrielle", "machines", "usinage",
          "tour conventionnel", "fraiseuse", "cnc",
          "production mécanique", "réglage machine"
        ]
      ],

      // 5. Gestion et Commerce
      [
        "Gestion et Commerce",
        [
          "gestion", "commerce", "commercial", "commerçant",
          "comptabilité", "comptable", "marketing", "vente",
          "administration", "administratif", "logistique",
          "finance", "banque", "secrétariat", "assistant",
          "gestionnaire", "ressources humaines", "rh"
        ]
      ],

      // 6. Métiers de l'Automobile
      [
        "Métiers de l'Automobile",
        [
          "automobile", "auto", "véhicule", "vehicule",
          "moteur", "garage", "carrosserie", "carrossier",
          "diagnostic auto", "mécanicien auto", "mecanicien auto",
          "engins roulants"
        ]
      ],

      // 7. Textile Habillement
      [
        "Textile Habillement",
        [
          "textile", "habillement", "mode", "fashion",
          "confection", "couture", "couturière", "stylisme",
          "modélisme", "modelisme", "broderie",
          "prêt-à-porter", "pret a porter"
        ]
      ],

      // 8. Tourisme Hôtellerie Restauration
      [
        "Tourisme Hôtellerie Restauration",
        [
          "tourisme", "touristique", "hôtel", "hotel",
          "hôtellerie", "restauration", "restaurant",
          "hébergement", "réception", "réceptionniste",
          "arts culinaires", "cuisine", "pâtisserie", "serveur",
          "service de salle", "room service", "barista"
        ]
      ],

      // 9. Bâtiment et Travaux Publics
      [
        "Bâtiment et Travaux Publics",
        [
          "btp", "bâtiment", "batiment", "travaux publics",
          "génie civil", "genie civil", "chantier",
          "plomberie", "menuiserie", "carrelage",
          "maçonnerie", "maconnerie", "peinture bâtiment",
          "conducteur d'engins", "topographe", "géomètre"
        ]
      ],

      // 10. Services à la Personne
      [
        "Services à la Personne",
        [
          "services à la personne", "service a la personne",
          "aide à domicile", "aide a domicile", "personnes âgées",
          "personnes agees", "enfants", "petite enfance",
          "accompagnement", "social", "éducatif",
          "assistante", "assistant de vie"
        ]
      ],
    ];

    for (const [label, keywords] of rules) {
      if (keywords.some(k => txt.includes(k))) {
        return label;
      }
    }

    // Si vraiment aucun mot-clé trouvé, on met un secteur existant (pas un 11ème)
    return "Services à la Personne";
  }

  // -------- Récup des données
  const slug = decodeURIComponent(getSlugFromUrl());
  
  // AJOUT : débogage pour voir ce qui se passe
  console.log("=== DETAIL.JS DEBUG ===");
  console.log("Slug recherché:", slug);
  console.log("URL complète:", window.location.href);
  console.log("FILIERES disponibles:", G.FILIERES.length);
  
  if (!slug) {
    console.error("Aucun slug trouvé dans l'URL");
  }
  
  const f = G.FILIERES.find(x => String(x.slug) === slug);
  const root = byId("detail");

  if (!f) { 
    console.error("Formation NON trouvée. Slugs disponibles:", G.FILIERES.map(f => f.slug));
    root.innerHTML = `<div class="section">
      <h2>Filière introuvable</h2>
      <p>La formation demandée n'existe pas ou n'a pas été trouvée.</p>
      <p><strong>Slug recherché :</strong> "${slug}"</p>
      <p><a href="formations.html" class="btn btn--primary">Retour aux formations</a></p>
    </div>`; 
    return; 
  }

  // AJOUT : Débogage de la formation trouvée
  console.log("✅ Formation trouvée:", f.titre);
  console.log("Slug:", f.slug);
  console.log("Secteur:", f.secteur);

  const sector = detectSector(f);
  const estabHTML = (f.etabs || [])
    .map(id => (G.ESTABLISSEMENTS || []).find(e => e.id === id))
    .filter(Boolean)
    .map(e => e.nom || e.ville || "")
    .join(" • ");

  const TAB_MAP = [
    { key: "presentation", title: "Présentation" },
    { key: "admission",    title: "Conditions d'admission" },
    { key: "debouches",    title: "Débouchés professionnels" },
    { key: "vise",         title: "Compétences visées" },
    { key: "evaluation",   title: "Évaluation de la formation" },
    { key: "modalites",    title: "Modalités de sélection" },
    { key: "organisation", title: "Organisation de la formation" },
    { key: "cible",        title: "Public cible" },
    { key: "profil",       title: "Profil de Formation" },
    { key: "filiere",      title: "Filières d'accès niveaux supérieurs" }
  ];
  
  // Filtrer les onglets qui ont du contenu
  const tabsAvailable = TAB_MAP.filter(t => {
    const content = f.tabs?.[t.key] || "";
    return content.trim().length > 0;
  });

  // Si aucun onglet n'a de contenu, afficher un message
  if (tabsAvailable.length === 0 && f.tabs) {
    // Essayer de trouver n'importe quel contenu dans tabs
    for (const key in f.tabs) {
      if (f.tabs[key] && f.tabs[key].trim().length > 0) {
        tabsAvailable.push({ key: key, title: key.charAt(0).toUpperCase() + key.slice(1) });
      }
    }
  }

  // -------- HTML
  root.innerHTML = `
    <section class="hero-banner" data-sec="${sector}">
      <div class="shade"></div>
      <div class="hero-overlay">
        <h1 class="hero-title">${f.titre || ""}</h1>
        <div class="badges">
          <div class="badge"><span class="ico">${I.cap}</span><span>${f.niveau || "—"}</span></div>
          <div class="badge"><span class="ico">${I.day}</span><span>${f.mode || "Cours du jour"}</span></div>
          <div class="badge"><span class="ico">${I.diploma}</span><span>${f.diplome || "—"}</span></div>
        </div>
      </div>
    </section>

    <h2 class="section-title center">Présentation de la filière</h2>
    <section class="section intro">
      ${f.extrait ? `<p class="lead">${f.extrait}</p>` : ""}
      ${f?.tabs?.presentation ? `<p>${f.tabs.presentation}</p>` : ""}
    </section>

    ${tabsAvailable.length > 0 ? `
    <h2 class="section-title center">Tous ce que vous devez savoir</h2>
    <section class="section vtabs">
      <div class="vtabs-wrap">
        <aside class="vtabs-nav" role="tablist" aria-orientation="vertical">
          ${tabsAvailable.map((t, i) => `
            <button class="vtabs-link ${i===0 ? "active" : ""}" role="tab" data-tab="${t.key}">
              ${t.title}
            </button>
          `).join("")}
        </aside>

        <article class="vtabs-panel" role="tabpanel">
          ${tabsAvailable.map((t, i) => `
            <div class="tab-content ${i===0 ? "show" : ""}" data-tab="${t.key}">
              <h3>${t.title}</h3>
              <p>${f.tabs[t.key]}</p>
            </div>
          `).join("")}
        </article>
      </div>
    </section>
    ` : ''}
  `;

  // -------- Tabs interactives
  const links = root.querySelectorAll(".vtabs-link");
  const panels = root.querySelectorAll(".tab-content");
  links.forEach(btn => {
    btn.addEventListener("click", () => {
      links.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const key = btn.getAttribute("data-tab");
      panels.forEach(p => p.classList.toggle("show", p.getAttribute("data-tab") === key));
    });
  });

  // -------- Animations scroll
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("revealed"); obs.unobserve(e.target); } });
  }, { threshold: .08, rootMargin: "0px 0px -8% 0px" });
  root.querySelectorAll(".hero-banner, .section").forEach(el => { el.classList.add("reveal-base"); obs.observe(el); });

  // -------- HERO : 1 image web UNIQUE par filière + fallbacks existants
  (function(){
    try{
      var heroEl = document.querySelector('.hero-banner');
      if (!heroEl) return;

      var sectorMap      = (window.SECTOR_BANNERS || {});
      var filiereImages  = (window.FILIERE_IMAGES || {});

      function slugify(s){
        return (s||'')
          .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
          .replace(/[^a-zA-Z0-9]+/g,'-')
          .replace(/^-+|-+$/g,'')
          .toLowerCase() || 'secteur';
      }

      var localFiliere = "images/filiere/" + encodeURIComponent(slug) + ".jpg";
      var localSector  = "images/secteurs/" + slugify(sector) + ".jpg";
      var remoteSector = sectorMap[sector] || "";
      var remoteFiliereManual = filiereImages[slug] || "";

      function setHero(url){
        heroEl.style.setProperty('--hero', "url('"+url+"')");
      }

      // 1️⃣ PRIORITÉ : l'URL que TU as mise dans window.FILIERE_IMAGES
      if (remoteFiliereManual){
        console.log("Utilisation image filière:", remoteFiliereManual);
        setHero(remoteFiliereManual);
        return;
      }

      // 2️⃣ Sinon on garde ton ancien système : image locale filière -> secteur -> bannière secteur
      var i1 = new Image();
      i1.onload = function(){ 
        console.log("Image locale filière chargée:", localFiliere);
        setHero(localFiliere); 
      };
      i1.onerror = function(){
        console.log("Image locale filière non trouvée, tentative secteur...");
        var i2 = new Image();
        i2.onload = function(){ 
          console.log("Image secteur chargée:", localSector);
          setHero(localSector); 
        };
        i2.onerror = function(){
          console.log("Image secteur non trouvée, tentative bannière...");
          if (remoteSector){ 
            console.log("Bannière secteur chargée:", remoteSector);
            setHero(remoteSector); 
          } else {
            console.log("Aucune image trouvée, utilisation couleur par défaut");
            heroEl.style.setProperty('--hero', 'linear-gradient(135deg, #0072bc, #00a651)');
          }
        };
        i2.src = localSector;
      };
      i1.src = localFiliere;

    }catch(e){
      console.error('[hero-banner]', e);
    }
  })();

})();
