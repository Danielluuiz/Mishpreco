(function(){
"use strict";
/* ================= ícones ================= */
const P={
 home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
 upload:'<path d="M12 15V3"/><path d="m7 8 5-5 5 5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>',
 wallet:'<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18"/><path d="M16 15h2"/><path d="M6 6V5a2 2 0 0 1 2-2h9"/>',
 chart:'<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>',
 scissors:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9"/><path d="M14.5 14.5 20 20"/><path d="M8.1 8.1 12 12"/>',
 bottle:'<path d="M9 2h6v4H9z"/><path d="M8 6h8l1 3v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9z"/><path d="M7 12h10"/>',
 back:'<path d="m15 18-6-6 6-6"/>', next:'<path d="m9 18 6-6-6-6"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>', trash:'<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/>',
 check:'<path d="m5 12 5 5L20 7"/>', x:'<path d="M18 6 6 18M6 6l12 12"/>',
 camera:'<path d="M3 8a2 2 0 0 1 2-2h2l2-3h6l2 3h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/>',
 image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
 download:'<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
 chev:'<path d="m6 9 6 6 6-6"/>', edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
 file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
 sparkle:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'
};
const I=(n,c)=>'<svg class="'+(c||'ico')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+P[n]+'</svg>';
const LOGO=(h,white)=>'<span class="mish'+(white?' white':'')+'" style="--h:'+h+'px" role="img" aria-label="MISH"></span>';

const NAV=[
 {k:'home',l:'Início',c:'#0B5CFF',i:'home'},
 {k:'import',l:'Importar',c:'#0EA5E9',i:'upload'},
 {k:'mes',l:'Mês',c:'#16A34A',i:'wallet'},
 {k:'resultado',l:'Resultado',c:'#8B5CF6',i:'chart'},
 {k:'servicos',l:'Serviços',c:'#FF3D6E',i:'scissors'},
 {k:'produtos',l:'Produtos',c:'#F97316',i:'bottle'}
];
const COL={cv:'#FF3D6E',cf:'#F97316',lucro:'#16A34A',com:'#8B5CF6',prod:'#0EA5E9',card:'#F59E0B',tax:'#64748B'};

/* ================= utilidades ================= */
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s==null?'':s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
const uid=()=>Math.random().toString(36).slice(2,9);
const sum=a=>a.reduce((s,x)=>s+(Number(x.val)||0),0);
const brl=(v,dec)=>{v=Number(v)||0;const d=dec==null?(Math.abs(v)>=1000?0:2):dec;return (v<0?'-':'')+'R$ '+Math.abs(v).toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d})};
const num2=v=>(Number(v)||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const pct=(v,d)=>isFinite(v)?(v*100).toLocaleString('pt-BR',{minimumFractionDigits:d==null?1:d,maximumFractionDigits:d==null?1:d})+'%':'—';
function parseNum(x){
  if(typeof x==='number')return x; if(x==null)return NaN;
  let s=String(x).trim(); if(!s)return NaN;
  const neg=/\(.*\d.*\)/.test(s)||/-\s*(R\$)?\s*\d/.test(s);
  s=s.replace(/[^\d,.]/g,''); if(!s||!/\d/.test(s))return NaN;
  const lc=s.lastIndexOf(','),ld=s.lastIndexOf('.');
  if(lc>-1&&ld>-1){ s = lc>ld ? s.replace(/\./g,'').replace(',','.') : s.replace(/,/g,''); }
  else if(lc>-1){ s=s.replace(/\./g,'').replace(',','.'); }
  else if(ld>-1 && /^\d{1,3}(\.\d{3})+$/.test(s)){ s=s.replace(/\./g,''); }
  const n=parseFloat(s); return isNaN(n)?NaN:(neg?-n:n);
}
const MESES=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const mLabel=k=>{const [y,m]=k.split('-');return MESES[+m-1]+' '+y};
const nextKey=k=>{let [y,m]=k.split('-').map(Number);m++;if(m>12){m=1;y++}return y+'-'+String(m).padStart(2,'0')};
function parseDate(x){
  if(x instanceof Date&&!isNaN(x))return x;
  if(typeof x==='number'&&x>20000&&x<80000)return new Date(Math.round((x-25569)*864e5)+43200000);
  if(typeof x==='string'){
    let m=x.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/); if(m){let y=+m[3];if(y<100)y+=2000;return new Date(y,+m[2]-1,+m[1],12)}
    m=x.match(/(\d{4})-(\d{2})-(\d{2})/); if(m)return new Date(+m[1],+m[2]-1,+m[3],12);
  }
  return null;
}
const dKey=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');

/* ================= dados ================= */
const KEY=window.MISH_KEY||'mish-precifica-v1'; /* chave por usuário (definida em auth.js) */
const FIXED_DEF=[['aluguel','Aluguel + Condomínio'],['agua','Água'],['contab','Contabilidade'],['luz','Luz'],['sistema','Sistema (Avec / Trinks)'],['mkt','Marketing e publicidade'],['escritorio','Material de escritório'],['salarios','Salários e encargos'],['telefone','Telefone e internet'],['limpeza','Limpeza']];
const VAR_DEF=[['comissao','Comissões'],['produtos','Produtos usados nos serviços'],['cartao','Taxa de cartão'],['imposto','Imposto'],['descart','Toalhas / Descartáveis / Mercado']];
function blankMonth(copyFrom){
  if(copyFrom) return {fat:0,goal:copyFrom.goal||0,fixed:copyFrom.fixed.map(x=>({...x,id:uid()})),variable:copyFrom.variable.map(x=>({...x,id:uid(),val:0}))};
  return {fat:0,goal:0,fixed:FIXED_DEF.map(([k,n])=>({id:uid(),key:k,name:n,val:0})),variable:VAR_DEF.map(([k,n])=>({id:uid(),key:k,name:n,val:0}))};
}
function todayKey(){return dKey(new Date())}
function sample(){
  const k=todayKey(); const m=blankMonth();
  m.fat=60000; m.goal=15000;
  const fv={aluguel:5500,agua:250,contab:600,luz:900,sistema:190,mkt:1200,escritorio:150,salarios:4500,telefone:180,limpeza:400};
  const vv={comissao:21000,produtos:4200,cartao:1500,imposto:2160,descart:800};
  m.fixed.forEach(x=>x.val=fv[x.key]||0); m.variable.forEach(x=>x.val=vv[x.key]||0);
  const F=(name,cost,pack,unit,used)=>({id:uid(),name,cost,pack,unit,used});
  const S=(name,cat,price,comm,mode,prodCost,ficha)=>({id:uid(),name,cat,price,comm,mode:mode||'manual',prodCost:prodCost||0,ficha:ficha||[]});
  return {
    v:1, example:true,
    company:{name:'Studio Exemplo',logo:'',photo:''},
    months:{[k]:m}, cur:k,
    params:{tax:6,cardAuto:true,card:2.5,target:25,days:26,commDef:40},
    cats:['Cabelos','Barba','Unhas','Estética'],
    services:[
      S('Corte feminino','Cabelos',90,40,'ficha',0,[F('Shampoo profissional',90,5000,'ml',20),F('Condicionador',90,5000,'ml',20)]),
      S('Escova','Cabelos',60,40,'ficha',0,[F('Shampoo profissional',90,5000,'ml',20),F('Leave-in',70,500,'ml',8)]),
      S('Coloração','Cabelos',180,40,'ficha',0,[F('Tinta',28,60,'g',60),F('Oxidante',42,1000,'ml',90),F('Shampoo pós-química',95,1000,'ml',15)]),
      S('Mechas','Cabelos',450,40,'ficha',0,[F('Pó descolorante',100,500,'g',60),F('Tonalizante',28,60,'g',30),F('Oxidante',42,1000,'ml',150),F('Papel laminado',6,1,'un',1),F('Tratamento',150,500,'g',20),F('Matizador',150,1000,'ml',20)]),
      S('Hidratação','Cabelos',100,40,'manual',14),
      S('Progressiva','Cabelos',300,40,'manual',62),
      S('Corte masculino','Barba',50,40,'manual',2.5),
      S('Barba','Barba',45,40,'manual',2),
      S('Manicure','Unhas',35,50,'manual',4),
      S('Pedicure','Unhas',40,50,'manual',5),
      S('Design de sobrancelha','Estética',45,40,'manual',3),
      S('Limpeza de pele','Estética',150,40,'manual',22)
    ],
    products:[
      {id:uid(),name:'Shampoo profissional 300 ml',price:89,cost:38,comm:10},
      {id:uid(),name:'Máscara de tratamento 250 g',price:129,cost:55,comm:10},
      {id:uid(),name:'Pomada modeladora',price:59,cost:22,comm:10}
    ]
  };
}
function emptyState(keepCompany){
  const k=todayKey();
  return {v:1,example:false,company:keepCompany||{name:'',logo:'',photo:''},months:{[k]:blankMonth()},cur:k,
    params:{tax:6,cardAuto:true,card:2.5,target:25,days:26,commDef:40},cats:['Cabelos','Barba','Unhas','Estética'],services:[],products:[]};
}
let S=null;
try{ if(window.MISH_INITIAL)S=window.MISH_INITIAL; else{const raw=localStorage.getItem(KEY); if(raw)S=JSON.parse(raw)} }catch(e){S=null}
if(!S||!S.months)S=sample();
let toastT;
function save(msg){
  if(window.MISH_READONLY){ /* visão Boss: só consulta, nada é gravado */
    const t=document.getElementById('toast'); t.textContent='Modo consulta: alterações não são salvas'; t.classList.add('show');
    clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),1800); return;
  }
  try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
  if(window.MISH_CLOUD)window.MISH_CLOUD.push(S); /* grava na conta (auth.js) */
  const t=document.getElementById('toast'); t.textContent=msg||window.MISH_SAVE_MSG||'Salvo na sua conta'; t.classList.add('show');
  clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),1800);
}
const M=()=>{if(!S.months[S.cur]){S.cur=Object.keys(S.months).sort().pop()}return S.months[S.cur]};

/* ================= contas ================= */
function calcMonth(m){
  m=m||M(); const F=Number(m.fat)||0, CF=sum(m.fixed), CV=sum(m.variable);
  const MO=F-CV, moP=F?MO/F:NaN, R=F-CV-CF, rP=F?R/F:NaN, cfP=F?CF/F:NaN, cvP=F?CV/F:NaN;
  const PE=moP>0?CF/moP:null, goal=Number(m.goal)||0, need=moP>0?(goal+CF)/moP:null;
  return {F,CF,CV,MO,moP,R,rP,cfP,cvP,PE,goal,need};
}
function rates(){
  const m=M(), c=calcMonth(m), p=S.params;
  const cardItem=m.variable.find(x=>x.key==='cartao');
  const cardAutoV=(c.F&&cardItem)?(Number(cardItem.val)||0)/c.F:0;
  return {card:p.cardAuto?cardAutoV:(Number(p.card)||0)/100, cardAutoV, tax:(Number(p.tax)||0)/100, cf:isFinite(c.cfP)?c.cfP:0, target:(Number(p.target)||25)/100};
}
const fichaCost=sv=>(sv.ficha||[]).reduce((s,f)=>{const pk=Number(f.pack)||0;return s+(pk?(Number(f.cost)||0)/pk*(Number(f.used)||0):0)},0);
const prodCostOf=sv=>sv.mode==='ficha'?fichaCost(sv):(Number(sv.prodCost)||0);
function calcSvc(sv,r){
  r=r||rates(); const P=Number(sv.price)||0, c=(Number(sv.comm)||0)/100;
  const com=P*c, prod=prodCostOf(sv), card=P*r.card, tax=(P-com)*r.tax, cv=com+prod+card+tax;
  const mo=P-cv, cf=P*r.cf, res=P-cv-cf, resP=P?res/P:NaN;
  const den=1-c-r.card-r.tax*(1-c)-r.cf-r.target; const sug=den>0.02?prod/den:null;
  return {P,com,prod,card,tax,cv,mo,moP:P?mo/P:NaN,cf,res,resP,sug,den};
}
function calcProd(pd,r){
  r=r||rates(); const P=Number(pd.price)||0, c=(Number(pd.comm)||0)/100, cost=Number(pd.cost)||0;
  const com=P*c, card=P*r.card, tax=P*r.tax, tot=cost+com+card+tax, res=P-tot, resP=P?res/P:NaN;
  const den=1-c-r.card-r.tax-r.target; const sug=den>0.02?cost/den:null;
  return {P,cost,com,card,tax,tot,res,resP,sug};
}
function light(p){ if(!isFinite(p))return 's-none'; const t=(Number(S.params.target)||25)/100; return p>=t-0.001?'s-ok':(p>=t-0.03?'s-warn':'s-bad'); }
const LTXT={'s-ok':'Saudável','s-warn':'Atenção','s-bad':'Crítico','s-none':'Sem dados'};
const pill=(p,txt)=>{const s=light(p);return '<span class="pill '+s+'"><i></i>'+(txt!=null?txt:pct(p))+'</span>'};

/* ================= navegação ================= */
let view='home', vstate={};
function go(v,opts){ view=v; vstate=opts||{}; render(); window.scrollTo(0,0); try{localStorage.setItem('mish-precifica-view',v)}catch(e){} }
try{const lv=localStorage.getItem('mish-precifica-view'); if(lv&&NAV.some(n=>n.k===lv))view=lv}catch(e){}

