# -*- coding: utf-8 -*-
"""Links oficiais e resumos das normas citadas na aba Legislação de RH.

key_of(nome) identifica a norma a partir do texto exibido; URLS[key] aponta para o texto oficial
(Planalto, gov.br, Receita Federal ou DOU); RESUMO[nome] traz o descritivo curto exibido na tabela.
Endereços conferidos em 24/11/2026 (Planalto: status 200 e número da norma no texto; Receita, gov.br e DOU: abertos no navegador).
"""
import re

P = 'https://www.planalto.gov.br/ccivil_03/'
NR_URL = ('https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/'
          'comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes')
ESOCIAL_DOC = 'https://www.gov.br/esocial/pt-br/documentacao-tecnica'

URLS = {
    'CF': P + 'constituicao/constituicao.htm',
    'CLT': P + 'decreto-lei/del5452.htm',
    'P671': 'https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/legislacao/portarias-1/portarias-vigentes-3/WORDPortarian671de8denovembrode2021compilada21.07.2026.pdf',
    'P240': 'https://www.in.gov.br/en/web/dou/-/portaria-mte-n-240-de-29-de-fevereiro-de-2024-546047596',
    'IN2110': 'http://normas.receita.fazenda.gov.br/sijut2consulta/link.action?idAto=126687',
    'IN2043': 'http://normas.receita.fazenda.gov.br/sijut2consulta/link.action?idAto=119859',
    'IN2237': 'http://normas.receita.fazenda.gov.br/sijut2consulta/link.action?idAto=141910',
    'NR': NR_URL,
    'MOS': ESOCIAL_DOC,
}
# Preenchido com os endereços validados do Planalto (ver PLANALTO abaixo).
PLANALTO = {
    'CF': 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm',
    'CLT': 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm',
    'D10278': 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/decreto/d10278.htm',
    'D10356': 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/decreto/d10356.htm',
    'D10854': 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/decreto/d10854.htm',
    'D11795': 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11795.htm',
    'D3048': 'https://www.planalto.gov.br/ccivil_03/decreto/d3048.htm',
    'D57155': 'https://www.planalto.gov.br/ccivil_03/decreto/1950-1969/d57155.htm',
    'D76900': 'https://www.planalto.gov.br/ccivil_03/decreto/1970-1979/d76900.htm',
    'D8373': 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/decreto/d8373.htm',
    'D8771': 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2016/decreto/d8771.htm',
    'D9283': 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/decreto/d9283.htm',
    'D95247': 'https://www.planalto.gov.br/ccivil_03/decreto/d95247.htm',
    'D9579': 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/decreto/d9579.htm',
    'D9580': 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/decreto/d9580.htm',
    'L10097': 'https://www.planalto.gov.br/ccivil_03/leis/l10097.htm',
    'L10101': 'https://www.planalto.gov.br/ccivil_03/leis/l10101.htm',
    'L10406': 'https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm',
    'L10741': 'https://www.planalto.gov.br/ccivil_03/leis/2003/l10.741.htm',
    'L10973': 'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/lei/l10.973.htm',
    'L11196': 'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2005/lei/l11196.htm',
    'L11770': 'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11770.htm',
    'L11788': 'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11788.htm',
    'L12288': 'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2010/lei/l12288.htm',
    'L12506': 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12506.htm',
    'L12682': 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12682.htm',
    'L12965': 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l12965.htm',
    'L13146': 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm',
    'L13429': 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13429.htm',
    'L13467': 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13467.htm',
    'L13674': 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13674.htm',
    'L13709': 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm',
    'L13853': 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2019/lei/l13853.htm',
    'L13874': 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2019/lei/l13874.htm',
    'L13969': 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2019/lei/l13969.htm',
    'L14063': 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l14063.htm',
    'L14151': 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14151.htm',
    'L14311': 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14311.htm',
    'L14442': 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14442.htm',
    'L14457': 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14457.htm',
    'L14611': 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14611.htm',
    'L4090': 'https://www.planalto.gov.br/ccivil_03/leis/l4090.htm',
    'L4749': 'https://www.planalto.gov.br/ccivil_03/leis/l4749.htm',
    'L4923': 'https://www.planalto.gov.br/ccivil_03/leis/l4923.htm',
    'L6019': 'https://www.planalto.gov.br/ccivil_03/leis/l6019.htm',
    'L605': 'https://www.planalto.gov.br/ccivil_03/leis/l0605.htm',
    'L6321': 'https://www.planalto.gov.br/ccivil_03/leis/l6321.htm',
    'L7418': 'https://www.planalto.gov.br/ccivil_03/leis/l7418.htm',
    'L7713': 'https://www.planalto.gov.br/ccivil_03/leis/l7713.htm',
    'L7716': 'https://www.planalto.gov.br/ccivil_03/leis/l7716.htm',
    'L7783': 'https://www.planalto.gov.br/ccivil_03/leis/l7783.htm',
    'L8036': 'https://www.planalto.gov.br/ccivil_03/leis/l8036consol.htm',
    'L8212': 'https://www.planalto.gov.br/ccivil_03/leis/l8212cons.htm',
    'L8213': 'https://www.planalto.gov.br/ccivil_03/leis/l8213cons.htm',
    'L8248': 'https://www.planalto.gov.br/ccivil_03/leis/l8248.htm',
    'L8958': 'https://www.planalto.gov.br/ccivil_03/leis/l8958.htm',
    'L9029': 'https://www.planalto.gov.br/ccivil_03/leis/l9029.htm',
    'L9250': 'https://www.planalto.gov.br/ccivil_03/leis/l9250.htm',
    'L9601': 'https://www.planalto.gov.br/ccivil_03/leis/l9601.htm',
    'L9656': 'https://www.planalto.gov.br/ccivil_03/leis/l9656.htm',
    'LC110': 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp110.htm',
    'LC123': 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm',
    'LC150': 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp150.htm',
}


