import re

with open("app.py", "r") as f:
    content = f.read()

# Section 3: mb-4
content = content.replace(
    """            ), width=3),
        ], className="mb-4"),

        html.Div([""",
    """            ), width=3),
        ], className="mb-4 stagger-3"),

        html.Div(["""
)

# Section 4
content = content.replace(
    """            ], width=5),
        ], className="mb-4"),

        html.Div("ACCOUNT ARCHETYPES — BEHAVIORAL INTELLIGENCE",""",
    """            ], width=5),
        ], className="mb-4 stagger-1"),

        html.Div("ACCOUNT ARCHETYPES — BEHAVIORAL INTELLIGENCE","""
)

content = content.replace(
    """            ), width=3),
        ], className="mb-4"),

        dbc.Row([""",
    """            ), width=3),
        ], className="mb-4 stagger-3"),

        dbc.Row(["""
)

content = content.replace(
    """            ), width=6),
        ], className="mb-4"),

        section_footer(None, None, None, None)
    ])

def render_section5(**_kwargs):""",
    """            ), width=6),
        ], className="mb-4 stagger-4"),

        section_footer(None, None, None, None)
    ])

def render_section5(**_kwargs):"""
)

# Section 5
content = content.replace(
    """        ], style={"backgroundColor":MUTED,"borderLeft":f"3px solid {AMBER}","padding":"16px",
                   "borderRadius":"0 2px 2px 0","marginBottom":"24px"}),

        dbc.Row([""",
    """        ], style={"backgroundColor":MUTED,"borderLeft":f"3px solid {AMBER}","padding":"16px",
                   "borderRadius":"0 2px 2px 0","marginBottom":"24px"}, className="stagger-1"),

        dbc.Row(["""
)

content = content.replace(
    """            ], width=5),
        ], className="mb-4"),

        dbc.Row([""",
    """            ], width=5),
        ], className="mb-4 stagger-2"),

        dbc.Row(["""
)

content = content.replace(
    """            ), width=6),
        ], className="mb-4"),

        dbc.Row([""",
    """            ), width=6),
        ], className="mb-4 stagger-3"),

        dbc.Row(["""
)

content = content.replace(
    """            ), width=6),
        ], className="mb-4"),

        section_footer(None, None, None, None)
    ])

def render_section6(**_kwargs):""",
    """            ), width=6),
        ], className="mb-4 stagger-4"),

        section_footer(None, None, None, None)
    ])

def render_section6(**_kwargs):"""
)

# Section 6
content = content.replace(
    """        ], style={"backgroundColor":MUTED,"borderLeft":f"3px solid {AMBER}","padding":"16px",
                   "borderRadius":"0 2px 2px 0","marginBottom":"24px"}),

        # ── HERO:""",
    """        ], style={"backgroundColor":MUTED,"borderLeft":f"3px solid {AMBER}","padding":"16px",
                   "borderRadius":"0 2px 2px 0","marginBottom":"24px"}, className="stagger-1"),

        # ── HERO:"""
)

content = content.replace(
    """            panel_id="hero-img", modal_img_id="34", modal_img_name="ensemble_forecast_HERO",
            min_height="380px"
        ),
        html.Div(style={"height":"16px"}),""",
    """            panel_id="hero-img", modal_img_id="34", modal_img_name="ensemble_forecast_HERO",
            min_height="380px",
            className="stagger-2"
        ),
        html.Div(style={"height":"16px"}),"""
)

content = content.replace(
    """                ], style={**PANEL_S,"borderLeft":f"3px solid {CORAL}","textAlign":"center"}), width=4),
            ], className="mb-4"),
        ]),

        dbc.Row([""",
    """                ], style={**PANEL_S,"borderLeft":f"3px solid {CORAL}","textAlign":"center"}), width=4),
            ], className="mb-4 stagger-3"),
        ]),

        dbc.Row(["""
)

content = content.replace(
    """            ), width=4),
        ], className="mb-4"),

        dbc.Col(chart_panel(""",
    """            ), width=4),
        ], className="mb-4 stagger-4"),

        dbc.Col(chart_panel("""
)

content = content.replace(
    """            img("35","scenario_analysis"),
            panel_id="scenario", modal_img_id="35", modal_img_name="scenario_analysis"
        ), width=12),

        section_footer(None, None, None, None)
    ])""",
    """            img("35","scenario_analysis"),
            panel_id="scenario", modal_img_id="35", modal_img_name="scenario_analysis",
            className="stagger-5"
        ), width=12),

        section_footer(None, None, None, None)
    ])"""
)

# Section 7
content = content.replace(
    """            ]]
    ], style={**PANEL_S,"marginTop":"24px","display":"block" if exec_visible else "none"})""",
    """            ]]
    ], style={**PANEL_S,"marginTop":"24px","display":"block" if exec_visible else "none"}, className="stagger-4")"""
)

content = content.replace(
    """            ], width=7),
        ], className="mb-4"),

        dbc.Row([""",
    """            ], width=7),
        ], className="mb-4 stagger-1"),

        dbc.Row(["""
)

content = content.replace(
    """            ), width=6),
        ], className="mb-4"),

        html.Div([""",
    """            ), width=6),
        ], className="mb-4 stagger-2"),

        html.Div(["""
)

content = content.replace(
    """        html.Div([
            dbc.Button("EXECUTIVE SUMMARY VIEW",
                       id={"type":"toggle-btn","id":"exec-summary"}, n_clicks=0, size="sm",
                       style={"backgroundColor":MUTED,"border":f"1px solid {TEAL}","color":TEAL,
                              "fontFamily":"IBM Plex Sans Condensed","fontSize":"12px",
                              "letterSpacing":"0.08em","borderRadius":"2px"})
        ], style={"textAlign":"right","marginBottom":"16px"}),""",
    """        html.Div([
            dbc.Button("EXECUTIVE SUMMARY VIEW",
                       id={"type":"toggle-btn","id":"exec-summary"}, n_clicks=0, size="sm",
                       style={"backgroundColor":MUTED,"border":f"1px solid {TEAL}","color":TEAL,
                              "fontFamily":"IBM Plex Sans Condensed","fontSize":"12px",
                              "letterSpacing":"0.08em","borderRadius":"2px"})
        ], style={"textAlign":"right","marginBottom":"16px"}, className="stagger-3"),"""
)

with open("app.py", "w") as f:
    f.write(content)
print("done")
