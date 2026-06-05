import json

with open("results.json") as f:
    res = json.load(f)

print("States in JSON:", [x['state'] for x in res['geographic_risk']['state_metrics']])
