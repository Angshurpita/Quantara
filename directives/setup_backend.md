# Setup Backend

## Objective
Install Python dependencies and start the FastAPI backend server.

## Prerequisites
- Python 3.9+
- `pip` available on PATH

## Inputs
- None (all config comes from `.env` at project root)

## Steps

1. **Create a virtual environment** (first time only):
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate   # macOS/Linux
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**:
   - Copy `../.env.example` → `../.env`
   - Fill in `SECRET_KEY` (any random string for local dev)

4. **Start the server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

## Tools / Scripts
- `execution/start_backend.py` — automates steps 1-4

## Outputs
- Backend running at `http://localhost:8000`
- API docs at `http://localhost:8000/docs`

## Edge Cases
- If port 8000 is in use, kill the existing process or use `--port 8001`
- If `pip install` fails on Apple Silicon, try `pip install --no-cache-dir -r requirements.txt`
