import React, { useState, useEffect } from "react";
import styled from "styled-components";
import StudentFilterBar from "../../components/studentRecord/StudentFilterBar";
import StudentListHeader from "../../components/studentRecord/StudentListHeader";
import StudentListItem from "../../components/studentRecord/StudentListItem";
import useStudentStore from "../../store/useStudentStore";
import useUserStore from "../../stores/useUserStore";
import * as studentApi from "../../api/studentApi";

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

const ChildInfoBanner = styled.div`
  margin: 0 0 16px 0;
  padding: 12px 16px;
  background-color: #e3f2fd;
  border-radius: 8px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 16px;
  color: #1976d2;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StudentRecordPage = () => {
  // Get user from Zustand store
  const currentUser = useUserStore(state => state.currentUser);
  const userRole = currentUser?.role || 'teacher';
  const updateUserInfo = useUserStore(state => state.updateUserInfo);
  
  // State for parent's child information
  const [childInfo, setChildInfo] = useState(null);
  
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
    } else if (currentUser && userRole === 'parent' && childInfo) {
      // 학부모인 경우 자녀의 학년과 반으로 필터 설정
      console.log('학부모 자녀 정보 설정:', childInfo.grade, childInfo.classNumber);
      setGrade(String(childInfo.grade));
      setClass(String(childInfo.classNumber));
    }
  }, [currentUser, userRole, childInfo, setGrade, setClass]);
  
  // 학부모인 경우 자녀 정보 가져오기
  useEffect(() => {
    const fetchChildInfo = async () => {
      if (currentUser && currentUser.role === 'parent') {
        // 학부모 계정에 연결된 자녀 ID 목록
        let childrenIds = currentUser.childrenIds || [];
        
        // childrenIds가 없고 childStudentId가 있는 경우
        if (childrenIds.length === 0 && currentUser.childStudentId) {
          const studentId = currentUser.childStudentId;
          const lastDigits = studentId.slice(-4).replace(/^0+/, '');
          childrenIds = [studentId, lastDigits];
          
          // 사용자 스토어 업데이트
          updateUserInfo({
            childrenIds: childrenIds
          });
          
          console.log('자녀 ID 목록 생성 (StudentRecordPage):', childrenIds);
        }
        
        // 자녀 ID가 없는 경우 (개발 환경에서 테스트용)
        if (childrenIds.length === 0 && process.env.NODE_ENV === 'development') {
          console.log('%c[StudentRecordPage] 개발 환경 - 더미 자녀 정보 사용', 'color: #e67e22; font-weight: bold;');
          setChildInfo({
            id: '20250001',
            name: '홍길동',
            grade: '2',
            classNumber: '1',
            number: '1'
          });
          return;
        }
        
        // 자녀 ID가 있는 경우 학생 정보 조회
        if (childrenIds.length > 0) {
          try {
            // 첫 번째 자녀 ID로 학생 정보 조회
            const studentData = await studentApi.getStudentById(childrenIds[0]);
            console.log('%c[StudentRecordPage] 자녀 정보 조회 성공:', 'color: #2ecc71; font-weight: bold;', studentData);
            setChildInfo(studentData);
          } catch (error) {
            console.error('%c[StudentRecordPage] 자녀 정보 조회 실패:', 'color: #e74c3c; font-weight: bold;', error);
            // 에러 발생 시 더미 데이터 사용
            setChildInfo({
              id: '20250001',
              name: '홍길동',
              grade: '2',
              classNumber: '1',
              number: '1'
            });
          }
        }
      }
    };
    
    fetchChildInfo();
  }, [currentUser, updateUserInfo]);
  
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
      // 1. Check if student.id is in childrenIds array
      if (currentUser.childrenIds && currentUser.childrenIds.includes(student.id)) {
        return true;
      }
      
      // 2. Check if childStudentId matches student.id or student.studentId
      if (currentUser.childStudentId && 
          (String(currentUser.childStudentId) === String(student.id) || 
           String(currentUser.childStudentId) === String(student.studentId))) {
        return true;
      }
      
      // 3. 자녀 정보가 있는 경우 해당 자녀의 정보만 접근 가능
      if (childInfo) {
        // ID 비교
        if (String(childInfo.id) === String(student.id) || 
            String(childInfo.studentId) === String(student.studentId)) {
          return true;
        }
        
        // 학년, 반, 번호 비교
        if (String(childInfo.grade) === String(student.grade) && 
            String(childInfo.classNumber) === String(student.classNumber) && 
            String(childInfo.number) === String(student.number)) {
          return true;
        }
      }
      
      return false;
    }
    
    return false;
  };

  return (
    <PageContainer>
      {currentUser && currentUser.role === 'parent' && childInfo && (
        <ChildInfoBanner>
          자녀 정보: {childInfo.name} ({childInfo.grade}학년 {childInfo.classNumber}반 {childInfo.number}번)
        </ChildInfoBanner>
      )}
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
              canAccess={canAccessStudent(student)}
            />
          ))
      )}
    </PageContainer>
  );
};

export default StudentRecordPage;
