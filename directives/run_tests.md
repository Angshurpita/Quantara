# Run Tests

## Objective
Execute all backend tests and verify the detection engine works correctly.

## Prerequisites
- Python 3.9+ with backend dependencies installed

## Steps

1. **Run all tests**:
   ```bash
   python execution/run_tests.py
   ```

   Or manually:
   ```bash
   cd backend
   python -m pytest -v
   ```

2. **Quick smoke test** (import check only):
   ```bash
   cd backend
   python -c "from detector import FraudDetector; print('OK')"
   ```

## Tools / Scripts
- `execution/run_tests.py` — discovers and runs all `test_*.py` files in `backend/`

## Outputs
- Pass/fail status printed to stdout
- Exit code 0 on success, 1 on failure

## Edge Cases
- Some test files (e.g. `test_detector.py`) may have hardcoded Windows paths — the execution script normalizes these
