import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["platform"] == "RAGHire"

def test_login_seeded_student():
    response = client.post("/api/v1/auth/login", json={
        "email": "student@raghire.edu",
        "password": "Student@123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "student@raghire.edu"
    assert data["user"]["role"] == "student"

def test_login_seeded_admin():
    response = client.post("/api/v1/auth/login", json={
        "email": "admin@raghire.edu",
        "password": "Admin@123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"

def test_login_invalid_password():
    response = client.post("/api/v1/auth/login", json={
        "email": "student@raghire.edu",
        "password": "WrongPassword!"
    })
    assert response.status_code == 401

def test_register_duplicate_email():
    response = client.post("/api/v1/auth/register", json={
        "email": "student@raghire.edu",
        "password": "AnyPassword123",
        "full_name": "Duplicate Student"
    })
    assert response.status_code == 400
