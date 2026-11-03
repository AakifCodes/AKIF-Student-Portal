import pytest
from app.utils.security import hash_password, verify_password, create_access_token, decode_access_token
from app.services.services import AuthService
from app.schemas.auth import LoginRequest


def test_password_hashing():
    pw = "SuperSecure@2026"
    hashed = hash_password(pw)
    assert hashed != pw
    assert verify_password(pw, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_generation_and_decoding():
    payload = {"sub": "user-test-1", "role": "STUDENT", "email": "test@student.uitu.edu.pk"}
    token = create_access_token(payload)
    assert isinstance(token, str)
    
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "user-test-1"
    assert decoded["role"] == "STUDENT"


def test_auth_service_student_login():
    auth_service = AuthService()
    req = LoginRequest(email="akif.24sp028@student.uitu.edu.pk", password="Akif@123")
    res = auth_service.authenticate_user(req)
    
    assert res["access_token"] is not None
    assert res["user"]["role"] == "STUDENT"
    assert res["user"]["email"] == "akif.24sp028@student.uitu.edu.pk"
    assert "password_hash" not in res["user"]


def test_auth_service_admin_login():
    auth_service = AuthService()
    req = LoginRequest(email="admin@uit.edu", password="Admin@123")
    res = auth_service.authenticate_user(req)
    
    assert res["access_token"] is not None
    assert res["user"]["role"] == "ADMIN"
    assert "password_hash" not in res["user"]
