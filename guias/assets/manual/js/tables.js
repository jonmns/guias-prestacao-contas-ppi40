/* Tabelas: busca e filtros, cabecalho fixo em tabelas longas, selecao de linha com teclado, adaptacao para telefone
   (cada linha vira um cartao) e cartao de correspondencias para rubricas e matriz de rastreabilidade.
   O conteudo das celulas nunca e alterado: so se acrescentam atributos, controles e cartoes ao redor. */
(function () {
  'use strict';
  var PPI = window.PPI, $ = PPI.$, $$ = PPI.$$, el = PPI.el;
  var T = PPI.tables = { list: [] };
  var phone = window.matchMedia ? window.matchMedia('(max-width:760px)') : { matches: false };
  var SKIP_TOOLS = ['alertas', 'erros'];
  var REF_RE = /\b[A-Z]{1,2}[0-9]{1,3}\b/g;

  function secOf(w) { var s = w.closest('section.sec'); return s ? s.id : ''; }
  function heads(table) { return $$('thead th', table).map(PPI.text); }
  function titleOf(w) { var s = w.closest('section.sec'), h = s && s.querySelector('h2'); return (h ? PPI.text(h) : 'Tabela'); }

  function visibleRows(t) { return t.rows.filter(function (r) { return !r.hidden; }); }

  function setRoving(t) {
    var vis = visibleRows(t); t.rows.forEach(function (r) { r.tabIndex = -1; });
    var cur = (t.sel && !t.sel.hidden) ? t.sel : vis[0];
    if (cur) cur.tabIndex = 0;
  }

  function cardFor(t, tr) {
    if (!t.card) return;
    var c = t.card; c.innerHTML = '';
    if (!tr) {
      c.appendChild(el('p', { class: 'muted', text: t.kind === 'rubricas' ? 'Selecione uma rubrica na tabela (clique ou Enter) para ver, lado a lado, como ela aparece em cada ferramenta.' : 'Selecione um campo na tabela (clique ou Enter) para ver origem, célula e conferência. As células citadas podem ser buscadas no manual.' }));
      return;
    }
    var cells = $$('td', tr);
    var top = el('div', { class: 'rub-top' }, [el('h4', { text: PPI.text(cells[0]), style: 'flex:1;min-width:200px' }),
      el('button', { type: 'button', class: 'btn sm', text: 'Limpar seleção', on: { click: function () { selectRow(t, null); } } })]);
    c.appendChild(top);
    var dl = el('dl');
    t.heads.forEach(function (h, i) { if (i === 0) return; dl.appendChild(el('div', {}, [el('dt', { text: h }), el('dd', { text: PPI.text(cells[i] || '') || '—' })])); });
    c.appendChild(dl);
    if (t.kind === 'rastreio') {
      var refs = {}; (PPI.text(cells[2] || '') + ' ' + PPI.text(cells[3] || '')).replace(REF_RE, function (m) { refs[m] = 1; return m; });
      var keys = Object.keys(refs);
      if (keys.length) {
        var row = el('div', { class: 'chips', role: 'group', 'aria-label': 'Buscar célula no manual' }, [el('span', { class: 'muted', style: 'font-size:.8rem', text: 'Buscar no manual:' })]);
        keys.forEach(function (k) { row.appendChild(el('button', { type: 'button', class: 'chip', text: k, on: { click: function () { PPI.search.open(k); } } })); });
        c.appendChild(row);
      }
    }
    PPI.announce('Linha selecionada: ' + PPI.text(cells[0]));
  }

  function selectRow(t, tr) {
    if (t.sel) { t.sel.classList.remove('is-selected'); t.sel.removeAttribute('aria-current'); }
    t.sel = (tr && tr !== t.sel) ? tr : null;
    if (t.sel) { t.sel.classList.add('is-selected'); t.sel.setAttribute('aria-current', 'true'); }
    setRoving(t); cardFor(t, t.sel);
  }

  function apply(t) {
    var q = PPI.norm(t.q).trim().split(/\s+/).filter(Boolean), n = 0;
    t.rows.forEach(function (tr) {
      var cells = $$('td', tr);
      var txt = PPI.norm(t.col >= 0 ? PPI.text(cells[t.col] || '') : PPI.text(tr));
      var ok = q.every(function (x) { return txt.indexOf(x) > -1; });
      if (ok && t.chip !== 'all') ok = $$('.tool', tr).some(function (s) { return PPI.text(s).toUpperCase() === t.chip; });
      tr.hidden = !ok; if (ok) n++;
    });
    if (t.count) t.count.textContent = n === t.rows.length ? t.rows.length + ' linhas' : n + ' de ' + t.rows.length + ' linhas';
    if (t.empty) t.empty.classList.toggle('show', n === 0);
    t.w.hidden = n === 0 && !!t.empty;
    if (t.tools) PPI.announce(n === 0 ? 'Nenhuma linha encontrada.' : n + ' linhas visíveis.');
    setRoving(t); refreshScroll(t);
  }

  function resetFilters(t) {
    t.q = ''; t.col = -1; t.chip = 'all';
    if (t.input) t.input.value = ''; if (t.colSel) t.colSel.value = '-1';
    if (t.chips) t.chips.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.c === 'all' ? 'true' : 'false'); });
    apply(t);
  }

  function refreshScroll(t) {
    var w = t.w, active = t.mcards && phone.matches;
    var over = !active && (w.scrollWidth > w.clientWidth + 2 || w.scrollHeight > w.clientHeight + 2);
    if (over) { w.tabIndex = 0; w.setAttribute('role', 'region'); w.setAttribute('aria-label', t.label); }
    else { w.removeAttribute('tabindex'); w.removeAttribute('role'); w.removeAttribute('aria-label'); }
    if (t.hint) t.hint.hidden = !(!active && w.scrollWidth > w.clientWidth + 2);
  }

  function build(w, table, idx) {
    var sid = secOf(w), hs = heads(table), rows = $$('tbody tr', table);
    if (!hs.length || !rows.length) return;
    var t = { w: w, table: table, rows: rows, heads: hs, sel: null, q: '', col: -1, chip: 'all', kind: sid === 'rubricas' ? 'rubricas' : sid === 'rastreio' ? 'rastreio' : '', label: titleOf(w) + ': tabela ' + (idx + 1) };
    T.list.push(t);

    if (rows.every(function (r) { return $$('td', r).length === hs.length && !r.querySelector('th'); })) {
      t.mcards = true; w.classList.add('mcards');
      rows.forEach(function (tr) { $$('td', tr).forEach(function (td, i) { td.setAttribute('data-label', hs[i]); }); });
    }
    if (rows.length > 10) w.classList.add('tall');

    /* selecao de linha e navegacao por teclado */
    rows.forEach(function (tr) {
      tr.tabIndex = -1;
      tr.addEventListener('click', function (e) { if (e.target.closest('a,button,input,select,summary')) return; selectRow(t, tr); });
      tr.addEventListener('keydown', function (e) {
        if (e.target !== tr) return;
        var vis = visibleRows(t), i = vis.indexOf(tr), to = null;
        if (e.key === 'ArrowDown') to = vis[Math.min(vis.length - 1, i + 1)];
        else if (e.key === 'ArrowUp') to = vis[Math.max(0, i - 1)];
        else if (e.key === 'Home') to = vis[0];
        else if (e.key === 'End') to = vis[vis.length - 1];
        else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectRow(t, tr); return; }
        else if (e.key === 'Escape' && t.sel) { selectRow(t, null); return; }
        if (to) { e.preventDefault(); rows.forEach(function (r) { r.tabIndex = -1; }); to.tabIndex = 0; to.focus(); }
      });
    });
    setRoving(t);

    /* cartao de correspondencias */
    if (t.kind) {
      t.card = el('div', { class: 'rub-card', role: 'region', 'aria-label': t.kind === 'rubricas' ? 'Correspondência da rubrica selecionada' : 'Origem do campo selecionado', 'aria-live': 'polite' });
      w.parentNode.insertBefore(t.card, w); cardFor(t, null);
    }

    /* ferramentas de busca e filtro */
    if (rows.length >= 6 && SKIP_TOOLS.indexOf(sid) < 0) {
      var iid = PPI.uid('tb');
      var tools = el('div', { class: 'tbl-tools', role: 'search', 'aria-label': 'Filtrar tabela' });
      t.input = el('input', { type: 'search', class: 'field', id: iid, placeholder: 'Digite parte do texto', autocomplete: 'off' });
      t.input.addEventListener('input', PPI.debounce(function () { t.q = t.input.value; apply(t); }, 100));
      tools.appendChild(el('div', { style: 'display:flex;flex-direction:column;gap:3px' }, [el('label', { for: iid, class: 'muted', style: 'font-size:.72rem;font-weight:700', text: 'Buscar nesta tabela' }), t.input]));
      if (hs.length >= 4) {
        var sid2 = PPI.uid('tc');
        t.colSel = el('select', { class: 'field', id: sid2 });
        t.colSel.appendChild(el('option', { value: '-1', text: 'Todas as colunas' }));
        hs.forEach(function (h, i) { t.colSel.appendChild(el('option', { value: String(i), text: h })); });
        t.colSel.addEventListener('change', function () { t.col = parseInt(t.colSel.value, 10); apply(t); });
        tools.appendChild(el('div', { style: 'display:flex;flex-direction:column;gap:3px' }, [el('label', { for: sid2, class: 'muted', style: 'font-size:.72rem;font-weight:700', text: 'Buscar na coluna' }), t.colSel]));
      }
      if (t.kind === 'rastreio') {
        var cw = el('div', { class: 'chips', role: 'group', 'aria-label': 'Filtrar pela origem' });
        t.chips = [['all', 'Todas as origens'], ['PF', 'PF'], ['IG', 'IG'], ['RD', 'RD']].map(function (x) {
          var b = el('button', { type: 'button', class: 'chip', text: x[1], 'aria-pressed': x[0] === 'all' ? 'true' : 'false', data: { c: x[0] } });
          b.addEventListener('click', function () { t.chip = x[0]; t.chips.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); }); apply(t); });
          cw.appendChild(b); return b;
        });
        tools.appendChild(cw);
      }
      t.count = el('span', { class: 'tbl-count', 'aria-hidden': 'true', text: rows.length + ' linhas' });
      tools.appendChild(t.count);
      tools.appendChild(el('button', { type: 'button', class: 'btn sm', text: 'Limpar filtros', on: { click: function () { resetFilters(t); } } }));
      t.tools = tools;
      var anchor = t.card || w;
      anchor.parentNode.insertBefore(tools, anchor);
      t.empty = el('div', { class: 'state tbl-empty', role: 'status' }, [el('b', { text: 'Nenhuma linha corresponde ao filtro' }), el('span', { text: 'Confira a grafia ou limpe os filtros. A busca ignora acentos e maiúsculas.' }),
        el('button', { type: 'button', class: 'btn sm', text: 'Limpar filtros', on: { click: function () { resetFilters(t); } } })]);
      w.parentNode.insertBefore(t.empty, w.nextSibling);
    }

    t.hint = el('p', { class: 'tbl-hint', 'aria-hidden': 'true', text: '↔ Deslize a tabela para ver as demais colunas' });
    w.parentNode.insertBefore(t.hint, w);
    t.hint.hidden = true;
    refreshScroll(t);
  }

  T.init = function () {
    $$('.tbl-wrap').forEach(function (w, i) {
      var table = $('table', w); if (!table || table.classList.contains('sr-only') || w.closest('.anat')) return;
      build(w, table, i);
    });
    var onResize = PPI.debounce(function () { T.list.forEach(refreshScroll); }, 150);
    window.addEventListener('resize', onResize);
    if (phone.addEventListener) phone.addEventListener('change', onResize);
    /* se a navegacao (busca, links) aponta para uma linha escondida por filtro, limpa o filtro */
    PPI.bus.on('reveal', function (node) {
      if (!node || !node.closest) return;
      var tr = node.closest('tr'); if (!tr) return;
      T.list.forEach(function (t) { if (t.rows.indexOf(tr) > -1 && (tr.hidden || t.w.hidden)) resetFilters(t); });
    });
    setTimeout(function () { T.list.forEach(refreshScroll); }, 400);
  };
})();
