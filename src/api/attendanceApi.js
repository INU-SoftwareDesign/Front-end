import apiClient from './apiClient';

/**
 * Attendance API functions for managing student attendance records
 */

/**
 * Utility function to process student ID
 * @param {string} studentId - The raw student ID (e.g., '20250001')
 * @returns {string} - Processed student ID (e.g., '1')
 */
const processStudentId = (studentId) => {
  if (!studentId) return studentId;
  
  // 학생 ID에서 뒤의 숫자 4개를 추출
  let processedId = studentId;
  
  // 학생 ID가 최소 4자리 이상인 경우
  if (studentId.length >= 4) {
    processedId = studentId.slice(-4); // 뒤에서 4개의 문자만 추출
  }
  
  // 앞에 0이 붙어있으면 제거 (e.g., '0001' -> '1')
  processedId = processedId.replace(/^0+/, '');
  
  console.log(`원본 studentId: ${studentId}, 변환된 studentId: ${processedId}`);
  return processedId;
};

/**
 * Add a new attendance record for a student
 * @param {string} studentId - The student ID
 * @param {Object} attendanceData - The attendance data
 * @param {string} attendanceData.grade - The grade level
 * @param {number} attendanceData.year - The academic year
 * @param {string} attendanceData.attendanceType - The type of attendance (absence, tardy, earlyLeave, etc.)
 * @param {string} attendanceData.reasonType - The reason type (illness, family, etc.)
 * @param {string} attendanceData.date - The date of the attendance record (YYYY-MM-DD)
 * @param {string} attendanceData.reason - The detailed reason
 * @param {string} attendanceData.homeTeacher - The name of the home teacher
 * @returns {Promise<Object>} Response from the server
 */
export const addAttendanceRecord = async (studentId, attendanceData) => {
  try {
    // studentId 처리
    const processedId = processStudentId(studentId);
    console.log(`출결 데이터 추가 API 호출: 학생 ID ${processedId}`);
    
    const response = await apiClient.post(`/attendances/students/${processedId}`, attendanceData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 403) {
        throw new Error('담임 교사만 출결 내역을 추가할 수 있습니다.');
      } else if (error.response.status === 400) {
        throw new Error('입력 데이터가 올바르지 않습니다.');
      } else if (error.response.status === 401) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      } else if (error.response.status === 404) {
        throw new Error('해당 학생을 찾을 수 없습니다.');
      } else if (error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      }
    }
    
    // Network error or other issues
    console.error('Error adding attendance record:', error);
    throw new Error('출결 내역 추가 중 오류가 발생했습니다.');
  }
};

/**
 * Get attendance records for a student
 * @param {string} studentId - The student ID
 * @param {Object} params - Query parameters
 * @param {string} params.grade - The grade level (optional)
 * @param {number} params.year - The academic year (optional)
 * @returns {Promise<Object>} Student attendance data
 */
export const getAttendanceRecords = async (studentId, params = {}) => {
  try {
    // studentId 처리
    const processedId = processStudentId(studentId);
    console.log(`출결 데이터 조회 API 호출: 학생 ID ${processedId}`);
    
    const response = await apiClient.get(`/attendances/students/${processedId}`, { params });
    return response.data;
  } catch (error) {
    console.warn('API call failed, using dummy data:', error);
    
    // Return dummy data if API call fails
    return {
      studentId: studentId,
      studentName: "홍길동",
      attendance: [
        {
          grade: "1",
          year: 2023,
          homeTeacher: "teacher123",
          totalDays: 190,
          remarks: "개근",
          attendance: {
            absence: {
              illness: 2,
              unauthorized: 0,
              etc: 1
            },
            lateness: {
              illness: 1,
              unauthorized: 0,
              etc: 0
            },
            earlyLeave: {
              illness: 0,
              unauthorized: 0,
              etc: 1
            },
            result: {
              illness: 0,
              unauthorized: 0,
              etc: 0
            }
          },
          details: {
            absence: {
              illness: [
                {
                  date: "2023-04-10",
                  reason: "감기로 인한 결석"
                },
                {
                  date: "2023-05-22",
                  reason: "병원 진료"
                }
              ],
              etc: [
                {
                  date: "2023-06-15",
                  reason: "가족 행사"
                }
              ],
              unauthorized: []
            },
            lateness: {
              illness: [
                {
                  date: "2023-03-08",
                  reason: "병원 진료"
                }
              ],
              unauthorized: [],
              etc: []
            },
            earlyLeave: {
              etc: [
                {
                  date: "2023-05-05",
                  reason: "가족 행사"
                }
              ],
              illness: [],
              unauthorized: []
            },
            result: {
              illness: [],
              unauthorized: [],
              etc: []
            }
          }
        },
        {
          grade: "2",
          year: 2024,
          homeTeacher: "teacher456",
          totalDays: 195,
          remarks: "지각 1회",
          attendance: {
            absence: {
              illness: 1,
              unauthorized: 0,
              etc: 0
            },
            lateness: {
              illness: 0,
              unauthorized: 1,
              etc: 0
            },
            earlyLeave: {
              illness: 0,
              unauthorized: 0,
              etc: 0
            },
            result: {
              illness: 0,
              unauthorized: 0,
              etc: 0
            }
          },
          details: {
            absence: {
              illness: [
                {
                  date: "2024-09-15",
                  reason: "감기 증상"
                }
              ],
              unauthorized: [],
              etc: []
            },
            lateness: {
              unauthorized: [
                {
                  date: "2024-10-05",
                  reason: "교통 혼잡"
                }
              ],
              illness: [],
              etc: []
            },
            earlyLeave: {
              illness: [],
              unauthorized: [],
              etc: []
            },
            result: {
              illness: [],
              unauthorized: [],
              etc: []
            }
          }
        }
      ]
    };
  }
};
