#to run use: python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
from contextlib import asynccontextmanager
from typing import List, Annotated, Optional
from datetime import datetime, timedelta, date
import hashlib
import secrets
import binascii

from fastapi import Depends, FastAPI, HTTPException, status, Query
from fastapi.security import HTTPBasic, HTTPBasicCredentials, OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from jose import JWTError, jwt
from fastapi.responses import JSONResponse

import models
import schemas
from database import SessionLocal, engine
from db_init import init_db



SECRET_KEY = "your-secret-key-here"  # Change this to a strong random key in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Lifespan handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing database...")
    init_db()
    yield
    print("Shutting down...")

app = FastAPI(lifespan=lifespan)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

# Authentication Utilities
def hash_password(password: str, salt: str = None) -> tuple[str, str]:
    """Secure password hashing using PBKDF2-HMAC-SHA256"""
    salt = salt or secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        10  # Number of iterations
    )
    hashed = binascii.hexlify(dk).decode()
    return hashed, salt

def verify_password(plain_password: str, hashed_password: str, salt: str) -> bool:
    """Verify password against stored hash"""
    new_hash, _ = hash_password(plain_password, salt)
    return secrets.compare_digest(new_hash, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

def authenticate_user(db: Session, username: str, password: str):
    """Authenticate user by username/email and password"""
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        user = db.query(models.User).filter(models.User.email == username).first()
        if not user:
            return None
    
    if not user.verify_password(password):
        return None
    return user

def get_current_user(
    db: db_dependency,
    token: str = Depends(oauth2_scheme)
):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    username = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

current_user_dependency = Annotated[models.User, Depends(get_current_user)]

@app.get("/")
async def root():
    return {"message": "Backend is running"}

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Server is running"}

# Authentication Endpoints

# endpoint for token verification
@app.get("/verify-token")
async def verify_token(
    db: db_dependency,
    token: str = Depends(oauth2_scheme)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        user = db.query(models.User).filter(models.User.username == username).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid user")
        return {"username": username}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Updated /token endpoint to include username
@app.post("/token")
async def login_for_access_token(
    db: db_dependency,
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user.username,
        },
        expires_delta=access_token_expires
    )
    
    return { 
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username,
    }

@app.post("/register/", response_model=schemas.UserPublic)
def register_user(user: schemas.UserCreate, db: db_dependency):
    print("\n=== Registration Attempt ===")
    print(f"Username: {user.username}")
    print(f"Email: {user.email}")
    
    try:
        # Check for existing username
        existing_user = db.query(models.User).filter(
            models.User.username == user.username
        ).first()
        if existing_user:
            print("❌ Username already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )

        # Check for existing email
        existing_email = db.query(models.User).filter(
            models.User.email == user.email
        ).first()
        if existing_email:
            print("❌ Email already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create user - let the model handle password hashing
        print("Creating new user...")
        db_user = models.User(
            username=user.username,
            email=user.email,
            password=user.password  # Plain password
        )
        
        db.add(db_user)
        db.flush()  # Test if we can persist without full commit
        print("User flushed successfully")
        
        db.commit()
        print("✅ User committed to database")
        db.refresh(db_user)
        
        # Verify what was actually stored
        stored_user = db.query(models.User).filter(
            models.User.username == user.username
        ).first()
        print("Stored user details:")
        print(f"Username: {stored_user.username}")
        print(f"Email: {stored_user.email}")
        print(f"Salt: {stored_user.salt}")
        print(f"Password hash: {stored_user.hashed_password}")
        
        return db_user
        
    except Exception as e:
        db.rollback()
        print(f"❌ Registration failed: {str(e)}")
        print(f"Error type: {type(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# User Endpoints
@app.get("/users/me/", response_model=schemas.UserPublic)
@app.get("/user/profile/", response_model=schemas.UserPublic)
def read_current_user(current_user: models.User = Depends(get_current_user)):
    """Get current user details"""
    return current_user

# Flight Endpoints
@app.post("/flights", response_model=schemas.FlightPublic)
@app.post("/flights/", response_model=schemas.FlightPublic)
def create_flight(
    flight: schemas.FlightCreate,
    db: db_dependency
):
    try:
        # Validate airports exist
        departure_airport = db.query(models.Airport).filter_by(code=flight.departure_code).first()
        destination_airport = db.query(models.Airport).filter_by(code=flight.destination_code).first()
        
        if not departure_airport or not destination_airport:
            raise HTTPException(
                status_code=400,
                detail="Invalid airport code(s) provided"
            )
        
        # Validate dates
        if flight.arrival_time <= flight.departure_time:
            raise HTTPException(
                status_code=400,
                detail="Arrival time must be after departure time"
            )
        
        db_flight = models.Flight(
            **flight.model_dump(exclude={"departure_code", "destination_code", "available_seats"}),
            departure_code=flight.departure_code.upper(),
            destination_code=flight.destination_code.upper(),
            user_id=flight.user_id if hasattr(flight, 'user_id') and flight.user_id else None
        )
        
        db.add(db_flight)
        db.commit()
        db.refresh(db_flight)
        # Generate seats for the flight
        db_flight.generate_seats(db)
        return db_flight
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create flight: {str(e)}"
        )


@app.get("/flights", response_model=List[schemas.FlightWithDetails])
@app.get("/flights/", response_model=List[schemas.FlightWithDetails])
def get_flights(
    db: db_dependency,
    departure_code: Optional[str] = None,
    destination_code: Optional[str] = None,
    departure_date: Optional[date] = None,
    skip: int = 0,
    limit: int = 100
):
    """Get flights with optional filters"""
    query = db.query(models.Flight).options(
        joinedload(models.Flight.airline),
        joinedload(models.Flight.departure_airport).joinedload(models.Airport.country),
        joinedload(models.Flight.destination_airport).joinedload(models.Airport.country)
    )

    if departure_code and departure_code.strip():
        query = query.filter(models.Flight.departure_code == departure_code.strip().upper())
    if destination_code and destination_code.strip():
        query = query.filter(models.Flight.destination_code == destination_code.strip().upper())
    if departure_date:
        query = query.filter(func.date(models.Flight.departure_time) == departure_date)

    flights = query.offset(skip).limit(limit).all()
    return flights


@app.get("/flights/search", response_model=List[schemas.FlightWithDetails])
def search_flights(
    db: db_dependency,
    departure_code: Optional[str] = Query(None, min_length=3, max_length=3),
    destination_code: Optional[str] = Query(None, min_length=3, max_length=3),
    departure_date: Optional[date] = Query(None)
):
    try:
        query = db.query(models.Flight).options(
            joinedload(models.Flight.airline),
            joinedload(models.Flight.departure_airport).joinedload(models.Airport.country),
            joinedload(models.Flight.destination_airport).joinedload(models.Airport.country)
        )
        
        departure_code = departure_code.strip().upper() if departure_code and departure_code.strip() else None
        destination_code = destination_code.strip().upper() if destination_code and destination_code.strip() else None

        if departure_code:
            query = query.filter(models.Flight.departure_code == departure_code)
        if destination_code:
            query = query.filter(models.Flight.destination_code == destination_code)
        
        if departure_date:
            if isinstance(departure_date, str):
                if departure_date.strip():
                    departure_date = datetime.strptime(departure_date, "%Y-%m-%d").date()
                else:
                    departure_date = None
            if departure_date:
                query = query.filter(func.date(models.Flight.departure_time) == departure_date)
        
        flights = query.all()
        return flights
        
    except ValueError as e:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid date format: {str(e)}. Expected YYYY-MM-DD."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# Passenger Endpoints
@app.post("/passengers/", response_model=schemas.PassengerPublic)
def create_passenger(
    db: db_dependency,
    passenger: schemas.PassengerCreate
):
    """Create a new passenger"""
    db_passenger = models.Passenger(**passenger.model_dump())
    db.add(db_passenger)
    db.commit()
    db.refresh(db_passenger)
    return db_passenger

@app.get("/passengers/", response_model=List[schemas.PassengerPublic])
def read_passengers(
    db: db_dependency,
    skip: int = 0,
    limit: int = 100
):
    """Get list of passengers"""
    passengers = db.query(models.Passenger).offset(skip).limit(limit).all()
    return passengers

# Reservation Endpoints
@app.post("/reservations/", response_model=schemas.ReservationPublic)
def create_reservation(
    db: db_dependency,
    current_user: current_user_dependency,
    reservation: schemas.ReservationCreate
):
    """Create a new reservation"""
    # Check if flight exists
    db_flight = db.query(models.Flight).filter(
        models.Flight.id == reservation.flight_id
    ).first()
    if not db_flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    
    # Check if passenger exists
    db_passenger = db.query(models.Passenger).filter(
        models.Passenger.id == reservation.passenger_id
    ).first()
    if not db_passenger:
        raise HTTPException(status_code=404, detail="Passenger not found")
    
    # Check seat availability
    seat = db.query(models.Seat).filter(
        models.Seat.flight_id == reservation.flight_id,
        models.Seat.seat_number == reservation.seat_number,
        models.Seat.is_available == True
    ).first()
    if not seat:
        raise HTTPException(status_code=400, detail="Seat not available")
    
    data = reservation.model_dump()
    data["departure_country"] = db_flight.departure_airport.country_code if db_flight.departure_airport else db_flight.departure_code
    data["destination_country"] = db_flight.destination_airport.country_code if db_flight.destination_airport else db_flight.destination_code
    data.setdefault("status", "Pending")
    
    db_reservation = models.Reservation(**data)
    seat.is_available = False
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

# Ticket Endpoints
@app.post("/tickets/", response_model=schemas.TicketPublic)
def create_ticket(
    db: db_dependency,
    ticket: schemas.TicketCreate
):
    """Create a new ticket"""
    # Check reservation exists
    reservation = db.query(models.Reservation).filter(
        models.Reservation.id == ticket.reservation_id
    ).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    db_ticket = models.Ticket(**ticket.model_dump())
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

# Payment Endpoints
@app.post("/payments/", response_model=schemas.PaymentPublic)
def create_payment(
    db: db_dependency,
    payment: schemas.PaymentCreate
):
    """Create a new payment"""
    db_payment = models.Payment(**payment.model_dump())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

# Airport Endpoints
@app.get("/airports/", response_model=List[schemas.AirportWithCountry])
def get_airports_with_countries(
    db: db_dependency,
    skip: int = 0,
    limit: int = 100
):
    """Get list of airports with country information"""
    airports = db.query(models.Airport).options(
        joinedload(models.Airport.country)
    ).offset(skip).limit(limit).all()
    return airports

@app.post("/airports/", response_model=schemas.AirportPublic)
def create_airport(
    airport: schemas.AirportBase,
    db: db_dependency
):
    db_airport = models.Airport(**airport.model_dump())
    db.add(db_airport)
    db.commit()
    db.refresh(db_airport)
    return db_airport

@app.put("/airports/{airport_code}/", response_model=schemas.AirportPublic)
def update_airport(
    airport_code: str,
    airport: schemas.AirportBase,
    db: db_dependency
):
    db_airport = db.query(models.Airport).filter(models.Airport.code == airport_code).first()
    if not db_airport:
        raise HTTPException(status_code=404, detail="Airport not found")
    for key, value in airport.model_dump().items():
        setattr(db_airport, key, value)
    db.commit()
    db.refresh(db_airport)
    return db_airport

@app.delete("/airports/{airport_code}/")
def delete_airport(
    airport_code: str,
    db: db_dependency
):
    db_airport = db.query(models.Airport).filter(models.Airport.code == airport_code).first()
    if not db_airport:
        raise HTTPException(status_code=404, detail="Airport not found")
    db.delete(db_airport)
    db.commit()
    return {"detail": "Airport deleted"}

# Country Endpoints
@app.get("/countries/", response_model=List[schemas.CountryPublic])
def get_countries(
    db: db_dependency,
    skip: int = 0,
    limit: int = 100
):
    return db.query(models.Country).offset(skip).limit(limit).all()

@app.post("/countries/", response_model=schemas.CountryPublic)
def create_country(
    country: schemas.CountryBase,
    db: db_dependency
):
    db_country = models.Country(**country.model_dump())
    db.add(db_country)
    db.commit()
    db.refresh(db_country)
    return db_country

@app.put("/countries/{country_code}/", response_model=schemas.CountryPublic)
def update_country(
    country_code: str,
    country: schemas.CountryBase,
    db: db_dependency
):
    db_country = db.query(models.Country).filter(models.Country.code == country_code).first()
    if not db_country:
        raise HTTPException(status_code=404, detail="Country not found")
    for key, value in country.model_dump().items():
        setattr(db_country, key, value)
    db.commit()
    db.refresh(db_country)
    return db_country

@app.delete("/countries/{country_code}/")
def delete_country(
    country_code: str,
    db: db_dependency
):
    db_country = db.query(models.Country).filter(models.Country.code == country_code).first()
    if not db_country:
        raise HTTPException(status_code=404, detail="Country not found")
    db.delete(db_country)
    db.commit()
    return {"detail": "Country deleted"}

# Airline Endpoints
@app.get("/airlines/", response_model=List[schemas.AirlinePublic])
def get_airlines(
    db: db_dependency,
    skip: int = 0,
    limit: int = 100
):
    return db.query(models.Airline).offset(skip).limit(limit).all()

@app.post("/airlines/", response_model=schemas.AirlinePublic)
def create_airline(
    airline: schemas.AirlineBase,
    db: db_dependency
):
    db_airline = models.Airline(**airline.model_dump())
    db.add(db_airline)
    db.commit()
    db.refresh(db_airline)
    return db_airline

@app.put("/airlines/{airline_id}/", response_model=schemas.AirlinePublic)
def update_airline(
    airline_id: int,
    airline: schemas.AirlineBase,
    db: db_dependency
):
    db_airline = db.query(models.Airline).filter(models.Airline.id == airline_id).first()
    if not db_airline:
        raise HTTPException(status_code=404, detail="Airline not found")
    for key, value in airline.model_dump().items():
        setattr(db_airline, key, value)
    db.commit()
    db.refresh(db_airline)
    return db_airline

@app.delete("/airlines/{airline_id}/")
def delete_airline(
    airline_id: int,
    db: db_dependency
):
    db_airline = db.query(models.Airline).filter(models.Airline.id == airline_id).first()
    if not db_airline:
        raise HTTPException(status_code=404, detail="Airline not found")
    db.delete(db_airline)
    db.commit()
    return {"detail": "Airline deleted"}

# Promotion Endpoints
@app.get("/promotions/", response_model=List[schemas.PromotionPublic])
def get_promotions(
    db: db_dependency,
    skip: int = 0,
    limit: int = 100
):
    return db.query(models.Promotion).offset(skip).limit(limit).all()

@app.post("/promotions/", response_model=schemas.PromotionPublic)
def create_promotion(
    promotion: schemas.PromotionCreate,
    db: db_dependency
):
    db_promotion = models.Promotion(**promotion.model_dump())
    db.add(db_promotion)
    db.commit()
    db.refresh(db_promotion)
    return db_promotion

@app.put("/promotions/{promo_id}/", response_model=schemas.PromotionPublic)
def update_promotion(
    promo_id: str,
    promotion: schemas.PromotionCreate,
    db: db_dependency
):
    db_promotion = db.query(models.Promotion).filter(models.Promotion.promo_id == promo_id).first()
    if not db_promotion:
        raise HTTPException(status_code=404, detail="Promotion not found")
    for key, value in promotion.model_dump().items():
        setattr(db_promotion, key, value)
    db.commit()
    db.refresh(db_promotion)
    return db_promotion

@app.delete("/promotions/{promo_id}/")
def delete_promotion(
    promo_id: str,
    db: db_dependency
):
    db_promotion = db.query(models.Promotion).filter(models.Promotion.promo_id == promo_id).first()
    if not db_promotion:
        raise HTTPException(status_code=404, detail="Promotion not found")
    db.delete(db_promotion)
    db.commit()
    return {"detail": "Promotion deleted"}

# Flight admin endpoints
@app.put("/flights/{flight_id}/", response_model=schemas.FlightPublic)
def update_flight(
    flight_id: int,
    flight: schemas.FlightCreate,
    db: db_dependency
):
    db_flight = db.query(models.Flight).filter(models.Flight.id == flight_id).first()
    if not db_flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    for key, value in flight.model_dump(exclude_none=True).items():
        if key in {"departure_code", "destination_code"}:
            setattr(db_flight, key, value.upper())
        else:
            setattr(db_flight, key, value)
    db.commit()
    db.refresh(db_flight)
    return db_flight

@app.delete("/flights/{flight_id}/")
def delete_flight(
    flight_id: int,
    db: db_dependency
):
    db_flight = db.query(models.Flight).filter(models.Flight.id == flight_id).first()
    if not db_flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    db.delete(db_flight)
    db.commit()
    return {"detail": "Flight deleted"}

# Passenger admin endpoints
@app.put("/passengers/{passenger_id}/", response_model=schemas.PassengerPublic)
def update_passenger(
    passenger_id: int,
    passenger: schemas.PassengerCreate,
    db: db_dependency
):
    db_passenger = db.query(models.Passenger).filter(models.Passenger.id == passenger_id).first()
    if not db_passenger:
        raise HTTPException(status_code=404, detail="Passenger not found")
    for key, value in passenger.model_dump(exclude_none=True).items():
        setattr(db_passenger, key, value)
    db.commit()
    db.refresh(db_passenger)
    return db_passenger

@app.delete("/passengers/{passenger_id}/")
def delete_passenger(
    passenger_id: int,
    db: db_dependency
):
    db_passenger = db.query(models.Passenger).filter(models.Passenger.id == passenger_id).first()
    if not db_passenger:
        raise HTTPException(status_code=404, detail="Passenger not found")
    db.delete(db_passenger)
    db.commit()
    return {"detail": "Passenger deleted"}

# Reservation admin endpoints
@app.delete("/reservations/{reservation_id}/")
def cancel_reservation(
    reservation_id: int,
    db: db_dependency
):
    db_reservation = db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()
    if not db_reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    db_reservation.status = "Canceled"
    seat = db.query(models.Seat).filter(
        models.Seat.flight_id == db_reservation.flight_id,
        models.Seat.seat_number == db_reservation.seat_number
    ).first()
    if seat:
        seat.is_available = True
    db.commit()
    return {"detail": "Reservation canceled"}

@app.get("/flights/user-flights")
def get_user_flights(
    db: db_dependency,
    current_user: models.User = Depends(get_current_user)
):
    passenger = db.query(models.Passenger).filter(models.Passenger.email == current_user.email).first()
    if not passenger:
        return []  # Return empty list if no passenger profile found

    reservations = db.query(models.Reservation).filter(models.Reservation.passenger_id == passenger.id).options(
        joinedload(models.Reservation.flight).joinedload(models.Flight.airline),
        joinedload(models.Reservation.flight).joinedload(models.Flight.departure_airport).joinedload(models.Airport.country),
        joinedload(models.Reservation.flight).joinedload(models.Flight.destination_airport).joinedload(models.Airport.country)
    ).all()

    results = []
    for reservation in reservations:
        flight = reservation.flight
        if not flight:
            continue
        results.append({
            "id": flight.id,
            "flight_number": flight.flight_number,
            "departure_code": flight.departure_code,
            "destination_code": flight.destination_code,
            "departure_time": flight.departure_time,
            "arrival_time": flight.arrival_time,
            "gate": flight.gate,
            "terminal": flight.terminal,
            "airline": {
                "id": flight.airline.id if flight.airline else None,
                "name": flight.airline.name if flight.airline else None
            },
            "departure_airport": {
                "code": flight.departure_airport.code if flight.departure_airport else None,
                "name": flight.departure_airport.name if flight.departure_airport else None
            },
            "destination_airport": {
                "code": flight.destination_airport.code if flight.destination_airport else None,
                "name": flight.destination_airport.name if flight.destination_airport else None
            },
            "reservation_id": reservation.id,
            "seat_number": reservation.seat_number,
            "status": reservation.status,
            "seats": [
                {"seat_number": seat.seat_number, "is_available": seat.is_available}
                for seat in flight.seats
            ] if flight.seats else []
        })
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
