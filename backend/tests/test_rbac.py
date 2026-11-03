import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def get_token(email: str, password: str) -> str:
    res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert res.status_code == 200
    return res.json()["access_token"]


def test_student_cannot_access_admin_stats():
    student_token = get_token("akif.24sp028@student.uitu.edu.pk", "Akif@123")
    headers = {"Authorization": f"Bearer {student_token}"}
    
    # Attempt admin endpoint
    res = client.get("/api/v1/admin/stats", headers=headers)
    assert res.status_code == 403
    assert "ADMIN privileges" in res.json()["detail"]


def test_admin_can_access_admin_stats():
    admin_token = get_token("admin@uit.edu", "Admin@123")
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    res = client.get("/api/v1/admin/stats", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["total_students"] >= 1
    assert data["security_mode"] == "RBAC Strict (Admin/Student)"


def test_student_can_fetch_own_profile_and_attendance():
    student_token = get_token("akif.24sp028@student.uitu.edu.pk", "Akif@123")
    headers = {"Authorization": f"Bearer {student_token}"}
    
    # Profile
    res = client.get("/api/v1/students/me", headers=headers)
    assert res.status_code == 200
    assert res.json()["roll_no"] == "24SP-028-SE"
    assert res.json()["name"] == "MUHAMMAD AKIF ALVI"
    
    # Attendance
    att_res = client.get("/api/v1/attendance/my-attendance", headers=headers)
    assert att_res.status_code == 200
    assert len(att_res.json()) >= 1


def test_unauthenticated_request_rejected():
    res = client.get("/api/v1/admin/stats")
    assert res.status_code == 401
