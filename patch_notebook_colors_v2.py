import json

notebook_path = '/Users/macintoshhd/Desktop/Intuit/intuit_fraud_risk_analysis.ipynb'
with open(notebook_path, 'r') as f:
    nb = json.load(f)

for cell in nb['cells']:
    source = "".join(cell.get('source', []))
    
    if 'shap.summary_plot(shap_values' in source:
        # Re-write the plotting logic in the cell, finding the right place to inject
        lines = cell['source']
        new_lines = []
        skip_mode = False
        
        for line in lines:
            if 'FEATURE_LABELS = {' in line:
                skip_mode = True
            
            if skip_mode and 'plt.tight_layout()' in line:
                skip_mode = False
            
            if not skip_mode:
                if 'plt.tight_layout()' in line:
                    # Insert the requested block right before tight_layout
                    block = """
FEATURE_LABELS = {
    "cluster": "Behavioral Cluster",
    "mcc_loss_rate_train": "Industry Risk Rate",
    "state_loss_rate_train": "State Risk Rate",
    "anomaly_severity": "Anomaly Score",
    "credit_tier_ordinal": "Credit Tier",
    "account_age_at_first_txn": "Account Age",
    "std_txn_amt": "Transaction Volatility",
    "chan_POS": "POS Channel",
    "max_txn_amt": "Peak Transaction Size",
    "channel_loss_rate_train": "Channel Risk Rate",
    "avg_txn_amt": "Avg Transaction Size",
    "txn_velocity": "Transaction Velocity",
    "chan_CASH": "Cash Channel",
    "active_span_days": "Active Tenure",
    "total_txn_amt": "Total Volume",
}
ax = plt.gca()
ax.set_yticklabels([FEATURE_LABELS.get(t.get_text(), t.get_text()) for t in ax.get_yticklabels()],
                   color="#E8EDF5", fontsize=11, fontfamily="DejaVu Sans")
ax.tick_params(axis='x', colors='#8B9DC3', labelsize=10)
ax.xaxis.label.set_color('#8B9DC3')
ax.title.set_color('#E8EDF5')
"""
                    new_lines.append(block)
                new_lines.append(line)
        
        cell['source'] = new_lines

with open(notebook_path, 'w') as f:
    json.dump(nb, f, indent=1)

print("Notebook styles patched v2.")
