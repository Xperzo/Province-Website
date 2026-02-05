
// list.js — Forcer l'affichage par complexe selon les listes officielles fournies
(function () {// --- Icônes secteurs inline (SVG modernes) ---
const BLUE = '#1976d2', GREEN = '#2d9f4e';
const __svg = (path) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

// Icônes pro (stroke = currentColor) — on ne change ni classes ni styles CSS
const __ICONS = {
  // 1. Arts et Industries Graphiques (plume / création)
  'Arts et Industries Graphiques': __svg(`
    <path d="M12 2l4 10-4 10-4-10 4-10z"/>
    <path d="M8 12h8"/>
    <circle cx="12" cy="7" r="1.2"/>
  `),

  // 2. Digital & IA (écran + chevrons)
  'Digital & IA': __svg(`
    <rect x="3" y="4" width="18" height="12" rx="2"/>
    <path d="M8 20h8"/>
    <path d="M9.5 9.5l-2 2 2 2"/>
    <path d="M14.5 13.5l2-2-2-2"/>
    <path d="M12.5 10.5l3.5 5"/>
  `),

  // 3. Génie Electrique (éclair + circuit)
  'Génie Electrique': __svg(`
    <path d="M13 2L6 14h5l-1 8 7-12h-5l1-8z"/>
    <path d="M4 20h5"/>
    <path d="M15 20h5"/>
  `),

  // 4. Génie Mécanique (engrenage)
  'Génie Mécanique': __svg(`
    <circle cx="12" cy="12" r="3.25"/>
    <path d="M19 12a7 7 0 0 0-.15-1.5l2.18-1.26-1.5-2.6-2.2 1.27A7 7 0 0 0 15.5 6l-.3-2.5h-3.4L11.5 6
             A7 7 0 0 0 9 7.9L6.8 6.63l-1.5 2.6L7.5 10.5A7 7 0 0 0 7.35 12c0 .5.05 1 .15 1.5L5.3 15.26l1.5 2.6L9 16.6
             A7 7 0 0 0 11.5 18l.3 2.5h3.4l.3-2.5a7 7 0 0 0 2.33-1.9l2.2 1.27 1.5-2.6-2.18-1.26c.1-.5.15-1 .15-1.5z"/>
  `),

  // 5. Gestion et Commerce (graphique + document)
  'Gestion et Commerce': __svg(`
    <path d="M4 20h16"/>
    <rect x="4" y="4" width="16" height="12" rx="2"/>
    <path d="M8 14V10"/>
    <path d="M12 14V8"/>
    <path d="M16 14v-3"/>
    <path d="M10 6h6"/>
  `),

  // 6. Métiers de l\'Automobile (voiture)
  'Métiers de l\'Automobile': __svg(`
    <path d="M3 16l1.5-5a2 2 0 0 1 1.9-1.4h11.2a2 2 0 0 1 1.9 1.4L21 16"/>
    <path d="M6.5 16a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
    <path d="M17.5 16a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
    <path d="M5 11l2-4h10l2 4"/>
  `),

  // 7. Textile Habillement (t-shirt)
  'Textile Habillement': __svg(`
    <path d="M9 3l-2.5 1.5L4 7v13h6V13h4v7h6V7l-2.5-2.5L15 3h-1.5l-1.5 2-1.5-2H9z"/>
  `),

  // 8. Tourisme Hôtellerie Restauration (cloche + couverts)
  'Tourisme Hôtellerie Restauration': __svg(`
    <path d="M4 16h16"/>
    <path d="M6 16a6 6 0 1 1 12 0"/>
    <path d="M12 6v-1"/>
    <path d="M7 12v-3"/>
    <path d="M17 12v-3"/>
    <path d="M9 12v-2"/>
    <path d="M15 12v-2"/>
  `),

  // 9. Bâtiment & TP (grue + bâtiment)
  'Bâtiment & TP': __svg(`
    <path d="M3 20h18"/>
    <path d="M4 20V8h8l3 2h5"/>
    <path d="M8 12h4v8H8z"/>
    <path d="M12 8V4h6M12 4H7l-3 4"/>
    <path d="M16 4h4"/>
    <path d="M18 8v4"/>
  `),

  // 10. Services à la Personne (cœur + personnes)
  'Services à la Personne': __svg(`
    <path d="M5.5 11.5a3.5 3.5 0 0 1 6.5-2 3.5 3.5 0 0 1 6.5 2c0 3-3 5.5-6.5 8-3.5-2.5-6.5-5-6.5-8z"/>
    <path d="M8 21v-1a3 3 0 0 1 3-3h2"/>
    <path d="M16 21v-1a3 3 0 0 0-3-3h-1"/>
  `),
  // --- Nouveau secteur : Froid & Génie Thermique ---
'Froid & Génie Thermique': __svg(`
  <path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
  <circle cx="12" cy="12" r="3.5" />
  <path d="M16 22s.5-2 2-3 3-1 3-1" />
`),


  // Fallback
  'Autres': __svg(`
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 8h.01M11 12h2v5h-2z"/>
  `),
};


function __renderSectorChip(label){
  const ico = __ICONS[label] || __svg(`<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h2v5h-2z"/>`);
  // data-sector normalisé pour le CSS
  const ds = String(label || '').trim();
  return `<span class="sector-chip" data-sector="${ds}">${ico}<span class="sector-chip__text">${label}</span></span>`;
}


  function ready(fn){ if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  ready(init);

  function init(){
    const HAS_SECTOR_ICONS = typeof window.SECTOR_ICONS !== 'undefined';
    const elGrid    = document.getElementById('cards');
    const elQuery   = document.getElementById('q');
    const elSecteur = document.getElementById('f-secteur');
    const elNiveau  = document.getElementById('f-niveau');
    const elDiplome = document.getElementById('f-diplome');
    const elMore    = document.getElementById('moreBtn');
    const elCounter = document.getElementById('counter');
    const elChips   = document.getElementById('chips');
    const btnsComplexe = Array.from(document.querySelectorAll('.complexe-btn'));
    if (!elGrid) return;

    // -------- Données source
    const base  = (typeof FILIERES !== "undefined" && Array.isArray(FILIERES)) ? FILIERES : [];
    const patch = (typeof FILIERES_PATCH !== "undefined" && Array.isArray(FILIERES_PATCH)) ? FILIERES_PATCH : [];
    const RAW   = base.concat(patch);

    if (!RAW.length){ if (elCounter) elCounter.textContent = 'Aucune formation'; return; }

    // -------- Normalisation
    const deburr = s => String(s||'')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[’'\"]/g,'')
      .replace(/[`´^¨]/g,'')
      .replace(/[()]/g,' ')
      .replace(/\s+/g,' ')
      .trim();

    const normTitle = (s) => {
      let x = deburr(s)
        .replace(/«|»|"|"/g,'')
        .replace(/\btronc\s+commun\b/g,'')
        .replace(/\s+/g,' ')
        .trim();
      // Harmonisations légères pour matching souple
      x = x.replace(/\bservice de restauration\s*[']?arts de table[']?\b/,'service de restauration arts de table')
           .replace(/\belectrique\b/,'electricite');
      return x;
    };

    const keyFor = (f) => {
      const a = deburr(f.slug||'');
      return a || normTitle(f.titre||'');
    };

    // -------- Listes OFFICIELLES (de toi)
    const OFF_BEN = [
      "Assistant Administratif",
      "Assistant Administratif option Commerce",
      "Assistant Administratif option Gestion",
      "Bureau d'Etude en Construction Métallique",
      "Certification Microsoft office Specialist en Access",
      "Certification Microsoft office Specialist en Word",
      "Certification Microsoft office Spécialiste en Excel",
      "Certification Microsoft office Spécialiste en Outlook",
      "Certification Microsoft office Spécialiste en PowerPoint",
      "Electricité d'Installation",
      "Electricité de Bâtiment",
      "Electricité de Maintenance Industrielle",
      "Electromécanique des Systèmes Automatisés",
      "Fabrication Mécanique",
      "Gestion des Entreprises",
      "Gestion des Entreprises option Comptabilité et Finance",
      "Gestion des Entreprises option Ressources Humaines",
      "Gestion des Entreprises option Commerce et Marketing",
      "Infrastructure Digitale",
      "Infrastructure Digitale option Cyber sécurité",
      "Infrastructure Digitale option Systèmes et Réseaux",
      "Menuiserie",
      "Menuiserie Aluminium",
      "Menuiserie Métallique",
      "Menuiserie option Aluminium et Bois",
      "Mécanicien Général Polyvalent",
      "Méthodes en Fabrication Mécanique",
      "Opérateur Polyvalent Construction Métallique",
      "Réparateur de véhicule automobile (MAALEM)",
      "Réparateur de Véhicules Automobiles",
      "Réparation des engins à moteurs option Automobile",
      "Technicien Spécialisé en Diagnostic et Electronique Embarquée",
      "Programme d'Innovation Entrepreneuriale"
    ];
    
    const OFF_BTP = [
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
      "Parcours Collégial Tâcheron",
      "Hygiène Sécurité Environnement",
      "Maintenance des Engins du BTP",
      "Maintenance des engins lourds et véhicules industriels option BTP",
    ];
    
    const OFF_SET = [
      'Management hôtelier','Arts culinaires option Cuisine Marocaine','Arts culinaires option Cuisine Gastronomique',
      'Agent de Restauration','Agent Socio-Educatif','Arts culinaires','Assistant Administratif',
      'Assistant Administratif option Commerce','Assistant Administratif option Comptabilité',
      'Automatisation et Instrumentation Industrielle','Certification Microsoft office Specialist en Word',
      'Certification Microsoft office Spécialiste en Excel','Coiffure Femmes','Construction Métallique',
      'Développement Digital','Développement Digital option Applications Mobiles','Développement Digital option Web Full Stack',
      'Educateur Spécialisé dans la Petite Enfance','Electricité de Bâtiment','Electricité de Maintenance Industrielle',
      "Electricité d'Entretien Industriel","Electricité d'Installation",'Electromécanique',
      'Electromécanique des Systèmes Automatisés','Fabrication Mécanique','Froid Commercial et Climatisation',
      'Gestion des Entreprises','Gestion des Entreprises option Commerce et Marketing',
      'Gestion des Entreprises option Comptabilité et Finance','Gestion des Entreprises option Ressources Humaines',
      'Infographie','Infrastructure Digitale',
      'Infrastructure Digitale option Systèmes et Réseaux',
      'Maintenance des engins lourds et véhicules industriels option BTP','Management de projets dans le secteur THR',
      'Management hôtelier option Gestion hôtelière','Mécanicien Général Polyvalent','Méthodes en Fabrication Mécanique',
      'Ouvrier Qualifié en électricité','Ouvrier Spécialisé en Coupe et Couture','Réparateur de Véhicules Automobiles',
      'Réparation des engins à moteurs option Automobile',"Service de Restauration 'Arts de table'",
      'Soudage multi procédés','Technicien Spécialisé en Diagnostic et Electronique Embarquée',
      'Programme d\'Innovation Entrepreneuriale',
      "Certification Microsoft office Spécialiste en Outlook",
      "Certification Microsoft office Spécialiste en PowerPoint",
      "Certification Microsoft office Specialist en Access"
    ];

    const OFF_BEN_N = new Set(OFF_BEN.map(normTitle));
    const OFF_BTP_N = new Set(OFF_BTP.map(normTitle));
    const OFF_SET_N = new Set(OFF_SET.map(normTitle));

    const inOfficial = (title, complexe) => {
      const n = normTitle(title||'');
      if (complexe==='benahmed') return OFF_BEN_N.has(n);
      if (complexe==='btp')      return OFF_BTP_N.has(n);
      if (complexe==='settat')   return OFF_SET_N.has(n);
      return false;
    };

    // -------- Secteurs & icônes
    const ICONS = {
      'Digital & IT': '🖥️', 'BTP': '🏗️', 'Industrie': '🏭', 'Automobile': '🚗',
      'Gestion & Commerce': '📊', 'Tourisme & Restauration': '🍽️',
      'Services éducatifs': '🧒', 'Arts & Métiers': '🎨', 'Autres': ''
    };
    
    function inferSecteur(f) {
      const slug = (f.slug || '').toLowerCase();
      const secteurOrig = (f.secteur || '').trim();
      const titre = (f.titre || '');
      const src  = (f.source || '').toUpperCase();
      const t    = (
        titre + ' ' +
        (f.extrait || '') + ' ' +
        (f.tabs && f.tabs.presentation ? f.tabs.presentation : '')
      ).toUpperCase();

      const T = titre.toUpperCase();

      // 🔥 Forçage TOTAL : Electromécanique des Systèmes Automatisés = Génie Electrique
      if (slug === 'electrom-canique-des-syst-mes-automatis-s') {
        return 'Génie Electrique';
      }

      // Règles spéciales supplémentaires demandées :
      // Electricité d'Installation = Génie Electrique (tous complexes)
      if (
        T.includes("ELECTRICITÉ D'INSTALLATION") ||
        T.includes("ELECTRICITE D'INSTALLATION")
      ) {
        return 'Génie Electrique';
      }

      // Electromécanique des Systèmes Automatisés = Génie Electrique (tous complexes)
      if (
        T.includes("ELECTROMECANIQUE DES SYSTEMES AUTOMATISES") ||
        T.includes("ÉLECTROMÉCANIQUE DES SYSTÈMES AUTOMATISÉS")
      ) {
        return 'Génie Electrique';
      }

      // Hygiène Sécurité Environnement = Bâtiment & TP (uniquement secteur BTP)
      if (
        T.includes("HYGIÈNE SÉCURITÉ ENVIRONNEMENT") ||
        T.includes("HYGIENE SECURITE ENVIRONNEMENT")
      ) {
        return 'Bâtiment & TP';
      }

      // Règle spéciale : toutes les filières Electricité de Bâtiment (y compris parcours collégial)
      // doivent aller en Génie Electrique et pas en Bâtiment & TP.
      if (T.includes("ELECTRICITÉ DE BÂTIMENT") || T.includes("ELECTRICITE DE BATIMENT")) {
        return 'Génie Electrique';
      }

      // 1) RÈGLES SPÉCIALES PRIORITAIRES (peu importe le secteur d'origine)
      
      // 1.a) MÉTIERS DE L'AUTOMOBILE = Vehicules / Conducteur / Diagnostic / Engins
      if (
        /VÉHICULE|VEHICULE|VÉHICULES|VEHICULES/.test(t) ||
        /CONDUCTEUR|CONDUCTRICE/.test(t) ||
        /DIAGNOSTIC/.test(t) ||
        /ENGIN|ENGINS/.test(t)
      ) {
        return 'Métiers de l\'Automobile';
      }

      // 1.b) BÂTIMENT & TP = Génie civil / Topographe / Grutier / Tâcheron / BTP ...
      if (
        /GENIE CIVIL|GÉNIE CIVIL/.test(t) ||
        /TOPOGRAPHE|TOPOGRAPHIE|GEOMETRE|GÉOMÈTRE/.test(t) ||
        /GRUTIER|GRUE/.test(t) ||
        /TACHERON|TÂCHERON|TACHRONE/.test(t) ||
        /VOIRIE/.test(t) ||
        /\bBTP\b/.test(t) ||
        /BATIMENT|BÂTIMENT/.test(t) ||
        /MENUISERIE/.test(t)
      ) {
        return 'Bâtiment & TP';
      }

      // 1.c) THR = hôtel / restauration / tourisme / cuisine / housekeeping / hôtelier / THR
      if (
        /HÔTEL|HOTEL|HÔTELIER|HOTELIER|RESTAURATION|CUISINE|HOUSEKEEPING|TOURISME|\bTHR\b/.test(t)
      ) {
        return 'Tourisme Hôtellerie Restauration';
      }

      // 1.d) GÉNIE ELECTRIQUE = électricité / électromécanique
      if (
        /ELECTRICITE|ÉLECTRICITÉ|ELECTRIQUE|ÉLECTRIQUE/.test(t) ||
        /ELECTROMECANIQUE|ÉLECTROMÉCANIQUE|ELECTRO-MECANIQUE/.test(t)
      ) {
        return 'Génie Electrique';
      }

      // 1.e) DIGITAL & IA = Développement digital / Infrastructure / MOS
      if (
        /DÉVELOPPEMENT DIGITAL|DEVELOPPEMENT DIGITAL|DÉVELOPPEMENT WEB|DEVELOPPEMENT WEB/.test(t) ||
        /INFRASTRUCTURE/.test(t) ||
        /MOS\b/.test(t) ||
        /MICROSOFT OFFICE SPECIALIST|CERTIFICATION MOS|CERTIFICATION MICROSOFT OFFICE/.test(t)
      ) {
        return 'Digital & IA';
      }

      // 1.f) SERVICES À LA PERSONNE = Coiffeur / Éducateur / Socio
      if (
        /COIFFEUR|COIFFEUSE|COIFFURE/.test(t) ||
        /EDUCATEUR|ÉDUCATEUR|EDUCATRICE|ÉDUCATRICE/.test(t) ||
        /SOCIO/.test(t)
      ) {
        return 'Services à la Personne';
      }

      // 1.g) ARTS & INDUSTRIES GRAPHIQUES = Infographie
      if (/INFOGRAPHIE|INFOGRAPHIQUE/.test(t)) {
        return 'Arts et Industries Graphiques';
      }

      // 1.h) TEXTILE = couture / habillement / textile
      if (/TEXTILE|HABILLEMENT|COUTURE|COUPE/.test(t)) {
        return 'Textile Habillement';
      }

      // 🔥 Force secteur Froid & Génie Thermique
      if (
        T.includes("FROID") ||
        T.includes("CLIMATISATION") ||
        T.includes("THERMIQUE") ||
        T.includes("FRIGORIFIQUE") ||
        T.includes("GENIE THERMIQUE")
      ) {
        return "Froid & Génie Thermique";
      }

      // 2) MAPPAGE À PARTIR DU SECTEUR ORIGINE (data.js)
      if (secteurOrig) {
        if (secteurOrig === 'Digital & IT') {
          return 'Digital & IA';
        }
        if (secteurOrig === 'Gestion & Commerce') {
          return 'Gestion et Commerce';
        }
        if (secteurOrig === 'Industrie & Maintenance') {
          // Ici on distribue : si électricité -> Génie Electrique, sinon Génie Mécanique
          if (/ELECTRICITE|ELECTRIQUE|ÉLECTROMÉCANIQUE|ELECTROMECANIQUE/.test(t)) {
            return 'Génie Electrique';
          }
          return 'Génie Mécanique';
        }
        if (secteurOrig === 'Tourisme Hôtellerie Restauration') {
          return 'Tourisme Hôtellerie Restauration';
        }
        if (secteurOrig === 'Social & Éducation') {
          return 'Services à la Personne';
        }
      }

      // 3) CAS "AUTRES" OU SANS SECTEUR : on ne force Gestion & Commerce que si le titre est clairement lié
      if (
        /ASSISTANT ADMINISTRATIF/.test(T) ||
        /GESTION DES ENTREPRISES/.test(T) ||
        /COMMERCE/.test(T)
      ) {
        return 'Gestion et Commerce';
      }

      // 4) Fallback très neutre : on évite de polluer avec Gestion & Commerce
      return 'Génie Mécanique';
    }

    
    const iconFor = (secteur)=> ICONS[secteur] || ICONS['Autres'];
    const byKey = new Map();
    for (const f of RAW){
      const k1 = keyFor(f);
      const k2 = Array.isArray(f.etabs) && f.etabs.length ? f.etabs.join('|') : deburr(f.ville||'');
      const key = k1 + '::' + k2;
      if (!byKey.has(key)) byKey.set(key, f);
    }
    const ALL_PRE = Array.from(byKey.values());

    function classifyRough(f){
      const et = Array.isArray(f.etabs) ? f.etabs : [];
      if (et.includes('settat_main'))   return 'settat';
      if (et.includes('benahmed_main')) return 'benahmed';
      if (et.includes('elbrouj_main'))  return 'btp';
      const v = deburr(f.ville||'');
      if (v.includes('settat')) return 'settat';
      if (v.includes('ben ahmed') || v.includes('benahmed')) return 'benahmed';
      if (v.includes('el brouj')) return 'btp';
      return 'unknown';
    }


    const ALL = ALL_PRE.map(f => {
      const secteur = inferSecteur(f);
      return { ...f, secteur, _icon: iconFor(secteur), _rough: classifyRough(f), _ntitle: normTitle(f.titre||'') };
    });

    const PAGE = 9;
    let state = { q:'', secteur:'', niveau:'', diplome:'', complexe:'settat' };
    let filtered = []; let page = 0;

    // Activer visuellement Settat
    if (btnsComplexe.length){
      const hasActive = btnsComplexe.some(b => b.classList.contains('is-active'));
      if (!hasActive){
        const b = btnsComplexe.find(b => (b.dataset.complexe || '') === 'settat') || btnsComplexe[0];
        if (b) b.classList.add('is-active');
      }
    }

    // -------- UI
    ensureGrid3x3(elGrid);
    
    // Secteur : toutes les valeurs détectées
    fillSelect(
      elSecteur,
      uniq(ALL.map(x => (x.secteur || '').trim())).filter(Boolean),
      'Secteur'
    );

    // Niveau : on ne garde que les 4 valeurs demandées
    const allNiveaux = uniq(
      ALL.map(x => (x.niveau || '').trim())
    ).filter(Boolean);

    const allowedNiveaux = [
      "Technicien Spécialisé",
      "Technicien",
      "Spécialisation",
      "Qualification"
    ];

    const niveauxForSelect = allowedNiveaux.filter(v => allNiveaux.includes(v));
    fillSelect(elNiveau, niveauxForSelect, 'Niveau');

    // Diplôme : 4 familles (initiale, qualifiante, continue, cours du soir)
    const allDiplomes = uniq(
      ALL.map(x => (x.diplome || '').trim())
    ).filter(Boolean);

    const allowedDiplomes = [
      "Formation Diplomante",
      "Formation Qualifiante",
      "Formation Continue",
      "Cours du soir"
    ];

    const diplomesForSelect = allowedDiplomes.filter(v => allDiplomes.includes(v));
    fillSelect(elDiplome, diplomesForSelect, 'Diplôme');

    if (elChips){
      elChips.innerHTML = [
        '<div class="chips">',
        '<span class="chip chip--muted" id="chip-secteur">Secteur: —</span>',
        '<span class="chip chip--muted" id="chip-niveau">Niveau: —</span>',
        '<span class="chip chip--muted" id="chip-diplome">Diplôme: —</span>',
        '<span class="chip" id="chip-complexe">Complexe: Settat</span>',
        '</div>'
      ].join('');
    }

    // -------- Listeners
    if (elQuery)  elQuery.addEventListener('input', debounce(() => { state.q = (elQuery.value||'').trim().toLowerCase(); reset(); }, 150));
    if (elSecteur) elSecteur.addEventListener('change', () => { state.secteur = elSecteur.value; reset(); });
    if (elNiveau)  elNiveau.addEventListener('change',  () => { state.niveau  = elNiveau.value;  reset(); });
    if (elDiplome) elDiplome.addEventListener('change', () => { state.diplome = elDiplome.value; reset(); });
    btnsComplexe.forEach(btn => {
      btn.addEventListener('click', () => {
        btnsComplexe.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.complexe = btn.dataset.complexe || 'settat';
        reset();
      });
    });
    if (elMore) elMore.addEventListener('click', () => render(true));

    
    // Rendre les chips cliquables pour réinitialiser les filtres
    const chipSecteur  = document.getElementById('chip-secteur');
    const chipNiveau   = document.getElementById('chip-niveau');
    const chipDiplome  = document.getElementById('chip-diplome');
    const chipComplexe = document.getElementById('chip-complexe');

    if (chipSecteur && elSecteur){
      chipSecteur.addEventListener('click', () => {
        state.secteur = '';
        elSecteur.value = '';
        reset();
      });
    }
    if (chipNiveau && elNiveau){
      chipNiveau.addEventListener('click', () => {
        state.niveau = '';
        elNiveau.value = '';
        reset();
      });
    }
    if (chipDiplome && elDiplome){
      chipDiplome.addEventListener('click', () => {
        state.diplome = '';
        elDiplome.value = '';
        reset();
      });
    }
    if (chipComplexe){
      chipComplexe.addEventListener('click', () => {
        state.complexe = 'settat';
        btnsComplexe.forEach(b => {
          const cx = b.dataset.complexe || 'settat';
          if (cx === 'settat') b.classList.add('is-active');
          else b.classList.remove('is-active');
        });
        reset();
      });
    }

    // Premier rendu
    reset();

    // -------- RENDER
    function reset(){
      page = 0;

      // 1) on filtre par complexe + filtres UI
      filtered = ALL
        .filter(matchByComplexe)
        .filter(matchFilters);

      // 2) on enlève les doublons sur le titre normalisé
      const _seen = new Set();
      filtered = filtered.filter(x => {
        const k = (x._ntitle || String(x.titre || '')).toLowerCase().trim();
        if (_seen.has(k)) return false;
        _seen.add(k);
        return true;
      });

      // 3) TRI : d'abord par secteur (A→Z), puis par titre (A→Z)
      filtered.sort((a, b) => {
        const sa = (a.secteur || '').localeCompare(b.secteur || '', 'fr', { sensitivity: 'base' });
        if (sa !== 0) return sa;
        return (a._ntitle || '').localeCompare(b._ntitle || '', 'fr', { sensitivity: 'base' });
      });

      // 4) mise à jour UI
      updateChips();
      updateCounter();
      elGrid.innerHTML = '';
      render(false);
    }

    function render(append){
      const start = page * PAGE;
      const slice = filtered.slice(start, start + PAGE);
      const frag = document.createDocumentFragment();
      slice.forEach(x => frag.appendChild(card(x)));
      elGrid.appendChild(frag);
      page++;

      if (elMore) {
        elMore.style.display = (page * PAGE < filtered.length) ? 'inline-flex' : 'none';
      }
    }

    // 1) Filtrage par complexe (listes officielles pour la formation initiale,
    //    mais on laisse passer les formations Adultes / Entreprises)
    function matchByComplexe(x){
      const tAd  = (x.type_adulte || '').trim();
      const et   = Array.isArray(x.etabs) ? x.etabs : [];

      // Pour les formations Adultes / Entreprises (Formation Continue, Cours du soir, Qualifiante adulte),
      // on n'applique PAS le filtrage strict par listes officielles.
      if (tAd) {
        if (state.complexe === 'settat')   return et.length ? et.includes('settat_main')   : true;
        if (state.complexe === 'benahmed') return et.length ? et.includes('benahmed_main') : true;
        if (state.complexe === 'btp')      return et.length ? et.includes('elbrouj_main')  : true;
        // "all" : on accepte toutes les formations adultes
        return true;
      }

      // Filtrage STRICT pour la formation initiale selon les listes officielles
      if (state.complexe==='settat')   return inOfficial(x.titre, 'settat');
      if (state.complexe==='benahmed') return inOfficial(x.titre, 'benahmed');
      if (state.complexe==='btp')      return inOfficial(x.titre, 'btp');
      // "all" : on prend tout ce qui appartient à une des listes officielles
      return inOfficial(x.titre, 'settat') || inOfficial(x.titre, 'benahmed') || inOfficial(x.titre, 'btp');
    }

    // 2) Filtres UI classiques
    function matchFilters(x){
      if (state.q){
        const hay = [
          x.titre, x.extrait, x.secteur, x.niveau, x.diplome, x.ville
        ].concat(Array.isArray(x.competences)?x.competences:[]).join(' ').toLowerCase();
        if (!hay.includes(state.q)) return false;
      }
      if (state.secteur && (x.secteur||'') !== state.secteur) return false;
      if (state.niveau  && (x.niveau ||'').trim() !== state.niveau)  return false;

      if (state.diplome) {
        const dip  = (x.diplome     || '').trim();
        const mode = (x.mode        || '').trim();
        const tAd  = (x.type_adulte || '').trim();

        if (state.diplome === "Cours du soir") {
          // On veut TOUTES les filières en mode "Cours du soir"
          if (mode !== "Cours du soir" && tAd !== "Cours du soir" && dip !== "Cours du soir") {
            return false;
          }
        } else if (state.diplome === "Formation Continue") {
          // Toutes les formations dont le type ou le diplome est "Formation Continue"
          if (dip !== "Formation Continue" && tAd !== "Formation Continue") {
            return false;
          }
        } else {
          // Cas classique : Formation Diplomante / Formation Qualifiante
          if (dip !== state.diplome) return false;
        }
      }
      return true;
    }
    
    // -------- Carte
    function card(item){
      const esc = s => String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      const el = document.createElement('article');
      el.className = 'card card--formation fx-card';

      // Icône secteur SAFE à côté du titre (aucune ReferenceError possible)
      let iconHTML = '';
      if (item.secteur) {
        try {
          if (typeof window.SECTOR_ICONS !== 'undefined'
              && window.SECTOR_ICONS
              && typeof window.SECTOR_ICONS.renderSectorChip === 'function') {
            iconHTML = window.SECTOR_ICONS.renderSectorChip(item.secteur);
          } else {
            // Fallback si pack d'icônes externe non chargé
            iconHTML = __renderSectorChip(item.secteur); // utilise tes icônes inline
          }
        } catch (_) {
          iconHTML = __renderSectorChip(item.secteur);
        }
      }

      el.innerHTML = [
        '<div class="card__body">',
          '<h3 class="card__title">',
            iconHTML,
            '<span class="card__title-text">', esc(item.titre || 'Formation'), '</span>',
          '</h3>',
          '<p class="card__excerpt">', esc(item.extrait || ''), '</p>',
          '<div class="card__badges">',
            item.niveau ? '<span class="badge">'+esc(item.niveau)+'</span>' : '',
            item.diplome? '<span class="badge">'+esc(item.diplome)+'</span>' : '',
          '</div>',
        '</div>',
        '<div class="card__footer">',
          '<button type="button" class="btn btn--primary js-open-filiere" data-slug="', encodeURIComponent(item.slug || ''), '">Détails</button>',
        '</div>'
      ].join('');

      const btn = el.querySelector('.js-open-filiere');
      if (btn) {
        btn.addEventListener('click', function(){
          const slug = this.getAttribute('data-slug') || '';
          if (window.openFiliereModal && typeof window.openFiliereModal === 'function') {
            window.openFiliereModal(slug, item);
          } else {
            // CORRECTION ICI : utiliser "filiere" comme paramètre
            const url = 'filiere.html?filiere=' + encodeURIComponent(item.slug || slug || '');
            window.location.href = url;
          }
        });
      }

      return el;
    }

    // -------- Compteurs & chips
    function updateCounter(){
      if (!elCounter) return;
      const n = filtered.length;
      elCounter.textContent = n===0 ? 'Aucune formation' : n+' formation'+(n>1?'s':'');
    }
    
    function updateChips(){
      const set = (id, label, val) => {
        const e = document.getElementById(id);
        if (!e) return;
        e.textContent = label+': '+(val||'—');
        e.classList.toggle('chip--muted', !val);
      };
      
      set('chip-diplome','Diplôme', state.diplome);
      set('chip-niveau','Niveau', state.niveau);
      set('chip-secteur','Secteur', state.secteur);
     
      const e = document.getElementById('chip-complexe');
      if (e){
        const label = state.complexe==='all'?'Tous':state.complexe==='settat'?'Settat':state.complexe==='btp'?'BTP':'Ben Ahmed';
        e.textContent = 'Complexe: '+label;
        e.classList.toggle('chip--muted', state.complexe==='all');
      }
    }

    // -------- Utils
    function uniq(a){ return Array.from(new Set(a)); }
    
    function fillSelect(el, values, placeholder){
      if (!el) return;
      const html = ['<option value="">'+placeholder+'</option>']
        .concat(values.sort().map(v => '<option value="'+escapeHtmlAttr(v)+'">'+escapeHtmlAttr(v)+'</option>'));
      el.innerHTML = html.join('');
    }
    
    function escapeHtmlAttr(s){ 
      return String(s||'').replace(/["&<>]/g, m=>({'"':'&quot;','&':'&amp;','<':'&lt;','>':'&gt;'}[m])); 
    }
    
    function debounce(fn, t){ 
      let id; 
      return function(){ 
        clearTimeout(id); 
        id=setTimeout(()=>fn.apply(this, arguments), t); 
      }; 
    }
    
    function ensureGrid3x3(gridEl){
      const id = 'fx-grid-3x3';
      if (!document.getElementById(id)){
        const st = document.createElement('style');
        st.id = id;
        st.textContent = `
          #cards{ display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
          @media (max-width: 1024px){ #cards{ grid-template-columns: repeat(2, minmax(0,1fr)); } }
          @media (max-width: 640px){  #cards{ grid-template-columns: repeat(1, minmax(0,1fr)); } }
          .card__title{ display:flex; align-items:center; gap:.5rem; }
          .card__icon{ font-size:1.1em; line-height:1; transform:translateY(1px); }
          .fx-card{ transition: transform .18s ease, box-shadow .18s ease; }
          .fx-card:hover{ transform:translateY(-2px); box-shadow:0 10px 20px rgba(0,0,0,.08); }

          .sector-chip{
            display:inline-flex;
            align-items:center;
            gap:6px;
            padding:4px 10px;
            border-radius:999px;
            font-size:.78rem;
            font-weight:600;
            border:1px solid transparent;
            background:rgba(15,23,42,.02);
            white-space:nowrap;
          }
          .sector-chip svg{ flex:0 0 auto; }
          .sector-chip__text{ display:inline-block; }

          .sector-chip[data-sector="Arts et Industries Graphiques"]{
            color:#be185d;
            border-color:rgba(190,24,93,.35);
            background:rgba(190,24,93,.08);
          }
          .sector-chip[data-sector="Digital & IA"]{
            color:#0ea5e9;
            border-color:rgba(14,165,233,.4);
            background:rgba(14,165,233,.08);
          }
          .sector-chip[data-sector="Génie Electrique"]{
            color:#f59e0b;
            border-color:rgba(245,158,11,.4);
            background:rgba(245,158,11,.08);
          }
          .sector-chip[data-sector="Génie Mécanique"]{
            color:#0b74c9;
            border-color:rgba(11,116,201,.4);
            background:rgba(11,116,201,.08);
          }
          .sector-chip[data-sector="Gestion et Commerce"]{
            color:#7c3aed;
            border-color:rgba(124,58,237,.4);
            background:rgba(124,58,237,.08);
          }
          .sector-chip[data-sector="Métiers de l\\'Automobile"]{
            color:#16a34a;
            border-color:rgba(22,163,74,.4);
            background:rgba(22,163,74,.08);
          }
          .sector-chip[data-sector="Textile Habillement"]{
            color:#6366f1;
            border-color:rgba(99,102,241,.4);
            background:rgba(99,102,241,.08);
          }
          .sector-chip[data-sector="Tourisme Hôtellerie Restauration"]{
            color:#e11d48;
            border-color:rgba(225,29,72,.4);
            background:rgba(225,29,72,.08);
          }
          .sector-chip[data-sector="Bâtiment & TP"]{
            color:#d97706;
            border-color:rgba(217,119,6,.4);
            background:rgba(217,119,6,.08);
          }
          .sector-chip[data-sector="Services à la Personne"]{
            color:#0891b2;
            border-color:rgba(8,145,178,.4);
            background:rgba(8,145,178,.08);
          }
        `;
        document.head.appendChild(st);
      }
    }
  }
})();
