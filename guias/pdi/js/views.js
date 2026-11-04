/* Telas do modo Aprender e das ferramentas. Cada tela devolve { title, html, after(root) }. */
(function (w) {
  'use strict';
  var PDI = w.PDI, U = PDI.U, S = PDI.Store, $ = U.$, $$ = U.$$, esc = U.esc, rich = U.rich;
  var V = PDI.Views = {};

  var ICON_EXT = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function pbar(pct, label) {
    return '<div class="pbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="' + esc(label) + '"><i style="width:' + pct + '%"></i></div>';
  }
  function stPill(id) { var s = S.status(id); return '<span class="st ' + s + '"><i aria-hidden="true"></i>' + U.STATUS[s] + '</span>'; }
  function natChip(n) { return '<span class="nat ' + n + '">' + U.NAT[n] + '</span>'; }
  function trilhaTag(t) { return '<span class="ttag ' + t + '">' + U.TRILHA[t] + '</span>'; }
  function libLink(id, label) {
    var n = PDI.normas[id]; if (!n || !n.card) return '';
    return '<a class="lnk-s" href="#' + n.card + '" data-lib="' + id + '">' + (label || 'Ver na biblioteca') + '</a>';
  }
  function offLink(id) {
    var u = U.officialUrl(id);
    return u ? '<a class="lnk-s ext" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">Texto oficial ' + ICON_EXT + '<span class="sr-only"> (abre em nova aba)</span></a>' : '<span class="lnk-s off">Sem link público verificado</span>';
  }
  var TRILHAS = [['todas', 'Todas as aulas', 'Conteúdo comum e das duas modalidades.'], ['ppi', 'Trilha PPI 4.0', 'Conteúdo comum e específico do programa prioritário.'], ['conv', 'Trilha convênio direto', 'Conteúdo comum e específico do convênio com ICT.']];
  var TRILHA_NOME = { todas: 'Todas as aulas', ppi: 'Trilha PPI 4.0', conv: 'Trilha convênio direto' };
  V.TRILHA_NOME = TRILHA_NOME;

  /* =============================================================== INÍCIO */
  V.home = function () {
    var tr = S.get().prefs.trilha, list = U.aulasVis(tr), st = U.stats(list), cont = U.continuar(tr);
    var att = S.attempts(), media = att.length ? Math.round(att.reduce(function (s, x) { return s + x.score * 100 / x.total; }, 0) / att.length) : null;
    var first = !S.get().last && !att.length && !st.done;

    var contHtml;
    if (cont) {
      var a = cont.aula, href = '#/aula/' + a.id + (cont.sec ? '/' + cont.sec : '');
      contHtml = '<section class="cont" aria-labelledby="cont-t"><div><p class="eyebrow" id="cont-t">' + (cont.retomar ? 'Continuar estudando' : (first ? 'Comece por aqui' : 'Próxima aula')) + '</p>' +
        '<h2>' + esc(a.titulo) + '</h2><p class="muted">Módulo ' + a.mod + ' · ' + a.tempo + ' · ' + U.TRILHA[a.trilha] + '</p></div>' +
        '<a class="btn" href="' + href + '">' + (cont.retomar ? 'Continuar aula' : (first ? 'Começar' : 'Abrir aula')) + '<span class="sr-only">: ' + esc(a.titulo) + '</span></a></section>';
    } else {
      contHtml = '<section class="cont ok" aria-labelledby="cont-t"><div><p class="eyebrow" id="cont-t">Trilha concluída</p><h2>Você concluiu todas as aulas desta trilha</h2><p class="muted">Use a revisão geral ou veja o seu desempenho para decidir o que estudar de novo.</p></div><a class="btn" href="#/aula/m8a2">Revisão geral</a></section>';
    }

    var trilhas = TRILHAS.map(function (t) {
      var l = U.aulasVis(t[0]), s = U.stats(l), on = tr === t[0];
      return '<button type="button" class="trcard" data-trilha="' + t[0] + '" aria-pressed="' + on + '"><b>' + t[1] + '</b><span>' + t[2] + '</span>' +
        '<span class="trn">' + s.done + ' de ' + s.total + ' aulas concluídas</span>' + pbar(s.pct, 'Progresso: ' + t[1]) + '</button>';
    }).join('');

    var mods = PDI.modulos.map(function (m) {
      var l = list.filter(function (a) { return a.mod === m.n; }), s = U.stats(l);
      if (!l.length) return '';
      return '<article class="mcard"><p class="eyebrow">Módulo ' + m.n + '</p><h3><a href="#/modulo/' + m.n + '">' + esc(m.titulo) + '</a></h3><p class="muted">' + esc(m.resumo) + '</p>' +
        '<p class="trn">' + s.done + ' de ' + s.total + ' aula' + (s.total > 1 ? 's' : '') + (s.doing ? ' · ' + s.doing + ' em andamento' : '') + '</p>' + pbar(s.pct, 'Progresso do módulo ' + m.n) + '</article>';
    }).join('');

    var tools = [['#/glossario', 'Glossário', 'Termos e siglas com definição e norma de origem.'], ['#/mapa', 'Mapa normativo', 'Relações entre leis, decretos, resoluções e manuais.'],
      ['#/comparar', 'Comparar modalidades', 'PPI 4.0 e convênio direto lado a lado.'], ['#/checklists', 'Checklists', 'Roteiros operacionais por atividade.'],
      ['#/aula/m8a1', 'Estudos de caso', 'RH, rateio, conciliação, despesas, documentação e prestação de contas.'], ['#/desempenho', 'Meu desempenho', 'Resultados, histórico e aulas para revisar.']]
      .map(function (t) { return '<a class="tool" href="' + t[0] + '"><b>' + t[1] + '</b><span>' + t[2] + '</span></a>'; }).join('');

    var html = '<div class="pg"><header class="pg-h"><p class="eyebrow">Aprender</p><h1 id="view-title" tabindex="-1">Base normativa de PD&amp;I: aprenda e consulte</h1>' +
      '<p class="lead">Oito módulos progressivos sobre a Lei de Informática, o PPI 4.0 e o convênio direto, com exercícios e links para os textos oficiais. Se você já conhece o tema, vá direto à <a href="#/consultar">biblioteca normativa</a>.</p></header>' +
      contHtml +
      '<section aria-labelledby="prog-t" class="prog"><h2 id="prog-t">Seu progresso</h2><div class="kpis2">' +
      '<div><b>' + st.done + '</b><span>concluídas</span></div><div><b>' + st.doing + '</b><span>em andamento</span></div><div><b>' + st.pend + '</b><span>pendentes</span></div><div><b>' + (media === null ? '–' : media + '%') + '</b><span>média nas questões</span></div></div>' +
      pbar(st.pct, 'Progresso na ' + TRILHA_NOME[tr]) + '<p class="muted small">' + st.pct + '% da ' + TRILHA_NOME[tr].toLowerCase() + '. ' + (S.ok() ? 'Os dados ficam salvos neste navegador.' : 'O navegador bloqueou o armazenamento. O progresso vale só nesta sessão.') + '</p></section>' +
      '<section aria-labelledby="tr-t"><h2 id="tr-t">Escolha a trilha</h2><div class="trgrid">' + trilhas + '</div></section>' +
      '<section aria-labelledby="mod-t"><h2 id="mod-t">Módulos</h2><div class="mgrid">' + mods + '</div></section>' +
      '<section aria-labelledby="tool-t"><h2 id="tool-t">Ferramentas</h2><div class="toolgrid">' + tools + '</div></section></div>';

    return { title: 'Aprender', html: html, after: function (root) {
      $$('.trcard', root).forEach(function (b) { b.addEventListener('click', function () { S.setPref('trilha', b.getAttribute('data-trilha')); PDI.App.render({ keepFocus: true }); PDI.App.announce('Trilha selecionada: ' + TRILHA_NOME[b.getAttribute('data-trilha')]); var nb = $('.trcard[data-trilha="' + b.getAttribute('data-trilha') + '"]'); nb && nb.focus(); }); });
    } };
  };

  /* =============================================================== MÓDULO */
  V.modulo = function (n) {
    var m = PDI.modulos.filter(function (x) { return x.n === +n; })[0];
    if (!m) return V.naoEncontrado();
    var tr = S.get().prefs.trilha, list = U.aulasVis(tr).filter(function (a) { return a.mod === m.n; }), s = U.stats(list);
    var items = list.map(function (a, i) {
      var sc = U.scoreInfo(a.id);
      return '<li class="aitem"><div><h3><a href="#/aula/' + a.id + '">' + esc(a.titulo) + '</a></h3><p class="muted small">' + a.tempo + ' · ' + trilhaTag(a.trilha) + (sc ? ' · melhor resultado ' + sc.best + '%' : '') + '</p><p>' + esc(a.objetivo) + '</p></div><div class="aside">' + stPill(a.id) + '<a class="btn-s" href="#/aula/' + a.id + '">' + (S.status(a.id) === 'concluida' ? 'Revisar' : (S.status(a.id) === 'andamento' ? 'Continuar' : 'Abrir')) + '<span class="sr-only">: ' + esc(a.titulo) + '</span></a></div></li>';
    }).join('');
    var prev = m.n > 1 ? '<a href="#/modulo/' + (m.n - 1) + '">← Módulo ' + (m.n - 1) + '</a>' : '<span></span>';
    var next = m.n < PDI.modulos.length ? '<a href="#/modulo/' + (m.n + 1) + '">Módulo ' + (m.n + 1) + ' →</a>' : '<span></span>';
    return { title: 'Módulo ' + m.n + ': ' + m.titulo, html: '<div class="pg"><nav class="crumb" aria-label="Você está em"><a href="#/aprender">Aprender</a><span aria-hidden="true">/</span><span aria-current="page">Módulo ' + m.n + '</span></nav>' +
      '<header class="pg-h"><p class="eyebrow">Módulo ' + m.n + ' de ' + PDI.modulos.length + '</p><h1 id="view-title" tabindex="-1">' + esc(m.titulo) + '</h1><p class="lead">' + esc(m.resumo) + '</p><p class="muted small">Exibindo a ' + TRILHA_NOME[tr].toLowerCase() + '. Mude a trilha na <a href="#/aprender">página inicial</a>.</p>' + pbar(s.pct, 'Progresso do módulo') + '</header>' +
      '<ol class="alist">' + items + '</ol><div class="pager">' + prev + next + '</div></div>' };
  };

  /* =============================================================== AULA */
  var SECS = [['objetivo', 'Objetivo'], ['explicacao', 'Explicação'], ['conceitos', 'Conceitos e siglas'], ['base', 'Fundamentação'], ['exemplo', 'Exemplo na rotina'], ['pratica', 'Situação prática'], ['questoes', 'Questões'], ['resumo', 'Resumo']];

  function baseRows(a) {
    return a.base.map(function (b) {
      var id = b[0], nm = U.normaNome(id);
      return '<li class="brow">' + natChip(b[2]) + '<div><b>' + esc(nm) + '</b><span class="disp">' + esc(b[1]) + '</span></div><div class="blinks">' + libLink(id) + offLink(id) + '</div></li>';
    }).join('');
  }

  function quizHtml(a) {
    var st = S.quiz(a.id), total = a.quiz.length;
    return a.quiz.map(function (q, i) {
      var ans = st.answers[i];
      var opts = q.o.map(function (t, j) {
        return '<label class="opt"><input type="radio" name="q' + i + '" value="' + j + '"' + (ans && ans.c === j ? ' checked' : '') + (ans ? ' disabled' : '') + '><span class="optt"><b>' + 'ABCDEF'.charAt(j) + ')</b> ' + rich(t) + '<span class="optm"></span></span></label>';
      }).join('');
      return '<fieldset class="q" data-i="' + i + '"><legend><span class="qn">Questão ' + (i + 1) + ' de ' + total + '</span>' + (q.caso ? '<span class="ttag caso">Caso: ' + esc(q.caso) + '</span>' : '') + '<span class="qt">' + rich(q.q) + '</span></legend>' + opts +
        '<div class="qa"><button type="button" class="btn-s" data-act="check"' + (ans ? ' hidden' : '') + '>Responder</button></div><div class="fb" role="status" aria-live="polite"></div></fieldset>';
    }).join('') + '<div class="qsum" id="qsum" role="status" aria-live="polite"></div>';
  }

  V.aula = function (id, sec) {
    var a = U.aula(id); if (!a) return V.naoEncontrado();
    var m = PDI.modulos.filter(function (x) { return x.n === a.mod; })[0];
    var all = U.aulasVis(S.get().prefs.trilha); if (all.indexOf(a) < 0) all = PDI.aulas.slice();
    var ix = all.indexOf(a), prev = all[ix - 1], next = all[ix + 1];
    S.visit(id);

    var conc = a.conceitos.map(function (c) {
      var g = U.gloss(c[0]);
      return '<div class="conc"><h3>' + (g ? '<button type="button" class="gl" data-g="' + U.glKey(g) + '" aria-haspopup="dialog">' + esc(c[0]) + '</button>' : esc(c[0])) + (g && g.n ? '<small>' + esc(g.n) + '</small>' : '') + '</h3>' +
        (g ? '<p class="def">' + esc(g.d) + '</p>' : '') + '<p class="ctx"><b>Nesta aula:</b> ' + rich(c[1]) + '</p></div>';
    }).join('');

    var nav = SECS.map(function (s) { return '<li><a href="#/aula/' + id + '/' + s[0] + '" data-sec="' + s[0] + '">' + s[1] + '</a></li>'; }).join('');
    var html = '<div class="pg lesson"><nav class="crumb" aria-label="Você está em"><a href="#/aprender">Aprender</a><span aria-hidden="true">/</span><a href="#/modulo/' + a.mod + '">Módulo ' + a.mod + '</a><span aria-hidden="true">/</span><span aria-current="page">Aula</span></nav>' +
      '<header class="pg-h"><p class="eyebrow">Módulo ' + a.mod + ': ' + esc(m.titulo) + '</p><h1 id="view-title" tabindex="-1">' + esc(a.titulo) + '</h1><p class="meta">' + trilhaTag(a.trilha) + '<span>' + a.tempo + '</span><span id="lstatus">' + stPill(id) + '</span></p></header>' +
      '<nav class="lnav" aria-label="Nesta aula"><p class="eyebrow">Nesta aula</p><ol>' + nav + '</ol></nav>' +
      '<section class="lsec" id="s-objetivo" data-sec="objetivo" aria-labelledby="h-objetivo"><h2 id="h-objetivo">Objetivo de aprendizagem</h2><p class="obj">' + rich(a.objetivo) + '</p></section>' +
      '<section class="lsec" id="s-explicacao" data-sec="explicacao" aria-labelledby="h-explicacao"><h2 id="h-explicacao">Explicação</h2>' + a.explicacao.map(function (p) { return '<p>' + rich(p) + '</p>'; }).join('') + '</section>' +
      '<section class="lsec" id="s-conceitos" data-sec="conceitos" aria-labelledby="h-conceitos"><h2 id="h-conceitos">Conceitos e siglas</h2><div class="concgrid">' + conc + '</div></section>' +
      '<section class="lsec" id="s-base" data-sec="base" aria-labelledby="h-base"><h2 id="h-base">Fundamentação normativa</h2><p class="muted small">Confira sempre o texto oficial antes de citar um dispositivo em documento.</p><ul class="blist">' + baseRows(a) + '</ul></section>' +
      '<section class="lsec" id="s-exemplo" data-sec="exemplo" aria-labelledby="h-exemplo"><h2 id="h-exemplo">Exemplo na rotina de uma executora</h2><div class="exbox"><p>' + rich(a.exemplo) + '</p></div></section>' +
      '<section class="lsec" id="s-pratica" data-sec="pratica" aria-labelledby="h-pratica"><h2 id="h-pratica">Situação prática</h2><p class="sit">' + rich(a.pratica.situacao) + '</p><details class="resp"' + (S.praticaSeen(id) ? ' open' : '') + '><summary>Ver resposta sugerida</summary><p>' + rich(a.pratica.resposta) + '</p></details></section>' +
      '<section class="lsec" id="s-questoes" data-sec="questoes" aria-labelledby="h-questoes"><h2 id="h-questoes" tabindex="-1">Questões</h2><p class="muted small">Escolha uma alternativa e use o botão Responder. A correção aparece na hora, com a explicação.</p>' + quizHtml(a) + '</section>' +
      '<section class="lsec" id="s-resumo" data-sec="resumo" aria-labelledby="h-resumo"><h2 id="h-resumo">Resumo dos pontos essenciais</h2><ul class="sumlist">' + a.resumo.map(function (r) { return '<li>' + rich(r) + '</li>'; }).join('') + '</ul></section>' +
      '<section class="lact" id="lact" aria-labelledby="h-fim"><h2 id="h-fim" class="sr-only">Concluir e continuar</h2><div id="lact-in"></div></section>' +
      '<div class="pager">' + (prev ? '<a href="#/aula/' + prev.id + '">← ' + esc(prev.titulo) + '</a>' : '<span></span>') + (next ? '<a href="#/aula/' + next.id + '">' + esc(next.titulo) + ' →</a>' : '<span></span>') + '</div></div>';

    return { title: a.titulo, html: html, sec: sec, after: function (root) {
      var total = a.quiz.length;

      function paintQ(fs, i, ans) {
        var q = a.quiz[i];
        $$('.opt', fs).forEach(function (lab, j) {
          var inp = $('input', lab), m = $('.optm', lab);
          lab.classList.remove('correct', 'wrong'); m.textContent = '';
          inp.disabled = true;
          if (j === q.c) { lab.classList.add('correct'); m.textContent = ' Alternativa correta'; }
          if (ans.c === j && j !== q.c) { lab.classList.add('wrong'); m.textContent = ' Sua resposta (incorreta)'; }
          if (ans.c === j && j === q.c) m.textContent = ' Sua resposta (correta)';
        });
        var fb = $('.fb', fs);
        fb.className = 'fb show ' + (ans.ok ? 'ok' : 'bad');
        fb.innerHTML = '<p class="fb-h">' + (ans.ok ? 'Resposta correta.' : 'Resposta incorreta. A alternativa correta é a ' + 'ABCDEF'.charAt(q.c) + '.') + '</p><p>' + rich(q.f) + '</p>';
        $('[data-act="check"]', fs).hidden = true;
      }
      function summary() {
        var st = S.quiz(id), n = Object.keys(st.answers).length, box = $('#qsum', root);
        if (st.done) {
          var ok = Object.keys(st.answers).filter(function (k) { return st.answers[k].ok; }).length;
          box.innerHTML = '<p><b>Resultado: ' + ok + ' de ' + total + ' (' + Math.round(ok * 100 / total) + '%).</b> ' + (ok === total ? 'Todas corretas.' : 'Releia o resumo e refaça as questões para fixar o conteúdo.') + '</p><button type="button" class="btn-s" data-act="refazer">Refazer questões</button>';
        } else box.innerHTML = n ? '<p class="muted">Respondidas: ' + n + ' de ' + total + '.</p>' : '';
      }
      function actions() {
        var st = S.quiz(id), done = !!st.done, concl = S.status(id) === 'concluida', box = $('#lact-in', root);
        var navNext = next ? '<a class="btn" href="#/aula/' + next.id + '">Próxima aula<span class="sr-only">: ' + esc(next.titulo) + '</span></a>' : '<a class="btn" href="#/desempenho">Ver meu desempenho</a>';
        if (concl) {
          box.innerHTML = '<div class="done"><p><b>Aula concluída.</b> Você pode seguir adiante ou revisar o conteúdo.</p><div class="row">' + navNext + '<button type="button" class="btn-s" data-act="revisar">Revisar esta aula</button>' + (done ? '<button type="button" class="btn-s" data-act="refazer">Refazer questões</button>' : '') + '</div></div>';
        } else {
          box.innerHTML = '<div class="todo"><button type="button" class="btn" data-act="concluir"' + (done ? '' : ' disabled aria-describedby="concl-hint"') + '>Concluir aula</button>' + (done ? '' : '<p class="muted small" id="concl-hint">Responda a todas as questões para concluir a aula.</p>') + '</div>';
        }
        $('#lstatus', root).innerHTML = stPill(id);
      }

      a.quiz.forEach(function (q, i) { var ans = S.quiz(id).answers[i]; if (ans) paintQ($('.q[data-i="' + i + '"]', root), i, ans); });
      summary(); actions();

      root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-act]'); if (!b || !root.contains(b)) return;
        var act = b.getAttribute('data-act');
        if (act === 'check') {
          var fs = b.closest('.q'), i = +fs.getAttribute('data-i'), sel = $('input:checked', fs), fb = $('.fb', fs);
          if (!sel) { fb.className = 'fb show warn'; fb.innerHTML = '<p>Escolha uma alternativa antes de responder.</p>'; return; }
          var c = +sel.value, ok = c === a.quiz[i].c;
          S.answer(id, i, c, ok, total);
          paintQ(fs, i, { c: c, ok: ok }); summary(); actions();
        } else if (act === 'concluir') {
          S.complete(id); actions(); PDI.App.announce('Aula concluída.');
          var nb = $('#lact-in .btn', root); nb && nb.focus();
        } else if (act === 'revisar') {
          S.reopen(id); actions(); PDI.App.announce('Aula reaberta para revisão.'); w.scrollTo({ top: 0, behavior: 'instant' }); var h = $('#view-title'); h && h.focus({ preventScroll: true });
        } else if (act === 'refazer') {
          S.resetQuiz(id); PDI.App.render({ keepFocus: true }); var s = $('#s-questoes'); s && s.scrollIntoView({ behavior: 'instant' }); var hq = $('#h-questoes'); hq && hq.focus({ preventScroll: true }); PDI.App.announce('Questões reiniciadas.');
        }
      });
      var det = $('.resp', root);
      det.addEventListener('toggle', function () { if (det.open) S.setPratica(id, true); });

      /* guarda a seção em que o aluno está, para "continuar de onde parou" */
      if ('IntersectionObserver' in w) {
        var timer = null, cur = null;
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (x) { if (x.isIntersecting) cur = x.target.getAttribute('data-sec'); });
          clearTimeout(timer);
          timer = setTimeout(function () { if (cur) S.setLast('#/aula/' + id, id, cur); }, 900);
        }, { rootMargin: '-15% 0px -70% 0px' });
        $$('.lsec', root).forEach(function (s) { io.observe(s); });
        root._cleanup = function () { clearTimeout(timer); io.disconnect(); };
      }
    } };
  };

  /* =============================================================== GLOSSÁRIO */
  V.glossario = function (key) {
    var list = PDI.glossario.slice().sort(function (a, b) { return a.t.localeCompare(b.t, 'pt'); });
    var letters = {}; list.forEach(function (g) { letters[U.fold(g.t).charAt(0).toUpperCase()] = 1; });
    var citedBy = function (g) { return PDI.aulas.filter(function (a) { return a.conceitos.some(function (c) { var x = U.gloss(c[0]); return x === g; }); }); };
    var items = list.map(function (g) {
      var k = U.glKey(g), aulas = citedBy(g).slice(0, 3);
      var links = (g.ref ? libLink(g.ref, 'Ver na biblioteca') + offLink(g.ref) : '') + aulas.map(function (a) { return '<a class="lnk-s" href="#/aula/' + a.id + '">Aula: ' + esc(a.titulo) + '</a>'; }).join('');
      return '<div class="ge" id="g-' + k + '" data-f="' + esc(U.fold(g.t + ' ' + (g.n || '') + ' ' + g.d + ' ' + (g.a || []).join(' '))) + '" data-l="' + U.fold(g.t).charAt(0).toUpperCase() + '"><dt>' + esc(g.t) + (g.n ? '<small>' + esc(g.n) + '</small>' : '') + '</dt><dd><p>' + esc(g.d) + '</p>' + (links ? '<p class="glinks">' + links + '</p>' : '') + '</dd></div>';
    }).join('');
    var az = Object.keys(letters).sort().map(function (l) { return '<button type="button" class="chip" data-letra="' + l + '" aria-pressed="false">' + l + '</button>'; }).join('');
    var html = '<div class="pg"><header class="pg-h"><p class="eyebrow">Ferramenta</p><h1 id="view-title" tabindex="-1">Glossário de termos e siglas</h1><p class="lead">Definições didáticas para ler as normas com mais segurança. O sentido jurídico está no texto oficial de cada norma.</p></header>' +
      '<div class="gtools"><label for="gl-q" class="lbl">Filtrar termos</label><input id="gl-q" type="search" class="inp" placeholder="Digite um termo, sigla ou assunto" autocomplete="off"><div class="chips" role="group" aria-label="Filtrar por letra">' + az + '</div><p class="muted small" id="gl-count" role="status" aria-live="polite"></p></div>' +
      '<dl class="glist" id="glist">' + items + '</dl></div>';
    return { title: 'Glossário', html: html, after: function (root) {
      var q = $('#gl-q', root), cnt = $('#gl-count', root), letra = '';
      function apply() {
        var t = U.fold(q.value).trim(), n = 0;
        $$('.ge', root).forEach(function (e) {
          var ok = (!t || e.getAttribute('data-f').indexOf(t) >= 0) && (!letra || e.getAttribute('data-l') === letra);
          e.hidden = !ok; if (ok) n++;
        });
        cnt.textContent = n + ' de ' + list.length + ' termos';
      }
      q.addEventListener('input', apply);
      $$('.chip', root).forEach(function (c) { c.addEventListener('click', function () { var l = c.getAttribute('data-letra'); letra = letra === l ? '' : l; $$('.chip', root).forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-letra') === letra); }); apply(); }); });
      apply();
      if (key) { var el = $('#g-' + key, root); if (el) { el.classList.add('flash'); el.scrollIntoView({ block: 'center', behavior: 'instant' }); } }
    } };
  };

  /* =============================================================== MAPA NORMATIVO */
  V.mapa = function (sel) {
    var M = PDI.mapa, byId = {}; M.nos.forEach(function (n) { byId[n.id] = n; });
    var cells = {};
    M.nos.forEach(function (n) { var k = n.linha + '|' + n.col; (cells[k] = cells[k] || []).push(n); });
    var colIdx = { conv: 2, ppi: 3, trans: 4 };
    var head = '<div class="mh"></div>' + M.colunas.map(function (c) { return '<div class="mh">' + c[1] + '</div>'; }).join('');
    var body = '';
    M.linhas.forEach(function (lbl, r) {
      body += '<div class="ml" style="grid-row:' + (r + 2) + '">' + lbl + '</div>';
      ['conv', 'ppi', 'trans', 'both'].forEach(function (c) {
        var ns = cells[r + '|' + c]; if (!ns) return;
        var gc = c === 'both' ? '2 / span 2' : colIdx[c];
        body += '<div class="mcell" style="grid-row:' + (r + 2) + ';grid-column:' + gc + '">' + ns.map(function (n) {
          return '<button type="button" class="mnode" data-id="' + n.id + '" aria-pressed="false"><b>' + esc(n.rot) + '</b><span>' + esc(n.sub) + '</span></button>';
        }).join('') + '</div>';
      });
    });
    var rel = M.arestas.map(function (e) { return '<tr><td>' + esc(byId[e[0]].rot) + '</td><td>' + esc(e[2]) + '</td><td>' + esc(byId[e[1]].rot) + '</td></tr>'; }).join('');
    var html = '<div class="pg wide"><header class="pg-h"><p class="eyebrow">Ferramenta</p><h1 id="view-title" tabindex="-1">Mapa normativo</h1><p class="lead">Leia de cima para baixo: a lei cria a obrigação, o decreto regulamenta, as normas da modalidade operacionalizam e os manuais orientam a análise. Selecione uma norma para ver as relações registradas neste guia.</p></header>' +
      '<div class="mapwrap"><div class="mapa" id="mapa" role="group" aria-label="Mapa das normas por camada e modalidade"><svg class="mlines" id="mlines" aria-hidden="true" focusable="false"><defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="currentColor"/></marker></defs></svg>' + head + body + '</div></div>' +
      '<section class="mdetail" id="mdetail" aria-live="polite" aria-labelledby="md-h"><h2 id="md-h">Detalhes</h2><p class="muted">Selecione uma norma no mapa para ver a finalidade, as relações e os links.</p></section>' +
      '<details class="acc2"><summary>Lista de todas as relações do mapa</summary><div class="tbl-wrap"><table><caption class="sr-only">Relações entre normas</caption><thead><tr><th>Norma</th><th>Relação</th><th>Norma relacionada</th></tr></thead><tbody>' + rel + '</tbody></table></div></details>' +
      '<p class="note">As relações vêm do que a própria base normativa registra (alterações, transição e fundamento). O mapa não declara vigência nem revogação.</p></div>';
    return { title: 'Mapa normativo', html: html, after: function (root) {
      var cont = $('#mapa', root), svg = $('#mlines', root), detail = $('#mdetail', root), cur = null;
      function rectIn(el) { var a = el.getBoundingClientRect(), b = cont.getBoundingClientRect(); return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height }; }
      function edgePt(r, tx, ty) {
        var cx = r.x + r.w / 2, cy = r.y + r.h / 2, dx = tx - cx, dy = ty - cy;
        var sx = dx ? (r.w / 2) / Math.abs(dx) : Infinity, sy = dy ? (r.h / 2) / Math.abs(dy) : Infinity, s = Math.min(sx, sy);
        return [cx + dx * s, cy + dy * s];
      }
      function draw() {
        $$('path.edge', svg).forEach(function (p) { p.remove(); });
        svg.setAttribute('width', cont.scrollWidth); svg.setAttribute('height', cont.scrollHeight);
        if (!cur || w.matchMedia('(max-width:860px)').matches) return;
        M.arestas.forEach(function (e) {
          if (e[0] !== cur && e[1] !== cur) return;
          var a = $('.mnode[data-id="' + e[0] + '"]', cont), b = $('.mnode[data-id="' + e[1] + '"]', cont); if (!a || !b) return;
          var ra = rectIn(a), rb = rectIn(b), ca = [ra.x + ra.w / 2, ra.y + ra.h / 2], cb = [rb.x + rb.w / 2, rb.y + rb.h / 2];
          var p1 = edgePt(ra, cb[0], cb[1]), p2 = edgePt(rb, ca[0], ca[1]);
          var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          var my = (p1[1] + p2[1]) / 2;
          path.setAttribute('d', 'M' + p1[0] + ' ' + p1[1] + ' C' + p1[0] + ' ' + my + ' ' + p2[0] + ' ' + my + ' ' + p2[0] + ' ' + p2[1]);
          path.setAttribute('class', 'edge'); path.setAttribute('marker-end', 'url(#arr)'); path.setAttribute('fill', 'none');
          svg.appendChild(path);
        });
      }
      function select(id) {
        cur = id; var n = byId[id];
        $$('.mnode', cont).forEach(function (b) { var on = b.getAttribute('data-id') === id; b.setAttribute('aria-pressed', on); b.classList.remove('rel'); });
        var rels = [];
        M.arestas.forEach(function (e) {
          if (e[0] === id) { rels.push('<li>' + esc(e[2]) + ': <button type="button" class="linkbtn" data-go="' + e[1] + '">' + esc(byId[e[1]].rot) + '</button></li>'); $('.mnode[data-id="' + e[1] + '"]', cont).classList.add('rel'); }
          if (e[1] === id) { rels.push('<li><button type="button" class="linkbtn" data-go="' + e[0] + '">' + esc(byId[e[0]].rot) + '</button> (' + esc(e[2]) + ')</li>'); $('.mnode[data-id="' + e[0] + '"]', cont).classList.add('rel'); }
        });
        var links = '';
        if (n.norma) links += libLink(n.norma, 'Ver na biblioteca');
        var u = n.url || (n.norma && U.officialUrl(n.norma));
        links += u ? '<a class="lnk-s ext" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">Texto oficial ' + ICON_EXT + '<span class="sr-only"> (abre em nova aba)</span></a>' : '<span class="lnk-s off">Sem link público verificado</span>';
        var aulas = PDI.aulas.filter(function (a) { return a.base.some(function (b) { return b[0] === id || b[0] === n.norma; }); }).slice(0, 4);
        detail.innerHTML = '<h2 id="md-h">' + esc(n.rot) + '</h2><p class="muted">' + esc(n.sub) + ' · ' + M.linhas[n.linha] + '</p><p>' + esc(n.d) + '</p>' +
          (rels.length ? '<h3>Relações</h3><ul>' + rels.join('') + '</ul>' : '<p class="muted small">Nenhuma relação direta registrada para esta norma no mapa.</p>') +
          '<p class="glinks">' + links + '</p>' + (aulas.length ? '<h3>Aulas que citam esta norma</h3><ul>' + aulas.map(function (a) { return '<li><a href="#/aula/' + a.id + '">' + esc(a.titulo) + '</a></li>'; }).join('') + '</ul>' : '');
        draw();
      }
      cont.addEventListener('click', function (e) { var b = e.target.closest('.mnode'); if (b) select(b.getAttribute('data-id')); });
      detail.addEventListener('click', function (e) { var b = e.target.closest('[data-go]'); if (b) { select(b.getAttribute('data-go')); var t = $('.mnode[data-id="' + b.getAttribute('data-go') + '"]', cont); t && t.focus(); } });
      var rt; function onR() { clearTimeout(rt); rt = setTimeout(draw, 80); }
      w.addEventListener('resize', onR);
      root._cleanup = function () { w.removeEventListener('resize', onR); };
      if (sel && byId[sel]) select(sel); else draw();
    } };
  };

  /* =============================================================== COMPARAR */
  V.comparar = function () {
    var tab = $('#modalidades table'), rows = [];
    if (tab) $$('tbody tr', tab).forEach(function (tr) { rows.push({ k: tr.cells[0].textContent.trim(), c: tr.cells[1].innerHTML, p: tr.cells[2].innerHTML }); });
    var cards = rows.map(function (r) {
      return '<article class="cmp" data-k="' + esc(r.k) + '"><h3>' + esc(r.k) + '</h3><div class="cmpcols"><div class="cc conv"><h4>Convênio direto</h4><div>' + r.c + '</div></div><div class="cc ppi"><h4>PPI 4.0</h4><div>' + r.p + '</div></div></div></article>';
    }).join('');
    var html = '<div class="pg wide"><header class="pg-h"><p class="eyebrow">Ferramenta</p><h1 id="view-title" tabindex="-1">Convênio direto e PPI 4.0 lado a lado</h1><p class="lead">Os dois caminhos nascem do mesmo art. 2º, § 4º, da Lei 8.387. Cada um tem partes, instrumento, norma operacional e prestação de contas próprios.</p></header>' +
      '<div class="flows"><div class="flow conv"><h2>Convênio direto</h2><ol class="flowline"><li>Empresa incentivada</li><li>Convênio</li><li>ICT credenciada ou pública</li></ol></div><div class="flow ppi"><h2>PPI 4.0</h2><ol class="flowline"><li>Empresa investidora</li><li>Coordenadora (CITS)</li><li>Executora</li></ol></div></div>' +
      '<fieldset class="chipset small"><legend class="sr-only">Mostrar colunas</legend><label><input type="radio" name="cmpf" value="ambos" checked><span>Ambas</span></label><label><input type="radio" name="cmpf" value="conv"><span>Só convênio direto</span></label><label><input type="radio" name="cmpf" value="ppi"><span>Só PPI 4.0</span></label></fieldset>' +
      '<div class="cmplist" id="cmplist" data-show="ambos">' + cards + '</div>' +
      '<p class="note">Fonte: seção 01 da biblioteca (Duas modalidades). Os links levam ao texto oficial. Confirme as regras no instrumento de cada projeto.</p></div>';
    return { title: 'Comparar modalidades', html: html, after: function (root) {
      $$('input[name="cmpf"]', root).forEach(function (r) { r.addEventListener('change', function () { $('#cmplist', root).setAttribute('data-show', r.value); }); });
    } };
  };

  /* =============================================================== CHECKLISTS */
  V.checklists = function (open) {
    var html = '<div class="pg"><header class="pg-h"><p class="eyebrow">Ferramenta</p><h1 id="view-title" tabindex="-1">Checklists operacionais</h1><p class="lead">Roteiros curtos por atividade. As marcações ficam salvas neste navegador. Cada item indica se é exigência legal, obrigação contratual, procedimento interno ou recomendação operacional.</p></header>' +
      '<div class="callout warn"><h4>Use como apoio</h4><p>Os itens classificados como recomendação operacional ou procedimento interno são sugestões e podem variar por instituição e por projeto. Confirme no instrumento e no manual da coordenadora.</p></div>' +
      PDI.checklists.map(function (c) {
        var ch = S.checked(c.id), n = Object.keys(ch).length;
        return '<details class="ck" id="' + c.id + '"' + (open === c.id ? ' open' : '') + '><summary><span class="ckt">' + esc(c.titulo) + '</span><span class="ckn" data-n="' + c.id + '">' + n + ' de ' + c.itens.length + '</span></summary><div class="ckb"><p class="muted">' + esc(c.desc) + '</p><ul class="ckl">' +
          c.itens.map(function (it, i) {
            var cid = c.id + '-' + i;
            return '<li><input type="checkbox" id="' + cid + '" data-c="' + c.id + '" data-i="' + i + '"' + (ch[i] ? ' checked' : '') + '><label for="' + cid + '"><span class="ckx">' + esc(it.t) + '</span> ' + natChip(it.nat) + (it.ref ? ' ' + libLink(it.ref, 'Norma') : '') + '</label></li>';
          }).join('') + '</ul><button type="button" class="btn-s" data-reset="' + c.id + '">Limpar marcações</button></div></details>';
      }).join('') + '</div>';
    return { title: 'Checklists', html: html, after: function (root) {
      root.addEventListener('change', function (e) {
        var t = e.target; if (!t.matches || !t.matches('input[type=checkbox][data-c]')) return;
        S.toggleCheck(t.getAttribute('data-c'), t.getAttribute('data-i'), t.checked); upd(t.getAttribute('data-c'));
      });
      root.addEventListener('click', function (e) { var b = e.target.closest('[data-reset]'); if (!b) return; var id = b.getAttribute('data-reset'); S.resetCheck(id); $$('input[data-c="' + id + '"]', root).forEach(function (i) { i.checked = false; }); upd(id); PDI.App.announce('Marcações limpas.'); });
      function upd(id) { var c = PDI.checklists.filter(function (x) { return x.id === id; })[0], n = Object.keys(S.checked(id)).length; $('[data-n="' + id + '"]', root).textContent = n + ' de ' + c.itens.length; }
    } };
  };

  /* =============================================================== DESEMPENHO */
  V.desempenho = function () {
    var list = PDI.aulas, att = S.attempts();
    var rows = list.map(function (a) {
      var sc = U.scoreInfo(a.id), s = S.status(a.id), q = S.quiz(a.id), n = Object.keys(q.answers).length;
      var ver = (s === 'concluida' && sc && sc.last < 70) || (sc && sc.last < 70);
      return { a: a, sc: sc, s: s, rev: ver, n: n };
    });
    var rev = rows.filter(function (r) { return r.rev; }), doing = rows.filter(function (r) { return r.s === 'andamento'; });
    var done = rows.filter(function (r) { return r.s === 'concluida'; }).length;
    var med = att.length ? Math.round(att.reduce(function (s, x) { return s + x.score * 100 / x.total; }, 0) / att.length) : null;
    var tb = rows.map(function (r) {
      return '<tr><th scope="row"><a href="#/aula/' + r.a.id + '">' + esc(r.a.titulo) + '</a><small>Módulo ' + r.a.mod + '</small></th><td>' + stPill(r.a.id) + '</td><td>' + (r.sc ? r.sc.best + '%' : '–') + '</td><td>' + (r.sc ? r.sc.last + '%' : '–') + '</td><td>' + (r.sc ? r.sc.n : 0) + '</td><td>' + (r.rev ? '<span class="st rev"><i aria-hidden="true"></i>Revisar</span>' : '') + '</td></tr>';
    }).join('');
    var hist = att.slice(-15).reverse().map(function (x) {
      var a = U.aula(x.aula); return '<li><span>' + U.fmtDate(x.ts) + '</span><a href="#/aula/' + x.aula + '">' + esc(a ? a.titulo : x.aula) + '</a><b>' + x.score + '/' + x.total + '</b></li>';
    }).join('');
    var html = '<div class="pg wide"><header class="pg-h"><p class="eyebrow">Aprender</p><h1 id="view-title" tabindex="-1">Meu desempenho</h1><p class="lead">Acompanhe o que você concluiu, os resultados das questões e o que vale revisar. Os dados ficam salvos neste navegador.</p></header>' +
      '<div class="kpis2"><div><b>' + done + ' de ' + list.length + '</b><span>aulas concluídas</span></div><div><b>' + doing.length + '</b><span>em andamento</span></div><div><b>' + att.length + '</b><span>conjuntos de questões respondidos</span></div><div><b>' + (med === null ? '–' : med + '%') + '</b><span>média de acertos</span></div></div>' +
      '<section aria-labelledby="rv-t"><h2 id="rv-t">Para revisar</h2>' + (rev.length || doing.length ? '<ul class="revl">' + rev.map(function (r) { return '<li><a href="#/aula/' + r.a.id + '">' + esc(r.a.titulo) + '</a><span class="muted">último resultado ' + r.sc.last + '%. Releia a aula e refaça as questões.</span></li>'; }).join('') + doing.filter(function (r) { return !r.rev; }).map(function (r) { return '<li><a href="#/aula/' + r.a.id + '">' + esc(r.a.titulo) + '</a><span class="muted">em andamento. Falta concluir.</span></li>'; }).join('') + '</ul>' : '<p class="muted">Nada para revisar por enquanto. Resultados abaixo de 70% e aulas em andamento aparecem aqui.</p>') + '</section>' +
      '<section aria-labelledby="ds-t"><h2 id="ds-t">Resultados por aula</h2><div class="tbl-wrap"><table class="perf"><caption class="sr-only">Situação e resultados por aula</caption><thead><tr><th>Aula</th><th>Situação</th><th>Melhor</th><th>Último</th><th>Tentativas</th><th>Revisão</th></tr></thead><tbody>' + tb + '</tbody></table></div></section>' +
      '<section aria-labelledby="hs-t"><h2 id="hs-t">Histórico recente</h2>' + (hist ? '<ol class="hist">' + hist + '</ol>' : '<p class="muted">Ainda não há questões respondidas por completo.</p>') + '</section>' +
      '<p><button type="button" class="btn-s" id="open-prefs">Exportar, importar ou limpar dados</button></p></div>';
    return { title: 'Meu desempenho', html: html, after: function (root) { $('#open-prefs', root).addEventListener('click', function () { PDI.App.openPrefs(); }); } };
  };

  /* =============================================================== BUSCA */
  V.busca = function (q) {
    var mod = S.get().prefs.mod, P = U.parseQuery(q || '');
    var filt = [['all', 'Todas'], ['ppi', 'PPI 4.0'], ['conv', 'Convênio direto'], ['trans', 'Normas transversais']].map(function (f) {
      return '<label><input type="radio" name="mod" value="' + f[0] + '"' + (mod === f[0] ? ' checked' : '') + '><span>' + f[1] + '</span></label>';
    }).join('');
    var res = U.search(q || '', mod), toks = P.toks;
    var nT = res.normas.length + res.outros.length + res.aulas.length + res.gloss.length;
    var parts = '';
    if (res.normas.length) parts += '<section aria-labelledby="r-n"><h2 id="r-n">Normas e dispositivos <span class="cnt">' + res.normas.length + '</span></h2><ul class="rlist">' + res.normas.map(function (r) {
      return '<li class="rnorm"><h3><a href="#' + r.n.id + '" data-hl="' + esc(q) + '">' + U.mark(r.n.titulo, toks) + '</a></h3><p class="muted small">' + esc(r.n.org) + '</p>' +
        (r.rows.length ? '<ul class="rrows">' + r.rows.map(function (x) { return '<li><a href="#' + r.n.id + '" data-hl="' + esc(q) + '"><b>' + U.mark(x.k, toks) + '</b></a> ' + U.mark(x.v, toks) + '</li>'; }).join('') + (r.mais ? '<li class="muted">e mais ' + r.mais + ' dispositivos na norma</li>' : '') + '</ul>' : '') + '</li>';
    }).join('') + '</ul></section>';
    if (res.outros.length) parts += '<section aria-labelledby="r-o"><h2 id="r-o">Manuais e outras seções <span class="cnt">' + res.outros.length + '</span></h2><ul class="rlist">' + res.outros.slice(0, 20).map(function (r) {
      return '<li><span class="ttag">' + esc(r.o.tipo) + '</span> <a href="#' + r.o.id + '">' + U.mark(r.o.titulo, toks) + '</a></li>';
    }).join('') + '</ul></section>';
    if (res.aulas.length) parts += '<section aria-labelledby="r-a"><h2 id="r-a">Aulas <span class="cnt">' + res.aulas.length + '</span></h2><ul class="rlist">' + res.aulas.slice(0, 20).map(function (r) {
      return '<li><a href="#/aula/' + r.a.id + '">' + U.mark(r.a.titulo, toks) + '</a> <span class="muted small">Módulo ' + r.a.mod + ' · ' + U.TRILHA[r.a.trilha] + '</span></li>';
    }).join('') + '</ul></section>';
    if (res.gloss.length) parts += '<section aria-labelledby="r-g"><h2 id="r-g">Glossário <span class="cnt">' + res.gloss.length + '</span></h2><ul class="rlist">' + res.gloss.slice(0, 20).map(function (r) {
      return '<li><a href="#/glossario/' + U.glKey(r.g) + '"><b>' + U.mark(r.g.t, toks) + '</b></a> ' + U.mark(r.g.d, toks) + '</li>';
    }).join('') + '</ul></section>';
    if (!P.vazio && !nT) parts = '<div class="callout warn"><h4>Nenhum resultado</h4><p>Tente outra palavra, o número da norma (por exemplo, 10.521) ou o artigo (por exemplo, art. 22). Se um filtro de modalidade estiver ativo, escolha “Todas”.</p></div>';
    if (P.vazio) parts = '<p class="muted">Digite no campo de busca uma norma, um artigo, um assunto ou uma palavra-chave. Exemplos: <a href="#/busca/guarda%20documental">guarda documental</a>, <a href="#/busca/art.%2022">art. 22</a>, <a href="#/busca/PUR">PUR</a>, <a href="#/busca/rateio">rateio</a>.</p>';
    var html = '<div class="pg"><header class="pg-h"><p class="eyebrow">Busca</p><h1 id="view-title" tabindex="-1">' + (P.vazio ? 'Buscar na plataforma' : 'Resultados para “' + esc(q) + '”') + '</h1>' + (P.vazio ? '' : '<p class="muted" role="status">' + nT + ' resultado' + (nT === 1 ? '' : 's') + '.</p>') + '</header>' +
      '<fieldset class="chipset" aria-label="Filtrar por modalidade"><legend class="sr-only">Modalidade</legend>' + filt + '</fieldset>' + parts + '</div>';
    return { title: P.vazio ? 'Busca' : 'Busca: ' + q, html: html, after: function (root) {
      $$('input[name="mod"]', root).forEach(function (r) { r.addEventListener('change', function () { S.setPref('mod', r.value); PDI.App.render({ keepFocus: true }); var n = $('input[name="mod"]:checked'); n && n.focus(); }); });
    } };
  };

  V.naoEncontrado = function () {
    return { title: 'Página não encontrada', html: '<div class="pg"><header class="pg-h"><h1 id="view-title" tabindex="-1">Conteúdo não encontrado</h1><p class="lead">O endereço não corresponde a uma aula ou ferramenta. Volte à <a href="#/aprender">página inicial</a> ou abra a <a href="#/consultar">biblioteca normativa</a>.</p></header></div>' };
  };
})(window);
