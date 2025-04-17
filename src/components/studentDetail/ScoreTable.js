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

const ScoreTable = ({ scoreData, title }) => {
  if (!scoreData || !scoreData.scores || scoreData.scores.length === 0) {
    return (
      <TableContainer>
        <TableTitle>{title || '성적표'}</TableTitle>
        <NoDataMessage>아직 데이터가 존재하지 않습니다.</NoDataMessage>
      </TableContainer>
    );
  }

  const { grade, semester, scores } = scoreData;
  
  // Calculate summary data
  const totalUnits = scores.reduce((sum, item) => sum + item.unit, 0);
  const totalMidterm = scores.reduce((sum, item) => sum + (item.midterm * item.unit), 0) / totalUnits;
  const totalFinal = scores.reduce((sum, item) => sum + (item.final * item.unit), 0) / totalUnits;
  const totalTask = scores.reduce((sum, item) => sum + (item.task * item.unit), 0) / totalUnits;
  const totalScore = scores.reduce((sum, item) => sum + (item.total * item.unit), 0) / totalUnits;
  
  // Use the server-provided summary data
  // If scoreData contains these values, use them directly
  const { totalStudents, studentRank, finalGrade } = scoreData;
  
  return (
    <TableContainer>
      <TableTitle>
        {title || `${grade} ${semester} 성적표`}
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
          {scores.map((score, index) => (
            <tr key={index}>
              <TableCell className="subject">{score.subject}</TableCell>
              <TableCell>{score.unit}</TableCell>
              <TableCell>{score.midterm.toFixed(1)}</TableCell>
              <TableCell>{score.final.toFixed(1)}</TableCell>
              <TableCell>{score.task.toFixed(1)}</TableCell>
              <TableCell className="highlight">{score.total.toFixed(1)}</TableCell>
              <TableCell>{score.rank}</TableCell>
              <TableCell>{score.grade}</TableCell>
            </tr>
          ))}
          <SummaryRow isTotal={true}>
            <TableCell className="subject">총합</TableCell>
            <TableCell>{totalUnits}</TableCell>
            <TableCell>{totalMidterm.toFixed(1)}</TableCell>
            <TableCell>{totalFinal.toFixed(1)}</TableCell>
            <TableCell>{totalTask.toFixed(1)}</TableCell>
            <TableCell className="highlight">{totalScore.toFixed(1)}</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
          </SummaryRow>
          <SummaryRow>
            <TableCell className="subject">평균</TableCell>
            <TableCell>-</TableCell>
            <TableCell>{totalMidterm.toFixed(1)}</TableCell>
            <TableCell>{totalFinal.toFixed(1)}</TableCell>
            <TableCell>{totalTask.toFixed(1)}</TableCell>
            <TableCell className="highlight">{totalScore.toFixed(1)}</TableCell>
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
          <SummaryValue>{studentRank}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>최종 등급</SummaryLabel>
          <SummaryValue>{finalGrade}</SummaryValue>
        </SummaryItem>
      </ScoreSummary>
    </TableContainer>
  );
};

export default ScoreTable;
