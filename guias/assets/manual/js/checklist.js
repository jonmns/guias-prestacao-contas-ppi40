/* Checklist mensal: projeto e mes, indicadores por grupo, salvamento local independente, impressao. Os 26 itens originais sao mantidos. */
(function () {
  'use strict';
  var PPI = window.PPI, $ = PPI.$, $$ = PPI.$$, el = PPI.el, K = PPI.KEY;
  var C = PPI.checklist = {};
  var sec, boxes, projSel, monthIn, state = { project: '', month: '' }, totalBar, totalTxt, meta;

  function key() { return K.ckPrefix + encodeURIComponent(state.project) + ':' + state.month; }
  function load() { return PPI.storage.get(key(), {}) || {}; }
  function save(d) { d.__t = new Date().toISOString(); PPI.storage.set(key(), d); showMeta(d); }
  function showMeta(d) {
    if (!meta) return;
    meta.textContent = d && d.__t ? 'Última marcação salva neste navegador em ' + new Date(d.__t).toLocaleString('pt-BR') + '.' : 'Nada salvo ainda para este projeto e mês.';
  }
  function projects() { return PPI.storage.get(K.projects, []) || []; }
  function fillProjects() {
    var list = projects(); projSel.innerHTML = '';
    if (!list.length) projSel.appendChild(el('option', { value: '', text: 'Sem projeto (padrão)' }));
    list.forEach(function (p) { projSel.appendChild(el('option', { value: p, text: p })); });
    projSel.value = state.project;
    if (projSel.value !== state.project) { projSel.value = list[0] || ''; state.project = projSel.value; }
  }
  function refresh() {
    var d = load();
    boxes.forEach(function (b) { b.checked = !!d[b.id]; });
    var done = 0;
    $$('fieldset', sec).forEach(function (f) {
      var bs = $$('input[type=checkbox]', f), n = bs.filter(function (b) { return b.checked; }).length; done += n;
      var lg = $('legend', f), g = $('.gc', lg); if (!g) { g = el('span', { class: 'gc' }); lg.appendChild(g); }
      g.textContent = n + '/' + bs.length; g.classList.toggle('full', n === bs.length);
    });
    var pct = Math.round(done / boxes.length * 100);
    totalTxt.textContent = done + ' de ' + boxes.length + ' (' + pct + '%)';
    totalBar.style.width = pct + '%';
    totalBar.parentNode.setAttribute('aria-valuenow', pct);
    showMeta(d);
    var pm = $('.print-meta', sec); if (pm) pm.textContent = 'Projeto: ' + (state.project || '—') + ' · Competência: ' + (state.month || '—') + ' · Itens marcados: ' + done + ' de ' + boxes.length;
  }
  function pick(project, month) {
    state.project = project; state.month = month;
    PPI.storage.set(K.ckSel, state); fillProjects(); monthIn.value = month; refresh();
  }

  C.init = function () {
    sec = $('#checklist'); if (!sec) return;
    boxes = $$('.check input[type=checkbox]', sec);
    var old = $('.progress', sec); var oldNote = old && old.nextElementSibling;
    var now = new Date(), def = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    var saved = PPI.storage.get(K.ckSel, null) || {};
    state.project = saved.project || ''; state.month = saved.month || def;

    projSel = el('select', { class: 'field', id: 'ck-proj' });
    monthIn = el('input', { type: 'month', class: 'field', id: 'ck-month', value: state.month });
    var nameIn = el('input', { type: 'text', class: 'field', id: 'ck-newname', placeholder: 'Ex.: PUR 2024-01', maxlength: 60 });
    var newBox = el('div', { class: 'ckx-new' }, [
      el('div', { style: 'display:flex;flex-direction:column;gap:3px;flex:1;min-width:200px' }, [el('label', { for: 'ck-newname', class: 'muted', style: 'font-size:.72rem;font-weight:700', text: 'Nome do novo projeto' }), nameIn]),
      el('button', { type: 'button', class: 'btn primary', text: 'Adicionar', on: { click: function () {
        var n = nameIn.value.trim(); if (!n) { nameIn.focus(); return; }
        var l = projects(); if (l.indexOf(n) < 0) { l.push(n); PPI.storage.set(K.projects, l); }
        nameIn.value = ''; newBox.classList.remove('show'); pick(n, monthIn.value || def); projSel.focus();
      } } }),
      el('button', { type: 'button', class: 'btn', text: 'Cancelar', on: { click: function () { newBox.classList.remove('show'); } } })]);
    totalBar = el('i'); totalTxt = el('b', { 'aria-live': 'polite' });
    var bar = el('div', { class: 'bar', role: 'progressbar', 'aria-label': 'Itens marcados no total', 'aria-valuemin': 0, 'aria-valuemax': 100 }, [totalBar]);
    meta = el('p', { class: 'ckx-meta' });
    var actions = el('div', { class: 'ckx-actions' }, [
      el('button', { type: 'button', class: 'btn', text: 'Novo projeto', on: { click: function () { newBox.classList.add('show'); nameIn.focus(); } } }),
      el('button', { type: 'button', class: 'btn', text: 'Imprimir / salvar em PDF', on: { click: function () { C.print(); } } }),
      el('button', { type: 'button', class: 'btn danger', id: 'ck-reset', text: 'Limpar marcações', on: { click: function () {
        PPI.confirm({ title: 'Limpar marcações?', message: 'Serão apagadas as marcações do projeto “' + (state.project || 'padrão') + '” em ' + state.month + '. Outros projetos e meses não são afetados.', confirmLabel: 'Limpar', danger: true }).then(function (ok) { if (ok) { PPI.storage.remove(key()); refresh(); PPI.toast('Marcações limpas.'); } });
      } } })]);
    var barBox = el('div', { class: 'ckx-bar' }, [
      el('div', { class: 'ckx-proj' }, [el('div', { style: 'display:flex;flex-direction:column;gap:3px;flex:1' }, [el('label', { for: 'ck-proj', class: 'muted', style: 'font-size:.72rem;font-weight:700', text: 'Projeto' }), projSel])]),
      el('div', { style: 'display:flex;flex-direction:column;gap:3px' }, [el('label', { for: 'ck-month', class: 'muted', style: 'font-size:.72rem;font-weight:700', text: 'Competência (mês)' }), monthIn]),
      actions, newBox]);
    var warn = el('div', { class: 'ckx-warn', role: 'note' }, [PPI.icon('warn'), el('span', { text: 'As marcações ficam salvas só neste navegador e neste aparelho, separadas por projeto e mês. Elas não são sincronizadas entre dispositivos e podem ser perdidas se os dados do navegador forem apagados.' })]);
    var total = el('div', { class: 'ckx-total' }, [el('div', { class: 'row' }, [el('strong', { text: 'Total' }), totalTxt, el('div', { class: 'progress' }, [bar])]), meta]);
    var pm = el('p', { class: 'print-meta' });
    var first = $('.check', sec);
    if (old) old.remove(); if (oldNote) oldNote.remove();
    [barBox, warn, total, pm].forEach(function (n) { first.parentNode.insertBefore(n, first); });

    fillProjects();
    projSel.addEventListener('change', function () { pick(projSel.value, monthIn.value || def); });
    monthIn.addEventListener('change', function () { pick(state.project, monthIn.value || def); });
    boxes.forEach(function (b) { b.addEventListener('change', function () { var d = load(); if (b.checked) d[b.id] = true; else delete d[b.id]; save(d); refresh(); }); });

    /* migra marcacoes da versao anterior (uma unica lista) para o projeto padrao, sem apagar a original */
    var legacy = PPI.storage.get(K.legacyCheck, null);
    if (legacy && typeof legacy === 'object' && !PPI.storage.raw(key())) {
      var d = {}, any = false; boxes.forEach(function (b) { if (legacy[b.id]) { d[b.id] = true; any = true; } });
      if (any && !state.project) { PPI.storage.set(key(), d); }
    }
    refresh();
  };
  C.print = function () {
    refresh();
    var h = document.documentElement; h.classList.add('print-checklist');
    var done = function () { h.classList.remove('print-checklist'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done); window.print();
  };
})();
