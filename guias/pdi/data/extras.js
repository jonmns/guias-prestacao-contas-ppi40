/*
 * Mapa normativo e checklists.
 * Todas as relações do mapa vêm do que a própria página já registra (colunas do mapa,
 * campos "ler com as alterações", "alterada por" e artigos de transição). Nada foi acrescentado
 * como interpretação jurídica. Vigência e revogação não são declaradas.
 */
window.PDI = window.PDI || {};

/* linha: 0 lei, 1 regulamento, 2 norma da modalidade, 3 manual e modelos. col: conv, ppi, trans, both (conv+ppi). */
PDI.mapa = {
  linhas: ['Lei', 'Regulamento', 'Norma da modalidade', 'Manual e modelos'],
  colunas: [['conv', 'Convênio direto'], ['ppi', 'PPI 4.0'], ['trans', 'Transversal']],
  nos: [
    { id: 'l8387', rot: 'Lei 8.387/1991', sub: 'Obrigação de investir em PD&I', linha: 0, col: 'both', norma: 'l8387', d: 'Vincula o benefício fiscal da empresa à obrigação de investir em PD&I. O art. 2º, § 4º, indica convênios com ICTs (I e VI) e programas prioritários (IV).' },
    { id: 'l10973', rot: 'Lei 10.973/2004', sub: 'Lei de Inovação', linha: 0, col: 'trans', norma: 'l10973', d: 'Complementa o enquadramento em propriedade intelectual e bolsas. Alterada pela Lei 13.243/2016.' },
    { id: 'l13243', rot: 'Lei 13.243/2016', sub: 'Alterações', linha: 0, col: 'trans', url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2016/lei/l13243.htm', d: 'Citada pelo guia como a lei que alterou a Lei de Inovação.' },
    { id: 'd10521', rot: 'Decreto 10.521/2020', sub: 'Regulamento', linha: 1, col: 'both', norma: 'd10521', d: 'Regras gerais de enquadramento de atividades (art. 21) e de dispêndios (art. 22). Ler com as alterações dos Decretos 10.891/2021 e 11.127/2022.' },
    { id: 'r5', rot: 'Res. CAPDA 5/2010', sub: 'Credenciamento', linha: 1, col: 'trans', norma: 'r5', d: 'Credenciamento de ICTs e entidades de ensino. O credenciamento no CAPDA e a habilitação perante a coordenadora do PPI são verificações distintas.' },
    { id: 'r8', rot: 'Res. CAPDA 8/2015', sub: 'Alteração', linha: 1, col: 'trans', url: 'https://www.gov.br/suframa/pt-br/assuntos/pdi/legislacao/conteudo/resolucao-no-08-2015-alteracao-percentual-doutores.pdf', d: 'Citada pelo guia como a resolução que alterou a Res. CAPDA 5/2010.' },
    { id: 'p9835', rot: 'Portaria Conjunta 9.835/2022', sub: 'Convênio direto', linha: 2, col: 'conv', norma: 'p9835', d: 'Referência operacional do convênio direto. Aplica-se às obrigações a partir do ano-base 2024 (art. 57).' },
    { id: 'cas71', rot: 'Res. CAS 71/2016', sub: 'Projetos anteriores', linha: 2, col: 'conv', url: 'https://www.in.gov.br/materia/-/asset_publisher/Kujrw0TZC2Mb/content/id/22804410/do1-2016-05-11-resolucao-n-71-de-6-de-maio-de-2016-22804199', d: 'O art. 55, parágrafo único, da Portaria 9.835/2022 preserva procedimentos desta resolução para certos projetos anteriores continuados.' },
    { id: 'r9', rot: 'Res. CAPDA 9/2019', sub: 'Cria o PPI 4.0', linha: 2, col: 'ppi', norma: 'r9', d: 'Cria o PPI 4.0 (art. 6º) e define seu escopo temático.' },
    { id: 'r2', rot: 'Res. CAPDA 2/2020', sub: 'Regras dos programas prioritários', linha: 2, col: 'ppi', norma: 'r2', d: 'Norma que mais pesa na rotina da executora do PPI 4.0: PUR, obrigações da executora, conta específica, guarda, rendimentos, aportes, prestação de contas e saldos.' },
    { id: 'r30', rot: 'Res. CAPDA 30/2022', sub: 'Alterações', linha: 2, col: 'ppi', url: 'https://www.in.gov.br/en/web/dou/-/resolucao-capda/me-n-30-de-14-de-setembro-de-2022-429349373', d: 'Alterou, entre outros, os arts. 6º, 10, 11, 14 e 46 da Res. 2/2020, segundo o guia.' },
    { id: 'p347', rot: 'Portaria 347/2020', sub: 'ICT pública', linha: 2, col: 'trans', norma: 'p347', d: 'Rege a modalidade do art. 2º, § 4º, VI, da Lei 8.387, quando a executora é ICT pública.' },
    { id: 'p8111', rot: 'Portaria 8.111/2022', sub: 'Alteração', linha: 2, col: 'trans', url: 'https://www.in.gov.br/web/dou/-/portaria-conjunta-me/suframa-n-8.111-de-12-de-setembro-de-2022-428663659', d: 'Citada pelo guia como a portaria que alterou a Portaria Conjunta 347/2020.' },
    { id: 'man-rd', rot: 'Manual de Análise do RD', sub: 'v1.1 (2021)', linha: 3, col: 'conv', norma: 'man-rd', d: 'Organiza a análise do RD por elegibilidade, pertinência e adequação. É anterior à Portaria 9.835/2022 e deve ser lido com as normas posteriores.' },
    { id: 'man-pur', rot: 'Manual de Análise do PUR', sub: 'Planejamento', linha: 3, col: 'ppi', norma: 'man-pur', d: 'Verifica identificação, enquadramento técnico, custos, equipe e cronograma do PUR. Analisa o planejamento e não substitui a prestação de contas.' },
    { id: 'man-cits', rot: 'Manual do CITS', sub: 'Sem link público', linha: 3, col: 'ppi', norma: 'man-cits', d: 'Não há versão pública verificada. Vale o manual efetivamente entregue à executora, na versão vinculada ao convênio.' },
    { id: 'cat', rot: 'Manuais e catálogo', sub: 'Suframa', linha: 3, col: 'trans', url: 'https://www.gov.br/suframa/pt-br/assuntos/pdi/legislacao/normativos', d: 'Catálogo de normativos e página de manuais e formulários da Suframa, onde se acompanham atos novos.' }
  ],
  /* [origem, destino, rótulo] */
  arestas: [
    ['d10521', 'l8387', 'regulamenta'],
    ['p9835', 'l8387', 'operacionaliza o convênio direto (art. 2º, § 4º, I e VI)'],
    ['r9', 'l8387', 'programa prioritário (art. 2º, § 4º, IV)'],
    ['r2', 'l8387', 'programa prioritário (art. 2º, § 4º, IV)'],
    ['r30', 'r2', 'altera'],
    ['p347', 'l8387', 'ICT pública (art. 2º, § 4º, VI)'],
    ['p8111', 'p347', 'altera'],
    ['p9835', 'cas71', 'preserva procedimentos na transição (art. 55, parágrafo único)'],
    ['l13243', 'l10973', 'altera'],
    ['r8', 'r5', 'altera'],
    ['man-rd', 'p9835', 'orienta a análise (ler com as normas posteriores)'],
    ['man-pur', 'r2', 'orienta a análise do PUR']
  ]
};

/* Checklists operacionais. nat: legal | contratual | interno | recom. */
PDI.checklists = [
  { id: 'ck-despesa', titulo: 'Antes de lançar uma despesa', desc: 'Passos para conferir uma despesa antes de incluí-la na prestação de contas.',
    itens: [
      { t: 'Confirmar a modalidade, o ano-base e o instrumento do projeto.', nat: 'recom' },
      { t: 'Identificar a atividade de PD&I (art. 21) e a categoria de dispêndio (art. 22) do Decreto 10.521.', nat: 'legal', ref: 'd10521' },
      { t: 'Conferir limites e condições do dispositivo da categoria, como art. 22, §§ 3º e 13, art. 42 da Portaria e art. 43 da Res. 2/2020.', nat: 'legal', ref: 'p9835' },
      { t: 'Verificar se o documento fiscal descreve o item de modo que demonstre a aplicação no projeto.', nat: 'recom', ref: 'man-rd' },
      { t: 'Reunir o comprovante de pagamento e os demais documentos exigidos pelo instrumento do projeto.', nat: 'contratual' },
      { t: 'Registrar o critério de rateio quando a despesa for compartilhada entre projetos.', nat: 'recom' },
      { t: 'Arquivar os documentos no grupo Execução financeira do dossiê.', nat: 'recom' }
    ] },
  { id: 'ck-competencia', titulo: 'Fechamento da prestação de contas', desc: 'Roteiro para conferir o pacote antes de enviar a prestação de contas da competência.',
    itens: [
      { t: 'Confirmar a cadência e o prazo no convênio e no manual da coordenadora.', nat: 'contratual' },
      { t: 'Conciliar a conta específica com os lançamentos do período.', nat: 'recom', ref: 'r2' },
      { t: 'Registrar rendimentos e aportes do período (Res. 2/2020, arts. 16 e 17).', nat: 'legal', ref: 'r2' },
      { t: 'Conferir os limites de custos indiretos e reserva.', nat: 'legal', ref: 'r2' },
      { t: 'Revisar descrições de documentos fiscais e pendências de comprovação.', nat: 'recom' },
      { t: 'Conferir as declarações recorrentes do modelo da coordenadora, como as de impedimento e de guarda.', nat: 'interno' },
      { t: 'Guardar uma cópia do pacote enviado e da confirmação de entrega.', nat: 'recom' }
    ] },
  { id: 'ck-conciliacao', titulo: 'Conciliação bancária', desc: 'Conferência entre o extrato da conta do projeto e os lançamentos.',
    itens: [
      { t: 'Usar a conta específica do projeto (Res. 2/2020, art. 15, VII a IX).', nat: 'legal', ref: 'r2' },
      { t: 'Comparar cada lançamento do extrato com o registro financeiro do projeto.', nat: 'recom' },
      { t: 'Registrar os rendimentos de aplicações financeiras (art. 16).', nat: 'legal', ref: 'r2' },
      { t: 'Verificar, no texto oficial, o tratamento de contratações e taxas bancárias (arts. 47 e 48).', nat: 'legal', ref: 'r2' },
      { t: 'Explicar por escrito cada diferença que não puder ser eliminada.', nat: 'recom' },
      { t: 'Arquivar o extrato e a conciliação assinada ou validada, conforme o procedimento da instituição.', nat: 'interno' }
    ] },
  { id: 'ck-rh', titulo: 'Equipe, bolsistas e rateio de RH', desc: 'Pontos de atenção ao apropriar custos de pessoas ao projeto.',
    itens: [
      { t: 'Verificar a categoria e as condições de contabilização no art. 22 do Decreto 10.521.', nat: 'legal', ref: 'd10521' },
      { t: 'Para bolsas, consultar o art. 9º, §§ 1º e 4º, da Lei 10.973.', nat: 'legal', ref: 'l10973' },
      { t: 'Conferir se o instrumento ou o manual da coordenadora define método de rateio.', nat: 'contratual' },
      { t: 'Documentar o critério de rateio e aplicá-lo de forma consistente.', nat: 'recom' },
      { t: 'Guardar evidências de dedicação ao projeto (folha, registros e descrição das atividades).', nat: 'recom' },
      { t: 'Conferir os documentos de bolsistas pedidos pelo modelo da coordenadora (Roteiro 10.2 e 11.2).', nat: 'interno' }
    ] },
  { id: 'ck-diligencia', titulo: 'Resposta a uma diligência', desc: 'Passos para responder a um pedido de esclarecimento com o fundamento certo.',
    itens: [
      { t: 'Ler o pedido e identificar o projeto, a modalidade e o ano-base.', nat: 'recom' },
      { t: 'Localizar o dispositivo exato e a versão da norma aplicável.', nat: 'recom' },
      { t: 'Abrir o texto oficial e conferir o dispositivo antes de citá-lo.', nat: 'recom' },
      { t: 'Reunir os documentos que demonstram a aplicação da despesa no projeto.', nat: 'recom' },
      { t: 'Separar o que é exigência legal, obrigação contratual e procedimento interno na resposta.', nat: 'recom' },
      { t: 'Registrar a resposta no grupo Encerramento do dossiê.', nat: 'recom' }
    ] },
  { id: 'ck-encerramento', titulo: 'Encerramento do projeto', desc: 'Itens a conferir ao encerrar um projeto.',
    itens: [
      { t: 'Verificar a destinação de saldos (Res. 2/2020, art. 45, no PPI 4.0).', nat: 'legal', ref: 'r2' },
      { t: 'Preparar o termo de encerramento no modelo da coordenadora, quando houver.', nat: 'interno' },
      { t: 'Conferir relatórios finais, bens adquiridos e respostas a diligências.', nat: 'recom' },
      { t: 'Confirmar a distribuição da propriedade intelectual no instrumento (Lei 10.973, art. 9º).', nat: 'contratual', ref: 'l10973' },
      { t: 'Registrar o marco de início da contagem do prazo de guarda e o prazo aplicável.', nat: 'recom' }
    ] }
];
