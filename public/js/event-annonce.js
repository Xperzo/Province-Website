// ===============================
// 1. Compteur pour les stats
// ===============================
function animateStatNumber(el, target, duration) {
  let start = 0;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const ratio = Math.min(progress / duration, 1);
    const value = Math.floor(start + (target - start) * ratio);
    el.textContent = value;

    if (ratio < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// Lance les stats uniquement la première fois
function runSlideStats(slide) {
  if (!slide || slide.dataset.statsDone === "1") return;

  const numbers = slide.querySelectorAll(".event-stat-number");
  numbers.forEach(el => {
    const target = parseInt(el.getAttribute("data-target"), 10) || 0;
    animateStatNumber(el, target, 1200);
  });

  slide.dataset.statsDone = "1";
}

// ===============================
// 2. Auto-scroll horizontal des galeries
// ===============================
function initEventGalleryAutoScroll(track) {
  const slidesCount = track.children.length;
  if (slidesCount <= 1) return;

  let index = 0;

  setInterval(() => {
    index++;
    if (index >= slidesCount) index = 0;

    const nextPos = index * track.clientWidth;
    track.scrollTo({ left: nextPos, behavior: "smooth" });
  }, 3500);
}

// ===============================
// 3. Zoom image plein écran
// ===============================
function initEventGalleryZoom(root) {
  const overlay = document.getElementById("eventGalleryOverlay");
  const overlayImg = document.getElementById("eventGalleryOverlayImg");
  const images = root.querySelectorAll(".event-gallery-item");

  if (!overlay || !overlayImg) return;

  images.forEach(img => {
    img.addEventListener("click", () => {
      overlayImg.src = img.src;
      overlay.classList.add("visible");
      document.body.classList.add("no-scroll");
    });
  });

  overlay.addEventListener("click", () => {
    overlay.classList.remove("visible");
    document.body.classList.remove("no-scroll");
    overlayImg.src = "";
  });
}

// ===============================
// 4. Slider manuel + auto toutes les 6s
// ===============================
function initEventAnnouncesSlider(wrapper) {
  const slides = wrapper.querySelectorAll(".event-annonce-premium");
  const dots = wrapper.querySelectorAll(".event-dot");
  if (slides.length <= 1) return;

  let current = 0;
  let autoTimer = null;

  function goToSlide(index) {
    current = index;

    slides.forEach((slide, i) =>
      slide.classList.toggle("is-active", i === index)
    );
    dots.forEach((dot, i) =>
      dot.classList.toggle("is-active", i === index)
    );

    runSlideStats(slides[index]);
  }

  // Navigation par clic
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.dataset.index, 10) || 0;
      goToSlide(index);

      // Reset du timer après clic
      restartAutoSlide();
    });
  });

  // Auto-scroll toutes les 6 secondes
  function startAutoSlide() {
    autoTimer = setInterval(() => {
      const next = (current + 1) % slides.length;
      goToSlide(next);
    }, 6000);
  }

  function restartAutoSlide() {
    clearInterval(autoTimer);
    startAutoSlide();
  }

  // Init
  goToSlide(0);
  startAutoSlide();
}

// ===============================
// 5. Initialisation générale
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".event-annonces-wrapper");
  if (!wrapper) return;

  wrapper.querySelectorAll(".event-gallery-track").forEach(track =>
    initEventGalleryAutoScroll(track)
  );

  initEventGalleryZoom(wrapper);
  initEventAnnouncesSlider(wrapper);
});
