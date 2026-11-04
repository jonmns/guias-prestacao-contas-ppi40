/* Licoes, modulos, progresso, trilhas, menu lateral, breadcrumbs e roteamento por ancora. */
(function () {
  'use strict';
  var PPI = window.PPI, $ = PPI.$, $$ = PPI.$$, el = PPI.el, D = window.PPI_DATA;
  var N = PPI.nav = { sections: [], lessons: [], mode: 'quick', current: null, progress: {}, secById: {}, lesById: {} };
  var KEY = PPI.KEY;
  var topOffset = function () { return (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h')) || 56) + (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ctx-h')) || 46); };

  /* ---------- construcao das licoes ---------- */
  function buildLessons() {
    $$('main section.sec').forEach(function (sec) {
      var mod = D.modules.filter(function (m) { return m.id === sec.dataset.module; })[0];
      var header = sec.querySelector(':scope > header');
      var S = { id: sec.id, el: sec, title: PPI.text(sec.querySelector('h2')), num: PPI.text(sec.querySelector('.eyebrow b') || ''), module: mod, lessons: [] };
      N.sections.push(S); N.secById[S.id] = S;
      var nodes = Array.prototype.slice.call(sec.childNodes).filter(function (n) { return n !== header; });
      var groups = [], cur = { title: null, h3: null, nodes: [] };
      nodes.forEach(function (n) {
        if (n.nodeType === 1 && n.tagName === 'H3') { groups.push(cur); cur = { title: PPI.text(n), h3: n, nodes: [n] }; } else cur.nodes.push(n);
      });
      groups.push(cur);
      groups = groups.filter(function (g) { return g.h3 || g.nodes.some(function (n) { return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()); }); });
      var multi = groups.length > 1;
      groups.forEach(function (g, i) {
        var lesson = el('div', { class: 'lesson' });
        var id = multi ? (S.id + '--' + (g.h3 ? PPI.slug(g.title) : 'visao-geral')) : S.id;
        if (multi) lesson.id = id;
        lesson.dataset.lesson = id;
        var title = g.title || (multi ? 'Visão geral' : S.title);
        g.nodes.forEach(function (n) { lesson.appendChild(n); });
        sec.appendChild(lesson);
        var L = { id: id, el: lesson, section: S, title: title, kind: multi ? (g.h3 ? 'lesson' : 'intro') : 'section', index: i, multi: multi };
        addLessonHead(L, g.h3);
        S.lessons.push(L); N.lessons.push(L); N.lesById[id] = L;
      });
    });
  }

  function doneBtn(L) {
    var b = el('button', { type: 'button', class: 'btn sm done-btn', 'aria-pressed': 'false', on: { click: function () { toggleDone(L.id); } } });
    b.appendChild(PPI.icon('check')); b.appendChild(el('span', { class: 'lbl-d', text: 'Marcar como concluída' }));
    b.setAttribute('data-for', L.id);
    return b;
  }
  function addLessonHead(L, h3) {
    var btn = doneBtn(L); L.btn = btn;
    if (h3) {
      var lh = el('div', { class: 'lh' }); h3.parentNode.insertBefore(lh, h3); lh.appendChild(h3); lh.appendChild(btn);
    } else {
      var only = el('div', { class: 'lh lh-only' }, [btn]); L.el.insertBefore(only, L.el.firstChild);
    }
  }

  /* acrescenta licoes de exercicios ao final das secoes que os possuem */
  function addPractice() {
    Object.keys(D.exercises || {}).forEach(function (sid) {
      var S = N.secById[sid]; if (!S) return;
      var multi = S.lessons.length > 1;
      /* secao com licao unica passa a ter duas: converte o id da licao original */
      if (!multi) {
        var first = S.lessons[0]; delete N.lesById[first.id];
        first.id = sid + '--conteudo'; first.el.id = first.id; first.el.dataset.lesson = first.id; first.multi = true; first.title = 'Conteúdo'; first.kind = 'intro';
        N.lesById[first.id] = first; first.btn.setAttribute('data-for', first.id);
        first.el.parentNode.classList.add('has-practice');
        /* titulo visivel para a licao de conteudo */
        var only = first.el.querySelector(':scope > .lh.lh-only');
        if (only) { only.classList.remove('lh-only'); only.insertBefore(el('h3', { text: 'Conteúdo da seção' }), only.firstChild); }
      }
      var lesson = el('div', { class: 'lesson lesson-practice', id: sid + '--praticar' });
      lesson.dataset.lesson = sid + '--praticar';
      var h3 = el('h3', { text: 'Praticar: exercícios da seção' });
      var lh = el('div', { class: 'lh' }, [h3]); lesson.appendChild(lh);
      var holder = el('div', { class: 'practice' }); lesson.appendChild(holder);
      S.el.appendChild(lesson);
      var L = { id: sid + '--praticar', el: lesson, section: S, title: 'Praticar: exercícios', kind: 'practice', index: S.lessons.length, multi: true };
      var b = doneBtn(L); L.btn = b; lh.appendChild(b);
      S.lessons.push(L); N.lessons.push(L); N.lesById[L.id] = L;
      PPI.exercises.render(holder, sid);
    });
  }

  function addPagers() {
    N.lessons.forEach(function (L) {
      var p = el('nav', { class: 'pager', 'aria-label': 'Navegação entre lições' });
      var prev = el('button', { type: 'button', class: 'btn', 'data-dir': '-1' }), next = el('button', { type: 'button', class: 'btn primary', 'data-dir': '1' });
      prev.addEventListener('click', function () { step(-1, L); }); next.addEventListener('click', function () { markDone(L.id, true); step(1, L); });
      p.appendChild(prev); p.appendChild(next); L.el.appendChild(p); L.pager = { prev: prev, next: next };
    });
  }
  function updatePagers() {
    var list = visible();
    N.lessons.forEach(function (L) {
      var i = list.indexOf(L), pv = list[i - 1], nx = list[i + 1];
      L.pager.prev.hidden = !pv; L.pager.next.hidden = false;
      if (pv) L.pager.prev.innerHTML = '<span><span class="lbl-t">Anterior</span>← ' + PPI.esc(pv.title) + '</span>';
      L.pager.next.innerHTML = nx ? '<span><span class="lbl-t">Concluir e ir para</span>' + PPI.esc(nx.title) + ' →</span>' : '<span>Concluir esta lição</span>';
      L.pager.next.disabled = false;
    });
  }

  function beginners() {
    Object.keys(D.beginner).forEach(function (sid) {
      var S = N.secById[sid]; if (!S) return;
      var L = S.lessons[0];
      var box = el('aside', { class: 'beginner only-learn', 'aria-label': 'Orientação para quem está começando' }, [el('strong', { text: 'Para quem está começando' }), el('p', { text: D.beginner[sid] })]);
      var anchor = L.el.querySelector(':scope > .lh'); L.el.insertBefore(box, anchor ? anchor.nextSibling : L.el.firstChild);
    });
  }

  /* ---------- progresso ---------- */
  function loadProgress() { N.progress = PPI.storage.get(KEY.progress, {}) || {}; }
  function isDone(id) { return !!N.progress[id]; }
  function markDone(id, v) { if (v) N.progress[id] = new Date().toISOString().slice(0, 10); else delete N.progress[id]; PPI.storage.set(KEY.progress, N.progress); refreshProgress(); }
  function toggleDone(id) { var v = !isDone(id); markDone(id, v); PPI.announce(v ? 'Lição marcada como concluída' : 'Marcação de conclusão removida'); }
  function counts(secs) {
    var d = 0, t = 0; secs.forEach(function (S) { S.lessons.forEach(function (L) { t++; if (isDone(L.id)) d++; }); }); return { done: d, total: t };
  }
  function refreshProgress() {
    N.lessons.forEach(function (L) {
      var d = isDone(L.id);
      L.el.classList.toggle('is-done', d);
      if (L.btn) { L.btn.setAttribute('aria-pressed', d ? 'true' : 'false'); L.btn.querySelector('.lbl-d').textContent = d ? 'Concluída' : 'Marcar como concluída'; }
    });
    var all = counts(N.sections);
    if (N.ui.prog) { N.ui.prog.querySelector('.txt').textContent = all.done + ' de ' + all.total + ' lições'; N.ui.prog.querySelector('.bar i').style.width = (all.total ? all.done / all.total * 100 : 0) + '%'; N.ui.prog.setAttribute('aria-label', 'Progresso: ' + all.done + ' de ' + all.total + ' lições concluídas. Abrir detalhes'); }
    if (N.ui.sbMods) D.modules.forEach(function (m) {
      var c = counts(m.sections.map(function (s) { return N.secById[s]; })), n = N.ui.sbMods[m.id];
      if (n) { n.count.textContent = c.done + '/' + c.total; n.count.classList.toggle('full', c.done === c.total && c.total > 0); }
    });
    $$('.sb-les > a, .sb-sec > a').forEach(function (a) { var t = a.querySelector('.tick'); if (!t) return; var L = N.lesById[a.dataset.les]; var S = N.secById[a.dataset.sec]; var d = L ? isDone(L.id) : (S && S.lessons.every(function (x) { return isDone(x.id); })); t.classList.toggle('on', !!d); });
    PPI.bus.emit('progress');
  }

  /* ---------- modos e visibilidade ---------- */
  function pathSections() { return D.paths.fix.sections; }
  function visible() {
    if (N.mode === 'fix') return N.lessons.filter(function (L) { return pathSections().indexOf(L.section.id) > -1; });
    return N.lessons;
  }
  function setMode(m, opts) {
    opts = opts || {};
    if (!D.paths[m]) m = 'quick';
    N.mode = m; document.body.dataset.mode = m;
    N.sections.forEach(function (S) { S.el.classList.toggle('in-path', m !== 'fix' || pathSections().indexOf(S.id) > -1); });
    $$('.path').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.path === m ? 'true' : 'false'); });
    PPI.storage.set(KEY.mode, m);
    if (m === 'learn') { var L = N.lesById[N.current] || nextIncomplete() || N.lessons[0]; showLesson(L, true); }
    else { N.sections.forEach(function (S) { S.el.classList.remove('is-current'); }); N.lessons.forEach(function (L) { L.el.classList.remove('is-current'); }); }
    updatePagers(); syncNav();
    if (!opts.silent) {
      PPI.announce('Trilha: ' + D.paths[m].label);
      if (m === 'fix') go('erros'); else if (m === 'quick') { /* mantem a posicao */ } else window.scrollTo({ top: $('.shell').offsetTop - topOffset() + 8, behavior: PPI.reducedMotion() ? 'auto' : 'smooth' });
    }
  }
  function nextIncomplete() { for (var i = 0; i < N.lessons.length; i++) if (!isDone(N.lessons[i].id)) return N.lessons[i]; return null; }
  function showLesson(L, noScroll) {
    N.current = L.id;
    N.sections.forEach(function (S) { S.el.classList.toggle('is-current', S === L.section); });
    N.lessons.forEach(function (x) { x.el.classList.toggle('is-current', x === L); });
    PPI.storage.set(KEY.last, L.id);
    syncNav();
  }

  /* ---------- navegacao ---------- */
  function resolve(target) {
    if (!target) return null;
    if (typeof target !== 'string') return target;
    return document.getElementById(target) || $('[data-lesson="' + target + '"]');
  }
  function reveal(node) {
    PPI.bus.emit('reveal', node);
    for (var d = node.parentElement; d; d = d.parentElement) if (d.tagName === 'DETAILS' && !d.open) d.open = true;
    var sec = node.closest('section.sec'); if (!sec) return;
    var S = N.secById[sec.id];
    if (N.mode === 'fix' && S && pathSections().indexOf(S.id) < 0) setMode('quick', { silent: true });
    if (N.mode === 'learn') {
      var le = node.closest('.lesson'), L = le && N.lesById[le.dataset.lesson];
      if (!L && S) L = S.lessons[0];
      if (L) showLesson(L);
    }
  }
  function go(target, opts) {
    opts = opts || {};
    var node = resolve(target); if (!node) return false;
    reveal(node);
    var y = node.getBoundingClientRect().top + window.pageYOffset - topOffset() - 12;
    if (N.mode === 'learn') { var sec = node.closest('section.sec'); if (sec && (node === sec || node.classList.contains('lesson'))) y = sec.getBoundingClientRect().top + window.pageYOffset - topOffset() - 12; }
    window.scrollTo({ top: Math.max(0, y), behavior: (PPI.reducedMotion() || opts.instant) ? 'auto' : 'smooth' });
    if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex', '-1');
    setTimeout(function () { try { node.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }, 60);
    if (opts.flash) { node.classList.remove('flash'); void node.offsetWidth; node.classList.add('flash'); setTimeout(function () { node.classList.remove('flash'); }, 2000); }
    setTimeout(syncNav, 120);
    return true;
  }
  function step(dir, from) {
    var list = visible(), cur = from || locate().lesson, i = Math.max(0, list.indexOf(cur)) + dir;
    if (i < 0 || i >= list.length) { if (dir > 0) PPI.toast('Você chegou ao fim das lições desta trilha.', 'ok'); return; }
    go(list[i].id === list[i].section.id ? list[i].section.id : list[i].id, { instant: N.mode === 'learn' });
  }
  function locate() {
    if (N.mode === 'learn') { var L = N.lesById[N.current] || N.lessons[0]; return { lesson: L, section: L.section }; }
    var off = topOffset() + 40, best = null;
    var list = visible();
    for (var i = 0; i < list.length; i++) {
      var r = list[i].el.getBoundingClientRect();
      if (r.height === 0) continue;
      if (r.top <= off) best = list[i]; else break;
    }
    best = best || list[0]; return { lesson: best, section: best.section };
  }

  /* ---------- menu lateral, breadcrumbs, contexto ---------- */
  function buildSidebar() {
    var aside = el('aside', { class: 'sidebar', id: 'sidebar', 'aria-label': 'Menu do manual' });
    var nav = el('nav', { 'aria-label': 'Módulos e seções' });
    aside.appendChild(el('div', { class: 'sb-h' }, [el('div', { class: 'eyebrow', text: 'Módulos' })]));
    N.ui.sbMods = {};
    D.modules.forEach(function (m, mi) {
      var wrap = el('div', { class: 'sb-mod' });
      var sub = el('ul', { class: 'sb-sub', id: 'sbm-' + m.id });
      var count = el('span', { class: 'sb-count' });
      var btn = el('button', { type: 'button', class: 'sb-mod-btn', 'aria-expanded': 'false', 'aria-controls': 'sbm-' + m.id }, [
        (function () { var c = PPI.icon('chev'); c.setAttribute('class', 'chev'); return c; })(),
        el('span', { style: 'flex:1;min-width:0' }, [el('b', { text: (mi + 1) + '. ' + m.title }), el('small', { text: m.sub })]), count]);
      btn.addEventListener('click', function () { toggleMod(m.id); });
      wrap.appendChild(el('div', { class: 'sb-mod-h' }, [btn]));
      m.sections.forEach(function (sid) {
        var S = N.secById[sid]; var li = el('li', { class: 'sb-sec' });
        var a = el('a', { href: '#' + sid, 'data-sec': sid }, [el('span', { class: 'tick' }), el('span', { class: 'n', text: S.num }), el('span', { text: S.title.length > 60 ? S.title.slice(0, 58) + '…' : S.title })]);
        a.querySelector('.tick').appendChild(PPI.icon('check'));
        li.appendChild(a);
        if (S.lessons.length > 1) {
          var ul = el('ul', { class: 'sb-les-list', 'data-for': sid });
          S.lessons.forEach(function (L) {
            var t = el('span', { class: 'tick' }); t.appendChild(PPI.icon('check'));
            ul.appendChild(el('li', { class: 'sb-les' }, [el('a', { href: '#' + L.id, 'data-les': L.id }, [t, el('span', { text: L.title })])]));
          });
          li.appendChild(ul);
        }
        sub.appendChild(li);
      });
      sub.hidden = true; wrap.appendChild(sub); nav.appendChild(wrap);
      N.ui.sbMods[m.id] = { btn: btn, sub: sub, count: count };
    });
    aside.appendChild(nav);
    aside.appendChild(el('div', { class: 'sb-foot' }, [el('a', { href: '../index.html', text: '← Voltar à página inicial dos manuais' })]));
    $('#shell').insertBefore(aside, $('#shell').firstChild);
    N.ui.sidebar = aside;
  }
  function toggleMod(id, force) {
    var m = N.ui.sbMods[id]; var open = force == null ? m.btn.getAttribute('aria-expanded') !== 'true' : force;
    m.btn.setAttribute('aria-expanded', open ? 'true' : 'false'); m.sub.hidden = !open;
  }
  function buildContext() {
    var bar = el('div', { class: 'ctxbar', id: 'ctxbar' });
    var crumbs = el('nav', { class: 'crumbs', 'aria-label': 'Onde você está' }, [el('ol')]);
    var prev = el('button', { type: 'button', class: 'btn sm', 'aria-label': 'Lição anterior', on: { click: function () { step(-1); } } }, [PPI.icon('left'), el('span', { text: 'Anterior' })]);
    var next = el('button', { type: 'button', class: 'btn sm', 'aria-label': 'Próxima lição', on: { click: function () { step(1); } } }, [el('span', { text: 'Próxima' }), PPI.icon('right')]);
    [prev, next].forEach(function (b) { b.querySelector('svg').setAttribute('width', 14); b.querySelector('svg').setAttribute('height', 14); });
    var prog = el('button', { type: 'button', class: 'ctx-prog', on: { click: openProgress } }, [el('span', { class: 'txt' }), el('span', { class: 'bar', 'aria-hidden': 'true' }, [el('i')])]);
    bar.appendChild(el('div', { class: 'ctx-in' }, [crumbs, el('div', { class: 'ctx-nav' }, [prev, next]), prog]));
    bar.appendChild(el('div', { class: 'scrollbar', id: 'scrollbar', 'aria-hidden': 'true' }));
    bar.style.position = 'sticky';
    $('#topbar').after(bar);
    N.ui.crumbs = crumbs.firstChild; N.ui.prog = prog; N.ui.prev = prev; N.ui.next = next;
  }
  function syncNav() {
    if (!N.ui.crumbs) return;
    var loc = locate(), L = loc.lesson, S = loc.section, M = S.module;
    var items = [['Manual', '#resumo'], [M.title, '#' + M.sections[0]], [S.title.length > 48 ? S.title.slice(0, 46) + '…' : S.title, '#' + S.id]];
    if (S.lessons.length > 1) items.push([L.title.length > 48 ? L.title.slice(0, 46) + '…' : L.title, null]);
    N.ui.crumbs.innerHTML = '';
    items.forEach(function (it, i) { var li = el('li'); if (it[1] && i < items.length - 1) li.appendChild(el('a', { href: it[1], text: it[0] })); else { li.textContent = it[0]; li.setAttribute('aria-current', 'location'); } N.ui.crumbs.appendChild(li); });
    $$('.sb-sec > a, .sb-les > a').forEach(function (a) { a.removeAttribute('aria-current'); });
    var sa = $('.sb-sec > a[data-sec="' + S.id + '"]'); if (sa) sa.setAttribute('aria-current', 'location');
    var la = $('.sb-les > a[data-les="' + L.id + '"]'); if (la) la.setAttribute('aria-current', 'location');
    $$('.sb-les-list').forEach(function (u) { u.hidden = u.dataset.for !== S.id; });
    toggleMod(M.id, true);
    var list = visible(), i = list.indexOf(L);
    N.ui.prev.disabled = i <= 0; N.ui.next.disabled = i >= list.length - 1;
    N.ui.prev.setAttribute('aria-disabled', N.ui.prev.disabled); N.ui.next.setAttribute('aria-disabled', N.ui.next.disabled);
    N.loc = loc;
  }

  function openProgress() {
    var body = el('div'); var all = counts(N.sections);
    body.appendChild(el('p', { text: 'Você concluiu ' + all.done + ' de ' + all.total + ' lições.' }));
    D.modules.forEach(function (m, mi) {
      var c = counts(m.sections.map(function (s) { return N.secById[s]; }));
      var row = el('div', { class: 'qz-score' }, [el('span', { text: (mi + 1) + '. ' + m.title }), el('span', { class: 'bar', 'aria-hidden': 'true' }, [el('i', { style: 'width:' + (c.total ? c.done / c.total * 100 : 0) + '%' })]), el('span', { text: c.done + '/' + c.total })]);
      body.appendChild(row);
    });
    body.appendChild(el('p', { class: 'nature-note', text: PPI.storage.ok ? 'O progresso fica salvo apenas neste navegador e neste dispositivo. Ele não é sincronizado entre dispositivos nem enviado a nenhum servidor.' : 'Este navegador bloqueou o armazenamento local. O progresso vale só até fechar a página.' }));
    var cont = el('button', { type: 'button', class: 'btn primary', text: 'Continuar de onde parei', on: { click: function () { dlg.close(); resume(); } } });
    var reset = el('button', { type: 'button', class: 'btn danger', text: 'Zerar progresso', on: { click: function () {
      PPI.confirm({ title: 'Zerar progresso?', message: 'As marcações de lições concluídas serão apagadas deste navegador. Os exercícios e os checklists não serão afetados.', confirmLabel: 'Zerar progresso', danger: true }).then(function (ok) { if (ok) { N.progress = {}; PPI.storage.set(KEY.progress, N.progress); refreshProgress(); dlg.close(); PPI.toast('Progresso zerado.'); } });
    } } });
    var dlg = PPI.dialog({ title: 'Seu progresso', body: body, footer: [reset, cont], onClose: function () { setTimeout(function () { dlg.destroy(); }, 50); } });
    dlg.open();
  }
  function resume() {
    var L = N.lesById[PPI.storage.get(KEY.last, null)] || nextIncomplete() || N.lessons[0];
    if (N.mode === 'fix') setMode('quick', { silent: true });
    go(L.id === L.section.id ? L.section.id : L.id);
  }

  /* ---------- trilhas ---------- */
  function buildPaths() {
    var box = el('div', { class: 'paths-box' });
    box.appendChild(el('div', { class: 'paths-h' }, [el('h2', { id: 'paths-h', text: 'Como você quer usar o manual?' }), el('p', { text: 'Escolha uma trilha. Todo o conteúdo continua disponível pelo menu e pela busca.' })]));
    var grid = el('div', { class: 'path-grid', role: 'group', 'aria-labelledby': 'paths-h' });
    var meta = { learn: 'Começar pelo módulo 1 →', quick: 'Ver tudo em uma página →', fix: 'Abrir o diagnóstico →' };
    Object.keys(D.paths).forEach(function (k) {
      var b = el('button', { type: 'button', class: 'path', 'data-path': k, 'aria-pressed': 'false', on: { click: function () { setMode(k); } } }, [el('b', { text: D.paths[k].label }), el('span', { text: D.paths[k].hint }), el('span', { class: 'go', text: meta[k] })]);
      grid.appendChild(b);
    });
    box.appendChild(grid);
    var res = el('div', { class: 'resume' }, [el('button', { type: 'button', class: 'btn sm', text: 'Continuar de onde parei', on: { click: resume } }), el('button', { type: 'button', class: 'btn sm', id: 'open-progress', text: 'Ver meu progresso', on: { click: openProgress } })]);
    box.appendChild(res);
    var wrap = el('section', { class: 'paths', 'aria-labelledby': 'paths-h' }, [box]);
    $('.shell').before(wrap);
  }

  /* ---------- topbar ---------- */
  function buildTopbar() {
    var tb = $('#topbar');
    var menu = el('button', { type: 'button', class: 'tb-btn tb-menu', id: 'menu-btn', 'aria-expanded': 'false', 'aria-controls': 'sidebar', 'aria-label': 'Abrir menu do manual' }, [PPI.icon('menu'), el('span', { class: 't', text: 'Menu' })]);
    tb.insertBefore(menu, tb.firstChild);
    tb.appendChild(el('span', { class: 'tb-spacer' }));
    var s = el('button', { type: 'button', class: 'tb-btn tb-search', id: 'open-search', 'aria-label': 'Buscar no manual', 'aria-keyshortcuts': '/ Control+K' }, [PPI.icon('search'), el('span', { class: 't', text: 'Buscar rubricas, células, fórmulas, erros…' }), el('kbd', { text: '/' })]);
    var g = el('button', { type: 'button', class: 'tb-btn', id: 'open-glossary', 'aria-label': 'Abrir glossário' }, [PPI.icon('book'), el('span', { class: 't', text: 'Glossário' })]);
    var th = el('button', { type: 'button', class: 'tb-btn', id: 'theme-btn', 'aria-pressed': 'false', 'aria-label': 'Alternar entre modo claro e escuro' });
    tb.appendChild(s); tb.appendChild(g); tb.appendChild(th);
    var scrim = el('div', { class: 'scrim', hidden: true, on: { click: function () { closeMenu(); } } }); document.body.appendChild(scrim);
    N.ui.scrim = scrim; N.ui.menu = menu;
    menu.addEventListener('click', function () { var open = N.ui.sidebar.classList.toggle('open'); scrim.hidden = !open; menu.setAttribute('aria-expanded', open); if (open) { var a = N.ui.sidebar.querySelector('[aria-current], .sb-mod-btn'); a && a.focus(); } });
    /* tema */
    var root = document.documentElement, mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    function cur() { var t = root.getAttribute('data-theme'); return t || (mq && mq.matches ? 'dark' : 'light'); }
    function paint() { var d = cur() === 'dark'; th.setAttribute('aria-pressed', d); th.innerHTML = ''; th.appendChild(PPI.icon(d ? 'sun' : 'moon')); th.appendChild(el('span', { class: 't', text: d ? 'Modo claro' : 'Modo escuro' })); }
    th.addEventListener('click', function () { var n = cur() === 'dark' ? 'light' : 'dark'; root.setAttribute('data-theme', n); try { localStorage.setItem(KEY.theme, n); } catch (e) { /* ignore */ } paint(); });
    if (mq && mq.addEventListener) mq.addEventListener('change', paint);
    paint();
  }
  function closeMenu() { N.ui.sidebar.classList.remove('open'); N.ui.scrim.hidden = true; N.ui.menu.setAttribute('aria-expanded', 'false'); }

  /* ---------- eventos globais ---------- */
  function wire() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      var id = decodeURIComponent(a.getAttribute('href').slice(1)); if (!id) return;
      if (!resolve(id)) return;
      e.preventDefault();
      if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
      go(id); if (a.closest('#sidebar')) closeMenu();
    });
    window.addEventListener('hashchange', function () { var id = decodeURIComponent(location.hash.slice(1)); if (id) go(id, { instant: true }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && N.ui.sidebar.classList.contains('open')) { closeMenu(); N.ui.menu.focus(); }
      var t = e.target, typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
      if (typing || e.altKey || e.ctrlKey || e.metaKey || document.querySelector('dialog[open]')) return;
      if (e.key === '[' ) step(-1); else if (e.key === ']') step(1);
    });
    var tick = false;
    window.addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        tick = false;
        var h = document.documentElement.scrollHeight - window.innerHeight, sb = $('#scrollbar');
        if (sb) sb.style.width = (h > 0 ? Math.min(100, window.pageYOffset / h * 100) : 0) + '%';
        if (N.mode !== 'learn') syncNav();
      });
    }, { passive: true });
    window.addEventListener('resize', PPI.debounce(function () { if (window.innerWidth > 1100) closeMenu(); }, 150));
  }

  N.init = function () {
    N.ui = {};
    buildLessons(); addPractice(); addPagers(); beginners();
    loadProgress();
    buildTopbar(); buildContext(); buildSidebar(); buildPaths();
    wire();
    var saved = PPI.storage.get(KEY.mode, 'quick');
    N.current = PPI.storage.get(KEY.last, null);
    setMode(saved, { silent: true });
    refreshProgress(); updatePagers(); syncNav();
    if (!PPI.storage.ok) $('.paths-box').appendChild(el('p', { class: 'nature-note', text: 'Aviso: este navegador bloqueou o armazenamento local. Progresso e checklists não serão salvos entre visitas.' }));
    if (location.hash.length > 1) { var id = decodeURIComponent(location.hash.slice(1)); setTimeout(function () { go(id, { instant: true }); }, 80); }
  };
  N.go = go; N.setMode = setMode; N.markDone = markDone; N.isDone = isDone; N.resume = resume; N.openProgress = openProgress; N.step = step;
})();
