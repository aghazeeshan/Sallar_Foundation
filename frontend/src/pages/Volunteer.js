import React, { useState } from 'react';
import './Volunteer.css';
import Breadcrumb from '../components/Breadcrumb';
import VolunteerSuccessModal from '../components/VolunteerSuccessModal';

const Volunteer = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    occupation: '',
    skills: '',
    interests: '',
    availability: '',
    hours: '',
    experience: '',
    message: ''
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
    const newVolunteer = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    volunteers.push(newVolunteer);
    localStorage.setItem('volunteers', JSON.stringify(volunteers));
    
    setShowSuccessModal(true);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      occupation: '',
      skills: '',
      interests: '',
      availability: '',
      hours: '',
      experience: '',
      message: ''
    });
    setStep(1);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="form-step">
            <h3>Personal Information</h3>
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
                required
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="button" className="next-btn" onClick={nextStep}>
              Next Step <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <h3>Skills & Experience</h3>
            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Skills</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g., Teaching, First Aid, Web Development"
                required
              />
            </div>

            <div className="form-group">
              <label>Areas of Interest</label>
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                placeholder="e.g., Education, Healthcare, Environment"
                required
              />
            </div>

            <div className="form-group">
              <label>Previous Experience</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <div className="button-group">
              <button type="button" className="back-btn" onClick={prevStep}>
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button type="button" className="next-btn" onClick={nextStep}>
                Next Step <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <h3>Availability & Additional Info</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Availability</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Availability</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div className="form-group">
                <label>Hours per Week</label>
                <input
                  type="number"
                  name="hours"
                  value={formData.hours}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                placeholder="Tell us why you want to volunteer..."
              />
            </div>

            <div className="button-group">
              <button type="button" className="back-btn" onClick={prevStep}>
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button type="submit" className="submit-btn">
                Submit Application <i className="fas fa-check"></i>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="volunteer-page">
      <Breadcrumb title="Become A Volunteer" />
      
      <section className="volunteer-section">
        <div className="container">
          <div className="volunteer-content">
            <div className="volunteer-info">
              <h2>Let's join our community to<br />become a volunteer</h2>
              <p className="volunteer-description">
                Discover the inspiring stories of individuals and communities transformed by our
                programs. Our success stories highlight the real-life impact of your donations and
                the resilience of those we help. These narratives showcase the power of compassion
                and generosity.
              </p>

              <div className="requirements">
                <h3>Volunteer Requirements</h3>
                <ul className="requirements-list">
                  <li>
                    <i className="fas fa-check"></i>
                    Making this first true generator simply text
                  </li>
                  <li>
                    <i className="fas fa-check"></i>
                    Many desktop publish packages nothing
                  </li>
                  <li>
                    <i className="fas fa-check"></i>
                    If you are going to passage
                  </li>
                  <li>
                    <i className="fas fa-check"></i>
                    It has roots in a piece
                  </li>
                </ul>
              </div>

              <div className="volunteer-images">
                <img src="/images/img1.jpg" alt="Volunteer Work" className="volunteer-image" />
                <img src="/images/img2.jpg" alt="Community Help" className="volunteer-image" />
              </div>
            </div>

            <div className="volunteer-form-container">
              <div className="form-steps">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>
                  <div className="step-number">1</div>
                  <div className="step-title">Personal Info</div>
                </div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>
                  <div className="step-number">2</div>
                  <div className="step-title">Skills</div>
                </div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>
                  <div className="step-number">3</div>
                  <div className="step-title">Availability</div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="volunteer-form">
                {renderStepContent()}
              </form>
            </div>
          </div>
        </div>
      </section>

      <VolunteerSuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default Volunteer; 