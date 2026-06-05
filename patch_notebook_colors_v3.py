import json

notebook_path = '/Users/macintoshhd/Desktop/Intuit/intuit_fraud_risk_analysis.ipynb'
with open(notebook_path, 'r') as f:
    nb = json.load(f)

for cell in nb['cells']:
    source = "".join(cell.get('source', []))
    
    if 'register_chart("25", "shap_beeswarm"' in source:
        new_source = [
            "# ── 6.5 SHAP Explainability ───────────────────────────────────────────────\n",
            "# SHAP values are theoretically grounded (Shapley values from cooperative game theory),\n",
            "# model-agnostic, and give directional effect. They're the right tool for explaining\n",
            "# a fraud model to non-technical stakeholders.\n",
            "\n",
            "explainer = shap.TreeExplainer(xgb_best)\n",
            "shap_values = explainer.shap_values(X_test)\n",
            "\n",
            "# Beeswarm plot\n",
            "fig, ax = plt.subplots(figsize=(12, 8))\n",
            "shap.summary_plot(shap_values, X_test, feature_names=ml_features,\n",
            "                  show=False, max_display=15, plot_size=None)\n",
            "plt.title(\"SHAP Feature Importance — XGBoost\", fontsize=14, fontweight='bold')\n",
            "FEATURE_LABELS = {\n",
            "    \"cluster\": \"Behavioral Cluster\",\n",
            "    \"mcc_loss_rate_train\": \"Industry Risk Rate\",\n",
            "    \"state_loss_rate_train\": \"State Risk Rate\",\n",
            "    \"anomaly_severity\": \"Anomaly Score\",\n",
            "    \"credit_tier_ordinal\": \"Credit Tier\",\n",
            "    \"account_age_at_first_txn\": \"Account Age\",\n",
            "    \"std_txn_amt\": \"Transaction Volatility\",\n",
            "    \"chan_POS\": \"POS Channel\",\n",
            "    \"max_txn_amt\": \"Peak Transaction Size\",\n",
            "    \"channel_loss_rate_train\": \"Channel Risk Rate\",\n",
            "    \"avg_txn_amt\": \"Avg Transaction Size\",\n",
            "    \"txn_velocity\": \"Transaction Velocity\",\n",
            "    \"chan_CASH\": \"Cash Channel\",\n",
            "    \"active_span_days\": \"Active Tenure\",\n",
            "    \"total_txn_amt\": \"Total Volume\",\n",
            "}\n",
            "ax = plt.gca()\n",
            "ax.set_yticklabels([FEATURE_LABELS.get(t.get_text(), t.get_text()) for t in ax.get_yticklabels()],\n",
            "                   color=\"#E8EDF5\", fontsize=11, fontfamily=\"DejaVu Sans\")\n",
            "ax.tick_params(axis='x', colors='#8B9DC3', labelsize=10)\n",
            "ax.xaxis.label.set_color('#8B9DC3')\n",
            "ax.title.set_color('#E8EDF5')\n",
            "plt.tight_layout()\n",
            "save_chart(plt.gcf(), \"25\", \"shap_beeswarm\")\n",
            "register_chart(\"25\", \"shap_beeswarm\", \"Slide 7\", \"SHAP reveals which features drive loss predictions\")"
        ]
        cell['source'] = new_source

with open(notebook_path, 'w') as f:
    json.dump(nb, f, indent=1)

print("Notebook exactly patched.")
