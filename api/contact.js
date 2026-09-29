const { createHash } = require('node:crypto');
const TYPES = {general:'General enquiry', service:'Service enquiry', technology:'Technology enquiry', research:'Research collaboration', launchpad:'Launch Pad enquiry', careers:'Career enquiry'};
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

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
  if (!body || typeof body !== 'object' || Array.isArray(body) || JSON.stringify(body).length > 16000) return res.status(400).json({ok:false});
  const fields = {name:100,email:254,company:150,phone:50,interest:200,formType:30,timeframe:100,stage:100,profile:500,message:5000,page:300,topic:300,requestId:80,website:200};
  for (const [key, max] of Object.entries(fields)) {
    if (body[key] !== undefined && (typeof body[key] !== 'string' || body[key].length > max)) return res.status(400).json({ok:false});
  }
  if (body.website) return res.status(400).json({ok:false});
  const value = key => (body[key] || '').trim();
  const name=value('name'), email=value('email'), message=value('message');
  const formType=value('formType') || 'general';
  if (!Object.hasOwn(TYPES, formType) || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10 || !/^[a-f0-9-]{36}$/i.test(value('requestId'))) return res.status(400).json({ok:false});
  // Accept older cached forms while requiring the interest field on new forms.
  if (body.formType !== undefined && !value('interest')) return res.status(400).json({ok:false});
  if (value('profile')) {
    try { if (!['https:', 'http:'].includes(new URL(value('profile')).protocol)) return res.status(400).json({ok:false}); }
    catch { return res.status(400).json({ok:false}); }
  }
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM) return res.status(503).json({ok:false});
  const rows = [
    ['Enquiry type',TYPES[formType]],['Name',name],['Email',email],['Company / organisation',value('company') || 'Not provided'],
    ['Phone',value('phone') || 'Not provided'],['Interest / opportunity',value('interest') || 'Not specified'],
    ...(value('timeframe') ? [['Preferred timeframe',value('timeframe')]] : []),
    ...(value('stage') ? [['Idea stage',value('stage')]] : []),
    ...(value('profile') ? [['LinkedIn / portfolio',value('profile')]] : []),
    ['Source page',value('page') || '/'],['Page title',value('topic') || 'Website enquiry'],['Message',message]
  ];
  const text = `ACTIVE BRAINS — ${TYPES[formType]}\n\n` + rows.map(([label,content])=>`${label}: ${content}`).join('\n\n');
  const html = `<div style="font-family:Arial,sans-serif;color:#14203b;max-width:720px;margin:auto"><h1 style="font-size:24px;color:#14203b">ACTIVE BRAINS</h1><h2 style="font-size:20px;color:#d74300">${TYPES[formType]}</h2><table style="border-collapse:collapse;width:100%">${rows.map(([label,content])=>`<tr><th scope="row" style="text-align:left;vertical-align:top;padding:12px;border:1px solid #dce5ee;background:#f0f8fc;width:170px">${label}</th><td style="padding:12px;border:1px solid #dce5ee;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(content)}</td></tr>`).join('')}</table></div>`;
  const key = createHash('sha256').update(body.requestId + text).digest('hex');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(15000),
      headers: {Authorization:`Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type':'application/json', 'Idempotency-Key':`contact-${key}`},
      body: JSON.stringify({from:process.env.CONTACT_FROM,to:['solution@activebrains.co.uk'],reply_to:email,subject:`ACTIVE BRAINS — ${TYPES[formType]}`,text,html})
    });
    const result = await response.json();
    if (!response.ok || !result.id) return res.status(502).json({ok:false});
    return res.status(200).json({ok:true});
  } catch { return res.status(502).json({ok:false}); }
};
