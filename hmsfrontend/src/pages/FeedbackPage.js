import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FeedbackPage.css';
import './HomePage.css';
import logo from '../images/NWU_Logo-removebg.png'; // Logo image import
import axios from 'axios';

const subjects = {
    "HMDC 121": [
        { id: 1, title: 'Exercise Routine', videoUrl: '/videos/exercise1.mp4', date: '2024-10-01' },
        { id: 2, title: 'Warm-Up Drills', videoUrl: '/videos/warmup1.mp4', date: '2024-10-03' }
    ],
    "HMSC 121": [
        { id: 3, title: 'Running Analysis', videoUrl: '/videos/running1.mp4', date: '2024-10-05' },
        { id: 4, title: 'Strength Training', videoUrl: '/videos/strength1.mp4', date: '2024-10-07' }
    ],
    "HMSC 213": [
        { id: 5, title: 'Flexibility Assessment', videoUrl: '/videos/flexibility1.mp4', date: '2024-10-10' }
    ]
};

const FeedbackPage = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);

    const openVideo = (video) => {
        setSelectedVideo(video);
    };

    const closeVideo = () => {
        setSelectedVideo(null);
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

   // Toggle menu visibility
   const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState); // Toggle the menu state
  };

    return (
        <div className="assignments-container">
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

            <h2>Submitted Assignments by Subject</h2>
            <div className="subject-groups">
                {Object.keys(subjects).map(subject => (
                    <div key={subject} className="subject-group">
                        <h3>{subject}</h3>
                        <ul className="assignment-list">
                            {subjects[subject].map(assignment => (
                                <li key={assignment.id} className="assignment-item">
                                    <div onClick={() => openVideo(assignment)}>
                                        <h4>{assignment.title}</h4>
                                        <p><strong>Submitted on:</strong> {assignment.date}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {selectedVideo && (
                <div className="video-modal">
                    <div className="video-content">
                        <button className="close-button" onClick={closeVideo}>Close</button>
                        <h3>{selectedVideo.title}</h3>
                        <video controls src={selectedVideo.videoUrl} className="video-player" />
                        <form className="feedback-form">
                            <label>
                                Mark:
                                <input type="number" min="0" max="100" placeholder="Enter mark" />
                            </label>
                            <label>
                                Feedback:
                                <textarea placeholder="Enter feedback here"></textarea>
                            </label>
                            <button type="submit">Submit Feedback</button>
                        </form>
                    </div>
                </div>
            )}
            {/* Footer */}
            <footer className="footer">
                <p>&copy; 2024 HMS Feedback System | Designed by Tech Celestials</p>
            </footer>
        </div>
    );
};

export default FeedbackPage;

