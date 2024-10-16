
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For navigation
import './UploadPage.css';
import './HomePage.css'; 
import logo from '../images/NWU_Logo-removebg.png'; // Logo image import
import axios from 'axios';

const UploadPage = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

   // Toggle menu visibility
   const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState); // Toggle the menu state
  };

    //Video stuff
    const [videoFile, setVideoFile] = useState(null);
    const [studentNumber, setStudentNumber] = useState('');

    const handleVideoChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handleStudentNumberChange = (e) => {
        setStudentNumber(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!videoFile || !studentNumber) {
            alert('Please provide a file and a username.');
            return;
        }
        // Handle file upload and form submission logic here
        alert(`File uploaded successfully for user: ${studentNumber}`);
        // Reset form fields
        setVideoFile(null);
        setStudentNumber('');
    };

    return (
        <div className="main_container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-logo">
                <Link to="/">
                    <img src={logo} alt="HMS Feedback System Logo" className="navbar-logo-img" />
                </Link>
                </div>

                {/* Burger Menu */}
                <div className="burger-menu" onClick={toggleMenu}>
                <span className="burger-bar"></span>
                <span className="burger-bar"></span>
                <span className="burger-bar"></span>
                </div>

                {/* Navbar Links */}
                <ul className={`navbar-links ${isMenuOpen ? 'navbar-links-active' : ''}`}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/assignments">Assignments</Link></li>
                <li><Link to="/upload">Upload</Link></li>
                <li><Link to="/feedback">Feedback</Link></li>
                </ul>
            </nav>

            <div className="feedback-page-container">
                <h2>Upload registered students</h2>
                <form className="feedback-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Upload File:</label>
                        <input type="file" accept="video/*" onChange={handleVideoChange} />
                    </div>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            value={studentNumber}
                            onChange={handleStudentNumberChange}
                            placeholder="Enter username"
                        />
                    </div>
                    <button type="submit" className="submit-button">Submit</button>
                </form>
                <div className="navigation-links">
                    <a href="/" className="nav-link">Home</a>
                    <a href="/assignments" className="nav-link">Assignments</a>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <p>&copy; 2024 HMS Feedback System | Designed by Tech Celestials</p>
            </footer>
        </div>
    );
};

export default UploadPage;

