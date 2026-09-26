document.addEventListener('DOMContentLoaded', () => {
  const timeline = document.querySelector('.ab-new #journey .timeline');
  if (!timeline) return;

  const milestones = [
    ['2002', 'A practical technology foundation', 'Active Brains began with a clear focus: helping organisations make technology decisions that support day-to-day business needs.'],
    ['2006', 'Broadening delivery capability', 'Our work grew across software, web solutions, data and IT services, giving clients a broader base of practical technology support.'],
    ['2011', 'Connecting business and technology', 'We strengthened our consulting and architecture capability to help clients align systems, processes and people more effectively.'],
    ['2016', 'Enterprise platforms and integration', 'Our delivery expanded across business applications, cloud platforms and integration, with a continued focus on reliable implementation.'],
    ['2021', 'Data, cloud and intelligent automation', 'We developed further capability in enterprise data, AI-assisted workflows and automation to help organisations modernise with confidence.'],
    ['2026', 'Present and progressing', 'Today, Active Brains brings business understanding, architecture and engineering together to create practical solutions that can evolve with the organisation.']
  ];

  timeline.innerHTML = milestones.map(([year, title, copy]) => `
    <article class="event ab-timeline-event">
      <div class="ab-timeline-year"><span class="year">${year}</span></div>
      <div class="card"><h3>${title}</h3><p>${copy}</p></div>
      <i class="dot" aria-hidden="true"></i>
    </article>`).join('');

  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting || target.dataset.revealed) return;
      target.dataset.revealed = 'true';
      const direction = [...timeline.children].indexOf(target) % 2 === 0 ? '-42px' : '42px';
      target.animate(
        [{ opacity: 0, translate: `${direction} 22px` }, { opacity: 1, translate: '0 0' }],
        { duration: 850, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both' }
      );
      observer.unobserve(target);
    });
  }, { threshold: 0.18 });

  [...timeline.children].forEach((event) => observer.observe(event));
});
