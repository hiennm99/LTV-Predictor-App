from fastapi.middleware.cors import CORSMiddleware
from fastapi_sqlalchemy import DBSessionMiddleware

def configure_middleware(app):
    origins = [
        "http://localhost",
        "http://localhost:3001",
        "http://localhost:3003",
        "https://ltv.puzzle.sg",
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["POST"],
        allow_headers=["*"],
    )
    app.add_middleware(
        DBSessionMiddleware,
        db_url="postgresql://app_user:app_password@postgresql/mcpe_platform"
    )
