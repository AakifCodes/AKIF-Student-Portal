from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator


# Student Schemas
class StudentBase(BaseModel):
    roll_no: str
    name: str
    email: str
    enrollment_no: str
    section: str = "A"
    program: str = "BS Software Engineering"
    department: str = "Department of Software Engineering"
    current_semester: str = "Fall 2026"
    semester_number: int = 5
    cgpa: float = 3.14
    registered_courses: float = 7.00
    average_attendance: float = 90.61
    current_balance: float = 59789.00
    status: str = "Active / Regular"
    campus: str = "Main Campus, Karachi"
    phone: Optional[str] = "+92 300 1234567"


class StudentCreate(StudentBase):
    password: Optional[str] = "Student@123"


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    section: Optional[str] = None
    phone: Optional[str] = None
    current_semester: Optional[str] = None
    semester_number: Optional[int] = None
    cgpa: Optional[float] = None
    average_attendance: Optional[float] = None
    status: Optional[str] = None


class StudentResponse(StudentBase):
    id: str
    user_id: Optional[str] = None


# Course Schemas
class CourseBase(BaseModel):
    code: str
    name: str
    credit_hours: str
    faculty: str
    timings: str
    room: str
    department: str = "Software Engineering"
    semester: str = "Fall 2026"


class CourseCreate(CourseBase):
    pass


class CourseResponse(CourseBase):
    id: str


# Attendance Schemas
class AttendanceBase(BaseModel):
    student_id: str
    course_code: str
    course_name: str
    section_code: str
    faculty: str
    scheduled: int
    conducted: int
    attended: int
    percentage: float


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceResponse(AttendanceBase):
    id: str


# Results Schemas
class ResultBase(BaseModel):
    student_id: str
    course_code: str
    course_name: str
    session: str
    assessment_type: str
    total_marks: float
    passing_marks: float
    obtained_marks: float
    grade: str


class ResultCreate(ResultBase):
    pass


class ResultResponse(ResultBase):
    id: str


# Assignment Schemas
class SubmissionSchema(BaseModel):
    student_id: str
    submitted_at: str
    file_name: str
    status: str = "Submitted"
    score: Optional[float] = None
    feedback: Optional[str] = None


class AssignmentCreate(BaseModel):
    course_code: str
    title: str
    description: str
    due_date: str
    total_points: int = 100


class AssignmentResponse(BaseModel):
    id: str
    course_code: str
    title: str
    description: str
    due_date: str
    total_points: int
    submissions: List[SubmissionSchema] = []


class SubmissionCreate(BaseModel):
    file_name: str
    comments: Optional[str] = None


# Announcement & Notification Schemas
class AnnouncementCreate(BaseModel):
    title: str
    category: str
    content: str
    author: str = "Academic Operations"


class AnnouncementResponse(BaseModel):
    id: str
    title: str
    category: str
    date: str
    content: str
    author: str


class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    read: bool
    timestamp: str


# Timetable, Fee, Todo, Workflow
class TimetableResponse(BaseModel):
    id: Optional[str] = None
    day: str
    time: str
    course_code: str
    course_name: str
    room: str
    faculty: str


class LedgerResponse(BaseModel):
    id: str
    student_id: str
    fee_nature: str
    session: str
    date: str
    debit: float
    credit: float
    balance: float


class TodoCreate(BaseModel):
    task: str
    due_date: str
    priority: str = "Medium"


class TodoResponse(BaseModel):
    id: str
    student_id: str
    task: str
    due_date: str
    priority: str
    status: str


class WorkflowCreate(BaseModel):
    workflow_type: str
    remarks: Optional[str] = ""


class WorkflowResponse(BaseModel):
    id: str
    student_id: str
    workflow_type: str
    submission_date: str
    status: str
    remarks: Optional[str] = ""


class CommunicationCreate(BaseModel):
    comm_type: str = Field(default="Query", min_length=2, max_length=80)
    faculty: str = Field(..., min_length=2, max_length=120)
    category: str = Field(default="Academic", min_length=2, max_length=80)
    course_code: str = Field(..., min_length=2, max_length=32)
    message: str = Field(..., min_length=10, max_length=4000)
    follow_up: bool = True
    email_reminder: bool = False


class CommunicationResponse(BaseModel):
    id: str
    student_id: str
    student_name: Optional[str] = "MUHAMMAD AKIF ALVI"
    comm_type: str
    faculty: str
    category: str
    course_code: str
    message: str
    follow_up: bool = True
    email_reminder: bool = False
    status: str = "Under Review"
    reply: Optional[str] = None
    created_at: str


class ExamSeatResponse(BaseModel):
    id: str
    student_id: str
    session: str
    exam_type: str
    date: str
    start: str
    end: str
    course_code: str
    course_name: str
    room: str
    seat: str


class AdmitCardResponse(BaseModel):
    session: str
    exam_type: str
    issued_on: str
    controller: str
    student: Dict[str, Any]
    exams: List[ExamSeatResponse]


class ExamQuestionPublic(BaseModel):
    id: str
    prompt: str
    options: List[str]


class OnlineExamListItem(BaseModel):
    id: str
    survey: str
    session: str
    course_code: str
    course: str
    faculty: str
    timing: str
    duration_minutes: int
    status: str
    score: Optional[float] = None


class OnlineExamDetail(OnlineExamListItem):
    questions: List[ExamQuestionPublic]


class ExamSubmitRequest(BaseModel):
    answers: Dict[str, int] = Field(default_factory=dict)


class ExamSubmitResponse(BaseModel):
    exam_id: str
    score: float
    total: int
    correct: int
    status: str
    message: str


class TranscriptCourse(BaseModel):
    code: str
    title: str
    credits: str
    grade: str
    points: str


class TranscriptSemester(BaseModel):
    semester: str
    gpa: str
    credits: int
    courses: List[TranscriptCourse]


class TranscriptResponse(BaseModel):
    program: str
    program_code: str
    cgpa: float
    total_credits: int
    semesters: List[TranscriptSemester]


class AdvanceReceiptResponse(BaseModel):
    id: str
    student_id: str
    receipt_no: str
    date: str
    amount: float
    status: str
    mode: str


class RoadmapCourse(BaseModel):
    code: str
    name: str
    pre: str = "-"
    cr: str
    status: str


class RoadmapSemester(BaseModel):
    semester: str
    status: str
    courses: List[RoadmapCourse]


class RoadmapResponse(BaseModel):
    registration_no: str
    candidate_name: str
    program: str
    enrollment_session: str
    semesters: List[RoadmapSemester]


class RegistrationOffering(BaseModel):
    id: Optional[str] = None
    code: str
    title: str
    credits: int
    type: str
    faculty: str
    semester: str = "Spring 2027"


class RegistrationCreate(BaseModel):
    course_codes: List[str] = Field(..., min_length=1)
    semester: str = "Spring 2027"

    @field_validator("course_codes")
    @classmethod
    def unique_codes(cls, value: List[str]) -> List[str]:
        cleaned = [code.strip() for code in value if code.strip()]
        if not cleaned:
            raise ValueError("Select at least one course")
        return list(dict.fromkeys(cleaned))


class RegistrationResponse(BaseModel):
    id: str
    student_id: str
    semester: str
    course_codes: List[str]
    total_credits: int
    status: str
    submitted_at: str


class MessageResponse(BaseModel):
    message: str
    id: Optional[str] = None

