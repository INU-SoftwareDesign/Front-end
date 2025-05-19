import React, { useState, useEffect } from "react";
import styled from "styled-components";
import StudentFilterBar from "../../components/studentRecord/StudentFilterBar";
import StudentListHeader from "../../components/studentRecord/StudentListHeader";
import StudentListItem from "../../components/studentRecord/StudentListItem";
import useStudentStore from "../../store/useStudentStore";
import useUserStore from "../../stores/useUserStore";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoAccessMessage = styled.div`
  margin: 32px auto;
  padding: 24px;
  background-color: #f8f8f8;
  border-radius: 8px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 18px;
  color: #666;
  text-align: center;
`;

const LoadingMessage = styled.div`
  margin: 32px auto;
  padding: 24px;
  background-color: #f0f7ff;
  border-radius: 8px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 18px;
  color: #1D4EB0;
  text-align: center;
`;

const ErrorMessage = styled.div`
  margin: 32px auto;
  padding: 24px;
  background-color: #fff0f0;
  border-radius: 8px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 18px;
  color: #e74c3c;
  text-align: center;
`;

const NoDataMessage = styled.div`
  margin: 32px auto;
  padding: 24px;
  background-color: #f8f8f8;
  border-radius: 8px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 18px;
  color: #666;
  text-align: center;
`;

const StudentRecordPage = () => {
  // Get user from Zustand store
  const currentUser = useUserStore(state => state.currentUser);
  const userRole = currentUser?.role || 'teacher';
  
  // Continue using Zustand for student data
  const { 
    students, 
    isLoading, 
    error, 
    fetchStudents, 
    search, 
    selectedGrade, 
    selectedClassNumber,
    setGrade,
    setClass 
  } = useStudentStore();

  // Set initial filters based on teacher's class when component mounts
  useEffect(() => {
    if (currentUser && userRole === 'teacher') {
      // Set the grade and class filters based on the teacher's assigned class
      // API에서 반환하는 필드명(grade, classNumber) 사용
      if (currentUser.grade && currentUser.classNumber) {
        console.log('교사 정보 설정:', currentUser.grade, currentUser.classNumber);
        setGrade(String(currentUser.grade));
        setClass(String(currentUser.classNumber));
      } else if (currentUser.gradeLevel && currentUser.classNumber) {
        // 이전 필드명 호환성 유지
        console.log('교사 정보 설정(이전 필드명):', currentUser.gradeLevel, currentUser.classNumber);
        setGrade(String(currentUser.gradeLevel));
        setClass(String(currentUser.classNumber));
      }
    }
  }, [currentUser, userRole, setGrade, setClass]);
  
  // Fetch students when filters change
  useEffect(() => {
    const fetchData = async () => {
      await fetchStudents();
    };
    
    fetchData();
  }, [search, selectedGrade, selectedClassNumber, fetchStudents]);
  
  // Format grade and class for display
  const formatGrade = (grade) => `${grade}학년`;
  const formatClass = (classNum) => `${classNum}반`;

  // Function to determine if a user can access a student's details
  const canAccessStudent = (student) => {
    if (!currentUser) return false;
    
    if (userRole === 'admin') return true;
    
    if (userRole === 'teacher') {
      // Teachers can only access students in their homeroom class
      // API 응답 구조에 맞게 필드명 수정 (grade, classNumber)
      const teacherGrade = currentUser.grade || currentUser.gradeLevel;
      const teacherClass = currentUser.classNumber;
      
      // 타입 일치를 위해 문자열로 변환하여 비교
      return String(teacherGrade) === String(student.grade) && 
             String(teacherClass) === String(student.classNumber);
    }
    
    if (userRole === 'student') {
      // Students can only access their own information
      // studentId를 사용하여 비교 (예: '20250001')
      if (currentUser.studentId && student.studentId) {
        return currentUser.studentId === student.studentId;
      }
      
      // 또는 사용자 ID와 학생 ID가 일치하는지 확인
      if (currentUser.id && student.id) {
        // 문자열로 변환하여 비교
        return String(currentUser.id) === String(student.id);
      }
      
      return false;
    }
    
    if (userRole === 'parent') {
      // Parents can only access their children's information
      return currentUser.childrenIds && currentUser.childrenIds.includes(student.id);
    }
    
    return false;
  };

  return (
    <PageContainer>
      <StudentFilterBar
        userRole={userRole}
        userGrade={formatGrade(selectedGrade)}
        userClass={formatClass(selectedClassNumber)}
      />
      <StudentListHeader />
      {isLoading ? (
        <LoadingMessage>학생 정보를 불러오는 중입니다...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : students.length === 0 ? (
        <NoDataMessage>해당 조건의 학생 정보가 없습니다.</NoDataMessage>
      ) : (
        // 필터링된 학생들을 번호순으로 정렬하여 표시
        students
          .filter(student => 
            // 현재 선택된 학년과 반에 맞는 학생들만 필터링
            String(student.grade) === String(selectedGrade) && 
            String(student.classNumber) === String(selectedClassNumber)
          )
          .sort((a, b) => parseInt(a.number) - parseInt(b.number)) // 학생 번호 순으로 정렬
          .map((student, index) => (
            <StudentListItem 
              key={student.id} 
              student={student} 
              index={index} 
            />
          ))
      )}
    </PageContainer>
  );
};

export default StudentRecordPage;
