import React, { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext';
import styled from 'styled-components';
import useUserStore from '../../../stores/useUserStore';
import useSpecialNotesStore from '../../../stores/useSpecialNotesStore';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

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

const NoteCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;



const ItemSection = styled.div`
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: ${props => props.isLast ? 'none' : '1px solid #eee'};
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ItemTitle = styled.h3`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 18px;
  color: #1D4EB0;
  margin: 0;
`;

const CardContent = styled.div`
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 16px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 15px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 16px;
  margin-bottom: 15px;
  
  &:focus {
    outline: none;
    border-color: #1D4EB0;
  }
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

const EmptyNoteCard = styled(NoteCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background-color: #f5f8ff;
  border: 1px dashed #1D4EB0;
`;

const CreateNoteSection = styled.div`
  margin-bottom: 30px;
`;

const CreateNoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const CreateTitle = styled.h3`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 20px;
  color: #1D4EB0;
  margin: 0;
`;

const GradeSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const GradeButton = styled.button`
  background-color: ${props => {
    if (props.disabled) return '#f5f5f5';
    return props.selected || props.active ? '#1D4EB0' : 'white';
  }};
  color: ${props => {
    if (props.disabled) return '#aaa';
    return props.selected || props.active ? 'white' : '#1D4EB0';
  }};
  border: 1px solid ${props => props.disabled ? '#ddd' : '#1D4EB0'};
  padding: 8px 16px;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => {
      if (props.disabled) return '#f5f5f5';
      return props.selected || props.active ? '#1A44A3' : '#f0f7ff';
    }};
  }
`;

const AddButton = styled(ActionButton)`
  margin-top: 15px;
`;

const CareerAspirationContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const CareerAspirationField = styled.div`
  flex: 1;
