import os
import json
import sys
import uuid
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
import pymongo
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from app.config.settings import settings
from app.utils.security import hash_password


class InMemoryCollection:
    """Thread-safe, MongoDB-compatible collection fallback for local development or testing."""
    def __init__(self, name: str):
        self.name = name
        self.documents: Dict[str, Dict[str, Any]] = {}

    def _matches(self, doc: Dict[str, Any], query: Dict[str, Any]) -> bool:
        for k, v in query.items():
            if k == "$or":
                if not any(self._matches(doc, subq) for subq in v):
                    return False
            elif isinstance(v, dict):
                # handle basic operators like $in
                if "$in" in v:
                    doc_val = doc.get(k)
                    if doc_val not in v["$in"]:
                        return False
            else:
                if doc.get(k) != v:
                    return False
        return True

    def find_one(self, query: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
        query = query or {}
        for doc in self.documents.values():
            if self._matches(doc, query):
                return dict(doc)
        return None

    def find(self, query: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        query = query or {}
        res = []
        for doc in self.documents.values():
            if self._matches(doc, query):
                res.append(dict(doc))
        return res

    def insert_one(self, doc: Dict[str, Any]):
        doc = dict(doc)
        if "_id" not in doc:
            doc["_id"] = str(uuid.uuid4())
        self.documents[doc["_id"]] = doc
        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertResult(doc["_id"])

    def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        doc = self.find_one(query)
        if doc:
            doc_id = doc["_id"]
            if "$set" in update:
                self.documents[doc_id].update(update["$set"])
            if "$push" in update:
                for k, v in update["$push"].items():
                    if k not in self.documents[doc_id]:
                        self.documents[doc_id][k] = []
                    self.documents[doc_id][k].append(v)
            class UpdateResult:
                modified_count = 1
            return UpdateResult()
        class UpdateResultZero:
            modified_count = 0
        return UpdateResultZero()

    def delete_one(self, query: Dict[str, Any]):
        doc = self.find_one(query)
        if doc:
            del self.documents[doc["_id"]]
            class DeleteResult:
                deleted_count = 1
            return DeleteResult()
        class DeleteResultZero:
            deleted_count = 0
        return DeleteResultZero()

    def count_documents(self, query: Dict[str, Any] = None) -> int:
        return len(self.find(query))


class DatabaseManager:
    """Encapsulates MongoDB connection management and collection access."""
    def __init__(self):
        self.client: Optional[pymongo.MongoClient] = None
        self.db = None
        self.is_connected = False
        self.fallback_collections: Dict[str, InMemoryCollection] = {}
        self._initialize()

    def _initialize(self):
        mongo_url = (settings.mongodb_url or "").strip()
        is_test_mode = "pytest" in sys.modules
        if is_test_mode or not mongo_url or mongo_url.startswith("<"):
            self.is_connected = False
            self.client = None
            self.db = None
            print("[DatabaseManager] Running in test mode or no MongoDB URL configured. Using in-memory data store.")
            self._seed_initial_data()
            self._seed_portal_logo()
            return

        try:
            # Short timeout to detect if MongoDB is actively running locally
            client = pymongo.MongoClient(mongo_url, serverSelectionTimeoutMS=1500)
            client.admin.command('ping')
            self.client = client
            self.db = client[settings.database_name]
            self.is_connected = True
            print("[DatabaseManager] Connected to MongoDB")
            if self.db["users"].count_documents({}) == 0:
                print("[DatabaseManager] Empty database detected. Seeding demo records.")
                self._seed_initial_data()
            elif self.db["exam_seating"].count_documents({}) == 0:
                print("[DatabaseManager] Academic collections empty. Seeding exam/transcript modules.")
                self._seed_academic_modules()
        except Exception as e:
            self.is_connected = False
            print(f"[DatabaseManager] MongoDB unavailable ({type(e).__name__}). Using in-memory data store.")
            self._seed_initial_data()
        self._seed_portal_logo()

    def _seed_portal_logo(self):
        """Persist the UIT logo in the portal assets collection."""
        logo_path = Path(__file__).resolve().parents[3] / "frontend" / "src" / "assets" / "uitLogo.jpeg"
        if not logo_path.is_file():
            raise FileNotFoundError(f"UIT logo asset not found: {logo_path}")

        assets_col = self.get_collection("portal_assets")
        logo = {
            "content_type": "image/jpeg",
            "data": logo_path.read_bytes(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        query = {"_id": "uit-logo"}
        if assets_col.find_one(query):
            assets_col.update_one(query, {"$set": logo})
        else:
            assets_col.insert_one({"_id": "uit-logo", **logo})

    def get_collection(self, name: str):
        if self.is_connected and self.db is not None:
            return self.db[name]
        if name not in self.fallback_collections:
            self.fallback_collections[name] = InMemoryCollection(name)
        return self.fallback_collections[name]

    def _seed_initial_data(self):
        """Seed seed records matching Muhammad Akif Alvi (24SP-028-SE) and Admin."""
        users_col = self.get_collection("users")
        students_col = self.get_collection("students")
        courses_col = self.get_collection("courses")
        attendance_col = self.get_collection("attendance")
        results_col = self.get_collection("results")
        assignments_col = self.get_collection("assignments")
        announcements_col = self.get_collection("announcements")
        notifications_col = self.get_collection("notifications")
        timetables_col = self.get_collection("timetables")
        ledgers_col = self.get_collection("ledgers")
        todos_col = self.get_collection("todos")
        workflows_col = self.get_collection("workflows")
        plo_col = self.get_collection("plo_attainment")

        # 1. Users
        # ADMIN
        admin_user = {
            "_id": "user-admin-1",
            "email": "admin@uit.edu",
            "name": "Portal Administrator",
            "role": "ADMIN",
            "password_hash": hash_password("Admin@123"),
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        # STUDENT: Muhammad Akif Alvi
        student_user = {
            "_id": "user-student-akif",
            "email": "akif.24sp028@student.uitu.edu.pk",
            "name": "MUHAMMAD AKIF ALVI",
            "role": "STUDENT",
            "password_hash": hash_password("Akif@123"),
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        users_col.insert_one(admin_user)
        users_col.insert_one(student_user)

        # 2. Student Profile
        student_profile = {
            "_id": "student-akif",
            "user_id": "user-student-akif",
            "roll_no": "24SP-028-SE",
            "name": "MUHAMMAD AKIF ALVI",
            "email": "akif.24sp028@student.uitu.edu.pk",
            "enrollment_no": "UITU-24SP-UGRAD-00430",
            "section": "A",
            "program": "BS Software Engineering",
            "department": "Department of Software Engineering",
            "current_semester": "Fall 2026",
            "semester_number": 5,
            "cgpa": 3.14,
            "registered_courses": 7.00,
            "average_attendance": 90.61,
            "current_balance": 59789.00,
            "status": "Active / Regular",
            "campus": "Main Campus, Karachi",
            "phone": "+92 300 1234567"
        }
        students_col.insert_one(student_profile)

        # 3. Courses
        courses = [
            {
                "_id": "course-se311",
                "code": "SE-311",
                "name": "Data Warehousing and Data Mining",
                "credit_hours": "3+1",
                "faculty": "Syed Imran Jami",
                "timings": "Thu 14:30 - 15:25, Mon 11:30 - 12:25, Thu 13:30 - 14:25",
                "room": "COMPUTING LAB-IV, R-303, R-401",
                "department": "Software Engineering",
                "semester": "Fall 2026"
            },
            {
                "_id": "course-se312",
                "code": "SE-312",
                "name": "Information Security",
                "credit_hours": "3",
                "faculty": "Fauzan Saeed",
                "timings": "Thu 08:30 - 09:25, Thu 09:30 - 10:25, Thu 10:30 - 11:25",
                "room": "R-301",
                "department": "Software Engineering",
                "semester": "Fall 2026"
            },
            {
                "_id": "course-cs302",
                "code": "CS-302",
                "name": "Parallel and Distributed Computing",
                "credit_hours": "3+1",
                "faculty": "Khusro Mian",
                "timings": "Mon 08:30 - 09:25, Mon 09:30 - 10:25, COMPUTING LAB-V",
                "room": "COMPUTING LAB-V",
                "department": "Software Engineering",
                "semester": "Fall 2026"
            },
            {
                "_id": "course-mgt201",
                "code": "MGT-201",
                "name": "Principles of Management",
                "credit_hours": "3",
                "faculty": "Syed Farhan Ali",
                "timings": "Tue 10:30 - 11:25, Tue 11:30 - 12:25",
                "room": "R-403",
                "department": "Management Sciences",
                "semester": "Fall 2026"
            },
            {
                "_id": "course-se314",
                "code": "SE-314",
                "name": "Software Construction and Development",
                "credit_hours": "3+1",
                "faculty": "Usman Waheed",
                "timings": "Mon 14:30 - 15:25, Wed 08:30 - 09:25, Wed 09:30 - 10:25",
                "room": "SOFTWARE ENG LAB",
                "department": "Software Engineering",
                "semester": "Fall 2026"
            },
            {
                "_id": "course-hum101",
                "code": "HUM-101",
                "name": "University Elective (Not Enrolled)",
                "credit_hours": "3+0",
                "faculty": "Academic Office",
                "timings": "Fri 10:30 - 11:25",
                "room": "R-201",
                "department": "Humanities",
                "semester": "Fall 2026"
            }
        ]
        for c in courses:
            courses_col.insert_one(c)

        # 4. Attendance (Matching page 15)
        attendance_records = [
            {
                "_id": "att-se314",
                "student_id": "student-akif",
                "course_code": "SE-314",
                "course_name": "Software Construction and Development",
                "section_code": "24SP-SE-5A",
                "faculty": "Usman Waheed",
                "scheduled": 32,
                "conducted": 30,
                "attended": 28,
                "percentage": 93.33
            },
            {
                "_id": "att-se312",
                "student_id": "student-akif",
                "course_code": "SE-312",
                "course_name": "Information Security",
                "section_code": "24SP-SE-5A",
                "faculty": "Fauzan Saeed",
                "scheduled": 30,
                "conducted": 28,
                "attended": 28,
                "percentage": 100.00
            },
            {
                "_id": "att-cs302",
                "student_id": "student-akif",
                "course_code": "CS-302",
                "course_name": "Parallel and Distributed Computing",
                "section_code": "24SP-SE-5A",
                "faculty": "Khusro Mian",
                "scheduled": 32,
                "conducted": 30,
                "attended": 27,
                "percentage": 90.00
            },
            {
                "_id": "att-mgt201",
                "student_id": "student-akif",
                "course_code": "MGT-201",
                "course_name": "Principles of Management",
                "section_code": "24SP-SE-5A",
                "faculty": "Syed Farhan Ali",
                "scheduled": 28,
                "conducted": 28,
                "attended": 28,
                "percentage": 100.00
            },
            {
                "_id": "att-se311",
                "student_id": "student-akif",
                "course_code": "SE-311",
                "course_name": "Data Warehousing and Data Mining",
                "section_code": "24SP-SE-5A",
                "faculty": "Syed Imran Jami",
                "scheduled": 36,
                "conducted": 34,
                "attended": 30,
                "percentage": 88.24
            }
        ]
        for att in attendance_records:
            attendance_col.insert_one(att)

        # 5. Assessment Results (Matching page 19)
        results = [
            {
                "_id": "res-se311",
                "student_id": "student-akif",
                "course_code": "SE-311",
                "course_name": "Data Warehousing and Data Mining",
                "session": "Fall 2026",
                "assessment_type": "Midterm Examination",
                "total_marks": 30.0,
                "passing_marks": 15.0,
                "obtained_marks": 26.5,
                "grade": "A-"
            },
            {
                "_id": "res-se312",
                "student_id": "student-akif",
                "course_code": "SE-312",
                "course_name": "Information Security",
                "session": "Fall 2026",
                "assessment_type": "Midterm Examination",
                "total_marks": 30.0,
                "passing_marks": 15.0,
                "obtained_marks": 25.0,
                "grade": "B+"
            },
            {
                "_id": "res-cs302",
                "student_id": "student-akif",
                "course_code": "CS-302",
                "course_name": "Parallel and Distributed Computing",
                "session": "Fall 2026",
                "assessment_type": "Midterm Examination",
                "total_marks": 30.0,
                "passing_marks": 15.0,
                "obtained_marks": 27.0,
                "grade": "A"
            },
            {
                "_id": "res-mgt201",
                "student_id": "student-akif",
                "course_code": "MGT-201",
                "course_name": "Principles of Management",
                "session": "Fall 2026",
                "assessment_type": "Midterm Examination",
                "total_marks": 30.0,
                "passing_marks": 15.0,
                "obtained_marks": 28.5,
                "grade": "A"
            },
            {
                "_id": "res-se314",
                "student_id": "student-akif",
                "course_code": "SE-314",
                "course_name": "Software Construction and Development",
                "session": "Fall 2026",
                "assessment_type": "Midterm Examination",
                "total_marks": 30.0,
                "passing_marks": 15.0,
                "obtained_marks": 29.0,
                "grade": "A+"
            }
        ]
        for r in results:
            results_col.insert_one(r)

        # 6. Assignments & Submissions
        assignments = [
            {
                "_id": "asg-1",
                "course_code": "SE-311",
                "title": "Data Mining ETL & OLAP Implementation",
                "description": "Design an ETL pipeline using Python and implement a star schema for sales data warehouse.",
                "due_date": "2026-11-10T23:59:59Z",
                "total_points": 100,
                "submissions": [
                    {
                        "student_id": "student-akif",
                        "submitted_at": "2026-10-28T18:30:00Z",
                        "file_name": "Akif_24SP028_ETL_Project.zip",
                        "status": "Submitted",
                        "score": 95,
                        "feedback": "Excellent schema modeling and clean code!"
                    }
                ]
            },
            {
                "_id": "asg-2",
                "course_code": "SE-314",
                "title": "Design Patterns Case Study",
                "description": "Implement Repository and Factory patterns with unit tests in TypeScript/Python.",
                "due_date": "2026-11-15T23:59:59Z",
                "total_points": 50,
                "submissions": []
            }
        ]
        for a in assignments:
            assignments_col.insert_one(a)

        # 7. Announcements (Matching page 19 & 20)
        announcements = [
            {
                "_id": "ann-1",
                "title": "Midterm Exam Seating Plan Published",
                "category": "Examination",
                "date": "2026-10-28",
                "content": "The seating arrangement for Fall 2026 Midterm examinations has been published on the portal. Please verify your room assignments and seat numbers in the Exam Seating Plan tab.",
                "author": "Registrar and Director Academic Operations"
            },
            {
                "_id": "ann-2",
                "title": "Semester VII Online Registration Window",
                "category": "Academic",
                "date": "2026-10-25",
                "content": "Online pre-registration for upcoming elective courses will open on November 10th. Students must clear any general ledger dues prior to course enrollment.",
                "author": "Academic Office"
            },
            {
                "_id": "ann-3",
                "title": "Teacher Evaluation Survey Reminder",
                "category": "Feedback",
                "date": "2026-10-22",
                "content": "All students are requested to complete the mandatory faculty and course evaluations via the Feedbacks / Surveys tab.",
                "author": "Quality Enhancement Cell (QEC)"
            }
        ]
        for an in announcements:
            announcements_col.insert_one(an)

        # 8. Notifications
        notifications = [
            {
                "_id": "notif-1",
                "user_id": "user-student-akif",
                "title": "Assignment Graded",
                "message": "Your submission for SE-311 ETL Implementation received 95/100 points.",
                "read": False,
                "timestamp": "2026-10-29T14:20:00Z"
            },
            {
                "_id": "notif-2",
                "user_id": "user-student-akif",
                "title": "Attendance Alert",
                "message": "Attendance marked Present for SE-314 Software Construction and Development.",
                "read": True,
                "timestamp": "2026-10-28T16:00:00Z"
            }
        ]
        for n in notifications:
            notifications_col.insert_one(n)

        # 9. Timetable (Matching page 16)
        timetables = [
            {"day": "Monday", "time": "08:30 - 09:25", "course_code": "CS-302", "course_name": "Parallel and Distributed Computing", "room": "COMPUTING LAB-V", "faculty": "Khusro Mian"},
            {"day": "Monday", "time": "09:30 - 10:25", "course_code": "CS-302", "course_name": "Parallel and Distributed Computing", "room": "COMPUTING LAB-V", "faculty": "Khusro Mian"},
            {"day": "Monday", "time": "11:30 - 12:25", "course_code": "SE-311", "course_name": "Data Warehousing and Data Mining", "room": "R-303", "faculty": "Syed Imran Jami"},
            {"day": "Monday", "time": "14:30 - 15:25", "course_code": "SE-314", "course_name": "Software Construction and Development", "room": "SOFTWARE ENG LAB", "faculty": "Usman Waheed"},
            {"day": "Tuesday", "time": "10:30 - 11:25", "course_code": "MGT-201", "course_name": "Principles of Management", "room": "R-403", "faculty": "Syed Farhan Ali"},
            {"day": "Tuesday", "time": "11:30 - 12:25", "course_code": "MGT-201", "course_name": "Principles of Management", "room": "R-403", "faculty": "Syed Farhan Ali"},
            {"day": "Wednesday", "time": "08:30 - 09:25", "course_code": "SE-314", "course_name": "Software Construction and Development", "room": "SOFTWARE ENG LAB", "faculty": "Usman Waheed"},
            {"day": "Wednesday", "time": "09:30 - 10:25", "course_code": "SE-314", "course_name": "Software Construction and Development", "room": "SOFTWARE ENG LAB", "faculty": "Usman Waheed"},
            {"day": "Thursday", "time": "08:30 - 09:25", "course_code": "SE-312", "course_name": "Information Security", "room": "R-301", "faculty": "Fauzan Saeed"},
            {"day": "Thursday", "time": "09:30 - 10:25", "course_code": "SE-312", "course_name": "Information Security", "room": "R-301", "faculty": "Fauzan Saeed"},
            {"day": "Thursday", "time": "10:30 - 11:25", "course_code": "SE-312", "course_name": "Information Security", "room": "R-301", "faculty": "Fauzan Saeed"},
            {"day": "Thursday", "time": "13:30 - 14:25", "course_code": "SE-311", "course_name": "Data Warehousing and Data Mining", "room": "R-401", "faculty": "Syed Imran Jami"},
            {"day": "Thursday", "time": "14:30 - 15:25", "course_code": "SE-311", "course_name": "Data Warehousing and Data Mining", "room": "COMPUTING LAB-IV", "faculty": "Syed Imran Jami"}
        ]
        for t in timetables:
            timetables_col.insert_one(t)

        # 10. Fee Ledger (Matching page 17)
        ledger_items = [
            {"_id": "fee-1", "student_id": "student-akif", "fee_nature": "Admission Fee", "session": "Spring 2024", "date": "15 Jan 2024", "debit": 25000.0, "credit": 25000.0, "balance": 0.0},
            {"_id": "fee-2", "student_id": "student-akif", "fee_nature": "Tuition Fee", "session": "Spring 2024", "date": "15 Jan 2024", "debit": 134500.0, "credit": 134500.0, "balance": 0.0},
            {"_id": "fee-3", "student_id": "student-akif", "fee_nature": "Semester Charges", "session": "Spring 2024", "date": "15 Jan 2024", "debit": 8500.0, "credit": 8500.0, "balance": 0.0},
            {"_id": "fee-4", "student_id": "student-akif", "fee_nature": "Security Deposit", "session": "Spring 2024", "date": "15 Jan 2024", "debit": 10000.0, "credit": 10000.0, "balance": 0.0},
            {"_id": "fee-5", "student_id": "student-akif", "fee_nature": "Tuition Fee", "session": "Fall 2024", "date": "10 Sep 2024", "debit": 142000.0, "credit": 142000.0, "balance": 0.0},
            {"_id": "fee-6", "student_id": "student-akif", "fee_nature": "Tuition Fee", "session": "Spring 2025", "date": "12 Feb 2025", "debit": 148000.0, "credit": 148000.0, "balance": 0.0},
            {"_id": "fee-7", "student_id": "student-akif", "fee_nature": "Tuition Fee", "session": "Fall 2026", "date": "20 Sep 2026", "debit": 159789.0, "credit": 100000.0, "balance": 59789.0}
        ]
        for l in ledger_items:
            ledgers_col.insert_one(l)

        # 11. Todos (Matching page 16)
        todos = [
            {"_id": "todo-1", "student_id": "student-akif", "task": "Submit SE-314 Architecture Diagram", "due_date": "2026-11-04", "priority": "High", "status": "In Progress"},
            {"_id": "todo-2", "student_id": "student-akif", "task": "Revise Chapter 4 Cryptography protocols", "due_date": "2026-11-06", "priority": "Medium", "status": "Pending"},
            {"_id": "todo-3", "student_id": "student-akif", "task": "Group meeting for Data Mining Project", "due_date": "2026-11-02", "priority": "High", "status": "Completed"}
        ]
        for td in todos:
            todos_col.insert_one(td)

        # 12. Workflows (Matching page 14)
        workflows = [
            {"_id": "wf-1", "student_id": "student-akif", "workflow_type": "Student Leave Request", "submission_date": "2026-10-15", "status": "Approved", "remarks": "Approved by Academic Head"},
            {"_id": "wf-2", "student_id": "student-akif", "workflow_type": "Duplicate ID Card Request", "submission_date": "2026-09-10", "status": "Processed", "remarks": "Card issued from Admin desk"}
        ]
        for wf in workflows:
            workflows_col.insert_one(wf)

        # 13. PLO Attainment (Matching page 13)
        plo_records = [
            {"semester": "Semester I", "course": "CSC111 - Digital Logic and Design", "class_event": "24SP-CS-1A", "faculty": "Ahsan Ali (Lecturer)", "credit_hours": "3+0", "po1": "100.00 (6/6)", "po2": "100.00 (1/1)", "po3": "-", "po4": "-"},
            {"semester": "Semester I", "course": "ENG111 - English Composition and Comprehension", "class_event": "24SP-ENG-1B", "faculty": "Nazia Tariq", "credit_hours": "3+0", "po1": "-", "po2": "-", "po3": "100.00 (2/2)", "po4": "-"},
            {"semester": "Semester III", "course": "CSC211 - Data Structures and Algorithms", "class_event": "24SP-CS-3A", "faculty": "Ahmad Raza", "credit_hours": "3+1", "po1": "100.00 (4/4)", "po2": "100.00 (3/3)", "po3": "-", "po4": "-"},
            {"semester": "Semester V", "course": "SE-311 - Data Warehousing and Data Mining", "class_event": "24SP-SE-5A", "faculty": "Syed Imran Jami", "credit_hours": "3+1", "po1": "95.00", "po2": "90.00", "po3": "88.00", "po4": "92.00"}
        ]
        for p in plo_records:
            plo_col.insert_one(p)

        self._seed_academic_modules()

    def _seed_academic_modules(self):
        enrollments_col = self.get_collection("enrollments")
        seating_col = self.get_collection("exam_seating")
        exams_col = self.get_collection("online_exams")
        transcripts_col = self.get_collection("transcripts")
        advance_col = self.get_collection("advance_fees")
        roadmap_col = self.get_collection("roadmaps")
        comm_col = self.get_collection("communications")
        offerings_col = self.get_collection("registration_offerings")

        enrolled_codes = ["SE-311", "SE-312", "CS-302", "MGT-201", "SE-314"]
        for code in enrolled_codes:
            enrollments_col.insert_one({
                "student_id": "student-akif",
                "course_code": code,
                "semester": "Fall 2026",
                "status": "Enrolled",
            })

        seating = [
            {"_id": "seat-1", "student_id": "student-akif", "session": "Fall 2026", "exam_type": "Midterm", "date": "14-Nov-2026", "start": "09:00 AM", "end": "12:00 PM", "course_code": "MGT-201", "course_name": "Principles of Management", "room": "R-403", "seat": "SE-23"},
            {"_id": "seat-2", "student_id": "student-akif", "session": "Fall 2026", "exam_type": "Midterm", "date": "16-Nov-2026", "start": "09:00 AM", "end": "12:00 PM", "course_code": "SE-311", "course_name": "Data Warehousing and Data Mining", "room": "R-401", "seat": "SE-15"},
            {"_id": "seat-3", "student_id": "student-akif", "session": "Fall 2026", "exam_type": "Midterm", "date": "18-Nov-2026", "start": "09:00 AM", "end": "12:00 PM", "course_code": "SE-314", "course_name": "Software Construction and Development", "room": "Lecture Hall 1", "seat": "SE-18"},
            {"_id": "seat-4", "student_id": "student-akif", "session": "Fall 2026", "exam_type": "Midterm", "date": "21-Nov-2026", "start": "09:00 AM", "end": "12:00 PM", "course_code": "CS-302", "course_name": "Parallel and Distributed Computing", "room": "R-301", "seat": "SE-04"},
            {"_id": "seat-5", "student_id": "student-akif", "session": "Fall 2026", "exam_type": "Midterm", "date": "24-Nov-2026", "start": "09:00 AM", "end": "12:00 PM", "course_code": "SE-312", "course_name": "Information Security", "room": "R-301", "seat": "SE-09"},
        ]
        for row in seating:
            seating_col.insert_one(row)

        exams_col.insert_one({
            "_id": "oe-1",
            "survey": "Midterm Quiz 1",
            "session": "Fall 2026",
            "course_code": "SE-312",
            "course": "Information Security (SE-312)",
            "faculty": "Fauzan Saeed",
            "timing": "30 Mins",
            "duration_minutes": 30,
            "status": "Available",
            "questions": [
                {"id": "q1", "prompt": "Which algorithm is commonly used for asymmetric public-key cryptography and digital signatures?", "options": ["AES-256", "RSA (Rivest-Shamir-Adleman)", "SHA-256", "DES"], "correct_index": 1},
                {"id": "q2", "prompt": "Which CIA triad property ensures that data is not altered in transit?", "options": ["Confidentiality", "Integrity", "Availability", "Non-repudiation"], "correct_index": 1},
                {"id": "q3", "prompt": "A hash function is primarily used to:", "options": ["Encrypt files for storage", "Generate a fixed-length digest", "Exchange session keys", "Filter network packets"], "correct_index": 1},
                {"id": "q4", "prompt": "Which control best reduces phishing risk for students?", "options": ["Larger password length only", "Security awareness and MFA", "Disabling antivirus", "Public Wi-Fi only"], "correct_index": 1},
                {"id": "q5", "prompt": "TLS primarily protects data:", "options": ["At rest on disk", "In transit between client and server", "Inside CPU registers", "In printed transcripts"], "correct_index": 1},
            ],
        })
        exams_col.insert_one({
            "_id": "oe-2",
            "survey": "Lab Assessment 1",
            "session": "Fall 2026",
            "course_code": "CS-302",
            "course": "Parallel and Distributed Computing (CS-302)",
            "faculty": "Khusro Mian",
            "timing": "45 Mins",
            "duration_minutes": 45,
            "status": "Upcoming",
            "questions": [],
        })
        exams_col.insert_one({
            "_id": "oe-3",
            "survey": "Pre-Mid Online Quiz",
            "session": "Fall 2026",
            "course_code": "SE-314",
            "course": "Software Construction and Development (SE-314)",
            "faculty": "Usman Waheed",
            "timing": "20 Mins",
            "duration_minutes": 20,
            "status": "Completed",
            "questions": [],
        })

        transcripts_col.insert_one({
            "_id": "tr-akif",
            "student_id": "student-akif",
            "program": "BS Software Engineering",
            "program_code": "BS-SE",
            "cgpa": 3.14,
            "total_credits": 84,
            "semesters": [
                {
                    "semester": "Semester I - Spring 2024",
                    "gpa": "3.25",
                    "credits": 17,
                    "courses": [
                        {"code": "CSC-111", "title": "Digital Logic and Design", "credits": "3+0", "grade": "A", "points": "12.0"},
                        {"code": "ENG-111", "title": "English Composition & Comprehension", "credits": "3+0", "grade": "B+", "points": "9.9"},
                        {"code": "MTH-111", "title": "Calculus & Analytical Geometry", "credits": "3+0", "grade": "B", "points": "9.0"},
                        {"code": "PHY-111", "title": "Applied Physics", "credits": "3+1", "grade": "A-", "points": "14.8"},
                        {"code": "CSC-112", "title": "Programming Fundamentals", "credits": "3+1", "grade": "A", "points": "16.0"},
                    ],
                },
                {
                    "semester": "Semester II - Fall 2024",
                    "gpa": "3.10",
                    "credits": 18,
                    "courses": [
                        {"code": "CSC-121", "title": "Object Oriented Programming", "credits": "3+1", "grade": "B+", "points": "13.2"},
                        {"code": "MTH-121", "title": "Linear Algebra", "credits": "3+0", "grade": "B", "points": "9.0"},
                        {"code": "CSC-122", "title": "Discrete Structures", "credits": "3+0", "grade": "A-", "points": "11.1"},
                        {"code": "PAK-121", "title": "Pakistan Studies", "credits": "2+0", "grade": "A", "points": "8.0"},
                        {"code": "ISL-121", "title": "Islamic Studies / Ethics", "credits": "2+0", "grade": "A", "points": "8.0"},
                        {"code": "ENG-121", "title": "Communication & Presentation Skills", "credits": "3+0", "grade": "B+", "points": "9.9"},
                    ],
                },
                {
                    "semester": "Semester III - Spring 2025",
                    "gpa": "3.15",
                    "credits": 17,
                    "courses": [
                        {"code": "CSC-211", "title": "Data Structures & Algorithms", "credits": "3+1", "grade": "B+", "points": "13.2"},
                        {"code": "CSC-212", "title": "Computer Architecture & Assembly", "credits": "3+1", "grade": "B", "points": "12.0"},
                        {"code": "MTH-211", "title": "Differential Equations", "credits": "3+0", "grade": "A-", "points": "11.1"},
                        {"code": "SE-211", "title": "Software Engineering Fundamentals", "credits": "3+0", "grade": "A", "points": "12.0"},
                        {"code": "STA-211", "title": "Probability & Statistics", "credits": "3+0", "grade": "B+", "points": "9.9"},
                    ],
                },
                {
                    "semester": "Semester IV - Fall 2025",
                    "gpa": "3.08",
                    "credits": 16,
                    "courses": [
                        {"code": "CSC-221", "title": "Operating Systems", "credits": "3+1", "grade": "B", "points": "12.0"},
                        {"code": "CSC-222", "title": "Database Systems", "credits": "3+1", "grade": "A-", "points": "14.8"},
                        {"code": "SE-221", "title": "Software Requirement Engineering", "credits": "3+0", "grade": "A", "points": "12.0"},
                        {"code": "SE-222", "title": "Software Design & Architecture", "credits": "3+0", "grade": "B+", "points": "9.9"},
                        {"code": "ENG-221", "title": "Technical & Business Writing", "credits": "2+0", "grade": "B+", "points": "6.6"},
                    ],
                },
                {
                    "semester": "Semester V - Fall 2026 (In Progress)",
                    "gpa": "Current",
                    "credits": 16,
                    "courses": [
                        {"code": "SE-311", "title": "Data Warehousing & Data Mining", "credits": "3+1", "grade": "Enrolled", "points": "-"},
                        {"code": "SE-312", "title": "Information Security", "credits": "3+0", "grade": "Enrolled", "points": "-"},
                        {"code": "CS-302", "title": "Parallel & Distributed Computing", "credits": "3+1", "grade": "Enrolled", "points": "-"},
                        {"code": "MGT-201", "title": "Principles of Management", "credits": "3+0", "grade": "Enrolled", "points": "-"},
                        {"code": "SE-314", "title": "Software Construction & Development", "credits": "3+1", "grade": "Enrolled", "points": "-"},
                    ],
                },
            ],
        })

        receipts = [
            {"_id": "adv-1", "student_id": "student-akif", "receipt_no": "ADV-0005432", "date": "22-Jan-2024", "amount": 25000.0, "status": "Cleared", "mode": "Bank Challan"},
            {"_id": "adv-2", "student_id": "student-akif", "receipt_no": "ADV-0006941", "date": "14-Sep-2024", "amount": 50000.0, "status": "Cleared", "mode": "Online Deposit"},
            {"_id": "adv-3", "student_id": "student-akif", "receipt_no": "ADV-0008320", "date": "25-Sep-2024", "amount": 92000.0, "status": "Cleared", "mode": "Pay Order"},
            {"_id": "adv-4", "student_id": "student-akif", "receipt_no": "ADV-0009144", "date": "16-Feb-2025", "amount": 70000.0, "status": "Cleared", "mode": "Kuickpay"},
            {"_id": "adv-5", "student_id": "student-akif", "receipt_no": "ADV-0010892", "date": "18-Feb-2025", "amount": 78000.0, "status": "Cleared", "mode": "Bank Transfer"},
            {"_id": "adv-6", "student_id": "student-akif", "receipt_no": "ADV-0012214", "date": "19-Sep-2026", "amount": 100000.0, "status": "Cleared", "mode": "Kuickpay"},
        ]
        for rec in receipts:
            advance_col.insert_one(rec)

        roadmap_col.insert_one({
            "_id": "rm-akif",
            "student_id": "student-akif",
            "registration_no": "24SP-028-SE",
            "candidate_name": "MUHAMMAD AKIF ALVI",
            "program": "BS Software Engineering",
            "enrollment_session": "Spring 2024",
            "semesters": [
                {"semester": "Spring 2024 (Semester I)", "status": "Completed", "courses": [
                    {"code": "CSC-111", "name": "Digital Logic and Design", "pre": "-", "cr": "3+0", "status": "PASS"},
                    {"code": "ENG-111", "name": "English Composition and Comprehension", "pre": "-", "cr": "3+0", "status": "PASS"},
                    {"code": "MTH-111", "name": "Calculus and Analytical Geometry", "pre": "-", "cr": "3+0", "status": "PASS"},
                    {"code": "PHY-111", "name": "Applied Physics", "pre": "-", "cr": "3+1", "status": "PASS"},
                    {"code": "CSC-112", "name": "Programming Fundamentals", "pre": "-", "cr": "3+1", "status": "PASS"},
                ]},
                {"semester": "Fall 2024 (Semester II)", "status": "Completed", "courses": [
                    {"code": "CSC-121", "name": "Object Oriented Programming", "pre": "CSC-112", "cr": "3+1", "status": "PASS"},
                    {"code": "MTH-121", "name": "Linear Algebra", "pre": "-", "cr": "3+0", "status": "PASS"},
                    {"code": "CSC-122", "name": "Discrete Structures", "pre": "-", "cr": "3+0", "status": "PASS"},
                    {"code": "PAK-121", "name": "Pakistan Studies", "pre": "-", "cr": "2+0", "status": "PASS"},
                    {"code": "ISL-121", "name": "Islamic Studies / Ethics", "pre": "-", "cr": "2+0", "status": "PASS"},
                    {"code": "ENG-121", "name": "Communication Skills", "pre": "ENG-111", "cr": "3+0", "status": "PASS"},
                ]},
                {"semester": "Spring 2025 (Semester III)", "status": "Completed", "courses": [
                    {"code": "CSC-211", "name": "Data Structures and Algorithms", "pre": "CSC-121", "cr": "3+1", "status": "PASS"},
                    {"code": "CSC-212", "name": "Computer Architecture & Assembly", "pre": "CSC-111", "cr": "3+1", "status": "PASS"},
                    {"code": "MTH-211", "name": "Differential Equations", "pre": "MTH-111", "cr": "3+0", "status": "PASS"},
                    {"code": "SE-211", "name": "Software Engineering Fundamentals", "pre": "-", "cr": "3+0", "status": "PASS"},
                    {"code": "STA-211", "name": "Probability & Statistics", "pre": "-", "cr": "3+0", "status": "PASS"},
                ]},
                {"semester": "Fall 2025 (Semester IV)", "status": "Completed", "courses": [
                    {"code": "CSC-221", "name": "Operating Systems", "pre": "CSC-211", "cr": "3+1", "status": "PASS"},
                    {"code": "CSC-222", "name": "Database Systems", "pre": "CSC-211", "cr": "3+1", "status": "PASS"},
                    {"code": "SE-221", "name": "Software Requirement Engineering", "pre": "SE-211", "cr": "3+0", "status": "PASS"},
                    {"code": "SE-222", "name": "Software Design & Architecture", "pre": "SE-211", "cr": "3+0", "status": "PASS"},
                    {"code": "ENG-221", "name": "Technical Report Writing", "pre": "ENG-121", "cr": "2+0", "status": "PASS"},
                ]},
                {"semester": "Fall 2026 (Semester V) - Current", "status": "In Progress", "courses": [
                    {"code": "SE-311", "name": "Data Warehousing & Data Mining", "pre": "CSC-222", "cr": "3+1", "status": "IN PROGRESS"},
                    {"code": "SE-312", "name": "Information Security", "pre": "-", "cr": "3+0", "status": "IN PROGRESS"},
                    {"code": "CS-302", "name": "Parallel and Distributed Computing", "pre": "CSC-221", "cr": "3+1", "status": "IN PROGRESS"},
                    {"code": "MGT-201", "name": "Principles of Management", "pre": "-", "cr": "3+0", "status": "IN PROGRESS"},
                    {"code": "SE-314", "name": "Software Construction & Development", "pre": "SE-222", "cr": "3+1", "status": "IN PROGRESS"},
                ]},
                {"semester": "Spring 2027 (Semester VI)", "status": "Upcoming", "courses": [
                    {"code": "SE-321", "name": "Software Quality Engineering", "pre": "SE-314", "cr": "3+0", "status": "PLANNED"},
                    {"code": "SE-322", "name": "Cloud Computing & DevOps", "pre": "CS-302", "cr": "3+1", "status": "PLANNED"},
                    {"code": "SE-323", "name": "Web Application Frameworks", "pre": "CSC-222", "cr": "3+1", "status": "PLANNED"},
                    {"code": "SE-324", "name": "Mobile Application Development", "pre": "CSC-121", "cr": "3+1", "status": "PLANNED"},
                    {"code": "SE-325", "name": "Software Project Management", "pre": "SE-211", "cr": "3+0", "status": "PLANNED"},
                ]},
            ],
        })

        comm_col.insert_one({
            "_id": "comm-1",
            "student_id": "student-akif",
            "student_name": "MUHAMMAD AKIF ALVI",
            "comm_type": "Query",
            "faculty": "Syed Imran Jami",
            "category": "Academic",
            "course_code": "SE-311",
            "message": "Sir, could you please share the ETL assignment rubric and the expected star-schema tables?",
            "follow_up": True,
            "email_reminder": False,
            "status": "Replied",
            "reply": "Please follow the assignment brief in LMS. Star schema should include one fact table and at least two dimensions.",
            "created_at": "2026-10-20T09:15:00+00:00",
        })

        offerings = [
            {"_id": "off-1", "code": "SE-321", "title": "Software Quality Engineering", "credits": 3, "type": "Core", "faculty": "Dr. Shahzad", "semester": "Spring 2027"},
            {"_id": "off-2", "code": "SE-322", "title": "Cloud Computing & DevOps", "credits": 4, "type": "Core Lab", "faculty": "Engr. Bilal", "semester": "Spring 2027"},
            {"_id": "off-3", "code": "SE-323", "title": "Web Application Frameworks", "credits": 4, "type": "Core Lab", "faculty": "Ms. Hira", "semester": "Spring 2027"},
            {"_id": "off-4", "code": "SE-324", "title": "Mobile Application Development", "credits": 4, "type": "Core Lab", "faculty": "Engr. Taha", "semester": "Spring 2027"},
            {"_id": "off-5", "code": "SE-325", "title": "Software Project Management", "credits": 3, "type": "Core", "faculty": "Syed Imran Jami", "semester": "Spring 2027"},
            {"_id": "off-6", "code": "CS-326", "title": "Artificial Intelligence & Machine Learning", "credits": 4, "type": "Elective", "faculty": "Dr. Farooq", "semester": "Spring 2027"},
        ]
        for offering in offerings:
            offerings_col.insert_one(offering)


db_manager = DatabaseManager()
