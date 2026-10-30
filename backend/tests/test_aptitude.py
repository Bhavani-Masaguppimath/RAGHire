import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_aptitude_flow():
    # Login as student
    login_res = client.post("/api/v1/auth/login", json={
        "email": "student@raghire.edu",
        "password": "Student@123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch quantitative questions
    q_res = client.get("/api/v1/aptitude/questions?category=quantitative&limit=3", headers=headers)
    assert q_res.status_code == 200
    questions = q_res.json()
    assert len(questions) > 0

    first_q = questions[0]
    # Submit test with answer
    submit_res = client.post("/api/v1/aptitude/submit-test", json={
        "category": "quantitative",
        "difficulty": "medium",
        "time_taken_seconds": 45,
        "user_answers": {first_q["id"]: 1}
    }, headers=headers)

    assert submit_res.status_code == 200
    data = submit_res.json()
    assert data["total_questions"] == 1
    assert "score_percentage" in data
    assert len(data["detailed_review"]) == 1
    assert "explanation" in data["detailed_review"][0]
