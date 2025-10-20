const API_BASE_URL = '/api/admin';

export const adminService = {
  // Login admin
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      
      // Store token and user data
      if (data.success && data.data.token) {
        console.log('✅ Login successful, storing token...');
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.data.user));
        localStorage.setItem('isLoggedIn', 'true');
        console.log('✅ Token stored successfully:', {
          token: data.data.token.substring(0, 20) + '...',
          user: data.data.user.username
        });
      } else {
        console.error('❌ Login failed: No token in response', data);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout admin
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('isLoggedIn');
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('adminUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Check if user is logged in
  isLoggedIn: () => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    const isLoggedIn = !!(token && user);
    console.log('🔍 Checking login status:', {
      hasToken: !!token,
      hasUser: !!user,
      isLoggedIn: isLoggedIn
    });
    return isLoggedIn;
  },

  // Get all admins
  getAllAdmins: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No admin token found');
      
      const response = await fetch(`${API_BASE_URL}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch admins');
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  },

  // Create admin
  createAdmin: async (adminData) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No admin token found');
      
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(adminData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create admin');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  },

  // Update admin password
  updatePassword: async (adminId, newPassword) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No admin token found');
      
      const response = await fetch(`${API_BASE_URL}/${adminId}/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },

  // Update admin status
  updateStatus: async (adminId, isActive) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No admin token found');
      
      const response = await fetch(`${API_BASE_URL}/${adminId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: isActive }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  },

  // Delete admin
  deleteAdmin: async (adminId) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No admin token found');
      
      const response = await fetch(`${API_BASE_URL}/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete admin');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  }
};

