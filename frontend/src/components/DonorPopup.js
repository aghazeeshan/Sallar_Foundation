import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationService } from '../services/donationService';
import './DonorPopup.css';

const DonorPopup = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const loadLatestDonors = async () => {
      try {
        const donorsData = await donationService.getLatestDonations();
        if (donorsData.length > 0) {
          setDonors(donorsData);
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error loading latest donors:', error);
      }
    };

    loadLatestDonors();
  }, []);

  useEffect(() => {
    if (donors.length > 0 && isVisible) {
      const interval = setInterval(() => {
        if (donors.length > 1) {
          setIsAnimating(true);
          
          setTimeout(() => {
            setCurrentIndex((prevIndex) => 
              (prevIndex + 1) % donors.length
            );
            setIsAnimating(false);
          }, 300); // Half of animation duration
        } else {
          // If only one donor, just hide and show again
          setIsVisible(false);
          setTimeout(() => {
            setIsVisible(true);
          }, 2000);
        }
      }, 15000); // Change donor every 15 seconds
      
      return () => clearInterval(interval);
    }
  }, [donors.length, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDonateClick = () => {
    navigate('/donate');
  };

  if (!isVisible || donors.length === 0) {
    return null;
  }

  const currentDonor = donors[currentIndex];

  return (
    <div className={`donor-popup ${isAnimating ? 'animating' : ''}`}>
      <div className="donor-popup-content">
        <button className="donor-popup-close" onClick={handleClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="donor-info">
          <div className="donor-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="donor-details">
            <h4>{currentDonor.donor_name} donated ${currentDonor.amount}</h4>
            <p className="donor-country">
              <i className="fas fa-map-marker-alt"></i>
              {currentDonor.donor_country}
            </p>
          </div>
        </div>
        
        <button className="donate-button" onClick={handleDonateClick}>
          Donate
        </button>
      </div>
    </div>
  );
};

export default DonorPopup;
