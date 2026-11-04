/* Aulas dos módulos 4 a 6. Mesmas convenções de aulas.js. */
PDI.aulas.push(

/* ======================================================================= MÓDULO 4 */
{
  id: 'm4a1', mod: 4, trilha: 'ppi', tempo: '14 min',
  titulo: 'PUR: planejar o projeto no PPI 4.0',
  objetivo: 'Descrever o que o Manual de Análise do PUR verifica e quais cuidados a executora deve ter ao compor o PUR.',
  explicacao: [
    'O [[PUR]] é o instrumento de planejamento do projeto no PPI 4.0, junto com o convênio de cooperação. Quem o analisa é a coordenadora.',
    'O {{man-pur|Manual de Análise do PUR}} verifica identificação da executora e dos investidores, enquadramento técnico, custos, equipe e cronograma. As seções mais úteis são a 3 (fluxo), a 4 (documentação) e a 5.1 a 5.13 (identificação, descrição, orçamento, RH, cronogramas e parecer).',
    'O manual trata da submissão à Suframa de projetos acima de R$ 2 milhões anuais e exige separar os valores da coordenadora e da executora.',
    'O manual analisa o planejamento. Ele não substitui a prestação de contas da execução, que segue outras regras (módulo 6).',
    'A parcela da executora em custos indiretos e reserva integra o limite compartilhado de 20% do art. 43, §§ 1º e 2º, da {{r2|Res. 2/2020}}. Veja a aula sobre limites de 20% no módulo 5.'
  ],
  conceitos: [
    ['PUR', 'Documento analisado nesta aula.'],
    ['Coordenadora', 'Analisa o PUR e consolida valores da coordenadora e da executora.'],
    ['Custos indiretos', 'Parcela da executora entra no limite compartilhado de 20%.'],
    ['Rubrica', 'Categoria em que os custos do PUR são organizados.']
  ],
  base: [['man-pur', 'Seções 3, 4 e 5.1 a 5.13', 'recom'], ['r2', 'Art. 2º, IV; art. 43, §§ 1º e 2º', 'legal']],
  exemplo: 'Exemplo ilustrativo. A Instituição B monta o PUR de um projeto de R$ 3 milhões por ano. Como o valor supera R$ 2 milhões anuais, o manual indica a submissão à Suframa, então ela confere o fluxo e a documentação nas seções 3 e 4 do manual vigente. No orçamento, separa os valores da coordenadora e os da executora, para que o limite compartilhado de 20% possa ser conferido no conjunto.',
  pratica: {
    situacao: 'Ao montar o orçamento do PUR, a equipe lança um único valor de custos indiretos para "executora e coordenadora". O que o manual pede?',
    resposta: 'O manual exige separar os valores da coordenadora e os da executora. Como o art. 43 da Res. 2/2020 considera as duas parcelas em conjunto no limite de 20%, lançar cada parcela em separado permite conferir o limite do conjunto. ((recom))'
  },
  quiz: [
    { q: 'O que o Manual de Análise do PUR analisa?', o: ['A execução e a prestação de contas', 'O planejamento do projeto', 'Somente a auditoria', 'Apenas despesas já pagas'], c: 1, f: 'O manual analisa o planejamento (identificação, enquadramento técnico, custos, equipe e cronograma) e não substitui a prestação de contas da execução.' },
    { q: 'Segundo o manual, projetos acima de R$ 2 milhões anuais:', o: ['Estão dispensados de análise', 'Têm submissão à Suframa', 'Devem virar convênio direto', 'Não precisam de cronograma'], c: 1, f: 'O manual trata da submissão à Suframa dos projetos acima de R$ 2 milhões anuais.' },
    { q: 'No PUR, os valores da coordenadora e da executora:', o: ['Devem ser separados', 'Devem ser somados em uma única linha', 'São irrelevantes', 'Só importam no encerramento'], c: 0, f: 'O manual exige a separação, o que facilita conferir o limite compartilhado de 20%.' }
  ],
  resumo: [
    'O PUR é o planejamento do projeto no PPI 4.0.',
    'O manual verifica identificação, enquadramento técnico, custos, equipe e cronograma.',
    'Projetos acima de R$ 2 milhões anuais têm submissão à Suframa.',
    'Valores da coordenadora e da executora ficam separados.'
  ]
},
{
  id: 'm4a2', mod: 4, trilha: 'conv', tempo: '15 min',
  titulo: 'Plano de PD&I e instrumento do convênio direto',
  objetivo: 'Relacionar plano de PD&I, avaliação de mérito, alterações e instrumento do convênio direto aos artigos da Portaria 9.835/2022.',
  explicacao: [
    'O [[Plano de PD&I]] está nos arts. 14 e 15 da {{p9835|Portaria 9.835/2022}}. O formato e os elementos constam da {{p858|Portaria Suframa 858/2023}}, segundo o guia. Confirme no catálogo da Suframa a versão em uso.',
    'A avaliação de mérito e os indicadores estão nos arts. 16 a 21 e no Anexo I. A ficha de indicadores de resultados consta da {{p785|Portaria Suframa 785/2021}}.',
    'Alterações e revisão do plano ficam nos arts. 24 e 25. O art. 44 trata do convênio, dos repasses, da propriedade intelectual, do orçamento e dos aditivos (§§ 1º a 7º). O art. 42 prevê até 20% para despesas operacionais, administrativas e reserva.',
    'Atenção ao enquadramento: o art. 4º define, entre outros, desafio tecnológico e projeto rotineiro, e o art. 10, §§ 5º e 7º, trata do enquadramento e das atividades rotineiras de engenharia.'
  ],
  conceitos: [
    ['Plano de PD&I', 'Planejamento do convênio direto.'],
    ['Desafio tecnológico', 'Conceito do art. 4º usado no enquadramento.'],
    ['Projeto rotineiro', 'Conceito do art. 4º; veja também o art. 10.'],
    ['Aditivo', 'Instrumento para alterar o convênio.'],
    ['Reserva de PD&I', 'Parcela prevista junto aos custos operacionais e administrativos.']
  ],
  base: [['p9835', 'Arts. 4º, 10, 14, 15, 16 a 21, 24, 25, 42 e 44', 'legal'], ['p858', 'Formato e elementos do plano', 'legal'], ['p785', 'Ficha de indicadores', 'legal']],
  exemplo: 'Exemplo ilustrativo. A Empresa A e a Instituição B querem incluir uma nova entrega no meio do ano. Antes de agir, verificam as regras de alteração e revisão do plano (arts. 24 e 25) e a necessidade de aditivo do convênio (art. 44). Registram a decisão e a justificativa no dossiê do projeto. ((recom))',
  pratica: {
    situacao: 'Uma atividade proposta repete um procedimento de engenharia já conhecido, sem desafio tecnológico aparente. Que dispositivos você consulta para discutir o enquadramento?',
    resposta: 'Consulte as definições de desafio tecnológico e de projeto rotineiro (art. 4º) e o art. 10, §§ 5º e 7º, sobre enquadramento e atividades rotineiras de engenharia. A classificação final depende do texto oficial e da análise do caso.'
  },
  quiz: [
    { q: 'Quais artigos da Portaria 9.835/2022 tratam do plano de PD&I?', o: ['Arts. 14 e 15', 'Arts. 28 a 33', 'Arts. 45 a 48', 'Arts. 49 a 53'], c: 0, f: 'O plano de PD&I está nos arts. 14 e 15. Os arts. 28 a 33 tratam de RD e auditoria, e os arts. 45 a 48, de penalidades.' },
    { q: 'Alterações e revisão do plano estão em:', o: ['Arts. 24 e 25', 'Art. 40', 'Art. 43', 'Art. 57'], c: 0, f: 'Os arts. 24 e 25 tratam de alterações e revisão do plano.' },
    { q: 'O art. 42 da Portaria 9.835/2022 trata de:', o: ['Penalidades', 'Até 20% para despesas operacionais, administrativas e reserva', 'Prazo de guarda', 'Credenciamento de ICT'], c: 1, f: 'O art. 42 prevê até 20% para despesas operacionais, administrativas e reserva, nas condições da portaria.' }
  ],
  resumo: [
    'Plano de PD&I: arts. 14 e 15; mérito e indicadores: arts. 16 a 21 e Anexo I.',
    'Alterações do plano: arts. 24 e 25; convênio e aditivos: art. 44.',
    'Custos indiretos e reserva: até 20% (art. 42).',
    'Desafio tecnológico e projeto rotineiro: art. 4º.'
  ]
},
{
  id: 'm4a3', mod: 4, trilha: 'comum', tempo: '12 min',
  titulo: 'Propriedade intelectual e Lei de Inovação',
  objetivo: 'Explicar por que a titularidade dos resultados precisa constar do instrumento jurídico.',
  explicacao: [
    'A {{l10973|Lei 10.973/2004}} (Lei de Inovação), alterada pela Lei 13.243/2016, complementa o enquadramento em propriedade intelectual e bolsas.',
    'O financiamento pela empresa não define sozinho a [[Titularidade]] do software, da patente ou do conhecimento gerado. A distribuição precisa constar do [[Instrumento jurídico]]. O art. 9º, §§ 2º e 3º, trata de titularidade, exploração e participação nos resultados. ((legal))',
    'O art. 9º, §§ 1º e 4º, trata das [[Bolsa de estímulo à inovação|bolsas de estímulo à inovação]]. O art. 10 prevê despesas operacionais e administrativas.',
    'No PPI 4.0, a propriedade intelectual está no art. 30 da Res. 2/2020. No convênio direto, o convênio e a propriedade intelectual aparecem no art. 44 da Portaria 9.835/2022. No RD do PPI 4.0, o tópico IX trata de patentes e co-titularidade.'
  ],
  conceitos: [
    ['Titularidade', 'Quem é dono dos resultados; depende do instrumento.'],
    ['Instrumento jurídico', 'Onde a distribuição precisa estar escrita.'],
    ['Bolsa de estímulo à inovação', 'Prevista no art. 9º, §§ 1º e 4º.'],
    ['ICT', 'Definida no art. 2º, V.']
  ],
  base: [['l10973', 'Art. 2º, V; art. 9º, §§ 1º a 4º; art. 10', 'legal'], ['r2', 'Art. 30', 'legal'], ['p9835', 'Art. 44, §§ 1º a 7º', 'legal']],
  exemplo: 'Exemplo ilustrativo. O projeto desenvolve um software de monitoramento de linha. Antes de iniciar, a Instituição B e a Empresa A conferem se o convênio descreve quem será titular do software e como serão a exploração e a participação nos resultados. Sem essa previsão, o fato de a empresa ter financiado o projeto não define a titularidade por si só.',
  pratica: {
    situacao: 'Um gestor diz: "a empresa pagou o projeto, então o software é dela". Como você responde com base no guia?',
    resposta: 'O guia registra que o financiamento pela empresa não define sozinho a titularidade. A distribuição precisa constar do instrumento jurídico (Lei 10.973, art. 9º, §§ 2º e 3º). A resposta correta é conferir o que o convênio prevê.'
  },
  quiz: [
    { q: 'O financiamento do projeto pela empresa define, sozinho, a titularidade dos resultados?', o: ['Sim, sempre', 'Não, a distribuição precisa constar do instrumento jurídico', 'Sim, mas só para software', 'Não, a titularidade é sempre da ICT'], c: 1, f: 'O guia registra que o financiamento não define sozinho a titularidade e que a distribuição precisa constar do instrumento.' },
    { q: 'O art. 9º, §§ 1º e 4º, da Lei 10.973 trata de:', o: ['Bolsas de estímulo à inovação', 'Penalidades', 'Prazo de guarda', 'Credenciamento'], c: 0, f: 'Esses parágrafos tratam de bolsas de estímulo à inovação.' }
  ],
  resumo: [
    'A Lei 10.973/2004 complementa o enquadramento em propriedade intelectual e bolsas.',
    'O financiamento não define sozinho a titularidade.',
    'A distribuição dos resultados precisa estar no instrumento jurídico.'
  ]
},

/* ======================================================================= MÓDULO 5 */
{
  id: 'm5a1', mod: 5, trilha: 'comum', tempo: '16 min',
  titulo: 'Atividades de PD&I e dispêndios elegíveis',
  objetivo: 'Usar o Decreto 10.521/2020 e a norma da modalidade para decidir se uma despesa pode entrar no projeto.',
  explicacao: [
    'Duas perguntas orientam a análise: a atividade é PD&I (art. 21, I a VI, do {{d10521|Decreto 10.521}})? A despesa pertence a uma categoria elegível (art. 22, I a VI)? ((legal))',
    'O art. 22 traz condições em seus parágrafos: §§ 1º, 2º, 4º e 5º (equipamentos, cessões, infraestrutura e critérios de contabilização); §§ 3º e 13 (despesas administrativas, reserva e participação nas atividades principais); §§ 6º e 7º (intercâmbio); §§ 10 e 11 (outros dispêndios correlatos); § 12 (aptidão fabril para Indústria 4.0); §§ 8º e 9º (escrituração específica e guarda).',
    'No convênio direto, o art. 40 da {{p9835|Portaria 9.835/2022}} trata dos dispêndios, da documentação e dos pagamentos (§ 7º) e das exclusões (§ 9º). O {{man-rd|Manual de Análise do RD}} organiza a análise por [[Elegibilidade]], [[Pertinência]] e [[Adequação]] e chama a atenção para descrição genérica, falta de demonstração da aplicação no projeto e terceirização das atividades principais pela ICT.',
    'No PPI 4.0, as rubricas I a X da Planilha Financeira do CITS se relacionam aos dispêndios do art. 22, segundo uma relação proposta pelo guia ((interno)).',
    'Cuidado com referências antigas. A aba "Gastos não elegíveis" da Planilha Financeira cita o Decreto 6.008/2006. Confira sua vigência no Planalto antes de usá-lo como fundamento.'
  ],
  conceitos: [
    ['Dispêndio', 'Despesa contabilizável como investimento em PD&I.'],
    ['Elegibilidade', 'Critério de análise: a categoria de despesa pode ser contabilizada?'],
    ['Pertinência', 'Critério de análise: há relação com o projeto?'],
    ['Adequação', 'Critério de análise: registro e valor são compatíveis com o planejado?'],
    ['Rubrica', 'Categoria da planilha de prestação de contas.']
  ],
  base: [['d10521', 'Arts. 21 e 22', 'legal'], ['p9835', 'Art. 40, §§ 7º e 9º', 'legal'], ['man-rd', 'Seções 5.2, 5.3 e 7', 'recom'], ['d6008', 'Citado na Planilha; vigência a conferir', 'interno']],
  exemplo: 'Exemplo ilustrativo. A Instituição B quer lançar a compra de um equipamento no projeto. Ela identifica a categoria no art. 22, confere as condições dos §§ 1º, 2º, 4º e 5º (equipamentos, cessões, infraestrutura e critérios de contabilização), verifica se o documento fiscal descreve o item de modo a demonstrar a aplicação no projeto e reúne a documentação de pagamento. ((recom))',
  pratica: {
    situacao: 'A nota fiscal de um serviço técnico traz apenas a descrição "serviços técnicos". Qual risco o Manual de Análise do RD aponta e o que você reúne para reduzi-lo?',
    resposta: 'O manual trata de descrição genérica e de falta de demonstração da aplicação no projeto como pontos de atenção. Reúna documentos que mostrem a relação do serviço com as atividades do projeto, como contrato ou ordem de serviço e relatório de entrega. ((recom))'
  },
  quiz: [
    { q: 'O art. 21 do Decreto 10.521/2020 trata de:', o: ['Atividades reconhecidas como PD&I', 'Penalidades', 'Guarda documental', 'Credenciamento de ICT'], c: 0, f: 'O art. 21, I a VI, lista as atividades reconhecidas como PD&I. As categorias de dispêndio estão no art. 22.' },
    { q: 'O art. 22 do mesmo decreto trata de:', o: ['Categorias de dispêndios elegíveis e suas condições', 'Somente de penalidades', 'Apenas de relatórios', 'Do prazo do convênio'], c: 0, f: 'O art. 22 traz as categorias de dispêndios elegíveis e, em seus parágrafos, as condições de contabilização.' },
    { q: 'Um ponto de atenção do Manual de Análise do RD é:', o: ['Descrição genérica e falta de demonstração da aplicação no projeto', 'Pagamento em reais', 'Contratação de bolsistas', 'Uso de conta bancária'], c: 0, f: 'O manual aponta descrição genérica, falta de demonstração da aplicação no projeto e terceirização das atividades principais pela ICT.' }
  ],
  resumo: [
    'Duas perguntas: é PD&I (art. 21)? A despesa está numa categoria elegível (art. 22)?',
    'Os parágrafos do art. 22 trazem as condições.',
    'No convênio direto, veja o art. 40 da Portaria 9.835/2022 e o Manual de Análise do RD.',
    'Confira a vigência de referências antigas, como o Decreto 6.008/2006, no Planalto.'
  ]
},
{
  id: 'm5a2', mod: 5, trilha: 'comum', tempo: '12 min',
  titulo: 'Limites de 20% e outros percentuais',
  objetivo: 'Explicar por que os percentuais de 20% não se somam e como funciona o limite compartilhado no PPI 4.0.',
  explicacao: [
    'Há limites para despesas administrativas e reserva, para outros correlatos, para intercâmbio e para infraestrutura. Cada um tem base e condição próprias e eles não se somam como margem livre do orçamento. ((legal))',
    'No convênio direto, o art. 42 da {{p9835|Portaria 9.835/2022}} prevê até 20% para despesas operacionais, administrativas e reserva. No PPI 4.0, o art. 43 da {{r2|Res. 2/2020}} considera em conjunto as parcelas da coordenadora e da executora.',
    'Na Planilha Financeira do CITS, a aba Valores previstos Iniciais usa 5% (executora) mais 15% (coordenadora), totalizando 20% ((interno)). É uma forma de dividir o limite compartilhado e vale para aquele modelo.',
    'Outros dispositivos relacionados: Lei 8.387, § 21 (despesas operacionais, administrativas e reserva nos convênios) e § 28 (infraestrutura e laboratórios, com limite legal); Decreto 10.521, art. 22, §§ 3º e 13; Lei 10.973, art. 10.'
  ],
  conceitos: [
    ['Custos indiretos', 'Despesas operacionais e administrativas.'],
    ['Reserva de PD&I', 'Parcela que acompanha o limite de custos indiretos.'],
    ['Rubrica', 'Cada limite se aplica à sua rubrica e condição.'],
    ['Coordenadora', 'Divide o limite compartilhado com a executora no PPI 4.0.']
  ],
  base: [['l8387', '§ 21 e § 28', 'legal'], ['d10521', 'Art. 22, §§ 3º e 13', 'legal'], ['p9835', 'Art. 42', 'legal'], ['r2', 'Art. 43, §§ 1º e 2º', 'legal']],
  exemplo: 'Exemplo ilustrativo, baseado no modelo da Planilha Financeira do CITS (procedimento da coordenadora, sem valor de regra legal universal). Em um projeto do PPI 4.0, a coordenadora prevê 15% e a executora 5% para custos indiretos e reserva, e o conjunto fecha em 20%. Se a executora aumentar a sua parcela sem ajustar a da coordenadora, o limite compartilhado pode ser ultrapassado.',
  pratica: {
    situacao: 'A equipe propõe usar 20% para custos indiretos e mais 20% para outros correlatos e infraestrutura, "porque cada limite é de 20%". O que precisa ser corrigido?',
    resposta: 'Os limites têm finalidades, bases e condições diferentes e não formam uma margem livre que se soma. Cada um deve ser conferido no dispositivo próprio, por exemplo o art. 22, §§ 3º e 13, do Decreto; o art. 42 da Portaria; o art. 43 da Res. 2/2020.'
  },
  quiz: [
    { q: 'No PPI 4.0, o art. 43 da Res. 2/2020 considera:', o: ['Só a parcela da executora', 'As parcelas da coordenadora e da executora em conjunto', 'Só a parcela da coordenadora', 'Nenhuma parcela'], c: 1, f: 'O art. 43, §§ 1º e 2º, trata do limite compartilhado de 20% entre as parcelas da coordenadora e da executora.' },
    { q: 'A divisão 5% (executora) e 15% (coordenadora) na Planilha Financeira do CITS é:', o: ['Exigência legal universal', 'Procedimento do modelo da coordenadora para dividir o limite de 20%', 'Regra da Lei 8.387', 'Recomendação do Decreto 10.521'], c: 1, f: 'O guia descreve a divisão como o que a aba Valores previstos Iniciais usa. Trate-a como procedimento da coordenadora, e confira o instrumento do projeto.' },
    { q: 'Os percentuais de 20% de finalidades diferentes:', o: ['Somam-se como margem livre', 'Têm base e condição próprias, e cada um deve ser conferido no seu dispositivo', 'São todos idênticos', 'Valem só para o convênio direto'], c: 1, f: 'O guia alerta que os limites têm finalidades diferentes e não se somam como margem livre do orçamento.' }
  ],
  resumo: [
    'Cada limite tem base e condição próprias.',
    'Convênio direto: até 20% (art. 42 da Portaria). PPI 4.0: limite compartilhado (art. 43 da Res. 2/2020).',
    'A divisão 5% mais 15% é do modelo do CITS.'
  ]
},
{
  id: 'm5a3', mod: 5, trilha: 'ppi', tempo: '14 min',
  titulo: 'Conta específica, aportes, rendimentos e saldos',
  objetivo: 'Relacionar conta específica, aportes, rendimentos e destinação de saldos aos dispositivos da Res. 2/2020.',
  explicacao: [
    'A {{r2|Res. CAPDA 2/2020}} trata da [[Conta específica]], da contabilidade e da guarda por dez anos (art. 15, VII a IX); das aplicações financeiras e [[Rendimento|rendimentos]] (art. 16); dos [[Aporte|aportes]] e sua destinação (art. 17); da destinação de [[Saldo|saldos]] (art. 45); e das contratações e taxas bancárias (arts. 47 e 48). ((legal))',
    'Na rotina do CITS, o guia relaciona esses artigos a ferramentas: Conciliação Bancária da conta do projeto; Posição Financeira, linhas 65 a 68 (aportes) e 70 a 72 (rendimentos); e Termo de Encerramento (saldo final de devolução). ((interno)) Essa relação é proposta pelo guia e depende do modelo vigente.',
    'Na prestação de contas, cada aporte depende da prestação de contas da competência ((contratual)). O item 9 do Roteiro pede a nota fiscal e o comprovante do aporte.'
  ],
  conceitos: [
    ['Conta específica', 'Conta exclusiva do projeto, com contabilidade própria.'],
    ['Aporte', 'Valor repassado para executar o projeto.'],
    ['Rendimento', 'Ganho de aplicação financeira dos recursos.'],
    ['Conciliação bancária', 'Compara extrato e lançamentos antes de prestar contas.'],
    ['Saldo', 'Valor remanescente no encerramento.'],
    ['Termo de Encerramento', 'Documento do modelo CITS que registra o saldo final.']
  ],
  base: [['r2', 'Art. 15, VII a IX; arts. 16, 17, 45, 47 e 48', 'legal'], ['man-cits', 'Roteiro e planilhas do CITS (sem link público)', 'interno']],
  exemplo: 'Exemplo ilustrativo. No fim do mês, a Instituição B concilia o extrato da conta específica com os lançamentos do projeto. O rendimento da aplicação aparece em linha própria da planilha. Ao encerrar o projeto, o saldo final segue a regra de destinação do art. 45 e é registrado no termo de encerramento do modelo do CITS.',
  pratica: {
    situacao: 'O extrato mostra rendimento de aplicação financeira que não está nos lançamentos do projeto. O que você verifica?',
    resposta: 'O art. 16 trata de aplicações financeiras e rendimentos. Registre o rendimento na linha apropriada da planilha (no modelo do CITS, Posição Financeira, linhas 70 a 72) e refaça a conciliação. Se a diferença persistir, investigue antes de enviar a prestação de contas. ((recom))'
  },
  quiz: [
    { q: 'Qual dispositivo da Res. CAPDA 2/2020 trata da conta específica e da guarda por dez anos?', o: ['Art. 15, VII a IX', 'Art. 17', 'Art. 45', 'Art. 49'], c: 0, f: 'O art. 15, VII a IX, trata de conta específica, contabilidade e guarda documental de dez anos. O art. 17 trata de aportes e o art. 45, de saldos.' },
    { q: 'Rendimentos de aplicações financeiras são tratados no:', o: ['Art. 16', 'Art. 30', 'Art. 43', 'Art. 48'], c: 0, f: 'O art. 16 trata de aplicações financeiras e rendimentos.' },
    { q: 'O Termo de Encerramento do modelo do CITS registra:', o: ['O saldo final de devolução', 'A lista de bolsistas', 'O plano de PD&I', 'O credenciamento da ICT'], c: 0, f: 'O guia relaciona o art. 45 (destinação de saldos) ao saldo final de devolução do Termo de Encerramento.' }
  ],
  resumo: [
    'Conta específica, contabilidade e guarda: art. 15, VII a IX.',
    'Rendimentos: art. 16. Aportes: art. 17. Saldos: art. 45.',
    'As linhas da planilha do CITS são procedimento da coordenadora.'
  ]
},

/* ======================================================================= MÓDULO 6 */
{
  id: 'm6a1', mod: 6, trilha: 'ppi', tempo: '15 min',
  titulo: 'Prestação de contas no PPI 4.0',
  objetivo: 'Separar o que a resolução exige do que a coordenadora define na cadência e nos documentos da prestação de contas.',
  explicacao: [
    'A {{r2|Res. 2/2020}}, art. 15, III, fala em relatórios semestrais ou em prazo menor solicitado. Os arts. 31 a 35 tratam do acompanhamento e os arts. 36 a 39, da prestação de contas e do julgamento. ((legal))',
    'No CITS, a prestação é mensal por competência, e cada aporte depende da prestação de contas da competência. Isso consta das orientações da coordenadora e do convênio ((contratual)).',
    'O material de referência cita documentos recorrentes, como a Declaração de Inexistência de Impedimento (semestral, Roteiro 22.1) e a Declaração de Guarda (Roteiros 21.2 e 22.2) ((interno)). Trate-os como itens do modelo da coordenadora e confirme a versão vigente.',
    'O {{man-cits|Manual do prestador de contas do CITS}} não tem versão pública verificada. Vale o manual efetivamente entregue à executora, na versão vinculada ao convênio.',
    'O prazo da empresa ou da coordenadora perante a Suframa pode ser diferente do prazo da executora.'
  ],
  conceitos: [
    ['Competência', 'Mês de referência da prestação mensal.'],
    ['Aporte', 'Depende da prestação de contas da competência no modelo CITS.'],
    ['Declaração de Guarda', 'Item recorrente do roteiro do CITS.'],
    ['Termo de Encerramento', 'Fecha o projeto no modelo CITS.']
  ],
  base: [['r2', 'Art. 15, III; arts. 31 a 39', 'legal'], ['r30', 'Art. 6º (impedimentos)', 'legal'], ['man-cits', 'Orientações e Fluxo_Roteiro R6', 'contratual']],
  exemplo: 'Exemplo ilustrativo. A Instituição B recebe do CITS o calendário mensal. No fechamento de cada competência, ela reúne os comprovantes, concilia a conta e envia o pacote. O aporte seguinte depende dessa prestação. Em paralelo, mantém no controle documental as declarações semestrais pedidas pelo roteiro.',
  pratica: {
    situacao: 'Um colega afirma que a Res. 2/2020 exige prestação de contas mensal. Ele está correto?',
    resposta: 'A resolução fala em relatórios semestrais ou em prazo menor solicitado (art. 15, III). A cadência mensal por competência consta das orientações da coordenadora e do convênio. Trate-a como obrigação contratual ou procedimento da coordenadora e cite a fonte correta.'
  },
  quiz: [
    { q: 'Qual a base da cadência mensal por competência na prática do CITS?', o: ['Art. 2º da Lei 8.387', 'Orientações da coordenadora e convênio, dentro da regra de "prazo menor solicitado"', 'Decreto 10.521', 'Portaria 347/2020'], c: 1, f: 'A resolução permite relatórios em prazo menor solicitado, e a cadência mensal vem das orientações e do convênio. É obrigação contratual ou procedimento da coordenadora.' },
    { q: 'Existe versão pública verificada do Manual do prestador de contas do CITS?', o: ['Sim, no Planalto', 'Sim, no DOU', 'Não, vale o manual entregue à executora na versão vinculada ao convênio', 'Sim, no site da Suframa'], c: 2, f: 'O guia registra uma lacuna: não há versão pública verificada. Solicite a versão vigente ao CITS.' },
    { q: 'Os arts. 36 a 39 da Res. 2/2020 tratam de:', o: ['Prestação de contas e julgamento', 'Startups', 'Propriedade intelectual', 'Taxas bancárias'], c: 0, f: 'Os arts. 36 a 39 tratam de prestação de contas e julgamento. Propriedade intelectual está no art. 30.' }
  ],
  resumo: [
    'A resolução fala em relatórios semestrais ou em prazo menor solicitado.',
    'A cadência mensal por competência vem do CITS e do convênio.',
    'Sem manual público do CITS, vale a versão entregue à executora.',
    'Separe sempre: exigência legal, obrigação contratual e procedimento da coordenadora.'
  ]
},
{
  id: 'm6a2', mod: 6, trilha: 'conv', tempo: '15 min',
  titulo: 'RD, auditoria e contestação no convênio direto',
  objetivo: 'Entender o ciclo do RD no convênio direto e o papel da executora ao fornecer insumos.',
  explicacao: [
    'Os arts. 28 a 33 da {{p9835|Portaria 9.835/2022}} tratam do [[RD]], da auditoria, da análise, da contestação e do recurso. O RD é da empresa, e a executora fornece os insumos. ((legal))',
    'O {{man-rd|Manual de Análise do RD v1.1}} organiza a análise por elegibilidade, pertinência e adequação. Úteis: seção 5.2 (projetos conveniados), 5.3 (ICTs públicas) e 7 (dispêndios). Ele é anterior à Portaria 9.835/2022.',
    'Entre as atualizações do catálogo da Suframa, a {{pc2|Portaria Conjunta 2/2026}} altera a Portaria 254/2022 sobre relatório consolidado e parecer conclusivo da auditoria. É relevante para a empresa e a auditoria, e a executora fornece os insumos.',
    'A {{pc4|Portaria Conjunta 4/2026}} trata do enquadramento dos investimentos de elevação de maturidade produtiva em Indústria 4.0. Verifique se a modalidade do projeto é a de maturidade fabril antes de aplicá-la. Ter "Indústria 4.0" no título do projeto não torna aplicáveis todas as regras dessa modalidade.'
  ],
  conceitos: [
    ['RD', 'Relatório da empresa sobre os investimentos.'],
    ['Auditoria independente', 'Verifica relatórios e documentação.'],
    ['Diligência', 'Pedido de esclarecimento durante a análise.'],
    ['Elegibilidade', 'Primeiro critério do manual de análise.']
  ],
  base: [['p9835', 'Arts. 28 a 33', 'legal'], ['l8387', 'Art. 2º, § 7º, I e II', 'legal'], ['man-rd', 'Seções 5.2, 5.3 e 7', 'recom'], ['pc2', 'Altera a Portaria 254/2022', 'legal'], ['pc4', 'Maturidade fabril', 'legal']],
  exemplo: 'Exemplo ilustrativo. A auditoria da Empresa A pede esclarecimentos sobre uma despesa. A Instituição B responde com o documento fiscal, o comprovante de pagamento e a demonstração da relação com o projeto, citando o dispositivo da norma aplicável e o link do texto oficial. A resposta é enviada pelo canal definido no convênio.',
  pratica: {
    situacao: 'O título do seu projeto contém "Indústria 4.0". A equipe quer aplicar as regras da Portaria Conjunta 4/2026. Qual verificação vem antes?',
    resposta: 'Verifique se a modalidade do projeto é a de elevação de maturidade produtiva em Indústria 4.0. O título sozinho não torna aplicáveis todas as regras dessa modalidade. Confirme no texto oficial da portaria e no instrumento do projeto.'
  },
  quiz: [
    { q: 'Quais artigos da Portaria 9.835/2022 tratam de RD, auditoria, análise, contestação e recurso?', o: ['Arts. 28 a 33', 'Arts. 4º a 9º', 'Arts. 45 a 48', 'Art. 54'], c: 0, f: 'Os arts. 28 a 33 tratam de RD, auditoria, análise, contestação e recurso.' },
    { q: 'No ciclo do RD, o papel da executora é:', o: ['Elaborar sozinha o RD da empresa', 'Fornecer os insumos', 'Realizar a auditoria', 'Julgar a contestação'], c: 1, f: 'O RD é da empresa. A executora fornece os insumos, segundo o guia.' },
    { q: 'Ter "Indústria 4.0" no título do projeto:', o: ['Torna aplicáveis todas as regras da modalidade de maturidade fabril', 'Não torna, por si só, aplicáveis todas as regras dessa modalidade', 'Dispensa a Portaria 9.835', 'Revoga o plano de PD&I'], c: 1, f: 'O guia alerta que o título, por si só, não torna aplicáveis todas as regras da modalidade de maturidade fabril.' }
  ],
  resumo: [
    'Arts. 28 a 33 da Portaria 9.835/2022: RD, auditoria, análise, contestação e recurso.',
    'A executora fornece os insumos do RD da empresa.',
    'Acompanhe o catálogo da Suframa e verifique a modalidade antes de aplicar atos novos.'
  ]
},
{
  id: 'm6a3', mod: 6, trilha: 'comum', tempo: '13 min',
  titulo: 'Documentação comprobatória e dossiê por projeto',
  objetivo: 'Organizar a documentação de cada projeto de modo que seja possível comprovar enquadramento, execução e encerramento.',
  explicacao: [
    'Cada despesa precisa de documentação que a ligue ao projeto. No convênio direto, o art. 40, § 7º, da {{p9835|Portaria 9.835/2022}} trata de documentação e pagamentos. No PPI 4.0, o item 9 do Roteiro pede a nota fiscal e o comprovante do aporte ((interno)).',
    'O guia recomenda uma pasta de enquadramento para cada projeto ((recom)), com cinco grupos: <b>Enquadramento</b> (modalidade, ano-base, credenciamento, normas aplicáveis e aprovações); <b>Instrumentos</b> (convênio, PUR ou plano, orçamento, aditivos e autorizações); <b>Execução técnica</b> (atividades, entregas, testes, resultados e justificativas de alterações); <b>Execução financeira</b> (documentos fiscais, pagamentos, conciliação, RH e critérios de rateio); <b>Encerramento</b> (relatórios, bens, saldos, propriedade intelectual e respostas às diligências).',
    'Para fechar a lista de normas de cada projeto, reúna: natureza jurídica da executora e ato de credenciamento no CAPDA; ano-base; convênio e PUR assinados, com aditivos; versão do manual de prestação de contas entregue pelo CITS.',
    'O dossiê é uma recomendação de organização e não uma lista legal única.'
  ],
  conceitos: [
    ['Dossiê por projeto', 'Pasta organizada em cinco grupos.'],
    ['Diligência', 'Quando chega, o dossiê permite responder com rapidez.'],
    ['Rateio', 'O critério adotado deve estar documentado.'],
    ['Instrumento jurídico', 'Convênio, PUR, plano e aditivos.']
  ],
  base: [['p9835', 'Art. 40, § 7º; arts. 49 a 53', 'legal'], ['d10521', 'Art. 22, §§ 8º e 9º', 'legal'], ['r2', 'Art. 15, VII a IX', 'legal']],
  exemplo: 'Exemplo ilustrativo. A Instituição B cria, para cada projeto, as cinco pastas do dossiê. Quando a coordenadora pede esclarecimento sobre uma despesa de RH, ela localiza em Execução financeira a folha, o critério de rateio e as evidências de dedicação, e em Instrumentos o trecho do convênio que trata do tema. A resposta sai com o documento e o fundamento.',
  pratica: {
    situacao: 'Em qual dos cinco grupos do dossiê você guardaria: (a) o aditivo que prorrogou o prazo; (b) o critério de rateio de horas; (c) o relatório de testes de um protótipo?',
    resposta: '(a) Instrumentos, junto ao convênio e demais aditivos. (b) Execução financeira, com RH e rateio. (c) Execução técnica, com entregas, testes e resultados. A organização é recomendação operacional, e cada instituição pode adaptá-la.'
  },
  quiz: [
    { q: 'O dossiê por projeto é:', o: ['Exigência legal universal', 'Recomendação de organização do guia', 'Obrigação do Decreto 10.521', 'Procedimento exclusivo do CITS'], c: 1, f: 'O guia apresenta o dossiê como recomendação de organização do material de referência e afirma que não é uma lista legal única.' },
    { q: 'Em qual grupo do dossiê ficam documentos fiscais e conciliação?', o: ['Enquadramento', 'Execução técnica', 'Execução financeira', 'Encerramento'], c: 2, f: 'Execução financeira reúne documentos fiscais, pagamentos, conciliação, RH e critérios de rateio.' },
    { q: 'Para fechar a lista de normas de um projeto, qual informação NÃO consta entre as indicadas pelo guia?', o: ['Natureza jurídica da executora', 'Ano-base', 'Convênio e PUR assinados com aditivos', 'Cor do logotipo da empresa'], c: 3, f: 'O guia indica natureza jurídica e credenciamento, ano-base, convênio e PUR com aditivos e versão do manual entregue pelo CITS.' }
  ],
  resumo: [
    'Toda despesa precisa de documentação que a ligue ao projeto.',
    'Cinco grupos: enquadramento, instrumentos, execução técnica, execução financeira e encerramento.',
    'O dossiê é recomendação operacional.',
    'Reúna natureza jurídica, ano-base, instrumentos e versão do manual de cada projeto.'
  ]
}
);
