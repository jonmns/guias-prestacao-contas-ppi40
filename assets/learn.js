/* Portal PPI 4.0 · aprendizado: avaliações, exercícios, calculadora, checklists e navegação das lições */
(function () {
  'use strict';
  if (!window.PPI) return;
  var PPI = window.PPI;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------- avaliação curta ---------- */
  $$('[data-quiz]').forEach(function (sec) {
    var id = sec.getAttribute('data-quiz'), form = $('form', sec), score = $('.score', sec);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fs = $$('fieldset.q', form), ok = 0, answered = 0;
      fs.forEach(function (f) {
        var ans = +f.getAttribute('data-ans'), why = f.getAttribute('data-why'), fb = $('.fb', f);
        var chosen = $('input:checked', f);
        $$('.opt', f).forEach(function (o) { o.classList.remove('right', 'wrong'); });
        fb.hidden = false; fb.classList.remove('ok', 'no');
        if (!chosen) { fb.textContent = 'Sem resposta. A opção correta é: ' + $$('.opt span', f)[ans].textContent + ' ' + why; fb.classList.add('no'); return; }
        answered++;
        var lab = chosen.closest('.opt');
        if (+chosen.value === ans) { ok++; lab.classList.add('right'); fb.classList.add('ok'); fb.textContent = 'Correto. ' + why; }
        else { lab.classList.add('wrong'); $$('.opt', f)[ans].classList.add('right'); fb.classList.add('no'); fb.textContent = 'Não é esta opção. ' + why; }
      });
      score.textContent = 'Você acertou ' + ok + ' de ' + fs.length + (answered < fs.length ? ' (há perguntas sem resposta).' : '.');
      var prev = PPI.state.q[id];
      if (answered === fs.length && (!prev || ok > prev.best)) { PPI.state.q[id] = { best: ok, total: fs.length }; PPI.save(); }
    });
    $('[data-act=reset]', sec).addEventListener('click', function () {
      $$('input', form).forEach(function (i) { i.checked = false; });
      $$('.opt', form).forEach(function (o) { o.classList.remove('right', 'wrong'); });
      $$('.fb', form).forEach(function (f) { f.hidden = true; f.textContent = ''; });
      score.textContent = '';
    });
  });

  /* ---------- classificação ---------- */
  $$('[data-cls]').forEach(function (sec) {
    var score = $('.score', sec), lis = $$('.cls li', sec);
    $('[data-act=check]', sec).addEventListener('click', function () {
      var ok = 0, ans = 0;
      lis.forEach(function (li) {
        var s = $('select', li), fb = $('.fb', li), want = li.getAttribute('data-ans'), why = li.getAttribute('data-why');
        li.classList.remove('right', 'wrong'); fb.hidden = false; fb.classList.remove('ok', 'no');
        if (s.value === '') { fb.textContent = 'Escolha uma opção. ' + why; fb.classList.add('no'); return; }
        ans++;
        if (s.value === want) { ok++; li.classList.add('right'); fb.classList.add('ok'); fb.textContent = 'Correto. ' + why; }
        else { li.classList.add('wrong'); fb.classList.add('no'); fb.textContent = 'Resposta esperada: ' + s.options[+want + 1].textContent + '. ' + why; }
      });
      score.textContent = ok + ' de ' + lis.length + ' corretas' + (ans < lis.length ? ' (há itens sem resposta).' : '.');
    });
    $('[data-act=reset]', sec).addEventListener('click', function () {
      lis.forEach(function (li) { $('select', li).value = ''; li.classList.remove('right', 'wrong'); var fb = $('.fb', li); fb.hidden = true; fb.textContent = ''; });
      score.textContent = '';
    });
  });

  /* ---------- calculadora de índices ---------- */
  $$('[data-calc=ind]').forEach(function (c) {
    var f = function (k) { var v = parseFloat($('[data-f=' + k + ']', c).value.replace(',', '.')); return isFinite(v) ? v : null; };
    var out = function (k, v) { $('[data-o=' + k + ']', c).textContent = v; };
    var fmt = function (n, s) { return n.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + (s || ''); };
    var money = function (n) { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
    function run() {
      var pur = f('pur'), real = f('real'), hp = f('hpur'), hr = f('hreal');
      var pr = pur > 0 && real !== null ? real / pur * 100 : null, ph = hp > 0 && hr !== null ? hr / hp * 100 : null;
      out('pr', pr === null ? '–' : fmt(pr, '%')); out('ph', ph === null ? '–' : fmt(ph, '%'));
      out('dist', pr !== null && ph !== null ? fmt(pr - ph, ' p.p.') : '–');
      var ch = hr > 0 && real !== null ? real / hr : null, chp = hp > 0 && pur !== null ? pur / hp : null;
      out('ch', ch === null ? '–' : money(ch) + '/h'); out('chp', chp === null ? '–' : money(chp) + '/h');
      var r = $('p[data-o=read]', c), msg = [];
      if (pr !== null && ph !== null) {
        if (pr - ph > 0.05) msg.push('O % de R$ está acima do % de horas: o projeto paga mais por hora do que previu. O manual manda testar hipóteses como reajuste, encargos ou provisões acima do previsto e perfil mais sênior que o planejado, e confirmar na Abertura de Pagamentos, na folha e no ponto.');
        else if (pr - ph < -0.05) msg.push('O % de R$ está abaixo do % de horas: o projeto entrega horas a um custo menor que o previsto, o que também merece explicação.');
        else msg.push('R$ e horas andam juntos neste recorte. Isso não prova que o projeto vai bem: confira o técnico e o cronograma.');
      }
      if (ch !== null && chp !== null) msg.push(ch > chp ? 'O custo da hora realizado está acima do planejado, o que aponta efeito preço.' : ch < chp ? 'O custo da hora realizado está abaixo do planejado.' : 'O custo da hora realizado é igual ao planejado.');
      if (msg.length) { r.hidden = false; r.className = 'fb'; r.textContent = msg.join(' ') + ' Lembre-se: a causa só vale depois de confirmada em documento.'; } else { r.hidden = true; }
    }
    $$('input', c).forEach(function (i) { i.addEventListener('input', run); });
  });

  /* ---------- checklists ---------- */
  var LEGACY = 'manual-ppi40-check';
  $$('.cklist[data-ck]').forEach(function (sec) {
    var id = sec.getAttribute('data-ck'), legacy = sec.hasAttribute('data-legacy');
    var boxes = $$('input[type=checkbox]', sec), bar = $('.pbar', sec), txt = $('[data-prog-text]', sec);
    function get() {
      if (legacy) { try { return JSON.parse(PPI.lsGet(LEGACY) || '{}') || {}; } catch (e) { return {}; } }
      return PPI.state.c[id] || {};
    }
    function put(o) {
      if (legacy) { PPI.lsSet(LEGACY, JSON.stringify(o)); } else { PPI.state.c[id] = o; PPI.save(); }
    }
    function paint() {
      var s = get(), n = 0;
      boxes.forEach(function (b) { var on = !!s[b.getAttribute('data-ckid')]; b.checked = on; if (on) n++; });
      if (txt) txt.textContent = n + ' de ' + boxes.length;
      if (bar) { var p = boxes.length ? Math.round(n / boxes.length * 100) : 0; bar.setAttribute('aria-valuenow', p); bar.firstElementChild.style.width = p + '%'; }
    }
    boxes.forEach(function (b) {
      b.addEventListener('change', function () {
        var s = get(), k = b.getAttribute('data-ckid'); if (b.checked) s[k] = true; else delete s[k]; put(s); paint();
      });
    });
    var reset = $('[data-act=reset]', sec), pr = $('[data-act=print]', sec);
    if (reset) reset.addEventListener('click', function () { if (window.confirm('Limpar as marcações deste checklist?')) { put({}); paint(); } });
    if (pr) pr.addEventListener('click', function () {
      $$('.cklist').forEach(function (o) { o.style.display = o === sec ? '' : 'none'; });
      window.print();
      $$('.cklist').forEach(function (o) { o.style.display = ''; });
    });
    window.addEventListener('ppi:change', paint);
    window.addEventListener('storage', paint);
    paint();
  });

  /* ---------- lições: item ativo e "continuar" ---------- */
  var lessons = $$('article.lesson[data-lesson]');
  if (lessons.length && 'IntersectionObserver' in window) {
    var links = $$('.side-nav a[data-lesson-link]'), file = location.pathname.split('/').pop(), t, moved = false;
    ['scroll', 'keydown', 'pointerdown'].forEach(function (ev) { window.addEventListener(ev, function () { moved = true; }, { once: true, passive: true }); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.getAttribute('data-lesson');
        links.forEach(function (a) { if (a.getAttribute('data-lesson-link') === id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
        if (moved) { clearTimeout(t); t = setTimeout(function () { PPI.setLast({ m: null, sid: id, t: e.target.getAttribute('data-title'), u: 'aprender/' + file + '#' + id, ts: Date.now() }); }, 800); }
      });
    }, { rootMargin: '-20% 0px -65% 0px' });
    lessons.forEach(function (l) { io.observe(l); });
  }
})();
