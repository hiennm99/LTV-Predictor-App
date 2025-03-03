from fastapi import FastAPI
from configs.middleware import configure_middleware
from routes import auth_router, ltv_router
from models import Base
from configs.database import engine


app = FastAPI()

configure_middleware(app)

app.include_router(auth_router)
app.include_router(ltv_router)

@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine) # type: ignore

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
