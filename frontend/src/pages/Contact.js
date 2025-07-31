import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import './Contact.css';
import ContactSuccessModal from '../components/ContactSuccessModal';

const Contact = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        }),
      });

      if (response.ok) {
        alert('Form submitted successfully!');
        setFormData({ name: '', email: '', message: '' }); // Reset form
      } else {
        alert('Failed to submit form.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form.');
    }
  };

  return (
    <div className="contact-page">
      <Breadcrumb  title="Contact Us" />
      
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3>Address</h3>
                <p>4 Camden Road, Tunbridge wells TN1 2PT, United Kingdom.
                </p>
               
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <h3>Phone</h3>
                <a href="tel:+447869559100">+44 786 9559 100</a>
                
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <h3>Email</h3>
                <a href="mailto:info@sallarfoundation.org">info@sallarfoundation.org</a>
               
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <i className="fas fa-question-circle"></i>
                </div>
                <h3>Have Questions?</h3>
                <p>Discover more by visiting</p>
                <p>us or joining our community</p>
              </div>
            </div>

            <div className="contact-map">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!4v1736975208778!6m8!1m7!1s5UqRf1sMkeNm1AUGB7uW2Q!2m2!1d51.13415341374862!2d0.2666851696566104!3f132.84!4f0!5f0.7820865974627469" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="Location map"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="container">
          <div className="contact-form-grid">
            <div className="contact-form-image">
              <img src="/images/contact_1_1.png" alt="Contact Us" />
              <div className="brush-stroke"></div>
            </div>
            
            <div className="contact-form-content">
              <span className="section-tag">Send Message</span>
              <h2>Have Any Questions? Feel Free to Contact Us</h2>
              <p>We would love to hear from you! Whether you have questions or need more information about our programs, we are here to help. </p>
              <br/>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Your Name" 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="Email Address" 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    placeholder="Type Your Message" 
                    rows="4"
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="send-message-btn">
                  Send a Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <ContactSuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default Contact; 