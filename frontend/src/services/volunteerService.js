const API_BASE_URL = 'http://localhost:5000/api/volunteers';

export const volunteerService = {
  // Get all volunteers for admin
  getAllVolunteersAdmin: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }
      const response = await fetch(`${API_BASE_URL}/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch volunteers');
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      throw error;
    }
  },

  // Get volunteer statistics
  getVolunteerStats: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch volunteer stats');
      const data = await response.json();
      return data.data || {};
    } catch (error) {
      console.error('Error fetching volunteer stats:', error);
      return {};
    }
  },

  // Create volunteer application
  createVolunteer: async (volunteerData) => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(volunteerData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit volunteer application');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating volunteer:', error);
      throw error;
    }
  },

  // Get volunteer by ID
  getVolunteerById: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch volunteer');
      return await response.json();
    } catch (error) {
      console.error('Error fetching volunteer:', error);
      return null;
    }
  },

  // Update volunteer status (admin only)
  updateVolunteerStatus: async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update volunteer status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      throw error;
    }
  },

  // Delete volunteer (admin only)
  deleteVolunteer: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete volunteer');
      return await response.json();
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      throw error;
    }
  },
};
