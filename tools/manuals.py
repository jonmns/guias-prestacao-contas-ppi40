# -*- coding: utf-8 -*-
"""Leitura e preparo dos três manuais.

- adiciona ids estáveis aos subtítulos (h3/h4) que não têm id, sem alterar o texto;
- injeta, entre marcadores <!--portal:...-->, o cabeçalho do portal, migalhas,
  ferramentas por seção (favoritar, marcar como estudada), navegação anterior/próxima
  e links relacionados;
- extrai seções, subtítulos e trechos para o índice de busca.
O processo é idempotente: pode ser executado quantas vezes for preciso.
"""
import html as H
import pathlib
import re
import unicodedata

ROOT = pathlib.Path(__file__).resolve().parent.parent

MANUALS = {
    'guia': dict(file='guias/guia-prestacao-de-contas.html', n=1, short='Guia', title='Guia de prestação de contas',
                 stage='etapa-1-processos'),
    'ferramentas': dict(file='guias/manual-das-ferramentas.html', n=2, short='Ferramentas', title='Manual das ferramentas',
                        stage='etapa-2-ferramentas'),
    'normativa': dict(file='guias/base-normativa-pdi.html', n=3, short='Normas', title='Base normativa de PD&I',
                      stage='etapa-3-normas'),
}
ORDER = ['guia', 'ferramentas', 'normativa']

CATS = ['Processo', 'Ferramentas', 'Indicadores', 'Normas e legislação', 'Obrigações, riscos e erros',
        'Documentos e checklists', 'Premissas e lacunas', 'Glossário e trilhas']
CAT_BY_SEC = {
    'guia': {'resumo': 0, 'funcao': 0, 'rotina': 0, 'obrigacoes': 4, 'dependencias': 0, 'processos': 0, 'jornada': 0,
             'riscos': 4, 'organograma': 0, 'e2e': 0, 'melhorias': 4, 'lacunas': 6, 'anexo': 5},
    'ferramentas': {'resumo': 1, 'integracao': 1, 'ordem': 1, 'rubricas': 1, 'pf': 1, 'ig': 2, 'rd': 1, 'rastreio': 1,
                    'alertas': 4, 'erros': 4, 'checklist': 5, 'lacunas': 6},
    'normativa': {'resumo': 3, 'modalidades': 3, 'mapa': 3, 'normas': 3, 'manuais': 3, 'cuidados': 3, 'rotina': 3,
                  'dossie': 5, 'atualizacoes': 3, 'lacunas': 6},
}
SUBJECTS = [
    ('Prestação de contas', r'prestacao de contas|\bpc\b'),
    ('Rateio e RH', r'rateio|folha|\brhd\b|\brhi\b|abertura de pagamento|holerite|bolsista|profissiona'),
    ('Planilha financeira', r'planilha financeira|posicao financeira|conc\. bancaria|consolidado|conciliac'),
    ('Indicadores', r'indicador|\big\b|indices?\b|desvio|tendencia'),
    ('Relatório técnico', r'relatorio tecnico|relatorio demonstrativo|\brd\b|topico'),
    ('Checklists e documentos', r'checklist|roteiro|marque|arquivo unico|pastas?\b|nomenclatura'),
    ('Legislação', r'\blei\b|decreto|resolucao|portaria|capda|suframa|norma'),
    ('Adendos e mudanças', r'adendo|oficio|mudanca|aditiv'),
    ('Aportes e caixa', r'aporte|saldo|caixa'),
    ('Compras e cotações', r'cotac|aquisic|compras|importac'),
    ('Guarda e declarações', r'guarda|declaracao'),
    ('Riscos e lacunas', r'risco|lacuna|premissa|divergenc|gargalo'),
]


def norm(s):
    s = unicodedata.normalize('NFKD', s)
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return s.lower()


def slug(s, n=44):
    s = re.sub(r'[^a-z0-9]+', '-', norm(s)).strip('-')
    return s[:n].strip('-') or 'x'


def text_of(frag):
    frag = re.sub(r'<!--portal:(\w+)-->.*?<!--/portal:\1-->', ' ', frag, flags=re.S)
    frag = re.sub(r'<(script|style|svg|template)\b.*?</\1>', ' ', frag, flags=re.S)
    frag = re.sub(r'</?(td|th)\b[^>]*>', ' | ', frag)
    frag = re.sub(r'<(br|/p|/li|/tr|/div|/h[1-6]|/header|/summary|/dt|/dd)\b[^>]*>', ' ', frag)
    frag = re.sub(r'<[^>]+>', ' ', frag)
    frag = H.unescape(frag)
    frag = re.sub(r'\s*\|\s*(\|\s*)+', ' | ', frag)
    return re.sub(r'\s+', ' ', frag).strip(' |')


def strip_b64(t):
    return re.sub(r'data:[a-z/+\-.]+;base64,[A-Za-z0-9+/=]+', 'data:B64', t)


class SectionPattern:
    """Percorre seções balanceadas; dispositivos normativos contêm seções internas."""
    class Match:
        def __init__(self, src, start, end, attrs, inner):
            self.src, self.a, self.b, self.attrs, self.inner = src, start, end, attrs, inner
        def group(self, n=0):
            return self.src[self.a:self.b] if n == 0 else self.attrs if n == 1 else self.inner
    def finditer(self, src):
        stack = []
        for token in re.finditer(r'<(/?)section\b([^>]*)>', src, re.I):
            if not token.group(1):
                attrs = token.group(2)
                classes = re.search(r'class="([^"]*)"', attrs)
                stack.append((token.start(), token.end(), attrs, bool(classes and 'sec' in classes.group(1).split())))
            elif stack:
                start, inner, attrs, wanted = stack.pop()
                if wanted:
                    yield self.Match(src, start, token.end(), attrs, src[inner:token.start()])
    def sub(self, fn, src):
        for m in sorted(self.finditer(src), key=lambda m: m.a, reverse=True):
            src = src[:m.a] + fn(m) + src[m.b:]
        return src
SEC_RE = SectionPattern()


def sec_id(attrs):
    m = re.search(r'\bid="([^"]+)"', attrs)
    return m.group(1) if m else None


def clean(src):
    return re.sub(r'<!--portal:(\w+)-->.*?<!--/portal:\1-->', '', src, flags=re.S)


def survey(src):
    """Lista de seções (id, número, título, rótulo do sumário)."""
    src = clean(strip_b64(src))
    toc = {}
    for m in re.finditer(r'<li><a href="#([^"]+)">(.*?)</a></li>', src):
        toc[m.group(1)] = text_of(m.group(2))
    out = []
    for m in SEC_RE.finditer(src):
        sid = sec_id(m.group(1))
        inner = m.group(2)
        eb = re.search(r'<div class="eyebrow">(.*?)</div>', inner, re.S)
        num = ''
        if eb:
            b = re.search(r'<b>(.*?)</b>', eb.group(1), re.S)
            num = text_of(b.group(1)) if b else ''
        h2 = re.search(r'<h2[^>]*>(.*?)</h2>', inner, re.S)
        title = text_of(h2.group(1)) if h2 else sid
        words = len(text_of(inner).split())
        out.append(dict(id=sid, num=num, title=title, toc=toc.get(sid, title), words=words))
    return out


def reading_minutes(words):
    return max(1, round(words / 200))
