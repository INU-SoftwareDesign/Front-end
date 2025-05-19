import apiClient from './apiClient';

/**
 * Teacher API functions for teacher-related operations
 */

/**
 * Get teacher details by ID
 * @param {string|number} teacherId - Teacher ID to fetch details for
 * @returns {Promise} - Promise with teacher details
 */
export const getTeacherDetails = async (teacherId) => {
  try {
    const response = await apiClient.get(`/teachers/${teacherId}/`);
    return response.data;
  } catch (error) {
    console.error('Teacher details fetch error:', error);
    if (error.response && error.response.status === 404) {
      throw new Error('교사 정보를 찾을 수 없습니다.');
    }
    throw new Error('교사 정보를 가져오는데 실패했습니다.');
  }
};
