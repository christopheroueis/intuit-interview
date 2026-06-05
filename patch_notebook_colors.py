import json

notebook_path = '/Users/macintoshhd/Desktop/Intuit/intuit_fraud_risk_analysis.ipynb'
with open(notebook_path, 'r') as f:
    nb = json.load(f)

for cell in nb['cells']:
    source = "".join(cell.get('source', []))
    
    if 'shap.summary_plot(shap_values' in source:
        lines = cell['source']
        new_lines = []
        for line in lines:
            if 'ax.tick_params(axis=\'y\'' in line and 'labelsize=11' in line:
                new_lines.append("ax.tick_params(axis='y', colors='#E8EDF5', labelsize=11)\n")
                continue
            new_lines.append(line)
            if 'label.set_fontfamily("IBM Plex Sans")' in line:
                new_lines.append("ax.yaxis.label.set_color('#E8EDF5')\n")
                new_lines.append("ax.tick_params(axis='x', colors='#8B9DC3', labelsize=10)\n")
        cell['source'] = new_lines

with open(notebook_path, 'w') as f:
    json.dump(nb, f, indent=1)

print("Notebook styles patched.")
