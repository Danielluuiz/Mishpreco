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
  const f=box.querySelector('input'); if(f)setTimeout(()=>{try{f.focus()}catch(_){}},30);
}
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

async function iniciar(session){
  if(iniciado||!session)return;
  const uid=session.user.id, KEY='mish-precifica-v1:'+uid, PEND='mish-precifica-pendente:'+uid;
  telaCarregando();
  const {data:row,error}=await sb.from('app_state').select('data,updated_at').eq('user_id',uid).maybeSingle();
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
  const {data:{session}}=await sb.auth.getSession();
  if(recuperando){ telaNovaSenha(); return; }
  if(session) iniciar(session); else telaEntrar('');
})();
})();
