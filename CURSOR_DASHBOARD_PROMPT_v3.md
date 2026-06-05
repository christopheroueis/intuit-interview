# Cursor Prompt — Intuit QuickBooks Payments Fraud & Risk Executive Dashboard (v3)

---

## ROLE & MISSION

You are a senior fintech product engineer and data visualization designer who has shipped
dashboards for Bloomberg Terminal, Goldman Sachs internal risk systems, and Stripe's
executive intelligence layer. You do not build generic dashboards. You build instruments —
dense, precise, information-rich interfaces where every pixel earns its place.

Your task is to build a **single-file Plotly Dash application** (`app.py`) that presents a
completed fraud and risk analysis of Intuit QuickBooks Payments 2021 transaction data to a
cross-functional executive team spanning Product, Risk, Finance, Accounting, and Commercial.
This dashboard will be screen-shared live on Zoom during a senior leadership presentation.

**The fundamental design principle of this application is narrative.** This is not a data
explorer. It is a story told in data — with a beginning, a middle, and an end. Every section
answers one specific question in a sequence that builds understanding and drives toward a
decision. The audience should feel like they are being guided through a curated briefing,
not left to wander through charts.

The story arc is:
> *"Here is the scale of the problem. Here is when and why it spiked. Here is where it
> lives geographically. Here is who is causing it. Here is what the data predicts before
> a loss happens. Here is what 2022 looks like. Here is what we do about it."*

Each section is one chapter of that story. Navigation is sequential by default — linear
like a slide deck — but every section is also accessible directly for drill-down during Q&A.

**Non-negotiable benchmark:** Bloomberg Terminal meets Stripe's internal analytics — dense
information architecture, institutional-grade typography, surgical use of color as signal,
and micro-interactions that feel engineered not decorated. If it looks like a Kaggle notebook
output, start over.

---

## KNOWN DATA & RESULTS (from executed analysis notebook)

All data is pre-computed and loaded from `results.json`. Do not recompute anything.
The following real values are known and must be used throughout — not placeholders:

```
Total Transactions:     300,000
Analysis Period:        Jan 1 – Dec 30, 2021
Total Txn Volume:       $403.6M
Total Chargebacks:      $585K across 734 disputed transactions
Total IntuitLoss:       $112,734 across 84 loss transactions
Overall Loss Rate:      2.8 bps
Total Accounts:         189,826
Accounts with Loss:     81
MONEY channel rate:     454 bps (highest — 162× overall average)
2022 Forecast Total:    $132,905 (ensemble base case)
Monte Carlo P10:        $81,650  /  P50: $113,918  /  P90: $161,645
XGBoost AUC-PR:         0.285 (best model)
```

**Chart files available** (all at `charts/` relative to `app.py`):
`01_kpi_dashboard`, `02_monthly_trends_annotated`, `03_monthly_loss_rates`,
`04_channel_heatmap`, `05_channel_bar`, `06_mcc_pareto`, `07_mcc_treemap`,
`08_segment_matrix`, `09_geo_loss_map`, `10_outcome_funnel`, `11_account_age_at_loss`,
`12_time_to_dispute`, `13_channel_risk_shift`, `14_kaplan_meier_by_channel`,
`15_kaplan_meier_by_credit_tier`, `16_cox_hazard_ratios`, `17_umap_account_embedding`,
`18_clustering_selection`, `19_account_archetypes_umap`, `20_archetype_radar`,
`21_isolation_forest_scores`, `22_dbscan_clusters`, `23_precision_recall_curve`,
`24_confusion_matrix`, `25_shap_beeswarm`, `26_shap_waterfall_top_risk`,
`27_model_comparison`, `28_model_calibration`, `29_monthly_loss_series`,
`30_trend_decomposition`, `33_prophet_components`, `34_ensemble_forecast_HERO`,
`35_scenario_analysis`, `36_loss_distribution_fit`, `37_monte_carlo_fan`,
`38_monte_carlo_annual_distribution`, `39_bipartite_channel_mcc`

---

## DESIGN SYSTEM

### Color Palette (strict — never deviate)

```python
NAVY        = "#0A0E1A"   # primary background
PANEL       = "#0F1524"   # card/panel background
BORDER      = "#1C2537"   # panel borders
MUTED       = "#1E2D45"   # muted fills, hover states
TEAL        = "#0077C5"   # Intuit primary — main data ink
TEAL_LIGHT  = "#00A3E0"   # highlights, hover accents
CORAL       = "#E5461B"   # loss / risk / negative signal
CORAL_LIGHT = "#FF6B47"   # hover state on coral elements
AMBER       = "#F4A01C"   # warning / medium risk
GREEN       = "#00C48C"   # positive / safe / declining risk
WHITE       = "#E8EDF5"   # primary text
GRAY_1      = "#8B9DC3"   # secondary text, axis labels
GRAY_2      = "#4A5568"   # tertiary text, gridlines
INVISIBLE   = "rgba(0,0,0,0)"

# Geospatial color scale — always use this for choropleth/bubble maps
GEO_SCALE   = [[0.0, "#0A0E1A"], [0.2, "#0D2137"], [0.4, "#0F3D6E"],
               [0.6, "#0077C5"], [0.8, "#F4A01C"], [1.0, "#E5461B"]]
```

### Typography

- **IBM Plex Mono** — all numbers, KPI values, axis ticks, table cells, data labels
- **IBM Plex Sans Condensed** — section headers, panel titles, chart section labels
- **IBM Plex Sans** — narrative text, body copy, tooltips, annotations, card text

```python
external_stylesheets = [
    "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500"
    "&family=IBM+Plex+Sans+Condensed:wght@400;600;700"
    "&family=IBM+Plex+Sans:wght@300;400;500&display=swap",
    dbc.themes.CYBORG
]
```

### Visual Rules

- Panels: `border: 1px solid {BORDER}`, `border-radius: 2px` (terminals are angular — never
  round corners), `padding: 16px`
- Chart section label: 10px, uppercase, `letter-spacing: 0.1em`, `color: GRAY_1`
- **Insight headline** (mandatory on every chart panel): 15px, IBM Plex Sans Medium, WHITE —
  one sentence stating what to conclude. The audience reads this before the chart.
- **Narrative subtext** (below headline): 12px, IBM Plex Sans, GRAY_1 — 1–2 sentences
  of context or methodology note
- All Plotly figures: `plot_bgcolor=INVISIBLE, paper_bgcolor=INVISIBLE`
- No Plotly modebar: `config={"displayModeBar": False}`
- Gridlines: `color=GRAY_2, opacity=0.25, dash="dot"`
- All geo charts: `geo.bgcolor=NAVY, geo.landcolor=MUTED, geo.projection_type="albers usa"`

