/* MISH Precificação: login (Supabase Auth) e dados na nuvem.
   Fluxo: mostra a tela de entrada -> após o login baixa os dados da conta -> carrega o app (js/app.js).
   O app continua igual; a cada "save()" ele chama window.MISH_CLOUD.push(S), que grava na conta. */
(function(){
"use strict";
const cfg=window.MISH_CONFIG||{};
const box=document.getElementById('auth');
const body=document.body;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LOGO='<span class="mish" style="--h:30px" role="img" aria-label="MISH"></span>';
/* link do WhatsApp do Israel (js/config.js). Sem número configurado, os botões de compra não aparecem. */
const zap=(()=>{const n=String(cfg.whatsapp||'').replace(/\D/g,''); if(n.length<10)return ''; return 'https://wa.me/'+(n.length<=11?'55'+n:n)+'?text='+encodeURIComponent(cfg.whatsappMensagem||'Quero meu acesso à MISH Precificação.');})();
const comprar=t=>zap?'<a class="auth-link" href="'+zap+'" target="_blank" rel="noopener">'+t+'</a>':'';
const ls={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v);return true}catch(e){return false}},del(k){try{localStorage.removeItem(k)}catch(e){}}};

function card(inner){
  body.classList.add('authing');
  box.hidden=false;
  box.innerHTML='<div class="auth-card"><div class="auth-logo">'+LOGO+'</div><p class="auth-tag">Planilha de Precificação</p>'+inner+'</div>';
  /* botão de olho em cada campo de senha */
  box.querySelectorAll('input[type=password]').forEach(inp=>{
    const w=document.createElement('span'); w.className='pw';
    inp.parentNode.insertBefore(w,inp); w.appendChild(inp);
    w.insertAdjacentHTML('beforeend','<button type="button" class="pw-eye" aria-label="Mostrar senha" aria-pressed="false">'+OLHO+'</button>');
  });
  const f=box.querySelector('input'); if(f)setTimeout(()=>{try{f.focus()}catch(_){}},30);
}
const OLHO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
const OLHO_X='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2M6.6 6.6A17.4 17.4 0 0 0 2 12s3.6 7 10 7a10.6 10.6 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18"/></svg>';
function setMsg(t,ok){const m=box.querySelector('.auth-msg'); if(m){m.textContent=t||''; m.classList.toggle('ok',!!ok)}}
function busy(on){box.querySelectorAll('button,input').forEach(el=>el.disabled=on)}

if(!cfg.supabaseUrl||/COLE_AQUI/.test(cfg.supabaseUrl+cfg.supabaseAnonKey)){
  card('<div class="auth-msg">Falta configurar o Supabase. Abra <b>js/config.js</b> e cole a Project URL e a anon public key do seu projeto.</div>');
  return;
}
if(typeof supabase==='undefined'){
  card('<div class="auth-msg">Não foi possível carregar o sistema de login. Verifique sua internet e recarregue a página.</div><button class="btn pri auth-full" onclick="location.reload()">Tentar de novo</button>');
  return;
}

const sb=supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{
  auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true},
  /* keepalive: deixa o último salvamento terminar mesmo se a pessoa fechar a aba */
  global:{fetch:(u,o)=>{o=o||{}; const n=typeof o.body==='string'?o.body.length:0; return fetch(u,Object.assign({},o,n&&n<60000?{keepalive:true}:{}))}}
});

function traduz(err){
  const m=(err&&(err.message||err.error_description))||String(err||'');
  if(/Invalid login credentials/i.test(m))return 'E-mail ou senha incorretos.';
  if(/Email not confirmed/i.test(m))return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
  if(/already registered|already been registered/i.test(m))return 'Já existe uma conta com esse e-mail. Use "Entrar" ou "Esqueci minha senha".';
  if(/Database error saving new user|MISH_CODIGO/i.test(m))return 'Código de acesso inválido ou já usado. Confira o código que a MISH enviou pelo WhatsApp.';
  if(/Signups not allowed/i.test(m))return 'Novos cadastros estão fechados no momento.';
  if(/rate limit|too many|after \d+ seconds/i.test(m))return 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.';
  if(/Password should be at least/i.test(m))return 'A senha precisa ter pelo menos 6 caracteres.';
  if(/valid email|invalid format|Unable to validate email/i.test(m))return 'Digite um e-mail válido.';
  if(/same.*password|different from the old/i.test(m))return 'A nova senha precisa ser diferente da anterior.';
  if(/Failed to fetch|NetworkError|Load failed/i.test(m))return 'Sem conexão com a internet. Tente de novo.';
  return 'Não deu certo: '+m;
}
const redirect=()=>location.origin+location.pathname;

