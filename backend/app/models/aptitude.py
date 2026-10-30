import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Integer, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class AptitudeQuestion(Base):
    __tablename__ = "aptitude_questions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category = Column(String(50), nullable=False, index=True)  # "quantitative", "logical", "verbal", "analytical"
    topic = Column(String(100), nullable=False, index=True)  # e.g., "Time and Work", "Syllogisms", "Data Sufficiency"
    difficulty = Column(String(20), default="medium")  # "easy", "medium", "hard"
    question_text = Column(Text, nullable=False)
    options = Column(Text, nullable=False)  # JSON array of 4 option strings
    correct_option_index = Column(Integer, nullable=False)  # 0, 1, 2, or 3
    explanation = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class AptitudeAttempt(Base):
    __tablename__ = "aptitude_attempts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(50), nullable=False)
    difficulty = Column(String(20), nullable=False)
    total_questions = Column(Integer, nullable=False)
    correct_count = Column(Integer, nullable=False)
    score_percentage = Column(Float, nullable=False)
    time_taken_seconds = Column(Integer, default=0)
    user_answers = Column(Text, default="{}")  # JSON mapping question_id -> selected_index
    detailed_review = Column(Text, default="[]")  # JSON breakdown per question
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="aptitude_attempts")
