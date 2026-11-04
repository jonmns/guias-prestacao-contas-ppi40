/* Busca global: termos, rubricas, celulas, formulas, abas e erros, com resultado contextualizado e link direto. */
(function () {
  'use strict';
  var PPI = window.PPI, $ = PPI.$, $$ = PPI.$$, el = PPI.el, D = window.PPI_DATA;
  var S = PPI.search = { extra: [] };
  var units = null, dlg, input, listEl, countEl, filterEl, results = [], selIdx = -1, kind = 'all', building = false;
  var CONTAINERS = '.card,.callout,.idx,.rdc,.sg,.curve,.kpi,.nature-legend,.eq,.lines3,.blk,.stack-legend,.shot-key,.rdkey,.legend';
  var KINDS = { all: 'Tudo', Lição: 'Lições', Tabela: 'Tabelas', Fórmula: 'Fórmulas', Print: 'Prints', Mapa: 'Mapa', Diagnóstico: 'Diagnóstico', Glossário: 'Glossário' };

  function pathOf(L) { return [L.section.module.title, L.section.title].concat(L.multi ? [L.title] : []).join(' › '); }
  function skip(n) { return n.closest('[data-nosearch],.pager,.beginner,.qz,.practice,.tbl-tools,.gl-pop,.hs-tip'); }
  function nearestTitle(n, L) {
    var c = n.closest('.card,.callout,.idx,.rdc,.curve,.sg,.blk') || n.parentElement;
    var h = c && c.querySelector('h4,h5,.hd'); if (h) return PPI.text(h).slice(0, 90);
    return L.title;
  }

  function build() {
    var out = [];
    PPI.nav.lessons.forEach(function (L) {
      if (L.kind === 'practice') return;
      var path = pathOf(L);
      out.push({ kind: 'Lição', title: L.title, text: L.title + ' ' + L.section.title, snippet: L.section.title + (L.multi ? ' · ' + L.title : ''), path: path, node: L.el.id ? L.el : L.section.el, w: 4 });
      var seen = new Set();
      function add(n, k, title, text, w) {
        if (seen.has(n) || skip(n)) return; text = text || PPI.text(n); if (!text || text.length < 2) return; seen.add(n);
        out.push({ kind: k, title: title, text: text, snippet: text, path: path, node: n, w: w || 0 });
      }
      $$(CONTAINERS, L.el).forEach(function (n) {
        if (n.parentElement && n.parentElement.closest(CONTAINERS) && !n.classList.contains('eq')) { /* aninhado: o pai ja cobre */ if (!n.classList.contains('callout')) return; }
        add(n, n.classList.contains('eq') ? 'Fórmula' : 'Texto', n.classList.contains('eq') ? 'Fórmula · ' + L.title : nearestTitle(n, L), null, n.classList.contains('eq') ? 1 : 0);
      });
      $$('tbody tr', L.el).forEach(function (tr) {
        if (tr.closest('.anat')) return;
        var cells = $$('td', tr), t = cells.map(PPI.text).join(' · ');
        var th = tr.closest('table') ? $$('thead th', tr.closest('table')).map(PPI.text) : [];
        add(tr, 'Tabela', PPI.text(cells[0] || tr), t + ' ' + th.join(' '), 1);
        out[out.length - 1].snippet = cells.map(function (c, i) { return (th[i] && i ? th[i] + ': ' : '') + PPI.text(c); }).join(' · ');
      });
      $$('.steps li', L.el).forEach(function (li) { var h = li.querySelector('h4'); add(li, 'Passo', h ? PPI.text(h) : L.title, null, 1); });
      $$('.callouts li', L.el).forEach(function (li) { var f = li.closest('figure'); var c = f ? PPI.text(f.querySelector('.shot-h > span:nth-child(2)') || '') : ''; var n = PPI.text(li.querySelector('.cn') || ''); add(li, 'Print', 'Ponto ' + n + ' · ' + c, null, 1); });
      $$('p,li,dt,figcaption', L.el).forEach(function (n) { if (n.closest(CONTAINERS + ',tr,.callouts,.steps,figure.shot,.sr-list,.dgx,.abd')) { if (!(n.tagName === 'FIGCAPTION' && n.classList.contains('shot-h'))) return; } add(n, 'Texto', nearestTitle(n, L), null, 0); });
      $$('figure.shot', L.el).forEach(function (f) { var cap = PPI.text(f.querySelector('.shot-h > span:nth-child(2)') || ''); add(f, 'Print', cap, cap + ' print imagem', 1); });
    });
    (PPI_DATA.glossary || []).forEach(function (g) { out.push({ kind: 'Glossário', title: g.term, text: g.term + ' ' + g.forms.join(' ') + ' ' + g.def, snippet: g.def, path: 'Glossário', gloss: g.id, w: 1 }); });
    S.extra.forEach(function (fn) { try { fn(out); } catch (e) { /* ignore */ } });
    out.forEach(function (u) { u.n = PPI.norm(u.text); u.nt = PPI.norm(u.title); });
    return out;
  }

  function score(u, toks, q) {
    var s = u.w, i, t;
    for (i = 0; i < toks.length; i++) {
      t = toks[i]; if (u.n.indexOf(t) < 0) return 0;
      s += 1; if (u.nt.indexOf(t) > -1) s += 3;
      var re = new RegExp('(^|[^a-z0-9])' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z0-9]|$)'); if (re.test(u.n)) s += 2;
    }
    if (u.nt === q) s += 10; else if (u.nt.indexOf(q) === 0) s += 4;
    if (u.kind === 'Lição') s += 2;
    return s;
  }

  function run(q) {
    var nq = PPI.norm(q).trim();
    if (nq.length < 2) { results = []; render(null); return; }
    var toks = nq.split(/\s+/).filter(Boolean), res = [];
    units.forEach(function (u) { if (kind !== 'all' && u.kind !== kind) return; var sc = score(u, toks, nq); if (sc) res.push({ u: u, s: sc }); });
    res.sort(function (a, b) { return b.s - a.s; });
    results = res; render(toks);
  }

  function snippet(text, toks) {
    var n = PPI.norm(text), pos = -1, i;
    for (i = 0; i < toks.length; i++) { var p = n.indexOf(toks[i]); if (p > -1 && (pos < 0 || p < pos)) pos = p; }
    if (pos < 0) pos = 0;
    var a = Math.max(0, pos - 50), b = Math.min(text.length, pos + 130);
    return (a > 0 ? '… ' : '') + text.slice(a, b) + (b < text.length ? ' …' : '');
  }

  function render(toks) {
    listEl.innerHTML = ''; selIdx = -1; input.removeAttribute('aria-activedescendant');
    if (toks === null) {
      countEl.textContent = '';
      var st = el('div', { class: 'state' });
      st.innerHTML = '<b>Busque em todo o manual</b><span>Digite pelo menos 2 letras. Exemplos:</span>';
      var chips = el('div', { class: 'chips', style: 'justify-content:center' });
      ['K16', 'D32', 'AZ', '#REF!', 'Rateio', 'Verificação', 'Projetado', 'Laboratório'].forEach(function (c) { chips.appendChild(el('button', { type: 'button', class: 'chip', text: c, on: { click: function () { input.value = c; input.focus(); run(c); } } })); });
      st.appendChild(chips); listEl.appendChild(st); return;
    }
    if (!results.length) {
      countEl.textContent = 'Nenhum resultado';
      listEl.appendChild(el('div', { class: 'state', html: '<b>Nada encontrado para “' + PPI.esc(input.value.trim()) + '”</b><span>Confira a grafia ou use menos palavras. A busca ignora acentos e maiúsculas. Você também pode procurar por células (K16), abas (RHD) ou mensagens de erro (#REF!).</span>' }));
      return;
    }
    var shown = results.slice(0, 60);
    countEl.textContent = results.length + (results.length === 1 ? ' resultado' : ' resultados') + (results.length > shown.length ? ' (mostrando os 60 melhores)' : '');
    PPI.announce(countEl.textContent);
    var ul = el('ul', { class: 'sr-list', role: 'listbox', id: 'sr-list', 'aria-label': 'Resultados da busca' });
    shown.forEach(function (r, i) {
      var u = r.u;
      var li = el('li', { class: 'sr-item', role: 'option', id: 'sr-' + i, 'aria-selected': 'false', 'data-i': i });
      var a = el('a', { href: '#', tabindex: '-1' });
      a.innerHTML = '<span class="sr-top"><span class="sr-kind">' + PPI.esc(u.kind) + '</span><span class="sr-title">' + PPI.highlight(u.title, toks) + '</span></span><span class="sr-snip">' + PPI.highlight(snippet(u.snippet, toks), toks) + '</span><span class="sr-path">' + PPI.esc(u.path) + '</span>';
      a.addEventListener('click', function (e) { e.preventDefault(); choose(i); });
      li.appendChild(a); ul.appendChild(li);
    });
    listEl.appendChild(ul); select(0);
  }
  function select(i) {
    var items = $$('.sr-item', listEl); if (!items.length) return;
    i = (i + items.length) % items.length; selIdx = i;
    items.forEach(function (li, j) { li.setAttribute('aria-selected', j === i ? 'true' : 'false'); li.firstChild.classList.toggle('sel', j === i); });
    input.setAttribute('aria-activedescendant', items[i].id);
    items[i].scrollIntoView({ block: 'nearest' });
  }
  function choose(i) {
    var r = results[i]; if (!r) return; var u = r.u;
    dlg.close();
    if (u.gloss) { setTimeout(function () { PPI.glossary.open(u.gloss); }, 60); return; }
    if (u.action) { setTimeout(u.action, 60); return; }
    setTimeout(function () { PPI.nav.go(u.node, { flash: true }); }, 60);
  }

  function ensure() {
    if (dlg) return;
    input = el('input', { type: 'search', id: 'sr-input', role: 'combobox', 'aria-expanded': 'true', 'aria-controls': 'sr-list', 'aria-autocomplete': 'list', placeholder: 'Buscar termos, rubricas, células, fórmulas, abas e erros', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Buscar no manual' });
    var inWrap = el('div', { class: 'sr-in' }, [PPI.icon('search'), input]);
    inWrap.firstChild.setAttribute('width', 20); inWrap.firstChild.setAttribute('height', 20);
    filterEl = el('div', { class: 'chips sr-filters', role: 'group', 'aria-label': 'Filtrar por tipo de resultado' });
    Object.keys(KINDS).forEach(function (k) {
      filterEl.appendChild(el('button', { type: 'button', class: 'chip', 'aria-pressed': k === 'all' ? 'true' : 'false', 'data-k': k, text: KINDS[k], on: { click: function (e) { kind = k; $$('.chip', filterEl).forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.k === k ? 'true' : 'false'); }); if (units) run(input.value); } } }));
    });
    countEl = el('div', { class: 'sr-count', 'aria-hidden': 'true' });
    listEl = el('div', { class: 'sr-body' });
    var body = el('div', { style: 'display:flex;flex-direction:column;min-height:0' }, [inWrap, filterEl, countEl, listEl]);
    dlg = PPI.dialog({ title: 'Buscar no manual', cls: 'search', body: body, noBackdropClose: false });
    dlg.head.className = 'sr-hidden-head sr-only'; dlg.body.style.padding = '0';
    input.addEventListener('input', PPI.debounce(function () { if (units) run(input.value); }, 120));
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); select(selIdx + 1); } else if (e.key === 'ArrowUp') { e.preventDefault(); select(selIdx - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); if (selIdx > -1) choose(selIdx); } else if (e.key === 'Home' && e.ctrlKey) select(0);
    });
  }
  S.open = function (q) {
    ensure(); dlg.open(); input.focus(); input.select();
    if (!units) {
      if (!building) {
        building = true; listEl.innerHTML = '<div class="state" role="status"><span class="spinner" aria-hidden="true"></span><span>Preparando o índice de busca…</span></div>';
        setTimeout(function () { units = build(); building = false; if (q) input.value = q; run(input.value); }, 30);
      }
    } else { if (q != null) input.value = q; run(input.value); }
  };
  S.init = function () {
    $('#open-search').addEventListener('click', function () { S.open(); });
    document.addEventListener('keydown', function (e) {
      var t = e.target, typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); S.open(); }
      else if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey && !document.querySelector('dialog[open]')) { e.preventDefault(); S.open(); }
    });
    if ('requestIdleCallback' in window) requestIdleCallback(function () { if (!units && !building) units = build(); }, { timeout: 4000 });
  };
  S.rebuild = function () { units = null; };
})();
