/* MISH Precificação: apresentação de resultados de um cliente (usada na visão Boss).
   window.MISH_APRESENTACAO(dados, email) abre uma aba com slides 16:9 prontos para apresentar ou salvar em PDF.
   Os cálculos são os mesmos do app (js/app.js: calcMonth, rates, calcSvc, calcProd). */
(function(){
"use strict";
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sum=a=>(a||[]).reduce((s,x)=>s+(Number(x.val)||0),0);
const brl=(v,dec)=>{v=Number(v)||0;const d=dec==null?(Math.abs(v)>=1000?0:2):dec;return (v<0?'-':'')+'R$ '+Math.abs(v).toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d})};
const pct=(v,d)=>isFinite(v)?(v*100).toLocaleString('pt-BR',{minimumFractionDigits:d==null?1:d,maximumFractionDigits:d==null?1:d})+'%':'—';
const MESES=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const mLabel=k=>{const [y,m]=String(k).split('-');return MESES[+m-1]+' '+y};
const mCurto=k=>{const [y,m]=String(k).split('-');return MESES[+m-1].slice(0,3)+'/'+y.slice(2)};
const COL={cv:'#FF3D6E',cf:'#F97316',lucro:'#16A34A',ok:'#16A34A',warn:'#D97706',bad:'#DC2626'};

/* ---------- cálculos (iguais ao app) ---------- */
function calcMonth(m){
  const F=Number(m.fat)||0, CF=sum(m.fixed), CV=sum(m.variable);
  const MO=F-CV, moP=F?MO/F:NaN, R=F-CV-CF, rP=F?R/F:NaN;
  const PE=moP>0?CF/moP:null, goal=Number(m.goal)||0, need=moP>0?(goal+CF)/moP:null;
  return {F,CF,CV,MO,moP,R,rP,PE,goal,need};
}
function rates(S,m){
  const c=calcMonth(m), p=S.params||{};
  const cardItem=(m.variable||[]).find(x=>x.key==='cartao');
  const cardAutoV=(c.F&&cardItem)?(Number(cardItem.val)||0)/c.F:0;
  const cfP=c.F?c.CF/c.F:0;
  return {card:p.cardAuto?cardAutoV:(Number(p.card)||0)/100, tax:(Number(p.tax)||0)/100, cf:cfP, target:(Number(p.target)||25)/100};
}
const fichaCost=sv=>(sv.ficha||[]).reduce((s,f)=>{const pk=Number(f.pack)||0;return s+(pk?(Number(f.cost)||0)/pk*(Number(f.used)||0):0)},0);
const prodCostOf=sv=>sv.mode==='ficha'?fichaCost(sv):(Number(sv.prodCost)||0);
function calcSvc(sv,r){
  const P=Number(sv.price)||0, c=(Number(sv.comm)||0)/100;
  const com=P*c, prod=prodCostOf(sv), card=P*r.card, tax=(P-com)*r.tax, cv=com+prod+card+tax;
  const cf=P*r.cf, res=P-cv-cf, resP=P?res/P:NaN;
  const den=1-c-r.card-r.tax*(1-c)-r.cf-r.target; const sug=den>0.02?prod/den:null;
  return {P,res,resP,sug};
}
function calcProd(pd,r){
  const P=Number(pd.price)||0, c=(Number(pd.comm)||0)/100, cost=Number(pd.cost)||0;
  const tot=cost+P*c+P*r.card+P*r.tax, res=P-tot, resP=P?res/P:NaN;
  const den=1-c-r.card-r.tax-r.target; const sug=den>0.02?cost/den:null;
  return {P,cost,res,resP,sug};
}
function status(p,t){ if(!isFinite(p))return 'none'; return p>=t-0.001?'ok':(p>=t-0.03?'warn':'bad'); }
const STXT={ok:'Saudável',warn:'Atenção',bad:'Crítico',none:'Sem dados'};

