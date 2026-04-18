import apiClient from './apiClient';

/**
 * Admin Service - All endpoints require Bearer Token authentication
 * These are for protected/admin operations
 */
const adminService = {
  // PROFILE MANAGEMENT
  /**
   * Update profile (hero section)
   * @param {Object} profileData - Profile data to update
   * @param {string} profileData.name - Name
   * @param {string} profileData.headline - Headline
   * @param {string} profileData.subHeadline - Sub headline
   * @param {string} profileData.resumeUrl - Resume URL
   * @returns {Promise}
   */
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/api/v1/admin/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },

  // ABOUT SECTION MANAGEMENT
  /**
   * Update about section
   * @param {Object} aboutData - About section data
   * @param {string} aboutData.title - Section title
   * @param {string} aboutData.description - Description
   * @param {string} aboutData.yearsExperience - Years of experience
   * @param {string} aboutData.projectsCompleted - Projects count
   * @param {string} aboutData.techDebtReduced - Tech debt reduced
   * @returns {Promise}
   */
  updateAboutSection: async (aboutData) => {
    try {
      const response = await apiClient.put(
        '/api/v1/admin/about/section',
        aboutData
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update about section:', error);
      throw error;
    }
  },

  /**
   * Update about left section
   * @param {Object} sectionData - About section data
   * @param {string} sectionData.title - Section title
   * @param {string} sectionData.description - Description
   * @param {string} sectionData.yearsExperience - Years of experience
   * @param {string} sectionData.projectsCompleted - Projects count
   * @param {string} sectionData.techDebtReduced - Tech debt reduced
   * @returns {Promise}
   */
  updateAboutSection: async (sectionData) => {
    try {
      const response = await apiClient.put('/api/v1/admin/about/section', sectionData);
      return response.data;
    } catch (error) {
      console.error('Failed to update about section:', error);
      throw error;
    }
  },

  // EXPERIENCE MANAGEMENT
  /**
   * Add new experience entry
   * @param {Object} experienceData - Experience data
   * @param {string} experienceData.title - Job title
   * @param {string} experienceData.stage - Timeline (e.g., "2022 - Present")
   * @param {string} experienceData.description - Job description
   * @returns {Promise}
   */
  addExperience: async (experienceData) => {
    try {
      const response = await apiClient.post(
        '/api/v1/admin/experience',
        experienceData
      );
      return response.data;
    } catch (error) {
      console.error('Failed to add experience:', error);
      throw error;
    }
  },

  /**
   * Update experience entry
   * @param {number} id - Experience ID
   * @param {Object} experienceData - Updated experience data
   * @returns {Promise}
   */
  updateExperience: async (id, experienceData) => {
    try {
      const response = await apiClient.put(`/api/v1/admin/experience/${id}`, experienceData);
      return response.data;
    } catch (error) {
      console.error('Failed to update experience:', error);
      throw error;
    }
  },

  // PROJECT MANAGEMENT
  /**
   * Add new project
   * @param {Object} projectData - Project data
   * @param {string} projectData.title - Project title
   * @param {string} projectData.thumbnailPath - Thumbnail image path
   * @param {string} projectData.description - Project description
   * @param {Array} projectData.techStack - Array of technologies
   * @param {Array} projectData.ctaLinks - Call-to-action links
   * @returns {Promise}
   */
  addProject: async (projectData) => {
    try {
      const response = await apiClient.post('/api/v1/admin/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Failed to add project:', error);
      throw error;
    }
  },

  /**
   * Create new project
   * @param {Object} projectData - Project data
   * @returns {Promise}
   */
  createProject: async (projectData) => {
    return adminService.addProject(projectData);
  },

  /**
   * Update existing project
   * @param {number} projectId - Project ID
   * @param {Object} projectData - Updated project data
   * @returns {Promise}
   */
  updateProject: async (projectId, projectData) => {
    try {
      const response = await apiClient.put(`/api/v1/admin/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  },

  /**
   * Delete project
   * @param {number} id - Project ID
   * @returns {Promise}
   */
  deleteProject: async (id) => {
    try {
      const response = await apiClient.delete(`/api/v1/admin/projects/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  },

  // AWARD MANAGEMENT
  /**
   * Add new award
   * @param {Object} awardData - Award data
   * @param {string} awardData.title - Award title
   * @param {string} awardData.stage - Year/date
   * @param {string} awardData.description - Award description
   * @returns {Promise}
   */
  addAward: async (awardData) => {
    try {
      const response = await apiClient.post('/api/v1/admin/awards', awardData);
      return response.data;
    } catch (error) {
      console.error('Failed to add award:', error);
      throw error;
    }
  },

  /**
   * Delete award
   * @param {number} id - Award ID
   * @returns {Promise}
   */
  deleteAward: async (id) => {
    try {
      const response = await apiClient.delete(`/api/v1/admin/awards/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error('Failed to delete award:', error);
      throw error;
    }
  },

  /**
   * Update award entry
   * @param {number} id - Award ID
   * @param {Object} awardData - Updated award data
   * @returns {Promise}
   */
  updateAward: async (id, awardData) => {
    try {
      const response = await apiClient.put(`/api/v1/admin/awards/${id}`, awardData);
      return response.data;
    } catch (error) {
      console.error('Failed to update award:', error);
      throw error;
    }
  },

  // CERTIFICATION MANAGEMENT
  /**
   * Add new certification
   * @param {Object} certData - Certification data
   * @param {string} certData.title - Certification title
   * @param {string} certData.stage - Year/date
   * @param {string} certData.description - Certification description
   * @returns {Promise}
   */
  addCertification: async (certData) => {
    try {
      const response = await apiClient.post(
        '/api/v1/admin/certifications',
        certData
      );
      return response.data;
    } catch (error) {
      console.error('Failed to add certification:', error);
      throw error;
    }
  },

  /**
   * Delete certification
   * @param {number} id - Certification ID
   * @returns {Promise}
   */
  deleteCertification: async (id) => {
    try {
      const response = await apiClient.delete(
        `/api/v1/admin/certifications/${id}`
      );
      return response.status === 204;
    } catch (error) {
      console.error('Failed to delete certification:', error);
      throw error;
    }
  },

  /**
   * Update certification entry
   * @param {number} id - Certification ID
   * @param {Object} certData - Updated certification data
   * @returns {Promise}
   */
  updateCertification: async (id, certData) => {
    try {
      const response = await apiClient.put(`/api/v1/admin/certifications/${id}`, certData);
      return response.data;
    } catch (error) {
      console.error('Failed to update certification:', error);
      throw error;
    }
  },

  // SKILLS MANAGEMENT
  addSkillCategory: async (categoryData) => {
    try {
      const response = await apiClient.post('/api/v1/admin/skill-categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Failed to add skill category:', error);
      throw error;
    }
  },

  updateSkillCategory: async (id, categoryData) => {
    try {
      const response = await apiClient.put(`/api/v1/admin/skill-categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Failed to update skill category:', error);
      throw error;
    }
  },

  deleteSkillCategory: async (id) => {
    try {
      const response = await apiClient.delete(`/api/v1/admin/skill-categories/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error('Failed to delete skill category:', error);
      throw error;
    }
  },

  addSkill: async (categoryId, skillData) => {
    try {
      const response = await apiClient.post(`/api/v1/admin/skill-categories/${categoryId}/skills`, skillData);
      return response.data;
    } catch (error) {
      console.error('Failed to add skill:', error);
      throw error;
    }
  },

  updateSkill: async (id, skillData) => {
    try {
      const response = await apiClient.put(`/api/v1/admin/skills/${id}`, skillData);
      return response.data;
    } catch (error) {
      console.error('Failed to update skill:', error);
      throw error;
    }
  },

  deleteSkill: async (id) => {
    try {
      const response = await apiClient.delete(`/api/v1/admin/skills/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error('Failed to delete skill:', error);
      throw error;
    }
  },

  // CONTACT MANAGEMENT
  updateContact: async (contactData) => {
    try {
      const response = await apiClient.patch('/api/v1/admin/profile/contact-info', contactData);
      return response.data;
    } catch (error) {
      console.error('Failed to update contact info:', error);
      throw error;
    }
  },

  getContactSubmissions: async () => {
    try {
      const response = await apiClient.get('/api/v1/admin/contact-submissions');
      return response.data;
    } catch (error) {
      console.error('Failed to get contact submissions:', error);
      throw error;
    }
  },

  bulkDeleteContactSubmissions: async (ids) => {
    try {
      const response = await apiClient.post(`/api/v1/admin/contact-submissions/bulk-delete`, ids);
      return response.status === 204;
    } catch (error) {
      console.error('Failed to bulk delete contact submissions:', error);
      throw error;
    }
  },
};

export default adminService;
