import apiClient from './apiClient';
import dummyStudentData from '../data/dummyStudentData';
import dummyPersonalInfoData from '../data/dummyPersonalInfoData';

/**
 * Student API functions for retrieving student data
 */

/**
 * Get students list with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @param {string} params.grade - Filter by grade
 * @param {string} params.classNumber - Filter by class number
 * @param {string} params.search - Search by student name
 * @param {Object} options - Additional options for the request
 * @param {AbortSignal} options.signal - AbortSignal for request cancellation
 * @returns {Promise} - Promise with students list
 */
export const getStudents = async (params = {}, options = {}) => {
  try {
    // options 객체에서 signal을 추출하여 요청에 포함
    const { signal } = options;
    const response = await apiClient.get('/students', { 
      params,
      signal // AbortController의 signal을 전달
    });
    return response.data;
  } catch (error) {
    // 요청이 취소된 경우 (AbortError) 오류를 그대로 전파
    if (error.name === 'AbortError' || error.name === 'CanceledError') {
      throw error;
    }
    
    console.warn('API call failed, using dummy data:', error);
    
    // Filter dummy data based on params
    let filteredData = [...dummyStudentData];
    
    if (params.grade) {
      // 문자열과 숫자 비교를 위해 문자열로 변환하여 비교
      const gradeStr = String(params.grade);
      filteredData = filteredData.filter(student => String(student.grade) === gradeStr);
      console.log(`학년 필터링: ${gradeStr}, 결과 수: ${filteredData.length}`);
    }
    
    if (params.classNumber) {
      // 문자열과 숫자 비교를 위해 문자열로 변환하여 비교
      const classStr = String(params.classNumber);
      filteredData = filteredData.filter(student => String(student.classNumber) === classStr);
      console.log(`반 필터링: ${classStr}, 결과 수: ${filteredData.length}`);
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredData = filteredData.filter(student => 
        student.name.toLowerCase().includes(searchLower)
      );
    }
    
    return filteredData;
  }
};

/**
 * Get student details by ID
 * @param {string} studentId - Student ID
 * @returns {Promise} - Promise with student details
 */
export const getStudentById = async (studentId) => {
  try {
    // 학생 ID에서 학생 번호만 추출 - updateStudentInfo와 동일한 방식 사용
    const studentNumber = extractStudentNumber(studentId);
    
    console.log('===== 학생 정보 조회 요청 =====');
    console.log(`학생 ID: ${studentId}, 추출된 학생 번호: ${studentNumber}`);
    console.log('요청 URL:', `/students/${studentNumber}`);
    
    // 학생 번호를 사용하여 API 호출
    const response = await apiClient.get(`/students/${studentNumber}`);
    
    console.log('===== 학생 정보 응답 데이터 =====');
    console.log('응답 상태 코드:', response.status);
    console.log('응답 데이터 전체:', JSON.stringify(response.data, null, 2));
    
    // 중요 필드만 분리하여 출력
    if (response.data) {
      console.log('===== 학생 정보 주요 필드 =====');
      const { studentId, name, grade, classNumber, number, gender, birthdate, address, contact, parentContact, profileImage } = response.data;
      console.log('학생 ID:', studentId);
      console.log('이름:', name);
      console.log('학년:', grade);
      console.log('반:', classNumber);
      console.log('번호:', number);
      console.log('성별:', gender);
      console.log('생년월일:', birthdate);
      console.log('주소:', address);
      console.log('연락처:', contact);
      console.log('보호자 연락처:', parentContact);
      console.log('프로필 이미지:', profileImage);
    }
    
    return response.data;
  } catch (error) {
    console.warn('API call failed, using dummy data:', error);
    
    // Find student in dummy data
    const student = dummyStudentData.find(s => s.id === parseInt(studentId));
    
    if (!student) {
      throw new Error('학생 정보를 찾을 수 없습니다.');
    }
    
    // Combine student data with personal info data
    const personalInfo = dummyPersonalInfoData;
    
    // Create a detailed student object that matches the API response format
    return {
      id: studentId, // 중요: id 속성 추가 - ScoreTab에서 필요
      profileImage: student.profileImage,
      name: student.name,
      studentId: student.studentId,
      grade: student.grade,
      classNumber: student.classNumber,
      number: student.number,
      birthDate: personalInfo.birthdate,
      address: personalInfo.address,
      fatherName: personalInfo.father,
      motherName: personalInfo.mother,
      history: personalInfo.classHistory.map(h => ({
        grade: h.year,
        classNumber: h.classNumber,
        number: h.number,
        homeroomTeacher: h.teacher
      })),
      academicRecords: personalInfo.academicHistory
    };
  }
};

/**
 * Extract student number from student ID
 * @param {string} studentId - Full student ID (e.g., 20250100)
 * @returns {string} - Extracted student number (e.g., 100)
 */
const extractStudentNumber = (studentId) => {
  // 학생 ID에서 뒤의 4자리를 추출하고 앞의 0을 제거
  if (!studentId) return '';
  
  // 뒤의 4자리 추출
  const last4Digits = studentId.slice(-4);
  
  // 앞의 0 제거 (예: '0100' -> '100')
  return parseInt(last4Digits, 10).toString();
};

/**
 * Update student information
 * @param {string} studentId - Student ID
 * @param {Object} studentData - Updated student data
 * @returns {Promise} - Promise with success message
 */
export const updateStudentInfo = async (studentId, studentData) => {
  try {
    // 학생 ID에서 학생 번호만 추출
    const studentNumber = extractStudentNumber(studentId);
    
    // classroom 필드 제거 (구조 분해 할당 사용)
    const { classroom, ...dataToSend } = studentData;
    
    // 요청 본문(request body) 내용을 콘솔에 상세히 출력
    console.log('===== 학생 정보 업데이트 요청 내용 =====');
    console.log(`학생 ID: ${studentId}, 추출된 학생 번호: ${studentNumber}`);
    console.log('요청 URL:', `/students/${studentNumber}`);
    console.log('classroom 필드 제외됨');
    console.log('요청 본문(Request Body):', JSON.stringify(dataToSend, null, 2));
    
    // 개발자가 요청 본문의 각 필드를 쉽게 확인할 수 있도록 개별 필드 출력
    console.log('요청 본문 개별 필드:');
    Object.entries(dataToSend).forEach(([key, value]) => {
      console.log(`- ${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`);
    });
    
    const response = await apiClient.patch(`/students/${studentNumber}`, dataToSend);
    
    // 응답 데이터 출력
    console.log('===== 학생 정보 업데이트 응답 =====');
    console.log('응답 데이터:', response.data);
    console.log('응답 상태 코드:', response.status);
    
    return response.data;
  } catch (error) {
    console.warn('API call failed:', error);
    
    // For development/testing, simulate a successful response
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Simulating successful student update');
      return {
        message: "Student information updated successfully"
      };
    }
    
    // If not in development or the error is a 403, throw the error
    if (error.response && error.response.status === 403) {
      throw new Error('권한이 없습니다. 담임 교사만 학생 정보를 수정할 수 있습니다.');
    }
    
    throw new Error('학생 정보 업데이트에 실패했습니다.');
  }
};
