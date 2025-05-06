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