def key_of(name):
    """Converte o nome exibido em (chave, âncora)."""
    n = name.replace(' ', ' ')
    m = re.search(r'arts?\. (\d+)', n)
    art = f'#art{m.group(1)}' if m else ''
    if n.startswith('Constituição Federal'):
        return 'CF', art
    if n.startswith('CLT') or n.startswith('Decreto-Lei nº 5.452'):
        return 'CLT', art
    if n.startswith('NR-'):
        return 'NR', ''
    if n.startswith('Manual de Orientação') or n.startswith('Leiautes'):
        return 'MOS', ''
    m = re.search(r'Portaria \w+ nº ([\d.]+)', n)
    if m:
        return 'P' + m.group(1).replace('.', ''), ''
    m = re.search(r'(?:IN|Instrução Normativa) RFB nº ([\d.]+)', n)
    if m:
        return 'IN' + m.group(1).replace('.', ''), ''
    m = re.search(r'Lei Complementar nº ([\d.]+)', n)
    if m:
        return 'LC' + m.group(1).replace('.', ''), ''
    m = re.search(r'Decreto nº ([\d.]+)', n)
    if m:
        return 'D' + m.group(1).replace('.', ''), ''
    m = re.search(r'Lei nº ([\d.]+)', n)
    if m:
        return 'L' + m.group(1).replace('.', ''), art
    return None, ''


def url_of(name):
    k, anchor = key_of(name)
    if not k:
        return None
    u = URLS.get(k) or PLANALTO.get(k)
    if not u:
        return None
    return u + anchor if anchor and 'planalto' in u else u


