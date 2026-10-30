import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.aptitude import AptitudeQuestion, AptitudeAttempt
from app.schemas.aptitude import (
    AptitudeQuestionOut, 
    AptitudeTestSubmit, 
    AptitudeAttemptOut,
    QuestionReviewItem
)

router = APIRouter(prefix="/aptitude", tags=["Aptitude Preparation"])

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = ["quantitative", "logical", "verbal", "analytical"]
    result = []
    for cat in categories:
        count = db.query(AptitudeQuestion).filter(AptitudeQuestion.category == cat).count()
        topics = db.query(AptitudeQuestion.topic).filter(AptitudeQuestion.category == cat).distinct().all()
        result.append({
            "category": cat,
            "display_name": cat.capitalize() + " Aptitude" if cat == "quantitative" else cat.capitalize() + " Ability" if cat == "verbal" else cat.capitalize() + " Reasoning",
            "question_count": count,
            "topics": [t[0] for t in topics]
        })
    return result

@router.get("/questions", response_model=List[AptitudeQuestionOut])
def get_questions(
    category: str = Query("quantitative"),
    difficulty: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    limit: int = Query(10, le=50),
    db: Session = Depends(get_db)
):
    query = db.query(AptitudeQuestion).filter(AptitudeQuestion.category == category)
    if difficulty:
        query = query.filter(AptitudeQuestion.difficulty == difficulty)
    if topic:
        query = query.filter(AptitudeQuestion.topic == topic)
    
    questions = query.limit(limit).all()
    
    out = []
    for q in questions:
        opts = json.loads(q.options) if isinstance(q.options, str) else q.options
        out.append(AptitudeQuestionOut(
            id=q.id,
            category=q.category,
            topic=q.topic,
            difficulty=q.difficulty,
            question_text=q.question_text,
            options=opts
        ))
    return out

@router.post("/submit-test", response_model=AptitudeAttemptOut)
def submit_aptitude_test(
    submission: AptitudeTestSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch all questions submitted
    question_ids = list(submission.user_answers.keys())
    if not question_ids:
        raise HTTPException(status_code=400, detail="No answers provided in test submission.")

    questions = db.query(AptitudeQuestion).filter(AptitudeQuestion.id.in_(question_ids)).all()
    q_map = {q.id: q for q in questions}

    correct_count = 0
    detailed_review = []

    for q_id, selected_idx in submission.user_answers.items():
        q = q_map.get(q_id)
        if not q:
            continue
        is_correct = (selected_idx == q.correct_option_index)
        if is_correct:
            correct_count += 1
        
        opts = json.loads(q.options) if isinstance(q.options, str) else q.options
        detailed_review.append(QuestionReviewItem(
            question_id=q.id,
            question_text=q.question_text,
            options=opts,
            selected_option=selected_idx,
            correct_option=q.correct_option_index,
            is_correct=is_correct,
            explanation=q.explanation
        ))

    total = len(questions)
    percentage = round((correct_count / max(1, total)) * 100.0, 1)

    attempt = AptitudeAttempt(
        user_id=current_user.id,
        category=submission.category,
        difficulty=submission.difficulty,
        total_questions=total,
        correct_count=correct_count,
        score_percentage=percentage,
        time_taken_seconds=submission.time_taken_seconds,
        user_answers=json.dumps(submission.user_answers),
        detailed_review=json.dumps([item.dict() for item in detailed_review])
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return AptitudeAttemptOut(
        id=attempt.id,
        user_id=attempt.user_id,
        category=attempt.category,
        difficulty=attempt.difficulty,
        total_questions=attempt.total_questions,
        correct_count=attempt.correct_count,
        score_percentage=attempt.score_percentage,
        time_taken_seconds=attempt.time_taken_seconds,
        detailed_review=detailed_review,
        created_at=attempt.created_at
    )

@router.get("/history", response_model=List[AptitudeAttemptOut])
def get_attempt_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    attempts = db.query(AptitudeAttempt).filter(
        AptitudeAttempt.user_id == current_user.id
    ).order_by(AptitudeAttempt.created_at.desc()).all()

    out = []
    for a in attempts:
        reviews = []
        if a.detailed_review:
            try:
                raw_revs = json.loads(a.detailed_review)
                reviews = [QuestionReviewItem(**r) for r in raw_revs]
            except Exception:
                reviews = []
        out.append(AptitudeAttemptOut(
            id=a.id,
            user_id=a.user_id,
            category=a.category,
            difficulty=a.difficulty,
            total_questions=a.total_questions,
            correct_count=a.correct_count,
            score_percentage=a.score_percentage,
            time_taken_seconds=a.time_taken_seconds,
            detailed_review=reviews,
            created_at=a.created_at
        ))
    return out
