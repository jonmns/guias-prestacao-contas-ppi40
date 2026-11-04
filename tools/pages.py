# -*- coding: utf-8 -*-
"""Gera as páginas do portal (HTML estático com melhoria progressiva por JavaScript)."""
import html as H
import re

from manuals import MANUALS, ORDER, norm, slug
from trilhas import STAGES, note, NOTE_KINDS
import content as C

SITE = 'Portal PPI 4.0'

ICON = {
    'route': '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>',
    'grid': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/>',
    'scale': '<path d="M12 3v18M6 21h12M5 7h14M5 7l-3 7a3.5 3.5 0 0 0 6 0zM19 7l-3 7a3.5 3.5 0 0 0 6 0z"/>',
    'book': '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7"/>',
    'search': '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    'listcheck': '<path d="M9 6h11M9 12h11M9 18h11M3.5 6l1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/>',
    'user': '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6"/>',
    'arrow': '<path d="M3 12h16M13 6l6 6-6 6"/>',
    'moon': '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    'menu': '<path d="M3 6h18M3 12h18M3 18h18"/>',
    'chev': '<path d="m6 9 6 6 6-6"/>',
    'star': '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    'glossary': '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM9 9h6M9 13h6"/>',
}


def svg(name, cls='', w=None):
    c = f' class="{cls}"' if cls else ''
    return (f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" '
            f'stroke-linejoin="round" aria-hidden="true" focusable="false"{c}>{ICON[name]}</svg>')


LOGO = ('<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">'
        '<stop offset="0" stop-color="#0F2A4A"/><stop offset="1" stop-color="#1A6FAE"/></linearGradient></defs>'
        '<rect width="40" height="40" rx="10" fill="url(#lg)"/><path d="M5 27c5-6 9 5 15-1s10-2 15-8" fill="none" stroke="#7FD0FF" stroke-width="2.2" stroke-linecap="round"/>'
        '<text x="20" y="19" text-anchor="middle" font-family="Lato,Arial,sans-serif" font-weight="900" font-size="11" fill="#fff">PPI</text>'
        '<text x="20" y="34" text-anchor="middle" font-family="Lato,Arial,sans-serif" font-weight="900" font-size="9" fill="#fff">4.0</text></svg>')


class Ctx:
    """Estado compartilhado: seções, subtítulos e resolução de referências."""

    def __init__(self, sections, heads, words):
        self.sections = sections     # m -> [dict]
        self.heads = heads           # m -> [(sid, anchor, title)]
        self.words = words           # m -> total de palavras

    def resolve(self, ref, base=''):
        m, rest = ref.split('#', 1)
        sid, _, frag = rest.partition(':')
        sec = next((s for s in self.sections[m] if s['id'] == sid), None)
        if not sec:
            raise KeyError('seção inexistente: ' + ref)
        anchor, label = sid, sec['title']
        if frag:
            f = norm(frag)
            hit = next(((a, t) for (s, a, t) in self.heads[m] if s == sid and f in norm(t)), None)
            if not hit:
                raise KeyError('subtítulo inexistente: ' + ref)
            anchor, label = hit
        return dict(m=m, sid=sid, anchor=anchor, label=label, mtitle=MANUALS[m]['title'], stitle=sec['title'],
                    url=f"{base}{MANUALS[m]['file']}#{anchor}")

    def link(self, ref, base='', cls='chip', text=None):
        r = self.resolve(ref, base)
        return f'<a class="{cls}" href="{r["url"]}">{H.escape(text or r["label"])}</a>'


def esc(s):
    return H.escape(s, quote=True)


# ------------------------------------------------------------------ casca das páginas
def header_html(base, active=None):
    def cur(k):
        return ' aria-current="page"' if active == k else ''
    mm = ''.join(
        f'<a href="{base}{MANUALS[k]["file"]}"><b>{esc(MANUALS[k]["title"])}</b><small>{d}</small></a>'
        for k, d in [('guia', 'Rotina, obrigações e fluxos'), ('ferramentas', 'Planilha, indicadores e relatório'),
                     ('normativa', 'Leis, resoluções e portarias')])
    return (
        f'<a class="skip-link" href="#conteudo">Ir para o conteúdo</a>'
        f'<header class="ph"><div class="ph-in">'
        f'<a class="brand" href="{base}index.html" aria-label="{SITE}, página inicial">{LOGO}<span><small>Guias do analista de P&amp;D</small><b>{SITE}</b></span></a>'
        f'<nav class="pnav" id="p-nav" aria-label="Navegação principal">'
        f'<a href="{base}aprender.html" data-nav="aprender"{cur("aprender")}>Quero aprender</a>'
        f'<a href="{base}consultar.html" data-nav="consultar"{cur("consultar")}>Preciso consultar</a>'
        f'<div class="dd"><button type="button" class="dd-b{" is-here" if active == "manuais" else ""}" aria-expanded="false" aria-controls="p-dd" data-nav="manuais">Manuais {svg("chev")}</button>'
        f'<div class="dd-m" id="p-dd">{mm}</div></div>'
        f'<a href="{base}checklists.html" data-nav="checklists"{cur("checklists")}>Checklists</a>'
        f'<a href="{base}glossario.html" data-nav="glossario"{cur("glossario")}>Glossário</a>'
        f'<a href="{base}meu-espaco.html" data-nav="meu"{cur("meu")}>Meu espaço</a>'
        f'</nav>'
        f'<div class="psearch" id="p-search"><form role="search" action="{base}consultar.html" method="get">{svg("search")}'
        f'<label class="sr-only" for="p-q">Buscar nos três manuais</label>'
        f'<input id="p-q" name="q" type="search" placeholder="Buscar nos manuais" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="p-sug">'
        f'</form><div class="sug" id="p-sug" role="listbox" aria-label="Sugestões de busca"></div></div>'
        f'<button type="button" class="ibtn" id="p-search-btn" aria-expanded="false" aria-controls="p-search" aria-label="Abrir busca">{svg("search")}</button>'
        f'<button type="button" class="ibtn" id="p-theme" aria-label="Alternar entre modo claro e escuro">{svg("moon", "ic-moon")}{svg("sun", "ic-sun")}</button>'
        f'<button type="button" class="ibtn" id="p-menu-btn" aria-expanded="false" aria-controls="p-nav" aria-label="Abrir menu">{svg("menu")}</button>'
        f'</div></header>')


