// admin-secteurs.js - Version avec sélection visuelle d'icônes
document.addEventListener('DOMContentLoaded', function() {
  // Initialiser les variables
  let currentEditSlug = null;
  let statsCount = 0;
  let skillsCount = 0;
  
  // Icônes disponibles (5 pour chaque)
  const statIcons = [
    { value: 'fa-users', label: '👥 Personnes' },
    { value: 'fa-briefcase', label: '💼 Emplois' },
    { value: 'fa-chart-pie', label: '📊 Statistiques' },
    { value: 'fa-building', label: '🏢 Entreprises' },
    { value: 'fa-industry', label: '🏭 Industrie' }
  ];
  
  const skillIcons = [
    { value: 'fa-people-group', label: '👥 Équipe' },
    { value: 'fa-lightbulb', label: '💡 Créativité' },
    { value: 'fa-comments', label: '💬 Communication' },
    { value: 'fa-heart', label: '❤️ Empathie' },
    { value: 'fa-scale-balanced', label: '⚖️ Rigueur' }
  ];
  
  // Initialiser l'API
  if (!window.SecteursAPI) {
    console.error("API des secteurs non chargée");
    return;
  }
  
  // Fonction pour créer un sélecteur d'icônes
  function creerSelecteurIcones(iconsArray, name, selectedIcon = '') {
    return `
      <div class="icon-selector">
        <label style="font-size: 0.85em; display: block; margin-bottom: 8px;">Icône</label>
        <div class="icon-options" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px;">
          ${iconsArray.map(icon => `
            <button type="button" class="icon-option ${selectedIcon === icon.value ? 'selected' : ''}" 
                    data-icon="${icon.value}" data-label="${icon.label}"
                    style="padding: 8px 12px; border: 2px solid ${selectedIcon === icon.value ? '#0b4da2' : '#e2e8f0'}; 
                           background: ${selectedIcon === icon.value ? '#e0f2fe' : 'white'}; 
                           border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
              <i class="fas ${icon.value}" style="color: #0b4da2;"></i>
              <span style="font-size: 0.85em;">${icon.label}</span>
            </button>
          `).join('')}
        </div>
        <input type="hidden" name="${name}" value="${selectedIcon || iconsArray[0].value}">
      </div>
    `;
  }
  
  // Charger les secteurs dans la liste
  function chargerListeSecteurs() {
    const secteurs = window.SecteursAPI.getAllSecteurs();
    const container = document.getElementById('liste-secteurs');
    
    if (!container) return;
    
    if (Object.keys(secteurs).length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #64748b;">
          <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem;"></i>
          <p>Aucun secteur publié</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = Object.entries(secteurs)
      .map(([slug, secteur]) => `
        <div class="secteur-item">
          <div>
            <h4 style="margin: 0 0 5px 0; color: #1e293b;">${secteur.titre}</h4>
            <small style="color: #64748b;">Slug: ${slug}</small>
            <div style="display: flex; gap: 10px; margin-top: 5px;">
              <span style="font-size: 0.8em; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 10px;">
                <i class="fas fa-graduation-cap"></i> ${secteur.filieresCount || '0'} filières
              </span>
              <span style="font-size: 0.8em; background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 10px;">
                <i class="fas fa-school"></i> ${secteur.etabsCount || '0'} établissements
              </span>
            </div>
          </div>
          <div class="secteur-actions">
            <a href="secteur.html?slug=${slug}" target="_blank" class="btn-icon view" title="Voir">
              <i class="fas fa-eye"></i>
            </a>
            <button class="btn-icon edit" onclick="editerSecteur('${slug}')" title="Modifier">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon delete" onclick="supprimerSecteur('${slug}')" title="Supprimer">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `)
      .join('');
  }
  
  // Mettre à jour l'aperçu
  function mettreAJourApercu() {
    const titre = document.getElementById('ext_titre').value;
    const image = document.getElementById('ext_image').value;
    const resume = document.getElementById('ext_resume').value;
    
    // Aperçu carte
    const previewHero = document.getElementById('preview-hero');
    const previewImg = document.getElementById('preview-img');
    
    if (image) {
      previewImg.src = image;
      previewImg.style.display = 'block';
      previewHero.style.backgroundImage = `url('${image}')`;
    } else {
      previewImg.style.display = 'none';
      previewHero.style.backgroundImage = 'none';
      previewHero.style.backgroundColor = '#e5e7eb';
    }
    
    document.getElementById('preview-titre').textContent = titre || "Titre du secteur";
    document.getElementById('preview-resume').textContent = resume || "Description...";
    
    // Aperçu des stats
    const statsContainer = document.getElementById('preview-stats');
    const statFields = document.querySelectorAll('.stat-field');
    
    if (statFields.length === 0) {
      statsContainer.innerHTML = "Aucun chiffre clé ajouté";
    } else {
      statsContainer.innerHTML = statFields.map(field => {
        const iconInput = field.querySelector('input[name="stat_icon"]');
        const icon = iconInput ? iconInput.value : 'fa-chart-bar';
        const value = field.querySelector('input[name="stat_value"]')?.value || '';
        const label = field.querySelector('input[name="stat_label"]')?.value || '';
        
        if (!value && !label) return '';
        
        return `
          <div style="margin-bottom: 10px; padding: 12px; background: #f0f9ff; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
            <i class="fas ${icon}" style="color: #0b4da2; font-size: 1.3em; min-width: 30px;"></i>
            <div style="flex: 1;">
              <strong style="display: block; font-size: 1.1em; color: #1e293b;">${value}</strong>
              <span style="color: #4b5563; font-size: 0.9em;">${label}</span>
            </div>
          </div>
        `;
      }).join('');
    }
    
    // Aperçu des compétences
    const skillsContainer = document.getElementById('preview-skills');
    const skillFields = document.querySelectorAll('.skill-field');
    
    if (skillFields.length === 0) {
      skillsContainer.innerHTML = "Aucune compétence ajoutée";
    } else {
      skillsContainer.innerHTML = skillFields.map(field => {
        const iconInput = field.querySelector('input[name="skill_icon"]');
        const icon = iconInput ? iconInput.value : 'fa-star';
        const label = field.querySelector('input[name="skill_label"]')?.value || '';
        
        if (!label) return '';
        
        return `
          <div style="display: inline-flex; align-items: center; margin: 5px; padding: 10px 16px; 
                      background: #e0f2fe; border-radius: 20px; font-size: 0.9em; gap: 10px;">
            <i class="fas ${icon}" style="color: #0b4da2; font-size: 1.1em;"></i>
            <span style="font-weight: 500;">${label}</span>
          </div>
        `;
      }).join('');
    }
  }
  
  // Afficher un message
  function afficherMessage(message, type = 'info') {
    const container = document.getElementById('message-container');
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      info: '#3b82f6'
    };
    
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
    
    const html = `
      <div class="message" style="background: ${colors[type] + '20'}; border: 1px solid ${colors[type]}; color: ${colors[type]}; padding: 12px; border-radius: 8px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-${icon}" style="font-size: 1.2em;"></i>
        <span>${message}</span>
      </div>
    `;
    
    container.innerHTML = html;
    
    setTimeout(() => {
      container.innerHTML = '';
    }, 5000);
  }
  
  // Ajouter un champ de statistique
  function ajouterChampStat(statData = {}) {
    statsCount++;
    const id = `stat-${statsCount}`;
    const selectedIcon = statData.icon || statIcons[0].value;
    
    const html = `
      <div class="stat-field" id="${id}">
        <div class="field-header">
          <h4>Chiffre clé #${statsCount}</h4>
          <button type="button" class="btn-delete" onclick="supprimerChamp('${id}')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div style="margin-bottom: 15px;">
          ${creerSelecteurIcones(statIcons, 'stat_icon', selectedIcon)}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 10px; margin-bottom: 10px;">
          <div>
            <label style="font-size: 0.85em;">Valeur</label>
            <input type="text" name="stat_value" placeholder="+ 5000" value="${statData.value || ''}" 
                   class="stat-input" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
          </div>
          <div>
            <label style="font-size: 0.85em;">Description</label>
            <input type="text" name="stat_label" placeholder="entreprises spécialisées" value="${statData.label || ''}" 
                   class="stat-input" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('stats-container').insertAdjacentHTML('beforeend', html);
    
    // Ajouter les écouteurs d'événements pour les boutons d'icônes
    const iconOptions = document.querySelectorAll(`#${id} .icon-option`);
    iconOptions.forEach(option => {
      option.addEventListener('click', function() {
        const icon = this.getAttribute('data-icon');
        const field = this.closest('.stat-field');
        const input = field.querySelector('input[name="stat_icon"]');
        input.value = icon;
        
        // Mettre à jour l'apparence
        field.querySelectorAll('.icon-option').forEach(opt => {
          opt.classList.remove('selected');
          opt.style.borderColor = '#e2e8f0';
          opt.style.background = 'white';
        });
        this.classList.add('selected');
        this.style.borderColor = '#0b4da2';
        this.style.background = '#e0f2fe';
        
        mettreAJourApercu();
      });
    });
    
    mettreAJourApercu();
  }
  
  // Ajouter un champ de compétence
  function ajouterChampCompetence(skillData = {}) {
    skillsCount++;
    const id = `skill-${skillsCount}`;
    const selectedIcon = skillData.icon || skillIcons[0].value;
    
    const html = `
      <div class="skill-field" id="${id}">
        <div class="field-header">
          <h4>Compétence #${skillsCount}</h4>
          <button type="button" class="btn-delete" onclick="supprimerChamp('${id}')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div style="margin-bottom: 15px;">
          ${creerSelecteurIcones(skillIcons, 'skill_icon', selectedIcon)}
        </div>
        <div>
          <label style="font-size: 0.85em;">Nom de la compétence</label>
          <input type="text" name="skill_label" placeholder="Esprit d'équipe" value="${skillData.label || ''}" 
                 class="skill-input" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; margin-top: 4px;">
        </div>
      </div>
    `;
    
    document.getElementById('skills-container').insertAdjacentHTML('beforeend', html);
    
    // Ajouter les écouteurs d'événements pour les boutons d'icônes
    const iconOptions = document.querySelectorAll(`#${id} .icon-option`);
    iconOptions.forEach(option => {
      option.addEventListener('click', function() {
        const icon = this.getAttribute('data-icon');
        const field = this.closest('.skill-field');
        const input = field.querySelector('input[name="skill_icon"]');
        input.value = icon;
        
        // Mettre à jour l'apparence
        field.querySelectorAll('.icon-option').forEach(opt => {
          opt.classList.remove('selected');
          opt.style.borderColor = '#e2e8f0';
          opt.style.background = 'white';
        });
        this.classList.add('selected');
        this.style.borderColor = '#0b4da2';
        this.style.background = '#e0f2fe';
        
        mettreAJourApercu();
      });
    });
    
    mettreAJourApercu();
  }
  
  // Supprimer un champ (stat ou skill)
  window.supprimerChamp = function(id) {
    const element = document.getElementById(id);
    if (element) {
      element.remove();
      mettreAJourApercu();
    }
  };
  
  // Remplir le formulaire avec un secteur existant
  window.editerSecteur = function(slug) {
    const secteur = window.SecteursAPI.getSecteurBySlug(slug);
    
    if (!secteur) return;
    
    currentEditSlug = slug;
    
    // Vider les conteneurs de stats et skills
    document.getElementById('stats-container').innerHTML = '';
    document.getElementById('skills-container').innerHTML = '';
    
    // Réinitialiser les compteurs
    statsCount = 0;
    skillsCount = 0;
    
    // Remplir les champs de base
    document.getElementById('ext_titre').value = secteur.titre || '';
    document.getElementById('ext_image').value = secteur.image || '';
    document.getElementById('ext_resume').value = secteur.resume || '';
    document.getElementById('int_hero').value = secteur.heroImage || '';
    document.getElementById('int_presentation').value = Array.isArray(secteur.presentation) 
      ? secteur.presentation.join('\n\n') 
      : secteur.presentation || '';
    document.getElementById('int_video').value = secteur.video || '';
    document.getElementById('filieres_count').value = secteur.filieresCount || '1';
    document.getElementById('etabs_count').value = secteur.etabsCount || '1';
    document.getElementById('filieres_intro').value = secteur.filieresIntro || '';
    
    // Remplir les stats
    if (secteur.stats && Array.isArray(secteur.stats)) {
      secteur.stats.forEach(stat => {
        ajouterChampStat(stat);
      });
    }
    
    // Remplir les compétences
    if (secteur.skills && Array.isArray(secteur.skills)) {
      secteur.skills.forEach(skill => {
        ajouterChampCompetence(skill);
      });
    }
    
    // Mettre à jour l'aperçu
    mettreAJourApercu();
    
    // Changer le bouton
    document.getElementById('btn-publier').innerHTML = '<i class="fas fa-save"></i> Mettre à jour';
    document.getElementById('btn-publier').onclick = sauvegarderSecteur;
    
    afficherMessage(`Édition du secteur: ${secteur.titre}`, 'info');
  };
  
  // Sauvegarder (créer ou mettre à jour)
  function sauvegarderSecteur() {
    // Collecter les données
    const secteur = collecterDonneesSecteur();
    
    if (!secteur) return;
    
    // Sauvegarder
    const success = window.SecteursAPI.saveSecteur(secteur);
    
    if (success) {
      afficherMessage(
        currentEditSlug ? 'Secteur mis à jour avec succès!' : 'Secteur publié avec succès!',
        'success'
      );
      
      // Réinitialiser le formulaire
      reinitialiserFormulaire();
      
      // Recharger la liste
      chargerListeSecteurs();
    } else {
      afficherMessage('Erreur lors de la sauvegarde', 'error');
    }
  }
  
  // Collecter les données du formulaire
  function collecterDonneesSecteur() {
    const titre = document.getElementById('ext_titre').value.trim();
    
    if (!titre) {
      afficherMessage('Le titre est obligatoire', 'error');
      return null;
    }
    
    // Utiliser le slug existant en édition, ou générer un nouveau
    const slug = currentEditSlug || window.SecteursAPI.generateSlug(titre);
    
    // Préparer les tableaux pour présentation
    const presentationText = document.getElementById('int_presentation').value.trim();
    const presentation = presentationText ? presentationText.split('\n\n').filter(p => p.trim()) : [];
    
    // Collecter les stats
    const stats = [];
    const statFields = document.querySelectorAll('.stat-field');
    statFields.forEach(field => {
      const iconInput = field.querySelector('input[name="stat_icon"]');
      const icon = iconInput ? iconInput.value : statIcons[0].value;
      const value = field.querySelector('input[name="stat_value"]')?.value.trim();
      const label = field.querySelector('input[name="stat_label"]')?.value.trim();
      
      if (value && label) {
        stats.push({
          icon: icon,
          value: value,
          label: label
        });
      }
    });
    
    // Collecter les compétences
    const skills = [];
    const skillFields = document.querySelectorAll('.skill-field');
    skillFields.forEach(field => {
      const iconInput = field.querySelector('input[name="skill_icon"]');
      const icon = iconInput ? iconInput.value : skillIcons[0].value;
      const label = field.querySelector('input[name="skill_label"]')?.value.trim();
      
      if (label) {
        skills.push({
          icon: icon,
          label: label
        });
      }
    });
    
    return {
      titre: titre,
      slug: slug,
      image: document.getElementById('ext_image').value.trim(),
      resume: document.getElementById('ext_resume').value.trim(),
      heroImage: document.getElementById('int_hero').value.trim(),
      presentation: presentation,
      video: document.getElementById('int_video').value.trim(),
      filieresCount: document.getElementById('filieres_count').value || '1',
      etabsCount: document.getElementById('etabs_count').value || '1',
      filieresIntro: document.getElementById('filieres_intro').value.trim(),
      stats: stats,
      skills: skills,
      brochureUrl: "#"
    };
  }
  
  // Réinitialiser le formulaire
  function reinitialiserFormulaire() {
    document.getElementById('ext_titre').value = '';
    document.getElementById('ext_image').value = '';
    document.getElementById('ext_resume').value = '';
    document.getElementById('int_hero').value = '';
    document.getElementById('int_presentation').value = '';
    document.getElementById('int_video').value = '';
    document.getElementById('filieres_count').value = '1';
    document.getElementById('etabs_count').value = '1';
    document.getElementById('filieres_intro').value = '';
    
    // Vider les stats et skills
    document.getElementById('stats-container').innerHTML = '';
    document.getElementById('skills-container').innerHTML = '';
    
    // Réinitialiser les compteurs
    statsCount = 0;
    skillsCount = 0;
    
    currentEditSlug = null;
    
    // Restaurer le bouton original
    document.getElementById('btn-publier').innerHTML = '<i class="fas fa-paper-plane"></i> Publier le secteur';
    document.getElementById('btn-publier').onclick = sauvegarderSecteur;
    
    // Ajouter un champ vide par défaut
    ajouterChampStat();
    ajouterChampCompetence();
    
    mettreAJourApercu();
  }
  
  // Supprimer un secteur
  window.supprimerSecteur = function(slug) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce secteur ?')) return;
    
    const success = window.SecteursAPI.deleteSecteur(slug);
    
    if (success) {
      afficherMessage('Secteur supprimé avec succès', 'success');
      chargerListeSecteurs();
      
      // Si on était en train d'éditer ce secteur, réinitialiser le formulaire
      if (currentEditSlug === slug) {
        reinitialiserFormulaire();
      }
    } else {
      afficherMessage('Erreur lors de la suppression', 'error');
    }
  };
  
  // Initialiser les événements
  document.getElementById('btn-publier').addEventListener('click', sauvegarderSecteur);
  document.getElementById('btn-annuler').addEventListener('click', reinitialiserFormulaire);
  document.getElementById('add-stat').addEventListener('click', () => ajouterChampStat());
  document.getElementById('add-skill').addEventListener('click', () => ajouterChampCompetence());
  
  // Écouter les changements pour l'aperçu
  const champsApercu = ['ext_titre', 'ext_image', 'ext_resume'];
  champsApercu.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', mettreAJourApercu);
    }
  });
  
  // Écouter les changements dans les champs de stats et skills
  document.addEventListener('input', function(e) {
    if (e.target.classList.contains('stat-input') || e.target.classList.contains('skill-input')) {
      mettreAJourApercu();
    }
  });
  
  // Charger initialement
  chargerListeSecteurs();
  mettreAJourApercu();
  
  // Ajouter un premier champ de stat et compétence par défaut
  ajouterChampStat();
  ajouterChampCompetence();
});