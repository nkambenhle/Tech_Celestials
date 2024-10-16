import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AssignmentsPage.css';
import logo from '../images/NWU_Logo-removebg.png'; // Logo image import

const AssignmentsPage = () => {
    const [title, setTitle] = React.useState('');
    const [subject, setSubject] = React.useState('');
    const [dueDate, setDueDate] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [creator, setCreator] = React.useState('');
    const [assignments, setAssignments] = React.useState([]);
    const [editIndex, setEditIndex] = React.useState(null);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const navigate = useNavigate(); // useNavigate hook

    const handleSubmit = (event) => {
        event.preventDefault();
        const newAssignment = {
            id: assignments.length + 1,
            title,
            subject,
            dueDate,
            description,
            creator,
            createdAt: new Date().toISOString().split('T')[0],
        };

        if (editIndex !== null) {
            const updatedAssignments = [...assignments];
            updatedAssignments[editIndex] = newAssignment;
            setAssignments(updatedAssignments);
            setEditIndex(null);
            alert('Assignment updated successfully!');
        } else {
            setAssignments([...assignments, newAssignment]);
            alert('Assignment created successfully!');
        }

        // Reset form fields
        setTitle('');
        setSubject('');
        setDueDate('');
        setDescription('');
        setCreator('');
    };

    const handleEdit = (index) => {
        const assignmentToEdit = assignments[index];
        setTitle(assignmentToEdit.title);
        setSubject(assignmentToEdit.subject);
        setDueDate(assignmentToEdit.dueDate);
        setDescription(assignmentToEdit.description);
        setCreator(assignmentToEdit.creator);
        setEditIndex(index);
    };

    const handleDelete = (index) => {
        const updatedAssignments = assignments.filter((_, i) => i !== index);
        setAssignments(updatedAssignments);
        alert('Assignment deleted successfully!');
    };

    const toggleMenu = () => {
        setIsMenuOpen((prevState) => !prevState);
    };

    const navigateToHome = () => {
        navigate('/'); // Navigate to the Home page
    };

    const navigateToViewAssignments = () => {
        navigate('/view-assignments'); // Navigate to the View Assignments page
    };

    return (
        <div className="main_container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-logo">
                    <img src={logo} alt="HMS Feedback System Logo" className="navbar-logo-img" />
                </div>

                {/* Burger Menu */}
                <div className="burger-menu" onClick={toggleMenu}>
                    <span className="burger-bar"></span>
                    <span className="burger-bar"></span>
                    <span className="burger-bar"></span>
                </div>

                {/* Navbar Links */}
                <ul className={`navbar-links ${isMenuOpen ? 'navbar-links-active' : ''}`}>
                    <li><a href="/">Home</a></li>
                    <li><a href="/assignments">Assignments</a></li>
                    <li><a href="/upload">Upload</a></li>
                    <li><a href="/feedback">Feedback</a></li>
                </ul>
            </nav>

            <div className="upload-page-container">
                <h2>{editIndex !== null ? 'Edit Assignment' : 'Create a New Assignment'}</h2>
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
                    <label>
                        Creator:
                        <input
                            type="text"
                            value={creator}
                            onChange={(e) => setCreator(e.target.value)}
                            placeholder="Enter your name"
                            required
                        />
                    </label>
                    <button type="submit" className="submit-button">
                        {editIndex !== null ? 'Update Assignment' : 'Create Assignment'}
                    </button>

                    {/* Navigation Buttons */}
                    <div className="navigation-buttons">
                        <button type="button" onClick={navigateToHome} className="nav-button">
                            Home
                        </button>
                        <button type="button" onClick={navigateToViewAssignments} className="nav-button">
                            View Assignments
                        </button>
                    </div>
                </form>

                {/* Assignments List Section */}
                <div className="assignments-list">
                    {assignments.length > 0 ? (
                        assignments.map((assignment, index) => (
                            <div key={assignment.id} className="assignment-item">
                                <h3>{assignment.title}</h3>
                                <p><strong>Subject:</strong> {assignment.subject}</p>
                                <p><strong>Due Date:</strong> {assignment.dueDate}</p>
                                <p><strong>Description:</strong> {assignment.description}</p>
                                <p><strong>Creator:</strong> {assignment.creator}</p>
                                <p><strong>Date Created:</strong> {assignment.createdAt}</p>
                                <button onClick={() => handleEdit(index)} className="edit-button">Edit</button>
                                <button onClick={() => handleDelete(index)} className="delete-button">Delete</button>
                            </div>
                        ))
                    ) : (
                        <p>No assignments available.</p>
                    )}
                </div>

                {/* Footer */}
                <footer className="footer">
                    <p>&copy; 2024 HMS Feedback System | Designed by Tech Celestials</p>
                </footer>
            </div>
        </div>
    );
};

export default AssignmentsPage;
