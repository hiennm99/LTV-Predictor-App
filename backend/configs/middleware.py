from fastapi.middleware.cors import CORSMiddleware
from fastapi_sqlalchemy import DBSessionMiddleware

def configure_middleware(app):
    origins = [
        "http://frontend-react",
        "http://frontend-react-dev", 
        "http://localhost",
        "http://127.0.0.1",
        "http://localhost:80",
        "http://127.0.0.1:80",
        "http://localhost:3003",  
        "http://127.0.0.1:3003",
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(
        DBSessionMiddleware,
        db_url="postgresql://app_user:app_password@postgresql/mcpe_platform"
    )
