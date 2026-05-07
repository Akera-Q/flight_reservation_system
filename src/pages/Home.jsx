import React from 'react';
import Navbar from "../components/Navbar";
import FlightSearchForm from '../components/FlightSearchForm';
import { Dropdown, Card, CardGroup, Carousel, Ratio } from 'react-bootstrap';
import "../App.css";
//import InteractionTracker from '../services/InteractionTracker';


const App = () => {
  return (
    <>
    {/* <InteractionTracker /> */}
      <Navbar />
      <div className="parent">
        <div className="div1 photo-container">
          <div className='photo-wrapper left'>
            <img src="/public/the_old_hunter.jpg" alt="hunter" />
            <img src="/public/the_old_hunter.jpg" alt="hunter" />
            <img src="/public/the_old_hunter.jpg" alt="hunter" />
          </div>
          <div className='photo-wrapper right'>
            <img src="/public/the_old_hunter.jpg" alt="hunter" />
            <img src="/public/the_old_hunter.jpg" alt="hunter" />
            <img src="/public/the_old_hunter.jpg" alt="hunter" />
            <img src="/public/the_old_hunter.jpg" alt="hunter" />
            <img src="/public/the_old_hunter.jpg" alt="hunter" />
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
          <img src="/public/the_old_hunter.jpg" alt="hunter" style={{height:'45px', borderRadius:'100%', marginRight:'-15px'}} />
          <img src="/public/the_old_hunter.jpg" alt="hunter" style={{height:'45px', borderRadius:'100%', marginRight:'-15px'}} />
          <img src="/public/the_old_hunter.jpg" alt="hunter" style={{height:'45px', borderRadius:'100%'}} />
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
          <img src="/public/the_old_hunter.jpg" alt="hunter" style={{height:'45px', borderRadius:'100%', marginRight:'-15px'}} />
          <img src="/public/the_old_hunter.jpg" alt="hunter" style={{height:'45px', borderRadius:'100%', marginRight:'-15px'}} />
          <img src="/public/the_old_hunter.jpg" alt="hunter" style={{height:'45px', borderRadius:'100%', marginRight:'-15px'}} />
          <img src="/public/the_old_hunter.jpg" alt="hunter" style={{height:'45px', borderRadius:'100%', marginRight:'-15px'}} />
          <img src="/public/the_old_hunter.jpg" alt="hunter" style={{height:'45px', borderRadius:'100%'}} />
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
          src="\public\the_old_hunter.jpg"
          alt="First slide"
        />
        <img
          className="d-block w-100"
          src="public\nature-cloud-ocean-cliff-landscape-city-ultrahd-4k-hd-background-wallpaper-preview.jpg"
          alt="First slide"
        />
        <img
          className="d-block w-100"
          src="\public\the_old_hunter.jpg"
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
          src="\public\the_old_hunter.jpg"
          alt="First slide"
        />
        <img
          className="d-block w-100"
          src="public\nature-cloud-ocean-cliff-landscape-city-ultrahd-4k-hd-background-wallpaper-preview.jpg"
          alt="First slide"
        />
        <img
          className="d-block w-100"
          src="\public\the_old_hunter.jpg"
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
          src="\public\the_old_hunter.jpg"
          alt="First slide"
        />
        <img
          className="d-block w-100"
          src="public\nature-cloud-ocean-cliff-landscape-city-ultrahd-4k-hd-background-wallpaper-preview.jpg"
          alt="First slide"
        />
        <img
          className="d-block w-100"
          src="\public\the_old_hunter.jpg"
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
          <Card.Img variant="bottom" src="public\nature-cloud-ocean-cliff-landscape-city-ultrahd-4k-hd-background-wallpaper-preview.jpg" style={{borderRadius:'20px', height:'200px'}}/>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Trips</Card.Title>
          <Card.Text>
            Keep all your plans in one place
          </Card.Text>
          <Card.Img variant="bottom" src="public\nature-cloud-ocean-cliff-landscape-city-ultrahd-4k-hd-background-wallpaper-preview.jpg" style={{borderRadius:'20px', height:'200px'}}/>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Price Alert</Card.Title>
          <Card.Text>
            Know when prices change
          </Card.Text>
          <Card.Img variant="bottom" src="public\nature-cloud-ocean-cliff-landscape-city-ultrahd-4k-hd-background-wallpaper-preview.jpg" style={{borderRadius:'20px', height:'200px'}}/>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Flight Tracker</Card.Title>
          <Card.Text>
            See real-time delays
          </Card.Text>
          <Card.Img variant="bottom" src="public\nature-cloud-ocean-cliff-landscape-city-ultrahd-4k-hd-background-wallpaper-preview.jpg" style={{borderRadius:'20px', height:'200px'}}/>
        </Card.Body>
      </Card>
    </CardGroup>
    </>
  );
};

export default App;
