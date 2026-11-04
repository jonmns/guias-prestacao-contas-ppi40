# Entrega consolidada — 04/11/2026

## Alterações

As quatro entregas foram reunidas com o portal como estrutura e as interfaces especializadas de cada manual. As implementações estão descritas no README. Os códigos do portal e da Central permanecem isolados para evitar conflito no objeto global PPI.

A página 404 mantém um caminho absoluto de publicação configurável em PPI_BASE. A troca por caminhos relativos foi descartada, pois falharia em páginas inexistentes de maior profundidade.

## Verificações executadas

- Teste de dados PD&I: 18 aulas, 49 termos e 19 normas; aprovado.
- Preservação da biblioteca normativa original: 33 links oficiais, todos os IDs esperados e 550 blocos de texto preservados.
- Comparação contra as três entregas especializadas: 2.547 blocos do Guia, 1.904 do Manual e 750 da Plataforma preservados, juntamente com todos os hrefs originais.
- Varredura de referências locais: todos os arquivos encontrados; 404 excluída dessa análise por usar caminho absoluto de publicação configurável.
- Navegação em Chrome automatizado em 1366, 768 e 390 pixels: páginas gerais, trilhas e três manuais sem rolagem horizontal global.
- Interações: diagnóstico, filtros, atalho de diagnóstico, mapa, organograma, ordenação, linhas expansíveis, fluxo, persistência de prioridade, aula PD&I, restauração de rolagem, favoritos, painel consolidado, backup e rejeição de importação inválida.
- PDF gerado e lido com pypdf; conteúdo textual e estrutura válidos.
- Recursos locais carregados sem ausências e páginas testadas sem erros JavaScript.
- A regeneração foi repetida para conferir a estabilidade dos arquivos.

O log de navegador está em tests/resultado-regressao.txt. Os testes não validam a precisão jurídica, leitor de tela, sites externos, todos os cenários de armazenamento bloqueado ou todos os fluxos do produto. Não foi executado axe-core nem Lighthouse.

## Conteúdo pendente

Os apontamentos de revisão não foram silenciosamente corrigidos nem apresentados como obrigações confirmadas. A priorização das recomendações é preenchida pelo próprio usuário e fica no navegador. O diagnóstico usa as tabelas existentes; as correções continuam sendo sugestões do manual, não determinações novas do CITS.

As listas de pendências dos pacotes originais são registros históricos. Para o estado desta versão, consulte este documento e o README.

## Conferência antes do envio ao GitHub

Repositório: jonmns/guias-prestacao-contas-ppi40, branch main. Comparação com o commit cc21b0fb80774b4eefeceb82f920d8975832ee63: os 602 blocos de conteúdo com mais de 15 caracteres extraídos de parágrafos, listas, cabeçalhos e células do manual das ferramentas atual também estão presentes na versão consolidada. O envio conserva os arquivos existentes que não fazem parte desta atualização.
