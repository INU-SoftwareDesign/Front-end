import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useReportStore } from '../../../stores/useReportStore';
import specialNotesApi from '../../../api/specialNotesApi';
import { useParams } from 'react-router-dom';

const SpecialNoteSection = () => {
  const { studentId } = useParams();
  const { reportData, setReportData, setError } = useReportStore();

  useEffect(() => {
    const fetchSpecialNotes = async () => {
      try {
        const { data } = await specialNotesApi.getStudentSpecialNotes(studentId);
        setReportData({ specialNotes: data });
      } catch (error) {
        console.error('Failed to fetch special notes:', error);
        setError('특기사항을 불러오는데 실패했습니다.');
        // Fallback to dummy data
        setReportData({
          specialNotes: {
            notes: [
              {
                year: 2023,
                content: '학급 회장으로서 리더십을 발휘하여 학급 운영에 크게 기여함. 과학 경시대회에서 우수한 성적을 거둠.',
                createdAt: '2023-12-20',
                teacherName: '김교사'
              }
            ]
          }
        });
      }
    };

    if (!reportData.specialNotes) {
      fetchSpecialNotes();
    }
  }, [studentId, reportData.specialNotes, setReportData, setError]);

  // 데이터가 없거나 data 배열이 없는 경우 처리
  if (!reportData.specialNotes || !reportData.specialNotes.data) {
    return (
      <Section>
        <Title>특기사항</Title>
        <EmptyMessage>특기사항 정보가 없습니다.</EmptyMessage>
      </Section>
    );
  }

  // data가 배열이 아닌 경우 처리
  const notes = Array.isArray(reportData.specialNotes.data)
    ? reportData.specialNotes.data
    : [];

  return (
    <Section>
      <Title>특기사항</Title>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>학년도</Th>
              <Th>특기사항</Th>
              <Th>작성일</Th>
              <Th>작성교사</Th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, index) => (
              <tr key={index}>
                <Td>{note.year ?? '-'}</Td>
                <ContentTd>{note.content ?? '-'}</ContentTd>
                <Td>{note.createdAt ?? '-'}</Td>
                <Td>{note.teacherName ?? '-'}</Td>
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

const EmptyMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
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

const ContentTd = styled(Td)`
  text-align: left;
  white-space: pre-line;
`;

export default SpecialNoteSection;
