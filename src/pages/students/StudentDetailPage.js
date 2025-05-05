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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoTab student={student} currentUser={currentUser} />;
      case 'score':
        return <ScoreTab student={student} />;
      case 'attendance':
        return <AttendanceTab student={student} currentUser={currentUser}/>;
      case 'specialNotes':
        return <SpecialNotesTab student={student} />;
      case 'volunteer':
        return <VolunteerTab student={student} />;
      case 'reading':
        return <ReadingTab student={student} />;
      case 'counseling':
        return <CounselingTab student={student} currentUser={currentUser} />;
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

      <StudentTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <ContentContainer>
        {renderTabContent()}
      </ContentContainer>
    </PageContainer>
  );
};

export default StudentDetailPage;
