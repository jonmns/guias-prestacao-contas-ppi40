# -*- coding: utf-8 -*-
"""Conteúdo editorial do portal (trilhas, glossário, checklists, atalhos, relações).

Regras de redação deste arquivo:
- Todo fato vem dos três manuais. Nada de regra, prazo ou obrigação nova.
- Quando algo depende de validação, usa-se o bloco 'valid', 'premise' ou 'gap'.
- Exemplos com números são ilustrativos e dizem isso no texto.
Referências a manuais usam "manual#secao" ou "manual#secao:trecho do título".
"""

M = {'guia': 'Guia de prestação de contas',
     'ferramentas': 'Manual das ferramentas',
     'normativa': 'Base normativa de PD&I'}

# ---------------------------------------------------------------- relações entre seções
# pares simétricos "manual#secao" <-> "manual#secao"
RELATED_PAIRS = [
    ('guia#rotina', 'ferramentas#ordem'), ('guia#rotina', 'ferramentas#checklist'),
    ('guia#rotina', 'guia#anexo'), ('guia#obrigacoes', 'normativa#rotina'),
    ('guia#obrigacoes', 'normativa#cuidados'), ('guia#dependencias', 'guia#processos'),
    ('guia#processos', 'ferramentas#integracao'), ('guia#lacunas', 'normativa#lacunas'),
    ('guia#lacunas', 'ferramentas#lacunas'), ('guia#riscos', 'ferramentas#erros'),
    ('guia#melhorias', 'ferramentas#alertas'), ('guia#anexo', 'ferramentas#rubricas'),
    ('guia#funcao', 'ferramentas#resumo'), ('guia#jornada', 'ferramentas#ordem'),
    ('guia#e2e', 'ferramentas#integracao'), ('guia#resumo', 'normativa#resumo'),
    ('ferramentas#pf', 'ferramentas#rubricas'), ('ferramentas#pf', 'ferramentas#erros'),
    ('ferramentas#pf', 'ferramentas#alertas'), ('ferramentas#ig', 'ferramentas#rd'),
    ('ferramentas#ig', 'guia#melhorias'), ('ferramentas#rd', 'ferramentas#rastreio'),
    ('ferramentas#ordem', 'ferramentas#checklist'), ('ferramentas#integracao', 'ferramentas#rastreio'),
    ('ferramentas#rubricas', 'guia#anexo'), ('ferramentas#lacunas', 'ferramentas#alertas'),
    ('normativa#rotina', 'ferramentas#pf'), ('normativa#rotina', 'ferramentas#rd'),
    ('normativa#normas', 'normativa#mapa'), ('normativa#manuais', 'guia#anexo'),
    ('normativa#dossie', 'guia#anexo'), ('normativa#cuidados', 'guia#rotina'),
    ('normativa#modalidades', 'normativa#normas'), ('normativa#atualizacoes', 'normativa#lacunas'),
]

# etapa da trilha que cobre cada seção (para "Relacionados")
STAGE_OF = {'guia': ('etapa-1-processos', 'Etapa 1: Processos e prestação de contas'),
            'ferramentas': ('etapa-2-ferramentas', 'Etapa 2: Ferramentas e preenchimento'),
            'normativa': ('etapa-3-normas', 'Etapa 3: Base normativa e legislação')}

