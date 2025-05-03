import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import dummyStudentData from '../../data/dummyStudentData';
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

const StudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  // In a real app, this would come from an auth context
  const [currentUser, setCurrentUser] = useState({
    role: 'teacher',
    id: 'teacher123',
  });

  useEffect(() => {
    // In a real app, you would fetch student data from an API
    const foundStudent = dummyStudentData.find(s => s.id === parseInt(id));
    if (foundStudent) {
      setStudent(foundStudent);
    }
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

  if (!student) {
    return (
      <PageContainer>
        <h2>학생을 찾을 수 없습니다.</h2>
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
