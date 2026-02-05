// charger-secteurs.js - Script à ajouter dans offre de formation.html
function initialiserAffichageSecteurs() {
  console.log("🔄 Initialisation de l'affichage des secteurs...");
  
  // Vérifier si l'API est disponible
  if (!window.SecteursAPI) {
    console.error("❌ API des secteurs non chargée");
    return;
  }
  
  // Vérifier si le conteneur existe
  const container = document.getElementById('dynamic-secteurs');
  if (!container) {
    console.error("❌ Conteneur 'dynamic-secteurs' non trouvé");
    return;
  }
  
  // Récupérer les secteurs
  const secteurs = window.SecteursAPI.getAllSecteurs();
  console.log(`📊 ${Object.keys(secteurs).length} secteurs trouvés`);
  
  // Afficher les secteurs
  window.SecteursAPI.renderSecteursGrid('dynamic-secteurs');
  
  // Ajouter un bouton admin si nécessaire
  ajouterBoutonAdmin();
}

function ajouterBoutonAdmin() {
  // Ajouter un bouton pour aller à l'admin si on est sur la page d'accueil
  if (window.location.pathname.includes('offre de formation.html')) {
    const header = document.querySelector('.admin-header') || 
                   document.querySelector('header') || 
                   document.getElementById('secteurs-settat');
    
    if (header && !document.querySelector('.admin-access-btn')) {
      const adminBtn = document.createElement('a');
      adminBtn.href = 'admin-secteurs.html';
      adminBtn.className = 'admin-access-btn';
      adminBtn.innerHTML = '<i class="fas fa-cog"></i> Admin Secteurs';
      adminBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #0b4da2;
        color: white;
        padding: 10px 15px;
        border-radius: 25px;
        text-decoration: none;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(11, 77, 162, 0.3);
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 500;
      `;
      
      document.body.appendChild(adminBtn);
      console.log("✅ Bouton admin ajouté");
    }
  }
}

// Exécuter quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
  // Attendre un peu pour être sûr que tout est chargé
  setTimeout(initialiserAffichageSecteurs, 500);
  
  // Ré-essayer après 2 secondes au cas où
  setTimeout(initialiserAffichageSecteurs, 2000);
});

// Exporter la fonction pour pouvoir l'appeler manuellement
window.chargerSecteurs = initialiserAffichageSecteurs;