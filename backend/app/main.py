import logging
from fastapi import FastAPI
from app.middleware.cors import setup_cors
from app.routes import api_router
from app.database.db import db_manager

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("student_portal")

app = FastAPI(
    title="UIT University - Student Portal API",
    description="Professional full-stack university management system API with RBAC (ADMIN / STUDENT).",
    version="3.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

logger.info("Student Portal API starting")
setup_cors(app)

# Include all /api/v1 routes
app.include_router(api_router)


@app.get("/")
def root():
    return {
        "portal": "UIT University Student Portal API",
        "version": "3.0.0",
        "status": "Online",
        "docs": "/docs",
        "roles_supported": ["ADMIN", "STUDENT"]
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "database": "mongodb" if db_manager.is_connected else "in-memory",
        "roles_supported": ["ADMIN", "STUDENT"],
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
