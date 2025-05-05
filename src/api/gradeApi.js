import apiClient from './apiClient';

/**
 * Grade API functions for managing student grades
 */



/**
 * Get student grade overview
 * @param {string} studentId - The student ID
 * @param {string} grade - The grade level
 * @param {string} semester - The semester
 * @returns {Promise} - Promise with student grade overview
 */
export const getStudentGradeOverview = async (studentId, grade, semester) => {
  try {
    const response = await apiClient.get(`/grades/students/${studentId}/overview`, {
      params: { grade, semester }
    });
    return response.data;
  } catch (error) {
    console.warn('API call failed, using dummy data:', error);
    
    // Return dummy data if API call fails
    return {
      studentId: "20250001",
      studentName: "홍길동1",
      grade: grade || "1",
      classNumber: "7",
      number: "1",
      subjects: [
        {
          name: "국어",
          credits: 3,
          midterm: 88.6,
          final: 75.2,
          performance: 20.0,
          totalScore: 85.5,
          rank: "??",
          gradeLevel: "??"
        },
        {
          name: "수학",
          credits: 4,
          midterm: 92.3,
          final: 89.5,
          performance: 18.0,
          totalScore: 88.9,
          rank: "??",
          gradeLevel: "??"
        },
        {
          name: "영어",
          credits: 3,
          midterm: 78.5,
          final: 82.4,
          performance: 19.5,
          totalScore: 81.6,
          rank: "??",
          gradeLevel: "??"
        },
        {
          name: "과학",
          credits: 2,
          midterm: 85.0,
          final: 83.2,
          performance: 19.0,
          totalScore: 85.0,
          rank: "??",
          gradeLevel: "??"
        },
        {
          name: "사회",
          credits: 2,
          midterm: 75.8,
          final: 76.5,
          performance: 17.5,
          totalScore: 76.8,
          rank: "??",
          gradeLevel: "??"
        },
        {
          name: "음악",
          credits: 1,
          midterm: 95.0,
          final: 92.5,
          performance: 20.0,
          totalScore: 94.3,
          rank: "??",
          gradeLevel: "??"
        },
        {
          name: "미술",
          credits: 1,
          midterm: 88.0,
          final: 90.5,
          performance: 19.0,
          totalScore: 89.3,
          rank: "??",
          gradeLevel: "??"
        }
      ],
      totals: {
        totalCredits: 16,
        sumMidterm: 86.3,
        sumFinal: 84.2,
        sumPerformance: 18.4,
        sumTotalScore: 85.3
      },
      finalSummary: {
        totalStudents: 112,
        finalRank: "??",
        finalConvertedGrade: "??"
      },
      radarChart: {
        labels: ["국어", "수학", "영어", "과학", "사회", "음악", "미술"],
        data: [85.5, 88.9, 81.6, 85.0, 76.8, 94.3, 89.3]
      }
    };
  }
};

/**
 * Get grade management status for a class
 * @param {string} grade - The grade level
 * @param {string} classNum - The class number
 * @param {string} semester - The semester
 * @returns {Promise} - Promise with grade management status
 */
export const getGradeManagementStatus = async (grade, classNum, semester) => {
  try {
    const response = await apiClient.get('/grades/mangement-status', {
      params: { grade, classNumber: classNum, semester }
    });
    return response.data;
  } catch (error) {
    console.warn('API call failed, using dummy data:', error);
    
    // Return dummy data if API call fails
    return {
      semesterPeriod: {
        start: "2025-05-01",
        end: "2025-05-07"
      },
      students: [
        {
          id: 1,
          name: "홍길동1",
          studentId: "20250001",
          grade: "1",
          classNumber: "7",
          number: "1",
          profileImage: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
          gradeStatus: "미입력"
        },
        {
          id: 2,
          name: "홍길동2",
          studentId: "20250002",
          grade: "1",
          classNumber: "7",
          number: "2",
          profileImage: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
          gradeStatus: "입력완료"
        },
        {
          id: 3,
          name: "홍길동3",
          studentId: "20250003",
          grade: "1",
          classNumber: "7",
          number: "3",
          profileImage: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
          gradeStatus: "임시저장"
        }
      ]
    };
  }
};

/**
 * Get the current grade input period status
 * @returns {Promise<Object>} Grade input period information
 */
export const getGradeInputPeriod = async () => {
  try {
    const response = await apiClient.get('/grades/input-period');
    return response.data;
  } catch (error) {
    console.warn('API call failed, using dummy data:', error);
    // Return dummy period data
    return {
      isActive: true,
      start: '2025-05-01',
      end: '2025-05-15'
    };
  }
};

/**
 * Get grades for a specific student
 * @param {string} studentId - The student ID
 * @param {string} grade - The grade level
 * @param {string} semester - The semester
 * @returns {Promise<Object>} Student grade data
 */
export const getStudentGrades = async (studentId, grade, semester) => {
  try {
    const response = await apiClient.get(`/grades/students/${studentId}`, {
      params: { grade, semester }
    });
    return response.data;
  } catch (error) {
    console.warn('API call failed, using dummy data:', error);
    // Return empty grade data
    return {
      gradeStatus: '미입력',
      updatedAt: null,
      subjects: []
    };
  }
};

/**
 * Submit grades for a student
 * @param {string} studentId - The student ID
 * @param {Object} gradeData - The grade data to submit
 * @returns {Promise<Object>} Response from the server
 */
export const submitStudentGrades = async (studentId, gradeData) => {
  try {
    const response = await apiClient.post(`/grades/students/${studentId}`, gradeData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 403) {
        throw new Error('성적 입력 기간이 아닙니다.');
      } else if (error.response.status === 400) {
        throw new Error('성적 데이터 형식이 올바르지 않습니다.');
      } else if (error.response.status === 401) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
    }
    throw new Error('성적 제출 중 오류가 발생했습니다.');
  }
};

/**
 * Update grades for a student using PATCH method
 * @param {string} studentId - The student ID
 * @param {Object} gradeData - The grade data to update
 * @param {string} gradeData.grade - The grade level
 * @param {string} gradeData.semester - The semester
 * @param {string} gradeData.gradeStatus - The grade status (미입력, 임시저장, 입력완료)
 * @param {string} gradeData.updatedAt - The timestamp of the update
 * @param {Array} gradeData.subjects - The subjects with grades
 * @returns {Promise<Object>} Response from the server
 */
export const updateStudentGrades = async (studentId, gradeData) => {
  try {
    const response = await apiClient.patch(`/grades/students/${studentId}`, gradeData);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403) {
        throw new Error('성적 입력 기간이 아닙니다.');
      } else if (error.response.status === 400) {
        throw new Error('성적 데이터 형식이 올바르지 않습니다.');
      } else if (error.response.status === 401) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      } else if (error.response.status === 404) {
        throw new Error('해당 학생의 성적 정보를 찾을 수 없습니다.');
      }
    }
    throw new Error('성적 업데이트 중 오류가 발생했습니다.');
  }
};
