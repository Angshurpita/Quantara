#!/usr/bin/env python3
"""
run_tests.py — Discover and run all backend tests.

Usage:
    python execution/run_tests.py
"""

import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND = os.path.join(ROOT, "backend")


def main():
    print("🧪 Running backend tests...\n")

    # ── Smoke test: can we import the detector? ───────────────────────
    print("── Smoke test: importing FraudDetector ──")
    result = subprocess.run(
        [sys.executable, "-c", "from detector import FraudDetector; print('  ✅ Import OK')"],
        cwd=BACKEND,
    )
    if result.returncode != 0:
        print("  ❌ Import failed — fix import errors before running tests.")
        sys.exit(1)

    # ── Discover and run test files ───────────────────────────────────
    test_files = sorted(
        f for f in os.listdir(BACKEND) if f.startswith("test_") and f.endswith(".py")
    )

    if not test_files:
        print("\n⚠️  No test files found in backend/")
        sys.exit(0)

    print(f"\n── Found {len(test_files)} test file(s): {', '.join(test_files)} ──\n")

    failed = False
    for tf in test_files:
        print(f"▶ Running {tf} ...")
        r = subprocess.run([sys.executable, tf], cwd=BACKEND)
        if r.returncode != 0:
            print(f"  ❌ {tf} FAILED (exit code {r.returncode})")
            failed = True
        else:
            print(f"  ✅ {tf} passed")

    print()
    if failed:
        print("❌ Some tests failed.")
        sys.exit(1)
    else:
        print("✅ All tests passed.")


if __name__ == "__main__":
    main()
