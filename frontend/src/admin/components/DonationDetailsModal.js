import React from 'react';
import './DonationDetailsModal.css';

const DonationDetailsModal = ({ isOpen, onClose, donation }) => {
  if (!isOpen || !donation) return null;

  return (
    <div className="modal-overlay">
      <div className="donation-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Donation Details</h2>
        
        <div className="donation-modal-content">
          <div className="modal-section">
            <h3><i className="fas fa-user"></i> Donor Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <p>{donation.firstName} {donation.lastName}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{donation.email}</p>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{donation.phone}</p>
              </div>
              <div className="info-item">
                <label>Address</label>
                <p>{donation.address}</p>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3><i className="fas fa-hand-holding-heart"></i> Donation Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Amount</label>
                <p className="amount">${Number(donation.amount).toLocaleString()}</p>
              </div>
              <div className="info-item">
                <label>Campaign</label>
                <p>{donation.campaign}</p>
              </div>
              <div className="info-item">
                <label>Frequency</label>
                <p>{donation.frequency}</p>
              </div>
              <div className="info-item">
                <label>Date</label>
                <p>{new Date(donation.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3><i className="fas fa-credit-card"></i> Payment Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Card Number</label>
                <p>**** **** **** {donation.cardNumber?.slice(-4)}</p>
              </div>
              <div className="info-item">
                <label>Card Holder</label>
                <p>{donation.cardName}</p>
              </div>
            </div>
          </div>

          {donation.message && (
            <div className="modal-section">
              <h3><i className="fas fa-comment"></i> Message</h3>
              <p className="donation-message">{donation.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationDetailsModal; 