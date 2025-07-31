import React from 'react';
import './ContactSuccessModal.css';

const ContactSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <div className="success-icon">
          <i className="fas fa-paper-plane"></i>
        </div>
        <h2>Message Sent!</h2>
        <p className="thank-you-message">
          Thank you for contacting us! We will get back to you soon.
        </p>
        <button className="close-success-btn" onClick={onClose}>
          Continue <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ContactSuccessModal; 