/* Teste de integridade dos dados didáticos. Uso: node tests/pdi/dados.test.js */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..', '..', 'guias');
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
['glossario', 'aulas', 'aulas-2', 'aulas-3', 'extras'].forEach(f =>
  vm.runInContext(fs.readFileSync(path.join(root, 'pdi/data', f + '.js'), 'utf8'), ctx, { filename: f }));
const PDI = ctx.PDI;
const html = fs.readFileSync(path.join(root, 'base-normativa-pdi.html'), 'utf8');
const fold = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const erros = []; const err = m => erros.push(m);

const gl = new Set(); PDI.glossario.forEach(g => { gl.add(fold(g.t)); (g.a || []).forEach(a => gl.add(fold(a))); });
const ids = new Set(); const campos = ['objetivo', 'explicacao', 'conceitos', 'base', 'exemplo', 'pratica', 'quiz', 'resumo'];
const folhas = (x, o = []) => { if (typeof x === 'string') o.push(x); else if (x && typeof x === 'object') Object.values(x).forEach(v => folhas(v, o)); return o; };
const textos = a => folhas([a.explicacao, a.exemplo, a.pratica, a.resumo, a.objetivo, a.quiz, a.conceitos]).join('\n');

PDI.aulas.forEach(a => {
  if (ids.has(a.id)) err('id duplicado ' + a.id); ids.add(a.id);
  if (!(a.mod >= 1 && a.mod <= 8)) err(a.id + ': módulo inválido');
  if (!['comum', 'ppi', 'conv'].includes(a.trilha)) err(a.id + ': trilha inválida');
  campos.forEach(c => { const v = a[c]; if (!v || (Array.isArray(v) && !v.length)) err(a.id + ': falta ' + c); });
  if (a.pratica && !(a.pratica.situacao && a.pratica.resposta)) err(a.id + ': prática incompleta');
  (a.quiz || []).forEach((q, i) => {
    if (!Array.isArray(q.o) || q.o.length < 2) err(a.id + ' q' + i + ': opções');
    else if (!(Number.isInteger(q.c) && q.c >= 0 && q.c < q.o.length)) err(a.id + ' q' + i + ': índice correto inválido');
    if (!q.f) err(a.id + ' q' + i + ': sem feedback');
  });
  (a.base || []).forEach(b => { if (!PDI.normas[b[0]]) err(a.id + ': base desconhecida ' + b[0]); });
  const t = textos(a);
  (t.match(/\[\[[^\]]+\]\]/g) || []).forEach(m => { const k = m.slice(2, -2).split('|')[0]; if (!gl.has(fold(k))) err(a.id + ': termo fora do glossário ' + k); });
  (t.match(/\{\{[^}]+\}\}/g) || []).forEach(m => { const k = m.slice(2, -2).split('|')[0]; if (!PDI.normas[k]) err(a.id + ': norma desconhecida ' + k); });
  if (/—/.test(t)) err(a.id + ': travessão no texto');
});
PDI.modulos.forEach(m => { if (!PDI.aulas.some(a => a.mod === m.n)) err('módulo ' + m.n + ' sem aulas'); });
PDI.glossario.forEach(g => { if (g.ref && !PDI.normas[g.ref]) err('glossário ' + g.t + ': ref ' + g.ref); });

Object.entries(PDI.normas).forEach(([k, n]) => {
  if (n.card && !new RegExp('id="' + n.card + '"').test(html)) err('norma ' + k + ': card ausente ' + n.card);
  if (n.url && !html.includes(n.url)) err('norma ' + k + ': url não está na página ' + n.url);
});
(PDI.mapa.nos || []).forEach(n => { if (n.id && n.norma && !PDI.normas[n.norma] && !new RegExp('id="' + n.norma + '"').test(html)) err('mapa: ' + n.id); });
Object.entries(PDI.checklists || {}).length || (Array.isArray(PDI.checklists) && PDI.checklists.length) || err('checklists vazias');

console.log('aulas:', PDI.aulas.length, '| glossário:', PDI.glossario.length, '| normas:', Object.keys(PDI.normas).length);
if (erros.length) { console.log(erros.join('\n')); console.log('FALHOU:', erros.length); process.exit(1); }
console.log('OK');
