from typing import List, Dict, Any
from fastapi import APIRouter, Depends, status
from app.schemas.portal import AttendanceResponse, AttendanceCreate
from app.services import AttendanceService, StudentService
from app.dependencies.auth import get_current_user, require_admin, require_student

router = APIRouter(prefix="/attendance", tags=["Attendance"])
attendance_service = AttendanceService()
student_service = StudentService()


@router.get("/my-attendance", response_model=List[AttendanceResponse])
def get_my_attendance(current_user: Dict[str, Any] = Depends(require_student)):
    """STUDENT ONLY: Returns official attendance records for the authenticated student."""
    profile = student_service.get_by_user_id(current_user["id"])
    student_id = profile.get("id") or profile.get("_id") or "student-akif"
    return attendance_service.get_by_student(student_id)


@router.get("/student/{student_id}", response_model=List[AttendanceResponse])
def get_attendance_for_student(
    student_id: str,
    admin: Dict[str, Any] = Depends(require_admin)
):
    """ADMIN ONLY: Retrieves full attendance history for any specified student."""
    return attendance_service.get_by_student(student_id)


@router.post("", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def record_attendance(
    payload: AttendanceCreate,
    admin: Dict[str, Any] = Depends(require_admin)
):
    """ADMIN ONLY: Records or updates attendance figures."""
    return attendance_service.mark_attendance(payload)
