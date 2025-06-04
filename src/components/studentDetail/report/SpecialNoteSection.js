import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import specialNotesApi from '../../../api/specialNotesApi';

const SpecialNoteSection = ({ studentId }) => {
  const [specialNotes, setSpecialNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // studentId 형식 로그
    console.log('%c[SpecialNoteSection] studentId format:', 'color: #4CAF50; font-weight: bold;', {
      studentId,
      type: typeof studentId,
      length: studentId?.length
    });
    
    const fetchSpecialNotes = async () => {
      try {
        setIsLoading(true);
        
        // studentId가 원하는 형식(20250100)인지 확인
        // 만약 100과 같은 형태라면 20250000 형태로 변환
        let formattedId = studentId;
        if (studentId && studentId.length <= 4) {
          // 숫자만 포함하는지 확인
          if (/^\d+$/.test(studentId)) {
            formattedId = `2025${studentId.padStart(4, '0')}`;
            console.log('%c[SpecialNoteSection] Formatted studentId:', 'color: #4CAF50; font-weight: bold;', formattedId);
          }
        }
        
        const response = await specialNotesApi.getStudentSpecialNotes(formattedId);
        // 학년 기준 오름차순 정렬
        const sortedNotes = response.data.data.sort((a, b) => a.grade - b.grade);
        setSpecialNotes(sortedNotes);
      } catch (err) {
        console.error('Failed to fetch special notes:', err);
        setError('특기사항을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (studentId) {
      fetchSpecialNotes();
    }
  }, [studentId]);

  if (isLoading) {
    return (
      <Section>
        <Title>특기사항</Title>
        <LoadingMessage>불러오는 중...</LoadingMessage>
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <Title>특기사항</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </Section>
    );
  }

  if (!specialNotes.length) {
    return (
      <Section>
        <Title>특기사항</Title>
        <EmptyMessage>등록된 특기사항이 없습니다.</EmptyMessage>
      </Section>
    );
  }

  return (
    <Section>
      <Title>특기사항</Title>
      <TableContainer>
        <NotesTable>
          <thead>
            <tr>
              <TableHeader>학년</TableHeader>
              <TableHeader>특기 또는 흥미</TableHeader>
              <TableHeader>진로희망(학생)</TableHeader>
              <TableHeader>진로희망(학부모)</TableHeader>
              <TableHeader>특기사항</TableHeader>
            </tr>
          </thead>
          <tbody>
            {specialNotes.map((note) => (
              <tr key={note.id}>
                <TableCell>{note.grade}학년</TableCell>
                <TableCell>{note.specialTalent}</TableCell>
                <TableCell>{note.careerAspiration.student}</TableCell>
                <TableCell>{note.careerAspiration.parent}</TableCell>
                <TableCell className="note-content">{note.note}</TableCell>
              </tr>
            ))}
          </tbody>
        </NotesTable>
      </TableContainer>
    </Section>
  );
};

const Section = styled.section`
  margin-bottom: 40px;
  padding: 20px 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  page-break-inside: avoid;
  break-inside: avoid;
  
  /* 인쇄 시 각 섹션 사이에 적절한 여백 유지 */
  @media print {
    margin-bottom: 15mm;
    box-shadow: none;
    padding: 0;
  }
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
  width: 100%;
  overflow-x: auto;
  margin-top: 20px;
  page-break-inside: avoid;
  break-inside: avoid;
  
  @media print {
    overflow-x: visible;
  }
`;

const NotesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  page-break-inside: avoid;
  break-inside: avoid;
  
  @media print {
    box-shadow: none;
  }
  
  th, td {
    padding: 12px;
    text-align: center;
    border: 1px solid #e0e0e0;
  }

  th {
    background-color: #f5f5f5;
    font-weight: 600;
    color: #1a237e;
    white-space: nowrap;
  }
  
  /* 열 너비 조정 */
  th:nth-child(1), td:nth-child(1) {
    width: 12%; /* 학년 칸 너비 더 증가 */
  }
  
  th:nth-child(2), td:nth-child(2),
  th:nth-child(3), td:nth-child(3),
  th:nth-child(4), td:nth-child(4) {
    width: 19%; /* 중간 칸들 너비 약간 증가 */
  }
  
  th:nth-child(5), td:nth-child(5) {
    width: 31%; /* 특기사항 칸 너비 더 감소 */
  }

  td.note-content {
    text-align: left;
    white-space: pre-line;
    overflow: hidden;
    text-overflow: ellipsis;
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
`;

const TableCell = styled.td`
  color: #333;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #e74c3c;
  background-color: #fef5f5;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #78909c;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
`;

export default SpecialNoteSection;
