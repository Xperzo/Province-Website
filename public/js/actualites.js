// === main.js (version corrigée à partir de ton code original) ===
// Ce fichier remplace la version précédente (coller intégralement)
// Il utilise localStorage (STORAGE_KEY, LOGIN_KEY) comme tu avais fait,
// ajoute upload via FileReader (dataURL) si l'utilisateur choisit un fichier,
// corrige l'affichage des images (object-fit cover) et le fallback pour la page détail.

const STORAGE_KEY = "actualitesList";
const LOGIN_KEY = "isLoggedIn";

function loadActualites() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Erreur chargement actualites:", e);
    return [];
  }
}

function saveActualites(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ----- LOGIN (localStorage fallback) -----
function checkLogin() {
  return localStorage.getItem(LOGIN_KEY) === "true";
}

function requireLogin() {
  // if not logged -> go to login
  if (!checkLogin()) {
    window.location.href = "login.html";
  }
}

// ----- INIT PAGES -----
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  // init image zoom always (safe)
  initImageZoom();

  if (page === "login") {
    initLoginPage();
  } else if (page === "admin") {
    // On admin : check login via localStorage (c'est ton flow actuel)
    if (!checkLogin()) {
      // si pas connecté -> redirige (on veut forcer le passage par login)
      window.location.href = "login.html";
      return;
    }
    initAdminPage();
  } else if (page === "public") {
    initPublicPage();
  } else if (page === "detail") {
    initDetailPage();
  }
});

// ----- PAGE LOGIN -----
function initLoginPage() {
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  if (!loginForm) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!username || !password) {
      loginError.textContent = "Nom d'utilisateur et mot de passe requis.";
      loginError.style.display = "block";
      return;
    }

    // Call secure API endpoint for authentication
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(r => r.json())
    .then(resp => {
      if (resp.ok && resp.token) {
        localStorage.setItem('auth_token', resp.token);
        localStorage.setItem(LOGIN_KEY, "true");
        setTimeout(() => {
          window.location.href = "admin.html";
        }, 100);
      } else {
        loginError.textContent = resp.error || "Identifiants invalides.";
        loginError.style.display = "block";
      }
    })
    .catch(err => {
      console.error('Login error:', err);
      loginError.textContent = "Erreur de connexion.";
      loginError.style.display = "block";
    });
  });
}

// ----- PAGE ADMIN -----
function initAdminPage() {
  const form = document.getElementById("actusForm");
  const resetBtn = document.getElementById("resetFormBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  renderAdminList();

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      saveActuFromForm();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      clearForm();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem(LOGIN_KEY);
      // ensure redirect
      setTimeout(() => window.location.href = "login.html", 50);
    });
  }
}

// Helper pour convertir File -> dataURL (utilisé si tu uploads localement)
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = (err) => reject(err);
    fr.readAsDataURL(file);
  });
}

