from typing import Dict, Any
from fastapi import APIRouter, Depends, status
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse, ChangePasswordRequest
from app.services import AuthService
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])
auth_service = AuthService()


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    """Authenticates credentials and returns JWT bearer token + user identity."""
    return auth_service.authenticate_user(payload)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Returns profile information for the authenticated user without password hash."""
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "name": current_user["name"],
        "role": current_user["role"],
        "is_active": current_user.get("is_active", True),
        "created_at": current_user.get("created_at")
    }


@router.post("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    payload: ChangePasswordRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Allows user to change their account password."""
    auth_service.change_password(current_user["id"], payload)
    return {"message": "Password updated successfully"}
