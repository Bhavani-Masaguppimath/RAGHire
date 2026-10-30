from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.recommendation import LearningRecommendation
from app.models.aptitude import AptitudeAttempt
from app.models.coding import CodingSubmission
from app.models.interview import InterviewSession, InterviewResponse
from app.models.user import StudentProfile
import json

class RecommendationService:
    def generate_personalized_recommendations(self, db: Session, user_id: str) -> List[LearningRecommendation]:
        """
        Synthesizes student results across all modules to create a prioritized preparation roadmap.
        """
        new_recs = []
        
        # 1. Analyze Aptitude Performance
        attempts = db.query(AptitudeAttempt).filter(AptitudeAttempt.user_id == user_id).all()
        if attempts:
            weak_attempts = [a for a in attempts if a.score_percentage < 60.0]
            for wa in weak_attempts[:2]:
                rec_title = f"Revise {wa.category.capitalize()} Aptitude Concepts"
                if not self._rec_exists(db, user_id, rec_title):
                    rec = LearningRecommendation(
                        user_id=user_id,
                        title=rec_title,
                        category="Aptitude",
                        topic=wa.category,
                        priority="high",
                        reason=f"Your recent score on {wa.category} was {wa.score_percentage:.1f}%, below the 70% placement screening cutoff.",
                        suggested_action=f"Complete a 15-question focused practice test on {wa.category} focusing on core formulas.",
                        resource_link="/aptitude"
                    )
                    db.add(rec)
                    new_recs.append(rec)
        else:
            # Cold start: suggest diagnostic test
            if not self._rec_exists(db, user_id, "Attempt Diagnostic Aptitude Mock Test"):
                rec = LearningRecommendation(
                    user_id=user_id,
                    title="Attempt Diagnostic Aptitude Mock Test",
                    category="Aptitude",
                    topic="Quantitative & Logical",
                    priority="high",
                    reason="No aptitude attempts recorded yet. Companies use aptitude tests as first-round filters.",
                    suggested_action="Take an initial 10-minute diagnostic test in Quantitative Aptitude to baseline your readiness.",
                    resource_link="/aptitude"
                )
                db.add(rec)
                new_recs.append(rec)

        # 2. Analyze Coding Submissions
        failed_subs = db.query(CodingSubmission).filter(
            CodingSubmission.user_id == user_id,
            CodingSubmission.status != "ACCEPTED"
        ).all()
        if failed_subs:
            rec_title = "Practice Algorithmic Edge-Case Handling"
            if not self._rec_exists(db, user_id, rec_title):
                rec = LearningRecommendation(
                    user_id=user_id,
                    title=rec_title,
                    category="Coding",
                    topic="Data Structures & Algorithms",
                    priority="high",
                    reason="Recent coding test submissions encountered test-case failures or runtime issues.",
                    suggested_action="Solve 3 Medium-difficulty array/two-pointer problems and verify edge cases (empty inputs, single elements).",
                    resource_link="/coding"
                )
                db.add(rec)
                new_recs.append(rec)
        else:
            if not self._rec_exists(db, user_id, "Solve Target Role Coding Challenges"):
                rec = LearningRecommendation(
                    user_id=user_id,
                    title="Solve Target Role Coding Challenges",
                    category="Coding",
                    topic="Problem Solving",
                    priority="medium",
                    reason="Keep your problem-solving rhythm sharp for online technical assessments (OTAs).",
                    suggested_action="Complete the Two Sum and Longest Substring challenges in the coding workspace.",
                    resource_link="/coding"
                )
                db.add(rec)
                new_recs.append(rec)

        # 3. Analyze Technical & HR Interview Feedback
        sessions = db.query(InterviewSession).filter(
            InterviewSession.user_id == user_id,
            InterviewSession.status == "completed"
        ).all()
        if sessions:
            for s in sessions[:2]:
                if s.overall_score < 7.0:
                    rec_title = f"Strengthen {s.session_type.capitalize()} Interview Answers"
                    if not self._rec_exists(db, user_id, rec_title):
                        rec = LearningRecommendation(
                            user_id=user_id,
                            title=rec_title,
                            category=s.session_type.capitalize(),
                            topic="Technical Articulation",
                            priority="high",
                            reason=f"Interview session score was {s.overall_score:.1f}/10. Clarify depth and structured examples.",
                            suggested_action="Review the AI feedback points, incorporate the suggested model answers, and attempt a re-practice session.",
                            resource_link="/interview"
                        )
                        db.add(rec)
                        new_recs.append(rec)
        else:
            if not self._rec_exists(db, user_id, "Conduct Mock Technical Interview"):
                rec = LearningRecommendation(
                    user_id=user_id,
                    title="Conduct Mock Technical Interview",
                    category="Technical",
                    topic="Core CS Fundamentals",
                    priority="medium",
                    reason="Practicing articulating technical thoughts out loud improves interview confidence significantly.",
                    suggested_action="Start a 5-question technical interview covering DBMS, OS, and System Design.",
                    resource_link="/interview"
                )
                db.add(rec)
                new_recs.append(rec)

        db.commit()
        return db.query(LearningRecommendation).filter(LearningRecommendation.user_id == user_id).all()

    def _rec_exists(self, db: Session, user_id: str, title: str) -> bool:
        return db.query(LearningRecommendation).filter(
            LearningRecommendation.user_id == user_id,
            LearningRecommendation.title == title
        ).first() is not None

recommendation_service = RecommendationService()