# ---------------------------------------------------------------- atalhos de consulta
SHORTCUTS = [
    dict(id='prestacao', title='Prestação de contas', q='prestação de contas',
         desc='Rotina mensal, entregas, e-mail de formalização e relação com o aporte.',
         links=['guia#resumo', 'guia#rotina:Cadência', 'guia#rotina:Entregas obrigatórias',
                'guia#processos:Envio, análise e aporte', 'ferramentas#ordem:PC Salvar e enviar']),
    dict(id='rateio', title='Rateio de RH', q='rateio',
         desc='Folha, horas no projeto, rateio de despesas compartilhadas e custo da hora.',
         links=['ferramentas#pf:Folha de pagamento', 'ferramentas#pf:Chave do mês',
                'ferramentas#ig:Índices derivados', 'ferramentas#rastreio',
                'guia#lacunas:Lacunas de informação']),
    dict(id='planilha', title='Planilha financeira', q='planilha financeira',
         desc='Abas, lançamentos, Posição Financeira, conciliação e erros comuns.',
         links=['ferramentas#pf:As 22 abas', 'ferramentas#pf:Posição Financeira', 'ferramentas#pf:Consolidado e conciliação',
                'ferramentas#rubricas', 'ferramentas#erros']),
    dict(id='indicadores', title='Indicadores', q='indicadores',
         desc='O que cada índice mede, curvas acumuladas e as três respostas do tópico XVI.',
         links=['ferramentas#ig:Os índices, um a um', 'ferramentas#ig:Quatro formas', 'ferramentas#ig:Leitura cruzada',
                'ferramentas#ig:Respondendo às três perguntas', 'guia#melhorias']),
    dict(id='relatorio', title='Relatório técnico', q='relatório técnico',
         desc='As 21 seções, quem fornece cada uma e a conferência com a planilha.',
         links=['ferramentas#rd', 'ferramentas#rd:XII', 'ferramentas#rd:Quadros de consolidação',
                'ferramentas#rastreio', 'ferramentas#ordem:RD Acrescentar']),
    dict(id='checklists', title='Checklists', q='checklist',
         desc='Fechamento mensal, início de projeto, aquisição, mudança no PUR e encerramento.',
         links=['ferramentas#checklist', 'guia#anexo:Roteiro de documentos por grupo', 'normativa#dossie']),
    dict(id='legislacao', title='Legislação', q='lei decreto resolução',
         desc='Leis, decretos, resoluções, portarias e manuais, com acesso ao texto oficial.',
         links=['normativa#mapa', 'normativa#normas', 'normativa#rotina', 'normativa#cuidados', 'normativa#atualizacoes']),
    dict(id='adendos', title='Adendos e mudanças', q='adendo',
         desc='Ofício prévio, janela de 60 dias e registro no tópico XIX.',
         links=['guia#processos:Mudanças, aquisições', 'guia#riscos', 'guia#obrigacoes:Obrigações junto ao CITS']),
]

QUICK = [
    ('ferramentas#checklist', 'Checklist de fechamento mensal', 'Marque antes de enviar a competência'),
    ('guia#rotina:Cadência', 'Cadência de atividades', 'Mensal, semestral, anual e por evento'),
    ('ferramentas#rubricas', 'Correspondência de rubricas', 'A mesma rubrica em cada ferramenta'),
    ('ferramentas#erros', 'Erros comuns de preenchimento', 'Sintoma, causa e prevenção'),
    ('guia#anexo:Roteiro de documentos por grupo', 'Roteiro de documentos (R6)', 'Itens 1 a 22 e periodicidade'),
    ('normativa#rotina', 'Da norma à rotina', 'Qual dispositivo sustenta cada procedimento'),
    ('ferramentas#ig:Respondendo às três perguntas', 'Respostas do tópico XVI', 'Resposta vaga e resposta fundamentada'),
    ('normativa#normas', 'Normas e dispositivos', 'O que cada norma regula, com link oficial'),
]

