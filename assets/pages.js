/* Portal PPI 4.0 · páginas do portal: início, trilha, consulta, glossário e meu espaço */
(function () {
  'use strict';
  if (!window.PPI) return;
  var PPI = window.PPI, B = PPI.base, page = document.body.getAttribute('data-page');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var MANUAL_NAMES = { guia: 'Guia de prestação de contas', ferramentas: 'Manual das ferramentas', normativa: 'Base normativa de PD&I' };

  function contCard() {
    var c = $('#cont-card'), l = PPI.state.l; if (!c) return;
    if (!l || !l.u) { c.classList.remove('show'); return; }
    c.href = B + l.u; c.classList.add('show');
    c.querySelector('b').textContent = l.t + (l.m && MANUAL_NAMES[l.m] ? ' · ' + MANUAL_NAMES[l.m] : '');
  }
  function favItems(list) {
    var f = PPI.state.f, keys = Object.keys(f);
    list.innerHTML = '';
    keys.forEach(function (k) {
      var it = f[k], li = document.createElement('li');
      var a = document.createElement('a'); a.href = B + it.u; a.textContent = it.t;
      var sp = document.createElement('span'); sp.className = 'muted'; sp.style.fontSize = '.8rem'; sp.textContent = ' ' + (MANUAL_NAMES[it.m] || '');
      var left = document.createElement('div'); left.appendChild(a); left.appendChild(sp);
      var b = document.createElement('button'); b.type = 'button'; b.className = 'btn sm ghost'; b.textContent = 'Remover';
      b.setAttribute('aria-label', 'Remover dos favoritos: ' + it.t);
      b.addEventListener('click', function () { PPI.toggleFav(k); });
      li.appendChild(left); li.appendChild(b); list.appendChild(li);
    });
    return keys.length;
  }

  /* ---------- início ---------- */
  function home() {
    contCard();
    var box = $('#fav-home'), list = $('#fav-home-list');
    function p() { var n = favItems(list); box.hidden = !n; }
    p(); window.addEventListener('ppi:change', function () { contCard(); p(); });
  }

  /* ---------- trilha ---------- */
  function hub() {
    contCard();
    function p() {
      $$('[data-quiz-best]').forEach(function (e) {
        var q = PPI.state.q[e.getAttribute('data-quiz-best')];
        e.innerHTML = q ? 'Melhor avaliação: <b>' + q.best + '/' + q.total + '</b>' : 'Avaliação ainda não feita';
      });
    }
    p(); window.addEventListener('ppi:change', function () { contCard(); p(); });
  }

  /* ---------- meu espaço ---------- */
  function me() {
    contCard();
    var stats = $('#stats'), les = stats.getAttribute('data-lessons').split(','), secs = stats.getAttribute('data-secs').split(',');
    var list = $('#fav-list'), empty = $('#fav-empty');
    function p() {
      var S = PPI.state;
      $('[data-st=lessons]').textContent = les.filter(function (k) { return S.s[k]; }).length;
      $('[data-st=secs]').textContent = secs.filter(function (k) { return S.s[k]; }).length;
      var n = favItems(list); $('[data-st=favs]').textContent = n; empty.style.display = n ? 'none' : '';
      $('[data-st=quiz]').textContent = Object.keys(S.q).length;
      contCard();
    }
    p(); window.addEventListener('ppi:change', p);
    $('#d-export').addEventListener('click', function () {
      var data = { app: 'portal-ppi40', version: 1, exportedAt: new Date().toISOString(), state: PPI.state, legacyChecklist: (function () { try { return JSON.parse(PPI.lsGet('manual-ppi40-check') || '{}'); } catch (e) { return {}; } })() };
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'portal-ppi40-meus-dados.json';
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    });
    $('#d-import').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var d = JSON.parse(r.result);
          if (!d || d.app !== 'portal-ppi40' || !d.state || typeof d.state !== 'object') throw new Error('formato');
          var s = d.state, ok = { s: {}, f: {}, q: {}, c: {}, l: null };
          Object.keys(s.s || {}).forEach(function (k) { if (typeof k === 'string' && k.length < 120) ok.s[k] = 1; });
          Object.keys(s.f || {}).forEach(function (k) { var v = s.f[k]; if (v && typeof v.t === 'string' && typeof v.u === 'string' && /^[\w\-./#]+$/.test(v.u)) ok.f[k] = { t: v.t.slice(0, 200), u: v.u, m: String(v.m || '') }; });
          Object.keys(s.q || {}).forEach(function (k) { var v = s.q[k]; if (v && isFinite(v.best) && isFinite(v.total)) ok.q[k] = { best: +v.best, total: +v.total }; });
          Object.keys(s.c || {}).forEach(function (k) { var v = s.c[k]; if (v && typeof v === 'object') { ok.c[k] = {}; Object.keys(v).forEach(function (i) { if (v[i]) ok.c[k][i] = 1; }); } });
          if (s.l && typeof s.l.u === 'string' && /^[\w\-./#]+$/.test(s.l.u)) ok.l = { m: String(s.l.m || ''), sid: String(s.l.sid || ''), t: String(s.l.t || '').slice(0, 200), u: s.l.u, ts: +s.l.ts || 0 };
          PPI.replaceState(ok);
          if (d.legacyChecklist && typeof d.legacyChecklist === 'object') PPI.lsSet('manual-ppi40-check', JSON.stringify(d.legacyChecklist));
          PPI.toast('Dados importados.');
        } catch (err) { PPI.toast('Arquivo inválido. Use um arquivo exportado por este portal.'); }
        e.target.value = '';
      };
      r.readAsText(f);
    });
    $('#d-reset').addEventListener('click', function () {
      if (!window.confirm('Apagar todo o progresso, os favoritos e as marcações de checklist deste navegador? Os manuais não são alterados.')) return;
      PPI.replaceState({ s: {}, f: {}, q: {}, c: {}, l: null }); PPI.lsDel('manual-ppi40-check'); PPI.toast('Dados apagados.');
    });
  }

  /* ---------- consulta ---------- */
  function consult() {
    var form = $('#s-form'), inp = $('#s-q'), fm = $('#f-m'), fc = $('#f-c'), fa = $('#f-a');
    var box = $('#resultados'), list = $('#res-list'), count = $('#res-count'), hubs = $('#atalhos');
    var chips = $$('[data-q]'), shown = 20, lastRes = [], lastT = [], D = null;
    var BADGE = { guia: 'm1', ferramentas: 'm2', normativa: 'm3', portal: 'pt' };
    function params() {
      var u = new URLSearchParams(location.search);
      inp.value = u.get('q') || ''; fm.value = u.get('m') || ''; fc.value = u.get('c') || ''; fa.value = u.get('a') || '';
    }
    function push() {
      var u = new URLSearchParams();
      if (inp.value.trim()) u.set('q', inp.value.trim()); if (fm.value) u.set('m', fm.value); if (fc.value) u.set('c', fc.value); if (fa.value) u.set('a', fa.value);
      var qs = u.toString(); try { history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '')); } catch (e) {}
    }
    function render() {
      var q = inp.value.trim(), f = { m: fm.value, c: fc.value, a: fa.value }, has = q || f.m || f.c || f.a;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', q && PPI.norm(c.getAttribute('data-q')) === PPI.norm(q) ? 'true' : 'false'); });
      if (!has) { box.style.display = 'none'; hubs.style.display = ''; return; }
      box.style.display = ''; hubs.style.display = q ? 'none' : '';
      if (!D) { count.textContent = 'Carregando o índice de busca…'; return; }
      var res;
      if (q) res = PPI.search(q, f);
      else res = D.items.filter(function (it) {
        return (!f.m || it.m === f.m) && (f.c === '' || it.c === +f.c) && (f.a === '' || (it.g || []).indexOf(+f.a) >= 0);
      }).map(function (it) { return { it: it }; });
      lastRes = res; lastT = PPI.terms(q);
      count.textContent = res.length ? res.length + (res.length === 1 ? ' resultado' : ' resultados') + (q ? ' para "' + q + '"' : ' com os filtros escolhidos') : '';
      paint();
    }
    function paint() {
      list.innerHTML = '';
      if (!lastRes.length) {
        var li = document.createElement('li'); li.className = 'empty';
        li.innerHTML = '<p style="margin:0 0 6px"><strong>Nenhum resultado.</strong></p><p style="margin:0">Tente outro termo, uma sigla (PC, RD, IG, PF, PUR) ou limpe os filtros. Também ajuda usar os <a href="#atalhos">atalhos por assunto</a>.</p>';
        list.appendChild(li); count.textContent = 'Nenhum resultado'; return;
      }
      lastRes.slice(0, shown).forEach(function (r) {
        var it = r.it, li = document.createElement('li'); li.className = 'res';
        var mname = it.m === 'portal' ? 'Portal' : D.manuals[it.m].short;
        li.innerHTML = '<div class="row"><span class="badge ' + BADGE[it.m] + '">' + PPI.esc(mname) + '</span><span class="badge pt">' + PPI.esc(D.cats[it.c]) + '</span></div>' +
          '<h3><a href="' + PPI.esc(PPI.url(it)) + '"></a></h3>' +
          '<div class="path-t">' + PPI.esc((it.m === 'portal' ? 'Portal' : D.manuals[it.m].title) + ' › ' + (it.p || '')) + '</div>' +
          '<p></p>';
        var a = li.querySelector('h3 a'); a.innerHTML = lastT.length ? PPI.markTitle(it, lastT) : PPI.esc(it.t);
        if (lastT.length && it.m !== 'portal') {
          var qv = inp.value.trim();
          var h = it.u.split('#'); a.href = B + h[0] + '?q=' + encodeURIComponent(qv) + (h[1] ? '#' + h[1] : '');
        }
        li.querySelector('p').innerHTML = lastT.length ? PPI.snippet(it, lastT) : PPI.esc(it.x.slice(0, 200)) + (it.x.length > 200 ? ' …' : '');
        list.appendChild(li);
      });
      if (lastRes.length > shown) {
        var more = document.createElement('li'); more.style.textAlign = 'center';
        more.innerHTML = '<button type="button" class="btn ghost">Mostrar mais resultados (' + (lastRes.length - shown) + ')</button>';
        more.querySelector('button').addEventListener('click', function () { shown += 20; paint(); });
        list.appendChild(more);
      }
    }
    function run() { shown = 20; push(); render(); }
    form.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    [fm, fc, fa].forEach(function (s) { s.addEventListener('change', run); });
    $('#f-clear').addEventListener('click', function () { fm.value = fc.value = fa.value = ''; run(); });
    chips.forEach(function (c) { c.addEventListener('click', function () { inp.value = c.getAttribute('data-q'); run(); inp.focus(); }); });
    var tmr; inp.addEventListener('input', function () { clearTimeout(tmr); tmr = setTimeout(run, 200); });
    params();
    PPI.loadIndex(function (d) {
      if (!d) { count.textContent = 'Não foi possível carregar o índice de busca. Use os atalhos ou o sumário de cada manual.'; return; }
      D = d; render();
    });
    render();
  }

  /* ---------- glossário ---------- */
  function glossary() {
    var inp = $('#g-q'), items = $$('#gl li'), cnt = $('#g-count');
    function run() {
      var q = PPI.norm(inp.value.trim()), n = 0;
      items.forEach(function (li) {
        var ok = !q || PPI.norm(li.textContent).indexOf(q) >= 0; li.hidden = !ok; if (ok) n++;
      });
      cnt.textContent = n + (n === 1 ? ' termo' : ' termos') + (q ? ' para "' + inp.value.trim() + '"' : '');
    }
    inp.addEventListener('input', run); run();
  }

  ({ home: home, 'learn-hub': hub, me: me, consult: consult, glossary: glossary }[page] || function () {})();
})();
