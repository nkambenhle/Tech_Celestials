import React from 'react';
import { Link } from 'react-router-dom';
import './AssignmentsPage.css';
import './HomePage.css';
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
    const [isModalOpen, setIsModalOpen] = React.useState(false); // State for modal visibility
    const [showSuccessMessage, setShowSuccessMessage] = React.useState(false); // State for success message

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
            setShowSuccessMessage(true); // Show success message for edit
        } else {
            setAssignments([...assignments, newAssignment]);
            setShowSuccessMessage(true); // Show success message for new assignment
        }

        // Clear form fields after submission
        setTitle('');
        setSubject('');
        setDueDate('');
        setDescription('');
        setCreator('');
        setIsModalOpen(false); // Close the modal if it was open

        // Hide the success message after a few seconds
        setTimeout(() => setShowSuccessMessage(false), 3000);
    };

    const handleEdit = (index) => {
        const assignmentToEdit = assignments[index];
        setTitle(assignmentToEdit.title);
        setSubject(assignmentToEdit.subject);
        setDueDate(assignmentToEdit.dueDate);
        setDescription(assignmentToEdit.description);
        setCreator(assignmentToEdit.creator);
        setEditIndex(index);
        setIsModalOpen(false); // Close the modal if it was open
    };

    const handleDelete = (index) => {
        const updatedAssignments = assignments.filter((_, i) => i !== index);
        setAssignments(updatedAssignments);
        alert('Assignment deleted successfully!');
    };

    const toggleMenu = () => {
        setIsMenuOpen((prevState) => !prevState);
    };

    const openModal = () => {
        setIsModalOpen(true); // Open the modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
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
                </form>

                {/* Success Message */}
                {showSuccessMessage && <div className="success-message">Assignment saved successfully!</div>}

                {/* Navigation Buttons */}
                <div className="navigation-buttons">
                    <Link to="/" className="nav-link">Home</Link>
                    <button onClick={openModal} className="nav-link">View Assignments</button>
                </div>

                {/* Modal for Assignments List */}
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Assignments List</h3>
                            <button onClick={closeModal} className="close-modal-button">Close</button>
                            {assignments.length > 0 ? (
                                assignments.map((assignment, index) => (
                                    <div key={assignment.id} className="assignment-item">
                                        <h4>{assignment.title}</h4>
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
