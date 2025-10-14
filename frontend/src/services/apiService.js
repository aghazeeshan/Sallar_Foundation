const API_BASE_URL = 'http://localhost:5000/api';

// Blog API Service
export const blogService = {
  // Get all blog posts
  getAllPosts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog`);
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  },

  // Get blog post by slug
  getPostBySlug: async (slug) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/${slug}`);
      if (!response.ok) throw new Error('Failed to fetch blog post');
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
  },

  // Create new blog post
  createPost: async (postData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) throw new Error('Failed to create blog post');
      return await response.json();
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  // Update blog post
  updatePost: async (id, postData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) throw new Error('Failed to update blog post');
      return await response.json();
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  },

  // Delete blog post
  deletePost: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/posts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete blog post');
      return await response.json();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  },
};

// Auth API Service
export const authService = {
  // Register user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Failed to register user');
      return await response.json();
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error('Failed to login');
      return await response.json();
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
};

// Form Submission Service
export const formService = {
  // Submit contact form
  submitContact: async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to submit contact form');
      return await response.json();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },

  // Submit donation form
  submitDonation: async (donationData) => {
    try {
      const response = await fetch('http://localhost:5000/submit-donation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });
      if (!response.ok) throw new Error('Failed to submit donation');
      return await response.json();
    } catch (error) {
      console.error('Error submitting donation:', error);
      throw error;
    }
  },

  // Submit volunteer form
  submitVolunteer: async (volunteerData) => {
    try {
      const response = await fetch('http://localhost:5000/submit-volunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(volunteerData),
      });
      if (!response.ok) throw new Error('Failed to submit volunteer application');
      return await response.json();
    } catch (error) {
      console.error('Error submitting volunteer application:', error);
      throw error;
    }
  },
};
