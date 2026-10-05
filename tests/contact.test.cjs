const {test}=require('node:test');
const assert=require('node:assert/strict');
const handler=require('../api/contact.js');
const base={name:'Alex Example',email:'alex@example.com',company:'Example Ltd',phone:'+44 20 1234 5678',interest:'Data & analytics',formType:'service',timeframe:'1–3 months',message:'Please help connect our reporting systems.',page:'/data.html',topic:'Data & Analytics',requestId:'12345678-1234-1234-1234-123456789012',website:''};
async function invoke(body, options={}) {
 let code,output,sent;
 const nm=require('nodemailer'), originalTransport=nm.createTransport;
 const keys=['SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','CONTACT_FROM','CONTACT_TO'];
 const previous=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
 Object.assign(process.env,{SMTP_HOST:'smtp.example.com',SMTP_PORT:String(options.port||587),SMTP_USER:'website@example.com',SMTP_PASS:'test-password',CONTACT_FROM:'Website <website@example.com>'});
 delete process.env.CONTACT_TO;
 if(options.recipient)process.env.CONTACT_TO=options.recipient;
 if(options.unconfigured)delete process.env.SMTP_PASS;
 nm.createTransport=config=>({close(){},async sendMail(body){sent={config,body};if(options.fail)throw Error('SMTP failed');return {accepted:options.reject?[]:[body.to],rejected:options.reject?[body.to]:[]}}});
 const req={method:options.method||'POST',headers:{'content-type':'application/json',host:'example.com',origin:options.origin||'https://example.com'},body};
 const res={setHeader(){},status(n){code=n;return this},json(data){output=data;return this}};
 try{await handler(req,res);return {code,output,sent}}finally{nm.createTransport=originalTransport;for(const k of keys){if(previous[k]===undefined)delete process.env[k];else process.env[k]=previous[k]}}

}
test('all form variants deliver all entered fields as text and formatted email',async()=>{
 for(const formType of ['general','service','technology','research','launchpad','careers']){
  const data={...base,formType,stage:'Prototype in progress',profile:'https://example.com/portfolio'};
  const r=await invoke(data);assert.equal(r.code,200);assert.equal(r.sent.body.to,'solution@activebrains.co.uk');assert.equal(r.sent.body.replyTo,data.email);
  for(const key of ['name','email','company','phone','interest','timeframe','stage','profile','message','page','topic'])assert.ok(r.sent.body.text.includes(data[key]),key);
  assert.ok(r.sent.body.html.includes('<table'));assert.ok(r.sent.body.html.includes('Data &amp; analytics'));
 }
});
test('user HTML is escaped in the email',async()=>{const r=await invoke({...base,name:'<script>alert(1)</script>',message:'A request with <img src=x> & details'});assert.ok(!r.sent.body.html.includes('<script>'));assert.ok(r.sent.body.html.includes('&lt;img src=x&gt; &amp; details'))});
test('invalid, oversized and honeypot submissions do not send',async()=>{for(const change of [{email:'invalid'},{message:'short'},{name:' '},{interest:''},{phone:'x'.repeat(51)},{profile:'javascript:alert(1)'},{formType:'unknown'},{website:'spam'},{stage:{}},{requestId:'invalid'}]){const r=await invoke({...base,...change});assert.equal(r.code,400);assert.equal(r.sent,undefined)}});
test('provider errors never report success',async()=>{const r=await invoke(base,{fail:true});assert.equal(r.code,502);assert.equal(r.output.ok,false)});
test('missing email configuration never reports success',async()=>{const r=await invoke(base,{unconfigured:true});assert.equal(r.code,503);assert.equal(r.sent,undefined)});
test('retries retain Message-ID but changed details change it',async()=>{const a=await invoke(base),b=await invoke(base),c=await invoke({...base,phone:'12345'});assert.equal(a.sent.body.messageId,b.sent.body.messageId);assert.notEqual(a.sent.body.messageId,c.sent.body.messageId)});
test('cross-origin and non-POST requests are rejected',async()=>{assert.equal((await invoke(base,{origin:'https://other.example'})).code,403);assert.equal((await invoke(base,{method:'GET'})).code,405)});
test('cached older forms remain compatible',async()=>{const old={...base};delete old.formType;delete old.interest;assert.equal((await invoke(old)).code,200)});

test('SMTP encryption and configured recipient',async()=>{for(const port of [465,587]){const r=await invoke(base,{port,recipient:'test@example.com'});assert.equal(r.code,200);assert.equal(r.sent.body.to,'test@example.com');assert.equal(r.sent.config.secure,port===465);assert.equal(r.sent.config.requireTLS,port===587);assert.equal(r.sent.config.disableFileAccess,true)}});
test('rejected recipients do not report success',async()=>{assert.equal((await invoke(base,{reject:true})).code,502)});
test('invalid SMTP port does not send',async()=>{const r=await invoke(base,{port:25});assert.equal(r.code,503);assert.equal(r.sent,undefined)});