function renderShell(){
  document.body.dataset.view=view;
  const c=S.company, nm=c.name||'Sua empresa';
  const ini=(nm.trim()[0]||'S').toUpperCase();
  const dark=isDark();
  document.getElementById('topbar').innerHTML=
    (view!=='home'?'<button class="back" data-go="home" aria-label="Voltar ao início">'+I('back')+'Início</button>':'')+
    '<button class="brandlink" data-go="home" aria-label="MISH — tela inicial">'+LOGO(view==='home'?30:24)+'</button>'+
    (view!=='import'?monthPicker():'')+
    '<span class="spacer"></span>'+
    '<button class="comp-chip" data-act="edit-cover" aria-label="Editar capa da empresa"><span class="av">'+(c.logo?'<img src="'+c.logo+'" alt="" onload="this.classList.toggle(\'wide\',this.naturalWidth>this.naturalHeight*1.4)">':esc(ini))+'</span><span class="nm">'+esc(nm)+'</span></button>'+
    '<button class="iconbtn" data-act="theme" aria-label="Trocar tema claro ou escuro">'+I(dark?'sun':'moon')+'</button>';
  document.getElementById('nav').innerHTML='<div class="rail-logo">'+LOGO(22)+'</div>'+NAV.map(n=>'<button class="nb'+(n.k===view?' on':'')+'" data-go="'+n.k+'" aria-current="'+(n.k===view?'page':'false')+'"><span class="bub">'+I(n.i)+'</span>'+n.l+'</button>').join('');
}
function isDark(){const a=document.documentElement.getAttribute('data-theme');return a?a==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
/* dicas de cada tela: dá para fechar; fechada, vira um botão ⓘ ao lado do título (preferência guardada neste navegador) */
let GOFF={}; try{GOFF=JSON.parse(localStorage.getItem('mish-precifica-dicas')||'{}')||{}}catch(e){GOFF={}}
function setGuide(off){ if(off)GOFF[view]=1; else delete GOFF[view]; try{localStorage.setItem('mish-precifica-dicas',JSON.stringify(GOFF))}catch(e){} render(); }
function head(icon,title,sub){return '<div class="sec-head"><span class="bub">'+I(icon)+'</span><div class="grow"><h1>'+title+'</h1><p>'+sub+'</p></div>'+(GOFF[view]?'<button class="iconbtn tipbtn" data-act="guide-on" aria-label="Mostrar dica desta tela" title="Mostrar dica">'+I('info')+'</button>':'')+'</div>'}
function guide(html){return GOFF[view]?'':'<div class="guide">'+I('info')+'<div class="grow">'+html+'</div><button class="guide-x" data-act="guide-off" aria-label="Fechar dica">'+I('x')+'</button></div>'}
function monthPicker(){
  const ks=Object.keys(S.months).sort();
  return '<select class="inp top-month" id="sel-month" aria-label="Mês de referência">'+ks.map(k=>'<option value="'+k+'"'+(k===S.cur?' selected':'')+'>'+mLabel(k)+'</option>').join('')+'</select>';
}

function render(){
  renderShell();
  const v=document.getElementById('view');
  v.innerHTML=({home:vHome,import:vImport,mes:vMes,resultado:vResultado,servicos:vServicos,produtos:vProdutos}[view]||vHome)();
  afterRender();
}
let afterFns=[]; function after(f){afterFns.push(f)}
function afterRender(){const f=afterFns;afterFns=[];f.forEach(x=>x())}

/* ================= INÍCIO / CAPA ================= */
function vHome(){
  const c=S.company, mc=calcMonth(), r=rates();
  const sv=S.services.map(s=>calcSvc(s,r)); const red=sv.filter(x=>light(x.resP)==='s-bad').length;
  const pePct=mc.PE?mc.F/mc.PE:NaN;
  const bgStyle=c.photo?' photo" style="background-image:url('+c.photo+')':'';
  let h='<div class="stack">';
  h+='<section class="cover" aria-label="Capa">'+
     '<div class="bg'+bgStyle+'"></div>'+
     (c.photo?'':'<svg class="curves" viewBox="0 0 200 120" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round"><path d="M14 110V40a26 26 0 0 1 52 0v30a26 26 0 0 0 52 0V40a26 26 0 0 1 52 0v70"/></svg>')+
     '<div class="cover-top"><span class="eyebrow">'+I('sparkle')+'Precificação</span><button class="glass" data-act="edit-cover">'+I('edit')+'Editar capa</button></div>'+
     '<div><div class="lockup">'+
       '<button class="logo-slot'+(c.logo?'':' empty')+'" data-act="pick-logo" aria-label="'+(c.logo?'Trocar a logo da empresa':'Colocar a logo da empresa')+'">'+(c.logo?'<img src="'+c.logo+'" alt="Logo da empresa" onload="this.classList.toggle(\'wide\',this.naturalWidth>this.naturalHeight*1.4)">':I('camera')+(window.matchMedia&&matchMedia('(hover: hover)').matches?'Clique':'Toque')+' para colocar sua logo')+'</button>'+
       '<div class="lock-txt"><div class="lock-name">'+esc(c.name||'Nome da sua empresa')+'</div><div class="lock-by">by '+LOGO(34,true)+'</div></div>'+
     '</div><div class="cover-sub">Descubra quanto sobra de cada serviço, qual é o seu ponto de equilíbrio e quanto precisa faturar para chegar no lucro que você quer.</div></div>'+
  '</section>';
  if(S.example){
    h+='<div class="example">'+I('info')+'<div><b>Você está vendo um exemplo.</b> Os números são fictícios, só para mostrar como funciona.</div><div class="row"><button class="btn sm pri" data-go="import">'+I('upload')+'Importar meus dados</button><button class="btn sm ghost" data-act="start-blank">Começar do zero</button></div></div>';
  }
  h+='<div class="row" style="justify-content:space-between"><h2 style="font-size:1.1rem;font-weight:800">Como está '+esc(mLabel(S.cur).toLowerCase())+'</h2></div>';
  const pk=Object.keys(S.months).sort().filter(k=>k<S.cur).pop(), pc=pk?calcMonth(S.months[pk]):null;
  const dlt=(a,b)=>{ if(!pc||!pc.F||!b)return ''; const v=(a-b)/Math.abs(b); if(!isFinite(v))return ''; const up=v>=0;
    return '<span class="delta '+(up?'up':'down')+'" title="Comparado com '+mLabel(pk)+'">'+(up?'↑':'↓')+' '+pct(Math.abs(v),0)+' vs '+mLabel(pk).slice(0,3).toLowerCase()+'</span>'; };
  h+='<div class="kpis">'+
    '<button class="kpi clk" data-go="mes"><span class="lrow"><span class="label">Faturamento</span>'+dlt(mc.F,pc&&pc.F)+'</span><span class="v">'+brl(mc.F,0)+'</span><span class="d">Custos: '+brl(mc.CF+mc.CV,0)+'</span></button>'+
    '<button class="kpi clk" data-go="resultado"><span class="lrow"><span class="label">Lucro do mês</span>'+dlt(mc.R,pc&&pc.R)+'</span><span class="v">'+brl(mc.R,0)+'</span><span class="d">'+pill(mc.rP,pct(mc.rP)+' · '+LTXT[light(mc.rP)])+' meta '+S.params.target+'%</span></button>'+
    '<button class="kpi clk" data-go="resultado"><span class="label">Ponto de equilíbrio</span><span class="v">'+(mc.PE?brl(mc.PE,0):'—')+'</span><span class="d">'+(mc.PE?(mc.F>=mc.PE?'<span class="pill s-ok"><i></i>Acima do equilíbrio</span>':'<span class="pill s-bad"><i></i>Abaixo do equilíbrio</span>'):'Preencha o mês')+'</span></button>'+
    '<button class="kpi clk" data-go="servicos" data-f="bad"><span class="label">Serviços no vermelho</span><span class="v">'+red+' <span class="muted" style="font-size:1rem">de '+S.services.length+'</span></span><span class="d">'+(red?'<span class="pill s-bad"><i></i>Rever preço</span>':'<span class="pill s-ok"><i></i>Tudo certo</span>')+'</span></button>'+
  '</div>';
  const st=[
    ['import','Importar do Trinks ou Avec','Faturamento, despesas e lista de serviços','upload','#0EA5E9'],
    ['mes','Conferir o mês','Faturamento, custos fixos e variáveis','wallet','#16A34A'],
    ['resultado','Ver o resultado','Lucro, ponto de equilíbrio e objetivo','chart','#8B5CF6'],
    ['servicos','Precificar serviços','Quanto sobra de cada serviço e preço sugerido','scissors','#FF3D6E'],
    ['produtos','Precificar produtos','Margem dos produtos de revenda','bottle','#F97316']
  ];
  h+='<h2 style="font-size:1.1rem;font-weight:800;margin-top:6px">Passo a passo</h2><div class="steps">'+st.map((s,i)=>'<button class="step" data-go="'+s[0]+'"><span class="bub">'+I(s[3])+'<span class="n">'+(i+1)+'</span></span><span><b>'+s[1]+'</b><small>'+s[2]+'</small></span><span class="go">'+I('next')+'</span></button>').join('')+'</div>';
  h+='<details class="box"><summary><span class="t">Como a conta é feita</span><span class="r">'+I('chev','chev')+'</span></summary><div class="in" style="font-size:.9rem;display:grid;gap:8px">'+
     '<p style="margin:0"><b>Custos variáveis</b> mudam conforme você atende: comissão, produto usado, taxa de cartão e imposto. <b>Custos fixos</b> chegam todo mês, atendendo ou não: aluguel, luz, salários, sistema.</p>'+
     '<p style="margin:0"><b>Margem operacional</b> = faturamento − custos variáveis. É o que sobra para pagar os fixos e dar lucro.</p>'+
     '<p style="margin:0"><b>Ponto de equilíbrio</b> = custos fixos ÷ margem operacional %. Abaixo dele a empresa paga para trabalhar.</p>'+
     '<p style="margin:0"><b>Faturamento necessário</b> = (lucro desejado + custos fixos) ÷ margem operacional %.</p>'+
     '<p style="margin:0"><b>Em cada serviço</b>, o imposto incide sobre a parte do salão (preço − comissão), a taxa de cartão usa a média do mês e os custos fixos entram pelo mesmo % que pesam no faturamento. O semáforo usa a meta de '+S.params.target+'% de lucro: verde a partir de '+(S.params.target-0.1).toLocaleString('pt-BR')+'%, amarelo até 3 pontos abaixo, vermelho abaixo disso.</p>'+
  '</div></details>';
  h+='<details class="box"><summary><span class="t">Baixar e guardar</span><span class="r"><span class="muted small">Excel e cópia de segurança</span>'+I('chev','chev')+'</span></summary><div class="in stack">'+
     '<p class="muted small" style="margin:0">Seus dados ficam guardados na sua conta e aparecem em qualquer aparelho em que você entrar. Se quiser, baixe uma cópia de segurança em arquivo.</p>'+
     '<div class="row"><button class="btn pri" data-act="export-xlsx">'+I('download')+'Baixar planilha Excel</button><button class="btn sec" data-act="backup">'+I('copy')+'Baixar cópia de segurança</button><button class="btn ghost" data-act="restore">'+I('upload')+'Restaurar cópia</button></div>'+
     '<div id="dl-msg" class="small muted"></div>'+
     (S.example?'':'<div><button class="btn sm danger" data-act="ask-reset">'+I('trash')+'Apagar tudo e recomeçar</button></div><div id="reset-box"></div>')+
  '</div></details>';
  h+='<div class="cta"><div>'+LOGO(26,true)+'<p>Quer a gestão completa do seu salão, com metas, equipe e financeiro conciliado? Conheça o MISH Business.</p></div><a class="btn" href="https://www.instagram.com/eusouisraelmesquita/" target="_blank" rel="noopener">Falar com a MISH '+I('next')+'</a></div>';
  return h+'</div>';
}

/* ================= MÊS ================= */
function vMes(){
  const m=M(), c=calcMonth(m);
  const ks=Object.keys(S.months);
  let h=head('wallet','Faturamento e custos do mês','Os números que sustentam toda a precificação.');
  h+=guide('<b>O que fazer aqui:</b> confira o faturamento e cada custo do mês. Tudo é salvo sozinho quando você sai do campo. Para puxar do sistema, use <b>Importar</b>.');
  h+='<div class="stack">';
  h+='<div class="card row" style="justify-content:space-between"><div class="row"><b>'+esc(mLabel(S.cur))+'</b></div><div class="row"><button class="btn sm sec" data-act="new-month">'+I('plus')+'Novo mês</button>'+(ks.length>1?'<button class="btn sm danger" data-act="ask-del-month">'+I('trash')+'Excluir mês</button>':'')+'</div><div id="delmonth-box" style="width:100%"></div></div>';
  h+='<div class="grid2"><div class="card stack"><label class="field"><span>Faturamento bruto do mês (R$)</span><input class="inp money big" id="m-fat" inputmode="decimal" data-bind="fat" value="'+num2(m.fat)+'"></label><div class="small muted">Tudo o que entrou: serviços + produtos + pacotes, antes de tirar taxas e impostos.</div></div>'+
       '<div class="card stack"><label class="field"><span>Lucro que você quer no mês (R$)</span><input class="inp money big" id="m-goal" inputmode="decimal" data-bind="goal" value="'+num2(m.goal)+'"></label><div class="small muted">Usado para calcular o faturamento necessário em Resultado.</div></div></div>';
  const list=(arr,kind,title,tot,p)=>{
    let s='<details class="box" open><summary><span class="t">'+title+'</span><span class="r"><b>'+brl(tot)+'</b><span class="pill s-none">'+pct(p)+' do fat.</span>'+I('chev','chev')+'</span></summary><div class="in">';
    s+=arr.map(x=>'<div class="costrow"><div><input class="inp" id="n-'+x.id+'" data-cname="'+kind+':'+x.id+'" value="'+esc(x.name)+'" aria-label="Nome do custo">'+(x.key==='cartao'?'<div class="tag">Usado na taxa de cartão dos serviços</div>':'')+'</div><input class="inp money" id="v-'+x.id+'" inputmode="decimal" data-cval="'+kind+':'+x.id+'" value="'+num2(x.val)+'" aria-label="Valor de '+esc(x.name)+'"><button class="xbtn" data-act="del-cost" data-id="'+kind+':'+x.id+'" aria-label="Excluir '+esc(x.name)+'">'+I('trash')+'</button></div>').join('');
    s+='<div class="row" style="margin-top:10px"><button class="btn sm sec" data-act="add-cost" data-kind="'+kind+'">'+I('plus')+'Adicionar custo '+(kind==='f'?'fixo':'variável')+'</button></div>';
    s+='<div class="totrow"><span>Total</span><span>'+brl(tot)+'</span></div></div></details>';
    return s;
  };
  h+='<div class="cols2">'+list(m.fixed,'f','Custos fixos',c.CF,c.cfP)+list(m.variable,'v','Custos variáveis',c.CV,c.cvP)+'</div>';
  h+='<div class="row" style="justify-content:flex-end"><button class="btn pri" data-go="resultado">Ver resultado '+I('next')+'</button></div>';
  return h+'</div>';
}

/* ================= RESULTADO ================= */
function vResultado(){
  const m=M(), c=calcMonth(m), s=light(c.rP), t=S.params.target;
  let h=head('chart','Resultado do mês','Lucro, ponto de equilíbrio e quanto falta para o seu objetivo.');
  h+=guide('<b>Como ler:</b> verde é lucro a partir de '+t+'%, amarelo é atenção e vermelho pede ação. Os números vêm da tela <b>Mês</b>.');
  h+='<div class="stack">';
  if(!c.F){ return h+'<div class="card empty"><b>Sem faturamento neste mês</b>Preencha o faturamento e os custos para ver o resultado.<div style="margin-top:12px"><button class="btn pri" data-go="mes">Preencher o mês</button></div></div></div>'; }
  h+='<div class="card hero '+s+'"><div class="big">'+pct(c.rP)+'</div><div><span class="pill '+s+'"><i></i>'+LTXT[s]+' · meta '+t+'%</span><p>Lucro do mês: <b>'+brl(c.R)+'</b></p><p>Faturamento '+brl(c.F,0)+' − custos '+brl(c.CV+c.CF,0)+'</p></div></div>';
  const per=v=>Math.max(0,v/c.F*100);
  const cvw=per(c.CV), cfw=per(c.CF), lw=Math.max(0,100-cvw-cfw);
  h+='<div class="cols2"><div class="card"><h3 style="font-size:1rem">De cada R$ 100 que entram</h3><div class="split" role="img" aria-label="Divisão do faturamento">'+
     '<div style="width:'+Math.min(100,cvw)+'%;background:'+COL.cv+'">'+(cvw>12?'R$ '+cvw.toFixed(0):'')+'</div>'+
     '<div style="width:'+Math.min(100-Math.min(100,cvw),cfw)+'%;background:'+COL.cf+'">'+(cfw>12?'R$ '+cfw.toFixed(0):'')+'</div>'+
     '<div style="width:'+lw+'%;background:'+COL.lucro+'">'+(lw>12?'R$ '+lw.toFixed(0):'')+'</div></div>'+
     '<div class="legend"><div><i style="background:'+COL.cv+'"></i>Custos variáveis (comissão, produto, cartão, imposto)<b>R$ '+(c.CV/c.F*100).toFixed(2).replace('.',',')+'</b></div>'+
     '<div><i style="background:'+COL.cf+'"></i>Custos fixos (aluguel, salários, contas)<b>R$ '+(c.CF/c.F*100).toFixed(2).replace('.',',')+'</b></div>'+
     '<div><i style="background:'+COL.lucro+'"></i>'+(c.R>=0?'Lucro que fica na empresa':'Prejuízo')+'<b>R$ '+(c.R/c.F*100).toFixed(2).replace('.',',')+'</b></div></div></div>';
  h+='<details class="box" open><summary><span class="t">DRE · Demonstrativo de resultado</span><span class="r">'+I('chev','chev')+'</span></summary><div class="in"><table class="dre"><tbody>'+
     '<tr><td>(+) Faturamento</td><td>'+brl(c.F,2)+'</td><td>100%</td></tr>'+
     '<tr><td>(−) Custos variáveis</td><td>'+brl(c.CV,2)+'</td><td>'+pct(c.cvP)+'</td></tr>'+
     '<tr class="sum"><td>= Margem operacional</td><td>'+brl(c.MO,2)+'</td><td>'+pct(c.moP)+'</td></tr>'+
     '<tr><td>(−) Custos fixos</td><td>'+brl(c.CF,2)+'</td><td>'+pct(c.cfP)+'</td></tr>'+
     '<tr class="sum"><td>= Resultado</td><td>'+brl(c.R,2)+'</td><td>'+pct(c.rP)+'</td></tr></tbody></table></div></details></div>';
  // ponto de equilíbrio
  if(c.PE){
    const mx=Math.max(c.F,c.PE,c.need||0)*1.08; const xF=c.F/mx*100, xPE=c.PE/mx*100;
    const ok=c.F>=c.PE;
    h+='<div class="grid2"><div class="card"><span class="label">Ponto de equilíbrio</span><div class="bigline">'+brl(c.PE,0)+'</div><p class="muted small" style="margin:4px 0 0">É o mínimo para pagar todas as contas. Acima disso, de cada real faturado sobram '+pct(c.moP,0)+' para pagar os fixos e virar lucro.</p>'+
       '<div class="meter"><div class="fill" style="width:'+xF+'%;background:'+(ok?'var(--okdot)':'var(--baddot)')+'"></div><div class="mk" style="left:'+xPE+'%"><span>Equilíbrio</span></div><div class="mk b" style="left:'+xF+'%;background:transparent"><span>Você: '+brl(c.F,0)+'</span></div></div>'+
       '<span class="pill '+(ok?'s-ok':'s-bad')+'"><i></i>'+(ok?'Faturando '+brl(c.F-c.PE,0)+' acima':'Faltam '+brl(c.PE-c.F,0)+' para empatar')+'</span></div>';
    // objetivo
    const gap=c.need-c.F; const days=Number(S.params.days)||26;
    h+='<div class="card stack"><div><span class="label">Objetivo de lucro</span><label class="field" style="margin-top:6px"><span>Quanto você quer de lucro no mês (R$)</span><input class="inp money" id="r-goal" inputmode="decimal" data-bind="goal" value="'+num2(c.goal)+'"></label></div>'+
       (c.goal>0?'<div><span class="label">Faturamento necessário</span><div class="bigline">'+brl(c.need,0)+'</div><p class="muted small" style="margin:4px 0 0">Lucro desejado ÷ margem ('+brl(c.goal/c.moP,0)+') + ponto de equilíbrio ('+brl(c.PE,0)+').</p></div>'+
       '<div class="row"><span class="pill '+(gap<=0?'s-ok':'s-warn')+'"><i></i>'+(gap<=0?'Objetivo alcançado':'Faltam '+brl(gap,0)+' no mês')+'</span><span class="pill s-none">≈ '+brl(c.need/days,0)+' por dia em '+days+' dias</span></div>'+
       '<label class="field" style="max-width:200px"><span>Dias de trabalho no mês</span><input class="inp" id="r-days" inputmode="numeric" data-param="days" value="'+days+'"></label>'
       :'<p class="muted small" style="margin:0">Digite o lucro que você quer para ver o faturamento necessário.</p>')+
    '</div></div>';
  } else {
    h+='<div class="card" style="border-color:var(--baddot)"><span class="pill s-bad"><i></i>Margem operacional negativa</span><p style="margin:8px 0 0">Os custos variáveis passam do faturamento. Não existe ponto de equilíbrio enquanto comissão, produto, cartão e imposto consumirem tudo que entra. Revise comissões e preços em <b>Serviços</b>.</p></div>';
  }
  h+='<div class="row" style="justify-content:space-between"><button class="btn ghost" data-go="mes">'+I('back')+'Ajustar o mês</button><button class="btn pri" data-go="servicos">Precificar serviços '+I('next')+'</button></div>';
  return h+'</div>';
}

/* ================= SERVIÇOS ================= */
function paramsBox(kind){
  const r=rates(), p=S.params;
  return '<details class="box" id="params-box"'+(vstate.paramsOpen?' open':'')+'><summary><span class="t">Taxas usadas no cálculo</span><span class="r"><span class="muted small">Imposto '+p.tax+'% · Cartão '+pct(r.card)+(kind==='s'?' · Fixos '+pct(r.cf):'')+' · Meta '+p.target+'%</span>'+I('chev','chev')+'</span></summary><div class="in stack">'+
    '<div class="grid3">'+
    '<label class="field"><span>Imposto (%)</span><input class="inp" id="p-tax" inputmode="decimal" data-param="tax" value="'+String(p.tax).replace('.',',')+'"></label>'+
    '<label class="field"><span>Meta de lucro (%)</span><input class="inp" id="p-target" inputmode="decimal" data-param="target" value="'+String(p.target).replace('.',',')+'"></label>'+
    '<label class="field"><span>Comissão padrão de novos serviços (%)</span><input class="inp" id="p-comm" inputmode="decimal" data-param="commDef" value="'+String(p.commDef).replace('.',',')+'"></label>'+
    '</div>'+
    '<div class="stack" style="gap:8px"><span class="label">Taxa de cartão</span><div class="seg" role="group"><button data-act="card-auto" class="'+(p.cardAuto?'on':'')+'">Média do mês ('+pct(r.cardAutoV)+')</button><button data-act="card-manual" class="'+(p.cardAuto?'':'on')+'">Digitar</button></div>'+
    (p.cardAuto?'<div class="small muted">Taxa de cartão do mês ÷ faturamento, igual à planilha.</div>':'<label class="field" style="max-width:200px"><span>Taxa de cartão (%)</span><input class="inp" id="p-card" inputmode="decimal" data-param="card" value="'+String(p.card).replace('.',',')+'"></label>')+'</div>'+
    (kind==='s'?'<div class="small muted">Custos fixos: <b>'+pct(r.cf)+'</b> do faturamento de '+mLabel(S.cur)+'. Cada serviço carrega essa parte das contas fixas. Mude em <button class="btn sm ghost" data-go="mes" style="min-height:30px;padding:3px 10px">Mês</button></div>':'')+
  '</div></details>';
}
function vServicos(){
  const r=rates(); const f=vstate.f||'all', cat=vstate.cat||'all', q=norm(vstate.q||'');
  const all=S.services.map(s=>({s,c:calcSvc(s,r)}));
  const cnt={ok:0,warn:0,bad:0}; all.forEach(x=>{const l=light(x.c.resP);if(l==='s-ok')cnt.ok++;else if(l==='s-warn')cnt.warn++;else if(l==='s-bad')cnt.bad++});
  let h=head('scissors','Precificação de serviços','Quanto sobra de cada serviço depois de comissão, produto, cartão, imposto e custos fixos.');
  h+=guide('<b>O que fazer aqui:</b> toque em um serviço para ajustar preço, comissão e a ficha técnica de produtos. O <b>preço sugerido</b> é o que entrega a meta de '+S.params.target+'% de lucro.');
  h+='<div class="sumchips">'+
     '<button data-sf="all" class="'+(f==='all'?'on':'')+'"><b>'+all.length+'</b><span>Serviços</span></button>'+
     '<button data-sf="ok" class="'+(f==='ok'?'on':'')+'"><b style="color:var(--ok)">'+cnt.ok+'</b><span>Saudáveis</span></button>'+
     '<button data-sf="warn" class="'+(f==='warn'?'on':'')+'"><b style="color:var(--warn)">'+cnt.warn+'</b><span>Atenção</span></button>'+
     '<button data-sf="bad" class="'+(f==='bad'?'on':'')+'"><b style="color:var(--bad)">'+cnt.bad+'</b><span>Críticos</span></button></div>';
  h+='<div class="stack">'+paramsBox('s');
  h+='<div class="toolbar"><input class="inp" id="svc-q" placeholder="Buscar serviço" value="'+esc(vstate.q||'')+'" aria-label="Buscar serviço"><button class="btn pri" data-act="new-svc">'+I('plus')+'Novo serviço</button></div>';
  const cats=[...new Set(S.cats.concat(S.services.map(s=>s.cat||'Sem categoria')))];
  h+='<div class="chips"><button class="chip'+(cat==='all'?' on':'')+'" data-cat="all">Todas</button>'+cats.map(c=>'<button class="chip'+(cat===c?' on':'')+'" data-cat="'+esc(c)+'">'+esc(c)+'</button>').join('')+'</div>';
  const fl=all.filter(x=>(f==='all'||light(x.c.resP)==='s-'+f)&&(cat==='all'||(x.s.cat||'Sem categoria')===cat)&&(!q||norm(x.s.name).includes(q)));
  if(!S.services.length){ h+='<div class="card empty"><b>Nenhum serviço ainda</b>Importe a lista de serviços do Trinks ou Avec, ou cadastre o primeiro.<div class="row" style="justify-content:center;margin-top:12px"><button class="btn pri" data-act="new-svc">'+I('plus')+'Novo serviço</button><button class="btn sec" data-go="import">'+I('upload')+'Importar lista</button></div></div>'; return h+'</div>'; }
  if(!fl.length){ h+='<div class="card empty"><b>Nada encontrado</b>Nenhum serviço com esse filtro.</div>'; return h+'</div>'; }
  const groups={}; fl.forEach(x=>{const g=x.s.cat||'Sem categoria';(groups[g]=groups[g]||[]).push(x)});
  Object.keys(groups).forEach(g=>{
    const arr=groups[g].sort((a,b)=>a.c.resP-b.c.resP);
    h+='<details class="box" open><summary><span class="t">'+esc(g)+'</span><span class="r"><span class="muted small">'+arr.length+' serviço'+(arr.length>1?'s':'')+'</span>'+I('chev','chev')+'</span></summary><div class="in">'+
      arr.map(x=>{const lw=light(x.c.resP)!=='s-ok';return '<button class="svc" data-act="edit-svc" data-id="'+x.s.id+'"><span class="nm">'+esc(x.s.name)+'</span><span class="pr">'+brl(x.c.P,2)+'</span>'+
       '<span class="meta">Sobra <b>'+brl(x.c.res,2)+'</b> · comissão '+String(x.s.comm).replace('.',',')+'% · produto '+brl(x.c.prod,2)+(lw&&x.c.sug?' · sugerido <b>'+brl(Math.ceil(x.c.sug),0)+'</b>':'')+(lw&&!x.c.sug?' · <b style="color:var(--bad)">comissão alta demais para a meta</b>':'')+'</span>'+pill(x.c.resP)+'</button>'}).join('')+'</div></details>';
  });
  return h+'</div>';
}

/* ================= PRODUTOS ================= */
function vProdutos(){
  const r=rates();
  let h=head('bottle','Precificação de produtos','Margem dos produtos que você revende no balcão.');
  h+=guide('<b>O que fazer aqui:</b> informe o preço de venda, quanto você paga no produto e a comissão de quem vende. O sistema mostra quanto sobra e o preço sugerido para a meta de '+S.params.target+'%.');
  h+='<div class="stack">'+paramsBox('p');
  h+='<div class="toolbar"><input class="inp" id="prd-q" placeholder="Buscar produto" value="'+esc(vstate.q||'')+'" aria-label="Buscar produto"><button class="btn pri" data-act="new-prd">'+I('plus')+'Novo produto</button></div>';
  const q=norm(vstate.q||''); const fl=S.products.filter(p=>!q||norm(p.name).includes(q));
  if(!S.products.length) return h+'<div class="card empty"><b>Nenhum produto ainda</b>Cadastre os produtos que você vende para ver a margem de cada um.<div style="margin-top:12px"><button class="btn pri" data-act="new-prd">'+I('plus')+'Novo produto</button></div></div></div>';
  h+='<div class="card">'+(fl.length?fl.map(p=>{const c=calcProd(p,r);const lw=light(c.resP)!=='s-ok';return '<button class="svc" data-act="edit-prd" data-id="'+p.id+'"><span class="nm">'+esc(p.name)+'</span><span class="pr">'+brl(c.P,2)+'</span><span class="meta">Custo '+brl(c.cost,2)+' · sobra <b>'+brl(c.res,2)+'</b>'+(lw&&c.sug?' · sugerido <b>'+brl(Math.ceil(c.sug),0)+'</b>':'')+'</span>'+pill(c.resP)+'</button>'}).join(''):'<div class="empty">Nenhum produto com esse nome.</div>')+'</div>';
  return h+'</div>';
}

/* ================= folhas (modais) ================= */
const ov=document.getElementById('ov'), sheet=document.getElementById('sheet');
let draft=null, sheetKind='';
function openSheet(kind,html){ sheetKind=kind; sheet.innerHTML=html; ov.hidden=false; document.body.style.overflow='hidden'; const f=sheet.querySelector('input'); if(f&&kind!=='cover')setTimeout(()=>{},0); }
function closeSheet(){ ov.hidden=true; sheet.innerHTML=''; draft=null; sheetKind=''; document.body.style.overflow=''; }
ov.addEventListener('click',e=>{if(e.target===ov)closeSheet()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!ov.hidden)closeSheet()});

