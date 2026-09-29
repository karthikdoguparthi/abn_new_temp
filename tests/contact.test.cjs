const {test}=require('node:test');
const assert=require('node:assert/strict');
const handler=require('../api/contact.js');
const base={name:'Alex Example',email:'alex@example.com',company:'Example Ltd',phone:'+44 20 1234 5678',interest:'Data & analytics',formType:'service',timeframe:'1–3 months',message:'Please help connect our reporting systems.',page:'/data.html',topic:'Data & Analytics',requestId:'12345678-1234-1234-1234-123456789012',website:''};
async function invoke(body, options={}) {
 let code,output,sent;
 const originalFetch=global.fetch,originalKey=process.env.RESEND_API_KEY,originalFrom=process.env.CONTACT_FROM;
 process.env.RESEND_API_KEY='test-key';process.env.CONTACT_FROM='Website <website@example.com>';
 if(options.unconfigured)delete process.env.RESEND_API_KEY;
 global.fetch=async(url,init)=>{sent={url,...init,body:JSON.parse(init.body)};return {ok:!options.fail,json:async()=>options.fail?{error:'failed'}:{id:'test-email-id'}}};
 const req={method:options.method||'POST',headers:{'content-type':'application/json',host:'example.com',origin:options.origin||'https://example.com'},body};
 const res={setHeader(){},status(n){code=n;return this},json(data){output=data;return this}};
 try{await handler(req,res);return {code,output,sent}}finally{global.fetch=originalFetch;if(originalKey===undefined)delete process.env.RESEND_API_KEY;else process.env.RESEND_API_KEY=originalKey;if(originalFrom===undefined)delete process.env.CONTACT_FROM;else process.env.CONTACT_FROM=originalFrom}
}
test('all form variants deliver all entered fields as text and formatted email',async()=>{
 for(const formType of ['general','service','technology','research','launchpad','careers']){
  const data={...base,formType,stage:'Prototype in progress',profile:'https://example.com/portfolio'};
  const r=await invoke(data);assert.equal(r.code,200);assert.deepEqual(r.sent.body.to,['solution@activebrains.co.uk']);assert.equal(r.sent.body.reply_to,data.email);
  for(const key of ['name','email','company','phone','interest','timeframe','stage','profile','message','page','topic'])assert.ok(r.sent.body.text.includes(data[key]),key);
  assert.ok(r.sent.body.html.includes('<table'));assert.ok(r.sent.body.html.includes('Data &amp; analytics'));
 }
});
test('user HTML is escaped in the email',async()=>{const r=await invoke({...base,name:'<script>alert(1)</script>',message:'A request with <img src=x> & details'});assert.ok(!r.sent.body.html.includes('<script>'));assert.ok(r.sent.body.html.includes('&lt;img src=x&gt; &amp; details'))});
test('invalid, oversized and honeypot submissions do not send',async()=>{for(const change of [{email:'invalid'},{message:'short'},{name:' '},{interest:''},{phone:'x'.repeat(51)},{profile:'javascript:alert(1)'},{formType:'unknown'},{website:'spam'},{stage:{}},{requestId:'invalid'}]){const r=await invoke({...base,...change});assert.equal(r.code,400);assert.equal(r.sent,undefined)}});
test('provider errors never report success',async()=>{const r=await invoke(base,{fail:true});assert.equal(r.code,502);assert.equal(r.output.ok,false)});
test('missing email configuration never reports success',async()=>{const r=await invoke(base,{unconfigured:true});assert.equal(r.code,503);assert.equal(r.sent,undefined)});
test('retries reuse idempotency key, changed details change it',async()=>{const a=await invoke(base),b=await invoke(base),c=await invoke({...base,phone:'12345'});assert.equal(a.sent.headers['Idempotency-Key'],b.sent.headers['Idempotency-Key']);assert.notEqual(a.sent.headers['Idempotency-Key'],c.sent.headers['Idempotency-Key'])});
test('cross-origin and non-POST requests are rejected',async()=>{assert.equal((await invoke(base,{origin:'https://other.example'})).code,403);assert.equal((await invoke(base,{method:'GET'})).code,405)});
test('cached older forms remain compatible',async()=>{const old={...base};delete old.formType;delete old.interest;assert.equal((await invoke(old)).code,200)});
