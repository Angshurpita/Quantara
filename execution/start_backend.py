#!/usr/bin/env python3
"""
start_backend.py — Install backend deps and start the FastAPI server.

Usage:
    python execution/start_backend.py [--port PORT]
"""

import os
import subprocess
import sys
import argparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND = os.path.join(ROOT, "backend")
REQUIREMENTS = os.path.join(BACKEND, "requirements.txt")


def main():
    parser = argparse.ArgumentParser(description="Start the Quantara backend server")
    parser.add_argument("--port", type=int, default=8000, help="Port to run on (default: 8000)")
    parser.add_argument("--skip-install", action="store_true", help="Skip pip install step")
    args = parser.parse_args()

    # ── Install dependencies ──────────────────────────────────────────
    if not args.skip_install:
        print("📦 Installing backend dependencies...")
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install", "-r", REQUIREMENTS, "-q"],
        )
        print("✅ Dependencies installed.")

    # ── Start uvicorn ─────────────────────────────────────────────────
    print(f"🚀 Starting backend on http://localhost:{args.port}")
    os.chdir(BACKEND)
    os.execvp(
        sys.executable,
        [sys.executable, "-m", "uvicorn", "main:app", "--reload", "--port", str(args.port)],
    )


if __name__ == "__main__":
    main()
