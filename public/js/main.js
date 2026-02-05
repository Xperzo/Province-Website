<script>
  function animateCounter(counter, target, duration = 2500) {
    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3); // effet plus naturel
      const value = Math.floor(start + (target - start) * easeOut);
      counter.textContent = `+${value.toLocaleString()}`;

      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // 🔹 Observer pour lancer une seule fois
  const statsSection = document.querySelector('.stats-section');
  const statCards = document.querySelectorAll('.stat-card');
  let animated = false;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !animated) {
      statCards.forEach(card => {
        const counter = card.querySelector('.stat-number');
        const target = +counter.getAttribute('data-target');
        animateCounter(counter, target);
        card.classList.add('visible');
      });
      animated = true;
    }
  }, { threshold: 0.4 });

  observer.observe(statsSection);
</script>