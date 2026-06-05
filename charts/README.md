# Charts Index

| Chart ID | Filename | Slide | Key Insight |
|----------|----------|-------|-------------|
| 01 | 01_kpi_dashboard.png | Slide 3 | $113K total IntuitLoss on $403.6M volume = 2.8 bps |
| 02 | 02_monthly_trends_annotated.png | Slide 4 | March ($21K) and Dec ($19K) are the spike months — ARP stimulus and holiday frau |
| 03 | 03_monthly_loss_rates.png | Slide 4 | Dispute conversion rate varies widely month-to-month |
| 04 | 04_channel_heatmap.png | Slide 5 | MONEY and QBOFTU channels show dramatically higher loss rates |
| 05 | 05_channel_bar.png | Slide 5 | QBO drives the most absolute loss; MONEY/QBOFTU have highest rates |
| 06 | 06_mcc_pareto.png | Slide 5 | Top 9 MCC categories account for ~80% of all losses |
| 07 | 07_mcc_treemap.png | Slide 5 | Small-volume MCCs often have the highest loss rates |
| 08 | 08_segment_matrix.png | Slide 5 | Med-high and Medium tiers show disproportionate loss rates across channels |
| 09 | 09_geo_loss_map.png | Slide 5 | Geographic concentration of losses |
| 10 | 10_outcome_funnel.png | Slide 3 | Of 300,000 txns, 734 disputed (0.24%), 84 became IntuitLoss |
| 11 | 11_account_age_at_loss.png | Slide 5b | 19% of IntuitLoss transactions occurred within 30 days of account opening |
| 12 | 12_time_to_dispute.png | Slide 5b | Dispute timing patterns differ by outcome type |
| 13 | 13_channel_risk_shift.png | Slide 4 | H1 vs H2 chargeback rate shifts by channel |
| 14 | 14_kaplan_meier_by_channel.png | Slide 5b | Survival curves diverge by channel — some channels see chargebacks significantly |
| 15 | 15_kaplan_meier_by_credit_tier.png | Slide 5b | Log-rank test between Low and High credit tiers: p=0.3753 |
| 16 | 16_cox_hazard_ratios.png | Slide 5b | Cox PH identifies which factors significantly accelerate chargeback risk |
| 17 | 17_umap_account_embedding.png | Slide 6 | UMAP reveals natural account clusters; IntuitLoss accounts tend to cluster in sp |
| 18 | 18_clustering_selection.png | Slide 6 (appendix) | Optimal k=8 by silhouette score |
| 19 | 19_account_archetypes_umap.png | Slide 6 | Account archetypes with IntuitLoss accounts overlaid |
| 20 | 20_archetype_radar.png | Slide 6 | Radar fingerprints show distinct behavioral profiles per cluster |
| 21 | 21_isolation_forest_scores.png | Slide 6 | Top-right quadrant = high anomaly + high chargebacks = actionable risk |
| 22 | 22_dbscan_clusters.png | Slide 6 (appendix) | DBSCAN identifies 1 noise points — accounts that don't fit any behavioral patter |
| 23 | 23_precision_recall_curve.png | Slide 7 | XGBoost AUC-PR: 0.285 vs Logistic: 0.131 |
| 24 | 24_confusion_matrix.png | Slide 7 (appendix) | Optimal threshold: 0.98 |
| 25 | 25_shap_beeswarm.png | Slide 7 | SHAP reveals which features drive loss predictions |
| 26 | 26_shap_waterfall_top_risk.png | Slide 7 (appendix) | Detailed explanation of why the model flagged the riskiest account |
| 27 | 27_model_comparison.png | Slide 7 | Side-by-side comparison of all classifiers |
| 28 | 28_model_calibration.png | Slide 7 (appendix) | Model calibration check: how well does XGBoost's expected loss match actuals |
| 29 | 29_monthly_loss_series.png | Slide 8 | 12 monthly loss observations with trend slope = $0.0K/month |
| 30 | 30_trend_decomposition.png | Slide 4b | 3-month MA trend with anomaly flagging in residuals |
| 34 | 34_ensemble_forecast_HERO.png | Slide 8 | Ensemble 2022 forecast: $133K total ($11.1K/month avg) |
| 35 | 35_scenario_analysis.png | Slide 8 | Scenario range: $74K (optimistic) to $304K (pessimistic) |
| 43 | 43_daily_weekly_series.png | Slide 8 (appendix) | Daily series has 80% zeros; weekly smooths to 52 usable observations |
| 34 | 34_ensemble_forecast_HERO.png | Slide 8 | Multi-granularity ensemble: $104K for 2022 |
| 36 | 36_loss_distribution_fit.png | Slide 8b | Lognormal fit: p=0.776, Gamma fit: p=0.755 |
| 37 | 37_monte_carlo_fan.png | Slide 8b | Monte Carlo fan with P10-P90 band showing range of possible outcomes |
| 38 | 38_monte_carlo_annual_distribution.png | Slide 8b | Annual loss distribution with probability of exceeding budget thresholds |
| 39 | 39_bipartite_channel_mcc.png | Slide 9 | Network reveals which channel-MCC pathways concentrate chargeback risk |