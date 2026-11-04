/* Utilitarios compartilhados (namespace PPI). Sem dependencias externas. */
(function () {
  'use strict';
  var PPI = window.PPI = window.PPI || {};

  PPI.$ = function (s, r) { return (r || document).querySelector(s); };
  PPI.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* el('button', {class:'btn', text:'x', on:{click:fn}, aria:{label:'..'}, data:{a:1}}, [children]) */
  PPI.el = function (tag, attrs, kids) {
    var n = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k === 'on') Object.keys(v).forEach(function (e) { n.addEventListener(e, v[e]); });
      else if (k === 'aria') Object.keys(v).forEach(function (a) { n.setAttribute('aria-' + a, v[a]); });
      else if (k === 'data') Object.keys(v).forEach(function (a) { n.setAttribute('data-' + a, v[a]); });
      else if (v === true) n.setAttribute(k, '');
      else n.setAttribute(k, v);
    });
    (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  };

  PPI.norm = function (s) { return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  PPI.slug = function (s) { return PPI.norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40).replace(/-+$/, ''); };
  PPI.text = function (n) { return (n.textContent || '').replace(/\s+/g, ' ').trim(); };
  PPI.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  PPI.debounce = function (fn, ms) { var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms); }; };
  PPI.reducedMotion = function () { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; };
  PPI.uid = (function () { var n = 0; return function (p) { return (p || 'id') + '-' + (++n); }; })();

  /* Armazenamento local seguro: se o navegador bloquear, usa memoria e sinaliza PPI.storage.ok = false. */
  var mem = {};
  var store = {
    ok: true,
    get: function (k, def) {
      try { var v = window.localStorage.getItem(k); return v == null ? def : JSON.parse(v); } catch (e) { if (k in mem) return mem[k]; return def; }
    },
    raw: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) {
      try { window.localStorage.setItem(k, JSON.stringify(v)); return true; }
      catch (e) { store.ok = false; mem[k] = v; PPI.bus.emit('storage-fail'); return false; }
    },
    remove: function (k) { try { window.localStorage.removeItem(k); } catch (e) { /* ignore */ } delete mem[k]; },
    keys: function (prefix) {
      var out = [];
      try { for (var i = 0; i < window.localStorage.length; i++) { var k = window.localStorage.key(i); if (k.indexOf(prefix) === 0) out.push(k); } } catch (e) { /* ignore */ }
      return out;
    }
  };
  try { var probe = '__ppi_probe__'; window.localStorage.setItem(probe, '1'); window.localStorage.removeItem(probe); } catch (e) { store.ok = false; }
  PPI.storage = store;
  PPI.KEY = { theme: 'ppi40-guia-tema', legacyCheck: 'manual-ppi40-check', mode: 'ppi40-manual:mode', progress: 'ppi40-manual:progress', last: 'ppi40-manual:last', exercises: 'ppi40-manual:exercicios', projects: 'ppi40-manual:projetos', ckSel: 'ppi40-manual:checklist-selecao', ckPrefix: 'ppi40-manual:checklist:' };

  /* Barramento de eventos simples */
  var handlers = {};
  PPI.bus = {
    on: function (e, fn) { (handlers[e] = handlers[e] || []).push(fn); },
    emit: function (e, d) { (handlers[e] || []).slice().forEach(function (fn) { try { fn(d); } catch (err) { if (window.console) console.error(err); } }); }
  };

  /* Regiao viva para leitores de tela */
  PPI.announce = function (msg) {
    var r = PPI.$('#live-region');
    if (!r) { r = PPI.el('div', { id: 'live-region', class: 'sr-only', role: 'status', 'aria-live': 'polite' }); document.body.appendChild(r); }
    r.textContent = ''; setTimeout(function () { r.textContent = msg; }, 30);
  };

  var NS = 'http://www.w3.org/2000/svg';
  PPI.icon = function (name) {
    var d = {
      search: 'M11 4a7 7 0 1 0 4.2 12.6l4.1 4.1 1.4-1.4-4.1-4.1A7 7 0 0 0 11 4z',
      menu: 'M3 6h18M3 12h18M3 18h18', book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zM19 19v2H6',
      moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z', sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
      check: 'M4 12l5 5L20 6', chev: 'M9 5l7 7-7 7', left: 'M15 5l-7 7 7 7', right: 'M9 5l7 7-7 7',
      warn: 'M12 3l10 18H2L12 3zM12 10v5M12 18v.5', plus: 'M12 5v14M5 12h14', minus: 'M5 12h14', x: 'M6 6l12 12M18 6L6 18',
      fit: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5', print: 'M7 8V3h10v5M6 17H4v-7h16v7h-2M7 14h10v7H7z', pdf: 'M6 3h9l4 4v14H6zM14 3v5h5', panel: 'M3 4h18v16H3zM15 4v16'
    }[name] || '';
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false');
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', 'currentColor'); p.setAttribute('stroke-width', '2'); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
    s.appendChild(p); return s;
  };

  /* Realce de termos em texto (retorna HTML seguro) */
  PPI.highlight = function (text, tokens) {
    if (!tokens || !tokens.length) return PPI.esc(text);
    var n = PPI.norm(text), marks = [];
    tokens.forEach(function (t) { if (!t) return; var i = 0; while ((i = n.indexOf(t, i)) > -1) { marks.push([i, i + t.length]); i += t.length; } });
    if (!marks.length) return PPI.esc(text);
    marks.sort(function (a, b) { return a[0] - b[0]; });
    var out = '', pos = 0;
    marks.forEach(function (m) { if (m[0] < pos) { if (m[1] > pos) { out += '<mark>' + PPI.esc(text.slice(pos, m[1])) + '</mark>'; pos = m[1]; } return; } out += PPI.esc(text.slice(pos, m[0])) + '<mark>' + PPI.esc(text.slice(m[0], m[1])) + '</mark>'; pos = m[1]; });
    return out + PPI.esc(text.slice(pos));
  };
})();
