document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 20), {passive:true});
  const toggle = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
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
  const banner=document.getElementById('cookie-banner');
  try{if(localStorage.getItem('ab_cookie_consent_v2')&&banner)banner.style.display='none';}catch{}
  for(const [id,value] of [['accept-cookies','accepted'],['decline-cookies','essential_only']]){
    document.getElementById(id)?.addEventListener('click',()=>{try{localStorage.setItem('ab_cookie_consent_v2',value);}catch{}if(banner)banner.style.display='none';});
  }
});
