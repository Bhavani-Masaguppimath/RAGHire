from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class TestCaseOut(BaseModel):
    id: str
    input_data: str
    expected_output: str
    is_hidden: str

    class Config:
        from_attributes = True

class CodingProblemOut(BaseModel):
    id: str
    title: str
    slug: str
    difficulty: str
    topic: str
    description: str
    constraints: Optional[str] = None
    input_format: Optional[str] = None
    output_format: Optional[str] = None
    sample_input: Optional[str] = None
    sample_output: Optional[str] = None
    sample_explanation: Optional[str] = None
    python_starter_code: str
    java_starter_code: str
    created_at: datetime

    class Config:
        from_attributes = True

class CodingProblemCreate(BaseModel):
    title: str
    slug: str
    difficulty: str
    topic: str
    description: str
    constraints: Optional[str] = None
    input_format: Optional[str] = None
    output_format: Optional[str] = None
    sample_input: Optional[str] = None
    sample_output: Optional[str] = None
    sample_explanation: Optional[str] = None
    python_starter_code: str
    java_starter_code: str

class CodeRunRequest(BaseModel):
    problem_id: str
    language: str  # "python" or "java"
    source_code: str
    custom_input: Optional[str] = None

class CodeSubmitRequest(BaseModel):
    problem_id: str
    language: str  # "python" or "java"
    source_code: str

class ExecutionResult(BaseModel):
    status: str  # "ACCEPTED", "WRONG_ANSWER", "RUNTIME_ERROR", "COMPILE_ERROR", "DEMO_SUCCESS"
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    runtime_ms: float = 0.0
    memory_kb: float = 0.0
    test_cases_passed: int = 0
    total_test_cases: int = 0
    test_case_details: List[Dict[str, Any]] = []
    is_sandboxed: bool = True
    provider: str = "Judge0 / Local Sandbox"

class CodingSubmissionOut(BaseModel):
    id: str
    user_id: str
    problem_id: str
    language: str
    source_code: str
    status: str
    test_cases_passed: int
    total_test_cases: int
    runtime_ms: float
    memory_kb: float
    created_at: datetime

    class Config:
        from_attributes = True
