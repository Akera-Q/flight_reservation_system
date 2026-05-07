# Flight Reservation System

A full-stack web application for booking and managing flight reservations. Built with React frontend and FastAPI backend, featuring user authentication, flight search, seat selection, and reservation management.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Flight Search**: Search flights by departure/destination airports and date
- **Seat Selection**: Interactive seat map for flight reservations
- **Reservation Management**: View and manage booked flights
- **Admin Panel**: Administrative functions for managing flights, passengers, and data
- **Real-time Updates**: CORS-enabled API for seamless frontend-backend communication
- **Database Integration**: SQLite database with SQLAlchemy ORM
- **Responsive Design**: Modern React UI with CSS styling

## Tech Stack

### Frontend

- React 18
- Vite (build tool)
- React Router (routing)
- Axios (API calls)
- CSS Modules

### Backend

- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- SQLite (database)
- JWT (authentication)
- Pydantic (data validation)
- Uvicorn (ASGI server)

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd flight-reservation-app
   ```

2. **Backend Setup**

   ```bash
   cd Backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Database Initialization**

   ```bash
   python db_init.py
   python insertion.py  # Insert sample data
   ```

4. **Frontend Setup**
   ```bash
   cd ..
   npm install
   ```

## Running the Application

1. **Start the Backend**

   ```bash
   cd Backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start the Frontend**

   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## API Endpoints

### Authentication

- `POST /token` - Login
- `POST /register` - User registration
- `GET /verify-token` - Token verification

### Flights

- `GET /flights` - List flights with filters
- `POST /flights` - Create flight (admin)
- `PUT /flights/{id}` - Update flight (admin)
- `DELETE /flights/{id}` - Delete flight (admin)

### Reservations

- `POST /reservations` - Create reservation
- `GET /flights/user-flights` - Get user's flights

### Airports & Airlines

- `GET /airports` - List airports
- `GET /airlines` - List airlines
- `POST /airports` - Create airport (admin)
- `POST /airlines` - Create airline (admin)

## Database Schema

The application uses the following main entities:

- Users
- Flights
- Passengers
- Reservations
- Seats
- Airports
- Airlines
- Countries
- Payments
- Tickets
- Promotions

## Scripts

Located in the `scripts/` directory:

- `initialize_db.py` - Initialize database
- `insert_sample_data.py` - Insert sample data
- `test_db.py` - Test database connections
- `generate-heatmap.py` - Generate flight data heatmap

## Project Structure

```
flight-reservation-app/
├── Backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── database.py          # Database configuration
│   └── db_init.py           # Database initialization
├── src/
│   ├── components/          # React components
│   ├── pages/               # Application pages
│   ├── services/            # API services
│   └── assets/              # Static assets
├── scripts/                 # Utility scripts
├── public/                  # Public assets
└── package.json             # Frontend dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
