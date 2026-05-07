from database import engine, Base
from models import (
    User,
    Flight,
    Passenger,
    Reservation,
    Airline,
    Airport,
    Seat,
    Country,
    Ticket,
    Payment,
    Promotion,
    Special_promotion,  # if it uses table inheritance
    BookingAgent,
    Luggage,
    Loyalty_program
)

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")