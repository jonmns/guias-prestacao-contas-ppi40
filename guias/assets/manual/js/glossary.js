/* Glossario contextual: primeira ocorrencia de cada termo por secao vira um botao com definicao. */
(function () {
  'use strict';
  var PPI = window.PPI, $ = PPI.$, $$ = PPI.$$, el = PPI.el, D = window.PPI_DATA;
  var G = PPI.glossary = {}, pop, openFor = null, dlg;
  var SKIP = 'a,button,h1,h2,h3,h4,h5,h6,th,code,.tool,.tag,.src,.cn,.sev,.chip,.chip-in,.chip-fx,.mono,.eyebrow,.kpi b,.gterm,.who,.lg,svg,summary,label,input,select,textarea,.sr-only,.qz,.practice,.tbl-tools,.beginner,[data-nosearch],.hs-tip,.gl-pop,.pager,.done-btn,.lh,.callout h4,.k';

  function byId(id) { return D.glossary.filter(function (g) { return g.id === id; })[0]; }
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function annotate() {
    var terms = D.glossary.filter(function (g) { return g.ctx !== false && g.forms.length; });
    var forms = [];
    terms.forEach(function (g) { g.forms.forEach(function (f) { forms.push({ f: f, g: g }); }); });
    forms.sort(function (a, b) { return b.f.length - a.f.length; });
    var re = new RegExp('(^|[^\\p{L}\\p{N}_#-])(' + forms.map(function (x) { return escRe(x.f); }).join('|') + ')(?![\\p{L}\\p{N}_-])', 'gu');
    var map = {}; forms.forEach(function (x) { map[x.f] = x.g; });
    PPI.nav.sections.forEach(function (S) {
      var used = {};
      var walker = document.createTreeWalker(S.el, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
        if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentElement; if (!p || p.closest(SKIP)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      } });
      var nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (tn) {
        var text = tn.nodeValue, m, last = 0, frag = null; re.lastIndex = 0;
        while ((m = re.exec(text))) {
          var g = map[m[2]]; if (!g || used[g.id]) continue; used[g.id] = true;
          var start = m.index + m[1].length;
          frag = frag || document.createDocumentFragment();
          frag.appendChild(document.createTextNode(text.slice(last, start)));
          frag.appendChild(el('button', { type: 'button', class: 'gterm', 'data-g': g.id, 'aria-haspopup': 'dialog', 'aria-expanded': 'false', text: m[2] }));
          last = start + m[2].length;
        }
        if (frag) { frag.appendChild(document.createTextNode(text.slice(last))); tn.parentNode.replaceChild(frag, tn); }
      });
    });
  }

  function closePop() { if (pop) { pop.hidden = true; } if (openFor) { openFor.setAttribute('aria-expanded', 'false'); openFor = null; } }
  function showPop(btn) {
    var g = byId(btn.dataset.g); if (!g) return;
    if (!pop) {
      pop = el('div', { class: 'gl-pop', role: 'dialog', 'aria-label': 'Definição', id: 'gl-pop', hidden: true });
      document.body.appendChild(pop);
    }
    if (openFor === btn && !pop.hidden) { closePop(); return; }
    closePop();
    pop.innerHTML = '';
    pop.appendChild(el('b', { text: g.term })); pop.appendChild(el('span', { text: g.def }));
    var more = el('div', { style: 'margin-top:6px;display:flex;gap:12px;flex-wrap:wrap' }, [
      el('a', { href: '#' + g.see, text: 'Ver no manual' }),
      el('a', { href: '#', text: 'Abrir glossário', on: { click: function (e) { e.preventDefault(); closePop(); G.open(g.id); } } })]);
    pop.appendChild(more);
    pop.hidden = false; openFor = btn; btn.setAttribute('aria-expanded', 'true');
    var r = btn.getBoundingClientRect(), pw = pop.offsetWidth, x = r.left + window.pageXOffset, y = r.bottom + window.pageYOffset + 6;
    x = Math.max(8, Math.min(x, window.pageXOffset + document.documentElement.clientWidth - pw - 8));
    pop.style.left = x + 'px'; pop.style.top = y + 'px';
  }

  G.open = function (id) {
    if (!dlg) {
      var list = el('ul', { class: 'gl-list' });
      D.glossary.slice().sort(function (a, b) { return PPI.norm(a.term).localeCompare(PPI.norm(b.term)); }).forEach(function (g) {
        var li = el('li', { id: 'glo-' + g.id }, [el('b', { text: g.term }), el('p', { text: g.def }), el('a', { href: '#' + g.see, text: 'Ver no manual', on: { click: function () { dlg.close(); } } })]);
        list.appendChild(li);
      });
      var filter = el('input', { type: 'search', class: 'field', placeholder: 'Filtrar termos', 'aria-label': 'Filtrar termos do glossário', on: { input: function () { var q = PPI.norm(filter.value); $$('li', list).forEach(function (li) { li.hidden = q && PPI.norm(li.textContent).indexOf(q) < 0; }); empty.hidden = $$('li', list).some(function (li) { return !li.hidden; }); } } });
      var empty = el('div', { class: 'state', hidden: true, text: 'Nenhum termo encontrado.' });
      dlg = PPI.dialog({ title: 'Glossário', body: el('div', { style: 'display:flex;flex-direction:column;gap:10px;min-height:0' }, [el('p', { class: 'nature-note', text: 'Definições baseadas no que o próprio manual afirma. Os termos também aparecem sublinhados ao longo do texto.' }), filter, list, empty]), cls: 'glossary' });
      dlg.el.style.maxWidth = '640px';
    }
    dlg.open();
    if (id) { var li = $('#glo-' + id); if (li) { li.scrollIntoView({ block: 'center' }); li.classList.add('flash'); setTimeout(function () { li.classList.remove('flash'); }, 2000); } }
  };

  G.init = function () {
    annotate();
    $('#open-glossary').addEventListener('click', function () { G.open(); });
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.gterm');
      if (b) { e.preventDefault(); showPop(b); return; }
      if (pop && !pop.hidden && !e.target.closest('.gl-pop')) closePop();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pop && !pop.hidden) { var b = openFor; closePop(); if (b) b.focus(); } });
    var hoverT;
    document.addEventListener('mouseover', function (e) { var b = e.target.closest && e.target.closest('.gterm'); if (b && openFor !== b && window.matchMedia('(hover:hover)').matches) { clearTimeout(hoverT); hoverT = setTimeout(function () { showPop(b); }, 350); } });
    document.addEventListener('mouseout', function (e) { clearTimeout(hoverT); });
    window.addEventListener('scroll', PPI.debounce(function () { /* mantem o popover ancorado */ if (openFor && pop && !pop.hidden) { var r = openFor.getBoundingClientRect(); if (r.bottom < 0 || r.top > window.innerHeight) closePop(); } }, 100), { passive: true });
  };
})();
