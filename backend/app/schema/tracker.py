from datetime import datetime
from pydantic import BaseModel, ConfigDict
from typing import Optional


class BaseEntry(BaseModel):
    id: int
    note: Optional[str]
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class FoodEntryCreate(BaseModel):
    name: str
    calories: float
    protein: float
    carbs: float
    fat: float
    barcode: Optional[str] = None
    meal_time: Optional[datetime] = None
    note: Optional[str] = None


class FoodEntryOut(FoodEntryCreate, BaseEntry):
    ...
