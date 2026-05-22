# Run Fraud Analysis

## Objective
Analyze a CSV of transactions for money muling, smurfing, and suspicious rings.

## Prerequisites
- Python 3.9+ with backend dependencies installed
- A valid CSV file with columns: `transaction_id, sender_id, receiver_id, amount, timestamp`

## Option A — Via the API (backend must be running)

1. Start the backend (see `directives/setup_backend.md`)
2. Upload the CSV:
   ```bash
   curl -X POST http://localhost:8000/upload-csv \
     -F "file=@money-mulling.csv"
   ```
3. The response is a JSON object with `suspicious_accounts`, `fraud_rings`, `summary`, and `graph_data`.

## Option B — Via CLI script (no server needed)

```bash
python execution/analyze_csv.py money-mulling.csv
```

Output is written to `stdout` as pretty-printed JSON.
To save to a file:
```bash
python execution/analyze_csv.py money-mulling.csv > results.json
```

## Tools / Scripts
- `execution/analyze_csv.py` — standalone CLI wrapper around `FraudDetector`

## Outputs
- JSON containing:
  - `suspicious_accounts` — list of flagged accounts with scores and reasons
  - `fraud_rings` — detected transaction cycles
  - `summary` — aggregate statistics
  - `graph_data` — nodes and edges for visualization

## Edge Cases
- If column names don't match exactly, the detector auto-maps common aliases
- Very large files (>500k rows) may take several minutes; progress is logged to stderr
