import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DonationPopup.css';

const DonationPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('donationPopupSeen');
    
    if (!hasSeenPopup) {
      // Show popup after 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('donationPopupSeen', 'true');
  };

  const handleDonate = () => {
    setIsVisible(false);
    sessionStorage.setItem('donationPopupSeen', 'true');
    navigate('/donate');
  };

  if (!isVisible) return null;

  return (
    <div className="donation-popup-overlay" onClick={handleClose}>
      <div className="donation-popup" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={handleClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="popup-content">
          <div className="popup-icon">
            <i className="fas fa-hand-holding-heart"></i>
          </div>
          
          <h2>Make a Difference Today</h2>
          <p>Your generous donation helps us continue our mission to support those in need. Every contribution, big or small, makes a real impact in people's lives.</p>
          
          <div className="popup-stats">
            <div className="stat-item">
              <i className="fas fa-users"></i>
              <span>10,000+ People Helped</span>
            </div>
            <div className="stat-item">
              <i className="fas fa-heart"></i>
              <span>5,000+ Donors</span>
            </div>
          </div>

          <div className="popup-actions">
            <button className="donate-btn" onClick={handleDonate}>
              <i className="fas fa-donate"></i> Donate Now
            </button>
            <button className="later-btn" onClick={handleClose}>
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPopup;

