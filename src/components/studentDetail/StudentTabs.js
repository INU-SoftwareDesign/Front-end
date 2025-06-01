import React from 'react';
import styled from 'styled-components';

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 24px;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabButton = styled.button`
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#1D4EB0' : 'transparent'};
  color: ${props => props.active ? '#1D4EB0' : '#666'};
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 16px;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    color: #1D4EB0;
  }
`;

const StudentTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'personal', label: '인적정보' },
    { id: 'score', label: '성적' },
    { id: 'attendance', label: '출결' },
    { id: 'specialNotes', label: '특기사항' },
    { id: 'counseling', label: '상담 내역' },
    { id: 'feedback', label: '피드백 내역' },
    { id: 'report', label: '보고서 생성' },
  ];

  return (
    <TabsContainer>
      {tabs.map(tab => (
        <TabButton 
          key={tab.id}
          active={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </TabButton>
      ))}
    </TabsContainer>
  );
};

export default StudentTabs;