def crumbs_html(items):
    """items: lista de (rótulo, href|None). O último é a página atual."""
    out = []
    for i, (lab, href) in enumerate(items):
        if i == len(items) - 1:
            out.append(f'<li><span aria-current="page"{" id=crumb-sec" if False else ""}>{lab}</span></li>')
        else:
            out.append(f'<li><a href="{href}">{lab}</a></li>')
    return f'<nav class="crumbs" aria-label="Você está em"><ol>{"".join(out)}</ol></nav>'


def footer_html(base):
    return (
        f'<footer class="pf"><div class="wrap">'
        f'<div><h2>{SITE}</h2><p>Materiais de referência para analistas de P&amp;D de instituições executoras de projetos do Programa Prioritário de Indústria 4.0 e Modernização Industrial (PPI 4.0), coordenado pelo CITS.</p>'
        f'<p class="storage-warn" role="status">O armazenamento local do navegador está indisponível. Progresso, favoritos e preferências valem só enquanto esta página estiver aberta.</p></div>'
        f'<div><h2>Navegar</h2><ul><li><a href="{base}aprender.html">Quero aprender</a></li><li><a href="{base}consultar.html">Preciso consultar</a></li>'
        f'<li><a href="{base}checklists.html">Checklists operacionais</a></li><li><a href="{base}glossario.html">Glossário</a></li><li><a href="{base}meu-espaco.html">Meu espaço</a></li></ul></div>'
        f'<div><h2>Manuais</h2><ul>'
        + ''.join(f'<li><a href="{base}{MANUALS[k]["file"]}">{esc(MANUALS[k]["title"])}</a></li>' for k in ORDER)
        + f'</ul></div>'
        f'<p class="legal">Itens marcados como premissa ou lacuna exigem validação com a coordenação e com os instrumentos de cada projeto. Os links normativos apontam para Planalto, Diário Oficial da União e Suframa: confira o texto oficial antes de citá-lo em documento. Este material não substitui parecer jurídico.</p>'
        f'</div></footer>')


THEME_BOOT = ("<script>(function(){var d=document.documentElement;d.classList.add('js');try{var s=localStorage.getItem('ppi40-guia-tema');"
              "if(s==='dark'||s==='light')d.setAttribute('data-theme',s)}catch(e){}})()</script>")


def shell(title, desc, body, base='', active=None, crumbs=None, page='page', scripts=('core.js',), extra=''):
    sc = ''.join(f'<script src="{base}assets/{s}" defer></script>' for s in scripts)
    full_title = title if title.startswith(SITE) else f'{title} · {SITE}'
    cr = crumbs_html(crumbs) if crumbs else ''
    return (
        f'<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
        f'<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        f'<title>{esc(full_title)}</title>\n<meta name="description" content="{esc(desc)}">\n'
        f'<meta name="theme-color" content="#0F2A4A">\n{THEME_BOOT}\n'
        f'<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
        f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=IBM+Plex+Mono:wght@400;500&display=swap">\n'
        f'<link rel="stylesheet" href="{base}assets/portal.css">\n{extra}</head>\n'
        f'<body class="portal" data-page="{page}" data-base="{base}">\n'
        f'{header_html(base, active)}\n{cr}\n<main id="conteudo" tabindex="-1">\n{body}\n</main>\n{footer_html(base)}\n{sc}\n</body>\n</html>\n')


# ------------------------------------------------------------------ componentes
def progress(keys, unit, label):
    return (f'<div class="prog" data-keys="{esc(",".join(keys))}" data-unit="{esc(unit)}">'
            f'<div class="plabel"><span>{esc(label)}</span><b data-prog-text>0 de {len(keys)} {esc(unit)}</b></div>'
            f'<div class="pbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="{esc(label)}"><i></i></div></div>')


def legend():
    return '<div class="legend">' + ''.join(
        f'<span class="badge pt">{ic} {lab}</span>' for k, (lab, ic) in NOTE_KINDS.items()) + '</div>'


def minutes(words):
    return max(1, round(words / 200))


def wcount(h):
    t = re.sub(r'<[^>]+>', ' ', h)
    return len(H.unescape(t).split())


