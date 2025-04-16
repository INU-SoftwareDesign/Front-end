import React from "react";
import styled from "styled-components";
import dummyPersonalInfo from "../../../data/dummyPersonalInfoData";

const TabContainer = styled.div`
  display: flex;
  gap: 32px;
`;

const LeftSection = styled.div`
  width: 240px;
`;

const RightSection = styled.div`
  flex: 1;
`;

const ProfileImageContainer = styled.div`
  width: 240px;
  height: 280px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ChangeImageButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #1d4eb0;
  color: white;
  border: none;
  border-radius: 4px;
  font-family: "Pretendard-Medium", sans-serif;
  cursor: pointer;

  &:hover {
    background-color: #1a44a3;
  }
`;

const InfoSection = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 18px;
  color: #1d4eb0;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ddd;
`;

const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px;
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 14px;
  color: #555;
  width: 120px;
  vertical-align: top;
`;

const TableData = styled.td`
  padding: 12px;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 14px;
  color: #333;
`;

const AcademicHistoryItem = styled.div`
  margin-bottom: 8px;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 14px;
  color: #333;
`;

const PersonalInfoTab = ({ student, currentUser }) => {
  if (!student) return null;

  const personalInfo = {
    ...dummyPersonalInfo,
    name: student.name,
    grade: student.grade,
    class: student.class,
    number: student.number,
  };

  // Check if the current user is a teacher or the student themselves
  const canEditProfile =
    currentUser.role === "teacher" || currentUser.id === student.studentId;

  return (
    <TabContainer>
      <LeftSection>
        <ProfileImageContainer>
          <ProfileImage src={student.profileImage} alt={student.name} />
        </ProfileImageContainer>
        {canEditProfile && <ChangeImageButton>이미지 변경</ChangeImageButton>}
      </LeftSection>

      <RightSection>
        <InfoSection>
          <SectionTitle>인적사항</SectionTitle>
          <InfoTable>
            <tbody>
              <TableRow>
                <TableHeader>이름</TableHeader>
                <TableData>{personalInfo.name}</TableData>
              </TableRow>
              <TableRow>
                <TableHeader>학년/반/번호</TableHeader>
                <TableData>
                  {personalInfo.grade}학년 {personalInfo.class}반{" "}
                  {personalInfo.number}번
                </TableData>
              </TableRow>
              <TableRow>
                <TableHeader>생년월일</TableHeader>
                <TableData>{personalInfo.birthdate}</TableData>
              </TableRow>
              <TableRow>
                <TableHeader>주소</TableHeader>
                <TableData>{personalInfo.address}</TableData>
              </TableRow>
              <TableRow>
                <TableHeader>부</TableHeader>
                <TableData>{personalInfo.father}</TableData>
              </TableRow>
              <TableRow>
                <TableHeader>모</TableHeader>
                <TableData>{personalInfo.mother}</TableData>
              </TableRow>
            </tbody>
          </InfoTable>
        </InfoSection>

        <InfoSection>
          <SectionTitle>과거 반 이력</SectionTitle>
          <InfoTable>
            <tbody>
              {personalInfo.classHistory.map((history, index) => (
                <TableRow key={index}>
                  <TableHeader>{history.year}학년</TableHeader>
                  <TableData>
                    {history.class}반 {history.number}번 (담임:{" "}
                    {history.teacher})
                  </TableData>
                </TableRow>
              ))}
            </tbody>
          </InfoTable>
        </InfoSection>

        <InfoSection>
          <SectionTitle>학적사항</SectionTitle>
          {personalInfo.academicHistory.map((item, index) => (
            <AcademicHistoryItem key={index}>• {item}</AcademicHistoryItem>
          ))}
        </InfoSection>
      </RightSection>
    </TabContainer>
  );
};

export default PersonalInfoTab;
