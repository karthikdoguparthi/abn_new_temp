const { createHash } = require('node:crypto');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ok:false}); }
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) return res.status(415).json({ok:false});
  const origin = req.headers.origin;
  if (origin) {
    try { if (new URL(origin).host !== req.headers.host) return res.status(403).json({ok:false}); }
    catch { return res.status(403).json({ok:false}); }
  }
  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
  catch { return res.status(400).json({ok:false}); }
  if (!body || JSON.stringify(body).length > 16000) return res.status(400).json({ok:false});
  const fields = { name:100, email:254, company:150, message:5000, page:300, topic:300, requestId:80, website:200 };
  for (const [key, max] of Object.entries(fields)) {
    if (body[key] !== undefined && (typeof body[key] !== 'string' || body[key].length > max)) return res.status(400).json({ok:false});
  }
  if (body.website) return res.status(400).json({ok:false});
  const name = (body.name || '').trim(), email = (body.email || '').trim(), message = (body.message || '').trim();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10 || !/^[a-f0-9-]{36}$/i.test(body.requestId || '')) return res.status(400).json({ok:false});
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM) return res.status(503).json({ok:false});
  const text = `New website enquiry\n\nName: ${name}\nEmail: ${email}\nCompany: ${body.company || 'Not provided'}\nPage: ${body.page || '/'}\nTopic: ${body.topic || 'Website enquiry'}\n\nMessage:\n${message}`;
  const key = createHash('sha256').update(body.requestId + text).digest('hex');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(15000),
      headers: {Authorization:`Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type':'application/json', 'Idempotency-Key':`contact-${key}`},
      body: JSON.stringify({from:process.env.CONTACT_FROM, to:['solution@activebrains.co.uk'], reply_to:email, subject:'New ACTIVE BRAINS website enquiry', text})
    });
    const result = await response.json();
    if (!response.ok || !result.id) return res.status(502).json({ok:false});
    return res.status(200).json({ok:true});
  } catch { return res.status(502).json({ok:false}); }
};