# ------------------------------------------------------------------ página inicial
def page_index(ctx):
    mins = {m: minutes(ctx.words[m]) for m in ORDER}
    cards = [
        dict(k='guia', cls='c-m1', ico='route', level='Introdutório',
             desc='A rotina completa do analista: o que entregar, quando, para quem e com quais dependências entre áreas.',
             chips=['Rotina', 'Obrigações', 'Fluxogramas', 'RACI', 'Jornada', 'Riscos']),
        dict(k='ferramentas', cls='c-m2', ico='grid', level='Intermediário a avançado',
             desc='Como preencher e conectar a Planilha Financeira, os Indicadores Gerenciais e o Relatório Técnico, com prints anotados dos modelos.',
             chips=['Planilha Financeira', 'Indicadores', 'Relatório Técnico', 'Checklist', 'Rastreabilidade']),
        dict(k='normativa', cls='c-m3', ico='scale', level='Referência para consulta',
             desc='Leis, decretos, resoluções, portarias e manuais do PPI 4.0 e do convênio direto, com acesso ao texto oficial de cada norma.',
             chips=['Leis', 'Resoluções CAPDA', 'Portarias', 'Manuais']),
    ]
    mcards = ''
    for c in cards:
        m = MANUALS[c['k']]
        mcards += (
            f'<article class="card tone {c["cls"]}"><div class="ico">{svg(c["ico"])}</div>'
            f'<span class="eyebrow muted">Manual {m["n"]}</span><h3><a href="{m["file"]}" style="color:inherit;text-decoration:none">{esc(m["title"])}</a></h3>'
            f'<p>{esc(c["desc"])}</p>'
            f'<ul class="chips" style="list-style:none;margin:0;padding:0">{"".join(f"<li class=chip>{esc(x)}</li>" for x in c["chips"])}</ul>'
            f'<div class="meta"><span>Complexidade: <b>{c["level"]}</b></span><span>Leitura: <b>≈ {mins[c["k"]]} min</b></span><span><b>{len(ctx.sections[c["k"]])}</b> seções</span></div>'
            f'<div class="foot"><a class="btn primary sm" href="{m["file"]}">Abrir manual {svg("arrow")}</a>'
            f'<a class="btn ghost sm" href="aprender/{m["stage"]}.html">Estudar na trilha</a></div></article>')

    quick = ''.join(
        f'<a href="{ctx.resolve(r)["url"]}"><b>{esc(t)}</b><span>{esc(d)}</span></a>' for r, t, d in C.QUICK)

    steps = ''
    for s in STAGES:
        keys = [l['id'] for l in s['lessons']]
        steps += (
            f'<a class="step" href="aprender/{s["id"]}.html"><span class="n" aria-hidden="true">{s["n"]}</span>'
            f'<div><h3>Etapa {s["n"]}: {esc(s["title"])}</h3><p>{esc(s["summary"])}</p></div>'
            f'<div class="side">{len(s["lessons"])} lições<br>{progress(["lesson:" + k for k in keys], "lições", "Progresso da etapa " + str(s["n"]))}</div></a>')

    sc_chips = ''.join(f'<a class="chip" href="consultar.html?q={esc(s["q"])}">{esc(s["title"])}</a>' for s in C.SHORTCUTS[:7])
    body = f'''
<section class="hero-p"><div class="wrap">
  <div>
    <p class="eyebrow">Programa Prioritário Indústria 4.0 · Prestação de contas</p>
    <h1>Aprenda e consulte a prestação de contas do PPI 4.0 em um só lugar</h1>
    <p class="lead">Portal de conhecimento para analistas de P&amp;D. Siga uma trilha de aprendizado em três etapas ou vá direto ao procedimento, à ferramenta ou à norma de que precisa.</p>
    <div class="cta"><a class="btn on-dark" href="aprender.html">Começar a aprender {svg("arrow")}</a>
    <a class="btn on-dark outline" href="guias/base-normativa-pdi.html#normas">Consultar normas</a></div>
  </div>
  <div class="hero-side">
    <h2>Buscar nos três manuais</h2>
    <form role="search" action="consultar.html" method="get"><label class="sr-only" for="h-q">Buscar nos três manuais</label><input id="h-q" name="q" type="search" placeholder="Ex.: rateio, adendo, conciliação" autocomplete="off"><button type="submit" aria-label="Buscar">{svg("search")}</button></form>
    <div class="chips" aria-label="Assuntos frequentes">{sc_chips}</div>
    <a class="cont-card" id="cont-card" href="#"><small>Continuar de onde parei</small><b></b></a>
  </div>
</div></section>

<section class="sec-p"><div class="wrap">
  <header><h2>Como você quer usar o portal?</h2><p class="sub">Dois caminhos levam ao mesmo conteúdo. Escolha o que combina com o momento.</p></header>
  <div class="grid g2">
    <a class="card link tone path c-m1" href="aprender.html"><span class="ico">{svg("book")}</span><div><h3>Quero aprender</h3><p>Trilha progressiva em três etapas, com objetivos, exemplos, estudos de caso, exercícios e perguntas de revisão. Seu progresso fica salvo neste navegador.</p><ul><li>Processos e prestação de contas</li><li>Ferramentas e preenchimento de documentos</li><li>Base normativa e legislação</li></ul></div></a>
    <a class="card link tone path c-m2" href="consultar.html"><span class="ico">{svg("search")}</span><div><h3>Preciso consultar</h3><p>Busca nos três manuais com filtros por manual, categoria e assunto, atalhos para temas frequentes, checklists e glossário.</p><ul><li>Busca integrada com acesso direto à seção</li><li>Atalhos: rateio de RH, planilha, indicadores, legislação</li><li>Checklists operacionais interativos</li></ul></div></a>
  </div>
</div></section>

<section class="sec-p" id="manuais"><div class="wrap">
  <header><h2>Os três manuais</h2><p class="sub">Cada manual continua no mesmo endereço de antes. A complexidade é uma classificação editorial. O tempo de leitura considera 200 palavras por minuto e não inclui prints e diagramas.</p></header>
  <div class="grid g3">{mcards}</div>
</div></section>

<section class="sec-p"><div class="wrap">
  <header><h2>Jornada de aprendizado</h2><p class="sub">Três etapas em ordem progressiva. O conteúdo técnico original dos manuais permanece integral e as lições apontam para as seções de cada um.</p></header>
  <div class="steps">{steps}</div>
</div></section>

<section class="sec-p"><div class="wrap">
  <header><h2>Acesso rápido</h2><p class="sub">Os conteúdos mais usados na rotina.</p></header>
  <div class="quick">{quick}</div>
  <div id="fav-home" class="js-only" hidden style="margin-top:22px"><h3 style="margin:0 0 8px;color:var(--accent-ink)">Seus favoritos</h3><ul class="fav-list" id="fav-home-list"></ul></div>
</div></section>

<section class="sec-p"><div class="wrap">
  <header><h2>Como ler as marcações</h2><p class="sub">O portal diferencia o tipo de cada informação para que você saiba o quanto ela sustenta uma decisão.</p></header>
  {legend()}
  <div class="grid g2" style="margin-top:14px">
    {note("premise", "<p>Premissas são inferências operacionais que ainda precisam de validação com a coordenação e com os instrumentos de cada projeto.</p>")}
    {note("gap", "<p>Lacunas indicam informação ausente nos documentos de origem. O portal não preenche lacunas com regras novas.</p>")}
  </div>
  <p class="disclaimer">Este material não substitui parecer jurídico. Confira o texto oficial das normas antes de citá-las em documento.</p>
</div></section>
'''
    return shell('Portal PPI 4.0: guias de prestação de contas',
                 'Portal de aprendizado e consulta para analistas de P&D: trilhas, busca nos três manuais, checklists e base normativa do PPI 4.0.',
                 body, base='', page='home', scripts=('core.js', 'pages.js'))


