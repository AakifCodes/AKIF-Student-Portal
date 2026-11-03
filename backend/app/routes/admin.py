from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from app.dependencies.auth import require_admin
from app.repositories import (
    UserRepository,
    StudentRepository,
    CourseRepository,
    AttendanceRepository,
    AssignmentRepository,
    AnnouncementRepository
)

router = APIRouter(prefix="/admin", tags=["Admin Operations"])
user_repo = UserRepository()
student_repo = StudentRepository()
course_repo = CourseRepository()
attendance_repo = AttendanceRepository()
assignment_repo = AssignmentRepository()
announcement_repo = AnnouncementRepository()


@router.get("/stats")
def get_system_statistics(admin: Dict[str, Any] = Depends(require_admin)):
    """ADMIN ONLY: Retrieves overview statistics for the administrative dashboard."""
    total_students = student_repo.collection.count_documents({})
    total_courses = course_repo.collection.count_documents({})
    total_users = user_repo.collection.count_documents({})
    total_assignments = assignment_repo.collection.count_documents({})
    total_announcements = announcement_repo.collection.count_documents({})

    return {
        "total_students": total_students,
        "total_courses": total_courses,
        "total_users": total_users,
        "total_assignments": total_assignments,
        "total_announcements": total_announcements,
        "active_semester": "Fall 2026",
        "system_status": "Operational",
        "security_mode": "RBAC Strict (Admin/Student)"
    }


@router.get("/users")
def get_all_users(admin: Dict[str, Any] = Depends(require_admin)):
    """ADMIN ONLY: Retrieves user accounts with passwords omitted."""
    users = user_repo.find_all()
    # Strip password_hash
    clean_users = []
    for u in users:
        clean_users.append({
            "id": u["id"],
            "email": u["email"],
            "name": u["name"],
            "role": u["role"],
            "is_active": u.get("is_active", True),
            "created_at": u.get("created_at")
        })
    return clean_users
