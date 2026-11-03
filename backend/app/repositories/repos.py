from typing import Dict, Any, List, Optional
import uuid
from app.database.db import db_manager


class BaseRepository:
    def __init__(self, collection_name: str):
        self.collection_name = collection_name

    @property
    def collection(self):
        return db_manager.get_collection(self.collection_name)

    def find_by_id(self, doc_id: str) -> Optional[Dict[str, Any]]:
        doc = self.collection.find_one({"_id": doc_id})
        return self._format_doc(doc) if doc else None

    def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        doc = self.collection.find_one(query)
        return self._format_doc(doc) if doc else None

    def find_all(self, query: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        docs = self.collection.find(query or {})
        return [self._format_doc(d) for d in docs]

    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        data = dict(data)
        if "_id" not in data and "id" not in data:
            data["_id"] = str(uuid.uuid4())
        elif "id" in data and "_id" not in data:
            data["_id"] = data["id"]
        res = self.collection.insert_one(data)
        return self.find_by_id(data["_id"])

    def update(self, doc_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        self.collection.update_one({"_id": doc_id}, {"$set": update_data})
        return self.find_by_id(doc_id)

    def delete(self, doc_id: str) -> bool:
        res = self.collection.delete_one({"_id": doc_id})
        return getattr(res, "deleted_count", 1) > 0

    def _format_doc(self, doc: Dict[str, Any]) -> Dict[str, Any]:
        if not doc:
            return doc
        d = dict(doc)
        if "_id" in d and "id" not in d:
            d["id"] = str(d["_id"])
        return d


class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__("users")

    def find_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        return self.find_one({"email": email.strip().lower()})


class StudentRepository(BaseRepository):
    def __init__(self):
        super().__init__("students")

    def find_by_user_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        return self.find_one({"user_id": user_id})

    def find_by_roll_no(self, roll_no: str) -> Optional[Dict[str, Any]]:
        return self.find_one({"roll_no": roll_no})


class CourseRepository(BaseRepository):
    def __init__(self):
        super().__init__("courses")

    def find_by_code(self, code: str) -> Optional[Dict[str, Any]]:
        return self.find_one({"code": code})


class AttendanceRepository(BaseRepository):
    def __init__(self):
        super().__init__("attendance")

    def find_by_student(self, student_id: str) -> List[Dict[str, Any]]:
        return self.find_all({"student_id": student_id})


class ResultRepository(BaseRepository):
    def __init__(self):
        super().__init__("results")

    def find_by_student(self, student_id: str) -> List[Dict[str, Any]]:
        return self.find_all({"student_id": student_id})


class AssignmentRepository(BaseRepository):
    def __init__(self):
        super().__init__("assignments")

    def add_submission(self, assignment_id: str, submission: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        asg = self.find_by_id(assignment_id)
        if not asg:
            return None
        subs = asg.get("submissions", [])
        # Replace or append
        subs = [s for s in subs if s.get("student_id") != submission.get("student_id")]
        subs.append(submission)
        self.collection.update_one({"_id": assignment_id}, {"$set": {"submissions": subs}})
        return self.find_by_id(assignment_id)


class AnnouncementRepository(BaseRepository):
    def __init__(self):
        super().__init__("announcements")


class NotificationRepository(BaseRepository):
    def __init__(self):
        super().__init__("notifications")

    def find_by_user(self, user_id: str) -> List[Dict[str, Any]]:
        return self.find_all({"user_id": user_id})

    def mark_read(self, notif_id: str) -> bool:
        return bool(self.update(notif_id, {"read": True}))


class TimetableRepository(BaseRepository):
    def __init__(self):
        super().__init__("timetables")


class FeeRepository(BaseRepository):
    def __init__(self):
        super().__init__("ledgers")

    def find_by_student(self, student_id: str) -> List[Dict[str, Any]]:
        return self.find_all({"student_id": student_id})


class TodoRepository(BaseRepository):
    def __init__(self):
        super().__init__("todos")

    def find_by_student(self, student_id: str) -> List[Dict[str, Any]]:
        return self.find_all({"student_id": student_id})


class WorkflowRepository(BaseRepository):
    def __init__(self):
        super().__init__("workflows")

    def find_by_student(self, student_id: str) -> List[Dict[str, Any]]:
        return self.find_all({"student_id": student_id})


class EnrollmentRepository(BaseRepository):
    def __init__(self):
        super().__init__("enrollments")

    def find_by_student(self, student_id: str) -> List[Dict[str, Any]]:
        return self.find_all({"student_id": student_id})


class ExamSeatingRepository(BaseRepository):
    def __init__(self):
        super().__init__("exam_seating")

    def find_by_student(self, student_id: str) -> List[Dict[str, Any]]:
        return self.find_all({"student_id": student_id})


class OnlineExamRepository(BaseRepository):
    def __init__(self):
        super().__init__("online_exams")


class ExamAttemptRepository(BaseRepository):
    def __init__(self):
        super().__init__("exam_attempts")

    def find_by_student_exam(self, student_id: str, exam_id: str) -> Optional[Dict[str, Any]]:
        return self.find_one({"student_id": student_id, "exam_id": exam_id})

    def find_by_student(self, student_id: str) -> List[Dict[str, Any]]:
        return self.find_all({"student_id": student_id})


class TranscriptRepository(BaseRepository):
    def __init__(self):
        super().__init__("transcripts")

    def find_by_student(self, student_id: str) -> Optional[Dict[str, Any]]:
        return self.find_one({"student_id": student_id})


class AdvanceFeeRepository(BaseRepository):
    def __init__(self):
        super().__init__("advance_fees")

    def find_by_student(self, student_id: str) -> List[Dict[str, Any]]:
        return self.find_all({"student_id": student_id})


class RoadmapRepository(BaseRepository):
    def __init__(self):
        super().__init__("roadmaps")

    def find_by_student(self, student_id: str) -> Optional[Dict[str, Any]]:
        return self.find_one({"student_id": student_id})


class CommunicationRepository(BaseRepository):
    def __init__(self):
        super().__init__("communications")

    def find_by_student(self, student_id: str) -> List[Dict[str, Any]]:
        return self.find_all({"student_id": student_id})


class RegistrationOfferingRepository(BaseRepository):
    def __init__(self):
        super().__init__("registration_offerings")


class CourseRegistrationRepository(BaseRepository):
    def __init__(self):
        super().__init__("course_registrations")

    def find_by_student(self, student_id: str, semester: Optional[str] = None) -> List[Dict[str, Any]]:
        query: Dict[str, Any] = {"student_id": student_id}
        if semester:
            query["semester"] = semester
        return self.find_all(query)
