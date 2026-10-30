import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Integer, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    session_type = Column(String(50), nullable=False)  # "technical", "hr", "project_defense"
    target_role = Column(String(100), default="Full Stack Engineer")
    subjects = Column(Text, default="[]")  # JSON list, e.g. ["DSA", "DBMS", "OS"]
    difficulty = Column(String(20), default="medium")
    total_questions = Column(Integer, default=5)
    status = Column(String(50), default="in_progress")  # "in_progress", "completed"
    overall_score = Column(Float, default=0.0)
    feedback_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="interview_sessions")
    questions = relationship("InterviewQuestion", back_populates="session", cascade="all, delete-orphan")


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False)
    question_order = Column(Integer, nullable=False)
    question_text = Column(Text, nullable=False)
    category = Column(String(100), default="Technical")  # e.g., "DBMS", "Conflict Resolution", "Architecture"
    expected_key_points = Column(Text, default="[]")  # JSON list of expected points
    source_reference = Column(String(255), nullable=True)  # Citation to project doc / resume if generated via RAG
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("InterviewSession", back_populates="questions")
    response = relationship("InterviewResponse", back_populates="question", uselist=False, cascade="all, delete-orphan")


class InterviewResponse(Base):
    __tablename__ = "interview_responses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    question_id = Column(String(36), ForeignKey("interview_questions.id", ondelete="CASCADE"), unique=True, nullable=False)
    student_answer = Column(Text, nullable=False)
    input_mode = Column(String(20), default="text")  # "text", "voice"
    score = Column(Float, default=0.0)  # 0 to 10 scale
    correctness_score = Column(Float, default=0.0)  # 0 to 10
    completeness_score = Column(Float, default=0.0)
    clarity_score = Column(Float, default=0.0)
    relevance_score = Column(Float, default=0.0)
    ai_feedback = Column(Text, nullable=True)
    expected_answer_guide = Column(Text, nullable=True)
    areas_to_improve = Column(Text, default="[]")  # JSON list
    created_at = Column(DateTime, default=datetime.utcnow)

    question = relationship("InterviewQuestion", back_populates="response")
