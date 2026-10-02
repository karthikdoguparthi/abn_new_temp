(() => {
  const dialog = document.querySelector('#contact-dialog');
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#contact-status');
  if (!dialog || !form || !status) return;
  const submit = form.querySelector('[type="submit"]');
  let opener, pending = false, retryKey, lastPayload;
  // Delegation also covers enquiry links rendered by the About page module.
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-contact-open]');
    if (!link) return;
    event.preventDefault();
    opener = link;
    if (!pending && link.dataset.contactInterest) form.elements.interest.value = link.dataset.contactInterest;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector('#contact-title').focus();
  });
  dialog.querySelector('.contact-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener?.focus());
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    for (const key of Object.keys(data)) data[key] = data[key].trim();
    if (!data.name || data.message.length < 10) {
      status.textContent = 'Please enter your name and a message of at least 10 characters.';
      return;
    }
    data.page = location.pathname; data.topic = document.title;
    const payload = JSON.stringify(data);
    if (payload !== lastPayload) { retryKey = crypto.randomUUID(); lastPayload = payload; }
    data.requestId = retryKey;
    pending = true; submit.disabled = true; form.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending your enquiry…';
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data), signal: AbortSignal.timeout(20000)
      });
      if (response.status === 501 || response.status === 404) {
        status.textContent = 'The enquiry sending service is unavailable on this preview. Your details have been kept. Please email solution@activebrains.co.uk directly.';
        return;
      }
      if (response.status === 503) {
        status.textContent = 'Email delivery is not configured yet. Your details have been kept. Please email solution@activebrains.co.uk directly.';
        return;
      }
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error('Delivery failed');
      form.reset(); lastPayload = undefined;
      status.textContent = 'Thank you. Your enquiry has been submitted successfully.';
      location.assign('/thank-you.html');
    } catch {
      status.textContent = 'Your enquiry could not be confirmed. Your details are still here. Please try again or email solution@activebrains.co.uk.';
    } finally { pending = false; submit.disabled = false; form.removeAttribute('aria-busy'); }
  });
})();
