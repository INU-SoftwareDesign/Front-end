import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AccessDeniedModal from '../common/AccessDeniedModal';

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

const StudentListItem = ({ student, index, currentUser, canAccess }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (canAccess) {
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
      return `${student.grade}학년 ${student.class}반의 담임 교사만 학생 상세 정보에 접근할 수 있습니다.`;
    } else if (currentUser.role === 'student') {
      return '본인의 정보만 접근할 수 있습니다.';
    } else if (currentUser.role === 'parent') {
      return '자녀의 정보만 접근할 수 있습니다.';
    }
    
    return '접근 권한이 없습니다.';
  };

  return (
    <>
      <ListItemContainer onClick={handleClick} disabled={!canAccess}>
        <SerialNumber>{index + 1}.</SerialNumber>
        <NameContainer>
          <ProfileImage src={student.profileImage} />
          <NameInfo>
            <Name>{student.name}</Name>
            <StudentId>{student.studentId}</StudentId>
          </NameInfo>
        </NameContainer>
        <InfoText>{student.grade}</InfoText>
        <InfoText>{student.class}</InfoText>
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
