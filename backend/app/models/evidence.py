import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class EvidenceClaim(Base):
    __tablename__ = "evidence_claims"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    claim_text = Column(Text, nullable=False)
    # Source type: "resume", "project_doc", "coding", "technical_interview", "project_defense"
    source_type = Column(String(50), nullable=False)
    source_reference = Column(String(255), nullable=True)  # e.g. "Resume Section: Work Experience", "Project Report pg 4"
    supporting_evidence = Column(Text, nullable=True)  # Excerpts found across documents/sessions
    
    # Statuses as required by prompt:
    # 1. "Supported by available evidence"
    # 2. "Needs clarification"
    # 3. "Not verified from available sources"
    # 4. "Potentially inconsistent"
    status = Column(String(50), default="Not verified from available sources", nullable=False)
    
    confidence_score = Column(Float, default=0.7)
    reasoning = Column(Text, nullable=True)  # Non-accusatory rationale
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="evidence_claims")
    follow_ups = relationship("FollowUpQuestion", back_populates="claim", cascade="all, delete-orphan")


class FollowUpQuestion(Base):
    __tablename__ = "follow_up_questions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    claim_id = Column(String(36), ForeignKey("evidence_claims.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), nullable=False)
    question_text = Column(Text, nullable=False)
    rationale = Column(Text, nullable=False)  # Explaining why this question was prompted
    student_clarification = Column(Text, nullable=True)
    status = Column(String(20), default="pending")  # "pending", "clarified"
    created_at = Column(DateTime, default=datetime.utcnow)
    answered_at = Column(DateTime, nullable=True)

    claim = relationship("EvidenceClaim", back_populates="follow_ups")
