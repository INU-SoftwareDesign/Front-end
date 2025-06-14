import React, { useState } from "react";
import { toast } from "react-toastify";
import { updateStudentInfo } from "../../../api/studentApi";
import styled from "styled-components";

const TabContainer = styled.div`
  display: flex;
  gap: 32px;
`;

const LeftSection = styled.div`
  width: 240px;
`;

const RightSection = styled.div`
  flex: 1;
`;

const ProfileImageContainer = styled.div`
  width: 240px;
  height: 280px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ChangeImageButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #1d4eb0;
  color: white;
  border: none;
  border-radius: 4px;
  font-family: "Pretendard-Medium", sans-serif;
  cursor: pointer;

  &:hover {
    background-color: #1a44a3;
  }
`;

const InfoSection = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 18px;
  color: #1d4eb0;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ddd;
`;

const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px;
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 14px;
  color: #555;
  width: 120px;
  vertical-align: top;
`;

const TableData = styled.td`
  padding: 12px;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 14px;
  color: #333;
`;

const AcademicHistoryItem = styled.div`
  margin-bottom: 8px;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 14px;
  color: #333;
`;

const EditButton = styled.button`
  padding: 8px 16px;
  background-color: #1d4eb0;
  color: white;
  border: none;
  border-radius: 4px;
  font-family: "Pretendard-Medium", sans-serif;
  cursor: pointer;
  margin-top: 16px;
  
  &:hover {
    background-color: #1a44a3;
  }
`;

const CancelButton = styled(EditButton)`
  background-color: #6c757d;
  margin-right: 8px;
  
  &:hover {
    background-color: #5a6268;
  }
`;

const SaveButton = styled(EditButton)`
  background-color: #28a745;
  
  &:hover {
    background-color: #218838;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 12px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 4px;
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 14px;
  color: #555;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #1d4eb0;
    box-shadow: 0 0 0 2px rgba(29, 78, 176, 0.2);
  }
`;

// Removed unused FormTextarea component

const AddButton = styled.button`
  padding: 4px 8px;
  background-color: #1d4eb0;
  color: white;
  border: none;
  border-radius: 4px;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 12px;
  cursor: pointer;
  margin-left: 8px;
  
  &:hover {
    background-color: #1a44a3;
  }
`;

const RemoveButton = styled.button`
  padding: 4px 8px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 12px;
  cursor: pointer;
  margin-left: 8px;
  
  &:hover {
    background-color: #c82333;
  }
`;

const HistoryItemContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const AcademicRecordContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const PersonalInfoTab = ({ student, currentUser, refreshStudentData }) => {
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(student ? {
    student_id: student.studentId,
    student_number: student.number,
    classroom: student.classNumber,
    profile_image: student.profileImage || 'https://cdn-icons-png.flaticon.com/512/8847/8847419.png',
    history: student.history ? [...student.history] : [],
    academicRecords: student.academicRecords ? [...student.academicRecords.map(record => ({ description: record }))] : []
  } : {});
  
  // Format date for display (YYYY-MM-DD to YYYY년 MM월 DD일)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const [year, month, day] = dateString.split('-');
      return `${year}년 ${month}월 ${day}일`;
    } catch (error) {
      return dateString;
    }
  };

  // Check if the current user is the homeroom teacher of this student
  // 개발 환경에서는 조건을 완화하여 테스트할 수 있도록 합니다
  const isDev = process.env.NODE_ENV === 'development';
  
  
  // 학생과 교사의 학년/반이 일치하는지 확인하여 담임 교사 여부 계산
  const calculatedIsHomeroom = currentUser?.role === "teacher" && 
    String(currentUser?.grade) === String(student.grade) && 
    String(currentUser?.classNumber) === String(student.classNumber);
  
  // useEffect를 사용하지 않고 담임 교사 여부를 계산만 합니다.
  // useEffect와 Zustand 업데이트를 사용하면 무한 업데이트 루프가 발생할 수 있습니다.
  
  // 디버깅을 위한 로그 추가
  console.log('담임 교사 확인 데이터:', {
    currentUser,
    studentGrade: student.grade,
    studentClass: student.classNumber,
    teacherGrade: currentUser?.grade,
    teacherClass: currentUser?.classNumber,
    isTeacher: currentUser?.role === "teacher",
    isHomeroom: calculatedIsHomeroom, // 계산된 값만 사용
    calculatedIsHomeroom // 계산된 담임 교사 여부
  });
  
  // 개발 환경에서는 교사 권한만 있으면 수정 가능하도록 설정
  const isHomeroomTeacher = currentUser && 
    currentUser.role === "teacher" && 
    (isDev || calculatedIsHomeroom); // 계산된 담임 교사 여부 사용

  // Check if the current user can edit profile
  const canEditProfile = currentUser && (
    isHomeroomTeacher || currentUser.id === student.studentId
  );

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle history item changes
  const handleHistoryChange = (index, field, value) => {
    const updatedHistory = [...formData.history];
    updatedHistory[index] = {
      ...updatedHistory[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      history: updatedHistory
    }));
  };

  // Add new history item
  const addHistoryItem = () => {
    setFormData(prev => ({
      ...prev,
      history: [
        ...prev.history,
        { grade: '', classNumber: '', number: '', homeroom_teacher: '' }
      ]
    }));
  };

  // Remove history item
  const removeHistoryItem = (index) => {
    const updatedHistory = [...formData.history];
    updatedHistory.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      history: updatedHistory
    }));
  };

  // Handle academic record changes
  const handleAcademicRecordChange = (index, value) => {
    const updatedRecords = [...formData.academicRecords];
    updatedRecords[index] = { description: value };
    setFormData(prev => ({
      ...prev,
      academicRecords: updatedRecords
    }));
  };

  // Add new academic record
  const addAcademicRecord = () => {
    setFormData(prev => ({
      ...prev,
      academicRecords: [
        ...prev.academicRecords,
        { description: '' }
      ]
    }));
  };

  // Remove academic record
  const removeAcademicRecord = (index) => {
    const updatedRecords = [...formData.academicRecords];
    updatedRecords.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      academicRecords: updatedRecords
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      console.log('학생 정보 업데이트 시작...', {
        studentId: student.studentId,
        formData: formData
      });
      
      // Prepare data for API
      const apiData = {
        ...formData,
        // history 배열의 각 항목에서 homeroom_teacher 키가 있는지 확인하고, 있다면 그대로 사용
        history: formData.history.map(item => {
          // 기존 항목 복사
          const newItem = { ...item };
          
          // homeroom_teacher 키가 있는지 확인
          if ('homeroom_teacher' in newItem) {
            // 키 값 유지 (백엔드에서 기대하는 형식)
            console.log('항목에 homeroom_teacher 키 발견:', newItem);
          } else if ('homeroomTeacher' in newItem) {
            // 이전 형식의 키가 있는 경우, 새 형식으로 변환
            console.log('항목에 homeroomTeacher 키 발견, 변환 필요:', newItem);
            newItem.homeroom_teacher = newItem.homeroomTeacher;
            delete newItem.homeroomTeacher;
          }
          
          return newItem;
        }),
        academicRecords: formData.academicRecords.map(record => record.description)
      };
      
      console.log('변환된 history 데이터:', apiData.history);
      
      // Call API to update student info
      console.log('학생 정보 업데이트 API 호출 전:', student.studentId, apiData);
      const result = await updateStudentInfo(student.studentId, apiData);
      console.log('학생 정보 업데이트 API 호출 결과:', result);
      
      // Show success message
      toast.success('학생 정보가 성공적으로 업데이트되었습니다.');
      
      // 백엔드에서 최신 데이터를 가져오기 위해 refreshStudentData 함수 호출
      if (refreshStudentData) {
        console.log('학생 데이터 새로고침 함수 호출 전...');
        try {
          await refreshStudentData();
          console.log('학생 데이터 새로고침 완료!');
        } catch (refreshError) {
          console.error('학생 데이터 새로고침 실패:', refreshError);
          // 새로고침 실패 시 로컬 업데이트 실행
          student.studentId = formData.student_id;
          student.number = formData.student_number;
          student.classNumber = formData.classroom;
          student.profileImage = formData.profile_image;
          student.history = [...formData.history];
          student.academicRecords = formData.academicRecords.map(record => record.description);
        }
      } else {
        // refreshStudentData가 없는 경우 fallback으로 로컬 객체 업데이트
        console.warn('refreshStudentData 함수가 전달되지 않았습니다. 로컬 객체만 업데이트합니다.');
        student.studentId = formData.student_id;
        student.number = formData.student_number;
        student.classNumber = formData.classroom;
        student.profileImage = formData.profile_image;
        student.history = [...formData.history];
        student.academicRecords = formData.academicRecords.map(record => record.description);
      }
      
      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error('학생 정보 업데이트 오류:', error);
      toast.error(error.message || '학생 정보 업데이트에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel editing and reset form data
  const handleCancel = () => {
    setFormData({
      student_id: student.studentId,
      student_number: student.number,
      classroom: student.classNumber,
      profile_image: student.profileImage || 'https://cdn-icons-png.flaticon.com/512/8847/8847419.png',
      history: student.history ? [...student.history] : [],
      academicRecords: student.academicRecords ? [...student.academicRecords.map(record => ({ description: record }))] : []
    });
    setIsEditing(false);
  };

  // Early return if student data is not available
  if (!student) return null;
  
  return (
    <TabContainer>
      <LeftSection>
        <ProfileImageContainer>
          <ProfileImage 
            src={isEditing ? formData.profile_image : (student.profileImage || 'https://cdn-icons-png.flaticon.com/512/8847/8847419.png')} 
            alt={student.name} 
          />
        </ProfileImageContainer>
        {isEditing ? (
          <FormGroup>
            <FormLabel>프로필 이미지 URL</FormLabel>
            <FormInput 
              type="text" 
              name="profile_image" 
              value={formData.profile_image} 
              onChange={handleInputChange} 
              placeholder="이미지 URL을 입력하세요"
            />
          </FormGroup>
        ) : (
          canEditProfile && <ChangeImageButton>이미지 변경</ChangeImageButton>
        )}
        
        {/* Edit button - Only visible for homeroom teachers */}
        {isHomeroomTeacher && !isEditing && (
          <EditButton onClick={() => setIsEditing(true)}>수정하기</EditButton>
        )}
      </LeftSection>

      <RightSection>
        <InfoSection>
          <SectionTitle>인적사항</SectionTitle>
          {isEditing ? (
            <>
              <FormGroup>
                <FormLabel>학번</FormLabel>
                <FormInput 
                  type="text" 
                  name="student_id" 
                  value={formData.student_id} 
                  onChange={handleInputChange} 
                  placeholder="학번을 입력하세요"
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>번호</FormLabel>
                <FormInput 
                  type="number" 
                  name="student_number" 
                  value={formData.student_number} 
                  onChange={handleInputChange} 
                  placeholder="번호를 입력하세요"
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>반</FormLabel>
                <FormInput 
                  type="number" 
                  name="classroom" 
                  value={formData.classroom} 
                  onChange={handleInputChange} 
                  placeholder="반을 입력하세요"
                />
              </FormGroup>
            </>
          ) : (
            <InfoTable>
              <tbody>
                <TableRow>
                  <TableHeader>이름</TableHeader>
                  <TableData>{student.name}</TableData>
                </TableRow>
                <TableRow>
                  <TableHeader>학번</TableHeader>
                  <TableData>{student.studentId}</TableData>
                </TableRow>
                <TableRow>
                  <TableHeader>학년/반/번호</TableHeader>
                  <TableData>
                    {student.grade}학년 {student.classNumber}반{" "}
                    {student.number}번
                  </TableData>
                </TableRow>
                <TableRow>
                  <TableHeader>생년월일</TableHeader>
                  <TableData>{formatDate(student.birthDate)}</TableData>
                </TableRow>
                <TableRow>
                  <TableHeader>주소</TableHeader>
                  <TableData>{student.address}</TableData>
                </TableRow>
                <TableRow>
                  <TableHeader>부</TableHeader>
                  <TableData>{student.fatherName}</TableData>
                </TableRow>
                <TableRow>
                  <TableHeader>모</TableHeader>
                  <TableData>{student.motherName}</TableData>
                </TableRow>
              </tbody>
            </InfoTable>
          )}
        </InfoSection>

        <InfoSection>
          <SectionTitle>과거 반 이력</SectionTitle>
          {isEditing ? (
            <>
              {formData.history.map((history, index) => (
                <HistoryItemContainer key={index}>
                  <FormInput 
                    type="number" 
                    value={history.grade} 
                    onChange={(e) => handleHistoryChange(index, 'grade', e.target.value)} 
                    placeholder="학년"
                    style={{ width: '60px', marginRight: '8px' }}
                  />
                  <FormInput 
                    type="number" 
                    value={history.classNumber} 
                    onChange={(e) => handleHistoryChange(index, 'classNumber', e.target.value)} 
                    placeholder="반"
                    style={{ width: '60px', marginRight: '8px' }}
                  />
                  <FormInput 
                    type="number" 
                    value={history.number} 
                    onChange={(e) => handleHistoryChange(index, 'number', e.target.value)} 
                    placeholder="번호"
                    style={{ width: '60px', marginRight: '8px' }}
                  />
                  <FormInput 
                    type="text" 
                    value={history.homeroom_teacher} 
                    onChange={(e) => handleHistoryChange(index, 'homeroom_teacher', e.target.value)} 
                    placeholder="담임 교사"
                    style={{ flex: 1 }}
                  />
                  <RemoveButton onClick={() => removeHistoryItem(index)}>삭제</RemoveButton>
                </HistoryItemContainer>
              ))}
              <AddButton onClick={addHistoryItem}>이력 추가</AddButton>
            </>
          ) : (
            <InfoTable>
              <tbody>
                {student.history && student.history.map((history, index) => (
                  <TableRow key={index}>
                    <TableHeader>{history.grade}학년</TableHeader>
                    <TableData>
                      {history.classNumber}반 {history.number}번 (담임:{" "}
                      {history.homeroom_teacher})
                    </TableData>
                  </TableRow>
                ))}
              </tbody>
            </InfoTable>
          )}
        </InfoSection>

        <InfoSection>
          <SectionTitle>학적사항</SectionTitle>
          {isEditing ? (
            <>
              {formData.academicRecords.map((record, index) => (
                <AcademicRecordContainer key={index}>
                  <FormInput 
                    type="text" 
                    value={record.description} 
                    onChange={(e) => handleAcademicRecordChange(index, e.target.value)} 
                    placeholder="학적 사항을 입력하세요"
                    style={{ flex: 1 }}
                  />
                  <RemoveButton onClick={() => removeAcademicRecord(index)}>삭제</RemoveButton>
                </AcademicRecordContainer>
              ))}
              <AddButton onClick={addAcademicRecord}>학적사항 추가</AddButton>
            </>
          ) : (
            <>
              {student.academicRecords && student.academicRecords.map((item, index) => (
                <AcademicHistoryItem key={index}>• {item}</AcademicHistoryItem>
              ))}
            </>
          )}
        </InfoSection>
        
        {isEditing && (
          <ButtonContainer>
            <CancelButton onClick={handleCancel} disabled={isSubmitting}>수정 취소</CancelButton>
            <SaveButton onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : '수정 완료'}
            </SaveButton>
          </ButtonContainer>
        )}
      </RightSection>
    </TabContainer>
  );
};

export default PersonalInfoTab;
