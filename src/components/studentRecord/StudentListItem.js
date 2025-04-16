import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const StudentListItem = ({ student, index }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/student/${student.id}`);
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
      <InfoText>{student.class}</InfoText>
      <InfoText>{student.number}</InfoText>
      <InfoText>{student.lastCounselingDate}</InfoText>
    </ListItemContainer>
  );
};

export default StudentListItem;
