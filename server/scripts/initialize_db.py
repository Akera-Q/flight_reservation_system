import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.models import init_db

def create_db():
    init_db()
    print("Database and interactions table created successfully!")

if __name__ == "__main__":
    create_db()
