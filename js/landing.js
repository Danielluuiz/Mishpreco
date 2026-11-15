/* Landing MISH Precificação: calculadora de demonstração, formulário do WhatsApp e botão flutuante.
   A página funciona sem este arquivo (o formulário abre o WhatsApp com a mensagem padrão). */

const brl = (v, d = 2) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: d, maximumFractionDigits: d });
const pct = v => (v * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
const $ = id => document.getElementById(id);

/* ---------- calculadora ----------
   Mesma lógica do app, com parâmetros de exemplo: a taxa de cartão incide sobre o preço,
   o imposto sobre a parte do salão (preço − comissão) e os custos fixos entram como % do faturamento. */
const CARTAO = 0.03, IMPOSTO = 0.06, FIXOS = 0.30, META = 0.25;
const STATUS = { 's-ok': 'Saudável', 's-warn': 'Atenção', 's-bad': 'No vermelho' };

function calcular() {
  const P = +$('c-preco').value, c = +$('c-com').value / 100, prod = +$('c-prod').value;
  const comissao = P * c, taxas = P * CARTAO + (P - comissao) * IMPOSTO, fixos = P * FIXOS;
  const sobra = P - comissao - prod - taxas - fixos, m = sobra / P;
  const st = m >= META - 0.001 ? 's-ok' : m >= META - 0.03 ? 's-warn' : 's-bad';

  $('o-preco').textContent = brl(P, 0);
  $('o-com').textContent = Math.round(c * 100) + '%';
  $('o-prod').textContent = brl(prod, 0);

  const big = $('calc-pct'), pill = $('calc-pill');
  big.textContent = pct(m);
  big.className = 'calc-big ' + st;
  pill.className = 'pill ' + st;
  pill.lastElementChild.textContent = STATUS[st];
  $('calc-val').parentElement.firstChild.textContent = sobra < 0 ? 'Faltam ' : 'Sobram ';
  $('calc-val').textContent = brl(Math.abs(sobra));
  $('calc-de').textContent = brl(P, 0);

  const seg = [comissao, prod, taxas, fixos, Math.max(sobra, 0)];
  [...$('calc-bar').children].forEach((el, i) => { el.style.flexGrow = Math.max(seg[i], 0).toFixed(2); });
  $('calc-bar').setAttribute('aria-label',
    `De ${brl(P, 0)}: comissão ${brl(comissao)}, produto ${brl(prod)}, cartão e imposto ${brl(taxas)}, custos fixos ${brl(fixos)}, sobra ${brl(sobra)}`);

  /* preço que faria sobrar a meta, mantendo comissão e produto */
  const k = 1 - c - CARTAO - IMPOSTO * (1 - c) - FIXOS - META, tip = $('calc-tip');
  if (st === 's-ok') tip.innerHTML = 'Este serviço está <b>acima da meta de 25%</b>.';
  else if (k > 0 && prod > 0) tip.innerHTML = `Para sobrar 25%, o preço precisaria ser <b>${brl(Math.ceil(prod / k), 0)}</b>.`;
  else tip.innerHTML = 'Com essa comissão, <b>aumentar o preço não resolve</b>: é preciso rever comissão ou custos.';
}
if ($('calc')) { $('calc').addEventListener('input', calcular); calcular(); }

/* ---------- formulário "Quero usar" -> WhatsApp ---------- */
const form = $('form-quero');
if (form) {
  form.addEventListener('submit', () => {
    const nome = $('q-nome').value.trim(), salao = $('q-salao').value.trim();
    let msg = 'Quero a MISH Precificação.';
    if (nome) msg = `Olá! Meu nome é ${nome}${salao ? ', do ' + salao : ''}. Quero a MISH Precificação.`;
    else if (salao) msg = `Olá! Sou do ${salao}. Quero a MISH Precificação.`;
    form.elements.text.value = msg;   /* o envio normal do formulário abre wa.me com ?text=... */
  });
  /* Enter no primeiro campo vai para o segundo em vez de enviar */
  $('q-nome').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('q-salao').focus(); } });
}

/* ---------- botão flutuante (celular): aparece depois da capa e some no formulário final ---------- */
const fc = document.querySelector('.float-cta'), hero = document.querySelector('.hero'), alvo = $('quero');
if (fc && hero && alvo && 'IntersectionObserver' in window) {
  const vis = new Map([[hero, true], [alvo, false]]);
  const io = new IntersectionObserver(es => {
    es.forEach(x => vis.set(x.target, x.isIntersecting));
    fc.classList.toggle('show', !vis.get(hero) && !vis.get(alvo));
  }, { threshold: 0.12 });
  io.observe(hero); io.observe(alvo);
}
