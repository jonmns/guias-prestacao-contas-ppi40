/* Prints anotados: pontos numerados clicaveis (explicacao contextual) e visualizador com zoom, pan, ajuste e navegacao. */
(function () {
  'use strict';
  var PPI = window.PPI, $ = PPI.$, $$ = PPI.$$, el = PPI.el, HS = window.PPI_HOTSPOTS || [];
  var V = PPI.viewer = { items: [] };
  var dlg, stage, canvas, img, stateEl, panel, titleEl, countEl, main, idx = 0, zoom = 1, fitMode = true, natW = 1, natH = 1, panelOpen = true, opener = null, ptrs = {}, pinch0 = null;

  /* ---------- pontos nos prints da pagina ---------- */
  function calloutText(li) { var s = li.querySelectorAll(':scope > span')[1]; return PPI.text(s || li); }
  function numOf(li) { return PPI.text(li.querySelector('.cn') || ''); }

  function initFigure(f, i) {
    var data = HS[i], wrap = f.querySelector('.shot-img'), im = wrap && wrap.querySelector('img');
    var item = { fig: f, img: im, title: PPI.text(f.querySelector('.shot-h > span:nth-child(2)') || ''), data: data, list: f.querySelector('.callouts') };
    V.items.push(item);
    var zoomBtn = f.querySelector('.zoom'); if (zoomBtn) { zoomBtn.addEventListener('click', function () { V.open(i, zoomBtn); }); zoomBtn.setAttribute('aria-haspopup', 'dialog'); }
    if (im) im.addEventListener('click', function () { V.open(i, im); });
    if (im) { im.setAttribute('tabindex', '0'); im.setAttribute('role', 'button'); im.setAttribute('aria-label', 'Ampliar: ' + item.title); im.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); V.open(i, im); } }); }
    if (!data || !im) return;
    if (data.cap !== item.title && window.console) console.warn('Pontos do print não conferem com a legenda:', i, data.cap, item.title);
    var hw = el('div', { class: 'hs-wrap' }); im.parentNode.insertBefore(hw, im); hw.appendChild(im);
    var tip = el('div', { class: 'hs-tip', role: 'tooltip', id: 'hst-' + i, hidden: true }); hw.appendChild(tip);
    var lis = f.querySelectorAll('.callouts li'), byN = {}; Array.prototype.forEach.call(lis, function (li) { byN[numOf(li)] = li; });
    var pinned = null, buttons = {};
    function hide() { tip.hidden = true; pinned = null; $$('.hs.on', hw).forEach(function (b) { b.classList.remove('on'); }); Array.prototype.forEach.call(lis, function (l) { l.classList.remove('on'); }); }
    function show(b, n, keep) {
      var li = byN[n]; if (!li) return;
      $$('.hs.on', hw).forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on');
      Array.prototype.forEach.call(lis, function (l) { l.classList.toggle('on', l === li); });
      tip.innerHTML = ''; tip.appendChild(el('b', { text: 'Ponto ' + n + ': ' })); tip.appendChild(document.createTextNode(calloutText(li)));
      tip.hidden = false;
      var px = parseFloat(b.style.left), py = parseFloat(b.style.top);
      tip.style.left = px > 55 ? 'auto' : 'calc(' + px + '% + 22px)'; tip.style.right = px > 55 ? 'calc(' + (100 - px) + '% + 22px)' : 'auto';
      tip.style.top = 'calc(' + py + '% + 6px)';
      b.setAttribute('aria-describedby', tip.id); if (keep) pinned = b;
    }
    Object.keys(data.pts).forEach(function (n) {
      data.pts[n].forEach(function (p, k) {
        var li = byN[n]; if (!li) return;
        var b = el('button', { type: 'button', class: 'hs', 'data-n': n, 'aria-label': 'Ponto ' + n + ': ' + calloutText(li) });
        b.style.left = (p[0] / data.w * 100) + '%'; b.style.top = (p[1] / data.h * 100) + '%';
        b.addEventListener('mouseenter', function () { if (!pinned) show(b, n); });
        b.addEventListener('mouseleave', function () { if (!pinned) hide(); });
        b.addEventListener('focus', function () { if (!pinned) show(b, n); });
        b.addEventListener('blur', function () { if (!pinned) hide(); });
        b.addEventListener('click', function (e) { e.stopPropagation(); if (pinned === b) hide(); else { hide(); show(b, n, true); } });
        hw.appendChild(b); (buttons[n] = buttons[n] || []).push(b);
      });
    });
    Array.prototype.forEach.call(lis, function (li) {
      var n = numOf(li); if (!buttons[n]) return; li.style.cursor = 'pointer'; li.title = 'Mostrar o ponto no print';
      li.addEventListener('click', function () {
        var b = buttons[n][0]; hide(); show(b, n, true);
        var y = b.offsetTop - 60; wrap.scrollTo({ top: Math.max(0, y), behavior: PPI.reducedMotion() ? 'auto' : 'smooth' });
        var r = hw.getBoundingClientRect(); if (r.top < 0 || r.bottom > window.innerHeight) hw.scrollIntoView({ block: 'center', behavior: PPI.reducedMotion() ? 'auto' : 'smooth' });
      });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pinned) hide(); });
    document.addEventListener('click', function (e) { if (pinned && !e.target.closest('.hs-wrap') && !e.target.closest('.callouts')) hide(); });
  }

  /* ---------- visualizador ---------- */
  function build() {
    img = el('img', { alt: '', draggable: 'false' });
    canvas = el('div', { class: 'vw-canvas' }, [img]);
    stateEl = el('div', { class: 'vw-state', role: 'status' });
    stage = el('div', { class: 'vw-stage', tabindex: '0', role: 'region', 'aria-label': 'Imagem ampliada. Use as setas do teclado para movimentar.' }, [canvas, stateEl]);
    panel = el('aside', { class: 'vw-panel', 'aria-label': 'Instruções da imagem' });
    main = el('div', { class: 'vw-main' }, [stage, panel]);
    titleEl = el('div', { class: 'vw-title' });
    countEl = el('span', { class: 'sr-only', 'aria-live': 'polite' });
    function tb(label, icon, fn, extra) { var b = el('button', { type: 'button', class: 'tb-btn', 'aria-label': label, title: label, on: { click: fn } }, [PPI.icon(icon)].concat(extra ? [el('span', { class: 't', text: extra })] : [])); return b; }
    var pBtn = tb('Mostrar ou ocultar instruções', 'panel', function () { panelOpen = !panelOpen; applyPanel(); }, 'Instruções'); pBtn.setAttribute('aria-pressed', 'true'); pBtn.id = 'vw-panel-btn';
    var bar = el('div', { class: 'vw-bar' }, [titleEl,
      tb('Imagem anterior', 'left', function () { V.go(idx - 1); }, 'Anterior'), tb('Próxima imagem', 'right', function () { V.go(idx + 1); }, 'Próxima'),
      tb('Diminuir zoom', 'minus', function () { setZoom(zoom / 1.25); }), el('span', { class: 'vw-zoomv', id: 'vw-zv', 'aria-live': 'off', style: 'min-width:48px;text-align:center;font-weight:700' }),
      tb('Aumentar zoom', 'plus', function () { setZoom(zoom * 1.25); }), tb('Ajustar à tela', 'fit', fit, 'Ajustar'), tb('Tamanho real (100%)', 'check', function () { fitMode = false; setZoom(1); }, '100%'), pBtn,
      tb('Fechar visualizador', 'x', function () { dlg.close(); }, 'Fechar'), countEl]);
    var hint = el('div', { class: 'vw-hint', text: 'Arraste para mover · Ctrl + roda do mouse ou botões para o zoom · PageUp e PageDown trocam de imagem · Esc fecha' });
    dlg = el('dialog', { class: 'viewer', 'aria-label': 'Visualizador de imagem' }, [bar, hint, main]);
    document.body.appendChild(dlg);
    dlg.addEventListener('close', function () { if (opener && document.contains(opener)) opener.focus(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === '+' || e.key === '=') { e.preventDefault(); setZoom(zoom * 1.25); } else if (e.key === '-') { e.preventDefault(); setZoom(zoom / 1.25); }
      else if (e.key === '0') { e.preventDefault(); fit(); } else if (e.key === '1') { e.preventDefault(); fitMode = false; setZoom(1); }
      else if (e.key === 'PageDown') { e.preventDefault(); V.go(idx + 1); } else if (e.key === 'PageUp') { e.preventDefault(); V.go(idx - 1); }
    });
    stage.addEventListener('wheel', function (e) { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY); }, { passive: false });
    stage.addEventListener('dblclick', function (e) { if (e.target.closest('.hs')) return; if (fitMode) { fitMode = false; zoomAt(1 / zoom, e.clientX, e.clientY); } else fit(); });
    /* arrastar para mover e pinca com dois dedos */
    stage.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.hs') || e.button > 0) return;
      ptrs[e.pointerId] = { x: e.clientX, y: e.clientY }; stage.setPointerCapture(e.pointerId); stage.classList.add('drag');
      if (Object.keys(ptrs).length === 2) { var k = Object.keys(ptrs); pinch0 = { d: dist(ptrs[k[0]], ptrs[k[1]]), z: zoom }; }
    });
    stage.addEventListener('pointermove', function (e) {
      var p = ptrs[e.pointerId]; if (!p) return;
      var ks = Object.keys(ptrs);
      if (ks.length === 2 && pinch0) { ptrs[e.pointerId] = { x: e.clientX, y: e.clientY }; var d = dist(ptrs[ks[0]], ptrs[ks[1]]); fitMode = false; var cx = (ptrs[ks[0]].x + ptrs[ks[1]].x) / 2, cy = (ptrs[ks[0]].y + ptrs[ks[1]].y) / 2; zoomAt(pinch0.z * d / pinch0.d / zoom, cx, cy); return; }
      stage.scrollLeft -= e.clientX - p.x; stage.scrollTop -= e.clientY - p.y; ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
    });
    function endp(e) { delete ptrs[e.pointerId]; pinch0 = null; if (!Object.keys(ptrs).length) stage.classList.remove('drag'); }
    stage.addEventListener('pointerup', endp); stage.addEventListener('pointercancel', endp);
    window.addEventListener('resize', PPI.debounce(function () { if (dlg.open && fitMode) fit(); }, 150));
    img.addEventListener('load', function () { natW = img.naturalWidth || natW; natH = img.naturalHeight || natH; stateEl.hidden = true; if (fitMode) fit(); else setZoom(zoom); });
    img.addEventListener('error', function () { stateEl.hidden = false; stateEl.innerHTML = '<b>Não foi possível carregar a imagem.</b>'; stateEl.appendChild(el('button', { type: 'button', class: 'btn', text: 'Tentar novamente', on: { click: function () { load(idx); } } })); });
  }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function applyPanel() {
    var btn = $('#vw-panel-btn'); main.classList.toggle('with-panel', panelOpen); panel.hidden = !panelOpen; btn.setAttribute('aria-pressed', panelOpen);
    if (fitMode) requestAnimationFrame(fit);
  }
  function setZoom(z, keepFit) {
    zoom = Math.max(0.1, Math.min(4, z)); if (!keepFit) fitMode = fitMode && false;
    img.style.width = (natW * zoom) + 'px'; img.style.height = (natH * zoom) + 'px';
    $('#vw-zv').textContent = Math.round(zoom * 100) + '%';
  }
  function zoomAt(f, cx, cy) {
    var r = stage.getBoundingClientRect(), ox = cx - r.left + stage.scrollLeft, oy = cy - r.top + stage.scrollTop, old = zoom;
    fitMode = false; setZoom(old * f); var k = zoom / old;
    stage.scrollLeft = ox * k - (cx - r.left); stage.scrollTop = oy * k - (cy - r.top);
  }
  function fit() { fitMode = true; var w = stage.clientWidth || 800, h = stage.clientHeight || 500; zoom = Math.min(w / natW, h / natH, 1.6); setZoom(zoom, true); stage.scrollTo(0, 0); }
  function load(i) {
    var it = V.items[i]; stateEl.hidden = false; stateEl.innerHTML = '<span class="spinner" aria-hidden="true"></span><span>Carregando imagem…</span>';
    img.alt = 'Print anotado: ' + it.title; natW = (it.data && it.data.w) || natW; natH = (it.data && it.data.h) || natH;
    img.src = it.img.src;
    if (img.complete && img.naturalWidth) { natW = img.naturalWidth; natH = img.naturalHeight; stateEl.hidden = true; if (fitMode) fit(); else setZoom(zoom); }
  }
  function fillPanel(it) {
    panel.innerHTML = ''; panel.appendChild(el('h3', { text: 'Instruções' }));
    panel.appendChild(el('p', { class: 'nature-note', text: 'Selecione um ponto na imagem ou um item da lista.' }));
    if (!it.list) return;
    var ol = it.list.cloneNode(true); ol.removeAttribute('style'); panel.appendChild(ol);
    var lis = $$('li', ol), btns = {};
    $$('.vw-hs', canvas).forEach(function (b) { (btns[b.dataset.n] = btns[b.dataset.n] || []).push(b); });
    lis.forEach(function (li) {
      var n = numOf(li); if (!btns[n]) return; li.style.cursor = 'pointer';
      li.addEventListener('click', function () { activate(n, true); });
    });
  }
  function activate(n, scroll) {
    $$('.vw-hs', canvas).forEach(function (b) { b.classList.toggle('on', b.dataset.n === n); });
    $$('li', panel).forEach(function (l) { l.classList.toggle('on', numOf(l) === n); });
    var b = $('.vw-hs.on', canvas), li = $('li.on', panel);
    if (li) li.scrollIntoView({ block: 'nearest' });
    if (b && scroll) { var r = stage.getBoundingClientRect(), br = b.getBoundingClientRect(); stage.scrollLeft += br.left - r.left - r.width / 2; stage.scrollTop += br.top - r.top - r.height / 2; }
  }
  function drawHotspots(it) {
    $$('.vw-hs', canvas).forEach(function (b) { b.remove(); });
    if (!it.data) return;
    Object.keys(it.data.pts).forEach(function (n) {
      it.data.pts[n].forEach(function (p) {
        var b = el('button', { type: 'button', class: 'hs vw-hs', 'data-n': n, 'aria-label': 'Ponto ' + n });
        b.style.left = (p[0] / it.data.w * 100) + '%'; b.style.top = (p[1] / it.data.h * 100) + '%';
        b.addEventListener('click', function (e) { e.stopPropagation(); activate(n, false); });
        canvas.appendChild(b);
      });
    });
  }
  V.go = function (i) {
    if (i < 0 || i >= V.items.length) return;
    idx = i; var it = V.items[i];
    titleEl.innerHTML = ''; titleEl.appendChild(document.createTextNode(it.title)); titleEl.appendChild(el('small', { text: 'Imagem ' + (i + 1) + ' de ' + V.items.length }));
    countEl.textContent = 'Imagem ' + (i + 1) + ' de ' + V.items.length;
    drawHotspots(it); fillPanel(it); load(i);
  };
  V.open = function (i, from) {
    if (!dlg) build();
    opener = from || document.activeElement; panelOpen = window.innerWidth >= 700; fitMode = true;
    if (!dlg.open) dlg.showModal();
    applyPanel(); V.go(i); stage.focus();
  };
  V.init = function () { $$('figure.shot').forEach(initFigure); };
})();
