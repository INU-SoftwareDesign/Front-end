import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useReportStore } from '../../../stores/useReportStore';
import { getStudentGradeOverview } from '../../../api/gradeApi';
import { useParams } from 'react-router-dom';

const GradeSection = () => {
  const { studentId } = useParams();
  const { reportData, setReportData, setError } = useReportStore();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await getStudentGradeOverview(studentId);
        setReportData({ grades: data });
      } catch (error) {
        console.error('Failed to fetch grades:', error);
        setError('성적 정보를 불러오는데 실패했습니다.');
        // Fallback to dummy data
        setReportData({
          grades: {
            grades: [
              {
                year: 2023,
                semester: 1,
                subjects: [
                  { name: '국어', score: 85 },
                  { name: '수학', score: 92 },
                  { name: '영어', score: 88 },
                  { name: '과학', score: 90 },
                  { name: '사회', score: 87 }
                ]
              },
              {
                year: 2023,
                semester: 2,
                subjects: [
                  { name: '국어', score: 88 },
                  { name: '수학', score: 94 },
                  { name: '영어', score: 90 },
                  { name: '과학', score: 92 },
                  { name: '사회', score: 89 }
                ]
              }
            ]
          }
        });
      }
    };

    if (!reportData.grades) {
      fetchGrades();
    }
  }, [studentId, reportData.grades, setReportData, setError]);

  if (!reportData.grades) return null;

  const { grades } = reportData.grades;
  const subjects = [...new Set(grades.flatMap(g => g.subjects.map(s => s.name)))].sort();

  return (
    <Section>
      <Title>성적 현황</Title>
      <TableContainer>
        <GradeTable>
          <thead>
            <tr>
              <TableHeader rowSpan={2}>학년</TableHeader>
              <TableHeader rowSpan={2}>학기</TableHeader>
              <TableHeader colSpan={subjects.length}>교과별 점수</TableHeader>
            </tr>
            <tr>
              {subjects.map(subject => (
                <TableHeader key={subject}>{subject}</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {grades.map((grade, index) => (
              <tr key={index}>
                <Td>{grade.year}</Td>
                <Td>{grade.semester}</Td>
                {subjects.map(subject => {
                  const subjectGrade = grade.subjects.find(s => s.name === subject);
                  return (
                    <Td key={subject}>
                      {subjectGrade ? subjectGrade.score : '-'}
                    </Td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </GradeTable>
      </TableContainer>
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

const TableContainer = styled.div`
  overflow-x: auto;
`;

const GradeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
`;

const TableHeader = styled.th`
  background-color: #f1f3f9;
  padding: 12px;
  text-align: center;
  border: 1px solid #e0e0e0;
  font-weight: bold;
  color: #1a237e;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
`;

export default GradeSection;
