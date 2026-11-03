import sys
from pathlib import Path

# Project root aur backend directory ka path set karna
ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = ROOT_DIR / "backend"

# Python path mein backend directory add karein
sys.path.append(str(BACKEND_DIR))

try:
    from app.main import app
except ImportError:
    # Fallback agar import structure thora mukhtalif ho
    from main import app