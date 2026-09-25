"""
Gera index.html a partir de checklist_template.html,
substituindo __BELCITO_B64__, __SHOPEE_B64__, __ALCON_B64__
com os valores de logos.b64.json.
Uso: python build.py
"""
import json, sys

with open('logos.b64.json', 'r') as f:
    logos = json.load(f)

with open('checklist_template.html', 'r', encoding='utf-8') as f:
    template = f.read()

replacements = {
    '__BELCITO_B64__': logos.get('belcito', ''),
    '__SHOPEE_B64__':  logos.get('shopee',  ''),
    '__ALCON_B64__':   logos.get('alcon',   ''),
}

for placeholder, b64 in replacements.items():
    if not b64:
        print(f"AVISO: {placeholder} ausente em logos.b64.json")
    template = template.replace(placeholder, b64)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(template)

remaining = [p for p in replacements if p in template]
if remaining:
    print(f"AVISO: placeholders ainda presentes: {remaining}")
else:
    print("index.html gerado com sucesso.")
