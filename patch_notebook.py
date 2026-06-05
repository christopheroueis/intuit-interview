import json

notebook_path = '/Users/macintoshhd/Desktop/Intuit/intuit_fraud_risk_analysis.ipynb'
with open(notebook_path, 'r') as f:
    nb = json.load(f)

for cell in nb['cells']:
    source = "".join(cell.get('source', []))
    
    if 'ml_features = [' in source:
        new_source = []
        for line in cell['source']:
            if '"cluster"' in line:
                line = line.replace('"cluster",', '')
                line = line.replace(', "cluster"', '')
                line = line.replace('"cluster"', '')
            new_source.append(line)
        # Add comment
        new_source.insert(0, '# Removed \"cluster\" to prevent target leakage, as it was built using loss history.\n')
        cell['source'] = new_source
        
    if 'shap.summary_plot(shap_values' in source:
        # We need to insert the mapping and ax.set_yticklabels before save_chart
        lines = cell['source']
        new_lines = []
        for line in lines:
            new_lines.append(line)
            if 'shap.summary_plot' in line:
                pass
            if 'plt.tight_layout()' in line:
                # Insert the label mapping logic before tight_layout
                mapping_code = """
FEATURE_LABELS = {
    "cluster": "Behavioral Cluster",
    "mcc_loss_rate_train": "Industry Risk Rate",
    "state_loss_rate_train": "State Risk Rate",
    "anomaly_severity": "Anomaly Score",
    "credit_tier_ordinal": "Credit Tier",
    "account_age_at_first_txn": "Account Age",
    "std_txn_amt": "Transaction Volatility",
    "chan_POS": "POS Channel",
    "channel_loss_rate_train": "Channel Risk Rate",
    "avg_txn_amt": "Avg Transaction Size",
    "txn_velocity": "Transaction Velocity",
    "chan_CASH": "Cash Channel",
    "active_span_days": "Active Tenure",
    "total_txn_amt": "Total Volume",
    "max_txn_amt": "Peak Transaction Size",
}
ax.set_yticklabels([FEATURE_LABELS.get(l.get_text(), l.get_text()) for l in ax.get_yticklabels()])
ax.tick_params(axis='y', labelsize=11)
for label in ax.get_yticklabels():
    label.set_fontfamily("IBM Plex Sans")
"""
                new_lines.insert(-1, mapping_code)

        cell['source'] = new_lines

with open(notebook_path, 'w') as f:
    json.dump(nb, f, indent=1)

print("Notebook patched.")
