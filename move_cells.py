import json
notebook_path = '/Users/macintoshhd/Desktop/Intuit/intuit_fraud_risk_analysis.ipynb'
with open(notebook_path, 'r') as f:
    nb = json.load(f)

s7b_start = None
s7_start = None
s8_start = None

for i, c in enumerate(nb['cells']):
    source = "".join(c.get('source', []))
    if '## Section 7b' in source:
        s7b_start = i
    if '## Section 7 —' in source:
        s7_start = i

if s7b_start is not None and s7_start is not None and s7b_start < s7_start:
    s7b_cells = nb['cells'][s7b_start:s7_start]
    del nb['cells'][s7b_start:s7_start]
    
    for i, c in enumerate(nb['cells']):
         if '## Section 8' in "".join(c.get('source', [])):
             s8_start = i
             break
    
    if s8_start is not None:
        nb['cells'][s8_start:s8_start] = s7b_cells
        with open(notebook_path, 'w') as f:
            json.dump(nb, f, indent=1)
        print("Cells moved!")
    else:
        print("Section 8 not found.")
else:
    print("Cells not moved. Already out of order or not found.")
