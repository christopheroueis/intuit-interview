"""Vercel entrypoint — exposes the Dash Flask server as a serverless function."""
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
os.chdir(ROOT)

from app import app as dash_app  # noqa: E402

app = dash_app.server
