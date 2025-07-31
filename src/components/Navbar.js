import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import '../styles/contact-info.css';

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const topBarHeight = 40;
      setIsSticky(window.scrollY > topBarHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            <div className="header-contact-info">
              <div className="header-contact-item">
                <i className="fas fa-phone"></i>
                <a href="tel:+1633654-7896">+163-3654-7896</a>
              </div>
              <div className="header-contact-item">
                <i className="fas fa-envelope"></i>
                <a href="mailto:info@sallarfoundation.com">info@sallarfoundation.com</a>
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
            <nav className="main-nav">
              <Link to="/">Home</Link>
              <Link to="/about">About Us</Link>
              <Link to="/donate">Donate</Link>
              <Link to="/events">Events</Link>
              <Link to="/contact">Contact Us</Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar; 