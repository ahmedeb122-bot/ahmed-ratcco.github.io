"""Builds the supplier directory from the parts in this folder.

  python3 suppliers-dev/build.py

- puts app.js (the public page script) into ../suppliers/index.html
- puts shared.js (sections + duplicate check) into index.html, admin.html and the Google script
- writes the Google script to suppliers-dev/out/:
    Code.public.gs  real site link + sheet id, passwords left as __PW1__.. (safe to share)
    Code.test.gs    for the local fake backend (tests/fakegas.js), passwords pass1..pass3
The real passwords are never stored in the repo. When deploying, the passwords already
inside the live Apps Script project are carried over (see PROJECT_BRIEF.md, "Deploy").
The sheet id comes from suppliers-dev/local.json ({"sheet_id": "..."}) which is not committed.
"""
import json, os, re

DEV = os.path.dirname(os.path.abspath(__file__))
SITE_DIR = os.path.join(os.path.dirname(DEV), 'suppliers')
OUT = os.path.join(DEV, 'out')
os.makedirs(OUT, exist_ok=True)

SITE = 'https://ahmedeb122-bot.github.io/ahmed-ratcco.github.io/suppliers/'
local = os.path.join(DEV, 'local.json')
SHEET = json.load(open(local))['sheet_id'] if os.path.exists(local) else '__SHEET_ID__'

shared = open(os.path.join(DEV, 'shared.js')).read()
tpl = open(os.path.join(DEV, 'Code.tpl.gs')).read().replace('//@@SHARED@@', shared)


def fill(s, site, sheet, pws):
    s = s.replace('__SITE_URL__', site).replace('__SHEET_ID__', sheet)
    for i, p in enumerate(pws, 1):
        s = s.replace(f'__PW{i}__', p)
    return s


open(os.path.join(OUT, 'Code.public.gs'), 'w').write(fill(tpl, SITE, SHEET, ['__PW1__', '__PW2__', '__PW3__']))
open(os.path.join(OUT, 'Code.test.gs'), 'w').write(fill(tpl, 'http://localhost:8765/', 'TEST', ['pass1', 'pass2', 'pass3']))

# the public page script lives in app.js
p = os.path.join(SITE_DIR, 'index.html')
s = open(p).read()
i = s.index('<script>\n(() => {')
j = s.rindex('</script>')
open(p, 'w').write(s[:i] + '<script>\n' + open(os.path.join(DEV, 'app.js')).read().rstrip() + '\n\n' + s[j:])

for page in ['index.html', 'admin.html']:
    p = os.path.join(SITE_DIR, page)
    s = open(p).read()
    if '/*@@SHARED*/' in s:
        s = re.sub(r'/\*@@SHARED\*/.*?/\*@@END\*/', lambda m: '/*@@SHARED*/\n' + shared + '\n/*@@END*/', s, flags=re.S)
        open(p, 'w').write(s)
print('built ->', OUT)
