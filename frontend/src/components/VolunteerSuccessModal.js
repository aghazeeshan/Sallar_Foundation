import React from 'react';
import './VolunteerSuccessModal.css';

const VolunteerSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <div className="success-icon">
          <i className="fas fa-user-check"></i>
        </div>
        <h2>Thank You!</h2>
        <p className="thank-you-message">
          Thank you for volunteering! We have received your application and will contact you soon.
        </p>
        <button className="close-success-btn" onClick={onClose}>
          Continue <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default VolunteerSuccessModal; 