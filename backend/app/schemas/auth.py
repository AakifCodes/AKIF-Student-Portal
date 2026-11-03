from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=4)


class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str
    role: Literal["ADMIN", "STUDENT"]


class ChangePasswordRequest(BaseModel):
    old_password: Optional[str] = None
    new_password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: Literal["ADMIN", "STUDENT"]
    is_active: bool = True
    created_at: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
