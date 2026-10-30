import os
import uuid
import json
import re
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User, StudentProfile
from app.models.resume import Resume
from app.schemas.resume import ResumeOut, ResumeAnalysisResponse, ResumeUpdateParsed
from app.services.rag_service import rag_service
from app.services.evidence_engine import evidence_engine
from app.api.v1.profile import TARGET_ROLES_CATALOG

router = APIRouter(prefix="/resume", tags=["Resume Analysis"])

# Placement Skill Dictionary for candidates across all academic streams
KNOWN_SKILLS = [
    "Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "SQL", "HTML", "CSS",
    "React", "Node.js", "Express", "FastAPI", "Django", "Flask", "Spring Boot",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite",
    "Docker", "Kubernetes", "AWS", "Git", "GitHub", "CI/CD", "Linux",
    "Data Structures", "Algorithms", "Machine Learning", "REST APIs", "GraphQL",
    "System Design", "Microservices", "DBMS", "Operating Systems", "Computer Networks"
]

def extract_skills_heuristic(text: str) -> List[str]:
    found = set()
    lower_text = text.lower()
    for skill in KNOWN_SKILLS:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, lower_text):
            found.add(skill)
    return sorted(list(found))

@router.post("/upload", response_model=ResumeAnalysisResponse)
async def upload_resume(
    file: UploadFile = File(...),
    target_role: str = Form("Full Stack Software Engineer"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type. Please upload a {', '.join(settings.ALLOWED_EXTENSIONS)} file."
        )

    # 2. Save file safely
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    saved_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, saved_filename)
    
    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum size limit of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    with open(file_path, "wb") as f:
        f.write(contents)

    # 3. Extract text
    raw_text = rag_service.extract_text(file_path, ext)

    # 4. Extract skills & analyze vs target role
    extracted_skills = extract_skills_heuristic(raw_text)
    if not extracted_skills:
        # Fallback starter skills for demo
        extracted_skills = ["Python", "SQL", "Git", "Data Structures"]

    # Benchmark against target role
    role_info = next((r for r in TARGET_ROLES_CATALOG if r["role_title"].lower() == target_role.lower()), TARGET_ROLES_CATALOG[0])
    req_skills = role_info["required_skills"]

    matching_skills = [s for s in extracted_skills if any(s.lower() == req.lower() for req in req_skills)]
    missing_skills = [req for req in req_skills if not any(s.lower() == req.lower() for s in extracted_skills)]
    
    match_percentage = round((len(matching_skills) / max(1, len(req_skills))) * 100.0, 1)

    suggested_topics = role_info["core_subjects"] + [f"Deep dive into {m}" for m in missing_skills[:2]]

    # Deactivate previous active resumes
    db.query(Resume).filter(Resume.user_id == current_user.id).update({"is_active": False})

    # Save Resume Record
    resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        file_size=len(contents),
        raw_text=raw_text[:5000],  # store first 5k chars for preview
        parsed_skills=json.dumps(extracted_skills),
        parsed_experience=json.dumps([{"title": "Academic & Practical Software Projects", "company": "Capstone Engineering Coursework", "duration": "2024-2026"}]),
        parsed_education=json.dumps([{"degree": "Bachelor / Master in Technology, Science, or Allied Disciplines", "year": "2024-2026"}]),
        match_score=match_percentage,
        matching_skills=json.dumps(matching_skills),
        missing_skills=json.dumps(missing_skills),
        suggested_topics=json.dumps(suggested_topics),
        is_active=True
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    # Update student profile skills & target role
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if profile:
        profile.skills_json = json.dumps(extracted_skills)
        profile.target_job_role = target_role
        db.commit()

    # Trigger Cross-Round Evidence Traceability Engine claim extraction
    evidence_engine.analyze_resume_claims(db, current_user.id, resume)

    return ResumeAnalysisResponse(
        resume_id=resume.id,
        target_role=target_role,
        match_percentage=match_percentage,
        matching_skills=matching_skills,
        missing_skills=missing_skills,
        suggested_topics=suggested_topics,
        extracted_summary={
            "filename": file.filename,
            "skills_count": len(extracted_skills),
            "skills": extracted_skills
        },
        demo_mode=settings.DEMO_MODE
    )

@router.get("/active", response_model=ResumeOut)
def get_active_resume(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(
        Resume.user_id == current_user.id,
        Resume.is_active == True
    ).order_by(Resume.created_at.desc()).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="No active resume found for this user.")

    return ResumeOut(
        id=resume.id,
        user_id=resume.user_id,
        filename=resume.filename,
        file_size=resume.file_size,
        raw_text=resume.raw_text,
        parsed_skills=json.loads(resume.parsed_skills) if resume.parsed_skills else [],
        parsed_experience=json.loads(resume.parsed_experience) if resume.parsed_experience else [],
        parsed_education=json.loads(resume.parsed_education) if resume.parsed_education else [],
        match_score=resume.match_score,
        matching_skills=json.loads(resume.matching_skills) if resume.matching_skills else [],
        missing_skills=json.loads(resume.missing_skills) if resume.missing_skills else [],
        suggested_topics=json.loads(resume.suggested_topics) if resume.suggested_topics else [],
        is_active=resume.is_active,
        created_at=resume.created_at
    )

