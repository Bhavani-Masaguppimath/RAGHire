import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Integer, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class CodingProblem(Base):
    __tablename__ = "coding_problems"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    difficulty = Column(String(20), default="medium")  # "easy", "medium", "hard"
    topic = Column(String(100), default="Arrays")  # "Arrays", "Strings", "Dynamic Programming", etc.
    description = Column(Text, nullable=False)
    constraints = Column(Text, nullable=True)
    input_format = Column(Text, nullable=True)
    output_format = Column(Text, nullable=True)
    sample_input = Column(Text, nullable=True)
    sample_output = Column(Text, nullable=True)
    sample_explanation = Column(Text, nullable=True)
    python_starter_code = Column(Text, nullable=False)
    java_starter_code = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    test_cases = relationship("TestCase", back_populates="problem", cascade="all, delete-orphan")
    submissions = relationship("CodingSubmission", back_populates="problem", cascade="all, delete-orphan")


class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    problem_id = Column(String(36), ForeignKey("coding_problems.id", ondelete="CASCADE"), nullable=False)
    input_data = Column(Text, nullable=False)
    expected_output = Column(Text, nullable=False)
    is_hidden = Column(String(10), default="true")  # "false" for sample, "true" for submission
    created_at = Column(DateTime, default=datetime.utcnow)

    problem = relationship("CodingProblem", back_populates="test_cases")


class CodingSubmission(Base):
    __tablename__ = "coding_submissions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    problem_id = Column(String(36), ForeignKey("coding_problems.id", ondelete="CASCADE"), nullable=False)
    language = Column(String(50), default="python")  # "python", "java"
    source_code = Column(Text, nullable=False)
    status = Column(String(50), default="PENDING")  # "ACCEPTED", "WRONG_ANSWER", "RUNTIME_ERROR", "COMPILE_ERROR"
    test_cases_passed = Column(Integer, default=0)
    total_test_cases = Column(Integer, default=0)
    runtime_ms = Column(Float, default=0.0)
    memory_kb = Column(Float, default=0.0)
    execution_details = Column(Text, default="{}")  # JSON details of test case outputs
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="coding_submissions")
    problem = relationship("CodingProblem", back_populates="submissions")