RESUMO = {
    # 1. Fundamentais
    'Constituição Federal de 1988': 'Lista os direitos mínimos de trabalhadores urbanos e rurais (salário mínimo, 13º, FGTS, férias com 1/3, jornada de 8h diárias e 44h semanais, licenças), a organização sindical e o direito de greve.',
    'Decreto-Lei nº 5.452/1943': 'A CLT reúne as regras do contrato individual de trabalho: registro, jornada, férias, remuneração, alteração e rescisão do contrato, segurança do trabalho, organização sindical e processo do trabalho.',
    'Lei nº 13.467/2017': 'Reforma trabalhista: prevalência do negociado sobre o legislado em temas definidos, teletrabalho, trabalho intermitente, banco de horas por acordo individual, fracionamento de férias e rescisão por acordo.',
    'Lei nº 13.874/2019': 'Declaração de Direitos de Liberdade Econômica: instituiu a CTPS Digital, simplificou o registro de ponto (obrigatório acima de 20 empregados, com ponto por exceção) e substituiu o eSocial por sistema simplificado.',
    'Lei nº 14.442/2022': 'Define que o auxílio-alimentação deve ser usado só para refeições ou gêneros alimentícios, veda deságio com fornecedores e atualiza o teletrabalho (por produção ou jornada, regime híbrido).',
    'Lei nº 6.019/1974': 'Disciplina o trabalho temporário por empresa de trabalho temporário (até 180 dias, prorrogáveis por mais 90) e a prestação de serviços a terceiros, com responsabilidade subsidiária da contratante.',
    'Lei nº 13.429/2017': 'Alterou a Lei nº 6.019/1974 para ampliar o trabalho temporário e regular a terceirização, inclusive da atividade-fim, com exigências de capital social da prestadora.',
    'Lei nº 9.601/1998': 'Permite contrato por prazo determinado instituído por negociação coletiva, com redução de encargos, e criou o banco de horas com compensação no período máximo de um ano.',
    'Lei Complementar nº 150/2015': 'Regula o contrato de trabalho doméstico: jornada, horas extras, FGTS obrigatório, seguro-desemprego e recolhimento unificado pelo Simples Doméstico.',
    'Decreto nº 10.854/2021': 'Consolida regulamentos trabalhistas: registro eletrônico de ponto, PAT, vale-transporte, gratificação natalina, trabalho temporário, Livro de Inspeção do Trabalho Eletrônico e outros temas.',
    # 2. Admissão
    'CLT, arts. 2º, 3º, 29 e 41': 'Definem empregador (art. 2º) e empregado (art. 3º), a anotação da CTPS na admissão (art. 29) e a obrigação de manter registro de cada empregado (art. 41).',
    'Portaria MTP nº 671/2021': 'Consolida atos infralegais trabalhistas: CTPS Digital, livro e registro eletrônico de empregados, sistemas de ponto (REP-C, REP-A e REP-P), trabalho temporário, gratificação e outros procedimentos.',
    'Lei nº 12.506/2011': 'Aviso-prévio proporcional: 30 dias para até um ano de serviço, mais 3 dias por ano trabalhado, limitado a 90 dias no total.',
    'Lei nº 9.029/1995': 'Proíbe práticas discriminatórias na admissão e na manutenção do emprego, inclusive a exigência de teste de gravidez ou esterilização, com reintegração ou indenização em caso de dispensa discriminatória.',
    'Lei nº 11.788/2008': 'Lei do Estágio: termo de compromisso, jornada de até 6h diárias, bolsa e auxílio-transporte (no estágio não obrigatório), seguro de acidentes, recesso e limite de 2 anos na mesma concedente.',
    'Lei nº 10.097/2000': 'Alterou a CLT para regular a aprendizagem (14 a 24 anos), com contrato especial de até 2 anos e cota de 5% a 15% dos empregos que exigem formação profissional.',
    'Decreto nº 9.579/2018': 'Consolida atos sobre criança e adolescente, incluindo a regulamentação da contratação de aprendizes, cálculo da cota e entidades formadoras.',
    'Lei nº 13.709/2018': 'LGPD: define bases legais para tratar dados pessoais, regras para dados sensíveis (como saúde), direitos dos titulares, deveres de segurança, encarregado (DPO) e sanções da ANPD.',
    # 3. Folha
    'CLT, arts. 457 a 467': 'Definem salário e remuneração, parcelas que integram ou não o salário (prêmios, diárias, ajuda de custo), equiparação salarial, prazos e forma de pagamento e verbas incontroversas na rescisão.',
    'Lei nº 4.090/1962': 'Institui a gratificação natalina (13º salário): 1/12 da remuneração de dezembro por mês trabalhado, considerando fração igual ou superior a 15 dias.',
    'Lei nº 4.749/1965': 'Regula o pagamento do 13º em duas parcelas: a primeira entre fevereiro e 30 de novembro (ou nas férias, se solicitada) e a segunda até 20 de dezembro.',
    'Decreto nº 57.155/1965': 'Regulamentava o 13º salário (cálculo de média para remuneração variável e pagamento das parcelas); a matéria foi incorporada ao Decreto nº 10.854/2021.',
    'Lei nº 8.212/1991': 'Lei de custeio da Seguridade Social: contribuições do empregado e da empresa (patronal, RAT/SAT, terceiros), salário de contribuição, verbas que não integram a base e obrigações de recolhimento.',
    'Lei nº 8.213/1991': 'Plano de Benefícios da Previdência: auxílio por incapacidade, aposentadorias, salário-maternidade, salário-família, acidente de trabalho (CAT, estabilidade de 12 meses) e cota de PCD (art. 93).',
    'Decreto nº 3.048/1999': 'Regulamento da Previdência Social: detalha contribuições, salário de contribuição, parcelas isentas, benefícios, prazos e obrigações acessórias das empresas.',
    'Lei nº 8.036/1990': 'Lei do FGTS: depósito mensal de 8% da remuneração (2% para aprendiz) até o dia 20, multa rescisória de 40% na dispensa sem justa causa e hipóteses de saque.',
    'Lei Complementar nº 110/2001': 'Criou contribuições sociais sobre o FGTS para cobrir expurgos de planos econômicos; a contribuição de 10% sobre a multa rescisória foi extinta a partir de 2020.',
    'Lei nº 10.101/2000': 'Participação nos Lucros ou Resultados (PLR): negociada com comissão de empregados ou sindicato, com regras claras, no máximo 2 pagamentos por ano, sem incidência de encargos trabalhistas e previdenciários.',
    'Lei nº 7.713/1988': 'Base do Imposto de Renda da pessoa física: tributação mensal dos rendimentos do trabalho e lista de rendimentos isentos (por exemplo, indenizações rescisórias e FGTS).',
    'Lei nº 9.250/1995': 'Fixa a tabela progressiva do IRPF e as deduções da base de cálculo (dependentes, previdência oficial, pensão alimentícia) usadas no cálculo do IRRF na folha.',
    'Decreto nº 9.580/2018': 'Regulamento do Imposto de Renda (RIR/2018): consolida regras de rendimentos tributáveis e isentos, retenção na fonte (IRRF) e responsabilidades da fonte pagadora.',
    'Instrução Normativa RFB nº 2.110/2022': 'Normas gerais de tributação previdenciária e de arrecadação das contribuições sociais: bases de cálculo, parcelas não integrantes, alíquotas, retenção de 11% e obrigações acessórias.',
    'Instrução Normativa RFB nº 2.237/2024': 'Disciplina a DCTFWeb, que confessa os débitos previdenciários e de terceiros apurados pelo eSocial e pela EFD-Reinf; substituiu a IN RFB nº 2.005/2021 a partir de 01/01/2025 e incorporou outros tributos (MIT).',
    'Portaria MTE nº 240/2024': 'Regulamenta o FGTS Digital: recolhimento por guia gerada a partir das informações do eSocial, pagamento via Pix, prazos e procedimentos de consulta e regularização.',
    # 4. Jornada
    'Constituição Federal, art. 7º': 'Fixa os direitos mínimos: jornada de 8h diárias e 44h semanais, hora extra com adicional mínimo de 50%, repouso semanal remunerado, férias anuais com 1/3 e licenças maternidade e paternidade.',
    'CLT, arts. 58 a 75': 'Duração do trabalho: limites de jornada, horas extras, banco de horas e compensação, intervalos intrajornada e interjornada, trabalho noturno e obrigação de controle de ponto.',
    'CLT, arts. 129 a 153': 'Férias: período aquisitivo e concessivo, faltas que reduzem os dias, fracionamento em até 3 períodos, abono pecuniário, férias coletivas, pagamento 2 dias antes e férias em dobro.',
    'Lei nº 605/1949': 'Garante o repouso semanal remunerado, preferencialmente aos domingos, e a remuneração dos feriados; faltas injustificadas na semana podem levar à perda do DSR.',
    'jornada|Portaria MTP nº 671/2021': 'Define os sistemas de registro eletrônico de ponto (REP-C, REP-A e REP-P), requisitos técnicos, arquivos fiscais (AFD e AEJ) e comprovantes ao trabalhador.',
    # 5. Benefícios
    'Lei nº 7.418/1985': 'Institui o vale-transporte: antecipado pelo empregador para o deslocamento casa-trabalho, com desconto de até 6% do salário-base do empregado.',
    'Decreto nº 95.247/1987': 'Regulamentava o vale-transporte (beneficiários, declaração de endereço, custeio e vedação de pagamento em dinheiro); a matéria foi incorporada ao Decreto nº 10.854/2021.',
    'Lei nº 6.321/1976': 'Cria o Programa de Alimentação do Trabalhador (PAT), que permite dedução no IR da empresa e afasta a natureza salarial da alimentação fornecida dentro do programa.',
    'Lei nº 11.770/2008': 'Programa Empresa Cidadã: prorroga a licença-maternidade por 60 dias e a paternidade por 15 dias, com dedução no IR para empresas tributadas pelo lucro real.',
    'Lei nº 9.656/1998': 'Regula os planos privados de saúde; os arts. 30 e 31 garantem a manutenção do plano ao ex-empregado demitido sem justa causa ou aposentado que contribuía.',
    'Lei nº 14.457/2022': 'Programa Emprega + Mulheres: apoio à parentalidade (reembolso-creche, flexibilização de jornada) e obrigação de medidas de prevenção ao assédio nas empresas com CIPA.',
    # 6. NRs
    'NR-01': 'Disposições gerais de SST e Gerenciamento de Riscos Ocupacionais (GRO/PGR), incluindo riscos psicossociais, capacitação e direito de recusa.',
    'NR-04': 'Dimensionamento do SESMT (engenheiro, técnico, médico e enfermeiro do trabalho) conforme grau de risco e número de empregados.',
    'NR-05': 'Constituição e funcionamento da CIPA, eleição de membros, estabilidade do cipeiro e ações de prevenção ao assédio.',
    'NR-06': 'Fornecimento gratuito, treinamento e controle de uso de EPI com Certificado de Aprovação (CA).',
    'NR-07': 'PCMSO: exames admissional, periódico, de retorno ao trabalho, de mudança de risco e demissional, com emissão de ASO.',
    'NR-09': 'Avaliação e controle das exposições a agentes físicos, químicos e biológicos, integrada ao PGR.',
    'NR-10': 'Segurança em instalações e serviços com eletricidade, com treinamento obrigatório de quem atua nessa atividade.',
    'NR-15': 'Lista agentes e limites de tolerância que caracterizam insalubridade e define o adicional de 10%, 20% ou 40% do salário mínimo.',
    'NR-16': 'Define atividades perigosas (explosivos, inflamáveis, eletricidade, segurança patrimonial, motocicleta) e o adicional de 30% sobre o salário-base.',
    'NR-17': 'Ergonomia: mobiliário, postos de trabalho, organização do trabalho e regras para teleatendimento e checkout; base do trabalho administrativo e em computador.',
    'NR-23': 'Medidas de prevenção e combate a incêndio, saídas de emergência e treinamento dos trabalhadores.',
    'NR-24': 'Condições de instalações sanitárias, vestiários, refeitórios, água potável e conforto nos locais de trabalho.',
    'NR-28': 'Procedimentos de fiscalização, prazos para regularização e gradação das multas por descumprimento das NRs.',
    'NR-03': 'Critérios para embargo de obra e interdição de estabelecimento ou máquina em situação de grave e iminente risco.',
    'NR-08': 'Requisitos técnicos mínimos das edificações para segurança e conforto dos trabalhadores.',
    'NR-11': 'Segurança na operação de equipamentos de transporte, movimentação, armazenagem e manuseio de materiais.',
    'NR-12': 'Proteções, dispositivos de segurança e capacitação para operação e manutenção de máquinas e equipamentos.',
    'NR-13': 'Inspeção, operação e manutenção de caldeiras, vasos de pressão, tubulações e tanques metálicos.',
    'NR-14': 'Requisitos de construção e operação segura de fornos.',
    'NR-18': 'Segurança e saúde na indústria da construção, incluindo PGR específico de obras.',
    'NR-19': 'Fabricação, manuseio, armazenagem e transporte de explosivos.',
    'NR-20': 'Segurança em atividades com inflamáveis e combustíveis, com classificação de instalações e capacitação.',
    'NR-21': 'Proteção de trabalhadores em atividades a céu aberto (intempéries, insolação, abrigos).',
    'NR-22': 'Segurança e saúde ocupacional na mineração.',
    'NR-25': 'Destinação adequada de resíduos industriais para proteger trabalhadores e ambiente.',
    'NR-26': 'Cores e sinalização de segurança e rotulagem de produtos químicos (GHS).',
    'NR-29': 'Segurança e saúde no trabalho portuário.',
    'NR-30': 'Segurança e saúde no trabalho aquaviário (embarcações).',
    'NR-31': 'Segurança e saúde no trabalho na agricultura, pecuária, silvicultura, exploração florestal e aquicultura.',
    'NR-32': 'Segurança e saúde em serviços de saúde (riscos biológicos, químicos, radiações e perfurocortantes).',
    'NR-33': 'Segurança em espaços confinados: permissão de entrada, monitoramento e resgate.',
    'NR-34': 'Condições de trabalho na indústria de construção, reparação e desmonte naval.',
    'NR-35': 'Trabalho em altura acima de 2 metros: planejamento, análise de risco, capacitação e aptidão médica.',
    'NR-36': 'Segurança e saúde em empresas de abate e processamento de carnes e derivados.',
    'NR-37': 'Segurança e saúde em plataformas de petróleo.',
    'NR-38': 'Segurança e saúde nas atividades de limpeza urbana e manejo de resíduos sólidos.',
    # 7. eSocial
    'Decreto nº 8.373/2014': 'Institui o eSocial, sistema único de escrituração digital das obrigações fiscais, previdenciárias e trabalhistas, gerido por RFB, INSS, MTE, Caixa e Previdência.',
    'Manual de Orientação do eSocial (MOS)': 'Explica como preencher e transmitir cada evento do eSocial, prazos de envio e situações específicas (afastamentos, rescisões, retificações).',
    'Leiautes eSocial S-1.3 e notas técnicas aplicáveis': 'Especificação técnica dos eventos (campos, regras de validação e tabelas), atualizada por notas técnicas; base para o sistema de folha gerar os arquivos.',
    'esocial|Portaria MTP nº 671/2021': 'Define que o registro de empregados e a CTPS Digital são alimentados pelas informações enviadas ao eSocial, com prazos de envio na admissão.',
    'esocial|Lei nº 8.212/1991': 'Fundamenta as contribuições previdenciárias que o eSocial informa e que são confessadas na DCTFWeb.',
    'IN RFB nº 2.237/2024': 'Rege a DCTFWeb, que recebe os débitos apurados no eSocial (S-1299) e na EFD-Reinf e gera o DARF; substituiu a IN RFB nº 2.005/2021 em 2025.',
    'IN RFB nº 2.043/2021': 'Disciplina a EFD-Reinf: retenções e informações que não são da folha (serviços tomados com cessão de mão de obra, pagamentos a pessoas físicas e jurídicas, IRRF da série R-4000).',
    'esocial|Lei nº 8.036/1990': 'Base legal do depósito do FGTS, hoje apurado a partir dos eventos de remuneração e desligamento do eSocial.',
    'esocial|Portaria MTE nº 240/2024': 'Regulamenta o FGTS Digital, que usa os dados do eSocial para emitir a guia de recolhimento (GFD) com pagamento via Pix.',
    'Lei nº 4.923/1965': 'Criou o CAGED (admissões e desligamentos), hoje substituído pelas informações enviadas ao eSocial.',
    'Decreto nº 76.900/1975': 'Instituiu a RAIS, declaração anual de vínculos, substituída pelo eSocial para os empregadores obrigados.',
    'S-1000': 'Cadastro do empregador (classificação tributária, opções e contatos); é o primeiro evento enviado.',
    'S-1010': 'Cadastra as rubricas da folha e sua incidência para INSS, IRRF e FGTS; erros aqui afetam todos os encargos.',
    'S-1020': 'Cadastra as lotações tributárias (FPAS, código de terceiros) usadas para calcular contribuições.',
    'S-1200': 'Informa a remuneração mensal de cada trabalhador por rubrica, base dos cálculos de INSS e FGTS.',
    'S-1210': 'Informa os pagamentos efetivamente feitos ao trabalhador (regime de caixa), base do IRRF.',
    'S-1299': 'Fecha o período de apuração e envia os totais à DCTFWeb.',
    'S-2190': 'Registro preliminar da admissão, quando os dados completos ainda não estão disponíveis.',
    'S-2200': 'Cadastro completo do trabalhador e do contrato na admissão; alimenta a CTPS Digital.',
    'S-2205': 'Atualiza dados pessoais do trabalhador (endereço, estado civil, dependentes).',
    'S-2206': 'Registra alterações do contrato (cargo, salário, jornada, lotação).',
    'S-2210': 'Comunicação de Acidente de Trabalho (CAT) por meio do eSocial.',
    'S-2220': 'Informa os exames do PCMSO (ASO) realizados pelo trabalhador.',
    'S-2230': 'Registra afastamentos temporários (doença, licença-maternidade, férias quando exigido) e seu término.',
    'S-2240': 'Informa as condições ambientais e os agentes nocivos a que o trabalhador está exposto (base do PPP eletrônico).',
    'S-2299': 'Registra o desligamento do empregado e as verbas rescisórias.',
    'S-2399': 'Registra o término de trabalhador sem vínculo de emprego (por exemplo, estagiário ou diretor não empregado).',
    'S-2500': 'Informa decisões e acordos de processos trabalhistas com reflexos em contratos e remunerações.',
    'S-2501': 'Informa as contribuições previdenciárias e o IRRF decorrentes de processo trabalhista.',
    # 8. Afastamentos
    'afastamentos|Lei nº 8.213/1991': 'Regula auxílio por incapacidade temporária (empresa paga os 15 primeiros dias), auxílio-acidente, salário-maternidade e estabilidade acidentária.',
    'afastamentos|Lei nº 8.212/1991': 'Define a incidência de contribuições sobre verbas de afastamento (por exemplo, o salário-maternidade integra a base; os 15 dias de doença também).',
    'afastamentos|Decreto nº 3.048/1999': 'Detalha procedimentos de perícia, requerimento de benefícios e compensação de salário-maternidade e salário-família pela empresa.',
    'afastamentos|Constituição Federal, art. 7º': 'Garante licença-maternidade de 120 dias, licença-paternidade e proteção contra despedida arbitrária.',
    'CLT, arts. 131, 392 a 396 e 473': 'Ausências que não reduzem férias (art. 131), licença-maternidade e garantias da gestante e lactante (arts. 392 a 396) e faltas justificadas sem desconto (art. 473).',
    'afastamentos|Lei nº 11.770/2008': 'Permite à empresa aderente ao Programa Empresa Cidadã prorrogar a licença-maternidade em 60 dias e a paternidade em 15 dias.',
    'Lei nº 14.151/2021': 'Determinou o afastamento da gestante do trabalho presencial durante a emergência de Covid-19, sem prejuízo da remuneração; tem caráter histórico.',
    'Lei nº 14.311/2022': 'Alterou a Lei nº 14.151/2021 para permitir o retorno presencial da gestante vacinada e prever hipóteses de afastamento; também de caráter transitório.',
    # 9. Inclusão
    'inclusao|Constituição Federal de 1988': 'Assegura igualdade, dignidade da pessoa humana e proíbe diferença de salários e critérios de admissão por sexo, idade, cor, estado civil ou deficiência (art. 7º, XXX e XXXI).',
    'inclusao|Lei nº 9.029/1995': 'Veda exigências discriminatórias na contratação e na manutenção do emprego e prevê reintegração ou indenização em dobro.',
    'Lei nº 8.213/1991, art. 93': 'Empresas com 100 ou mais empregados devem preencher de 2% a 5% dos cargos com pessoas com deficiência ou reabilitadas.',
    'Lei nº 13.146/2015': 'Estatuto da Pessoa com Deficiência: igualdade de oportunidades, acessibilidade e adaptações razoáveis no ambiente de trabalho.',
    'Lei nº 14.611/2023': 'Igualdade salarial entre mulheres e homens: obriga empresas com 100 ou mais empregados a publicar relatório semestral de transparência salarial.',
    'Decreto nº 11.795/2023': 'Regulamenta a Lei nº 14.611/2023: conteúdo do relatório de transparência, plano de ação para mitigar desigualdades e fiscalização.',
    'inclusao|Lei nº 14.457/2022': 'Exige medidas de prevenção e combate ao assédio sexual e outras formas de violência nas empresas com CIPA (regras de conduta, canal de denúncia e treinamento).',
    'Lei nº 12.288/2010': 'Estatuto da Igualdade Racial: promoção de igualdade de oportunidades no mercado de trabalho e ações afirmativas.',
    'Lei nº 7.716/1989': 'Define crimes de preconceito de raça, cor, etnia, religião ou procedência, inclusive negar ou obstar emprego por esses motivos.',
    'Lei nº 10.741/2003': 'Estatuto da Pessoa Idosa: proíbe discriminação por idade na admissão e limite máximo de idade em concursos e seleções.',
    # 10. Dados
    'dados|Lei nº 13.709/2018': 'Regula o tratamento de dados pessoais no RH: bases legais (contrato, obrigação legal), dados sensíveis de saúde, prazos de retenção, segurança e direitos dos empregados.',
    'Lei nº 13.853/2019': 'Alterou a LGPD e criou a Autoridade Nacional de Proteção de Dados (ANPD), responsável por regulamentar e fiscalizar.',
    'Lei nº 12.965/2014': 'Marco Civil da Internet: princípios de privacidade, guarda de registros de acesso e proteção de dados em comunicações eletrônicas.',
    'Decreto nº 8.771/2016': 'Regulamenta o Marco Civil: padrões de segurança para guarda de registros e dados pessoais.',
    'Lei nº 12.682/2012': 'Autoriza a digitalização e o armazenamento eletrônico de documentos, com garantia de integridade e autenticidade.',
    'Decreto nº 10.278/2020': 'Fixa requisitos técnicos para que o documento digitalizado tenha o mesmo valor legal do original em papel (assinatura ICP-Brasil e metadados).',
    'dados|Lei nº 13.874/2019': 'Equipara documentos digitalizados conforme regulamento ao original e permite descartar o papel após a digitalização, salvo documentos de valor histórico.',
    'Lei nº 14.063/2020': 'Classifica as assinaturas eletrônicas (simples, avançada e qualificada) e define onde cada uma pode ser usada.',
    # 11. Coletivas
    'Convenção Coletiva de Trabalho (CCT)': 'Acordo entre sindicato patronal e sindicato dos empregados que vale para toda a categoria na base territorial: pisos, reajustes, benefícios e jornada.',
    'Acordo Coletivo de Trabalho (ACT)': 'Acordo entre uma ou mais empresas e o sindicato dos empregados, com regras específicas que prevalecem sobre a convenção.',
    'CLT, arts. 511 a 610': 'Organização sindical: categorias econômicas e profissionais, enquadramento sindical, base territorial e contribuição sindical (hoje facultativa).',
    'CLT, arts. 611-A e 611-B': 'O art. 611-A lista o que a negociação coletiva pode ajustar com prevalência sobre a lei; o art. 611-B lista direitos que não podem ser reduzidos.',
    'Constituição Federal, art. 8º': 'Liberdade sindical, unicidade sindical por base territorial e obrigatoriedade de participação dos sindicatos nas negociações coletivas.',
    'Lei nº 7.783/1989': 'Lei de Greve: requisitos para o exercício, aviso prévio, atividades essenciais e efeitos sobre o contrato de trabalho.',
    'coletivas|Lei nº 10.101/2000': 'Regras da PLR negociada com sindicato ou comissão de empregados, sem natureza salarial.',
    # 12. IKT
    'Lei nº 10.973/2004': 'Lei de Inovação: incentivos à pesquisa científica e tecnológica, parcerias entre ICTs e empresas, bolsas de estímulo à inovação e compartilhamento de laboratórios.',
    'Decreto nº 9.283/2018': 'Regulamenta o Marco Legal de CT&I: acordos de parceria, convênios para PD&I, bolsas, prestação de contas simplificada e transferência de tecnologia.',
    'Lei nº 11.196/2005': 'Lei do Bem: incentivos fiscais a empresas do lucro real que investem em PD&I (exclusão adicional de dispêndios, inclusive com pesquisadores).',
    'Lei nº 8.248/1991': 'Lei de Informática: benefício fiscal a fabricantes de bens de TIC condicionado a investimento em PD&I, base dos convênios com ICTs como o IKT.',
    'Decreto nº 10.356/2020': 'Regulamenta a Lei de Informática: cálculo do investimento obrigatório, dispêndios elegíveis (incluindo pessoal), relatórios demonstrativos e prestação de contas.',
    'Lei nº 13.674/2018': 'Alterou a Lei de Informática e a da Zona Franca, com regras para investimento em PD&I, fiscalização e reinvestimento de glosas.',
    'Lei nº 13.969/2019': 'Reformulou a Lei de Informática, substituindo a redução de IPI por crédito financeiro proporcional ao investimento em PD&I.',
    'Lei nº 8.958/1994': 'Regula as relações das instituições federais de ensino e pesquisa com fundações de apoio, inclusive na gestão de projetos e de pessoal.',
    'Lei nº 10.406/2002': 'Código Civil: regras gerais dos contratos, incluindo a prestação de serviços sem vínculo de emprego (arts. 593 a 609).',
    'Lei Complementar nº 123/2006': 'Estatuto da Microempresa e Empresa de Pequeno Porte: Simples Nacional e regras para contratação de fornecedores enquadrados.',
}