function svcSheet(){
  const d=draft, r=rates(), c=calcSvc(d,r), s=light(c.resP);
  const cats=[...new Set(S.cats.concat(d.cat?[d.cat]:[]))];
  const rows=[['Comissão',c.com,COL.com],['Produto usado',c.prod,COL.prod],['Taxa de cartão',c.card,COL.card],['Imposto',c.tax,COL.tax],['Custos fixos',c.cf,COL.cf]];
  const bar=c.P>0?'<div class="split" role="img" aria-label="Para onde vai o preço">'+rows.map(x=>{const w=Math.max(0,x[1]/c.P*100);return '<div style="width:'+w+'%;background:'+x[2]+'" title="'+x[0]+'"></div>'}).join('')+'<div style="width:'+Math.max(0,c.res/c.P*100)+'%;background:'+COL.lucro+'">'+(c.res/c.P>0.12?pct(c.resP,0):'')+'</div></div>':'';
  return '<div class="sheet-head"><button class="back" data-act="close">'+I('back')+'Voltar</button><h2>'+(d._new?'Novo serviço':'Editar serviço')+'</h2></div>'+
  '<div class="sheet-body">'+
   '<div class="grid2"><label class="field"><span>Nome do serviço</span><input class="inp" id="d-name" data-d="name" value="'+esc(d.name)+'" placeholder="Ex.: Corte feminino"></label>'+
   '<label class="field"><span>Categoria</span><select class="inp" id="d-cat" data-d="cat">'+cats.map(x=>'<option'+(x===d.cat?' selected':'')+'>'+esc(x)+'</option>').join('')+'<option value="__new">+ Nova categoria…</option></select></label></div>'+
   '<div id="newcat"></div>'+
   '<div class="grid2"><label class="field"><span>Preço (R$)</span><input class="inp money big" id="d-price" inputmode="decimal" data-dn="price" value="'+num2(d.price)+'"></label>'+
   '<label class="field"><span>Comissão do profissional (%)</span><input class="inp money big" id="d-comm" inputmode="decimal" data-dn="comm" value="'+String(d.comm).replace('.',',')+'"></label></div>'+
   '<div class="card stack"><div class="row" style="justify-content:space-between"><span class="label">Custo de produto por atendimento</span><div class="seg"><button data-act="mode-manual" class="'+(d.mode==='manual'?'on':'')+'">Valor direto</button><button data-act="mode-ficha" class="'+(d.mode==='ficha'?'on':'')+'">Ficha técnica</button></div></div>'+
   (d.mode==='manual'?'<label class="field" style="max-width:240px"><span>Custo de produto (R$)</span><input class="inp money" id="d-prod" inputmode="decimal" data-dn="prodCost" value="'+num2(d.prodCost)+'"></label><div class="small muted">Não sabe? Use a ficha técnica: produto por produto, quanto custa e quanto vai em cada atendimento.</div>':
    '<div class="ficha">'+(d.ficha.length?d.ficha.map(f=>{const pk=Number(f.pack)||0;const cu=pk?(Number(f.cost)||0)/pk*(Number(f.used)||0):0;return '<div class="frow">'+
      '<label class="field f-name"><span>Produto</span><input class="inp" id="fn-'+f.id+'" data-f="'+f.id+':name" value="'+esc(f.name)+'" placeholder="Ex.: Oxidante"></label>'+
      '<label class="field"><span>Preço pago (R$)</span><input class="inp" id="fc-'+f.id+'" inputmode="decimal" data-fn="'+f.id+':cost" value="'+num2(f.cost)+'"></label>'+
      '<label class="field"><span>Qtd. na embalagem</span><input class="inp" id="fp-'+f.id+'" inputmode="decimal" data-fn="'+f.id+':pack" value="'+String(f.pack).replace('.',',')+'"></label>'+
      '<label class="field"><span>Unidade</span><select class="inp" id="fu-'+f.id+'" data-f="'+f.id+':unit">'+['ml','g','un'].map(u=>'<option'+(u===f.unit?' selected':'')+'>'+u+'</option>').join('')+'</select></label>'+
      '<label class="field"><span>Usa por serviço</span><input class="inp" id="fq-'+f.id+'" inputmode="decimal" data-fn="'+f.id+':used" value="'+String(f.used).replace('.',',')+'"></label>'+
      '<button class="xbtn" data-act="del-ficha" data-id="'+f.id+'" aria-label="Remover produto">'+I('trash')+'</button>'+
      '<div class="cost"><span>'+brl((Number(f.cost)||0)/(pk||1),4).replace('R$ ','R$ ')+' por '+esc(f.unit)+'</span><span>Custo no serviço: <b>'+brl(cu,2)+'</b></span></div></div>'}).join(''):'<div class="small muted">Nenhum produto na ficha ainda.</div>')+
    '<div class="row" style="justify-content:space-between"><button class="btn sm sec" data-act="add-ficha">'+I('plus')+'Adicionar produto</button><b>Total: '+brl(c.prod,2)+'</b></div></div>')+
   '</div>'+
   '<div class="card stack"><div class="row" style="justify-content:space-between"><span class="label">Para onde vai o preço</span><span class="pill '+s+'"><i></i>Sobra '+pct(c.resP)+' · '+LTXT[s]+'</span></div>'+bar+
   '<table class="brk"><tbody>'+rows.map(x=>'<tr><td><i style="background:'+x[2]+'"></i>'+x[0]+'</td><td>'+brl(x[1],2)+'</td><td>'+pct(c.P?x[1]/c.P:NaN)+'</td></tr>').join('')+
   '<tr class="res"><td><i style="background:'+COL.lucro+'"></i>Lucro do serviço</td><td>'+brl(c.res,2)+'</td><td>'+pct(c.resP)+'</td></tr></tbody></table>'+
   '<div class="small muted">Margem operacional (antes dos fixos): '+brl(c.mo,2)+' · '+pct(c.moP)+'</div></div>'+
   (c.sug?'<div class="sugg"><div><span class="label">Preço sugerido para '+S.params.target+'% de lucro</span><br><b>'+brl(Math.ceil(c.sug),2)+'</b></div>'+(Math.abs(Math.ceil(c.sug)-c.P)>=1?'<button class="btn sm pri" data-act="use-sug" style="margin-left:auto">Usar este preço</button>':'<span class="pill s-ok" style="margin-left:auto"><i></i>Preço no ponto</span>')+'</div>':
    '<div class="sugg" style="border-color:var(--baddot)"><div><span class="label">Sem preço possível</span><br>Com comissão de '+String(d.comm).replace('.',',')+'%, imposto, cartão e custos fixos, nenhum preço chega a '+S.params.target+'% de lucro. Reduza a comissão ou os custos fixos.</div></div>')+
   '<div id="del-box"></div>'+
  '</div>'+
  '<div class="sheet-foot"><button class="btn pri" data-act="save-svc">'+I('check')+'Salvar</button><button class="btn ghost" data-act="close">Cancelar</button><span class="grow"></span>'+(d._new?'':'<button class="btn danger" data-act="ask-del" data-what="svc">'+I('trash')+'Excluir</button>')+'</div>';
}
function prdSheet(){
  const d=draft, r=rates(), c=calcProd(d,r), s=light(c.resP);
  const rows=[['Custo do produto',c.cost,COL.prod],['Comissão',c.com,COL.com],['Taxa de cartão',c.card,COL.card],['Imposto',c.tax,COL.tax]];
  const bar=c.P>0?'<div class="split">'+rows.map(x=>'<div style="width:'+Math.max(0,x[1]/c.P*100)+'%;background:'+x[2]+'"></div>').join('')+'<div style="width:'+Math.max(0,c.res/c.P*100)+'%;background:'+COL.lucro+'">'+(c.res/c.P>0.12?pct(c.resP,0):'')+'</div></div>':'';
  return '<div class="sheet-head"><button class="back" data-act="close">'+I('back')+'Voltar</button><h2>'+(d._new?'Novo produto':'Editar produto')+'</h2></div>'+
  '<div class="sheet-body">'+
   '<label class="field"><span>Nome do produto</span><input class="inp" id="d-name" data-d="name" value="'+esc(d.name)+'" placeholder="Ex.: Shampoo 300 ml"></label>'+
   '<div class="grid3"><label class="field"><span>Preço de venda (R$)</span><input class="inp money big" id="d-price" inputmode="decimal" data-dn="price" value="'+num2(d.price)+'"></label>'+
   '<label class="field"><span>Quanto você paga (R$)</span><input class="inp money big" id="d-cost" inputmode="decimal" data-dn="cost" value="'+num2(d.cost)+'"></label>'+
   '<label class="field"><span>Comissão de venda (%)</span><input class="inp money big" id="d-comm" inputmode="decimal" data-dn="comm" value="'+String(d.comm).replace('.',',')+'"></label></div>'+
   '<div class="card stack"><div class="row" style="justify-content:space-between"><span class="label">Para onde vai o preço</span><span class="pill '+s+'"><i></i>Sobra '+pct(c.resP)+' · '+LTXT[s]+'</span></div>'+bar+
   '<table class="brk"><tbody>'+rows.map(x=>'<tr><td><i style="background:'+x[2]+'"></i>'+x[0]+'</td><td>'+brl(x[1],2)+'</td><td>'+pct(c.P?x[1]/c.P:NaN)+'</td></tr>').join('')+
   '<tr class="res"><td><i style="background:'+COL.lucro+'"></i>Lucro do produto</td><td>'+brl(c.res,2)+'</td><td>'+pct(c.resP)+'</td></tr></tbody></table></div>'+
   (c.sug?'<div class="sugg"><div><span class="label">Preço sugerido para '+S.params.target+'% de lucro</span><br><b>'+brl(Math.ceil(c.sug),2)+'</b></div>'+(Math.abs(Math.ceil(c.sug)-c.P)>=1?'<button class="btn sm pri" data-act="use-sug" style="margin-left:auto">Usar este preço</button>':'<span class="pill s-ok" style="margin-left:auto"><i></i>Preço no ponto</span>')+'</div>':'')+
   '<div id="del-box"></div></div>'+
  '<div class="sheet-foot"><button class="btn pri" data-act="save-prd">'+I('check')+'Salvar</button><button class="btn ghost" data-act="close">Cancelar</button><span class="grow"></span>'+(d._new?'':'<button class="btn danger" data-act="ask-del" data-what="prd">'+I('trash')+'Excluir</button>')+'</div>';
}
function coverSheet(){
  const d=draft;
  return '<div class="sheet-head"><button class="back" data-act="close">'+I('back')+'Voltar</button><h2>Capa da empresa</h2></div>'+
  '<div class="sheet-body">'+
   '<label class="field"><span>Nome da empresa</span><input class="inp" id="c-name" data-c="name" value="'+esc(d.name)+'" placeholder="Ex.: Studio Bella"></label>'+
   '<div class="card row" style="gap:14px"><div class="logo-slot'+(d.logo?'':' empty')+'" style="width:76px;height:76px;border-radius:20px;'+(d.logo?'':'background:var(--soft);border-color:var(--line);color:var(--sub)')+'">'+(d.logo?'<img src="'+d.logo+'" alt="Logo">':I('image'))+'</div><div class="stack" style="gap:6px;flex:1;min-width:0"><b>Logo da empresa</b><span class="small muted">PNG com fundo transparente fica melhor.</span><div class="row"><button class="btn sm pri" data-act="pick-logo">'+I('upload')+(d.logo?'Trocar logo':'Escolher logo')+'</button>'+(d.logo?'<button class="btn sm ghost" data-act="rm-logo">Remover</button>':'')+'</div></div></div>'+
   '<div class="card row" style="gap:14px"><div style="width:76px;height:76px;border-radius:20px;flex:none;background:'+(d.photo?'url('+d.photo+') center/cover':'linear-gradient(135deg,#0B2A6B,#0B5CFF)')+'"></div><div class="stack" style="gap:6px;flex:1;min-width:0"><b>Foto de capa</b><span class="small muted">Uma foto do seu salão ou barbearia. Sem foto, a capa fica no azul MISH.</span><div class="row"><button class="btn sm pri" data-act="pick-photo">'+I('camera')+(d.photo?'Trocar foto':'Escolher foto')+'</button>'+(d.photo?'<button class="btn sm ghost" data-act="rm-photo">Remover</button>':'')+'</div></div></div>'+
   '<div class="card" style="background:linear-gradient(135deg,#0B2A6B,#0B5CFF);color:#fff;border:0"><span class="small" style="opacity:.8">Como vai aparecer</span><div style="font-weight:800;font-size:1.4rem;margin-top:4px">'+esc(d.name||'Nome da sua empresa')+'</div><div class="row" style="gap:8px;margin-top:4px">by '+LOGO(24,true)+'</div></div>'+
   (window.MISH_ACCOUNT?'<div class="card row acct"><div class="grow"><span class="small muted">Conectado como</span><div class="acct-mail">'+esc(window.MISH_ACCOUNT.email)+'</div></div><button class="btn sm ghost" data-act="logout">Sair da conta</button></div>':'')+
  '</div>'+
  '<div class="sheet-foot"><button class="btn pri" data-act="save-cover">'+I('check')+'Salvar capa</button><button class="btn ghost" data-act="close">Cancelar</button></div>';
}
function refreshSheet(focusId){
  const html=sheetKind==='svc'?svcSheet():sheetKind==='prd'?prdSheet():sheetKind==='cover'?coverSheet():'';
  const sc=sheet.scrollTop; sheet.innerHTML=html; sheet.scrollTop=sc;
  if(focusId){const el=document.getElementById(focusId); if(el){el.focus(); try{el.select()}catch(e){}}}
}

