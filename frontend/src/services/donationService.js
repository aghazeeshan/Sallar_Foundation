const API_BASE_URL = '/api/donations';

export const donationService = {
  // Get all donations for admin
  getAllDonationsAdmin: async () => {
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
        throw new Error(errorData.message || 'Failed to fetch donations');
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }
  },

  // Get latest donations for popup
  getLatestDonations: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/latest`);
      if (!response.ok) throw new Error('Failed to fetch latest donations');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching latest donations:', error);
      return [];
    }
  },

  // Get donation statistics
  getDonationStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) throw new Error('Failed to fetch donation stats');
      const data = await response.json();
      return data.data || {};
    } catch (error) {
      console.error('Error fetching donation stats:', error);
      return {};
    }
  },

  // Create donation
  createDonation: async (donationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(donationData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create donation');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating donation:', error);
      throw error;
    }
  },

  // Get donation by ID
  getDonationById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch donation');
      return await response.json();
    } catch (error) {
      console.error('Error fetching donation:', error);
      return null;
    }
  },

  // Update donation status (admin only)
  updateDonationStatus: async (id, status) => {
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
        throw new Error(errorData.message || 'Failed to update donation status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating donation status:', error);
      throw error;
    }
  },

  // Delete donation (admin only)
  deleteDonation: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete donation');
      return await response.json();
    } catch (error) {
      console.error('Error deleting donation:', error);
      throw error;
    }
  },
};
