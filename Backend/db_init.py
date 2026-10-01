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
from sqlalchemy.orm import sessionmaker

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)

    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    session = SessionLocal()
    try:
        users_without_role = session.query(User).filter((User.role == None) | (User.role == '')).all()
        for user in users_without_role:
            user.role = 'User'
        session.commit()

        admin_exists = session.query(User).filter(User.role == 'Admin').first()
        user_count = session.query(User).count()
        if user_count == 0 and not admin_exists:
            print("No users found. Creating default admin user.")
            admin_user = User(
                username='admin',
                email='admin@example.com',
                password='Admin123',
                role='Admin'
            )
            session.add(admin_user)
            session.commit()
            print("Default admin created: username=admin password=Admin123")
    except Exception as e:
        session.rollback()
        print(f"Error during migration: {e}")
    finally:
        session.close()

    print("Database tables created successfully.")