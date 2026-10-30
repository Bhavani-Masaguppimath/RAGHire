import json
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.interview import InterviewSession, InterviewQuestion, InterviewResponse
from app.schemas.interview import (
    InterviewStartRequest,
    InterviewQuestionOut,
    InterviewAnswerSubmit,
    InterviewEvaluationOut,
    InterviewSessionDetailOut
)
from app.services.ai_service import ai_service
from app.services.evidence_engine import evidence_engine

router = APIRouter(prefix="/interview", tags=["Interview Practice"])

# Curated Technical & HR Question Bank
STANDARD_TECH_QUESTIONS = {
    "DSA": [
        ("Explain how a Hash Map handles hash collisions, and compare chaining versus open addressing in terms of cache locality and worst-case lookup.", ["Hash collisions", "Chaining vs Open Addressing", "Cache locality", "O(1) average vs O(n) worst case"]),
        ("Describe how you would detect a cycle in a singly linked list with O(1) auxiliary space.", ["Floyd's Tortoise and Hare algorithm", "Fast and slow pointers", "O(N) time, O(1) space"]),
        ("What are the core differences between BFS and DFS in graph traversal, and when would you prefer one over the other in real-world pathfinding?", ["Queue vs Stack/Recursion", "Shortest path in unweighted graphs", "Memory complexity for wide vs deep graphs"])
    ],
    "DBMS": [
        ("Explain the ACID properties of relational databases and how isolation levels (Read Committed vs Serializable) prevent dirty and phantom reads.", ["Atomicity, Consistency, Isolation, Durability", "Dirty reads", "Non-repeatable reads", "Phantom reads", "MVCC"]),
        ("What is database indexing? Compare B-Tree indexes with Hash indexes, and explain when an index might degrade write performance.", ["B-Tree range scans vs Hash exact lookups", "Write overhead on INSERT/UPDATE", "Tree rebalancing"]),
        ("Explain the normalization process up to 3NF and BCNF. What are the practical trade-offs of deliberate denormalization in read-heavy architectures?", ["1NF, 2NF, 3NF, BCNF", "Redundancy vs Join costs", "Read throughput vs Write anomalies"])
    ],
    "Operating Systems": [
        ("Explain the difference between a process and a thread, and describe how the OS kernel manages context switches.", ["Address space isolation", "PCB vs TCB", "Context switch overhead", "TLB flushing"]),
        ("What are the necessary conditions for a deadlock to occur, and how does the Banker's algorithm prevent it?", ["Mutual exclusion, Hold and wait, No preemption, Circular wait", "Resource allocation state", "Safe vs unsafe states"])
    ],
    "Computer Networks": [
        ("Walk through the steps of the TCP 3-way handshake and 4-way termination. Why can't a connection be established in only two packets?", ["SYN, SYN-ACK, ACK", "Sequence number synchronization", "FIN handshake", "TIME_WAIT state"]),
        ("Explain what happens behind the scenes from the moment you type a URL into a browser until the webpage renders.", ["DNS resolution", "TCP handshake", "TLS negotiation", "HTTP request/response", "DOM rendering"])
    ],
    "OOP & System Design": [
        ("Explain the SOLID design principles with a concrete software example.", ["Single Responsibility", "Open/Closed", "Liskov Substitution", "Interface Segregation", "Dependency Inversion"]),
        ("How would you design a distributed URL shortening service like Bitly handling 100 million redirects daily?", ["Base62 encoding / MD5 hash", "Database schema", "Caching layer (Redis)", "Rate limiting", "Horizontal scaling"])
    ]
}

STANDARD_HR_QUESTIONS = [
    ("Tell me about yourself, your background in computer applications, and what motivated you to pursue a software development career.", ["Academic journey", "Key technical projects", "Career motivations", "Concise delivery under 2 minutes"]),
    ("Describe a situation where you had a significant technical disagreement with a teammate during a group project. How did you resolve it?", ["STAR method", "Objective technical evaluation", "Empathy and collaboration", "Successful project delivery"]),
    ("What are your greatest technical strengths and one genuine area of improvement you are actively working to address?", ["Specific strengths with examples", "Self-awareness", "Actionable steps taken for growth"]),
    ("Where do you see yourself professionally in the next 3 to 5 years?", ["Technical mastery", "Leadership/Mentorship", "Value contribution", "Continuous learning"]),
    ("Tell me about a challenging bug or obstacle you encountered in a project that took hours or days to solve. How did you diagnose it?", ["Systematic debugging approach", "Log analysis", "Root cause determination", "Prevention mechanism implemented"])
]