/* ================= imagens ================= */
function readImage(file,maxW,type,q,trim){
  return new Promise((res,rej)=>{
    const fr=new FileReader(); fr.onerror=rej;
    fr.onload=()=>{const im=new Image(); im.onerror=rej; im.onload=()=>{
      const k=Math.min(1,maxW/Math.max(im.width,im.height)); let cv=document.createElement('canvas');
      cv.width=Math.round(im.width*k); cv.height=Math.round(im.height*k);
      cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);
      if(trim){ try{ /* logo: corta bordas transparentes ou brancas, para o desenho ficar centralizado no quadrado */
        const w=cv.width,h=cv.height,d=cv.getContext('2d').getImageData(0,0,w,h).data;
        const vazio=(x,y)=>{const i=(y*w+x)*4; return d[i+3]<16||(d[i]>245&&d[i+1]>245&&d[i+2]>245)};
        let t=0,b=h-1,l=0,r=w-1;
        const linhaVazia=y=>{for(let x=0;x<w;x++)if(!vazio(x,y))return false;return true};
        const colVazia=x=>{for(let y=t;y<=b;y++)if(!vazio(x,y))return false;return true};
        while(t<b&&linhaVazia(t))t++; while(b>t&&linhaVazia(b))b--;
        while(l<r&&colVazia(l))l++; while(r>l&&colVazia(r))r--;
        const nw=r-l+1,nh=b-t+1;
        if(nw>8&&nh>8&&(nw<w||nh<h)){ const c2=document.createElement('canvas'); c2.width=nw; c2.height=nh; c2.getContext('2d').drawImage(cv,l,t,nw,nh,0,0,nw,nh); cv=c2; }
      }catch(_){} }
      res(cv.toDataURL(type,q));
    }; im.src=fr.result};
    fr.readAsDataURL(file);
  });
}
document.getElementById('f-logo').addEventListener('change',async e=>{
  const f=e.target.files[0]; e.target.value=''; if(!f)return;
  try{const url=await readImage(f,360,'image/png',undefined,true);
    if(sheetKind==='cover'){draft.logo=url;refreshSheet()} else {S.company.logo=url;save('Logo salva');render()}
  }catch(err){save('Não consegui abrir essa imagem. Tente um PNG ou JPG.')}
});
document.getElementById('f-photo').addEventListener('change',async e=>{
  const f=e.target.files[0]; e.target.value=''; if(!f)return;
  try{const url=await readImage(f,1400,'image/jpeg',0.78);
    if(sheetKind==='cover'){draft.photo=url;refreshSheet()} else {S.company.photo=url;save('Foto salva');render()}
  }catch(err){save('Não consegui abrir essa imagem. Tente um JPG.')}
});