# ---------------------------------------------------------------- glossário
# (termo, definição, fonte "manual#secao[:trecho]", relacionados opcionais)
GLOSSARY = [
    ('Adendo', 'Aditamento ao PUR. Qualquer alteração do PUR (item imprevisto, remanejamento entre rubricas, prazo) exige ofício antes da execução e adendo assinado.', 'guia#processos:Mudanças, aquisições'),
    ('Ano-base', 'Ano a que se referem as obrigações do projeto. A relação de normas aplicáveis depende, entre outros fatores, do ano-base de cada projeto.', 'normativa#resumo'),
    ('Aporte', 'Recurso repassado ao projeto. No CITS, cada aporte fica condicionado à prestação de contas da competência e à análise de saldo de caixa.', 'guia#resumo'),
    ('Arquivo único', 'Um PDF por documento fiscal, reunindo nota fiscal, boleto, comprovante, rateio e, quando houver, proposta e contrato.', 'guia#processos:Coleta e montagem'),
    ('Baseline (PUR)', 'Coluna C da Posição Financeira: soma do PUR mês a mês, o orçamento total da rubrica.', 'ferramentas#pf:Posição Financeira'),
    ('Beneficiária', 'Empresa investidora. Participa do kickoff, aprova mudanças e valida as entregas na homologação.', 'guia#dependencias'),
    ('CAPDA', 'Comitê das Atividades de Pesquisa e Desenvolvimento na Amazônia, citado nas resoluções que regem o PPI 4.0 e o credenciamento de ICTs.', 'normativa#mapa'),
    ('Competência', 'Mês de referência da prestação de contas. No CITS a prestação de contas é mensal, por competência.', 'guia#rotina'),
    ('Conciliação bancária', 'Conferência de cada débito do extrato com a rubrica, a NF e o valor lançado. O Consolidado fecha quando o saldo do projeto bate com o saldo em conta e aplicação.', 'ferramentas#pf:Consolidado e conciliação'),
    ('Convênio direto', 'Modalidade em que a empresa incentivada firma convênio com ICT credenciada. Regida pela Portaria Conjunta ME/Suframa nº 9.835/2022.', 'normativa#modalidades'),
    ('Coordenadora (CITS)', 'Entidade que coordena o PPI 4.0 e recebe a prestação de contas da executora.', 'guia#organograma'),
    ('CITS', 'Coordenadora do PPI 4.0 nos documentos usados por estes manuais.', 'guia#organograma'),
    ('Custos incorridos', 'Parcela de custos indiretos e reserva. O modelo da Planilha Financeira usa 5% para a executora e 15% para a coordenadora; o percentual aplicável é o do PUR de cada projeto.', 'ferramentas#pf:Composição do valor'),
    ('drive.cits', 'Diretório do CITS com 17 pastas padrão, alinhadas ao PUR, onde a prestação de contas é publicada.', 'guia#anexo:Estrutura de pastas'),
    ('Elegibilidade', 'Critério do CITS: o dispêndio está nas categorias do decreto regulamentador vigente e se associa a atividades de P&D em TI do projeto.', 'guia#funcao:Como a atividade'),
    ('Enquadramento', 'Critério do CITS: o projeto mantém caráter de PD&I e maturidade de Indústria 4.0 nível 4.', 'guia#funcao:Como a atividade'),
    ('Adequação', 'Critério do CITS: volumes e valores compatíveis com objetivo, escopo e prazos.', 'guia#funcao:Como a atividade'),
    ('Pertinência', 'Critério do CITS: relação qualitativa do dispêndio com o escopo e o objetivo do projeto.', 'guia#funcao:Como a atividade'),
    ('EVM (valor agregado)', 'Método citado no tópico X (Cronograma) do Relatório Demonstrativo. Os manuais não detalham o cálculo.', 'ferramentas#rd'),
    ('Executora', 'Instituição que conduz o projeto com recursos do PPI 4.0 e presta contas ao CITS.', 'guia#resumo'),
    ('Fluxo_Roteiro R6', 'Roteiro de documentos do PPI 4.0 com 22 grupos de itens, do kickoff à regularidade institucional.', 'guia#anexo'),
    ('Guarda documental', 'Prazo de conservação dos documentos. A regra geral do Decreto 10.521 fala em cinco anos; a regra da executora em programa prioritário fala em dez (Res. CAPDA 2/2020, art. 15).', 'normativa#cuidados'),
    ('ICT', 'Instituição Científica, Tecnológica e de Inovação. Definição legal na Lei 8.387/1991 (art. 2º, § 23) e na Lei 10.973/2004 (art. 2º, V).', 'normativa#normas:Lei nº 8.387'),
    ('IG (Indicadores Gerenciais)', 'Planilha com valor, profissionais e horas planejados e realizados, mensais e acumulados, para 7 rubricas. Não tem vínculo com a Planilha Financeira.', 'ferramentas#ig'),
    ('Kickoff', 'Reunião de início no 1º mês, com Investidor, Executora e CITS. Exige a evidência Kickoff_PUR.', 'guia#rotina'),
    ('Lei de Informática da ZFM', 'Lei nº 8.387/1991. Vincula o benefício fiscal da empresa à obrigação de investir em PD&I.', 'normativa#normas:Lei nº 8.387'),
    ('Mini-CV', 'Mini-Curriculum de cada profissional alocado, entregue no 1º mês e na atualização.', 'guia#anexo:Roteiro de documentos por grupo'),
    ('Nota de débito', 'Documento por rubrica que comprova os custos incorridos (item 20.1 do Roteiro R6).', 'guia#anexo:Roteiro de documentos por grupo'),
    ('Ofício de mudança', 'Documento prévio à execução de qualquer alteração do PUR. Informa o que muda, por quê e o impacto em escopo, qualidade, custo, equipe, riscos e prazo.', 'guia#processos:Mudanças, aquisições'),
    ('PC (prestação de contas)', 'Pacote mensal e anual de documentos, planilha e relatório que a executora entrega ao CITS.', 'guia#resumo'),
    ('PD&I', 'Pesquisa, desenvolvimento e inovação. Atividades reconhecidas no art. 21 do Decreto 10.521/2020.', 'normativa#normas:Decreto nº 10.521'),
    ('PF (Planilha Financeira)', 'Planilha Financeira Mensal (.xlsm) com 22 abas. É a fonte dos valores em R$ do IG e do RD.', 'ferramentas#pf'),
    ('Posição Financeira', 'Aba que mostra, por rubrica, três linhas: PUR, Tendência e Real.', 'ferramentas#pf:Posição Financeira'),
    ('PPI 4.0', 'Programa Prioritário de Indústria 4.0 e Modernização Industrial, criado pela Resolução CAPDA 9/2019.', 'normativa#normas:Resolução CAPDA nº 9'),
    ('PUR', 'Plano de Utilização de Recursos do projeto.', 'normativa#modalidades'),
    ('RACI', 'Matriz de responsabilidades: Responsável, Aprovador, Consultado e Informado. A matriz do Guia é proposta, pois os papéis internos não constam dos anexos.', 'guia#processos:Matriz RACI'),
    ('RD (Relatório Demonstrativo)', 'Relatório técnico cumulativo, com 21 seções, de Dados Gerais à Conclusão da Coordenadora.', 'ferramentas#rd'),
    ('Rateio', 'Percentual do valor da nota atribuído ao projeto. Vem preenchido com 1 (100%) e precisa ser ajustado quando a despesa é compartilhada.', 'ferramentas#pf:Chave do mês'),
    ('RHD e RHI', 'Recursos Humanos Diretos e Indiretos. A Abertura de Pagamentos (abas III.I e IV.I) é a base do custo de RH na Posição Financeira.', 'ferramentas#pf:Folha de pagamento'),
    ('Rubrica', 'Categoria de dispêndio do projeto (equipamentos, laboratório, RH, livros, materiais, viagens, treinamento, terceiros, correlatos e outras). A numeração varia entre os modelos.', 'ferramentas#rubricas'),
    ('SIPOC', 'Quadro de Fornecedores, Entradas, Processo, Saídas e Clientes usado no mapeamento do Guia.', 'guia#processos:SIPOC'),
    ('STT', 'Serviços técnicos de terceiros, rubrica IX da Planilha Financeira.', 'ferramentas#rubricas'),
    ('Tendência', 'Linha da Posição Financeira com o replanejamento dos meses seguintes. As Orientações pedem atualizar a cada fechamento.', 'ferramentas#pf:Posição Financeira'),
    ('Termo de Encerramento', 'Documento que traz o quadro consolidado por rubrica e o resumo financeiro, e formaliza a quitação mútua.', 'guia#processos:Encerramento'),
    ('Termo de Homologação', 'Documento que lista as funcionalidades entregues à Beneficiária, assinado pelo Coordenador do PPI 4.0, pela Executora e pela Beneficiária.', 'guia#processos:Encerramento'),
    ('Declaração de Inexistência de Impedimento', 'Declaração semestral ligada à regularidade da executora (Res. CAPDA 30/2022, art. 6º).', 'guia#rotina'),
]

