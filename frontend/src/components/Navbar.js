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
            <div className="top-bar-social">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`main-header ${isSticky ? 'sticky' : ''}`}>
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <img 
                src={`${process.env.PUBLIC_URL}/images/${isSticky ? 'sticky_logo.png' : 'sallar_logo.png'}`} 
                alt="Sallar Foundation" 
                className="logo-img" 
              />
            </Link>
            <button className="menu-button" onClick={toggleMenu}>
              ☰
            </button>
            <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
              <Link to="/">Home</Link>
              <Link to="/about">About Us</Link>
              <Link to="/services">Services</Link>
              <Link to="/events">Events</Link>
              <Link to="/contact">Contact Us</Link>
            </nav>
            <div className="header-right">
              <Link to="/donate" className="donate-btn desktop-donate">Donate Now</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Off-canvas Menu for Mobile */}
      <div className={`off-canvas-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="off-canvas-header">
          <div className="off-canvas-logo">
            <img 
              src={`${process.env.PUBLIC_URL}/images/sticky_logo.png`} 
              alt="Sallar Foundation" 
            />
          </div>
          <button className="close-off-canvas" onClick={toggleMenu}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <nav className="off-canvas-nav">
          <ul>
            <li><Link to="/" onClick={toggleMenu}><i className="fas fa-home"></i> Home</Link></li>
            <li><Link to="/about" onClick={toggleMenu}><i className="fas fa-info-circle"></i> About Us</Link></li>
            <li><Link to="/services" onClick={toggleMenu}><i className="fas fa-hands-helping"></i> Services</Link></li>
            <li><Link to="/events" onClick={toggleMenu}><i className="fas fa-calendar-alt"></i> Events</Link></li>
            <li><Link to="/contact" onClick={toggleMenu}><i className="fas fa-envelope"></i> Contact Us</Link></li>
          </ul>
        </nav>

        <div className="off-canvas-footer">
          <Link to="/donate" className="off-canvas-donate-btn" onClick={toggleMenu}>
            <i className="fas fa-heart"></i>
            <span>Donate Now</span>
          </Link>
          
          <div className="off-canvas-social">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="bottom-nav-mobile">
        <Link to="/" className="bottom-nav-item">
          <i className="fas fa-home"></i>
          <span>Home</span>
        </Link>
        <Link to="/services" className="bottom-nav-item">
          <i className="fas fa-hands-helping"></i>
          <span>Services</span>
        </Link>
        <Link to="/donate" className="bottom-nav-item bottom-nav-donate">
          <i className="fas fa-heart"></i>
          <span>Donate</span>
        </Link>
        <Link to="/events" className="bottom-nav-item">
          <i className="fas fa-calendar-alt"></i>
          <span>Events</span>
        </Link>
        <Link to="/contact" className="bottom-nav-item">
          <i className="fas fa-envelope"></i>
          <span>Contact</span>
        </Link>
      </div>
    </>
  );
};

export default Navbar; 