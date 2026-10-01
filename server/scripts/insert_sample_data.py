import random
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.models import engine, interactions

def insert_sample_data():
    # Insert 100 sample click events with random coordinates (within a 1000x1000 grid)
    sample_events = [
        {
            "x": random.randint(0, 999),
            "y": random.randint(0, 999),
            "event": "click",
            "scroll_top": None,
            "scroll_height": None,
        }
        for _ in range(100)
    ]
    with engine.begin() as connection:
        connection.execute(interactions.insert(), sample_events)
    print("Sample data inserted successfully!")

if __name__ == "__main__":
    insert_sample_data()