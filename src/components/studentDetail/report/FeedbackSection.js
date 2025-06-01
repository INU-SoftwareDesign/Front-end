import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useReportStore } from '../../../stores/useReportStore';
import feedbackApi from '../../../api/feedbackApi';
import { useParams } from 'react-router-dom';

const FeedbackSection = () => {
  const { studentId } = useParams();
  const { reportData, setReportData, setError } = useReportStore();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data } = await feedbackApi.getStudentFeedbacks(studentId);
        setReportData({ feedback: data });
      } catch (error) {
        console.error('Failed to fetch feedback:', error);
        setError('피드백 정보를 불러오는데 실패했습니다.');
        // Fallback to dummy data
        setReportData({
          feedback: {
            feedbacks: [
              {
                year: 2023,
                semester: 1,
                categories: {
                  academic: '수업 참여도가 높고 과제 제출이 성실함',
                  behavior: '친구들과 원만한 관계를 유지하며 교우관계가 좋음',
                  attendance: '개근',
                  attitude: '예의 바르고 성실한 태도로 수업에 임함'
                },
                createdAt: '2023-07-20',
                teacherName: '이교사'
              }
            ]
          }
        });
      }
    };

    if (!reportData.feedback) {
      fetchFeedback();
    }
  }, [studentId, reportData.feedback, setReportData, setError]);

  // 데이터가 없거나 feedbacks 배열이 없는 경우 처리
  if (!reportData.feedback || !reportData.feedback.feedbacks) {
    return (
      <Section>
        <Title>담임교사 종합의견</Title>
        <EmptyMessage>피드백 정보가 없습니다.</EmptyMessage>
      </Section>
    );
  }

  // feedbacks가 배열이 아닌 경우 처리
  const feedbacks = Array.isArray(reportData.feedback.feedbacks) 
    ? reportData.feedback.feedbacks 
    : [];

  return (
    <Section>
      <Title>담임교사 종합의견</Title>
      {feedbacks.map((feedback, index) => (
        <FeedbackCard key={index}>
          <CardHeader>
            <HeaderText>{feedback.year}학년도 {feedback.semester}학기</HeaderText>
            <MetaInfo>
              작성일: {feedback.createdAt} | 작성교사: {feedback.teacherName}
            </MetaInfo>
          </CardHeader>
          <CategoryGrid>
            <CategoryItem>
              <CategoryTitle>학업성취도</CategoryTitle>
              <CategoryContent>{feedback.categories.academic}</CategoryContent>
            </CategoryItem>
            <CategoryItem>
              <CategoryTitle>행동발달</CategoryTitle>
              <CategoryContent>{feedback.categories.behavior}</CategoryContent>
            </CategoryItem>
            <CategoryItem>
              <CategoryTitle>출결상황</CategoryTitle>
              <CategoryContent>{feedback.categories.attendance}</CategoryContent>
            </CategoryItem>
            <CategoryItem>
              <CategoryTitle>학습태도</CategoryTitle>
              <CategoryContent>{feedback.categories.attitude}</CategoryContent>
            </CategoryItem>
          </CategoryGrid>
        </FeedbackCard>
      ))}
    </Section>
  );
};

const Section = styled.section`
  margin-bottom: 40px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  page-break-inside: avoid;
`;

const Title = styled.h2`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 22px;
  color: #1a237e;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1a237e;
`;

const FeedbackCard = styled.div`
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #78909c;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
  color: #1a237e;
`;

const HeaderText = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 5px 0;
`;

const MetaInfo = styled.span`
  font-size: 14px;
  color: #455a64;
  display: flex;
  align-items: center;
  gap: 8px;
  & > span {
    padding: 4px 8px;
    background-color: #f1f3f9;
    border-radius: 4px;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 15px;
`;

const CategoryItem = styled.div`
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
`;

const CategoryTitle = styled.h3`
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 16px;
  color: #1a237e;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  &:before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    background-color: #1a237e;
    border-radius: 50%;
    margin-right: 8px;
  }
`;

const CategoryContent = styled.p`
  font-size: 14px;
  white-space: pre-line;
`;

export default FeedbackSection;
