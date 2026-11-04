/* Componentes de interface: dialogos nativos, confirmacao e avisos (toast). */
(function () {
  'use strict';
  var PPI = window.PPI, el = PPI.el;

  /* dialog({title, body(Node|string), footer(Node[]), cls, labelledby}) -> {el, body, open, close} */
  PPI.dialog = function (o) {
    var d = el('dialog', { class: o.cls || '', 'aria-labelledby': (o.id || PPI.uid('dlg')) + '-t' });
    var id = d.getAttribute('aria-labelledby');
    var closeBtn = el('button', { type: 'button', class: 'btn x-btn', 'aria-label': 'Fechar', on: { click: function () { api.close(); } } }, [PPI.icon('x')]);
    closeBtn.firstChild.setAttribute('width', 18); closeBtn.firstChild.setAttribute('height', 18);
    var head = el('div', { class: 'dlg-h' }, [el('h2', { id: id, text: o.title }), closeBtn]);
    var body = el('div', { class: 'dlg-b' });
    if (typeof o.body === 'string') body.innerHTML = o.body; else if (o.body) body.appendChild(o.body);
    d.appendChild(head); d.appendChild(body);
    var foot = null;
    if (o.footer) { foot = el('div', { class: 'dlg-f' }, o.footer); d.appendChild(foot); }
    var opener = null;
    d.addEventListener('click', function (e) { if (e.target === d && !o.noBackdropClose) api.close(); });
    d.addEventListener('close', function () { if (opener && opener.focus && document.contains(opener)) opener.focus(); if (o.onClose) o.onClose(); });
    document.body.appendChild(d);
    var api = {
      el: d, body: body, head: head, foot: foot,
      open: function () { opener = document.activeElement; if (!d.open) d.showModal(); if (o.onOpen) o.onOpen(); return api; },
      close: function (v) { if (d.open) d.close(v); },
      destroy: function () { api.close(); d.remove(); }
    };
    return api;
  };

  /* confirm({title, message, confirmLabel, cancelLabel, danger}) -> Promise<boolean> */
  PPI.confirm = function (o) {
    return new Promise(function (resolve) {
      var done = false;
      function fin(v) { if (done) return; done = true; resolve(v); dlg.close(); setTimeout(function () { dlg.destroy(); }, 50); }
      var ok = el('button', { type: 'button', class: 'btn ' + (o.danger ? 'danger' : 'primary'), text: o.confirmLabel || 'Confirmar', on: { click: function () { fin(true); } } });
      var cancel = el('button', { type: 'button', class: 'btn', text: o.cancelLabel || 'Cancelar', on: { click: function () { fin(false); } } });
      var dlg = PPI.dialog({ title: o.title, cls: 'confirm', body: el('p', { text: o.message }), footer: [cancel, ok], onClose: function () { fin(false); } });
      dlg.el.style.maxWidth = '460px';
      dlg.open(); cancel.focus();
    });
  };

  PPI.toast = function (msg, type) {
    var host = PPI.$('.toast-host');
    if (!host) { host = el('div', { class: 'toast-host', 'aria-hidden': 'true' }); document.body.appendChild(host); }
    var t = el('div', { class: 'toast ' + (type || ''), text: msg });
    host.appendChild(t); PPI.announce(msg);
    setTimeout(function () { t.remove(); }, 4200);
  };

  /* Legenda de natureza da informacao (regra, extraido dos modelos, premissa, sugestao) */
  PPI.natureLegend = function () {
    var n = el('div', { class: 'nature-legend', role: 'group', 'aria-label': 'Como identificar a natureza de cada informação' });
    n.innerHTML = '<strong>Como identificar a natureza de cada informação</strong>' +
      '<p><span class="tag doc">Regra do modelo</span><span>O que as orientações e fórmulas dos modelos oficiais determinam.</span></p>' +
      '<p><span class="tag mod">Extraído dos modelos</span><span>Observado pelo manual nas fórmulas, validações e prints dos arquivos.</span></p>' +
      '<p><span class="tag pre">Premissa do manual</span><span>Escolha de cálculo ou critério do manual onde o modelo não define.</span></p>' +
      '<p><span class="tag sug">Sugestão do manual</span><span>Correção ou boa prática proposta. Não é determinação oficial do CITS.</span></p>';
    return n;
  };
  PPI.natureTag = function (k) {
    var m = { doc: ['doc', 'Regra do modelo'], mod: ['mod', 'Extraído dos modelos'], pre: ['pre', 'Premissa do manual'], sug: ['sug', 'Sugestão do manual'] }[k];
    return el('span', { class: 'tag ' + m[0], text: m[1] });
  };
})();
