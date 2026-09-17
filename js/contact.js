(() => {
  const dialog = document.querySelector('#contact-dialog');
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#contact-status');
  const submit = form.querySelector('[type="submit"]');
  let opener, pending = false, retryKey, lastPayload;
  document.querySelectorAll('[data-contact-open]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault(); opener = link; dialog.showModal();
  }));
  dialog.querySelector('.contact-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener?.focus());
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    data.page = location.pathname; data.topic = document.title;
    const payload = JSON.stringify(data);
    if (payload !== lastPayload) { retryKey = crypto.randomUUID(); lastPayload = payload; }
    data.requestId = retryKey;
    pending = true; submit.disabled = true; status.textContent = 'Sending your enquiry…';
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data), signal: AbortSignal.timeout(20000)
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error('Delivery failed');
      form.reset(); lastPayload = undefined;
      location.assign('/thank-you.html');
      status.textContent = 'Thank you. Your enquiry has been submitted successfully.';
    } catch {
      status.textContent = 'Your enquiry could not be confirmed. Your details are still here—please try again or email solution@activebrains.co.uk.';
    } finally { pending = false; submit.disabled = false; }
  });
})();
