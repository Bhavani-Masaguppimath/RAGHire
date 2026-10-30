from typing import Optional, List, Dict
from datetime import datetime
from pydantic import BaseModel

class AptitudeQuestionOut(BaseModel):
    id: str
    category: str
    topic: str
    difficulty: str
    question_text: str
    options: List[str]
    # correct_option_index is excluded during test to avoid cheating

class AptitudeQuestionCreate(BaseModel):
    category: str
    topic: str
    difficulty: str
    question_text: str
    options: List[str]
    correct_option_index: int
    explanation: str

class AptitudeTestSubmit(BaseModel):
    category: str
    difficulty: str
    time_taken_seconds: int
    user_answers: Dict[str, int]  # question_id -> selected_index

class QuestionReviewItem(BaseModel):
    question_id: str
    question_text: str
    options: List[str]
    selected_option: Optional[int] = None
    correct_option: int
    is_correct: bool
    explanation: str

class AptitudeAttemptOut(BaseModel):
    id: str
    user_id: str
    category: str
    difficulty: str
    total_questions: int
    correct_count: int
    score_percentage: float
    time_taken_seconds: int
    detailed_review: List[QuestionReviewItem] = []
    created_at: datetime

    class Config:
        from_attributes = True