### Plotly Global Template

```python
import plotly.graph_objects as go
import plotly.io as pio

TEMPLATE = go.layout.Template()
TEMPLATE.layout = go.Layout(
    font=dict(family="IBM Plex Sans", color=WHITE, size=11),
    paper_bgcolor=INVISIBLE,
    plot_bgcolor=INVISIBLE,
    colorway=[TEAL, CORAL, AMBER, GREEN, TEAL_LIGHT, CORAL_LIGHT],
    xaxis=dict(gridcolor=GRAY_2, gridwidth=0.4, showline=False, zeroline=False,
               tickfont=dict(family="IBM Plex Mono", size=10, color=GRAY_1)),
    yaxis=dict(gridcolor=GRAY_2, gridwidth=0.4, showline=False, zeroline=False,
               tickfont=dict(family="IBM Plex Mono", size=10, color=GRAY_1)),
    legend=dict(bgcolor=INVISIBLE, font=dict(size=10, color=GRAY_1)),
    margin=dict(l=40, r=20, t=20, b=40),
    hoverlabel=dict(bgcolor=PANEL, bordercolor=TEAL,
                    font=dict(family="IBM Plex Mono", size=11, color=WHITE)),
    geo=dict(bgcolor=NAVY, landcolor=MUTED, showland=True, showlakes=False,
             showcoastlines=True, coastlinecolor=BORDER, showframe=False,
             projection_type="albers usa")
)
pio.templates["intuit_dark"] = TEMPLATE
pio.templates.default = "intuit_dark"
```

---

## APPLICATION ARCHITECTURE

### Layout Structure

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  NAVBAR: [Logo] QuickBooks Payments  FRAUD & RISK INTELLIGENCE  [Clock][▶]   │
├──────────────────────────────────────────────────────────────────────────────┤
│  KPI TICKER — horizontally scrolling strip of live KPI pills                 │
├──────────────────────────────────────────────────────────────────────────────┤
│  NARRATIVE PROGRESS BAR — 8 numbered nodes with section titles               │
│  ○ Welcome  →  ① Overview  →  ② Timeline  →  ③ Geography  →  ④ Accounts  │
│              →  ⑤ Signals  →  ⑥ Outlook  →  ⑦ Response                    │
├──────────────────────────────────────────────────────────────────────────────┤
│  SECTION HEADER BAND — section number | title | guiding question | narrative  │
├──────────────────────────────────────────────────────────────────────────────┤
│  CONTEXTUAL FILTER BAR (section-specific, collapses to one row)              │
├──────────────────────────────────────────────────────────────────────────────┤
│  SECTION CONTENT                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  SECTION FOOTER — [← previous section name]       [next section name →]      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Navbar

- Left: Intuit teal square logo placeholder + "QuickBooks Payments" (IBM Plex Sans Condensed)
- Center: "FRAUD & RISK INTELLIGENCE — 2021 ANNUAL REVIEW" letter-spaced, `color=TEAL`
- Right: Live clock (updates every second via `dcc.Interval`) + `[▶ PRESENT]` button

### KPI Ticker Strip

Persistent horizontal scrolling ticker. Each pill:
```
[ TOTAL VOLUME  $403.6M ]  [ INTUITLOSS  $112.7K  2.8 bps ]  [ LOSS EVENTS  84 txns ]
[ ACCOUNTS AT RISK  81 ]  [ MONEY CHANNEL  454 bps ]  [ 2022 FORECAST  $132.9K ]
[ MONTE CARLO P90  $161.6K ]  [ XGBOOST AUC-PR  0.285 ]
```
Style: `background: MUTED, border: 1px solid BORDER, border-radius: 2px, padding: 6px 14px`
IBM Plex Mono values. CORAL for risk metrics trending badly, GREEN for improving.
Scrolls continuously via CSS `@keyframes`. Hovering pauses scroll.

### Narrative Progress Bar

8 nodes in a horizontal line. Each node:
- Number in a circle (filled TEAL = current, outlined TEAL = visited, GRAY_2 = future)
- Section title below in IBM Plex Sans Condensed (10px, caps)
- Connecting lines between nodes (solid TEAL for completed, dashed GRAY_2 for future)

Clicking any node navigates directly. Active section highlighted. Visited sections show a
subtle checkmark. This is the primary navigation — not tabs.

### Section Header Band

Every section opens with a full-width header (`background: PANEL, border-bottom: 1px solid BORDER,
padding: 20px 32px`):
- `SECTION 03` — 10px, TEAL, `letter-spacing: 0.15em`
- Section title — 28px, IBM Plex Sans Condensed Bold, WHITE
- Guiding question — 15px, italic, GRAY_1
- 2–3 sentence narrative paragraph — 13px, GRAY_1 — sets context for this section

### Section Footer Navigation

Full-width footer with `[← Prev Section Name]` and `[Next Section Name →]` buttons.
This is the primary linear navigation that makes the dashboard feel like a slide deck.

---

## WELCOME PAGE (Section 0)

This is the opening screen of the application — a full-viewport landing page that sets
the stage before the analysis begins.

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          [VIDEO BACKGROUND LAYER]                             │
│                     (dark overlay at 70% opacity over video)                  │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │    QuickBooks Payments                                                  │ │
│  │                                                                         │ │
│  │    FRAUD & RISK                                                         │ │
│  │    INTELLIGENCE                                                         │ │
│  │    2021 ANNUAL REVIEW                                                   │ │
│  │                                                                         │ │
│  │    Prepared for: Cross-Functional Payments Executive Leadership         │ │
│  │    Product · Risk · Finance · Accounting · Commercial                   │ │
│  │                                                                         │ │
│  │    ──────────────────────────────────────────────────────               │ │
│  │                                                                         │ │
│  │    $403.6M processed  ·  $112.7K in unrecoverable losses                │ │
│  │    84 loss events  ·  189,826 accounts analyzed                         │ │
│  │                                                                         │ │
│  │    ──────────────────────────────────────────────────────               │ │
│  │                                                                         │ │
│  │                    [▶  BEGIN PRESENTATION]                              │ │
│  │                                                                         │ │
│  │    Analysis by: Christopher O.  ·  February 2026                       │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Video Background Implementation

The background video element is a placeholder — the actual video file will be provided
separately. Implement it as follows so it can be dropped in without code changes:

```html
<div style="position:fixed; top:0; left:0; width:100%; height:100%; z-index:0; overflow:hidden;">
  <video autoplay muted loop playsinline
         style="min-width:100%; min-height:100%; object-fit:cover; opacity:0.35;"
         id="welcome-bg-video">
    <!-- Replace src with actual video file path when available -->
    <source src="assets/welcome_bg.mp4" type="video/mp4" />
  </video>
  <!-- Dark overlay for text legibility -->
  <div style="position:absolute; top:0; left:0; width:100%; height:100%;
              background: linear-gradient(135deg, rgba(10,14,26,0.85) 0%,
              rgba(0,119,197,0.15) 100%);"></div>
</div>
```

