#!/usr/bin/env python3
"""
analyze_csv.py — Run fraud detection on a CSV file without the API server.

Usage:
    python execution/analyze_csv.py <csv_file> [--output results.json]

Outputs pretty-printed JSON to stdout (or to --output file).
"""

import argparse
import json
import os
import sys
import time

# Add backend/ to the Python path so we can import the detector
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND = os.path.join(ROOT, "backend")
sys.path.insert(0, BACKEND)

from detector import FraudDetector  # noqa: E402


def main():
    parser = argparse.ArgumentParser(
        description="Analyze a CSV file for money muling / fraud patterns"
    )
    parser.add_argument("csv_file", help="Path to the CSV file to analyze")
    parser.add_argument("--output", "-o", help="Write JSON to this file instead of stdout")
    args = parser.parse_args()

    csv_path = args.csv_file
    if not os.path.isabs(csv_path):
        csv_path = os.path.join(ROOT, csv_path)

    if not os.path.isfile(csv_path):
        print(f"❌ File not found: {csv_path}", file=sys.stderr)
        sys.exit(1)

    print(f"🔍 Analyzing {csv_path} ...", file=sys.stderr)
    start = time.time()

    with open(csv_path, "r") as f:
        csv_content = f.read()

    detector = FraudDetector()
    result = detector.analyze(csv_content)

    elapsed = time.time() - start
    print(f"✅ Analysis complete in {elapsed:.2f}s", file=sys.stderr)

    output_json = json.dumps(result, indent=2, default=str)

    if args.output:
        with open(args.output, "w") as f:
            f.write(output_json)
        print(f"📄 Results written to {args.output}", file=sys.stderr)
    else:
        print(output_json)


if __name__ == "__main__":
    main()
