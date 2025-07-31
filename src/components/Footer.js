import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-about">
            <Link to="/" className="footer-logo">Sallar Foundation</Link>
            <p>Empowering communities through sustainable development and charitable initiatives.</p>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/donate">Donate</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p><i className="fas fa-phone"></i> +163-3654-7896</p>
            <p><i className="fas fa-envelope"></i> info@sallarfoundation.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Sallar Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 