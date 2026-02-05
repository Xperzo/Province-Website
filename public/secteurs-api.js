// secteurs-api.js - Version corrigée avec affichage visuel
window.SecteursAPI = {
  // ============ DONNÉES PAR DÉFAUT ============
  getDonneesParDefaut: function() {
    return {
      "arts-industries-graphiques": {
        titre: "Arts et Industries Graphiques",
        slug: "arts-industries-graphiques",
        image: "https://www.hack-academy.fr/wp-content/uploads/2024/04/20240404_660ea31a28248.jpg",
        resume: "La création artistique et graphique est votre domaine de prédilection ? La conception visuelle et la mise en scène vous passionnent ?",
        heroImage: "https://www.hack-academy.fr/wp-content/uploads/2024/04/20240404_660ea31a28248.jpg",
        presentation: [
          "La création artistique et graphique est votre domaine de prédilection ? La conception visuelle et la mise en scène vous passionnent ?",
          "De l'idée à l'impression, les professionnels conçoivent identités visuelles, affiches, brochures, contenus digitaux et supports publicitaires."
        ],
        video: "images/formation/ARTS.mp4",
        stats: [
          { icon: "fa-users", value: "+ de 18 000", label: "emplois dans les métiers de la création graphique" },
          { icon: "fa-bullhorn", value: "+ de 300", label: "agences de communication et studios graphiques" }
        ],
        skills: [
          { icon: "fa-people-group", label: "Esprit d'équipe" },
          { icon: "fa-eye", label: "Capacité d'observation" },
          { icon: "fa-diagram-project", label: "Organisation et rigueur" }
        ],
        filieresCount: "1",
        etabsCount: "1",
        filieresIntro: "Conception graphique, pré-presse, design numérique, motion design…",
        brochureUrl: "#"
      },

      "digital-intelligence-artificielle": {
        titre: "Digital et Intelligence Artificielle",
        slug: "digital-intelligence-artificielle",
        image: "https://blog.digitalcook.fr/wp-content/uploads/2024/06/programming-background-with-person-working-with-codes-computer-scaled.webp",
        resume: "Le secteur du digital au Maroc affiche une forte croissance, portée par la transformation numérique.",
        heroImage: "https://blog.digitalcook.fr/wp-content/uploads/2024/06/programming-background-with-person-working-with-codes-computer-scaled.webp",
        presentation: [
          "Le secteur du digital au Maroc affiche une croissance significative.",
          "Les entreprises du secteur sont engagées dans une démarche de transformation digitale exigeante."
        ],
        video: "images/formation/DEV&IA.mp4",
        stats: [
          { icon: "fa-briefcase", value: "+ 5000", label: "entreprises spécialisées" },
          { icon: "fa-users", value: "Environ 80 000", label: "salariés dans les départements TIC" }
        ],
        skills: [
          { icon: "fa-comments", label: "Bonne aptitude à la communication" },
          { icon: "fa-heart", label: "Empathie" },
          { icon: "fa-people-group", label: "Travail en équipe" }
        ],
        filieresCount: "8",
        etabsCount: "2",
        filieresIntro: "Développement web et mobile, systèmes & réseaux, data, IA…",
        brochureUrl: "#"
      },

      "genie-electrique": {
        titre: "Génie Electrique",
        slug: "genie-electrique",
        image: "https://f.hellowork.com/obs-static-images/seo/ObsJob/technicien-electricien.jpg",
        resume: "Secteur vital de l'économie nationale, l'industrie électrique au Maroc enregistre des progrès remarquables.",
        heroImage: "https://f.hellowork.com/obs-static-images/seo/ObsJob/technicien-electricien.jpg",
        presentation: [
          "Secteur vital de l'économie nationale, l'industrie électrique au Maroc enregistre des progrès remarquables.",
          "Grâce aux programmes de remise à niveau des installations et au dynamisme des entreprises."
        ],
        video: "images/formation/GE.mp4",
        stats: [
          { icon: "fa-briefcase", value: "+ 70 000", label: "emplois dans le secteur" },
          { icon: "fa-building", value: "Près de 600", label: "entreprises opérant dans le secteur" }
        ],
        skills: [
          { icon: "fa-list-check", label: "Sens de l'organisation" },
          { icon: "fa-people-group", label: "Esprit d'équipe" },
          { icon: "fa-hands", label: "Savoir-faire" }
        ],
        filieresCount: "6",
        etabsCount: "8",
        filieresIntro: "Installation électrique, maintenance industrielle, réseaux, électrotechnique…",
        brochureUrl: "#"
      },

      "genie-mecanique": {
        titre: "Génie Mécanique",
        slug: "genie-mecanique",
        image: "https://exploreengineering.ca/sites/default/files/NEM-web-quiz/NEM_mechanical.jpg",
        resume: "Le secteur des industries mécaniques occupe une place de choix dans l'industrie marocaine.",
        heroImage: "https://exploreengineering.ca/sites/default/files/NEM-web-quiz/NEM_mechanical.jpg",
        presentation: [
          "Le secteur des industries mécaniques occupe une place de choix dans l'industrie marocaine.",
          "L'industrie mécanique offre un large éventail de métiers allant de la conception à la fabrication."
        ],
        video: "images/formation/GM.mp4",
        stats: [
          { icon: "fa-briefcase", value: "+ 17 000", label: "emplois créés entre 2014 et 2018" },
          { icon: "fa-building", value: "+ 1100", label: "entreprises opérant dans le secteur" }
        ],
        skills: [
          { icon: "fa-arrow-trend-up", label: "Capacité à évoluer" },
          { icon: "fa-microchip", label: "Adaptation aux nouvelles technologies" },
          { icon: "fa-code", label: "Capacités d'analyse" }
        ],
        filieresCount: "6",
        etabsCount: "4",
        filieresIntro: "Conception mécanique, fabrication, maintenance industrielle…",
        brochureUrl: "#"
      },

      "gestion-commerce": {
        titre: "Gestion et Commerce",
        slug: "gestion-commerce",
        image: "https://www.descripciondepuestos.org/wp-content/uploads/2024/09/gtpm2Ti0l96ZIemyDPUvH.png.webp",
        resume: "Secteurs transversaux par excellence, le Commerce et la Gestion ouvrent aux futurs lauréats des voies prometteuses.",
        heroImage: "https://www.descripciondepuestos.org/wp-content/uploads/2024/09/gtpm2Ti0l96ZIemyDPUvH.png.webp",
        presentation: [
          "Secteurs transversaux par excellence, le Commerce et la Gestion ouvrent aux futurs lauréats des voies prometteuses.",
          "La diversité des métiers et des spécialisations permet d'exercer dans des domaines variés."
        ],
        video: "images/formation/GC.mp4",
        stats: [
          { icon: "fa-chart-pie", value: "57%", label: "de participation au PIB national" },
          { icon: "fa-chart-line", value: "3%", label: "taux de croissance du secteur des services" }
        ],
        skills: [
          { icon: "fa-bolt", label: "Initiative" },
          { icon: "fa-user", label: "Autonomie" },
          { icon: "fa-computer", label: "Maîtrise de l'outil informatique" }
        ],
        filieresCount: "7",
        etabsCount: "4",
        filieresIntro: "Comptabilité, gestion, commerce, marketing, vente…",
        brochureUrl: "#"
      },

      "metiers-automobile": {
        titre: "Métiers de l'Automobile",
        slug: "metiers-automobile",
        image: "https://www.educatel.fr/wp-content/uploads/2021/04/metier-devenir-mecanicien-auto-6.jpg",
        resume: "L'industrie automobile marocaine enregistre de belles réussites, avec une croissance annuelle à deux chiffres.",
        heroImage: "https://www.educatel.fr/wp-content/uploads/2021/04/metier-devenir-mecanicien-auto-6.jpg",
        presentation: [
          "L'industrie automobile marocaine enregistre de belles réussites.",
          "Prometteur et stratégique, le secteur séduit des groupes étrangers de renom."
        ],
        video: "images/formation/METIERS AUTOMOBILES.mp4",
        stats: [
          { icon: "fa-trophy", value: "1er", label: "secteur exportateur du pays" },
          { icon: "fa-coins", value: "+ 80 MD DHS", label: "de chiffre d'affaires à l'export" }
        ],
        skills: [
          { icon: "fa-xmarks-lines", label: "Résolution de problèmes" },
          { icon: "fa-comments-dollar", label: "Sens de la négociation" },
          { icon: "fa-bullseye", label: "Capacité à fixer des objectifs" }
        ],
        filieresCount: "9",
        etabsCount: "4",
        filieresIntro: "Maintenance automobile, carrosserie, production, qualité…",
        brochureUrl: "#"
      },

      "textile-habillement": {
        titre: "Textile Habillement",
        slug: "textile-habillement",
        image: "https://miamimarketingschool.com/wp-content/uploads/2021/08/Estrategias-de-marketing-digital-para-sastres.jpg",
        resume: "L'industrie du Textile et Habillement est en croissance permanente et représente un secteur phare.",
        heroImage: "https://miamimarketingschool.com/wp-content/uploads/2021/08/Estrategias-de-marketing-digital-para-sastres.jpg",
        presentation: [
          "L'industrie du Textile et Habillement est en croissance permanente.",
          "Aujourd'hui, le Royaume est un partenaire de choix de l'Union Européenne."
        ],
        video: "images/formation/TEXTILS.mp4",
        stats: [
          { icon: "fa-briefcase", value: "56 000", label: "emplois dans le secteur" },
          { icon: "fa-industry", value: "1015", label: "unités industrielles" }
        ],
        skills: [
          { icon: "fa-lightbulb", label: "Créativité" },
          { icon: "fa-user", label: "Autonomie" },
          { icon: "fa-face-smile", label: "Gestion du stress" }
        ],
        filieresCount: "1",
        etabsCount: "1",
        filieresIntro: "Modélisme, confection, contrôle qualité, logistique textile…",
        brochureUrl: "#"
      },

      "tourisme-hotellerie-restauration": {
        titre: "Tourisme Hôtellerie Restauration",
        slug: "tourisme-hotellerie-restauration",
        image: "https://www.78grad.de/wp-content/uploads/78grad-Catering-Event-Location-Unternehmen-004.jpeg",
        resume: "Destination incontournable, le Maroc recèle de nombreux atouts sur le plan touristique.",
        heroImage: "https://www.78grad.de/wp-content/uploads/2024/04/78grad-Catering-Event-Location-Unternehmen-004.jpeg",
        presentation: [
          "Destination incontournable, le Maroc recèle de nombreux atouts sur le plan touristique.",
          "Accompagner le développement du secteur nécessite des ressources humaines qualifiées."
        ],
        video: "images/formation/TOURISME.mp4",
        stats: [
          { icon: "fa-earth-africa", value: "1ère", label: "destination touristique du continent africain" },
          { icon: "fa-briefcase", value: "+ 600 000", label: "emplois directs créés" }
        ],
        skills: [
          { icon: "fa-scale-balanced", label: "Rigueur et organisation" },
          { icon: "fa-screwdriver-wrench", label: "Technicité et savoir-faire" },
          { icon: "fa-language", label: "Maîtrise des langues étrangères" }
        ],
        filieresCount: "8",
        etabsCount: "1",
        filieresIntro: "Réception, service, cuisine, gestion hôtelière, animation…",
        brochureUrl: "#"
      },

      "batiment-travaux-publics": {
        titre: "Bâtiment et Travaux Publics",
        slug: "batiment-travaux-publics",
        image: "https://www.viametiers.fr/wp-content/uploads/2023/10/metier-Ingenieur-du-BTP.jpg",
        resume: "Véritable levier de croissance, le secteur du BTP offre des perspectives de développement importantes.",
        heroImage: "https://www.viametiers.fr/wp-content/uploads/2023/10/metier-Ingenieur-du-BTP.jpg",
        presentation: [
          "Véritable levier de croissance, le secteur du BTP offre des perspectives de développement importantes.",
          "Former des ressources qualifiées dans ce secteur est essentiel."
        ],
        video: "images/formation/BTP.mp4",
        stats: [
          { icon: "fa-users", value: "Plus de 10%", label: "de la population active employée dans le BTP" },
          { icon: "fa-building", value: "Environ 5 000", label: "entreprises du secteur" }
        ],
        skills: [
          { icon: "fa-gears", label: "Savoir-faire technique" },
          { icon: "fa-chart-line", label: "Esprit d'analyse" },
          { icon: "fa-scale-balanced", label: "Rigueur et méthode" }
        ],
        filieresCount: "17",
        etabsCount: "3",
        filieresIntro: "Conduite de chantier, topographie, études techniques, gros œuvre, second œuvre…",
        brochureUrl: "#"
      },

      "services-a-la-personne": {
        titre: "Services à la Personne",
        slug: "services-a-la-personne",
        image: "https://www.centre-pedagogique-sherwood.com/wp-content/uploads/2023/11/iStock-1170395430-min.webp",
        resume: "Les services à la personne se développent pour répondre aux besoins d'accompagnement des enfants, personnes âgées, etc.",
        heroImage: "https://www.centre-pedagogique-sherwood.com/wp-content/uploads/2023/11/iStock-1170395430-min.webp",
        presentation: [
          "Les services à la personne se développent pour répondre aux besoins d'accompagnement.",
          "Ce secteur met l'humain au cœur des priorités."
        ],
        video: "images/formation/SERVICES.mp4",
        stats: [
          { icon: "fa-person-cane", value: "23%", label: "des emplois dans les centres de personnes en situation d'handicap" },
          { icon: "fa-briefcase-medical", value: "Forte demande", label: "en profils qualifiés" }
        ],
        skills: [
          { icon: "fa-people-roof", label: "Sens de la responsabilité" },
          { icon: "fa-diagram-project", label: "Organisation et gestion du temps" },
          { icon: "fa-heart", label: "Empathie et bienveillance" }
        ],
        filieresCount: "3",
        etabsCount: "1",
        filieresIntro: "Accompagnement éducatif, aide à domicile, assistance aux personnes âgées…",
        brochureUrl: "#"
      },

      "froid-genie-thermique": {
        titre: "Froid et Génie Thermique",
        slug: "froid-genie-thermique",
        image: "https://www.francetravail.fr/files/live/sites/PE/files/secteurs-metiers/Industrie/Frigoriste-850x523.png",
        resume: "L'industrie du Froid Génie Thermique au Maroc est un secteur en pleine expansion.",
        heroImage: "https://www.francetravail.fr/files/live/sites/PE/files/secteurs-metiers/Industrie/Frigoriste-850x523.png",
        presentation: [
          "L'industrie du Froid Génie Thermique au Maroc est un secteur en pleine expansion.",
          "Pour accompagner les besoins des professionnels et acquérir les compétences requises."
        ],
        video: "images/formation/FROID.mp4",
        stats: [
          { icon: "fa-boxes-stacked", value: "9,4", label: "millions de tonnes de la production nationale" },
          { icon: "fa-snowflake", value: "370 000 tonnes", label: "de capacité d'entreposage frigorifique" }
        ],
        skills: [
          { icon: "fa-lightbulb", label: "Capacité d'autonomie" },
          { icon: "fa-shield-halved", label: "Sens de responsabilité" },
          { icon: "fa-diagram-project", label: "Sens de l'organisation" }
        ],
        filieresCount: "1",
        etabsCount: "1",
        filieresIntro: "Installation, maintenance et exploitation des équipements frigorifiques et de climatisation.",
        brochureUrl: "#"
      }
    };
  },

  // ============ INITIALISATION ============
  initialiser: function() {
    // Vérifier si des données existent déjà dans localStorage
    let secteurs = localStorage.getItem("ofppt_secteurs");
    
    if (!secteurs) {
      // Charger les données par défaut
      const donneesParDefaut = this.getDonneesParDefaut();
      localStorage.setItem("ofppt_secteurs", JSON.stringify(donneesParDefaut));
      console.log("✅ Données par défaut chargées dans localStorage");
    } else {
      console.log("✅ Données existantes dans localStorage");
    }
    
    return this.getAllSecteurs();
  },

  // ============ CRUD OPERATIONS ============
  
  // Récupérer tous les secteurs
  getAllSecteurs: function() {
    const data = localStorage.getItem("ofppt_secteurs");
    return data ? JSON.parse(data) : {};
  },

  // Récupérer un secteur par slug
  getSecteurBySlug: function(slug) {
    const secteurs = this.getAllSecteurs();
    return secteurs[slug] || null;
  },

  // Sauvegarder un secteur
  saveSecteur: function(secteur) {
    const secteurs = this.getAllSecteurs();
    secteurs[secteur.slug] = secteur;
    localStorage.setItem("ofppt_secteurs", JSON.stringify(secteurs));
    console.log("✅ Secteur sauvegardé:", secteur.slug);
    return true;
  },

  // Supprimer un secteur
  deleteSecteur: function(slug) {
    const secteurs = this.getAllSecteurs();
    if (secteurs[slug]) {
      delete secteurs[slug];
      localStorage.setItem("ofppt_secteurs", JSON.stringify(secteurs));
      return true;
    }
    return false;
  },

  // ============ RENDERING ============
  
  // Afficher les secteurs dans une grille HTML (version VISUELLE)
  renderSecteursGrid: function(containerId) {
    const secteurs = this.getAllSecteurs();
    const container = document.getElementById(containerId);

    if (!container) {
      console.error("Conteneur non trouvé:", containerId);
      return;
    }

    if (Object.keys(secteurs).length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem; background: #f8fafc; border-radius: 12px; margin: 2rem 0;">
          <i class="fas fa-inbox" style="font-size: 3rem; color: #94a3b8; margin-bottom: 1rem;"></i>
          <h3 style="color: #475569; margin-bottom: 0.5rem;">Aucun secteur disponible</h3>
          <p style="color: #64748b;">Utilisez l'interface d'administration pour ajouter des secteurs.</p>
        </div>
      `;
      return;
    }

    // Créer le HTML pour chaque secteur comme une carte visuelle
    container.innerHTML = Object.values(secteurs)
      .map((secteur) => `
        <article class="sector-tile">
          <a href="secteur.html?slug=${secteur.slug}" class="sector-tile__link">
            <div class="sector-tile__image-wrapper">
              <img
                src="${secteur.image}"
                alt="${secteur.titre}"
                class="sector-tile__image"
                loading="lazy"
                onerror="this.src='https://via.placeholder.com/400x300/0b4da2/ffffff?text=OFPPT'"
              />
            </div>
            <div class="sector-tile__body">
              <h3 class="sector-tile__title">${secteur.titre}</h3>
              <p class="sector-tile__excerpt">${secteur.resume}</p>
              
            </div>
          </a>
        </article>
      `)
      .join("");

    console.log(`✅ ${Object.keys(secteurs).length} secteurs affichés dans la grille`);
  },

  // Rendre la page détail d'un secteur
  renderSecteurDetail: function(slug) {
    const secteur = this.getSecteurBySlug(slug);
    
    if (!secteur) {
      return null;
    }
    
    return secteur;
  },

  // ============ UTILITAIRES ============
  
  // Générer un slug cohérent
  generateSlug: function(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },

  // Compter le nombre de secteurs
  countSecteurs: function() {
    return Object.keys(this.getAllSecteurs()).length;
  },

  // Réinitialiser aux données par défaut
  resetToDefault: function() {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser tous les secteurs ? Cette action est irréversible.")) {
      const donneesParDefaut = this.getDonneesParDefaut();
      localStorage.setItem("ofppt_secteurs", JSON.stringify(donneesParDefaut));
      return true;
    }
    return false;
  }
};

// Initialiser automatiquement
document.addEventListener('DOMContentLoaded', function() {
  console.log("📦 Initialisation de l'API des secteurs...");
  window.SecteursAPI.initialiser();
});