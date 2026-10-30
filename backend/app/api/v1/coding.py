import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.coding import CodingProblem, TestCase, CodingSubmission
from app.schemas.coding import (
    CodingProblemOut,
    CodeRunRequest,
    CodeSubmitRequest,
    ExecutionResult,
    CodingSubmissionOut
)
from app.services.judge0_service import judge0_service

router = APIRouter(prefix="/coding", tags=["Coding Assessment"])

@router.get("/problems", response_model=List[CodingProblemOut])
def get_problems(
    difficulty: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(CodingProblem)
    if difficulty:
        query = query.filter(CodingProblem.difficulty == difficulty)
    if topic:
        query = query.filter(CodingProblem.topic == topic)
    return query.all()

@router.get("/problems/{problem_id}", response_model=CodingProblemOut)
def get_problem_detail(problem_id: str, db: Session = Depends(get_db)):
    prob = db.query(CodingProblem).filter(
        (CodingProblem.id == problem_id) | (CodingProblem.slug == problem_id)
    ).first()
    if not prob:
        raise HTTPException(status_code=404, detail="Coding problem not found.")
    return prob

@router.post("/run", response_model=ExecutionResult)
async def run_code(
    payload: CodeRunRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prob = db.query(CodingProblem).filter(CodingProblem.id == payload.problem_id).first()
    if not prob:
        raise HTTPException(status_code=404, detail="Problem not found")

    input_data = payload.custom_input if payload.custom_input is not None else prob.sample_input or ""
    expected = prob.sample_output or ""

    res = await judge0_service.execute_code(
        language=payload.language,
        source_code=payload.source_code,
        stdin=input_data,
        expected_output=expected
    )

    return ExecutionResult(
        status=res["status"],
        stdout=res["stdout"],
        stderr=res["stderr"],
        runtime_ms=res["runtime_ms"],
        memory_kb=res["memory_kb"],
        test_cases_passed=1 if res["status"] == "ACCEPTED" else 0,
        total_test_cases=1,
        test_case_details=[{
            "test_case_num": 1,
            "input": input_data,
            "expected_output": expected,
            "actual_output": res["stdout"],
            "status": res["status"]
        }],
        is_sandboxed=res["is_sandboxed"],
        provider=res["provider"]
    )

@router.post("/submit", response_model=ExecutionResult)
async def submit_code(
    payload: CodeSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prob = db.query(CodingProblem).filter(CodingProblem.id == payload.problem_id).first()
    if not prob:
        raise HTTPException(status_code=404, detail="Problem not found")

    # Get test cases
    test_cases = db.query(TestCase).filter(TestCase.problem_id == prob.id).all()
    if not test_cases:
        # Fallback to sample input/output as single test case
        test_cases = [TestCase(
            problem_id=prob.id,
            input_data=prob.sample_input or "",
            expected_output=prob.sample_output or "",
            is_hidden="false"
        )]

    passed_count = 0
    total = len(test_cases)
    details = []
    overall_status = "ACCEPTED"
    max_runtime = 0.0
    max_memory = 0.0

    for i, tc in enumerate(test_cases):
        res = await judge0_service.execute_code(
            language=payload.language,
            source_code=payload.source_code,
            stdin=tc.input_data,
            expected_output=tc.expected_output
        )
        
        tc_passed = (res["status"] == "ACCEPTED")
        if tc_passed:
            passed_count += 1
        elif overall_status == "ACCEPTED":
            overall_status = res["status"]

        max_runtime = max(max_runtime, res["runtime_ms"])
        max_memory = max(max_memory, res["memory_kb"])

        details.append({
            "test_case_num": i + 1,
            "is_hidden": (tc.is_hidden == "true"),
            "input": "Hidden Test Case" if tc.is_hidden == "true" else tc.input_data,
            "expected_output": "Hidden" if tc.is_hidden == "true" else tc.expected_output,
            "actual_output": res["stdout"] if tc.is_hidden != "true" else ("Matches" if tc_passed else "Mismatch"),
            "status": res["status"]
        })

    # Record submission in database
    submission = CodingSubmission(
        user_id=current_user.id,
        problem_id=prob.id,
        language=payload.language,
        source_code=payload.source_code,
        status=overall_status,
        test_cases_passed=passed_count,
        total_test_cases=total,
        runtime_ms=max_runtime,
        memory_kb=max_memory,
        execution_details=json.dumps(details)
    )
    db.add(submission)
    db.commit()

    return ExecutionResult(
        status=overall_status,
        stdout=f"Passed {passed_count}/{total} test cases.",
        stderr="" if overall_status == "ACCEPTED" else "Some test cases failed.",
        runtime_ms=max_runtime,
        memory_kb=max_memory,
        test_cases_passed=passed_count,
        total_test_cases=total,
        test_case_details=details,
        is_sandboxed=True,
        provider="Judge0 / Sandboxed Sandbox"
    )

@router.get("/submissions", response_model=List[CodingSubmissionOut])
def get_submission_history(
    problem_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(CodingSubmission).filter(CodingSubmission.user_id == current_user.id)
    if problem_id:
        query = query.filter(CodingSubmission.problem_id == problem_id)
    return query.order_by(CodingSubmission.created_at.desc()).all()
