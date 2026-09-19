const m = document.getElementById('main-content');
if (m) {
  
  const events = [
    ['2002', 'Active Brains begins', 'Established in the UK with a focus on technology solutions designed around the needs of businesses.'],
    ['Early years', 'Building technology foundations', 'Our work expanded across web solutions, software, applications, data, content and IT services.'],
    ['Expansion', 'From technology delivery to business solutions', 'As client needs evolved, so did our capabilities — bringing together software, cloud, data, enterprise applications, integration and consulting.'],
    ['Global delivery', 'Experience across markets and industries', 'Experience grew across financial services, healthcare, education, real estate, retail, manufacturing, telecommunications and technology.'],
    ['Today', 'Business. Data. Cloud. AI.', 'We bring business analysis, solution design, enterprise architecture and engineering together to help organisations modernise and automate.'],
    ["What’s next", 'Building what comes next', 'We continue to invest in technology, research, people and partnerships while keeping business outcomes at the centre.']
  ];
  
  const values = [
    ['Learning & Sharing', 'We learn from experience, share knowledge and help one another grow.'],
    ['Integrity', 'We communicate openly, act responsibly and build relationships based on trust.'],
    ['Leading Change', 'We challenge assumptions and adopt technology where it creates genuine value.'],
    ['Excellence', 'We care about the quality of our thinking, engineering and delivery.'],
    ['Respect for the Individual', 'We value the people behind every project.']
  ];
  
  const caps = [
    'Business understanding',
    'Solution & enterprise architecture',
    'Business applications',
    'Data & analytics',
    'Cloud',
    'AI & intelligent automation',
    'Integration'
  ];
  
  m.innerHTML = `
    <section class="ip-hero">
      <div class="container">
        <nav aria-label="Breadcrumb" class="ip-breadcrumb">
          <a href="index.html">Home</a><span>/</span><span>About ACTIVE BRAINS</span>
        </nav>
        <div class="ip-hero-grid">
          <div>
            <p class="ab-eyebrow">ABOUT ACTIVE BRAINS · SINCE 2002</p>
            <h1>Technology built around your business.</h1>
            <p class="ip-lead">For more than two decades, Active Brains has helped organisations turn complex business challenges into practical technology solutions.</p>
            <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-top: 32px;">
              <a class="btn btn-primary" href="#what-we-bring">Explore what we do ↗</a>
              <a aria-haspopup="dialog" class="btn btn-outline" data-contact-open="" href="#contact-dialog">Talk to our team ↗</a>
            </div>
          </div>
          <aside class="ip-summary">
            <span>QUICK FACTS</span>
            <h2>Active Brains</h2>
            <ul>
              <li>24 years of experience</li>
              <li>UK-based operations</li>
              <li>Technology &amp; Business Solutions</li>
            </ul>
            <a href="#who">Read more ↓</a>
          </aside>
        </div>
      </div>
    </section>

    <nav aria-label="On this page" class="ip-jump container">
      <a href="#who">Who we are</a>
      <a href="#journey">Our journey</a>
      <a href="#approach">Our approach</a>
      <a href="#life">Life at Active Brains</a>
    </nav>

    <section id="who" class="container ip-section">
      <p class="ab-eyebrow">WHO WE ARE</p>
      <h2>Built on experience. Focused on what comes next.</h2>
      <p class="uc-context">Active Brains is a UK-based technology company established in 2002. We have evolved alongside the technology landscape — from web and software solutions, data and IT services to today’s business applications, cloud, enterprise data, AI and intelligent automation.</p>
      <div class="ip-cards">
        <article class="ip-deliverable flow-card">
          <h3>Technology creates value</h3>
          <p>Technology only creates value when it solves a real business problem.</p>
        </article>
        <article class="ip-deliverable flow-card">
          <h3>Our starting point</h3>
          <p>We start by understanding the organisation, its people, processes and challenges.</p>
        </article>
        <article class="ip-deliverable flow-card">
          <h3>Practical solutions</h3>
          <p>We bring together strategy, architecture, technology and delivery to create practical, maintainable solutions.</p>
        </article>
      </div>
    </section>

    <section class="ip-band section-dark">
      <div class="container ip-split">
        <div>
          <p class="ab-eyebrow" style="color: var(--color-brand-blue);">OUR PURPOSE</p>
          <h2>To make technology useful.</h2>
          <p class="uc-soft">We believe technology should make organisations simpler, more connected, more informed and better able to serve the people they exist for.</p>
        </div>
      </div>
    </section>

    <section id="journey" class="container ip-section">
      <p class="ab-eyebrow">2002 → TODAY</p>
      <h2>Our journey</h2>
      <div class="ip-cards" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
        ${events.map(e => \`
          <article class="ip-deliverable flow-card">
            <span class="ab-eyebrow">\${e[0]}</span>
            <h3 style="margin-top: 8px;">\${e[1]}</h3>
            <p>\${e[2]}</p>
          </article>
        \`).join('')}
      </div>
    </section>

    <section class="container ip-section">
      <p class="ab-eyebrow">CORE VALUES</p>
      <h2>How we work matters as much as what we deliver.</h2>
      <div class="ip-cards" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        ${values.map((v, i) => \`
          <article class="ip-deliverable flow-card">
            <h3>\${v[0]}</h3>
            <p>\${v[1]}</p>
          </article>
        \`).join('')}
      </div>
    </section>

    <section id="approach" class="ip-band">
      <div class="container ip-split">
        <div>
          <p class="ab-eyebrow">OUR APPROACH</p>
          <h2>Start with the problem.<br/>Build towards the outcome.</h2>
        </div>
        <ol class="ip-timeline">
          ${[['Understand', 'We listen to your organisation, users, processes and constraints.'],
             ['Shape', 'We define the opportunity, architecture and practical route forward.'],
             ['Build', 'Our specialists design, develop, integrate and implement the solution.'],
             ['Improve', 'We support, optimise and evolve the solution as your organisation changes.']].map(s => \`
            <li>
              <div>
                <h3>\${s[0]}</h3>
                <p>\${s[1]}</p>
              </div>
            </li>
          \`).join('')}
        </ol>
      </div>
    </section>

    <section id="what-we-bring" class="container ip-section">
      <p class="ab-eyebrow">WHAT WE BRING</p>
      <h2>One team. Multiple disciplines. One business goal.</h2>
      <div class="ip-cards" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
        ${caps.map((c, i) => \`
          <article class="ip-deliverable flow-card" style="display: flex; align-items: center; justify-content: center; text-align: center; min-height: 120px;">
            <h3 style="margin: 0; font-size: 1.125rem;">\${c}</h3>
          </article>
        \`).join('')}
      </div>
    </section>

    <section class="container ip-section ip-split">
      <div>
        <p class="ab-eyebrow">WHAT CLIENTS CAN EXPECT</p>
        <h2>A technology partner that understands the work behind the technology.</h2>
      </div>
      <div class="ip-faq">
        ${[['Clear thinking', 'We make complex technology decisions easier to understand.'],
           ['Practical solutions', 'We focus on what can actually work within your organisation.'],
           ['Experienced delivery', 'We bring technical and business expertise together throughout delivery.'],
           ['Transparent communication', 'We keep conversations clear, practical and focused on progress.'],
           ['Solutions built to evolve', 'We consider the future — not just the immediate requirement.']].map((x, i) => \`
          <details \${i === 0 ? 'open' : ''}>
            <summary>\${x[0]}</summary>
            <p>\${x[1]}</p>
          </details>
        \`).join('')}
      </div>
    </section>

    <section id="life" class="container ip-section">
      <p class="ab-eyebrow">LIFE AT ACTIVE BRAINS</p>
      <h2>Good technology starts with good people.</h2>
      <p class="uc-context">Active Brains is built around people who enjoy learning, solving problems and sharing what they know.</p>
      <div class="ip-cards" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin-top: 40px; margin-bottom: 40px;">
        ${['Learn', 'Create', 'Collaborate', 'Grow'].map((x, i) => \`
          <article class="ip-deliverable flow-card" style="display: flex; align-items: center; justify-content: center; min-height: 140px; background: \${i%2===0?'var(--color-surface-subtle)':'#fff'};">
            <h3 style="margin: 0; font-size: 1.25rem; color: var(--color-primary);">\${x}</h3>
          </article>
        \`).join('')}
      </div>
      <a class="btn btn-primary" href="careers.html">Explore careers ↗</a>
    </section>

    <section class="ip-band" style="background-color: var(--color-surface-subtle);">
      <div class="container ip-split" style="align-items: center;">
        <div>
          <p class="ab-eyebrow">SUSTAINABILITY</p>
          <h2>Technology with a wider responsibility.</h2>
        </div>
        <p style="font-size: 1.125rem; color: var(--color-text-muted);">We consider efficiency, accessibility, responsible use of data and AI, long-term maintainability and the people who depend on the systems we create.</p>
      </div>
    </section>

    <nav aria-label="Related pages" class="ip-next container">
      <p class="ab-eyebrow">LET’S TALK</p>
      <div>
        <a aria-haspopup="dialog" data-contact-open="" href="#contact-dialog">Have a business challenge worth solving? ↗</a>
      </div>
    </nav>
  \`;
});
