from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.portal import StudentResponse, StudentCreate, StudentUpdate, MessageResponse
from app.services import StudentService
from app.dependencies.auth import get_current_user, require_admin, require_student

router = APIRouter(prefix="/students", tags=["Students"])
student_service = StudentService()


@router.get("/me", response_model=StudentResponse)
def get_my_profile(current_user: Dict[str, Any] = Depends(require_student)):
    """Returns the full academic profile of the currently logged in student."""
    profile = student_service.get_by_user_id(current_user["id"])
    if not profile:
        raise HTTPException(status_code=404, detail="Student record not found")
    return profile


@router.get("", response_model=List[StudentResponse])
def get_all_students(admin: Dict[str, Any] = Depends(require_admin)):
    """ADMIN ONLY: Retrieves list of all enrolled students."""
    return student_service.get_all()


@router.post("", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(
    payload: StudentCreate,
    admin: Dict[str, Any] = Depends(require_admin)
):
    """ADMIN ONLY: Registers a new student and generates their portal credentials."""
    return student_service.create_student(payload)


@router.get("/{student_id}", response_model=StudentResponse)
def get_student_by_id(
    student_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Retrieves student by ID. Students can only view their own record unless ADMIN."""
    if current_user.get("role") != "ADMIN":
        # Check student owner
        my_profile = student_service.get_by_user_id(current_user["id"])
        if my_profile.get("id") != student_id and my_profile.get("_id") != student_id:
            raise HTTPException(status_code=403, detail="Not authorized to view other students' records")
    return student_service.get_by_id(student_id)


@router.patch("/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: str,
    payload: StudentUpdate,
    admin: Dict[str, Any] = Depends(require_admin)
):
    """ADMIN ONLY: Updates student record."""
    return student_service.update_student(student_id, payload)


@router.delete("/{student_id}", response_model=MessageResponse)
def delete_student(student_id: str, admin: Dict[str, Any] = Depends(require_admin)):
    """ADMIN ONLY: Removes a student profile and linked login account."""
    student_service.delete_student(student_id)
    return {"message": "Student deleted", "id": student_id}
