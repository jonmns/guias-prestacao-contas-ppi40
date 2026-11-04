/*
 * Persistência do aprendizado (PDI.Store).
 *
 * Hoje os dados ficam no localStorage do navegador, sem login. Toda leitura e escrita
 * passa por um "adaptador" com a interface { name, load(), save(state), clear() }.
 * Para integrar contas de usuário e banco de dados no futuro, basta registrar outro
 * adaptador com PDI.Store.useAdapter(meuAdaptador). O formato do estado (v1) já é um
 * JSON serializável, independente do navegador.
 *
 * Estado v1:
 *  prefs      { trilha, mod, mode }
 *  progress   { [aulaId]: { status: 'andamento'|'concluida', visits, started, completed, review } }
 *  quiz       { [aulaId]: { answers: { [i]: { c: escolha, ok: bool } }, done: bool } }
 *  pratica    { [aulaId]: true }       situação prática já revelada
 *  attempts   [ { aula, ts, score, total } ]   histórico de desempenho (máx. 300)
 *  checklists { [checklistId]: { [itemIdx]: true } }
 *  last       { aula, route, ts, sec } último ponto acessado (aula e seção)
 */
(function (w) {
  'use strict';
  var KEY = 'ppi40.pdi.v1';
  var VERSION = 1;
  var MAX_ATTEMPTS = 300;

  function empty() {
    return { v: VERSION, updated: 0, prefs: { trilha: 'todas', mod: 'all', mode: 'aprender' },
      progress: {}, quiz: {}, pratica: {}, attempts: [], checklists: {}, last: null };
  }

  /* Adaptador padrão: localStorage com cópia em memória quando o armazenamento está bloqueado. */
  function LocalAdapter() {
    var mem = null;
    return {
      name: 'localStorage',
      load: function () {
        try { var r = w.localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch (e) { /* bloqueado ou corrompido */ }
        return mem;
      },
      save: function (state) {
        mem = state;
        try { w.localStorage.setItem(KEY, JSON.stringify(state)); return true; } catch (e) { return false; }
      },
      clear: function () {
        mem = null;
        try { w.localStorage.removeItem(KEY); } catch (e) { /* ignora */ }
      }
    };
  }

  var adapter = LocalAdapter();
  var state = null;
  var listeners = [];
  var persistOk = true;

  function isObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }

  /* Aceita apenas campos conhecidos e tipos esperados (usado ao carregar e ao importar). */
  function sanitize(raw) {
    var s = empty();
    if (!isObj(raw)) return s;
    if (isObj(raw.prefs)) {
      if (['todas', 'ppi', 'conv'].indexOf(raw.prefs.trilha) >= 0) s.prefs.trilha = raw.prefs.trilha;
      if (['all', 'ppi', 'conv', 'trans'].indexOf(raw.prefs.mod) >= 0) s.prefs.mod = raw.prefs.mod;
      if (['aprender', 'consultar'].indexOf(raw.prefs.mode) >= 0) s.prefs.mode = raw.prefs.mode;
    }
    if (isObj(raw.progress)) Object.keys(raw.progress).forEach(function (id) {
      var p = raw.progress[id]; if (!isObj(p)) return;
      s.progress[id] = { status: p.status === 'concluida' ? 'concluida' : 'andamento',
        visits: +p.visits || 1, started: +p.started || 0, completed: +p.completed || 0, review: +p.review || 0 };
    });
    if (isObj(raw.quiz)) Object.keys(raw.quiz).forEach(function (id) {
      var q = raw.quiz[id]; if (!isObj(q) || !isObj(q.answers)) return;
      var out = { answers: {}, done: !!q.done };
      Object.keys(q.answers).forEach(function (i) {
        var a = q.answers[i]; if (isObj(a)) out.answers[i] = { c: +a.c, ok: !!a.ok };
      });
      s.quiz[id] = out;
    });
    if (isObj(raw.pratica)) Object.keys(raw.pratica).forEach(function (id) { if (raw.pratica[id]) s.pratica[id] = true; });
    if (Array.isArray(raw.attempts)) s.attempts = raw.attempts.filter(function (a) {
      return isObj(a) && typeof a.aula === 'string' && isFinite(a.ts) && isFinite(a.score) && isFinite(a.total);
    }).map(function (a) { return { aula: a.aula, ts: +a.ts, score: +a.score, total: +a.total }; }).slice(-MAX_ATTEMPTS);
    if (isObj(raw.checklists)) Object.keys(raw.checklists).forEach(function (id) {
      var c = raw.checklists[id]; if (!isObj(c)) return;
      s.checklists[id] = {}; Object.keys(c).forEach(function (i) { if (c[i]) s.checklists[id][i] = true; });
    });
    if (isObj(raw.last) && typeof raw.last.route === 'string') {
      s.last = { aula: typeof raw.last.aula === 'string' ? raw.last.aula : null, route: raw.last.route, ts: +raw.last.ts || 0 };
      if (typeof raw.last.sec === 'string' && /^[a-z0-9-]{1,40}$/.test(raw.last.sec)) s.last.sec = raw.last.sec;
    }
    s.updated = +raw.updated || 0;
    return s;
  }

  function ensure() { if (!state) state = sanitize(adapter.load()); return state; }
  function emit() { listeners.slice().forEach(function (fn) { try { fn(state); } catch (e) { /* ouvinte com erro não derruba os demais */ } }); }
  function commit() {
    state.updated = Date.now();
    persistOk = adapter.save(state) !== false;
    emit();
  }

  var Store = {
    VERSION: VERSION,
    get: function () { return ensure(); },
    ok: function () { return persistOk; },
    onChange: function (fn) { listeners.push(fn); },
    useAdapter: function (a) {
      if (!a || typeof a.load !== 'function' || typeof a.save !== 'function') throw new Error('Adaptador inválido');
      adapter = a; state = null; ensure(); emit();
    },
    adapterName: function () { return adapter.name || 'personalizado'; },

    setPref: function (k, v) { ensure().prefs[k] = v; commit(); },

    /* ---------------- progresso ---------------- */
    status: function (id) { var p = ensure().progress[id]; return p ? p.status : 'pendente'; },
    visit: function (id) {
      var s = ensure(), p = s.progress[id];
      if (!p) p = s.progress[id] = { status: 'andamento', visits: 0, started: Date.now(), completed: 0, review: 0 };
      p.visits++;
      s.last = { aula: id, route: '#/aula/' + id, ts: Date.now() };
      commit();
    },
    complete: function (id) {
      var s = ensure(), p = s.progress[id] || (s.progress[id] = { status: 'andamento', visits: 1, started: Date.now(), completed: 0, review: 0 });
      p.status = 'concluida'; p.completed = Date.now(); commit();
    },
    reopen: function (id) {
      var s = ensure(), p = s.progress[id]; if (!p) return;
      p.status = 'andamento'; p.review = Date.now(); commit();
    },
    setLast: function (route, aula, sec) {
      var s = ensure(); s.last = { aula: aula || null, route: route, ts: Date.now() }; if (sec) s.last.sec = sec; commit();
    },

    /* ---------------- exercícios ---------------- */
    quiz: function (id) { var q = ensure().quiz[id]; return q || { answers: {}, done: false }; },
    answer: function (id, i, choice, ok, total) {
      var s = ensure(), q = s.quiz[id] || (s.quiz[id] = { answers: {}, done: false });
      q.answers[i] = { c: choice, ok: !!ok };
      var n = Object.keys(q.answers).length;
      if (n >= total && !q.done) {
        q.done = true;
        var score = Object.keys(q.answers).filter(function (k) { return q.answers[k].ok; }).length;
        s.attempts.push({ aula: id, ts: Date.now(), score: score, total: total });
        if (s.attempts.length > MAX_ATTEMPTS) s.attempts = s.attempts.slice(-MAX_ATTEMPTS);
      }
      commit();
      return q;
    },
    resetQuiz: function (id) { var s = ensure(); delete s.quiz[id]; commit(); },
    praticaSeen: function (id) { return !!ensure().pratica[id]; },
    setPratica: function (id, v) { var s = ensure(); if (v) s.pratica[id] = true; else delete s.pratica[id]; commit(); },
    attempts: function (id) { var a = ensure().attempts; return id ? a.filter(function (x) { return x.aula === id; }) : a.slice(); },

    /* ---------------- checklists ---------------- */
    checked: function (cid) { return ensure().checklists[cid] || {}; },
    toggleCheck: function (cid, i, v) {
      var s = ensure(), c = s.checklists[cid] || (s.checklists[cid] = {});
      if (v) c[i] = true; else delete c[i];
      commit();
    },
    resetCheck: function (cid) { var s = ensure(); delete s.checklists[cid]; commit(); },

    /* ---------------- exportar, importar, limpar ---------------- */
    exportJSON: function () { return JSON.stringify(ensure(), null, 2); },
    importJSON: function (text) {
      var raw; try { raw = JSON.parse(text); } catch (e) { return { ok: false, erro: 'O arquivo não é um JSON válido.' }; }
      if (!isObj(raw) || raw.v !== VERSION) return { ok: false, erro: 'Arquivo de outra versão ou sem o formato esperado.' };
      state = sanitize(raw); commit(); return { ok: true };
    },
    reset: function () { adapter.clear(); state = empty(); persistOk = true; commit(); }
  };

  w.PDI = w.PDI || {};
  w.PDI.Store = Store;
})(window);
