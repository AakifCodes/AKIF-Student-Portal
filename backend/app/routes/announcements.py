from typing import List, Dict, Any
from fastapi import APIRouter, Depends, status
from app.schemas.portal import AnnouncementResponse, AnnouncementCreate, MessageResponse
from app.services import AnnouncementService
from app.dependencies.auth import get_current_user, require_admin

router = APIRouter(prefix="/announcements", tags=["Announcements"])
announcement_service = AnnouncementService()


@router.get("", response_model=List[AnnouncementResponse])
def get_announcements(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieves all official university announcements and circulars."""
    return announcement_service.get_all()


@router.post("", response_model=AnnouncementResponse, status_code=status.HTTP_201_CREATED)
def post_announcement(
    payload: AnnouncementCreate,
    admin: Dict[str, Any] = Depends(require_admin)
):
    """ADMIN ONLY: Publishes a university announcement."""
    return announcement_service.create(payload)


@router.delete("/{announcement_id}", response_model=MessageResponse)
def delete_announcement(announcement_id: str, admin: Dict[str, Any] = Depends(require_admin)):
    """ADMIN ONLY: Removes a published announcement."""
    announcement_service.delete(announcement_id)
    return {"message": "Announcement deleted", "id": announcement_id}
