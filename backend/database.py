"""
Database connection configuration for MySQL.
Uses SQLAlchemy ORM with PyMySQL driver.
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
from urllib.parse import quote_plus

# Database URL from environment (Vercel) or fallback to local MySQL
DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    # Use SQLite for local development so no Database server is required
    DATABASE_URL = "sqlite:///./fraud_detection.db"

engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency – yields a DB session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
