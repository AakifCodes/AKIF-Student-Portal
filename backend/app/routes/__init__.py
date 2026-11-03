from fastapi import APIRouter
from .auth import router as auth_router
from .students import router as students_router
from .courses import router as courses_router
from .attendance import router as attendance_router
from .results import router as results_router
from .assignments import router as assignments_router
from .announcements import router as announcements_router
from .notifications import router as notifications_router
from .general import router as general_router
from .admin import router as admin_router
from .academic import router as academic_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(students_router)
api_router.include_router(courses_router)
api_router.include_router(attendance_router)
api_router.include_router(results_router)
api_router.include_router(assignments_router)
api_router.include_router(announcements_router)
api_router.include_router(notifications_router)
api_router.include_router(general_router)
api_router.include_router(academic_router)
api_router.include_router(admin_router)

__all__ = ["api_router"]
