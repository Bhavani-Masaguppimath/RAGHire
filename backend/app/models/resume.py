import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, Integer, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, default=0)
    raw_text = Column(Text, nullable=True)
    parsed_skills = Column(Text, default="[]")  # JSON list of extracted skills
    parsed_experience = Column(Text, default="[]")  # JSON list of work/projects
    parsed_education = Column(Text, default="[]")  # JSON list of education records
    match_score = Column(Float, default=0.0)
    matching_skills = Column(Text, default="[]")  # JSON list
    missing_skills = Column(Text, default="[]")  # JSON list
    suggested_topics = Column(Text, default="[]")  # JSON list
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="resumes")
