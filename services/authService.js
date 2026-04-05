import apiClient from './apiClient';

const authService = {
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Returns JWT token in response
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/api/v1/auth/login', {
        email,
        password,
      });
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('jwt_token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout - Remove token from storage
   */
  logout: () => {
    localStorage.removeItem('jwt_token');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if token exists
   */
  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('jwt_token');
    }
    return false;
  },

  /**
   * Get stored JWT token
   * @returns {string|null} - JWT token or null
   */
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwt_token');
    }
    return null;
  },
};

export default authService;