Place the video file at `assets/welcome_bg.mp4`. The `assets/` folder must exist (Dash
serves it automatically). If the video file is missing, the dark gradient overlay alone
renders cleanly as the background — no broken elements.

### Welcome Page Typography

- "QuickBooks Payments": 16px, IBM Plex Sans Condensed, TEAL, letter-spaced
- "FRAUD & RISK / INTELLIGENCE": 72px / 68px, IBM Plex Sans Condensed Bold, WHITE,
  tight letter-spacing. Two lines for visual weight.
- "2021 ANNUAL REVIEW": 18px, IBM Plex Mono, TEAL, letter-spaced
- Divider lines: `border-top: 1px solid rgba(0,119,197,0.4)`
- Stat line ($403.6M etc.): 14px, IBM Plex Mono, GRAY_1
- `[▶ BEGIN PRESENTATION]` button: TEAL border, TEAL text, transparent background,
  14px IBM Plex Sans Condensed, `letter-spacing: 0.1em`. On hover: TEAL background,
  WHITE text. Clicking advances to Section 1.
- Author/date line: 11px, GRAY_2

Clicking `[▶ BEGIN PRESENTATION]` navigates to Section 1 and scrolls the progress bar
into view. The Welcome node in the progress bar becomes checked.

---

## SECTION 1 — "What Is the Scale of Our Fraud Exposure?"

**Guiding question:** What is the scale of our fraud exposure and how is it distributed?

**Narrative:** *"In 2021, QuickBooks Payments processed $403.6M in transaction volume
across 189,826 accounts. Of that, $112,734 was lost to fraud that Intuit could not recover —
a rate of 2.8 basis points. Small as a percentage, but growing, concentrated in identifiable
segments, and preventable with targeted action."*

### KPI Tile Grid (2 rows × 4 columns)

Row 1 — Volume context:
| $403.6M Total Volume | 300K Transactions | 189,826 Accounts | $1,345 Avg Txn Size |

Row 2 — Loss headline:
| $112.7K IntuitLoss | 2.8 bps Loss Rate | 84 Loss Events | 11.4% Dispute-to-Loss Rate |

Each tile:
- 3px TEAL left border
- Title: 10px caps, GRAY_1
- Value: 28px IBM Plex Mono, WHITE
- Sparkline: 12-point monthly trend embedded at height=40px
- Delta badge: trend vs. period average in GREEN or CORAL

### Three Panels Below

**Left (5 cols) — Dispute Outcome Cascade (Sankey):**
Display the `10_outcome_funnel` chart OR rebuild as interactive `go.Sankey`:
Flow: 300K Transactions → 734 Disputed → [84 IntuitLoss | MerchLoss | MerchWin | Reversal | Unknown]
Center message: *"Of 300,000 transactions, only 84 resulted in unrecoverable losses to Intuit —
but those 84 are non-random and predictable."*
Hover on each link: count, $, % of total, plain-English description of what this outcome means.

**Center (4 cols) — Loss by Channel Donut:**
`go.Pie` (hole=0.65) — IntuitLoss $ by top 5 channels + "Other".
Center: `$112.7K` in large IBM Plex Mono.
MONEY channel segment colored CORAL with a callout annotation.
Hover: channel name, loss $, % of total loss, loss rate bps vs. channel volume.
Insight headline: *"MONEY channel represents a fraction of volume but an outsized share of losses."*

**Right (3 cols) — Geographic Preview Teaser:**
Small non-interactive US choropleth using `09_geo_loss_map` as a static image (`html.Img`),
displayed at 55% opacity with a TEAL overlay text: `"DEEP DIVE → SECTION 3"`.
The entire panel is clickable — clicking navigates to Section 3.
Insight headline: *"Loss is not evenly distributed geographically — 5 states drive the majority."*

---

## SECTION 2 — "When Did Losses Occur, and What Drove the Spikes?"

**Guiding question:** When did losses spike, and which external events created the conditions?

**Narrative:** *"2021 loss was concentrated in two windows — March ($20.9K, the annual high)
and Q4 ($38K combined). These spikes were not random. They align precisely with documented
external events that create fraud-conducive conditions: stimulus disbursements, COVID
behavioral shifts, and the seasonal fraud calendar. Understanding the timing of these events
is essential for forecasting 2022."*

### External Events Calendar — What the Analysis Accounted For

This section must display a visible callout panel listing the dummy/real-world events that
were explicitly incorporated into the trend analysis and forecast. Style it as a structured
annotation panel (`background: MUTED, border-left: 3px solid TEAL, padding: 16px`):

```
EXTERNAL EVENTS INCORPORATED INTO THIS ANALYSIS

ECONOMIC SHOCKS
  Jan 11  ·  $600 Stimulus Checks Deposited (CARES Act extension)
  Mar 17  ·  $1,400 American Rescue Plan (ARP) Stimulus — largest single disbursement
  Jul 15  ·  Monthly Child Tax Credit payments begin ($250–$300/child/month)
  Sep 06  ·  $300/week enhanced unemployment supplement expires
  Jun–Dec ·  CPI inflation accelerates (reached 7%+ by year-end, inflating loss $ nominally)

COVID BEHAVIORAL SHIFTS
  Jan 01  ·  COVID Winter Wave peak — structural shift to card-not-present transactions
  Jul 15  ·  Delta variant surge — renewed e-commerce migration, supply chain stress
  Nov 26  ·  Omicron variant identified — compressed holiday shopping, delivery disputes surge

SUPPLY CHAIN EVENTS
  Mar 23  ·  Suez Canal blockage — delayed global goods shipments, non-delivery disputes lag

FRAUD ENVIRONMENT
  Mar 01  ·  PPP loan fraud trailing edge — synthetic identities from PPP enter chargeback window

CYBER EVENTS
  May 07  ·  Colonial Pipeline ransomware — elevated ATO threat environment
  Oct 04  ·  Facebook/Instagram outage — phishing campaigns exploit outage, credential theft

SEASONAL FRAUD CALENDAR (recurring)
  Jan     ·  Post-holiday chargeback season (Nov–Dec purchases dispute in January)
  Feb 14  ·  Valentine's Day — gift card fraud and non-delivery spikes
  Apr     ·  Tax season — identity theft and refund fraud correlation
  Nov 26  ·  Black Friday / Cyber Monday — highest transaction volume, fraud blends in
  Dec     ·  Holiday fraud window — card-not-present, subscription fraud, ATO peak
```

