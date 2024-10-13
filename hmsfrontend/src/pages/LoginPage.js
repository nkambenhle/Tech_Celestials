import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './LoginPage.css';
import './HomePage.css'; // Import HomePage styles for navbar and footer

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);

  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  return (
    <div className="login-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">
            <img src={require('../images/NWU_Logo.png')} alt="HMS Feedback System Logo" className="navbar-logo-img" />
          </Link>
        </div>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/assignments">Assignments</Link></li>
          <li><Link to="/upload">Upload</Link></li>
          <li><Link to="/feedback">Feedback</Link></li>
        </ul>
      </nav>

      {/* Login/Register Form */}
      <div className="login-container">
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        {!isRegister ? (
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Enter your username" required />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required />
            <button type="submit" className="login-button">Login</button>
            <p>
              Don't have an account? <span onClick={toggleForm} className="toggle-link">Register here</span>
            </p>
          </div>
        ) : (
          <RegisterForm toggleForm={toggleForm} />
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 HMS Feedback System | Designed by Tech Celestials</p>
      </footer>
    </div>
  );
};

const RegisterForm = ({ toggleForm }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    role: '',
    email: '',
    field: '',
    modules: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword) {
      console.log('Registration submitted', formData);
      // Redirect or show a success message here
    } else {
      alert('Passwords do not match');
    }
  };

  return (
    <div className="register-container">
      {step === 1 && (
        <div className="form-step">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="surname">Surname</label>
            <input type="text" id="surname" name="surname" placeholder="Enter your surname" value={formData.surname} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} required />
          </div>
          <button onClick={nextStep} className="next-button">Next</button>
        </div>
      )}
      {step === 2 && (
        <div className="form-step">
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <input type="text" id="role" name="role" placeholder="Enter your role" value={formData.role} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="field">Field</label>
            <input type="text" id="field" name="field" placeholder="Enter your field" value={formData.field} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="modules">Modules</label>
            <input type="text" id="modules" name="modules" placeholder="Enter your modules" value={formData.modules} onChange={handleChange} required />
          </div>
          <button onClick={previousStep} className="previous-button">Previous</button>
          <button onClick={nextStep} className="next-button">Next</button>
        </div>
      )}
      {step === 3 && (
        <div className="form-step">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter your password" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <button onClick={previousStep} className="previous-button">Previous</button>
          <button onClick={handleRegister} className="register-button">Register</button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
