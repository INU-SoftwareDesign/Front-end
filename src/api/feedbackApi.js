import apiClient from './apiClient';

/**
 * Feedback API service
 * This service provides methods to interact with the feedback-related endpoints
 */
const feedbackApi = {
  /**
   * Get feedback records for a specific student
   * @param {string} studentId - The student ID
   * @returns {Promise} - Promise with feedback records
   */
  getStudentFeedbacks: (studentId) => {
    console.log('[FeedbackAPI] Fetching feedbacks for studentId:', studentId);
    return apiClient.get(`/feedbacks/students/${studentId}`)
      .then(response => {
        console.log('[FeedbackAPI] Received feedbacks:', response.data);
        return response;
      })
      .catch(error => {
        console.warn('[FeedbackAPI] API call failed, using dummy data:', error);
        
        // 더미 데이터 반환
        const dummyData = {
          data: {
            success: true,
            data: [
              {
                id: 101,
                studentId: 20250001,
                grade: "1",
                classNumber: "3",
                teacherId: 5,
                teacherName: "김선생",
                createdAt: "2025-04-10T09:30:00",
                updatedAt: "2025-04-16T10:15:00",
                feedbacks: [
                  {
                    id: 1,
                    category: "academic",
                    content: "수학 과목에서 지속적인 향상을 보이고 있으며, 특히 방정식 풀이에 탁월한 능력을 보여줍니다. 다만, 기하학 부분에서는 조금 더 연습이 필요합니다."
                  },
                  {
                    id: 2,
                    category: "behavior",
                    content: "수업 시간에 적극적으로 참여하고 발표를 잘합니다. 친구들과의 관계도 원만하며 협동심이 뛰어납니다."
                  },
                  {
                    id: 5,
                    category: "attitude",
                    content: "항상 긍정적인 태도로 학교생활에 임하고 있습니다. 어려운 과제도 포기하지 않고 끝까지 해결하려는 의지가 강합니다."
                  }
                ]
              },
              {
                id: 102,
                studentId: 20250001,
                grade: "2",
                classNumber: "1",
                teacherId: 8,
                teacherName: "박선생",
                createdAt: "2025-06-10T15:45:00",
                updatedAt: "2025-06-10T15:45:00",
                feedbacks: [
                  {
                    id: 3,
                    category: "academic",
                    content: "2학년 학업 성취도가 매우 우수합니다. 특히 영어와 과학 과목에서 두각을 나타내고 있습니다."
                  },
                  {
                    id: 4,
                    category: "attendance",
                    content: "출석 상황이 매우 양호합니다. 지각이나 결석 없이 성실하게 등교하고 있습니다."
                  }
                ]
              }
            ]
          }
        };
        
        return Promise.resolve(dummyData);
        
        // Return dummy data if API call fails
        return {
          data: {
            success: true,
            data: [
              // 1학년 피드백 데이터
              {
                id: 101,
                studentId: studentId,
                grade: '1',
                classNumber: '3',
                teacherId: 5,
                teacherName: '김선생',
                createdAt: '2025-04-25T16:30:00',
                updatedAt: '2025-04-25T16:30:00',
                feedbacks: [
                  {
                    id: 1,
                    category: 'academic', // 성적
                    content: '수학 과목에서 지속적인 향상을 보이고 있으며, 특히 방정식 풀이에 탁월한 능력을 보여줍니다. 다만, 기하학 부분에서는 조금 더 연습이 필요합니다.'
                  },
                  {
                    id: 2,
                    category: 'behavior', // 행동
                    content: '수업 시간에 적극적으로 참여하고 발표를 잘합니다. 친구들과의 관계도 원만하며 협동심이 뛰어납니다.'
                  },
                  {
                    id: 3,
                    category: 'attendance', // 출결
                    content: '전반적으로 출석률이 좋습니다. 지각이 간혹 있으니 조금 더 시간 관리에 신경 써주세요.'
                  },
                  {
                    id: 4,
                    category: 'attitude', // 태도
                    content: '수업 태도가 매우 좋으며, 항상 예의 바르게 행동합니다. 과제 제출도 항상 기한 내에 잘 해오고 있습니다.'
                  }
                ]
              },
              
              // 2학년 피드백 데이터
              {
                id: 102,
                studentId: studentId,
                grade: '2',
                classNumber: '1',
                teacherId: 8,
                teacherName: '박선생',
                createdAt: '2024-06-10T15:45:00',
                updatedAt: '2024-06-10T15:45:00',
                feedbacks: [
                  {
                    id: 5,
                    category: 'academic', // 성적
                    content: '국어와 영어 과목에서 우수한 성적을 보이고 있습니다. 특히 작문 능력이 뛰어나며 독해력도 좋습니다. 과학 과목은 조금 더 관심을 가지면 좋겠습니다.'
                  },
                  {
                    id: 6,
                    category: 'behavior', // 행동
                    content: '학급 활동에 적극적으로 참여하며 리더십을 발휘합니다. 다른 학생들을 돕는 모습이 자주 보이며 책임감이 강합니다.'
                  },
                  {
                    id: 7,
                    category: 'attendance', // 출결
                    content: '출석 상태가 매우 양호합니다. 결석이 전혀 없으며 항상 정시에 등교합니다.'
                  },
                  {
                    id: 8,
                    category: 'attitude', // 태도
                    content: '수업 준비를 항상 철저히 하며 질문이 많고 호기심이 왕성합니다. 과제 제출도 성실하게 하고 있으나, 가끔 조금 더 꼼꼼하게 검토하면 좋겠습니다.'
                  }
                ]
              }
            ]
          }
        };
      });
  },

  /**
   * Create a new feedback
   * @param {Object} feedbackData - The feedback data
   * @returns {Promise} - Promise with created feedback
   */
  createFeedback: (feedbackData) => {
    console.log('[FeedbackAPI] Creating feedback with data:', feedbackData);
    return apiClient.post('/feedbacks', feedbackData)
      .then(response => {
        console.log('[FeedbackAPI] Created feedback response:', response.data);
        return response;
      })
      .catch(error => {
        console.warn('[FeedbackAPI] API call failed, using dummy response:', error);
        
        // 임의의 고유한 숫자형 ID 생성 (100~999 사이의 난수)
        const uniqueId = 100 + Math.floor(Math.random() * 900);
        
        // Return dummy response if API call fails
        return {
          data: {
            success: true,
            data: {
              id: uniqueId,
              ...feedbackData,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }
        };
      });
  },

  /**
   * Update an existing feedback
   * @param {number} feedbackId - The feedback ID
   * @param {Object} feedbackData - The updated feedback data
   * @returns {Promise} - Promise with updated feedback
   */
  updateFeedback: (feedbackId, feedbackData) => {
    console.log('[FeedbackAPI] Updating feedback:', feedbackId);
    console.log('[FeedbackAPI] Request body:', JSON.stringify(feedbackData, null, 2));
    return apiClient.patch(`/feedbacks/${feedbackId}`, feedbackData)
      .then(response => {
        console.log('[FeedbackAPI] Updated feedback response:', response.data);
        return response;
      })
      .catch(error => {
        console.warn('[FeedbackAPI] API call failed:', error);
        throw error;
      });
  },

  /**
   * Delete a feedback
   * @param {number} feedbackId - The feedback ID
   * @returns {Promise} - Promise with deletion confirmation
   */
  deleteFeedback: (feedbackId) => {
    console.log('[FeedbackAPI] Deleting feedback:', feedbackId);
    return apiClient.delete(`/feedbacks/${feedbackId}`)
      .then(response => {
        console.log('[FeedbackAPI] Delete feedback response:', response.data);
        return response;
      })
      .catch(error => {
        console.warn('[FeedbackAPI] API call failed:', error);
        throw error;
      });
  }
};

export default feedbackApi;