/* ---------------- telas ---------------- */
function telaEntrar(email,aviso){
  card('<h1>Entrar</h1>'+
    '<form class="auth-form" data-f="entrar">'+
      '<label class="field"><span>E-mail</span><input class="inp" type="email" name="email" autocomplete="email" required value="'+esc(email)+'"></label>'+
      '<label class="field"><span>Senha</span><input class="inp" type="password" name="senha" autocomplete="current-password" required></label>'+
      '<div class="auth-msg'+(aviso?' ok':'')+'">'+esc(aviso||'')+'</div>'+
      '<button class="btn pri auth-full" type="submit">Entrar</button>'+
    '</form>'+
    '<div class="auth-links"><button class="auth-link" data-t="criar">Tenho um código de acesso</button><button class="auth-link" data-t="esqueci">Esqueci minha senha</button></div>'+
    (zap?'<div class="auth-links">'+comprar('Ainda não tem acesso? Compre pelo WhatsApp')+'</div>':''));
}
function telaCriar(email){
  card('<h1>Criar conta</h1><p class="auth-sub">Use o código de acesso que você recebeu da MISH pelo WhatsApp.</p>'+
    '<form class="auth-form" data-f="criar">'+
      '<label class="field"><span>Código de acesso</span><input class="inp" type="text" name="codigo" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="MISH-XXXX-XXXX" required></label>'+
      '<label class="field"><span>E-mail</span><input class="inp" type="email" name="email" autocomplete="email" required value="'+esc(email)+'"></label>'+
      '<label class="field"><span>Senha (mínimo 6 caracteres)</span><input class="inp" type="password" name="senha" autocomplete="new-password" minlength="6" required></label>'+
      '<label class="field"><span>Repita a senha</span><input class="inp" type="password" name="senha2" autocomplete="new-password" minlength="6" required></label>'+
      '<div class="auth-msg"></div>'+
      '<button class="btn pri auth-full" type="submit">Criar conta</button>'+
    '</form>'+
    '<div class="auth-links"><button class="auth-link" data-t="entrar">Já tenho conta</button>'+comprar('Não tenho código')+'</div>');
}
function telaEsqueci(email){
  card('<h1>Recuperar senha</h1><p class="auth-sub">Enviamos um link para você criar uma senha nova.</p>'+
    '<form class="auth-form" data-f="esqueci">'+
      '<label class="field"><span>E-mail</span><input class="inp" type="email" name="email" autocomplete="email" required value="'+esc(email)+'"></label>'+
      '<div class="auth-msg"></div>'+
      '<button class="btn pri auth-full" type="submit">Enviar link</button>'+
    '</form>'+
    '<div class="auth-links"><button class="auth-link" data-t="entrar">Voltar para entrar</button></div>');
}
function telaNovaSenha(){
  card('<h1>Nova senha</h1>'+
    '<form class="auth-form" data-f="nova">'+
      '<label class="field"><span>Nova senha (mínimo 6 caracteres)</span><input class="inp" type="password" name="senha" autocomplete="new-password" minlength="6" required></label>'+
      '<label class="field"><span>Repita a senha</span><input class="inp" type="password" name="senha2" autocomplete="new-password" minlength="6" required></label>'+
      '<div class="auth-msg"></div>'+
      '<button class="btn pri auth-full" type="submit">Salvar e entrar</button>'+
    '</form>');
}
function telaCarregando(t){ card('<div class="auth-loading"><span class="auth-spin"></span>'+esc(t||'Carregando seus dados...')+'</div>'); }

