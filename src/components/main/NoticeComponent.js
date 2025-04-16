// src/components/main/NoticeComponent.js
import React from "react";
import styled from "styled-components";
import { noticeData } from "../../data/dummyNoticeData";

const NoticeContainer = styled.div`
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

const NoticeList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const NoticeItem = styled.li`
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

const NoticeTitle = styled.div`
  cursor: pointer;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  max-width: 220px;
  
  &:hover {
    color: #1D4EB0;
  }
`;

const NoticeDate = styled.div`
  color: #666;
  font-size: 13px;
  margin-left: 12px;
  min-width: 75px;
  text-align: right;
`;

const NoticeComponent = () => {
  // 최신순으로 정렬하고 최대 8개만 표시
  const recentNotices = [...noticeData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);
  
  return (
    <NoticeContainer>
      <Title>
        <span>공지사항</span>
        <MoreLink href="#">더보기</MoreLink>
      </Title>
      
      <NoticeList>
        {recentNotices.map(notice => (
          <NoticeItem key={notice.id}>
            <NoticeTitle>{notice.title}</NoticeTitle>
            <NoticeDate>{notice.date}</NoticeDate>
          </NoticeItem>
        ))}
      </NoticeList>
    </NoticeContainer>
  );
};

export default NoticeComponent;
