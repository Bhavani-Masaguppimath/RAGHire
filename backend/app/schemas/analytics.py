from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class DashboardMetricsOut(BaseModel):
    placement_readiness_score: float  # 0 to 100
    aptitude_accuracy: float  # 0 to 100
    coding_pass_rate: float  # 0 to 100
    technical_interview_score: float  # 0 to 10
    hr_communication_score: float  # 0 to 10
    project_defense_score: float  # 0 to 10
    evidence_consistency_score: float  # 0 to 100
    
    total_aptitude_attempts: int
    total_coding_submissions: int
    total_interviews_completed: int
    total_evidence_claims: int
    
    strong_topics: List[str] = []
    weak_topics: List[str] = []
    recent_activities: List[Dict[str, Any]] = []

class SessionHistoryItem(BaseModel):
    id: str
    activity_type: str  # "Aptitude", "Coding", "Technical Interview", "HR Interview", "Project Defense"
    title: str
    score_label: str
    score_value: float
    status: str
    timestamp: datetime