box.addEventListener('click',e=>{
  const eye=e.target.closest('.pw-eye');
  if(eye){ e.preventDefault(); const inp=eye.parentNode.querySelector('input'); const ver=inp.type==='password';
    inp.type=ver?'text':'password'; eye.innerHTML=ver?OLHO_X:OLHO;
    eye.setAttribute('aria-label',ver?'Esconder senha':'Mostrar senha'); eye.setAttribute('aria-pressed',String(ver));
    try{ inp.focus({preventScroll:true}); const n=inp.value.length; inp.setSelectionRange(n,n); }catch(_){}
    return; }
  const b=e.target.closest('[data-t]'); if(!b)return; e.preventDefault();
  const em=(box.querySelector('input[name=email]')||{}).value||'';
  ({entrar:telaEntrar,criar:telaCriar,esqueci:telaEsqueci})[b.dataset.t](em);
});
box.addEventListener('submit',async e=>{
  e.preventDefault();
  const f=e.target, d=Object.fromEntries(new FormData(f)), tipo=f.dataset.f;
  const email=(d.email||'').trim().toLowerCase();
  if((tipo==='criar'||tipo==='nova')&&d.senha!==d.senha2){setMsg('As duas senhas não são iguais.');return}
  const codigo=String(d.codigo||'').toUpperCase().replace(/[^A-Z0-9]/g,'').replace(/^MISH/,'').replace(/^(.{4})(.{4})$/,'MISH-$1-$2');
  if(tipo==='criar'&&!/^MISH-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(codigo)){setMsg('Digite o código de acesso no formato MISH-XXXX-XXXX.');return}
  busy(true); setMsg('');
  try{
    if(tipo==='entrar'){
      const {data,error}=await sb.auth.signInWithPassword({email,password:d.senha}); if(error)throw error;
      await iniciar(data.session);
    }else if(tipo==='criar'){
      const {data,error}=await sb.auth.signUp({email,password:d.senha,options:{emailRedirectTo:redirect(),data:{codigo}}}); if(error)throw error;
      if(data.session){ await iniciar(data.session); }
      else if(data.user&&data.user.identities&&data.user.identities.length===0){ busy(false); setMsg(traduz({message:'already registered'})); }
      else { telaEntrar(email,'Conta criada! Enviamos um link de confirmação para '+email+'. Abra o e-mail, confirme e depois entre aqui.'); }
    }else if(tipo==='esqueci'){
      const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:redirect()}); if(error)throw error;
      busy(false); setMsg('Se existir conta com esse e-mail, o link chega em instantes. Veja também a caixa de spam.',true);
    }else if(tipo==='nova'){
      const {error}=await sb.auth.updateUser({password:d.senha}); if(error)throw error;
      recuperando=false; history.replaceState(null,'',redirect());
      const {data:{session}}=await sb.auth.getSession(); await iniciar(session);
    }
  }catch(err){ busy(false); setMsg(traduz(err)); }
});

/* ---------------- dados na nuvem ---------------- */
let iniciado=false, recuperando=/type=recovery/.test(location.hash);
sb.auth.onAuthStateChange((ev)=>{
  if(ev==='PASSWORD_RECOVERY'){ recuperando=true; if(!iniciado)telaNovaSenha(); }
  if(ev==='SIGNED_OUT'&&iniciado){ location.replace(redirect()); }
});

function toast(t){const el=document.getElementById('toast'); if(!el)return; el.textContent=t; el.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=>el.classList.remove('show'),2600);}

/* renova o acesso; se não for possível, encerra a sessão para a pessoa entrar de novo */
async function renovar(){
  try{ const {data,error}=await sb.auth.refreshSession(); if(!error&&data&&data.session)return data.session; }catch(_){}
  try{ await sb.auth.signOut({scope:'local'}); }catch(_){}
  return null;
}
const sessaoVencida=e=>/JWT expired|invalid JWT|jwt/i.test((e&&(e.message||e.code))||'')||(e&&(e.code==='PGRST301'||e.code==='PGRST303'));

