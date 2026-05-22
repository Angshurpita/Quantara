# Setup Frontend

## Objective
Install Node.js dependencies and start the React/Vite development server.

## Prerequisites
- Node.js 18+
- npm available on PATH

## Inputs
- `VITE_API_URL` environment variable (defaults to `http://localhost:8000`)

## Steps

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start dev server**:
   ```bash
   npm run dev
   ```

## Tools / Scripts
- `execution/start_frontend.py` — automates steps 1-2

## Outputs
- Frontend running at `http://localhost:5173`

## Edge Cases
- If port 5173 is in use, Vite auto-picks the next available port
- If `npm install` hangs, delete `node_modules/` and `package-lock.json`, then retry
- To point at a remote backend, set `VITE_API_URL` before running