# ------------------------------------------------------------------ trilhas
def lesson_minutes(ctx, l):
    own = wcount(l['body']) + sum(wcount(q + a) for q, a in l['review'])
    man = sum(next(s['words'] for s in ctx.sections[r.split('#')[0]] if s['id'] == r.split('#')[1].split(':')[0]) for r in l['refs'])
    return minutes(own), minutes(man)


def render_quiz(s):
    qs = ''
    for i, q in enumerate(s['quiz']):
        opts = ''.join(
            f'<label class="opt"><input type="radio" name="{s["id"]}-q{i}" value="{j}"><span>{esc(o)}</span></label>'
            for j, o in enumerate(q['opts']))
        qs += (f'<fieldset class="q" data-ans="{q["ans"]}" data-why="{esc(q["why"])}"><legend>{i + 1}. {esc(q["q"])}</legend>{opts}'
               f'<p class="fb" hidden role="status"></p></fieldset>')
    return (f'<section class="ex" id="avaliacao" data-quiz="{s["id"]}"><h3>Avaliação curta</h3>'
            f'<p class="sub">{len(s["quiz"])} perguntas. Escolha uma opção em cada uma e clique em verificar. Cada resposta traz uma explicação.</p>'
            f'<form novalidate>{qs}<div class="ck-tools"><button type="submit" class="btn primary">Verificar respostas</button>'
            f'<button type="button" class="btn ghost" data-act="reset">Refazer</button>'
            f'<span class="score" aria-live="polite"></span></div></form></section>')


def render_classify(c, cid):
    items = ''
    for i, (t, a, why) in enumerate(c['items']):
        opts = '<option value="">Escolha</option>' + ''.join(f'<option value="{j}">{esc(x)}</option>' for j, x in enumerate(c['cats']))
        items += (f'<li data-ans="{a}" data-why="{esc(why)}"><label for="{cid}-{i}">{esc(t)}</label>'
                  f'<select id="{cid}-{i}">{opts}</select><p class="fb" hidden></p></li>')
    return (f'<section class="ex" id="{cid}" data-cls="{cid}"><h3>{esc(c["title"])}</h3><p class="sub">{esc(c["sub"])}</p>'
            f'<ul class="cls">{items}</ul><div class="ck-tools"><button type="button" class="btn primary" data-act="check">Verificar</button>'
            f'<button type="button" class="btn ghost" data-act="reset">Refazer</button><span class="score" aria-live="polite"></span></div></section>')


def render_cases(cases):
    out = ''
    for c in cases:
        qa = ''.join(f'<details class="flip"><summary>{esc(q)}</summary><div>{a}</div></details>' for q, a in c['qa'])
        out += (f'<article class="ex"><h3>{esc(c["title"])}</h3>'
                f'{note("example", "<p>" + esc(c["scenario"]) + "</p>", "Situação")}'
                f'<p class="sub">Abra cada pergunta para ver a resposta com base nos manuais.</p>{qa}</article>')
    return out


