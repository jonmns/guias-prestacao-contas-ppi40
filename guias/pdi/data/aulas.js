/*
 * Currículo: módulos, registro de normas e aulas dos módulos 1 a 3.
 *
 * Convenções de texto (processadas por rich() em app.js):
 *   [[Termo]] ou [[Termo|rótulo]]   abre o glossário
 *   {{id|rótulo}}                   link para a norma na biblioteca (id do registro PDI.normas)
 *   ((legal)) ((contratual)) ((interno)) ((recom))   etiqueta de natureza da exigência
 *
 * Campos de cada aula:
 *   id, mod, trilha ('comum' | 'ppi' | 'conv'), titulo, tempo, objetivo,
 *   explicacao[], conceitos[[termo, contexto]], base[[idNorma, dispositivos, natureza]],
 *   exemplo, pratica{situacao, resposta}, quiz[{q, o[], c, f, caso?}], resumo[]
 */
window.PDI = window.PDI || {};

PDI.modulos = [
  { n: 1, titulo: 'Fundamentos de PD&I e Lei de Informática', resumo: 'Por que existem os projetos, quem é quem e o papel da executora.' },
  { n: 2, titulo: 'Modalidades: PPI 4.0 e convênio direto', resumo: 'Partes, instrumentos e normas de cada caminho.' },
  { n: 3, titulo: 'Hierarquia normativa e dispositivos legais', resumo: 'Da lei ao manual, e como ler normas alteradas.' },
  { n: 4, titulo: 'Planejamento, convênios e PUR', resumo: 'PUR, plano de PD&I, aditivos e propriedade intelectual.' },
  { n: 5, titulo: 'Execução financeira e elegibilidade de despesas', resumo: 'O que pode entrar no projeto, limites de 20%, conta, aportes e saldos.' },
  { n: 6, titulo: 'Prestação de contas e documentação comprobatória', resumo: 'Cadência, relatórios, auditoria e dossiê de documentos.' },
  { n: 7, titulo: 'Auditoria, guarda documental e obrigações', resumo: 'Prazos de guarda, credenciamento, penalidades e atualizações.' },
  { n: 8, titulo: 'Aplicações práticas, estudos de caso e revisão', resumo: 'Casos de RH, rateio, conciliação, despesas e prestação de contas.' }
];

/* Registro de normas. Se houver "card", o link oficial é lido do cartão da biblioteca (fonte única).
   Se houver "url", ele tem prioridade. Os endereços abaixo são os mesmos já citados na página. */
PDI.normas = {
  l8387: { nome: 'Lei 8.387/1991', card: 'n-l8387' },
  d10521: { nome: 'Decreto 10.521/2020', card: 'n-d10521' },
  p9835: { nome: 'Portaria Conjunta 9.835/2022', card: 'n-p9835' },
  r9: { nome: 'Res. CAPDA 9/2019', card: 'n-r9' },
  r2: { nome: 'Res. CAPDA 2/2020', card: 'n-r2' },
  r5: { nome: 'Res. CAPDA 5/2010', card: 'n-r5' },
  p347: { nome: 'Portaria Conjunta 347/2020', card: 'n-p347' },
  l10973: { nome: 'Lei 10.973/2004', card: 'n-l10973' },
  r30: { nome: 'Res. CAPDA 30/2022', card: 'n-r2', url: 'https://www.in.gov.br/en/web/dou/-/resolucao-capda/me-n-30-de-14-de-setembro-de-2022-429349373' },
  'man-rd': { nome: 'Manual de Análise do RD v1.1', card: 'man-rd' },
  'man-pur': { nome: 'Manual de Análise do PUR', card: 'man-pur' },
  'man-res': { nome: 'Manual do Relatório de Resultados', card: 'man-res' },
  'man-cits': { nome: 'Manual do prestador de contas do CITS', card: 'man-cits', semLink: true },
  p858: { nome: 'Portaria Suframa 858/2023', card: 'atualizacoes', url: 'https://www.in.gov.br/en/web/dou/-/portaria-suframa-n-858-de-31-de-maio-de-2023-487078004' },
  p785: { nome: 'Portaria Suframa 785/2021', card: 'atualizacoes', url: 'https://www.in.gov.br/en/web/dou/-/portaria-suframa-n-785-de-27-de-setembro-de-2021-349992079' },
  pc2: { nome: 'Portaria Conjunta MDIC/Suframa 2/2026', card: 'atualizacoes', url: 'https://www.in.gov.br/web/dou/-/portaria-conjunta-mdic/suframa-n-2-de-11-de-maio-de-2026-711114641' },
  pc4: { nome: 'Portaria Conjunta MDIC/Suframa 4/2026', card: 'atualizacoes', url: 'https://www.in.gov.br/web/dou/-/portaria-conjunta-mdic/suframa-n-4-de-6-de-julho-de-2026-717755409' },
  d6008: { nome: 'Decreto 6.008/2006 (vigência a conferir)', card: 'lacunas', url: 'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/decreto/d6008.htm' },
  cat: { nome: 'Catálogo de normativos (Suframa)', card: 'manuais', url: 'https://www.gov.br/suframa/pt-br/assuntos/pdi/legislacao/normativos' }
};

