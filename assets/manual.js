/* Portal PPI 4.0 · camada sobre os manuais
   Localização na página, progresso do sumário, "continuar de onde parei", destaque dos termos da busca. */
(function () {
  'use strict';
  if (!window.PPI) return;
  var PPI = window.PPI, body = document.body, M = body.getAttribute('data-manual');
  var secs = [].slice.call(document.querySelectorAll('main section.sec[id]'));
  if (!secs.length) return;
  var tocLinks = [].slice.call(document.querySelectorAll('nav.toc li a'));
  var title = function (s) {
    var n = s.querySelector('.eyebrow b'), h = s.querySelector('h2');
    return (n ? n.textContent.trim() + ' · ' : '') + (h ? h.textContent.trim() : s.id);
  };
  var fileUrl = location.pathname.split('/').pop() || '';
  var crumb = document.getElementById('crumb-sec');
  var saved = PPI.state.l;   // posição guardada antes desta visita
  var moved = false, active = secs[0], t;

  /* regiões com rolagem horizontal ficam alcançáveis pelo teclado */
  [].forEach.call(document.querySelectorAll('.tbl-wrap, .plate'), function (el) {
    if (el.scrollWidth > el.clientWidth + 2 && !el.hasAttribute('tabindex')) { el.setAttribute('tabindex', '0'); el.setAttribute('role', 'region'); if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', 'Conteúdo com rolagem horizontal'); }
  });

  /* progresso no sumário lateral */
  var toc = document.querySelector('nav.toc');
  if (toc) {
    var keys = secs.map(function (s) { return 'sec:' + M + '#' + s.id; });
    var box = document.createElement('div'); box.className = 'toc-prog prog'; box.setAttribute('data-keys', keys.join(',')); box.setAttribute('data-unit', 'seções');
    box.innerHTML = '<div class="plabel"><span>Seções estudadas</span><b data-prog-text></b></div><div class="pbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Seções estudadas neste manual"><i></i></div>';
    var ol = toc.querySelector('ol'); if (ol) toc.insertBefore(box, ol);
  }
  function paintToc() {
    tocLinks.forEach(function (a) {
      var id = (a.getAttribute('href') || '').replace('#', '');
      a.classList.toggle('done', !!PPI.state.s['sec:' + M + '#' + id]);
      a.classList.toggle('on', id === active.id);
      if (id === active.id) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('ppi:change', paintToc);

  /* localização */
  function setActive(s) {
    active = s;
    if (crumb) crumb.textContent = title(s);
    paintToc();
    if (moved) {
      clearTimeout(t);
      t = setTimeout(function () { PPI.setLast({ m: M, sid: s.id, t: title(s), u: 'guias/' + fileUrl + '#' + s.id, ts: Date.now() }); }, 700);
    }
  }
  if ('IntersectionObserver' in window) {
    var hdr = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hdr-h'), 10) || 62;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setActive(e.target); });
    }, { rootMargin: '-' + (hdr + 24) + 'px 0px -65% 0px' });
    secs.forEach(function (s) { io.observe(s); });
  }
  setActive(secs[0]);
  ['scroll', 'keydown', 'pointerdown', 'hashchange'].forEach(function (ev) {
    window.addEventListener(ev, function () { moved = true; }, { once: true, passive: true });
  });

  /* continuar de onde parei */
  var banner = document.getElementById('resume-banner');
  if (banner && !location.hash && saved && saved.m === M && saved.sid && saved.sid !== secs[0].id && document.getElementById(saved.sid)) {
    banner.innerHTML = '<p><strong>Continuar de onde parei:</strong> ' + PPI.esc(saved.t) + '</p>' +
      '<a class="btn primary sm" href="#' + PPI.esc(saved.sid) + '">Continuar</a><button type="button" class="btn ghost sm" id="resume-x">Dispensar</button>';
    banner.classList.add('show');
    banner.querySelector('#resume-x').addEventListener('click', function () { banner.classList.remove('show'); });
    banner.querySelector('a').addEventListener('click', function () { banner.classList.remove('show'); });
  }

  /* destaque dos termos vindos da busca (?q=) */
  var q = new URLSearchParams(location.search).get('q');
  if (q) {
    var T = PPI.terms(q).filter(function (x) { return x.length > 1; });
    var scope = (location.hash && document.getElementById(location.hash.slice(1))) || document.querySelector('main');
    var sec = scope.closest ? (scope.closest('section.sec') || scope) : scope;
    var n = 0, marks = [];
    var walker = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT, {
      acceptNode: function (nd) {
        var p = nd.parentNode; if (!p || /^(SCRIPT|STYLE|MARK|TEXTAREA)$/.test(p.nodeName) || !nd.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (nd) {
      if (n >= 60) return;
      var orig = nd.nodeValue, nn = PPI.norm(orig); if (nn.length !== orig.length) return;
      var r = [];
      T.forEach(function (t) { var i = nn.indexOf(t); while (i >= 0 && r.length < 12) { r.push([i, i + t.length]); i = nn.indexOf(t, i + t.length); } });
      if (!r.length) return;
      r.sort(function (a, b) { return a[0] - b[0]; });
      var frag = document.createDocumentFragment(), pos = 0;
      r.forEach(function (x) {
        if (x[0] < pos) return;
        frag.appendChild(document.createTextNode(orig.slice(pos, x[0])));
        var m = document.createElement('mark'); m.setAttribute('data-hl', '1'); m.textContent = orig.slice(x[0], x[1]); frag.appendChild(m); marks.push(m); pos = x[1]; n++;
      });
      frag.appendChild(document.createTextNode(orig.slice(pos)));
      nd.parentNode.replaceChild(frag, nd);
    });
    if (marks.length && banner) {
      banner.innerHTML = '<p>Termos da busca destacados: <strong>' + PPI.esc(q) + '</strong></p><button type="button" class="btn ghost sm" id="hl-x">Remover destaques</button>';
      banner.classList.add('show');
      banner.querySelector('#hl-x').addEventListener('click', function () {
        marks.forEach(function (m) { var p = m.parentNode; if (p) { p.replaceChild(document.createTextNode(m.textContent), m); p.normalize(); } });
        banner.classList.remove('show');
      });
    }
  }
})();