/* ---------- slides ---------- */
function slides(S,k,email,base){
  const m=S.months[k], c=calcMonth(m), r=rates(S,m), t=r.target, tP=Math.round(t*100);
  const nome=(S.company&&S.company.name)||email||'Cliente';
  const logo=S.company&&S.company.logo?'<img class="cli-logo" src="'+esc(S.company.logo)+'" alt="">':'';
  const MISH='<span class="mish" style="--mask:url('+base+'assets/mish-logo-mask.png)" role="img" aria-label="MISH"></span>';
  const st=status(c.rP,t);
  const out=[];
  const slide=(titulo,corpo,cls)=>out.push('<section class="slide '+(cls||'')+'"><header><span class="sl-cli">'+esc(nome)+' · '+esc(mLabel(k))+'</span>'+MISH+'</header>'+
    (titulo?'<h2>'+titulo+'</h2>':'')+'<div class="sl-body">'+corpo+'</div><footer>'+(out.length+1)+'</footer></section>');

  /* 1 capa */
  out.push('<section class="slide capa"><div class="capa-in">'+logo+'<p class="kicker">Análise de precificação</p><h1>'+esc(nome)+'</h1><p class="capa-mes">'+esc(mLabel(k))+'</p></div><div class="capa-by">by '+MISH+'</div></section>');

  if(!c.F){
    slide('Sem dados neste mês','<p class="lead">O faturamento de '+esc(mLabel(k))+' ainda não foi preenchido. Escolha outro mês no topo da página.</p>');
    return out;
  }

  /* 2 resultado */
  const kpi=(l,v,sub,cor)=>'<div class="kpi"><span>'+l+'</span><b'+(cor?' style="color:'+cor+'"':'')+'>'+v+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</div>';
  slide('Resultado do mês',
    '<div class="kpis">'+kpi('Faturamento',brl(c.F,0))+kpi('Custos totais',brl(c.CV+c.CF,0),'variáveis '+brl(c.CV,0)+' · fixos '+brl(c.CF,0))+
    kpi(c.R>=0?'Lucro':'Prejuízo',brl(c.R,0),null,c.R>=0?COL.ok:COL.bad)+kpi('Margem de lucro',pct(c.rP),'meta '+tP+'%',COL[st])+'</div>'+
    '<p class="badge s-'+st+'"><i></i>'+STXT[st]+(st==='ok'?': o salão está na meta de lucro.':st==='warn'?': perto da meta, mas abaixo dela.':': o lucro está bem abaixo da meta.')+'</p>');

  /* 3 de cada R$ 100 */
  const per=v=>Math.max(0,v/c.F*100), cvw=per(c.CV), cfw=per(c.CF), lw=Math.max(0,100-cvw-cfw);
  const f2=v=>'R$ '+v.toFixed(2).replace('.',',');
  slide('De cada R$ 100 que entram',
    '<div class="split"><div style="width:'+Math.min(100,cvw)+'%;background:'+COL.cv+'">'+(cvw>9?f2(cvw):'')+'</div>'+
    '<div style="width:'+Math.min(100-Math.min(100,cvw),cfw)+'%;background:'+COL.cf+'">'+(cfw>9?f2(cfw):'')+'</div>'+
    '<div style="width:'+lw+'%;background:'+COL.lucro+'">'+(lw>9?f2(lw):'')+'</div></div>'+
    '<div class="legend"><div><i style="background:'+COL.cv+'"></i>Custos variáveis<small>comissão, produto, cartão, imposto</small><b>'+f2(c.CV/c.F*100)+'</b></div>'+
    '<div><i style="background:'+COL.cf+'"></i>Custos fixos<small>aluguel, salários, contas</small><b>'+f2(c.CF/c.F*100)+'</b></div>'+
    '<div><i style="background:'+COL.lucro+'"></i>'+(c.R>=0?'Lucro':'Prejuízo')+'<small>o que fica na empresa</small><b>'+f2(c.R/c.F*100)+'</b></div></div>');

  /* 4 ponto de equilíbrio e meta */
  let pe='';
  if(c.PE==null){ pe='<p class="lead">Os custos variáveis consomem todo o faturamento, então não existe ponto de equilíbrio. É preciso rever preços e comissões.</p>'; }
  else{
    const mx=Math.max(c.F,c.PE,c.need||0)*1.08, w=v=>Math.min(100,v/mx*100);
    const folga=c.F-c.PE;
    pe='<div class="kpis three">'+kpi('Ponto de equilíbrio',brl(c.PE,0),'faturamento para empatar')+kpi('Faturamento atual',brl(c.F,0),(folga>=0?'acima':'abaixo')+' do equilíbrio em '+brl(Math.abs(folga),0),folga>=0?COL.ok:COL.bad)+
      (c.goal?kpi('Para lucrar '+brl(c.goal,0),brl(c.need,0),c.F>=c.need?'meta de lucro alcançada':'faltam '+brl(c.need-c.F,0)+' de faturamento',c.F>=c.need?COL.ok:COL.warn):kpi('Dias de trabalho para empatar',S.params&&S.params.days?Math.ceil(c.PE/c.F*S.params.days)+' de '+S.params.days:'—'))+'</div>'+
      '<div class="track"><div class="tr-fat" style="width:'+w(c.F)+'%"><span>Atual '+brl(c.F,0)+'</span></div>'+
      '<i class="tr-mark" style="left:'+w(c.PE)+'%"><span>Equilíbrio</span></i>'+(c.goal?'<i class="tr-mark goal" style="left:'+w(c.need)+'%"><span>Meta</span></i>':'')+'</div>';
  }
  slide('Ponto de equilíbrio'+(c.goal?' e meta':''),pe);

  /* 5 maiores custos */
  const custos=[].concat((m.fixed||[]).map(x=>({n:x.name,v:Number(x.val)||0,t:'Fixo'})),(m.variable||[]).map(x=>({n:x.name,v:Number(x.val)||0,t:'Variável'})))
    .filter(x=>x.v>0).sort((a,b)=>b.v-a.v).slice(0,7);
  if(custos.length){ const mx=custos[0].v;
    slide('Para onde vai o dinheiro','<div class="bars">'+custos.map(x=>'<div class="bar"><span>'+esc(x.n)+'<small>'+x.t+'</small></span><div><i style="width:'+(x.v/mx*100)+'%;background:'+(x.t==='Fixo'?COL.cf:COL.cv)+'"></i></div><b>'+brl(x.v,0)+'<small>'+pct(x.v/c.F)+' do fat.</small></b></div>').join('')+'</div>'); }

  /* 6 serviços */
  const sv=(S.services||[]).map(s=>({s,x:calcSvc(s,r)})).filter(o=>o.x.P>0);
  if(sv.length){
    const cnt={ok:0,warn:0,bad:0}; sv.forEach(o=>{const l=status(o.x.resP,t); if(cnt[l]!=null)cnt[l]++;});
    const lista=sv.slice().sort((a,b)=>a.x.resP-b.x.resP).slice(0,10);
    slide('Serviços: quanto sobra de cada um',
      '<div class="chips"><span><b>'+sv.length+'</b> serviços</span><span class="s-ok"><b>'+cnt.ok+'</b> saudáveis</span><span class="s-warn"><b>'+cnt.warn+'</b> atenção</span><span class="s-bad"><b>'+cnt.bad+'</b> críticos</span></div>'+
      '<table><thead><tr><th>Serviço</th><th>Preço</th><th>Sobra</th><th>Margem</th><th>Preço sugerido ('+tP+'%)</th></tr></thead><tbody>'+
      lista.map(o=>{const l=status(o.x.resP,t);return '<tr><td>'+esc(o.s.name)+'</td><td>'+brl(o.x.P)+'</td><td>'+brl(o.x.res)+'</td><td><span class="dot s-'+l+'"><i></i>'+pct(o.x.resP)+'</span></td><td>'+(o.x.sug?brl(o.x.sug):'—')+'</td></tr>'}).join('')+
      '</tbody></table>'+(sv.length>10?'<p class="nota">Os 10 serviços com menor margem, de '+sv.length+'.</p>':''));
  }

  /* 7 produtos */
  const pd=(S.products||[]).map(p=>({p,x:calcProd(p,r)})).filter(o=>o.x.P>0);
  if(pd.length){
    const lista=pd.slice().sort((a,b)=>a.x.resP-b.x.resP).slice(0,10);
    slide('Produtos de revenda',
      '<table><thead><tr><th>Produto</th><th>Preço</th><th>Custo</th><th>Sobra</th><th>Margem</th><th>Preço sugerido</th></tr></thead><tbody>'+
      lista.map(o=>{const l=status(o.x.resP,t);return '<tr><td>'+esc(o.p.name)+'</td><td>'+brl(o.x.P)+'</td><td>'+brl(o.x.cost)+'</td><td>'+brl(o.x.res)+'</td><td><span class="dot s-'+l+'"><i></i>'+pct(o.x.resP)+'</span></td><td>'+(o.x.sug?brl(o.x.sug):'—')+'</td></tr>'}).join('')+
      '</tbody></table>'+(pd.length>10?'<p class="nota">Os 10 produtos com menor margem, de '+pd.length+'.</p>':''));
  }

  /* 8 evolução */
  const hist=Object.keys(S.months).sort().filter(x=>x<=k&&Number(S.months[x].fat)>0).slice(-6);
  if(hist.length>1){
    const cs=hist.map(x=>({k:x,c:calcMonth(S.months[x])})), mx=Math.max(...cs.map(o=>o.c.F));
    slide('Evolução dos últimos meses','<div class="cols">'+cs.map(o=>'<div class="col"><b>'+pct(o.c.rP,0)+'</b><div class="col-bar"><i style="height:'+(o.c.F/mx*100)+'%"></i><i class="lu" style="height:'+(Math.max(0,o.c.R)/mx*100)+'%"></i></div><span>'+mCurto(o.k)+'</span><small>'+brl(o.c.F,0)+'</small></div>').join('')+'</div>'+
      '<div class="legend inline"><div><i style="background:#0B5CFF"></i>Faturamento</div><div><i style="background:'+COL.lucro+'"></i>Lucro</div><div>% acima de cada barra: margem de lucro</div></div>');
  }

  /* 9 próximos passos */
  const passos=[];
  if(c.R<0) passos.push('O mês fechou no prejuízo de <b>'+brl(-c.R,0)+'</b>. Prioridade: reajustar os serviços críticos e cortar custos fixos.');
  else if(st!=='ok') passos.push('A margem está em <b>'+pct(c.rP)+'</b>, abaixo da meta de '+tP+'%. Faltam <b>'+brl(c.F*t-c.R,0)+'</b> de lucro por mês para chegar lá.');
  else passos.push('A margem de <b>'+pct(c.rP)+'</b> está na meta. O foco agora é manter os preços atualizados e crescer o faturamento.');
  const crit=sv.filter(o=>status(o.x.resP,t)==='bad').sort((a,b)=>a.x.resP-b.x.resP);
  if(crit.length) passos.push('<b>'+crit.length+' serviço'+(crit.length>1?'s':'')+' crítico'+(crit.length>1?'s':'')+'</b>. Começar por: '+crit.slice(0,3).map(o=>esc(o.s.name)+(o.x.sug?' (de '+brl(o.x.P)+' para '+brl(o.x.sug)+')':'')).join(', ')+'.');
  if(c.PE!=null&&c.F>=c.PE&&c.F<c.PE*1.15) passos.push('O faturamento está só <b>'+pct(c.F/c.PE-1,0)+'</b> acima do ponto de equilíbrio: pouca folga para um mês fraco.');
  if(c.PE!=null&&c.F<c.PE) passos.push('Faltam <b>'+brl(c.PE-c.F,0)+'</b> de faturamento por mês só para empatar.');
  if(custos[0]&&custos[0].v/c.F>0.25) passos.push('<b>'+esc(custos[0].n)+'</b> sozinho leva '+pct(custos[0].v/c.F,0)+' do faturamento. Vale revisar esse custo.');
  if(!sv.length) passos.push('Cadastrar os serviços com preço e comissão para calcular a margem de cada um.');
  slide('Próximos passos','<ol class="passos">'+passos.map(p=>'<li>'+p+'</li>').join('')+'</ol>');
  return out;
}

