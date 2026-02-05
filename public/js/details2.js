(function () {
  if (typeof FILIERES === "undefined") return;

  
  const PRESENTATIONS_BY_SLUG = {
    "electricit-d-installation": "Cette filière en Electricité d’Installation forme des techniciens capables de réaliser l’installation, le câblage et la mise en service d’équipements électriques dans les bâtiments résidentiels, tertiaires ou petits locaux industriels. Le programme couvre la lecture de plans et de schémas, la sélection du matériel, les normes de sécurité et la qualité d’exécution. Des ateliers pratiques permettent de développer des gestes professionnels (pose d’appareillage, cheminements, diagnostics de base) et d’appliquer les règles de prévention des risques électriques dans des situations réelles.",
    "fabrication-m-canique": "La filière Fabrication Mécanique développe des compétences solides en usinage, ajustage et montage de composants. Les apprenants apprennent à lire et interpréter des plans, à préparer un poste d’usinage, à régler et utiliser des machines-outils conventionnelles et, si possible, à s’initier au numérique (CN). Une attention particulière est portée à la métrologie, au contrôle dimensionnel et à la qualité des pièces réalisées. La formation met l’accent sur la rigueur, la sécurité, la précision des gestes et la compréhension des processus de production en atelier.",
    "m-thodes-en-fabrication-m-canique": "Cette formation en Méthodes de Fabrication Mécanique prépare à l’industrialisation : construction de gammes, choix des procédés, équilibrage des postes, calculs de temps, dossiers techniques et amélioration continue. L’objectif est d’optimiser les flux de production, de fiabiliser la qualité et de réduire les non‑conformités. Les apprenants mobilisent des outils d’analyse (5M, Pareto, AMDEC d’introduction), utilisent des logiciels bureautiques/techniques et collaborent avec l’atelier pour assurer la mise au point et la montée en cadence.",
    "froid-commercial-et-climatisation": "La filière Froid Commercial et Climatisation forme des techniciens capables de mettre en œuvre, mettre en service et maintenir des installations frigorifiques et des systèmes de climatisation. Le cursus aborde les circuits frigorifiques, la thermodynamique appliquée, le choix des composants, le brasage, l’étanchéité, la récupération des fluides et le diagnostic. Des travaux pratiques encadrés permettent d’acquérir les bons réflexes en sécurité, d’optimiser le fonctionnement énergétique et de préparer les interventions en milieu professionnel.",
    "assistant-administratif-option-commerce": "Cette filière prépare à assurer des fonctions administratives et commerciales : accueil et relation client, gestion de dossiers, traitement de commandes, suivi des livraisons et de la facturation. Elle consolide la maîtrise des outils bureautiques, initie aux techniques de vente/communication écrite et orale et sensibilise aux indicateurs simples de pilotage. Les stagiaires développent leur organisation, leur sens du service et leur autonomie dans un contexte d’équipe.",
    "assistant-administratif-option-comptabilit": "La filière Assistant Administratif Option Comptabilité renforce les bases en gestion : pièces comptables, enregistrements courants, rapprochements, suivi de trésorerie et préparation d’états simples. Elle valorise l’usage de la bureautique et d’un logiciel comptable, la rigueur documentaire et le respect des procédures internes. La formation vise une insertion rapide sur des postes d’appui administratif et comptable, avec sens des priorités et discrétion professionnelle.",
    "gestion-des-entreprises": "La filière Gestion des Entreprises couvre les fondamentaux comptables, fiscaux et administratifs ainsi que les outils de pilotage (tableaux de bord, indicateurs, reporting simple). Elle entraîne au traitement des opérations courantes, au respect des échéances, à l’organisation des dossiers et à l’utilisation efficace des outils bureautiques. Des études de cas et un stage encadré permettent de lier théorie et pratique, d’améliorer la communication professionnelle et de renforcer l’autonomie.",
    "gestion-des-entreprises-option-comptabilit-et-finance": "Cette option Comptabilité & Finance met l’accent sur la comptabilité générale/analytique, la fiscalité d’entreprise, la trésorerie et le contrôle de base. Elle cherche à développer la précision des enregistrements, la maîtrise des documents supports et la lecture d’indicateurs. Les apprenants utilisent des tableurs et des logiciels dédiés pour fiabiliser le suivi, produire des états et faciliter la prise de décision à partir de données chiffrées.",
    "gestion-des-entreprises-option-commerce-et-marketing": "La filière Commerce & Marketing sensibilise aux études de marché, au merchandising et aux actions de promotion/vente. Les stagiaires travaillent la relation client, l’argumentation, l’organisation d’opérations commerciales et le suivi d’indicateurs simples (trafic, conversion, panier). Des mises en situation permettent d’exercer l’aisance à l’oral, la gestion des objections et le travail en équipe, tout en respectant les procédures internes.",
    "gestion-des-entreprises-option-ressources-humaines": "L’option Ressources Humaines aborde l’administration du personnel (dossiers, paie de base, absences), le recrutement, la formation et la communication sociale. Elle insiste sur la confidentialité, la conformité documentaire et l’éthique. Les apprenants utilisent des outils bureautiques/SIRH d’initiation, apprennent à préparer un reporting simple et à contribuer à la qualité de service auprès des collaborateurs et des managers.",
    "electricit-de-maintenance-industrielle": "La filière Electricité de Maintenance Industrielle forme des professionnels chargés d’assurer la maintenance préventive et corrective d’équipements électriques/électromécaniques. Le programme traite du diagnostic, de la remise en service, de la consignation/sécurité et de la documentation d’intervention. Il valorise la réactivité, la méthode et le respect des règles HSE. Une immersion atelier prépare à intervenir de manière autonome dans des environnements de production."
  };

  
  function buildGenericPresentation(f) {
    const titre = (f?.titre || "Cette filière").replace(/\s+/g, " ").trim();
    const secteur = (f?.secteur || "").trim();
    const niveau = (f?.niveau || "").trim();
    const mode   = (f?.mode || "").trim();
    const plus  = (secteur ? ` Elle s’inscrit dans le secteur « ${secteur} »` : ``) +
                  (niveau ? ` et se prépare au niveau ${niveau}` : ``) +
                  (mode   ? `, en ${mode.toLowerCase()}` : ``) + `.`;
    return (base + plus).replace(/\s+/g, " ").trim();
  }

  
  FILIERES.forEach(f => {
    if (!f || !f.slug) return;
    const preset = PRESENTATIONS_BY_SLUG[f.slug];
    const current = (f?.tabs?.presentation || "").trim();
    const next = preset || buildGenericPresentation(f);
    if (!f.tabs) f.tabs = {};
    if (!current) f.tabs.presentation = next;
    
    try {
      const ex = (f?.extrait || "").trim();
      if (!ex || ex.length < 80) {
        f.extrait = next.length > 280 ? next.slice(0, 276) + "…" : next;
      }
    } catch(e){}
  });
})();