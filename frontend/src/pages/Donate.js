import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import DonorPopup from '../components/DonorPopup';
import { donationService } from '../services/donationService';
import './Donate.css';
import DonationSuccessModal from '../components/DonationSuccessModal';

const Donate = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    
    // Donation Details
    amount: '',
    donationType: 'donation',
    campaign: 'general',
    anonymous: false,
    message: '',

    // Payment Details
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare donation data for database
      const donationData = {
        donor_name: `${formData.firstName} ${formData.lastName}`,
        donor_email: formData.email,
        donor_phone: formData.phone,
        donor_country: formData.address, // Using address as country for now
        amount: parseFloat(formData.amount),
        currency: 'USD',
        payment_method: 'Credit Card',
        donation_type: formData.campaign,
        message: formData.message,
        is_anonymous: formData.anonymous
      };

      // Save to database
      const result = await donationService.createDonation(donationData);
      console.log('Donation saved to database:', result);
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        amount: '',
        donationType: 'donation',
        campaign: 'general',
        anonymous: false,
        message: '',
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
      });

      // Reset step to 1
      setStep(1);
    } catch (error) {
      console.error('Error saving donation:', error);
      alert('Failed to process donation. Please try again.');
    }
  };

  const predefinedAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <div className="donate-page">
      <Breadcrumb  title="Donate Now" />
      
      <section className="donation-section">
        <div className="container">
          <div className="donation-content">
            <div className="donation-info">
              <span className="section-tag">Support Our Cause</span>
              <h2>Your Donation Will Help Us Make A Difference</h2>
              <p>Every contribution helps us continue our mission to create positive change in communities around the world.</p>
              
              <div className="donation-impact">
                <div className="impact-item">
                  <i className="fas fa-home"></i>
                  <h4>Shelter Support</h4>
                  <p>Provide safe housing for families in need</p>
                </div>
                <div className="impact-item">
                  <i className="fas fa-heartbeat"></i>
                  <h4>Healthcare</h4>
                  <p>Deliver essential medical services</p>
                </div>
                <div className="impact-item">
                  <i className="fas fa-book"></i>
                  <h4>Education</h4>
                  <p>Support children's education programs</p>
                </div>
              </div>
            </div>

            <div className="donation-form-container">
              <div className="form-steps">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>
                  <span className="step-number">1</span>
                  <span className="step-title">Amount</span>
                </div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>
                  <span className="step-number">2</span>
                  <span className="step-title">Details</span>
                </div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>
                  <span className="step-number">3</span>
                  <span className="step-title">Payment</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="donation-form">
                {step === 1 && (
                  <div className="form-step">
                    <h3>Select Amount</h3>
                    <div className="amount-options">
                      {predefinedAmounts.map(amount => (
                        <button
                          type="button"
                          key={amount}
                          className={`amount-btn ${formData.amount === amount.toString() ? 'active' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                        >
                          ${amount}
                        </button>
                      ))}
                      <div className="custom-amount">
                        <input
                          type="number"
                          name="amount"
                          placeholder="Custom Amount"
                          value={formData.amount}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="donation-type-options">
                      <div className="form-group">
                        <label>Type of Contribution</label>
                        <div className="donation-type-buttons">
                          <button
                            type="button"
                            className={`type-btn ${formData.donationType === 'donation' ? 'active' : ''}`}
                            onClick={() => handleInputChange({ target: { name: 'donationType', value: 'donation' } })}
                          >
                            <i className="fas fa-donate"></i>
                            <span>Donation</span>
                          </button>
                          <button
                            type="button"
                            className={`type-btn ${formData.donationType === 'zakat' ? 'active' : ''}`}
                            onClick={() => handleInputChange({ target: { name: 'donationType', value: 'zakat' } })}
                          >
                            <i className="fas fa-star-and-crescent"></i>
                            <span>Zakat</span>
                          </button>
                          <button
                            type="button"
                            className={`type-btn ${formData.donationType === 'sadqa' ? 'active' : ''}`}
                            onClick={() => handleInputChange({ target: { name: 'donationType', value: 'sadqa' } })}
                          >
                            <i className="fas fa-hands-helping"></i>
                            <span>Sadqa</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <button type="button" className="next-btn" onClick={() => setStep(2)}>
                      Next Step
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="form-step">
                    <h3>Personal Details</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Message (Optional)</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="form-group checkbox">
                      <label>
                        <input
                          type="checkbox"
                          name="anonymous"
                          checked={formData.anonymous}
                          onChange={handleInputChange}
                        />
                        Make this donation anonymous
                      </label>
                    </div>

                    <div className="button-group">
                      <button type="button" className="back-btn" onClick={() => setStep(1)}>
                        Back
                      </button>
                      <button type="button" className="next-btn" onClick={() => setStep(3)}>
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="form-step">
                    <h3>Payment Details</h3>
                    
                    <div className="form-group">
                      <label>Name on Card</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="donation-summary">
                      <h4>Donation Summary</h4>
                      <div className="summary-item">
                        <span>Amount:</span>
                        <span>${formData.amount}</span>
                      </div>
                      <div className="summary-item">
                        <span>Type:</span>
                        <span className="donation-type">
                          {formData.donationType === 'donation' && 'General Donation'}
                          {formData.donationType === 'zakat' && 'Zakat'}
                          {formData.donationType === 'sadqa' && 'Sadqa'}
                        </span>
                      </div>
                    </div>

                    <div className="button-group">
                      <button type="button" className="back-btn" onClick={() => setStep(2)}>
                        Back
                      </button>
                      <button type="submit" className="submit-btn">
                        Complete Donation
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <DonationSuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        donationAmount={formData.amount}
      />
      
      <DonorPopup />
    </div>
  );
};

export default Donate; 