@router.put("/edit-extracted", response_model=ResumeOut)
def edit_extracted_details(
    updates: ResumeUpdateParsed,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(
        Resume.user_id == current_user.id,
        Resume.is_active == True
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No active resume found.")

    if updates.parsed_skills is not None:
        resume.parsed_skills = json.dumps(updates.parsed_skills)
        # Re-evaluate matching vs target role
        target_role = updates.target_job_role or "Full Stack Software Engineer"
        role_info = next((r for r in TARGET_ROLES_CATALOG if r["role_title"].lower() == target_role.lower()), TARGET_ROLES_CATALOG[0])
        req_skills = role_info["required_skills"]
        matching = [s for s in updates.parsed_skills if any(s.lower() == req.lower() for req in req_skills)]
        missing = [req for req in req_skills if not any(s.lower() == req.lower() for s in updates.parsed_skills)]
        resume.match_score = round((len(matching) / max(1, len(req_skills))) * 100.0, 1)
        resume.matching_skills = json.dumps(matching)
        resume.missing_skills = json.dumps(missing)

    if updates.parsed_experience is not None:
        resume.parsed_experience = json.dumps(updates.parsed_experience)
    if updates.parsed_education is not None:
        resume.parsed_education = json.dumps(updates.parsed_education)

    db.commit()
    db.refresh(resume)

    return ResumeOut(
        id=resume.id,
        user_id=resume.user_id,
        filename=resume.filename,
        file_size=resume.file_size,
        raw_text=resume.raw_text,
        parsed_skills=json.loads(resume.parsed_skills) if resume.parsed_skills else [],
        parsed_experience=json.loads(resume.parsed_experience) if resume.parsed_experience else [],
        parsed_education=json.loads(resume.parsed_education) if resume.parsed_education else [],
        match_score=resume.match_score,
        matching_skills=json.loads(resume.matching_skills) if resume.matching_skills else [],
        missing_skills=json.loads(resume.missing_skills) if resume.missing_skills else [],
        suggested_topics=json.loads(resume.suggested_topics) if resume.suggested_topics else [],
        is_active=resume.is_active,
        created_at=resume.created_at
    )

@router.post("/load-sample", response_model=ResumeAnalysisResponse)
def load_sample_resume(
    target_role: str = "Full Stack Software Engineer",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sample_skills = ["Python", "Java", "JavaScript", "TypeScript", "FastAPI", "React", "PostgreSQL", "Redis", "Docker", "Algorithms", "DBMS", "Operating Systems", "Microservices"]
    role_info = next((r for r in TARGET_ROLES_CATALOG if r["role_title"].lower() == target_role.lower()), TARGET_ROLES_CATALOG[0])
    req_skills = role_info["required_skills"]

    matching_skills = [s for s in sample_skills if any(s.lower() == req.lower() for req in req_skills)]
    missing_skills = [req for req in req_skills if not any(s.lower() == req.lower() for s in sample_skills)]
    match_percentage = round((len(matching_skills) / max(1, len(req_skills))) * 100.0, 1)
    suggested_topics = role_info["core_subjects"] + [f"Deep dive into {m}" for m in missing_skills[:2]]

    db.query(Resume).filter(Resume.user_id == current_user.id).update({"is_active": False})

    resume = Resume(
        user_id=current_user.id,
        filename="Aarav_Sharma_Resume.docx",
        file_path="uploads/sample_aarav_resume.docx",
        file_size=38200,
        raw_text="Aarav Sharma | Software Engineering Candidate | Full Stack Developer | Python, FastAPI, React, Redis, Docker, PostgreSQL...",
        parsed_skills=json.dumps(sample_skills),
        parsed_experience=json.dumps([{"title": "E-Commerce Microservices Engine", "company": "Capstone Engineering Project", "duration": "2024-2026"}]),
        parsed_education=json.dumps([{"degree": "Bachelor of Technology / Computer Science & Allied Streams", "year": "2024-2026"}]),
        match_score=match_percentage,
        matching_skills=json.dumps(matching_skills),
        missing_skills=json.dumps(missing_skills),
        suggested_topics=json.dumps(suggested_topics),
        is_active=True
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if profile:
        profile.skills_json = json.dumps(sample_skills)
        profile.target_job_role = target_role
        db.commit()

    evidence_engine.analyze_resume_claims(db, current_user.id, resume)

    return ResumeAnalysisResponse(
        resume_id=resume.id,
        target_role=target_role,
        match_percentage=match_percentage,
        matching_skills=matching_skills,
        missing_skills=missing_skills,
        suggested_topics=suggested_topics,
        extracted_summary={
            "filename": "Aarav_Sharma_Resume.docx",
            "skills_count": len(sample_skills),
            "skills": sample_skills
        },
        demo_mode=True
    )

