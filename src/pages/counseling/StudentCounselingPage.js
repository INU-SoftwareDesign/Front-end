import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import dummyStudentCounselingData from '../../data/dummyStudentCounselingData';
import RequestTabContent from './components/RequestTabContent';
import HistoryTabContent from './components/HistoryTabContent';

// Styled Components
const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const PageTitle = styled.h1`
  font-family: 'Pretendard-Bold', sans-serif;
  color: #1D4EB0;
  margin-bottom: 24px;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 24px;
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
  
  &:hover {
    color: #1D4EB0;
  }
`;

const ContentContainer = styled.div`
  margin-top: 20px;
`;

const StudentCounselingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState('request');
  const [counselingRecords, setCounselingRecords] = useState([]);
  
  // Check if user is a student or parent
  useEffect(() => {
    if (currentUser && !['student', 'parent'].includes(currentUser.role)) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Load counseling data
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'student') {
        // Filter counseling records for the current student
        const studentRecords = dummyStudentCounselingData.studentCounselings.filter(
          record => record.studentId === parseInt(currentUser.id)
        );
        setCounselingRecords(studentRecords);
      } else if (currentUser.role === 'parent') {
        // Filter counseling records for the parent's child
        const parentRecords = dummyStudentCounselingData.parentCounselings.filter(
          record => record.parentId === currentUser.id
        );
        setCounselingRecords(parentRecords);
      }
    }
  }, [currentUser]);

  return (
    <PageContainer>
      <PageTitle>상담 관리</PageTitle>
      
      <TabsContainer>
        <TabButton 
          active={activeTab === 'request'} 
          onClick={() => setActiveTab('request')}
        >
          상담 신청
        </TabButton>
        <TabButton 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')}
        >
          상담 내역
        </TabButton>
      </TabsContainer>
      
      <ContentContainer>
        {activeTab === 'request' ? (
          <RequestTabContent 
            currentUser={currentUser} 
          />
        ) : (
          <HistoryTabContent 
            currentUser={currentUser}
            counselingRecords={counselingRecords}
            setCounselingRecords={setCounselingRecords}
          />
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default StudentCounselingPage;
