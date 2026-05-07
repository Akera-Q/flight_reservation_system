import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import FlightCard from '../components/FlightCard';
import Navbar from '../components/Navbar';

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [showAll, setShowAll] = useState(false);

  const testConnection = async () => {
    try {
      const res = await axios.get('http://localhost:8000/health', {
        timeout: 5000
      });
      console.log('%c✅ Backend health check OK', 'color: green');
      return true;
    } catch (err) {
      console.error('❌ Backend connection failed:', {
        message: err.message,
        code: err.code,
        url: err.config?.url,
        status: err.response?.status
      });
      return false;
    }
  };

  const fetchFlights = async (controller) => {
    try {
      setLoading(true);
      setError(null);

      const isBackendUp = await testConnection();
      if (!isBackendUp) {
        throw new Error('Backend unavailable');
      }

      // Extract params from URL
      const params = {
      departure_code: searchParams.get('departure_code') || undefined,
      destination_code: searchParams.get('destination_code') || undefined,
      departure_date: searchParams.get('departure_date') || undefined
    };

      console.log('%c🔍 Search parameters:', 'color: blue', params);

      const endpoint = showAll ? 'http://localhost:8000/flights' 
                             : 'http://localhost:8000/flights/search';

      const response = await axios.get(endpoint, {
        params: showAll ? {} : params,
        signal: controller?.signal,
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('%c📦 Flight response:', 'color: orange', response.data);

      // Handle different response formats
      const flightData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.flights || [];

      if (!Array.isArray(flightData)) {
        throw new Error('Invalid response format');
      }

      console.log(`✈️ Loaded ${flightData.length} flights`);
      setFlights(flightData);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled:', err.message);
        return;
      }

      const errorDetails = {
        message: err.message,
        code: err.code,
        status: err.response?.status,
        url: err.config?.url,
        data: err.response?.data
      };

      console.error('Fetch error:', errorDetails);
      
      let errorMessage = 'Failed to fetch flights';
      if (err.response) {
        errorMessage += ` (Status: ${err.response.status})`;
        if (err.response.data?.detail) {
          errorMessage += `: ${err.response.data.detail}`;
        }
      } else if (err.request) {
        errorMessage += ': No response received';
      }

      setError(errorMessage);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchFlights(controller);
    return () => controller.abort();
  }, [searchParams, showAll]);

  const retry = () => fetchFlights();

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="d-flex justify-content-between mb-4">
          <h2>{showAll ? "All Flights" : "Search Results"}</h2>
          <button 
            className="btn btn-outline-primary" 
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Search Results" : "Show All Flights"}
          </button>
        </div>

        {/* {error && (
          <div className="alert alert-danger">
            <strong>Error:</strong>
            <pre>{error}</pre>
            <button 
              className="btn btn-sm btn-danger mt-2" 
              onClick={retry}
            >
              Retry
            </button>
          </div>
        )} */}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Fetching flight data...</p>
          </div>
        ) : flights.length === 0 ? (
          <div className="alert alert-warning">
            {showAll ? "No flights found." : "No matching flights. Try different search criteria."}
          </div>
        ) : (
          <div className="row g-4">
            {flights.map((flight, index) => (
              <div key={flight.id || index} className="col-md-6 col-lg-4">
                <FlightCard flight={flight} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Flights;