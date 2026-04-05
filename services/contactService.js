import apiClient from './apiClient';

const contactService = {
  /**
   * Send contact message
   * @param {Object} contactData - Contact message data
   * @param {string} contactData.name - Sender's name (required)
   * @param {string} contactData.email - Sender's email (required, must be valid)
   * @param {string} contactData.subject - Message subject (optional)
   * @param {string} contactData.message - Message body (required, min 10 characters)
   * @returns {Promise} - Returns success message
   */
  sendMessage: async (contactData) => {
    try {
      const { name, email, subject, message } = contactData;

      // Client-side validation
      if (!name || !name.trim()) {
        throw new Error('Name is required');
      }
      if (!email || !email.trim()) {
        throw new Error('Email is required');
      }
      if (!message || message.trim().length < 10) {
        throw new Error('Message is required and must be at least 10 characters');
      }

      const response = await apiClient.post('/api/v1/contact', {
        name: name.trim(),
        email: email.trim(),
        subject: subject?.trim() || '',
        message: message.trim(),
      });

      return response.data;
    } catch (error) {
      console.error('Failed to send contact message:', error);
      throw error;
    }
  },
};

export default contactService;
