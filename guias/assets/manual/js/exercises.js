/* Exercicios interativos: multipla escolha e calculo, com correcao imediata, explicacao e referencia. */
(function () {
  'use strict';
  var PPI = window.PPI, $ = PPI.$, $$ = PPI.$$, el = PPI.el, D = window.PPI_DATA;
  var X = PPI.exercises = {}, state = null;
  function load() { if (!state) state = PPI.storage.get(PPI.KEY.exercises, {}) || {}; }
  function save() { PPI.storage.set(PPI.KEY.exercises, state); }

  function parseNum(s) {
    s = String(s).replace(/R\$|%|\s/g, '');
    if (!s) return NaN;
    if (s.indexOf(',') > -1) s = s.replace(/\./g, '').replace(',', '.');
    else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    return /^-?\d+(\.\d+)?$/.test(s) ? parseFloat(s) : NaN;
  }
  function fmt(q) {
    var v = q.value, str = v.toLocaleString('pt-BR', { minimumFractionDigits: (v % 1 ? 2 : 0), maximumFractionDigits: 2 });
    return (q.prefix ? q.prefix + ' ' : '') + str + (q.suffix || '');
  }

  function refLink(q) { var r = q.ref; return r ? el('a', { href: '#' + r[0], text: 'Rever: ' + r[1] }) : null; }

  function feedback(card, q, ok, extra) {
    var fb = card.querySelector('.qz-fb'); fb.innerHTML = '';
    fb.appendChild(el('strong', {}, [PPI.icon(ok ? 'check' : 'warn'), document.createTextNode(ok ? 'Correto.' : 'Ainda não.' + (extra || ''))]));
    fb.firstChild.firstChild.setAttribute('width', 16); fb.firstChild.firstChild.setAttribute('height', 16);
    fb.appendChild(el('p', { text: q.exp }));
    var r = refLink(q); if (r) fb.appendChild(r);
    card.dataset.state = ok ? 'ok' : 'bad';
  }

  function renderMC(card, q, saved) {
    var fs = el('fieldset', { class: 'qz-opts' }), name = 'q-' + q.id;
    fs.appendChild(el('legend', { class: 'sr-only', text: q.q }));
    q.opts.forEach(function (o, i) {
      var inp = el('input', { type: 'radio', name: name, value: i });
      var lab = el('label', { class: 'qz-opt' }, [inp, el('span', { text: o })]);
      inp.addEventListener('change', function () { answer(i); });
      fs.appendChild(lab);
    });
    function answer(i) {
      var ok = i === q.ans; state[q.id] = { a: i, ok: ok }; save();
      paint(i); PPI.bus.emit('exercise');
    }
    function paint(i) {
      var labs = $$('.qz-opt', fs);
      labs.forEach(function (l, j) { l.classList.remove('is-right', 'is-wrong'); l.querySelector('input').checked = (j === i); });
      var ok = i === q.ans; labs[i].classList.add(ok ? 'is-right' : 'is-wrong'); if (!ok) labs[q.ans].classList.add('is-right');
      feedback(card, q, ok, ' A resposta correta está destacada.');
      PPI.announce(ok ? 'Resposta correta.' : 'Resposta incorreta. A correta é: ' + q.opts[q.ans]);
      retry.hidden = false;
    }
    var retry = el('button', { type: 'button', class: 'btn sm', text: 'Tentar de novo', hidden: true, on: { click: function () {
      delete state[q.id]; save(); card.removeAttribute('data-state'); $$('.qz-opt', fs).forEach(function (l) { l.classList.remove('is-right', 'is-wrong'); l.querySelector('input').checked = false; }); retry.hidden = true; fs.querySelector('input').focus(); PPI.bus.emit('exercise');
    } } });
    card.appendChild(fs); card.appendChild(el('div', { class: 'qz-fb', role: 'status' })); card.appendChild(retry);
    if (saved && saved.a != null) paint(saved.a);
  }

  function renderCalc(card, q, saved) {
    var id = 'qi-' + q.id;
    var inp = el('input', { type: 'text', inputmode: 'decimal', class: 'field', id: id, autocomplete: 'off', 'aria-describedby': id + '-h' });
    var btn = el('button', { type: 'submit', class: 'btn primary', text: 'Verificar' });
    var retry = el('button', { type: 'button', class: 'btn sm', text: 'Tentar de novo', hidden: true });
    var form = el('form', { class: 'qz-calc', novalidate: true }, [el('label', { class: 'lbl', for: id }, [el('span', { text: 'Sua resposta' + (q.prefix ? ' (' + q.prefix + ')' : '') + (q.suffix ? ' (' + q.suffix + ')' : '') }), inp]), btn, retry]);
    var help = el('span', { id: id + '-h', class: 'dgx-fine', text: 'Use vírgula para centavos. Exemplo: 1.234,50' });
    function check(v) {
      var ok = Math.abs(v - q.value) <= (q.tol == null ? 0.005 : q.tol);
      state[q.id] = { v: inp.value, ok: ok }; save();
      feedback(card, q, ok, ok ? '' : ' Seu resultado: ' + inp.value + '. Valor esperado: ' + fmt(q) + '.');
      inp.setAttribute('aria-invalid', ok ? 'false' : 'true'); retry.hidden = false; btn.disabled = true; inp.readOnly = true;
      PPI.announce(ok ? 'Resposta correta.' : 'Resposta incorreta. O valor esperado é ' + fmt(q)); PPI.bus.emit('exercise');
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var v = parseNum(inp.value);
      if (isNaN(v)) { var fb = card.querySelector('.qz-fb'); card.dataset.state = 'bad'; fb.innerHTML = '<strong>Digite um número.</strong><p>Exemplos válidos: 7900, 7.900,00 ou 7900,5.</p>'; inp.setAttribute('aria-invalid', 'true'); inp.focus(); return; }
      check(v);
    });
    retry.addEventListener('click', function () { delete state[q.id]; save(); card.removeAttribute('data-state'); inp.value = ''; inp.readOnly = false; inp.removeAttribute('aria-invalid'); btn.disabled = false; retry.hidden = true; inp.focus(); PPI.bus.emit('exercise'); });
    card.appendChild(form); card.appendChild(help); card.appendChild(el('div', { class: 'qz-fb', role: 'status' }));
    if (saved && saved.v != null) { inp.value = saved.v; var v = parseNum(saved.v); if (!isNaN(v)) check(v); }
  }

  X.render = function (holder, sid) {
    load();
    var list = D.exercises[sid] || [];
    holder.appendChild(el('p', { class: 'practice-intro', text: 'Os exercícios aplicam regras e fórmulas descritas nesta seção, com números fictícios. A correção é imediata e cada resposta traz a explicação e o link para a parte do manual que sustenta a regra.' }));
    var score = el('div', { class: 'qz-score', 'aria-live': 'polite' }, [el('span', { class: 'sc-t' }), el('span', { class: 'bar', 'aria-hidden': 'true' }, [el('i')])]);
    holder.appendChild(score);
    list.forEach(function (q, i) {
      var card = el('article', { class: 'qz', id: 'ex-' + q.id });
      card.appendChild(el('div', { class: 'qz-h' }, [el('span', { class: 'qz-n', text: 'Questão ' + (i + 1) + ' de ' + list.length }), q.tag ? el('span', { class: 'tag pre', text: q.tag }) : null, el('span', { class: 'tag ' + (q.kind === 'calc' ? 'mod' : 'doc'), text: q.kind === 'calc' ? 'Cálculo' : 'Múltipla escolha' })]));
      card.appendChild(el('p', { class: 'qz-q', text: q.q }));
      (q.kind === 'calc' ? renderCalc : renderMC)(card, q, state[q.id]);
      holder.appendChild(card);
    });
    function upd() {
      var ok = list.filter(function (q) { return state[q.id] && state[q.id].ok; }).length, ans = list.filter(function (q) { return state[q.id]; }).length;
      score.querySelector('.sc-t').textContent = 'Acertos: ' + ok + ' de ' + list.length + (ans < list.length ? ' · respondidas: ' + ans : '');
      score.querySelector('.bar i').style.width = (list.length ? ok / list.length * 100 : 0) + '%';
    }
    PPI.bus.on('exercise', upd); upd();
    holder.appendChild(el('div', { class: 'qz-score' }, [el('button', { type: 'button', class: 'btn sm', text: 'Refazer todos os exercícios', on: { click: function () {
      PPI.confirm({ title: 'Refazer os exercícios desta seção?', message: 'As respostas salvas neste navegador para esta seção serão apagadas.', confirmLabel: 'Refazer' }).then(function (ok) {
        if (!ok) return; list.forEach(function (q) { delete state[q.id]; }); save();
        $$('.qz', holder).forEach(function (c) { c.removeAttribute('data-state'); var r = c.querySelector('button.sm'); if (r && !r.hidden) r.click(); }); upd();
      });
    } } })]));
  };
})();
