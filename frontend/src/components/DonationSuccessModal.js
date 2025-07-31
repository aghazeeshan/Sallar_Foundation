import React from 'react';
import './DonationSuccessModal.css';

const DonationSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <div className="success-icon">
          <i className="fas fa-heart"></i>
        </div>
        <h2>Thank You!</h2>
        <p className="thank-you-message">
          Thank you for your generous donation! Your support makes a real difference in our community.
        </p>
        <button className="close-success-btn" onClick={onClose}>
          Continue <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default DonationSuccessModal; 