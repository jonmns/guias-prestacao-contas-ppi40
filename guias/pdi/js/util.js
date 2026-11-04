/* Utilitários compartilhados: texto, glossário, registro de normas, progresso e busca. */
(function (w) {
  'use strict';
  var PDI = w.PDI = w.PDI || {};
  var U = PDI.U = {};

  U.NAT = { legal: 'Exigência legal', contratual: 'Obrigação contratual', interno: 'Procedimento interno', recom: 'Recomendação operacional' };
  U.TRILHA = { comum: 'Conteúdo comum', ppi: 'Trilha PPI 4.0', conv: 'Trilha convênio direto' };
  U.STATUS = { pendente: 'Pendente', andamento: 'Em andamento', concluida: 'Concluída' };

  U.$ = function (s, r) { return (r || document).querySelector(s); };
  U.$$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  U.esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };

  /* minúsculas sem acento, para comparar e buscar */
  U.fold = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  U.plain = function (html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent || ''; };

  /* ---------------- glossário ---------------- */
  var glIdx = null;
  function buildGl() {
    glIdx = {};
    (PDI.glossario || []).forEach(function (g) {
      glIdx[U.fold(g.t)] = g;
      (g.a || []).forEach(function (a) { glIdx[U.fold(U.plain(a))] = g; });
    });
  }
  U.gloss = function (k) { if (!glIdx) buildGl(); return glIdx[U.fold(k)] || null; };
  U.glKey = function (g) { return U.fold(g.t).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
  U.glByKey = function (key) { var r = null; (PDI.glossario || []).forEach(function (g) { if (U.glKey(g) === key) r = g; }); return r; };

  /* ---------------- normas ---------------- */
  U.officialUrl = function (id) {
    var n = PDI.normas && PDI.normas[id]; if (!n) return null;
    if (n.url) return n.url;
    if (n.semLink) return null;
    var card = n.card && document.getElementById(n.card);
    var a = card && card.querySelector('a.btn-off[href^="http"]');
    return a ? a.getAttribute('href') : null;
  };
  U.normaNome = function (id) { var n = PDI.normas && PDI.normas[id]; return n ? n.nome : id; };

  /* ---------------- texto rico ---------------- */
  U.rich = function (s) {
    s = String(s).replace(/&(?![a-zA-Z#0-9]+;)/g, '&amp;');
    s = s.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, function (_, k, l) {
      var g = U.gloss(k);
      return g ? '<button type="button" class="gl" data-g="' + U.glKey(g) + '" aria-haspopup="dialog">' + (l || k) + '</button>' : (l || k);
    });
    s = s.replace(/\{\{([^}|]+)\|([^}]+)\}\}/g, function (_, id, l) {
      var n = PDI.normas && PDI.normas[id];
      return n && n.card ? '<a class="nl" href="#' + n.card + '" data-lib="' + id + '">' + l + '</a>' : l;
    });
    s = s.replace(/\(\((legal|contratual|interno|recom)\)\)/g, function (_, n) { return '<span class="nat ' + n + '">' + U.NAT[n] + '</span>'; });
    return s;
  };

  /* ---------------- progresso ---------------- */
  U.aulasVis = function (trilha) {
    return (PDI.aulas || []).filter(function (a) { return trilha === 'todas' || a.trilha === 'comum' || a.trilha === trilha; });
  };
  U.aula = function (id) { var r = null; (PDI.aulas || []).forEach(function (a) { if (a.id === id) r = a; }); return r; };
  U.stats = function (list) {
    var S = PDI.Store, done = 0, doing = 0;
    list.forEach(function (a) { var s = S.status(a.id); if (s === 'concluida') done++; else if (s === 'andamento') doing++; });
    return { total: list.length, done: done, doing: doing, pend: list.length - done - doing, pct: list.length ? Math.round(done * 100 / list.length) : 0 };
  };
  U.scoreInfo = function (id) {
    var at = PDI.Store.attempts(id);
    if (!at.length) return null;
    var best = 0; at.forEach(function (x) { best = Math.max(best, Math.round(x.score * 100 / x.total)); });
    var last = at[at.length - 1];
    return { n: at.length, best: best, last: Math.round(last.score * 100 / last.total), lastTs: last.ts };
  };
  U.fmtDate = function (ts) {
    if (!ts) return '';
    try { return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch (e) { return ''; }
  };
  /* Próxima aula a continuar: a última aberta, se ainda em andamento; senão a primeira não concluída. */
  U.continuar = function (trilha) {
    var S = PDI.Store, list = U.aulasVis(trilha), last = S.get().last;
    if (last && last.aula && list.some(function (a) { return a.id === last.aula; }) && S.status(last.aula) === 'andamento') return { aula: U.aula(last.aula), retomar: true, sec: last.sec };
    var from = 0;
    if (last && last.aula) list.forEach(function (a, i) { if (a.id === last.aula) from = i + 1; });
    for (var k = 0; k < list.length; k++) { var a = list[(from + k) % list.length]; if (S.status(a.id) !== 'concluida') return { aula: a, retomar: false }; }
    return null;
  };

  /* ---------------- busca ---------------- */
  /* Extrai os números de artigo de uma célula como "Arts. 16 a 21 e Anexo I" ou "Art. 22, §§ 3º e 13". */
  U.parseArts = function (k) {
    if (!/^arts?\./i.test(k)) return [];
    var s = k.replace(/^arts?\.\s*/i, '').split(/§|caput|anexo/i)[0], out = [], m, re = /(\d+)º?(?:\s*a\s*(\d+)º?)?/g;
    while ((m = re.exec(s))) {
      var a = +m[1], b = m[2] ? +m[2] : a;
      if (b - a > 60) b = a;
      for (var i = a; i <= b; i++) out.push(i);
    }
    return out;
  };

  var index = null;
  U.buildIndex = function () {
    var out = { normas: [], outros: [], aulas: [], gloss: [] }, $ = U.$, $$ = U.$$;
    $$('.norm').forEach(function (n) {
      var rows = $$('tbody tr', n).map(function (tr) {
        var k = tr.cells[0] ? tr.cells[0].textContent.trim() : '', v = tr.cells[1] ? tr.cells[1].textContent.trim() : '';
        return { k: k, v: v, arts: U.parseArts(k), f: U.fold(k + ' ' + v) };
      });
      var titulo = $('h3', n).textContent.trim(), org = ($('.norg', n) || {}).textContent || '';
      var corpo = $$('.nf p, .nbox, .note', n).map(function (x) { return x.textContent; }).join(' ');
      out.normas.push({ id: n.id, mod: n.getAttribute('data-mod') || '', titulo: titulo, org: org.trim(), rows: rows,
        fT: U.fold(titulo + ' ' + org), fB: U.fold(corpo) });
    });
    $$('article.man').forEach(function (n) {
      out.outros.push({ id: n.id, tipo: 'Manual', mod: n.getAttribute('data-mod') || '', titulo: $('h4', n).textContent.trim(), corpo: ($('p', n) || {}).textContent || '' });
    });
    $$('#cuidados .care').forEach(function (n, i) {
      out.outros.push({ id: 'cuidados', tipo: 'Cuidado de leitura', mod: '', titulo: $('h4', n).textContent.trim(), corpo: ($('p', n) || {}).textContent || '' });
    });
    $$('#rotina tbody tr, #atualizacoes tbody tr').forEach(function (tr) {
      var sec = tr.closest('section').id;
      out.outros.push({ id: sec, tipo: sec === 'rotina' ? 'Da norma à rotina' : 'Atualização a acompanhar', mod: '', titulo: tr.cells[0].textContent.trim(), corpo: [].slice.call(tr.cells, 1).map(function (c) { return c.textContent; }).join(' ') });
    });
    out.outros.forEach(function (o) { o.fT = U.fold(o.titulo); o.fB = U.fold(o.corpo); });
    (PDI.aulas || []).forEach(function (a) {
      var corpo = [a.objetivo].concat(a.explicacao, [a.exemplo], (a.resumo || [])).map(U.plain).join(' ');
      out.aulas.push({ a: a, fT: U.fold(a.titulo), fB: U.fold(corpo) });
    });
    (PDI.glossario || []).forEach(function (g) { out.gloss.push({ g: g, fT: U.fold(g.t + ' ' + (g.n || '') + ' ' + (g.a || []).join(' ')), fB: U.fold(g.d) }); });
    index = out; return out;
  };
  U.index = function () { return index || U.buildIndex(); };
  U.resetIndex = function () { index = null; };

  U.parseQuery = function (q) {
    var raw = U.fold(q).trim(), arts = [];
    raw = raw.replace(/\bart(?:igo|s|igos)?\.?\s*(\d+)/g, function (_, n) { arts.push(+n); return ' '; });
    var toks = raw.split(/[^a-z0-9]+/).filter(function (t) { return t.length > 0 && t !== 'de' && t !== 'da' && t !== 'do'; });
    return { toks: toks, arts: arts, vazio: !toks.length && !arts.length };
  };
  function all(text, toks) { return toks.every(function (t) { return text.indexOf(t) >= 0; }); }

  U.search = function (q, mod) {
    var P = U.parseQuery(q), ix = U.index(), res = { normas: [], outros: [], aulas: [], gloss: [], P: P };
    if (P.vazio) return res;
    var okMod = function (m) { return !mod || mod === 'all' || !m || m.split(' ').indexOf(mod) >= 0; };
    ix.normas.forEach(function (n) {
      if (!okMod(n.mod)) return;
      var rowsHit = n.rows.filter(function (r) {
        var artOk = !P.arts.length || P.arts.some(function (a) { return r.arts.indexOf(a) >= 0; });
        return artOk && (all(r.f, P.toks) || (P.toks.length && all(U.fold(n.titulo) + ' ' + r.f, P.toks)));
      });
      var docTxt = n.fT + ' ' + n.fB + ' ' + n.rows.map(function (r) { return r.f; }).join(' ');
      var docOk = all(docTxt, P.toks);
      var artDoc = !P.arts.length || n.rows.some(function (r) { return P.arts.some(function (a) { return r.arts.indexOf(a) >= 0; }); });
      if (!(docOk && artDoc) && !rowsHit.length) return;
      var sc = (all(n.fT, P.toks) ? 6 : 0) + rowsHit.length * 3 + (all(n.fB, P.toks) ? 2 : 0) + 1;
      if (P.arts.length && !rowsHit.length) return;
      res.normas.push({ n: n, rows: rowsHit.slice(0, 8), mais: Math.max(0, rowsHit.length - 8), score: sc });
    });
    ix.outros.forEach(function (o) {
      if (!okMod(o.mod) || P.arts.length) return;
      if (all(o.fT + ' ' + o.fB, P.toks)) res.outros.push({ o: o, score: (all(o.fT, P.toks) ? 4 : 1) });
    });
    ix.aulas.forEach(function (x) {
      var a = x.a;
      if (mod === 'ppi' && a.trilha === 'conv') return;
      if (mod === 'conv' && a.trilha === 'ppi') return;
      if (mod === 'trans' && a.trilha !== 'comum') return;
      if (P.arts.length) return;
      if (all(x.fT + ' ' + x.fB, P.toks)) res.aulas.push({ a: a, score: (all(x.fT, P.toks) ? 4 : 1) });
    });
    ix.gloss.forEach(function (x) {
      if (P.arts.length) return;
      if (all(x.fT + ' ' + x.fB, P.toks)) res.gloss.push({ g: x.g, score: (all(x.fT, P.toks) ? 4 : 1) });
    });
    ['normas', 'outros', 'aulas', 'gloss'].forEach(function (k) { res[k].sort(function (a, b) { return b.score - a.score; }); });
    return res;
  };

  /* realça os termos da busca em um texto simples já escapado */
  U.mark = function (text, toks) {
    var t = U.esc(text);
    if (!toks || !toks.length) return t;
    var f = U.fold(text), spans = [];
    toks.forEach(function (tk) { var i = 0; while ((i = f.indexOf(tk, i)) >= 0) { spans.push([i, i + tk.length]); i += tk.length; } });
    if (!spans.length) return t;
    spans.sort(function (a, b) { return a[0] - b[0]; });
    var merged = [spans[0]];
    for (var i = 1; i < spans.length; i++) { var l = merged[merged.length - 1]; if (spans[i][0] <= l[1]) l[1] = Math.max(l[1], spans[i][1]); else merged.push(spans[i]); }
    var out = '', pos = 0;
    /* a normalização NFD pode alterar o comprimento; só realça se os comprimentos coincidem */
    if (f.length !== text.length) return t;
    merged.forEach(function (m) { out += U.esc(text.slice(pos, m[0])) + '<mark>' + U.esc(text.slice(m[0], m[1])) + '</mark>'; pos = m[1]; });
    return out + U.esc(text.slice(pos));
  };
})(window);
