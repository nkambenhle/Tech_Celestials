import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-container">
            <h1>Welcome to the Human Movement Sciences System</h1>
            <p>This system allows students to upload assignment videos and receive feedback from lecturers.</p>
            <div className="home-links">
                <Link to="/assignments" className="home-button">View Assignments</Link>
                <Link to="/upload" className="home-button">Upload Video</Link>
                <Link to="/feedback" className="home-button">View Feedback</Link>
            </div>
        </div>
    );
}

export default HomePage;
