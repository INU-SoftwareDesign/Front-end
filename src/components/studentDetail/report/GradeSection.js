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
        <Table>
          <thead>
            <tr>
              <Th rowSpan={2}>학년</Th>
              <Th rowSpan={2}>학기</Th>
              <Th colSpan={subjects.length}>교과별 점수</Th>
            </tr>
            <tr>
              {subjects.map(subject => (
                <Th key={subject}>{subject}</Th>
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
        </Table>
      </TableContainer>
    </Section>
  );
};

const Section = styled.section`
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
`;

const Th = styled.th`
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  text-align: center;
  font-weight: 500;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
`;

export default GradeSection;
