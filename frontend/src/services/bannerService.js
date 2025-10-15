const API_BASE_URL = 'http://localhost:5000/api/banner';

export const bannerService = {
  // Get all banners
  getAllBanners: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      if (!response.ok) throw new Error('Failed to fetch banners');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
  },

  // Get all banners for admin (including inactive)
  getAllBannersAdmin: async () => {
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
        throw new Error(errorData.message || 'Failed to fetch banners');
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching banners:', error);
      throw error;
    }
  },

  // Get active banner (first active banner)
  getActiveBanner: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      if (!response.ok) throw new Error('Failed to fetch active banner');
      const data = await response.json();
      const banners = data.data || [];
      // Return the first active banner
      return banners.length > 0 ? banners[0] : null;
    } catch (error) {
      console.error('Error fetching active banner:', error);
      return null;
    }
  },

  // Get banner by ID
  getBannerById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch banner');
      return await response.json();
    } catch (error) {
      console.error('Error fetching banner:', error);
      return null;
    }
  },

  // Create new banner
  createBanner: async (bannerData) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }
      const isFormData = typeof FormData !== 'undefined' && bannerData instanceof FormData;
      const headers = isFormData ? { 'Authorization': `Bearer ${token}` } : {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const body = isFormData ? bannerData : JSON.stringify(bannerData);
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers,
        body,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create banner');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  },

  // Update banner
  updateBanner: async (id, bannerData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const isFormData = typeof FormData !== 'undefined' && bannerData instanceof FormData;
      const headers = isFormData ? { 'Authorization': `Bearer ${token}` } : {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const body = isFormData ? bannerData : JSON.stringify(bannerData);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers,
        body,
      });
      if (!response.ok) throw new Error('Failed to update banner');
      return await response.json();
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  },

  // Delete banner
  deleteBanner: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete banner');
      return await response.json();
    } catch (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
  },

  // Toggle banner active status
  toggleBannerActive: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to toggle banner status');
      return await response.json();
    } catch (error) {
      console.error('Error toggling banner status:', error);
      throw error;
    }
  },
};