#!/usr/bin/env bash
set -e
python3 - <<'PY'
import sys, subprocess
try:
    import tkinter  # noqa: F401
except Exception:
    sys.exit("Tkinter is required for the setup wizard.")
PY
python3 ./scripts/setup_wizard.py
