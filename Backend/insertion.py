import sys
from datetime import datetime, timedelta
from sqlalchemy.exc import SQLAlchemyError

from database import SessionLocal, engine, Base
from models import Country, Airport, Airline, User, Flight

DATABASE_PATH = "flight_reservation.db"


def init_db() -> None:
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")


def insert_test_data() -> None:
    db = SessionLocal()
    try:
        existing_country = db.query(Country).filter(Country.code == "US").first()
        if existing_country:
            print("Sample data already exists. Skipping insertion.")
            return

        print("⏳ Inserting sample data...")

        country = Country(
            code="US",
            name="United States",
            continent="North America",
            official_language="English",
            is_schengen_zone_member=False
        )
        airport = Airport(
            code="JFK",
            name="John F. Kennedy International Airport",
            location="New York",
            country_code="US",
            number_of_terminals=6
        )
        airline = Airline(
            name="SampleAir",
            iata_code="SA",
            icao_code="SMP",
            headquarters="New York",
            year_founded=2000,
            base_airport_code="JFK"
        )
        user = User(
            username="admin",
            email="admin@example.com",
            password="Admin123"
        )

        db.add_all([country, airport, airline, user])
        db.flush()

        flight = Flight(
            flight_number="SA100",
            departure_code="JFK",
            destination_code="JFK",
            departure_time=datetime.utcnow() + timedelta(days=1),
            arrival_time=datetime.utcnow() + timedelta(days=1, hours=5),
            total_seats=180,
            gate="A12",
            terminal="4",
            airline_id=airline.id,
            days_of_operation=127
        )
        db.add(flight)
        db.commit()

        print("✅ Sample data inserted successfully.")

    except SQLAlchemyError as e:
        db.rollback()
        print(f"\n❌ Error occurred: {e}", file=sys.stderr)
    finally:
        db.close()


if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("FLIGHT SYSTEM TEST DATA INSERTION")
    print("=" * 50 + "\n")

    init_db()
    insert_test_data()

    print("\nOperation completed. Check your database.")
