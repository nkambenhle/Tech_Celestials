// src/components/Navbar.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/NWU_Logo-removebg.png'; // Make sure the path is correct
import './HomePage.css'; 

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(prevState => !prevState);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img src={logo} alt="Logo" className="navbar-logo-img" />
                </Link>
            </div>

            <div className="burger-menu" onClick={toggleMenu}>
                <span className="burger-bar"></span>
                <span className="burger-bar"></span>
                <span className="burger-bar"></span>
            </div>

            <ul className={`navbar-links ${isMenuOpen ? 'navbar-links-active' : ''}`}>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/assignments">Assignments</Link></li>
                <li><Link to="/upload">Upload</Link></li>
                <li><Link to="/feedback">Feedback</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
