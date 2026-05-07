import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import FlightSearchForm from '../components/FlightSearchForm';
import { Dropdown, Card, CardGroup, Carousel, Ratio, Accordion, Container, Row, Col, Button, Form, InputGroup, } from 'react-bootstrap';
import "../App.css";
//import InteractionTracker from '../services/InteractionTracker';    //related to the heatmap generation, in case I forget where it was
import {
  FaPlane, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, } from "react-icons/fa";

const App = () => {
  const [expanded, setExpanded] = useState({faq1: false, faq2: false});
  const faqs = [
    {
      question: "How do I book a flight?",
      answer:
        "Search for available flights using your departure city, destination, and travel dates. Select your preferred flight, enter passenger information, and complete the payment process.",
    },
    {
      question: "Can I cancel or modify my reservation?",
      answer:
        "Yes. Depending on the airline policy, you can manage, modify, or cancel your reservation from the 'My Bookings' section after logging into your account.",
    },
    {
      question: "How will I receive my ticket?",
      answer:
        "Once your booking is confirmed, an electronic ticket will be sent to your registered email address instantly.",
    },
    {
      question: "What payment methods are supported?",
      answer:
        "We support major credit cards, debit cards, and selected online payment gateways for secure transactions.",
    },
    {
      question: "Is my payment information secure?",
      answer:
        "Yes. All payment transactions are encrypted and processed securely using trusted payment providers and backend verification systems.",
    },
    {
      question: "Can I track my flight status?",
      answer:
        "Yes. You can view real-time flight status updates directly from your dashboard or booking details page.",
    },
  ];
  return (
    <>
    {/* <InteractionTracker /> */}
      <Navbar />
      <div className="parent">
        <div className="div1 photo-container">
          <div className='photo-wrapper left'>
            <img src="/the_old_hunter.jpg" alt="hunter" />
            <img src="/the_old_hunter.jpg" alt="hunter" />
            <img src="/the_old_hunter.jpg" alt="hunter" />
          </div>
          <div className='photo-wrapper right'>
            <img src="/the_old_hunter.jpg" alt="hunter" />
            <img src="/the_old_hunter.jpg" alt="hunter" />
            <img src="/the_old_hunter.jpg" alt="hunter" />
            <img src="/the_old_hunter.jpg" alt="hunter" />
            <img src="/the_old_hunter.jpg" alt="hunter" />
          </div>
        </div>
        <div className="div2">
          <h2>Compare flight deals from 100s of sites.</h2>
        </div>
        <div className="div3">
          <div className="flightButtonContainer">
            <button className="flightButtons glass-button btn">
              <i className="fa-solid fa-plane"></i>
            </button>
            <p style={{color:'white'}}>Flights</p>
          </div>
          <div className="flightButtonContainer">
            <button className="flightButtons glass-button btn">
              <i className="fa-solid fa-couch"></i>
            </button>
            <p style={{color:'white'}}>Stays</p>
          </div>
          <div className="flightButtonContainer">
            <button className="flightButtons glass-button btn">
              <i className="bi bi-car-front-fill"></i>
            </button>
            <p style={{color:'white'}}>Car Rental</p>
          </div>
        </div>
        <div className="div4">
          {/* this thing is empty, use it if you want or something */}
        </div>
        <div className="div5 d-flex">
          <FlightSearchForm />
        </div>
      </div>
      {/* heatmap generation code, in case I forget where it was */}
      {/* <img 
        src={`http://127.0.0.1:5000/static/heatmap.png?t=${Date.now()}`} 
        alt="User Heatmap" 
        style={{ width: "500px", border: "2px solid black" }}
      /> */}

<CardGroup style={{padding: '35px 8%', border:'none', height:'280px', gap:'15px'}}>
      <Card style={{padding: '1%', border:'1px solid grey', height:'fit-content', borderRadius:'35px'}}>
        <Card.Body>
          <div style={{paddingBottom:'50px'}}>
            <i class="fa-solid fa-star" style={{color:'#FFA30F'}}></i>
            <i class="fa-solid fa-star" style={{color:'#FFA30F'}}></i>
            <i class="fa-solid fa-star" style={{color:'#FFA30F'}}></i>
            <i class="fa-solid fa-star" style={{color:'#FFA30F'}}></i>
            <i class="fa-solid fa-star" style={{color:'#FFA30F'}}></i>
            </div>
          <Card.Title>Customers Love Us!</Card.Title>
          <Card.Text>
            If downloads were negative we would have been #NO.(-1) for sure
          </Card.Text>
        </Card.Body>
        {/* <Card.Footer>
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer> */}
      </Card>
      <Card style={{padding: '1%', border:'1px solid grey', height:'fit-content', borderRadius:'35px'}}>
        <Card.Body>
          <div style={{paddingBottom:'30px'}}>
          <img src="/the_old_hunter.jpg" alt="hunter" style={{height:'45px', borderRadius:'100%', marginRight:'-15px'}} />
          <img src="/the_old_hunter.jpg" alt="hunter" style={{height:'45px', borderRadius:'100%', marginRight:'-15px'}} />
          <img src="/the_old_hunter.jpg" alt="hunter" style={{height:'45px', borderRadius:'100%'}} />
            </div>
          <Card.Title>33,000+</Card.Title>
          <Card.Text>
          Searches this decade, probably gonna edit this to a counter with an actual number of searches
          </Card.Text>
        </Card.Body>
        {/* <Card.Footer>
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer> */}
        {/*in case i need it-->  <Card.Img variant="top" src="\public\mountain-landscape-nature-trees-lake-scenery-2-4K.jpg" style={{borderRadius:'20px', height:'100px'}}/> */}
      </Card>
      <Card style={{padding: '1%', border:'1px solid grey', height:'fit-content', borderRadius:'35px'}}>
      <Card.Body>
          <div style={{paddingBottom:'30px'}}>
          <img src="/the_old_hunter.jpg" alt="hunter" style={{height:'45px', borderRadius:'100%', marginRight:'-15px'}} />
          <img src="/the_old_hunter.jpg" alt="hunter" style={{height:'45px', borderRadius:'100%', marginRight:'-15px'}} />
          <img src="/the_old_hunter.jpg" alt="hunter" style={{height:'45px', borderRadius:'100%', marginRight:'-15px'}} />
          <img src="/the_old_hunter.jpg" alt="hunter" style={{height:'45px', borderRadius:'100%', marginRight:'-15px'}} />
          <img src="/the_old_hunter.jpg" alt="hunter" style={{height:'45px', borderRadius:'100%'}} />
            </div>
          <Card.Title>Better Deals, Less Effort</Card.Title>
          <Card.Text>
            You're definetly easy to scam if you fall for this! Better luck next time
          </Card.Text>
        </Card.Body>
        {/* <Card.Footer>
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer> */}
      </Card>
    </CardGroup>
    <Carousel data-bs-theme="dark" style={{padding:'35px 3%'}}>
    <Carousel.Item >
        <div style={{display:'flex', gap:'15px'}}>
        <img
          className="d-block w-100 testClass"
          src="/the_old_hunter.jpg"
          alt="First slide"
        />
        <img
          className="d-block w-100"
          src="/the_old_hunter.jpg"
          alt="First slide"
        />
        <img
          className="d-block w-100"
          src="/the_old_hunter.jpg"
          alt="First slide"
        />
        </div>
        
        {/* <Carousel.Caption>
          <h5>Third slide label</h5>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption> */}
      </Carousel.Item>
      <Carousel.Item >
        <div style={{display:'flex', gap:'15px'}}>
        <img
          className="d-block w-100"
          src="/the_old_hunter.jpg"
          alt="First slide"
        />
        <img
          className="d-block w-100"
          src="/the_old_hunter.jpg"
          alt="First slide"
        />
        <img
          className="d-block w-100"
          src="/the_old_hunter.jpg"
          alt="First slide"
        />
        </div>
        {/* <Carousel.Caption>
          <h5>Third slide label</h5>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption> */}
      </Carousel.Item>
      <Carousel.Item >
        <div style={{display:'flex', gap:'15px'}}>
        <img
          className="d-block w-100"
          src="/the_old_hunter.jpg"
          alt="First slide"
        />
        <img
          className="d-block w-100"
          src="/the_old_hunter.jpg"
          alt="First slide"
        />
        <img
          className="d-block w-100"
          src="/the_old_hunter.jpg"
          alt="First slide"
        />
        </div>
        {/* <Carousel.Caption>
          <h5>Third slide label</h5>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption> */}
      </Carousel.Item>
    </Carousel>
    <CardGroup style={{gap:'20px', padding:'30px 7%'}}>
      <Card>
        <Card.Body>
          <Card.Title>Explore</Card.Title>
          <Card.Text>
            See destinations on your budget
          </Card.Text>
          <Card.Img variant="bottom" src="/the_old_hunter.jpg" style={{borderRadius:'20px', height:'200px'}}/>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Trips</Card.Title>
          <Card.Text>
            Keep all your plans in one place
          </Card.Text>
          <Card.Img variant="bottom" src="/the_old_hunter.jpg" style={{borderRadius:'20px', height:'200px'}}/>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Price Alert</Card.Title>
          <Card.Text>
            Know when prices change
          </Card.Text>
          <Card.Img variant="bottom" src="/the_old_hunter.jpg" style={{borderRadius:'20px', height:'200px'}}/>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Flight Tracker</Card.Title>
          <Card.Text>
            See real-time delays
          </Card.Text>
          <Card.Img variant="bottom" src="/the_old_hunter.jpg" style={{borderRadius:'20px', height:'200px'}}/>
        </Card.Body>
      </Card>
    </CardGroup>
    {/* FAQ SECTION */}
      <section className="py-5 bg-light border-top">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold display-6">Frequently Asked Questions</h2>
            <p className="text-muted mb-0">
              Everything you need to know about bookings, payments, and reservations.
            </p>
          </div>

          <Row className="justify-content-center">
            <Col lg={9}>
              <Accordion defaultActiveKey="0" flush>
                {faqs.map((faq, index) => (
                  <Accordion.Item
                    eventKey={index.toString()}
                    key={index}
                    className="mb-3 rounded shadow-sm overflow-hidden border"
                  >
                    <Accordion.Header>
                      <span className="fw-semibold">{faq.question}</span>
                    </Accordion.Header>
                    <Accordion.Body className="text-muted">
                      {faq.answer}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>
      {/* FOOTER SECTION */}
      <footer className="bg-dark text-light pt-5 pb-3">
        <Container>
          <Row className="gy-4">
            {/* BRAND SECTION */}
            <Col lg={4} md={6}>
              <div className="d-flex align-items-center mb-3">
                <FaPlane className="me-2" size={24} />
                <h4 className="mb-0 fw-bold">EgyFly</h4>
              </div>

              <p className="text-secondary">
                Your trusted platform for secure and seamless flight reservations.
                Search, book, and manage your flights with ease.
              </p>

              <div className="d-flex gap-3 mt-4 fs-5">
                <a href="#" className="text-light">
                  <FaFacebookF />
                </a>
                <a href="#" className="text-light">
                  <FaTwitter />
                </a>
                <a href="#" className="text-light">
                  <FaInstagram />
                </a>
                <a href="#" className="text-light">
                  <FaLinkedinIn />
                </a>
              </div>
            </Col>

            {/* QUICK LINKS */}
            <Col lg={2} md={6}>
              <h5 className="fw-bold mb-3">Quick Links</h5>
              <ul className="list-unstyled d-flex flex-column gap-2">
                <li>
                  <a href="#" className="text-secondary text-decoration-none">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary text-decoration-none">
                    Flights
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary text-decoration-none">
                    My Bookings
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary text-decoration-none">
                    FAQs
                  </a>
                </li>
              </ul>
            </Col>

            {/* SUPPORT */}
            <Col lg={3} md={6}>
              <h5 className="fw-bold mb-3">Support</h5>

              <div className="d-flex align-items-start mb-3">
                <FaEnvelope className="me-2 mt-1" />
                <span className="text-secondary">
                  support@EgyFly.com
                </span>
              </div>

              <div className="d-flex align-items-start mb-3">
                <FaPhoneAlt className="me-2 mt-1" />
                <span className="text-secondary">+20 100 123 4567</span>
              </div>

              <div className="d-flex align-items-start">
                <FaMapMarkerAlt className="me-2 mt-1" />
                <span className="text-secondary">
                  Alexandria, Egypt
                </span>
              </div>
            </Col>

            {/* NEWSLETTER */}
            <Col lg={3} md={6}>
              <h5 className="fw-bold mb-3">Newsletter</h5>
              <p className="text-secondary">
                Subscribe to receive flight offers and travel updates.
              </p>

              <Form>
                <InputGroup>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                  />
                  <Button variant="primary">Subscribe</Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>

          <hr className="border-secondary my-4" />

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <p className="mb-0 text-secondary">
              © {new Date().getFullYear()} EgyFly. All rights reserved.
            </p>

            <div className="d-flex gap-3">
              <a href="#" className="text-secondary text-decoration-none">
                Privacy Policy
              </a>
              <a href="#" className="text-secondary text-decoration-none">
                Terms of Service
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
};

export default App;
