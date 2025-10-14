import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import './AdminManagement.css';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  const [createForm, setCreateForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'moderator'
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const adminsData = await adminService.getAllAdmins();
      setAdmins(adminsData);
    } catch (error) {
      console.error('Error loading admins:', error);
      alert('Failed to load admins. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await adminService.createAdmin(createForm);
      alert('Admin created successfully!');
      setIsCreateModalOpen(false);
      setCreateForm({ username: '', email: '', password: '', role: 'moderator' });
      loadAdmins();
    } catch (error) {
      console.error('Error creating admin:', error);
      alert(error.message || 'Failed to create admin. Please try again.');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    try {
      await adminService.updatePassword(selectedAdmin.id, passwordForm.newPassword);
      alert('Password updated successfully!');
      setIsPasswordModalOpen(false);
      setPasswordForm({ newPassword: '', confirmPassword: '' });
      setSelectedAdmin(null);
    } catch (error) {
      console.error('Error updating password:', error);
      alert(error.message || 'Failed to update password. Please try again.');
    }
  };

  const handleToggleStatus = async (admin) => {
    try {
      await adminService.updateStatus(admin.id, !admin.is_active);
      alert(`Admin ${admin.is_active ? 'deactivated' : 'activated'} successfully!`);
      loadAdmins();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleDeleteAdmin = async (admin) => {
    if (window.confirm(`Are you sure you want to delete admin "${admin.username}"?`)) {
      try {
        await adminService.deleteAdmin(admin.id);
        alert('Admin deleted successfully!');
        loadAdmins();
      } catch (error) {
        console.error('Error deleting admin:', error);
        alert(error.message || 'Failed to delete admin. Please try again.');
      }
    }
  };

  const openPasswordModal = (admin) => {
    setSelectedAdmin(admin);
    setIsPasswordModalOpen(true);
  };

  return (
    <div className="admin-management">
      <div className="content-header">
        <div className="header-left">
          <h1>Admin Management</h1>
          <p>Manage admin users and their permissions</p>
        </div>
        <div className="header-actions">
          <button 
            className="add-admin-btn"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <i className="fas fa-user-plus"></i> Create Admin
          </button>
        </div>
      </div>

      <div className="admins-table-container">
        {loading ? (
          <div className="loading">Loading admins...</div>
        ) : (
          <table className="admins-table">
            <thead>
              <tr>
                <th>Admin Info</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id}>
                  <td>
                    <div className="admin-info">
                      <div className="admin-avatar">
                        <i className="fas fa-user-shield"></i>
                      </div>
                      <div className="admin-details">
                        <h4>{admin.username}</h4>
                        <p>{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${admin.role}`}>
                      <i className={`fas fa-${admin.role === 'admin' ? 'crown' : 'user-tie'}`}></i>
                      {admin.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${admin.is_active ? 'active' : 'inactive'}`}>
                      <i className={`fas fa-${admin.is_active ? 'check-circle' : 'times-circle'}`}></i>
                      {admin.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="date-info">
                      <div className="date">{new Date(admin.created_at).toLocaleDateString()}</div>
                      <div className="time">{new Date(admin.created_at).toLocaleTimeString()}</div>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn password-btn"
                        onClick={() => openPasswordModal(admin)}
                        title="Change Password"
                      >
                        <i className="fas fa-key"></i>
                      </button>
                      <button 
                        className={`action-btn toggle-btn ${admin.is_active ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleStatus(admin)}
                        title={admin.is_active ? 'Deactivate' : 'Activate'}
                      >
                        <i className={`fas fa-${admin.is_active ? 'toggle-on' : 'toggle-off'}`}></i>
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteAdmin(admin)}
                        title="Delete Admin"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Admin Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Admin</h2>
              <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateAdmin} className="admin-form">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={createForm.username}
                  onChange={(e) => setCreateForm({...createForm, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm({...createForm, role: e.target.value})}
                >
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">Create Admin</button>
                <button type="button" className="cancel-btn" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && selectedAdmin && (
        <div className="modal-overlay" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Password for {selectedAdmin.username}</h2>
              <button className="close-btn" onClick={() => setIsPasswordModalOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleUpdatePassword} className="admin-form">
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">Update Password</button>
                <button type="button" className="cancel-btn" onClick={() => setIsPasswordModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;

