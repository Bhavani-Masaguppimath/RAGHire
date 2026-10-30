from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.recommendation import LearningRecommendation
from app.schemas.recommendation import RecommendationOut, RecommendationUpdate
from app.services.recommendation_service import recommendation_service

router = APIRouter(prefix="/recommendations", tags=["Personalized Learning Plan"])

@router.get("/", response_model=List[RecommendationOut])
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    recs = db.query(LearningRecommendation).filter(
        LearningRecommendation.user_id == current_user.id
    ).order_by(LearningRecommendation.is_completed, LearningRecommendation.created_at.desc()).all()
    
    if not recs:
        # Generate initial recommendations
        recs = recommendation_service.generate_personalized_recommendations(db, current_user.id)
    return recs

@router.post("/refresh", response_model=List[RecommendationOut])
def refresh_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    recs = recommendation_service.generate_personalized_recommendations(db, current_user.id)
    return recs

@router.patch("/{recommendation_id}/toggle", response_model=RecommendationOut)
def toggle_recommendation(
    recommendation_id: str,
    payload: RecommendationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rec = db.query(LearningRecommendation).filter(
        LearningRecommendation.id == recommendation_id,
        LearningRecommendation.user_id == current_user.id
    ).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found.")

    rec.is_completed = payload.is_completed
    rec.completed_at = datetime.utcnow() if payload.is_completed else None
    db.commit()
    db.refresh(rec)
    return rec
