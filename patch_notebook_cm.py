import json

notebook_path = '/Users/macintoshhd/Desktop/Intuit/intuit_fraud_risk_analysis.ipynb'
with open(notebook_path, 'r') as f:
    nb = json.load(f)

for cell in nb['cells']:
    source = "".join(cell.get('source', []))
    
    if '"model_metrics": {' in source and 'top_waterfall_feature' in source:
        lines = cell['source']
        new_lines = []
        for line in lines:
            new_lines.append(line)
            if '"top_waterfall_feature": top_waterfall_feature,' in line:
                new_lines.append('        "cm_tn": int(cm[0,0]),\n')
                new_lines.append('        "cm_fp": int(cm[0,1]),\n')
                new_lines.append('        "cm_fn": int(cm[1,0]),\n')
                new_lines.append('        "cm_tp": int(cm[1,1]),\n')
                new_lines.append('        "avg_loss_per_event": float(df[df[\'is_intuit_loss\']][\'chargeback_amt\'].sum() / df[\'is_intuit_loss\'].sum()),\n')
        cell['source'] = new_lines

with open(notebook_path, 'w') as f:
    json.dump(nb, f, indent=1)

print("Notebook patched with CM metrics.")
