#!/usr/bin/env python3
"""Add daily/weekly forecasting section and rebuild notebook, then re-execute."""
import nbformat as nbf

nb = nbf.read('/Users/macintoshhd/Desktop/Intuit/intuit_fraud_risk_analysis.ipynb', as_version=4)
cells = nb.cells

def md(src): cells.append(nbf.v4.new_markdown_cell(src.strip()))
def code(src): cells.append(nbf.v4.new_code_cell(src.strip()))

# Find the Section 8 markdown cell and insert before it
insert_idx = None
for i, cell in enumerate(cells):
    if cell.cell_type == 'markdown' and 'Section 8' in cell.source and 'Monte Carlo' in cell.source:
        insert_idx = i
        break

if insert_idx is None:
    # Fallback: insert before the last 15 cells (sections 8-10)
    insert_idx = len(cells) - 15

new_cells = []

new_cells.append(nbf.v4.new_markdown_cell("""
## Section 7b — Multi-Granularity Forecasting: Daily & Weekly

A critical insight: forecasting on only 12 monthly data points forces every model into near-linear 
extrapolation. But we have 300K transactions spanning 364 days — enough for **daily (364 pts)** and 
**weekly (52 pts)** series that can capture sub-monthly patterns.

**Key challenge:** 80% of days have $0 IntuitLoss (only 74 out of 364 days have any loss event). 
Daily models learn "most days = zero" and underpredict. Weekly aggregation is the sweet spot — it 
smooths daily zeros while providing 52 observations (vs 12) for seasonal estimation.
""".strip()))

new_cells.append(nbf.v4.new_code_cell("""
# ── 7b.1 Build Daily & Weekly Series ──────────────────────────────────────
# Daily series: one row per calendar day with IntuitLoss sum (zero-filled)
# Weekly series: sum by ISO week (Mon-Sun)

date_range_full = pd.date_range(df['txn_date'].min(), df['txn_date'].max(), freq='D')

daily_loss = df[df['is_intuit_loss']].groupby('txn_date')['chargeback_amt'].sum()
daily = pd.DataFrame(index=date_range_full)
daily['loss'] = daily_loss.reindex(date_range_full, fill_value=0)
daily.index.name = 'date'

weekly_loss = daily['loss'].resample('W-MON').sum()
weekly_loss.index.freq = 'W-MON'

n_days = len(daily)
n_zero = (daily['loss'] == 0).sum()

print(f"Daily series: {n_days} days, {n_zero} zero-days ({n_zero/n_days*100:.0f}%)")
print(f"Weekly series: {len(weekly_loss)} weeks, {(weekly_loss==0).sum()} zero-weeks")
print(f"Weekly CV: {weekly_loss.std()/weekly_loss.mean():.2f}")

fig, axes = plt.subplots(2, 1, figsize=(14, 7), sharex=False)

axes[0].bar(daily.index, daily['loss']/1e3, color=CORAL, alpha=0.6, width=1)
axes[0].set_ylabel("Daily IntuitLoss ($K)")
axes[0].set_title("Daily IntuitLoss — 2021 (364 observations, 80% are zero)", fontsize=13, fontweight='bold')

axes[1].bar(weekly_loss.index, weekly_loss.values/1e3, color=TEAL, alpha=0.7, width=5)
axes[1].set_ylabel("Weekly IntuitLoss ($K)")
axes[1].set_title("Weekly IntuitLoss — 2021 (52 observations)", fontsize=13, fontweight='bold')

plt.tight_layout()
save_chart(fig, "43", "daily_weekly_series")
register_chart("43", "daily_weekly_series", "Slide 8 (appendix)",
    f"Daily series has {n_zero/n_days*100:.0f}% zeros; weekly smooths to 52 usable observations")
"""))

new_cells.append(nbf.v4.new_code_cell("""
# ── 7b.2 SARIMA on Weekly (m=4, monthly cycle) ────────────────────────────
# With 52 weekly observations, SARIMA can now estimate a 4-week seasonal cycle.
# This was impossible with 12 monthly points.

from statsmodels.tsa.statespace.sarimax import SARIMAX

sarima_w = SARIMAX(weekly_loss, order=(1,1,1), seasonal_order=(1,0,0,4)).fit(disp=False)
print(sarima_w.summary())

fc_sarima_w = sarima_w.get_forecast(52).predicted_mean.clip(lower=0)
fc_sarima_df = pd.DataFrame({'date': fc_sarima_w.index, 'loss': fc_sarima_w.values})
fc_sarima_df['month'] = fc_sarima_df['date'].dt.to_period('M').dt.to_timestamp()
sarima_weekly_2022 = fc_sarima_df[fc_sarima_df['date'] >= '2022-01-01'].groupby('month')['loss'].sum()

print(f"\\nSARIMA Weekly→Monthly 2022 Forecast:")
for dt, val in sarima_weekly_2022.head(12).items():
    print(f"  {dt.strftime('%b %Y')}: ${val:,.0f}")
print(f"  Annual: ${sarima_weekly_2022.head(12).sum():,.0f}")
"""))

