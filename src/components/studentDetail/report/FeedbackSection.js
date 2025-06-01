import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import feedbackApi from '../../../api/feedbackApi';

const FeedbackSection = ({ studentId }) => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // studentId 형식 로그
    console.log('%c[FeedbackSection] studentId format:', 'color: #2196F3; font-weight: bold;', {
      studentId,
      type: typeof studentId,
      length: studentId?.length
    });
    
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        
        // studentId가 원하는 형식(20250100)인지 확인
        // 만약 100과 같은 형태라면 20250100 형태로 변환
        let formattedId = studentId;
        if (studentId && studentId.length <= 4) {
          // 숫자만 포함하는지 확인
          if (/^\d+$/.test(studentId)) {
            formattedId = `2025${studentId.padStart(4, '0')}`;
            console.log('%c[FeedbackSection] Formatted studentId:', 'color: #2196F3; font-weight: bold;', formattedId);
          }
        }
        
        const response = await feedbackApi.getStudentFeedbacks(formattedId);
        
        // API 응답 데이터 확인 및 정렬
        if (response?.data?.success && Array.isArray(response.data.data)) {
          // 학년 기준 오름차순 정렬
          const sortedData = response.data.data.sort((a, b) => {
            return Number(a.grade) - Number(b.grade);
          });
          setFeedbackData(sortedData);
        } else {
          setError('피드백 데이터 형식이 올바르지 않습니다.');
        }
      } catch (err) {
        console.error('Failed to fetch feedback data:', err);
        setError('피드백 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (studentId) {
      fetchFeedback();
    }
  }, [studentId]);

  // 로딩 중인 경우
  if (isLoading) {
    return (
      <Section>
        <Title>담임교사 종합의견</Title>
        <LoadingMessage>피드백 정보를 불러오는 중입니다...</LoadingMessage>
      </Section>
    );
  }

  // 에러가 발생한 경우
  if (error) {
    return (
      <Section>
        <Title>담임교사 종합의견</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </Section>
    );
  }

  // 데이터가 없는 경우
  if (!feedbackData || feedbackData.length === 0) {
    return (
      <Section>
        <Title>담임교사 종합의견</Title>
        <EmptyMessage>피드백 정보가 없습니다.</EmptyMessage>
      </Section>
    );
  }

  // 카테고리 한글 매핑
  const categoryMapping = {
    academic: '학업',
    behavior: '행동',
    attendance: '출석',
    attitude: '태도'
  };

  return (
    <Section>
      <Title>담임교사 종합의견</Title>
      {feedbackData.map((gradeData, index) => (
        <FeedbackCard key={index}>
          <CardHeader>
            <HeaderText>{gradeData.grade}학년 {gradeData.classNumber}반</HeaderText>
            <MetaInfo>
              담당교사: {gradeData.teacherName} | 작성일: {new Date(gradeData.createdAt).toLocaleDateString('ko-KR')}
            </MetaInfo>
          </CardHeader>
          
          <FeedbackTable>
            <thead>
              <tr>
                <TableHeader>카테고리</TableHeader>
                <TableHeader>내용</TableHeader>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categoryMapping).map(([category, label]) => {
                // 해당 카테고리의 피드백 찾기
                const feedback = gradeData.feedbacks.find(f => f.category === category);
                
                return (
                  <tr key={category}>
                    <CategoryCell>{label}</CategoryCell>
                    <ContentCell>{feedback ? feedback.content : '-'}</ContentCell>
                  </tr>
                );
              })}
            </tbody>
          </FeedbackTable>
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
  break-inside: avoid;
  
  /* 인쇄 시 각 섹션 사이에 적절한 여백 유지 */
  @media print {
    margin-bottom: 15mm;
    box-shadow: none;
  }
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
  page-break-inside: avoid;
  break-inside: avoid;
  
  /* 인쇄 시 카드 스타일 조정 */
  @media print {
    border: 1px solid #e0e0e0;
    box-shadow: none;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #e74c3c;
  background-color: #fef5f5;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #78909c;
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

const FeedbackTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  th, td {
    padding: 12px;
    border: 1px solid #e0e0e0;
  }
  
  th {
    background-color: #f5f5f5;
    font-weight: 600;
    color: #1a237e;
  }
`;

const TableHeader = styled.th`
  text-align: center;
  white-space: nowrap;
`;

const CategoryCell = styled.td`
  width: 15%;
  text-align: center;
  background-color: #f8f9fa;
  font-weight: 500;
  color: #1a237e;
`;

const ContentCell = styled.td`
  text-align: left;
  white-space: pre-line;
  font-size: 14px;
`;

export default FeedbackSection;
