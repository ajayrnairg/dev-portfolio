import apiClient from './apiClient';

const workService = {
  /**
   * Get featured projects/work section data
   * @returns {Promise} - Returns title, description, and array of projects
   */
  getWork: async () => {
    try {
      const response = await apiClient.get('/api/v1/work');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch work data:', error);
      throw error;
    }
  },
};

export default workService;
