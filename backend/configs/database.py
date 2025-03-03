from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from google.oauth2 import service_account
from typing import Generator

DATABASE_URL = "postgresql://postgres:postgres@192.168.1.54/mcpe_platform"
SERVICE_ACCOUNT_FILE = "./configs/bigquery-readonly-credential.json"
PROJECT_ID = "puzzle-studio-data-warehouse"
DATASET_ID = "mart"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency để lấy session
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Data
engine_bigquery = create_engine(
    f"bigquery://{PROJECT_ID}/{DATASET_ID}",
    credentials_path=SERVICE_ACCOUNT_FILE
)
SessionLocalBigQuery = sessionmaker(autocommit=False, autoflush=False, bind=engine_bigquery)

def get_bigquery_db() -> Generator[Session, None, None]:
    db = SessionLocalBigQuery()
    try:
        yield db
    finally:
        db.close()