def page_stage(ctx, s, idx):
    base = '../'
    nav_items = ''.join(f'<li><a href="#{l["id"]}" data-lesson-link="{l["id"]}">{i + 1}. {esc(l["title"])}</a></li>' for i, l in enumerate(s['lessons']))
    nav_items += '<li><a href="#exercicios">Exercícios e avaliação</a></li><li><a href="#casos">Estudos de caso</a></li>'
    lessons = ''
    for i, l in enumerate(s['lessons']):
        own, man = lesson_minutes(ctx, l)
        goals = ''.join(f'<li>{esc(g)}</li>' for g in l['goals'])
        refs = ''.join(ctx.link(r, base, 'chip') for r in l['refs'])
        rev = ''.join(f'<details class="flip"><summary>{q}</summary><div>{a}</div></details>' for q, a in l['review'])
        prev = (f'<a class="btn ghost sm" href="#{s["lessons"][i - 1]["id"]}">← Lição anterior</a>' if i else '<span></span>')
        nxt = (f'<a class="btn ghost sm" href="#{s["lessons"][i + 1]["id"]}">Próxima lição →</a>' if i < len(s['lessons']) - 1
               else '<a class="btn ghost sm" href="#exercicios">Ir aos exercícios →</a>')
        lessons += (
            f'<article class="lesson" id="{l["id"]}" data-lesson="{l["id"]}" data-title="{esc(l["title"])}">'
            f'<header><div><span class="eyebrow muted">Lição {i + 1} de {len(s["lessons"])}</span><h2>{esc(l["title"])}</h2></div>'
            f'<div class="lmeta"><span>Lição ≈ {own} min · Leitura no manual ≈ {man} min</span>'
            f'<button type="button" class="btn sm ghost js-only" data-study data-key="lesson:{l["id"]}" aria-pressed="false">Marcar como estudada</button></div></header>'
            f'<div class="goals"><h3>Objetivos de aprendizado</h3><ul>{goals}</ul></div>'
            f'{l["body"]}'
            f'<div class="read-links" role="group" aria-label="Leitura no manual"><strong>Leia no manual:</strong>{refs}</div>'
            f'<h3>Perguntas de revisão</h3>{rev}'
            f'<div class="lesson-foot">{prev}<button type="button" class="btn sm js-only" data-study data-key="lesson:{l["id"]}" aria-pressed="false">Marcar como estudada</button>{nxt}</div></article>')
    ex = render_quiz(s) + render_classify(s['classify'], 'cls1')
    if 'classify2' in s:
        ex += render_classify(s['classify2'], 'cls2')
    ex_html = (f'<section id="exercicios" style="scroll-margin-top:calc(var(--hdr-h) + 12px)"><h2>Exercícios e avaliação</h2>'
               f'<p class="muted">Os exercícios são para treino. O resultado fica salvo apenas neste navegador e não substitui a leitura do manual.</p>{ex}</section>')
    cs = f'<section id="casos" style="scroll-margin-top:calc(var(--hdr-h) + 12px)"><h2>Estudos de caso</h2>{render_cases(s["cases"])}</section>'
    prog = progress(['lesson:' + l['id'] for l in s['lessons']], 'lições', 'Progresso desta etapa')
    nextst = ''
    if idx + 1 < len(STAGES):
        n = STAGES[idx + 1]
        nextst = f'<a class="btn primary" href="{n["id"]}.html">Próxima etapa: {esc(n["title"])} {svg("arrow")}</a>'
    else:
        nextst = '<a class="btn primary" href="../checklists.html">Ir aos checklists operacionais</a>'
    mfile = MANUALS[s['manual']]['file']
    body = f'''
<div class="page-head"><div class="wrap"><p class="eyebrow">Etapa {s["n"]} de {len(STAGES)} · {s["level"]}</p><h1>{esc(s["title"])}</h1><p>{esc(s["summary"])}</p>
<p style="margin-top:8px"><strong>Resultado esperado:</strong> {esc(s["outcome"])}</p></div></div>
<div class="wrap layout2">
  <aside class="side-nav" aria-label="Nesta etapa"><div class="eyebrow muted">Nesta etapa</div>{prog}<ol>{nav_items}</ol>
    <p style="margin-top:14px"><a class="btn sm ghost" href="../{mfile}">Abrir o manual completo</a></p></aside>
  <div class="reading">
    <p class="disclaimer">Os textos das lições explicam os manuais em linguagem acessível e não criam regras. Informações que dependem de validação aparecem em blocos próprios. Este material não substitui parecer jurídico.</p>
    {legend()}
    {lessons}
    {ex_html}
    {cs}
    <div class="lesson-foot" style="margin-top:28px"><a class="btn ghost" href="../aprender.html">← Todas as etapas</a>{nextst}</div>
  </div>
</div>'''
    return shell(f'Etapa {s["n"]}: {s["title"]}', s['summary'], body, base=base, active='aprender',
                 crumbs=[('Portal', '../index.html'), ('Quero aprender', '../aprender.html'), (f'Etapa {s["n"]}', None)],
                 page='stage', scripts=('core.js', 'learn.js'))


def page_aprender(ctx):
    cards = ''
    for s in STAGES:
        lessons = ''.join(f'<li><a href="aprender/{s["id"]}.html#{l["id"]}">{esc(l["title"])}</a></li>' for l in s['lessons'])
        tot = sum(sum(lesson_minutes(ctx, l)) for l in s['lessons'])
        prog = progress(['lesson:' + l['id'] for l in s['lessons']], 'lições', 'Progresso da etapa ' + str(s['n']))
        cards += (
            f'<article class="card tone c-m{s["n"]}"><span class="eyebrow muted">Etapa {s["n"]} · {s["level"]}</span>'
            f'<h3><a href="aprender/{s["id"]}.html" style="color:inherit;text-decoration:none">{esc(s["title"])}</a></h3><p>{esc(s["summary"])}</p>'
            f'<ol style="margin:0;padding-left:1.2em;font-size:.92rem">{lessons}</ol>'
            f'<div class="meta"><span><b>{len(s["lessons"])}</b> lições</span><span>Estudo e leitura ≈ <b>{tot} min</b></span><span data-quiz-best="{s["id"]}"></span></div>'
            f'{prog}<div class="foot"><a class="btn primary sm" href="aprender/{s["id"]}.html">Abrir etapa {svg("arrow")}</a></div></article>')
    body = f'''
<div class="page-head"><div class="wrap"><p class="eyebrow">Quero aprender</p><h1>Trilha de aprendizado em três etapas</h1>
<p>Do processo geral às ferramentas e, depois, às normas. Cada etapa tem objetivos, lições curtas, exemplos práticos, perguntas de revisão, exercícios com feedback e estudos de caso. O conteúdo técnico original continua integral nos manuais.</p></div></div>
<div class="wrap sec-p">
  <a class="cont-card" id="cont-card" href="#" style="border:1px solid var(--line);margin-bottom:20px"><small>Continuar de onde parei</small><b></b></a>
  <div class="grid g3">{cards}</div>
  <section style="margin-top:34px"><h2 style="color:var(--accent-ink)">Como estudar</h2>
    <div class="grid g3" style="margin-top:12px">
      <div class="hub"><h3>1. Leia a lição</h3><p class="muted" style="margin:0">Cada lição resume o tema, aponta os trechos do manual e destaca o que é conceito, exemplo, alerta, exigência normativa, premissa e lacuna.</p></div>
      <div class="hub"><h3>2. Revise e pratique</h3><p class="muted" style="margin:0">Responda as perguntas de revisão, faça os exercícios com feedback e resolva os estudos de caso.</p></div>
      <div class="hub"><h3>3. Marque e continue</h3><p class="muted" style="margin:0">Marque as lições estudadas. O portal guarda seu progresso neste navegador e permite continuar de onde parou.</p></div>
    </div>
    <p style="margin-top:16px">Dúvida sobre um termo? Consulte o <a href="glossario.html">glossário</a>. Precisa executar uma rotina? Use os <a href="checklists.html">checklists</a>.</p>
  </section>
</div>'''
    return shell('Quero aprender: trilha de aprendizado', 'Trilha em três etapas: processos e prestação de contas, ferramentas e preenchimento, base normativa e legislação.',
                 body, active='aprender', crumbs=[('Portal', 'index.html'), ('Quero aprender', None)], page='learn-hub', scripts=('core.js', 'pages.js'))