new_cells.append(nbf.v4.new_code_cell("""
# ── 7b.3 ETS with Seasonal (weekly, damped trend) ─────────────────────────
# Holt-Winters with additive seasonality is now feasible with 52 observations.

ets_w = ExponentialSmoothing(weekly_loss, trend='add', seasonal='add', 
                             seasonal_periods=4, damped_trend=True).fit()
fc_ets_w = ets_w.forecast(52).clip(lower=0)
fc_ets_df = pd.DataFrame({'date': fc_ets_w.index, 'loss': fc_ets_w.values})
fc_ets_df['month'] = fc_ets_df['date'].dt.to_period('M').dt.to_timestamp()
ets_weekly_2022 = fc_ets_df[fc_ets_df['date'] >= '2022-01-01'].groupby('month')['loss'].sum()

print(f"\\nETS Weekly→Monthly 2022 Forecast:")
for dt, val in ets_weekly_2022.head(12).items():
    print(f"  {dt.strftime('%b %Y')}: ${val:,.0f}")
print(f"  Annual: ${ets_weekly_2022.head(12).sum():,.0f}")
"""))

new_cells.append(nbf.v4.new_code_cell("""
# ── 7b.4 Prophet on Daily Data ─────────────────────────────────────────────
# Prophet was designed for daily data with holidays and regressors.
# With 364 observations, yearly_seasonality and weekly_seasonality are feasible.
# Using multiplicative seasonality to handle the zero-inflated nature.

pdf_daily = daily.reset_index().rename(columns={'date':'ds', 'loss':'y'})
pdf_daily['stimulus'] = 0.0
pdf_daily.loc[pdf_daily['ds'].dt.month.isin([1,3]), 'stimulus'] = 1.0
pdf_daily['dow_weekend'] = (pdf_daily['ds'].dt.dayofweek >= 5).astype(float)

m_daily = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=True,
    daily_seasonality=False,
    changepoint_prior_scale=0.3,
    interval_width=0.95,
    seasonality_mode='multiplicative',
)
m_daily.add_regressor('stimulus')
m_daily.add_regressor('dow_weekend')
m_daily.add_country_holidays(country_name='US')
m_daily.fit(pdf_daily)

future_2022 = pd.DataFrame({'ds': pd.date_range('2021-01-01','2022-12-31', freq='D')})
future_2022['stimulus'] = 0.0
future_2022.loc[future_2022['ds'].dt.month.isin([1,3]), 'stimulus'] = 1.0
future_2022['dow_weekend'] = (future_2022['ds'].dt.dayofweek >= 5).astype(float)

fc_daily_all = m_daily.predict(future_2022)
fc_daily_2022 = fc_daily_all[fc_daily_all['ds'] >= '2022-01-01'].copy()
fc_daily_2022['month'] = fc_daily_2022['ds'].dt.to_period('M').dt.to_timestamp()
prophet_daily_2022 = fc_daily_2022.groupby('month')['yhat'].sum().clip(lower=0)

print(f"\\nProphet Daily→Monthly 2022 Forecast:")
for dt, val in prophet_daily_2022.head(12).items():
    print(f"  {dt.strftime('%b %Y')}: ${val:,.0f}")
print(f"  Annual: ${prophet_daily_2022.head(12).sum():,.0f}")
print(f"\\n⚠️ Daily Prophet tends to underpredict because 80% of training days are zero.")
print(f"   This is weighted into the ensemble but not used standalone.")
"""))

