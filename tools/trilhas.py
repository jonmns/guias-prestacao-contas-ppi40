# -*- coding: utf-8 -*-
"""Trilhas de aprendizado: três etapas, lições, exercícios e estudos de caso.

Os textos explicam o conteúdo dos manuais em linguagem acessível. Não criam regras.
Exemplos numéricos são ilustrativos e estão identificados como tal.
"""

NOTE_KINDS = {
    'concept': ('Conceito', 'C'), 'example': ('Exemplo prático', 'E'), 'alert': ('Atenção', '!'),
    'norm': ('Exigência normativa', '§'), 'premise': ('Premissa', 'P'), 'gap': ('Lacuna', 'L'),
    'valid': ('Validar antes de usar', 'V'),
}


def note(kind, body, title=None):
    label, icon = NOTE_KINDS[kind]
    t = title or label
    return (f'<aside class="note n-{kind}"><span class="ni" aria-hidden="true">{icon}</span>'
            f'<span class="nl">{t}</span><div>{body}</div></aside>')


STAGES = []

# =====================================================================  ETAPA 1
STAGES.append(dict(
    id='etapa-1-processos', n=1, short='Processos',
    title='Processos e prestação de contas',
    manual='guia',
    level='Introdutório',
    summary='Entenda o papel do analista, o ciclo mensal de prestação de contas, o que entregar, quem fornece cada documento e quais são os riscos.',
    outcome='Ao concluir, você consegue explicar o ciclo da prestação de contas de um projeto PPI 4.0 e identificar o que é documentado, o que é premissa e o que é lacuna.',
    lessons=[
        dict(id='e1-l1', title='O papel do analista e o ciclo mensal', refs=['guia#resumo', 'guia#funcao', 'guia#jornada'],
             goals=['Descrever o papel do Analista de P&D na prestação de contas (PC).',
                    'Explicar por que a entrega da PC da competência condiciona o aporte seguinte.',
                    'Reconhecer as 11 etapas da jornada de uma competência.'],
             body=(
                 '<p>O Analista de P&amp;D responde pela prestação de contas dos projetos que a executora conduz com recursos do PPI 4.0. A cada competência mensal ele reúne as evidências de todos os dispêndios, monta os arquivos no padrão do CITS, consolida a Planilha Financeira e o Relatório Técnico, publica tudo no diretório <em>drive.cits</em> e formaliza a entrega por um e-mail único.</p>'
                 + note('concept', '<p><strong>Competência</strong> é o mês de referência da prestação de contas. <strong>Aporte</strong> é o recurso repassado ao projeto. No CITS, cada aporte fica condicionado à entrega da PC da competência, e o CITS ainda avalia o saldo de caixa antes de faturar o próximo aporte.</p>')
                 + '<h3>A jornada de uma competência</h3>'
                 '<p>O Guia descreve 11 etapas: entrada das demandas, coleta documental, conferência, consolidação, análises, prestação de contas, validações, aprovações, arquivamento, auditorias e retroalimentação. As etapas de validação e aprovação são conduzidas pelo CITS. As demais ficam com o analista, em parte com apoio do coordenador e das áreas internas.</p>'
                 + note('example', '<p>Exemplo ilustrativo. A PC de uma competência chega ao CITS com a pasta de RH incompleta. A pendência volta ao analista com o parecer. Enquanto ela não é resolvida, o próximo aporte pode atrasar. É o que o Guia resume com a frase "atraso ou pendência na PC significa atraso de caixa no projeto".</p>')
                 + note('premise', '<p>O cargo "Analista de P&amp;D" não aparece nominalmente nos documentos, que falam em "Executora". As atribuições do Guia foram derivadas do que a executora precisa entregar.</p>')
                 + note('gap', '<p>Os documentos não informam o dia do mês limite para entregar a PC ao CITS, nem o prazo de análise e de liberação do aporte depois do parecer.</p>')
                 + note('valid', '<p>Confirme com a coordenação o prazo de corte vigente para cada competência antes de montar um calendário interno.</p>')
             ),
             review=[('O que acontece com o aporte seguinte quando a PC da competência não é entregue?',
                      '<p>Ele não é liberado, porque cada aporte está condicionado à PC. O CITS também avalia o saldo de caixa antes de faturar o próximo aporte.</p>'),
                     ('Quais etapas da jornada são conduzidas pelo CITS?',
                      '<p>As validações (análise técnica e financeira) e as aprovações (parecer favorável e faturamento do aporte).</p>'),
                     ('Por que o cargo de analista é tratado como premissa no Guia?',
                      '<p>Porque os anexos usados falam em "Executora" e não nomeiam o cargo. As atribuições foram deduzidas do que precisa ser entregue.</p>')]),
        dict(id='e1-l2', title='O que entregar e quando: cadências e Roteiro R6', refs=['guia#rotina', 'guia#anexo'],
             goals=['Distinguir entregas mensais, semestrais, anuais e por evento.',
                    'Montar o nome de um arquivo e o assunto do e-mail de formalização no padrão.',
                    'Localizar um documento no Roteiro R6 pelo grupo de itens.'],
             body=(
                 '<p>Os documentos definem periodicidades mensal, semestral, anual, "1º mês do projeto", por atualização e por evento. Cada linha do Roteiro R6 traz a periodicidade do documento correspondente.</p>'
                 '<div class="tbl-scroll"><table><caption class="sr-only">Cadências documentadas</caption><thead><tr><th scope="col">Cadência</th><th scope="col">Exemplos de entrega</th><th scope="col">Situação nos manuais</th></tr></thead><tbody>'
                 '<tr><td>Mensal</td><td>Relatório de Execução Técnica e Financeira, aporte e extratos, RH direto e indireto, dispêndios dos incisos III a X, custos incorridos, indicadores, e-mail de formalização</td><td>Documentado</td></tr>'
                 '<tr><td>Semestral</td><td>Declaração de Inexistência de Impedimento</td><td>Documentado</td></tr>'
                 '<tr><td>Anual</td><td>Relatório Demonstrativo (técnico e financeiro) e Declaração de Guarda dos documentos contábeis</td><td>Documentado</td></tr>'
                 '<tr><td>Por evento</td><td>Kickoff, convênio e PUR, entrada de profissional, aquisições, mudança no PUR, encerramento</td><td>Documentado</td></tr>'
                 '<tr><td>Diária e semanal</td><td>Receber e nomear documentos, lançar despesas, conferir extrato parcial</td><td>Premissa de organização</td></tr>'
                 '<tr><td>Trimestral</td><td>Nenhuma entrega consta nos anexos</td><td>Lacuna</td></tr>'
                 '</tbody></table></div>'
                 + '<h3>Padrões de nome e de assunto</h3>'
                 '<p>O arquivo de cada documento fiscal reúne NF, boleto, comprovante e rateio em um único PDF. O nome segue o padrão das Orientações e deve ter poucos caracteres, para não corromper o arquivo. O e-mail de formalização tem assunto padronizado e copia as áreas técnica e financeira do CITS.</p>'
                 '<pre class="code" tabindex="0">2025_01_Fornecedor_R$xxx,xx_NFS-xxxx\nPURxxx/xxx – Executorxxx – Competênciaxxx</pre>'
                 + note('example', '<p>Exemplo ilustrativo de nome de arquivo: <code>2025_03_Fornecedor_R$1000,00_NFS-123</code>. Ano, mês, fornecedor, valor e número da NF, na ordem do padrão.</p>')
                 + note('alert', '<p>Nomes longos ou fora do padrão podem corromper o arquivo ou impedir que ele seja localizado na análise (Orientações, p. 2).</p>')
                 + note('norm', '<p>A Declaração de Inexistência de Impedimento é semestral e se liga à regularidade da executora (Res. CAPDA 30/2022, art. 6º). A Declaração de Guarda é anual e, segundo o Roteiro, também deve ser enviada no início do projeto. Confira o texto oficial antes de citar a norma.</p>')
             ),
             review=[('Quais entregas são mensais?',
                      '<p>Relatórios de execução técnica e financeira, documentos do aporte e extratos, documentos de RH direto e indireto, dispêndios dos incisos III a X, custos incorridos e indicadores gerenciais.</p>'),
                     ('Há alguma obrigação trimestral?',
                      '<p>Nenhuma consta nos anexos. É uma lacuna registrada no Guia.</p>'),
                     ('O que compõe um arquivo único?',
                      '<p>Nota fiscal, boleto, comprovante de pagamento, rateio e, quando houver, proposta e contrato, reunidos em um só PDF por documento fiscal.</p>')]),
        dict(id='e1-l3', title='Quem fornece o quê: dependências entre áreas', refs=['guia#dependencias', 'guia#processos', 'guia#organograma'],
             goals=['Identificar as áreas que alimentam a prestação de contas e o impacto do atraso de cada uma.',
                    'Ler a matriz RACI do Guia sabendo que ela é uma proposta.',
                    'Separar quem entrega o conteúdo técnico de quem consolida o pacote.'],
             body=(
                 '<p>O trabalho depende de pelo menos oito fontes internas (RH/DP, Financeiro, Compras, Jurídico, Contabilidade, Coordenação, Pesquisadores e Diretoria) e de duas partes externas (CITS e Beneficiária).</p>'
                 '<div class="tbl-scroll"><table><caption class="sr-only">Principais dependências</caption><thead><tr><th scope="col">Área</th><th scope="col">O que fornece</th><th scope="col">Se atrasar</th></tr></thead><tbody>'
                 '<tr><td>RH / DP</td><td>Holerites, folha, benefícios, encargos, ponto, eSocial, fichas financeiras</td><td>RHD e RHI sem comprovação; PC incompleta e aporte retido</td></tr>'
                 '<tr><td>Financeiro</td><td>NF, boletos, comprovantes, guias de impostos, extratos, comprovante do aporte</td><td>Arquivo único incompleto; conciliação não fecha</td></tr>'
                 '<tr><td>Compras</td><td>3 cotações ou justificativa, propostas, documentos de importação</td><td>Dispêndio questionado em adequação</td></tr>'
                 '<tr><td>Coordenador do projeto</td><td>Atividades, resultados, entregáveis, riscos, lições, mudanças, % técnico</td><td>Relatório técnico vazio ou inconsistente</td></tr>'
                 '<tr><td>CITS (externo)</td><td>Acesso ao drive, parecer, pendências, faturamento do aporte</td><td>Sem parecer não há aporte</td></tr>'
                 '</tbody></table></div>'
                 + note('premise', '<p>Os documentos dizem quais documentos são exigidos, mas não dizem qual área da executora os produz. A coluna "Quem fornece" atribui cada documento à área que normalmente o gera. A matriz RACI também é proposta: o analista responde pelo pacote, a Diretoria aprova atos formais e o Coordenador aprova o conteúdo técnico.</p>')
                 + note('valid', '<p>Valide internamente quem produz cada documento e quem assina declarações, ofícios e termos. Os anexos não definem essas alçadas.</p>')
                 + note('example', '<p>Exemplo ilustrativo de leitura da RACI. Na linha "Documentação de RH da competência", o analista é Aprovador (A), o RH/DP é Responsável (R) e os pesquisadores são Consultados (C). Quem produz a folha é o RH/DP, e o analista confere o pacote.</p>')
             ),
             review=[('Quem fornece o conteúdo técnico do Relatório Demonstrativo?',
                      '<p>O Coordenador do projeto e a equipe técnica. Sem esse insumo não há relatório e a pertinência não é demonstrada.</p>'),
                     ('A coluna "Quem fornece" é regra dos anexos?',
                      '<p>Não consta dos anexos. É premissa do Guia e precisa de validação interna.</p>'),
                     ('Qual é a maior fonte de pendências segundo o Guia?',
                      '<p>O volume de documentos de RH, com até 11 tipos de documento por colaborador CLT.</p>')]),
        dict(id='e1-l4', title='Riscos, mudanças e a regra dos 60 dias', refs=['guia#obrigacoes', 'guia#riscos', 'guia#melhorias'],
             goals=['Relacionar cada falha de prestação de contas à consequência descrita no Guia.',
                    'Explicar o que um ofício de mudança precisa responder.',
                    'Reconhecer a janela de 60 dias antes do fim do cronograma.'],
             body=(
                 '<p>Qualquer alteração do PUR, como item imprevisto, remanejamento entre rubricas ou prazo, exige ofício antes da execução, com no mínimo 60 dias antes do fim do cronograma. O comitê Técnico, Financeiro e Jurídico do CITS avalia enquadramento, elegibilidade, pertinência e adequação.</p>'
                 '<div class="tbl-scroll"><table><caption class="sr-only">Riscos do não cumprimento</caption><thead><tr><th scope="col">Falha</th><th scope="col">Consequência descrita ou decorrente</th><th scope="col">Gravidade no Guia</th></tr></thead><tbody>'
                 '<tr><td>PC da competência não entregue</td><td>Aporte seguinte não é liberado</td><td>Alta</td></tr>'
                 '<tr><td>Dispêndio não elegível ou sem pertinência</td><td>Gasto não aceito; deve ser segregado</td><td>Alta</td></tr>'
                 '<tr><td>Mudança executada sem adendo</td><td>Risco de perda de enquadramento</td><td>Alta</td></tr>'
                 '<tr><td>Pedido de adendo com menos de 60 dias</td><td>Comitê pode não concluir a análise no período</td><td>Alta</td></tr>'
                 '<tr><td>Aquisição sem 3 cotações</td><td>Dispêndio questionável em adequação</td><td>Média</td></tr>'
                 '</tbody></table></div>'
                 + note('concept', '<p>O <strong>ofício de mudança</strong> responde a três perguntas: o que está sendo alterado (PUR, valor, origem e destino, itens), por quê, e qual o impacto em escopo, qualidade, custo, equipe, riscos e prazo.</p>')
                 + note('norm', '<p>A janela de 60 dias e a exigência de ofício prévio vêm das Orientações (seção 4) e do Roteiro. Para o texto vigente, consulte o documento entregue pelo CITS na versão ligada ao convênio.</p>')
                 + note('premise', '<p>As 13 recomendações de melhoria do Guia, como painel de pendências e dia de corte interno, são propostas do material. Cada uma indica o requisito que a motiva.</p>')
             ),
             review=[('Qual é a antecedência mínima para um pedido de adendo de prazo?',
                      '<p>No mínimo 60 dias antes do fim do cronograma, e antes da execução da mudança.</p>'),
                     ('O que o ofício de mudança precisa informar?',
                      '<p>O que muda, por que muda e o impacto em escopo, qualidade, custo, equipe, riscos e prazo.</p>'),
                     ('Quem avalia a mudança no CITS?',
                      '<p>O comitê Técnico, Financeiro e Jurídico, que analisa enquadramento, elegibilidade, pertinência e adequação. A aprovação do investidor também faz parte do fluxo.</p>')]),
        dict(id='e1-l5', title='Lacunas e premissas: o que validar', refs=['guia#lacunas'],
             goals=['Listar as lacunas de informação do Guia.',
                    'Reconhecer as divergências entre os próprios documentos.',
                    'Saber a quem recorrer para fechar cada ponto em aberto.'],
             body=(
                 '<p>O Guia separa o que está documentado, o que é premissa e o que é lacuna. As lacunas incluem o prazo de entrega da PC, o prazo de análise do CITS, a estrutura interna da executora, quem assina atos formais, o papel de uma área de Controladoria, quem efetua o aporte e o critério de rateio aceito para Outros Correlatos e benefícios.</p>'
                 + '<h3>Divergências entre os documentos</h3>'
                 '<div class="tbl-scroll"><table><caption class="sr-only">Divergências entre documentos</caption><thead><tr><th scope="col">Tema</th><th scope="col">Orientação do Guia</th></tr></thead><tbody>'
                 '<tr><td>Numeração das rubricas (Roteiro, RD e Planilha usam numerações diferentes)</td><td>Usar a numeração do PUR do projeto nas pastas e confirmar com o CITS qual numeração vale nos relatórios</td></tr>'
                 '<tr><td>Percentual de custos incorridos (5% e 15% na Planilha; até 10% na aba de não elegíveis; máximo de 5% na Amazônia Ocidental, conforme PUR)</td><td>Seguir o percentual aprovado no PUR de cada projeto</td></tr>'
                 '<tr><td>Nome dos relatórios</td><td>Adotar o padrão das Orientações, que é mais recente e inclui revisão</td></tr>'
                 '<tr><td>Declaração de guarda</td><td>Enviar no início e renovar anualmente</td></tr>'
                 '</tbody></table></div>'
                 + note('valid', '<p>Antes de adotar qualquer orientação desta tabela como regra interna, valide com a coordenação e com o instrumento de cada projeto.</p>')
             ),
             review=[('Qual percentual de custos incorridos vale para o meu projeto?',
                      '<p>O que está aprovado no PUR do projeto. Os modelos trazem valores-padrão (5% executora e 15% coordenadora), mas o PUR prevalece.</p>'),
                     ('Qual padrão de nome de relatório o Guia recomenda?',
                      '<p>O das Orientações: Ano_Mês_PPI4.0_Relat_Tec_PUR-xx-xx_Executor_Rev-xx, por ser mais recente e incluir a revisão.</p>')]),
    ],
    quiz=[
        dict(q='Segundo o Guia, o que condiciona a liberação de cada aporte do CITS?',
             opts=['A assinatura do kickoff', 'A entrega da PC da competência e a análise de saldo de caixa', 'A aprovação da diretoria da executora', 'O envio do Relatório Demonstrativo anual'],
             ans=1, why='O aporte fica condicionado à entrega da PC da competência, e o CITS ainda avalia o saldo de caixa antes de faturar o próximo aporte (Orientações, seção 2).'),
        dict(q='Qual afirmação sobre as rotinas diária e semanal do analista está correta?',
             opts=['São obrigações documentadas nos anexos', 'São premissas de organização para cumprir o ciclo mensal', 'São prazos fixados pelo CITS', 'São lacunas, pois não há rotina possível'],
             ans=1, why='Os documentos só definem periodicidades mensal, semestral, anual, 1º mês, por atualização e por evento. As rotinas diária e semanal são premissas do Guia.'),
        dict(q='Com quanta antecedência mínima o ofício de mudança ou adendo de prazo deve chegar ao CITS?',
             opts=['15 dias antes do fim do cronograma', '30 dias antes do fim do cronograma', '60 dias antes do fim do cronograma', 'Não há antecedência mínima'],
             ans=2, why='As Orientações pedem pedido de adendo com no mínimo 60 dias de antecedência do fim do cronograma e antes da execução.'),
        dict(q='O que compõe o arquivo único de um documento fiscal?',
             opts=['Somente a nota fiscal', 'NF, boleto, comprovante, rateio e, quando houver, proposta e contrato', 'A planilha financeira do mês', 'O e-mail de formalização'],
             ans=1, why='O padrão pede um arquivo por documento fiscal, com todos os comprovantes juntos.'),
        dict(q='Há obrigações trimestrais nos documentos anexados?',
             opts=['Sim, a conciliação trimestral', 'Sim, a declaração de impedimento', 'Não, nenhuma entrega ou controle trimestral consta', 'Sim, o RD trimestral'],
             ans=2, why='O Guia registra como lacuna: nenhuma entrega ou controle trimestral consta nos documentos anexados.'),
        dict(q='A numeração das rubricas é a mesma em todos os modelos?',
             opts=['Sim, é idêntica', 'Não. Roteiro, RD e Planilha usam numerações diferentes', 'Só a Planilha muda', 'Só o Termo de Encerramento muda'],
             ans=1, why='O Guia aponta a divergência e orienta usar a numeração do PUR do projeto, confirmando com o CITS qual vale nos relatórios.'),
    ],
    classify=dict(
        title='Classifique: documentado, premissa ou lacuna',
        sub='Para cada afirmação, escolha como o Guia a trata.',
        cats=['Documentado', 'Premissa', 'Lacuna'],
        items=[('Cada aporte fica condicionado à entrega da PC da competência.', 0, 'Está nas Orientações, seção 2.'),
               ('Rotinas diárias e semanais de organização do analista.', 1, 'O Guia as marca como premissa para cumprir o ciclo mensal.'),
               ('Dia do mês limite para entregar a PC ao CITS.', 2, 'Os anexos não informam esse prazo.'),
               ('A Declaração de Inexistência de Impedimento é semestral.', 0, 'Consta no Roteiro R6 (itens 21.1 e 22.1).'),
               ('A coluna "Quem fornece" atribui documentos às áreas internas.', 1, 'Os documentos não dizem qual área produz cada item. A atribuição é premissa.'),
               ('Prazo de análise do CITS e de liberação do aporte após o parecer.', 2, 'Aparece nas lacunas de informação do Guia.')]),
    cases=[
        dict(title='Caso 1 (fictício): compra feita sem cotações',
             scenario='O time técnico comprou um equipamento e pediu ao analista que lance o gasto na competência. Não há três cotações de fornecedores distintos nem justificativa registrada.',
             qa=[('Que risco o Guia associa a essa situação?',
                  '<p>Aquisição sem 3 cotações deixa o dispêndio questionável em adequação (risco de gravidade média). O Roteiro pede 3 cotações de fornecedores distintos ou justificativa, sempre que houver aquisição (item 21.5).</p>'),
                 ('O que o Guia propõe para evitar a repetição?',
                  '<p>Exigir as 3 cotações como condição para emitir o pedido de compra (recomendação 05) e fazer pré-triagem de elegibilidade antes do pagamento (recomendação 04).</p>'),
                 ('O que depende de validação?',
                  '<p>Se uma justificativa apresentada depois da compra é aceita pelo CITS. Os anexos não tratam desse caso. Consulte a coordenação antes de lançar.</p>')]),
        dict(title='Caso 2 (fictício): pedido de prorrogação perto do fim',
             scenario='Faltam 45 dias para o fim do cronograma e o coordenador pede mais prazo para concluir uma atividade.',
             qa=[('O que a regra documentada prevê?',
                  '<p>Pedido de adendo de prazo com no mínimo 60 dias de antecedência do fim do cronograma, formalizado por ofício antes da execução.</p>'),
                 ('Qual risco o Guia descreve para pedidos com menos de 60 dias?',
                  '<p>O comitê Técnico, Financeiro e Jurídico pode não concluir a análise no período, e a assinatura deve ocorrer no período corrente.</p>'),
                 ('O que fazer agora?',
                  '<p>Os anexos não dizem como tratar pedidos fora da janela. Registre o caso e consulte a coordenação e o CITS sobre o procedimento aplicável.</p>')]),
    ],
))

