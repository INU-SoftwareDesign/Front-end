import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getStudentById } from '../../api/studentApi';
import useUserStore from '../../stores/useUserStore';
import StudentProfileInfo from '../../components/studentDetail/StudentProfileInfo';
import StudentTabs from '../../components/studentDetail/StudentTabs';
import PersonalInfoTab from '../../components/studentDetail/tabContents/PersonalInfoTab';
import ScoreTab from '../../components/studentDetail/tabContents/ScoreTab';
import AttendanceTab from '../../components/studentDetail/tabContents/AttendanceTab';
import SpecialNotesTab from '../../components/studentDetail/tabContents/SpecialNotesTab';
import VolunteerTab from '../../components/studentDetail/tabContents/VolunteerTab';
import ReadingTab from '../../components/studentDetail/tabContents/ReadingTab';
import CounselingTab from '../../components/studentDetail/tabContents/CounselingTab';
import FeedbackTab from '../../components/studentDetail/tabContents/FeedbackTab';

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const BackButton = styled.button`
  background-color: #1D4EB0;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
  cursor: pointer;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #1A44A3;
  }
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
`;

const ContentContainer = styled.div`
  margin-top: 24px;
`;

const LoadingMessage = styled.div`
  margin: 32px auto;
  padding: 24px;
  background-color: #f0f7ff;
  border-radius: 8px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 18px;
  color: #1D4EB0;
  text-align: center;
`;

const ErrorMessage = styled.div`
  margin: 32px auto;
  padding: 24px;
  background-color: #fff0f0;
  border-radius: 8px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 18px;
  color: #e74c3c;
  text-align: center;
`;

const StudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [scoreTabLoaded, setScoreTabLoaded] = useState(false);
  const [counselingTabLoaded, setCounselingTabLoaded] = useState(false);
  const [attendanceTabLoaded, setAttendanceTabLoaded] = useState(false);
  
  // Get current user from store
  const currentUser = useUserStore(state => state.currentUser);

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch student data from API
        const studentData = await getStudentById(id);
        setStudent(studentData);
      } catch (error) {
        console.error('Failed to fetch student data:', error);
        setError(error.message || '학생 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, [id]);

  // 탭 변경 핸들러
  const handleTabChange = (tabId) => {
    // 탭이 변경되면 이전 탭 상태 초기화
    setActiveTab(tabId);
    
    // 성적 탭을 클릭했을 때 로드 상태 업데이트
    if (tabId === 'score') {
      // 현재 값의 반대로 설정하여 매번 변경되도록 함
      setScoreTabLoaded(prev => !prev);
      console.log('성적 탭 클릭됨, API 호출 트리거');
    }
    
    // 상담 탭을 클릭했을 때 로드 상태 업데이트
    if (tabId === 'counseling') {
      // 현재 값의 반대로 설정하여 매번 변경되도록 함
      setCounselingTabLoaded(prev => !prev);
      console.log('상담 탭 클릭됨, API 호출 트리거');
    }
    
    // 출결 탭을 클릭했을 때 로드 상태 업데이트
    if (tabId === 'attendance') {
      // 현재 값의 반대로 설정하여 매번 변경되도록 함
      setAttendanceTabLoaded(prev => !prev);
      console.log('출결 탭 클릭됨, API 호출 트리거');
    }
  };

  // 탭 콘텐츠 렌더링 전에 디버깅 로그 추가
  const renderTabContent = () => {
    // 현재 상태 로그
    console.log('StudentDetailPage 탭 콘텐츠 렌더링:', { 
      activeTab, 
      studentId: student?.studentId, 
      scoreTabLoaded,
      counselingTabLoaded
    });
    
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoTab student={student} currentUser={currentUser} />;
      case 'score':
        // student 객체가 있는지 확인
        if (!student) {
          console.error('ScoreTab에 전달할 student 객체가 없습니다!');
          return <div>학생 정보를 찾을 수 없습니다.</div>;
        }
        console.log('ScoreTab 렌더링 전 데이터:', { urlId: id, studentId: student.studentId, scoreTabLoaded });
        return <ScoreTab student={student} studentUrlId={id} forceLoad={scoreTabLoaded} />;
      case 'attendance':
        console.log('AttendanceTab 렌더링 전 데이터:', { urlId: id, studentId: student?.studentId, attendanceTabLoaded });
        return <AttendanceTab 
          student={student} 
          currentUser={currentUser} 
          forceLoad={attendanceTabLoaded} 
          studentUrlId={id} // URL에서 가져온 학생 ID 전달
        />;
      case 'specialNotes':
        return <SpecialNotesTab student={student} />;
      case 'volunteer':
        return <VolunteerTab student={student} />;
      case 'reading':
        return <ReadingTab student={student} />;
      case 'counseling':
        console.log('CounselingTab 렌더링 전 데이터:', { urlId: id, studentId: student?.studentId, counselingTabLoaded });
        return <CounselingTab student={student} studentUrlId={id} forceLoad={counselingTabLoaded} currentUser={currentUser} />;
      case 'feedback':
        return <FeedbackTab student={student} />;
      default:
        return <PersonalInfoTab student={student} currentUser={currentUser} />;
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingMessage>학생 정보를 불러오는 중입니다...</LoadingMessage>
      </PageContainer>
    );
  }
  
  if (error || !student) {
    return (
      <PageContainer>
        <ErrorMessage>{error || '학생을 찾을 수 없습니다.'}</ErrorMessage>
        <BackButton onClick={() => navigate(-1)}>돌아가기</BackButton>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackButton onClick={() => navigate(-1)}>← 학생 목록으로 돌아가기</BackButton>
      
      <TopSection>
        <StudentProfileInfo student={student} />
      </TopSection>

      <StudentTabs activeTab={activeTab} onTabChange={handleTabChange} />
      
      <ContentContainer>
        {renderTabContent()}
      </ContentContainer>
    </PageContainer>
  );
};

export default StudentDetailPage;
