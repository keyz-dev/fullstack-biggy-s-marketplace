import api from './config';

const URL_PREFIX = '/application';

export const applicationAPI = {
  // ==================== APPLICATION MANAGEMENT ====================

  /**
   * Get user's own applications
   * @param {string} applicationType - Optional filter by application type
   * @returns {Promise} API response with applications
   */
  getMyApplications: async (applicationType = null) => {
    try {
      const params = applicationType ? { applicationType } : {};
      const response = await api.get(`${URL_PREFIX}/my`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single application by ID
   * @param {string} applicationId - Application ID
   * @returns {Promise} API response with application details
   */
  getApplication: async (applicationId) => {
    try {
      const response = await api.get(`${URL_PREFIX}/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update application (user can update their own pending application)
   * @param {string} applicationId - Application ID
   * @param {Object} updateData - Data to update
   * @returns {Promise} API response
   */
  updateApplication: async (applicationId, updateData) => {
    try {
      const response = await api.put(`${URL_PREFIX}/${applicationId}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete application (user can delete their own pending/rejected application)
   * @param {string} applicationId - Application ID
   * @returns {Promise} API response
   */
  deleteApplication: async (applicationId) => {
    try {
      const response = await api.delete(`${URL_PREFIX}/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== APPLICATION STATUS TRACKING ====================

  /**
   * Get application status with timeline
   * @param {string} applicationId - Application ID
   * @returns {Promise} API response with status and timeline
   */
  getApplicationStatus: async (applicationId) => {
    try {
      const response = await api.get(`${URL_PREFIX}/${applicationId}`);
      const application = response.data.data;
      
      // Create timeline from application data
      const timeline = applicationAPI.createApplicationTimeline(application);
      
      return {
        success: true,
        data: {
          application,
          timeline,
          status: application.status,
          estimatedCompletion: applicationAPI.getEstimatedCompletion(application)
        }
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get application timeline
   * @param {string} applicationId - Application ID
   * @returns {Promise} API response with timeline
   */
  getApplicationTimeline: async (applicationId) => {
    try {
      const response = await api.get(`${URL_PREFIX}/${applicationId}`);
      const application = response.data.data;
      const timeline = applicationAPI.createApplicationTimeline(application);
      
      return {
        success: true,
        data: timeline
      };
    } catch (error) {
      throw error;
    }
  },

  // ==================== HELPER FUNCTIONS ====================

  /**
   * Create timeline from application data
   * @param {Object} application - Application object
   * @returns {Array} Timeline array
   */
  createApplicationTimeline: (application) => {
    const timeline = [];

    // Submitted
    timeline.push({
      id: 1,
      status: 'submitted',
      title: 'Application Submitted',
      description: 'Your application has been submitted successfully.',
      date: application.submittedAt,
      completed: true
    });

    // Under Review
    if (application.status === 'under_review' || application.status === 'approved' || application.status === 'rejected') {
      timeline.push({
        id: 2,
        status: 'under_review',
        title: 'Under Review',
        description: 'Your application is being reviewed by our admin team.',
        date: application.reviewedAt || application.submittedAt,
        completed: application.status !== 'pending',
        current: application.status === 'under_review'
      });
    }

    // Document Review
    if (application.status === 'under_review' || application.status === 'approved' || application.status === 'rejected') {
      timeline.push({
        id: 3,
        status: 'document_review',
        title: 'Document Review',
        description: 'Admin is reviewing your submitted documents.',
        date: application.reviewedAt || new Date(),
        completed: application.status === 'approved' || application.status === 'rejected',
        current: application.status === 'under_review'
      });
    }

    // Decision
    if (application.status === 'approved' || application.status === 'rejected') {
      timeline.push({
        id: 4,
        status: 'decision',
        title: application.status === 'approved' ? 'Application Approved' : 'Application Rejected',
        description: application.status === 'approved' 
          ? 'Congratulations! Your application has been approved.'
          : 'Your application has been rejected. Please check the feedback.',
        date: application.approvedAt || application.rejectedAt,
        completed: true,
        current: false
      });
    } else {
      timeline.push({
        id: 4,
        status: 'decision',
        title: 'Decision Made',
        description: 'You will receive notification of the final decision.',
        date: applicationAPI.getEstimatedCompletion(application),
        completed: false
      });
    }

    return timeline;
  },

  /**
   * Get estimated completion date
   * @param {Object} application - Application object
   * @returns {Date} Estimated completion date
   */
  getEstimatedCompletion: (application) => {
    const submittedDate = new Date(application.submittedAt);
    const estimatedDays = 3; // Typically 2-3 business days
    const estimatedCompletion = new Date(submittedDate);
    estimatedCompletion.setDate(estimatedCompletion.getDate() + estimatedDays);
    return estimatedCompletion;
  },

  // ==================== ACCOUNT ACTIVATION ====================

  /**
   * Activate user account after application approval
   * @returns {Promise} API response
   */
  activateAccount: async () => {
    try {
      const response = await api.post(`${URL_PREFIX}/activate`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default applicationAPI;