# ------------------------------------------------------------------ consultar
def page_consultar(ctx):
    from manuals import CATS, SUBJECTS
    hubs = ''
    for sc in C.SHORTCUTS:
        links = ''.join(
            f'<li><a href="{ctx.resolve(r)["url"]}">{esc(ctx.resolve(r)["label"])}</a> <span class="badge m{MANUALS[ctx.resolve(r)["m"]]["n"]}">{esc(MANUALS[ctx.resolve(r)["m"]]["short"])}</span></li>' for r in sc['links'])
        hubs += (f'<div class="hub" id="atalho-{sc["id"]}"><h3>{esc(sc["title"])}</h3><p class="muted" style="margin:0 0 6px;font-size:.88rem">{esc(sc["desc"])}</p><ul>{links}</ul>'
                 f'<a class="more" href="consultar.html?q={esc(sc["q"])}">Buscar tudo sobre {esc(sc["title"].lower())}</a></div>')
    chips = ''.join(f'<button type="button" class="chip" data-q="{esc(s["q"])}" aria-pressed="false">{esc(s["title"])}</button>' for s in C.SHORTCUTS)
    opt_m = '<option value="">Todos os manuais</option>' + ''.join(f'<option value="{k}">{esc(MANUALS[k]["title"])}</option>' for k in ORDER) + '<option value="portal">Glossário, trilhas e checklists</option>'
    opt_c = '<option value="">Todas as categorias</option>' + ''.join(f'<option value="{i}">{esc(c)}</option>' for i, c in enumerate(CATS))
    opt_a = '<option value="">Todos os assuntos</option>' + ''.join(f'<option value="{i}">{esc(n)}</option>' for i, (n, _) in enumerate(SUBJECTS))
    body = f'''
<div class="page-head"><div class="wrap"><p class="eyebrow">Preciso consultar</p><h1>Busca nos três manuais</h1>
<p>Pesquise títulos, conteúdos, procedimentos, ferramentas e normas. Cada resultado mostra a origem e leva direto à seção correspondente.</p></div></div>
<div class="wrap sec-p">
  <form id="s-form" role="search" action="consultar.html" method="get" autocomplete="off">
    <div class="search-box"><label class="sr-only" for="s-q">Termo de busca</label><input id="s-q" name="q" type="search" placeholder="Ex.: rateio de RH, conciliação, adendo, Resolução CAPDA 2" aria-describedby="s-help">
    <button class="btn primary" type="submit">{svg("search")} Buscar</button></div>
    <p id="s-help" class="muted" style="margin:6px 0 0;font-size:.88rem">Dica: siglas como PC, RD, IG, PF, RHD e PUR também funcionam.</p>
    <details class="flip js-only" id="s-filters" open style="margin-top:12px"><summary>Filtros</summary><div style="padding-left:14px"><div class="filters">
      <label>Manual<select id="f-m" class="sel">{opt_m}</select></label>
      <label>Categoria<select id="f-c" class="sel">{opt_c}</select></label>
      <label>Assunto<select id="f-a" class="sel">{opt_a}</select></label></div>
      <button type="button" class="btn sm ghost" id="f-clear">Limpar filtros</button></div></details>
    <div class="shortcuts js-only" role="group" aria-label="Atalhos de assuntos frequentes"><span class="muted" style="align-self:center;font-weight:700;font-size:.85rem">Assuntos frequentes:</span>{chips}</div>
  </form>
  <section id="resultados" aria-labelledby="res-h" style="display:none">
    <div class="res-head"><h2 id="res-h" style="margin:0;font-size:1.2rem;color:var(--accent-ink)">Resultados</h2><p id="res-count" class="muted" role="status" aria-live="polite" style="margin:0"></p></div>
    <ol class="res-list" id="res-list"></ol>
  </section>
  <section id="atalhos" style="margin-top:34px"><h2 style="color:var(--accent-ink)">Atalhos por assunto</h2>
    <p class="muted">Seleções curadas para as consultas mais comuns. Cada atalho leva direto à seção do manual.</p><div class="hub-grid" style="margin-top:12px">{hubs}</div></section>
  <section style="margin-top:34px"><h2 style="color:var(--accent-ink)">Outros recursos de consulta</h2>
    <div class="grid g3" style="margin-top:12px">
      <a class="card link tone c-m2" href="checklists.html"><div class="ico">{svg("listcheck")}</div><h3>Checklists operacionais</h3><p>Fechamento mensal, início de projeto, aquisição, mudança no PUR, encerramento e mais.</p></a>
      <a class="card link tone c-m1" href="glossario.html"><div class="ico">{svg("glossary")}</div><h3>Glossário</h3><p>Siglas e termos dos manuais, com a seção de origem de cada definição.</p></a>
      <a class="card link tone c-m3" href="guias/base-normativa-pdi.html#normas"><div class="ico">{svg("scale")}</div><h3>Normas e dispositivos</h3><p>O que cada norma regula, com link para o texto oficial.</p></a>
    </div></section>
</div>'''
    return shell('Preciso consultar: busca nos manuais', 'Busca integrada nos três manuais com filtros por manual, categoria e assunto, e atalhos para temas frequentes.',
                 body, active='consultar', crumbs=[('Portal', 'index.html'), ('Preciso consultar', None)], page='consult', scripts=('core.js', 'pages.js'))


