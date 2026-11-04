/* Classificacao dos alertas (secao 08) e mapa do diagnostico guiado.
   A classificacao por ferramenta e categoria foi feita para este manual; o texto dos alertas e dos erros
   vem sempre da propria tabela da pagina (fonte unica). */
window.PPI_DATA = window.PPI_DATA || {};
PPI_DATA.alertMeta = {
  1: { tools: ['PF'], cat: 'entrada' }, 2: { tools: ['PF'], cat: 'orientacao' }, 3: { tools: ['PF'], cat: 'totalizacao' },
  4: { tools: ['PF'], cat: 'formulas' }, 5: { tools: ['PF'], cat: 'totalizacao' }, 6: { tools: ['PF'], cat: 'estrutura' },
  7: { tools: ['PF'], cat: 'entrada' }, 8: { tools: ['PF', 'IG'], cat: 'estrutura' }, 9: { tools: ['PF'], cat: 'totalizacao' },
  10: { tools: ['PF'], cat: 'totalizacao' }, 11: { tools: ['PF'], cat: 'formulas' }, 12: { tools: ['PF'], cat: 'formulas' },
  13: { tools: ['PF'], cat: 'arquivo' }, 14: { tools: ['IG'], cat: 'formulas' }
};
PPI_DATA.alertCats = {
  formulas: 'Fórmulas e validações', entrada: 'Entrada de dados', totalizacao: 'Valor não chega ao total',
  estrutura: 'Estrutura e intervalos', orientacao: 'Orientações do modelo', arquivo: 'Arquivo e macros'
};

/* Sintomas. erro: indice da linha da tabela "Erros comuns" (secao 09). alerta: numero na secao 08.
   symptom (opcional) substitui o texto do sintoma quando a entrada nasce de um alerta.
   tool: onde o sintoma aparece. refs: onde ler mais (ids de licao ou de secao). */
PPI_DATA.diagnostics = [
  { id: 'e0', erro: 0, tool: ['PF'], refs: ['pf--abas-de-lancamento'] },
  { id: 'e1', erro: 1, tool: ['PF'], alerta: [6, 7], refs: ['pf--consolidado-e-conciliacao-as-duas-contas', 'ordem--todo-mes-na-ordem'] },
  { id: 'e2', erro: 2, tool: ['PF'], refs: ['pf--consolidado-e-conciliacao-as-duas-contas'] },
  { id: 'e3', erro: 3, tool: ['PF'], alerta: [1], refs: ['pf--posicao-financeira-tres-linhas-por-rubri'] },
  { id: 'e4', erro: 4, tool: ['PF'], alerta: [1], refs: ['pf--posicao-financeira-tres-linhas-por-rubri'] },
  { id: 'e5', erro: 5, tool: ['PF'], refs: ['pf--posicao-financeira-tres-linhas-por-rubri', 'ordem--todo-mes-na-ordem'] },
  { id: 'e6', erro: 6, tool: ['PF'], refs: ['pf--abas-de-lancamento'] },
  { id: 'e7', erro: 7, tool: ['RD'], refs: ['rastreio', 'checklist', 'integracao'] },
  { id: 'e8', erro: 8, tool: ['RD'], refs: ['rd--xii-anatomia-do-quadro-de-cada-atividade'] },
  { id: 'e9', erro: 9, tool: ['IG'], refs: ['ig--do-numero-a-decisao', 'ig--anatomia-de-um-quadro-aba-rhd'] },
  { id: 'e10', erro: 10, tool: ['RD'], refs: ['rd--xii-anatomia-do-quadro-de-cada-atividade', 'checklist'] },
  { id: 'a5', alerta: [5], tool: ['PF'], symptom: 'O valor lançado nas abas I ou II não aparece na Posição Financeira', refs: ['pf--abas-de-lancamento'] },
  { id: 'a3', alerta: [3], tool: ['PF'], symptom: 'O custo de RH lançado nas abas III ou IV (RH_Custo) não chega à Posição Financeira', refs: ['pf--folha-de-pagamento-como-a-abertura-chega'] },
  { id: 'a4', alerta: [4], tool: ['PF'], symptom: 'Aparecem fórmulas com #REF! nas abas III, IV.I ou na Posição Financeira', refs: ['integracao'] },
  { id: 'a14', alerta: [14], tool: ['IG'], symptom: 'O IG mostra #DIV/0! nos percentuais', refs: ['ig--anatomia-de-um-quadro-aba-rhd'] },
  { id: 'a11', alerta: [11], tool: ['PF'], symptom: 'Valores previstos mostra o aviso "Fluxo com diferença" com o fluxo correto', refs: ['pf--composicao-do-valor-do-projeto-embutida'] },
  { id: 'a8', alerta: [8], tool: ['PF', 'IG'], symptom: 'Os meses 13 a 15 aparecem com PUR zero', refs: ['pf--posicao-financeira-tres-linhas-por-rubri', 'ig--anatomia-de-um-quadro-aba-rhd'] },
  { id: 'a10', alerta: [10], tool: ['PF', 'RD'], symptom: 'Os custos incorridos da Coordenadora não aparecem como realizado na Posição Financeira', refs: ['rastreio', 'pf--composicao-do-valor-do-projeto-embutida'] },
  { id: 'a9', alerta: [9], tool: ['PF'], symptom: 'Os impostos registrados na aba Impostos não mudam os totais', refs: ['pf--abas-de-lancamento'] },
  { id: 'j4', tool: ['PF'], symptom: 'A célula J4 (status técnico) da Posição Financeira mostra #DIV/0!',
    cause: 'O % financeiro apurado ainda é zero. O print da Posição Financeira (ponto 5) informa que a célula mostra #DIV/0! enquanto o % financeiro for zero.',
    guidance: 'O manual não descreve outra correção. Confira se os meses fechados estão marcados como Realizado na linha 6 e se há valores lançados.',
    nature: 'mod', refs: ['pf--posicao-financeira-tres-linhas-por-rubri'] }
];
