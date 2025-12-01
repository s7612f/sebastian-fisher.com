from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import get_settings
from .api.routes import router
from .plugins.manager import plugin_manager
from .core.database import Base, engine

Base.metadata.create_all(bind=engine)
settings = get_settings()
plugin_manager.discover()

app = FastAPI(title=settings.app_name)
app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"app": settings.app_name, "plugins": plugin_manager.loaded}
