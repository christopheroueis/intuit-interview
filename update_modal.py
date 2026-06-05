import re

with open("app.py", "r") as f:
    content = f.read()

# 1. Add panel_id back to funnel chart
content = content.replace(
    """                    dcc.Graph(figure=build_outcome_funnel(), config={"displayModeBar":False}),
                    min_height="300px"
                ),""",
    """                    dcc.Graph(figure=build_outcome_funnel(), config={"displayModeBar":False}),
                    panel_id="funnel",
                    min_height="300px"
                ),"""
)

# 2. Add modal-chart-graph to ModalBody
content = content.replace(
    """            html.Img(id="modal-chart-img",
                     style={"width":"92%","maxWidth":"700px","margin":"0 auto 16px",
                            "borderRadius":"2px","display":"block"}),
            html.Div(id="modal-insight",
                     style={"fontFamily":"IBM Plex Sans","fontSize":"13px","color":GRAY_1,
                            "lineHeight":"1.7","padding":"0 4px"}),
        ], style={"backgroundColor":NAVY}),""",
    """            html.Img(id="modal-chart-img",
                     style={"width":"92%","maxWidth":"700px","margin":"0 auto 16px",
                            "borderRadius":"2px","display":"block"}),
            html.Div(id="modal-chart-graph", style={"marginBottom": "16px"}),
            html.Div(id="modal-insight",
                     style={"fontFamily":"IBM Plex Sans","fontSize":"13px","color":GRAY_1,
                            "lineHeight":"1.7","padding":"0 4px"}),
        ], style={"backgroundColor":NAVY}),"""
)

# 3. Update toggle_chart_modal outputs
content = content.replace(
    """    [Output("chart-modal","is_open"),
     Output("modal-title","children"),
     Output("modal-chart-img","src"),
     Output("modal-chart-img","style"),
     Output("modal-insight","children")],""",
    """    [Output("chart-modal","is_open"),
     Output("modal-title","children"),
     Output("modal-chart-img","src"),
     Output("modal-chart-img","style"),
     Output("modal-chart-graph","children"),
     Output("modal-insight","children")],"""
)

# 4. Update toggle_chart_modal logic
old_logic = """def toggle_chart_modal(expand_clicks, close_clicks, is_open):
    ctx = dash.callback_context
    if not ctx.triggered:
        return False, "", "", {"display":"none"}, ""

    prop = ctx.triggered[0]["prop_id"]
    val  = ctx.triggered[0]["value"]

    # Close button
    if "modal-close-btn" in prop:
        return False, "", "", {"display":"none"}, ""

    # Guard: ignore phantom triggers fired when section re-renders (n_clicks == 0)
    if not val:
        return False, "", "", {"display":"none"}, ""

    # Expand button — decode which panel
    try:
        import json as _j
        panel_id = _j.loads(prop.split(".n_clicks")[0])["id"]
    except Exception:
        return False, "", "", {"display":"none"}, ""

    meta = CHART_META.get(panel_id)
    if not meta:
        return True, panel_id.upper(), "", {"display":"none"}, "No additional information available."

    title, img_id, img_name, insight = meta
    src = ""
    img_style = {"display":"none"}
    if img_id and img_name:
        enc = _get_img_b64(img_id, img_name)
        if enc:
            src = f"data:image/png;base64,{enc}"
            img_style = {"width":"92%","maxWidth":"700px","margin":"0 auto 16px",
                         "borderRadius":"2px","display":"block"}

    return True, title, src, img_style, insight"""

new_logic = """def toggle_chart_modal(expand_clicks, close_clicks, is_open):
    ctx = dash.callback_context
    if not ctx.triggered:
        return False, "", "", {"display":"none"}, None, ""

    prop = ctx.triggered[0]["prop_id"]
    val  = ctx.triggered[0]["value"]

    # Close button
    if "modal-close-btn" in prop:
        return False, "", "", {"display":"none"}, None, ""

    # Guard: ignore phantom triggers fired when section re-renders (n_clicks == 0)
    if not val:
        return False, "", "", {"display":"none"}, None, ""

    # Expand button — decode which panel
    try:
        import json as _j
        panel_id = _j.loads(prop.split(".n_clicks")[0])["id"]
    except Exception:
        return False, "", "", {"display":"none"}, None, ""

    meta = CHART_META.get(panel_id)
    if not meta:
        return True, panel_id.upper(), "", {"display":"none"}, None, "No additional information available."

    title, img_id, img_name, insight = meta
    src = ""
    img_style = {"display":"none"}
    graph_content = None

    if panel_id == "funnel":
        # Interactive graph directly rendering from python
        graph_content = dcc.Graph(figure=build_outcome_funnel(), config={"displayModeBar":False})
    elif img_id and img_name:
        enc = _get_img_b64(img_id, img_name)
        if enc:
            src = f"data:image/png;base64,{enc}"
            img_style = {"width":"92%","maxWidth":"700px","margin":"0 auto 16px",
                         "borderRadius":"2px","display":"block"}

    return True, title, src, img_style, graph_content, insight"""

content = content.replace(old_logic, new_logic)

with open("app.py", "w") as f:
    f.write(content)
print("done")