async function saveActuFromForm() {
  try {
    const idField = document.getElementById("actusId");
    const titreField = document.getElementById("titre");
    const typeField = document.getElementById("typeActu");
    const resumeField = document.getElementById("resume");
    const contenuField = document.getElementById("contenu");
    const imageField = document.getElementById("imagePrincipale"); // url text
    const imageFileField = document.getElementById("imagePrincipaleFile"); // file input (optional)
    const mediasField = document.getElementById("medias"); // textarea urls
    const mediasFilesField = document.getElementById("galleryFiles"); // multiple files
    const dateField = document.getElementById("datePerso");

    const id = idField ? idField.value : "";
    const titre = titreField ? titreField.value.trim() : "";
    const typeActu = typeField ? typeField.value.trim() : "";
    const resume = resumeField ? resumeField.value.trim() : "";
    const contenu = contenuField ? contenuField.value.trim() : "";
    let imagePrincipale = imageField ? imageField.value.trim() : "";
    const datePerso = dateField && dateField.value ? dateField.value : null;

    if (!titre || !typeActu || !resume || !contenu) {
      alert("Veuillez remplir tous les champs obligatoires (Titre, Type, Résumé, Contenu).");
      return;
    }

    // If a main image file is selected, convert to dataURL and use it (keeps working offline/local)
    if (imageFileField && imageFileField.files && imageFileField.files.length > 0) {
      try {
        imagePrincipale = await fileToDataURL(imageFileField.files[0]);
      } catch (e) {
        console.warn("Erreur conversion image principale:", e);
      }
    }

    // medias: combine textarea urls + uploaded files (dataURLs)
    let mediasLines = [];
    if (mediasField && mediasField.value) {
      mediasLines = mediasField.value.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    }

    if (mediasFilesField && mediasFilesField.files && mediasFilesField.files.length > 0) {
      const fList = Array.from(mediasFilesField.files);
      for (let f of fList) {
        try {
          const dataUrl = await fileToDataURL(f);
          mediasLines.push(dataUrl);
        } catch (e) {
          console.warn("Erreur conversion media file:", e);
        }
      }
    }

    let list = loadActualites();

    if (id) {
      // Mise à jour
      const index = list.findIndex((a) => a.id === id);
      if (index !== -1) {
        list[index] = {
          ...list[index],
          titre,
          typeActu,
          resume,
          contenu,
          imagePrincipale,
          medias: mediasLines,
          datePerso,
          updatedAt: new Date().toISOString(),
        };
      }
    } else {
      // Nouvelle actualité
      const newActu = {
        id: Date.now().toString(),
        titre,
        typeActu,
        resume,
        contenu,
        imagePrincipale,
        medias: mediasLines,
        datePerso,
        createdAt: new Date().toISOString(),
      };
      // push newest at front (keep latest first)
      list.unshift(newActu);
    }

    // keep only latest 6 (règle demande)
    list = list.slice(0, 6);

    saveActualites(list);
    clearForm();
    renderAdminList();
    // also refresh public grid if present
    if (typeof renderPublicGrid === "function") try { renderPublicGrid(); } catch(e){}
    alert("Actualité enregistrée.");
  } catch (err) {
    console.error("Erreur saveActuFromForm:", err);
    alert("Erreur lors de l'enregistrement : " + (err && err.message ? err.message : err));
  }
}

function clearForm() {
  const safeGet = id => document.getElementById(id);
  if (safeGet("actusId")) safeGet("actusId").value = "";
  if (safeGet("titre")) safeGet("titre").value = "";
  if (safeGet("typeActu")) safeGet("typeActu").value = "";
  if (safeGet("resume")) safeGet("resume").value = "";
  if (safeGet("contenu")) safeGet("contenu").value = "";
  if (safeGet("imagePrincipale")) safeGet("imagePrincipale").value = "";
  if (safeGet("imagePrincipaleFile")) safeGet("imagePrincipaleFile").value = "";
  if (safeGet("medias")) safeGet("medias").value = "";
  if (safeGet("galleryFiles")) safeGet("galleryFiles").value = "";
  const dateField = document.getElementById("datePerso");
  if (dateField) dateField.value = "";
  const formTitle = document.getElementById("formTitle");
  if (formTitle) formTitle.textContent = "Ajouter une actualité";
  // clear previews if any
  const mp = document.getElementById("mainPreview"); if (mp) mp.innerHTML = "";
  const gp = document.getElementById("galleryPreview"); if (gp) gp.innerHTML = "";
}

