import React from 'react';
import './SuccessPopup.css';

const SuccessPopup = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="success-popup-overlay">
      <div className="success-popup">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h3>Success!</h3>
        <p>{message}</p>
        <button onClick={onClose} className="ok-btn">
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup; 