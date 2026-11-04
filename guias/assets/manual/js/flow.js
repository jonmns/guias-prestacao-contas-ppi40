/* Mapa de integracao interativo. Preserva o desenho original (SVG inline) e acrescenta selecao, destaque das ligacoes,
   filtro por ferramenta, painel de detalhes e uma lista em texto equivalente ao desenho. */
(function () {
  'use strict';
  var PPI = window.PPI, $ = PPI.$, $$ = PPI.$$, el = PPI.el;
  var F = PPI.flow = {};
  var svg, panel, nodes = {}, edges = [], sel = null, tableRows = {};
  var GROUP = { src: ['Fonte externa', 'src'], pf: ['Planilha Financeira (PF)', 'pf'], pfk: ['Planilha Financeira (PF)', 'pf'], dec: ['Ponto de conferência', 'dec'], ig: ['Indicadores Gerenciais (IG)', 'ig'], rd: ['Relatório Técnico (RD)', 'rd'], rdk: ['Relatório Técnico (RD)', 'rd'], out: ['Destino', 'out'] };
  /* Onde ler mais sobre cada caixa. Ids que nao existirem na pagina sao ignorados. */
  var LINKS = {
    AB: [['pf--abas-de-lancamento', 'Abas de lançamento']],
    RHA: [['pf--folha-de-pagamento-como-a-abertura-chega', 'Folha de pagamento e Abertura']],
    VPI: [['pf--composicao-do-valor-do-projeto-embutida', 'Valores previstos']],
    CB: [['pf--consolidado-e-conciliacao-as-duas-contas', 'Consolidado e Conciliação']],
    CON: [['pf--consolidado-e-conciliacao-as-duas-contas', 'Consolidado e Conciliação']],
    POS: [['pf--posicao-financeira-tres-linhas-por-rubri', 'Posição Financeira']],
    IGR: [['ig--anatomia-de-um-quadro-aba-rhd', 'Anatomia de um quadro do IG']],
    RDT: [['rd--xii-anatomia-do-quadro-de-cada-atividade', 'Quadro do tópico XII']],
    RDQ: [['rastreio', 'Matriz de rastreabilidade']],
    PC: [['ordem', 'Ordem de preenchimento'], ['checklist', 'Checklist mensal']]
  };
  /* Edge -> linha da tabela "Ligacao" do proprio manual (fonte unica do tipo e da explicacao). */
  var ROW = {
    AB_POS: 'Abas de rubrica → Posição Financeira', RHA_POS: 'Abertura de Pagamentos → Posição Financeira',
    VPI_POS: 'Valores previstos Iniciais → Posição Financeira', POS_CON: 'Posição + Conc. Bancária → Consolidado',
    CB_CON: 'Posição + Conc. Bancária → Consolidado', POS_IGR: 'PF → Indicadores', POS_RDQ: 'PF e IG → RD', IGR_RDQ: 'PF e IG → RD'
  };

  function label(g) { return PPI.text(g).replace(/\s+/g, ' '); }
  function nodeKey(g) { var m = (g.id || '').match(/flowchart-([A-Z]+)-\d+$/); return m ? m[1] : null; }
  function exists(id) { return !!document.getElementById(id) || !!(PPI.nav && PPI.nav.lesById && PPI.nav.lesById[id]); }

  function readTable() {
    var sec = $('#integracao'); if (!sec) return;
    $$('table tbody tr', sec).forEach(function (tr) {
      var c = $$('td', tr); if (c.length < 3) return;
      tableRows[PPI.text(c[0])] = { how: PPI.text(c[1]), type: PPI.text(c[2]) };
    });
  }

  function collect() {
    $$('g.node', svg).forEach(function (g) {
      var k = nodeKey(g); if (!k) return;
      var cls = ['src', 'pf', 'pfk', 'dec', 'ig', 'rd', 'rdk', 'out'].filter(function (c) { return g.classList.contains(c); })[0] || 'src';
      nodes[k] = { key: k, g: g, name: label(g), grp: GROUP[cls], cls: cls, ins: [], outs: [] };
    });
    $$('.edgePaths path[data-id]', svg).forEach(function (p) {
      var m = p.getAttribute('data-id').match(/^L_([A-Z]+)_([A-Z]+)_\d+$/); if (!m || !nodes[m[1]] || !nodes[m[2]]) return;
      var lab = $$('.edgeLabels .label', svg).filter(function (l) { return l.getAttribute('data-id') === p.getAttribute('data-id'); })[0];
      var e = { from: m[1], to: m[2], path: p, text: lab ? label(lab).replace(/([a-zà-ú])([A-ZÀ-Ú])/g, '$1 $2') : '', lab: lab ? lab.closest('.edgeLabel') : null, key: m[1] + '_' + m[2] };
      /* rotulos do desenho vem sem espacos entre linhas: restaura "profissionais e horas PUR" etc. */
      if (lab) { var tsp = $$('tspan', lab).map(function (t) { return t.textContent.trim(); }).filter(Boolean); if (tsp.length) e.text = tsp.join(' '); }
      edges.push(e); nodes[m[1]].outs.push(e); nodes[m[2]].ins.push(e);
    });
  }

  function typeOf(e) {
    var r = tableRows[ROW[e.key]]; return r ? r : null;
  }

  function relOf(k) {
    var rel = { nodes: {}, edges: [] };
    rel.nodes[k] = 1;
    edges.forEach(function (e) { if (e.from === k || e.to === k) { rel.edges.push(e); rel.nodes[e.from] = 1; rel.nodes[e.to] = 1; } });
    return rel;
  }

  function clear(silent) {
    sel = null; svg.classList.remove('has-sel');
    Object.keys(nodes).forEach(function (k) { var g = nodes[k].g; g.classList.remove('sel', 'rel'); g.setAttribute('aria-pressed', 'false'); });
    edges.forEach(function (e) { e.path.classList.remove('rel'); if (e.lab) e.lab.classList.remove('rel'); });
    renderPanel(null);
    if (!silent) PPI.announce('Seleção removida.');
  }

  function select(k, focusPanel) {
    if (sel === k) { clear(); return; }
    clear(true); sel = k;
    var rel = relOf(k);
    svg.classList.add('has-sel');
    Object.keys(nodes).forEach(function (n) { var g = nodes[n].g; if (n === k) { g.classList.add('sel'); g.setAttribute('aria-pressed', 'true'); } else if (rel.nodes[n]) g.classList.add('rel'); });
    rel.edges.forEach(function (e) { e.path.classList.add('rel'); if (e.lab) e.lab.classList.add('rel'); });
    renderPanel(nodes[k]);
    PPI.announce(nodes[k].name + ' selecionado. ' + rel.edges.length + ' ligações.');
    if (focusPanel) panel.focus();
  }

  function edgeItem(e, other, dir) {
    var li = el('li');
    var b = el('button', { type: 'button', class: 'lnk', text: nodes[other].name, on: { click: function () { select(other, false); nodes[other].g.focus(); } } });
    li.appendChild(b);
    var t = typeOf(e);
    var bits = [];
    if (e.text) bits.push('“' + e.text + '”');
    li.appendChild(document.createTextNode(bits.length ? ' ' + bits.join(' ') : ''));
    if (t) {
      var tag = el('span', { class: 'tag ' + (/manual/i.test(t.type) ? 'pre' : 'doc'), text: t.type });
      li.appendChild(document.createTextNode(' ')); li.appendChild(tag);
      li.appendChild(el('div', { class: 'muted', style: 'font-size:.82rem', text: t.how }));
      if (e.key === 'POS_IGR') {
        li.appendChild(el('div', { class: 'dgx-fine', text: 'Observação deste manual: o desenho original traz esta ligação em linha cheia, mas o texto do manual informa que não há vínculo e que os valores são digitados. Siga o texto.' }));
      }
    }
    return li;
  }

  function renderPanel(n) {
    panel.innerHTML = '';
    if (!n) {
      panel.appendChild(el('p', { class: 'empty', text: 'Selecione uma caixa do mapa para ver de onde vêm os dados dela, para onde vão e onde ler mais no manual. Use Tab para percorrer as caixas e Enter para selecionar.' }));
      return;
    }
    panel.appendChild(el('h4', { text: n.name }));
    panel.appendChild(el('div', {}, [el('span', { class: 'tool ' + (n.grp[1] === 'out' || n.grp[1] === 'dec' || n.grp[1] === 'src' ? 'ct' : n.grp[1]), text: n.grp[0] })]));
    function block(title, list, other, dir) {
      panel.appendChild(el('h5', { text: title }));
      if (!list.length) { panel.appendChild(el('p', { class: 'muted', text: 'Nenhuma ligação no desenho.' })); return; }
      var ul = el('ul'); list.forEach(function (e) { ul.appendChild(edgeItem(e, e[other], dir)); }); panel.appendChild(ul);
    }
    block('Recebe de', n.ins, 'from', 'in');
    block('Envia para', n.outs, 'to', 'out');
    var ls = (LINKS[n.key] || []).filter(function (l) { return exists(l[0]); });
    if (ls.length) {
      panel.appendChild(el('h5', { text: 'Onde ler no manual' }));
      var ul = el('ul'); ls.forEach(function (l) { ul.appendChild(el('li', {}, [el('button', { type: 'button', class: 'lnk', text: l[1], on: { click: function () { PPI.nav.go(l[0]); } } })])); }); panel.appendChild(ul);
    }
  }

  function buildList(host) {
    var d = el('details', { class: 'flow-list' });
    d.appendChild(el('summary', { text: 'Ver o mapa como lista de ligações' }));
    var ul = el('ul');
    edges.forEach(function (e) {
      var t = typeOf(e);
      ul.appendChild(el('li', { text: nodes[e.from].name + ' → ' + nodes[e.to].name + (e.text ? ' (' + e.text + ')' : '') + (t ? ' · ' + t.type : '') }));
    });
    d.appendChild(ul); host.appendChild(d);
  }

  function setFilter(f, btns) {
    ['pf', 'ig', 'rd'].forEach(function (x) { svg.classList.remove('dim-' + x); });
    if (f !== 'all') svg.classList.add('dim-' + f);
    btns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.f === f ? 'true' : 'false'); });
    PPI.announce(f === 'all' ? 'Mostrando todas as caixas.' : 'Destacando as caixas de ' + f.toUpperCase() + '.');
  }

  F.init = function () {
    svg = $('#my-svg'); if (!svg) return;
    var scroll = svg.closest('[data-flow]'), fig = svg.closest('figure'); if (!scroll || !fig) return;
    readTable(); collect();
    if (!Object.keys(nodes).length) return;

    var wrap = el('div', { class: 'flow-wrap' });
    scroll.parentNode.insertBefore(wrap, scroll); wrap.appendChild(scroll);
    panel = el('aside', { class: 'flow-panel', tabindex: '-1', 'aria-label': 'Detalhes da caixa selecionada', 'aria-live': 'polite' });
    wrap.appendChild(panel);

    var tools = el('div', { class: 'flow-tools' });
    var chips = el('div', { class: 'chips', role: 'group', 'aria-label': 'Destacar por ferramenta' });
    var btns = [['all', 'Todas'], ['pf', 'PF'], ['ig', 'IG'], ['rd', 'RD']].map(function (x) {
      var b = el('button', { type: 'button', class: 'chip', text: x[1], 'aria-pressed': x[0] === 'all' ? 'true' : 'false', data: { f: x[0] } });
      b.addEventListener('click', function () { setFilter(x[0], btns); });
      chips.appendChild(b); return b;
    });
    tools.appendChild(chips);
    tools.appendChild(el('button', { type: 'button', class: 'btn sm', text: 'Limpar seleção', on: { click: function () { clear(); } } }));
    tools.appendChild(el('span', { class: 'muted', style: 'font-size:.8rem', text: 'Role o desenho na horizontal em telas estreitas.' }));
    fig.insertBefore(tools, wrap);

    Object.keys(nodes).forEach(function (k) {
      var g = nodes[k].g;
      g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-pressed', 'false');
      g.setAttribute('aria-label', nodes[k].name + '. ' + nodes[k].grp[0] + '. Recebe de ' + nodes[k].ins.length + ' e envia para ' + nodes[k].outs.length + '. Enter para ver os detalhes.');
      g.addEventListener('click', function (ev) { ev.stopPropagation(); select(k, false); });
      g.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(k, false); }
        else if (ev.key === 'Escape') { clear(); }
      });
    });
    svg.addEventListener('click', function () { if (sel) clear(); });
    /* rotulos soltos no desenho nao devem ser lidos como texto solto duplicado */
    renderPanel(null);
    buildList(fig);

    if (PPI.search) PPI.search.extra.push(function (out) {
      var sec = $('#integracao'); if (!sec) return;
      Object.keys(nodes).forEach(function (k) {
        var n = nodes[k];
        out.push({ kind: 'Mapa', title: n.name, text: 'mapa de integração fluxo caixa ' + n.name + ' ' + n.ins.map(function (e) { return nodes[e.from].name; }).join(' ') + ' ' + n.outs.map(function (e) { return nodes[e.to].name; }).join(' '),
          snippet: 'Recebe de ' + (n.ins.map(function (e) { return nodes[e.from].name; }).join('; ') || '—') + ' · envia para ' + (n.outs.map(function (e) { return nodes[e.to].name; }).join('; ') || '—'),
          path: 'Mapa de integração', node: n.g, w: 1, action: function () { PPI.nav.go('integracao'); setTimeout(function () { F.select(k); nodes[k].g.focus({ preventScroll: true }); }, 350); } });
      });
    });
  };
  F.select = function (k) { if (nodes[k] && sel !== k) select(k, false); };
})();