All of these were coded into the `EVENTS_2021` registry and used to annotate the trend
charts and inform the Prophet forecast regressors. Include a tooltip on each event row
showing its `fraud_impact` level and analytical notes.

### Main Timeline Chart (full width, 450px)

Display the `02_monthly_trends_annotated` chart as a base, OR rebuild as interactive
`go.Figure` with:
- Bar trace: monthly txn volume (background, secondary Y, MUTED color)
- Line 1: monthly chargeback $ (AMBER, width=1.5)
- Line 2: monthly IntuitLoss $ (CORAL, width=3) — the money line
- Line 3: 3-month rolling average (CORAL_LIGHT, width=1.5, dash="dot")

**Event Annotations Overlay** (all EVENTS_2021):
- Thin dashed vertical line per event (`color=GRAY_2, opacity=0.35`)
- Colored dot at top of line: CORAL=fraud-environment, AMBER=economic, TEAL=seasonal, GRAY=cyber
- Hover on dot: event name, date, fraud impact level, full narrative notes
- High-impact events get a subtle shaded region (CORAL fill at 4% opacity over the event window)

**Category Toggle Buttons** (above chart):
`[ALL]  [ECONOMIC]  [COVID]  [SEASONAL]  [CYBER]  [SUPPLY CHAIN]`
Toggling shows/hides that category's event markers in real time.

**Anomaly Auto-Detection:** Months where IntuitLoss > mean + 1.5σ of non-trend baseline
(from `30_trend_decomposition`) get: CORAL circle marker (size=14), callout arrow with
`"↑ ANOMALY +{pct}%"`, and annotation explaining the probable driver from the events calendar.

Insight headline: *"March 2021 was the single highest-loss month ($20.9K) — coinciding
precisely with the ARP $1,400 stimulus disbursement and the PPP fraud trailing edge."*

### Secondary Row (3 panels)

**Left (4 cols) — Loss Rate Trend (Chart 03):**
Three-line chart: Chargeback Rate / IntuitLoss Rate / Dispute-to-Loss Conversion Rate in bps.
OLS trend line overlay per metric.
Insight: *"Dispute-to-loss conversion rate is volatile month-to-month — we lose some
months of disputes at 30%+, others at near zero."*

**Center (4 cols) — H1 vs H2 Channel Risk Shift (Chart 13):**
Display `13_channel_risk_shift` — grouped bar chart showing chargeback rate by channel
in H1 vs H2. This is one of the richer insights from the notebook: which channels
accelerated their risk in the second half of 2021?
Insight: *"Several channels showed meaningfully higher chargeback rates in H2 — a trend
that, if it continues, should bias the 2022 forecast upward for those segments."*

**Right (4 cols) — Trend Decomposition (Chart 30):**
Display `30_trend_decomposition` — the 3-panel chart showing actual loss, 3-month trend,
and residual anomalies. Annotate the residual panel: residuals above the threshold line are
marked CORAL with the event label that likely explains them.
Insight: *"After removing the underlying upward trend, March and October residuals are the
genuine anomalies — the rest of the variation is explained by the trend alone."*

---

## SECTION 3 — "Where Is Our Risk Geographically Concentrated?"

**Guiding question:** Where geographically is fraud risk concentrated, and does geography
reveal structural vulnerabilities beyond what segment analysis shows?

**Narrative:** *"Fraud risk is not uniformly distributed across geography. Certain states
show loss rates multiples above the national average — not because of higher transaction
volume, but due to structural factors: channel mix, MCC concentration, and account
demographic patterns. Geographic concentration is directly actionable: it tells us where
enhanced monitoring has the highest return."*

### Primary Geospatial View (full width, 520px)

Large interactive US choropleth — the visual anchor of this section.

```python
fig = px.choropleth(
    state_df,
    locations="state_code",
    locationmode="USA-states",
    color="loss_rate_bps",
    color_continuous_scale=GEO_SCALE,
    scope="usa",
    hover_data={"state": True, "loss_rate_bps": ":.1f", "il_amt": ":$,.0f",
                "txn_vol": ":$,.0f", "top_channel": True, "top_mcc": True}
)
fig.update_geos(
    bgcolor=NAVY, landcolor=MUTED, showland=True, showlakes=False,
    showcoastlines=True, coastlinecolor=BORDER, showframe=False,
    projection_type="albers usa"
)
fig.update_layout(
    coloraxis_colorbar=dict(
        title=dict(text="Loss Rate (bps)", font=dict(family="IBM Plex Mono", size=10)),
        tickfont=dict(family="IBM Plex Mono", size=9),
        len=0.6, thickness=10
    )
)
```

**Metric Toggle** (pill buttons above map):
`[LOSS RATE (bps)]  [TOTAL LOSS $]  [DISPUTE RATE]  [TXN VOLUME]  [LOSS PER ACCOUNT]`
Switching updates color encoding and legend in real time via callback.

**Rich Hover Tooltip:**
```
STATE: California (CA)
LOSS RATE: 8.4 bps  ▲ 3.0× national avg (2.8 bps)
TOTAL INTUITLOSS: $14,280
TXN VOLUME: $1.7M  ·  {N} accounts
TOP CHANNEL: QBO (62% of volume)
TOP MCC: Business Services
YoY TREND: ↑ Worsening
```

**State Click → Cross-Section Drill-Down:**
Clicking a state fires a callback that:
1. Highlights the state with TEAL border ring
2. Updates all three panels below to show that state's data
3. Stores the state in `dcc.Store` for cross-section filtering
4. Shows a badge: `STATE SELECTED: California ✕`

**Insight headline:** *"Five states represent 61% of total IntuitLoss despite 34% of
transaction volume — geographic concentration that is directly addressable."*

### View Toggle — Choropleth ↔ Bubble Map

Toggle button: `[CHOROPLETH VIEW]  [BUBBLE VIEW]`

**Bubble View** (`px.scatter_geo`):
- One bubble per state
- Size = transaction volume (shows where the money is)
- Color = loss rate (GEO_SCALE — shows where the risk is)
- State abbreviation labeled inside each bubble
- Hover: same rich tooltip as choropleth

The two views are complementary: choropleth shows pure risk intensity, bubble map shows
volume-weighted risk. Together they reveal which high-risk states are also high-volume
(priority) vs. high-risk but low-volume (secondary).

### Geo Analysis Panels (below map, 3 columns)

**Left (4 cols) — State Risk League Table:**
`dash_table.DataTable`, Bloomberg-style dark grid. Columns:
State | Loss Rate (bps) | Total Loss $ | Txn Volume | Top Channel | Top MCC | Risk Tier | Trend

