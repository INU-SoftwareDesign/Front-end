import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AccessDeniedModal from '../common/AccessDeniedModal';
import useUserStore from '../../stores/useUserStore';

const ListItemContainer = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 2fr 0.8fr 0.8fr 0.8fr 1.5fr;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  opacity: ${props => props.disabled ? 0.7 : 1};
  &:hover {
    background-color: ${props => props.disabled ? 'transparent' : '#f9f9f9'};
  }
`;

const SerialNumber = styled.div`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 20px;
  text-align: center;
`;

const NameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProfileImage = styled.div`
  width: 49px;
  height: 49px;
  border-radius: 50%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const NameInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Name = styled.div`
  font-family: 'Pretendard-SemiBold', sans-serif;
  font-size: 20px;
`;

const StudentId = styled.div`
  font-family: 'Pretendard-SemiBold', sans-serif;
  font-size: 13px;
  color: #B1B1B1;
`;

const InfoText = styled.div`
  font-family: 'Pretendard-SemiBold', sans-serif;
  font-size: 20px;
  text-align: center;
`;

const StudentListItem = ({ student, index, canAccess: propCanAccess }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  // Get user from Zustand store
  const currentUser = useUserStore(state => state.currentUser);
  
  // Determine if the user can access this student's details
  const canAccess = () => {
    if (!currentUser) return false;
    
    if (currentUser.role === 'admin') return true;
    
    if (currentUser.role === 'teacher') {
      // Teachers can only access students in their homeroom class
      // API 응답 구조에 맞게 필드명 수정 (grade, classNumber)
      const teacherGrade = currentUser.grade || currentUser.gradeLevel;
      const teacherClass = currentUser.classNumber;
      
      // 타입 일치를 위해 문자열로 변환하여 비교
      return String(teacherGrade) === String(student.grade) && 
             String(teacherClass) === String(student.classNumber);
    }
    
    if (currentUser.role === 'student') {
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
      
      // 학생 번호로 비교
      if (currentUser.number && student.number) {
        return String(currentUser.number) === String(student.number) &&
               String(currentUser.grade) === String(student.grade) &&
               String(currentUser.classNumber) === String(student.classNumber);
      }
      
      return false;
    }
    
    if (currentUser.role === 'parent') {
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
      
      // 3. Check if the student number, grade and class match with what we expect for the parent's child
      if (currentUser.childGrade && currentUser.childClassNumber && currentUser.childNumber) {
        if (String(currentUser.childGrade) === String(student.grade) &&
            String(currentUser.childClassNumber) === String(student.classNumber) &&
            String(currentUser.childNumber) === String(student.number)) {
          return true;
        }
      }
      
      return false;
    }
    
    return false;
  };

  const handleClick = () => {
    if (canAccess() || propCanAccess) {
      navigate(`/student/${student.id}`);
    } else {
      // Show access denied modal
      setShowModal(true);
    }
  };
  
  // Generate appropriate access denied message based on user role
  const getAccessDeniedMessage = () => {
    if (!currentUser) return '로그인이 필요합니다.';
    
    if (currentUser.role === 'teacher') {
      return `${student.grade}학년 ${student.classNumber}반의 담임 교사만 학생 상세 정보에 접근할 수 있습니다.`;
    } else if (currentUser.role === 'student') {
      return '본인의 정보만 접근할 수 있습니다.';
    } else if (currentUser.role === 'parent') {
      return '자녀의 정보만 접근할 수 있습니다.';
    }
    
    return '접근 권한이 없습니다.';
  };

  return (
    <>
      <ListItemContainer onClick={handleClick} disabled={!(canAccess() || propCanAccess)}>
        <SerialNumber>{index + 1}.</SerialNumber>
        <NameContainer>
          <ProfileImage src={student.profileImage} />
          <NameInfo>
            <Name>{student.name}</Name>
            <StudentId>{student.studentId}</StudentId>
          </NameInfo>
        </NameContainer>
        <InfoText>{student.grade}</InfoText>
        <InfoText>{student.classNumber}</InfoText>
        <InfoText>{student.number}</InfoText>
        <InfoText>{student.lastCounselingDate || student.recentCounselingDate}</InfoText>
      </ListItemContainer>
      
      {showModal && (
        <AccessDeniedModal 
          message={getAccessDeniedMessage()} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
};

export default StudentListItem;
