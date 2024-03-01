from fastapi import FastAPI
import uvicorn
from app import models
from app.db import engine
from app.routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


models.Base.metadata.create_all(bind=engine)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app=app, host="127.0.0.1", port=8080)
