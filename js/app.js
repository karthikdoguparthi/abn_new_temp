document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 20), {passive:true});
  const toggle = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  // The dedicated Careers page uses the same complete navigation as the rest of the site.
  if(document.body.classList.contains('careers-page')){
    const menus={
      services:[['service-solution-design.html','Solution Design Consulting'],['service-architecture.html','Enterprise Architecture'],['service-ai-agents.html','AI & Autonomous Agents'],['service-business-apps.html','Business Apps & Workplace'],['service-digital-strategy.html','Digital Strategy & Vision'],['service-cloud.html','Cloud Services (UK & EU)'],['service-data-services.html','Data Services & Fabric'],['service-si-overview.html','Hybrid Systems Integration'],['service-continuous-support.html','Continuous Support & AMC'],['service-talent.html','Talent & Manpower Augmentation'],['service-web-portals.html','Customer Facing Web Portals'],['service-offshore-nearshore.html','Offshore & Nearshore Delivery']],
      technology:[['tech-d365-crm.html','Dynamics 365 Sales & Customer Service'],['tech-d365-finance.html','Dynamics 365 Finance & Operations'],['tech-copilot.html','Microsoft Copilot Studio & AI Applications'],['tech-fabric.html','Microsoft Fabric'],['tech-purview.html','Microsoft Purview'],['tech-iq.html','Enterprise Knowledge & Search'],['tech-aws-bedrock.html','AWS & Amazon Bedrock'],['tech-google-vertex.html','Google Cloud & Vertex AI'],['tech-mobile-web.html','Mobile & Web Engineering']]
    };
    const buildLinks=entries=>entries.map(([href,label])=>`<a class="nav-dropdown-item" href="${href}">${label}</a>`).join('');
    document.querySelectorAll('.nav-menu a[href="services.html"], .nav-menu a[href="technology.html"]').forEach(link=>{const key=link.getAttribute('href')==='services.html'?'services':'technology';const item=link.closest('li');if(item&&!item.classList.contains('nav-dropdown'))item.outerHTML=`<li class="nav-dropdown"><a class="nav-link" href="${key}.html">${key==='services'?'Our Services':'Technology'} <svg fill="none" height="12" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="12"><polyline points="6 9 12 15 18 9"></polyline></svg></a><div class="nav-dropdown-content">${buildLinks(menus[key])}</div></li>`;});
    document.querySelectorAll('.mobile-nav-menu a[href="services.html"], .mobile-nav-menu a[href="technology.html"]').forEach(link=>{const key=link.getAttribute('href')==='services.html'?'services':'technology';const item=link.closest('li');if(item&&!item.classList.contains('mobile-nav-item-has-children'))item.outerHTML=`<li class="mobile-nav-item-has-children"><div class="mobile-nav-item-header"><a href="${key}.html">${key==='services'?'Our Services':'Technology'}</a><svg class="mobile-nav-toggle-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg></div><ul class="mobile-nav-submenu">${menus[key].map(([href,label])=>`<li><a href="${href}">${label}</a></li>`).join('')}</ul></li>`;});
    const insertLink=(menu,href,label,beforeHref,desktop=false)=>{if(!menu||menu.querySelector(`a[href="${href}"]`))return;const item=document.createElement('li');item.innerHTML=`<a${desktop?' class="nav-link"':''} href="${href}">${label}</a>`;const before=menu.querySelector(`a[href="${beforeHref}"]`)?.closest('li');menu.insertBefore(item,before||null);};
    const desktopCareerMenu=document.querySelector('.nav-menu');
    insertLink(desktopCareerMenu,'apps.html','Apps','research.html',true);insertLink(desktopCareerMenu,'data.html','Data','research.html',true);insertLink(desktopCareerMenu,'si.html','ASI','research.html',true);insertLink(desktopCareerMenu,'launchpad.html','AB Launch Pad','careers.html',true);
    const mobileCareerMenu=document.querySelector('.mobile-nav-menu');
    insertLink(mobileCareerMenu,'apps.html','Apps','research.html');insertLink(mobileCareerMenu,'data.html','Data','research.html');insertLink(mobileCareerMenu,'si.html','ASI','research.html');insertLink(mobileCareerMenu,'launchpad.html','AB Launch Pad','careers.html');
  }
  function closeMenu(){drawer?.classList.remove('open');toggle?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}
  if(toggle && drawer){
    toggle.setAttribute('aria-controls','mobile-drawer');
    toggle.addEventListener('click',()=>{const open=drawer.classList.toggle('open');toggle.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));});
    drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('click',e=>{if(!drawer.contains(e.target)&&!toggle.contains(e.target))closeMenu();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&drawer.classList.contains('open')){closeMenu();toggle.focus();}});
  }
  document.querySelectorAll('.mobile-nav-item-has-children .mobile-nav-toggle-icon').forEach(icon=>{
    const button=document.createElement('button');button.className='mobile-submenu-button';button.type='button';button.setAttribute('aria-label','Expand '+icon.parentElement.querySelector('a').textContent);button.setAttribute('aria-expanded','false');icon.replaceWith(button);button.append(icon);
    button.addEventListener('click',()=>{const active=button.closest('.mobile-nav-item-has-children').classList.toggle('active');button.setAttribute('aria-expanded',String(active));});
  });
  // Careers is a dedicated page, but remains reachable from every existing page.
  const desktopMenu=document.querySelector('.nav-menu');
  if(desktopMenu&&!desktopMenu.querySelector('a[href="careers.html"]')){const item=document.createElement('li');item.innerHTML='<a class="nav-link" href="careers.html">Careers</a>';desktopMenu.append(item);}
  const mobileMenu=document.querySelector('.mobile-nav-menu');
  if(mobileMenu&&!mobileMenu.querySelector('a[href="careers.html"]')){const item=document.createElement('li');item.innerHTML='<a href="careers.html">Careers</a>';const actionItem=[...mobileMenu.children].find(child=>child.querySelector('.btn'));mobileMenu.insertBefore(item,actionItem||null);}
  document.querySelectorAll('.site-footer nav').forEach(footerNav=>{
    const heading=footerNav.querySelector('h3');
    if(heading&&/explore|company/i.test(heading.textContent)&&!footerNav.querySelector('a[href="careers.html"]')){const link=document.createElement('a');link.href='careers.html';link.textContent='Careers';footerNav.append(link);}
  });
  // Give every desktop submenu a concise grouping and an icon that reflects its practice.
  // Individual pages share the header markup, so this keeps navigation consistent.
  const menuIcons={
    'service-solution-design.html':'◈','service-architecture.html':'⌘','service-digital-strategy.html':'◉',
    'service-ai-agents.html':'✦','service-business-apps.html':'▣','service-data-services.html':'▦',
    'service-cloud.html':'☁','service-si-overview.html':'⇄','service-continuous-support.html':'↻',
    'service-talent.html':'♙','service-web-portals.html':'▱','service-offshore-nearshore.html':'↔',
    'tech-d365-crm.html':'▦','tech-d365-finance.html':'▤','tech-copilot.html':'✦',
    'tech-fabric.html':'▦','tech-purview.html':'◉','tech-aws-bedrock.html':'☁',
    'tech-google-vertex.html':'◌','tech-mobile-web.html':'▱','tech-iq.html':'⌕'
  };
  document.querySelectorAll('.nav-dropdown-content').forEach(menu=>{
    if(!menu.querySelector('.nav-group-title')){
      const isTechnology = menu.closest('.nav-dropdown')?.querySelector('a')?.getAttribute('href') === 'technology.html';
      const headings = isTechnology
        ? [[0,'MICROSOFT ECOSYSTEM'],[5,'CLOUD & ENGINEERING']]
        : [[0,'ADVISE & DESIGN'],[3,'BUILD & CONNECT'],[8,'OPERATE & GROW']];
      const items=[...menu.querySelectorAll('.nav-dropdown-item')];
      menu.classList.add('nav-mega-menu');
      items.forEach((item,index)=>{const heading=headings.find(([start])=>start===index);if(heading){const label=document.createElement('p');label.className='nav-group-title';label.textContent=heading[1];menu.insertBefore(label,item);}});
    }
    menu.querySelectorAll('.nav-dropdown-item').forEach(item=>{
      const icons=[...item.children].filter(child=>child.tagName==='SPAN');
      const icon=icons.shift()||document.createElement('span');
      icons.forEach(extra=>extra.remove());
      if(!icon.parentElement)item.prepend(icon);
      icon.textContent=menuIcons[item.getAttribute('href')]||'•';
    });
  });
  document.querySelectorAll('.mobile-nav-submenu a').forEach(link=>{
    let icon=link.querySelector('.mobile-menu-icon');
    if(!icon){icon=document.createElement('span');icon.className='mobile-menu-icon';link.prepend(icon);}
    icon.textContent=menuIcons[link.getAttribute('href')]||'•';
  });
  const banner=document.getElementById('cookie-banner');
  try{if(localStorage.getItem('ab_cookie_consent_v2')&&banner)banner.style.display='none';}catch{}
  for(const [id,value] of [['accept-cookies','accepted'],['decline-cookies','essential_only']]){
    document.getElementById(id)?.addEventListener('click',()=>{try{localStorage.setItem('ab_cookie_consent_v2',value);}catch{}if(banner)banner.style.display='none';});
  }
});
