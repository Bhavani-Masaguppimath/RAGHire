from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.evidence import EvidenceClaim, FollowUpQuestion
from app.models.resume import Resume
from app.models.project import Project, DocumentChunk
from app.models.coding import CodingSubmission
from app.models.interview import InterviewResponse, InterviewQuestion

class EvidenceTraceabilityEngine:
    """
    Cross-Round Evidence Traceability and Adaptive Follow-Up Engine.
    
    Principles:
    1. Cross-references claims across: Resume, Project Documents, Coding tests, Technical Interviews.
    2. Formulates respectful, constructive follow-up inquiries.
    3. Never labels students as dishonest.
    4. Explicitly acknowledges that absence of evidence != false claim.
    5. Main status categories:
       - Supported by available evidence
       - Needs clarification
       - Not verified from available sources
       - Potentially inconsistent
    """

    def analyze_resume_claims(self, db: Session, user_id: str, resume: Resume) -> List[EvidenceClaim]:
        """Extracts technical claims from a parsed resume and verifies against other rounds."""
        import json
        skills = []
        if resume.parsed_skills:
            try:
                skills = json.loads(resume.parsed_skills) if isinstance(resume.parsed_skills, str) else resume.parsed_skills
            except Exception:
                skills = []

        claims_created = []
        for skill in skills[:5]:  # Process top key claimed skills
            existing = db.query(EvidenceClaim).filter(
                EvidenceClaim.user_id == user_id,
                EvidenceClaim.claim_text.like(f"%Proficient in {skill}%")
            ).first()
            if existing:
                continue

            # Check if this skill appears in project documents or coding submissions
            supporting = self._search_corroborating_evidence(db, user_id, skill)
            
            if supporting:
                status = "Supported by available evidence"
                reasoning = f"Corroborating implementation details found across project documentation regarding {skill}."
                follow_up = None
            else:
                status = "Needs clarification"
                reasoning = (
                    f"'{skill}' is prominently featured on your resume, but the current project documents and assessment submissions "
                    f"do not yet detail your practical implementation experience with it."
                )
                follow_up = (
                    f"Could you describe a challenging technical problem you solved using {skill}, "
                    f"and explain the architecture or libraries you leveraged?"
                )

            claim = EvidenceClaim(
                user_id=user_id,
                claim_text=f"Demonstrated proficiency and hands-on experience in {skill}",
                source_type="resume",
                source_reference=f"Resume file: {resume.filename}",
                supporting_evidence=supporting or "No project documents or coding test submissions reference this technology yet.",
                status=status,
                confidence_score=0.85 if supporting else 0.65,
                reasoning=reasoning
            )
            db.add(claim)
            db.flush()

            if follow_up:
                fq = FollowUpQuestion(
                    claim_id=claim.id,
                    user_id=user_id,
                    question_text=follow_up,
                    rationale=reasoning,
                    status="pending"
                )
                db.add(fq)
            claims_created.append(claim)

        db.commit()
        return claims_created

    def register_interview_cross_check(
        self, 
        db: Session, 
        user_id: str, 
        question_text: str, 
        student_answer: str, 
        subject: str
    ) -> Optional[EvidenceClaim]:
        """Cross-checks an interview answer against claimed skills or project architecture."""
        lower_ans = student_answer.lower()
        
        # Check if answer touches on scalability/caching claims
        if any(w in lower_ans for w in ["redis", "kafka", "microservice", "docker", "indexed", "normalized"]):
            claim_text = f"Applied {subject} best practices in system implementation: '{student_answer[:120]}...'"
            
            # Check for potential inconsistency (e.g., claiming Redis in resume but stating in-memory array in interview)
            status = "Supported by available evidence"
            reasoning = "Technical interview explanation aligns with system design principles and documented project patterns."
            follow_up = None

            if "never used" in lower_ans or "didn't implement" in lower_ans:
                status = "Potentially inconsistent"
                reasoning = (
                    "Your interview response notes this technology was not personally implemented, "
                    "whereas it was highlighted in the project summary."
                )
                follow_up = (
                    "Could you clarify the distribution of responsibilities within your team project "
                    "regarding this specific component?"
                )

            claim = EvidenceClaim(
                user_id=user_id,
                claim_text=claim_text,
                source_type="technical_interview",
                source_reference=f"Interview Question: {question_text[:80]}",
                supporting_evidence=f"Student response transcript: {student_answer[:200]}",
                status=status,
                confidence_score=0.88,
                reasoning=reasoning
            )
            db.add(claim)
            db.flush()

            if follow_up:
                fq = FollowUpQuestion(
                    claim_id=claim.id,
                    user_id=user_id,
                    question_text=follow_up,
                    rationale=reasoning,
                    status="pending"
                )
                db.add(fq)
            
            db.commit()
            return claim
        return None

    def record_student_clarification(
        self, 
        db: Session, 
        follow_up_id: str, 
        user_id: str, 
        clarification: str
    ) -> FollowUpQuestion:
        fq = db.query(FollowUpQuestion).filter(
            FollowUpQuestion.id == follow_up_id,
            FollowUpQuestion.user_id == user_id
        ).first()
        if not fq:
            raise ValueError("Follow-up question not found")

        fq.student_clarification = clarification
        fq.status = "clarified"
        fq.answered_at = datetime.utcnow()

        # Update parent claim status to Supported or Clarified
        claim = db.query(EvidenceClaim).filter(EvidenceClaim.id == fq.claim_id).first()
        if claim:
            claim.status = "Supported by available evidence"
            claim.supporting_evidence = (
                f"{claim.supporting_evidence or ''}\n\n[Student Clarification - {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}]: {clarification}"
            )
            claim.reasoning = "Candidate provided verified contextual explanation and architectural breakdown."
            claim.confidence_score = 0.92

        db.commit()
        db.refresh(fq)
        return fq

    def _search_corroborating_evidence(self, db: Session, user_id: str, keyword: str) -> Optional[str]:
        """Search across project documents and coding submissions for mentions of keyword."""
        # 1. Project chunks
        chunk = db.query(DocumentChunk).filter(
            DocumentChunk.user_id == user_id,
            DocumentChunk.content.ilike(f"%{keyword}%")
        ).first()
        if chunk:
            return f"Found in Project Document ({chunk.source_reference}): '{chunk.content[:160]}...'"

        # 2. Project technologies or descriptions
        project = db.query(Project).filter(
            Project.user_id == user_id,
            (Project.technologies.ilike(f"%{keyword}%") | Project.architecture_overview.ilike(f"%{keyword}%"))
        ).first()
        if project:
            return f"Documented in Project '{project.title}': Tech stack & Architecture section."

        # 3. Coding submissions
        submission = db.query(CodingSubmission).filter(
            CodingSubmission.user_id == user_id,
            CodingSubmission.status == "ACCEPTED"
        ).first()
        if submission and keyword.lower() in ["python", "java", "dsa", "algorithms"]:
            return f"Verified via Coding Assessment: Solved problem {submission.problem_id} with status ACCEPTED."

        return None

evidence_engine = EvidenceTraceabilityEngine()
