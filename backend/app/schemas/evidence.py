from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class FollowUpQuestionOut(BaseModel):
    id: str
    claim_id: str
    question_text: str
    rationale: str
    student_clarification: Optional[str] = None
    status: str  # "pending", "clarified"
    created_at: datetime
    answered_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ClarificationSubmit(BaseModel):
    clarification_text: str

class EvidenceClaimOut(BaseModel):
    id: str
    user_id: str
    claim_text: str
    source_type: str
    source_reference: Optional[str] = None
    supporting_evidence: Optional[str] = None
    status: str
    confidence_score: float
    reasoning: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    follow_ups: List[FollowUpQuestionOut] = []

    class Config:
        from_attributes = True

class EvidenceClaimCreate(BaseModel):
    claim_text: str
    source_type: str
    source_reference: Optional[str] = None
    supporting_evidence: Optional[str] = None
    status: Optional[str] = "Needs clarification"
    confidence_score: Optional[float] = 0.75
    reasoning: Optional[str] = None

class EvidenceSummaryOut(BaseModel):
    total_claims: int
    supported_count: int
    needs_clarification_count: int
    not_verified_count: int
    potentially_inconsistent_count: int
    pending_follow_ups: int
    consistency_health_score: float
    claims: List[EvidenceClaimOut] = []
