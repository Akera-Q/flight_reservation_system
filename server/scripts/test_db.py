import os
import sys
from sqlalchemy import select

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.models import engine, interactions

with engine.connect() as connection:
    rows = connection.execute(select(interactions)).all()

if rows:
    print("Data found in PostgreSQL:")
    for row in rows:
        print(row)
else:
    print("No interaction data found.")
