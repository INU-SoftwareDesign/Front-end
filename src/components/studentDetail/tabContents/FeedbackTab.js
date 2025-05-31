import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useUserStore from '../../../stores/useUserStore';
import useFeedbackStore from '../../../stores/useFeedbackStore';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// 피드백 카테고리 정의
const categories = [
  { id: 'academic', name: '학업', icon: '📚' },
  { id: 'behavior', name: '행동', icon: '🤝' },
  { id: 'attendance', name: '출석', icon: '📅' },
  { id: 'attitude', name: '태도', icon: '🧠' }
];

// Styled Components
const TabContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  gap: 30px;
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

const GradeSection = styled.div`
  margin-bottom: 30px;
`;

const GradeHeader = styled.h2`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 22px;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1D4EB0;
`;

const FeedbackGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 20px;
`;

const FeedbackCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CategorySection = styled.div`
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: ${props => props.isLast ? 'none' : '1px solid #eee'};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
`;

const GradeCardHeader = styled(CardHeader)`
  border-bottom: 1px solid #eee;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const CategoryTitle = styled.h3`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 18px;
  color: #1D4EB0;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  background: none;
  border: none;
  color: ${props => props.color || '#666'};
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  
  &:hover {
    color: ${props => props.hoverColor || '#1D4EB0'};
  }