const CSS=`
*{box-sizing:border-box}html,body{margin:0}
body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#E9EEF7;color:#0B1530;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.bar-top{position:sticky;top:0;z-index:5;display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px 16px;background:#0B1530;color:#fff;font-size:14px;font-weight:600}
.bar-top select,.bar-top button{font:700 14px inherit;font-family:inherit;border-radius:10px;padding:8px 14px;border:0;cursor:pointer}
.bar-top select{background:#1B2A55;color:#fff}.bar-top button{background:#0B5CFF;color:#fff}
.deck{display:grid;gap:24px;justify-items:center;padding:24px 16px 48px}
.slide{position:relative;width:min(100%,1100px);aspect-ratio:16/9;background:#fff;border-radius:18px;box-shadow:0 10px 30px rgba(11,21,48,.12);padding:4.2% 5.5%;display:flex;flex-direction:column;overflow:hidden;container-type:inline-size}
.slide header{display:flex;justify-content:space-between;align-items:center;font-size:1.5cqw;color:#5B6785;font-weight:700}
.slide footer{position:absolute;right:5.5%;bottom:3.5%;font-size:1.3cqw;color:#9AA3BA;font-weight:700}
.slide h2{font-size:3.6cqw;margin:2.2cqw 0 2.4cqw;letter-spacing:-.02em;font-weight:800}
.sl-body{flex:1;display:flex;flex-direction:column;justify-content:center;gap:2.4cqw;font-size:1.7cqw}
.mish{display:inline-block;height:1.6em;aspect-ratio:3.1;background:currentColor;-webkit-mask:var(--mask) center/contain no-repeat;mask:var(--mask) center/contain no-repeat;vertical-align:middle;color:#0B5CFF}
.capa{background:linear-gradient(135deg,#0B5CFF,#0A2A8A);color:#fff;justify-content:center}
.capa .mish{color:#fff}.capa-in{display:flex;flex-direction:column;gap:1cqw}
.cli-logo{width:9cqw;height:9cqw;object-fit:cover;border-radius:2cqw;background:#fff;margin-bottom:1cqw}
.kicker{margin:0;text-transform:uppercase;letter-spacing:.14em;font-weight:800;font-size:1.6cqw;opacity:.85}
.capa h1{margin:0;font-size:7cqw;line-height:1;letter-spacing:-.03em;font-weight:800}
.capa-mes{margin:0;font-size:2.6cqw;font-weight:600;opacity:.9}
.capa-by{position:absolute;right:5.5%;bottom:6%;font-size:2cqw;font-weight:700;display:flex;gap:.6cqw;align-items:center}
.lead{font-size:2.2cqw;line-height:1.4;margin:0;max-width:80%}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:1.6cqw}.kpis.three{grid-template-columns:repeat(3,1fr)}
.kpi{border:1px solid #E1E6F0;border-radius:1.6cqw;padding:2cqw}
.kpi span{display:block;font-size:1.35cqw;font-weight:800;color:#5B6785;text-transform:uppercase;letter-spacing:.05em}
.kpi b{display:block;font-size:3.4cqw;font-weight:800;margin-top:.6cqw;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.kpi small{display:block;font-size:1.3cqw;color:#5B6785;margin-top:.5cqw;font-weight:600}
.badge{align-self:flex-start;display:flex;align-items:center;gap:1cqw;margin:0;padding:1.1cqw 1.8cqw;border-radius:99px;font-weight:700;font-size:1.7cqw}
.badge i,.dot i{width:1cqw;height:1cqw;border-radius:50%;background:currentColor;display:inline-block}
.s-ok{color:#15803D}.s-warn{color:#B45309}.s-bad{color:#DC2626}.s-none{color:#5B6785}
.badge.s-ok{background:#DCFCE7}.badge.s-warn{background:#FEF3C7}.badge.s-bad{background:#FEE2E2}
.split{display:flex;height:9cqw;border-radius:1.6cqw;overflow:hidden}
.split div{display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:2cqw;white-space:nowrap}
.legend{display:grid;grid-template-columns:repeat(3,1fr);gap:1.6cqw}
.legend div{display:grid;grid-template-columns:auto 1fr;column-gap:1cqw;align-items:center;font-weight:700}
.legend i{width:1.4cqw;height:1.4cqw;border-radius:.4cqw;grid-row:span 2}
.legend small{grid-column:2;color:#5B6785;font-weight:600;font-size:1.3cqw}
.legend b{grid-column:2;font-size:2.6cqw}
.legend.inline{display:flex;gap:2.4cqw;justify-content:center;font-size:1.3cqw;color:#5B6785}.legend.inline div{display:flex;gap:.6cqw}.legend.inline i{grid-row:auto}
.track{position:relative;height:5cqw;background:#EEF2F9;border-radius:1.2cqw;margin-top:3cqw}
.tr-fat{height:100%;background:#0B5CFF;border-radius:1.2cqw;display:flex;align-items:center;padding-left:1.6cqw;color:#fff;font-weight:800;white-space:nowrap}
.tr-mark{position:absolute;top:-1.2cqw;bottom:-1.2cqw;width:.35cqw;background:#0B1530;font-style:normal}
.tr-mark.goal{background:#16A34A}
.tr-mark span{position:absolute;top:-2.6cqw;left:50%;transform:translateX(-50%);font-size:1.3cqw;font-weight:800;white-space:nowrap}
.bars{display:grid;gap:1.3cqw}
.bar{display:grid;grid-template-columns:28% 1fr 17%;gap:1.6cqw;align-items:center}
.bar span{font-weight:700;display:flex;flex-direction:column}.bar span small,.bar b small{font-size:1.15cqw;color:#5B6785;font-weight:600}
.bar div{height:2.6cqw;background:#EEF2F9;border-radius:.8cqw;overflow:hidden}.bar div i{display:block;height:100%;border-radius:.8cqw}
.bar b{text-align:right;display:flex;flex-direction:column;font-variant-numeric:tabular-nums}
.chips{display:flex;gap:1cqw;flex-wrap:wrap}.chips span{border:1px solid #E1E6F0;border-radius:99px;padding:.6cqw 1.4cqw;font-weight:700;font-size:1.4cqw}
table{width:100%;border-collapse:collapse;font-size:1.45cqw;font-variant-numeric:tabular-nums}
th{text-align:left;color:#5B6785;font-size:1.2cqw;text-transform:uppercase;letter-spacing:.04em;padding:0 1cqw .8cqw;border-bottom:2px solid #E1E6F0}
td{padding:.75cqw 1cqw;border-bottom:1px solid #EEF2F9;font-weight:600}
.dot{display:inline-flex;align-items:center;gap:.6cqw;font-weight:800}
.nota{margin:0;color:#5B6785;font-size:1.25cqw}
.cols{display:flex;gap:2.4cqw;align-items:flex-end;justify-content:center;height:24cqw}
.col{display:flex;flex-direction:column;align-items:center;gap:.6cqw;width:9cqw;height:100%;justify-content:flex-end}
.col b{font-size:1.5cqw}.col span{font-weight:800}.col small{color:#5B6785;font-size:1.2cqw;font-weight:600}
.col-bar{position:relative;width:100%;flex:1;display:flex;align-items:flex-end}
.col-bar i{position:absolute;bottom:0;left:0;right:0;background:#0B5CFF;border-radius:.8cqw .8cqw 0 0}
.col-bar i.lu{left:25%;right:25%;background:#16A34A}
.passos{margin:0;padding-left:3cqw;display:grid;gap:1.8cqw;font-size:2cqw;line-height:1.4}
@media (max-width:700px){.deck{padding:12px 8px}}
@page{size:1280px 720px;margin:0}
@media print{
  body{background:#fff}.bar-top{display:none}.deck{padding:0;gap:0;display:block}
  .slide{width:1280px;height:720px;aspect-ratio:auto;border-radius:0;box-shadow:none;break-after:page;page-break-after:always}
}`;

