/* Casca da aplicação: tema, menu lateral, rotas por hash, biblioteca (filtros e dispositivos), diálogos. */
(function (w) {
  'use strict';
  var PDI = w.PDI, U = PDI.U, S = PDI.Store, V = PDI.Views, $ = U.$, $$ = U.$$, esc = U.esc;
  var root = document.documentElement, viewApp, viewLib, live, sideEl, stage;
  var cur = { name: 'home' }, mode = 'aprender', spyId = '', pendingHl = '', pendingRestore = null;
  var ctx = { aprender: '#/aprender', consultar: '#/consultar' }, memo = {}, openMods = {};
  var mqMobile = w.matchMedia('(max-width:960px)'), first = true;
  var SUFIXO = ' · Base Normativa PD&I';
  var MODFILTRO = { all: 'Todas', ppi: 'PPI 4.0', conv: 'Convênio direto', trans: 'Normas transversais' };

  /* ---------------------------------------------------------------- utilidades */
  function announce(msg) { if (!live) return; live.textContent = ''; setTimeout(function () { live.textContent = msg; }, 60); }
  function safeDecode(s) { try { return decodeURIComponent(s); } catch (e) { return s; } }

  /* ---------------------------------------------------------------- tema (mesma chave dos outros guias) */
  function initTheme() {
    var KEY = 'ppi40-guia-tema', btn = $('#theme-btn'), lbl = $('#theme-lbl'), mq = w.matchMedia ? w.matchMedia('(prefers-color-scheme: dark)') : null;
    function current() { var t = root.getAttribute('data-theme'); if (t) return t; return mq && mq.matches ? 'dark' : 'light'; }
    function paint() { var d = current() === 'dark'; btn.classList.toggle('is-dark', d); btn.setAttribute('aria-pressed', d ? 'true' : 'false'); lbl.textContent = d ? 'Modo claro' : 'Modo escuro'; }
    btn.addEventListener('click', function () { var n = current() === 'dark' ? 'light' : 'dark'; root.setAttribute('data-theme', n); try { w.localStorage.setItem(KEY, n); } catch (e) { /* ignora */ } paint(); });
    if (mq && mq.addEventListener) mq.addEventListener('change', paint);
    paint();
  }

  /* ---------------------------------------------------------------- menu lateral */
  function syncToggle() {
    var b = $('#side-toggle'), open;
    if (mqMobile.matches) open = root.getAttribute('data-drawer') === 'open'; else open = root.getAttribute('data-side') !== 'closed';
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    b.setAttribute('aria-label', open ? 'Recolher menu lateral' : 'Abrir menu lateral');
    sideEl.inert = !open;
    stage.inert = mqMobile.matches && open;
    $('#side-scrim').hidden = !(mqMobile.matches && open);
  }
  function setDrawer(open) {
    if (open) root.setAttribute('data-drawer', 'open'); else root.removeAttribute('data-drawer');
    syncToggle();
    if (open) { var f = $('a, button', sideEl); f && f.focus(); } else if (mqMobile.matches) { /* devolve o foco ao botão */ }
  }
  function toggleSide() {
    if (mqMobile.matches) { var o = root.getAttribute('data-drawer') === 'open'; setDrawer(!o); if (o) $('#side-toggle').focus(); return; }
    var closed = root.getAttribute('data-side') === 'closed';
    if (closed) root.removeAttribute('data-side'); else root.setAttribute('data-side', 'closed');
    try { w.localStorage.setItem('ppi40.pdi.v1.side', closed ? '1' : '0'); } catch (e) { /* ignora */ }
    syncToggle();
  }

  function dotHtml(id) {
    var s = S.status(id), c = s === 'concluida' ? 'ok' : s === 'andamento' ? 'and' : 'pend';
    return '<span class="dot ' + c + '" aria-hidden="true"></span><span class="sr-only">' + U.STATUS[s] + ': </span>';
  }
  function sideLink(href, label, extra) {
    var on = (extra && extra.on) ? ' aria-current="page"' : '';
    return '<a class="si' + (extra && extra.cls ? ' ' + extra.cls : '') + '" href="' + href + '"' + on + '>' + label + '</a>';
  }
  function curHash() { return location.hash || '#/aprender'; }
  function isOn(h) { return curHash() === h || safeDecode(curHash()).indexOf(h + '/') === 0; }

  function sideAprender() {
    var tr = S.get().prefs.trilha, list = U.aulasVis(tr), st = U.stats(list), curAula = cur.name === 'aula' ? cur.arg : null, curMod = cur.name === 'modulo' ? +cur.arg : null;
    var h = '<div class="sg">' + sideLink('#/aprender', 'Início', { on: cur.name === 'home' }) + '</div>';
    h += '<div class="sg"><p class="sh">Trilha</p><div class="strail" role="group" aria-label="Trilha de estudo">' +
      [['todas', 'Todas'], ['ppi', 'PPI 4.0'], ['conv', 'Convênio']].map(function (t) { return '<button type="button" data-trilha="' + t[0] + '" aria-pressed="' + (tr === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '<p class="spc2">' + st.done + ' de ' + st.total + ' aulas concluídas</p></div>';
    h += '<div class="sg"><p class="sh">Módulos</p>' + PDI.modulos.map(function (m) {
      var l = list.filter(function (a) { return a.mod === m.n; }); if (!l.length) return '';
      var s = U.stats(l), has = l.some(function (a) { return a.id === curAula; }) || curMod === m.n, open = has || openMods[m.n];
      return '<details class="smod" data-m="' + m.n + '"' + (open ? ' open' : '') + '><summary><span class="sn">' + m.n + '</span><span class="smt">' + esc(m.titulo) + '</span><span class="spc">' + s.done + '/' + s.total + '</span></summary><ul>' +
        '<li><a class="si sub" href="#/modulo/' + m.n + '"' + (curMod === m.n ? ' aria-current="page"' : '') + '>Visão do módulo</a></li>' +
        l.map(function (a) { return '<li><a class="si sub" href="#/aula/' + a.id + '"' + (a.id === curAula ? ' aria-current="page"' : '') + '>' + dotHtml(a.id) + esc(a.titulo) + '</a></li>'; }).join('') + '</ul></details>';
    }).join('') + '</div>';
    return h;
  }
  function sideConsultar() {
    var h = '<div class="sg"><p class="sh">Biblioteca normativa</p>' + $$('nav.toc li a').map(function (a) {
      var n = $('.n', a).textContent, t = a.textContent.slice(n.length);
      return '<a class="si" href="' + a.getAttribute('href') + '" data-spy="' + a.getAttribute('href').slice(1) + '"><span class="n">' + n + '</span>' + esc(t) + '</a>';
    }).join('') + '</div>';
    h += '<div class="sg"><p class="sh">Normas</p>' + $$('.norm').map(function (n) {
      var nm = ''; Object.keys(PDI.normas).forEach(function (k) { if (PDI.normas[k].card === n.id && !PDI.normas[k].url) nm = PDI.normas[k].nome; });
      return '<a class="si sub" href="#' + n.id + '" data-spy="' + n.id + '"' + (n.hidden ? ' hidden' : '') + '>' + esc(nm || $('h3', n).textContent) + '</a>';
    }).join('') + '</div>';
    return h;
  }
  function buildSide() {
    var h = mode === 'aprender' ? sideAprender() : sideConsultar();
    h += '<div class="sg"><p class="sh">Ferramentas</p>' + [['#/glossario', 'Glossário'], ['#/mapa', 'Mapa normativo'], ['#/comparar', 'Comparar modalidades'], ['#/checklists', 'Checklists'], ['#/desempenho', 'Meu desempenho']]
      .map(function (t) { return sideLink(t[0], t[1], { on: isOn(t[0]) }); }).join('') + '</div>';
    h += '<div class="sg sfoot">' + (mode === 'aprender' ? '<a class="si swap" href="' + ctx.consultar + '" data-swap="consultar">Ir para a biblioteca →</a>' : '<a class="si swap" href="' + ctx.aprender + '" data-swap="aprender">Ir para as trilhas →</a>') + '<a class="si" href="../index.html">← Todos os manuais</a></div>';
    $('#side-nav').innerHTML = h;
    applySpy();
  }
  var rebuildTimer;
  function rebuildSoon() { cancelAnimationFrame(rebuildTimer); rebuildTimer = requestAnimationFrame(function () { var f = document.activeElement; if (f && sideEl.contains(f)) return; buildSide(); }); }
  function applySpy() { $$('[data-spy]', sideEl).forEach(function (a) { var on = a.getAttribute('data-spy') === spyId; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'location'); else if (a.getAttribute('aria-current') === 'location') a.removeAttribute('aria-current'); }); }

  /* ---------------------------------------------------------------- rotas */
  function modeOf(r) {
    if (r.name === 'lib' || r.name === 'busca') return 'consultar';
    if (['home', 'modulo', 'aula'].indexOf(r.name) >= 0) return 'aprender';
    return mode;
  }
  function parse(h) {
    if (!h || h === '#' || h === '#/') return { name: 'home' };
    if (h.indexOf('#/') !== 0) return { name: 'lib', anchor: safeDecode(h.slice(1)) };
    var seg = h.slice(2).split('/').map(safeDecode);
    switch (seg[0]) {
      case 'aprender': case 'home': return { name: 'home' };
      case 'trilha': if (['ppi', 'conv', 'todas'].indexOf(seg[1]) >= 0) S.setPref('trilha', seg[1]); return { name: 'home', redirect: '#/aprender' };
      case 'modulo': return { name: 'modulo', arg: seg[1] };
      case 'aula': return { name: 'aula', arg: seg[1], arg2: seg[2] };
      case 'glossario': return { name: 'glossario', arg: seg[1] };
      case 'mapa': return { name: 'mapa', arg: seg[1] };
      case 'comparar': return { name: 'comparar' };
      case 'checklists': return { name: 'checklists', arg: seg[1] };
      case 'desempenho': return { name: 'desempenho' };
      case 'busca': return { name: 'busca', arg: seg.slice(1).join('/') };
      case 'consultar': return { name: 'lib' };
      default: return { name: 'nf' };
    }
  }
  function viewFor(r) {
    switch (r.name) {
      case 'home': return V.home();
      case 'modulo': return V.modulo(r.arg);
      case 'aula': return V.aula(r.arg, r.arg2);
      case 'glossario': return V.glossario(r.arg);
      case 'mapa': return V.mapa(r.arg);
      case 'comparar': return V.comparar();
      case 'checklists': return V.checklists(r.arg);
      case 'desempenho': return V.desempenho();
      case 'busca': return V.busca(r.arg);
      default: return V.naoEncontrado();
    }
  }

  function render(opts) {
    opts = opts || {};
    var r = parse(location.hash);
    if (r.redirect) { history.replaceState(null, '', r.redirect); r = parse(r.redirect); }
    cur = r;
    var isLib = r.name === 'lib';
    mode = modeOf(r);
    root.setAttribute('data-view', isLib ? 'lib' : 'app');
    root.setAttribute('data-mode', mode);
    if (viewApp._cleanup) { viewApp._cleanup(); viewApp._cleanup = null; }
    var m = $('#mode-aprender'), c = $('#mode-consultar');
    m.removeAttribute('aria-current'); c.removeAttribute('aria-current');
    (mode === 'aprender' ? m : c).setAttribute('aria-current', 'page');

    var key = location.hash || '#/aprender';
    if (isLib) ctx.consultar = key; else ctx[mode] = key;
    m.setAttribute('href', ctx.aprender); c.setAttribute('href', ctx.consultar);

    if (isLib) {
      viewApp.innerHTML = '';
      document.title = 'Biblioteca normativa' + SUFIXO;
      libShow(r.anchor, opts);
    } else {
      var v = viewFor(r);
      viewApp.innerHTML = v.html;
      document.title = v.title + SUFIXO;
      if (v.after) v.after(viewApp);
      if (r.name === 'busca') { var q = $('#q'); if (document.activeElement !== q) q.value = r.arg || ''; }
      if (!opts.keepFocus) {
        var secId = r.name === 'aula' ? r.arg2 : null, tgt = secId && $('#s-' + secId, viewApp);
        if (pendingRestore !== null) { w.scrollTo({ top: pendingRestore, behavior: 'instant' }); }
        else if (tgt) tgt.scrollIntoView({ behavior: 'instant' }); else w.scrollTo({ top: 0, behavior: 'instant' });
        if (!first) { var h1 = $('#view-title', viewApp); h1 && h1.focus({ preventScroll: true }); announce(v.title); }
      }
    }
    pendingRestore = null; first = false;
    if (mqMobile.matches) { root.removeAttribute('data-drawer'); syncToggle(); }
    buildSide();
    syncToggle();
  }

  /* ---------------------------------------------------------------- biblioteca */
  function applyMod(mod) {
    var nN = 0, nT = 0, mN = 0, mT = 0;
    $$('.norm').forEach(function (n) { nT++; var ok = mod === 'all' || (n.getAttribute('data-mod') || '').split(' ').indexOf(mod) >= 0; n.hidden = !ok; if (ok) nN++; });
    $$('article.man').forEach(function (n) { mT++; var ok = mod === 'all' || (n.getAttribute('data-mod') || '').split(' ').indexOf(mod) >= 0; n.hidden = !ok; if (ok) mN++; });
    var r = $('#libbar input[name="mod"][value="' + mod + '"]'); if (r) r.checked = true;
    $('#lib-count').textContent = mod === 'all' ? nT + ' normas e ' + mT + ' manuais, sem filtro.' : 'Filtro ' + MODFILTRO[mod] + ': ' + nN + ' de ' + nT + ' normas e ' + mN + ' de ' + mT + ' manuais.';
    $$('[data-spy^="n-"]', sideEl).forEach(function (a) { var t = document.getElementById(a.getAttribute('data-spy')); a.hidden = !!(t && t.hidden); });
  }
  function highlightRows(norm, q) {
    $$('tr.hl', norm).forEach(function (t) { t.classList.remove('hl'); });
    var P = U.parseQuery(q || ''); if (P.vazio) return;
    var first = null;
    $$('tbody tr', norm).forEach(function (tr) {
      var k = tr.cells[0].textContent.trim(), f = U.fold(k + ' ' + tr.cells[1].textContent), arts = U.parseArts(k);
      var artOk = !P.arts.length || P.arts.some(function (a) { return arts.indexOf(a) >= 0; });
      var txtOk = P.toks.every(function (t) { return f.indexOf(t) >= 0; });
      if (artOk && txtOk) { tr.classList.add('hl'); if (!first) first = tr; }
    });
    return first;
  }
  function libShow(anchor, opts) {
    var mod = S.get().prefs.mod; applyMod(mod);
    var el = anchor ? document.getElementById(anchor) : null;
    if (anchor === 'live' || (el && !viewLib.contains(el))) el = null;
    if (!el) { if (pendingRestore !== null) w.scrollTo({ top: pendingRestore, behavior: 'instant' }); else w.scrollTo({ top: 0, behavior: 'instant' }); if (!first) announce('Biblioteca normativa'); return; }
    var card = el.closest('.norm,.man');
    if (card && card.hidden) { S.setPref('mod', 'all'); applyMod('all'); }
    var norm = el.closest('.norm'), target = el;
    if (pendingRestore !== null && !pendingHl) { w.scrollTo({ top: pendingRestore, behavior: 'instant' }); return; }
    if (norm) {
      var d = $('details.disp', norm); if (d) d.open = true;
      var f = pendingHl ? highlightRows(norm, pendingHl) : null; if (f) target = f;
    }
    pendingHl = '';
    target.scrollIntoView({ block: target === el ? 'start' : 'center', behavior: 'instant' });
    el.classList.add('flash'); setTimeout(function () { el.classList.remove('flash'); }, 2200);
    if (!first && !opts.keepFocus) { var h = $('h2,h3,h4', el); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
  }
  function initLibrary() {
    $$('#libbar input[name="mod"]').forEach(function (r) { r.addEventListener('change', function () { S.setPref('mod', r.value); applyMod(r.value); announce($('#lib-count').textContent); buildSide(); }); });
    $('#lib-expand').addEventListener('click', function () { $$('details.disp').forEach(function (d) { if (!d.closest('.norm').hidden) d.open = true; }); announce('Dispositivos expandidos'); });
    $('#lib-collapse').addEventListener('click', function () { $$('details.disp').forEach(function (d) { d.open = false; }); announce('Dispositivos recolhidos'); });

    /* links "Aprender" em cada norma e manual */
    function rel(id, host) {
      var as = PDI.aulas.filter(function (a) { return a.base.some(function (b) { var n = PDI.normas[b[0]]; return n && n.card === id; }); });
      if (!as.length) return;
      host.innerHTML = '<p><b>Aprender sobre esta norma:</b> ' + as.map(function (a) { return '<a class="nl" href="#/aula/' + a.id + '">' + esc(a.titulo) + '</a>'; }).join(' ') + '</p>';
    }
    $$('.nrel').forEach(function (h) { rel(h.getAttribute('data-norma'), h); });
    $$('article.man').forEach(function (m) { var h = document.createElement('div'); h.className = 'nrel'; m.appendChild(h); rel(m.id, h); });

    /* tabelas em cartões no celular (mesma lógica da versão anterior) */
    $$('.tbl-wrap > table').forEach(function (tab) {
      var hs = $$('thead th', tab).map(function (th) { return th.textContent.trim(); }); if (!hs.length) return;
      $$('tbody tr', tab).forEach(function (tr) { [].forEach.call(tr.children, function (td, i) { if (hs[i]) td.setAttribute('data-label', hs[i]); }); });
      tab.parentNode.classList.add('mcards');
    });
    var tw = $$('.tbl-wrap:not(.mcards)');
    function hints() { tw.forEach(function (x) { var p = x.previousElementSibling, has = p && p.classList.contains('swipe-hint'); if (mqMobile.matches && x.scrollWidth > x.clientWidth + 4 && !has) { var d = document.createElement('div'); d.className = 'swipe-hint'; d.textContent = 'Deslize para o lado para ver tudo →'; x.parentNode.insertBefore(d, x); } }); }
    hints(); w.addEventListener('resize', hints);

    /* seção atual no menu (rolagem) */
    if ('IntersectionObserver' in w) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (x) { if (x.isIntersecting && root.getAttribute('data-view') === 'lib') { spyId = x.target.id; applySpy(); } });
      }, { rootMargin: '-20% 0px -70% 0px' });
      $$('section.sec').forEach(function (s) { io.observe(s); });
    }
    /* impressão: abre todos os dispositivos */
    var was = [];
    w.addEventListener('beforeprint', function () { was = $$('details.disp').filter(function (d) { return !d.open; }); was.forEach(function (d) { d.open = true; }); });
    w.addEventListener('afterprint', function () { was.forEach(function (d) { d.open = false; }); was = []; });
  }

  /* ---------------------------------------------------------------- diálogos */
  function openGloss(key) {
    var g = U.glByKey(key); if (!g) return;
    var dlg = $('#gloss-dlg'), links = '';
    $('#gloss-dlg-t').innerHTML = esc(g.t) + (g.n ? '<small>' + esc(g.n) + '</small>' : '');
    if (g.ref && PDI.normas[g.ref]) {
      var n = PDI.normas[g.ref], u = U.officialUrl(g.ref);
      links = '<p class="glinks">' + (n.card ? '<a class="lnk-s" href="#' + n.card + '">Ver ' + esc(n.nome) + ' na biblioteca</a>' : '') + (u ? '<a class="lnk-s ext" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">Texto oficial<span class="sr-only"> (abre em nova aba)</span></a>' : '') + '</p>';
    }
    $('#gloss-dlg-b').innerHTML = '<p>' + esc(g.d) + '</p>' + links + '<p class="muted small">Definição didática. O sentido jurídico está no texto oficial.</p>';
    var a = $('#gloss-dlg-a'); a.setAttribute('href', '#/glossario/' + key);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  function openPrefs() {
    var dlg = $('#prefs-dlg'), st = S.get(), n = Object.keys(st.progress).length;
    $('#prefs-dlg-b').innerHTML =
      '<p>O progresso, as respostas, as marcações dos checklists, o último ponto acessado e as preferências ficam salvos <b>somente neste navegador</b> (' + esc(S.adapterName()) + '). Não há login. ' + (S.ok() ? '' : '<b>O navegador bloqueou o armazenamento: os dados valem apenas nesta sessão.</b>') + '</p>' +
      '<p class="muted small">Neste momento: ' + n + ' aula(s) iniciada(s), ' + st.attempts.length + ' resultado(s) de questões. Se você limpar os dados do navegador, o progresso será perdido. Exporte uma cópia para guardar ou levar a outro computador.</p>' +
      '<div class="row"><button type="button" class="btn-s" id="pf-exp">Exportar progresso (JSON)</button><label class="btn-s filebtn">Importar progresso<input type="file" id="pf-imp" accept="application/json,.json" class="sr-only"></label><button type="button" class="btn-s danger" id="pf-clr">Limpar todos os dados</button></div>' +
      '<p id="pf-msg" class="muted small" role="status" aria-live="polite"></p>';
    var msg = $('#pf-msg');
    $('#pf-exp').addEventListener('click', function () {
      var blob = new Blob([S.exportJSON()], { type: 'application/json' }), a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'progresso-base-normativa-pdi.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      msg.textContent = 'Arquivo gerado.';
    });
    $('#pf-imp').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      if (f.size > 2000000) { msg.textContent = 'Arquivo grande demais.'; return; }
      var rd = new FileReader(); rd.onload = function () { var r = S.importJSON(String(rd.result)); msg.textContent = r.ok ? 'Progresso importado.' : r.erro; if (r.ok) render({ keepFocus: true }); }; rd.readAsText(f);
    });
    var clr = $('#pf-clr');
    clr.addEventListener('click', function () {
      if (clr.getAttribute('data-sure') !== '1') { clr.setAttribute('data-sure', '1'); clr.textContent = 'Confirmar: apagar tudo'; msg.textContent = 'Esta ação apaga o progresso e as respostas deste navegador e não pode ser desfeita.'; return; }
      S.reset(); clr.removeAttribute('data-sure'); clr.textContent = 'Limpar todos os dados'; msg.textContent = 'Dados apagados.'; render({ keepFocus: true });
    });
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }

  /* ---------------------------------------------------------------- inicialização */
  function init() {
    viewApp = $('#view-app'); viewLib = $('#view-lib'); live = $('#live'); sideEl = $('#side'); stage = $('.stage');
    try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) { /* ignora */ }
    initTheme(); initLibrary();

    $('#side-toggle').addEventListener('click', toggleSide);
    $('#side-scrim').addEventListener('click', function () { setDrawer(false); $('#side-toggle').focus(); });
    mqMobile.addEventListener ? mqMobile.addEventListener('change', syncToggle) : mqMobile.addListener(syncToggle);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.getAttribute('data-drawer') === 'open') { setDrawer(false); $('#side-toggle').focus(); }
    });

    /* delegações globais */
    document.addEventListener('click', function (e) {
      var gl = e.target.closest('.gl'); if (gl) { openGloss(gl.getAttribute('data-g')); return; }
      var hl = e.target.closest('a[data-hl]'); if (hl) pendingHl = hl.getAttribute('data-hl');
      var tb = e.target.closest('.strail button'); if (tb) { S.setPref('trilha', tb.getAttribute('data-trilha')); render({ keepFocus: true }); var nb = $('.strail button[data-trilha="' + tb.getAttribute('data-trilha') + '"]'); nb && nb.focus(); announce('Trilha: ' + V.TRILHA_NOME[tb.getAttribute('data-trilha')]); return; }
      var mo = e.target.closest('#mode-aprender, #mode-consultar, [data-swap]');
      if (mo) { var tgt = mo.getAttribute('href'); if (memo[tgt] !== undefined) pendingRestore = memo[tgt]; }
      var dlg = e.target.closest('dialog a[href^="#"]'); if (dlg) dlg.closest('dialog').close();
      if (mqMobile.matches && e.target.closest('#side a[href]')) { root.removeAttribute('data-drawer'); }
    });
    $('#side').addEventListener('toggle', function (e) { var d = e.target; if (d.matches && d.matches('details.smod')) openMods[d.getAttribute('data-m')] = d.open; }, true);
    var sp = 0;
    w.addEventListener('scroll', function () { if (sp) return; sp = requestAnimationFrame(function () { sp = 0; memo[location.hash || '#/aprender'] = w.pageYOffset; }); }, { passive: true });

    /* busca */
    var form = $('#search-form'), q = $('#q'), deb;
    form.addEventListener('submit', function (e) { e.preventDefault(); var v = q.value.trim(); location.hash = '#/busca' + (v ? '/' + encodeURIComponent(v) : ''); });
    q.addEventListener('input', function () {
      clearTimeout(deb);
      deb = setTimeout(function () { if (cur.name !== 'busca') return; var v = q.value.trim(); history.replaceState(null, '', '#/busca' + (v ? '/' + encodeURIComponent(v) : '')); render({ keepFocus: true }); }, 300);
    });
    q.addEventListener('keydown', function (e) { if (e.key === 'Escape' && q.value) { q.value = ''; e.preventDefault(); if (cur.name === 'busca') { history.replaceState(null, '', '#/busca'); render({ keepFocus: true }); } } });

    $('#prefs-btn').addEventListener('click', openPrefs);
    S.onChange(function () { rebuildSoon(); });
    w.addEventListener('hashchange', function (e) {
      var previous = new URL(e.oldURL).hash || '#/aprender';
      memo[previous] = w.pageYOffset;
      var next = location.hash || '#/aprender';
      pendingRestore = memo[next] !== undefined ? memo[next] : null;
      render();
    });
    PDI.App = { render: render, announce: announce, openPrefs: openPrefs, openGloss: openGloss };
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(window);
