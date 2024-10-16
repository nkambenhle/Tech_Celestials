import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import './HomePage.css';
import axios from 'axios';

// RegisterForm Component
const RegisterForm = ({ toggleForm }) => {
  const [step, setStep] = useState(1);
  const [modules, setModules] = useState([]); // State to store fetched modules
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    role: '', // Store selected role (updated from 'role' input)
    email: '',
    field: '',
    module: '', // Store selected module
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Fetch module data from the backend when the component mounts
    const fetchModules = async () => {
      try {
        const response = await axios.get('https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/Modules');
        setModules(response.data); // Store fetched module data
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };

    fetchModules();
  }, []);

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
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="surname">Surname</label>
            <input
              type="text"
              id="surname"
              name="surname"
              placeholder="Enter your surname"
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <button onClick={nextStep} className="next-button">Next</button>
        </div>
      )}
      {step === 2 && (
        <div className="form-step">
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select a role</option>
              <option value="Student">Student</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Admin">Admin</option>
              <option value="Developer">Developer</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="field">Field</label>
            <input
              type="text"
              id="field"
              name="field"
              placeholder="Enter your field"
              value={formData.field}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="module">Module</label>
            <select
              id="module"
              name="module"
              value={formData.module}
              onChange={handleChange}
              required
            >
              <option value="">Select a module</option>
              {modules.map((module) => (
                <option key={module._id} value={module.Module_Name}>
                  {module.Module_Name}
                </option>
              ))}
            </select>
          </div>
          <button onClick={previousStep} className="previous-button">Previous</button>
          <button onClick={nextStep} className="next-button">Next</button>
        </div>
      )}
      {step === 3 && (
        <div className="form-step">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button onClick={previousStep} className="previous-button">Previous</button>
          <button onClick={handleRegister} className="register-button">Register</button>
        </div>
      )}
    </div>
  );
};

// LoginPage Component
const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://techcelestialsapp-fdhua4hhdwb9f4dc.southafricanorth-01.azurewebsites.net/api/login', {
        username,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        navigate('/assignments');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed, please check your credentials');
    }
  };

  return (
    <div className="login-page">
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">
            <img src={require('../images/NWU_Logo-removebg.png')} alt="HMS Feedback System Logo" className="navbar-logo-img" />
          </Link>
        </div>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/assignments">Assignments</Link></li>
          <li><Link to="/upload">Upload</Link></li>
          <li><Link to="/feedback">Feedback</Link></li>
        </ul>
      </nav>

      <div className="login-container">
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        {!isRegister ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">Login</button>
            {error && <p className="error-message">{error}</p>}
            <p>
              Don't have an account? <span onClick={toggleForm} className="toggle-link">Register here</span>
            </p>
          </form>
        ) : (
          <RegisterForm toggleForm={toggleForm} />
        )}
      </div>

      <footer className="footer">
        <p>&copy; 2024 HMS Feedback System | Designed by Tech Celestials</p>
      </footer>
    </div>
  );
};

export default LoginPage;