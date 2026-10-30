import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class LearningRecommendation(Base):
    __tablename__ = "learning_recommendations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)  # "Aptitude", "Coding", "Technical", "HR", "Project Defense"
    topic = Column(String(100), nullable=False)
    priority = Column(String(20), default="medium")  # "high", "medium", "low"
    reason = Column(Text, nullable=False)  # e.g., "Aptitude score on Time & Work was below 60%"
    suggested_action = Column(Text, nullable=False)
    resource_link = Column(String(255), nullable=True)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="recommendations")
