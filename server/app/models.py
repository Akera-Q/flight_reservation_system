import os

from sqlalchemy import Column, Integer, MetaData, String, Table, create_engine, insert

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("Set DATABASE_URL to a PostgreSQL connection string before starting the server.")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
metadata = MetaData()
interactions = Table(
    "interactions",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("event", String, nullable=False),
    Column("x", Integer),
    Column("y", Integer),
    Column("scroll_top", Integer),
    Column("scroll_height", Integer),
)


def init_db():
    metadata.create_all(bind=engine)


def insert_data(event, x=None, y=None, scroll_top=None, scroll_height=None):
    with engine.begin() as connection:
        connection.execute(
            insert(interactions).values(
                event=event,
                x=x,
                y=y,
                scroll_top=scroll_top,
                scroll_height=scroll_height,
            )
        )

# Call this function to initialize the database when the app starts
init_db()
