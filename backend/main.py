"""
Quantara — Financial Crime Detection Engine (FastAPI Backend)

Now powered by Firebase for auth/storage.
This backend is focused ONLY on:
  - CSV upload & fraud detection analysis
  - Health check
  
All auth, user management, and history are handled by Firebase on the frontend.
"""

import os
from typing import List, Optional

from fastapi import FastAPI, File, HTTPException, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from detector import FraudDetector
from models import AnalysisResult

# Optional: Firebase Admin SDK for token verification
try:
    import firebase_admin
    from firebase_admin import credentials, auth as firebase_auth

    # Initialize Firebase Admin (uses GOOGLE_APPLICATION_CREDENTIALS env var,
    # or a service-account.json file in the backend directory)
    if not firebase_admin._apps:
        service_account_path = os.path.join(os.path.dirname(__file__), 'service-account.json')
        if os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin initialized with service account")
        else:
            # Try default credentials (GCP, Cloud Run, etc.)
            try:
                firebase_admin.initialize_app()
                print("✅ Firebase Admin initialized with default credentials")
            except Exception:
                print("⚠️  Firebase Admin not initialized — token verification disabled")
                firebase_admin = None
    FIREBASE_ENABLED = firebase_admin is not None
except ImportError:
    print("⚠️  firebase-admin not installed — token verification disabled")
    FIREBASE_ENABLED = False


# ── App Initialization ─────────────────────────────────────────────────
app = FastAPI(
    title="Quantara — Financial Crime Detection Engine",
    description="Graph-Based Financial Crime Detection System",
    version="3.0.0",
)

# ── CORS — allow frontend dev server ───────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://quantara.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health Check ───────────────────────────────────────────────────────
@app.get("/")
async def health_check():
    """Simple health check endpoint."""
    return {
        "status": "ok",
        "service": "Quantara Financial Crime Detection Engine",
        "version": "3.0.0",
        "auth": "Firebase" if FIREBASE_ENABLED else "None",
    }


# ── Helper: Verify Firebase Token (optional) ──────────────────────────
def verify_firebase_token(request: Request) -> dict | None:
    """
    Attempt to verify the Firebase ID token from the Authorization header.
    Returns the decoded token (with uid, email, etc.) or None if no valid token.
    """
    if not FIREBASE_ENABLED:
        return None

    auth_header = request.headers.get("authorization", "")
    if not auth_header.startswith("Bearer "):
        return None

    id_token = auth_header[7:]
    try:
        decoded = firebase_auth.verify_id_token(id_token)
        return decoded
    except Exception:
        return None


# ══════════════════════════════════════════════════════════════════════════
#  CSV UPLOAD & ANALYSIS
# ══════════════════════════════════════════════════════════════════════════

@app.post("/predict", response_model=AnalysisResult)
async def upload_csv(
    request: Request,
    file: UploadFile = File(...),
):
    """
    Accept a CSV file upload, run fraud detection analysis,
    and return structured results with graph visualization data.
    Works for both authenticated users and guests.
    """
    # Optional: identify user from Firebase token (for logging purposes)
    firebase_user = verify_firebase_token(request)
    if firebase_user:
        print(f"📊 Analysis requested by user: {firebase_user.get('email', firebase_user.get('uid', 'unknown'))}")

    # Validate file type
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a CSV file.",
        )

    try:
        # Read file contents
        raw_bytes = await file.read()
        csv_content = raw_bytes.decode("utf-8")

        if not csv_content.strip():
            raise HTTPException(status_code=400, detail="Uploaded CSV file is empty.")

        # Run fraud detection
        detector = FraudDetector()
        result = detector.analyze(csv_content)

        return result

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="File encoding error. Please upload a UTF-8 encoded CSV.",
        )
    except Exception as e:
        import traceback
        import logging
        logging.error("Analysis failed: %s", traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail="Analysis failed. Please check your CSV format and try again.",
        )


# ── Run with: uvicorn main:app --reload ───────────────────────────────
if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 1000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
