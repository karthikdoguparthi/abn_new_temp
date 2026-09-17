(() => {
  const banner = document.getElementById('cookie-banner');
  const saved = () => { try { return localStorage.getItem('ab_cookie_consent_v2'); } catch { return null; } };
  function enableAnalytics() {
    if (saved() !== 'accepted' || location.hostname === '127.0.0.1' || location.hostname === 'localhost' || document.querySelector('[data-analytics]')) return;
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    window.va('beforeSend', event => { const url = new URL(event.url); url.search = ''; url.hash = ''; return {...event, url:url.href}; });
    const script = document.createElement('script'); script.defer = true; script.src = '/_vercel/insights/script.js'; script.dataset.analytics = 'true'; document.head.append(script);
  }
  document.getElementById('accept-cookies')?.addEventListener('click', () => setTimeout(enableAnalytics, 0));
  document.querySelector('[data-cookie-settings]')?.addEventListener('click', () => { if (banner) { banner.style.display = 'flex'; banner.querySelector('button')?.focus(); } });
  document.getElementById('decline-cookies')?.addEventListener('click', () => { if (document.querySelector('[data-analytics]')) location.reload(); });
  enableAnalytics();
})();
