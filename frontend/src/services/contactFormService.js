const API_BASE_URL = '/api/contact-forms';

export const contactFormService = {
  // Get all contact forms for admin
  getAllContactFormsAdmin: async () => {
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
        throw new Error(errorData.message || 'Failed to fetch contact forms');
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching contact forms:', error);
      throw error;
    }
  },

  // Get contact form statistics
  getContactFormStats: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch contact form stats');
      const data = await response.json();
      return data.data || {};
    } catch (error) {
      console.error('Error fetching contact form stats:', error);
      return {};
    }
  },

  // Create contact form
  createContactForm: async (contactData) => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit contact form');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating contact form:', error);
      throw error;
    }
  },

  // Get contact form by ID
  getContactFormById: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch contact form');
      return await response.json();
    } catch (error) {
      console.error('Error fetching contact form:', error);
      return null;
    }
  },

  // Update contact form status (admin only)
  updateContactFormStatus: async (id, status) => {
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
        throw new Error(errorData.message || 'Failed to update contact form status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating contact form status:', error);
      throw error;
    }
  },

  // Delete contact form (admin only)
  deleteContactForm: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete contact form');
      return await response.json();
    } catch (error) {
      console.error('Error deleting contact form:', error);
      throw error;
    }
  },
};
