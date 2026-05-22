#!/usr/bin/env python3
"""
start_frontend.py — Install Node dependencies and start the Vite dev server.

Usage:
    python execution/start_frontend.py
"""

import os
import subprocess
import argparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND = os.path.join(ROOT, "frontend")


def main():
    parser = argparse.ArgumentParser(description="Start the Quantara frontend dev server")
    parser.add_argument("--skip-install", action="store_true", help="Skip npm install step")
    args = parser.parse_args()

    os.chdir(FRONTEND)

    # ── Install dependencies ──────────────────────────────────────────
    if not args.skip_install:
        print("📦 Installing frontend dependencies...")
        subprocess.check_call(["npm", "install"], cwd=FRONTEND)
        print("✅ Dependencies installed.")

    # ── Start Vite dev server ─────────────────────────────────────────
    print("🚀 Starting frontend dev server...")
    subprocess.check_call(["npm", "run", "dev"], cwd=FRONTEND)


if __name__ == "__main__":
    main()
