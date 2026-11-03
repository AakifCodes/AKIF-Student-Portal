from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
import uuid
from fastapi import HTTPException, status
from app.repositories import (
    UserRepository,
    StudentRepository,
    CourseRepository,
    AttendanceRepository,
    ResultRepository,
    AssignmentRepository,
    AnnouncementRepository,
    NotificationRepository,
    TimetableRepository,
    FeeRepository,
    TodoRepository,
    WorkflowRepository,
    EnrollmentRepository,
    ExamSeatingRepository,
    OnlineExamRepository,
    ExamAttemptRepository,
    TranscriptRepository,
    AdvanceFeeRepository,
    RoadmapRepository,
    CommunicationRepository,
    RegistrationOfferingRepository,
    CourseRegistrationRepository,
)
from app.utils.security import hash_password, verify_password, create_access_token
from app.schemas.auth import LoginRequest, UserRegisterRequest, ChangePasswordRequest
from app.schemas.portal import (
    StudentCreate, StudentUpdate,
    CourseCreate,
    AttendanceCreate,
    ResultCreate,
    AssignmentCreate, SubmissionCreate,
    AnnouncementCreate,
    TodoCreate, WorkflowCreate,
    CommunicationCreate,
    ExamSubmitRequest,
    RegistrationCreate,
)


def resolve_student_id(profile: Optional[Dict[str, Any]]) -> str:
    if not profile:
        return "student-akif"
    return str(profile.get("id") or profile.get("_id") or "student-akif")


class AuthService:
    def __init__(self):
        self.user_repo = UserRepository()
        self.student_repo = StudentRepository()

    def authenticate_user(self, login_data: LoginRequest) -> Dict[str, Any]:
        user = self.user_repo.find_by_email(login_data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        if not verify_password(login_data.password, user.get("password_hash", "")):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated"
            )

        token = create_access_token({
            "sub": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"]
        })

        # Return user without password_hash (Core Security Checklist)
        user_clean = {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "is_active": user.get("is_active", True),
            "created_at": user.get("created_at")
        }

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user_clean
        }

    def change_password(self, user_id: str, payload: ChangePasswordRequest) -> bool:
        if payload.new_password != payload.confirm_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Passwords do not match"
            )
        user = self.user_repo.find_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        if payload.old_password and not verify_password(payload.old_password, user.get("password_hash", "")):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password incorrect")

        hashed = hash_password(payload.new_password)
        self.user_repo.update(user_id, {"password_hash": hashed})
        return True


