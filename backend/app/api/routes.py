from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.tracker import FoodEntry
from ..schema.tracker import FoodEntryCreate, FoodEntryOut
from ..services.auth import create_access_token
from ..plugins.manager import plugin_manager

router = APIRouter()


@router.post("/auth/token")
def issue_token():
    return {"access_token": create_access_token("demo"), "token_type": "bearer"}


@router.post("/food", response_model=FoodEntryOut)
def add_food(payload: FoodEntryCreate, db: Session = Depends(get_db)):
    entry = FoodEntry(**payload.dict())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/health")
def healthcheck():
    return {"status": "ok"}


router.include_router(plugin_manager.router)
