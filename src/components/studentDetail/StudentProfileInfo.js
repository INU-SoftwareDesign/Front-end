import React from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 16px;
`;

const ProfileImage = styled.div`
  width: 49px;
  height: 49px;
  border-radius: 50%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.div`
  font-family: 'Pretendard-SemiBold', sans-serif;
  font-size: 20px;
`;

const StudentId = styled.div`
  font-family: 'Pretendard-SemiBold', sans-serif;
  font-size: 13px;
  color: #B1B1B1;
  margin-bottom: 4px;
`;

const ClassInfo = styled.div`
  font-family: 'Pretendard-SemiBold', sans-serif;
  font-size: 16px;
  color: #333;
`;

const StudentProfileInfo = ({ student }) => {
  if (!student) return null;
  
  return (
    <ProfileContainer>
      <ProfileImage src={student.profileImage} />
      <InfoContainer>
        <Name>{student.name}</Name>
        <StudentId>{student.studentId}</StudentId>
        <ClassInfo>{student.grade}학년 {student.classNumber}반 {student.number}번</ClassInfo>
      </InfoContainer>
    </ProfileContainer>
  );
};

export default StudentProfileInfo;