# ---------------------------------------------------------------- checklists
# cada item: (id, texto, fonte opcional)
CHECKLISTS = [
    dict(id='fechamento', title='Fechamento mensal da competência', legacy=True,
         sub='Mesma lista do Manual das ferramentas (seção 10). Marcações compartilhadas com o manual neste navegador.',
         source='ferramentas#checklist', items=None),  # itens lidos do manual no build
    dict(id='inicio', title='Início do projeto',
         sub='Itens do Guia (seções 02 e 05, Roteiro R6 itens 1, 6, 7 e 10.1.8 a 10.1.10) e do Manual das ferramentas (seção 02).',
         source='guia#processos:Início do projeto',
         groups=[('Estrutura e documentos', [
             ('Acordo de Cooperação (convênio) e PUR assinados e arquivados na pasta 16', 'guia#anexo'),
             ('Estrutura de 17 pastas criada no drive.cits', 'guia#anexo:Estrutura de pastas'),
             ('Kickoff realizado no 1º mês com Investidor, Executora e CITS, com evidência Kickoff_PUR arquivada (pasta 17)', 'guia#rotina'),
             ('Declarações iniciais enviadas, incluindo a Declaração de Guarda no início do projeto', 'guia#lacunas:Divergências entre os próprios documentos')]),
             ('Planilha Financeira (configuração única)', [
             ('Posição Financeira: cabeçalho preenchido (unidade, parceiro, C3, nome do projeto, início, fim, valor total, M7, C76, C77, C79)', 'ferramentas#ordem:PF Posição Financeira'),
             ('Valores previstos Iniciais: cronograma de desembolso do PUR (G9:R18) e percentuais E34 e E35', 'ferramentas#ordem:PF Valores previstos'),
             ('Profissionais Previstos: uma linha por função', 'ferramentas#ordem:PF Profissionais'),
             ('Conc. Bancária: banco, agência e conta corrente', 'ferramentas#ordem:PF Conc.')]),
             ('Indicadores e relatório', [
             ('IG: linhas planejadas das 7 abas conforme PUR ou último adendo', 'ferramentas#ordem:IG Linhas planejadas'),
             ('RD: partes fixas (I Dados Gerais, II, III, IV, V e VIII)', 'ferramentas#ordem:RD Partes fixas')]),
             ('Equipe', [
             ('Mini-CV, Ficha de Registro e Contrato de Trabalho de cada profissional na primeira PC', 'guia#anexo:Roteiro de documentos por grupo')])]),
    dict(id='profissional', title='Entrada ou alteração de profissional',
         sub='Itens do Roteiro R6 (10.1.8 a 10.2.6, 10.3.4) e do Guia (seção 02, "Por evento").',
         source='guia#rotina:Cadência',
         groups=[('Profissional CLT ou estagiário', [
             ('Mini-Curriculum', 'guia#anexo:Roteiro de documentos por grupo'),
             ('Ficha de Registro', 'guia#anexo:Roteiro de documentos por grupo'),
             ('Contrato de Trabalho e aditivos', 'guia#anexo:Roteiro de documentos por grupo')]),
             ('Bolsista', [
             ('Plano de trabalho do bolsista, Mini-CV, ficha e contrato', 'guia#anexo:Roteiro de documentos por grupo'),
             ('Relatório mensal de atividades com evidências', 'guia#dependencias')]),
             ('Prestador PJ', [
             ('Mini-Curriculum do PJ', 'guia#anexo:Roteiro de documentos por grupo'),
             ('Proposta, contrato, NF, comprovante, relatório de atividades e impostos retidos', 'guia#anexo:Roteiro de documentos por grupo')]),
             ('Planilha e relatório', [
             ('Folha lançada na Abertura de Pagamentos (III.I ou IV.I) com horas no projeto', 'ferramentas#ordem:PF Lançar a folha'),
             ('Participante incluído nos quadros do tópico XII e no tópico XV do RD', 'ferramentas#rd:XII')])]),
    dict(id='aquisicao', title='Aquisição de bens ou serviços',
         sub='Itens do Roteiro R6 (12 a 19, 21.4 e 21.5) e do Guia (seções 02, 03 e 10).',
         source='guia#anexo',
         groups=[('Antes da compra', [
             ('3 cotações de fornecedores distintos ou justificativa registrada', 'guia#anexo:Roteiro de documentos por grupo'),
             ('Item previsto no PUR? Se for item imprevisto, ofício enviado antes da execução', 'guia#processos:Mudanças, aquisições'),
             ('Triagem de elegibilidade feita (aba Gastos não elegíveis)', 'guia#rotina:Cadência')]),
             ('Depois da compra', [
             ('DANFE/NF, boleto e comprovante de pagamento reunidos em arquivo único com o rateio', 'guia#processos:Coleta e montagem'),
             ('Arquivo nomeado no padrão e salvo na pasta da rubrica', 'guia#anexo:Padrões de nome'),
             ('Importação: documentos de câmbio, DI, invoice e comprovante', 'guia#anexo:Roteiro de documentos por grupo'),
             ('Relatório de bens adquiridos atualizado, quando aplicável', 'guia#anexo:Roteiro de documentos por grupo'),
             ('Lançamento na aba da rubrica com data da competência, rateio e justificativa', 'ferramentas#pf:Abas de lançamento'),
             ('Guias de impostos vinculadas ao número da NF na Conc. Bancária', 'ferramentas#pf:Consolidado e conciliação')])]),
    dict(id='mudanca', title='Mudança no PUR ou adendo',
         sub='Itens do Guia (seções 03, 05 e 10) e do Manual das ferramentas (seções 05 e 08).',
         source='guia#processos:Mudanças, aquisições',
         groups=[('Antes de executar', [
             ('Verificar o prazo: o ofício deve chegar com no mínimo 60 dias antes do fim do cronograma', 'guia#obrigacoes:Obrigações junto ao CITS'),
             ('Ofício responde: o que muda (PUR, valor, origem e destino, itens), por quê e qual o impacto em escopo, qualidade, custo, equipe, riscos e prazo', 'guia#processos:Mudanças, aquisições'),
             ('Mudança não executada antes da formalização', 'guia#riscos')]),
             ('Depois da aprovação', [
             ('Adendo assinado e arquivado', 'guia#rotina:Cadência'),
             ('Valores previstos Iniciais atualizados na Planilha Financeira', 'ferramentas#ordem'),
             ('Linhas planejadas do IG conferidas com o último adendo', 'ferramentas#erros'),
             ('Mudança registrada no tópico XIX do RD e Dados Gerais atualizados (adendo, período, valor)', 'ferramentas#rd')])]),
    dict(id='declaracoes', title='Declarações e regularidade',
         sub='Itens do Roteiro R6 (21 e 22) e do Guia (seção 02).',
         source='guia#rotina:Cadência',
         groups=[('Periódicas', [
             ('Declaração de Inexistência de Impedimento vigente arquivada (semestral)', 'guia#rotina:Cadência'),
             ('Declaração de Guarda dos documentos contábeis do ano arquivada (anual e no início do projeto)', 'guia#lacunas:Divergências entre os próprios documentos'),
             ('Relatório Demonstrativo anual (técnico e financeiro) entregue', 'guia#rotina:Cadência'),
             ('Assinatura por representante legal da executora', 'guia#obrigacoes:Obrigações internas')]),
             ('Para validar', [
             ('Quem assina declarações, ofícios e termos na executora (lacuna dos anexos)', 'guia#lacunas:Lacunas de informação'),
             ('Qual ato a coordenação considera para a declaração semestral, caso o Roteiro cite resolução diferente da listada pela Suframa', 'normativa#lacunas:Divergências e conferências')])]),
    dict(id='encerramento', title='Encerramento do projeto',
         sub='Itens do Guia (seção 05, Encerramento; seção 09) e da Base normativa (seção 05).',
         source='guia#processos:Encerramento',
         groups=[('Documentos finais', [
             ('RD final descrevendo resultados alcançados e justificando divergências', 'guia#processos:Encerramento'),
             ('Termo de Homologação assinado pelo Coordenador do PPI 4.0, pela Executora e pela Beneficiária', 'guia#processos:Encerramento'),
             ('Termo de Encerramento com quadro por rubrica e resumo financeiro', 'guia#processos:Encerramento'),
             ('Saldo final de devolução apurado e informado no Termo', 'guia#riscos')]),
             ('Guarda e dossiê', [
             ('Registro do marco de início da contagem de guarda (cinco ou dez anos, conforme a regra aplicável)', 'normativa#cuidados'),
             ('Acervo preservado e localizável', 'guia#obrigacoes:Indicadores e prazos críticos'),
             ('Dossiê do projeto: enquadramento, instrumentos, execução técnica, execução financeira e encerramento', 'normativa#dossie')])]),
    dict(id='dossie', title='Dossiê de enquadramento do projeto',
         sub='Itens da Base normativa (seções 07 e 09). É recomendação de organização, não lista legal única.',
         source='normativa#dossie',
         groups=[('Documentos do caso', [
             ('Natureza jurídica da executora e ato de credenciamento no CAPDA', 'normativa#lacunas:Documentos do caso'),
             ('Ano-base de cada projeto', 'normativa#lacunas:Documentos do caso'),
             ('Convênio e PUR assinados, com aditivos', 'normativa#lacunas:Documentos do caso'),
             ('Versão do manual de prestação de contas entregue pelo CITS', 'normativa#lacunas:Documentos do caso')]),
             ('Divergências a conferir', [
             ('Confirmar com o CITS qual ato a "Resolução nº 04 de 11 de setembro de 2018" do Roteiro R6 designa', 'normativa#lacunas:Divergências e conferências'),
             ('Conferir a vigência do Decreto 6.008/2006 citado na Planilha Financeira', 'normativa#lacunas:Divergências e conferências'),
             ('Conferir o texto oficial antes de citar qualquer artigo em ofício ou resposta a diligência', 'normativa#lacunas:Divergências e conferências')])]),
]