/* ---------------- visão Boss ---------------- */
const brl=v=>(v<0?'-':'')+'R$ '+Math.abs(Number(v)||0).toLocaleString('pt-BR',{maximumFractionDigits:0});
const pctf=v=>isFinite(v)?(v*100).toLocaleString('pt-BR',{maximumFractionDigits:1})+'%':'—';
const somaV=a=>(a||[]).reduce((s,x)=>s+(Number(x.val)||0),0);
const MES=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const dataBR=d=>d?new Date(d).toLocaleDateString('pt-BR'):'—';
/* mesmo cálculo do app (calcMonth) para o mês mais recente com faturamento */
function resumo(d){
  if(!d||!d.months)return null;
  const ks=Object.keys(d.months).sort(), k=ks.filter(x=>Number(d.months[x].fat)>0).pop()||ks.pop(), m=d.months[k]||{};
  const F=Number(m.fat)||0, CF=somaV(m.fixed), CV=somaV(m.variable), R=F-CV-CF, moP=F?(F-CV)/F:NaN;
  const [y,mm]=(k||'').split('-');
  return {mes:k?MES[+mm-1]+'/'+y:'—',F,CF,CV,R,rP:F?R/F:NaN,PE:moP>0?CF/moP:null,svc:(d.services||[]).length,prod:(d.products||[]).length};
}
async function painelBoss(session,carteira){
  telaCarregando('Carregando sua carteira...');
  let {data:lista,error}=await sb.rpc('boss_clientes');
  if(error&&sessaoVencida(error)&&await renovar()) ({data:lista,error}=await sb.rpc('boss_clientes'));
  if(error){ card('<div class="auth-msg">Não conseguimos carregar a carteira ('+esc(traduz(error))+').</div><button class="btn pri auth-full" onclick="location.reload()">Tentar de novo</button>'); return; }
  lista=lista||[];
  const rs=lista.map(c=>resumo(c.data)), ok=rs.filter(r=>r&&r.F>0);
  const tF=ok.reduce((s,r)=>s+r.F,0), tR=ok.reduce((s,r)=>s+r.R,0);
  const kpi=(l,v)=>'<div class="boss-kpi"><span>'+l+'</span><b>'+v+'</b></div>';
  const cli=(c,i)=>{const r=rs[i], nome=(c.data&&c.data.company&&c.data.company.name)||'(sem nome da empresa)';
    const nums=r?'<div class="boss-nums">'+
      '<div>Mês<b>'+esc(r.mes)+'</b></div><div>Faturamento<b>'+brl(r.F)+'</b></div>'+
      '<div>Custos fixos<b>'+brl(r.CF)+'</b></div><div>Custos variáveis<b>'+brl(r.CV)+'</b></div>'+
      '<div>Resultado<b class="'+(r.R<0?'neg':'pos')+'">'+brl(r.R)+' ('+pctf(r.rP)+')</b></div>'+
      '<div>Ponto de equilíbrio<b>'+(r.PE==null?'—':brl(r.PE))+'</b></div>'+
      '<div>Serviços / produtos<b>'+r.svc+' / '+r.prod+'</b></div></div>'
      :'<small>Ainda não preencheu a planilha.</small>';
    return '<div class="boss-cli"><div class="boss-cli-top"><div><h2>'+esc(nome)+'</h2><small>'+esc(c.email)+' · atualizado em '+dataBR(c.atualizado_em)+'</small></div>'+
      (c.data?'<div class="boss-acts"><button class="btn sec sm boss-open boss-apres" data-i="'+i+'">Apresentação</button><button class="btn pri sm boss-open" data-i="'+i+'">Abrir planilha</button></div>':'')+'</div>'+nums+'</div>';};
  body.classList.add('authing'); box.hidden=false;
  box.innerHTML='<div class="auth-card boss"><div class="auth-logo">'+LOGO+'</div><p class="auth-tag">Visão Boss · '+esc(carteira)+'</p>'+
    '<div class="boss-head"><h1>Clientes</h1><button class="auth-link" data-boss="sair">Sair ('+esc(session.user.email)+')</button></div>'+
    '<div class="boss-tot">'+kpi('Clientes',lista.length)+kpi('Com planilha preenchida',ok.length)+kpi('Faturamento somado',brl(tF))+kpi('Resultado somado',brl(tR))+'</div>'+
    '<div class="boss-list">'+(lista.length?lista.map(cli).join(''):'<p class="auth-sub">Nenhum cliente criou conta com código desta carteira ainda.</p>')+'</div></div>';
  box.onclick=async e=>{
    if(e.target.closest('[data-boss=sair]')){ await sb.auth.signOut(); location.replace(redirect()); return; }
    const b=e.target.closest('.boss-open'); if(!b)return;
    const c=lista[+b.dataset.i];
    if(b.classList.contains('boss-apres')){
      if(window.MISH_APRESENTACAO) window.MISH_APRESENTACAO(c.data,c.email);
      else alert('Não foi possível carregar a apresentação. Recarregue a página e tente de novo.');
      return;
    }
    abrirCliente(session,c);
  };
}
function abrirCliente(session,c){
  const nome=(c.data.company&&c.data.company.name)||c.email;
  window.MISH_READONLY=true;
  window.MISH_KEY='mish-boss-consulta';
  window.MISH_INITIAL=JSON.parse(JSON.stringify(c.data));
  window.MISH_CLOUD={push(){},flush(){return Promise.resolve()}};
  window.MISH_ACCOUNT={email:session.user.email,sair:async()=>{await sb.auth.signOut(); location.replace(redirect());}};
  document.body.insertAdjacentHTML('afterbegin','<div class="boss-bar"><span>Consultando <b>'+esc(nome)+'</b> · somente leitura</span><button type="button" onclick="location.reload()">← Voltar aos clientes</button></div>');
  const s=document.createElement('script'); s.src='js/app.js';
  s.onload=()=>{ box.hidden=true; box.innerHTML=''; box.onclick=null; body.classList.remove('authing'); };
  document.body.appendChild(s);
}

