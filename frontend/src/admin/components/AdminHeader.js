import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css';

const AdminHeader = ({ userEmail, toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/development');
  };

  return (
    <div className="admin-top-header">
      <div className="admin-header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar} title="Toggle Sidebar">
          <i className="fas fa-bars"></i>
        </button>
        
        {/* Search Bar */}
        <div className="admin-search">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search..."
          />
        </div>

        <div className="current-date">
          <i className="far fa-calendar-alt"></i>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      
      <div className="admin-header-right">
        <div className="admin-notifications">
          <button className="notification-btn">
            <i className="far fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>
        </div>
        
        {/* User Profile with Dropdown */}
        <div className="admin-user" ref={dropdownRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <div className="admin-user-icon">
            <i className="fas fa-user"></i>
          </div>
          <div className="admin-user-info">
            <span className="admin-name">Admin</span>
            <span className="admin-email">{userEmail}</span>
          </div>
          
          {/* Dropdown Menu */}
          <div className={`admin-dropdown ${isDropdownOpen ? 'show' : ''}`}>
            <a href="#" className="dropdown-item">
              <i className="fas fa-user"></i>
              Profile
            </a>
            <a href="#" className="dropdown-item">
              <i className="fas fa-cog"></i>
              Settings
            </a>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader; 