# =====================================================================  ETAPA 2
STAGES.append(dict(
    id='etapa-2-ferramentas', n=2, short='Ferramentas',
    title='Ferramentas e preenchimento de documentos',
    manual='ferramentas',
    level='Intermediário a avançado',
    summary='Aprenda a preencher e conectar a Planilha Financeira, os Indicadores Gerenciais e o Relatório Técnico, e a conferir se os números batem.',
    outcome='Ao concluir, você consegue seguir a ordem de preenchimento do mês, conferir a coerência entre as três ferramentas e explicar um desvio com base em documentos.',
    lessons=[
        dict(id='e2-l1', title='Três ferramentas, uma cadeia de números', refs=['ferramentas#resumo', 'ferramentas#integracao', 'ferramentas#ordem'],
             goals=['Dizer o que cada ferramenta registra (PF, IG, RD).',
                    'Identificar quais ligações são fórmula e quais são digitação manual.',
                    'Seguir a ordem de preenchimento mensal.'],
             body=(
                 '<p>A Planilha Financeira Mensal (PF) registra cada despesa por rubrica e concilia com o extrato. Os Indicadores Gerenciais (IG) comparam o previsto com o realizado em R$, profissionais e horas. O Relatório Técnico (RD) narra o projeto e fecha com quadros que precisam bater com a planilha.</p>'
                 + note('concept', '<p>A ordem importa. A PF é fechada primeiro, porque ela gera os valores que o IG e o RD repetem. O RD depende também do Coordenador do projeto para o conteúdo das atividades.</p>')
                 + '<div class="tbl-scroll"><table><caption class="sr-only">Ligações entre as ferramentas</caption><thead><tr><th scope="col">Ligação</th><th scope="col">Tipo</th></tr></thead><tbody>'
                 '<tr><td>Abas de rubrica para Posição Financeira</td><td>Fórmula (SUMIF pela chave mês-ano)</td></tr>'
                 '<tr><td>Abertura de Pagamentos para Posição Financeira</td><td>Fórmula (coluna AZ)</td></tr>'
                 '<tr><td>Valores previstos Iniciais para Posição Financeira</td><td>Fórmula (linha PUR)</td></tr>'
                 '<tr><td>PF para Indicadores</td><td>Manual, sem vínculo</td></tr>'
                 '<tr><td>PF e IG para RD</td><td>Manual, sem vínculo</td></tr>'
                 '</tbody></table></div>'
                 + note('alert', '<p>Se um valor muda na planilha depois que o relatório foi montado, os quadros XIII a XVI ficam desatualizados. Repita a conferência depois de qualquer ajuste.</p>')
                 + note('example', '<p>Exemplo ilustrativo da ordem do mês: lançar despesas e folha, registrar guias, conciliar o extrato, atualizar a Posição Financeira, fechar o Consolidado, digitar o realizado no IG, acrescentar o mês ao tópico XII do RD, atualizar quadros e conferir a coerência entre as três.</p>')
             ),
             review=[('Por que a PF é fechada primeiro?',
                      '<p>Porque é a fonte de todos os valores em R$. IG e RD repetem esses valores.</p>'),
                     ('O IG tem vínculo automático com a PF?',
                      '<p>Não. Os valores mensais são digitados nas células amarelas do IG, então vale conferir a transcrição.</p>')]),
        dict(id='e2-l2', title='Planilha Financeira: lançar, ratear e conciliar', refs=['ferramentas#pf', 'ferramentas#rubricas'],
             goals=['Lançar uma despesa na aba certa, com a data da competência e o rateio correto.',
                    'Explicar como a folha de pagamento chega ao valor do mês.',
                    'Conferir as duas contas que precisam dar zero.'],
             body=(
                 '<p>A PF tem 22 abas, das quais 10 recebem lançamentos de despesa. Em todas elas, a coluna A é calculada como mês-ano a partir da data digitada na coluna B. A Posição Financeira busca os valores por essa chave.</p>'
                 + note('alert', '<p>Uma data errada na coluna B joga o valor para outro mês sem aviso. O campo Rateio vem preenchido com 1 (100%) e precisa ser ajustado quando a despesa é compartilhada.</p>')
                 + note('example', '<p>Exemplo ilustrativo, com números fictícios. Uma NF de material de consumo de R$ 1.000,00, compartilhada com outro projeto, com rateio de 40%. O Valor Total da aba VI é valor da nota × rateio = R$ 400,00. Esse é o valor que vai para a Posição Financeira.</p>')
                 + '<h3>Folha de pagamento</h3>'
                 '<p>Na linha de exemplo do modelo, cada verba é multiplicada pelas horas no projeto (coluna K) e dividida pela base mensal de 176 horas (célula K6). É assim que a planilha proporcionaliza o custo de quem não atua 100% no projeto. A coluna AZ, Valor Total Folha, é a que a Posição Financeira soma.</p>'
                 + note('example', '<p>Exemplo ilustrativo. Uma verba de R$ 8.800,00 com 88 horas no projeto resulta em R$ 8.800,00 × 88 ÷ 176 = R$ 4.400,00 apropriados ao projeto no mês.</p>')
                 + '<h3>As duas contas que precisam dar zero</h3>'
                 '<p>Na verificação por rubrica, o realizado na Posição menos o pago no extrato (Conc. Bancária) deve resultar em zero (K16). Na conferência de saldo, o saldo do projeto (aportes e rendimentos líquidos menos despesas) menos o saldo disponível em conta e aplicação (ajustado por restituições não creditadas e cheques não descontados) deve resultar em zero (D32).</p>'
                 + note('concept', '<p>A Posição Financeira mostra, para cada rubrica, três linhas: <strong>PUR</strong> (previsto, vem de Valores previstos Iniciais), <strong>Tendência</strong> (replanejamento dos meses seguintes) e <strong>Real.</strong> (soma automática das abas de lançamento).</p>')
                 + note('valid', '<p>As células e colunas citadas (como C6, K16, D32, AZ) são as do modelo analisado pelo manual. Confira se a versão da planilha do seu projeto tem o mesmo layout.</p>')
             ),
             review=[('Como a Posição Financeira sabe a que mês pertence uma despesa?',
                      '<p>Pela chave mês-ano da coluna A, calculada a partir da data da coluna B de cada aba de lançamento.</p>'),
                     ('O que significa o rateio vir preenchido com 100%?',
                      '<p>Que a despesa é integralmente apropriada ao projeto. Se for compartilhada, o rateio precisa ser ajustado antes do lançamento.</p>'),
                     ('Quais são as duas verificações que devem dar zero?',
                      '<p>A Verificação do Consolidado (K16) e a Diferença entre saldo do projeto e saldo disponível (D32).</p>')]),
        dict(id='e2-l3', title='Indicadores Gerenciais: ler números e explicar desvios', refs=['ferramentas#ig'],
             goals=['Dizer o que cada índice mede e o que ele não diz sozinho.',
                    'Calcular índices derivados, como o custo da hora.',
                    'Redigir uma resposta fundamentada para o tópico XVI do RD.'],
             body=(
                 '<p>Os indicadores comparam o que o PUR previu com o que o projeto fez, em dinheiro, em pessoas e em horas. Preencher os quadros é a parte mecânica. O valor do trabalho do analista está em ler os números, perguntar por que estão assim e sustentar a resposta com dados e documentos.</p>'
                 + note('concept', '<p>Nenhum índice, isolado, diz se o projeto vai bem. A análise começa quando dois ou mais são lidos juntos e confrontados com o cronograma e com os documentos. Estar em 100% de execução financeira não prova que o projeto vai bem.</p>')
                 + '<h3>Do número à decisão</h3>'
                 '<ol><li>Observar: qual indicador saiu do plano, quanto no mês e no acumulado, há quantos meses.</li><li>Localizar: em qual rubrica, mês, pessoa ou fornecedor o desvio se concentra.</li><li>Explicar: qual a causa e qual documento a comprova. Uma explicação sem evidência continua sendo hipótese.</li><li>Projetar: onde a rubrica termina se nada mudar.</li><li>Agir e registrar: o que será feito, como, por quem e até quando.</li></ol>'
                 + note('example', '<p>Exemplo ilustrativo do manual, com números fictícios. Resposta vaga: "Pequeno desvio em RH". Resposta fundamentada: "Sim, em RH Direto: 108% do R$ acumulado contra 94% das horas acumuladas no mês 7. O custo da hora realizado está 15% acima do planejado por causa do reajuste aplicado a dois pesquisadores a partir do mês 5, conforme folha de pagamento." A segunda cita o indicador, o tamanho do desvio, a causa comprovada e a consequência.</p>')
                 + note('gap', '<p>Os modelos não definem faixa de tolerância para o IG. A única régua numérica está na Posição Financeira: o técnico é considerado em dia enquanto não ficar mais de 25% abaixo do financeiro.</p>')
                 + note('valid', '<p>O manual sugere combinar com a coordenação faixas de atenção por rubrica, revisadas a cada adendo. Essa sugestão ainda não é regra.</p>')
                 + '<div class="ex" data-calc="ind"><h3>Calculadora de índices (exercício)</h3><p class="sub">Digite valores fictícios ou os do seu projeto para praticar a leitura. Os cálculos seguem as fórmulas descritas no manual. A calculadora não guarda os números.</p>'
                 '<div class="calc"><label>R$ PUR acumulado<input type="number" inputmode="decimal" step="any" min="0" data-f="pur"></label>'
                 '<label>R$ realizado acumulado<input type="number" inputmode="decimal" step="any" min="0" data-f="real"></label>'
                 '<label>Horas PUR acumuladas<input type="number" inputmode="decimal" step="any" min="0" data-f="hpur"></label>'
                 '<label>Horas realizadas acumuladas<input type="number" inputmode="decimal" step="any" min="0" data-f="hreal"></label></div>'
                 '<div class="calc-out" aria-live="polite"><div><small>% R$ acumulado</small><b data-o="pr">–</b></div><div><small>% horas acumuladas</small><b data-o="ph">–</b></div><div><small>Distância R$ × horas</small><b data-o="dist">–</b></div><div><small>Custo da hora realizado</small><b data-o="ch">–</b></div><div><small>Custo da hora PUR</small><b data-o="chp">–</b></div></div>'
                 '<p class="fb" data-o="read" hidden></p></div>'
             ),
             review=[('O que o % de R$ acumulado não diz sozinho?',
                      '<p>Se o dinheiro gasto virou entrega. Um projeto pode estar em 100% financeiro e atrasado tecnicamente.</p>'),
                     ('Como o custo da hora ajuda a explicar um desvio?',
                      '<p>Separa efeito preço de efeito volume. Se o custo da hora subiu, o desvio vem do preço: salário, encargos, provisões ou perfil da equipe.</p>'),
                     ('Qual é a única régua numérica de tolerância nos modelos?',
                      '<p>O status técnico da Posição Financeira: o técnico é considerado em dia enquanto não ficar mais de 25% abaixo do financeiro.</p>')]),
        dict(id='e2-l4', title='Relatório Técnico: quem preenche o quê', refs=['ferramentas#rd', 'ferramentas#rastreio'],
             goals=['Separar as seções preenchidas pelo time técnico, pelo analista e pelo CITS.',
                    'Explicar o caráter cumulativo do tópico XII.',
                    'Usar a matriz de rastreabilidade para conferir os quadros XIII a XVI.'],
             body=(
                 '<p>O RD tem 21 seções, de Dados Gerais à Conclusão da Coordenadora. É cumulativo: a cada mês um bloco novo é acrescentado ao tópico XII e os anteriores são mantidos, inclusive o reporte do mês anterior.</p>'
                 + note('concept', '<p>Os quadros XIII (resumo), XIV (comparativo) e XV (RH) consolidam o tópico XII e precisam bater com a Planilha Financeira. O XVI repete os quadros do IG e traz as três respostas sobre desvios.</p>')
                 + '<div class="tbl-scroll"><table><caption class="sr-only">Quem preenche cada parte do RD</caption><thead><tr><th scope="col">Parte</th><th scope="col">Quem preenche</th></tr></thead><tbody>'
                 '<tr><td>I Dados Gerais (período do reporte e valor realizado)</td><td>Analista</td></tr>'
                 '<tr><td>II a IX (descrição, objetivos, desafio, escopo, resultados)</td><td>Time técnico</td></tr>'
                 '<tr><td>XII Atividades: descrição e resultados</td><td>Time técnico</td></tr>'
                 '<tr><td>XII Atividades: horas e dispêndios por atividade</td><td>Analista</td></tr>'
                 '<tr><td>XIII a XVI Quadros e indicadores</td><td>Analista</td></tr>'
                 '<tr><td>XVII a XIX Riscos, lições, mudanças</td><td>Time técnico (XIX com apoio do analista)</td></tr>'
                 '<tr><td>XX Tabela de revisões</td><td>Analista</td></tr>'
                 '<tr><td>XXI Conclusão da Coordenadora</td><td>CITS</td></tr>'
                 '</tbody></table></div>'
                 + note('alert', '<p>Duplique o arquivo da competência anterior e só acrescente. Apagar o quadro do mês anterior faz o relatório perder o histórico. As orientações em itálico do modelo e os textos "(Apagar)" devem ser removidos antes do envio.</p>')
                 + note('premise', '<p>R$/h no quadro XV é calculado como Valor Total Folha ÷ horas no projeto. É premissa de cálculo do manual.</p>')
                 + note('gap', '<p>Não há campo de atividade nas abas de despesa não-RH da planilha, o que impede montar o tópico XII direto dela.</p>')
             ),
             review=[('Quem preenche as horas de cada profissional no tópico XII?',
                      '<p>O analista, com as horas da Abertura de Pagamentos (coluna K).</p>'),
                     ('O que deve coincidir com a Posição Financeira?',
                      '<p>O quadro XIII (total do RD por rubrica) com a coluna E (Total Realizado) da Posição Financeira.</p>')]),
        dict(id='e2-l5', title='Alertas, erros comuns e fechamento do mês', refs=['ferramentas#alertas', 'ferramentas#erros', 'ferramentas#checklist'],
             goals=['Reconhecer os alertas do modelo que podem gerar erro silencioso.',
                    'Relacionar sintoma, causa e prevenção nos erros comuns.',
                    'Usar o checklist de fechamento antes de enviar a competência.'],
             body=(
                 '<p>A leitura das fórmulas e validações do modelo encontrou pontos que podem gerar erro silencioso. Os mais sensíveis, segundo o manual, são estes.</p>'
                 '<ul><li>Linha 6 da Posição Financeira: as fórmulas esperam "Realizado" e "Projetado". Com "planejado", o Total Previsto fica zerado.</li>'
                 '<li>Abas I e II: a coluna de valor que a Posição soma não tem fórmula. Se ficar vazia, o gasto não aparece.</li>'
                 '<li>Conc. Bancária: o Consolidado soma as linhas 3 a 53, e linhas acrescentadas abaixo da área de pendências ficam fora da soma.</li>'
                 '<li>297 fórmulas com #REF! no modelo, que devem ser recriadas antes do primeiro uso.</li></ul>'
                 + note('valid', '<p>As correções sugeridas na seção 08 do manual são sugestões. Elas não alteram os modelos oficiais sem anuência do CITS.</p>')
                 + note('example', '<p>Exemplo de leitura do quadro de erros comuns: sintoma "Verificação do Consolidado diferente de zero". Causa provável: pagamento lançado na aba e não na Conc. Bancária, rubrica errada ou linha fora do intervalo. Prevenção: conciliar pagamento a pagamento e usar a lista de rubricas.</p>')
                 + '<p>Para fechar a competência, use o <a href="../checklists.html#fechamento">checklist de fechamento mensal</a>. Ele é o mesmo da seção 10 do Manual das ferramentas e compartilha as marcações com ele neste navegador.</p>'
             ),
             review=[('O que acontece se os meses futuros ficarem com "planejado" na linha 6?',
                      '<p>O Total Previsto (coluna D) fica zerado, porque as fórmulas procuram "Projetado".</p>'),
                     ('Por que a rubrica na Conc. Bancária deve ser escolhida da lista?',
                      '<p>Porque a soma por rubrica compara texto. Qualquer diferença de grafia deixa a linha fora do Consolidado.</p>')]),
    ],
    quiz=[
        dict(q='Qual ferramenta deve ser fechada primeiro no mês?',
             opts=['Relatório Técnico', 'Indicadores Gerenciais', 'Planilha Financeira', 'Tanto faz'],
             ans=2, why='A Planilha Financeira gera os valores que o IG e o RD repetem. Alterar a PF depois de montar o relatório deixa os quadros XIII a XVI desatualizados.'),
        dict(q='O IG tem ligação por fórmula com a Planilha Financeira?',
             opts=['Sim, é automática', 'Não, os valores são digitados nas células amarelas', 'Sim, mas só nos acumulados', 'Depende da versão do Excel'],
             ans=1, why='O modelo não tem vínculo entre PF e IG. Por isso é preciso conferir se os números foram transcritos corretamente.'),
        dict(q='Uma NF de R$ 2.000,00 tem rateio de 25% para o projeto. Qual valor total vai para a Posição Financeira (exemplo ilustrativo)?',
             opts=['R$ 2.000,00', 'R$ 1.500,00', 'R$ 500,00', 'R$ 250,00'],
             ans=2, why='Valor Total = valor da nota × rateio = 2.000 × 0,25 = R$ 500,00.'),
        dict(q='O que significa a Verificação do Consolidado (K16) diferente de zero?',
             opts=['O saldo do projeto está correto', 'O realizado na Posição difere do pago no extrato por rubrica', 'O mês está marcado como Projetado', 'A planilha está protegida'],
             ans=1, why='K = G (realizado) menos I (extrato por rubrica). Precisa ser zero. Causas comuns: pagamento fora da Conc. Bancária, rubrica errada ou linha fora do intervalo.'),
        dict(q='Quem preenche a seção XXI do RD (Conclusão da Coordenadora)?',
             opts=['O analista', 'O coordenador do projeto', 'O CITS', 'A Beneficiária'],
             ans=2, why='A Conclusão da Coordenadora é preenchida pelo CITS.'),
        dict(q='No exemplo do manual, por que a resposta fundamentada é melhor do que "Pequeno desvio em RH"?',
             opts=['Porque é mais longa', 'Porque cita o indicador, o tamanho do desvio, a causa comprovada e a consequência', 'Porque usa termos técnicos', 'Porque evita números'],
             ans=1, why='A resposta fundamentada permite ao CITS avaliar o projeto sem precisar pedir esclarecimentos.'),
    ],
    classify=dict(
        title='Classifique: de onde vem cada número',
        sub='Para cada ligação, escolha se ela acontece por fórmula ou por digitação manual do analista.',
        cats=['Fórmula no modelo', 'Digitação manual'],
        items=[('Abas de rubrica para a linha Real. da Posição Financeira', 0, 'SUMIF pela chave mês-ano da coluna A.'),
               ('Planilha Financeira para Indicadores Gerenciais', 1, 'Sem vínculo. Os valores são digitados nas células amarelas do IG.'),
               ('Valores previstos Iniciais para a linha PUR da Posição Financeira', 0, 'A linha PUR puxa M1 a M12 de Valores previstos Iniciais.'),
               ('Planilha Financeira e IG para os quadros XIII a XVI do RD', 1, 'Sem vínculo. O analista transcreve os totais e os quadros.'),
               ('Abertura de Pagamentos (coluna AZ) para RH na Posição Financeira', 0, 'RH Direto e Indireto somam a coluna AZ das abas III.I e IV.I.'),
               ('Acumulados e percentuais dentro do IG', 0, 'Calculam sozinhos a partir do planejado e do realizado digitados.')]),
    classify2=dict(
        title='Classifique: quem preenche no Relatório Técnico',
        sub='Para cada parte do RD, escolha quem preenche, segundo o manual.',
        cats=['Time técnico', 'Analista', 'CITS'],
        items=[('I · Período do reporte e valor realizado', 1, 'Dados do mês, com o total da Planilha Financeira.'),
               ('V · Intensidade do desafio tecnológico', 0, 'Conteúdo técnico, definido pelo coordenador e pesquisadores.'),
               ('XIII · Quadro resumo dos dispêndios', 1, 'Vem da Planilha Financeira, coluna E da Posição Financeira.'),
               ('XVII · Riscos', 0, 'Time técnico: ocorrência, impacto, ação, responsável e data.'),
               ('XX · Tabela de revisões', 1, 'Uma linha por submissão, com o mesmo número Rev-xx do arquivo.'),
               ('XXI · Conclusão da Coordenadora', 2, 'Preenchida pelo CITS.')]),
    cases=[
        dict(title='Caso (fictício): o custo de RH sobe mais rápido que as horas',
             scenario='No mês 7, o RH Direto está com 108% de R$ acumulado e 94% de horas acumuladas. Os valores são ilustrativos e vêm do exemplo do manual.',
             qa=[('Que sinal esses números dão?',
                  '<p>O % de R$ do RH sobe mais rápido que o % de horas. A distância R$ × horas fica positiva: o projeto paga mais por hora do que previu.</p>'),
                 ('Quais hipóteses o manual manda testar?',
                  '<p>Reajuste salarial, encargos ou provisões acima do previsto, profissional mais sênior que o planejado e horas lançadas abaixo das trabalhadas.</p>'),
                 ('Onde confirmar e onde registrar?',
                  '<p>Confirmar na Abertura de Pagamentos (AZ ÷ K por pessoa), na folha e no ponto. Registrar no tópico XVI e, se houver risco de estouro, no XVII.</p>'),
                 ('O que ainda é hipótese?',
                  '<p>Qualquer causa que não tenha documento que a comprove. O manual lembra que dois índices que se movem juntos não provam causa.</p>')]),
    ],
))

