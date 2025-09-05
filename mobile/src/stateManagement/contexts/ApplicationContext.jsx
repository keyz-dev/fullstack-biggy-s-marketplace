import React, { createContext, useState, useContext, useCallback } from 'react';
import applicationAPI from '../../api/application';

const ApplicationContext = createContext();

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
};

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==================== APPLICATION MANAGEMENT ====================

  /**
   * Get user's applications
   */
  const getMyApplications = useCallback(async (applicationType = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await applicationAPI.getMyApplications(applicationType);
      setApplications(response.data || []);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch applications';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get single application by ID
   */
  const getApplication = useCallback(async (applicationId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await applicationAPI.getApplication(applicationId);
      setCurrentApplication(response.data);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch application';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get application status with timeline
   */
  const getApplicationStatus = useCallback(async (applicationId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await applicationAPI.getApplicationStatus(applicationId);
      setCurrentApplication(response.data.application);
      setTimeline(response.data.timeline);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch application status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get application timeline
   */
  const getApplicationTimeline = useCallback(async (applicationId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await applicationAPI.getApplicationTimeline(applicationId);
      setTimeline(response.data);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch application timeline';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update application
   */
  const updateApplication = useCallback(async (applicationId, updateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await applicationAPI.updateApplication(applicationId, updateData);
      
      // Update current application if it's the one being updated
      if (currentApplication && currentApplication._id === applicationId) {
        setCurrentApplication(response.data);
      }
      
      // Update applications list
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId ? response.data : app
        )
      );
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update application';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentApplication]);

  /**
   * Delete application
   */
  const deleteApplication = useCallback(async (applicationId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await applicationAPI.deleteApplication(applicationId);
      
      // Remove from applications list
      setApplications(prev => prev.filter(app => app._id !== applicationId));
      
      // Clear current application if it's the one being deleted
      if (currentApplication && currentApplication._id === applicationId) {
        setCurrentApplication(null);
        setTimeline([]);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete application';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentApplication]);

  /**
   * Refresh application data
   */
  const refreshApplication = useCallback(async (applicationId) => {
    if (!applicationId) return;
    
    try {
      await getApplicationStatus(applicationId);
    } catch (err) {
      console.error('Failed to refresh application:', err);
    }
  }, [getApplicationStatus]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clear current application data
   */
  const clearCurrentApplication = useCallback(() => {
    setCurrentApplication(null);
    setTimeline([]);
    setError(null);
  }, []);

  // ==================== HELPER FUNCTIONS ====================

  /**
   * Get status color
   */
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b'; // amber-500
      case 'under_review':
        return '#3b82f6'; // blue-500
      case 'approved':
        return '#10b981'; // emerald-500
      case 'rejected':
        return '#ef4444'; // red-500
      case 'suspended':
        return '#6b7280'; // gray-500
      default:
        return '#6b7280'; // gray-500
    }
  }, []);

  /**
   * Get status text
   */
  const getStatusText = useCallback((status) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'under_review':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'suspended':
        return 'Suspended';
      default:
        return status;
    }
  }, []);

  /**
   * Get status icon
   */
  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case 'pending':
        return 'clock';
      case 'under_review':
        return 'alert-circle';
      case 'approved':
        return 'check-circle';
      case 'rejected':
        return 'x-circle';
      case 'suspended':
        return 'pause-circle';
      default:
        return 'clock';
    }
  }, []);

  /**
   * Format date
   */
  const formatDate = useCallback((date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // ==================== CONTEXT VALUE ====================

  const value = {
    // State
    applications,
    currentApplication,
    timeline,
    loading,
    error,

    // Actions
    getMyApplications,
    getApplication,
    getApplicationStatus,
    getApplicationTimeline,
    updateApplication,
    deleteApplication,
    refreshApplication,
    clearError,
    clearCurrentApplication,

    // Helpers
    getStatusColor,
    getStatusText,
    getStatusIcon,
    formatDate,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationContext;
