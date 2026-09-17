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
  const banner=document.getElementById('cookie-banner');
  try{if(localStorage.getItem('ab_cookie_consent_v2')&&banner)banner.style.display='none';}catch{}
  for(const [id,value] of [['accept-cookies','accepted'],['decline-cookies','essential_only']]){
    document.getElementById(id)?.addEventListener('click',()=>{try{localStorage.setItem('ab_cookie_consent_v2',value);}catch{}if(banner)banner.style.display='none';});
  }
});
