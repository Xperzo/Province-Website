(function () {
  // =========================
  // 1) Données Adultes / Entreprises
  // =========================
  const ADULT_FILIERES = [
    // SETTAT — Formation Continue : Bureautique
    {
      slug: "fc-bureautique-avancee-entreprises",
      titre: "Bureautique avancée & outils collaboratifs",
      extrait: "Word, Excel, PowerPoint, Outlook et outils collaboratifs pour le travail de bureau.",
      niveau: "Formation Continue",
      mode: "Cours du soir",
      diplome: "Formation Continue",
      type_adulte: "Formation Continue",
      secteur: "Digital & IA",
      ville: "Settat",
      etabs: ["settat_main"],
      tabs: {
        presentation:
          "Formation courte pour salariés et adultes qui souhaitent maîtriser la bureautique professionnelle (Word, Excel, PowerPoint, Outlook) et les outils collaboratifs au sein de l’entreprise.",
        admission:
          "Salariés d’entreprise, demandeurs d’emploi ou adultes en reconversion ayant au minimum un niveau 3e année collège.",
        debouches:
          "Utilisation autonome de la bureautique au sein d’un service administratif, assistanat, secrétariat ou services de gestion."
      }
    },

    // SETTAT — Qualifiante : Techniques de vente
    {
      slug: "ql-techniques-vente-relation-client-settat",
      titre: "Techniques de vente & relation client",
      extrait: "Préparation de l’entretien de vente, argumentaire, traitement des objections et fidélisation.",
      niveau: "Qualification",
      mode: "Cours du soir",
      diplome: "Formation Continue",
      type_adulte: "Formation Continue",
      secteur: "Gestion et Commerce",
      ville: "Settat",
      etabs: ["settat_main"],
      tabs: {
        presentation:
          "Formation destinée aux commerciaux, vendeurs et agents de front-office souhaitant renforcer leurs techniques de vente et la qualité de la relation client.",
        admission:
          "Salariés d’entreprises commerciales ou de services, ou adultes souhaitant travailler dans la vente.",
        debouches:
          "Vendeur, conseiller commercial, employé de comptoir, agent d’accueil ou de front-office."
      }
    },

    // SETTAT — FC : Comptabilité & gestion PME
    {
      slug: "fc-comptabilite-gestion-pme-settat",
      titre: "Comptabilité & gestion pratique pour PME",
      extrait: "Bases de la comptabilité, suivi de trésorerie, facturation et tableaux de bord simples.",
      niveau: "Formation Continue",
      mode: "Cours du soir",
      diplome: "Formation Continue",
      type_adulte: "Formation Continue",
      secteur: "Gestion et Commerce",
      ville: "Settat",
      etabs: ["settat_main"],
      tabs: {
        presentation:
          "Cette formation aide les responsables et assistants de petites entreprises à comprendre les documents comptables, la facturation et le suivi de la trésorerie.",
        admission:
          "Gérants, assistants administratifs, responsables de caisse ou adultes souhaitant gérer une petite activité.",
        debouches:
          "Assistant de gestion, aide-comptable, gestion pratique d’une petite structure ou activité indépendante."
      }
    },

    // SETTAT — Cours du soir : Développement digital
    {
      slug: "cs-developpement-digital-cours-soir-settat",
      titre: "Développement Digital – cours du soir",
      extrait: "Initiation au développement web (HTML/CSS) et aux outils digitaux pour les entreprises.",
      niveau: "Technicien",
      mode: "Cours du soir",
      diplome: "Formation Continue",
      type_adulte: "Formation Continue",
      secteur: "Digital & IA",
      ville: "Settat",
      etabs: ["settat_main"],
      tabs: {
        presentation:
          "Module d’initiation pour adultes et salariés souhaitant comprendre les bases du développement web et la présence digitale d’une entreprise.",
        admission:
          "Salariés, auto-entrepreneurs, porteurs de projet ou adultes intéressés par le digital, avec aisance en bureautique.",
        debouches:
          "Contribution à la mise à jour d’un site vitrine, meilleure collaboration avec les prestataires web, sensibilisation aux outils digitaux."
      }
    },

    // BEN AHMED — Qualifiante : Bureautique & Internet
    {
      slug: "ql-bureautique-base-internet-benahmed",
      titre: "Bureautique de base & Internet sécurisé",
      extrait: "Découverte de l’ordinateur, de la bureautique et des usages sécurisés d’Internet.",
      niveau: "Qualification",
      mode: "Cours du soir",
      diplome: "Formatin Continue",
      type_adulte: "Formation Continue",
      secteur: "Digital & IA",
      ville: "Ben Ahmed",
      etabs: ["benahmed_main"],
      tabs: {
        presentation:
          "Formation d’initiation destinée aux adultes n’ayant jamais ou très peu utilisé l’ordinateur et Internet.",
        admission:
          "Adultes, salariés, chercheurs d’emploi ou porteurs de projet local souhaitant acquérir les bases numériques.",
        debouches:
          "Autonomie sur ordinateur pour la recherche d’emploi, la communication et les démarches administratives en ligne."
      }
    },

    // BEN AHMED — FC : Gestion des stocks
    {
      slug: "fc-gestion-stocks-magasins-benahmed",
      titre: "Gestion des stocks & magasinage",
      extrait: "Organisation du magasin, mouvements de stock, inventaire et suivi des entrées/sorties.",
      niveau: "Formation Continue",
      mode: "Cours du jour",
      diplome: "Formation Continue",
      type_adulte: "Formation Continue",
      secteur: "Gestion et Commerce",
      ville: "Ben Ahmed",
      etabs: ["benahmed_main"],
      tabs: {
        presentation:
          "Formation pratique pour magasiniers et responsables logistique des PME locales, afin d’optimiser la gestion des stocks.",
        admission:
          "Salariés en magasin, logistique ou approvisionnement, ainsi que adultes souhaitant intégrer ces métiers.",
        debouches:
          "Magasinier, assistant logistique, gestionnaire de stock dans des entreprises industrielles ou commerciales."
      }
    },

    // BEN AHMED — Qualifiante : Maintenance électrique
    {
      slug: "ql-maintenance-electrique-base-benahmed",
      titre: "Maintenance électrique de base",
      extrait: "Sécurité électrique, dépannage simple et entretien courant d’installations basse tension.",
      niveau: "Qualification",
      mode: "Cours du jour",
      diplome: "Formation Continue",
      type_adulte: "Formation Continue",
      secteur: "Génie Electrique",
      ville: "Ben Ahmed",
      etabs: ["benahmed_main"],
      tabs: {
        presentation:
          "Formation destinée aux agents de maintenance et aux adultes qui interviennent sur des installations électriques simples.",
        admission:
          "Salariés de maintenance, artisans, ouvriers polyvalents ayant des notions de base en électricité ou souhaitant se perfectionner.",
        debouches:
          "Agent de maintenance de premier niveau dans les entreprises industrielles, commerciales ou bâtiments publics."
      }
    },

    // EMVFBTP — FC : HSE Chantier
    {
      slug: "fc-hse-chantier-btp-elbrouj",
      titre: "Hygiène & sécurité sur les chantiers BTP",
      extrait: "Sensibilisation HSE, gestes de prévention et organisation sécurisée d’un chantier.",
      niveau: "Formation Continue",
      mode: "Cours du jour",
      diplome: "Formation Continue",
      type_adulte: "Formation Continue",
      secteur: "Bâtiment & TP",
      ville: "Settat / El Brouj",
      etabs: ["elbrouj_main"],
      tabs: {
        presentation:
          "Formation pratique pour chefs d’équipe, ouvriers qualifiés et responsables HSE des chantiers afin de réduire les risques d’accidents.",
        admission:
          "Ouvriers, chefs d’équipe et techniciens des entreprises de BTP opérant dans la région de Settat et Ben Ahmed.",
        debouches:
          "Référent HSE de proximité, chef d’équipe sensibilisé à la sécurité, amélioration des pratiques sur chantier."
      }
    },

    // EMVFBTP — Qualifiante : Lecture de plans & métrés
    {
      slug: "ql-lecture-plans-metres-btp-elbrouj",
      titre: "Lecture de plans & métrés de base",
      extrait: "Lecture des plans de bâtiment et réalisation de métrés simples pour le suivi des travaux.",
      niveau: "Qualification",
      mode: "Cours du jour",
      diplome: "Formation Continue",
      type_adulte: "Formation Continue",
      secteur: "Bâtiment & TP",
      ville: "Settat / El Brouj",
      etabs: ["elbrouj_main"],
      tabs: {
        presentation:
          "Formation courte pour techniciens, chefs d’équipe et métreurs débutants souhaitant mieux exploiter les plans de chantier.",
        admission:
          "Salariés ou adultes ayant une expérience de chantier et une connaissance minimale des unités de mesure.",
        debouches:
          "Participation à la préparation et au suivi des quantités dans les entreprises de BTP et de construction."
      }
    },

    // SETTAT — Cours du soir : Gestion des Entreprises
    {
      slug: "cs-gestion-entreprises-cours-soir-settat",
      titre: "Gestion des Entreprises – cours du soir",
      extrait: "Parcours de gestion comptable, commerciale et administrative adapté aux adultes et salariés de la province de Settat.",
      niveau: "Technicien Spécialisé",
      mode: "Cours du soir",
      diplome: "Formation Continue",
      type_adulte: "Formation Continue",
      secteur: "Gestion et Commerce",
      ville: "Settat",
      etabs: ["settat_main"],
      tabs: {
        presentation:
          "Parcours en cours du soir inspiré de la filière « Gestion des Entreprises » de l’OFPPT. Il est destiné aux salariés, demandeurs d’emploi et porteurs de projets de la province de Settat. La formation couvre la comptabilité de base, la gestion commerciale, l’administration d’entreprise et l’utilisation d’outils numériques de gestion.",
        admission:
          "Adultes et salariés ayant au minimum un niveau baccalauréat ou une expérience significative en gestion, et motivés pour suivre des cours du soir sur 2 ans (rythme adapté aux contraintes professionnelles).",
        debouches:
          "Assistant de gestion, aide-comptable, gestionnaire administratif dans les PME/TPME, ou gestion de son propre projet entrepreneurial."
      }
    }
  ];

  // =========================
  // 2) On pousse ces filières dans FILIERES pour que les slugs marchent
  // =========================
  try {
  if (typeof FILIERES !== "undefined" && Array.isArray(FILIERES)) {
    ADULT_FILIERES.forEach(f => FILIERES.push(f));
  }
} catch(e) {}


  // =========================
  // 3) Icônes secteurs (même style que list.js)
  // =========================
  const BLUE = '#1976d2', GREEN = '#2d9f4e';
  const __svg = (path) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
         viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

  const __ICONS = {
    'Arts et Industries Graphiques': __svg(`
      <path d="M12 2l4 10-4 10-4-10 4-10z"/>
      <path d="M8 12h8"/>
      <circle cx="12" cy="7" r="1.2"/>
    `),
    'Digital & IA': __svg(`
      <rect x="3" y="4" width="18" height="12" rx="2"/>
      <path d="M8 20h8"/>
      <path d="M9.5 9.5l-2 2 2 2"/>
      <path d="M14.5 13.5l2-2-2-2"/>
      <path d="M12.5 10.5l3.5 5"/>
    `),
    'Génie Electrique': __svg(`
      <path d="M13 2L6 14h5l-1 8 7-12h-5l1-8z"/>
      <path d="M4 20h5"/>
      <path d="M15 20h5"/>
    `),
    'Génie Mécanique': __svg(`
      <circle cx="12" cy="12" r="3.25"/>
      <path d="M19 12a7 7 0 0 0-.15-1.5l2.18-1.26-1.5-2.6-2.2 1.27A7 7 0 0 0 15.5 6l-.3-2.5h-3.4L11.5 6
               A7 7 0 0 0 9 7.9L6.8 6.63l-1.5 2.6L7.5 10.5A7 7 0 0 0 7.35 12c0 .5.05 1 .15 1.5L5.3 15.26l1.5 2.6L9 16.6
               A7 7 0 0 0 11.5 18l.3 2.5h3.4l.3-2.5a7 7 0 0 0 2.33-1.9l2.2 1.27 1.5-2.6-2.18-1.26c.1-.5.15-1 .15-1.5z"/>
    `),
    'Gestion et Commerce': __svg(`
      <path d="M4 20h16"/>
      <rect x="4" y="4" width="16" height="12" rx="2"/>
      <path d="M8 14V10"/>
      <path d="M12 14V8"/>
      <path d="M16 14v-3"/>
      <path d="M10 6h6"/>
    `),
    'Métiers de l’Automobile': __svg(`
      <path d="M3 16l1.5-5a2 2 0 0 1 1.9-1.4h11.2a2 2 0 0 1 1.9 1.4L21 16"/>
      <path d="M6.5 16a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
      <path d="M17.5 16a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
      <path d="M5 11h14"/>
      <path d="M8 6h3l2 2h3"/>
    `),
    'Hôtellerie, Tourisme & Restauration': __svg(`
      <path d="M4 3h4v9a2 2 0 0 1-4 0z"/>
      <path d="M14 3h1a4 4 0 0 1 4 4v5"/>
      <path d="M10 3h4v8a2 2 0 0 1-4 0z"/>
      <path d="M5 21h14"/>
    `),
    'Agriculture & Agro-industries': __svg(`
      <path d="M3 20s1-4 4-4 5 4 5 4"/>
      <path d="M5 16V4"/>
      <path d="M7 8 5 4 3 8"/>
      <path d="M12 20s1-4 4-4 5 4 5 4"/>
      <path d="M14 16V4"/>
      <path d="M16 8 14 4l-2 4"/>
    `),
    'Offshoring & Gestion de la relation client': __svg(`
      <path d="M12 22c4.97 0 9-3.582 9-8s-4.03-8-9-8-9 3.582-9 8c0 2.385 1.043 4.532 2.75 6.066L5 22l3.25-1.5"/>
      <path d="M8 12h8"/>
      <path d="M9 9h6"/>
      <path d="M9 15h4"/>
    `),
    'Textiles & Cuir': __svg(`
      <path d="M4 7l8-4 8 4-8 4-8-4z"/>
      <path d="M4 17l8 4 8-4"/>
      <path d="M4 12l8 4 8-4"/>
    `),
    'Audiovisuel & Multimédia': __svg(`
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <path d="M10 9l5 3-5 3z"/>
    `),
    'Autres': __svg(`
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 8h.01"/>
      <path d="M11 12h2v5h-2z"/>
    `)
  };

  function renderSectorChip(label){
    const ico = __ICONS[label] || __ICONS['Autres'];
    const ds = String(label || '').trim();
    return `<span class="sector-chip" data-sector="${ds}">${ico}<span class="sector-chip__text">${label || ''}</span></span>`;
  }

  // =========================
  // 4) Cartes + filtres pour la section Adultes
  // =========================
  function ready(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function initAdultSection(){
    const grid    = document.getElementById('adult-cards');
    const counter = document.getElementById('adult-counter');
    const selCx   = document.getElementById('adult-complexe');
    const selType = document.getElementById('adult-type');

    if (!grid || !counter || !selCx || !selType) return; // on n'est pas sur Formations.html

    const ALL = ADULT_FILIERES.slice();

    function matchComplexe(f, cx){
      const et = Array.isArray(f.etabs) ? f.etabs : [];
      if (cx === 'settat')   return et.includes('settat_main');
      if (cx === 'benahmed') return et.includes('benahmed_main');
      if (cx === 'btp')      return et.includes('elbrouj_main');
      return true;
    }

    function matchType(f, type){
      if (!type || type === 'all') return true;
      const t = f.type_adulte || f.diplome || '';
      return String(t) === String(type);
    }

 function createCard(f) {
  // ✅ fonction d'échappement corrigée (plus d'erreur de syntaxe)
  const esc = (s) =>
    String(s || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[c]);

  const el = document.createElement("article");
  el.className = "card card--formation fx-card card--adult";

  // ✅ on essaie d'utiliser la même fonction d’icône que list.js
  const iconFn =
    window.__renderSectorChip ||
    window.renderSectorChip ||
    function (label) {
      return '<span class="sector-chip__text">' + esc(label || "") + "</span>";
    };

  const iconHTML = iconFn(f.secteur || "Autres");

  el.innerHTML = [
    '<div class="card__body">',
    '<h3 class="card__title">',
    iconHTML,
    '<span class="card__title-text">',
    esc(f.titre || "Formation"),
    "</span>",
    "</h3>",
    '<p class="card__excerpt">',
    esc(f.extrait || ""),
    "</p>",
    '<div class="card__badges">',
    f.niveau ? '<span class="badge">' + esc(f.niveau) + "</span>" : "",
    f.diplome ? '<span class="badge">' + esc(f.diplome) + "</span>" : "",
    "</div>",
    "</div>",
    '<div class="card__footer">',
    '<button type="button" class="btn btn--primary js-open-filiere" data-slug="',
    encodeURIComponent(f.slug || ""),
    '">Détails</button>',
    "</div>",
  ].join("");

  const btn = el.querySelector(".js-open-filiere");
  if (btn) {
    btn.addEventListener("click", function () {
      const slug = f.slug || "";
      if (window.openFiliereModal && typeof window.openFiliereModal === "function") {
        window.openFiliereModal(slug, f);
      } else {
        window.location.href = "filiere.html?slug=" + encodeURIComponent(slug);
      }
    });
  }

  return el;
}


    function render(){
      const cx   = selCx.value || 'all';
      const type = selType.value || 'all';

      const subset = ALL.filter(f => matchComplexe(f, cx)).filter(f => matchType(f, type));
      grid.innerHTML = '';

      if (!subset.length){
        counter.textContent = "Aucune formation adulte pour ces filtres";
        return;
      }
      counter.textContent = subset.length + " formation" + (subset.length > 1 ? "s" : "") + " pour adultes & entreprises";

      const frag = document.createDocumentFragment();
      subset.forEach(f => frag.appendChild(createCard(f)));
      grid.appendChild(frag);
    }

    selCx.addEventListener('change', render);
    selType.addEventListener('change', render);

    render();
  });
})();