from typing import List, Dict, Any
from fastapi import APIRouter, Depends, status
from app.schemas.portal import CourseResponse, CourseCreate, MessageResponse
from app.services import CourseService, StudentService
from app.services.services import resolve_student_id
from app.dependencies.auth import get_current_user, require_admin, require_student

router = APIRouter(prefix="/courses", tags=["Courses"])
course_service = CourseService()
student_service = StudentService()


@router.get("", response_model=List[CourseResponse])
def get_all_courses(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieves all registered university courses."""
    return course_service.get_all()


@router.get("/my-courses", response_model=List[CourseResponse])
def get_my_courses(current_user: Dict[str, Any] = Depends(require_student)):
    """Returns currently enrolled courses for the logged in student."""
    profile = student_service.get_by_user_id(current_user["id"])
    return course_service.get_enrolled(resolve_student_id(profile))


@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(
    payload: CourseCreate,
    admin: Dict[str, Any] = Depends(require_admin)
):
    """ADMIN ONLY: Adds a new course offering."""
    return course_service.create(payload)


@router.delete("/{course_id}", response_model=MessageResponse)
def delete_course(course_id: str, admin: Dict[str, Any] = Depends(require_admin)):
    """ADMIN ONLY: Removes a course offering."""
    course_service.delete(course_id)
    return {"message": "Course deleted", "id": course_id}


@router.get("/{course_id}", response_model=CourseResponse)
def get_course_detail(
    course_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Retrieves details of a specific course."""
    return course_service.get_by_id(course_id)