function renderAdminList() {
  const container = document.getElementById("actusList");
  const emptyMsg = document.getElementById("noActusAdmin");
  if (!container) return;
  const list = loadActualites().sort((a, b) => {
    const da = a.createdAt || a.updatedAt;
    const db = b.createdAt || b.updatedAt;
    return new Date(db) - new Date(da);
  });

  container.innerHTML = "";

  if (list.length === 0) {
    if (emptyMsg) emptyMsg.style.display = "block";
    return;
  }

  if (emptyMsg) emptyMsg.style.display = "none";

  list.forEach((actu) => {
    const item = document.createElement("div");
    item.className = "admin-item";

    const main = document.createElement("div");
    main.className = "admin-item-main";

    const title = document.createElement("div");
    title.className = "admin-item-title";
    title.textContent = actu.titre;

    const meta = document.createElement("div");
    meta.className = "admin-item-meta";
    let dateLabel = "";
    if (actu.datePerso) {
      dateLabel = new Date(actu.datePerso).toLocaleDateString();
    } else if (actu.updatedAt) {
      dateLabel = new Date(actu.updatedAt).toLocaleString();
    } else if (actu.createdAt) {
      dateLabel = new Date(actu.createdAt).toLocaleString();
    }
    meta.textContent = `${actu.typeActu || "Type non défini"} • ${dateLabel}`;

    main.appendChild(title);
    main.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "admin-item-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "btn secondary-btn";
    editBtn.textContent = "Modifier";
    editBtn.addEventListener("click", () => fillFormForEdit(actu.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn danger-btn";
    deleteBtn.textContent = "Supprimer";
    deleteBtn.addEventListener("click", () => deleteActu(actu.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(main);
    item.appendChild(actions);

    container.appendChild(item);
  });
}

function fillFormForEdit(id) {
  const list = loadActualites();
  const actu = list.find((a) => a.id === id);
  if (!actu) return;

  const safe = id => document.getElementById(id);
  if (safe("actusId")) safe("actusId").value = actu.id;
  if (safe("titre")) safe("titre").value = actu.titre;
  if (safe("typeActu")) safe("typeActu").value = actu.typeActu || "";
  if (safe("resume")) safe("resume").value = actu.resume || "";
  if (safe("contenu")) safe("contenu").value = actu.contenu || "";
  if (safe("imagePrincipale")) safe("imagePrincipale").value = actu.imagePrincipale || "";
  if (safe("medias")) safe("medias").value = (actu.medias || []).join("\n");

  const dateField = document.getElementById("datePerso");
  if (dateField) {
    if (actu.datePerso) {
      dateField.value = actu.datePerso.slice(0, 10);
    } else if (actu.createdAt) {
      dateField.value = actu.createdAt.slice(0, 10);
    } else {
      dateField.value = "";
    }
  }

  const formTitle = document.getElementById("formTitle");
  if (formTitle) formTitle.textContent = "Modifier l'actualité";

  // show previews for images if present
  const mp = document.getElementById("mainPreview");
  if (mp) {
    mp.innerHTML = "";
    if (actu.imagePrincipale) {
      const img = document.createElement("img");
      img.src = actu.imagePrincipale;
      img.style.maxWidth = "220px";
      img.style.maxHeight = "140px";
      img.style.objectFit = "cover";
      mp.appendChild(img);
    }
  }
  const gp = document.getElementById("galleryPreview");
  if (gp) {
    gp.innerHTML = "";
    (actu.medias || []).forEach(m => {
      const el = document.createElement(/\.(mp4|webm|ogg)$/i.test(m) ? "video" : "img");
      el.src = m;
      el.style.maxWidth = "120px";
      el.style.marginRight = "8px";
      if (el.tagName.toLowerCase() === "video") el.controls = true;
      else el.style.height = "80px";
      gp.appendChild(el);
    });
  }
}

function deleteActu(id) {
  if (!confirm("Voulez-vous vraiment supprimer cette actualité ?")) return;
  let list = loadActualites();
  list = list.filter((a) => a.id !== id);
  saveActualites(list);
  renderAdminList();
  if (typeof renderPublicGrid === "function") try { renderPublicGrid(); } catch(e){}
}

// ----- PAGE PUBLIQUE -----
function initPublicPage() {
  renderPublicGrid();
  initModalEvents();
}

function renderPublicGrid() {
  const grid = document.getElementById("actusGrid") || document.getElementById("newsList") || document.getElementById("newsContainer");
  const emptyMsg = document.getElementById("noActusPublic");
  const list = loadActualites().sort((a, b) => {
    const da = a.createdAt || a.updatedAt;
    const db = b.createdAt || b.updatedAt;
    return new Date(db) - new Date(da);
  });

  if (!grid) return;
  grid.innerHTML = "";

  if (list.length === 0) {
    if (emptyMsg) emptyMsg.style.display = "block";
    return;
  }

  if (emptyMsg) emptyMsg.style.display = "none";

  list.forEach((actu) => {
    const card = document.createElement("article");
    card.className = "actus-card";
    card.dataset.id = actu.id;

    // ---- IMAGE EN TÊTE DE CARTE ----
    const bg = document.createElement("div");
    bg.className = "actus-card-bg";

    const img = document.createElement("img");
    img.className = "actus-card-img";
    // fallback logic : accepte dataURL, relative /uploads urls, http(s)
    if (actu.imagePrincipale && (actu.imagePrincipale.startsWith("data:") || actu.imagePrincipale.startsWith("/") || actu.imagePrincipale.startsWith("http"))) {
      img.src = actu.imagePrincipale;
    } else if (actu.imagePrincipale) {
      // might be a local file path stored by mistake (C:\...). can't load -> use placeholder or medias first image
      const firstImg = (actu.medias || []).find(m => /\.(jpe?g|png|gif|webp|svg)$/i.test(m));
      if (firstImg) img.src = firstImg;
      else img.src = "https://via.placeholder.com/1200x340/1d4ed8/ffffff?text=Actualit%C3%A9";
    } else {
      // no main image -> try media
      const firstImg2 = (actu.medias || []).find(m => /\.(jpe?g|png|gif|webp|svg)$/i.test(m));
      if (firstImg2) img.src = firstImg2;
      else img.src = "https://via.placeholder.com/1200x340/1d4ed8/ffffff?text=Actualit%C3%A9";
    }
    img.alt = "Image actualité";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";

    bg.appendChild(img);

    // ---- CONTENU TEXTE ----
    const overlay = document.createElement("div");
    overlay.className = "actus-card-overlay";

    const content = document.createElement("div");
    content.className = "actus-card-content";

    const top = document.createElement("div");
    top.className = "actus-meta-top";

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = actu.typeActu || "Actualité";

    const dateSpan = document.createElement("span");
    dateSpan.className = "actus-date";
    let date;
    if (actu.datePerso) {
      date = new Date(actu.datePerso).toLocaleDateString();
    } else if (actu.createdAt || actu.updatedAt) {
      const baseDate = actu.createdAt || actu.updatedAt;
      date = new Date(baseDate).toLocaleDateString();
    } else {
      date = "";
    }
    dateSpan.textContent = date;

    top.appendChild(badge);
    top.appendChild(dateSpan);

    const title = document.createElement("h2");
    title.className = "actus-title";
    title.textContent = actu.titre || actu.title || "";

    const resumeEl = document.createElement("p");
    resumeEl.className = "actus-resume";
    resumeEl.textContent = actu.resume || actu.summary || "";

    // build detail url
    const slug = generateActuSlug(actu);
    const detailUrl = `actualite.html?id=${encodeURIComponent(actu.id)}&slug=${encodeURIComponent(slug)}`;

    const footerRow = document.createElement("div");
    footerRow.className = "actus-card-footer";

    const bottomTag = document.createElement("div");
    bottomTag.className = "actus-tag-bottom";
    bottomTag.textContent = "Actualité détaillée";

    const readBtn = document.createElement("button");
    readBtn.className = "actus-read-btn";
    readBtn.type = "button";
    readBtn.textContent = "Lire plus";
    readBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.location.href = detailUrl;
    });

    footerRow.appendChild(bottomTag);
    footerRow.appendChild(readBtn);

    content.appendChild(top);
    content.appendChild(title);
    content.appendChild(resumeEl);
    content.appendChild(footerRow);

    card.appendChild(bg);
    card.appendChild(overlay);
    card.appendChild(content);

    grid.appendChild(card);
  });
}

// ----- MODAL PUBLIQUE -----
function initModalEvents() {
  const modal = document.getElementById("actusModal");
  if (!modal) return;

  const closeBtn = document.getElementById("closeModalBtn");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeActuModal);
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeActuModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeActuModal();
    }
  });
}

