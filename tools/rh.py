# -*- coding: utf-8 -*-
"""Conteúdo da aba Legislação de RH (legislacao-rh.html).

Cada seção: id, n, title, intro, prio (destaque para o IKT), tables [(cabeçalhos, linhas, subtítulo)],
lists [(título, itens)], note (observação), src [(rótulo, url)].
"""

PLANALTO = ('Portal da Legislação (Planalto)', 'https://www4.planalto.gov.br/legislacao')
CLT = ('CLT — texto compilado (Planalto)', 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm')
MTE = ('Ministério do Trabalho e Emprego', 'https://www.gov.br/trabalho-e-emprego/pt-br')
NRS = ('Normas Regulamentadoras (MTE)', 'https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/seguranca-e-saude-no-trabalho/ctpp-nrs/normas-regulamentadoras-nrs')
ESOCIAL = ('Portal oficial do eSocial', 'https://www.gov.br/esocial/pt-br')
LGPD = ('LGPD — Lei nº 13.709/2018 (Planalto)', 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm')

LEG = ('Legislação', 'Assunto regulamentado')
APL = ('Legislação', 'Aplicação')

SECTIONS = [
    dict(id='fundamental', n=1, title='Legislação trabalhista fundamental',
         intro='Principais normas que sustentam as relações de trabalho no Brasil.',
         tables=[(LEG, [
             ('Constituição Federal de 1988', 'Direitos fundamentais dos trabalhadores, especialmente os arts. 7º a 11'),
             ('Decreto-Lei nº 5.452/1943', 'Consolidação das Leis do Trabalho (CLT)'),
             ('Lei nº 13.467/2017', 'Reforma Trabalhista'),
             ('Lei nº 13.874/2019', 'Liberdade Econômica e alterações nas obrigações trabalhistas'),
             ('Lei nº 14.442/2022', 'Teletrabalho e auxílio-alimentação'),
             ('Lei nº 6.019/1974', 'Trabalho temporário e prestação de serviços a terceiros'),
             ('Lei nº 13.429/2017', 'Alterações nas regras de trabalho temporário e terceirização'),
             ('Lei nº 9.601/1998', 'Contratos de trabalho por prazo determinado e banco de horas'),
             ('Lei Complementar nº 150/2015', 'Trabalho doméstico, quando aplicável'),
             ('Decreto nº 10.854/2021', 'Regulamentação de disposições relativas à legislação trabalhista'),
         ], None)],
         note='A CLT é a principal referência para contratos, salários, jornadas, férias, alterações contratuais e rescisões.',
         src=[CLT, PLANALTO]),

    dict(id='admissao', n=2, title='Admissão, contratação e documentação',
         tables=[(('Legislação ou normativa', 'Aplicação no RH'), [
             ('CLT, arts. 2º, 3º, 29 e 41', 'Vínculo empregatício, registro e documentação'),
             ('Portaria MTP nº 671/2021', 'Registro de empregados, CTPS Digital e controles trabalhistas'),
             ('Lei nº 12.506/2011', 'Aviso-prévio proporcional'),
             ('Lei nº 9.029/1995', 'Proibição de discriminação na contratação e manutenção do emprego'),
             ('Lei nº 11.788/2008', 'Contratação e acompanhamento de estagiários'),
             ('Lei nº 10.097/2000', 'Aprendizagem profissional'),
             ('Decreto nº 9.579/2018', 'Regulamentação da aprendizagem, entre outras matérias'),
             ('Lei nº 13.709/2018', 'Proteção de dados pessoais dos candidatos e empregados'),
             ('Lei nº 6.019/1974', 'Contratação temporária e terceirização'),
         ], None)],
         note='A CTPS Digital é alimentada por informações transmitidas pelo eSocial, conforme as regras aplicáveis.',
         src=[MTE, CLT]),

    dict(id='folha', n=3, title='Folha de pagamento, remuneração e encargos', prio=True,
         tables=[(APL, [
             ('CLT, arts. 457 a 467', 'Salários, remuneração, adicionais e verbas trabalhistas'),
             ('Lei nº 4.090/1962', 'Instituição do 13º salário'),
             ('Lei nº 4.749/1965', 'Pagamento do 13º salário'),
             ('Decreto nº 57.155/1965', 'Regulamentação do 13º salário'),
             ('Lei nº 8.212/1991', 'Custeio da Previdência Social'),
             ('Lei nº 8.213/1991', 'Benefícios previdenciários'),
             ('Decreto nº 3.048/1999', 'Regulamento da Previdência Social'),
             ('Lei nº 8.036/1990', 'FGTS'),
             ('Lei Complementar nº 110/2001', 'Disposições relativas ao FGTS, com alterações posteriores'),
             ('Lei nº 10.101/2000', 'Participação nos lucros ou resultados'),
             ('Lei nº 7.713/1988', 'Imposto de Renda das pessoas físicas'),
             ('Lei nº 9.250/1995', 'Regras do Imposto de Renda'),
             ('Decreto nº 9.580/2018', 'Regulamento do Imposto de Renda'),
             ('Instrução Normativa RFB nº 2.110/2022', 'Normas gerais de tributação previdenciária'),
             ('Instrução Normativa RFB nº 2.005/2021', 'DCTFWeb e alterações posteriores'),
             ('Portaria MTE nº 240/2024', 'Operacionalização do FGTS Digital'),
         ], None)],
         lists=[('Controles essenciais', [
             'Salário-base e alterações salariais.',
             'INSS do empregado e contribuição patronal, conforme enquadramento.',
             'FGTS mensal e rescisório.',
             'IRRF.',
             '13º salário e respectivos encargos.',
             'Férias, adicional constitucional e provisões.',
             'Horas extras e adicionais.',
             'Descontos legais e autorizados.',
             'Rescisões e verbas indenizatórias.',
         ])],
         note='A Lei nº 8.036/1990 estabelece as regras do FGTS; a Portaria MTE nº 240/2024 disciplina sua operacionalização digital.',
         src=[PLANALTO, MTE]),

    dict(id='jornada', n=4, title='Jornada, controle de ponto e férias',
         tables=[(APL, [
             ('Constituição Federal, art. 7º', 'Limites de jornada, repouso e férias'),
             ('CLT, arts. 58 a 75', 'Jornada, intervalos, horas extras e controle de ponto'),
             ('CLT, arts. 129 a 153', 'Férias individuais e coletivas'),
             ('Lei nº 605/1949', 'Repouso semanal remunerado e feriados'),
             ('Decreto nº 10.854/2021', 'Regulamentações trabalhistas, incluindo registro de jornada'),
             ('Portaria MTP nº 671/2021', 'Sistemas e registros de ponto'),
             ('Lei nº 14.442/2022', 'Regras relativas ao teletrabalho'),
             ('Lei nº 9.601/1998', 'Regras relacionadas à compensação de jornada'),
             ('Lei nº 12.506/2011', 'Aviso-prévio proporcional'),
         ], None)],
         note='Para o controle eletrônico de ponto, a Portaria MTP nº 671/2021 estabelece regras para os sistemas REP-C, REP-A e REP-P.',
         src=[MTE, CLT]),

    dict(id='beneficios', n=5, title='Benefícios trabalhistas',
         tables=[(('Legislação', 'Benefício ou assunto'), [
             ('Lei nº 7.418/1985', 'Vale-transporte'),
             ('Decreto nº 95.247/1987', 'Regulamentação do vale-transporte'),
             ('Lei nº 6.321/1976', 'Programa de Alimentação do Trabalhador (PAT)'),
             ('Decreto nº 10.854/2021', 'Regulamentação de matérias trabalhistas, inclusive PAT'),
             ('Lei nº 14.442/2022', 'Auxílio-alimentação'),
             ('Lei nº 8.213/1991', 'Benefícios previdenciários'),
             ('Lei nº 11.770/2008', 'Programa Empresa Cidadã'),
             ('Lei nº 9.656/1998', 'Planos privados de assistência à saúde'),
             ('Lei nº 14.457/2022', 'Medidas de apoio à parentalidade e prevenção de assédio'),
         ], None)],
         note='A obrigatoriedade de benefícios como plano de saúde, auxílio-creche e determinadas modalidades de auxílio-alimentação '
              'depende da legislação aplicável, dos instrumentos coletivos e dos contratos.',
         src=[PLANALTO]),

    dict(id='sst', n=6, title='Saúde e segurança do trabalho',
         intro='As Normas Regulamentadoras (NRs) são fundamentais para o RH, especialmente nas rotinas de medicina ocupacional, '
               'exames e prevenção de acidentes.',
         tables=[(('Norma', 'Assunto'), [
             ('NR-01', 'Disposições gerais e gerenciamento de riscos ocupacionais'),
             ('NR-04', 'Serviços Especializados em Segurança e Medicina do Trabalho (SESMT)'),
             ('NR-05', 'CIPA e prevenção do assédio'),
             ('NR-06', 'Equipamentos de Proteção Individual (EPI)'),
             ('NR-07', 'Programa de Controle Médico de Saúde Ocupacional (PCMSO)'),
             ('NR-09', 'Avaliação e controle das exposições ocupacionais'),
             ('NR-10', 'Segurança em instalações e serviços em eletricidade'),
             ('NR-15', 'Atividades e operações insalubres'),
             ('NR-16', 'Atividades e operações perigosas'),
             ('NR-17', 'Ergonomia'),
             ('NR-23', 'Proteção contra incêndios'),
             ('NR-24', 'Condições sanitárias e de conforto'),
             ('NR-28', 'Fiscalização e penalidades'),
         ], 'Normas mais relevantes para ambientes administrativos e de tecnologia'),
             (('Norma', 'Assunto'), [
             ('NR-03', 'Embargo e interdição'),
             ('NR-08', 'Edificações'),
             ('NR-11', 'Transporte, movimentação, armazenagem e manuseio de materiais'),
             ('NR-12', 'Segurança em máquinas e equipamentos'),
             ('NR-13', 'Caldeiras, vasos de pressão, tubulações e tanques metálicos'),
             ('NR-14', 'Fornos'),
             ('NR-18', 'Segurança e saúde na indústria da construção'),
             ('NR-19', 'Explosivos'),
             ('NR-20', 'Inflamáveis e combustíveis'),
             ('NR-21', 'Trabalhos a céu aberto'),
             ('NR-22', 'Segurança e saúde ocupacional na mineração'),
             ('NR-25', 'Resíduos industriais'),
             ('NR-26', 'Sinalização de segurança'),
             ('NR-29', 'Segurança e saúde no trabalho portuário'),
             ('NR-30', 'Segurança e saúde no trabalho aquaviário'),
             ('NR-31', 'Segurança e saúde no trabalho rural'),
             ('NR-32', 'Segurança e saúde em serviços de saúde'),
             ('NR-33', 'Segurança e saúde em espaços confinados'),
             ('NR-34', 'Condições e meio ambiente de trabalho na indústria naval'),
             ('NR-35', 'Trabalho em altura'),
             ('NR-36', 'Segurança e saúde em empresas de abate e processamento de carnes'),
             ('NR-37', 'Segurança e saúde em plataformas de petróleo'),
             ('NR-38', 'Segurança e saúde em limpeza urbana e manejo de resíduos sólidos'),
         ], 'Demais Normas Regulamentadoras')],
         note='A NR-01 também exige atenção ao gerenciamento dos riscos psicossociais relacionados ao trabalho, conforme as regras e '
              'prazos vigentes. As NR-02 e NR-27 foram revogadas. A aplicação das demais NRs depende das atividades efetivamente '
              'executadas e dos riscos identificados; não significa que o IKT esteja sujeito integralmente a todas elas.',
         src=[NRS]),

    dict(id='esocial', n=7, title='eSocial e obrigações acessórias', prio=True,
         tables=[(('Normativa ou sistema', 'Aplicação'), [
             ('Decreto nº 8.373/2014', 'Instituição do eSocial'),
             ('Manual de Orientação do eSocial (MOS)', 'Regras e procedimentos de transmissão dos eventos'),
             ('Leiautes eSocial S-1.3 e notas técnicas aplicáveis', 'Estrutura dos dados e validações'),
             ('Portaria MTP nº 671/2021', 'Registro de empregados e obrigações trabalhistas'),
             ('Lei nº 8.212/1991', 'Informações previdenciárias'),
             ('IN RFB nº 2.005/2021', 'DCTFWeb'),
             ('IN RFB nº 2.043/2021', 'EFD-Reinf'),
             ('Lei nº 8.036/1990', 'Recolhimentos do FGTS'),
             ('Portaria MTE nº 240/2024', 'FGTS Digital'),
             ('Lei nº 4.923/1965', 'Base legal do CAGED'),
             ('Decreto nº 76.900/1975', 'Instituição da RAIS'),
         ], None),
             (('Evento', 'Finalidade'), [
             ('S-1000', 'Informações do empregador'),
             ('S-1010', 'Tabela de rubricas'),
             ('S-1020', 'Lotações tributárias'),
             ('S-1200', 'Remuneração de trabalhadores'),
             ('S-1210', 'Pagamentos de rendimentos do trabalho'),
             ('S-1299', 'Fechamento dos eventos periódicos'),
             ('S-2190', 'Admissão preliminar'),
             ('S-2200', 'Admissão e cadastramento de trabalhador'),
             ('S-2205', 'Alteração de dados cadastrais'),
             ('S-2206', 'Alteração contratual'),
             ('S-2210', 'Comunicação de acidente de trabalho'),
             ('S-2220', 'Monitoramento da saúde do trabalhador'),
             ('S-2230', 'Afastamento temporário'),
             ('S-2240', 'Condições ambientais do trabalho'),
             ('S-2299', 'Desligamento'),
             ('S-2399', 'Término de trabalhador sem vínculo, quando aplicável'),
             ('S-2500', 'Processo trabalhista'),
             ('S-2501', 'Tributos decorrentes de processo trabalhista'),
         ], 'Principais eventos do eSocial que o RH deve conhecer')],
         note='As informações do eSocial e da EFD-Reinf alimentam a DCTFWeb para apuração e declaração dos tributos correspondentes.',
         src=[ESOCIAL]),

    dict(id='afastamentos', n=8, title='Afastamentos, licenças e Previdência Social',
         tables=[(APL, [
             ('Lei nº 8.213/1991', 'Benefícios por incapacidade, acidentes e outros benefícios previdenciários'),
             ('Lei nº 8.212/1991', 'Custeio previdenciário'),
             ('Decreto nº 3.048/1999', 'Regulamento da Previdência'),
             ('Constituição Federal, art. 7º', 'Licenças e direitos fundamentais'),
             ('CLT, arts. 131, 392 a 396 e 473', 'Ausências justificadas, maternidade e outras hipóteses'),
             ('Lei nº 11.770/2008', 'Prorrogação das licenças pelo Programa Empresa Cidadã'),
             ('Lei nº 14.151/2021', 'Regras especiais relacionadas à gestante durante a emergência sanitária, de caráter histórico/transitório'),
             ('Lei nº 14.311/2022', 'Alterações das regras de afastamento de gestantes durante a pandemia'),
         ], None)],
         src=[PLANALTO, CLT]),

    dict(id='inclusao', n=9, title='Inclusão, igualdade e prevenção de discriminação',
         tables=[(LEG[:1] + ('Assunto',), [
             ('Constituição Federal de 1988', 'Igualdade, dignidade e não discriminação'),
             ('Lei nº 9.029/1995', 'Vedação de práticas discriminatórias'),
             ('Lei nº 8.213/1991, art. 93', 'Reserva legal de vagas para pessoas com deficiência e reabilitadas'),
             ('Lei nº 13.146/2015', 'Lei Brasileira de Inclusão'),
             ('Lei nº 14.611/2023', 'Igualdade salarial e de critérios remuneratórios entre mulheres e homens'),
             ('Decreto nº 11.795/2023', 'Regulamentação da Lei nº 14.611/2023'),
             ('Lei nº 14.457/2022', 'Medidas de prevenção ao assédio sexual e outras formas de violência no trabalho'),
             ('Lei nº 12.288/2010', 'Estatuto da Igualdade Racial'),
             ('Lei nº 7.716/1989', 'Crimes resultantes de preconceito de raça ou cor'),
             ('Lei nº 10.741/2003', 'Estatuto da Pessoa Idosa'),
         ], None)],
         src=[PLANALTO]),

    dict(id='dados', n=10, title='Proteção de dados e documentação de RH',
         tables=[(APL, [
             ('Lei nº 13.709/2018', 'Lei Geral de Proteção de Dados (LGPD)'),
             ('Lei nº 13.853/2019', 'Alterações na LGPD e estruturação da autoridade de proteção de dados'),
             ('Lei nº 12.965/2014', 'Marco Civil da Internet'),
             ('Decreto nº 8.771/2016', 'Regulamentação do Marco Civil'),
             ('Lei nº 12.682/2012', 'Digitalização e armazenamento de documentos'),
             ('Decreto nº 10.278/2020', 'Requisitos para digitalização de documentos'),
             ('Lei nº 13.874/2019', 'Disposições sobre documentos e registros eletrônicos'),
             ('Lei nº 14.063/2020', 'Assinaturas eletrônicas em determinadas relações e documentos'),
         ], None)],
         lists=[('No RH, essas regras alcançam documentos como', [
             'Contratos de trabalho e aditivos.',
             'Documentos pessoais.',
             'Comprovantes de pagamento.',
             'Documentos previdenciários.',
             'Registros de férias e afastamentos.',
             'Dados bancários.',
             'Informações médicas e ocupacionais.',
             'Dados de dependentes e beneficiários.',
             'Documentos digitalizados e assinados eletronicamente.',
         ])],
         warn='Não existe um prazo único de guarda para todos os documentos de RH. A retenção deve considerar a natureza documental, '
              'a finalidade, os prazos legais específicos e as obrigações de proteção de dados.',
         src=[LGPD]),

    dict(id='coletivas', n=11, title='Normas coletivas e sindicais',
         intro='Além da legislação federal, o RH precisa observar:',
         tables=[(('Instrumento', 'Aplicação'), [
             ('Convenção Coletiva de Trabalho (CCT)', 'Regras negociadas entre sindicatos patronais e profissionais'),
             ('Acordo Coletivo de Trabalho (ACT)', 'Regras negociadas entre empresa e sindicato profissional'),
             ('CLT, arts. 511 a 610', 'Organização e relações sindicais'),
             ('CLT, arts. 611-A e 611-B', 'Matérias negociáveis e limites da negociação coletiva'),
             ('Constituição Federal, art. 8º', 'Liberdade e organização sindical'),
             ('Lei nº 7.783/1989', 'Direito de greve'),
             ('Lei nº 10.101/2000', 'Participação nos lucros e resultados'),
         ], None)],
         note='Esses instrumentos podem estabelecer pisos salariais, benefícios, reajustes, adicionais, jornadas e outras condições de '
              'trabalho. Para identificar a convenção aplicável ao IKT, é necessário verificar o enquadramento sindical e a categoria dos empregados.',
         src=[CLT]),

    dict(id='ikt', n=12, title='Normas específicas que merecem atenção no IKT',
         intro='Como o IKT atua com pesquisa, desenvolvimento e inovação, há normas adicionais que podem interferir nas contratações, '
               'na gestão de pessoal e na documentação dos projetos.',
         tables=[(('Legislação', 'Relevância'), [
             ('Lei nº 10.973/2004', 'Lei de Inovação'),
             ('Decreto nº 9.283/2018', 'Regulamentação de medidas de incentivo à inovação'),
             ('Lei nº 11.196/2005', 'Incentivos fiscais à inovação e outras disposições'),
             ('Lei nº 8.248/1991', 'Política de incentivos para o setor de tecnologia da informação'),
             ('Decreto nº 10.356/2020', 'Regulamentação de incentivos de TIC'),
             ('Lei nº 13.674/2018', 'Alterações no regime de incentivos de TIC'),
             ('Lei nº 13.969/2019', 'Alterações na política de incentivos para TIC'),
             ('Lei nº 8.958/1994', 'Relações de instituições federais de ensino e pesquisa com fundações de apoio, quando aplicável'),
             ('Lei nº 10.406/2002', 'Código Civil, relevante para contratos civis de prestação de serviços'),
             ('Lei Complementar nº 123/2006', 'Regime das micro e pequenas empresas, quando pertinente à contratação de fornecedores'),
         ], None)],
         note='Essas normas não substituem a legislação trabalhista. Sua relevância depende da natureza jurídica do IKT, dos instrumentos '
              'de contratação, das regras dos programas de PD&I e das obrigações estabelecidas pelos financiadores. Nas prestações de '
              'contas ao CITS, é preciso identificar ainda os regulamentos específicos dos programas, contratos, planos aprovados e '
              'manuais de prestação de contas, que podem definir exigências adicionais de comprovação dos custos de pessoal.',
         src=[PLANALTO]),
]

PRIORITIES = [
    dict(n=1, title='Controle mensal de RH', level='Crítica', tone='bad', items=[
        'CLT', 'Lei nº 8.212/1991 — INSS', 'Lei nº 8.036/1990 — FGTS', 'Leis nº 4.090/1962 e 4.749/1965 — 13º salário',
        'eSocial, FGTS Digital e DCTFWeb', 'Convenção coletiva aplicável']),
    dict(n=2, title='Documentação e conformidade', level='Alta', tone='warn', items=[
        'Portaria MTP nº 671/2021', 'LGPD', 'NR-01, NR-07 e NR-17', 'Legislação de férias e afastamentos',
        'Normas de digitalização e guarda documental']),
    dict(n=3, title='Gestão dos custos de projetos', level='Específica', tone='info', items=[
        'Regulamentos aplicáveis aos programas de PD&I', 'Instrumentos contratuais e regras de prestação de contas do CITS',
        'Critérios de elegibilidade dos custos de pessoal', 'Regras documentais de comprovação das horas e alocações']),
]
PRIORITY_INTRO = ('Considerando as atividades de controle de custos, conferência de folha, encargos, férias, rateios, eSocial e '
                  'documentação, o acompanhamento fica organizado nesta ordem:')
