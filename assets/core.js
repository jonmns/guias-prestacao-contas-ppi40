/* Portal PPI 4.0 · núcleo compartilhado (todas as páginas)
   Armazenamento local com plano B em memória, tema, cabeçalho, busca, progresso e favoritos. */
(function () {
  'use strict';
  var KEY = 'ppi40-portal-v1', THEME_KEY = 'ppi40-guia-tema';
  var root = document.documentElement;
  var BASE = (document.body && document.body.getAttribute('data-base')) || '';

  /* ---------- armazenamento ---------- */
  var mem = {}, persistent = true;
  try { localStorage.setItem('__ppi', '1'); localStorage.removeItem('__ppi'); } catch (e) { persistent = false; }
  if (!persistent) root.classList.add('no-store');
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { persistent = false; return mem[k] || null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { persistent = false; mem[k] = v; root.classList.add('no-store'); } }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) { delete mem[k]; } }

  var state;
  function load() {
    var s = {};
    try { s = JSON.parse(lsGet(KEY) || '{}') || {}; } catch (e) { s = {}; }
    s.s = s.s || {};      // estudado: chave -> true
    s.f = s.f || {};      // favoritos: chave -> {t,u,m}
    s.q = s.q || {};      // avaliações: id -> {best,total}
    s.c = s.c || {};      // checklists: id -> {item:true}
    s.l = s.l || null;    // última posição
    return s;
  }
  state = load();
  function emit() { try { window.dispatchEvent(new CustomEvent('ppi:change')); } catch (e) {} }
  function save() { lsSet(KEY, JSON.stringify(state)); emit(); }
  window.addEventListener('storage', function (e) { if (e.key === KEY) { state = load(); emit(); } });

  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var PPI = window.PPI = {
    base: BASE, norm: norm, esc: esc, lsGet: lsGet, lsSet: lsSet, lsDel: lsDel,
    get persistent() { return persistent; },
    get state() { return state; },
    save: save,
    isDone: function (k) { return !!state.s[k]; },
    setDone: function (k, v) { if (v) state.s[k] = 1; else delete state.s[k]; save(); },
    isFav: function (k) { return !!state.f[k]; },
    toggleFav: function (k, info) { if (state.f[k]) delete state.f[k]; else state.f[k] = info; save(); return !!state.f[k]; },
    setLast: function (o) { state.l = o; lsSet(KEY, JSON.stringify(state)); },
    toast: function (msg) {
      var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
      document.body.appendChild(t); setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2600);
    },
    replaceState: function (s) { state = s; save(); }
  };

  /* ---------- tema ---------- */
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function curTheme() { var t = root.getAttribute('data-theme'); if (t) return t; return mq && mq.matches ? 'dark' : 'light'; }
  var themeBtn = document.getElementById('p-theme');
  function paintTheme() {
    if (!themeBtn) return;
    var d = curTheme() === 'dark';
    themeBtn.classList.toggle('is-dark', d);
    themeBtn.setAttribute('aria-pressed', d ? 'true' : 'false');
    themeBtn.title = d ? 'Mudar para modo claro' : 'Mudar para modo escuro';
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var legacy = document.getElementById('theme-btn');   // botão existente nos manuais
      if (legacy) { legacy.click(); }
      else { var n = curTheme() === 'dark' ? 'light' : 'dark'; root.setAttribute('data-theme', n); lsSet(THEME_KEY, n); }
      paintTheme();
    });
    if (mq && mq.addEventListener) mq.addEventListener('change', paintTheme);
    paintTheme();
  }

  /* ---------- cabeçalho ---------- */
  var menuBtn = document.getElementById('p-menu-btn'), nav = document.getElementById('p-nav');
  var sBtn = document.getElementById('p-search-btn'), sBox = document.getElementById('p-search');
  var ddBtn = document.querySelector('.dd-b'), ddMenu = document.getElementById('p-dd');
  function setOpen(btn, panel, on) { if (!btn || !panel) return; panel.classList.toggle('open', on); btn.setAttribute('aria-expanded', on ? 'true' : 'false'); }
  if (menuBtn) menuBtn.addEventListener('click', function () { setOpen(menuBtn, nav, !nav.classList.contains('open')); });
  if (sBtn) sBtn.addEventListener('click', function () {
    var on = !sBox.classList.contains('open'); setOpen(sBtn, sBox, on);
    if (on) { var i = document.getElementById('p-q'); if (i) i.focus(); }
  });
  if (ddBtn) ddBtn.addEventListener('click', function (e) { e.stopPropagation(); setOpen(ddBtn, ddMenu, !ddMenu.classList.contains('open')); });
  document.addEventListener('click', function (e) {
    if (ddMenu && !ddMenu.contains(e.target) && e.target !== ddBtn) setOpen(ddBtn, ddMenu, false);
    var sg = document.getElementById('p-sug'); if (sg && !sBox.contains(e.target)) closeSug();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (ddMenu && ddMenu.classList.contains('open')) { setOpen(ddBtn, ddMenu, false); ddBtn.focus(); }
    else if (nav && nav.classList.contains('open')) { setOpen(menuBtn, nav, false); menuBtn.focus(); }
    else if (sBox && sBox.classList.contains('open') && sBtn && getComputedStyle(sBtn).display !== 'none') { setOpen(sBtn, sBox, false); sBtn.focus(); }
    closeSug();
  });

  /* ---------- busca ---------- */
  var IDX = null, pending = null;
  var ABBR = {
    pc: ['prestacao de contas'], rd: ['relatorio demonstrativo', 'relatorio tecnico'], ig: ['indicadores gerenciais'],
    pf: ['planilha financeira'], rh: ['recursos humanos', 'rhd', 'rhi'], nf: ['nota fiscal', 'danfe'], stt: ['servicos tecnicos de terceiros'],
    pur: ['plano de utilizacao de recursos'], ict: ['instituicao cientifica'], pdi: ['pd&i'], 'pd&i': ['pdi'],
    ratear: ['rateio'], rateios: ['rateio'], conciliar: ['conciliacao'], conciliacao: ['conciliar', 'conc. bancaria'],
    legislacao: ['lei', 'decreto', 'resolucao', 'portaria'], norma: ['lei', 'decreto', 'resolucao', 'portaria'], normas: ['lei', 'decreto', 'resolucao', 'portaria'],
    adendos: ['adendo'], oficio: ['oficio'], horas: ['hora']
  };
  function prepare(d) {
    d.items.forEach(function (it) { it._t = norm(it.t); it._x = norm(it.x); it._p = norm(it.p || ''); it._g = (it.g || []).map(function (i) { return norm(d.subjects[i]); }).join(' '); });
    return d;
  }
  function loadIndex(cb) {
    if (IDX) return cb(IDX);
    if (window.PPI_INDEX) { IDX = prepare(window.PPI_INDEX); return cb(IDX); }
    if (pending) { pending.push(cb); return; }
    pending = [cb];
    var s = document.createElement('script'); s.src = BASE + 'assets/search-index.js';
    s.onload = function () { IDX = prepare(window.PPI_INDEX); var l = pending; pending = null; l.forEach(function (f) { f(IDX); }); };
    s.onerror = function () { var l = pending; pending = null; l.forEach(function (f) { f(null); }); };
    document.head.appendChild(s);
  }
  function terms(q) {
    return norm(q).split(/\s+/).map(function (t) { return t.replace(/^[^a-z0-9§]+|[^a-z0-9§&]+$/g, ''); }).filter(function (t) { return t.length > 0; });
  }
  function alts(t) { return [t].concat(ABBR[t] || []); }
  function countOf(h, n) { var c = 0, i = h.indexOf(n); while (i >= 0 && c < 6) { c++; i = h.indexOf(n, i + n.length); } return c; }
  function search(q, f) {
    f = f || {};
    var T = terms(q); if (!T.length || !IDX) return [];
    var phrase = norm(q).trim(), out = [];
    IDX.items.forEach(function (it, pos) {
      if (f.m && it.m !== f.m) return;
      if (f.c !== undefined && f.c !== '' && it.c !== +f.c) return;
      if (f.a !== undefined && f.a !== '' && (it.g || []).indexOf(+f.a) < 0) return;
      var score = 0, ok = true;
      for (var i = 0; i < T.length && ok; i++) {
        var best = 0;
        alts(T[i]).forEach(function (a) {
          var s = 0, ti = it._t.indexOf(a);
          if (ti === 0) s += 14; else if (ti > 0) s += 9;
          if (it._p.indexOf(a) >= 0) s += 3;
          if (it._g.indexOf(a) >= 0) s += 2;
          var c = countOf(it._x, a); if (c) s += Math.min(c, 5) + 1;
          if (s > best) best = s;
        });
        if (!best) ok = false; else score += best;
      }
      if (!ok) return;
      if (phrase.length > 3) { if (it._t.indexOf(phrase) >= 0) score += 12; if (it._x.indexOf(phrase) >= 0) score += 5; }
      out.push({ it: it, score: score, pos: pos });
    });
    out.sort(function (a, b) { return b.score - a.score || a.pos - b.pos; });
    return out;
  }
  function ranges(normed, T) {
    var r = [];
    T.forEach(function (t) { alts(t).forEach(function (a) { if (!a) return; var i = normed.indexOf(a); var n = 0; while (i >= 0 && n < 8) { r.push([i, i + a.length]); i = normed.indexOf(a, i + a.length); n++; } }); });
    r.sort(function (a, b) { return a[0] - b[0]; });
    var m = []; r.forEach(function (x) { var l = m[m.length - 1]; if (l && x[0] <= l[1]) l[1] = Math.max(l[1], x[1]); else m.push(x.slice()); });
    return m;
  }
  function mark(orig, normed, T, from, to) {
    var rs = ranges(normed, T).filter(function (r) { return r[1] > from && r[0] < to; });
    var out = '', pos = from;
    rs.forEach(function (r) { var a = Math.max(r[0], from), b = Math.min(r[1], to); if (a < pos) return; out += esc(orig.slice(pos, a)) + '<mark>' + esc(orig.slice(a, b)) + '</mark>'; pos = b; });
    return out + esc(orig.slice(pos, to));
  }
  function snippet(it, T) {
    var x = it.x, nx = it._x; if (nx.length !== x.length) return esc(x.slice(0, 220));
    var rs = ranges(nx, T), at = rs.length ? rs[0][0] : 0;
    var from = Math.max(0, at - 70), to = Math.min(x.length, from + 240);
    if (from > 0) { var sp = x.indexOf(' ', from); if (sp > 0 && sp < at) from = sp + 1; }
    return (from > 0 ? '… ' : '') + mark(x, nx, T, from, to) + (to < x.length ? ' …' : '');
  }
  function markTitle(it, T) { return it._t.length === it.t.length ? mark(it.t, it._t, T, 0, it.t.length) : esc(it.t); }
  PPI.loadIndex = loadIndex; PPI.search = search; PPI.terms = terms; PPI.snippet = snippet; PPI.markTitle = markTitle;
  PPI.url = function (it) { return BASE + it.u; };

  var qInput = document.getElementById('p-q'), sug = document.getElementById('p-sug'), sel = -1, shown = [];
  function closeSug() { if (!sug) return; sug.classList.remove('open'); sug.innerHTML = ''; sel = -1; if (qInput) { qInput.setAttribute('aria-expanded', 'false'); qInput.removeAttribute('aria-activedescendant'); } }
  function paintSel() {
    var as = sug.querySelectorAll('a[role=option]');
    [].forEach.call(as, function (a, i) { a.setAttribute('aria-selected', i === sel ? 'true' : 'false'); });
    if (sel >= 0 && as[sel]) qInput.setAttribute('aria-activedescendant', as[sel].id); else qInput.removeAttribute('aria-activedescendant');
  }
  function suggest() {
    var q = qInput.value.trim();
    if (q.length < 2) { closeSug(); return; }
    loadIndex(function (d) {
      if (!d) { closeSug(); return; }
      var T = terms(q), res = search(q), html = '';
      shown = res.slice(0, 6);
      shown.forEach(function (r, i) {
        var mname = r.it.m === 'portal' ? 'Portal' : d.manuals[r.it.m].short;
        html += '<a role="option" id="sg' + i + '" aria-selected="false" href="' + esc(PPI.url(r.it)) + '"><span class="sg-t">' + markTitle(r.it, T) + '</span><br><span class="sg-p">' + esc(mname) + ' › ' + esc(r.it.p || '') + '</span></a>';
      });
      if (!res.length) html = '<div class="sg-none">Nenhum resultado para "' + esc(q) + '".</div>';
      else html += '<a class="sg-all" href="' + esc(BASE + 'consultar.html?q=' + encodeURIComponent(q)) + '">Ver todos os ' + res.length + ' resultados</a>';
      sug.innerHTML = html; sug.classList.add('open'); qInput.setAttribute('aria-expanded', 'true'); sel = -1;
    });
  }
  if (qInput && sug) {
    var tmr;
    qInput.addEventListener('input', function () { clearTimeout(tmr); tmr = setTimeout(suggest, 120); });
    qInput.addEventListener('focus', function () { loadIndex(function () {}); });
    qInput.addEventListener('keydown', function (e) {
      var n = sug.querySelectorAll('a[role=option]').length;
      if (e.key === 'ArrowDown' && n) { e.preventDefault(); sel = (sel + 1) % n; paintSel(); }
      else if (e.key === 'ArrowUp' && n) { e.preventDefault(); sel = (sel - 1 + n) % n; paintSel(); }
      else if (e.key === 'Enter' && sel >= 0) { e.preventDefault(); var a = sug.querySelectorAll('a[role=option]')[sel]; if (a) location.href = a.href; }
    });
    var sp = new URLSearchParams(location.search);
    if (sp.get('q') && document.body.getAttribute('data-page') === 'consult') qInput.value = '';
  }

  /* ---------- progresso, estudado e favoritos ---------- */
  function refreshProg() {
    [].forEach.call(document.querySelectorAll('.prog[data-keys]'), function (p) {
      var keys = p.getAttribute('data-keys').split(','), done = keys.filter(function (k) { return state.s[k]; }).length;
      var pct = keys.length ? Math.round(done / keys.length * 100) : 0;
      var t = p.querySelector('[data-prog-text]'); if (t) t.textContent = done + ' de ' + keys.length + ' ' + (p.getAttribute('data-unit') || '');
      var bar = p.querySelector('.pbar'); if (bar) { bar.setAttribute('aria-valuenow', pct); bar.firstElementChild.style.width = pct + '%'; }
    });
  }
  function syncButtons() {
    [].forEach.call(document.querySelectorAll('[data-study]'), function (b) {
      var on = !!state.s[b.getAttribute('data-key')];
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.textContent = on ? '✓ Estudada (desfazer)' : 'Marcar como estudada';
    });
    [].forEach.call(document.querySelectorAll('[data-fav]'), function (b) {
      var on = !!state.f[b.getAttribute('data-key')];
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.textContent = on ? '★ Nos favoritos' : '☆ Favoritar';
    });
    [].forEach.call(document.querySelectorAll('section.sec[id], article.lesson[data-lesson]'), function (s) {
      var k = s.hasAttribute('data-lesson') ? 'lesson:' + s.getAttribute('data-lesson') : 'sec:' + (document.body.getAttribute('data-manual') + '#' + s.id);
      s.classList.toggle('is-studied', !!state.s[k]);
    });
    [].forEach.call(document.querySelectorAll('[data-lesson-link]'), function (a) {
      a.classList.toggle('done', !!state.s['lesson:' + a.getAttribute('data-lesson-link')]);
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-study],[data-fav]'); if (!b) return;
    var k = b.getAttribute('data-key');
    if (b.hasAttribute('data-study')) {
      var on = !state.s[k]; PPI.setDone(k, on);
      PPI.toast(on ? 'Marcado como estudado.' : 'Marcação removida.');
    } else {
      var added = PPI.toggleFav(k, { t: b.getAttribute('data-title'), u: b.getAttribute('data-url'), m: b.getAttribute('data-m') });
      PPI.toast(added ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.');
    }
  });
  function onChange() { refreshProg(); syncButtons(); }
  window.addEventListener('ppi:change', onChange);
  PPI.refresh = onChange;
  onChange();
  if (!persistent) root.classList.add('no-store');
})();
