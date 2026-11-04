/* Estrutura de modulos, trilhas e orientacoes para iniciantes.
   Os ids de secao sao os mesmos do manual original (ancoras preservadas). */
window.PPI_DATA = window.PPI_DATA || {};
PPI_DATA.modules = [
  { id: 'm1', title: 'Fundamentos', sub: 'Visão geral, integração, ordem e rubricas', sections: ['resumo', 'integracao', 'ordem', 'rubricas'] },
  { id: 'm2', title: 'Planilha Financeira', sub: 'Abas, lançamentos, folha, Posição e conciliação', sections: ['pf'] },
  { id: 'm3', title: 'Indicadores Gerenciais', sub: 'Índices, curvas e respostas do tópico XVI', sections: ['ig'] },
  { id: 'm4', title: 'Relatório Técnico', sub: 'As 21 seções e a matriz de rastreabilidade', sections: ['rd', 'rastreio'] },
  { id: 'm5', title: 'Qualidade e diagnóstico', sub: 'Alertas dos modelos, erros comuns e lacunas', sections: ['alertas', 'erros', 'lacunas'] },
  { id: 'm6', title: 'Fechamento mensal', sub: 'Checklist por projeto e competência', sections: ['checklist'] }
];

/* Trilhas: "learn" estuda uma licao por vez; "quick" mostra tudo em leitura continua;
   "fix" mostra so as secoes uteis para resolver um problema (todas continuam acessiveis pelo menu). */
PPI_DATA.paths = {
  learn: { label: 'Aprender do zero', hint: 'Uma lição por vez, com exercícios e orientações para iniciantes.' },
  quick: { label: 'Consulta rápida', hint: 'Todo o conteúdo em uma página, com busca e filtros.' },
  fix: { label: 'Resolver problemas', hint: 'Diagnóstico guiado, alertas, rubricas e rastreabilidade.', sections: ['erros', 'alertas', 'rubricas', 'rastreio', 'lacunas'] }
};

/* Orientacoes exibidas apenas na trilha "Aprender do zero". Texto baseado no proprio manual. */
PPI_DATA.beginner = {
  resumo: 'O manual trata de três ferramentas que o Analista de P&D usa todo mês: a Planilha Financeira (PF), os Indicadores Gerenciais (IG) e o Relatório Técnico (RD). A PF é fechada primeiro, porque gera os valores que o IG e o RD repetem. Siga as lições na ordem e marque cada uma como concluída.',
  integracao: 'Cada caixa do mapa é uma ferramenta ou uma fonte. Cada seta é um número que passa de um lugar para outro. Selecione uma caixa para ver de onde chegam os números e para onde eles vão.',
  ordem: 'Leia primeiro a configuração inicial, que se faz uma vez por projeto (e a cada adendo). Depois leia o roteiro do mês. Quando já souber a rotina, use o checklist do módulo 6 para conferir.',
  rubricas: 'Rubrica é cada linha de despesa prevista no PUR, como Material de consumo ou Viagens. O mesmo item recebe nome, letra ou número diferentes em cada ferramenta. Use o localizador para não lançar um valor na linha errada.',
  pf: 'A Planilha Financeira tem 22 abas. Você lança despesas nas abas de rubrica e na Abertura de Pagamentos. A Posição Financeira, o Consolidado e a Conciliação Bancária reúnem e conferem os números. Campos marcados como "Digitar" são seus; "Fórmula" o modelo calcula.',
  ig: 'Os indicadores comparam o que o PUR previu com o que o projeto fez, em dinheiro, em pessoas e em horas. Preencher os quadros é a parte mecânica. O mais importante é ler os números e explicar cada desvio com documentos.',
  rd: 'O Relatório Técnico é cumulativo: a cada mês um bloco novo é acrescentado e os anteriores são mantidos. Parte do conteúdo vem do time técnico (coordenador e pesquisadores) e parte do analista de P&D.',
  rastreio: 'Use a matriz como consulta. Encontre o campo do relatório, veja de onde vem o valor e o que conferir antes de enviar.',
  alertas: 'Estes alertas vêm da leitura das fórmulas e validações dos modelos. As correções são sugestões do manual e não determinações do CITS.',
  erros: 'Escolha o sintoma que você está vendo e siga o caminho: causa provável, orientação e onde ler mais.',
  lacunas: 'Aqui estão os pontos que os modelos não definem e as premissas adotadas pelo manual. Confirme com a coordenação e com o instrumento de cada projeto.',
  checklist: 'Use esta lista antes de enviar a competência. Escolha o projeto e o mês. As marcações ficam salvas apenas neste navegador.'
};
