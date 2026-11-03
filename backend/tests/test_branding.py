from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_portal_logo_is_served_from_database():
    response = client.get("/api/v1/logo")
    logo_path = Path(__file__).resolve().parents[2] / "frontend" / "src" / "assets" / "uitLogo.jpeg"

    assert response.status_code == 200
    assert response.headers["content-type"] == "image/jpeg"
    assert response.content == logo_path.read_bytes()
