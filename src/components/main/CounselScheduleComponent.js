// src/components/main/CounselScheduleComponent.js
import React from "react";
import styled from "styled-components";
import { counselSchedule, getUpcomingCounsels } from "../../data/dummyCounselSchedule";

const CounselContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 18px;
  margin-bottom: 20px;
  height: 100%;
  width: 100%;
`;

const Title = styled.h2`
  color: #1D4EB0;
  font-size: 1.4rem;
  margin-bottom: 15px;
  border-bottom: 2px solid #1D4EB0;
  padding-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MoreLink = styled.a`
  font-size: 0.9rem;
  color: #1D4EB0;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CounselList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const CounselItem = styled.li`
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const StudentInfo = styled.div`
  cursor: pointer;
  flex: 1;
  max-width: 160px;
  
  &:hover {
    color: #1D4EB0;
  }
`;

const StudentName = styled.div`
  font-weight: bold;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StudentClass = styled.div`
  font-size: 12px;
  color: #666;
`;

const CounselInfo = styled.div`
  text-align: right;
`;

const CounselDate = styled.div`
  color: #1D4EB0;
  font-weight: bold;
  font-size: 13px;
`;

const CounselTime = styled.div`
  font-size: 12px;
  color: #666;
`;

const CounselTopic = styled.div`
  font-size: 12px;
  color: #666;
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`;

const CounselScheduleComponent = ({ teacherId = "teacher123" }) => {
  // 가까운 상담 일정 가져오기
  const upcomingCounsels = getUpcomingCounsels(teacherId, 8);
  
  return (
    <CounselContainer>
      <Title>
        <span>상담 일정</span>
        <MoreLink href="#">더보기</MoreLink>
      </Title>
      
      <CounselList>
        {upcomingCounsels.length > 0 ? (
          upcomingCounsels.map(counsel => (
            <CounselItem key={counsel.id}>
              <StudentInfo>
                <StudentName>{counsel.studentName}</StudentName>
                <StudentClass>{counsel.class}반</StudentClass>
              </StudentInfo>
              <CounselInfo>
                <CounselDate>{counsel.date.substring(5)}</CounselDate>
                <CounselTime>{counsel.time}</CounselTime>
                <CounselTopic>{counsel.topic}</CounselTopic>
              </CounselInfo>
            </CounselItem>
          ))
        ) : (
          <CounselItem>
            <div>예정된 상담 일정이 없습니다.</div>
          </CounselItem>
        )}
      </CounselList>
    </CounselContainer>
  );
};

export default CounselScheduleComponent;
