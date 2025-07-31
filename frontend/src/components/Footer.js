import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import './Footer.css';
import '../styles/contact-info.css';

const Footer = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleAdminClick = (e) => {
    e.preventDefault();
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            {/* Logo & Description */}
            <div className="footer-about">
              <Link to="/" className="footer-logo">
                <span className="logo-text">Sallar Foundation</span>
              </Link>
              <p className="footer-description">
                Our secure online donation platform allows you to make contributions quickly
              </p>
              <div className="footer-contact-info">
                <div className="footer-contact-item">
                  <i className="fas fa-phone"></i>
                  <span>Call us any time:</span>
                  <a href="tel:+447869559100">+447869559100</a>
                </div>
                <div className="footer-contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>Email us any time:</span>
                  <a href="mailto:info@sallarfoundation.org">info@sallarfoundation.org</a>
                </div>
                <div className="social-links">
                <a href="https://www.facebook.com/share/15refgiAvb/"><i className="fab fa-facebook-f"></i></a>
                {/* <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
                <a href="#"><i className="fab fa-behance"></i></a>
                <a href="#"><i className="fab fa-vimeo-v"></i></a> */}
              </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-links">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/"><i className="fas fa-angle-right"></i>Home</Link></li>
                <li><Link to="/about"><i className="fas fa-angle-right"></i>About Us</Link></li>
                <li><Link to="/services"><i className="fas fa-angle-right"></i>Services</Link></li>
                <li><Link to="/donate"><i className="fas fa-angle-right"></i>Donate</Link></li>
                <li><Link to="/events"><i className="fas fa-angle-right"></i>Events</Link></li>
                <li><Link to="/contact"><i className="fas fa-angle-right"></i>Contact Us</Link></li>
                {/* <li>
                  <a href="#" onClick={handleAdminClick} className="admin-link">
                    <i className="fas fa-user-shield"></i> Admin Panel
                  </a>
                </li> */}
              </ul>
            </div>

            
         

            {/* Newsletter */}
            <div className="footer-newsletter">
              <h3>Newsletter</h3>
              <p>Subscribe to Our Newsletter. Regular inspection and feedback mechanisms</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button type="submit">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
             
            </div>

            <div className="contact-map">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!4v1736975208778!6m8!1m7!1s5UqRf1sMkeNm1AUGB7uW2Q!2m2!1d51.13415341374862!2d0.2666851696566104!3f132.84!4f0!5f0.7820865974627469" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="Location map"
              ></iframe>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Bar */}
      <div className="copyright-bar">
        <div className="container">
          <p class="footer-copyright">Copyright 2024 All Rights Reserved. Developed & Maintance by  <a href='www.keplerx.co'><span> KeplerX </span> </a></p>
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Footer; 