# ------------------------------------------------------------------ checklists
def page_checklists(ctx, fechamento_groups):
    cks = ''
    toc = ''
    for c in C.CHECKLISTS:
        toc += f'<li><a href="#{c["id"]}">{esc(c["title"])}</a></li>'
        groups = fechamento_groups if c['id'] == 'fechamento' else None
        n = 0
        fs = ''
        if groups is None:
            groups = []
            for gi, (gt, items) in enumerate(c['groups']):
                groups.append((gt, [(f'{c["id"]}-{gi}-{ii}', t, src) for ii, (t, src) in enumerate(items)]))
        all_ids = []
        for gt, items in groups:
            lis = ''
            for (iid, t, src) in items:
                all_ids.append(iid)
                srclink = ''
                if src:
                    r = ctx.resolve(src)
                    srclink = f' <a class="src" href="{r["url"]}">ver no manual</a>'
                lis += f'<label for="{c["id"]}-{iid}"><input type="checkbox" id="{c["id"]}-{iid}" data-ckid="{iid}"><span>{esc(t)}{srclink}</span></label>'
            fs += f'<fieldset><legend>{esc(gt)}</legend>{lis}</fieldset>'
        legacy = ' data-legacy="manual-ppi40-check"' if c.get('legacy') else ''
        r = ctx.resolve(c['source'])
        cks += (f'<section class="cklist" id="{c["id"]}" data-ck="{c["id"]}"{legacy}><header><div><h2>{esc(c["title"])}</h2><p class="muted" style="margin:2px 0 0;font-size:.9rem">{esc(c["sub"])}</p></div>'
                f'<a class="btn sm ghost" href="{r["url"]}">Fonte no manual</a></header>'
                f'<div class="prog js-only" data-ck-prog><div class="plabel"><span>Itens marcados</span><b data-prog-text>0 de {len(all_ids)}</b></div>'
                f'<div class="pbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Progresso do checklist {esc(c["title"])}"><i></i></div></div>'
                f'{fs}<div class="ck-tools js-only"><button type="button" class="btn sm ghost" data-act="reset">Limpar marcações</button><button type="button" class="btn sm ghost" data-act="print">Imprimir</button></div></section>')
    body = f'''
<div class="page-head"><div class="wrap"><p class="eyebrow">Checklists operacionais</p><h1>Checklists para a rotina de prestação de contas</h1>
<p>Listas montadas a partir dos manuais. As marcações ficam salvas só neste navegador e não são enviadas a nenhum servidor.</p></div></div>
<div class="wrap layout2">
  <aside class="side-nav" aria-label="Checklists"><div class="eyebrow muted">Listas</div><ol>{toc}</ol></aside>
  <div class="reading" style="max-width:900px">
    <p class="storage-warn" role="status">O armazenamento local está indisponível: as marcações valem apenas enquanto a página estiver aberta.</p>
    <p class="disclaimer">As listas organizam o que os manuais descrevem. Itens que dependem de validação (por exemplo, prazos de corte internos e quem assina) aparecem como itens a validar. Este material não substitui parecer jurídico.</p>
    {cks}
  </div>
</div>'''
    return shell('Checklists operacionais', 'Checklists interativos de fechamento mensal, início de projeto, aquisição, mudança no PUR, declarações e encerramento.',
                 body, active='checklists', crumbs=[('Portal', 'index.html'), ('Checklists', None)], page='checklists', scripts=('core.js', 'learn.js'))