async function iniciar(session){
  if(iniciado||!session)return;
  const uid=session.user.id, KEY='mish-precifica-v1:'+uid, PEND='mish-precifica-pendente:'+uid;
  telaCarregando();
  /* gestor (visão Boss)? mostra a carteira de clientes em vez da planilha própria */
  try{ const {data:cart,error:eb}=await sb.rpc('boss_carteira'); if(!eb&&cart){ iniciado=true; return painelBoss(session,cart); } }catch(_){}
  const buscar=()=>sb.from('app_state').select('data,updated_at').eq('user_id',uid).maybeSingle();
  let {data:row,error}=await buscar();
  if(error&&sessaoVencida(error)){
    const nova=await renovar();
    if(!nova){ telaEntrar(session.user.email||'','Sua sessão expirou. Entre de novo para continuar.'); return; }
    ({data:row,error}=await buscar());
  }
  const local=ls.get(KEY), pendente=!!ls.get(PEND);
  let inicial=null, enviarJa=false;
  if(error){
    if(!local){ card('<div class="auth-msg">Não conseguimos buscar seus dados agora ('+esc(traduz(error))+').</div><button class="btn pri auth-full" onclick="location.reload()">Tentar de novo</button>'); return; }
    inicial=JSON.parse(local); setTimeout(()=>toast('Sem conexão: mostrando a última versão salva neste aparelho'),400);
  }else if(pendente&&local){ inicial=JSON.parse(local); enviarJa=true; }       // alterações feitas offline que ainda não subiram
  else if(row&&row.data){ inicial=row.data; }
  else{
    /* conta nova: aproveita dados que a pessoa já tinha na versão sem login (mesmo navegador) */
    const antigo=ls.get('mish-precifica-v1');
    try{const o=antigo&&JSON.parse(antigo); if(o&&o.months&&!o.example){inicial=o; enviarJa=true}}catch(_){}
  }
  if(inicial)ls.set(KEY,JSON.stringify(inicial));
  window.MISH_KEY=KEY; window.MISH_INITIAL=inicial;

  /* gravação: junta várias alterações seguidas em um envio (1 s) */
  let timer=null, enviando=false, deNovo=false, ultimo=null, avisouErro=false;
  async function enviar(){
    timer=null; if(!ultimo)return;
    if(enviando){deNovo=true;return}
    enviando=true; const dados=ultimo;
    const {error}=await sb.from('app_state').upsert({user_id:uid,data:dados,updated_at:new Date().toISOString()});
    enviando=false;
    if(error){ if(!avisouErro){avisouErro=true; toast('Sem conexão: salvo neste aparelho. Enviamos para sua conta quando a internet voltar.')} }
    else { avisouErro=false; if(dados===ultimo)ls.del(PEND); }
    if(deNovo){deNovo=false; enviar()}
  }
  window.MISH_CLOUD={
    push(S){ ultimo=JSON.parse(JSON.stringify(S)); ls.set(PEND,'1'); clearTimeout(timer); timer=setTimeout(enviar,1000); },
    flush(){ if(timer){clearTimeout(timer); return enviar()} return Promise.resolve(); }
  };
  addEventListener('online',()=>{ if(ls.get(PEND)&&ultimo)enviar(); });
  addEventListener('pagehide',()=>window.MISH_CLOUD.flush());
  document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='hidden')window.MISH_CLOUD.flush(); });

  /* rodapé: conta + sair */
  const foot=document.querySelector('.foot');
  if(foot){ foot.insertAdjacentHTML('beforeend','<span>·</span><span class="foot-user">'+esc(session.user.email)+'</span><button class="foot-out" type="button">Sair</button>');
    foot.querySelector('.foot-out').addEventListener('click',()=>sair()); }
  async function sair(){ await window.MISH_CLOUD.flush(); if(!ls.get(PEND)){ls.del(KEY)} await sb.auth.signOut(); location.replace(redirect()); }
  window.MISH_ACCOUNT={email:session.user.email,sair};

  iniciado=true;
  const s=document.createElement('script'); s.src='js/app.js';
  s.onload=()=>{ box.hidden=true; box.innerHTML=''; body.classList.remove('authing'); if(enviarJa&&window.MISH_CLOUD&&window.MISH_STATE)window.MISH_CLOUD.push(window.MISH_STATE()); };
  document.body.appendChild(s);
}

(async()=>{
  telaCarregando('Carregando...');
  let {data:{session}}=await sb.auth.getSession();
  if(recuperando){ telaNovaSenha(); return; }
  /* sessão guardada no navegador já vencida (ex.: aba aberta há dias): renova antes de usar */
  if(session&&session.expires_at&&session.expires_at*1000<Date.now()+60000){ session=await renovar(); }
  if(session) iniciar(session); else telaEntrar('');
})();
})();
