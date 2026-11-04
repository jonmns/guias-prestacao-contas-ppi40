/* Teste ponta a ponta (Playwright) com verificação de acessibilidade (axe-core).
 * Uso: AXE=/caminho/axe.min.js NODE_PATH=$(npm root -g) node tests/pdi/e2e.test.js
 * Sobe um servidor estático local na porta 8765. Não acessa a internet (fontes externas são bloqueadas). */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..');
const AXE = process.env.AXE && fs.existsSync(process.env.AXE) ? fs.readFileSync(process.env.AXE, 'utf8') : null;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
const srv = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
const URL0 = 'http://127.0.0.1:8765/guias/base-normativa-pdi.html';
let falhas = 0, ok = 0;
const t = (nome, cond, extra) => { if (cond) ok++; else { falhas++; console.log('FALHA:', nome, extra || ''); } };

(async () => {
  await new Promise(r => srv.listen(8765, r));
  const br = await chromium.launch();
  const erros = [];
  async function nova(opts) {
    const ctx = await br.newContext(opts || { viewport: { width: 1280, height: 900 } });
    await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    const p = await ctx.newPage();
    p.on('pageerror', e => erros.push(String(e)));
    return [ctx, p];
  }
  const go = async (p, h) => { await p.goto(URL0 + (h || '')); await p.waitForSelector('main#conteudo'); await p.waitForTimeout(150); };

  /* ---- rotas ---- */
  let [ctx, p] = await nova();
  await go(p);
  const rotas = ['#/aprender', '#/modulo/1', '#/modulo/8', '#/aula/m1a1', '#/aula/m8a1', '#/glossario', '#/glossario/rd', '#/mapa', '#/mapa/l8387', '#/comparar', '#/checklists', '#/desempenho', '#/busca/art.%2022', '#/consultar', '#/resumo', '#/n-r2', '#/rota-inexistente'];
  for (const h of rotas) {
    await p.goto(URL0 + h); await p.waitForTimeout(120);
    const n = await p.evaluate(() => document.querySelector('main').innerText.length);
    t('rota ' + h + ' renderiza', n > 80, n);
  }
  /* âncoras originais levam à biblioteca */
  await p.goto(URL0 + '#n-r2'); await p.waitForTimeout(150);
  t('âncora original abre biblioteca', await p.evaluate(() => document.documentElement.dataset.view) === 'lib');
  t('cartão n-r2 visível', await p.isVisible('#n-r2'));

  /* ---- busca ---- */
  await go(p, '#/aprender');
  await p.fill('#q', 'art. 22'); await p.press('#q', 'Enter'); await p.waitForTimeout(250);
  t('busca navega', /#\/busca\//.test(p.url()));
  t('busca com resultados', await p.locator('main a, main button').count() > 5);
  await p.fill('#q', 'zzzxxqq'); await p.press('#q', 'Enter'); await p.waitForTimeout(200);
  t('busca vazia informa', /nenhum|não encontr/i.test(await p.innerText('main')));

  /* ---- filtros da biblioteca ---- */
  await go(p, '#/consultar');
  const total = await p.evaluate(() => document.querySelectorAll('#view-lib article.norma:not([hidden]), #view-lib article.man:not([hidden])').length);
  await p.check('input[name=mod][value=ppi]'); await p.waitForTimeout(150);
  const ppi = await p.evaluate(() => document.querySelectorAll('#view-lib article.norma:not([hidden]), #view-lib article.man:not([hidden])').length);
  t('filtro PPI reduz ou mantém lista', ppi <= total && ppi > 0, ppi + '/' + total);
  await p.check('input[name=mod][value=all]');
  await p.click('#lib-expand'); await p.waitForTimeout(100);
  t('expandir abre dispositivos', await p.evaluate(() => [...document.querySelectorAll('#view-lib details.disp')].every(d => d.open)));
  await p.click('#lib-collapse');

  /* ---- exercícios e persistência ---- */
  await go(p, '#/aula/m1a1');
  const nq = await p.evaluate(() => document.querySelectorAll('#s-questoes fieldset').length);
  t('aula tem questões', nq >= 3, nq);
  for (let i = 0; i < nq; i++) {
    const fs = p.locator('#s-questoes fieldset').nth(i);
    await fs.locator('input[type=radio]').first().check();
    await fs.locator('[data-act=check]').click();
    t('feedback q' + i, await fs.locator('.fb.show').count() === 1);
  }
  t('concluir habilitado após quiz', await p.isEnabled('[data-act=concluir]'));
  await p.click('[data-act=concluir]');
  await p.reload(); await p.waitForSelector('main#conteudo'); await p.waitForTimeout(150);
  t('estado persiste após recarregar', /Aula concluída/.test(await p.innerText('#lact')));
  t('respostas persistem', await p.locator('#s-questoes .fb.show').count() === nq);
  const raw = await p.evaluate(() => localStorage.getItem('ppi40.pdi.v1'));
  t('localStorage v1', raw && JSON.parse(raw).v === 1);
  await go(p, '#/aprender');
  t('início mostra progresso', /1 de \d+|1\/\d+|concluíd/i.test(await p.innerText('main')));

  /* exportar, importar e limpar */
  const exp = await p.evaluate(() => PDI.Store.exportJSON());
  await p.evaluate(() => PDI.Store.reset());
  t('reset limpa', await p.evaluate(() => PDI.Store.status('m1a1')) === 'pendente');
  t('importa JSON válido', await p.evaluate(j => PDI.Store.importJSON(j).ok, exp));
  t('status restaurado', await p.evaluate(() => PDI.Store.status('m1a1')) === 'concluida');
  t('rejeita JSON inválido', await p.evaluate(() => PDI.Store.importJSON('{x').ok) === false);

  /* ---- tema ---- */
  await go(p, '#/aprender');
  const t0 = await p.evaluate(() => document.documentElement.dataset.theme || '');
  await p.click('#theme-btn');
  const t1 = await p.evaluate(() => document.documentElement.dataset.theme || '');
  t('tema alterna', t0 !== t1, t0 + '>' + t1);
  await p.reload(); await p.waitForSelector('main#conteudo');
  t('tema persiste', await p.evaluate(() => document.documentElement.dataset.theme || '') === t1);

  /* ---- teclado e foco ---- */
  await go(p, '#/aprender');
  await p.keyboard.press('Tab');
  t('primeiro Tab é o link de pular', /conteúdo/i.test(await p.evaluate(() => document.activeElement.textContent)));
  await p.evaluate(() => document.activeElement.blur());
  await p.click('#side-toggle'); t('sidebar recolhe', await p.evaluate(() => document.documentElement.dataset.side) === 'closed');
  await p.reload(); await p.waitForSelector('main#conteudo');
  t('sidebar recolhida persiste', await p.evaluate(() => document.documentElement.dataset.side) === 'closed');
  await p.click('#side-toggle');
  await p.goto(URL0 + '#/glossario'); await p.waitForTimeout(100);
  await p.locator('button.gl, main button').first().click().catch(() => {});
  await p.keyboard.press('Escape');

  /* ---- acessibilidade (axe) em claro e escuro ---- */
  if (AXE) {
    for (const tema of ['light', 'dark']) {
      for (const h of ['#/aprender', '#/aula/m2a2', '#/glossario', '#/mapa', '#/comparar', '#/checklists', '#/desempenho', '#/consultar']) {
        await p.goto(URL0 + h); await p.evaluate(x => { document.documentElement.dataset.theme = x; }, tema); await p.waitForTimeout(150);
        await p.evaluate(AXE);
        const r = await p.evaluate(() => axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'], resultTypes: ['violations'] }));
        const v = r.violations.filter(x => x.id !== 'color-contrast' || true);
        t('axe ' + tema + ' ' + h, v.length === 0, v.map(x => x.id + '(' + x.nodes.length + '): ' + x.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')).join('; '));
      }
    }
  } else console.log('AXE não informado: verificação de acessibilidade ignorada.');
  await ctx.close();

  /* ---- mobile ---- */
  [ctx, p] = await nova({ viewport: { width: 375, height: 760 }, isMobile: true, hasTouch: true });
  await go(p, '#/aprender');
  t('sem rolagem horizontal (início)', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await p.click('#side-toggle'); await p.waitForTimeout(150);
  t('gaveta abre', await p.evaluate(() => document.documentElement.dataset.drawer) === 'open');
  await p.keyboard.press('Escape'); await p.waitForTimeout(100);
  t('Esc fecha gaveta', await p.evaluate(() => document.documentElement.dataset.drawer) !== 'open');
  for (const h of ['#/aula/m5a1', '#/mapa', '#/comparar', '#/consultar', '#/checklists', '#/desempenho']) {
    await p.goto(URL0 + h); await p.waitForTimeout(200);
    t('sem rolagem horizontal ' + h, await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), await p.evaluate(() => document.documentElement.scrollWidth));
  }
  await ctx.close();

  t('sem erros de script', erros.length === 0, erros.join(' | '));
  await br.close(); srv.close();
  console.log(`${ok} verificações ok, ${falhas} falhas`);
  process.exit(falhas ? 1 : 0);
})().catch(e => { console.error(e); srv.close(); process.exit(2); });
