import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import './LoginModal.css';
import SuccessPopup from './SuccessPopup';

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await adminService.login(formData);
      if (result.success) {
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed. Please try again.');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
    // Small delay to ensure localStorage is written
    setTimeout(() => {
      if (typeof onSuccess === 'function') {
        onSuccess();
      } else {
        window.location.href = '/admin/dashboard';
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="login-modal-overlay"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${process.env.PUBLIC_URL}/images/sallar_img6.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="login-modal">
          <div className="modal-content">
            <div className="modal-left">
              <div className="welcome-text">
                <h2>Welcome to Admin Panel</h2>
                <p>Please sign in to continue or create a new account</p>
              </div>
              <div className="decoration-image">
                <i className="fas fa-user-shield"></i>
              </div>
            </div>

            <div className="modal-right">
              <button className="close-modal" onClick={onClose}>&times;</button>
              
              <div className="form-tabs">
                <button className="tab-btn active">
                  Sign In
                </button>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                <h3>Sign In</h3>
                
                <div className="form-group">
                  <div className="input-icon">
                    <i className="fas fa-user"></i>
                    <input
                      type="text"
                      placeholder="Username"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-icon">
                    <i className="fas fa-lock"></i>
                    <input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" /> Remember me
                  </label>
                </div>

                <button type="submit" className="submit-btn">
                  Sign In <i className="fas fa-arrow-right"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <SuccessPopup 
        isOpen={showSuccess}
        message="Login successful! Welcome to the admin dashboard."
        onClose={handleSuccessClose}
      />
    </>
  );
};

export default LoginModal; 