import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AssignmentsPage from './pages/AssignmentsPage';
import UploadPage from './pages/UploadPage';
import FeedbackPage from './pages/FeedbackPage';
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