/* ================= IMPORTAR ================= */
let IMP=null; // {fileName, sheets:{name:rows}, sheet, hdr, headers, type, map:{}, month, groups, ...}
const SRC_TIPS={
  trinks:'No Trinks, abra o relatório do mês que você quer (faturamento, despesas ou lista de serviços) e use a opção de exportar para Excel. Depois envie o arquivo aqui.',
  avec:'No Avec, abra o relatório do mês (faturamento, despesas ou serviços e preços) e exporte em Excel ou CSV. Depois envie o arquivo aqui.',
  outro:'Serve qualquer planilha com uma coluna de valores: extrato de despesas, fechamento de caixa, lista de serviços com preço ou a planilha de precificação no modelo MISH.'
};
function vImport(){
  const src=vstate.src||'trinks';
  let h=head('upload','Importar do Trinks ou Avec','Traga o faturamento, as despesas e a lista de serviços sem digitar.');
  h+=guide('<b>Passo a passo:</b> 1) exporte o relatório do sistema em Excel ou CSV · 2) envie o arquivo aqui · 3) confira o que vai entrar e toque em <b>Aplicar</b>. Você pode importar um arquivo de faturamento e outro de despesas, um de cada vez.');
  h+='<div class="stack"><div class="srcs" role="group" aria-label="De qual sistema vem o arquivo">'+
     [['trinks','Trinks','Excel'],['avec','Avec','Excel ou CSV'],['outro','Outro','Qualquer planilha']].map(s=>'<button class="src'+(src===s[0]?' on':'')+'" data-src="'+s[0]+'">'+s[1]+'<small>'+s[2]+'</small></button>').join('')+'</div>';
  h+='<p class="small muted" style="margin:0">'+SRC_TIPS[src]+'</p>';
  if(!IMP){
    h+='<div class="drop" id="drop"><span class="bub">'+I('file')+'</span><b>Arraste o arquivo aqui</b><span class="small muted">.xlsx, .xls ou .csv</span><button class="btn pri" data-act="pick-import">'+I('upload')+'Escolher arquivo</button></div>';
    if(vstate.done) h+='<div class="card row" style="border-color:var(--okdot)"><span class="pill s-ok"><i></i>Importado</span><span>'+esc(vstate.done)+'</span><span class="grow" style="flex:1"></span><button class="btn sm sec" data-go="mes">Ver o mês</button><button class="btn sm sec" data-go="servicos">Ver serviços</button></div>';
    return h+'</div>';
  }
  h+=importPanel();
  return h+'</div>';
}
function colOpts(sel,allowNone){
  return (allowNone?'<option value="-1">— não usar —</option>':'')+IMP.headers.map((x,i)=>'<option value="'+i+'"'+(+sel===i?' selected':'')+'>'+esc(x)+'</option>').join('');
}
const TYPES=[['faturamento','Faturamento'],['despesas','Despesas'],['servicos','Serviços e preços'],['mish','Planilha modelo MISH']];
function importPanel(){
  const t=IMP.type, mp=IMP.map;
  let h='<div class="card stack"><div class="row" style="justify-content:space-between"><div><span class="label">Arquivo</span><div style="font-weight:800;word-break:break-all">'+esc(IMP.fileName)+'</div></div><button class="btn sm ghost" data-act="imp-cancel">'+I('x')+'Trocar arquivo</button></div>';
  const sn=Object.keys(IMP.sheets);
  if(sn.length>1) h+='<label class="field" style="max-width:320px"><span>Aba da planilha</span><select class="inp" id="imp-sheet">'+sn.map(s=>'<option'+(s===IMP.sheet?' selected':'')+'>'+esc(s)+'</option>').join('')+'</select></label>';
  h+='<div class="stack" style="gap:6px"><span class="label">O que tem neste arquivo?</span><div class="chips">'+TYPES.map(x=>'<button class="chip'+(t===x[0]?' on':'')+'" data-imptype="'+x[0]+'">'+x[1]+'</button>').join('')+'</div></div>';
  if(t!=='mish'){
    h+='<div class="grid3">';
    if(t==='servicos'){
      h+='<label class="field"><span>Coluna do nome do serviço</span><select class="inp" data-map="name">'+colOpts(mp.name)+'</select></label>';
      h+='<label class="field"><span>Coluna do preço</span><select class="inp" data-map="val">'+colOpts(mp.val)+'</select></label>';
      h+='<label class="field"><span>Coluna da categoria</span><select class="inp" data-map="cat">'+colOpts(mp.cat,true)+'</select></label>';
      h+='<label class="field"><span>Coluna da comissão %</span><select class="inp" data-map="comm">'+colOpts(mp.comm,true)+'</select></label>';
    } else {
      h+='<label class="field"><span>Coluna do valor</span><select class="inp" data-map="val">'+colOpts(mp.val)+'</select></label>';
      h+='<label class="field"><span>'+(t==='despesas'?'Coluna da categoria ou descrição':'Coluna do tipo (serviço, produto…)')+'</span><select class="inp" data-map="desc">'+colOpts(mp.desc,true)+'</select></label>';
      h+='<label class="field"><span>Coluna da data</span><select class="inp" data-map="date">'+colOpts(mp.date,true)+'</select></label>';
    }
    h+='</div>';
  }
  const pv=buildImport();
  IMP.pv=pv;
  if(t!=='servicos'){
    const months=pv.months||[];
    h+='<div class="row"><label class="field" style="min-width:220px"><span>'+(months.length?'Mês do arquivo':'Lançar no mês')+'</span><select class="inp" id="imp-month">'+
      (months.length?months.map(k=>'<option value="'+k+'"'+(k===IMP.month?' selected':'')+'>'+mLabel(k)+' ('+pv.monthCount[k]+' linhas)</option>').join(''):Object.keys(S.months).sort().map(k=>'<option value="'+k+'"'+(k===IMP.month?' selected':'')+'>'+mLabel(k)+'</option>').join(''))+
      '</select></label></div>';
  }
  h+='</div>';
  // prévia
  if(pv.error){ h+='<div class="card" style="border-color:var(--baddot)"><span class="pill s-bad"><i></i>Não deu para ler</span><p style="margin:8px 0 0">'+esc(pv.error)+'</p></div>'; return h; }
  if(t==='faturamento'){
    h+='<div class="card stack"><span class="label">Prévia</span><div class="bigline">'+brl(pv.total,2)+'</div><div class="small muted">'+pv.count+' lançamentos somados'+(pv.skipped?' · '+pv.skipped+' linhas de total ou sem valor ignoradas':'')+'</div>';
    if(pv.byType&&Object.keys(pv.byType).length>1) h+='<div class="tw"><table><thead><tr><th>Tipo</th><th style="text-align:right">Valor</th></tr></thead><tbody>'+Object.entries(pv.byType).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([k,v])=>'<tr><td>'+esc(k)+'</td><td class="num">'+brl(v,2)+'</td></tr>').join('')+'</tbody></table></div>';
    h+='<div class="small muted">Vai substituir o faturamento de '+mLabel(IMP.month)+' (hoje '+brl((S.months[IMP.month]||{fat:0}).fat,2)+').</div></div>';
  } else if(t==='despesas'){
    h+='<div class="card stack"><div class="row" style="justify-content:space-between"><span class="label">Prévia · confira onde cada despesa vai entrar</span><b>'+brl(pv.total,2)+'</b></div>';
    h+='<div class="tw"><table><thead><tr><th>Despesa no arquivo</th><th style="text-align:right">Valor</th><th>Vai para</th></tr></thead><tbody>'+pv.groups.map((g,i)=>'<tr><td style="white-space:normal;min-width:140px">'+esc(g.name)+'<div class="small muted">'+g.n+' lançamento'+(g.n>1?'s':'')+'</div></td><td class="num">'+brl(g.val,2)+'</td><td><select data-gi="'+i+'" aria-label="Destino">'+targetOpts(g.target)+'</select></td></tr>').join('')+'</tbody></table></div>';
    h+='<label class="row small" style="gap:8px"><input type="checkbox" id="imp-add"'+(IMP.add?' checked':'')+'> Somar ao valor que já está no mês (em vez de substituir)</label></div>';
  } else if(t==='servicos'){
    const nw=pv.items.filter(x=>!x.exists).length;
    h+='<div class="card stack"><div class="row" style="justify-content:space-between"><span class="label">Prévia · '+pv.items.length+' serviços</span><span class="small muted">'+nw+' novos · '+(pv.items.length-nw)+' com preço atualizado'+(pv.skipped?' · '+pv.skipped+' sem preço ignorados':'')+'</span></div>';
    h+='<div class="tw"><table><thead><tr><th>Serviço</th><th>Categoria</th><th style="text-align:right">Preço</th><th></th></tr></thead><tbody>'+pv.items.slice(0,80).map(x=>'<tr><td style="white-space:normal">'+esc(x.name)+'</td><td>'+esc(x.cat)+'</td><td class="num">'+brl(x.price,2)+'</td><td>'+(x.exists?'<span class="pill s-none">Atualiza</span>':'<span class="pill s-ok"><i></i>Novo</span>')+'</td></tr>').join('')+'</tbody></table></div>'+(pv.items.length>80?'<div class="small muted">Mostrando 80 de '+pv.items.length+'.</div>':'')+'</div>';
  } else if(t==='mish'){
    h+='<div class="card stack"><span class="label">Prévia · planilha modelo MISH</span>'+
       '<div class="grid3"><div><span class="small muted">Faturamento</span><div class="bigline">'+brl(pv.fat,0)+'</div></div><div><span class="small muted">Custos fixos ('+pv.fixed.length+')</span><div class="bigline">'+brl(sum(pv.fixed),0)+'</div></div><div><span class="small muted">Custos variáveis ('+pv.variable.length+')</span><div class="bigline">'+brl(sum(pv.variable),0)+'</div></div></div>'+
       (pv.goal?'<div class="small muted">Objetivo de lucro: '+brl(pv.goal,0)+'</div>':'')+
       '<div class="small muted">Vai substituir os custos de '+mLabel(IMP.month)+'.</div></div>';
  }
  h+='<div class="row"><button class="btn pri" data-act="imp-apply">'+I('check')+'Aplicar</button><button class="btn ghost" data-act="imp-cancel">Cancelar</button></div>';
  return h;
}
function targetOpts(sel){
  const m=S.months[IMP.month]||M();
  return '<optgroup label="Custos fixos">'+m.fixed.map(x=>'<option value="f:'+x.id+'"'+(sel==='f:'+x.id?' selected':'')+'>'+esc(x.name)+'</option>').join('')+'<option value="nf"'+(sel==='nf'?' selected':'')+'>+ Novo custo fixo</option></optgroup>'+
         '<optgroup label="Custos variáveis">'+m.variable.map(x=>'<option value="v:'+x.id+'"'+(sel==='v:'+x.id?' selected':'')+'>'+esc(x.name)+'</option>').join('')+'<option value="nv"'+(sel==='nv'?' selected':'')+'>+ Novo custo variável</option></optgroup>'+
         '<option value="x"'+(sel==='x'?' selected':'')+'>Não importar</option>';
}
const RULES=[
  ['v','cartao',/cart[aã]o|maquininha|stone|cielo|getnet|pagseguro|pagbank|mercado ?pago|sumup|antecipa|\btaxa(s)? (de )?(credito|debito|adquir)/],
  ['v','comissao',/comiss|repasse|profissional parceiro|parceiro|split/],
  ['v','imposto',/imposto|\bdas\b|simples nacional|\biss\b|darf|tribut|\bmei\b/],
  ['f','sistema',/\bavec\b|trinks|sistema|software|assinatura/],
  ['f','aluguel',/aluguel|condominio|iptu/],
  ['f','agua',/\bagua\b|cedae|sabesp|copasa|saneamento/],
  ['f','contab',/contab|contador|honorario/],
  ['f','luz',/\bluz\b|energia|\benel\b|\blight\b|cemig|eletric|coelba|celpe/],
  ['f','mkt',/marketing|publicidade|anuncio|trafego|impulsion|facebook|instagram|google ads|\bmeta\b|social media/],
  ['f','escritorio',/escritorio|papelaria/],
  ['f','salarios',/salario|folha|inss|fgts|pro.?labore|encargo|ferias|13|vale.?transporte|beneficio|rescis|funcionari/],
  ['f','telefone',/telefone|internet|celular|\bvivo\b|\bclaro\b|\btim\b|\boi\b|net combo|fibra/],
  ['f','limpeza',/limpeza|faxina|higien/],
  ['v','descart',/toalha|descartave|mercado|supermercado|lavanderia|copa|\bcafe\b|agua mineral/],
  ['v','produtos',/produto|fornecedor|cosmetic|estoque|mercadoria|loreal|l.oreal|wella|truss|braé|brae|keune|joico|schwarzkopf|distribuidor/]
];
function classify(txt){
  const n=norm(txt), m=S.months[IMP.month]||M();
  for(const [k,key,re] of RULES){ if(re.test(n)){ const arr=k==='f'?m.fixed:m.variable; const it=arr.find(x=>x.key===key); return it?k+':'+it.id:(k==='f'?'nf':'nv'); } }
  return 'nf';
}
function findHeader(rows){
  const KW=/valor|total|pre[cç]o|data|descri|categoria|servi[cç]o|produto|cliente|profissional|forma|pagamento|vencimento|fornecedor|nome|item|plano de contas|tipo|quantidade|comiss|hist[oó]rico|bruto|l[ií]quido/i;
  let best=-1,bs=0;
  for(let i=0;i<Math.min(rows.length,25);i++){
    const r=rows[i]||[]; let s=0,txt=0;
    r.forEach(c=>{ if(typeof c==='string'&&c.trim()){txt++; if(KW.test(c)&&c.length<40){s++; if(/^\s*(pre[cç]o|valor|total|data)/i.test(c))s+=2;}} });
    if(s>bs&&txt>=2){bs=s;best=i}
  }
  return best;
}
function guessMap(type){
  const H=IMP.headers.map(norm), rows=IMP.body;
  const find=(...res)=>{for(const re of res){const i=H.findIndex(h=>re.test(h));if(i>-1)return i}return -1};
  const numericCol=()=>{let best=-1,bc=0;IMP.headers.forEach((_,i)=>{let c=0;rows.slice(0,60).forEach(r=>{const v=r[i];if(typeof v==='number'||(typeof v==='string'&&/^\s*-?\(?\s*(R\$)?\s*-?[\d.]+(,\d{1,2})?\)?\s*$/.test(v)&&/\d/.test(v)))c++});if(c>bc){bc=c;best=i}});return best};
  const mp={};
  if(type==='servicos'){
    mp.name=find(/servi[cç]o|procedimento|^nome|descri/); if(mp.name<0)mp.name=0;
    mp.val=find(/pre[cç]o|valor/); if(mp.val<0)mp.val=numericCol();
    mp.cat=find(/categoria|grupo|area|setor|^time/); mp.comm=find(/comiss/);
  } else {
    mp.val=find(/valor bruto|^total$|total bruto|faturamento|valor total|^valor$|valor pago|valor \(r\$\)/,/valor|total|pre[cç]o|montante|pago/); if(mp.val<0)mp.val=numericCol();
    mp.desc=type==='despesas'?find(/categoria|plano de contas|tipo de despesa|centro de custo/,/descri|hist[oó]rico|fornecedor|favorecido|^nome/):find(/^tipo|categoria|item|grupo/);
    mp.date=find(/^data|vencimento|pagamento|competencia|^dt/);
  }
  if(mp.val<0)mp.val=0;
  return mp;
}
function guessType(){
  const colA=IMP.rows.map(r=>norm(r&&r[0])).join('|');
  if(/custo fixo/.test(colA)&&/faturamento/.test(colA))return 'mish';
  const t=norm(IMP.headers.join(' ')+' '+IMP.sheet+' '+IMP.fileName);
  if(/despesa|a pagar|contas a pagar|fornecedor|plano de contas|centro de custo/.test(t))return 'despesas';
  if(/(servi[cç]o|procedimento)/.test(t)&&/pre[cç]o/.test(t)&&!/data/.test(t))return 'servicos';
  if(/preco/.test(t)&&!/data/.test(t))return 'servicos';
  return 'faturamento';
}
function setSheet(name){
  IMP.sheet=name; IMP.rows=IMP.sheets[name]||[];
  const hi=findHeader(IMP.rows); IMP.hdr=hi;
  const width=Math.max(0,...IMP.rows.slice(0,200).map(r=>(r||[]).length));
  IMP.headers=[]; for(let i=0;i<width;i++){ const v=hi>-1?IMP.rows[hi][i]:''; IMP.headers.push((v!==''&&v!=null?String(v).replace(/\s+/g,' ').trim():'Coluna '+String.fromCharCode(65+(i%26))+(i>=26?Math.floor(i/26):''))) }
  IMP.body=IMP.rows.slice(hi+1).filter(r=>r&&r.some(c=>c!==''&&c!=null));
  IMP.type=guessType(); IMP.map=guessMap(IMP.type); IMP.month=S.cur; IMP.add=false; IMP.groupTargets={};
}
function buildImport(){
  const t=IMP.type, mp=IMP.map, out={};
  if(t==='mish'){
    const rows=IMP.rows; let mode=''; const fixed=[],variable=[]; let fat=0,goal=0;
    rows.forEach(r=>{ const a=r&&r[0]; if(a==null||a==='')return; const n=norm(a); const v=parseNum(r[1]);
      if(/^faturamento\s*$/.test(n)&&!mode){ if(isFinite(v))fat=v; return; }
      if(/^custo fixo/.test(n)){mode='f';return} if(/^total de custos fixos/.test(n)){mode='';return}
      if(/^custos variaveis/.test(n)){mode='v';return} if(/^total de custos variaveis/.test(n)){mode='';return}
      if(/^objetivo\s*$/.test(n)){ if(isFinite(v))goal=v; return; }
      if(mode){ const name=String(a).trim(); const it={name,val:isFinite(v)?v:0}; (mode==='f'?fixed:variable).push(it); }
    });
    if(!fixed.length&&!variable.length) return {error:'Não encontrei as linhas de "Custo fixo" e "Custos variáveis" nesta aba. Escolha a aba do mês.'};
    return {fat,goal,fixed,variable};
  }
  const rows=IMP.body;
  if(t==='servicos'){
    const items=[]; let skipped=0; const seen={};
    const tm=String(IMP.headers[mp.name]||'').match(/^\s*time\s+(.+)$/i); const hdrCat=tm?tm[1].trim().toLowerCase().replace(/^./,c=>c.toUpperCase()):'';
    rows.forEach(r=>{ const name=String(r[mp.name]==null?'':r[mp.name]).replace(/\s+/g,' ').trim(); const price=parseNum(r[mp.val]);
      if(!name||/^total/i.test(name)||!isFinite(price)||price<=0){ if(name)skipped++; return; }
      const k=norm(name); if(seen[k])return; seen[k]=1;
      const cat=mp.cat>-1&&r[mp.cat]?String(r[mp.cat]).trim():''; let comm=mp.comm>-1?parseNum(r[mp.comm]):NaN; if(isFinite(comm)&&comm<=1)comm*=100;
      const ex=S.services.find(s=>norm(s.name)===k);
      items.push({name,price,cat:cat||hdrCat||(ex?ex.cat:'Sem categoria'),comm:isFinite(comm)?comm:null,exists:!!ex});
    });
    if(!items.length) return {error:'Não achei serviços com preço. Confira se a coluna do nome e a do preço estão certas.'};
    return {items,skipped};
  }
  // faturamento / despesas
  const monthCount={}; const recs=[]; let skipped=0;
  rows.forEach(r=>{
    const v=parseNum(r[mp.val]); const desc=mp.desc>-1?String(r[mp.desc]==null?'':r[mp.desc]).trim():'';
    const rowTxt=norm(r.filter(c=>typeof c==='string').join(' '));
    if(!isFinite(v)||v===0||/^(sub)?total|total geral|^saldo/.test(rowTxt)||/^total/.test(norm(desc))){skipped++;return}
    let mk=null; if(mp.date>-1){const d=parseDate(r[mp.date]); if(d)mk=dKey(d)}
    if(mk)monthCount[mk]=(monthCount[mk]||0)+1;
    recs.push({v:Math.abs(v),desc:desc||'Sem descrição',mk});
  });
  const months=Object.keys(monthCount).sort();
  if(months.length&&!monthCount[IMP.month]){ IMP.month=months.reduce((a,b)=>monthCount[b]>=monthCount[a]?b:a); }
  const use=recs.filter(x=>!months.length||x.mk===IMP.month);
  if(!use.length) return {error:'Nenhum valor encontrado. Confira a coluna do valor.',months,monthCount};
  out.months=months; out.monthCount=monthCount; out.total=use.reduce((s,x)=>s+x.v,0); out.count=use.length; out.skipped=skipped;
  if(t==='faturamento'){ const bt={}; use.forEach(x=>bt[x.desc]=(bt[x.desc]||0)+x.v); out.byType=mp.desc>-1?bt:null; }
  else {
    const g={}; use.forEach(x=>{ (g[x.desc]=g[x.desc]||{name:x.desc,val:0,n:0}); g[x.desc].val+=x.v; g[x.desc].n++; });
    out.groups=Object.values(g).sort((a,b)=>b.val-a.val).map(x=>({...x,target:IMP.groupTargets[x.name]||classify(x.name)}));
  }
  return out;
}
function ensureMonth(k){ if(!S.months[k]){ const ks=Object.keys(S.months).sort(); S.months[k]=blankMonth(S.months[ks[ks.length-1]]); } return S.months[k]; }
function applyImport(){
  const pv=IMP.pv, t=IMP.type; if(!pv||pv.error)return;
  let msg='';
  if(t==='servicos'){
    let n=0,u=0;
    pv.items.forEach(x=>{ const ex=S.services.find(s=>norm(s.name)===norm(x.name));
      if(ex){ex.price=x.price; if(x.comm!=null)ex.comm=x.comm; u++}
      else { if(x.cat&&!S.cats.includes(x.cat))S.cats.push(x.cat); S.services.push({id:uid(),name:x.name,cat:x.cat,price:x.price,comm:x.comm!=null?x.comm:Number(S.params.commDef)||40,mode:'manual',prodCost:0,ficha:[]}); n++ } });
    msg=n+' serviços novos e '+u+' preços atualizados.';
  } else {
    const m=ensureMonth(IMP.month); S.cur=IMP.month;
    if(t==='faturamento'){ m.fat=Math.round(pv.total*100)/100; msg='Faturamento de '+mLabel(IMP.month)+': '+brl(m.fat,2)+'.'; }
    else if(t==='mish'){
      m.fat=pv.fat||m.fat; if(pv.goal)m.goal=pv.goal;
      const mapItems=(arr,kind)=>arr.map(x=>{ IMP.month=IMP.month; let key=''; for(const [k,kk,re] of RULES){ if(k===kind&&re.test(norm(x.name))){key=kk;break} } return {id:uid(),key,name:x.name,val:x.val}; });
      m.fixed=mapItems(pv.fixed,'f'); m.variable=mapItems(pv.variable,'v');
      if(!m.variable.some(x=>x.key==='cartao')){const c=m.variable.find(x=>/cart/.test(norm(x.name)));if(c)c.key='cartao'}
      msg='Planilha MISH importada em '+mLabel(IMP.month)+'.';
    } else {
      if(!IMP.add){ const touched=new Set(pv.groups.map(g=>g.target)); [...m.fixed.map(x=>'f:'+x.id),...m.variable.map(x=>'v:'+x.id)].forEach(id=>{ if(touched.has(id)){ const [k,i]=id.split(':'); const it=(k==='f'?m.fixed:m.variable).find(x=>x.id===i); if(it)it.val=0; } }); }
      pv.groups.forEach(g=>{ if(g.target==='x')return;
        if(g.target==='nf'||g.target==='nv'){ (g.target==='nf'?m.fixed:m.variable).push({id:uid(),key:'',name:g.name,val:Math.round(g.val*100)/100}); return; }
        const [k,i]=g.target.split(':'); const it=(k==='f'?m.fixed:m.variable).find(x=>x.id===i); if(it)it.val=Math.round(((Number(it.val)||0)+g.val)*100)/100; });
      msg='Despesas de '+mLabel(IMP.month)+' lançadas: '+brl(pv.total,2)+'.';
    }
  }
  S.example=false; IMP=null; save('Importado'); go('import',{done:msg,src:vstate.src});
}
async function readImportFile(file){
  const name=file.name; const ext=(name.split('.').pop()||'').toLowerCase();
  try{
    let sheets={};
    if(ext==='csv'||ext==='txt'){
      const buf=await file.arrayBuffer(); let txt=new TextDecoder('utf-8').decode(buf); if(txt.includes(String.fromCharCode(65533)))txt=new TextDecoder('windows-1252').decode(buf);
      sheets[name.replace(/\.[^.]+$/,'')]=parseCSV(txt);
    } else {
      if(typeof XLSX==='undefined') throw new Error('leitor');
      const wb=XLSX.read(await file.arrayBuffer(),{type:'array',cellDates:true});
      wb.SheetNames.forEach(n=>{ sheets[n]=XLSX.utils.sheet_to_json(wb.Sheets[n],{header:1,raw:true,defval:''}); });
    }
    IMP={fileName:name,sheets};
    // escolhe a aba com mais conteúdo útil
    const names=Object.keys(sheets); let pick=names[0];
    const score=n=>sheets[n].filter(r=>r.some(c=>typeof c==='number')).length;
    names.forEach(n=>{ if(score(n)>score(pick))pick=n });
    setSheet(pick);
    render();
  }catch(err){ IMP=null; save(err&&err.message==='leitor'?'O leitor de Excel não carregou. Salve o arquivo como CSV e tente de novo.':'Não consegui ler esse arquivo. Tente exportar em Excel (.xlsx) ou CSV.'); }
}
function parseCSV(txt){
  const first=txt.split(/\r?\n/).find(l=>l.trim())||''; const cnt=ch=>first.split(ch).length;
  const d=[';',',','\t'].sort((a,b)=>cnt(b)-cnt(a))[0];
  const rows=[]; let row=[],cell='',q=false;
  for(let i=0;i<txt.length;i++){ const ch=txt[i];
    if(q){ if(ch==='"'){ if(txt[i+1]==='"'){cell+='"';i++} else q=false } else cell+=ch; }
    else if(ch==='"')q=true; else if(ch===d){row.push(cell);cell=''} else if(ch==='\n'){row.push(cell);rows.push(row);row=[];cell=''} else if(ch!=='\r')cell+=ch; }
  if(cell||row.length){row.push(cell);rows.push(row)}
  return rows;
}

