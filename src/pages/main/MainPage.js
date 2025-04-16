// src/pages/main/MainPage.js
import React, { useState } from "react";
import styled from "styled-components";

// 컴포넌트 import
import TimetableComponent from "../../components/main/TimetableComponent";
import CalendarComponent from "../../components/main/CalendarComponent";
import NoticeComponent from "../../components/main/NoticeComponent";
import CounselScheduleComponent from "../../components/main/CounselScheduleComponent";

const PageContainer = styled.div`
  padding: 2rem;
  display: flex;
  gap: 1.5rem;
`;

const LeftColumn = styled.div`
  flex: 3.5;
  display: flex;
  flex-direction: column;
`;

const RightColumn = styled.div`
  flex: 1.5;
  display: flex;
  flex-direction: column;
  max-width: 360px;
`;

const SectionWrapper = styled.div`
  flex: 1;
  margin-bottom: 20px;
`;

function MainPage() {
  // 사용자 정보 상태 (실제로는 로그인 시스템에서 가져와야 함)
  const [userRole, setUserRole] = useState("teacher"); // 'teacher', 'student', 'parent'
  const [userId, setUserId] = useState("teacher123");
  const [classId, setClassId] = useState("1-1");

  return (
    <PageContainer>
      <LeftColumn>
        {/* 시간표 컴포넌트 */}
        <TimetableComponent 
          userRole={userRole} 
          userId={userId} 
          classId={classId} 
        />
        
        {/* 학사 일정(달력) 컴포넌트 */}
        <CalendarComponent />
      </LeftColumn>
      
      <RightColumn>
        {/* 공지사항 컴포넌트 */}
        <SectionWrapper>
          <NoticeComponent />
        </SectionWrapper>
        
        {/* 상담 일정 컴포넌트 (교사인 경우에만 표시) */}
        {userRole === "teacher" && (
          <SectionWrapper>
            <CounselScheduleComponent teacherId={userId} />
          </SectionWrapper>
        )}
      </RightColumn>
    </PageContainer>
  );
}

export default MainPage;