def resumo_of(sid, name):
    """Resumo específico da seção (chave 'seção|nome') ou, na falta dele, o resumo geral da norma."""
    return RESUMO.get(f'{sid}|{name}') or RESUMO.get(name)


# Normas de PD&I citadas na trilha, no glossário e na Base normativa (mesmos endereços já usados nesses manuais).
DOU = 'https://www.in.gov.br/'
SUF = 'https://www.gov.br/suframa/pt-br/assuntos/pdi/legislacao/conteudo/'
EXTRA = {
    'L8387': ('Lei nº 8.387/1991', 1991, P + 'leis/l8387compilado.htm', 'Lei de Informática da Zona Franca de Manaus: contrapartida em PD&I das empresas incentivadas.'),
    'L13243': ('Lei nº 13.243/2016', 2016, P + '_ato2015-2018/2016/lei/l13243.htm', 'Marco Legal de Ciência, Tecnologia e Inovação, que alterou a Lei de Inovação.'),
    'D10521': ('Decreto nº 10.521/2020', 2020, P + '_ato2019-2022/2020/decreto/d10521.htm', 'Regulamenta o investimento em PD&I das empresas da Zona Franca de Manaus (Lei nº 8.387/1991).'),
    'D6008': ('Decreto nº 6.008/2006', 2006, P + '_ato2004-2006/2006/decreto/d6008.htm', 'Regulamento anterior do investimento em PD&I na Zona Franca de Manaus.'),
    'D10891': ('Decreto nº 10.891/2021', 2021, P + '_ato2019-2022/2021/decreto/d10891.htm', 'Alterou o regulamento de PD&I da Zona Franca de Manaus.'),
    'D11127': ('Decreto nº 11.127/2022', 2022, P + '_ato2019-2022/2022/decreto/d11127.htm', 'Alterou o regulamento de PD&I da Zona Franca de Manaus.'),
    'CAPDA2': ('Resolução CAPDA nº 2/2020', 2020, DOU + 'web/dou/-/resolucao-n-2-de-31-de-marco-de-2020-250852927', 'Regras de aplicação, acompanhamento e prestação de contas dos programas prioritários.'),
    'CAPDA5': ('Resolução CAPDA nº 5/2010', 2010, SUF + 'resolucao_capda_05-2010-e-anexos.pdf', 'Critérios de credenciamento e de aplicação de recursos de PD&I.'),
    'CAPDA8': ('Resolução CAPDA nº 8/2015', 2015, SUF + 'resolucao-no-08-2015-alteracao-percentual-doutores.pdf', 'Alterou o percentual de doutores exigido.'),
    'CAPDA9': ('Resolução CAPDA nº 9/2019', 2019, DOU + 'en/web/dou/-/resolucao-n-9-de-29-de-outubro-de-2019-226220981', 'Cria o Programa Prioritário de Indústria 4.0 e Modernização Industrial (PPI 4.0).'),
    'CAPDA30': ('Resolução CAPDA nº 30/2022', 2022, DOU + 'en/web/dou/-/resolucao-capda/me-n-30-de-14-de-setembro-de-2022-429349373', 'Alterou regras dos programas prioritários.'),
}