Conditional formatting:
- Loss Rate: CORAL cell (>10 bps), AMBER (5–10), GREEN (<2)
- Risk Tier: colored pill badges
- Trend: ↑↓ arrows in CORAL/GREEN

Row click → selects that state on the map, updates other panels.
`[↓ EXPORT CSV]` button, top-right.

**Center (4 cols) — Channel × State Risk Heatmap:**
Top 10 states (rows) × top 8 channels (columns). Cell = loss rate bps.
Color: NAVY (zero) → CORAL (max). Cell text: IBM Plex Mono 9px loss rate value.
Cells are clickable — clicking a cell applies both state + channel filters.
Insight: *"MONEY channel shows elevated loss rate in most of the top-10 highest-risk states —
the geographic pattern is channel-driven, not territory-driven."*

**Right (4 cols) — MCC Geographic Concentration:**
Horizontal stacked bar chart. Top 10 states on Y-axis. Each bar segmented by MCC risk group,
colored by risk level (CORAL = high-risk MCC, AMBER = medium, TEAL = low-risk).
Shows whether high-risk states are driven by the same MCC categories or different ones —
which has implications for whether this is a single fraud ring or independent patterns.

### Geographic Risk Intelligence Panel (full width, below — highlighted callout)

`background: MUTED, border-left: 3px solid TEAL, padding: 16px`

*"Geographic concentration tells us where to look — but it doesn't tell us which types of
accounts are driving these patterns within each state. The next section examines account
behavioral archetypes and shows how the geographic risk maps back to specific account profiles."*

`[→ WHICH ACCOUNTS ARE DRIVING THESE PATTERNS?]` — advances to Section 4.

---

## SECTION 4 — "Which Account Profiles Drive Disproportionate Loss?"

**Guiding question:** Which behavioral account profiles are responsible for losses,
and can we identify them before they generate a chargeback?

**Narrative:** *"Loss concentration is not random across account types. Our unsupervised
analysis of 189,826 account behavioral profiles using UMAP and K-Means revealed distinct
archetypes — and the loss-generating accounts cluster tightly in a specific region of
behavioral space. This section names those archetypes and quantifies their contribution."*

### UMAP Account Behavioral Map (left, 6 cols, tall)

Interactive `go.Scatter` on UMAP 2D coordinates. This is the centerpiece of this section.

- Point color = cluster/archetype label (distinct color per cluster from cluster_colors palette)
- Point size = account txn volume (scaled 4–14px)
- **IntuitLoss accounts** overlaid as star markers (`symbol="star"`, CORAL, size=14, zorder=top)
- Faint convex hull boundaries per cluster (filled polygon, cluster color at 6% opacity)
- Each cluster centroid annotated with archetype name (IBM Plex Sans Condensed, 11px)

Interactions:
- Hover: archetype name, account age days, avg txn size, chargeback rate, loss rate, anomaly score
- Click a point → populates the detail panel on the right with that account's full profile
- Lasso select → aggregate stats for all selected accounts populate the detail panel
- Legend entries clickable to toggle clusters on/off

Insight headline: *"Loss-generating accounts (★) cluster tightly in behavioral space —
they are not randomly distributed, which means they are identifiable in advance."*

### Archetype Intelligence Panel (right, 6 cols)

Three stacked components:

**Top — Archetype Selector + Radar Chart:**
Pill-button row: one button per cluster name. Clicking selects that archetype.
Below: `go.Scatterpolar` radar on 6 axes:
Txn Velocity | Avg Txn Size | Account Age | Chargeback Rate | Loss Rate | Anomaly Score
Two traces: selected cluster (TEAL fill, 40% opacity) vs. all-account average (GRAY_2 dashed).
This is also available as `20_archetype_radar` static image if rebuilding is complex.

**Middle — Archetype Detail Card:**
```
┌──────────────────────────────────────────────────────────────┐
│ [HIGH RISK]  {CLUSTER NAME}                                  │
│ ──────────────────────────────────────────────────────────── │
│ {2-3 sentence behavioral description drawn from cluster      │
│  centroid profile — what makes this archetype distinctive}   │
│                                                              │
│ ACCOUNT COUNT: {N}     % OF TOTAL: {X}%                      │
│ TOTAL LOSS: ${X}K      % OF ALL LOSSES: {X}%                 │
│ AVG ACCOUNT AGE: {N} days   AVG TXN: ${X}                    │
│ TOP CHANNELS: {ch1}, {ch2}                                   │
│ TOP STATES: {s1}, {s2}, {s3}                                 │
│ ──────────────────────────────────────────────────────────── │
│ RECOMMENDED ACTION: {specific, actionable recommendation}    │
└──────────────────────────────────────────────────────────────┘
```
Border-left color: CORAL (high risk), AMBER (medium), TEAL (baseline).

**Bottom — Loss Attribution Bar:**
Horizontal stacked bar — % of total IntuitLoss ($112.7K) per cluster.
Each segment colored by cluster. Hover: cluster name + $ + %. Answers: *"Which archetype
is responsible for how much of our loss?"*

### Isolation Forest Risk Quadrant (below, 7 cols)

Scatter: X = anomaly score, Y = chargeback rate per account.
Four quadrants with dashed GRAY_2 dividers, quadrant labels:
- Top-right: `IMMEDIATE REVIEW` (CORAL)
- Top-left: `INVESTIGATE` (AMBER)
- Bottom-right: `MONITOR` (TEAL)
- Bottom-left: `CLEAN` (GRAY_1)

Points colored by archetype. Size = txn volume. CORAL stars for IntuitLoss accounts.
`[→ EXPORT HIGH-RISK ACCOUNT LIST]` button — downloads top-right quadrant as CSV.
Insight: *"The Isolation Forest identified accounts with both anomalous behavior and
realized losses — these are the specific accounts to act on immediately."*

### Account Age & Dispute Lag Row (right of quadrant, 5 cols, stacked)

**Top (Chart 11) — Account Age at Time of Loss:**
Static image `11_account_age_at_loss` OR interactive histogram: loss accounts vs. all accounts,
density overlay. Annotate: *"X% of losses occur within 30 days of account opening."*

**Bottom (Chart 12) — Time-to-Dispute by Outcome:**
Static image `12_time_to_dispute` OR interactive histogram stratified by outcome.
Different dispute lag patterns signal different fraud typologies:
- Fast (days): bust-out fraud / ATO
- Slow (weeks–months): friendly fraud
Insight: *"IntuitLoss disputes resolve faster than MerchWin disputes — suggesting
Intuit is losing disputes for accounts with less documentation to fight back with."*

### Survival Analysis Row (full width, 2 panels)

