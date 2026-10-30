import json
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User, StudentProfile
from app.schemas.user import ProfileUpdate, ProfileOut

router = APIRouter(prefix="/profile", tags=["Profile"])

# Standard Placement Role Benchmarks
TARGET_ROLES_CATALOG = [
    {
        "role_title": "Full Stack Software Engineer",
        "description": "Design and build end-to-end web applications with modern frontend frameworks and robust backend APIs.",
        "required_skills": ["Python", "JavaScript", "React", "Node.js", "SQL", "Git", "REST APIs", "Docker"],
        "core_subjects": ["Data Structures", "DBMS", "Computer Networks", "OOP"]
    },
    {
        "role_title": "Backend Systems Engineer",
        "description": "High-throughput services, database optimization, caching, microservices, and distributed architecture.",
        "required_skills": ["Python", "Java", "PostgreSQL", "Redis", "Kafka", "Docker", "System Design", "Linux"],
        "core_subjects": ["Operating Systems", "DBMS", "Distributed Systems", "Data Structures & Algorithms"]
    },
    {
        "role_title": "Data & AI Engineer",
        "description": "ETL pipelines, machine learning model integration, vector databases, and big data transformations.",
        "required_skills": ["Python", "SQL", "Pandas", "Scikit-Learn", "FastAPI", "Vector DBs", "Docker"],
        "core_subjects": ["Algorithms", "Linear Algebra", "DBMS", "Statistics"]
    },
    {
        "role_title": "Cloud & DevOps Associate",
        "description": "Automated CI/CD pipelines, container orchestration, infrastructure-as-code, and cloud security.",
        "required_skills": ["Linux", "Docker", "Kubernetes", "AWS", "CI/CD", "Bash", "Terraform", "Git"],
        "core_subjects": ["Computer Networks", "Operating Systems", "Cloud Architecture"]
    }
]

@router.get("/", response_model=ProfileOut)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    skills_list = []
    if profile.skills_json:
        try:
            skills_list = json.loads(profile.skills_json)
        except Exception:
            skills_list = []

    return ProfileOut(
        id=profile.id,
        phone=profile.phone,
        college=profile.college,
        degree=profile.degree,
        graduation_year=profile.graduation_year,
        target_job_role=profile.target_job_role,
        bio=profile.bio,
        experience_level=profile.experience_level,
        github_url=profile.github_url,
        linkedin_url=profile.linkedin_url,
        skills=skills_list,
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )

@router.put("/", response_model=ProfileOut)
def update_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)

    if profile_in.phone is not None:
        profile.phone = profile_in.phone
    if profile_in.college is not None:
        profile.college = profile_in.college
    if profile_in.degree is not None:
        profile.degree = profile_in.degree
    if profile_in.graduation_year is not None:
        profile.graduation_year = profile_in.graduation_year
    if profile_in.target_job_role is not None:
        profile.target_job_role = profile_in.target_job_role
    if profile_in.bio is not None:
        profile.bio = profile_in.bio
    if profile_in.experience_level is not None:
        profile.experience_level = profile_in.experience_level
    if profile_in.github_url is not None:
        profile.github_url = profile_in.github_url
    if profile_in.linkedin_url is not None:
        profile.linkedin_url = profile_in.linkedin_url
    if profile_in.skills is not None:
        profile.skills_json = json.dumps(profile_in.skills)

    db.commit()
    db.refresh(profile)

    skills_list = []
    if profile.skills_json:
        try:
            skills_list = json.loads(profile.skills_json)
        except Exception:
            skills_list = []

    return ProfileOut(
        id=profile.id,
        phone=profile.phone,
        college=profile.college,
        degree=profile.degree,
        graduation_year=profile.graduation_year,
        target_job_role=profile.target_job_role,
        bio=profile.bio,
        experience_level=profile.experience_level,
        github_url=profile.github_url,
        linkedin_url=profile.linkedin_url,
        skills=skills_list,
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )

@router.get("/target-roles")
def get_target_roles():
    return TARGET_ROLES_CATALOG
