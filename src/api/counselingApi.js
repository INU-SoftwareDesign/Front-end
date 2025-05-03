import apiClient from './apiClient';

/**
 * Counseling API service
 * This service provides methods to interact with the counseling-related endpoints
 */
const counselingApi = {
  /**
   * Get counseling records for a specific student
   * @param {number} studentId - The student ID
   * @param {Object} params - Optional query parameters
   * @returns {Promise} - Promise with counseling records
   */
  getStudentCounselings: (studentId, params = {}) => {
    return apiClient.get(`/counselings/student/${studentId}`, { params });
  },

  /**
   * Get counseling requests for a specific teacher
   * @param {string} teacherId - The teacher ID
   * @param {Object} params - Optional query parameters
   * @returns {Promise} - Promise with counseling requests
   */
  getTeacherCounselingRequests: (teacherId, params = {}) => {
    return apiClient.get(`/counselings/teacher/${teacherId}/requests`, { params });
  },

  /**
   * Get scheduled counselings for a specific teacher
   * @param {string} teacherId - The teacher ID
   * @param {Object} params - Optional query parameters
   * @returns {Promise} - Promise with scheduled counselings
   */
  getTeacherScheduledCounselings: (teacherId, params = {}) => {
    return apiClient.get(`/counselings/teacher/${teacherId}/scheduled`, { params });
  },

  /**
   * Get teacher's calendar data for counseling scheduling
   * @param {string} teacherId - The teacher ID
   * @param {number} year - The year
   * @param {number} month - The month
   * @returns {Promise} - Promise with calendar data
   */
  getTeacherCalendar: (teacherId, year, month) => {
    return apiClient.get(`/counselings/teacher/${teacherId}/calendar`, {
      params: { year, month }
    });
  },

  /**
   * Get available counseling times for a specific teacher on a specific date
   * @param {string} teacherId - The teacher ID
   * @param {string} date - The date in YYYY-MM-DD format
   * @returns {Promise} - Promise with available times
   */
  getAvailableTimes: (teacherId, date) => {
    return apiClient.get('/counselings/available-times', {
      params: { teacherId, date }
    });
  },

  /**
   * Create a new counseling request
   * @param {Object} counselingData - The counseling request data
   * @returns {Promise} - Promise with created counseling
   */
  createCounselingRequest: (counselingData) => {
    return apiClient.post('/counselings/request', counselingData);
  },

  /**
   * Approve a counseling request
   * @param {number} counselingId - The counseling ID
   * @param {Object} approvalData - The approval data
   * @returns {Promise} - Promise with updated counseling
   */
  approveCounseling: (counselingId, approvalData) => {
    return apiClient.patch(`/counselings/${counselingId}/approve`, approvalData);
  },

  /**
   * Update a counseling record
   * @param {number} counselingId - The counseling ID
   * @param {Object} counselingData - The updated counseling data
   * @returns {Promise} - Promise with updated counseling
   */
  updateCounseling: (counselingId, counselingData) => {
    return apiClient.patch(`/counselings/${counselingId}`, counselingData);
  },

  /**
   * Delete/cancel a counseling
   * @param {number} counselingId - The counseling ID
   * @returns {Promise} - Promise with deletion confirmation
   */
  deleteCounseling: (counselingId) => {
    return apiClient.delete(`/counselings/${counselingId}`);
  }
};

export default counselingApi;
