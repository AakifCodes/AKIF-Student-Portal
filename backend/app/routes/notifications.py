from typing import List, Dict, Any
from fastapi import APIRouter, Depends, status
from app.schemas.portal import NotificationResponse
from app.services import NotificationService
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])
notification_service = NotificationService()


@router.get("", response_model=List[NotificationResponse])
def get_my_notifications(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieves notifications targeted to the logged in user."""
    return notification_service.get_by_user(current_user["id"])


@router.patch("/{notification_id}/read", status_code=status.HTTP_200_OK)
def mark_notification_as_read(
    notification_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Marks a user notification as read."""
    notification_service.mark_read(notification_id)
    return {"message": "Notification marked as read"}
