const API_BASE_URL = 'http://localhost:5000/api/services';

export const serviceService = {
  // Get all services
  getAllServices: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  },

  // Get all services for admin (including inactive)
  getAllServicesAdmin: async () => {
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
        throw new Error(errorData.message || 'Failed to fetch services');
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  // Get service by ID
  getServiceById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch service');
      return await response.json();
    } catch (error) {
      console.error('Error fetching service:', error);
      return null;
    }
  },

  // Create new service
  createService: async (serviceData) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }

      const headers = { 'Authorization': `Bearer ${token}` };
      if (!(serviceData instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: headers,
        body: serviceData instanceof FormData ? serviceData : JSON.stringify(serviceData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create service');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  // Update service
  updateService: async (id, serviceData) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const headers = { 'Authorization': `Bearer ${token}` };
      if (!(serviceData instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: headers,
        body: serviceData instanceof FormData ? serviceData : JSON.stringify(serviceData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update service');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  // Delete service
  deleteService: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete service');
      return await response.json();
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  },

  // Toggle service active status
  toggleServiceActive: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to toggle service status');
      return await response.json();
    } catch (error) {
      console.error('Error toggling service status:', error);
      throw error;
    }
  },
};

