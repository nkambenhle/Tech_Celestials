
import React, { useState } from 'react';
import './UploadPage.css';

const UploadPage = () => {
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
            alert('Please provide a video and a student number.');
            return;
        }
        // Handle file upload and form submission logic here
        alert(`Video uploaded successfully for student number: ${studentNumber}`);
        // Reset form fields
        setVideoFile(null);
        setStudentNumber('');
    };

    return (
        <div className="feedback-page-container">
            <h2>Submit Video Assignment</h2>
            <form className="feedback-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Upload Video:</label>
                    <input type="file" accept="video/*" onChange={handleVideoChange} />
                </div>
                <div className="form-group">
                    <label>Student Number:</label>
                    <input
                        type="text"
                        value={studentNumber}
                        onChange={handleStudentNumberChange}
                        placeholder="Enter student number"
                    />
                </div>
                <button type="submit" className="submit-button">Submit</button>
            </form>
            <div className="navigation-links">
                <a href="/" className="nav-link">Home</a>
                <a href="/assignments" className="nav-link">Assignments</a>
            </div>
        </div>
    );
};

export default UploadPage;

