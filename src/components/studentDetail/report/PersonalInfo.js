import React from 'react';
import styled from 'styled-components';

const PersonalInfo = ({ data }) => {
  if (!data) return null;

  const info = data;

  return (
    <Section>
      <Title>학생 인적사항</Title>
      <InfoGrid>
        <tbody>
          <InfoRow>
            <Label>이름</Label>
            <Value>{info.name}</Value>
            <Label>학번</Label>
            <Value>{info.studentId}</Value>
          </InfoRow>
          <InfoRow>
            <Label>학년/반/번호</Label>
            <Value>{info.grade}학년 {info.classNumber}반 {info.number}번</Value>
            <Label>생년월일</Label>
            <Value>{info.birthDate}</Value>
          </InfoRow>
          <InfoRow>
            <Label>주소</Label>
            <Value colSpan="3">{info.address}</Value>
          </InfoRow>
          <InfoRow>
            <Label>보호자</Label>
            <Value>부: {info.fatherName}</Value>
            <Label>보호자</Label>
            <Value>모: {info.motherName}</Value>
          </InfoRow>
        </tbody>
      </InfoGrid>

      <SubTitle>학적 이력</SubTitle>
      <TableContainer>
        <HistoryTable>
          <thead>
            <tr>
              <TableHeader width="15%">학년</TableHeader>
              <TableHeader width="15%">반</TableHeader>
              <TableHeader width="15%">번호</TableHeader>
              <TableHeader width="55%">담임교사</TableHeader>
            </tr>
          </thead>
          <tbody>
            {info.history?.map((record, index) => (
              <tr key={index}>
                <TableCell>{record.grade}학년</TableCell>
                <TableCell>{record.classNumber}반</TableCell>
                <TableCell>{record.number}번</TableCell>
                <TableCell>{record.homeroomTeacher}</TableCell>
              </tr>
            ))}  
          </tbody>
        </HistoryTable>
      </TableContainer>

      <SubTitle>학적 기록</SubTitle>
      <RecordsList>
        {info.academicRecords?.map((record, index) => (
          <RecordItem key={index}>{record}</RecordItem>
        ))}  
      </RecordsList>
    </Section>
  );
};

const Section = styled.section`
  margin-bottom: 40px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  page-break-inside: avoid;
`;

const InfoGrid = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  th, td {
    border: 1px solid #e0e0e0;
    padding: 12px;
  }
`;

const InfoRow = styled.tr`
  &:nth-child(even) {
    background-color: #fafafa;
  }
`;

const Label = styled.th`
  width: 120px;
  background-color: #f5f5f5;
  font-weight: 600;
  color: #1a237e;
  text-align: left;
`;

const Title = styled.h2`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 22px;
  color: #1a237e;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1a237e;
`;

const SubTitle = styled.h3`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 18px;
  color: #1a237e;
  margin: 30px 0 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #1a237e;
`;

const Value = styled.td`
  color: #333;
  font-weight: 400;
  ${props => props.colSpan && `colspan: ${props.colSpan};`}
`;

const TableContainer = styled.div`
  margin-bottom: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  th, td {
    padding: 12px 16px;
    border: none;
    border-bottom: 1px solid #e0e0e0;
  }
  tr:last-child td {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  background-color: #f5f5f5;
  font-weight: 600;
  color: #1a237e;
  text-align: left;
  white-space: nowrap;
  width: ${props => props.width || 'auto'};
`;

const TableCell = styled.td`
  color: #333;
  font-weight: 400;
`;

const RecordsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

const RecordItem = styled.li`
  padding: 12px 16px;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  line-height: 1.5;
  &:last-child {
    border-bottom: none;
  }
  &:nth-child(even) {
    background-color: #fafafa;
  }
`;

export default PersonalInfo;