function openActuModal(id) {
  const list = loadActualites();
  const actu = list.find((a) => a.id === id);
  if (!actu) return;

  const modal = document.getElementById("actusModal");
  const modalImage = document.getElementById("modalImage");
  const modalType = document.getElementById("modalType");
  const modalDate = document.getElementById("modalDate");
  const modalTitle = document.getElementById("modalTitle");
  const modalResume = document.getElementById("modalResume");
  const modalContenu = document.getElementById("modalContenu");
  const modalMedias = document.getElementById("modalMedias");

  if (modalImage) {
    if (actu.imagePrincipale) modalImage.src = actu.imagePrincipale;
    else {
      const firstImg = (actu.medias || []).find(m => /\.(jpe?g|png|gif|webp|svg)$/i.test(m));
      modalImage.src = firstImg || "https://via.placeholder.com/900x280/1d4ed8/ffffff?text=Actualit%C3%A9";
    }
    modalImage.setAttribute("data-zoomable", "true");
  }

  if (modalType) modalType.textContent = actu.typeActu || "Actualité";

  let modalDateLabel = "";
  if (actu.datePerso) {
    modalDateLabel = new Date(actu.datePerso).toLocaleDateString();
  } else if (actu.createdAt || actu.updatedAt) {
    modalDateLabel = new Date(actu.createdAt || actu.updatedAt).toLocaleString();
  }
  if (modalDate) modalDate.textContent = modalDateLabel;
  if (modalTitle) modalTitle.textContent = actu.titre;
  if (modalResume) modalResume.textContent = actu.resume;
  if (modalContenu) modalContenu.textContent = actu.contenu;

  if (modalMedias) {
    modalMedias.innerHTML = "";
    renderMediaGallery(modalMedias, actu.medias || []);
  }

  if (modal) modal.style.display = "flex";
}

