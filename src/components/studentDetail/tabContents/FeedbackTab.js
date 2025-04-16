import React from 'react';
import styled from 'styled-components';

const TabContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PlaceholderText = styled.p`
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 18px;
  color: #666;
  text-align: center;
`;

const FeedbackTab = ({ student }) => {
  if (!student) return null;
  
  return (
    <TabContainer>
      <PlaceholderText>
        {student.name} 학생의 피드백 내역이 이곳에 표시됩니다.
      </PlaceholderText>
    </TabContainer>
  );
};

export default FeedbackTab;
