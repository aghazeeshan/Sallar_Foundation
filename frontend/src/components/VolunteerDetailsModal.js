import React from 'react';
import './VolunteerDetailsModal.css';

const VolunteerDetailsModal = ({ isOpen, onClose, volunteer }) => {
  if (!isOpen || !volunteer) return null;

  return (
    <div className="modal-overlay">
      <div className="volunteer-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Volunteer Application Details</h2>
        
        <div className="volunteer-modal-content">
          <div className="modal-section">
            <h3><i className="fas fa-user"></i> Personal Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                <p>{volunteer.firstName} {volunteer.lastName}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{volunteer.email}</p>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{volunteer.phone}</p>
              </div>
              <div className="info-item">
                <label>Address</label>
                <p>{volunteer.address}</p>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3><i className="fas fa-briefcase"></i> Professional Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Occupation</label>
                <p>{volunteer.occupation}</p>
              </div>
              <div className="info-item">
                <label>Skills</label>
                <p>{volunteer.skills}</p>
              </div>
              <div className="info-item">
                <label>Areas of Interest</label>
                <p>{volunteer.interests}</p>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3><i className="fas fa-clock"></i> Availability</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Preferred Time</label>
                <p>{volunteer.availability}</p>
              </div>
              <div className="info-item">
                <label>Hours per Week</label>
                <p>{volunteer.hours} hours</p>
              </div>
            </div>
          </div>

          {volunteer.experience && (
            <div className="modal-section">
              <h3><i className="fas fa-history"></i> Previous Experience</h3>
              <p className="experience-text">{volunteer.experience}</p>
            </div>
          )}

          {volunteer.message && (
            <div className="modal-section">
              <h3><i className="fas fa-comment"></i> Additional Message</h3>
              <p className="message-text">{volunteer.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDetailsModal; 