from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class ResumeUpdateParsed(BaseModel):
    parsed_skills: Optional[List[str]] = None
    parsed_experience: Optional[List[Dict[str, Any]]] = None
    parsed_education: Optional[List[Dict[str, Any]]] = None
    target_job_role: Optional[str] = None

class ResumeOut(BaseModel):
    id: str
    user_id: str
    filename: str
    file_size: int
    raw_text: Optional[str] = None
    parsed_skills: List[str] = []
    parsed_experience: List[Dict[str, Any]] = []
    parsed_education: List[Dict[str, Any]] = []
    match_score: float = 0.0
    matching_skills: List[str] = []
    missing_skills: List[str] = []
    suggested_topics: List[str] = []
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ResumeAnalysisResponse(BaseModel):
    resume_id: str
    target_role: str
    match_percentage: float
    matching_skills: List[str]
    missing_skills: List[str]
    suggested_topics: List[str]
    extracted_summary: Dict[str, Any]
    demo_mode: bool = False
