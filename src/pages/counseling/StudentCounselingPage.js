import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import useUserStore from '../../stores/useUserStore';
import counselingApi from '../../api/counselingApi';
import * as studentApi from '../../api/studentApi';
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
  const updateUserInfo = useUserStore(state => state.updateUserInfo);
  const [activeTab, setActiveTab] = useState('request');
  const [counselingRecords, setCounselingRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [childInfo, setChildInfo] = useState(null);
  
  // Check if user is a student or parent
  useEffect(() => {
    if (currentUser && !['student', 'parent', 'teacher'].includes(currentUser.role)) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  // 학부모인 경우 자녀 정보 가져오기 - 별도의 useEffect로 분리하여 무한 호출 방지
  useEffect(() => {
    const fetchChildInfo = async () => {
      if (!currentUser || currentUser.role !== 'parent') return;
      
      // 이미 자녀 정보가 있는 경우 다시 호출하지 않음
      if (childInfo) {
        console.log('%c[StudentCounselingPage] 이미 자녀 정보가 있어 API 호출 생략', 'color: #3498db; font-weight: bold;', childInfo);
        return;
      }
      
      // 학부모 계정에 연결된 자녀 ID 목록
      let childrenIds = currentUser.childrenIds || [];
      
      // childrenIds가 없고 childStudentId가 있는 경우
      if (childrenIds.length === 0 && currentUser.childStudentId) {
        const studentId = currentUser.childStudentId;
        const lastDigits = studentId.slice(-4).replace(/^0+/, '');
        childrenIds = [studentId, lastDigits];
        
        // 사용자 스토어 업데이트 - 의존성 배열에서 제외하기 위해 함수 참조를 직접 사용
        useUserStore.getState().updateUserInfo({
          childrenIds: childrenIds
        });
        
        console.log('자녀 ID 목록 생성 (StudentCounselingPage):', childrenIds);
      }
      
      // 자녀 ID가 없는 경우 (개발 환경에서 테스트용)
      if (childrenIds.length === 0 && process.env.NODE_ENV === 'development') {
        console.log('%c[StudentCounselingPage] 개발 환경 - 더미 자녀 정보 사용', 'color: #e67e22; font-weight: bold;');
        setChildInfo({
          id: '20250001',
          name: '홍길동',
          grade: '2',
          classNumber: '1',
          number: '1'
        });
        return;
      }
      
      // 자녀 ID가 있는 경우 학생 정보 조회
      if (childrenIds.length > 0) {
        try {
          // 첫 번째 자녀 ID로 학생 정보 조회
          const studentData = await studentApi.getStudentById(childrenIds[0]);
          console.log('%c[StudentCounselingPage] 자녀 정보 조회 성공:', 'color: #2ecc71; font-weight: bold;', studentData);
          setChildInfo(studentData);
          
          // 사용자 스토어에 자녀 정보 업데이트 - 의존성 배열에서 제외하기 위해 함수 참조를 직접 사용
          useUserStore.getState().updateUserInfo({
            childName: studentData.name,
            childGrade: studentData.grade,
            childClassNumber: studentData.classNumber,
            childNumber: studentData.number,
            childDetail: `${studentData.grade}학년 ${studentData.classNumber}반 ${studentData.number}번`
          });
        } catch (error) {
          console.error('%c[StudentCounselingPage] 자녀 정보 조회 실패:', 'color: #e74c3c; font-weight: bold;', error);
          // 에러 발생 시 더미 데이터 사용
          const dummyChildInfo = {
            id: '20250001',
            name: '홍길동',
            grade: '2',
            classNumber: '1',
            number: '1'
          };
          setChildInfo(dummyChildInfo);
          
          // 사용자 스토어에 더미 자녀 정보 업데이트 - 의존성 배열에서 제외하기 위해 함수 참조를 직접 사용
          useUserStore.getState().updateUserInfo({
            childName: dummyChildInfo.name,
            childGrade: dummyChildInfo.grade,
            childClassNumber: dummyChildInfo.classNumber,
            childNumber: dummyChildInfo.number,
            childDetail: `${dummyChildInfo.grade}학년 ${dummyChildInfo.classNumber}반 ${dummyChildInfo.number}번`
          });
        }
      }
    };
    
    fetchChildInfo();
  }, [currentUser, childInfo]); // updateUserInfo 제거하고 childInfo 추가

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
      } else if (currentUser.role === 'parent') {
        // 부모인 경우 자녀 ID 결정 로직
        if (childInfo && childInfo.id) {
          // 1. childInfo에서 자녀 ID 사용 (가장 우선)
          studentId = childInfo.id;
          console.log('%c[StudentCounselingPage] 자녀 정보에서 ID 사용:', 'color: #2ecc71; font-weight: bold;', studentId);
        } else if (currentUser.childStudentId) {
          // 2. childStudentId 사용
          studentId = currentUser.childStudentId;
          console.log('%c[StudentCounselingPage] childStudentId 사용:', 'color: #3498db; font-weight: bold;', studentId);
        } else if (currentUser.childrenIds && currentUser.childrenIds.length > 0) {
          // 3. childrenIds 배열의 첫 번째 ID 사용
          studentId = currentUser.childrenIds[0];
          console.log('%c[StudentCounselingPage] childrenIds 배열에서 ID 사용:', 'color: #9b59b6; font-weight: bold;', studentId);
        } else if (currentUser.children && currentUser.children.length > 0) {
          // 4. 이전 방식 호환성 유지 (children 배열 사용)
          studentId = currentUser.children[0].id;
          console.log('%c[StudentCounselingPage] children 배열에서 ID 사용:', 'color: #f39c12; font-weight: bold;', studentId);
        } else {
          // 5. 폴백: 개발 환경에서는 더미 ID 사용
          studentId = '20250001';
          console.warn('%c[StudentCounselingPage] 자녀 ID를 찾을 수 없어 더미 ID 사용:', 'color: #e74c3c; font-weight: bold;', studentId);
        }
      }
      
      if (!studentId) {
        setError('학생 정보를 찾을 수 없습니다.');
        setIsLoading(false);
        return;
      }
      
      // 학생 ID 처리 로직 (8자리 숫자 형식인 경우 뒤의 4자리에서 앞의 0 제거)
      let studentIdToUse = studentId;
      
      // 문자열로 변환
      const studentIdStr = String(studentId);
      
      // 8자리 숫자 형식인지 확인 (예: 20250100)
      if (studentIdStr.length === 8 && /^\d+$/.test(studentIdStr)) {
        // 뒤의 4자리 추출 후 앞의 0 제거 (예: 0100 -> 100)
        const last4Digits = studentIdStr.substring(4);
        studentIdToUse = parseInt(last4Digits, 10);
        console.log(`학생 ID 변환: ${studentIdStr} -> ${studentIdToUse}`);
      } else if (typeof studentIdStr === 'string' && studentIdStr.startsWith('student')) {
        // 'student' 접두사가 있는 경우 제거 (예: 'student100' -> '100')
        const numericPart = studentIdStr.replace('student', '');
        studentIdToUse = numericPart;
        console.log(`학생 ID 변환: ${studentIdStr} -> ${studentIdToUse}`);
      }
      
      // API 호출
      const response = await counselingApi.getStudentCounselings(studentIdToUse);
      
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
            childInfo={childInfo}
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
