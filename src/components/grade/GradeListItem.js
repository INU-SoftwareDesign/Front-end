import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { gradeInputPeriod } from '../../data/dummyGradeData';

const ListItemContainer = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 2fr 0.8fr 0.8fr 0.8fr 1.5fr;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  &:hover {
    background-color: #f9f9f9;
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

const GradeStatusContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GradeStatus = styled.div`
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 16px;
  background-color: ${props => {
    switch(props.status) {
      case '미입력': return '#9e9e9e';
      case '임시저장': return '#7b1fa2';
      case '입력완료': return '#2e7d32';
      default: return '#9e9e9e';
    }
  }};
`;

const GradeListItem = ({ student, index }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Only navigate if the grade input period is active
    if (gradeInputPeriod.isActive) {
      navigate(`/grades/edit/${student.id}`);
    } else {
      alert('성적 입력 기간이 아닙니다.');
    }
  };

  return (
    <ListItemContainer onClick={handleClick}>
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
      <GradeStatusContainer>
        <GradeStatus status={student.gradeStatus}>
          {student.gradeStatus}
        </GradeStatus>
      </GradeStatusContainer>
    </ListItemContainer>
  );
};

export default GradeListItem;