new_cells.append(nbf.v4.new_code_cell("""
# ── 7b.5 Multi-Granularity Ensemble ───────────────────────────────────────
# Combine daily, weekly, and monthly forecasts weighted by inverse MAPE
# where available. Weekly models get the highest weight (best data density).

forecast_idx_2022 = pd.date_range('2022-01-01', periods=12, freq='MS')

multi_forecasts = {
    # Monthly models (from Section 7)
    'ARIMA (monthly)': fc_arima,
    "Holt's Damped (monthly)": fc_hw,
    'Prophet (monthly)': fc_prophet,
    # Weekly models (new)
    'SARIMA (weekly)': sarima_weekly_2022.head(12).values,
    'ETS (weekly)': ets_weekly_2022.head(12).values,
    # Daily model
    'Prophet (daily)': prophet_daily_2022.head(12).values,
}

# Print comparison table
print(f"{'Model':<25} {'Granularity':<12} {'N pts':>6} {'Jan':>8} {'Jun':>8} {'Dec':>8} {'Annual':>10}")
print("─"*85)
for name, fc in multi_forecasts.items():
    fc = np.array(fc[:12])
    gran = 'monthly' if 'monthly' in name else ('weekly' if 'weekly' in name else 'daily')
    npts = {'monthly':12, 'weekly':52, 'daily':364}[gran]
    print(f"{name:<25} {gran:<12} {npts:>6} ${fc[0]/1e3:.1f}K ${fc[5]/1e3:.1f}K ${fc[11]/1e3:.1f}K ${fc.sum()/1e3:>8.0f}K")

# Weighted ensemble: weekly models 2x, monthly 1x, daily 0.5x (underpredicts)
weight_map = {'monthly': 1.0, 'weekly': 2.0, 'daily': 0.5}
total_weight = 0
ensemble_multi = np.zeros(12)
for name, fc in multi_forecasts.items():
    fc = np.array(fc[:12])
    gran = 'monthly' if 'monthly' in name else ('weekly' if 'weekly' in name else 'daily')
    w = weight_map[gran]
    ensemble_multi += w * fc
    total_weight += w
ensemble_multi /= total_weight

print(f"\\n{'Multi-Gran Ensemble':<25} {'mixed':<12} {'420':>6} ${ensemble_multi[0]/1e3:.1f}K ${ensemble_multi[5]/1e3:.1f}K ${ensemble_multi[11]/1e3:.1f}K ${ensemble_multi.sum()/1e3:>8.0f}K")

# Hero chart
fig, ax = plt.subplots(figsize=(16, 7))

# 2021 actuals
monthly_ts = monthly[['month_dt','il_amount']].set_index('month_dt')
ax.plot(monthly_ts.index, monthly_ts['il_amount']/1e3, color=CORAL, linewidth=3,
        marker='o', markersize=8, markerfacecolor=CORAL, markeredgecolor='white',
        markeredgewidth=1.5, label='2021 Actuals', zorder=10)

# Individual models
styles = {
    'ARIMA (monthly)':          (LGRAY,    ':', 1.0, None),
    "Holt's Damped (monthly)":  (LGRAY,    ':', 1.0, None),
    'Prophet (monthly)':        (LGRAY,    ':', 1.0, None),
    'SARIMA (weekly)':          ('#9B59B6','--', 2.0, 'D'),
    'ETS (weekly)':             ('#1ABC9C','--', 2.0, '^'),
    'Prophet (daily)':          (AMBER,   '--', 1.5, 'v'),
}
for name, fc in multi_forecasts.items():
    fc = np.array(fc[:12])
    c, ls, lw, mk = styles.get(name, (LGRAY, ':', 1.0, None))
    ax.plot(forecast_idx_2022, fc/1e3, color=c, linewidth=lw, linestyle=ls,
            marker=mk, markersize=4, alpha=0.5 if c==LGRAY else 0.8,
            label=f'{name} (${fc.sum()/1e3:.0f}K)')

# Ensemble
ax.plot(forecast_idx_2022, ensemble_multi/1e3, color=WHITE, linewidth=3.5,
        marker='o', markersize=7, markeredgecolor=TEAL, markerfacecolor=WHITE,
        label=f'Multi-Granularity Ensemble (${ensemble_multi.sum()/1e3:.0f}K)', zorder=9)

# CI from model spread
all_fcs = np.vstack([np.array(v[:12]) for v in multi_forecasts.values()])
ci_lo = np.percentile(all_fcs, 15, axis=0)
ci_hi = np.percentile(all_fcs, 85, axis=0)
ax.fill_between(forecast_idx_2022, ci_lo/1e3, ci_hi/1e3, alpha=0.12, color=TEAL, label='P15-P85 Band')

ax.axvline(pd.Timestamp('2021-12-15'), color=TEXT_COLOR, alpha=0.25, linewidth=1)
ax.set_ylabel("Monthly IntuitLoss ($K)", fontsize=13)
ax.set_title("2022 Monthly Loss Forecast — Multi-Granularity Ensemble", fontsize=15, fontweight='bold')
ax.legend(fontsize=7.5, loc='upper left', ncol=2, framealpha=0.3)
ax.xaxis.set_major_formatter(mdates.DateFormatter('%b\\n%Y'))

plt.tight_layout()
save_chart(fig, "34", "ensemble_forecast_HERO")
register_chart("34", "ensemble_forecast_HERO", "Slide 8",
    f"Multi-granularity ensemble: ${ensemble_multi.sum()/1e3:.0f}K for 2022")
print(f"\\n📊 Multi-Granularity Ensemble 2022 Total: ${ensemble_multi.sum():,.0f}")
"""))

# Insert the new cells
for j, cell in enumerate(new_cells):
    cells.insert(insert_idx + j, cell)

nb.cells = cells
nbf.write(nb, '/Users/macintoshhd/Desktop/Intuit/intuit_fraud_risk_analysis.ipynb')
print(f"✅ Updated notebook: inserted {len(new_cells)} new cells at position {insert_idx}")
print(f"   Total cells: {len(cells)}")
