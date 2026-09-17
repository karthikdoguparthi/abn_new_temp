/* Content stays visible if animation APIs are unavailable or scripts fail. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const selector = '.ab-service, .ip-deliverable, .solution-card, .ab-process article, .ip-directory a, .ip-next a, .ip-timeline li, .ab-section-heading, .ip-section > h2, .ip-split > div, .ip-faq details, .legal-section, .utility-page > *';
  const candidates = [...document.querySelectorAll('main ' + selector.split(', ').join(', main '))];
  const targets = candidates.filter(el => !candidates.some(parent => parent !== el && parent.contains(el)));
  let frame = 0, printing = false, lastTime = 0, initialized = false;
  const items = targets.map((el, index) => {
    const direction = (index + Math.floor(Math.random() * 3)) % 3;
    const distance = innerWidth < 768 ? 18 : 42;
    const from = direction === 0 ? `${-distance}px 0` : direction === 1 ? `${distance}px 0` : `0 ${distance * .7}px`;
    const animation = el.animate([{opacity:0, translate:from}, {opacity:1, translate:'0 0'}],
      {duration:1000, easing:'cubic-bezier(.4,0,.2,1)', fill:'both'});
    animation.pause();
    animation.currentTime = 1000;
    return {el, animation, top:0, progress:1};
  });
  function measure() {
    // Measure the unanimated layout to avoid movement feeding back into progress.
    items.forEach(item => { item.animation.currentTime = 1000; });
    items.forEach(item => { item.top = item.el.getBoundingClientRect().top + scrollY; });
    items.forEach(item => { item.animation.currentTime = item.progress * 1000; });
    if (!initialized) {
      initialized = true;
      items.forEach(item => { item.progress = targetProgress(item); item.animation.currentTime = item.progress * 1000; });
    }
    schedule();
  }
  function targetProgress({el, top}) {
    if (printing || reduced.matches || el.contains(document.activeElement)) return 1;
    const travel = Math.min(420, innerHeight * .5);
    return Math.max(0, Math.min(1, (scrollY + innerHeight - top) / travel));
  }
  function update(time) {
    frame = 0;
    const elapsed = lastTime ? Math.min(time - lastTime, 50) : 16;
    lastTime = time;
    let moving = false;
    items.forEach(item => {
      const target = targetProgress(item);
      const difference = target - item.progress;
      // A complete entrance takes at least 1.4 seconds, even after a fast scroll.
      const step = elapsed / 1400;
      const immediate = printing || reduced.matches || item.el.contains(document.activeElement);
      item.progress = immediate || Math.abs(difference) <= step ? target : item.progress + Math.sign(difference) * step;
      item.animation.currentTime = item.progress * 1000;
      if (item.progress !== target) moving = true;
    });
    if (moving) frame = requestAnimationFrame(update);
    else lastTime = 0;
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  document.addEventListener('focusin', schedule);
  document.addEventListener('focusout', schedule);
  reduced.addEventListener('change', schedule);
  window.addEventListener('beforeprint', () => { printing = true; items.forEach(item => { item.progress = 1; item.animation.currentTime = 1000; }); });
  window.addEventListener('afterprint', () => { printing = false; measure(); });
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.querySelector('main'));
  document.fonts?.ready.then(measure);
  measure();
})();
