import React from 'react';
import './ContactDetailsModal.css';

const ContactDetailsModal = ({ isOpen, onClose, contact }) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="contact-modal-header">
          <h2>Contact Form Details</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="contact-modal-body">
          <div className="detail-section">
            <div className="detail-row">
              <div className="detail-label">
                <i className="fas fa-user"></i>
                <span>Name:</span>
              </div>
              <div className="detail-value">{contact.name}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">
                <i className="fas fa-envelope"></i>
                <span>Email:</span>
              </div>
              <div className="detail-value">{contact.email}</div>
            </div>

            {contact.phone && (
              <div className="detail-row">
                <div className="detail-label">
                  <i className="fas fa-phone"></i>
                  <span>Phone:</span>
                </div>
                <div className="detail-value">{contact.phone}</div>
              </div>
            )}

            {contact.subject && (
              <div className="detail-row">
                <div className="detail-label">
                  <i className="fas fa-tag"></i>
                  <span>Subject:</span>
                </div>
                <div className="detail-value">{contact.subject}</div>
              </div>
            )}

            <div className="detail-row">
              <div className="detail-label">
                <i className="fas fa-info-circle"></i>
                <span>Status:</span>
              </div>
              <div className="detail-value">
                <span className={`status-badge ${contact.status}`}>
                  {contact.status}
                </span>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">
                <i className="fas fa-calendar"></i>
                <span>Received:</span>
              </div>
              <div className="detail-value">
                {new Date(contact.created_at).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="message-section">
            <h3>Message:</h3>
            <div className="message-content">
              {contact.message}
            </div>
          </div>
        </div>

        <div className="contact-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsModal;