/* ================= Excel / backup ================= */
let DL=null;
async function getDL(){ if(DL!==null)return DL; try{ DL=window.claude&&window.claude.use?await window.claude.use('downloads'):null }catch(e){DL=null} return DL; }
async function saveFile(filename,data){
  const msg=document.getElementById('dl-msg');
  const dl=await getDL();
  if(!dl){ /* fora do Claude: download nativo do navegador */
    try{ const blob=data instanceof Blob?data:new Blob([data]); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),2000); if(msg)msg.textContent='Arquivo enviado para download: '+filename; }
    catch(e){ if(msg)msg.textContent='Não foi possível baixar agora. Tente de novo em instantes.'; }
    return; }
  try{ await dl.save({filename,data}); if(msg)msg.textContent='Arquivo enviado para download: '+filename; }
  catch(e){ if(msg)msg.textContent=e&&e.code==='declined'?'Download cancelado.':'Não foi possível baixar agora. Tente de novo em instantes.'; }
}
function exportXlsx(){
  if(typeof XLSX==='undefined'){save('O gerador de Excel não carregou.');return}
  const r=rates(), wb=XLSX.utils.book_new(), nm=S.company.name||'Empresa';
  Object.keys(S.months).sort().forEach(k=>{
    const m=S.months[k], c=calcMonth(m);
    const a=[[nm+' by MISH · Planilha de Precificação'],[mLabel(k)],[],['Faturamento',m.fat],[],['CUSTOS FIXOS','R$']];
    m.fixed.forEach(x=>a.push([x.name,Number(x.val)||0])); a.push(['Total de custos fixos',c.CF],['Custos fixos %',c.cfP],[],['CUSTOS VARIÁVEIS','R$']);
    m.variable.forEach(x=>a.push([x.name,Number(x.val)||0])); a.push(['Total de custos variáveis',c.CV],[],['Margem operacional',c.MO],['Margem operacional %',c.moP],[],['DRE'],['(+) Faturamento',c.F],['(-) Custos variáveis',c.CV],['(-) Custos fixos',c.CF],['Resultado',c.R],['Resultado %',c.rP],[],['Ponto de equilíbrio',c.PE||''],['Objetivo de lucro',c.goal],['Faturamento necessário',c.need||'']);
    const ws=XLSX.utils.aoa_to_sheet(a); ws['!cols']=[{wch:38},{wch:16}]; XLSX.utils.book_append_sheet(wb,ws,mLabel(k).slice(0,31));
  });
  const sv=[['Serviço','Categoria','Preço','Comissão %','Comissão R$','Produto R$','Cartão R$','Imposto R$','Custo variável R$','Margem operacional R$','Margem %','Custos fixos R$','Lucro R$','Lucro %','Preço sugerido']];
  S.services.forEach(s=>{const c=calcSvc(s,r);sv.push([s.name,s.cat,c.P,Number(s.comm)||0,c.com,c.prod,c.card,c.tax,c.cv,c.mo,c.moP,c.cf,c.res,c.resP,c.sug?Math.ceil(c.sug):''])});
  const w2=XLSX.utils.aoa_to_sheet(sv); w2['!cols']=[{wch:32},{wch:14}]; XLSX.utils.book_append_sheet(wb,w2,'Precificação Serviços');
  const ft=[['Serviço','Produto','Preço pago','Qtd. embalagem','Unidade','Qtd. usada','Custo no serviço']];
  S.services.filter(s=>s.mode==='ficha').forEach(s=>s.ficha.forEach(f=>{const pk=Number(f.pack)||0;ft.push([s.name,f.name,Number(f.cost)||0,pk,f.unit,Number(f.used)||0,pk?(Number(f.cost)||0)/pk*(Number(f.used)||0):0])}));
  XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(ft),'Ficha técnica');
  const pr=[['Produto','Preço','Custo','Comissão R$','Cartão R$','Imposto R$','Total despesas','Lucro R$','Lucro %','Preço sugerido']];
  S.products.forEach(p=>{const c=calcProd(p,r);pr.push([p.name,c.P,c.cost,c.com,c.card,c.tax,c.tot,c.res,c.resP,c.sug?Math.ceil(c.sug):''])});
  XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(pr),'Precificação Produtos');
  const out=XLSX.write(wb,{bookType:'xlsx',type:'array'});
  saveFile('Precificacao '+nm.replace(/[^\w\- À-ú]/g,'')+' by MISH.xlsx',out);
}

