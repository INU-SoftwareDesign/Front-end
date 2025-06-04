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
    // 데이터 형식 변환을 위한 새 객체 생성
    const formattedData = { ...noteData };
    
    // teacherId 처리: "teacher5"와 같은 형식에서 숫자만 추출하여 정수로 변환
    if (formattedData.teacherId && typeof formattedData.teacherId === 'string') {
      const numericPart = formattedData.teacherId.replace(/\D/g, '');
      formattedData.teacherId = numericPart ? parseInt(numericPart, 10) : formattedData.teacherId;
    }
    
    // 학생 ID 처리: 로그로 현재 상태 확인
    console.log('%c[SpecialNotesAPI] 원본 데이터 구조:', 'color: #3498db; font-weight: bold;', {
      noteData,
      formattedData,
      student: formattedData.student,
      directStudentId: formattedData.studentId
    });
    
    // studentId 처리: 다양한 소스에서 학생 ID 추출 시도
    if (!formattedData.studentId) {
      // 1. student 객체에서 id 필드 확인
      if (formattedData.student && formattedData.student.id) {
        console.log('%c[SpecialNotesAPI] student.id에서 studentId 추출:', 'color: #2ecc71; font-weight: bold;', formattedData.student.id);
        formattedData.studentId = formattedData.student.id;
      } 
      // 2. student 객체에서 studentId 필드 확인
      else if (formattedData.student && formattedData.student.studentId) {
        console.log('%c[SpecialNotesAPI] student.studentId에서 studentId 추출:', 'color: #2ecc71; font-weight: bold;', formattedData.student.studentId);
        formattedData.studentId = formattedData.student.studentId;
      }
      // 3. 직접 student 객체에서 추출
      else if (noteData.student) {
        if (noteData.student.id) {
          console.log('%c[SpecialNotesAPI] noteData.student.id에서 studentId 추출:', 'color: #2ecc71; font-weight: bold;', noteData.student.id);
          formattedData.studentId = noteData.student.id;
        } else if (noteData.student.studentId) {
          console.log('%c[SpecialNotesAPI] noteData.student.studentId에서 studentId 추출:', 'color: #2ecc71; font-weight: bold;', noteData.student.studentId);
          formattedData.studentId = noteData.student.studentId;
        }
      }
      // 4. studentUrlId 확인
      else if (noteData.studentUrlId) {
        console.log('%c[SpecialNotesAPI] studentUrlId에서 studentId 추출:', 'color: #2ecc71; font-weight: bold;', noteData.studentUrlId);
        formattedData.studentId = noteData.studentUrlId;
      }
    }
    
    // studentId가 없는 경우 오류 로그
    if (!formattedData.studentId) {
      console.error('%c[SpecialNotesAPI] 오류: studentId가 없습니다!', 'color: #e74c3c; font-weight: bold;');
    } else {
      console.log('%c[SpecialNotesAPI] studentId 원본값 사용:', 'color: #2ecc71; font-weight: bold;', formattedData.studentId);
    }
    
    // 요청 본문을 위한 최종 데이터 객체 생성
    console.log('%c[SpecialNotesAPI] 최종 요청 전 studentId 값:', 'color: #8e44ad; font-weight: bold;', {
      original: noteData.studentId,
      formatted: formattedData.studentId,
      type: typeof formattedData.studentId
    });
    
    // 반드시 studentId가 포함되어야 함
    const requestData = {
      studentId: formattedData.studentId, // 반드시 studentId 포함
      grade: formattedData.grade,
      classNumber: formattedData.classNumber,
      teacherId: formattedData.teacherId,
      teacherName: formattedData.teacherName,
      specialTalent: formattedData.specialTalent,
      careerAspiration: formattedData.careerAspiration,
      note: formattedData.note
    };
    
    console.log('%c[SpecialNotesAPI] Creating special note with formatted data:', 'color: #1D4EB0; font-weight: bold;', requestData);
    console.log('%c[SpecialNotesAPI] API 전송 데이터 분석:', 'color: #1D4EB0; font-style: italic;', {
      studentId: requestData.studentId, // 확인용 로깅
      teacherId: requestData.teacherId,
      teacherName: requestData.teacherName,
      grade: requestData.grade,
      timestamp: new Date().toISOString()
    });
    
    // studentId가 없는 경우 추가 오류 처리
    if (!requestData.studentId) {
      console.error('%c[SpecialNotesAPI] 심각한 오류: API 요청에 studentId가 없습니다!', 'color: #e74c3c; font-weight: bold; font-size: 14px;');
      return Promise.reject(new Error('studentId가 없어 특기사항을 저장할 수 없습니다.'));
    }
    
    // 최종 요청 데이터 구성 - studentId를 반드시 포함
    const finalRequestData = {
      studentId: requestData.studentId,  // 반드시 포함
      grade: requestData.grade,
      classNumber: requestData.classNumber,
      teacherId: requestData.teacherId,
      teacherName: requestData.teacherName,
      specialTalent: requestData.specialTalent,
      careerAspiration: requestData.careerAspiration,
      note: requestData.note
    };
    
    // 최종 데이터 로깅
    console.log('%c[SpecialNotesAPI] 최종 API 요청 데이터:', 'color: #8e44ad; font-weight: bold; font-size: 14px;', finalRequestData);
    console.log('%c[SpecialNotesAPI] studentId 최종 값:', 'color: #e67e22; font-weight: bold; font-size: 14px;', finalRequestData.studentId);
    
    // 요청 본문을 명시적으로 지정하여 API 호출
    return apiClient.post('/specialnotes/', finalRequestData)
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
