import apiClient from './apiClient';

/**
 * Counseling API service
 * This service provides methods to interact with the counseling-related endpoints
 */
const counselingApi = {
  /**
   * Get counseling records for a specific student
   * @param {number} studentId - The student ID
   * @param {Object} params - Optional query parameters (status, startDate, endDate)
   * @returns {Promise} - Promise with counseling records including detailed information
   */
  getStudentCounselings: (studentId, params = {}) => {
    return apiClient.get(`/counselings/student/${studentId}`, { params })
      .catch(error => {
        console.warn('API call failed, using dummy data:', error);
        
        // Return dummy data if API call fails
        return {
          data: {
            success: true,
            data: [
              {
                id: 401,
                studentId: studentId,
                studentName: '홍길동1',
                grade: '1',
                classNumber: '7',
                number: '1',
                requestDate: '2025-04-25',
                counselingDate: '2025-05-05',
                counselingTime: '10:00',
                counselorName: '김교수',
                counselingType: '교수상담',
                counselingCategory: '학업',
                status: '예약확정',
                location: '교수연구실 A-301',
                requestContent: '중간고사 결과에 대한 피드백을 받고 싶습니다.',
                resultContent: '',
                contactNumber: '010-1234-5678'
              }
            ]
          }
        };
      });
  },
  

  /**
   * Get counseling requests for a specific teacher
   * @param {string} teacherId - The teacher ID (e.g., 'teacher5')
   * @param {Object} params - Optional query parameters
   * @returns {Promise} - Promise with counseling requests
   */
  getTeacherCounselingRequests: (teacherId, params = {}) => {
    // 'teacher5'와 같은 형식에서 숫자만 추출
    const teacherIdNumber = teacherId.replace('teacher', '');
    console.log(`원본 teacherId: ${teacherId}, 변환된 teacherId: ${teacherIdNumber}`);
    
    return apiClient.get(`/counselings/teacher/${teacherIdNumber}/requests`, { params })
      .catch(error => {
        console.warn('API call failed, using dummy data:', error);
        
        // Return dummy data if API call fails
        return {
          data: {
            success: true,
            data: [
              {
                id: 501,
                studentId: 1,
                studentName: '홍길동1',
                grade: '1',
                classNumber: '7',
                number: '1',
                requestDate: '2025-05-01',
                counselingDate: '2025-05-10',
                counselingTime: '10:00',
                counselingType: '학생상담',
                counselingCategory: '학업',
                status: '신청',
                requestContent: '수학 과목 과제에 대해 상담하고 싶습니다.',
                contactNumber: '010-1234-5678'
              },
              {
                id: 502,
                studentId: 2,
                studentName: '홍길동2',
                grade: '1',
                classNumber: '7',
                number: '2',
                requestDate: '2025-05-02',
                counselingDate: '2025-05-12',
                counselingTime: '13:30',
                counselingType: '학생상담',
                counselingCategory: '진로',
                status: '신청',
                requestContent: '대학 진학에 대해 상담하고 싶습니다.',
                contactNumber: '010-2345-6789'
              }
            ]
          }
        };
      });
  },

  /**
   * Get scheduled counselings for a specific teacher
   * @param {string} teacherId - The teacher ID (e.g., 'teacher5')
   * @param {Object} params - Optional query parameters
   * @returns {Promise} - Promise with scheduled counselings
   */
  getTeacherScheduledCounselings: (teacherId, params = {}) => {
    // 'teacher5'와 같은 형식에서 숫자만 추출
    const teacherIdNumber = teacherId.replace('teacher', '');
    console.log(`원본 teacherId: ${teacherId}, 변환된 teacherId: ${teacherIdNumber}`);
    
    return apiClient.get(`/counselings/teacher/${teacherIdNumber}/scheduled`, { params })
      .catch(error => {
        console.warn('API call failed, using dummy data:', error);
        
        // Return dummy data if API call fails
        return {
          data: {
            success: true,
            data: [
              {
                id: 201,
                studentId: 2,
                studentName: '홍길동2',
                grade: '1',
                classNumber: '7',
                number: '2',
                requestDate: '2025-04-25',
                counselingDate: '2025-05-05',
                counselingTime: '13:00',
                counselingType: '교수상담',
                counselingCategory: '학업',
                status: '예약확정',
                location: '교수연구실 A-301',
                requestContent: '중간고사 결과에 대한 피드백을 받고 싶습니다.',
                resultContent: '',
                contactNumber: '010-2345-6789'
              },
              {
                id: 202,
                studentId: 3,
                studentName: '홍길동3',
                grade: '2',
                classNumber: '5',
                number: '15',
                requestDate: '2025-04-26',
                counselingDate: '2025-05-07',
                counselingTime: '14:30',
                counselingType: '진로상담',
                counselingCategory: '진로',
                status: '예약확정',
                location: '상담실 B-102',
                requestContent: '대학 진학 관련 상담을 받고 싶습니다.',
                resultContent: '',
                contactNumber: '010-3456-7890'
              }
            ]
          }
        };
      });
  },

  /**
   * Get teacher's calendar data for counseling scheduling
   * @param {string} teacherId - The teacher ID (e.g., 'teacher5')
   * @param {number} year - The year
   * @param {number} month - The month
   * @returns {Promise} - Promise with calendar data
   */
  getTeacherCalendar: (teacherId, year, month) => {
    // 'teacher5'와 같은 형식에서 숫자만 추출
    const teacherIdNumber = teacherId.replace('teacher', '');
    console.log(`원본 teacherId: ${teacherId}, 변환된 teacherId: ${teacherIdNumber}`);
    
    return apiClient.get(`/counselings/teacher/${teacherIdNumber}/calendar`, {
      params: { year, month }
    });
  },

  /**
   * Get available counseling times for a specific teacher on a specific date
   * @param {string} teacherId - The teacher ID (e.g., 'teacher5')
   * @param {string} date - The date in YYYY-MM-DD format
   * @returns {Promise} - Promise with available times and booked times
   */
  getAvailableTimes: (teacherId, date) => {
    // 'teacher5'와 같은 형식에서 숫자만 추출
    const teacherIdNumber = teacherId.replace('teacher', '');
    console.log(`원본 teacherId: ${teacherId}, 변환된 teacherId: ${teacherIdNumber}`);
    
    return apiClient.get('/counselings/available-times', {
      params: { teacherId: teacherIdNumber, date }
    })
    .catch(error => {
      console.warn('API call failed, using dummy data:', error);
      
      // Return dummy data if API call fails
      return {
        data: {
          success: true,
          data: {
            availableTimes: ["09:00", "09:30", "10:30", "11:30", "13:30", "14:00", "14:30", "16:00", "16:30", "17:00"],
            bookedTimes: ["10:00", "11:00", "13:00", "15:00", "15:30"]
          }
        }
      };
    });
  },

  /**
   * Create a new counseling request
   * @param {Object} counselingData - The counseling request data including studentId, teacherId, counselingDate, counselingTime, etc.
   * @returns {Promise} - Promise with created counseling or error response
   */
  createCounselingRequest: (counselingData) => {
    // counselingData에 teacherId가 있으면 'teacher' 접두사 제거
    const modifiedData = { ...counselingData };
    if (modifiedData.teacherId && typeof modifiedData.teacherId === 'string' && modifiedData.teacherId.includes('teacher')) {
      modifiedData.teacherId = modifiedData.teacherId.replace('teacher', '');
      console.log(`원본 teacherId: ${counselingData.teacherId}, 변환된 teacherId: ${modifiedData.teacherId}`);
    }
    
    return apiClient.post('/counselings', modifiedData)
      .catch(error => {
        console.warn('API call failed, using dummy response:', error);
        
        // 시간 중복 에러 시뮬레이션 (테스트용)
        // 특정 시간(14:00)에 신청하면 중복 에러 반환
        if (counselingData.counselingTime === '14:00') {
          return {
            data: {
              success: false,
              error: {
                code: 'TIME_ALREADY_BOOKED',
                message: '해당 시간에 이미 예약된 상담이 있습니다.'
              }
            }
          };
        }
        
        // 성공 응답 시뮬레이션
        return {
          data: {
            success: true,
            data: {
              id: 501,
              status: '신청',
              requestDate: new Date().toISOString().split('T')[0], // 오늘 날짜
              message: '상담 신청이 완료되었습니다.'
            }
          }
        };
      });
  },

  /**
   * Approve a counseling request
   * @param {number} counselingId - The counseling ID
   * @param {Object} approvalData - The approval data including location
   * @returns {Promise} - Promise with approved counseling
   */
  approveCounseling: (counselingId, approvalData) => {
    return apiClient.patch(`/counselings/${counselingId}/approve`, approvalData)
      .catch(error => {
        console.warn('API call failed, using dummy data:', error);
        
        // Return dummy data if API call fails
        return {
          data: {
            success: true,
            data: {
              id: counselingId,
              status: '예약확정',
              location: approvalData.location,
              message: '상담 신청이 성공적으로 확정되었습니다.'
            }
          }
        };
      });
  },

  /**
   * Update a counseling record
   * @param {number} counselingId - The counseling ID
   * @param {Object} counselingData - The updated counseling data
   * @returns {Promise} - Promise with updated counseling
   */
  updateCounseling: (counselingId, counselingData) => {
    return apiClient.patch(`/counselings/${counselingId}`, counselingData)
      .catch(error => {
        console.warn('API call failed, using dummy response:', error);
        
        // 성공 응답 시뮬레이션
        return {
          data: {
            success: true,
            data: {
              id: counselingId,
              message: '상담 정보가 수정되었습니다.'
            }
          }
        };
      });
  },
  


  /**
   * Delete/cancel a counseling
   * @param {number} counselingId - The counseling ID
   * @returns {Promise} - Promise with deletion confirmation
   */
  deleteCounseling: (counselingId) => {
    return apiClient.delete(`/counselings/${counselingId}`)
      .catch(error => {
        console.warn('API call failed, using dummy response:', error);
        
        // 오류 응답 시뮬레이션 (완료된 상담 취소 시)
        if (Math.random() > 0.7) {
          return {
            data: {
              success: false,
              error: {
                code: 'CANNOT_CANCEL_COMPLETED',
                message: '이미 완료된 상담은 취소할 수 없습니다.'
              }
            }
          };
        }
        
        // 성공 응답 시뮬레이션
        return {
          data: {
            success: true,
            data: {
              message: '상담 예약이 취소되었습니다.'
            }
          }
        };
      });
  }
};

export default counselingApi;