PDI.aulas = [];

PDI.aulas.push(

/* ======================================================================= MÓDULO 1 */
{
  id: 'm1a1', mod: 1, trilha: 'comum', tempo: '15 min',
  titulo: 'Da Lei de Informática ao projeto da executora',
  objetivo: 'Explicar por que existem projetos de PD&I financiados com recursos da Lei de Informática e qual é o papel da instituição executora.',
  explicacao: [
    'A <b>Lei de Informática da Zona Franca de Manaus</b> (Lei 8.387/1991, art. 2º) concede benefícios fiscais a bens e serviços de [[TIC]] industrializados na [[ZFM]] (caput e § 1º). Em contrapartida, a empresa beneficiária tem a obrigação anual de investir em [[PD&I]]. A regra geral é de 5% sobre a base legal (§ 3º). ((legal))',
    'Esse investimento pode ser feito de formas diferentes. Duas delas aparecem neste guia: o <b>convênio direto</b> com uma [[ICT]] (§ 4º, I e VI) e o <b>programa prioritário</b> definido pelo [[CAPDA]] (§ 4º, IV), como o [[PPI 4.0]].',
    'A <b>instituição executora</b> realiza as atividades do projeto e presta contas do uso dos recursos. Os dispositivos da lei não concedem isenção tributária à executora. Ela recebe recursos para executar e responde pela comprovação.',
    'A rotina do analista de P&D gira em torno de duas perguntas: o que conta como PD&I e quais despesas podem ser pagas com os recursos (Decreto 10.521/2020), e como a prestação de contas deve ser feita na modalidade do projeto.'
  ],
  conceitos: [
    ['ZFM', 'Local em que as empresas industrializam os bens de TIC que geram o benefício fiscal.'],
    ['PD&I', 'Tipo de atividade que a empresa precisa financiar para cumprir a obrigação.'],
    ['ICT', 'Instituição que pode firmar convênio para executar projetos de PD&I.'],
    ['Empresa incentivada', 'Quem recebe o benefício fiscal e tem a obrigação de investir.'],
    ['Executora', 'Quem executa o projeto e presta contas dos recursos recebidos.']
  ],
  base: [['l8387', 'Caput e § 1º; § 3º; § 4º, I, IV e VI', 'legal'], ['d10521', 'Arts. 21 e 22', 'legal']],
  exemplo: 'Exemplo ilustrativo. A Empresa A fabrica produtos de TIC na ZFM e tem obrigação anual de investir em PD&I. Ela aplica parte do valor em um projeto de automação industrial executado pela Instituição B, uma ICT credenciada. A Instituição B recebe os recursos, executa as atividades de pesquisa e reúne os documentos que comprovam cada despesa. A Empresa A depende desses dados para o seu relatório, e a executora fornece os insumos.',
  pratica: {
    situacao: 'Uma colega afirma que, como a instituição executora participa do projeto, ela também passa a ter direito ao benefício fiscal da Lei de Informática. Como você responde?',
    resposta: 'Os dispositivos da lei vinculam o benefício fiscal à empresa beneficiária e à obrigação de investir em PD&I. A executora recebe recursos para executar o projeto, mas esses dispositivos não lhe concedem isenção tributária (Lei 8.387/1991, art. 2º). Em caso de dúvida, o ponto de partida é o texto compilado da lei no site do Planalto.'
  },
  quiz: [
    { q: 'Segundo o art. 2º, § 3º, da Lei 8.387, quem tem a obrigação anual de investir em PD&I?', o: ['A instituição executora do projeto', 'A empresa beneficiária dos incentivos fiscais', 'A Suframa', 'O CAPDA'], c: 1, f: 'A obrigação acompanha o benefício fiscal da empresa, com regra geral de 5% sobre a base legal. A executora recebe recursos para realizar o projeto e não recebe a isenção.' },
    { q: 'Qual alternativa descreve o papel da instituição executora?', o: ['Recebe o benefício fiscal da empresa', 'Executa as atividades do projeto e presta contas do uso dos recursos', 'Define os programas prioritários', 'Fixa o percentual de investimento'], c: 1, f: 'A executora realiza as atividades e comprova o uso dos recursos. Programas prioritários são definidos pelo CAPDA e o percentual consta da lei.' },
    { q: 'O PPI 4.0 e o convênio direto são, em relação ao art. 2º, § 4º, da Lei 8.387:', o: ['Normas que substituem a lei', 'Caminhos diferentes para aplicar a obrigação de investir', 'Duas formas de chamar a mesma modalidade', 'Exigências apenas para ICTs públicas'], c: 1, f: 'O § 4º lista formas de aplicação: convênios com ICTs (incisos I e VI) e programas prioritários do CAPDA (inciso IV). Cada caminho tem norma operacional e instrumento próprios.' }
  ],
  resumo: [
    'A Lei 8.387/1991 liga o benefício fiscal da empresa à obrigação de investir em PD&I.',
    'O investimento pode ocorrer por convênio com ICT (convênio direto) ou por programa prioritário (como o PPI 4.0).',
    'A executora recebe recursos, executa o projeto e presta contas. Ela não recebe a isenção.',
    'O Decreto 10.521/2020 diz o que é PD&I e quais dispêndios são elegíveis.'
  ]
},

/* ======================================================================= MÓDULO 2 */
{
  id: 'm2a1', mod: 2, trilha: 'comum', tempo: '12 min',
  titulo: 'As duas modalidades lado a lado',
  objetivo: 'Distinguir convênio direto e PPI 4.0 quanto a partes, instrumento, norma operacional e prestação de contas.',
  explicacao: [
    'Contrato de prestação de serviços, convênio com ICT e projeto de programa prioritário são instrumentos diferentes. A executora deve registrar em qual modalidade cada projeto está enquadrado.',
    'No <b>convênio direto</b>, as partes são a empresa incentivada e a ICT credenciada. O instrumento é o convênio, com repasses, recursos estimados e propriedade intelectual. A norma operacional é a {{p9835|Portaria Conjunta 9.835/2022}}.',
    'No <b>PPI 4.0</b>, as partes são a empresa investidora, a coordenadora ([[CITS]]) e a executora. Os instrumentos são o convênio de cooperação e o [[PUR]]. As normas centrais são as {{r9|Resoluções CAPDA 9/2019}}, {{r2|2/2020}} e {{r30|30/2022}}.',
    'Na prestação de contas, o convênio direto trabalha com o [[RD]] da empresa, auditoria, análise e contestação. No PPI 4.0, a resolução fala em relatórios semestrais ou em prazo menor pedido pela coordenadora. No CITS, a prática é mensal por competência ((interno)).',
    'Use a ferramenta <a href="#/comparar">Comparar modalidades</a> para ver todos os aspectos em colunas.'
  ],
  conceitos: [
    ['Convênio direto', 'Caminho em que o convênio é firmado diretamente entre empresa e ICT.'],
    ['Programa prioritário', 'Caminho em que o projeto integra um programa definido pelo CAPDA.'],
    ['PUR', 'Instrumento de planejamento do PPI 4.0.'],
    ['Coordenadora', 'Entidade que coordena o programa e recebe a prestação de contas da executora.'],
    ['RD', 'Relatório da empresa no convênio direto.']
  ],
  base: [['l8387', 'Art. 2º, § 4º, I, IV e VI', 'legal'], ['p9835', 'Norma operacional do convênio direto', 'legal'], ['r2', 'Art. 15, III; art. 43', 'legal'], ['r9', 'Art. 6º', 'legal']],
  exemplo: 'Exemplo ilustrativo. A Instituição B executa dois projetos: um em convênio direto com a Empresa A e outro no PPI 4.0, coordenado pelo CITS. No primeiro, ela fornece insumos para o RD da empresa e para a auditoria. No segundo, ela presta contas à coordenadora, na cadência definida pelo convênio e pelo manual do CITS. Cada projeto tem a sua pasta de enquadramento.',
  pratica: {
    situacao: 'Você recebe o convênio de um projeto novo. Quais informações registra primeiro para saber que normas consultar?',
    resposta: 'Registre a modalidade, o ano-base e o instrumento assinado, com aditivos. O guia indica que a lista de normas de um projeto depende da natureza jurídica da executora, do ano-base, do instrumento e da versão do manual de prestação de contas adotado.'
  },
  quiz: [
    { q: 'Quais são as partes típicas do PPI 4.0 segundo o guia?', o: ['Empresa incentivada e ICT credenciada', 'Empresa investidora, coordenadora e executora', 'Apenas a Suframa e a executora', 'Fundação de apoio e NIT'], c: 1, f: 'No PPI 4.0 há três partes: empresa investidora, coordenadora (CITS) e executora. A primeira alternativa descreve o convênio direto.' },
    { q: 'Qual é a norma operacional do convênio direto para obrigações a partir do ano-base 2024?', o: ['Resolução CAPDA 2/2020', 'Portaria Conjunta ME/Suframa 9.835/2022', 'Resolução CAPDA 9/2019', 'Lei 10.973/2004'], c: 1, f: 'A Portaria 9.835/2022 é a referência operacional do convênio direto e se aplica a partir do ano-base 2024 (art. 57).' },
    { q: 'No PPI 4.0, a Res. CAPDA 2/2020 (art. 15, III) fala em:', o: ['RD anual com auditoria da empresa', 'Relatórios semestrais ou em prazo menor solicitado', 'Dispensa de prestação de contas', 'Apenas termo de encerramento'], c: 1, f: 'O art. 15, III, trata de relatórios semestrais ou em prazo menor solicitado. A cadência mensal por competência é prática do CITS, definida no convênio e nas orientações da coordenadora.' }
  ],
  resumo: [
    'Registre em qual modalidade cada projeto está enquadrado.',
    'Convênio direto: empresa incentivada e ICT, Portaria 9.835/2022, RD e auditoria.',
    'PPI 4.0: empresa investidora, coordenadora e executora, convênio de cooperação e PUR, Resoluções CAPDA.',
    'A cadência de prestação de contas depende da norma, do convênio e do manual da coordenadora.'
  ]
},
{
  id: 'm2a2', mod: 2, trilha: 'ppi', tempo: '14 min',
  titulo: 'PPI 4.0: escopo, partes e normas da executora',
  objetivo: 'Identificar o escopo temático do PPI 4.0, as partes envolvidas e a norma que mais pesa na rotina da executora.',
  explicacao: [
    'A {{r9|Resolução CAPDA 9/2019}}, art. 6º, cria o [[PPI 4.0]]. O escopo inclui sistemas ciberfísicos, manufatura inteligente, automação, robótica, inteligência artificial, cibersegurança e digitalização industrial. O projeto precisa demonstrar aderência ao programa e ao plano de trabalho. ((legal))',
    'A {{r2|Resolução CAPDA 2/2020}} é a norma que mais pesa na rotina da executora. Ela trata do [[PUR]], das obrigações da executora (art. 15, I a XI), da conta específica, da guarda documental, dos rendimentos, dos aportes, da prestação de contas e do destino dos saldos.',
    'A {{r30|Resolução CAPDA 30/2022}} alterou, entre outros, os arts. 6º, 10, 11, 14 e 46. O guia resume o efeito: cadastro ativo, seleção por chamada pública ou mecanismo congênere, impedimentos de vínculo entre coordenadora e executora e vedação à execução cumulativa pela própria coordenadora, ressalvada a transição.',
    'O art. 15, § 1º, da Res. 2/2020 fixa aplicação regional mínima de 80%.',
    'O prazo da empresa ou da coordenadora perante a Suframa pode ser diferente do prazo da executora. O convênio e o manual operacional definem quando a executora entrega suas informações para permitir a consolidação. ((contratual))'
  ],
  conceitos: [
    ['PPI 4.0', 'Programa que enquadra o projeto e define o escopo temático.'],
    ['CITS', 'Coordenadora citada nos materiais deste guia.'],
    ['Coordenadora', 'Analisa projetos e recebe a prestação de contas.'],
    ['Executora', 'Quem aplica os recursos e presta contas à coordenadora.']
  ],
  base: [['r9', 'Art. 6º', 'legal'], ['r2', 'Art. 2º, IV, V e VII; art. 15, I a XI e § 1º', 'legal'], ['r30', 'Arts. 6º, 10, 11, 14 e 46 (alterações)', 'legal'], ['man-cits', 'Manual vinculado ao convênio (sem link público)', 'contratual']],
  exemplo: 'Exemplo ilustrativo. A Instituição B planeja um projeto de visão computacional para inspeção de placas eletrônicas na linha de produção. Ela verifica a aderência do tema ao escopo do art. 6º da Res. 9/2019 (por exemplo, inteligência artificial e digitalização industrial) e registra o tema nos Dados Gerais do RD. A análise de aderência depende do plano de trabalho e do instrumento do projeto.',
  pratica: {
    situacao: 'A coordenadora informa um prazo de entrega para a executora que é menor do que o prazo da empresa perante a Suframa. Isso contradiz a norma? Onde você confere o prazo aplicável?',
    resposta: 'Não há contradição. O prazo da empresa ou da coordenadora perante a Suframa pode ser diferente do prazo da executora. A executora confere o convênio e o manual operacional da coordenadora, que definem quando ela entrega suas informações para permitir a consolidação.'
  },
  quiz: [
    { q: 'Qual resolução cria o PPI 4.0?', o: ['Res. CAPDA 9/2019 (art. 6º)', 'Res. CAPDA 2/2020', 'Res. CAPDA 5/2010', 'Portaria Conjunta 9.835/2022'], c: 0, f: 'A Res. CAPDA 9/2019, art. 6º, cria o programa. A Res. 2/2020 traz as regras dos programas prioritários.' },
    { q: 'O que o guia registra sobre a Res. CAPDA 30/2022?', o: ['Criou a Lei de Informática', 'Alterou, entre outros, os arts. 6º, 10, 11, 14 e 46', 'Define o prazo de guarda de cinco anos', 'Criou a Portaria 9.835'], c: 1, f: 'O guia registra que a Res. 30/2022 alterou, entre outros, esses artigos. A leitura correta é conjunta com a Res. 2/2020. O guia não afirma revogação de normas.' },
    { q: 'Qual aplicação regional mínima o art. 15, § 1º, da Res. 2/2020 estabelece?', o: ['50%', '60%', '80%', '100%'], c: 2, f: 'O guia indica aplicação regional mínima de 80% no art. 15, § 1º.' }
  ],
  resumo: [
    'O PPI 4.0 nasce da Res. CAPDA 9/2019 e tem escopo temático definido.',
    'A Res. 2/2020 é a norma que mais pesa na rotina da executora, lida junto com a Res. 30/2022.',
    'Aplicação regional mínima de 80% (art. 15, § 1º).',
    'O prazo da executora vem do convênio e do manual operacional, e pode diferir do prazo da empresa.'
  ]
},
{
  id: 'm2a3', mod: 2, trilha: 'conv', tempo: '14 min',
  titulo: 'Convênio direto: base legal, partes e transição',
  objetivo: 'Reconhecer a base legal, as partes, o instrumento e a regra de transição do convênio direto.',
  explicacao: [
    'A base legal é o art. 2º, § 4º, I (ICT credenciada) ou VI (ICT pública), da Lei 8.387. As partes são a empresa incentivada e a ICT. O instrumento é o convênio, com repasses, recursos estimados e propriedade intelectual. ((legal))',
    'A {{p9835|Portaria Conjunta 9.835/2022}} aplica-se às obrigações a partir do ano-base 2024 (art. 57). O art. 55, parágrafo único, preserva procedimentos da Resolução CAS 71/2016 para certos projetos anteriores continuados.',
    'Quando a executora é ICT pública, a {{p347|Portaria Conjunta 347/2020}}, alterada pela 8.111/2022, também rege a modalidade. A [[Fundação de apoio]] presta apoio administrativo e financeiro e não pode assumir as atividades precípuas de PD&I (art. 6º, § 4º).',
    'O credenciamento no CAPDA ({{r5|Res. CAPDA 5/2010}}) e a habilitação perante a coordenadora do PPI são verificações distintas. A executora precisa manter as duas em dia.',
    'O {{man-rd|Manual de Análise do RD v1.1}} é anterior à Portaria 9.835/2022 e deve ser lido com as normas posteriores.'
  ],
  conceitos: [
    ['Convênio direto', 'Instrumento central desta aula.'],
    ['ICT', 'Pode ser credenciada (inciso I) ou pública (inciso VI).'],
    ['Fundação de apoio', 'Apoia a ICT pública sem assumir as atividades precípuas de PD&I.'],
    ['Ano-base', 'Define qual regra se aplica, inclusive a transição.'],
    ['CAS', 'Órgão da Resolução 71/2016, citada na transição.']
  ],
  base: [['l8387', 'Art. 2º, § 4º, I e VI', 'legal'], ['p9835', 'Arts. 55 a 58', 'legal'], ['p347', 'Art. 6º, § 4º', 'legal'], ['r5', 'Anexo I, itens 1, 2 e 4.7', 'legal'], ['man-rd', 'Seções 5.2, 5.3 e 7', 'recom']],
  exemplo: 'Exemplo ilustrativo. A Instituição B, ICT credenciada, mantém um projeto continuado que começou antes de 2024. Antes de decidir qual norma aplicar às obrigações, ela confere o ano-base e o art. 55, parágrafo único, da Portaria 9.835/2022, que preserva procedimentos da Res. CAS 71/2016 para certos projetos anteriores continuados. A conclusão depende do texto oficial e do instrumento.',
  pratica: {
    situacao: 'Um projeto começou em 2022 e continua em 2026. Que perguntas você faz antes de escolher a norma?',
    resposta: 'Pergunte: qual é o ano-base de cada obrigação, e o projeto se enquadra na regra de transição (arts. 55 a 58 da Portaria 9.835/2022; art. 55, parágrafo único, sobre a Res. CAS 71/2016)? Confirme no texto oficial. O guia não resolve o caso concreto.'
  },
  quiz: [
    { q: 'A partir de qual ano-base a Portaria 9.835/2022 se aplica às obrigações (art. 57)?', o: ['2022', '2023', '2024', '2025'], c: 2, f: 'O art. 57 fixa a aplicação a partir do ano-base 2024. O art. 55, parágrafo único, trata de transição para certos projetos anteriores.' },
    { q: 'Em convênio com ICT pública (Portaria 347/2020), a fundação de apoio:', o: ['Assume as atividades precípuas de PD&I', 'Presta apoio administrativo e financeiro, sem assumir as atividades precípuas de PD&I', 'Substitui a ICT na prestação de contas', 'Detém o credenciamento da ICT'], c: 1, f: 'O art. 6º, § 4º, limita a atuação da fundação de apoio ao apoio administrativo e financeiro.' },
    { q: 'O credenciamento no CAPDA e a habilitação perante a coordenadora do PPI são:', o: ['A mesma verificação', 'Verificações distintas, e a executora mantém as duas em dia', 'Dispensáveis para ICT pública', 'Obrigações da empresa incentivada'], c: 1, f: 'O guia destaca que são verificações distintas e que a executora precisa manter as duas em dia.' }
  ],
  resumo: [
    'Base legal: art. 2º, § 4º, I (ICT credenciada) ou VI (ICT pública).',
    'A Portaria 9.835/2022 se aplica a partir do ano-base 2024, com regra de transição.',
    'Em ICT pública, a fundação de apoio tem limites de atuação.',
    'Credenciamento e habilitação são verificações diferentes.'
  ]
},

/* ======================================================================= MÓDULO 3 */
{
  id: 'm3a1', mod: 3, trilha: 'comum', tempo: '14 min',
  titulo: 'Hierarquia normativa: da lei ao manual',
  objetivo: 'Ordenar lei, decreto, resolução, portaria e manual e saber ler normas que foram alteradas.',
  explicacao: [
    'Leia de cima para baixo. A lei cria a obrigação, o decreto regulamenta, as normas da modalidade operacionalizam e os manuais orientam a análise.',
    'O guia organiza a base em três camadas: <b>legislação de PD&I</b> (Lei 8.387, Decreto 10.521, Lei 10.973), <b>regras da modalidade</b> (Portaria 9.835; Resoluções CAPDA 2/2020, 30/2022 e 9/2019) e <b>documentos de execução e prestação de contas</b> (convênio, PUR ou plano, aditivos, manual da coordenadora, relatórios e comprovantes).',
    'Leia cada norma com as suas alterações: o {{d10521|Decreto 10.521}} com os Decretos 10.891/2021 e 11.127/2022; a Res. 2/2020 com a Res. 30/2022; a Portaria 347/2020 com a 8.111/2022; a Res. 5/2010 com a Res. 8/2015.',
    'Os manuais organizam a análise dos documentos. O {{man-rd|Manual de Análise do RD v1.1}} é de 2021, anterior à Portaria 9.835/2022. O manual de prestação de contas da coordenadora vale na versão vinculada ao convênio ((contratual)).',
    'Este guia não declara vigência nem revogação de normas. Ao encontrar uma referência antiga, como o {{d6008|Decreto 6.008/2006}} citado na Planilha Financeira, confira o texto no Planalto antes de usá-la como fundamento.'
  ],
  conceitos: [
    ['Texto compilado', 'Versão da lei com as alterações incorporadas, útil para ler a regra atual.'],
    ['Manual de Análise', 'Orienta a análise de documentos e deve ser lido com as normas posteriores.'],
    ['Instrumento jurídico', 'Convênio, PUR e aditivos que formalizam o projeto.'],
    ['Aditivo', 'Altera o instrumento depois de assinado.']
  ],
  base: [['l8387', 'Art. 2º', 'legal'], ['d10521', 'Arts. 21 e 22', 'legal'], ['r2', 'Lida com a Res. 30/2022', 'legal'], ['p9835', 'Norma da modalidade', 'legal']],
  exemplo: 'Exemplo ilustrativo. A Instituição B precisa justificar por que determinada despesa entra no projeto. Ela cita primeiro o Decreto 10.521 (art. 22) para a categoria, depois a norma da modalidade do projeto e, por fim, confere o instrumento e o manual aplicáveis. Em resposta a uma diligência, cada fundamento aparece com o dispositivo exato e o link para o texto oficial.',
  pratica: {
    situacao: 'Classifique cada item como lei, decreto, resolução, portaria ou manual: (a) Lei 8.387/1991; (b) Decreto 10.521/2020; (c) Resolução CAPDA 2/2020; (d) Portaria Conjunta 9.835/2022; (e) Manual de Análise do PUR.',
    resposta: '(a) lei; (b) decreto; (c) resolução; (d) portaria; (e) manual. A lei cria a obrigação, o decreto regulamenta, a resolução e a portaria operacionalizam a modalidade, e o manual orienta a análise.'
  },
  quiz: [
    { q: 'Qual é a ordem de leitura sugerida pelo guia?', o: ['Manual, portaria, decreto, lei', 'Lei, decreto, normas da modalidade e manuais', 'Resolução, lei, manual, decreto', 'Qualquer ordem'], c: 1, f: 'A lei cria a obrigação, o decreto regulamenta, as normas da modalidade operacionalizam e os manuais orientam a análise.' },
    { q: 'Ao ler o Decreto 10.521/2020, o guia indica ler também:', o: ['Os Decretos 10.891/2021 e 11.127/2022', 'A Resolução CAPDA 5/2010', 'A Portaria 347/2020', 'A Lei 13.243/2016'], c: 0, f: 'O guia recomenda ler o decreto com as alterações dos Decretos 10.891/2021 e 11.127/2022.' },
    { q: 'O que o guia afirma sobre o Decreto 6.008/2006?', o: ['Está revogado', 'Segue vigente', 'Sua vigência deve ser conferida no Planalto antes de ser usado como fundamento', 'Substitui o Decreto 10.521'], c: 2, f: 'O guia não declara vigência nem revogação. Registra que a Planilha Financeira ainda o cita e pede a conferência no Planalto.' }
  ],
  resumo: [
    'Lei, decreto, normas da modalidade e manuais, nessa ordem de leitura.',
    'Leia cada norma com suas alterações.',
    'Manuais orientam a análise e podem ser anteriores a normas novas.',
    'Vigência e revogação precisam de verificação documental no texto oficial.'
  ]
}
);
