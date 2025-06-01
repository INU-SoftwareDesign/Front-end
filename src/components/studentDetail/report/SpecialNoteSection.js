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
                <ContentTd>
                  <NoteCard>
                    <CardHeader>
                      <h3>{note.year}학년도</h3>
                      <MetaInfo>
                        <span>작성일: {note.createdAt}</span>
                        <span>작성교사: {note.teacherName}</span>
                      </MetaInfo>
                    </CardHeader>
                    <CardContent>{note.content}</CardContent>
                  </NoteCard>
                </ContentTd>
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
  margin-bottom: 40px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  page-break-inside: avoid;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #78909c;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
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

const NoteCard = styled.div`
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const MetaInfo = styled.div`
  font-size: 14px;
  color: #455a64;
  display: flex;
  align-items: center;
  gap: 8px;
  & > span {
    padding: 4px 8px;
    background-color: #f1f3f9;
    border-radius: 4px;
  }
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

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
  color: #1a237e;
`;

const CardContent = styled.p`
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 14px;
  color: #455a64;
  line-height: 1.6;
  white-space: pre-line;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin: 0;
`;

export default SpecialNoteSection;
