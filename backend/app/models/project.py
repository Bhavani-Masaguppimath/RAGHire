import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    problem_statement = Column(Text, nullable=True)
    objectives = Column(Text, nullable=True)
    technologies = Column(Text, default="[]")  # JSON list of techs
    architecture_overview = Column(Text, nullable=True)
    database_design = Column(Text, nullable=True)
    implementation_details = Column(Text, nullable=True)
    testing_approach = Column(Text, nullable=True)
    challenges_and_solutions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="projects")
    documents = relationship("ProjectDocument", back_populates="project", cascade="all, delete-orphan")


class ProjectDocument(Base):
    __tablename__ = "project_documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50), default="pdf")
    raw_text = Column(Text, nullable=True)
    chunk_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="documents")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String(36), ForeignKey("project_documents.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), nullable=False, index=True)  # Strictly used for tenant isolation
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    embedding = Column(Text, nullable=True)  # JSON-serialized list of floats (embedding vector)
    source_reference = Column(String(255), nullable=True)  # e.g., "Report Section 3.2 - Architecture"
    created_at = Column(DateTime, default=datetime.utcnow)

    document = relationship("ProjectDocument", back_populates="chunks")


class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)  # e.g., "System Design", "DBMS", "DSA"
    topic = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    source_url = Column(String(500), nullable=True)
    is_admin_approved = Column(String(20), default="true")
    created_at = Column(DateTime, default=datetime.utcnow)
