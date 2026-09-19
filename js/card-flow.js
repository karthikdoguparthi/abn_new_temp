(() => {
  const cards = document.querySelectorAll('.flow-card, .ab-service, .ip-deliverable, .solution-card, .ab-process article, .ip-directory a, .ip-next a, .ip-timeline li, .career-card, .careers-tech-grid article, .careers-approach-grid article, .hiring-steps li, .careers-values-grid article, .platform-card, .card, .value, .step, .cap, .life-card, .client');
  const motion = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  cards.forEach(card => {
    card.classList.add('flow-card');
    let frame = 0, x = 50, y = 50;
    card.addEventListener('pointermove', event => {
      if (!motion.matches) return;
      const rect = card.getBoundingClientRect();
      x = (event.clientX - rect.left) / rect.width * 100;
      y = (event.clientY - rect.top) / rect.height * 100;
      if (!frame) frame = requestAnimationFrame(() => {
        card.style.setProperty('--flow-x', `${x}%`);
        card.style.setProperty('--flow-y', `${y}%`);
        frame = 0;
      });
    }, {passive:true});
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame); frame = 0;
      card.style.removeProperty('--flow-x'); card.style.removeProperty('--flow-y');
    });
  });
})();
