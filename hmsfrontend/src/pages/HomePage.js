import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './HomePage.css'; 
import logo from '../images/NWU_Logo.png'; // Import the logo image
import heroImage from '../images/Hero03_11zon.jpg';  // Import the hero image

const HomePage = () => {

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
      <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="HMS Feedback System Logo" className="navbar-logo-img" />
          </Link>
      </div>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/assignments">Assignments</Link></li>
          <li><Link to="/upload">Upload</Link></li>
          <li><Link to="/feedback">Feedback</Link></li>
        </ul>
      </nav>

      {/* Rest of the homepage */}
      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-content">
          <h1>Welcome to the HMS Feedback System</h1>
          <p>Delivering faster feedback to students through video assignments.</p>
          <Link to="/login"><Link></Link>
          <button className="hero-button">Get Started</button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-content">
          <h2>Our Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h3>Upload Videos</h3>
              <p>Easily upload your exercise videos and receive feedback.</p>
            </div>
            <div className="feature-item">
              <h3>Get Feedback</h3>
              <p>Lecturers provide detailed feedback to help you improve.</p>
            </div>
            <div className="feature-item">
              <h3>Stream and Download</h3>
              <p>Watch and download your feedback anytime, anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 HMS Feedback System | Designed by Tech Celestials</p>
      </footer>
    </div>
  );
};

export default HomePage;
