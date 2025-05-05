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
  const currentUser = useUserStore(state => state.user);
  const userRole = useUserStore(state => state.getUserRole());
  const { 
    students, 
    isLoading, 
    error, 
    fetchStudents, 
    search, 
    selectedGrade, 
    selectedClass 
  } = useStudentStore();

  // Fetch students when filters change
  useEffect(() => {
    const fetchData = async () => {
      await fetchStudents();
    };
    
    fetchData();
  }, [search, selectedGrade, selectedClass, fetchStudents]);
  
  // Format grade and class for display
  const formatGrade = (grade) => `${grade}학년`;
  const formatClass = (classNum) => `${classNum}반`;

  // Function to determine if a user can access a student's details
  const canAccessStudent = (student) => {
    if (!currentUser) return false;
    
    if (userRole === 'admin') return true;
    
    if (userRole === 'teacher') {
      // Teachers can only access students in their homeroom class
      return currentUser.grade === student.grade && currentUser.class === student.class;
    }
    
    if (userRole === 'student') {
      // Students can only access their own information
      return currentUser.id === student.id;
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
        userClass={formatClass(selectedClass)}
      />
      <StudentListHeader />
      {isLoading ? (
        <LoadingMessage>학생 정보를 불러오는 중입니다...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : students.length === 0 ? (
        <NoDataMessage>해당 조건의 학생 정보가 없습니다.</NoDataMessage>
      ) : (
        students.map((student, index) => (
          <StudentListItem 
            key={student.id} 
            student={student} 
            index={index} 
            currentUser={currentUser}
            canAccess={canAccessStudent(student)}
          />
        ))
      )}
    </PageContainer>
  );
};

export default StudentRecordPage;
