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
 * @returns {Promise} - Promise with students list
 */
export const getStudents = async (params = {}) => {
  try {
    const response = await apiClient.get('/students', { params });
    return response.data;
  } catch (error) {
    console.warn('API call failed, using dummy data:', error);
    
    // Filter dummy data based on params
    let filteredData = [...dummyStudentData];
    
    if (params.grade) {
      filteredData = filteredData.filter(student => student.grade === params.grade);
    }
    
    if (params.classNumber) {
      filteredData = filteredData.filter(student => student.classNumber === params.classNumber);
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
    const response = await apiClient.get(`/students/${studentId}`);
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
    
    const response = await apiClient.patch(`/students/${studentNumber}`, studentData);
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
