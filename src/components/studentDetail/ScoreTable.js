import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  margin-top: 20px;
  overflow-x: auto;
  margin-bottom: 30px;
`;

const TableTitle = styled.h3`
  font-family: 'Pretendard-SemiBold', sans-serif;
  font-size: 18px;
  color: #1D4EB0;
  margin-bottom: 16px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Pretendard-Regular', sans-serif;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  background-color: #f2f6fd;
  color: #1D4EB0;
  padding: 12px;
  text-align: center;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 14px;
  border: 1px solid #e0e0e0;
`;

const TableCell = styled.td`
  padding: 12px;
  text-align: center;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  
  &.subject {
    text-align: left;
    font-family: 'Pretendard-Medium', sans-serif;
  }
  
  &.highlight {
    font-weight: bold;
    color: #1D4EB0;
  }
`;

const SummaryRow = styled.tr`
  background-color: ${props => props.isTotal ? '#f2f6fd' : '#fff'};
  font-family: 'Pretendard-Medium', sans-serif;
  
  ${TableCell} {
    color: ${props => props.isTotal ? '#1D4EB0' : '#333'};
  }
`;

const ScoreSummary = styled.div`
  margin-top: 20px;
  padding: 16px;
  background-color: #f2f6fd;
  border-radius: 8px;
  border: 1px solid #d0e1ff;
  display: flex;
  justify-content: space-around;
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const SummaryLabel = styled.div`
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 14px;
  color: #555;
`;

const SummaryValue = styled.div`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 20px;
  color: #1D4EB0;
  background-color: white;
  padding: 8px 16px;
  border-radius: 6px;
  min-width: 80px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;
const NoDataMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: #888;
  font-family: 'Pretendard-Medium', sans-serif;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
`;

const ScoreTable = ({ subjects, totals, finalSummary, title, grade, semester }) => {
  if (!subjects || subjects.length === 0) {
    return (
      <TableContainer>
        <TableTitle>{title || '성적표'}</TableTitle>
        <NoDataMessage>아직 데이터가 존재하지 않습니다.</NoDataMessage>
      </TableContainer>
    );
  }

  // Use the provided summary data from API
  const { totalCredits, sumMidterm, sumFinal, sumPerformance, sumTotalScore } = totals || {
    totalCredits: 0,
    sumMidterm: 0,
    sumFinal: 0,
    sumPerformance: 0,
    sumTotalScore: 0
  };
  
  // Use the server-provided final summary data
  const { totalStudents, finalRank, finalConvertedGrade } = finalSummary || {
    totalStudents: 0,
    finalRank: '??',
    finalConvertedGrade: '??'
  };
  
  return (
    <TableContainer>
      <TableTitle>
        {title || (grade && semester ? `${grade} ${semester} 성적표` : '성적표')}
      </TableTitle>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader>과목</TableHeader>
            <TableHeader>단위수</TableHeader>
            <TableHeader>중간</TableHeader>
            <TableHeader>기말</TableHeader>
            <TableHeader>수행평가</TableHeader>
            <TableHeader>총점수</TableHeader>
            <TableHeader>석차</TableHeader>
            <TableHeader>등급</TableHeader>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={index}>
              <TableCell className="subject">{subject.name}</TableCell>
              <TableCell>{subject.credits}</TableCell>
              <TableCell>{subject.midterm.toFixed(1)}</TableCell>
              <TableCell>{subject.final.toFixed(1)}</TableCell>
              <TableCell>{subject.performance.toFixed(1)}</TableCell>
              <TableCell className="highlight">{subject.totalScore.toFixed(1)}</TableCell>
              <TableCell>{subject.rank}</TableCell>
              <TableCell>{subject.gradeLevel}</TableCell>
            </tr>
          ))}
          <SummaryRow isTotal={true}>
            <TableCell className="subject">총합</TableCell>
            <TableCell>{totalCredits}</TableCell>
            <TableCell>{sumMidterm.toFixed(1)}</TableCell>
            <TableCell>{sumFinal.toFixed(1)}</TableCell>
            <TableCell>{sumPerformance.toFixed(1)}</TableCell>
            <TableCell className="highlight">{sumTotalScore.toFixed(1)}</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
          </SummaryRow>
        </tbody>
      </StyledTable>
      
      <ScoreSummary>
        <SummaryItem>
          <SummaryLabel>학년 총 인원</SummaryLabel>
          <SummaryValue>{totalStudents}명</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>해당 학생의 석차</SummaryLabel>
          <SummaryValue>{finalRank}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>최종 등급</SummaryLabel>
          <SummaryValue>{finalConvertedGrade}</SummaryValue>
        </SummaryItem>
      </ScoreSummary>
    </TableContainer>
  );
};

export default ScoreTable;
