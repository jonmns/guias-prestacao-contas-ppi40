# Modernização UI/UX do Portal PPI 4.0: resumo, testes e pendências

## O que foi feito
- Nova página inicial: cabeçalho com busca e alternância claro/escuro, destaque com "Começar a aprender" e "Consultar normas", dois caminhos ("Quero aprender" e "Preciso consultar"), cartões dos três manuais (ícone, descrição, assuntos, complexidade e tempo de leitura calculado), acesso rápido e favoritos.
- Trilha de aprendizado em 3 etapas (`aprender/`), com 14 lições, objetivos, exemplos, perguntas de revisão, 3 avaliações curtas com feedback, exercícios de classificação, calculadora de índices e estudos de caso.
- Busca global (`consultar.html`) nos 3 manuais, com filtros por manual, categoria e assunto, atalhos por tema e link direto para a seção, com destaque dos termos.
- Checklists interativos (`checklists.html`), glossário (`glossario.html`) e `meu-espaco.html` (progresso, favoritos, exportar/importar/apagar).
- Camada nos manuais: migalhas, indicador de seção, favoritar, marcar como estudada, anterior/próxima, relacionados, "continuar de onde parei". URLs e âncoras originais preservadas; subtítulos receberam ids novos.
- Progresso e favoritos em `localStorage`, com plano B em memória e aviso quando indisponível.

## Como regenerar
`python3 tools/build.py` (idempotente). Rode sempre que editar os manuais ou o conteúdo em `tools/`.

## Testes realizados
- 12 páginas em 1280 px e 390 px: sem erros de JavaScript e sem rolagem horizontal.
- Texto dos três manuais comparado com a versão original: idêntico.
- Servido em subcaminho (como no GitHub Pages de projeto): links relativos funcionam.
- axe-core (WCAG 2.2 AA), claro e escuro: ok na maioria das páginas.

## Pendências e limitações
- Não foi publicado no GitHub (token da sessão inválido): é preciso enviar os arquivos ao repositório.
- Contraste: 1 a 2 elementos antigos dentro dos manuais ainda aparecem no axe e não foram tratados individualmente.
- Teste manual com leitor de tela (NVDA/VoiceOver) e em aparelhos reais não foi feito.
- Complexidade dos manuais é classificação editorial; conteúdos didáticos novos precisam de revisão da coordenação.
- Medidas de desempenho (Lighthouse) não foram feitas. Os manuais seguem com imagens embutidas (o de ferramentas tem ~5 MB).
