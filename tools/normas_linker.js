/* Portal PPI 4.0 · transforma menções a normas em links para o texto oficial.
   Os dados (window.PPI_NORMAS) são gerados por tools/build.py a partir de tools/rh_normas.py. */
(function () {
  'use strict';
  if (window.__ppiNormas) return; window.__ppiNormas = true;
  var N = window.PPI_NORMAS || {};
  var NUM = '(\\d{1,3}(?:\\.\\d{3})*|\\d+)';
  var YEAR = '(?:\\s*\\/\\s*(\\d{4}))?';
  var RE = new RegExp(
    '\\b(Lei Complementar|Decreto-Lei|Decreto|Lei|Medida Provisória|Resolução CAPDA|Res\\. CAPDA|Instrução Normativa RFB|IN RFB|Portaria (?:MTP|MTE))' +
    '(?:\\s+n[º°o.]{1,2})?\\s*' + NUM + YEAR + '|\\b(NR-\\d{2})\\b|\\b(CLT|LGPD)\\b', 'g');
  var PREFIX = { 'Lei': 'L', 'Lei Complementar': 'LC', 'Decreto': 'D', 'Decreto-Lei': 'DL', 'Resolução CAPDA': 'CAPDA', 'Res. CAPDA': 'CAPDA',
    'Instrução Normativa RFB': 'IN', 'IN RFB': 'IN', 'Portaria MTP': 'P', 'Portaria MTE': 'P', 'Medida Provisória': 'MP' };
  var SKIP = { A: 1, SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, SELECT: 1, OPTION: 1, BUTTON: 1, CODE: 1, PRE: 1, SVG: 1, TITLE: 1, LABEL: 1, SUMMARY: 1 };

  function find(m) {
    if (m[4]) return N.NR ? { k: 'NR', e: N.NR } : null;
    if (m[5]) { var k5 = m[5] === 'CLT' ? 'DL5452' : 'L13709'; return N[k5] ? { k: k5, e: N[k5] } : null; }
    var k = PREFIX[m[1]] + m[2].replace(/\./g, ''), e = N[k];
    if (!e) return null;
    if (m[3] && e.y && String(e.y) !== m[3]) return null;   // mesmo número, ano diferente: não é a mesma norma
    return { k: k, e: e };
  }
  function linkText(node) {
    var t = node.nodeValue; RE.lastIndex = 0;
    if (!RE.test(t)) return; RE.lastIndex = 0;
    var frag = document.createDocumentFragment(), pos = 0, m, any = false;
    while ((m = RE.exec(t))) {
      var hit = find(m); if (!hit) continue;
      any = true;
      frag.appendChild(document.createTextNode(t.slice(pos, m.index)));
      var a = document.createElement('a');
      a.href = hit.e.u; a.target = '_blank'; a.rel = 'noopener'; a.className = 'ppi-norma';
      a.title = (hit.e.n || m[0]) + (hit.e.r ? ' — ' + hit.e.r : '') + ' (texto oficial, abre em nova aba)';
      a.textContent = m[0];
      frag.appendChild(a); pos = m.index + m[0].length;
      // Enumerações do mesmo tipo: "Res. CAPDA 2/2020, 30/2022 e 9/2019".
      if (m[1]) {
        var LIST = /^(\s*(?:,|e)\s*)(\d{1,3}(?:\.\d{3})*|\d+)\s*\/\s*(\d{4})/, rest;
        while ((rest = LIST.exec(t.slice(pos)))) {
          var h2 = find([null, m[1], rest[2], rest[3]]); if (!h2) break;
          frag.appendChild(document.createTextNode(rest[1]));
          var a2 = a.cloneNode(false); a2.href = h2.e.u; a2.title = (h2.e.n || '') + (h2.e.r ? ' — ' + h2.e.r : '') + ' (texto oficial, abre em nova aba)';
          a2.textContent = rest[0].slice(rest[1].length); frag.appendChild(a2);
          pos += rest[0].length;
        }
        RE.lastIndex = pos;
      }
    }
    if (!any) return;
    frag.appendChild(document.createTextNode(t.slice(pos)));
    node.parentNode.replaceChild(frag, node);
  }
  function scan(rootEl) {
    if (!rootEl || rootEl.nodeType !== 1 || SKIP[rootEl.nodeName.toUpperCase()] || rootEl.closest('a,header.ph,.ppi-portal-nav,[contenteditable],[data-no-normas]')) return;
    var w = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || n.nodeValue.length < 3) return NodeFilter.FILTER_REJECT;
        for (var p = n.parentNode; p && p !== rootEl.parentNode; p = p.parentNode) {
          if (p.nodeType === 1 && (SKIP[p.nodeName.toUpperCase()] || p.hasAttribute('data-no-normas'))) return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var list = [], n; while ((n = w.nextNode())) list.push(n);
    list.forEach(linkText);
  }
  var pending = [], timer = 0;
  function queue(el) { pending.push(el); if (!timer) timer = setTimeout(flush, 60); }
  function flush() { timer = 0; var l = pending; pending = []; obs.disconnect(); l.forEach(function (el) { if (el.isConnected) scan(el); }); watch(); }
  var obs = new MutationObserver(function (ms) {
    ms.forEach(function (m) { m.addedNodes.forEach(function (x) { if (x.nodeType === 1) queue(x); else if (x.nodeType === 3 && x.parentNode) queue(x.parentNode); }); });
  });
  var target = document.querySelector('main') || document.body;
  function watch() { obs.observe(target, { childList: true, subtree: true }); }
  function start() { scan(target); watch(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.PPI_linkNormas = scan;
})();
