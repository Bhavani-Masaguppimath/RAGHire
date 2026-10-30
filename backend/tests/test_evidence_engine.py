import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_evidence_summary_and_clarification():
    # Login as student
    login_res = client.post("/api/v1/auth/login", json={
        "email": "student@raghire.edu",
        "password": "Student@123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch evidence summary
    summary_res = client.get("/api/v1/evidence/", headers=headers)
    assert summary_res.status_code == 200
    summary = summary_res.json()
    assert summary["total_claims"] > 0
    assert "consistency_health_score" in summary
    assert "supported_count" in summary

    # Find a pending follow-up question if available
    claims = summary["claims"]
    pending_fu = None
    for c in claims:
        for fu in c["follow_ups"]:
            if fu["status"] == "pending":
                pending_fu = fu
                break
        if pending_fu:
            break

    if pending_fu:
        # Submit clarification
        clarify_res = client.post(
            f"/api/v1/evidence/follow-ups/{pending_fu['id']}/clarify",
            json={"clarification_text": "We utilized an AWS c5.2xlarge 8-vCPU instance with Locust running on a separate node to benchmark the 5000 RPS sustained throughput."},
            headers=headers
        )
        assert clarify_res.status_code == 200
        data = clarify_res.json()
        assert data["status"] == "clarified"
        assert data["student_clarification"] is not None
