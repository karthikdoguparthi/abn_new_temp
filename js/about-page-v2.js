document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main-content');
  if (!main) return;

  const milestones = [
    ['2002', 'The company begins', 'Active Brains was established to help organisations make technology choices that are practical, understandable and grounded in the realities of the business.'],
    ['Early years', 'Building a delivery foundation', 'Our work expanded across software, web, data and IT services, creating a broad foundation for reliable technology delivery.'],
    ['Expansion', 'Connecting strategy and implementation', 'We grew our capability across business applications, architecture, integration and consulting so that technology could be considered in its full operational context.'],
    ['Global delivery', 'Experience across markets', 'We have worked with organisations and partners across the UK, Europe and wider markets, adapting our approach to different teams, sectors and ways of working.'],
    ['Today', 'Business, data, cloud and AI', 'Today we bring business understanding, solution design and engineering together to modernise platforms, improve decisions and automate meaningful work.'],
    ['Present', 'Ready for what comes next', 'We continue to invest in people, partnerships and evolving technology while keeping every solution accountable to a useful business outcome.']
  ];

  const values = [
    ['01', 'Learning and sharing', 'We learn from experience, exchange knowledge openly and make time for the questions that improve the work.'],
    ['02', 'Integrity', 'We communicate clearly, make trade-offs visible and take responsibility for the advice we give.'],
    ['03', 'Leading change', 'We challenge assumptions thoughtfully and apply technology where it creates genuine value.'],
    ['04', 'Excellence', 'We care about the quality of our thinking, engineering and delivery, from first conversation to ongoing support.'],
    ['05', 'Respect for the individual', 'We value the people behind every process, project and decision.']
  ];

  const approach = [
    ['01', 'Understand', 'Listen to the people, processes and constraints behind the requirement.'],
    ['02', 'Shape', 'Define the opportunity, architecture and a practical route forward.'],
    ['03', 'Build', 'Design, develop, integrate and implement with clear ownership.'],
    ['04', 'Improve', 'Support, optimise and evolve the solution as the organisation changes.']
  ];

  const capabilities = ['Business understanding', 'Solution architecture', 'Business applications', 'Data and analytics', 'Cloud platforms', 'AI and automation', 'Integration'];

  main.innerHTML = `
    <div class="about-v2">
      <section class="about-hero" id="top">
        <div class="container about-reveal">
          <nav class="ip-breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><span>About Active Brains</span></nav>
          <p class="ab-eyebrow">ABOUT ACTIVE BRAINS</p>
          <h1>Technology built around <em>your business.</em></h1>
          <p class="about-lead">Active Brains brings business thinking, architecture and engineering into one practical conversation, helping organisations make confident progress with technology.</p>
          <div class="about-actions"><a class="btn btn-primary" href="#journey">Explore our story <span>→</span></a><a class="about-text-link" data-contact-open href="#contact-dialog">Start a conversation</a></div>
          <p class="about-hero-meta">Established 2002 <span>•</span> UK and European delivery <span>•</span> Built for practical outcomes</p>
        </div>
      </section>

      <nav class="about-jump container" aria-label="On this page"><a href="#who">Who we are</a><a href="#journey">Our journey</a><a href="#approach">Our approach</a><a href="#life">Life at Active Brains</a></nav>

      <section class="about-section about-who" id="who"><div class="container about-two-column"><div class="about-reveal"><p class="ab-eyebrow">WHO WE ARE</p><h2>Built on experience.<br/>Focused on what is next.</h2></div><div class="about-reveal"><p>Active Brains is a technology company established in 2002. We work across business applications, enterprise data, cloud platforms and intelligent automation to help organisations improve the way they operate.</p><p>Our starting point is always the same: understand the business, the people who do the work and the decisions that matter. From there, we bring together the disciplines needed to create a solution that is useful now and maintainable for the future.</p></div></div></section>

      <section class="about-journey" id="journey"><div class="container"><div class="about-section-heading about-reveal"><p class="ab-eyebrow">OUR JOURNEY</p><span class="about-kicker">2002 to present</span><h2>Growing with the work<br/>and the technology.</h2><p>More than two decades of learning, delivery and evolution, always guided by practical business needs.</p></div><div class="about-timeline-v2">${milestones.map(([year,title,copy], index) => `<article class="about-milestone about-reveal ${index % 2 ? 'is-right' : 'is-left'}"><div class="about-milestone-card"><h3>${title}</h3><p>${copy}</p></div><div class="about-milestone-marker"><span>${year}</span><i aria-hidden="true"></i></div></article>`).join('')}</div></div></section>

      <section class="about-purpose"><div class="container about-reveal"><p class="ab-eyebrow">OUR PURPOSE</p><h2>To make technology useful.</h2><p>We believe technology should make organisations more connected, informed and capable. It should help people spend less time working around systems and more time creating value.</p></div></section>

      <section class="about-section" id="values"><div class="container"><div class="about-section-heading about-reveal"><p class="ab-eyebrow">CORE VALUES</p><h2>How we work matters as much as what we deliver.</h2></div><div class="about-values-grid">${values.map(([number,title,copy]) => `<article class="about-value about-reveal"><span>${number}</span><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div></div></section>

      <section class="about-approach" id="approach"><div class="container"><div class="about-section-heading about-reveal"><p class="ab-eyebrow">OUR APPROACH</p><h2>Start with the problem.<br/>Build towards the outcome.</h2><p>Clear stages give teams the confidence to make progress without losing sight of the business context.</p></div><div class="about-steps">${approach.map(([number,title,copy]) => `<article class="about-step about-reveal"><span>${number}</span><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div></div></section>

      <section class="about-section about-capabilities" id="what-we-bring"><div class="container"><div class="about-section-heading about-reveal"><p class="ab-eyebrow">WHAT WE BRING</p><h2>One team. Multiple disciplines.<br/>One business goal.</h2></div><div class="about-capability-grid">${capabilities.map((item, index) => `<article class="about-capability about-reveal"><span>0${index + 1}</span><h3>${item}</h3></article>`).join('')}</div></div></section>

      <section class="about-expect"><div class="container about-expect-grid"><div class="about-reveal"><p class="ab-eyebrow">WHAT CLIENTS CAN EXPECT</p><h2>A technology partner that understands the work behind the technology.</h2><p>We keep the important decisions clear, the delivery practical and the next step visible.</p></div><div class="about-expect-list">${[['Clear thinking','Complex technology decisions explained in language that supports confident action.'],['Practical solutions','Recommendations shaped around the operating reality, not a product checklist.'],['Experienced delivery','Business and technical expertise working together through the work.'],['Open communication','Direct conversations, clear assumptions and honest progress updates.'],['Long-term thinking','Solutions designed to be supported, improved and understood by the next team.']].map(([title,copy]) => `<article class="about-reveal"><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div></div></section>

      <section class="about-section" id="life"><div class="container"><div class="about-section-heading about-reveal"><p class="ab-eyebrow">LIFE AT ACTIVE BRAINS</p><h2>Good technology starts<br/>with good people.</h2><p>We are building an environment for curious, practical people who enjoy solving problems and sharing what they learn.</p></div><div class="about-life-grid"><article class="about-reveal"><span>01</span><h3>Learn</h3><p>Build knowledge through real project work and shared experience.</p></article><article class="about-reveal"><span>02</span><h3>Create</h3><p>Turn thoughtful ideas into solutions that help clients move forward.</p></article><article class="about-reveal"><span>03</span><h3>Collaborate</h3><p>Work openly across disciplines, clients and technology partners.</p></article><article class="about-reveal"><span>04</span><h3>Grow</h3><p>Develop your career with responsibility, support and continuous learning.</p></article></div><a class="btn btn-primary about-reveal" href="careers.html">Explore careers <span>→</span></a></div></section>

      <section class="about-sustain"><div class="container about-two-column"><div class="about-reveal"><p class="ab-eyebrow">SUSTAINABILITY</p><h2>Technology with a wider responsibility.</h2></div><div class="about-reveal"><p>We consider efficiency, accessibility, responsible data and AI use, maintainability and the people who depend on the systems we create. Good technology should create value without creating unnecessary complexity or waste.</p></div></div></section>

      <section class="about-launchpad"><div class="container about-launchpad-grid"><div class="about-reveal"><p class="ab-eyebrow">AB LAUNCH PAD</p><h2>Give valuable ideas room to develop.</h2><p>AB Launch Pad provides a structured way to explore an early concept before committing to a full programme of delivery.</p><a class="btn btn-primary" href="launchpad.html">Explore AB Launch Pad <span>→</span></a></div><div class="about-launchpad-benefits about-reveal"><article><span>01</span><h3>Clarify the opportunity</h3><p>Connect the idea to a business problem, users and practical constraints.</p></article><article><span>02</span><h3>Test the direction</h3><p>Use prototypes, research or technical exploration to reduce uncertainty.</p></article><article><span>03</span><h3>Choose the next step</h3><p>Leave with evidence for a focused pilot, a delivery plan or a better question.</p></article></div></div></section>

      <section class="about-section about-graduate"><div class="container about-two-column"><div class="about-reveal"><p class="ab-eyebrow">GRADUATE PROGRAMME</p><h2>A considered start in technology.</h2></div><div class="about-reveal"><p>Our graduate programme is being shaped for people who want to build practical expertise alongside experienced colleagues. It will combine structured learning, meaningful project contribution and exposure to business, data, cloud and automation work.</p><p class="about-small">Interested in future opportunities? <a href="careers.html">Explore careers</a> or introduce yourself to our team.</p></div></div></section>

      <section class="about-ecosystem"><div class="container"><div class="about-section-heading about-reveal"><p class="ab-eyebrow">OUR ECOSYSTEM</p><h2>Progress is stronger<br/>when expertise connects.</h2></div><div class="about-ecosystem-grid">${[['Clients','The organisations whose challenges give the work its purpose.'],['Partners','Technology and delivery partners who extend the value we can create.'],['Talent','People who bring curiosity, judgement and specialist expertise.'],['Suppliers','Trusted providers who help make reliable delivery possible.']].map(([title,copy]) => `<article class="about-reveal"><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div></div></section>

      <section class="about-section about-voices"><div class="container"><div class="about-section-heading about-reveal"><p class="ab-eyebrow">CLIENT VOICES</p><h2>Relationships built through useful work.</h2><p>We do not treat a project as a handover. The most meaningful measure of success is whether a solution continues to help the people and organisation that rely on it.</p></div><div class="about-voice-grid"><article class="about-reveal"><h3>Clarity</h3><p>Clients value a delivery partner that can make difficult choices understandable.</p></article><article class="about-reveal"><h3>Practicality</h3><p>Recommendations work best when they respect the organisation’s people, systems and pace of change.</p></article><article class="about-reveal"><h3>Continuity</h3><p>Good documentation, ownership and support make progress easier to sustain.</p></article></div></div></section>

      <section class="about-final"><div class="container about-reveal"><p class="ab-eyebrow">LET'S TALK</p><h2>Have a business challenge<br/>worth solving?</h2><p>Tell us what is changing, what is difficult and what you would like to improve. We will help identify a useful starting point.</p><a class="btn" data-contact-open href="#contact-dialog">Talk to our team <span>→</span></a></div></section>
    </div>`;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const observer = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting || target.dataset.revealed) return;
    target.dataset.revealed = 'true';
    const index = [...document.querySelectorAll('.about-reveal')].indexOf(target);
    const x = index % 3 === 0 ? '-30px' : index % 3 === 1 ? '30px' : '0px';
    target.animate([{ opacity: 0, translate: `${x} 20px` }, { opacity: 1, translate: '0 0' }], { duration: 780, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both' });
    observer.unobserve(target);
  }), { threshold: .12 });
  document.querySelectorAll('.about-reveal').forEach((element) => observer.observe(element));
});
