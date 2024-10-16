import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FeedbackPage.css';
import './HomePage.css';
import logo from '../images/NWU_Logo-removebg.png'; // Logo image import
import axios from 'axios';

const FeedbackPage = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Fetch submissions from the backend
    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get('https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/Submissions');
                setSubmissions(response.data);
            } catch (error) {
                console.error('Error fetching submissions:', error);
            }
        };

        fetchSubmissions();
    }, []);

    const openVideo = (video) => {
        setSelectedVideo(video);
    };

    const closeVideo = () => {
        setSelectedVideo(null);
    };

    // Toggle menu visibility
    const toggleMenu = () => {
        setIsMenuOpen(prevState => !prevState);
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
                {submissions.map(submission => (
                    <div key={submission._id} className="subject-group">
                        <h3>{submission.Assignment_ID.Title}</h3>
                        <ul className="assignment-list">
                            <li className="assignment-item">
                                <div onClick={() => openVideo(submission)}>
                                    <h4>{submission.Assignment_ID.Title}</h4>
                                    <p><strong>Submitted by:</strong> {submission.User_ID.Username}</p>
                                    <p><strong>Submitted on:</strong> {new Date(submission.Date).toLocaleDateString()}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                ))}
            </div>

            {selectedVideo && (
                <div className="video-modal">
                    <div className="video-content">
                        <button className="close-button" onClick={closeVideo}>Close</button>
                        <h3>{selectedVideo.Assignment_ID.Title}</h3>
                        <video controls src={selectedVideo.Video} className="video-player" />
                        <form className="feedback-form">
                            <label>
                                Mark:
                                <input type="number" min="0" max={selectedVideo.Assignment_ID.Marks} placeholder="Enter mark" />
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