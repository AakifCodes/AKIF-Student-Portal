from typing import List, Dict, Any
from fastapi import APIRouter, Depends, status
from app.schemas.portal import AssignmentResponse, AssignmentCreate, SubmissionCreate
from app.services import AssignmentService, StudentService
from app.dependencies.auth import get_current_user, require_admin, require_student

router = APIRouter(prefix="/assignments", tags=["Assignments"])
assignment_service = AssignmentService()
student_service = StudentService()


@router.get("", response_model=List[AssignmentResponse])
def get_assignments(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieves all academic assignments."""
    return assignment_service.get_all()


@router.post("", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
def create_assignment(
    payload: AssignmentCreate,
    admin: Dict[str, Any] = Depends(require_admin)
):
    """ADMIN ONLY: Creates a new course assignment."""
    return assignment_service.create_assignment(payload)


@router.post("/{assignment_id}/submit", response_model=AssignmentResponse)
def submit_assignment(
    assignment_id: str,
    payload: SubmissionCreate,
    current_user: Dict[str, Any] = Depends(require_student)
):
    """STUDENT ONLY: Submits student assignment solution file."""
    profile = student_service.get_by_user_id(current_user["id"])
    student_id = profile.get("id") or profile.get("_id") or "student-akif"
    return assignment_service.submit_assignment(assignment_id, student_id, payload)