function closeActuModal() {
  const modal = document.getElementById("actusModal");
  if (modal) {
    modal.style.display = "none";
  }
}

// ----- PAGE DÉTAIL (slug) -----
// === Remplacer la fonction initDetailPage actuelle par celle-ci ===
function initDetailPage() {
  const idParam = getQueryParam("id");
  const slugParam = getQueryParam("slug");
  const notFound = document.getElementById("detailNotFound");

  const list = loadActualites();

  // recherche prioritaire par id
  let actu = null;
  if (idParam) {
    actu = list.find((a) => a.id === idParam);
  }

  // fallback : si pas d'id ou introuvable, chercher par slug (généré depuis le titre)
  if (!actu && slugParam) {
    const slugNormalized = decodeURIComponent(slugParam).toString().toLowerCase();
    actu = list.find((a) => {
      try {
        const s = generateActuSlug(a);
        return s === slugNormalized;
      } catch (e) {
        return false;
      }
    });
  }

  if (!actu) {
    if (notFound) notFound.style.display = "block";
    return;
  }

  // éléments DOM
  const imageEl = document.getElementById("detailImage");
  const typeEl = document.getElementById("detailType");
  const dateEl = document.getElementById("detailDate");
  const titleEl = document.getElementById("detailTitle");
  const resumeEl = document.getElementById("detailResume");
  const contenuEl = document.getElementById("detailContenu");
  const mediasEl = document.getElementById("detailMedias");

  // Règle d'affichage de l'image principale : preferer imagePrincipale, sinon première image de medias, sinon placeholder
  if (imageEl) {
    if (actu.imagePrincipale && (actu.imagePrincipale.startsWith("data:") || actu.imagePrincipale.startsWith("/") || actu.imagePrincipale.startsWith("http"))) {
      imageEl.src = actu.imagePrincipale;
    } else {
      const firstImg = (actu.medias || []).find(m => /\.(jpe?g|png|gif|webp|svg)$/i.test(m));
      imageEl.src = firstImg || "https://via.placeholder.com/1200x340/1d4ed8/ffffff?text=Actualit%C3%A9";
    }
    imageEl.setAttribute("data-zoomable", "true");
    imageEl.style.width = "100%";
    imageEl.style.height = "auto";
    imageEl.style.objectFit = "cover";
  }

  if (typeEl) typeEl.textContent = actu.typeActu || "Actualité";
  if (dateEl) {
    let detailDateLabel = "";
    if (actu.datePerso) detailDateLabel = new Date(actu.datePerso).toLocaleDateString();
    else if (actu.createdAt || actu.updatedAt) detailDateLabel = new Date(actu.createdAt || actu.updatedAt).toLocaleString();
    dateEl.textContent = detailDateLabel;
  }
  if (titleEl) titleEl.textContent = actu.titre || "";
  if (resumeEl) resumeEl.textContent = actu.resume || "";
  if (contenuEl) contenuEl.textContent = actu.contenu || "";

  if (mediasEl) {
    mediasEl.innerHTML = "";
    renderMediaGallery(mediasEl, actu.medias || []);
  }

  if (notFound) notFound.style.display = "none";
}

  // MAIN IMAGE: prefer imagePrincipale (dataURL or /uploads/... or http), else first media image
  if (imageEl) {
    if (actu.imagePrincipale && (actu.imagePrincipale.startsWith("data:") || actu.imagePrincipale.startsWith("/") || actu.imagePrincipale.startsWith("http"))) {
      imageEl.src = actu.imagePrincipale;
    } else {
      const firstImg = (actu.medias || []).find(m => /\.(jpe?g|png|gif|webp|svg)$/i.test(m));
      imageEl.src = firstImg || "https://via.placeholder.com/1200x340/1d4ed8/ffffff?text=Actualit%C3%A9";
    }
    imageEl.setAttribute("data-zoomable", "true");
    imageEl.style.width = "100%";
    imageEl.style.height = "auto";
    imageEl.style.objectFit = "cover";
  }

  if (typeEl) typeEl.textContent = actu.typeActu || "Actualité";
  if (dateEl) {
    let detailDateLabel = "";
    if (actu.datePerso) detailDateLabel = new Date(actu.datePerso).toLocaleDateString();
    else if (actu.createdAt || actu.updatedAt) detailDateLabel = new Date(actu.createdAt || actu.updatedAt).toLocaleString();
    dateEl.textContent = detailDateLabel;
  }
  if (titleEl) titleEl.textContent = actu.titre;
  if (resumeEl) resumeEl.textContent = actu.resume;
  if (contenuEl) contenuEl.textContent = actu.contenu;

  if (mediasEl) {
    mediasEl.innerHTML = "";
    renderMediaGallery(mediasEl, actu.medias || []);
  }

  if (notFound) notFound.style.display = "none";

