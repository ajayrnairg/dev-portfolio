import apiClient from './apiClient';

const aboutService = {
  /**
   * Get complete About section data
   * Includes left panel and all tabs: skills, experience, awards, certifications
   * @returns {Promise} - Returns leftSection and tabs data
   */
  getAbout: async () => {
    try {
      const response = await apiClient.get('/api/v1/about');
      console.log('API response for about data:', response);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch about data:', error);
      throw error;
    }
  },
};

export default aboutService;
