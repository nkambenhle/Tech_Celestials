import React, { useState } from 'react';
import './AssignmentsPage.css';
import { Link } from 'react-router-dom';
import './HomePage.css';
import logo from '../images/NWU_Logo-removebg.png'; // Logo image import

const AssignmentsPage = () => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission
        console.log('New Assignment:', { title, subject, dueDate, description });
        // Reset form
        setTitle('');
        setSubject('');
        setDueDate('');
        setDescription('');
        alert('Assignment created successfully!');
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

   // Toggle menu visibility
   const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState); // Toggle the menu state
  };

    return (
        <div className="upload-page-container">
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

                <h2>Create a New Assignment</h2>
                <form className="assignment-form" onSubmit={handleSubmit}>
                    <label>
                        Assignment Name:
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="Enter assignment name" 
                            required 
                        />
                    </label>
                    <label>
                        Subject:
                        <input 
                            type="text" 
                            value={subject} 
                            onChange={(e) => setSubject(e.target.value)} 
                            placeholder="Enter subject name" 
                            required 
                        />
                    </label>
                    <label>
                        Due Date:
                        <input 
                            type="date" 
                            value={dueDate} 
                            onChange={(e) => setDueDate(e.target.value)} 
                            required 
                        />
                    </label>
                    <label>
                        Assignment Details:
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            placeholder="Enter assignment details" 
                            required 
                        ></textarea>
                    </label>
                    <button type="submit" className="submit-button">Create Assignment</button>
                </form>

            <div className="navigation-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/assignments" className="nav-link">View Assignments</Link>
            </div>
            {/* Footer */}
            <footer className="footer">
                <p>&copy; 2024 HMS Feedback System | Designed by Tech Celestials</p>
            </footer>
        </div>
    );
};

export default AssignmentsPage;
