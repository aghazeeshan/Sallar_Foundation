import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';
import SuccessPopup from './SuccessPopup';

const LoginModal = ({ isOpen, onClose }) => {
  const [formType, setFormType] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formType === 'login') {
      // Simple validation for demo
      if (formData.email === 'admin@gmail.com' && formData.password === 'admin123') {
        localStorage.setItem('isLoggedIn', 'true');
        setShowSuccess(true); // Show success popup instead of immediate navigation
      } else {
        alert('Invalid credentials');
      }
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/admin/dashboard');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="login-modal-overlay">
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
                <button 
                  className={`tab-btn ${formType === 'login' ? 'active' : ''}`}
                  onClick={() => setFormType('login')}
                >
                  Sign In
                </button>
                <button 
                  className={`tab-btn ${formType === 'signup' ? 'active' : ''}`}
                  onClick={() => setFormType('signup')}
                >
                  Sign Up
                </button>
              </div>

              {formType === 'login' && (
                <form onSubmit={handleSubmit} className="login-form">
                  <h3>Sign In</h3>
                  
                  <div className="form-group">
                    <div className="input-icon">
                      <i className="fas fa-envelope"></i>
                      <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                    <span 
                      className="forgot-password"
                      onClick={() => setFormType('forgot')}
                    >
                      Forgot Password?
                    </span>
                  </div>

                  <button type="submit" className="submit-btn">
                    Sign In <i className="fas fa-arrow-right"></i>
                  </button>
                </form>
              )}

              {formType === 'signup' && (
                <form onSubmit={handleSubmit} className="signup-form">
                  <h3>Create Account</h3>
                  
                  <div className="form-group">
                    <div className="input-icon">
                      <i className="fas fa-user"></i>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="input-icon">
                      <i className="fas fa-envelope"></i>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
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

                  <div className="form-group">
                    <div className="input-icon">
                      <i className="fas fa-lock"></i>
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="submit-btn">
                    Create Account <i className="fas fa-user-plus"></i>
                  </button>
                </form>
              )}

              {formType === 'forgot' && (
                <form className="forgot-form">
                  <h3>Reset Password</h3>
                  <p>Enter your email to reset your password</p>
                  
                  <div className="form-group">
                    <div className="input-icon">
                      <i className="fas fa-envelope"></i>
                      <input
                        type="email"
                        placeholder="Email"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="submit-btn">
                    Send Reset Link <i className="fas fa-paper-plane"></i>
                  </button>

                  <p 
                    className="back-to-login"
                    onClick={() => setFormType('login')}
                  >
                    <i className="fas fa-arrow-left"></i> Back to Login
                  </p>
                </form>
              )}
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