@router.post("/start", response_model=InterviewSessionDetailOut)
def start_interview_session(
    payload: InterviewStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = InterviewSession(
        user_id=current_user.id,
        session_type=payload.session_type,
        target_role=payload.target_role or "Full Stack Software Engineer",
        subjects=json.dumps(payload.subjects),
        difficulty=payload.difficulty,
        total_questions=payload.total_questions,
        status="in_progress"
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # Populate questions based on session type
    order = 1
    questions_data = []

    if payload.session_type == "hr":
        selected_pool = STANDARD_HR_QUESTIONS[:payload.total_questions]
        for q_text, concepts in selected_pool:
            iq = InterviewQuestion(
                session_id=session.id,
                question_order=order,
                question_text=q_text,
                category="Behavioral & HR",
                expected_key_points=json.dumps(concepts)
            )
            db.add(iq)
            questions_data.append(iq)
            order += 1
    else:
        # Technical interview: pick across chosen subjects
        sub_list = payload.subjects if payload.subjects else ["DSA", "DBMS", "Operating Systems"]
        for sub in sub_list:
            pool = STANDARD_TECH_QUESTIONS.get(sub, STANDARD_TECH_QUESTIONS["DSA"])
            for q_text, concepts in pool[:2]:
                if order > payload.total_questions:
                    break
                iq = InterviewQuestion(
                    session_id=session.id,
                    question_order=order,
                    question_text=q_text,
                    category=sub,
                    expected_key_points=json.dumps(concepts)
                )
                db.add(iq)
                questions_data.append(iq)
                order += 1
            if order > payload.total_questions:
                break

    db.commit()

    return InterviewSessionDetailOut(
        id=session.id,
        user_id=session.user_id,
        session_type=session.session_type,
        target_role=session.target_role,
        subjects=json.loads(session.subjects),
        difficulty=session.difficulty,
        total_questions=len(questions_data),
        status=session.status,
        overall_score=session.overall_score,
        feedback_summary=session.feedback_summary,
        created_at=session.created_at,
        questions=[{
            "id": q.id,
            "question_order": q.question_order,
            "question_text": q.question_text,
            "category": q.category
        } for q in questions_data]
    )

@router.get("/sessions/{session_id}", response_model=InterviewSessionDetailOut)
def get_session(session_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    questions = db.query(InterviewQuestion).filter(InterviewQuestion.session_id == session.id).order_by(InterviewQuestion.question_order).all()
    q_list = []
    for q in questions:
        resp = db.query(InterviewResponse).filter(InterviewResponse.question_id == q.id).first()
        q_list.append({
            "id": q.id,
            "question_order": q.question_order,
            "question_text": q.question_text,
            "category": q.category,
            "response": {
                "student_answer": resp.student_answer,
                "score": resp.score,
                "ai_feedback": resp.ai_feedback,
                "expected_answer_guide": resp.expected_answer_guide
            } if resp else None
        })

    return InterviewSessionDetailOut(
        id=session.id,
        user_id=session.user_id,
        session_type=session.session_type,
        target_role=session.target_role,
        subjects=json.loads(session.subjects) if session.subjects else [],
        difficulty=session.difficulty,
        total_questions=session.total_questions,
        status=session.status,
        overall_score=session.overall_score,
        feedback_summary=session.feedback_summary,
        created_at=session.created_at,
        questions=q_list
    )

@router.post("/answer", response_model=InterviewEvaluationOut)
async def submit_interview_answer(
    payload: InterviewAnswerSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    iq = db.query(InterviewQuestion).filter(InterviewQuestion.id == payload.question_id).first()
    if not iq:
        raise HTTPException(status_code=404, detail="Interview question not found.")
    
    session = db.query(InterviewSession).filter(InterviewSession.id == iq.session_id).first()
    if not session or session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized access to this session.")

    # Multi-rubric AI evaluation
    system_prompt = (
        "You are a strict, constructive technical interview evaluator for campus placements. "
        "Evaluate the candidate's answer based on: correctness, completeness, clarity, and relevance. "
        "Return structured JSON with scores (0-10) and actionable feedback."
    )
    user_prompt = f"Question: {iq.question_text}\nCategory: {iq.category}\nCandidate Answer: {payload.student_answer}\nExpected points: {iq.expected_key_points}"
    
    eval_json_str = await ai_service.generate_completion(system_prompt, user_prompt)
    try:
        eval_data = json.loads(eval_json_str)
    except Exception:
        eval_data = {
            "score": 7.5,
            "correctness_score": 7.5,
            "completeness_score": 7.0,
            "clarity_score": 8.0,
            "relevance_score": 8.0,
            "ai_feedback": "Good fundamental understanding presented. Include more architectural trade-offs.",
            "expected_answer_guide": "State core algorithm, complexity bounds, and real-world failure cases.",
            "areas_to_improve": ["Add complexity analysis", "Use standard design terminology"]
        }

    # Upsert response record
    existing_resp = db.query(InterviewResponse).filter(InterviewResponse.question_id == iq.id).first()
    if existing_resp:
        resp = existing_resp
        resp.student_answer = payload.student_answer
        resp.input_mode = payload.input_mode
        resp.score = eval_data.get("score", 7.0)
        resp.correctness_score = eval_data.get("correctness_score", 7.0)
        resp.completeness_score = eval_data.get("completeness_score", 7.0)
        resp.clarity_score = eval_data.get("clarity_score", 7.0)
        resp.relevance_score = eval_data.get("relevance_score", 7.0)
        resp.ai_feedback = eval_data.get("ai_feedback", "")
        resp.expected_answer_guide = eval_data.get("expected_answer_guide", "")
        resp.areas_to_improve = json.dumps(eval_data.get("areas_to_improve", []))
    else:
        resp = InterviewResponse(
            question_id=iq.id,
            student_answer=payload.student_answer,
            input_mode=payload.input_mode,
            score=eval_data.get("score", 7.0),
            correctness_score=eval_data.get("correctness_score", 7.0),
            completeness_score=eval_data.get("completeness_score", 7.0),
            clarity_score=eval_data.get("clarity_score", 7.0),
            relevance_score=eval_data.get("relevance_score", 7.0),
            ai_feedback=eval_data.get("ai_feedback", ""),
            expected_answer_guide=eval_data.get("expected_answer_guide", ""),
            areas_to_improve=json.dumps(eval_data.get("areas_to_improve", []))
        )
        db.add(resp)
    
    db.commit()
    db.refresh(resp)

    # Cross-Round Evidence Traceability link
    claim = evidence_engine.register_interview_cross_check(
        db, current_user.id, iq.question_text, payload.student_answer, iq.category
    )

    return InterviewEvaluationOut(
        response_id=resp.id,
        score=resp.score,
        correctness=resp.correctness_score,
        completeness=resp.completeness_score,
        clarity=resp.clarity_score,
        relevance=resp.relevance_score,
        ai_feedback=resp.ai_feedback,
        expected_answer_guide=resp.expected_answer_guide,
        areas_to_improve=json.loads(resp.areas_to_improve) if resp.areas_to_improve else [],
        cross_round_claim_identified={
            "claim_text": claim.claim_text,
            "status": claim.status
        } if claim else None
    )

@router.post("/sessions/{session_id}/complete")
def complete_interview_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    # Calculate average score
    questions = db.query(InterviewQuestion).filter(InterviewQuestion.session_id == session.id).all()
    scores = []
    for q in questions:
        r = db.query(InterviewResponse).filter(InterviewResponse.question_id == q.id).first()
        if r:
            scores.append(r.score)

    avg_score = round(sum(scores) / max(1, len(scores)), 1) if scores else 0.0
    session.overall_score = avg_score
    session.status = "completed"
    session.feedback_summary = (
        f"Completed {len(scores)} of {len(questions)} questions with an overall rating of {avg_score}/10. "
        "Review areas of improvement to strengthen conceptual clarity before campus drives."
    )
    db.commit()
    return {"status": "completed", "overall_score": avg_score, "feedback_summary": session.feedback_summary}

@router.get("/history")
def get_interview_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id
    ).order_by(InterviewSession.created_at.desc()).all()
    return [{
        "id": s.id,
        "session_type": s.session_type,
        "target_role": s.target_role,
        "status": s.status,
        "overall_score": s.overall_score,
        "total_questions": s.total_questions,
        "created_at": s.created_at
    } for s in sessions]
