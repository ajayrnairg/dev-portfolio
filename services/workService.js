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

  /**
   * Get formatted projects list
   */
  getProjects: async () => {
    try {
      const response = await apiClient.get('/api/v1/work');
      return response.data.projects || [];
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  },
};

export default workService;