window.MISH_APRESENTACAO=function(S,email){
  const w=window.open('','_blank');
  if(!w){ alert('O navegador bloqueou a nova aba. Permita pop-ups para este site e tente de novo.'); return; }
  const base=location.href.replace(/[^/]*$/,'');
  const meses=Object.keys(S.months||{}).sort();
  const inicial=meses.filter(k=>Number(S.months[k].fat)>0).pop()||meses.pop();
  const nome=(S.company&&S.company.name)||email||'Cliente';
  w.document.open();
  w.document.write('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<title>Apresentação · '+esc(nome)+'</title>'+
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">'+
    '<style>'+CSS+'</style></head><body>'+
    '<div class="bar-top"><span>'+esc(nome)+'</span><select id="mes" aria-label="Mês">'+meses.slice().reverse().map(k=>'<option value="'+k+'"'+(k===inicial?' selected':'')+'>'+mLabel(k)+'</option>').join('')+'</select>'+
    '<button id="pdf" type="button">Salvar PDF / imprimir</button></div><main class="deck" id="deck"></main></body></html>');
  w.document.close();
  const deck=w.document.getElementById('deck');
  const desenhar=k=>{ deck.innerHTML=inicial?slides(S,k,email,base).join(''):'<section class="slide"><div class="sl-body"><p class="lead">Este cliente ainda não preencheu nenhum mês.</p></div></section>'; };
  desenhar(inicial);
  const sel=w.document.getElementById('mes'); if(sel)sel.onchange=()=>desenhar(sel.value);
  w.document.getElementById('pdf').onclick=()=>w.print();
};
})();
