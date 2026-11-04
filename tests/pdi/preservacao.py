#!/usr/bin/env python3
"""Regressão de conteúdo: tudo que existia na página original deve existir na nova.
Uso: python3 tests/pdi/preservacao.py [original.html] [nova.html]
Padrão: guias/legado/base-normativa-pdi-v1.html contra guias/base-normativa-pdi.html"""
import sys, re
from html.parser import HTMLParser

class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.hrefs=[]; s.text=[]; s.ids=[]; s.skip=0
    def handle_starttag(s, tag, a):
        d=dict(a)
        if tag=='a' and d.get('href'): s.hrefs.append(d['href'])
        if d.get('id'): s.ids.append(d['id'])
        if tag in ('script','style'): s.skip+=1
    def handle_endtag(s, tag):
        if tag in ('script','style') and s.skip: s.skip-=1
    def handle_data(s, t):
        if not s.skip and t.strip(): s.text.append(t.strip())

def load(p):
    x=P(); x.feed(open(p,encoding='utf-8').read()); return x

orig = sys.argv[1] if len(sys.argv)>1 else 'guias/legado/base-normativa-pdi-v1.html'
new  = sys.argv[2] if len(sys.argv)>2 else 'guias/base-normativa-pdi.html'
a, b = load(orig), load(new)
fail = 0

# links externos oficiais: nenhum pode sumir
ext = lambda hs: {h for h in hs if h.startswith('http')}
miss = ext(a.hrefs) - ext(b.hrefs)
print(f'links externos originais: {len(ext(a.hrefs))} | na nova: {len(ext(b.hrefs))} | ausentes: {len(miss)}')
for m in sorted(miss): print('  AUSENTE', m); fail += 1

# âncoras internas (#id) e ids de seção
miss_ids = set(a.ids) - set(b.ids)
# ids do mecanismo mobile antigo foram substituídos conscientemente
legacy_ui = {'mbar','mbar-menu','mbar-title','mbar-theme','mdrawer','mdrawer-list','mdrawer-x','mlb','mlb-t','mlb-x','mlb-i'}
miss_ids -= legacy_ui
print(f'ids originais ausentes: {sorted(miss_ids)}')
fail += len(miss_ids)
for h in set(a.hrefs):
    if h.startswith('#') and len(h)>1 and h[1:] not in set(b.ids): print('  ÂNCORA QUEBRADA', h); fail += 1

# texto: cada bloco de texto original precisa aparecer no novo (ignora UI antiga substituída)
norm = lambda t: re.sub(r'\s+',' ',t).strip()
bt = norm(' '.join(b.text))
ui_antiga = {'Base Normativa PD&I (versão anterior, arquivada)','Sumário','Fechar','Página inicial','Voltar à página inicial dos manuais','Alternar entre modo claro e escuro','Modo escuro','Imagem','← Voltar à página inicial dos manuais'}
lost=[t for t in a.text if norm(t) not in ui_antiga and norm(t) not in bt]
print(f'blocos de texto originais: {len(a.text)} | perdidos: {len(lost)}')
for t in lost[:25]: print('  PERDIDO:', t[:120]); 
fail += len(lost)
sys.exit(1 if fail else 0)
