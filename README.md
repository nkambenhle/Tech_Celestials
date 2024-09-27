Human Movement Sciences Video Feedback System

Welcome to the Human Movement Sciences Video Feedback System repository! This project is designed to help lecturers at North-West University's Human Movement Sciences Faculty provide fast and effective feedback to students through video submissions.

Table of Contents
- Overview 
- Features
- Technology Stack
- Project Structure 
- API Endpoints
- Contact

---

Overview

This system consists of a web application for lecturers and mobile applications for students. The primary goal is to allow students to submit videos of physical exercises and enable lecturers to review, provide feedback, and assign grades—all while supporting offline video uploads for students with limited internet connectivity.

Features

Web Application (for Lecturers)
- Secure login for lecturers and admins.
- View video submissions from students.
- Stream or download videos for review.
- Provide feedback via text comments.
- Assign grades/marks to videos.

Mobile Application (for Students)
- Secure login for students.
- Record videos of exercises directly in the app.
- Browse the file system to upload previously recorded videos.
- Offline video recording and upload when internet is available.
- View feedback and grades from lecturers.

General
- Role-based access for Admin, Lecturer, and Student.
- Secure storage of video files with encryption and compression.
- Adaptive streaming with variable bitrate support for users with weak internet connections.

---

Technology Stack

Backend
- Node.js with Express.js for building APIs.
- MongoDB for storing user data, assignments, and feedback.
- ffmpeg for video compression and format conversion.
- Azure for video storage and streaming.

Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud-based)
- ffmpeg (for video processing)
- Azure cloud storage for video hosting (or local storage for development purposes)
- Git - for version control


Backend Setup

1. Clone the repository:
2. Install dependencies:
    
    cd OneDrive\Documents\projects
    npm install
    
3. Create an `.env` file in the `backend` directory and add the following variables:
    ```bash
     MONGO_URI=mongodb+srv://nkambenhle17zungu:AQnjaI8M0kGZzVyq@hms.ohajons.mongodb.net/?retryWrites=true&w=majority&appName=HMS

    JWT_SECRET=techZungunk

    ```

4. Start the backend server:
    ```bash
    npm run start
    ```

Project Structure

```bash
human-movement-video-feedback/
├── backend/            # Backend (Node.js, Express)
├── frontend/           # Frontend (React.js)
├── mobile/             # Mobile Application (React Native)
└── README.md           # Project readme
```

---

API Endpoints

Authentication
- `POST http://localhost:3000/auth/login` - Authenticate users based on role (Admin, Lecturer, Student).

Video Submissions
- `POST http://localhost:3000/submissions` - Upload a new video.

Feedback
- `POST http://localhost:3000/feedbacks` - Provide feedback and assign marks to a video (Lecturers only).
- `GET http://localhost:3000/feedacks` - Retrieve feedback for a specific video that was under a submission. (Students and Lecturers).

Assignments
- `POST http://localhost:3000/assignments` - Create a new assignment (Lecturers/Admins only).
- `GET http://localhost:3000/assignments` - Get all assignments.

---

Contact

For any inquiries or questions, feel free to reach out to:

- Project Lead: Dikgang Manase (mailto:35671599@mynwu.ac.za)
- Repository: https://github.com/nkambenhle/Tech_Celestials.git 
---

Thank you for contributing to the Human Movement Sciences Video Feedback System!

