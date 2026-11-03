from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Response, status
from app.schemas.portal import (
    TimetableResponse, LedgerResponse,
    TodoCreate, TodoResponse,
    WorkflowCreate, WorkflowResponse,
    MessageResponse,
)
from app.services import GeneralService, StudentService
from app.services.services import resolve_student_id
from app.dependencies.auth import get_current_user, require_student
from app.database.db import db_manager

router = APIRouter(tags=["General Academic Features"])
general_service = GeneralService()
student_service = StudentService()


@router.get("/logo", include_in_schema=False)
def get_portal_logo():
    """Serves the UIT logo stored in the portal assets collection."""
    logo = db_manager.get_collection("portal_assets").find_one({"_id": "uit-logo"})
    if not logo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portal logo is not configured.")
    return Response(content=logo["data"], media_type=logo["content_type"])


@router.get("/timetables", response_model=List[TimetableResponse])
def get_timetables(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Returns university class timetable schedule."""
    return general_service.get_timetables()


@router.get("/fees/ledger", response_model=List[LedgerResponse])
def get_student_ledger(current_user: Dict[str, Any] = Depends(require_student)):
    """STUDENT ONLY: Returns detailed General Ledger statement."""
    profile = student_service.get_by_user_id(current_user["id"])
    student_id = resolve_student_id(profile)
    return general_service.get_student_ledger(student_id)


@router.get("/todos", response_model=List[TodoResponse])
def get_todos(current_user: Dict[str, Any] = Depends(require_student)):
    """STUDENT ONLY: Returns student tasks."""
    profile = student_service.get_by_user_id(current_user["id"])
    student_id = resolve_student_id(profile)
    return general_service.get_student_todos(student_id)


@router.post("/todos", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(payload: TodoCreate, current_user: Dict[str, Any] = Depends(require_student)):
    """STUDENT ONLY: Creates a new personal task."""
    profile = student_service.get_by_user_id(current_user["id"])
    student_id = resolve_student_id(profile)
    return general_service.create_todo(student_id, payload)


@router.patch("/todos/{todo_id}/toggle", response_model=TodoResponse)
def toggle_todo(todo_id: str, current_user: Dict[str, Any] = Depends(require_student)):
    """STUDENT ONLY: Toggles todo completion status."""
    profile = student_service.get_by_user_id(current_user["id"])
    return general_service.toggle_todo(todo_id, resolve_student_id(profile))


@router.delete("/todos/{todo_id}", response_model=MessageResponse)
def delete_todo(todo_id: str, current_user: Dict[str, Any] = Depends(require_student)):
    """STUDENT ONLY: Deletes a personal task owned by the student."""
    profile = student_service.get_by_user_id(current_user["id"])
    general_service.delete_todo(todo_id, resolve_student_id(profile))
    return {"message": "Task deleted", "id": todo_id}


@router.get("/workflows", response_model=List[WorkflowResponse])
def get_workflows(current_user: Dict[str, Any] = Depends(require_student)):
    """STUDENT ONLY: Returns student academic workflow requests."""
    profile = student_service.get_by_user_id(current_user["id"])
    student_id = resolve_student_id(profile)
    return general_service.get_student_workflows(student_id)


@router.post("/workflows", response_model=WorkflowResponse, status_code=status.HTTP_201_CREATED)
def create_workflow(payload: WorkflowCreate, current_user: Dict[str, Any] = Depends(require_student)):
    """STUDENT ONLY: Submits a new workflow request (e.g. Leave, Duplicate ID, etc.)."""
    profile = student_service.get_by_user_id(current_user["id"])
    student_id = resolve_student_id(profile)
    return general_service.create_workflow(student_id, payload)


@router.get("/plo")
def get_plo_records(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Returns Student Program Outcome (PLO) Attainment breakdown."""
    col = db_manager.get_collection("plo_attainment")
    docs = col.find({})
    records = []
    for d in docs:
        item = dict(d)
        if "_id" in item and "id" not in item:
            item["id"] = str(item["_id"])
        records.append(item)
    return records
