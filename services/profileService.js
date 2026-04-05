import apiClient from "./apiClient";

const profileService = {
  /**
   * Get profile data (hero section)
   * @returns {Promise} - Returns name, headline, subHeadline, resumeUrl
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get("/api/v1/profile/getProfile");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      throw error;
    }
  },

  /**
   * Download resume and track the download
   * Redirects to cloudinary URL
   */
  downloadResume: async (event) => {
    if (event) event.preventDefault();
    try {
      const response = await apiClient.get("/api/v1/profile/resume/download", {
        responseType: "blob", // Crucial: tells axios to handle binary data
      });

      // 1. Create a Blob from the response data
      const file = new Blob([response.data], { type: "application/pdf" });

      // 2. Create a temporary URL for the blob
      const fileURL = URL.createObjectURL(file);

      // 3. Create a hidden anchor element and trigger click
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "Ajay_Nair_Resume.pdf"); // Filename for the user
      document.body.appendChild(link);
      link.click();

      // 4. Clean up
      link.parentNode.removeChild(link);
      URL.revokeObjectURL(fileURL);

      return true;
    } catch (error) {
      console.error("Failed to download resume:", error);
      throw error;
    }
  },

  /**
   * Get resume download statistics
   * @returns {Promise} - Returns array of download records with IP and timestamp
   */
  getResumeStats: async () => {
    try {
      const response = await apiClient.get("/api/v1/profile/resume/stats");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch resume stats:", error);
      throw error;
    }
  },
};

export default profileService;
