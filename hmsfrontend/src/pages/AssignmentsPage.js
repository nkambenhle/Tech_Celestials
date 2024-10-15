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
    const [assignments, setAssignments] = useState([]);
    const [showAssignments, setShowAssignments] = useState(false); // State to toggle assignments visibility
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the menu

    const handleSubmit = (event) => {
        event.preventDefault();
        // Create a new assignment object
        const newAssignment = {
            id: assignments.length + 1,
            title,
            subject,
            dueDate,
            description,
            createdAt: new Date().toISOString().split('T')[0], // Get current date
        };
        // Add the new assignment to the list
        setAssignments([...assignments, newAssignment]);
        // Reset form
        setTitle('');
        setSubject('');
        setDueDate('');
        setDescription('');
        alert('Assignment created successfully!');
    };

    const handleViewAssignments = () => {
        setShowAssignments(!showAssignments); // Toggle the visibility of the assignments list
    };

    // Toggle menu visibility
    const toggleMenu = () => {
        setIsMenuOpen(prevState => !prevState); // Toggle the menu state
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

            <div className="upload-page-container">
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

                {/* Navigation Links */}
                <div className="navigation-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/view-assignment" className="view-assignment-button">View Assignment
               </Link>
                    <button onClick={handleViewAssignments} className="nav-link">
                        {showAssignments ? 'Hide Assignments' : 'View Assignments'}
                    </button>
                </div>

                {/* Assignments List Section */}
                {showAssignments && (
                    <div className="assignments-list">
                        {assignments.length > 0 ? (
                            assignments.map((assignment) => (
                                <div key={assignment.id} className="assignment-item">
                                    <h3>{assignment.title}</h3>
                                    <p><strong>Subject:</strong> {assignment.subject}</p>
                                    <p><strong>Due Date:</strong> {assignment.dueDate}</p>
                                    <p><strong>Description:</strong> {assignment.description}</p>
                                    <p><strong>Date Created:</strong> {assignment.createdAt}</p>
                                </div>
                            ))
                        ) : (
                            <p>No assignments available.</p>
                        )}
                    </div>
                )}
                
                {/* Footer */}
                <footer className="footer">
                    <p>&copy; 2024 HMS Feedback System | Designed by Tech Celestials</p>
                </footer>
            </div>
        </div>
    );
};

export default AssignmentsPage;
