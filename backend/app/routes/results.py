from typing import List, Dict, Any
from fastapi import APIRouter, Depends, status
from app.schemas.portal import ResultResponse, ResultCreate
from app.services import ResultService, StudentService
from app.dependencies.auth import get_current_user, require_admin, require_student

router = APIRouter(prefix="/results", tags=["Results & Grading"])
result_service = ResultService()
student_service = StudentService()


@router.get("/my-results", response_model=List[ResultResponse])
def get_my_results(current_user: Dict[str, Any] = Depends(require_student)):
    """STUDENT ONLY: Returns assessment results and exam marks for the authenticated student."""
    profile = student_service.get_by_user_id(current_user["id"])
    student_id = profile.get("id") or profile.get("_id") or "student-akif"
    return result_service.get_by_student(student_id)


@router.get("/student/{student_id}", response_model=List[ResultResponse])
def get_results_for_student(
    student_id: str,
    admin: Dict[str, Any] = Depends(require_admin)
):
    """ADMIN ONLY: Retrieves academic results for any student."""
    return result_service.get_by_student(student_id)


@router.post("", response_model=ResultResponse, status_code=status.HTTP_201_CREATED)
def add_result(
    payload: ResultCreate,
    admin: Dict[str, Any] = Depends(require_admin)
):
    """ADMIN ONLY: Publishes assessment scores and grades."""
    return result_service.add_result(payload)