# ------------------------------------------------------------------ glossário
def page_glossario(ctx):
    items = sorted(C.GLOSSARY, key=lambda x: norm(x[0]))
    letters = sorted({norm(t)[0].upper() for t, _, _ in items})
    az = ''.join(f'<a href="#letra-{l}" aria-label="Termos com {l}">{l}</a>' for l in letters)
    lis = ''
    seen = set()
    for t, d, src in items:
        l = norm(t)[0].upper()
        anchor = f'id="letra-{l}" ' if l not in seen else ''
        seen.add(l)
        r = ctx.resolve(src)
        lis += (f'<li {anchor}data-term="{esc(norm(t))}"><span id="t-{slug(t)}"></span><h3>{esc(t)}</h3><p>{esc(d)}</p>'
                f'<div class="src"><span class="muted">Origem:</span><a href="{r["url"]}">{esc(r["mtitle"])} › {esc(r["stitle"])}</a></div></li>')
    body = f'''
<div class="page-head"><div class="wrap"><p class="eyebrow">Glossário</p><h1>Siglas e termos dos manuais</h1>
<p>Definições curtas com a seção de origem. Termos que os manuais não detalham estão assinalados na própria definição.</p></div></div>
<div class="wrap sec-p">
  <div class="search-box"><label class="sr-only" for="g-q">Filtrar termos</label><input id="g-q" type="search" placeholder="Filtrar termos (ex.: PUR, rateio, guarda)" autocomplete="off" class="sel" style="flex:1 1 300px;font-size:1.05rem;min-height:50px"></div>
  <div class="az" role="navigation" aria-label="Índice alfabético">{az}</div>
  <p id="g-count" class="muted" role="status" aria-live="polite"></p>
  <ul class="gl" id="gl">{lis}</ul>
  <p class="disclaimer" style="margin-top:20px">Definições resumem o que consta nos manuais e não substituem o texto dos instrumentos de cada projeto nem parecer jurídico.</p>
</div>'''
    return shell('Glossário', 'Glossário de siglas e termos da prestação de contas do PPI 4.0, com a seção de origem de cada definição.',
                 body, active='glossario', crumbs=[('Portal', 'index.html'), ('Glossário', None)], page='glossary', scripts=('core.js', 'pages.js'))


# ------------------------------------------------------------------ meu espaço
def page_meu(ctx):
    sec_keys = [f'sec:{m}#{s["id"]}' for m in ORDER for s in ctx.sections[m]]
    les_keys = [f'lesson:{l["id"]}' for s in STAGES for l in s['lessons']]
    mprog = ''.join(progress([f'sec:{m}#{s["id"]}' for s in ctx.sections[m]], 'seções', MANUALS[m]['title']) for m in ORDER)
    sprog = ''.join(progress(['lesson:' + l['id'] for l in s['lessons']], 'lições', f'Etapa {s["n"]}: {s["title"]}') for s in STAGES)
    body = f'''
<div class="page-head"><div class="wrap"><p class="eyebrow">Meu espaço</p><h1>Progresso, favoritos e preferências</h1>
<p>Tudo fica salvo apenas neste navegador, sem login. Em outro aparelho ou navegador, o progresso começa do zero. Use exportar e importar para levar seus dados.</p></div></div>
<div class="wrap sec-p">
  <p class="storage-warn" role="status">O armazenamento local do navegador está indisponível. O portal continua funcionando, mas progresso e favoritos não serão mantidos depois que a página for fechada.</p>
  <a class="cont-card" id="cont-card" href="#" style="border:1px solid var(--line);margin-bottom:20px"><small>Continuar de onde parei</small><b></b></a>
  <div class="grid g4" id="stats" data-lessons="{esc(",".join(les_keys))}" data-secs="{esc(",".join(sec_keys))}">
    <div class="stat"><b data-st="lessons">0</b><span>lições estudadas de {len(les_keys)}</span></div>
    <div class="stat"><b data-st="secs">0</b><span>seções dos manuais estudadas de {len(sec_keys)}</span></div>
    <div class="stat"><b data-st="favs">0</b><span>favoritos</span></div>
    <div class="stat"><b data-st="quiz">0</b><span>avaliações com resultado salvo</span></div>
  </div>
  <section style="margin-top:30px"><h2 style="color:var(--accent-ink)">Progresso na trilha</h2><div class="grid g3" style="margin-top:10px">{sprog}</div></section>
  <section style="margin-top:30px"><h2 style="color:var(--accent-ink)">Marcações anteriores nos manuais</h2><div class="grid g3" style="margin-top:10px">{mprog}</div></section>
  <section style="margin-top:30px"><h2 style="color:var(--accent-ink)">Favoritos</h2>
    <p class="muted">Os favoritos salvos anteriormente continuam disponíveis. Use os atalhos abaixo para abrir os manuais.</p>
    <ul class="fav-list" id="fav-list"></ul><p class="empty" id="fav-empty">Você ainda não tem favoritos.</p></section>
  <section style="margin-top:30px"><h2 style="color:var(--accent-ink)">Seus dados</h2>
    <div class="ck-tools"><button type="button" class="btn sm" id="d-export">Exportar dados (JSON)</button>
    <label class="btn sm ghost" for="d-import" style="cursor:pointer">Importar dados</label><input id="d-import" type="file" accept="application/json,.json" class="sr-only">
    <button type="button" class="btn sm ghost" id="d-reset">Apagar progresso e favoritos</button></div>
    <p class="muted" style="font-size:.88rem">A preferência de tema (claro ou escuro) também fica neste navegador. Apagar os dados não altera os manuais.</p></section>
</div>'''
    return shell('Meu espaço', 'Progresso de estudo, favoritos e preferências salvos localmente neste navegador.',
                 body, active='meu', crumbs=[('Portal', 'index.html'), ('Meu espaço', None)], page='me', scripts=('core.js', 'pages.js'))


def page_404():
    base = __import__('os').environ.get('PPI_BASE', '/guias-prestacao-contas-ppi40/')  # caminho absoluto configurável da publicação
    body = f'''<div class="wrap sec-p" style="min-height:50vh"><h1 style="color:var(--accent-ink)">Página não encontrada</h1>
<p>O endereço pode ter mudado. Os três manuais continuam disponíveis nos mesmos links de antes.</p>
<p><a class="btn primary" href="{base}index.html">Ir para a página inicial</a></p></div>'''
    return shell('Página não encontrada', 'Página não encontrada.', body, base=base, page='404', scripts=('core.js',))
