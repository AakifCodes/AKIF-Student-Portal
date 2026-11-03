from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.portal import (
    ExamSeatResponse,
    AdmitCardResponse,
    OnlineExamListItem,
    OnlineExamDetail,
    ExamSubmitRequest,
    ExamSubmitResponse,
    TranscriptResponse,
    AdvanceReceiptResponse,
    RoadmapResponse,
    CommunicationCreate,
    CommunicationResponse,
    RegistrationOffering,
    RegistrationCreate,
    RegistrationResponse,
)
from app.services import AcademicService, StudentService
from app.services.services import resolve_student_id
from app.dependencies.auth import require_student

router = APIRouter(tags=["Academic Records"])
academic_service = AcademicService()
student_service = StudentService()


def current_student(current_user: Dict[str, Any]) -> Dict[str, Any]:
    profile = student_service.get_by_user_id(current_user["id"])
    if not profile:
        raise HTTPException(status_code=404, detail="Student record not found")
    return profile


@router.get("/exams/seating", response_model=List[ExamSeatResponse])
def get_exam_seating(current_user: Dict[str, Any] = Depends(require_student)):
    profile = current_student(current_user)
    return academic_service.get_seating(resolve_student_id(profile))


@router.get("/exams/admit-card", response_model=AdmitCardResponse)
def get_admit_card(current_user: Dict[str, Any] = Depends(require_student)):
    profile = current_student(current_user)
    return academic_service.get_admit_card(resolve_student_id(profile))


@router.get("/exams/online", response_model=List[OnlineExamListItem])
def list_online_exams(current_user: Dict[str, Any] = Depends(require_student)):
    profile = current_student(current_user)
    return academic_service.list_online_exams(resolve_student_id(profile))


@router.get("/exams/online/{exam_id}", response_model=OnlineExamDetail)
def get_online_exam(exam_id: str, current_user: Dict[str, Any] = Depends(require_student)):
    profile = current_student(current_user)
    return academic_service.get_online_exam(exam_id, resolve_student_id(profile))


@router.post("/exams/online/{exam_id}/submit", response_model=ExamSubmitResponse)
def submit_online_exam(
    exam_id: str,
    payload: ExamSubmitRequest,
    current_user: Dict[str, Any] = Depends(require_student),
):
    profile = current_student(current_user)
    return academic_service.submit_online_exam(exam_id, resolve_student_id(profile), payload)


@router.get("/transcripts/me", response_model=TranscriptResponse)
def get_my_transcript(current_user: Dict[str, Any] = Depends(require_student)):
    profile = current_student(current_user)
    return academic_service.get_transcript(resolve_student_id(profile))


@router.get("/fees/advance-receipts", response_model=List[AdvanceReceiptResponse])
def get_advance_receipts(current_user: Dict[str, Any] = Depends(require_student)):
    profile = current_student(current_user)
    return academic_service.get_advance_receipts(resolve_student_id(profile))


@router.get("/roadmap", response_model=RoadmapResponse)
def get_roadmap(current_user: Dict[str, Any] = Depends(require_student)):
    profile = current_student(current_user)
    return academic_service.get_roadmap(resolve_student_id(profile), profile)


@router.get("/communications", response_model=List[CommunicationResponse])
def get_communications(current_user: Dict[str, Any] = Depends(require_student)):
    profile = current_student(current_user)
    return academic_service.get_communications(resolve_student_id(profile))


@router.post("/communications", response_model=CommunicationResponse, status_code=status.HTTP_201_CREATED)
def create_communication(
    payload: CommunicationCreate,
    current_user: Dict[str, Any] = Depends(require_student),
):
    profile = current_student(current_user)
    return academic_service.create_communication(
        resolve_student_id(profile),
        profile.get("name", current_user.get("name", "")),
        payload,
    )


@router.get("/registration/offerings", response_model=List[RegistrationOffering])
def get_registration_offerings(
    semester: str = "Spring 2027",
    current_user: Dict[str, Any] = Depends(require_student),
):
    return academic_service.get_registration_offerings(semester)


@router.get("/registration/me", response_model=Optional[RegistrationResponse])
def get_my_registration(
    semester: str = "Spring 2027",
    current_user: Dict[str, Any] = Depends(require_student),
):
    profile = current_student(current_user)
    return academic_service.get_my_registration(resolve_student_id(profile), semester)


@router.post("/registration", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED)
def submit_registration(
    payload: RegistrationCreate,
    current_user: Dict[str, Any] = Depends(require_student),
):
    profile = current_student(current_user)
    return academic_service.submit_registration(resolve_student_id(profile), payload)
