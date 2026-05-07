import { React, useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReservedFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'http://127.0.0.1:8000';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserFlights = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token'); // Changed from 'token' to 'access_token'
        
        if (!token) {
          navigate('#');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/flights/user-flights`, { // Changed endpoint
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setFlights(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('access_token');
          navigate('#');
        } else {
          setError(err.response?.data?.detail || err.message || 'Failed to fetch flights');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserFlights();
  }, [navigate]);

  const cancelReservation = async (reservationId) => { // Changed from flightId to reservationId
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_BASE_URL}/reservations/${reservationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setFlights(flights.filter(flight => flight.reservation_id !== reservationId));
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to cancel reservation');
    }
  };

  const calculateTotalDuration = (departureTime, arrivalTime) => {
    const dep = new Date(departureTime);
    const arr = new Date(arrivalTime);
    const duration = arr - dep;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return (
    <div className="bg-dark text-white min-vh-100">
      <Navbar />
      <div className="container py-5 text-center">Loading your flights...</div>
    </div>
  );

  if (error) return (
    <div className="bg-dark text-white min-vh-100">
      <Navbar />
      <div className="container py-5 text-center text-danger">
        {error}
        <div className="mt-3">
          <a href="#" className="btn btn-primary">Please login</a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="bg-dark text-white w-100 min-vh-100 mt-0 p-5">
        <div className="container">
          <h2 className="mb-4">Your Reserved Flights</h2>
          
          {flights.length === 0 ? (
            <div className="text-center py-5">
              <h4>You have no flight reservations yet</h4>
              <a href="/flights" className="btn btn-primary mt-3">Browse Available Flights</a>
            </div>
          ) : (
            <>
              <div className="row fw-bold text-uppercase text-center border-bottom pb-2">
                <div className="col-md-2">Flight No.</div>
                <div className="col-md-3">Route</div>
                <div className="col-md-2">Departure</div>
                <div className="col-md-2">Arrival</div>
                <div className="col-md-2">Duration</div>
                <div className="col-md-1">Action</div>
              </div>

              {flights.map((flight) => (
                <div key={flight.id} className="border-bottom py-3">
                  <div className="row text-center align-items-center">
                    <div className="col-md-2">
                      {flight.flight_number}
                      <div className="small">{flight.airline?.name}</div>
                    </div>
                    <div className="col-md-3">
                      {flight.departure_code} → {flight.destination_code}
                      <div className="small">
                        {flight.departure_airport?.name} to {flight.destination_airport?.name}
                      </div>
                    </div>
                    <div className="col-md-2">
                      {formatDate(flight.departure_time)}
                      <div className="small">Terminal {flight.terminal}, Gate {flight.gate}</div>
                    </div>
                    <div className="col-md-2">
                      {formatDate(flight.arrival_time)}
                    </div>
                    <div className="col-md-2">
                      {calculateTotalDuration(flight.departure_time, flight.arrival_time)}
                    </div>
                    <div className="col-md-1">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => cancelReservation(flight.reservation_id)} // Use reservation_id instead of flight.id
                    >
                      Cancel
                    </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="row mt-5">
                <div className="col-md-6 mb-4">
                  <h3>Flight Summary</h3>
                  <div className="d-flex justify-content-between">
                    <p>Total Flights:</p>
                    <p>{flights.length}</p>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <p>Total Seats Reserved:</p>
                    <p>{flights.reduce((total, flight) => total + (flight.seats?.length || 0), 0)}</p>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <h5>Next Flight:</h5>
                    <h5>
                      {flights.length > 0 
                        ? formatDate(Math.min(...flights.map(f => new Date(f.departure_time))))
                        : 'None'}
                    </h5>
                  </div>
                </div>

                <div className="col-md-6">
                  <h4>Need Assistance?</h4>
                  <p>Contact our customer service for any questions about your reservations.</p>
                  <button className="btn btn-outline-light">Contact Support</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ReservedFlights;