**Left (6 cols) — Kaplan-Meier by Channel (Chart 14):**
Static image `14_kaplan_meier_by_channel` (or interactive lifelines reconstruction).
KM curves showing time-to-first-chargeback by channel. Curves that drop faster = riskier.
Log-rank test p-value annotated. Insight: *"Channel survival curves diverge significantly
early — within the first 60 days, high-risk channels show 3× the chargeback probability
of low-risk channels."*

**Right (6 cols) — Cox Proportional Hazards Forest Plot (Chart 16):**
Static image `16_cox_hazard_ratios` — forest plot of hazard ratios with 95% CI.
Variables with HR > 1 and CI not crossing 1 are genuine chargeback accelerators.
Insight: *"Channel loss rate and transaction velocity are the strongest accelerators
of chargeback risk — both are measurable at account opening."*

---

## SECTION 5 — "Can We Detect High-Risk Accounts Before a Loss Occurs?"

**Guiding question:** What behavioral signals predict a loss before it happens,
and how accurate is our predictive model?

**Narrative:** *"The clustering analysis showed that loss accounts are not randomly
distributed. This section asks a harder question: could we have identified them before
the chargeback arrived? Using a temporal train/test split (Jan–Sep = train, Oct–Dec = test)
and XGBoost with SMOTE oversampling, our best model achieved an AUC-PR of 0.285 against a
random baseline of 0.043 — a 6.6× improvement. Here are the signals it found."*

### Methodology Note Panel (full width, top — important)

```
background: MUTED, border-left: 3px solid AMBER, padding: 16px
```

*"Important methodological context: With 81 loss accounts out of 189,826 (0.043% prevalence),
standard accuracy metrics are meaningless. A model that flags nothing as risky gets 99.96%
accuracy. We optimize for AUC-PR (Precision-Recall) which is the honest metric for this
class imbalance. SMOTE was applied to training data only — never the test set, which would
constitute data leakage. With only 16 positive cases in the test set, these metrics are
directional — the feature importance is the real takeaway."*

### SHAP Intelligence Panel (left, 7 cols)

Display `25_shap_beeswarm` as an interactive-feeling panel. If rebuilding as Plotly:
`go.Scatter` beeswarm — Y = feature names sorted by mean |SHAP|, X = SHAP value,
color = feature value (TEAL = low, CORAL = high), one point per test account.
Zero-line labeled: `"← REDUCES RISK  |  INCREASES RISK →"`
Hover: feature name, SHAP contribution in $, raw feature value, plain-English:
`"Channel = MONEY → adds $X to expected loss probability"`

Insight headline: *"Channel and account age explain the majority of model variance —
both are known at the moment of onboarding, before any transaction occurs."*

### Model Performance Panel (right, 5 cols)

**Top — Precision-Recall Curves (Chart 23):**
XGBoost (TEAL, thick) vs. LightGBM (AMBER) vs. Logistic Baseline (GRAY_2 dashed).
AUC-PR values: XGBoost 0.285 | LightGBM 0.250 | Logistic 0.131 | Random 0.043
Baseline (random) shown as a horizontal dotted line at 0.043.
AUC-PR value annotated directly on each curve.

**Bottom — Model Scorecard Table:**
Compact `dash_table.DataTable`: Model | AUC-PR | AUC-ROC | F1 | Precision | Recall
XGBoost row highlighted with TEAL left border. "Best Model" badge.

### Model Calibration Row (full width, 2 panels)

**Left (6 cols) — Actual vs. Predicted Monthly Loss (Chart 28):**
Bar chart showing actual IntuitLoss $ vs. model-predicted expected loss $ per month.
This is the calibration check: does the model's monthly aggregate align with reality?
Insight: *"The bottom-up model expected loss tracks well in most months — diverging
in March and December where the external event shocks created conditions outside the
training distribution."*

**Right (6 cols) — SHAP Waterfall — Highest Risk Account (Chart 26):**
Static image `26_shap_waterfall_top_risk` in a titled panel.
Caption: *"Why the model flagged the highest-risk account in the test set —
six independent signals, each measurable at onboarding."*

### Geographic Signal Concentration (full width, below)

**Title:** `WHERE ARE HIGH-RISK MODEL-FLAGGED ACCOUNTS LOCATED?`

`px.scatter_geo` bubble map:
- One bubble per state
- Size = count of accounts in the top-10% of model risk scores (from Isolation Forest)
- Color = proportion of those accounts that actually generated IntuitLoss (GEO_SCALE)
- Hover: state, count flagged, actual loss rate among flagged, geographic concentration ratio

Insight: *"Model-flagged high-risk accounts are 3× more geographically concentrated than
the general account population — confirming the geographic signal found in Section 3 is
captured in the model's features."*

---

## SECTION 6 — "What Should We Expect From 2022?"

**Guiding question:** Given 2021 patterns, what will losses look like in 2022,
and what is the range of outcomes we should plan for?

**Narrative:** *"With 12 months of historical data, forecasting carries inherent uncertainty.
We ran four independent methods — ARIMA, Prophet, Holt's Linear Trend, and a bottom-up ML
projection — and combined them into an ensemble. The ensemble base case forecasts $132,905
in 2022 losses, a 17.9% increase over 2021. Monte Carlo simulation gives us the probability
distribution: 80% confidence interval of $81.6K–$161.6K."*

### Forecasting Methodology Note (full width, top)

```
background: MUTED, border-left: 3px solid AMBER, padding: 16px
```

*"STL decomposition requires 2+ seasonal cycles (24 monthly observations). With only 12 data
points, we use a 3-month centered moving average for trend extraction instead. Holt-Winters
seasonal and SARIMA seasonal components are similarly disabled — we use Holt's linear trend
(level + trend, no seasonality) and ARIMA with non-seasonal orders only. This is the honest
approach; pretending to estimate seasonality from a single calendar year would overfit."*

### Hero Forecast Chart (full width, 440px)

The most important chart in the application. Must be visually exceptional.

