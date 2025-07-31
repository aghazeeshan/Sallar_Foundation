import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import '../styles/contact-info.css';

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    const handleScroll = () => {
      const topBarHeight = 40; 
      setIsSticky(window.scrollY > topBarHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            <div className="header-contact-info">
              <div className="header-contact-item">
                <i className="fas fa-phone"></i>
                <a href="tel:+447869559100">+44 786 9559 100</a>
              </div>
              <div className="header-contact-item">
                <i className="fas fa-envelope"></i>
                <a href="mailto:info@sallarfoundation.org">info@sallarfoundation.org</a>
              </div>
            </div>
            <div className="top-bar-buttons">
              <Link to="/donate" className="top-bar-btn">Donate Now</Link>
              <Link to="/volunteer" className="top-bar-btn">Become A Volunteer</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`main-header ${isSticky ? 'sticky' : ''}`}>
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              Sallar Foundation
            </Link>
            <button className="menu-button" onClick={toggleMenu}>
              ☰
            </button>
            <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
              <Link to="/">Home</Link>
              <Link to="/about">About Us</Link>
              <Link to="/services">Services</Link>
              <Link to="/donate">Donate</Link>
              <Link to="/events">Events</Link>
              <Link to="/contact">Contact Us</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Off-canvas Menu for Mobile */}
      <div className={`off-canvas-menu ${isMenuOpen ? 'open' : ''}`}>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/donate">Donate</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar; 