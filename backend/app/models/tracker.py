from sqlalchemy import Column, Integer, String, DateTime, Float, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class BaseEntry(Base):
    __abstract__ = True
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    note = Column(Text, nullable=True)


class FoodEntry(BaseEntry):
    __tablename__ = "food_entries"
    name = Column(String, nullable=False)
    calories = Column(Float, default=0)
    protein = Column(Float, default=0)
    carbs = Column(Float, default=0)
    fat = Column(Float, default=0)
    barcode = Column(String, nullable=True)
    meal_time = Column(DateTime, default=datetime.utcnow)


class WorkoutEntry(BaseEntry):
    __tablename__ = "workout_entries"
    type = Column(String, default="strength")
    duration_minutes = Column(Float, default=0)
    intensity = Column(String, default="moderate")
    volume = Column(Float, default=0)


class BowelEntry(BaseEntry):
    __tablename__ = "bowel_entries"
    bristol_scale = Column(Integer, default=4)
    pain = Column(Integer, default=0)
    blood = Column(Boolean, default=False)


class MedicationEntry(BaseEntry):
    __tablename__ = "medication_entries"
    name = Column(String, nullable=False)
    dose = Column(String, nullable=False)
    taken_at = Column(DateTime, default=datetime.utcnow)


class MoodEntry(BaseEntry):
    __tablename__ = "mood_entries"
    mood = Column(Integer, default=5)
    libido = Column(Integer, default=5)
    energy = Column(Integer, default=5)


class JournalEntry(BaseEntry):
    __tablename__ = "journal_entries"
    title = Column(String, nullable=False)
    tags = Column(String, default="")
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="entries")


class LabResult(BaseEntry):
    __tablename__ = "lab_results"
    marker = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    units = Column(String, nullable=True)