/* ================= eventos ================= */
function rerenderKeepFocus(){ const id=document.activeElement&&document.activeElement.id; render(); if(id){const el=document.getElementById(id); if(el){el.focus(); try{if(el.select)el.select()}catch(e){}}} }
document.addEventListener('click',async e=>{
  const g=e.target.closest('[data-go]'); if(g&&!sheet.contains(g)){ const o={}; if(g.dataset.f)o.f=g.dataset.f; go(g.dataset.go,o); return; }
  if(g&&sheet.contains(g)){ closeSheet(); go(g.dataset.go); return; }
  const sf=e.target.closest('[data-sf]'); if(sf){vstate.f=sf.dataset.sf;render();return}
  const ct=e.target.closest('[data-cat]'); if(ct){vstate.cat=ct.dataset.cat;render();return}
  const sr=e.target.closest('[data-src]'); if(sr){vstate.src=sr.dataset.src;render();return}
  const it=e.target.closest('[data-imptype]'); if(it){IMP.type=it.dataset.imptype;IMP.map=guessMap(IMP.type);IMP.groupTargets={};render();return}
  const a=e.target.closest('[data-act]'); if(!a)return; const act=a.dataset.act;
  switch(act){
    case 'logout': if(window.MISH_ACCOUNT)window.MISH_ACCOUNT.sair(); break;
    case 'guide-off': setGuide(true); break;
    case 'guide-on': setGuide(false); break;
    case 'theme':{ const nd=!isDark(); document.documentElement.setAttribute('data-theme',nd?'dark':'light'); try{localStorage.setItem('mish-precifica-theme',nd?'dark':'light')}catch(_){} renderShell(); break; }
    case 'edit-cover': draft={...S.company}; openSheet('cover',coverSheet()); break;
    case 'pick-logo': document.getElementById('f-logo').click(); break;
    case 'pick-photo': document.getElementById('f-photo').click(); break;
    case 'rm-logo': draft.logo=''; refreshSheet(); break;
    case 'rm-photo': draft.photo=''; refreshSheet(); break;
    case 'save-cover': { const n=document.getElementById('c-name'); if(n)draft.name=n.value.trim(); S.company={name:draft.name,logo:draft.logo,photo:draft.photo}; save('Capa salva'); closeSheet(); render(); break; }
    case 'close': closeSheet(); break;
    case 'start-blank': S=emptyState(S.company.name==='Studio Exemplo'?{name:'',logo:S.company.logo,photo:S.company.photo}:S.company); save('Pronto: comece pelo mês ou importe seus dados'); go('home'); break;
    case 'ask-reset': document.getElementById('reset-box').innerHTML='<div class="confirm"><b>Apagar todos os dados deste aparelho?</b><span>Capa, meses, serviços e produtos serão apagados. Isso não pode ser desfeito.</span><div class="row"><button class="btn sm danger" data-act="do-reset">'+I('trash')+'Apagar tudo</button><button class="btn sm ghost" data-act="cancel-reset">Cancelar</button></div></div>'; break;
    case 'cancel-reset': document.getElementById('reset-box').innerHTML=''; break;
    case 'do-reset': S=emptyState(); save('Tudo apagado'); go('home'); break;
    case 'new-month': { const ks=Object.keys(S.months).sort(); const last=ks[ks.length-1]; const k=nextKey(last); S.months[k]=blankMonth(S.months[last]); S.cur=k; save('Mês criado com os custos fixos do mês anterior'); render(); break; }
    case 'ask-del-month': document.getElementById('delmonth-box').innerHTML='<div class="confirm" style="margin-top:10px"><b>Excluir '+mLabel(S.cur)+'?</b><span>O faturamento e os custos deste mês serão apagados.</span><div class="row"><button class="btn sm danger" data-act="do-del-month">'+I('trash')+'Excluir mês</button><button class="btn sm ghost" data-act="cancel-del-month">Cancelar</button></div></div>'; break;
    case 'cancel-del-month': document.getElementById('delmonth-box').innerHTML=''; break;
    case 'do-del-month': delete S.months[S.cur]; S.cur=Object.keys(S.months).sort().pop(); save('Mês excluído'); render(); break;
    case 'add-cost': { const m=M(); const arr=a.dataset.kind==='f'?m.fixed:m.variable; const id=uid(); arr.push({id,key:'',name:'',val:0}); save(); render(); const el=document.getElementById('n-'+id); if(el)el.focus(); break; }
    case 'del-cost': { const [k,id]=a.dataset.id.split(':'); const m=M(); const arr=k==='f'?m.fixed:m.variable; const i=arr.findIndex(x=>x.id===id); if(i>-1)arr.splice(i,1); save('Custo excluído'); render(); break; }
    case 'card-auto': S.params.cardAuto=true; vstate.paramsOpen=true; save(); render(); break;
    case 'card-manual': S.params.cardAuto=false; vstate.paramsOpen=true; save(); render(); break;
    case 'new-svc': draft={id:uid(),_new:true,name:'',cat:vstate.cat&&vstate.cat!=='all'?vstate.cat:(S.cats[0]||'Cabelos'),price:0,comm:Number(S.params.commDef)||40,mode:'manual',prodCost:0,ficha:[]}; openSheet('svc',svcSheet()); setTimeout(()=>{const n=document.getElementById('d-name');if(n)n.focus()},50); break;
    case 'edit-svc': { const s=S.services.find(x=>x.id===a.dataset.id); if(!s)break; draft=JSON.parse(JSON.stringify(s)); openSheet('svc',svcSheet()); break; }
    case 'mode-manual': draft.mode='manual'; refreshSheet(); break;
    case 'mode-ficha': draft.mode='ficha'; if(!draft.ficha.length)draft.ficha.push({id:uid(),name:'',cost:0,pack:1000,unit:'ml',used:0}); refreshSheet(); break;
    case 'add-ficha': { const id=uid(); draft.ficha.push({id,name:'',cost:0,pack:1000,unit:'ml',used:0}); refreshSheet('fn-'+id); break; }
    case 'del-ficha': draft.ficha=draft.ficha.filter(f=>f.id!==a.dataset.id); refreshSheet(); break;
    case 'use-sug': { const c=sheetKind==='svc'?calcSvc(draft):calcProd(draft); if(c.sug){draft.price=Math.ceil(c.sug);refreshSheet()} break; }
    case 'save-svc': { if(!draft.name.trim()){ const n=document.getElementById('d-name'); n.focus(); n.style.borderColor='var(--bad)'; n.placeholder='Digite o nome do serviço'; break; } const d={...draft}; const isNew=d._new; delete d._new; if(!S.cats.includes(d.cat))S.cats.push(d.cat); if(isNew)S.services.push(d); else { const i=S.services.findIndex(x=>x.id===d.id); S.services[i]=d; } S.example=S.example&&!isNew?S.example:S.example; save(isNew?'Serviço criado':'Serviço salvo'); closeSheet(); render(); break; }
    case 'ask-del': document.getElementById('del-box').innerHTML='<div class="confirm"><b>Excluir “'+esc(draft.name||'este item')+'”?</b><span>Isso não pode ser desfeito.</span><div class="row"><button class="btn sm danger" data-act="do-del" data-what="'+a.dataset.what+'">'+I('trash')+'Sim, excluir</button><button class="btn sm ghost" data-act="cancel-del">Cancelar</button></div></div>'; document.getElementById('del-box').scrollIntoView({block:'nearest'}); break;
    case 'cancel-del': document.getElementById('del-box').innerHTML=''; break;
    case 'do-del': { if(a.dataset.what==='svc')S.services=S.services.filter(x=>x.id!==draft.id); else S.products=S.products.filter(x=>x.id!==draft.id); save('Excluído'); closeSheet(); render(); break; }
    case 'new-prd': draft={id:uid(),_new:true,name:'',price:0,cost:0,comm:10}; openSheet('prd',prdSheet()); setTimeout(()=>{const n=document.getElementById('d-name');if(n)n.focus()},50); break;
    case 'edit-prd': { const p=S.products.find(x=>x.id===a.dataset.id); if(!p)break; draft={...p}; openSheet('prd',prdSheet()); break; }
    case 'save-prd': { if(!draft.name.trim()){ const n=document.getElementById('d-name'); n.focus(); n.style.borderColor='var(--bad)'; n.placeholder='Digite o nome do produto'; break; } const d={...draft}; const isNew=d._new; delete d._new; if(isNew)S.products.push(d); else { const i=S.products.findIndex(x=>x.id===d.id); S.products[i]=d; } save(isNew?'Produto criado':'Produto salvo'); closeSheet(); render(); break; }
    case 'pick-import': document.getElementById('f-import').click(); break;
    case 'imp-cancel': IMP=null; render(); break;
    case 'imp-apply': applyImport(); break;
    case 'export-xlsx': exportXlsx(); break;
    case 'backup': saveFile('Backup precificacao MISH.json',JSON.stringify(S)); break;
    case 'restore': document.getElementById('f-backup').click(); break;
  }
});
document.getElementById('f-import').addEventListener('change',e=>{const f=e.target.files[0];e.target.value='';if(f)readImportFile(f)});
document.getElementById('f-backup').addEventListener('change',async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
  try{const d=JSON.parse(await f.text()); if(!d||!d.months||!d.services)throw 0; S=d; save('Cópia restaurada'); go('home');}catch(_){save('Esse arquivo não é uma cópia de segurança da Precificação MISH.')}});
