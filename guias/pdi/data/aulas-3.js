/* Aulas dos módulos 7 e 8. Mesmas convenções de aulas.js. */
PDI.aulas.push(

/* ======================================================================= MÓDULO 7 */
{
  id: 'm7a1', mod: 7, trilha: 'comum', tempo: '12 min',
  titulo: 'Guarda documental: cinco anos ou dez anos?',
  objetivo: 'Identificar qual prazo de guarda se aplica a cada modalidade e como registrar o marco de início da contagem.',
  explicacao: [
    'A regra geral do {{d10521|Decreto 10.521}} fala em cinco anos, ressalvada contestação (art. 22, §§ 8º e 9º). ((legal))',
    'A regra específica da executora em programa prioritário fala em dez anos ({{r2|Res. 2/2020}}, art. 15, VII a IX). ((legal))',
    'No material do CITS, o Roteiro R6 pede a Declaração de Guarda por 10 anos, anual e no início do projeto ((interno)).',
    'Registre no controle documental o marco de início da contagem de cada projeto ((recom)). A Portaria 9.835/2022 trata de controles, guarda e formalização nos arts. 49 a 53.',
    'Quando houver dúvida sobre qual prazo se aplica, confirme no instrumento e na norma da modalidade antes de descartar qualquer documento ((recom)).'
  ],
  conceitos: [
    ['Guarda documental', 'Dever de manter documentos por um prazo.'],
    ['Declaração de Guarda', 'Item recorrente do roteiro do CITS.'],
    ['Ano-base', 'Ajuda a definir marcos de contagem.'],
    ['Executora', 'No PPI 4.0, sujeita ao prazo de dez anos da Res. 2/2020.']
  ],
  base: [['d10521', 'Art. 22, §§ 8º e 9º', 'legal'], ['r2', 'Art. 15, VII a IX', 'legal'], ['p9835', 'Arts. 49 a 53', 'legal'], ['man-cits', 'Roteiro R6 (sem link público)', 'interno']],
  exemplo: 'Exemplo ilustrativo. A Instituição B mantém uma planilha de controle com uma linha por projeto: modalidade, norma de guarda aplicável, data do marco de início e data prevista de liberação para descarte. Antes de enviar caixas ao arquivo morto, a equipe consulta a planilha e confirma a modalidade. ((recom))',
  pratica: {
    situacao: 'O setor de arquivo propõe descartar, após seis anos, documentos de um projeto do PPI 4.0, "porque a regra geral é de cinco anos". Qual é a sua resposta?',
    resposta: 'Para a executora em programa prioritário, a Res. 2/2020 (art. 15, VII a IX) fala em dez anos. A regra geral do Decreto 10.521 é de cinco anos, ressalvada contestação. Não descarte antes de confirmar o prazo no instrumento e na norma da modalidade, e registre o marco de início da contagem.'
  },
  quiz: [
    { q: 'Qual é a regra geral de guarda do Decreto 10.521 (art. 22, §§ 8º e 9º)?', o: ['Dois anos', 'Cinco anos, ressalvada contestação', 'Dez anos', 'Vinte anos'], c: 1, f: 'O decreto trata de guarda por cinco anos, ressalvada contestação.' },
    { q: 'Para a executora do PPI 4.0, a Res. 2/2020 (art. 15, VII a IX) fala em:', o: ['Cinco anos', 'Sete anos', 'Dez anos', 'Sem prazo'], c: 2, f: 'A regra específica da executora em programa prioritário fala em dez anos.' },
    { q: 'O que o guia recomenda registrar no controle documental?', o: ['O marco de início da contagem de cada projeto', 'Apenas o valor do convênio', 'O nome do auditor', 'O número do processo da empresa'], c: 0, f: 'O guia recomenda registrar o marco de início da contagem do prazo de cada projeto.' }
  ],
  resumo: [
    'Regra geral do decreto: cinco anos, ressalvada contestação.',
    'Executora de programa prioritário: dez anos (Res. 2/2020, art. 15).',
    'Registre o marco de início da contagem de cada projeto.',
    'Na dúvida, confirme no instrumento antes de descartar.'
  ]
},
{
  id: 'm7a2', mod: 7, trilha: 'comum', tempo: '14 min',
  titulo: 'Credenciamento, penalidades e atualizações a acompanhar',
  objetivo: 'Reconhecer onde estão credenciamento, penalidades e regularização, e como acompanhar atos novos sem concluir vigência sem verificação.',
  explicacao: [
    'A {{r5|Res. CAPDA 5/2010}} trata do credenciamento. O Anexo I, item 3, trata de descredenciamento; o item 4.7, da manutenção das condições, cumprimento dos convênios, inspeções, documentação e regularidade; os itens 4.8 e seguintes, da avaliação institucional. ((legal))',
    'Penalidades: Decreto 10.521, arts. 34 e 35 (empresa beneficiária) e art. 37 (advertência, suspensão ou descredenciamento institucional); Portaria 9.835/2022, arts. 45 a 48 (penalidades e regularização); Res. 2/2020, arts. 40 e 41 (penalidades e rescisão).',
    'Atos recentes a acompanhar, segundo o catálogo da Suframa citado no guia: {{pc4|Portaria Conjunta 4/2026}} (maturidade produtiva em Indústria 4.0), {{pc2|Portaria Conjunta 2/2026}} (relatório consolidado e parecer conclusivo da auditoria), {{p858|Portaria Suframa 858/2023}} (plano de PD&I) e {{p785|Portaria Suframa 785/2021}} (ficha de indicadores).',
    'Pontos a verificar antes de citar: o Roteiro R6 cita a "Resolução nº 04 de 11 de setembro de 2018", que não aparece no catálogo da Suframa (ele lista a Resolução CAPDA 4 de 12/09/2017); o material cita o Manual de Resultados v1, e a Suframa publica a versão de setembro de 2024. O guia não declara vigência nem revogação sem verificação documental.'
  ],
  conceitos: [
    ['RADI', 'Relatório de avaliação institucional da ICT.'],
    ['CAPDA', 'Credencia as ICTs.'],
    ['Diligência', 'Pode surgir de pendências de regularidade.'],
    ['Suframa', 'Mantém o catálogo de normativos.']
  ],
  base: [['r5', 'Anexo I, itens 3, 4.7 e 4.8', 'legal'], ['d10521', 'Arts. 34, 35 e 37', 'legal'], ['p9835', 'Arts. 45 a 48', 'legal'], ['r2', 'Arts. 40 e 41', 'legal'], ['cat', 'Acompanhar atualizações', 'recom']],
  exemplo: 'Exemplo ilustrativo. Todo mês, a Instituição B abre o catálogo de normativos da Suframa, anota os atos novos e registra, para cada um, se ele pode atingir os seus projetos (modalidade, ano-base, ICT credenciada ou pública). Atos que parecem relevantes vão para a lista de pendências de verificação, com o link do texto oficial. ((recom))',
  pratica: {
    situacao: 'A equipe encontra, no Roteiro R6 do CITS, a citação de uma "Resolução nº 04 de 11 de setembro de 2018". Ela não aparece no catálogo da Suframa. O que fazer?',
    resposta: 'O guia indica que o catálogo lista a Resolução CAPDA 4 de 12/09/2017 e recomenda confirmar com o CITS qual ato é. Não cite a resolução como fundamento até que a coordenadora confirme.'
  },
  quiz: [
    { q: 'Qual item do Anexo I da Res. CAPDA 5/2010 trata da manutenção das condições, de inspeções e de regularidade?', o: ['Item 3', 'Item 4.7', 'Item 4.8', 'Anexo II'], c: 1, f: 'O item 4.7 trata da manutenção das condições, do cumprimento dos convênios, de inspeções, de documentação e de regularidade.' },
    { q: 'Onde a Portaria 9.835/2022 trata de penalidades e regularização?', o: ['Arts. 14 e 15', 'Arts. 45 a 48', 'Art. 57', 'Arts. 4º a 9º'], c: 1, f: 'Os arts. 45 a 48 tratam de penalidades e regularização.' },
    { q: 'Ao encontrar um ato citado em material interno que não aparece no catálogo oficial, a atitude mais adequada é:', o: ['Citá-lo mesmo assim', 'Confirmar com a coordenadora e verificar no texto oficial antes de usá-lo como fundamento', 'Considerá-lo revogado', 'Ignorar o material interno'], c: 1, f: 'O guia não declara vigência nem revogação sem verificação documental. Confirme com a coordenadora e consulte o texto oficial.' }
  ],
  resumo: [
    'Credenciamento: Res. CAPDA 5/2010. Penalidades: Decreto, Portaria 9.835 e Res. 2/2020.',
    'Acompanhe o catálogo da Suframa para atos novos.',
    'Divergências entre material interno e catálogo oficial devem ser confirmadas com a coordenadora.'
  ]
},

/* ======================================================================= MÓDULO 8 */
{
  id: 'm8a1', mod: 8, trilha: 'comum', tempo: '25 min',
  titulo: 'Estudos de caso da rotina da executora',
  objetivo: 'Aplicar os módulos anteriores a seis situações realistas: RH, rateio, conciliação bancária, despesas, documentação e prestação de contas.',
  explicacao: [
    'Os casos desta aula são ilustrativos. Eles usam situações comuns em projetos de PD&I para treinar a leitura das normas, e não descrevem uma instituição específica.',
    'Para cada caso, siga quatro passos: (1) identifique a modalidade e o instrumento; (2) localize o dispositivo que trata do tema; (3) separe o que é exigência legal, obrigação contratual, procedimento interno e recomendação operacional; (4) registre a decisão e as evidências.',
    'Quando a norma não fixa um método, como no rateio de horas, o critério costuma estar no instrumento, no manual da coordenadora ou em procedimento da própria instituição. Nesses casos, os feedbacks apontam isso de forma explícita.'
  ],
  conceitos: [
    ['Rateio', 'Divisão proporcional entre projetos ou atividades.'],
    ['Conciliação bancária', 'Compara extrato e lançamentos.'],
    ['Competência', 'Mês de referência da prestação.'],
    ['Diligência', 'Pedido de esclarecimento sobre algo já enviado.'],
    ['Dossiê por projeto', 'Reúne as evidências usadas nos casos.']
  ],
  base: [['d10521', 'Art. 22', 'legal'], ['p9835', 'Arts. 40 e 42', 'legal'], ['r2', 'Art. 15, III e VII a IX; arts. 16, 43, 47 e 48', 'legal'], ['man-rd', 'Seção 7', 'recom']],
  exemplo: 'Exemplo de aplicação dos quatro passos. Caso: uma despesa nova chega para lançamento. (1) Modalidade e instrumento: PPI 4.0, convênio de cooperação e PUR. (2) Dispositivo: art. 22 do Decreto, para a categoria. (3) Natureza: a categoria e as condições são exigência legal; o formato do lançamento na planilha é procedimento da coordenadora. (4) Registro: lançamento, documento fiscal e justificativa no dossiê.',
  pratica: {
    situacao: 'Antes de começar, escolha um projeto real ou imaginário e anote: modalidade, ano-base e instrumento. Responda aos seis casos pensando nele.',
    resposta: 'Com essas três anotações, você já consegue indicar a norma aplicável e saber se um ponto é exigência legal, obrigação do convênio ou procedimento interno. Se faltar alguma informação, trate o ponto como pendência de verificação.'
  },
  quiz: [
    { caso: 'RH', q: 'Uma pesquisadora da executora dedica parte do mês ao projeto e parte a outras atividades. A planilha de custos mostra 100% do salário no projeto. O que fazer?', o: ['Manter 100%, porque ela atua no projeto', 'Apropriar ao projeto apenas a parte efetivamente dedicada, com critério de rateio documentado e evidências', 'Mover todo o salário para despesas administrativas', 'Excluir a pesquisadora do projeto'], c: 1, f: 'O guia não fixa um método único de rateio. O art. 22 do Decreto trata das categorias e das condições de contabilização, e o critério de rateio e as evidências costumam constar do instrumento, do manual da coordenadora ou de procedimento da instituição. Registre o critério, aplique-o de forma consistente e guarde folha, registro de dedicação e descrição das atividades. ((recom))' },
    { caso: 'Rateio', q: 'Uma despesa compartilhada por dois projetos (por exemplo, o uso de um laboratório) foi lançada integralmente em um deles. Qual é a melhor conduta?', o: ['Manter, pois o valor é pequeno', 'Lançar integralmente nos dois projetos', 'Definir e documentar um critério de rateio coerente com a utilização, e conferir em qual categoria a despesa se enquadra', 'Retirar a despesa de qualquer projeto'], c: 2, f: 'Despesas operacionais e administrativas têm limites próprios (art. 42 da Portaria 9.835/2022; art. 43 da Res. 2/2020), então é importante identificar a categoria. O critério de rateio precisa ser documentado e coerente. Se o instrumento ou o manual da coordenadora definir um método, ele prevalece para aquele projeto. ((recom))' },
    { caso: 'Conciliação bancária', q: 'Na conciliação da conta do projeto, o extrato mostra uma tarifa bancária e um rendimento que não estão nos lançamentos. O que fazer?', o: ['Ignorar, são valores pequenos', 'Registrar e conciliar os dois, verificando nos arts. 16, 47 e 48 da Res. 2/2020 o tratamento de rendimentos, contratações e taxas bancárias', 'Transferir o saldo para outra conta', 'Aguardar o encerramento do projeto'], c: 1, f: 'O art. 16 trata de aplicações financeiras e rendimentos, e os arts. 47 e 48 tratam de contratações e taxas bancárias. Confira o texto oficial para saber se a tarifa pode ser debitada do projeto. Em todos os casos, explique cada diferença antes de enviar a prestação de contas. ((recom))' },
    { caso: 'Despesas', q: 'A nota fiscal de um serviço técnico traz a descrição "serviços diversos". Antes de lançar a despesa, qual é a melhor medida?', o: ['Lançar assim mesmo', 'Reunir documentos que demonstrem a aplicação do serviço no projeto, como contrato ou ordem de serviço e relatório de entrega', 'Pedir que a empresa mude o valor', 'Classificar como custo indireto'], c: 1, f: 'O Manual de Análise do RD trata de descrição genérica e de falta de demonstração da aplicação no projeto como pontos de atenção. Reunir contrato, ordem de serviço e entrega reduz o risco. ((recom))' },
    { caso: 'Documentação', q: 'O arquivo propõe descartar, após seis anos, os documentos de um projeto do PPI 4.0. O que verificar?', o: ['Nada, a regra geral é de cinco anos', 'A regra específica da executora (dez anos, art. 15, VII a IX, da Res. 2/2020), o instrumento e o marco de início da contagem', 'Somente a vontade da empresa', 'O número de páginas'], c: 1, f: 'A regra geral do Decreto 10.521 fala em cinco anos, ressalvada contestação, mas a executora em programa prioritário tem regra específica de dez anos. Confirme também o instrumento do projeto.' },
    { caso: 'Prestação de contas', q: 'A coordenadora pede entrega mensal. A empresa precisa dos dados para o seu RD e tem outro prazo. Como organizar os prazos?', o: ['Seguir apenas o prazo da empresa', 'Tratar cada prazo na sua fonte: o convênio e o manual da coordenadora para a entrega da executora, e a norma e o instrumento da empresa para o RD', 'Entregar tudo uma vez por ano', 'Ignorar a coordenadora'], c: 1, f: 'O guia registra que o prazo da empresa ou da coordenadora perante a Suframa pode ser diferente do prazo da executora. O convênio e o manual operacional definem quando a executora entrega as suas informações.' }
  ],
  resumo: [
    'Identifique modalidade, instrumento e dispositivo antes de decidir.',
    'Separe exigência legal, obrigação contratual, procedimento interno e recomendação operacional.',
    'Quando a norma não fixa um método, registre o critério e as evidências.',
    'Dúvida de vigência ou versão vira pendência de verificação.'
  ]
},
{
  id: 'm8a2', mod: 8, trilha: 'comum', tempo: '15 min',
  titulo: 'Revisão geral dos módulos',
  objetivo: 'Revisar os pontos centrais dos sete módulos anteriores e identificar o que precisa ser estudado de novo.',
  explicacao: [
    'Esta aula reúne questões de todos os módulos. Depois de responder, consulte a página <a href="#/desempenho">Meu desempenho</a> para ver quais aulas merecem revisão.',
    '<b>Módulo 1:</b> a Lei 8.387 liga o benefício fiscal da empresa à obrigação de investir em PD&I, e a executora recebe recursos e presta contas.',
    '<b>Módulo 2:</b> convênio direto e PPI 4.0 têm partes, instrumentos e normas diferentes. <b>Módulo 3:</b> leia de cima para baixo e com as alterações. <b>Módulo 4:</b> PUR, plano de PD&I, aditivos e propriedade intelectual.',
    '<b>Módulo 5:</b> arts. 21 e 22 do Decreto, limites de 20% com bases próprias, conta específica, aportes e saldos. <b>Módulo 6:</b> cadência de prestação de contas, RD e dossiê. <b>Módulo 7:</b> guarda de cinco ou dez anos, credenciamento e atualizações.'
  ],
  conceitos: [
    ['Executora', 'Papel central de todo o curso.'],
    ['Convênio direto', 'Uma das duas modalidades.'],
    ['PPI 4.0', 'A outra modalidade.'],
    ['Guarda documental', 'Prazo muda conforme a regra.']
  ],
  base: [['l8387', 'Art. 2º', 'legal'], ['d10521', 'Arts. 21, 22', 'legal'], ['r2', 'Arts. 15, 16, 17, 43, 45', 'legal'], ['p9835', 'Arts. 14 e 15, 28 a 33, 40, 42, 57', 'legal']],
  exemplo: 'Exemplo ilustrativo de roteiro de revisão. A Instituição B reserva 30 minutos por mês: relê as pendências de verificação, abre o catálogo de normativos, refaz as questões das aulas em que errou e atualiza o dossiê dos projetos. ((recom))',
  pratica: {
    situacao: 'Liste três perguntas que você faria a si mesmo antes de citar uma norma em um ofício.',
    resposta: 'Sugestões: (1) a norma se aplica à modalidade e ao ano-base do projeto? (2) li a versão com as alterações e conferi o texto oficial? (3) o que cito é exigência legal, obrigação contratual, procedimento interno ou recomendação? ((recom))'
  },
  quiz: [
    { q: 'A Lei 8.387 vincula a obrigação anual de investir em PD&I a quem?', o: ['À executora', 'À empresa beneficiária dos incentivos', 'À Suframa', 'Ao CITS'], c: 1, f: 'A obrigação é da empresa beneficiária (art. 2º, § 3º). A executora recebe recursos para executar o projeto.' },
    { q: 'A norma operacional do convênio direto a partir do ano-base 2024 é:', o: ['Res. CAPDA 2/2020', 'Portaria Conjunta 9.835/2022', 'Res. CAPDA 9/2019', 'Portaria 347/2020'], c: 1, f: 'A Portaria 9.835/2022 se aplica a partir do ano-base 2024 (art. 57).' },
    { q: 'Qual é a ordem de leitura sugerida pelo guia?', o: ['Manual, portaria, decreto, lei', 'Lei, decreto, normas da modalidade e manuais', 'Qualquer ordem', 'Somente manuais'], c: 1, f: 'A lei cria a obrigação, o decreto regulamenta, as normas da modalidade operacionalizam e os manuais orientam a análise.' },
    { q: 'Os percentuais de 20% de diferentes finalidades:', o: ['Somam-se como margem livre', 'Têm base e condição próprias', 'São idênticos', 'Não existem'], c: 1, f: 'O guia alerta que os limites têm finalidades diferentes e não se somam como margem livre.' },
    { q: 'A cadência mensal por competência do CITS é:', o: ['Exigência da Lei 8.387', 'Obrigação contratual ou procedimento da coordenadora', 'Regra do Decreto 10.521', 'Exigência da Portaria 347/2020'], c: 1, f: 'A resolução fala em relatórios semestrais ou em prazo menor solicitado. A cadência mensal vem das orientações da coordenadora e do convênio.' },
    { q: 'Para a executora do PPI 4.0, a guarda documental prevista na Res. 2/2020 é de:', o: ['Cinco anos', 'Seis anos', 'Dez anos', 'Vinte anos'], c: 2, f: 'A regra específica da executora em programa prioritário fala em dez anos (art. 15, VII a IX).' }
  ],
  resumo: [
    'A obrigação de investir é da empresa. A executora executa e presta contas.',
    'Escolha a norma pela modalidade, pelo ano-base e pelo instrumento.',
    'Cada limite de 20% tem base própria.',
    'Separe sempre os quatro tipos de exigência e registre pendências de verificação.'
  ]
}
);
