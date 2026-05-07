import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ReservedFlights from "./pages/ReservedFlights";
import Flights from "./pages/Flights";
import AdminPanel from './pages/AdminPanel';
// import About from './pages/About';
// import Contact from './pages/Contact';

function App() {
  return (
    //<AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reserved-flights" element={<ReservedFlights />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/adminPanel" element={<AdminPanel />} />
            {/* <Route path="/about" element={<About />} /> */}
            {/* <Route path="/contact" element={<Contact />} /> */}
          </Routes>
        </div>
      </Router>
    //</AuthProvider>
  );
}

export default App;