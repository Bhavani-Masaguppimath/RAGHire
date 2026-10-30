from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class ProjectCreate(BaseModel):
    title: str
    problem_statement: Optional[str] = None
    objectives: Optional[str] = None
    technologies: List[str] = []
    architecture_overview: Optional[str] = None
    database_design: Optional[str] = None
    implementation_details: Optional[str] = None
    testing_approach: Optional[str] = None
    challenges_and_solutions: Optional[str] = None

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    problem_statement: Optional[str] = None
    objectives: Optional[str] = None
    technologies: Optional[List[str]] = None
    architecture_overview: Optional[str] = None
    database_design: Optional[str] = None
    implementation_details: Optional[str] = None
    testing_approach: Optional[str] = None
    challenges_and_solutions: Optional[str] = None

class ProjectDocumentOut(BaseModel):
    id: str
    project_id: str
    filename: str
    file_type: str
    chunk_count: int
    created_at: datetime

    class Config:
        from_attributes = True

class ProjectOut(BaseModel):
    id: str
    user_id: str
    title: str
    problem_statement: Optional[str] = None
    objectives: Optional[str] = None
    technologies: List[str] = []
    architecture_overview: Optional[str] = None
    database_design: Optional[str] = None
    implementation_details: Optional[str] = None
    testing_approach: Optional[str] = None
    challenges_and_solutions: Optional[str] = None
    documents: List[ProjectDocumentOut] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DefenseQuestionOut(BaseModel):
    question_id: str
    question_text: str
    category: str
    expected_concepts: List[str] = []
    source_reference: Optional[str] = None

class DefenseEvaluationOut(BaseModel):
    score: float
    correctness: float
    completeness: float
    clarity: float
    relevance: float
    ai_feedback: str
    expected_answer_guide: str
    source_citation: Optional[str] = None
    identified_evidence: Optional[Dict[str, Any]] = None