def browser_table():
    """Tabela {chave: {u, y, n, r}} usada por assets/normas.js para criar links em todas as páginas."""
    from rh import SECTIONS
    out = {}
    for sec in SECTIONS:
        for _, rows, _ in sec['tables']:
            for name, _ in rows:
                k, _a = key_of(name)
                u = url_of(name.split(',')[0]) if k else None
                if not k or not u or k in ('CF', 'MOS'):
                    continue
                if k == 'CLT':
                    k, name = 'DL5452', 'Decreto-Lei nº 5.452/1943 (CLT)'
                if k == 'NR':
                    out['NR'] = dict(u=u, n='Normas Regulamentadoras (MTE)')
                    continue
                if k in out:
                    continue
                import re as _re
                y = _re.search(r'/(\d{4})', name)
                r = RESUMO.get(name.strip(), '')
                out[k] = dict(u=u, y=int(y.group(1)) if y else None, n=name, r=r.split('. ')[0][:140])
    for k, (n, y, u, r) in EXTRA.items():
        out.setdefault(k, dict(u=u, y=y, n=n, r=r))
    # A Lei de Inovação usa a versão compilada, como na Base normativa.
    out['L10973']['u'] = P + '_ato2004-2006/2004/lei/l10.973compilado.htm'
    return out
