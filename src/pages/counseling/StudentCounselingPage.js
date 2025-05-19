import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import useUserStore from '../../stores/useUserStore';
import counselingApi from '../../api/counselingApi';
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
  const { studentId: studentUrlId } = useParams(); // URL에서 학생 ID 가져오기
  const currentUser = useUserStore(state => state.currentUser);
  const [activeTab, setActiveTab] = useState('request');
  const [counselingRecords, setCounselingRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Check if user is a student or parent
  useEffect(() => {
    if (currentUser && !['student', 'parent', 'teacher'].includes(currentUser.role)) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // 상담 내역 데이터 불러오기
  const fetchCounselingRecords = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let studentId;
      
      // 학생 ID 결정 (URL 파라미터 > 현재 사용자 ID)
      if (studentUrlId) {
        studentId = studentUrlId;
      } else if (currentUser.role === 'student') {
        studentId = currentUser.id;
      } else if (currentUser.role === 'parent' && currentUser.children && currentUser.children.length > 0) {
        // 부모인 경우 첫 번째 자녀의 ID 사용
        studentId = currentUser.children[0].id;
      }
      
      if (!studentId) {
        setError('학생 정보를 찾을 수 없습니다.');
        setIsLoading(false);
        return;
      }
      
      // API 호출
      const response = await counselingApi.getStudentCounselings(studentId);
      
      if (response && response.data && response.data.success) {
        setCounselingRecords(response.data.data || []);
      } else {
        setError('상담 내역을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('상담 내역 조회 오류:', error);
      setError('상담 내역을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 초기 데이터 로드
  useEffect(() => {
    if (currentUser) {
      fetchCounselingRecords();
    }
  }, [currentUser, studentUrlId]);
  
  // 탭 변경 시 데이터 로드
  useEffect(() => {
    if (activeTab === 'history') {
      fetchCounselingRecords();
    }
  }, [activeTab]);

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
            isLoading={isLoading}
            error={error}
            onRefresh={fetchCounselingRecords}
          />
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default StudentCounselingPage;