`;

const CardContent = styled.div`
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 16px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 15px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 16px;
  resize: vertical;
  margin-bottom: 15px;
  
  &:focus {
    outline: none;
    border-color: #1D4EB0;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 14px;
  color: #888;
`;

const TeacherInfo = styled.div``;

const DateInfo = styled.div``;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 15px;
`;

const ActionButton = styled.button`
  background-color: ${props => props.primary ? '#1D4EB0' : 'white'};
  color: ${props => props.primary ? 'white' : '#1D4EB0'};
  border: 1px solid #1D4EB0;
  padding: 8px 16px;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.primary ? '#1A44A3' : '#f0f7ff'};
  }
`;

const EmptyFeedbackCard = styled(FeedbackCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background-color: #f5f8ff;
  border: 1px dashed #1D4EB0;
`;

const CreateFeedbackSection = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f8ff;
  border-radius: 8px;
  border: 1px dashed #1D4EB0;
`;

const CreateFeedbackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const CreateTitle = styled.h3`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 18px;
  color: #1D4EB0;
  margin: 0;
`;

const GradeSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const GradeButton = styled.button`
  background-color: ${props => {
    if (props.disabled) return '#f5f5f5';
    return props.selected || props.active ? '#1D4EB0' : 'white';
  }};
  color: ${props => {
    if (props.disabled) return '#999';
    return props.selected || props.active ? 'white' : '#1D4EB0';
  }};
  border: 1px solid ${props => props.disabled ? '#ddd' : '#1D4EB0'};
  padding: 8px 16px;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.7 : 1};
  
  &:hover {
    background-color: ${props => {
      if (props.disabled) return '#f5f5f5';
      return props.selected || props.active ? '#1A44A3' : '#f0f7ff';
    }};
  }
`;


const NoFeedbackMessage = styled.div`
  text-align: center;
  padding: 40px 0;
  font-family: 'Pretendard-Medium', sans-serif;
  color: #888;
`;

const AddButton = styled.button`
  background-color: #1D4EB0;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
  
  &:hover {
    background-color: #1A44A3;
  }
`;

// FeedbackTab 컴포넌트
const FeedbackTab = ({ student, studentUrlId, forceLoad }) => {
  // 상태 관리
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [newFeedbackGrade, setNewFeedbackGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 유저 스토어에서 현재 사용자 정보 가져오기
  const { currentUser } = useUserStore();
  
  // 피드백 스토어에서 피드백 관련 함수 가져오기
  const { 
    feedbacks, 
    fetchFeedbacks, 
    createFeedback, 
    updateFeedback, 
    deleteFeedback 
  } = useFeedbackStore();
  
  // 학생 ID가 변경되거나 강제 로드 시 피드백 데이터 가져오기
  useEffect(() => {
    if (student?.studentId) {
      console.log('[FeedbackTab] Fetching feedbacks for student:', student.studentId);
      setLoading(true);
      setError(null);
      
      fetchFeedbacks(student.studentId)
        .then(() => {
          setLoading(false);
        })
        .catch(err => {
          console.error('[FeedbackTab] Error fetching feedbacks:', err);
          setError('피드백을 불러오는 중 오류가 발생했습니다.');
          setLoading(false);
        });
    }
  }, [student?.studentId, forceLoad, fetchFeedbacks]);
  
  // 피드백 데이터가 변경될 때마다 로그 출력
  useEffect(() => {
    console.log('[FeedbackTab] Current feedbacks from API:', feedbacks);
  }, [feedbacks]);
  
  // 학년별로 정렬된 피드백 배열 반환
  const getSortedGrades = () => {
    if (!feedbacks || feedbacks.length === 0) return [];
    
    // 학년 기준으로 정렬 (내림차순)
    return [...feedbacks].sort((a, b) => {
      // 문자열로 변환하여 비교 (숫자 비교 시 문제 방지)
      const gradeA = String(a.grade);
      const gradeB = String(b.grade);
      return gradeB.localeCompare(gradeA);
    });
  };
  
  // 현재 사용자가 해당 학년의 담임교사인지 확인
  const isCurrentHomeroomTeacher = (gradeFeedback) => {
    if (!currentUser || currentUser.role !== 'teacher' || !gradeFeedback) return false;
    
    // 학년과 반 정보를 문자열로 변환하여 비교
    const teacherGrade = String(currentUser.grade || '');
    const teacherClass = String(currentUser.classNumber || '');
    const feedbackGrade = String(gradeFeedback.grade || '');
    const feedbackClass = String(gradeFeedback.classNumber || '');
    
    // isHomeroom이 undefined일 수 있으므로 직접 학년/반 정보를 비교하여 확인
    // 담임교사는 학년과 반이 일치하는 교사로 간주
    const isHomeroom = teacherGrade === feedbackGrade && teacherClass === feedbackClass;
    
    console.log('[FeedbackTab] Checking homeroom teacher:', { 
      isHomeroom, 
      teacherGrade, 
      teacherClass,
      feedbackGrade,
      feedbackClass,
      currentUser,
      isHomeroomFromUser: currentUser.isHomeroom
    });
    
    // 학년과 반이 일치하면 담임교사로 간주하고 true 반환
    return isHomeroom;
  };
  
  // 피드백 편집 권한 확인
  const canEditFeedback = (gradeFeedback) => {
    if (!currentUser || !gradeFeedback) return false;
    
    // 관리자는 항상 편집 가능
    if (currentUser.role === 'admin') return true;
    
    // 교사인 경우
    if (currentUser.role === 'teacher') {
      // 현재 담임교사인 경우 편집 가능
      if (isCurrentHomeroomTeacher(gradeFeedback)) return true;
      
      // 자신이 작성한 피드백인 경우 편집 가능
      return String(gradeFeedback.teacherId) === String(currentUser.id);
    }
    
    return false;
  };
  
  // 피드백 삭제 권한 확인 (편집 권한과 동일)
  const canDeleteFeedback = canEditFeedback;
  
  // 새 피드백 작성 권한 확인
  const hasEditPermission = () => {
    if (!currentUser) return false;
    
    // 관리자는 항상 피드백 작성 가능
    if (currentUser.role === 'admin') return true;
    
    // 교사인 경우, 학년/반 정보를 비교하여 담임교사인지 확인
    if (currentUser.role === 'teacher') {
      // 학년과 반 정보를 문자열로 변환하여 비교
      const teacherGrade = String(currentUser.grade || '');
      const teacherClass = String(currentUser.classNumber || '');
      const studentGrade = String(student?.grade || '');
      const studentClass = String(student?.classNumber || '');
      
      // 학년과 반이 일치하면 담임교사로 간주
      const isHomeroom = teacherGrade === studentGrade && teacherClass === studentClass;
      
      console.log('[FeedbackTab] Checking edit permission for teacher:', {
        isHomeroom,
        teacherGrade,
        teacherClass,
        studentGrade,
        studentClass,
        isHomeroomFromUser: currentUser.isHomeroom
      });
      
      // 학년과 반이 일치하면 담임교사로 간주하고 true 반환
      return isHomeroom;
    }
    
    return false;
  };
  
  // 피드백 생성 모드 시작
  const startCreating = (grade) => {
    setIsCreating(true);
    setNewFeedbackGrade(grade);
    setEditContent({});
    setEditMode(false);
  };
  
  // 피드백 편집 모드 시작
  const startEditing = (gradeFeedback) => {
    console.log('[FeedbackTab] Start editing grade feedback:', gradeFeedback);
    
    // 기존 피드백 내용으로 초기화
    const initialContent = {};
    
    // 각 카테고리별 피드백 내용 설정
    gradeFeedback.feedbacks.forEach(feedback => {
      initialContent[feedback.category] = feedback.content;
    });
    
    setEditContent(initialContent);
    setEditMode(true);
    setNewFeedbackGrade(gradeFeedback.grade);
    setIsCreating(false);
  };
  
  // 편집 취소
  const cancelEdit = () => {
    setEditMode(false);
    setIsCreating(false);
    setNewFeedbackGrade(null);
    setEditContent({});
  };
  
  // 피드백 내용 변경 핸들러
  const handleContentChange = (category, value) => {
    setEditContent(prev => ({
      ...prev,
      [category]: value
    }));
  };
  
  // 피드백 저장 (생성 및 수정)
  const saveFeedback = async () => {
    if (!currentUser || !student) {
      console.error('[FeedbackTab] Cannot save feedback: missing user or student info');
      return;
    }
    
    console.log('[FeedbackTab] Save feedback - Current user:', { 
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      grade: currentUser.grade,
      classNumber: currentUser.classNumber
    });
    
    try {
      // 해당 학년의 피드백 찾기
      const gradeFeedback = feedbacks.find(f => String(f.grade) === String(newFeedbackGrade));
      
      // 저장할 피드백 배열 준비
      const feedbacksToSave = [];
      
      // 각 카테고리별 피드백 처리
      for (const category of categories) {
        const content = editContent[category.id];
        
        // 내용이 없는 경우 건너뛰기
        if (!content || content.trim() === '') continue;
        
        // 기존 피드백이 있는지 확인
        const existingFeedback = gradeFeedback?.feedbacks.find(f => f.category === category.id);
        
        if (existingFeedback) {
          // 기존 피드백 업데이트
          console.log('[FeedbackTab] Updating existing feedback:', existingFeedback.id);
          feedbacksToSave.push({
            id: existingFeedback.id,
            category: category.id,
            content: content
          });
        } else {
          // 새 피드백 생성
          feedbacksToSave.push({
            category: category.id,
            content: content
          });
        }
      }
      
      // 저장할 데이터 준비
      const saveData = {
        studentId: student.studentId,
        grade: newFeedbackGrade,
        classNumber: currentUser.classNumber,
        teacherId: currentUser.id,
        teacherName: currentUser.name,
        updatedAt: new Date().toISOString(),
        feedbacks: feedbacksToSave
      };
      
      if (gradeFeedback) {
        // 기존 학년 피드백 업데이트
        console.log('[FeedbackTab] Updating existing grade feedback:', gradeFeedback.id);
        await updateFeedback(gradeFeedback.id, saveData);
      } else {
        // 새 학년 피드백 생성
        console.log('[FeedbackTab] Creating new grade feedback');
        saveData.createdAt = saveData.updatedAt;
        await createFeedback(saveData);
      }
      
      // 편집 모드 초기화
      setEditMode(false);
      setIsCreating(false);
      setNewFeedbackGrade(null);
      setEditContent({});
      
      // 피드백 새로고침
      fetchFeedbacks(student.studentId);
      
    } catch (error) {
      console.error('[FeedbackTab] Failed to save feedback:', error);
      alert('피드백 저장 중 오류가 발생했습니다.');
    }
  };
  
  // 학년 피드백 삭제
  const handleDeleteGradeFeedback = async (gradeFeedback) => {
    if (!gradeFeedback || !gradeFeedback.id) return;
    
    if (window.confirm(`${gradeFeedback.grade}학년 피드백을 모두 삭제하시겠습니까?`)) {
      console.log('[FeedbackTab] Deleting grade feedback:', gradeFeedback.id);
      try {
        await deleteFeedback(gradeFeedback.id);
        // 피드백 새로고침
        fetchFeedbacks(student.studentId);
      } catch (error) {
        console.error('[FeedbackTab] Failed to delete feedback:', error);
        alert('피드백 삭제 중 오류가 발생했습니다.');
      }
    }
  };
  
  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'yyyy년 M월 d일 HH:mm', { locale: ko });
    } catch (error) {
      console.error('[FeedbackTab] Error formatting date:', error);
      return dateString;
    }
  };
  
  // 로딩 상태 렌더링
  if (loading) {
    return (
      <TabContainer>
        <LoadingMessage>
          피드백을 불러오는 중입니다...
        </LoadingMessage>
      </TabContainer>
    );
  }
  
  // 에러 상태 렌더링
  if (error) {
    return (
      <TabContainer>
        <ErrorMessage>
          {error}
        </ErrorMessage>
      </TabContainer>
    );
  }
  
  // 정렬된 학년별 피드백 가져오기
  const sortedGradeFeedbacks = getSortedGrades();
  
  return (
    <TabContainer>
      {/* 새 피드백 생성 버튼 (담임교사에게만 표시) */}
      {hasEditPermission() && !isCreating && !editMode && (
        <CreateFeedbackSection>
          <CreateFeedbackHeader>
            <CreateTitle>새 피드백 작성</CreateTitle>
          </CreateFeedbackHeader>
          
          <GradeSelector>
            {[1, 2, 3].map(grade => {
              // 현재 교사가 담임하는 학년인지 확인
              const isTeacherGrade = currentUser?.role === 'teacher' && 
                String(currentUser?.grade) === String(grade);
              
              // 관리자이거나 해당 학년의 담임교사인 경우에만 클릭 가능
              const canSelectGrade = currentUser?.role === 'admin' || isTeacherGrade;
              
              return (
                <GradeButton 
                  key={grade}
                  onClick={() => canSelectGrade && startCreating(grade)}
                  disabled={!canSelectGrade}
                  active={canSelectGrade}
                >
                  {grade}학년
                </GradeButton>
              );
            })}
          </GradeSelector>
        </CreateFeedbackSection>
      )}
      
      {/* 피드백 생성 모드 */}
      {isCreating && (
        <FeedbackCard>
          <CardHeader>
            <h3>{newFeedbackGrade}학년 피드백 작성</h3>
          </CardHeader>
          
          {categories.map(category => (
            <CategorySection key={category.id}>
              <CategoryHeader>
                <CategoryTitle>{category.icon} {category.name}</CategoryTitle>
              </CategoryHeader>
              <TextArea
                placeholder={`${category.name} 피드백을 입력하세요...`}
                value={editContent[category.id] || ''}
                onChange={(e) => handleContentChange(category.id, e.target.value)}
              />
            </CategorySection>
          ))}
          
          <ButtonGroup>
            <ActionButton onClick={cancelEdit}>취소</ActionButton>
            <ActionButton primary onClick={saveFeedback}>저장</ActionButton>
          </ButtonGroup>
        </FeedbackCard>
      )}
      
      {/* 피드백 편집 모드 */}
      {editMode && (
        <FeedbackCard>
          <CardHeader>
            <h3>{newFeedbackGrade}학년 피드백 수정</h3>
          </CardHeader>
          
          {categories.map(category => (
            <CategorySection key={category.id}>
              <CategoryHeader>
                <CategoryTitle>{category.icon} {category.name}</CategoryTitle>
              </CategoryHeader>
              <TextArea
                placeholder={`${category.name} 피드백을 입력하세요...`}
                value={editContent[category.id] || ''}
                onChange={(e) => handleContentChange(category.id, e.target.value)}
              />
            </CategorySection>
          ))}
          
          <ButtonGroup>
            <ActionButton onClick={cancelEdit}>취소</ActionButton>
            <ActionButton primary onClick={saveFeedback}>저장</ActionButton>
          </ButtonGroup>
        </FeedbackCard>
      )}
      
      {/* 피드백이 없는 경우 */}
      {!isCreating && !editMode && sortedGradeFeedbacks.length === 0 && (
        <EmptyFeedbackCard>
          <p>아직 등록된 피드백이 없습니다.</p>
          {hasEditPermission() && (
            <AddButton onClick={() => startCreating(student?.grade || 1)}>
              피드백 작성하기
            </AddButton>
          )}
        </EmptyFeedbackCard>
      )}
      
      {/* 학년별 피드백 목록 */}
      {!isCreating && !editMode && sortedGradeFeedbacks.map(gradeFeedback => {
        // 편집/삭제 권한 확인
        const canEdit = canEditFeedback(gradeFeedback);
        const canDelete = canDeleteFeedback(gradeFeedback);
        
        return (
          <GradeSection key={gradeFeedback.id || gradeFeedback.grade}>
            <GradeHeader>{gradeFeedback.grade}학년 피드백</GradeHeader>
            <FeedbackCard>
              {/* 학년 피드백 헤더 (교사 정보 및 날짜) */}
              <GradeCardHeader>
                <TeacherInfo>
                  작성: {gradeFeedback.teacherName} 선생님 ({gradeFeedback.classNumber}반)
                </TeacherInfo>
                <DateInfo>
                  {formatDate(gradeFeedback.createdAt)}
                  {gradeFeedback.updatedAt !== gradeFeedback.createdAt && 
                    ` (수정: ${formatDate(gradeFeedback.updatedAt)})`}
                </DateInfo>
              </GradeCardHeader>
              
              {/* 카테고리별 피드백 내용 */}
              {gradeFeedback.feedbacks.map((feedback, index) => {
                // 카테고리 정보 찾기
                const category = categories.find(c => c.id === feedback.category) || {
                  id: feedback.category,
                  name: feedback.category,
                  icon: '📝'
                };
                
                // 마지막 항목인지 확인
                const isLast = index === gradeFeedback.feedbacks.length - 1;
                
                return (
                  <CategorySection key={feedback.id || category.id} isLast={isLast}>
                    <CategoryHeader>
                      <CategoryTitle>{category.icon} {category.name}</CategoryTitle>
                    </CategoryHeader>
                    <CardContent>{feedback.content}</CardContent>
                  </CategorySection>
                );
              })}
              
              {/* 편집/삭제 버튼 */}
              {(canEdit || canDelete) && (
                <ButtonGroup>
                  {canEdit && (
                    <ActionButton onClick={() => startEditing(gradeFeedback)}>
                      수정
                    </ActionButton>
                  )}
                  {canDelete && (
                    <ActionButton 
                      onClick={() => handleDeleteGradeFeedback(gradeFeedback)}
                    >
                      삭제
                    </ActionButton>
                  )}
                </ButtonGroup>
              )}
            </FeedbackCard>
          </GradeSection>
        );
      })}
    </TabContainer>
  );
};

export default FeedbackTab;
