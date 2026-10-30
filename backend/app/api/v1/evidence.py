from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.evidence import EvidenceClaim, FollowUpQuestion
from app.schemas.evidence import (
    EvidenceClaimOut,
    EvidenceClaimCreate,
    FollowUpQuestionOut,
    ClarificationSubmit,
    EvidenceSummaryOut
)
from app.services.evidence_engine import evidence_engine

router = APIRouter(prefix="/evidence", tags=["Evidence Traceability Engine"])

@router.get("/", response_model=EvidenceSummaryOut)
def get_evidence_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    claims = db.query(EvidenceClaim).filter(
        EvidenceClaim.user_id == current_user.id
    ).order_by(EvidenceClaim.created_at.desc()).all()

    total = len(claims)
    supported = sum(1 for c in claims if c.status == "Supported by available evidence")
    needs_clarification = sum(1 for c in claims if c.status == "Needs clarification")
    not_verified = sum(1 for c in claims if c.status == "Not verified from available sources")
    inconsistent = sum(1 for c in claims if c.status == "Potentially inconsistent")

    pending_follow_ups = db.query(FollowUpQuestion).filter(
        FollowUpQuestion.user_id == current_user.id,
        FollowUpQuestion.status == "pending"
    ).count()

    # Health score: supported counts full, needs clarification counts half
    health_score = 100.0 if total == 0 else round(
        ((supported * 1.0 + not_verified * 0.7 + needs_clarification * 0.5 + inconsistent * 0.3) / total) * 100.0,
        1
    )

    claims_out = []
    for c in claims:
        fus = db.query(FollowUpQuestion).filter(FollowUpQuestion.claim_id == c.id).all()
        fu_outs = [FollowUpQuestionOut(
            id=f.id,
            claim_id=f.claim_id,
            question_text=f.question_text,
            rationale=f.rationale,
            student_clarification=f.student_clarification,
            status=f.status,
            created_at=f.created_at,
            answered_at=f.answered_at
        ) for f in fus]

        claims_out.append(EvidenceClaimOut(
            id=c.id,
            user_id=c.user_id,
            claim_text=c.claim_text,
            source_type=c.source_type,
            source_reference=c.source_reference,
            supporting_evidence=c.supporting_evidence,
            status=c.status,
            confidence_score=c.confidence_score,
            reasoning=c.reasoning,
            created_at=c.created_at,
            updated_at=c.updated_at,
            follow_ups=fu_outs
        ))

    return EvidenceSummaryOut(
        total_claims=total,
        supported_count=supported,
        needs_clarification_count=needs_clarification,
        not_verified_count=not_verified,
        potentially_inconsistent_count=inconsistent,
        pending_follow_ups=pending_follow_ups,
        consistency_health_score=health_score,
        claims=claims_out
    )

@router.post("/claims", response_model=EvidenceClaimOut)
def create_claim(
    claim_in: EvidenceClaimCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    claim = EvidenceClaim(
        user_id=current_user.id,
        claim_text=claim_in.claim_text,
        source_type=claim_in.source_type,
        source_reference=claim_in.source_reference,
        supporting_evidence=claim_in.supporting_evidence,
        status=claim_in.status or "Needs clarification",
        confidence_score=claim_in.confidence_score or 0.75,
        reasoning=claim_in.reasoning or "Recorded candidate claim from placement materials."
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)

    return EvidenceClaimOut(
        id=claim.id,
        user_id=claim.user_id,
        claim_text=claim.claim_text,
        source_type=claim.source_type,
        source_reference=claim.source_reference,
        supporting_evidence=claim.supporting_evidence,
        status=claim.status,
        confidence_score=claim.confidence_score,
        reasoning=claim.reasoning,
        created_at=claim.created_at,
        updated_at=claim.updated_at,
        follow_ups=[]
    )

@router.post("/follow-ups/{follow_up_id}/clarify", response_model=FollowUpQuestionOut)
def clarify_follow_up(
    follow_up_id: str,
    payload: ClarificationSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not payload.clarification_text.strip():
        raise HTTPException(status_code=400, detail="Clarification response cannot be empty.")
        
    try:
        fq = evidence_engine.record_student_clarification(
            db, follow_up_id, current_user.id, payload.clarification_text
        )
        return FollowUpQuestionOut(
            id=fq.id,
            claim_id=fq.claim_id,
            question_text=fq.question_text,
            rationale=fq.rationale,
            student_clarification=fq.student_clarification,
            status=fq.status,
            created_at=fq.created_at,
            answered_at=fq.answered_at
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
