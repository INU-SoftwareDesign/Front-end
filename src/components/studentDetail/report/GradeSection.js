import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useReportStore } from '../../../stores/useReportStore';
import { getStudentGradeOverview } from '../../../api/gradeApi';
const GradeSection = ({ studentId }) => {
  const { reportData, setReportData, setError } = useReportStore();
  const [gradeData, setGradeData] = useState([]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        // 현재 학년과 학기 정보를 가져옴
        const currentGrade = reportData?.personalInfo?.grade || '1';
        const currentSemester = new Date().getMonth() >= 7 ? '2' : '1';

        // 모든 학년과 학기의 데이터를 가져옴
        const gradePromises = [];
        for (let grade = 1; grade <= currentGrade; grade++) {
          for (let semester = 1; semester <= (grade === Number(currentGrade) ? currentSemester : 2); semester++) {
            gradePromises.push(
              getStudentGradeOverview(studentId, String(grade), String(semester))
                .then(data => ({ ...data, grade: String(grade), semester: String(semester) }))
                .catch(() => null)
            );
          }
        }

        const results = await Promise.all(gradePromises);
        const validResults = results.filter(result => result !== null);
        setGradeData(validResults);
        setReportData(prev => ({ ...prev, grades: validResults }));
      } catch (error) {
        console.error('Failed to fetch grades:', error);
        setError('성적 정보를 불러오는데 실패했습니다.');
      }
    };

    if (studentId) {
      fetchGrades();
    }
  }, [studentId, setReportData, setError, reportData?.personalInfo?.grade]);

  if (!gradeData.length) {
    return (
      <Section>
        <Title>성적</Title>
        <EmptyMessage>성적 정보가 없습니다.</EmptyMessage>
      </Section>
    );
  }

  return (
    <Section>
      <Title>성적</Title>
      {gradeData.map((semesterData, index) => (
        <GradeCard key={`${semesterData.grade}-${semesterData.semester}`}>
          <SemesterTitle>
            {semesterData.grade}학년 {semesterData.semester}학기
          </SemesterTitle>
          
          <GradeTable>
            <thead>
              <tr>
                <TableHeader>과목</TableHeader>
                <TableHeader>학점</TableHeader>
                <TableHeader>중간</TableHeader>
                <TableHeader>기말</TableHeader>
                <TableHeader>수행</TableHeader>
                <TableHeader>총점</TableHeader>
                <TableHeader>석차</TableHeader>
                <TableHeader>등급</TableHeader>
              </tr>
            </thead>
            <tbody>
              {semesterData.subjects.map((subject, idx) => (
                <tr key={subject.name}>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.credits}</TableCell>
                  <TableCell>{subject.midterm.toFixed(1)}</TableCell>
                  <TableCell>{subject.final.toFixed(1)}</TableCell>
                  <TableCell>{subject.performance.toFixed(1)}</TableCell>
                  <TableCell>{subject.totalScore.toFixed(1)}</TableCell>
                  <TableCell>{subject.rank}</TableCell>
                  <TableCell>{subject.gradeLevel}</TableCell>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <SummaryCell colSpan="2">총합</SummaryCell>
                <SummaryCell>{semesterData.totals.sumMidterm.toFixed(1)}</SummaryCell>
                <SummaryCell>{semesterData.totals.sumFinal.toFixed(1)}</SummaryCell>
                <SummaryCell>{semesterData.totals.sumPerformance.toFixed(1)}</SummaryCell>
                <SummaryCell>{semesterData.totals.sumTotalScore.toFixed(1)}</SummaryCell>
                <SummaryCell colSpan="2">{semesterData.finalSummary.finalRank}</SummaryCell>
              </tr>
            </tfoot>
          </GradeTable>

          <SummaryInfo>
            <SummaryItem>
              <Label>총 학점</Label>
              <Value>{semesterData.totals.totalCredits}</Value>
            </SummaryItem>
            <SummaryItem>
              <Label>총 인원</Label>
              <Value>{semesterData.finalSummary.totalStudents}명</Value>
            </SummaryItem>
            <SummaryItem>
              <Label>평점</Label>
              <Value>{semesterData.finalSummary.finalConvertedGrade.toFixed(2)}</Value>
            </SummaryItem>
          </SummaryInfo>
        </GradeCard>
      ))}
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

const Title = styled.h2`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 22px;
  color: #1a237e;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1a237e;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #78909c;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
`;

const GradeCard = styled.div`
  margin-bottom: 30px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SemesterTitle = styled.h3`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 18px;
  color: #1a237e;
  margin: 0;
  padding: 16px 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
`;

const GradeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
  }

  tbody tr:nth-child(even) {
    background-color: #fafafa;
  }

  tbody tr:last-child td {
    border-bottom: 2px solid #e0e0e0;
  }
`;

const TableHeader = styled.th`
  background-color: #f5f5f5;
  font-weight: 600;
  color: #1a237e;
  white-space: nowrap;
`;

const TableCell = styled.td`
  color: #333;
`;

const SummaryCell = styled.td`
  font-weight: 600;
  background-color: #f5f5f5;
  color: #1a237e;
`;

const SummaryInfo = styled.div`
  display: flex;
  gap: 20px;
  padding: 16px 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #e0e0e0;
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.span`
  color: #1a237e;
  font-weight: 600;
`;

const Value = styled.span`
  color: #333;
  font-weight: 500;
`;

export default GradeSection;