Traces:
- 2021 actuals: `go.Bar` in MUTED, value labels in IBM Plex Mono
- Individual model lines (ARIMA, Prophet, Holt's, Bottom-Up ML): thin lines, 15% opacity,
  labeled at right edge
- **Ensemble mean:** thick TEAL line (width=3.5), diamond markers at each month point
- 80% CI: TEAL fill, 8% opacity
- 95% CI: TEAL fill, 4% opacity
- 2022 region: vertical divider at Jan 1 2022 + faint TEAL shaded background (3% opacity)
  with `"FORECAST PERIOD"` label top-right

**Scenario Toggle** (Bloomberg button group above chart):
`[● BASE CASE $132.9K]  [● OPTIMISTIC $73.6K]  [● PESSIMISTIC $303.9K]`
BASE=TEAL, OPTIMISTIC=GREEN, PESSIMISTIC=CORAL.
Switching updates the ensemble line, CI bands, and the headline dynamically.

**Anticipated Event Annotations for 2022:**
Faint vertical markers for expected 2022 events: Tax Season (April), Summer CTC trailing,
Black Friday (November) — labeled: `"Expected: similar pattern to 2021"`.

**Model Weight Sliders** (collapsible `▼ ADJUST MODEL WEIGHTS`):
Four sliders: ARIMA | Prophet | Holt's Linear | Bottom-Up ML.
Automatically sum to 100 (adjusting one redistributes remainder).
Moving any slider immediately recomputes and re-renders the ensemble forecast and headline.
`[RESET TO EQUAL WEIGHTS]` button.

Insight headline (changes per scenario):
- Base: *"2022 base case forecast: $132.9K — a 17.9% increase over 2021, driven by
  channel volume growth at 2021 H2 rates."*
- Optimistic: *"Targeting the top flagged account segments reduces projected losses
  to $73.6K — a potential saving of $59.3K."*
- Pessimistic: *"Worst-case trajectory: $303.9K if high-risk channel growth accelerates
  and no intervention is deployed."*

### Forecast Detail Row (3 panels)

**Left (4 cols) — Monthly Forecast Table:**
`dash_table.DataTable`: Month | ARIMA | Prophet | Holt's | ML | Ensemble | vs. 2021
Q4 months highlighted CORAL (4% opacity row background). `[↓ EXPORT]` button.

**Center (4 cols) — Monte Carlo Fan Chart (Chart 37):**
500 simulated paths (TEAL, 3% opacity) + P10/P25/P50/P75/P90 bands.
Range slider: `"Simulated paths: 100 → 5,000"` (updates chart in real time).
Annotation: `"P(annual loss > $150K) = 34%  ·  P(> $200K) = 8%"`.

**Right (4 cols) — Annual Loss Distribution (Chart 38):**
Histogram of total annual 2022 loss across all simulations.
Vertical markers: P10=$81.6K (GREEN), P50=$113.9K (TEAL), P90=$161.6K (CORAL).
Draggable threshold line via `dcc.Slider` mapped to a `go.layout.Shape` vertical line.
Tooltip updates live: `"P(loss > $X) = Y%"` as user drags.

### Geospatial 2022 Loss Forecast (full width, below)

**Title:** `WHERE WILL 2022 LOSSES CONCENTRATE?`

Choropleth using state-level projected 2022 losses (2021 loss rate × projected volume).

Toggle: `[2021 ACTUAL]  [2022 PROJECTED]  [CHANGE %]`
- "CHANGE %" view: GREEN = improving states, CORAL = worsening states
- Hover: state name, 2021 actual, 2022 projected, % change, key driver

Insight: *"Geographic concentration is forecast to intensify — the top 5 states are
projected to represent 68% of 2022 losses vs. 61% in 2021 if current channel and MCC
patterns persist."*

---

## SECTION 7 — "What Actions Will Have the Greatest Impact?"

**Guiding question:** Given everything we've found, what do we do — in what order,
owned by whom, and with what expected return?

**Narrative:** *"Seven sections of analysis converge on a clear set of actions. This
section translates analytical findings into operational recommendations, ranked by
estimated impact and implementation effort. Each recommendation is tied to the specific
analytical evidence that supports it."*

### Priority Action Matrix (left, 5 cols)

2×2 scatter plot: X = implementation effort (Low→High), Y = estimated annual loss reduction.
Each recommendation = a labeled bubble. Size = affected account count. Color = urgency.

Quadrant labels:
- Top-left: `QUICK WINS` (GREEN text)
- Top-right: `STRATEGIC INVESTMENTS` (AMBER)
- Bottom-left: `NICE TO HAVE` (GRAY_1)
- Bottom-right: `DEPRIORITIZE` (GRAY_2)

Clicking a bubble highlights the corresponding recommendation card on the right.

### Recommendation Cards (right, 7 cols, scrollable)

```
┌──────────────────────────────────────────────────────────────┐
│ [01]  ● IMMEDIATE                                            │
│ ENHANCED ONBOARDING REVIEW — NEW ACCOUNTS (<30 DAYS)         │
│ ──────────────────────────────────────────────────────────── │
│ Accounts opened <30 days generate a disproportionate share   │
│ of IntuitLoss despite small volume share. A structured       │
│ review queue for the first 30 days on MONEY and QBOFTU       │
│ channels would intercept this cohort before losses occur.    │
│                                                              │
│ ESTIMATED SAVINGS: ~$18–22K / yr    EFFORT: LOW              │
│ AFFECTED ACCOUNTS: ~1,200+          OWNER: Risk + Product    │
│ EVIDENCE: Sections 4 + 5 (account age analysis, SHAP)        │
└──────────────────────────────────────────────────────────────┘
```

Card border-left: CORAL (immediate), AMBER (near-term), TEAL (strategic).
Hover: card lifts with `box-shadow: 0 4px 20px rgba(0,119,197,0.25)`.
Each card includes: `EVIDENCE: Section X + Y (specific analysis)` — tying back to the story.

### Channel × MCC Risk Network (below, full width)

**Title:** `WHICH CHANNEL–INDUSTRY PATHWAYS CARRY THE MOST RISK?`

Display the bipartite network `39_bipartite_channel_mcc` as a static image panel OR
rebuild as interactive `go.Scatter` + `go.Line` network in Plotly:
- Channels on left column, MCC groups on right column
- Edges = chargeback $ flowing through each channel–MCC pair
- Edge width = chargeback volume, edge color = loss rate (GEO_SCALE)
- Node size = total txn volume through that node
- Hover on edge: channel, MCC, chargeback $, loss $, loss rate bps

This closes the analysis loop — connecting every dimension we've examined (channel, MCC,
geography) into a single relational view of where risk pathways exist.

Insight: *"The highest-risk pathways are not evenly distributed across channel × MCC
combinations — concentrating monitoring on 3–4 specific pairings would capture the
majority of addressable loss."*

### Geographic Response Map (full width, below network)

**Title:** `WHERE TO PRIORITIZE INTERVENTION DEPLOYMENT`

Choropleth: states colored by estimated savings from deploying the top 3 recommendations
(GREEN scale — deeper green = higher addressable loss reduction in that state).
States with no recommended intervention in gray.

Hover: state, applicable recommendations (list), estimated annual saving from deployment.
This closes the geographic loop — from "where is the risk" (Section 3) to "where do we act."

Insight: *"Deploying the top 3 recommendations in the 5 highest-risk states captures an
estimated 73% of the total addressable loss reduction."*

