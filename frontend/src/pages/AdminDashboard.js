import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <i className="fas fa-user-shield"></i>
          <span>Admin Panel</span>
        </div>
        <nav className="admin-nav">
          <a href="#" className="active">
            <i className="fas fa-home"></i> Dashboard
          </a>
          <a href="#">
            <i className="fas fa-blog"></i> Blog Posts
          </a>
          <a href="#">
            <i className="fas fa-calendar"></i> Events
          </a>
          <a href="#">
            <i className="fas fa-users"></i> Users
          </a>
          <a href="#">
            <i className="fas fa-cog"></i> Settings
          </a>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Welcome, Admin</h1>
          <div className="admin-actions">
            <button className="new-post-btn">
              <i className="fas fa-plus"></i> New Post
            </button>
          </div>
        </header>

        <div className="admin-stats">
          <div className="stat-card">
            <i className="fas fa-blog"></i>
            <div className="stat-info">
              <h3>Total Posts</h3>
              <p>24</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-users"></i>
            <div className="stat-info">
              <h3>Users</h3>
              <p>156</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-eye"></i>
            <div className="stat-info">
              <h3>Views</h3>
              <p>2,345</p>
            </div>
          </div>
        </div>

        <section className="recent-posts">
          <h2>Recent Posts</h2>
          <div className="posts-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Making a Difference</td>
                  <td>Education</td>
                  <td>Mar 24, 2024</td>
                  <td>
                    <button className="action-btn edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="action-btn delete">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                {/* Add more rows */}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard; 