#!/bin/bash
# Double-click this file to open the menu maker.
cd "$(dirname "$0")"
PY="$(command -v python3 || echo /opt/homebrew/bin/python3)"
exec "$PY" server.py