class StudentService:
    def __init__(self):
        self.student_repo = StudentRepository()
        self.user_repo = UserRepository()

    def get_all(self) -> List[Dict[str, Any]]:
        return self.student_repo.find_all()

    def get_by_id(self, student_id: str) -> Dict[str, Any]:
        student = self.student_repo.find_by_id(student_id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return student

    def get_by_user_id(self, user_id: str) -> Dict[str, Any]:
        student = self.student_repo.find_by_user_id(user_id)
        if not student:
            # Fallback to akif profile if matching
            return self.student_repo.find_by_id("student-akif") or {}
        return student

    def create_student(self, data: StudentCreate) -> Dict[str, Any]:
        existing = self.student_repo.find_by_roll_no(data.roll_no)
        if existing:
            raise HTTPException(status_code=400, detail="Student with this Roll No already exists")

        # Create user account for login
        user_dict = {
            "email": data.email.strip().lower(),
            "name": data.name,
            "role": "STUDENT",
            "password_hash": hash_password(data.password or "Student@123"),
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        created_user = self.user_repo.create(user_dict)

        student_dict = data.model_dump(exclude={"password"})
        student_dict["user_id"] = created_user["id"]
        return self.student_repo.create(student_dict)

    def update_student(self, student_id: str, data: StudentUpdate) -> Dict[str, Any]:
        student = self.student_repo.find_by_id(student_id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        update_data = {k: v for k, v in data.model_dump().items() if v is not None}
        return self.student_repo.update(student_id, update_data)

    def delete_student(self, student_id: str) -> bool:
        student = self.student_repo.find_by_id(student_id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        if student.get("user_id"):
            self.user_repo.delete(student["user_id"])
        return self.student_repo.delete(student_id)


class CourseService:
    def __init__(self):
        self.course_repo = CourseRepository()
        self.enrollment_repo = EnrollmentRepository()

    def get_all(self) -> List[Dict[str, Any]]:
        return self.course_repo.find_all()

    def get_enrolled(self, student_id: str) -> List[Dict[str, Any]]:
        enrollments = self.enrollment_repo.find_by_student(student_id)
        codes = {e.get("course_code") for e in enrollments if e.get("course_code")}
        if not codes:
            return []
        return [c for c in self.course_repo.find_all() if c.get("code") in codes]

    def get_by_id(self, course_id: str) -> Dict[str, Any]:
        c = self.course_repo.find_by_id(course_id)
        if not c:
            raise HTTPException(status_code=404, detail="Course not found")
        return c

    def create(self, data: CourseCreate) -> Dict[str, Any]:
        existing = self.course_repo.find_by_code(data.code)
        if existing:
            raise HTTPException(status_code=400, detail="Course code already exists")
        return self.course_repo.create(data.model_dump())

    def delete(self, course_id: str) -> bool:
        course = self.course_repo.find_by_id(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return self.course_repo.delete(course_id)


class AttendanceService:
    def __init__(self):
        self.att_repo = AttendanceRepository()

    def get_by_student(self, student_id: str) -> List[Dict[str, Any]]:
        return self.att_repo.find_by_student(student_id)

    def mark_attendance(self, data: AttendanceCreate) -> Dict[str, Any]:
        return self.att_repo.create(data.model_dump())


class ResultService:
    def __init__(self):
        self.res_repo = ResultRepository()

    def get_by_student(self, student_id: str) -> List[Dict[str, Any]]:
        return self.res_repo.find_by_student(student_id)

    def add_result(self, data: ResultCreate) -> Dict[str, Any]:
        return self.res_repo.create(data.model_dump())


class AssignmentService:
    def __init__(self):
        self.asg_repo = AssignmentRepository()

    def get_all(self) -> List[Dict[str, Any]]:
        return self.asg_repo.find_all()

    def create_assignment(self, data: AssignmentCreate) -> Dict[str, Any]:
        d = data.model_dump()
        d["submissions"] = []
        return self.asg_repo.create(d)

    def submit_assignment(self, assignment_id: str, student_id: str, payload: SubmissionCreate) -> Dict[str, Any]:
        sub = {
            "student_id": student_id,
            "submitted_at": datetime.now(timezone.utc).isoformat(),
            "file_name": payload.file_name,
            "status": "Submitted",
            "score": None,
            "feedback": payload.comments or "Pending review"
        }
        res = self.asg_repo.add_submission(assignment_id, sub)
        if not res:
            raise HTTPException(status_code=404, detail="Assignment not found")
        return res


class AnnouncementService:
    def __init__(self):
        self.ann_repo = AnnouncementRepository()

    def get_all(self) -> List[Dict[str, Any]]:
        return self.ann_repo.find_all()

    def create(self, data: AnnouncementCreate) -> Dict[str, Any]:
        d = data.model_dump()
        d["date"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        return self.ann_repo.create(d)

    def delete(self, announcement_id: str) -> bool:
        existing = self.ann_repo.find_by_id(announcement_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Announcement not found")
        return self.ann_repo.delete(announcement_id)


class NotificationService:
    def __init__(self):
        self.notif_repo = NotificationRepository()

    def get_by_user(self, user_id: str) -> List[Dict[str, Any]]:
        return self.notif_repo.find_by_user(user_id)

    def mark_read(self, notif_id: str) -> bool:
        return self.notif_repo.mark_read(notif_id)


class GeneralService:
    def __init__(self):
        self.timetable_repo = TimetableRepository()
        self.fee_repo = FeeRepository()
        self.todo_repo = TodoRepository()
        self.workflow_repo = WorkflowRepository()

    def get_timetables(self) -> List[Dict[str, Any]]:
        return self.timetable_repo.find_all()

    def get_student_ledger(self, student_id: str) -> List[Dict[str, Any]]:
        return self.fee_repo.find_by_student(student_id)

    def get_student_todos(self, student_id: str) -> List[Dict[str, Any]]:
        return self.todo_repo.find_by_student(student_id)

    def create_todo(self, student_id: str, data: TodoCreate) -> Dict[str, Any]:
        d = data.model_dump()
        d["student_id"] = student_id
        d["status"] = "Pending"
        return self.todo_repo.create(d)

    def toggle_todo(self, todo_id: str, student_id: str) -> Dict[str, Any]:
        t = self.todo_repo.find_by_id(todo_id)
        if not t:
            raise HTTPException(status_code=404, detail="Todo not found")
        if t.get("student_id") != student_id:
            raise HTTPException(status_code=403, detail="Not authorized to update this task")
        new_status = "Completed" if t.get("status") != "Completed" else "Pending"
        return self.todo_repo.update(todo_id, {"status": new_status})

    def delete_todo(self, todo_id: str, student_id: str) -> bool:
        t = self.todo_repo.find_by_id(todo_id)
        if not t:
            raise HTTPException(status_code=404, detail="Todo not found")
        if t.get("student_id") != student_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this task")
        return self.todo_repo.delete(todo_id)

    def get_student_workflows(self, student_id: str) -> List[Dict[str, Any]]:
        return self.workflow_repo.find_by_student(student_id)

    def create_workflow(self, student_id: str, data: WorkflowCreate) -> Dict[str, Any]:
        d = data.model_dump()
        d["student_id"] = student_id
        d["submission_date"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        d["status"] = "Submitted"
        return self.workflow_repo.create(d)


class AcademicService:
    """Exam seating, online exams, transcript, fees, roadmap, communication, registration."""

    def __init__(self):
        self.seating_repo = ExamSeatingRepository()
        self.exam_repo = OnlineExamRepository()
        self.attempt_repo = ExamAttemptRepository()
        self.transcript_repo = TranscriptRepository()
        self.advance_repo = AdvanceFeeRepository()
        self.roadmap_repo = RoadmapRepository()
        self.comm_repo = CommunicationRepository()
        self.offering_repo = RegistrationOfferingRepository()
        self.registration_repo = CourseRegistrationRepository()
        self.result_repo = ResultRepository()
        self.student_repo = StudentRepository()

    def get_seating(self, student_id: str) -> List[Dict[str, Any]]:
        seats = self.seating_repo.find_by_student(student_id)
        return sorted(seats, key=lambda item: item.get("date") or "")

    def get_admit_card(self, student_id: str) -> Dict[str, Any]:
        student = self.student_repo.find_by_id(student_id) or {}
        exams = self.get_seating(student_id)
        return {
            "session": "Fall 2026",
            "exam_type": "Midterm Examination",
            "issued_on": "30-OCT-2026",
            "controller": "Aamir Siddiqui",
            "student": {
                "name": student.get("name"),
                "roll_no": student.get("roll_no"),
                "enrollment_no": student.get("enrollment_no"),
                "program": student.get("program"),
                "section": student.get("section"),
                "department": student.get("department"),
            },
            "exams": exams,
        }

    def list_online_exams(self, student_id: str) -> List[Dict[str, Any]]:
        attempts = {a.get("exam_id"): a for a in self.attempt_repo.find_by_student(student_id)}
        items = []
        for exam in self.exam_repo.find_all():
            attempt = attempts.get(exam.get("id") or exam.get("_id"))
            status = exam.get("status", "Upcoming")
            score = None
            if attempt:
                status = "Completed"
                score = attempt.get("score")
            items.append({
                "id": exam.get("id") or exam.get("_id"),
                "survey": exam.get("survey"),
                "session": exam.get("session"),
                "course_code": exam.get("course_code"),
                "course": exam.get("course"),
                "faculty": exam.get("faculty"),
                "timing": exam.get("timing"),
                "duration_minutes": exam.get("duration_minutes", 30),
                "status": status,
                "score": score,
            })
        return items

    def get_online_exam(self, exam_id: str, student_id: str) -> Dict[str, Any]:
        exam = self.exam_repo.find_by_id(exam_id)
        if not exam:
            raise HTTPException(status_code=404, detail="Online exam not found")
        attempt = self.attempt_repo.find_by_student_exam(student_id, exam_id)
        status = "Completed" if attempt else exam.get("status", "Upcoming")
        if status != "Available":
            raise HTTPException(
                status_code=400,
                detail="This assessment is not currently available to attempt",
            )
        questions = []
        for q in exam.get("questions", []):
            questions.append({
                "id": q.get("id"),
                "prompt": q.get("prompt"),
                "options": q.get("options", []),
            })
        return {
            "id": exam.get("id") or exam.get("_id"),
            "survey": exam.get("survey"),
            "session": exam.get("session"),
            "course_code": exam.get("course_code"),
            "course": exam.get("course"),
            "faculty": exam.get("faculty"),
            "timing": exam.get("timing"),
            "duration_minutes": exam.get("duration_minutes", 30),
            "status": status,
            "score": None,
            "questions": questions,
        }

    def submit_online_exam(self, exam_id: str, student_id: str, payload: ExamSubmitRequest) -> Dict[str, Any]:
        exam = self.exam_repo.find_by_id(exam_id)
        if not exam:
            raise HTTPException(status_code=404, detail="Online exam not found")
        if exam.get("status") != "Available":
            raise HTTPException(status_code=400, detail="This assessment is not open for submission")
        existing = self.attempt_repo.find_by_student_exam(student_id, exam_id)
        if existing:
            raise HTTPException(status_code=400, detail="You have already submitted this exam")

        questions = exam.get("questions", [])
        total = len(questions) or 1
        correct = 0
        for question in questions:
            selected = payload.answers.get(question.get("id"))
            if selected is not None and selected == question.get("correct_index"):
                correct += 1
        score = round((correct / total) * 100, 2)
        self.attempt_repo.create({
            "exam_id": exam_id,
            "student_id": student_id,
            "answers": payload.answers,
            "score": score,
            "correct": correct,
            "total": total,
            "submitted_at": datetime.now(timezone.utc).isoformat(),
        })
        return {
            "exam_id": exam_id,
            "score": score,
            "total": total,
            "correct": correct,
            "status": "Completed",
            "message": f"Exam submitted. You scored {correct}/{total} ({score}%).",
        }

    def get_transcript(self, student_id: str) -> Dict[str, Any]:
        stored = self.transcript_repo.find_by_student(student_id)
        if stored:
            return stored
        student = self.student_repo.find_by_id(student_id) or {}
        results = self.result_repo.find_by_student(student_id)
        current_courses = []
        for res in results:
            current_courses.append({
                "code": res.get("course_code"),
                "title": res.get("course_name"),
                "credits": "3+0",
                "grade": res.get("grade") or "Enrolled",
                "points": "-",
            })
        return {
            "program": student.get("program", "BS Software Engineering"),
            "program_code": "BS-SE",
            "cgpa": student.get("cgpa", 0),
            "total_credits": 0,
            "semesters": [{
                "semester": student.get("current_semester", "Current"),
                "gpa": "Current",
                "credits": 0,
                "courses": current_courses,
            }],
        }

    def get_advance_receipts(self, student_id: str) -> List[Dict[str, Any]]:
        return self.advance_repo.find_by_student(student_id)

    def get_roadmap(self, student_id: str, profile: Dict[str, Any]) -> Dict[str, Any]:
        stored = self.roadmap_repo.find_by_student(student_id)
        if stored:
            stored["registration_no"] = profile.get("roll_no") or stored.get("registration_no")
            stored["candidate_name"] = profile.get("name") or stored.get("candidate_name")
            stored["program"] = profile.get("program") or stored.get("program")
            return stored
        return {
            "registration_no": profile.get("roll_no", ""),
            "candidate_name": profile.get("name", ""),
            "program": profile.get("program", ""),
            "enrollment_session": "Spring 2024",
            "semesters": [],
        }

    def get_communications(self, student_id: str) -> List[Dict[str, Any]]:
        records = self.comm_repo.find_by_student(student_id)
        return sorted(records, key=lambda item: item.get("created_at") or "", reverse=True)

    def create_communication(self, student_id: str, student_name: str, data: CommunicationCreate) -> Dict[str, Any]:
        payload = data.model_dump()
        payload.update({
            "student_id": student_id,
            "student_name": student_name,
            "status": "Under Review",
            "reply": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        return self.comm_repo.create(payload)

    def get_registration_offerings(self, semester: str = "Spring 2027") -> List[Dict[str, Any]]:
        offerings = self.offering_repo.find_all({"semester": semester})
        if offerings:
            return offerings
        return self.offering_repo.find_all()

    def get_my_registration(self, student_id: str, semester: str = "Spring 2027") -> Optional[Dict[str, Any]]:
        records = self.registration_repo.find_by_student(student_id, semester)
        return records[0] if records else None

    def submit_registration(self, student_id: str, data: RegistrationCreate) -> Dict[str, Any]:
        offerings = {o.get("code"): o for o in self.get_registration_offerings(data.semester)}
        unknown = [code for code in data.course_codes if code not in offerings]
        if unknown:
            raise HTTPException(status_code=400, detail=f"Unknown course codes: {', '.join(unknown)}")
        total_credits = sum(int(offerings[code].get("credits", 0)) for code in data.course_codes)
        if total_credits < 12 or total_credits > 21:
            raise HTTPException(
                status_code=400,
                detail="Selected credit hours must be between 12 and 21",
            )
        existing = self.get_my_registration(student_id, data.semester)
        payload = {
            "student_id": student_id,
            "semester": data.semester,
            "course_codes": data.course_codes,
            "total_credits": total_credits,
            "status": "Registered",
            "submitted_at": datetime.now(timezone.utc).isoformat(),
        }
        if existing:
            return self.registration_repo.update(existing["id"], payload) or existing
        return self.registration_repo.create(payload)