document.addEventListener('dragover',e=>{const d=document.getElementById('drop');if(d){e.preventDefault();d.classList.add('drag')}});
document.addEventListener('dragleave',e=>{const d=document.getElementById('drop');if(d&&!d.contains(e.relatedTarget))d.classList.remove('drag')});
document.addEventListener('drop',e=>{const d=document.getElementById('drop');if(d){e.preventDefault();d.classList.remove('drag');const f=e.dataTransfer.files[0];if(f)readImportFile(f)}});

document.addEventListener('input',e=>{
  const t=e.target;
  if(t.id==='svc-q'||t.id==='prd-q'){ vstate.q=t.value; const pos=t.selectionStart; render(); const el=document.getElementById(t.id); el.focus(); el.setSelectionRange(pos,pos); return; }
  if(t.dataset.d&&draft){ draft[t.dataset.d]=t.value; return; }
  if(t.dataset.c&&draft){ draft[t.dataset.c]=t.value; return; }
  if(t.dataset.f&&draft){ const [id,k]=t.dataset.f.split(':'); const f=draft.ficha.find(x=>x.id===id); if(f)f[k]=t.value; return; }
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.id==='sel-month'){ S.cur=t.value; save('Mostrando '+mLabel(S.cur)); render(); return; }
  if(t.id==='imp-sheet'){ setSheet(t.value); render(); return; }
  if(t.id==='imp-month'){ IMP.month=t.value; IMP.groupTargets={}; render(); return; }
  if(t.id==='imp-add'){ IMP.add=t.checked; return; }
  if(t.dataset.map){ IMP.map[t.dataset.map]=+t.value; IMP.groupTargets={}; render(); return; }
  if(t.dataset.gi){ const g=IMP.pv.groups[+t.dataset.gi]; IMP.groupTargets[g.name]=t.value; g.target=t.value; return; }
  // capa / folha
  if(t.dataset.d&&draft){ if(t.dataset.d==='cat'&&t.value==='__new'){ document.getElementById('newcat').innerHTML='<div class="row"><input class="inp" id="newcat-in" placeholder="Nome da categoria" style="flex:1"><button class="btn sm pri" data-act="add-cat">Criar</button></div>'; document.getElementById('newcat-in').focus(); return;} draft[t.dataset.d]=t.value; return; }
  if(t.dataset.dn&&draft){ const v=parseNum(t.value); draft[t.dataset.dn]=isFinite(v)?v:0; const nx=document.activeElement&&sheet.contains(document.activeElement)?document.activeElement.id:null; refreshSheet(nx); return; }
  if(t.dataset.fn&&draft){ const [id,k]=t.dataset.fn.split(':'); const f=draft.ficha.find(x=>x.id===id); const v=parseNum(t.value); if(f)f[k]=isFinite(v)?v:0; const nx=document.activeElement&&sheet.contains(document.activeElement)?document.activeElement.id:null; refreshSheet(nx); return; }
  if(t.dataset.f&&draft){ const [id,k]=t.dataset.f.split(':'); const f=draft.ficha.find(x=>x.id===id); if(f)f[k]=t.value; if(k==='unit')refreshSheet(); return; }
  // mês
  if(t.dataset.bind){ const v=parseNum(t.value); M()[t.dataset.bind]=isFinite(v)?v:0; S.example=false; save(); rerenderKeepFocus(); return; }
  if(t.dataset.cname){ const [k,id]=t.dataset.cname.split(':'); const it=(k==='f'?M().fixed:M().variable).find(x=>x.id===id); if(it){it.name=t.value.trim()} save(); return; }
  if(t.dataset.cval){ const [k,id]=t.dataset.cval.split(':'); const it=(k==='f'?M().fixed:M().variable).find(x=>x.id===id); const v=parseNum(t.value); if(it)it.val=isFinite(v)?Math.abs(v):0; S.example=false; save(); rerenderKeepFocus(); return; }
  if(t.dataset.param){ const v=parseNum(t.value); if(isFinite(v))S.params[t.dataset.param]=v; vstate.paramsOpen=true; save(); rerenderKeepFocus(); return; }
});
document.addEventListener('click',e=>{ const a=e.target.closest('[data-act="add-cat"]'); if(!a)return; const v=(document.getElementById('newcat-in').value||'').trim(); if(!v)return; if(!S.cats.includes(v))S.cats.push(v); draft.cat=v; refreshSheet(); });
document.addEventListener('toggle',e=>{ if(e.target.id==='params-box')vstate.paramsOpen=e.target.open },true);
document.addEventListener('focusin',e=>{ const t=e.target; if(t.classList&&t.classList.contains('money')&&t.select)setTimeout(()=>{try{t.select()}catch(_){}},0) });
try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>renderShell())}catch(_){}

window.MISH_STATE=()=>S;
render();
})();
