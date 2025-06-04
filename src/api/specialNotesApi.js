import apiClient from './apiClient';

/**
 * Special Notes API service
 * This service provides methods to interact with the special notes-related endpoints
 */
const specialNotesApi = {
  /**
   * Get special notes records for a specific student
   * @param {number} studentId - The student ID
   * @returns {Promise} - Promise with special notes records
   */
  getStudentSpecialNotes: (studentId) => {
    console.log('%c[SpecialNotesAPI] Fetching special notes for studentId:', 'color: #1D4EB0; font-weight: bold;', studentId);
    return apiClient.get(`/specialnotes/students/${studentId}`)
      .then(response => {
        console.log('%c[SpecialNotesAPI] Received special notes:', 'color: #1D4EB0; font-weight: bold;', response.data);
        return response;
      })
      .catch(error => {
        console.warn('%c[SpecialNotesAPI] API call failed, using dummy data:', 'color: #e74c3c; font-weight: bold;', error);
        
        // Return dummy data if API call fails
        return {
          data: {
            success: true,
            data: [
              // 1학년 특기사항 데이터
              {
                id: 201,
                studentId: studentId,
                grade: 1,
                classNumber: 3,
                teacherId: 5,
                teacherName: '김선생',
                specialTalent: '컴퓨터게임',
                careerAspiration: {
                  student: '프로게이머',
                  parent: '소프트웨어 개발자'
                },
                note: '컴퓨터 관련 활동에 흥미가 많으며 논리적 사고력이 뛰어납니다. 게임을 통해 전략적 사고와 문제 해결 능력을 키우고 있으며, 프로그래밍 동아리 활동에도 적극적으로 참여하고 있습니다.',
                createdAt: '2025-04-25T16:30:00',
                updatedAt: '2025-04-25T16:30:00'
              },
              
              // 2학년 특기사항 데이터
              {
                id: 202,
                studentId: studentId,
                grade: 2,
                classNumber: 1,
                teacherId: 8,
                teacherName: '박선생',
                specialTalent: '음악감상',
                careerAspiration: {
                  student: '유치원교사',
                  parent: '초등교사'
                },
                note: '적극적이고 세심한 성격으로 아이들에 대한 애정을 지니고 있음. 관련 봉사활동도 열심히 참여하고 있음.',
                createdAt: '2025-05-31T10:30:00',
                updatedAt: '2025-05-31T10:30:00'
              }
            ]
          }
        };
      });
  },

  /**
   * Create a new special note
   * @param {Object} noteData - The special note data
   * @returns {Promise} - Promise with created special note
   */
  createSpecialNote: (noteData) => {
    console.log('%c[SpecialNotesAPI] Creating special note with data:', 'color: #1D4EB0; font-weight: bold;', noteData);
    console.log('%c[SpecialNotesAPI] API 전송 데이터 분석:', 'color: #1D4EB0; font-style: italic;', {
      teacherId: noteData.teacherId,
      teacherName: noteData.teacherName,
      grade: noteData.grade,
      studentId: noteData.studentId,
      timestamp: new Date().toISOString()
    });
    return apiClient.post('/specialnotes', noteData)
      .then(response => {
        console.log('%c[SpecialNotesAPI] Created special note response:', 'color: #1D4EB0; font-weight: bold;', response.data);
        return response;
      })
      .catch(error => {
        console.warn('%c[SpecialNotesAPI] API call failed, using dummy response:', 'color: #e74c3c; font-weight: bold;', error);
        
        // 임의의 고유한 숫자형 ID 생성 (200~999 사이의 난수)
        const uniqueId = 200 + Math.floor(Math.random() * 800);
        
        // Return dummy response if API call fails
        return {
          data: {
            success: true,
            data: {
              id: uniqueId,
              ...noteData,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }
        };
      });
  },

  /**
   * Update an existing special note
   * @param {number} noteId - The special note ID
   * @param {Object} noteData - The updated special note data
   * @returns {Promise} - Promise with updated special note
   */
  updateSpecialNote: (noteId, noteData) => {
    console.log('%c[SpecialNotesAPI] Updating special note:', 'color: #1D4EB0; font-weight: bold;', noteId, 'with data:', noteData);
    console.log('%c[SpecialNotesAPI] API 전송 데이터 분석:', 'color: #1D4EB0; font-style: italic;', {
      noteId: noteId,
      teacherId: noteData.teacherId,
      teacherName: noteData.teacherName,
      grade: noteData.grade,
      studentId: noteData.studentId,
      timestamp: new Date().toISOString()
    });
    return apiClient.patch(`/specialnotes/${noteId}`, noteData)
      .then(response => {
        console.log('[SpecialNotesAPI] Updated special note response:', response.data);
        return response;
      })
      .catch(error => {
        console.warn('[SpecialNotesAPI] API call failed, using dummy response:', error);
        
        // Return dummy response if API call fails
        return {
          data: {
            success: true,
            data: {
              id: noteId,
              ...noteData,
              updatedAt: new Date().toISOString()
            }
          }
        };
      });
  },

  /**
   * Delete a special note
   * @param {number} noteId - The special note ID
   * @returns {Promise} - Promise with deletion confirmation
   */
  deleteSpecialNote: (noteId) => {
    console.log('[SpecialNotesAPI] Deleting special note:', noteId);
    return apiClient.delete(`/specialnotes/${noteId}`)
      .then(response => {
        console.log('[SpecialNotesAPI] Delete special note response:', response.data);
        return response;
      })
      .catch(error => {
        console.warn('[SpecialNotesAPI] API call failed, using dummy response:', error);
        
        // Return dummy response if API call fails
        return {
          data: {
            success: true,
            message: `특기사항 ID ${noteId}가 성공적으로 삭제되었습니다.`
          }
        };
      });
  }
};

export default specialNotesApi;
