/* Inicializacao dos modulos, em ordem. Falha de um modulo nao impede os demais. */
(function () {
  'use strict';
  var PPI = window.PPI;
  function run(name, fn) { try { fn(); } catch (e) { if (window.console) console.error('Falha em ' + name, e); } }
  function start() {
    run('nav', function () { PPI.nav.init(); });
    run('glossary', function () { PPI.glossary.init(); });
    run('viewer', function () { PPI.viewer.init(); });
    run('flow', function () { PPI.flow.init(); });
    run('tables', function () { PPI.tables.init(); });
    run('checklist', function () { PPI.checklist.init(); });
    run('search', function () { PPI.search.init(); });
    document.documentElement.classList.add('ppi-ready');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
