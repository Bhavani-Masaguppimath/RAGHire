from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class InterviewStartRequest(BaseModel):
    session_type: str = "technical"  # "technical", "hr", "project_defense"
    target_role: Optional[str] = "Full Stack Software Engineer"
    subjects: List[str] = ["DSA", "DBMS", "Operating Systems"]
    difficulty: str = "medium"
    total_questions: int = 5
    project_id: Optional[str] = None  # If project defense

class InterviewQuestionOut(BaseModel):
    id: str
    session_id: str
    question_order: int
    question_text: str
    category: str
    source_reference: Optional[str] = None

class InterviewAnswerSubmit(BaseModel):
    question_id: str
    student_answer: str
    input_mode: str = "text"  # "text" or "voice"

class InterviewEvaluationOut(BaseModel):
    response_id: str
    score: float  # 0 to 10
    correctness_score: float
    completeness_score: float
    clarity_score: float
    relevance_score: float
    ai_feedback: str
    expected_answer_guide: str
    areas_to_improve: List[str] = []
    cross_round_claim_identified: Optional[Dict[str, Any]] = None

class InterviewResponseOut(BaseModel):
    id: str
    question_id: str
    student_answer: str
    input_mode: str
    score: float
    correctness_score: float
    completeness_score: float
    clarity_score: float
    relevance_score: float
    ai_feedback: Optional[str] = None
    expected_answer_guide: Optional[str] = None
    areas_to_improve: List[str] = []
    created_at: datetime

class InterviewSessionDetailOut(BaseModel):
    id: str
    user_id: str
    session_type: str
    target_role: str
    subjects: List[str] = []
    difficulty: str
    total_questions: int
    status: str
    overall_score: float
    feedback_summary: Optional[str] = None
    created_at: datetime
    questions: List[Dict[str, Any]] = []

    class Config:
        from_attributes = True