# =====================================================================  ETAPA 3
STAGES.append(dict(
    id='etapa-3-normas', n=3, short='Normas',
    title='Base normativa e legislação',
    manual='normativa',
    level='Referência para consulta',
    summary='Conheça as camadas de normas que regem projetos PPI 4.0 e convênios diretos e aprenda a ligar cada dispositivo ao procedimento da rotina.',
    outcome='Ao concluir, você consegue localizar a norma de cada assunto, explicar por que alguns prazos e percentuais diferem e saber quando conferir o texto oficial.',
    lessons=[
        dict(id='e3-l1', title='Três camadas e duas modalidades', refs=['normativa#resumo', 'normativa#modalidades', 'normativa#mapa'],
             goals=['Descrever as três camadas: legislação, regras da modalidade e documentos de execução.',
                    'Diferenciar convênio direto e PPI 4.0.',
                    'Ler o mapa da base normativa de cima para baixo.'],
             body=(
                 '<p>A base normativa de uma executora tem três camadas que precisam ser lidas juntas. A primeira é a legislação de PD&amp;I (Lei de Informática, decreto regulamentador e Lei de Inovação). A segunda são as regras da modalidade. A terceira são os documentos de execução e prestação de contas, como convênio, PUR, aditivos, relatórios e documentação comprobatória.</p>'
                 + '<div class="tbl-scroll"><table><caption class="sr-only">Convênio direto e PPI 4.0</caption><thead><tr><th scope="col">Aspecto</th><th scope="col">Convênio direto</th><th scope="col">PPI 4.0</th></tr></thead><tbody>'
                 '<tr><td>Partes</td><td>Empresa incentivada e ICT credenciada</td><td>Empresa investidora, coordenadora (CITS) e executora</td></tr>'
                 '<tr><td>Norma operacional</td><td>Portaria Conjunta 9.835/2022</td><td>Res. CAPDA 2/2020, 30/2022 e 9/2019</td></tr>'
                 '<tr><td>Prestação de contas</td><td>RD da empresa, auditoria, análise e contestação</td><td>Relatórios semestrais ou em prazo menor pedido pela coordenadora; no CITS, mensal por competência</td></tr>'
                 '</tbody></table></div>'
                 + note('concept', '<p>Leia de cima para baixo: a lei cria a obrigação, o decreto regulamenta, as normas da modalidade operacionalizam e os manuais orientam a análise.</p>')
                 + note('norm', '<p>Os links desta base apontam para Planalto, Diário Oficial da União e Suframa. O conteúdo de cada artigo vem do material de referência e deve ser conferido no texto oficial antes de ser usado em ofício ou resposta a diligência.</p>')
                 + note('valid', '<p>A relação de normas de um projeto depende da natureza jurídica da executora, do ano-base, do instrumento assinado e da versão do manual adotado. A lista serve como ponto de partida.</p>')
             ),
             review=[('Quais são as três camadas normativas?',
                      '<p>Legislação de PD&amp;I, regras da modalidade e documentos de execução e prestação de contas.</p>'),
                     ('Quais partes participam do PPI 4.0?',
                      '<p>Empresa investidora, coordenadora (CITS) e executora.</p>')]),
        dict(id='e3-l2', title='Normas e dispositivos: o que cada uma regula', refs=['normativa#normas'],
             goals=['Associar cada norma principal ao assunto que ela regula.',
                    'Reconhecer a Resolução CAPDA 2/2020 como a que mais pesa na rotina da executora do PPI 4.0.',
                    'Saber onde conferir o texto oficial.'],
             body=(
                 '<p>A seção de normas lista cada ato com os dispositivos mais relevantes e um botão para o texto oficial. Alguns exemplos de leitura rápida:</p>'
                 '<ul><li><strong>Lei nº 8.387/1991</strong>: origem dos recursos e das obrigações, com obrigação anual de investimento em PD&amp;I (regra geral de 5% sobre a base legal, § 3º).</li>'
                 '<li><strong>Decreto nº 10.521/2020</strong>: referência para dizer se uma despesa pode entrar no projeto (atividades de PD&amp;I no art. 21 e categorias de dispêndio no art. 22).</li>'
                 '<li><strong>Resolução CAPDA nº 9/2019</strong>: cria o PPI 4.0 e define seu escopo.</li>'
                 '<li><strong>Resolução CAPDA nº 2/2020</strong>: a que mais pesa na rotina da executora. Define PUR, obrigações, conta específica, guarda documental, rendimentos, aportes, prestação de contas e destino dos saldos.</li>'
                 '<li><strong>Portaria Conjunta nº 9.835/2022</strong>: referência operacional do convênio direto.</li></ul>'
                 + note('norm', '<p>Credenciamento no CAPDA e habilitação perante a coordenadora do PPI são verificações distintas. A executora precisa manter as duas em dia (Res. CAPDA 5/2010).</p>')
                 + note('alert', '<p>A aba "Gastos não elegíveis" da Planilha Financeira ainda cita o Decreto 6.008/2006. Confira no Planalto se ele segue vigente antes de usá-lo como fundamento.</p>')
                 + note('valid', '<p>Os números de artigos desta lição vêm da base normativa do portal. Abra o texto oficial pelo botão de cada norma antes de citá-los em documento.</p>')
             ),
             review=[('Qual norma mais pesa na rotina da executora do PPI 4.0?',
                      '<p>A Resolução CAPDA nº 2/2020, lida com as alterações da Resolução CAPDA nº 30/2022.</p>'),
                     ('Credenciamento no CAPDA e habilitação no PPI são a mesma coisa?',
                      '<p>Não. São verificações distintas, e a executora precisa manter as duas em dia.</p>')]),
        dict(id='e3-l3', title='Da norma à rotina', refs=['normativa#rotina', 'normativa#dossie'],
             goals=['Ligar um dispositivo ao procedimento ou à ferramenta onde ele aparece.',
                    'Usar a tabela "Da norma à rotina" para fundamentar uma resposta.',
                    'Organizar o dossiê de enquadramento de um projeto.'],
             body=(
                 '<p>A tabela "Da norma à rotina" liga cada dispositivo ao ponto da rotina em que ele aparece. Serve para justificar um procedimento ou responder a uma diligência com o fundamento certo.</p>'
                 '<div class="tbl-scroll"><table><caption class="sr-only">Exemplos de norma e rotina</caption><thead><tr><th scope="col">Dispositivo</th><th scope="col">O que exige</th><th scope="col">Onde aparece na rotina</th></tr></thead><tbody>'
                 '<tr><td>Res. 2/2020, art. 15, VII a IX</td><td>Conta específica, contabilidade e guarda por dez anos</td><td>Conciliação Bancária; Declaração de Guarda</td></tr>'
                 '<tr><td>Res. 2/2020, art. 17</td><td>Aportes e destinação</td><td>Posição Financeira, linhas 65 a 68; item 9 do Roteiro</td></tr>'
                 '<tr><td>Res. 2/2020, art. 45</td><td>Destinação de saldos</td><td>Termo de Encerramento: saldo final de devolução</td></tr>'
                 '<tr><td>Dec. 10.521, art. 22</td><td>Categorias de dispêndio</td><td>Rubricas I a X da Planilha Financeira</td></tr>'
                 '</tbody></table></div>'
                 + note('example', '<p>Exemplo de uso. Ao explicar por que o extrato precisa ser conciliado com a conta do projeto, o fundamento é o art. 15, VII a IX da Res. CAPDA 2/2020 (conta específica e contabilidade). O procedimento da rotina é a aba Conc. Bancária.</p>')
                 + note('premise', '<p>A relação entre dispositivos e rotina é proposta do portal e dos manuais. Ela não é uma lista legal única.</p>')
                 + '<p>O dossiê por projeto reúne em uma pasta: enquadramento (modalidade, ano-base, credenciamento, normas aplicáveis e aprovações), instrumentos, execução técnica, execução financeira e encerramento. Use o <a href="../checklists.html#dossie">checklist do dossiê</a>.</p>'
             ),
             review=[('Onde aparece na rotina a exigência de conta específica?',
                      '<p>Na Conciliação Bancária da conta do projeto e na Declaração de Guarda (Res. CAPDA 2/2020, art. 15, VII a IX).</p>'),
                     ('O que reúne o dossiê por projeto?',
                      '<p>Enquadramento, instrumentos, execução técnica, execução financeira e encerramento.</p>')]),
        dict(id='e3-l4', title='Cuidados de leitura, atualizações e pontos a verificar', refs=['normativa#cuidados', 'normativa#manuais', 'normativa#atualizacoes', 'normativa#lacunas'],
             goals=['Evitar os três erros de interpretação mais comuns.',
                    'Saber quais manuais existem e qual deles falta com versão pública.',
                    'Acompanhar atos recentes sem aplicá-los automaticamente.'],
             body=(
                 '<h3>Três cuidados</h3>'
                 '<ul><li>Os percentuais de 20% têm finalidades diferentes. Há limites para despesas administrativas e reserva, outros correlatos, intercâmbio e infraestrutura, cada um com base e condição próprias. Não se somam como margem livre do orçamento.</li>'
                 '<li>O prazo de guarda muda conforme a regra: cinco anos na regra geral do Decreto 10.521, dez anos para a executora em programa prioritário (Res. 2/2020, art. 15). Registre o marco de início da contagem de cada projeto.</li>'
                 '<li>O prazo da empresa ou da coordenadora perante a Suframa não é necessariamente o da executora. O convênio e o manual operacional definem quando a executora entrega suas informações.</li></ul>'
                 + note('gap', '<p>Não há versão pública verificada do manual do prestador de contas do CITS. Para o PPI 4.0 vale o manual efetivamente entregue à executora, na versão vinculada ao convênio. Solicite a versão vigente ao CITS.</p>')
                 + note('alert', '<p>Ter "Indústria 4.0" no título do projeto não torna aplicáveis todas as regras da modalidade de maturidade fabril. Verifique a modalidade do projeto antes de aplicar um ato recente do catálogo da Suframa.</p>')
                 + note('valid', '<p>Pontos que a base normativa deixa em aberto: confirmar com o CITS a "Resolução nº 04 de 11 de setembro de 2018" citada no Roteiro R6, conferir a vigência do Decreto 6.008/2006 e conferir o texto dos artigos no site oficial.</p>')
                 + note('norm', '<p>Este material não substitui parecer jurídico.</p>')
             ),
             review=[('Os percentuais de 20% podem ser somados como margem livre?',
                      '<p>Não. Cada um tem finalidade, base e condição próprias. No PPI, o art. 43 da Res. 2/2020 considera em conjunto as parcelas da coordenadora e da executora.</p>'),
                     ('Qual prazo de guarda vale para a executora em programa prioritário?',
                      '<p>Dez anos, segundo o art. 15 da Res. CAPDA 2/2020. A regra geral do decreto fala em cinco. Registre o marco de início da contagem.</p>')]),
    ],
    quiz=[
        dict(q='Quais são as três camadas que a executora deve ler juntas?',
             opts=['Lei, portaria e planilha', 'Legislação de PD&I, regras da modalidade e documentos de execução e prestação de contas', 'Decreto, manual e relatório', 'Convênio, PUR e extrato'],
             ans=1, why='A base normativa se organiza em legislação de PD&I, regras da modalidade e documentos de execução e prestação de contas.'),
        dict(q='Qual resolução cria o Programa Prioritário de Indústria 4.0 e Modernização Industrial?',
             opts=['Resolução CAPDA nº 2/2020', 'Resolução CAPDA nº 9/2019', 'Resolução CAPDA nº 5/2010', 'Portaria Conjunta nº 9.835/2022'],
             ans=1, why='A Resolução CAPDA nº 9/2019 cria o PPI 4.0 (art. 6º) e define seu escopo.'),
        dict(q='Qual norma regula o convênio direto com ICT credenciada?',
             opts=['Resolução CAPDA nº 9/2019', 'Resolução CAPDA nº 2/2020', 'Portaria Conjunta ME/Suframa nº 9.835/2022', 'Lei nº 10.973/2004'],
             ans=2, why='A Portaria 9.835/2022 é a referência operacional do convênio direto.'),
        dict(q='Quanto ao prazo de guarda documental, qual afirmação está correta segundo a base normativa?',
             opts=['É sempre de cinco anos', 'É sempre de dez anos', 'A regra geral do decreto fala em cinco anos e a da executora em programa prioritário em dez', 'Não há prazo de guarda'],
             ans=2, why='O Decreto 10.521 traz cinco anos como regra geral; a Res. CAPDA 2/2020, art. 15, traz dez anos para a executora em programa prioritário.'),
        dict(q='O que fazer ao citar um artigo desta base em ofício ou resposta a diligência?',
             opts=['Copiar do portal', 'Conferir o texto no site oficial antes', 'Citar sem número de artigo', 'Pedir parecer ao CITS apenas depois de enviar'],
             ans=1, why='O texto dos artigos não foi conferido linha a linha na base. Use os botões para o texto oficial antes de citar.'),
        dict(q='Um projeto tem "Indústria 4.0" no título. Isso torna aplicáveis todas as regras da modalidade de maturidade fabril?',
             opts=['Sim, automaticamente', 'Não. É preciso verificar a modalidade do projeto', 'Sim, se o projeto for do CITS', 'Somente a partir de 2027'],
             ans=1, why='A base alerta que o título não define a modalidade. Acompanhe o catálogo oficial e verifique antes de aplicar.'),
    ],
    classify=dict(
        title='Classifique: qual norma regula o assunto',
        sub='Escolha a norma que, segundo a base normativa, trata de cada assunto.',
        cats=['Lei 8.387/1991', 'Decreto 10.521/2020', 'Res. CAPDA 9/2019', 'Res. CAPDA 2/2020', 'Portaria 9.835/2022', 'Lei 10.973/2004', 'Res. CAPDA 5/2010'],
        items=[('Criação do Programa Prioritário de Indústria 4.0 e Modernização Industrial', 2, 'Resolução CAPDA 9/2019, art. 6º.'),
               ('Obrigação anual de investimento em PD&I, regra geral de 5% sobre a base legal', 0, 'Lei 8.387/1991, art. 2º, § 3º.'),
               ('Categorias de dispêndios elegíveis', 1, 'Decreto 10.521/2020, art. 22.'),
               ('Conta específica, contabilidade e guarda por dez anos da executora', 3, 'Resolução CAPDA 2/2020, art. 15, VII a IX.'),
               ('RD da empresa, auditoria, análise e contestação no convênio direto', 4, 'Portaria 9.835/2022, arts. 28 a 33.'),
               ('Titularidade, exploração e participação nos resultados', 5, 'Lei 10.973/2004, art. 9º, §§ 2º e 3º.'),
               ('Credenciamento de ICTs e entidades de ensino', 6, 'Resolução CAPDA 5/2010, alterada pela Res. 8/2015.')]),
    cases=[
        dict(title='Caso (fictício): qual prazo de guarda registrar?',
             scenario='Um colega pergunta se a guarda dos documentos de um projeto PPI 4.0 é de cinco ou de dez anos.',
             qa=[('Que regras aparecem na base normativa?',
                  '<p>A regra geral do Decreto 10.521 fala em cinco anos, ressalvada contestação (art. 22, §§ 8º e 9º). A regra específica da executora em programa prioritário fala em dez anos (Res. CAPDA 2/2020, art. 15, VII a IX).</p>'),
                 ('O que o Roteiro R6 pede?',
                  '<p>A Declaração de Guarda por 10 anos, anual e no início do projeto.</p>'),
                 ('O que registrar e o que validar?',
                  '<p>Registre no controle documental o marco de início da contagem de cada projeto. Valide com a coordenação e com o convênio qual regra o instrumento adota, e confira o texto oficial.</p>')]),
        dict(title='Caso (fictício): ato novo no catálogo da Suframa',
             scenario='Sai uma portaria nova sobre investimentos em Indústria 4.0 e a equipe quer aplicá-la a todos os projetos que têm "Indústria 4.0" no título.',
             qa=[('O que a base normativa recomenda?',
                  '<p>Verificar se a modalidade do projeto é a de maturidade fabril antes de aplicar. O título do projeto não define a modalidade.</p>'),
                 ('Como acompanhar atos recentes?',
                  '<p>Pelo catálogo oficial de normativos da Suframa, indicado na seção "Atualizações a acompanhar".</p>')]),
    ],
))
