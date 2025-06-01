import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useReportStore } from '../../../stores/useReportStore';
import { getStudentById } from '../../../api/studentApi';
import { useParams } from 'react-router-dom';

const PersonalInfo = () => {
  const { studentId } = useParams();
  const { reportData, setReportData, setError } = useReportStore();

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const data = await getStudentById(studentId);
        setReportData({ personalInfo: data });
      } catch (error) {
        console.error('Failed to fetch personal info:', error);
        setError('개인정보를 불러오는데 실패했습니다.');
        // Fallback to dummy data
        setReportData({
          personalInfo: {
            name: '홍길동',
            studentNumber: '20230001',
            grade: 1,
            class: 3,
            number: 15,
            birthDate: '2008-05-15',
            gender: '남',
            address: '서울특별시 강남구 테헤란로 123',
            phoneNumber: '010-1234-5678',
            parentName: '홍부모',
            parentPhone: '010-9876-5432',
          }
        });
      }
    };

    if (!reportData.personalInfo) {
      fetchPersonalInfo();
    }
  }, [studentId, reportData.personalInfo, setReportData, setError]);

  if (!reportData.personalInfo) return null;

  const info = reportData.personalInfo;

  return (
    <Section>
      <Title>학생 인적사항</Title>
      <InfoGrid>
        <InfoRow>
          <Label>이름</Label>
          <Value>{info.name}</Value>
          <Label>학번</Label>
          <Value>{info.studentNumber}</Value>
        </InfoRow>
        <InfoRow>
          <Label>학년/반/번호</Label>
          <Value>{info.grade}학년 {info.class}반 {info.number}번</Value>
          <Label>생년월일</Label>
          <Value>{info.birthDate}</Value>
        </InfoRow>
        <InfoRow>
          <Label>성별</Label>
          <Value>{info.gender}</Value>
          <Label>연락처</Label>
          <Value>{info.phoneNumber}</Value>
        </InfoRow>
        <InfoRow>
          <Label>주소</Label>
          <Value colSpan={3}>{info.address}</Value>
        </InfoRow>
        <InfoRow>
          <Label>보호자 성명</Label>
          <Value>{info.parentName}</Value>
          <Label>보호자 연락처</Label>
          <Value>{info.parentPhone}</Value>
        </InfoRow>
      </InfoGrid>
    </Section>
  );
};

const Section = styled.section`
  margin-bottom: 30px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.div`
  padding: 10px;
  background-color: #f8f9fa;
  font-weight: 500;
  border-right: 1px solid #ddd;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
\`;

const InfoGrid = styled.div\`
  border: 1px solid #ddd;
  border-radius: 4px;
\`;

const InfoRow = styled.div\`
  display: grid;
  grid-template-columns: 100px 1fr 100px 1fr;
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: none;
  }
\`;

const Label = styled.div\`
  padding: 10px;
  background-color: #f8f9fa;
  font-weight: 500;
  border-right: 1px solid #ddd;
`;

const Value = styled.div`
  padding: 10px;
  grid-column: ${props => props.colSpan ? 'span ' + props.colSpan : 'span 1'};
`;

export default PersonalInfo;
