# Plataforma de aprendizagem PD&I

Página: `guias/base-normativa-pdi.html`. Stack mantida: HTML, CSS e JavaScript puros, sem build e sem dependências. Compatível com GitHub Pages.

## Modos
- **Aprender**: 8 módulos, 18 aulas, trilhas PPI 4.0 e convênio direto, exercícios, progresso, glossário (49 termos), mapa normativo, comparação de modalidades, checklists e desempenho.
- **Consultar**: biblioteca normativa original (10 seções preservadas), com filtros por PPI 4.0, convênio direto e transversais, dispositivos expansíveis e links oficiais.
- A busca da barra superior cobre normas, artigos, assuntos, glossário e aulas.

## Arquivos
- `guias/base-normativa-pdi.html`: página (biblioteca enriquecida e shell).
- `guias/pdi/css/plataforma.css`: estilos, temas, responsivo, impressão.
- `guias/pdi/js/store.js`: persistência (PDI.Store). `util.js`: busca e utilitários. `views.js`: telas. `app.js`: roteador e shell.
- `guias/pdi/data/`: `glossario.js`, `aulas.js`, `aulas-2.js`, `aulas-3.js`, `extras.js` (mapa e checklists).
- `guias/legado/base-normativa-pdi-v1.html`: versão anterior arquivada.
- `tests/pdi/`: `preservacao.py`, `dados.test.js`, `e2e.test.js`.

## Como adicionar uma aula
Inclua um objeto em `PDI.aulas.push(...)` (campos descritos no topo de `aulas.js`). Marcações: `[[Termo|rótulo]]` abre o glossário, `{{id|rótulo}}` liga a uma norma do registro `PDI.normas`, `((legal))`, `((contratual))`, `((interno))`, `((recom))` indicam a natureza da exigência. Rode `node tests/pdi/dados.test.js`.

## Contas de usuário no futuro
O estado (v1) é JSON serializável. Hoje usa localStorage (`ppi40.pdi.v1`). Para um banco de dados, registre um adaptador `{name, load(), save(state), clear()}` com `PDI.Store.useAdapter(adaptador)`. Há exportação e importação em JSON no painel de preferências.

## Testes
```
python3 tests/pdi/preservacao.py
node tests/pdi/dados.test.js
AXE=/caminho/axe.min.js NODE_PATH=$(npm root -g) node tests/pdi/e2e.test.js
```
O e2e exige Playwright e axe-core instalados fora do repositório.

## Limitações e pendências
- Os textos das aulas foram redigidos a partir do que a própria página já afirma. Não foram conferidos dispositivo por dispositivo nos textos oficiais. Revisão jurídica e normativa humana é necessária.
- Os avisos de normas pendentes de conferência foram mantidos. Nenhuma vigência ou revogação foi declarada.
- O progresso fica só no navegador do usuário (sem login, sem sincronização entre dispositivos).
- Voltar/avançar do navegador não restaura a posição de rolagem em todas as telas.
- Verificação manual com leitor de tela, teste em Safari/Firefox e teste em aparelhos reais não foram feitos. A conformidade WCAG 2.2 AA foi checada só com axe-core automático.
- Links oficiais foram preservados (33 de 33), mas não foi testado se os sites externos estão no ar.