`;

const CareerAspirationLabel = styled.div`
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
`;

const SpecialNotesTab = ({ student, studentUrlId, forceLoad, currentUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  
  // Form state
  const [specialTalent, setSpecialTalent] = useState('');
  const [studentCareerAspiration, setStudentCareerAspiration] = useState('');
  const [parentCareerAspiration, setParentCareerAspiration] = useState('');
  const [note, setNote] = useState('');
  
  // Get current user from props (most reliable), then fallback to store or context if needed
  const { user: storeUser } = useUserStore();
  const userContext = useUser();
  
  // Use props first, then store, then context
  const user = currentUser || storeUser || userContext?.currentUser;
  
  // 실제 사용자 정보 로그
  console.log('%c[SpecialNotesTab] 사용자 정보 원천:', 'color: #8e44ad; font-weight: bold;', {
    'Props currentUser': currentUser,
    'Props currentUser ID': currentUser?.id,
    'Props currentUser role': currentUser?.role,
    'Props currentUser grade': currentUser?.grade,
    'Props currentUser classNumber': currentUser?.classNumber
  });
  const { 
    specialNotes, 
    loading, 
    error, 
    fetchSpecialNotes, 
    createSpecialNote, 
    updateSpecialNote, 
    deleteSpecialNote 
  } = useSpecialNotesStore();
  
  // Fetch special notes when component mounts or when student changes
  useEffect(() => {
    if (student?.studentId) {
      console.log('%c[SpecialNotesTab] fetchSpecialNotes 호출:', 'color: #e67e22; font-weight: bold;', {
        studentId: student.studentId,
        forceLoad,
        'context user available': !!userContext?.currentUser,
        'merged user available': !!user,
        'user data': user
      });
      fetchSpecialNotes(student.studentId);
    }
  }, [student, fetchSpecialNotes, forceLoad, user]);
  
  // Log user permissions when component mounts or when user/student changes
  useEffect(() => {
    // 사용자 정보 로그 추가
    console.log('%c[SpecialNotesTab] 사용자 정보 소스 비교:', 'color: #e67e22; font-weight: bold;', {
      'Props currentUser': currentUser,
      'Zustand Store User': storeUser,
      'Context User': userContext?.currentUser,
      'Final User': user
    });
    
    console.log('%c[SpecialNotesTab] 사용자 정보 확인:', 'color: #e67e22; font-weight: bold;', {
      user,
      'user ID': user?.id,
      'user role': user?.role,
      'user grade': user?.grade,
      'user classNumber': user?.classNumber
    });
    
    if (user && student) {
      const isTeacher = user?.role === 'teacher';
      const isHomeroomTeacher = isTeacher && 
        student?.grade === user?.grade && 
        student?.classNumber === user?.classNumber;
      
      console.group('%c[SpecialNotesTab] 사용자 권한 정보', 'color: #9b59b6; font-weight: bold;');
      console.log('%c현재 로그인한 사용자:', 'color: #3498db; font-weight: bold;', {
        id: user.id,
        name: user.name,
        role: user.role,
        grade: user.grade,
        classNumber: user.classNumber
      });
      console.log('%c조회 중인 학생 정보:', 'color: #3498db; font-weight: bold;', {
        id: student.id,
        name: student.name,
        grade: student.grade,
        classNumber: student.classNumber
      });
      
      // 권한 비교 데이터 상세 출력
      console.log('%c권한 비교 데이터:', 'color: #3498db; font-weight: bold;', {
        '사용자 역할': user.role,
        '역할 기반 권한': isTeacher ? '✅ 교사 (수정 가능)' : '❌ 학생/학부모 (읽기 전용)',
        '사용자-학생 학년 일치 여부': student.grade === user.grade ? '✅ 일치' : '❌ 불일치',
        '사용자-학생 반 일치 여부': student.classNumber === user.classNumber ? '✅ 일치' : '❌ 불일치',
        '담임 여부': isHomeroomTeacher ? '✅ 담임' : '❌ 비담임',
        '담임-학생 관계': isHomeroomTeacher ? `✅ ${user.name} 선생님은 ${student.grade}학년 ${student.classNumber}반 ${student.name} 학생의 담임` : 
          `❌ ${user.name} 선생님은 ${student.name} 학생의 담임이 아님`
      });
      
      console.log('%c권한 상태:', 'color: #3498db; font-weight: bold;', {
        isTeacher,
        isHomeroomTeacher,
        canCreate: isHomeroomTeacher,
        canEditCurrentGrade: isHomeroomTeacher,
        canEditOwnNotes: isTeacher
      });
      console.groupEnd();
    }
  }, [user, student, storeUser, userContext, currentUser]);
  
  // Group special notes by grade
  const specialNotesByGrade = specialNotes.reduce((acc, note) => {
    const grade = note.grade;
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push(note);
    return acc;
  }, {});
  
  // Sort grades in descending order
  const sortedGrades = Object.keys(specialNotesByGrade)
    .map(Number)
    .sort((a, b) => b - a);
  
  // Check if user is a teacher and is the homeroom teacher of the student
  const isTeacher = user?.role === 'teacher';
  const isHomeroomTeacher = isTeacher && 
    student?.grade === user?.grade && 
    student?.classNumber === user?.classNumber;
  
  // Check if user can edit a specific note
  const canEditNote = (note) => {
    console.group(`%c[SpecialNotesTab] 권한 체크: 노트 ID ${note.id}`, 'color: #9b59b6; font-weight: bold;');
    
    // 노트 상세 정보 출력
    console.log('%c노트 상세 정보:', 'color: #3498db;', {
      id: note.id,
      grade: note.grade,
      teacherId: note.teacherId,
      teacherName: note.teacherName,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt
    });
    
    // 사용자와 학생 정보 비교 출력
    console.log('%c권한 비교 데이터:', 'color: #3498db;', {
      '사용자 역할': user?.role,
      '사용자 ID': user?.id,
      '노트 작성자 ID': note.teacherId,
      '사용자 담당 학년': user?.grade,
      '사용자 담당 반': user?.classNumber,
      '학생 학년': student?.grade,
      '학생 반': student?.classNumber,
      '노트 학년': note.grade,
      '사용자-노트작성자 일치 여부': user?.id === note.teacherId ? '✅ 일치' : '❌ 불일치',
      '담임-학생 학년/반 일치 여부': (student?.grade === user?.grade && student?.classNumber === user?.classNumber) ? '✅ 일치' : '❌ 불일치',
      '노트-현재학년 일치 여부': note.grade === student?.grade ? '✅ 일치' : '❌ 불일치'
    });
    
    if (!isTeacher) {
      console.log(`%c결과: 권한 없음 (사용자가 교사가 아님)`, 'color: #e74c3c; font-weight: bold;');
      console.groupEnd();
      return false;
    }
    
    // Current homeroom teacher can edit notes for current grade
    if (isHomeroomTeacher && note.grade === student?.grade) {
      console.log(`%c결과: 권한 있음 (현재 학년 담임 교사)`, 'color: #2ecc71; font-weight: bold;');
      console.groupEnd();
      return true;
    }
    
    // Teacher can edit their own notes from previous grades
    const canEdit = note.teacherId === user?.id;
    if (canEdit) {
      console.log(`%c결과: 권한 있음 (자신이 작성한 노트)`, 'color: #2ecc71; font-weight: bold;');
    } else {
      console.log(`%c결과: 권한 없음 (다른 교사가 작성한 노트)`, 'color: #e74c3c; font-weight: bold;');
    }
    console.groupEnd();
    return canEdit;
  };
  
  // Handle create mode
  const handleCreateClick = () => {
    setCreateMode(true);
    setEditMode(false);
    setEditingNoteId(null);
    setSelectedGrade(student?.grade);
    resetForm();
  };
  
  // Handle edit mode
  const handleEditClick = (note) => {
    setEditMode(true);
    setCreateMode(false);
    setEditingNoteId(note.id);
    setSelectedGrade(note.grade);
    
    // Set form values
    setSpecialTalent(note.specialTalent || '');
    setStudentCareerAspiration(note.careerAspiration?.student || '');
    setParentCareerAspiration(note.careerAspiration?.parent || '');
    setNote(note.note || '');
  };
  
  // Reset form
  const resetForm = () => {
    setSpecialTalent('');
    setStudentCareerAspiration('');
    setParentCareerAspiration('');
    setNote('');
  };
  
  // Cancel edit/create mode
  const handleCancel = () => {
    setEditMode(false);
    setCreateMode(false);
    setEditingNoteId(null);
    setSelectedGrade(null);
    resetForm();
  };
  
  // Handle save (create or update)
  const handleSave = async () => {
    // Log permission check for save operation
    console.group('%c[SpecialNotesTab] 저장 작업 권한 체크', 'color: #9b59b6; font-weight: bold;');
    
    if (!isTeacher) {
      console.log('%c권한 없음: 사용자가 교사가 아님', 'color: #e74c3c;');
      console.groupEnd();
      return;
    }
    
    if (editMode && !canEditNote(specialNotes.find(note => note.id === editingNoteId))) {
      console.log('%c권한 없음: 해당 노트를 수정할 권한이 없음', 'color: #e74c3c;');
      console.groupEnd();
      return;
    }
    
    if (createMode && !isHomeroomTeacher) {
      console.log('%c권한 없음: 현재 학년 담임 교사가 아님', 'color: #e74c3c;');
      console.groupEnd();
      return;
    }
    
    console.log('%c권한 있음: 저장 작업 가능', 'color: #2ecc71;');
    console.groupEnd();
    
    // Validate form
    if (!specialTalent && !studentCareerAspiration && !parentCareerAspiration && !note) {
      alert('적어도 하나의 필드는 입력해야 합니다.');
      return;
    }
    
    if (!student) return;
    
    const specialNoteData = {
      studentId: student.id,
      grade: selectedGrade || student.grade,
      classNumber: student.classNumber,
      teacherId: user?.id,
      teacherName: user?.name,
      specialTalent,
      careerAspiration: {
        student: studentCareerAspiration,
        parent: parentCareerAspiration
      },
      note
    };
    
    try {
      if (editMode && editingNoteId) {
        await updateSpecialNote(editingNoteId, specialNoteData);
      } else if (createMode) {
        await createSpecialNote(specialNoteData);
      }
      
      // Reset after save
      handleCancel();
    } catch (error) {
      console.error('Failed to save special note:', error);
    }
  };
  
  // Handle delete
  const handleDelete = async (noteId) => {
    // Log permission check for delete operation
    const noteToDelete = specialNotes.find(note => note.id === noteId);
    
    console.group('%c[SpecialNotesTab] 삭제 작업 권한 체크', 'color: #9b59b6; font-weight: bold;');
    console.log('%c삭제하려는 노트:', 'color: #3498db;', noteToDelete);
    
    if (!isTeacher) {
      console.log('%c권한 없음: 사용자가 교사가 아님', 'color: #e74c3c;');
      console.groupEnd();
      return;
    }
    
    if (!canEditNote(noteToDelete)) {
      console.log('%c권한 없음: 해당 노트를 삭제할 권한이 없음', 'color: #e74c3c;');
      console.groupEnd();
      return;
    }
    
    console.log('%c권한 있음: 삭제 작업 가능', 'color: #2ecc71;');
    console.groupEnd();
    
    if (!window.confirm('정말로 이 특기사항을 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await deleteSpecialNote(noteId);
    } catch (error) {
      console.error('Failed to delete special note:', error);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'yyyy년 MM월 dd일', { locale: ko });
    } catch (error) {
      return dateString;
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <TabContainer>
        <LoadingMessage>특기사항을 불러오는 중입니다...</LoadingMessage>
      </TabContainer>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <TabContainer>
        <ErrorMessage>
          특기사항을 불러오는 중 오류가 발생했습니다: {error}
        </ErrorMessage>
      </TabContainer>
    );
  }
  
  // Render create form
  const renderCreateForm = () => {
    return (
      <CreateNoteSection>
        <CreateNoteHeader>
          <CreateTitle>새 특기사항 작성</CreateTitle>
        </CreateNoteHeader>
        
        <GradeSelector>
          <GradeButton 
            selected={selectedGrade === student?.grade}
            onClick={() => setSelectedGrade(student?.grade)}
          >
            {student?.grade}학년
          </GradeButton>
        </GradeSelector>
        
        <NoteCard>
          <ItemSection>
            <ItemHeader>
              <ItemTitle>특기 또는 흥미</ItemTitle>
            </ItemHeader>
            <InputField 
              value={specialTalent}
              onChange={(e) => setSpecialTalent(e.target.value)}
              placeholder="학생의 특기 또는 흥미를 입력하세요"
            />
          </ItemSection>
          
          <ItemSection>
            <ItemHeader>
              <ItemTitle>진로희망</ItemTitle>
            </ItemHeader>
            <CareerAspirationContainer>
              <CareerAspirationField>
                <CareerAspirationLabel>학생</CareerAspirationLabel>
                <InputField 
                  value={studentCareerAspiration}
                  onChange={(e) => setStudentCareerAspiration(e.target.value)}
                  placeholder="학생의 진로희망을 입력하세요"
                />
              </CareerAspirationField>
              <CareerAspirationField>
                <CareerAspirationLabel>학부모</CareerAspirationLabel>
                <InputField 
                  value={parentCareerAspiration}
                  onChange={(e) => setParentCareerAspiration(e.target.value)}
                  placeholder="학부모의 진로희망을 입력하세요"
                />
              </CareerAspirationField>
            </CareerAspirationContainer>
          </ItemSection>
          
          <ItemSection isLast>
            <ItemHeader>
              <ItemTitle>특기사항</ItemTitle>
            </ItemHeader>
            <TextArea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="학생의 특기사항을 입력하세요"
            />
          </ItemSection>
          
          <ButtonGroup>
            <ActionButton onClick={handleCancel}>취소</ActionButton>
            <ActionButton primary onClick={handleSave}>저장</ActionButton>
          </ButtonGroup>
        </NoteCard>
      </CreateNoteSection>
    );
  };
  
  // Render edit form
  const renderEditForm = () => {
    return (
      <CreateNoteSection>
        <CreateNoteHeader>
          <CreateTitle>특기사항 수정</CreateTitle>
        </CreateNoteHeader>
        
        <NoteCard>
          <ItemSection>
            <ItemHeader>
              <ItemTitle>특기 또는 흥미</ItemTitle>
            </ItemHeader>
            <InputField 
              value={specialTalent}
              onChange={(e) => setSpecialTalent(e.target.value)}
              placeholder="학생의 특기 또는 흥미를 입력하세요"
            />
          </ItemSection>
          
          <ItemSection>
            <ItemHeader>
              <ItemTitle>진로희망</ItemTitle>
            </ItemHeader>
            <CareerAspirationContainer>
              <CareerAspirationField>
                <CareerAspirationLabel>학생</CareerAspirationLabel>
                <InputField 
                  value={studentCareerAspiration}
                  onChange={(e) => setStudentCareerAspiration(e.target.value)}
                  placeholder="학생의 진로희망을 입력하세요"
                />
              </CareerAspirationField>
              <CareerAspirationField>
                <CareerAspirationLabel>학부모</CareerAspirationLabel>
                <InputField 
                  value={parentCareerAspiration}
                  onChange={(e) => setParentCareerAspiration(e.target.value)}
                  placeholder="학부모의 진로희망을 입력하세요"
                />
              </CareerAspirationField>
            </CareerAspirationContainer>
          </ItemSection>
          
          <ItemSection isLast>
            <ItemHeader>
              <ItemTitle>특기사항</ItemTitle>
            </ItemHeader>
            <TextArea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="학생의 특기사항을 입력하세요"
            />
          </ItemSection>
          
          <ButtonGroup>
            <ActionButton onClick={handleCancel}>취소</ActionButton>
            <ActionButton primary onClick={handleSave}>저장</ActionButton>
          </ButtonGroup>
        </NoteCard>
      </CreateNoteSection>
    );
  };
  
  // Render special notes list by grade
  const renderSpecialNotesByGrade = () => {
    if (sortedGrades.length === 0) {
      return (
        <EmptyNoteCard>
          <CardContent>아직 등록된 특기사항이 없습니다.</CardContent>
          {isHomeroomTeacher && (
            <AddButton primary onClick={handleCreateClick}>
              특기사항 추가하기
            </AddButton>
          )}
        </EmptyNoteCard>
      );
    }
    
    return sortedGrades.map(grade => {
      const notesForGrade = specialNotesByGrade[grade];
      
      return (
        <GradeSection key={grade}>
          <GradeHeader>{grade}학년 특기사항</GradeHeader>
          {notesForGrade.map(note => (
            <NoteCard key={note.id}>
              <ItemSection>
                <ItemHeader>
                  <ItemTitle>특기 또는 흥미</ItemTitle>
                </ItemHeader>
                <CardContent>{note.specialTalent || '정보 없음'}</CardContent>
              </ItemSection>
              
              <ItemSection>
                <ItemHeader>
                  <ItemTitle>진로희망</ItemTitle>
                </ItemHeader>
                <CareerAspirationContainer>
                  <CareerAspirationField>
                    <CareerAspirationLabel>학생</CareerAspirationLabel>
                    <CardContent>{note.careerAspiration?.student || '정보 없음'}</CardContent>
                  </CareerAspirationField>
                  <CareerAspirationField>
                    <CareerAspirationLabel>학부모</CareerAspirationLabel>
                    <CardContent>{note.careerAspiration?.parent || '정보 없음'}</CardContent>
                  </CareerAspirationField>
                </CareerAspirationContainer>
              </ItemSection>
              
              <ItemSection isLast>
                <ItemHeader>
                  <ItemTitle>특기사항</ItemTitle>
                </ItemHeader>
                <CardContent>{note.note || '정보 없음'}</CardContent>
              </ItemSection>
              
              <CardFooter>
                <TeacherInfo>작성: {note.teacherName}</TeacherInfo>
                <DateInfo>
                  {note.updatedAt !== note.createdAt 
                    ? `수정: ${formatDate(note.updatedAt)}` 
                    : `작성: ${formatDate(note.createdAt)}`}
                </DateInfo>
              </CardFooter>
              
              {canEditNote(note) && (
                <ButtonGroup>
                  <ActionButton onClick={() => handleEditClick(note)}>수정</ActionButton>
                  <ActionButton onClick={() => handleDelete(note.id)}>삭제</ActionButton>
                </ButtonGroup>
              )}
            </NoteCard>
          ))}
        </GradeSection>
      );
    });
  };
  
  // Main render
  return (
    <TabContainer>
      {/* Show create button if user is homeroom teacher and not in create/edit mode */}
      {isHomeroomTeacher && !createMode && !editMode && (
        <ButtonGroup>
          <ActionButton primary onClick={handleCreateClick}>
            새 특기사항 작성
          </ActionButton>
        </ButtonGroup>
      )}
      
      {/* Show create form if in create mode */}
      {createMode && renderCreateForm()}
      
      {/* Show edit form if in edit mode */}
      {editMode && renderEditForm()}
      
      {/* Show special notes list if not in create/edit mode */}
      {!createMode && !editMode && renderSpecialNotesByGrade()}
    </TabContainer>
  );
};

export default SpecialNotesTab;
