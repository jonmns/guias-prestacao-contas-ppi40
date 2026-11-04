# -*- coding: utf-8 -*-
"""Gera o portal: python3 tools/build.py  (idempotente)."""
import html as H
import json
import os
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from manuals import (MANUALS, ORDER, ROOT, CATS, CAT_BY_SEC, SUBJECTS, SEC_RE, clean, strip_b64, survey, text_of,
                     norm, slug, sec_id, reading_minutes)
import content as C
from trilhas import STAGES
import pages as P

LESSON_OF = {}
for st in STAGES:
    for l in st['lessons']:
        for r in l['refs']:
            LESSON_OF.setdefault(r.split(':')[0], (st['id'], l['id'], l['title']))

REL = {}
for a, b in C.RELATED_PAIRS:
    REL.setdefault(a, []).append(b)
    REL.setdefault(b, []).append(a)


def add_ids(inner, sid, used):
    def fn(m):
        tag, attrs, body = m.group(1), m.group(2) or '', m.group(3)
        if 'id="' in attrs:
            return m.group(0)
        base = f'{sid}-{slug(text_of(body))}'
        i, new = 2, base
        while new in used:
            new = f'{base}-{i}'
            i += 1
        used.add(new)
        return f'<{tag}{attrs} id="{new}">{body}</{tag}>'
    return re.sub(r'<(h[34])(\s[^>]*)?>(.*?)</\1>', fn, inner, flags=re.S)


def patch(key, allsec):
    meta = MANUALS[key]
    path = ROOT / meta['file']
    src = clean(path.read_text('utf-8'))
    secs = allsec[key]
    used = set(re.findall(r'\bid="([^"]+)"', strip_b64(src)))
    # Manuais especializados mantêm sua própria interface e namespace.
    # Somente âncoras estáveis são adicionadas para o índice global.
    def enrich(m):
        sid = sec_id(m.group(1))
        return '<section' + m.group(1) + '>' + add_ids(m.group(2), sid, used) + '</section>'
    src = SEC_RE.sub(enrich, src)
    path.write_text(src, 'utf-8')


def extract(key, secs):
    src = clean(strip_b64(( ROOT / MANUALS[key]['file']).read_text('utf-8')))
    heads, items = [], []
    for m in SEC_RE.finditer(src):
        sid = sec_id(m.group(1))
        s = next(x for x in secs if x['id'] == sid)
        inner = m.group(2)
        hs = list(re.finditer(r'<(h[234])\b([^>]*)>(.*?)</\1>', inner, re.S))
        parent = ''
        for i, h in enumerate(hs):
            idm = re.search(r'id="([^"]+)"', h.group(2))
            anchor = idm.group(1) if idm else sid
            title = text_of(h.group(3))
            if h.group(1) == 'h2':
                title = s['title']
            heads.append((sid, anchor, title))
            end = hs[i + 1].start() if i + 1 < len(hs) else len(inner)
            txt = text_of(inner[h.end():end])
            if h.group(1) == 'h3':
                parent = title
            path = (f'{s["num"]} · ' if s['num'] else '') + s['title'] + (f' › {parent}' if h.group(1) == 'h4' and parent else '')
            blob = norm(title + ' ' + txt)
            tags = [k for k, (n, rx) in enumerate(SUBJECTS)
                    if re.search(rx, norm(title)) or len(re.findall(rx, blob)) >= 2]
            items.append(dict(m=key, s=sid, t=title, p=path, c=CAT_BY_SEC[key][sid], g=tags, x=txt[:6000],
                              u=f'guias/{os.path.basename(MANUALS[key]["file"])}#{anchor}'))
    return heads, items


def fechamento_groups(path):
    src = clean(strip_b64(path.read_text('utf-8')))
    sec = re.search(r'<section\b[^>]*\bid="checklist"[^>]*>(.*?)</section>', src, re.S).group(1)
    out = []
    for fs in re.finditer(r'<fieldset><legend>(.*?)</legend>(.*?)</fieldset>', sec, re.S):
        its = [(m.group(1), text_of(m.group(2)), None) for m in re.finditer(r'<input type="checkbox" id="(ck\d+)"><span>(.*?)</span>', fs.group(2), re.S)]
        out.append((text_of(fs.group(1)), its))
    return out


def main():
    allsec = {k: survey((ROOT / MANUALS[k]['file']).read_text('utf-8')) for k in ORDER}
    for k in ORDER:
        patch(k, allsec)
    allsec = {k: survey((ROOT / MANUALS[k]['file']).read_text('utf-8')) for k in ORDER}
    heads, items = {}, []
    for k in ORDER:
        heads[k], it = extract(k, allsec[k])
        items += it
    words = {k: sum(s['words'] for s in allsec[k]) for k in ORDER}
    ctx = P.Ctx(allsec, heads, words)

    # itens do portal na busca
    for st in STAGES:
        for l in st['lessons']:
            x = text_of(l['body']) + ' ' + ' '.join(l['goals'])
            items.append(dict(m='portal', s=l['id'], t=l['title'], p=f'Etapa {st["n"]} › Lição', c=7, g=[],
                              x=x[:6000], u=f'aprender/{st["id"]}.html#{l["id"]}'))
    for t, d, src in C.GLOSSARY:
        items.append(dict(m='portal', s='gl', t=t, p='Glossário', c=7, g=[], x=d, u=f'glossario.html#t-{slug(t)}'))
    for c in C.CHECKLISTS:
        items.append(dict(m='portal', s=c['id'], t=f'Checklist: {c["title"]}', p='Checklists', c=5, g=[],
                          x=c['sub'], u=f'checklists.html#{c["id"]}'))
    # As aulas normativas também participam da busca global.
    import subprocess
    items += json.loads(subprocess.check_output(['node', str(ROOT / 'tools/index-pdi.cjs')], encoding='utf-8'))
    idx = dict(version=1, manuals={k: dict(title=MANUALS[k]['title'], short=MANUALS[k]['short']) for k in ORDER},
               cats=CATS, subjects=[n for n, _ in SUBJECTS], items=items)
    (ROOT / 'assets' / 'search-index.js').write_text(
        'window.PPI_INDEX=' + json.dumps(idx, ensure_ascii=False, separators=(',', ':')) + ';', 'utf-8')

    w = lambda name, html: (ROOT / name).write_text(html, 'utf-8')
    w('index.html', P.page_index(ctx))
    w('aprender.html', P.page_aprender(ctx))
    for i, st in enumerate(STAGES):
        w(f'aprender/{st["id"]}.html', P.page_stage(ctx, st, i))
    w('consultar.html', P.page_consultar(ctx))
    w('checklists.html', P.page_checklists(ctx, fechamento_groups(ROOT / MANUALS['ferramentas']['file'])))
    w('glossario.html', P.page_glossario(ctx))
    w('meu-espaco.html', P.page_meu(ctx))
    w('404.html', P.page_404())
    # Integração do painel completo deve persistir ao regenerar.
    page = ROOT / 'meu-espaco.html'
    text = page.read_text('utf-8').replace('</head>', '<link rel="stylesheet" href="assets/integration.css"></head>')
    text = text.replace('</body>', '<script src="assets/integration.js" defer></script></body>')
    page.write_text(text, 'utf-8')
    print('itens de busca:', len(items), '| seções:', {k: len(v) for k, v in allsec.items()})


if __name__ == '__main__':
    main()