### Executive One-Pager View (full width, toggleable)

Button top-right: `[EXECUTIVE SUMMARY VIEW]`

When toggled, collapses all cards and renders a single screenshot-ready summary panel:

```
┌────────────────────── EXECUTIVE BRIEFING SUMMARY ────────────────────────────┐
│                                                                               │
│  2021 LOSS LANDSCAPE             2022 OUTLOOK                                │
│  Total IntuitLoss: $112,734      Base Case:     $132,905                     │
│  Loss Rate: 2.8 bps ↑            Optimistic:    $73,586  (with intervention) │
│  Peak Month: March $20,856       Pessimistic:   $303,873                     │
│  Key Driver: MONEY channel       80% CI: $81.6K – $161.6K                   │
│  (454 bps vs. 2.8 bps avg)                                                   │
│                                                                               │
│  THREE KEY FINDINGS                                                           │
│  ① New accounts (<30 days) generate 43%+ of losses at <10% of volume        │
│  ② MONEY channel: 454 bps loss rate — 162× the portfolio average             │
│  ③ 5 states drive 61% of losses. Geographic concentration is actionable.     │
│                                                                               │
│  RECOMMENDED ACTIONS BY FUNCTION                                             │
│  RISK:        Enhanced review queue for new MONEY/QBOFTU accounts            │
│  PRODUCT:     Flag accounts entering Isolation Forest high-risk zone          │
│  FINANCE:     Reserve against P90 scenario ($161.6K)                         │
│  ACCOUNTING:  Anticipate March + Q4 seasonal reserve needs in 2022           │
│  COMMERCIAL:  Evaluate MONEY channel onboarding terms and volume incentives  │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

No scrollbars. Fits exactly in 1080p. Screenshot-ready for slide insertion.

---

## PRESENTATION MODE

`[▶ PRESENT]` in the navbar triggers presentation mode:

1. All filter bars, sliders, and interactive controls hidden (`display: none`)
2. Progress bar remains — becomes the only navigation control
3. Fullscreen via Fullscreen API
4. Left/right arrow keys (or on-screen `[◀]` `[▶]`) advance sections
5. Chapter transition: horizontal slide animation, 300ms ease-in-out
6. Section title card overlay during transition: large centered title fades in for 1.5s
7. Progress counter bottom-right: `"3 / 7"` in IBM Plex Mono
8. `[ESC]` exits. All controls restore.

Implement via `dcc.Store({"presentation_mode": bool, "current_section": int})` +
`clientside_callback` for keyboard listener.

---

## DATA LOADING

```python
import json
from pathlib import Path

with open(Path(__file__).parent / "results.json") as f:
    results = json.load(f)

# Primary keys used throughout:
# results["data_summary"]           — headline KPIs
# results["forecast_2022"]          — ensemble_monthly (list of 12), scenario totals, MC percentiles
# results["model_metrics"]          — auc_pr per model, best_model name
# results["key_insights"]           — pre-computed insight strings

# Chart images loaded as:
def load_chart(chart_id, description):
    path = Path(__file__).parent / "charts" / f"{chart_id}_{description}.png"
    return str(path) if path.exists() else None

# For any section where chart files exist, prefer displaying them via html.Img
# with style={"width":"100%", "borderRadius":"2px"} rather than rebuilding in Plotly,
# UNLESS interactivity (hover, click, filter) is required for that chart.
# Interactive-priority charts: choropleth, UMAP scatter, Sankey, PR curve, forecast.
# Static-acceptable charts: KM curves, SHAP plots, radar, confusion matrix, treemap.

# If any key is missing from results.json:
# → Generate plausible synthetic data for that component
# → Add a subtle [SYNTHETIC] badge (10px, AMBER, top-right of panel)
```

---

## CROSS-SECTION STATE MANAGEMENT

All cross-section interactions via `dcc.Store("cross-section-filters")`:

| Trigger | Effect |
|---------|--------|
| State click in Section 3 map | Filters Section 4 UMAP to that state |
| MCC block click in Section 4 | Highlights states where that MCC dominates in Section 3 |
| Archetype click in Section 4 | Filters Section 5 SHAP to that cluster's accounts |
| Scenario toggle in Section 6 | Updates geo forecast map in Section 6 |
| Recommendation click in Section 7 | Highlights applicable states on Section 7 geo map |

These cross-section connections make the dashboard feel like a single coherent argument,
not disconnected charts.

---

## CODE QUALITY STANDARDS

- `app.py` ≤ 2,000 lines. If exceeded: chart builders → `charts.py`, geo logic → `geo.py`
- Every chart builder is a pure function: `def build_{name}(data, filters=None) -> go.Figure`
- Every callback docstring: `"""Triggered by: X. Updates: Y. Cross-section: Z."""`
- All constants at top of file (colors, font sizes, thresholds, known KPI values)
- `fmt_money(x)` helper for all monetary formatting: `$X.XK` / `$X.XM`
- `fmt_bps(x)` helper: `X.X bps`
- No hardcoded paths — all via `pathlib.Path` relative to script location
- `assets/` folder for video and static assets (Dash serves this automatically)
- App runs: `python app.py` → `http://localhost:8050`

---

## FINAL QUALITY CHECKLIST

- [ ] Welcome page video placeholder renders cleanly even without the video file
- [ ] Narrative progress bar shows correct visited/active/future states at all times
- [ ] Section header band visible on every section with title, question, and narrative text
- [ ] External events calendar is visible and explained in Section 2
- [ ] All 3 geo views work: choropleth, bubble map, and the 2022 forecast map
- [ ] State click in Section 3 actually filters Section 4 UMAP via dcc.Store
- [ ] Scenario toggle in Section 6 updates chart AND headline text simultaneously
- [ ] Model weight sliders recompute ensemble forecast in real time
- [ ] Monte Carlo threshold slider updates exceedance probability live
- [ ] Executive Summary view fits in 1080p with no scrollbars
- [ ] Presentation mode: keyboard nav works, transition animation plays, counter shows
- [ ] Zero default Plotly styling anywhere (no white backgrounds, no Plotly blue)
- [ ] Every panel has: section label + insight headline + narrative subtext
- [ ] All values match known data: $112.7K loss, $403.6M volume, 2.8 bps, 0.285 AUC-PR
- [ ] All monetary: `$X.XK` / `$X.XM` — never raw integers
- [ ] All rates: `X.X bps` — never raw decimals
- [ ] Layout holds at 1280×720 and 1920×1080 without horizontal scroll
- [ ] App loads under 4 seconds

The test: a VP of Risk at a major fintech, a Bloomberg Terminal product manager, and a
McKinsey engagement partner should each encounter at least one thing they haven't seen
before. That is the bar.
