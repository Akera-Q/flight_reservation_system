import React from 'react';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import axios from 'axios';

const FlightCard = ({ flight, isLoggedIn, username }) => {
  if (!flight || !flight.id) {
    return (
      <div className="card h-100 shadow-sm">
        <div className="card-body text-danger">
          Invalid flight data
        </div>
      </div>
    );
  }

  const {
    airline = {},
    departure_airport = {},
    destination_airport = {},
    flight_number = 'N/A',
    available_seats = 'N/A'
  } = flight;

  let departureTime, arrivalTime, duration;
  try {
    departureTime = flight.departure_time ? new Date(flight.departure_time) : null;
    arrivalTime = flight.arrival_time ? new Date(flight.arrival_time) : null;
    if (departureTime && arrivalTime) {
      duration = intervalToDuration({ start: departureTime, end: arrivalTime });
    }
  } catch (e) {
    console.error('Date parsing error:', e);
  }
  const randomSeat = () => {
    const row = Math.floor(Math.random() * 30) + 1; // 1-30
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 6)); // A-F
    return `${row}${letter}`;
  };

  const handleReserve = async () => {
    try {
      if (!isLoggedIn || !username) {
        alert('Please log in to reserve.');
        return;
      }
      await axios.post('http://127.0.0.1:8000/reservations/', {
        username: username, // <-- must be defined and not empty
        flight_id: flight.id,
        seat_number: randomSeat(),
        status: 'Pending'
      });
      alert('Reservation successful!');
    } catch (err) {
      console.error('Reservation error:', err);
      if (err.response) {
        console.error('Backend error data:', err.response.data);
        alert(
          'Reservation failed: ' +
          (err.response.data.detail ||
            JSON.stringify(err.response.data) ||
            err.message)
        );
      } else {
        alert('Reservation failed: ' + err.message);
      }
    }
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          {airline?.name || 'Unknown Airline'} - {flight_number}
        </h5>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between mb-3">
          <div>
            <h6 className="text-muted">Departure</h6>
            <p className="mb-1">
              {departureTime ? format(departureTime, 'MMM d, yyyy h:mm a') : 'N/A'}
            </p>
            <p className="fw-bold">
              {departure_airport.code || 'N/A'} ({departure_airport.name || 'N/A'})
            </p>
          </div>
          
          <div className="text-center">
            <div className="flight-duration">
              {duration ? formatDuration(duration, { format: ['hours', 'minutes'] }) : 'N/A'}
            </div>
            <div className="flight-arrow">→</div>
          </div>
          
          <div className="text-end">
            <h6 className="text-muted">Arrival</h6>
            <p className="mb-1">
              {arrivalTime ? format(arrivalTime, 'MMM d, yyyy h:mm a') : 'N/A'}
            </p>
            <p className="fw-bold">
              {destination_airport.code || 'N/A'} ({destination_airport.name || 'N/A'})
            </p>
          </div>
        </div>
        
        <div className="d-flex justify-content-between align-items-center">
        <span className="badge bg-secondary">
          {available_seats !== 'N/A' ? `${available_seats} seats available` : 'N/A'}
        </span>
        <button className="btn btn-sm btn-primary" onClick={handleReserve}>
          Book Now
        </button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;