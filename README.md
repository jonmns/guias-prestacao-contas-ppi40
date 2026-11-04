# Portal PPI 4.0 consolidado

Versão consolidada de 04/11/2026, formada pelos quatro pacotes fornecidos para o repositório jonmns/guias-prestacao-contas-ppi40. Os arquivos originais foram preservados fora desta pasta.

## Como abrir

Extraia o ZIP inteiro e abra `index.html`. Mantenha a estrutura de pastas: os manuais dependem de CSS, JavaScript e imagens externos. O progresso é salvo no navegador; use **Meu espaço → Cópia de segurança completa** para exportar e restaurar os registros de todas as trilhas.

Para desenvolvimento e publicação, prefira um servidor estático. Por exemplo, na pasta do portal: `python -m http.server 8000`, depois acesse `http://localhost:8000`. Dados gravados ao abrir pelo disco podem ficar separados dos dados do endereço hospedado, conforme o navegador.

## O que foi integrado

- Estrutura e trilhas gerais do portal.
- Guia reformulado de prestação de contas.
- Central de aprendizagem do manual das ferramentas.
- Plataforma de aprendizagem PD&I, incluindo suas 18 aulas.
- Navegação entre os manuais, favoritos e marcações por seção compatíveis com o portal.
- Busca global regenerada, com 313 registros e inclusão das aulas PD&I.
- Painel com indicadores dos manuais e backup completo no Meu espaço.

## Recursos acrescentados

- Central: diagnóstico por ferramenta e sintoma, orientações retiradas das tabelas, filtros combinados de alertas e download direto do checklist em PDF.
- Guia: mapa selecionável de dependências; exploração de fluxogramas com etapa, zoom e tipo de responsável; detalhes da jornada e organograma; filtros combinados, ordenação e detalhes de linhas; matriz de gravidade; filtros por fase, raia e ponto de controle; inventário de lacunas; organização das recomendações por prioridade, impacto e finalidade definidos pelo usuário.
- PD&I: restauração da posição ao voltar para uma rota visitada.
- Desempenho: 23 imagens do manual das ferramentas passaram para arquivos externos, com carregamento sob demanda. O HTML caiu de aproximadamente 4,95 MB para 167 KB. O volume total das imagens continua existindo, mas pode ser carregado e reutilizado separadamente.

## Regeneração

Requer Python 3 e Node.js, apenas no desenvolvimento. O site publicado continua sem build ou dependências de servidor.

Execute `python tools/build.py` quando alterar os manuais ou os dados do portal. As aulas PD&I são lidas por `tools/index-pdi.cjs`. O gerador preserva as interfaces especializadas, adiciona âncoras estáveis e recria páginas gerais e índice de busca. O parser foi ajustado para seções normativas aninhadas.

A página 404 usa por padrão o caminho `/guias-prestacao-contas-ppi40/`. Para publicar em outro local, defina `PPI_BASE` com o caminho absoluto, incluindo a barra final, antes de regenerar. Exemplo no PowerShell: `$env:PPI_BASE='/meu-portal/'`. Para domínio na raiz: `/`.

## Validação

Veja `docs/ENTREGA-CONSOLIDADA.md`. O teste de navegador `tests/regressao.cjs` usa Playwright e um Chrome instalado. Informe `CHROME_PATH` se necessário. Execute, a partir da pasta do portal: `node tests/regressao.cjs .`. As requisições são atendidas pelo próprio teste com os arquivos locais, sem acesso à internet.

## Ainda pendente

- Revisão jurídica/normativa e didática pela coordenação, incluindo os seis esclarecimentos registrados em `docs/REVISAO-DE-CONTEUDO.md`.
- Confirmação de disponibilidade e atualidade dos links externos.
- Auditoria automatizada completa de acessibilidade com axe-core, medição Lighthouse e correção de qualquer contraste residual que ela identificar.
- Leitor de tela, Firefox/Safari e aparelhos físicos.
- Exemplos específicos adicionais e verificações detalhadas por etapa da jornada, caso exigidos pela coordenação. O painel atual expande o conteúdo existente; não inventa procedimentos novos.
- Validação da adequação das medidas preventivas para cada risco no contexto de cada projeto. A matriz preserva a gravidade original e direciona às recomendações.
- Conferência do endereço hospedado após a implantação pelo GitHub Pages.

O envio ao repositório é separado da implantação do GitHub Pages. Login e sincronização entre dispositivos não fazem parte desta entrega estática.
