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
- MongoDB for storing user data, assignments,submissions and feedback.
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
├── mobile/             # Mobile Application (Kotlin)
└── README.md           # Project readme
```

---

API Endpoints
Online Hosting: https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/
Authentication
- `POST https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/auth/register` - Checks wheter student number is present in the database before user can register.
- `POST https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/auth/login` - Authenticate users with their username( which is their 8 digit studenet number) and their password.
- Online Hosting: https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/auth/login

Video Submissions
- `POST https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/submissions` - Upload a new video.
- Online Hosting: https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/submissions

Browse own Submissions
- `GET https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/submissions/my-submissions` - Retrieves submisions created by the logged-in user.
- Online Hosting: https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/submissions/my-submissions

Feedback
- `POST https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/feedbacks` - Provide feedback and assigns marks to a video under the specific submission .
- `GET https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/feedbacks/my-feedbacks` - Retrieves feedback of the logged-in user.
- `GET https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/feedbacks` - Retrieves all feedback 
- Online Hosting: https://hms-ehgyh4f5hhavg5at.southafricanorth-01.azurewebsites.net/feedacks

Assignments
- `POST https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/assignments` - Create a new assignment (Lecturers/Admins only).
- `GET https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/assignments` - View all assignments.
- `GET https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/assignments/my-assignments` - View all created by the logged in user.
- Online Hosting: https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/assignmemts

---

Contact

For any inquiries or questions, feel free to reach out to:

- Project Lead: Dikgang Manase (mailto:35671599@mynwu.ac.za)
- Repository: https://github.com/nkambenhle/Tech_Celestials.git 
---

Thank you for contributing to the Human Movement Sciences Video Feedback System!

