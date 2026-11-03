from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def student_headers() -> dict:
    res = client.post(
        "/api/v1/auth/login",
        json={"email": "akif.24sp028@student.uitu.edu.pk", "password": "Akif@123"},
    )
    assert res.status_code == 200
    return {"Authorization": f"Bearer {res.json()['access_token']}"}


def test_my_courses_filters_enrollment():
    headers = student_headers()
    all_courses = client.get("/api/v1/courses", headers=headers)
    mine = client.get("/api/v1/courses/my-courses", headers=headers)
    assert all_courses.status_code == 200
    assert mine.status_code == 200
    all_codes = {c["code"] for c in all_courses.json()}
    my_codes = {c["code"] for c in mine.json()}
    assert "HUM-101" in all_codes
    assert "HUM-101" not in my_codes
    assert {"SE-311", "SE-312", "CS-302", "MGT-201", "SE-314"} <= my_codes


def test_exam_seating_and_admit_card():
    headers = student_headers()
    seating = client.get("/api/v1/exams/seating", headers=headers)
    assert seating.status_code == 200
    assert len(seating.json()) == 5
    card = client.get("/api/v1/exams/admit-card", headers=headers)
    assert card.status_code == 200
    assert card.json()["student"]["roll_no"] == "24SP-028-SE"
    assert len(card.json()["exams"]) == 5


def test_transcript_roadmap_and_advance_fees():
    headers = student_headers()
    transcript = client.get("/api/v1/transcripts/me", headers=headers)
    assert transcript.status_code == 200
    assert transcript.json()["total_credits"] == 84
    roadmap = client.get("/api/v1/roadmap", headers=headers)
    assert roadmap.status_code == 200
    assert len(roadmap.json()["semesters"]) >= 5
    receipts = client.get("/api/v1/fees/advance-receipts", headers=headers)
    assert receipts.status_code == 200
    assert len(receipts.json()) >= 1


def test_online_exam_does_not_leak_answers_and_scores():
    headers = student_headers()
    listing = client.get("/api/v1/exams/online", headers=headers)
    assert listing.status_code == 200
    available = next(item for item in listing.json() if item["status"] == "Available")
    detail = client.get(f"/api/v1/exams/online/{available['id']}", headers=headers)
    assert detail.status_code == 200
    body = detail.json()
    assert "correct_index" not in str(body)
    answers = {q["id"]: 1 for q in body["questions"]}
    submitted = client.post(
        f"/api/v1/exams/online/{available['id']}/submit",
        headers=headers,
        json={"answers": answers},
    )
    assert submitted.status_code == 200
    assert submitted.json()["correct"] == submitted.json()["total"]
    again = client.post(
        f"/api/v1/exams/online/{available['id']}/submit",
        headers=headers,
        json={"answers": answers},
    )
    assert again.status_code == 400


def test_communication_and_registration():
    headers = student_headers()
    created = client.post(
        "/api/v1/communications",
        headers=headers,
        json={
            "comm_type": "Query",
            "faculty": "Usman Waheed",
            "category": "Academic",
            "course_code": "SE-314",
            "message": "Could you confirm the due date for the design patterns case study?",
        },
    )
    assert created.status_code == 201
    inbox = client.get("/api/v1/communications", headers=headers)
    assert inbox.status_code == 200
    assert any(item["course_code"] == "SE-314" for item in inbox.json())

    offerings = client.get("/api/v1/registration/offerings", headers=headers)
    assert offerings.status_code == 200
    codes = [item["code"] for item in offerings.json()[:5]]
    registered = client.post(
        "/api/v1/registration",
        headers=headers,
        json={"course_codes": codes, "semester": "Spring 2027"},
    )
    assert registered.status_code == 201
    assert registered.json()["status"] == "Registered"


def test_todo_delete_is_scoped_to_student():
    headers = student_headers()
    created = client.post(
        "/api/v1/todos",
        headers=headers,
        json={"task": "Temporary portal QA task", "due_date": "2026-11-08", "priority": "Low"},
    )
    assert created.status_code == 201
    todo_id = created.json()["id"]
    deleted = client.delete(f"/api/v1/todos/{todo_id}", headers=headers)
    assert deleted.status_code == 200
    remaining = client.get("/api/v1/todos", headers=headers)
    assert all(item["id"] != todo_id for item in remaining.json())
