import apiClient from './apiClient';

/**
 * Grade API functions for managing student grades
 */

/**
 * Utility function to process student ID
 * @param {string} studentId - The raw student ID (e.g., '20250001')
 * @returns {string} - Processed student ID (e.g., '1')
 */
const processStudentId = (studentId) => {
  if (!studentId) return studentId;
  
  // studentId가 문자열이 아닌 경우 문자열로 변환
  const studentIdStr = String(studentId);
  
  // 학생 ID에서 뒤의 숫자 4개를 추출
  let processedId = studentIdStr;
  
  // 학생 ID가 최소 4자리 이상인 경우
  if (studentIdStr.length >= 4) {
    processedId = studentIdStr.slice(-4); // 뒤에서 4개의 문자만 추출
  }
  
  // 앞에 0이 붙어있으면 제거 (e.g., '0001' -> '1')
  processedId = processedId.replace(/^0+/, '');
  
  console.log(`원본 studentId: ${studentIdStr}, 변환된 studentId: ${processedId}`);
  return processedId;
};

/**
 * Get student grade overview
 * @param {string} studentId - The student ID (e.g., '20250001')
 * @param {string} grade - The grade level
 * @param {string} semester - The semester
 * @returns {Promise} - Promise with student grade overview
 */
export const getStudentGradeOverview = async (studentId, grade, semester) => {
  try {
    // 학생 ID 처리
    const processedId = processStudentId(studentId);
    
    const response = await apiClient.get(`/grades/students/${processedId}/overview`, {
      params: { grade, semester }
    });
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error; // 에러를 그대로 던져서 호출한 쪽에서 처리하도록 함
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
    const response = await apiClient.get('/grades/management-status', {
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
    
    // API에서 반환하는 형식이 {semesterPeriod: {start, end}} 형태이므로 처리
    if (response.data && response.data.semesterPeriod) {
      const { start, end } = response.data.semesterPeriod;
      
      // 현재 날짜가 기간 내에 있는지 확인
      const now = new Date();
      const startDate = new Date(start);
      const endDate = new Date(end);
      const isActive = now >= startDate && now <= endDate;
      
      return {
        isActive,
        start,
        end
      };
    }
    
    return response.data;
  } catch (error) {
    console.warn('API call failed, using dummy data:', error);
    // Return dummy period data with current date check
    const now = new Date();
    const startDate = new Date('2025-05-01');
    const endDate = new Date('2025-06-16');
    const isActive = now >= startDate && now <= endDate;
    
    return {
      isActive,
      start: '2025-05-01',
      end: '2025-06-16'
    };
  }
};

/**
 * Get grades for a specific student
 * @param {string} studentId - The student ID (e.g., '20250001')
 * @param {string} grade - The grade level
 * @param {string} semester - The semester
 * @param {Object} gradeData - The grade data to submit
 * @returns {Promise<Object>} Student grade data
 */
export const getStudentGrades = async (studentId, grade, semester, gradeData = null) => {
  try {
    // 학생 ID 처리
    const processedId = processStudentId(studentId);
    
    // POST 요청으로 변경하고 요청 본문 추가
    const requestBody = gradeData || {
      grade,
      semester,
      gradeStatus: '미입력',
      updatedAt: new Date().toISOString(),
      subjects: []
    };
    
    const response = await apiClient.post(`/grades/students/${processedId}`, requestBody);
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
 * @param {string} studentId - The student ID (e.g., '20250001')
 * @param {Object} gradeData - The grade data to submit
 * @returns {Promise<Object>} Response from the server
 */
export const submitStudentGrades = async (studentId, gradeData) => {
  try {
    // 학생 ID 처리
    const processedId = processStudentId(studentId);
    
    const response = await apiClient.post(`/grades/students/${processedId}`, gradeData);
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
 * @param {string} studentId - The student ID (e.g., '20250001')
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
    // 학생 ID 처리
    const processedId = processStudentId(studentId);
    
    const response = await apiClient.patch(`/grades/students/${processedId}`, gradeData);
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