// ----- HELPERS SLUG + QUERY -----
function generateActuSlug(actu) {
  const base = (actu.titre || actu.title || "actualite").toString().toLowerCase();

  const normalized = base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalized
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildDetailUrl(actu) {
  const slug = generateActuSlug(actu);
  return `actualite.html?id=${encodeURIComponent(actu.id)}&slug=${slug}`;
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// ----- HELPERS MÉDIAS (galerie) -----
function renderMediaGallery(container, medias) {
  (medias || []).forEach((url) => {
    const wrapper = document.createElement("div");
    wrapper.className = "gallery-item";

    if (isImageUrl(url)) {
      const img = document.createElement("img");
      img.src = url;
      img.alt = "Image actualité";
      img.setAttribute("data-zoomable", "true");
      img.className = "gallery-img";
      img.style.objectFit = "cover";
      wrapper.appendChild(img);
    } else if (isVideoUrl(url)) {
      const video = document.createElement("video");
      video.src = url;
      video.controls = true;
      video.style.maxWidth = "320px";
      wrapper.appendChild(video);
    } else if (isYouTubeUrl(url)) {
      const iframe = document.createElement("iframe");
      iframe.src = convertToYouTubeEmbed(url);
      iframe.allowFullscreen = true;
      iframe.frameBorder = "0";
      iframe.width = "560";
      iframe.height = "315";
      wrapper.appendChild(iframe);
    } else {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.textContent = url;
      wrapper.appendChild(link);
    }

    container.appendChild(wrapper);
  });
}

// Helpers détection type de média
function isImageUrl(url) {
  return /\.(jpe?g|png|gif|webp|svg)$/i.test(url) || (url && url.startsWith("data:image/"));
}

function isVideoUrl(url) {
  return /\.(mp4|webm|ogg)$/i.test(url) || (url && url.startsWith("data:video/"));
}

function isYouTubeUrl(url) {
  return /youtube\.com\/watch\?v=|youtu\.be\//i.test(url);
}

function convertToYouTubeEmbed(url) {
  const reg = /(?:v=|\/)([0-9A-Za-z_-]{11})/;
  const match = url.match(reg);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

// ----- IMAGE ZOOM (LIGHTBOX PLEIN ÉCRAN) -----
function initImageZoom() {
  let overlay = document.getElementById("imageZoomOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "imageZoomOverlay";
    overlay.className = "image-zoom-overlay";
    overlay.innerHTML = '<img class="image-zoom-img" alt="Zoom image">';
    overlay.addEventListener("click", () => {
      overlay.classList.remove("visible");
      document.body.classList.remove("no-scroll");
    });
    document.body.appendChild(overlay);
  }

  const zoomImg = overlay.querySelector(".image-zoom-img");

  document.addEventListener("click", function (e) {
    const target = e.target;
    if (target && target.matches("[data-zoomable]")) {
      const src = target.getAttribute("src");
      if (!src) return;
      zoomImg.src = src;
      overlay.classList.add("visible");
      document.body.classList.add("no-scroll");
    }
  });
}
