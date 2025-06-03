import React, { useState, useEffect } from 'react';
import { addAttendanceRecord } from '../../api/attendanceApi';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h3`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 18px;
  color: #1D4EB0;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const DetailsList = styled.div`
  margin-bottom: 24px;
`;

const DetailItem = styled.div`
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailDate = styled.div`
  width: 120px;
  font-family: 'Pretendard-Medium', sans-serif;
  color: #333;
`;

const DetailReason = styled.div`
  flex: 1;
  font-family: 'Pretendard-Regular', sans-serif;
  color: #555;
`;

const NoDataMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: #888;
  font-family: 'Pretendard-Medium', sans-serif;
`;

const EditForm = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
`;

const FormTitle = styled.h4`
  font-family: 'Pretendard-SemiBold', sans-serif;
  font-size: 16px;
  color: #333;
  margin: 0 0 16px 0;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const FormLabel = styled.label`
  display: block;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 14px;
  margin-bottom: 12px;
  
  &:focus {
    outline: none;
    border-color: #1D4EB0;
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #1D4EB0;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #1D4EB0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  color: #666;
  
  &:hover:not(:disabled) {
    background-color: #e0e0e0;
  }
`;

const SaveButton = styled(Button)`
  background-color: #1D4EB0;
  border: 1px solid #1D4EB0;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #1A44A3;
  }
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #d32f2f;
  padding: 10px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 10px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 14px;
`;

const AttendanceModal = ({ 
  isOpen, 
  onClose, 
  attendanceType, 
  reasonType, 
  details, 
  canEdit,
  studentName,
  grade,
  studentId,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    attendanceType: attendanceType || 'absent',
    reasonType: reasonType || 'illness',
    date: new Date().toISOString().split('T')[0],
    reason: ''
  });
  
  // 서버 명명 규칙에 맞게 attendanceType 변환하는 함수
  const getServerAttendanceType = (type) => {
    switch (type) {
      case 'absent': return 'absence';
      case 'tardy': return 'lateness';
      default: return type;
    }
  };
  
  // UI 표시용 attendanceType으로 변환하는 함수 (서버 타입 → UI 타입)
  // 현재 사용되지 않지만 향후 사용을 위해 주석으로 보존
  /*
  const getUIAttendanceType = (type) => {
    switch (type) {
      case 'absence': return 'absent';
      case 'lateness': return 'tardy';
      default: return type;
    }
  };
  */
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        attendanceType: attendanceType || 'absent',
        reasonType: reasonType || 'illness',
        date: new Date().toISOString().split('T')[0],
        reason: ''
      });
      setError(null);
      setSuccess(null);
      
      // 디버깅 정보 출력
      console.log('모달 열림 - 데이터 확인:', {
        attendanceType,
        serverType: getServerAttendanceType(attendanceType),
        details
      });
    }
  }, [isOpen, attendanceType, reasonType, details]);
  
  if (!isOpen) return null;
  
  const attendanceTypeLabels = {
    absent: '결석',
    tardy: '지각',
    earlyLeave: '조퇴',
    result: '결과'
  };
  
  const reasonTypeLabels = {
    illness: '질병',
    unauthorized: '미인정',
    etc: '기타'
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async () => {
    // 학생 ID 디버깅 정보 추가
    console.log('현재 studentId 값:', studentId);
    console.log('학생 이름:', studentName);
    console.log('학년:', grade);
    
    if (!studentId) {
      console.error('학생 ID가 없습니다. 출결 데이터를 추가할 수 없습니다.');
      setError('학생 정보가 올바르지 않습니다. (학생 ID 없음)');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get current year
      const currentYear = new Date().getFullYear();
      
      // Get teacher name from localStorage (assuming it's stored there)
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const homeTeacher = user.name || '담당 교사';
      
      // studentId가 문자열인지 확인하고 수정
      const processedStudentId = typeof studentId === 'string' ? studentId : String(studentId);
      console.log(`출결 데이터 추가 요청: 학생 ID ${processedStudentId}`);
      
      // 서버 명명 규칙에 맞게 attendanceType 변환
      const serverAttendanceType = getServerAttendanceType(formData.attendanceType);
      console.log(`API 요청용 출결 타입 변환: ${formData.attendanceType} → ${serverAttendanceType}`);
      
      // Prepare data for API
      const attendanceData = {
        grade: grade,
        year: currentYear,
        attendanceType: serverAttendanceType, // 변환된 타입 사용
        reasonType: formData.reasonType,
        date: formData.date,
        reason: formData.reason,
        homeTeacher: homeTeacher
      };
      
      console.log('출결 데이터:', attendanceData);
      
      // Call API
      const response = await addAttendanceRecord(processedStudentId, attendanceData);
      console.log('출결 데이터 추가 성공:', response);
      
      // 저장 성공 메시지 표시
      setSuccess('출결 데이터가 성공적으로 저장되었습니다.');
      
      // Call the original onSave function to update UI with the response data
      if (typeof onSave === 'function') {
        // 저장된 데이터와 API 응답을 함께 전달하여 부모 컴포넌트에서 데이터 갱신 처리
        onSave({
          ...formData,
          attendanceType: formData.attendanceType || attendanceType,
          reasonType: formData.reasonType || reasonType,
          response: response,  // Include the API response
          success: true        // 성공 여부 표시
        });
      }
      
      // 잠시 후 모달 닫기 (성공 메시지 확인 시간 제공)
      setTimeout(() => {
        // Reset form and close modal
        setIsEditing(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('출결 데이터 추가 오류:', error);
      setError('출결 데이터 추가 중 오류가 발생했습니다: ' + (error.message || '알 수 없는 오류'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const hasDetails = details && details.length > 0;
  
  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            {studentName ? `${studentName} 학생 ` : ''}
            {grade}학년 {attendanceTypeLabels[attendanceType]}-{reasonTypeLabels[reasonType]} 내역
          </ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        {hasDetails ? (
          <DetailsList>
            {details.map((item, index) => (
              <DetailItem key={index}>
                <DetailDate>{item.date}</DetailDate>
                <DetailReason>{item.reason}</DetailReason>
              </DetailItem>
            ))}
          </DetailsList>
        ) : (
          <NoDataMessage>등록된 내역이 없습니다.</NoDataMessage>
        )}
        
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
        
        {success && (
          <SuccessMessage>{success}</SuccessMessage>
        )}
        
        {canEdit && (
          <>
            {!isEditing ? (
              <ButtonGroup>
                <SaveButton onClick={() => setIsEditing(true)}>
                  출결 내역 추가하기
                </SaveButton>
              </ButtonGroup>
            ) : (
              <EditForm>
                <FormTitle>출결 내역 추가</FormTitle>
                
                <FormGroup>
                  <FormLabel>출결 종류</FormLabel>
                  <FormSelect 
                    name="attendanceType"
                    value={formData.attendanceType}
                    onChange={handleInputChange}
                  >
                    <option value="absent">결석</option>
                    <option value="tardy">지각</option>
                    <option value="earlyLeave">조퇴</option>
                    <option value="result">결과</option>
                  </FormSelect>
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>사유 분류</FormLabel>
                  <FormSelect 
                    name="reasonType"
                    value={formData.reasonType}
                    onChange={handleInputChange}
                  >
                    <option value="illness">질병</option>
                    <option value="unauthorized">미인정</option>
                    <option value="etc">기타</option>
                  </FormSelect>
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>날짜</FormLabel>
                  <FormInput 
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>사유</FormLabel>
                  <FormTextarea 
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="출결 사유를 입력하세요."
                  />
                </FormGroup>
                
                {error && (
                  <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>
                    {error}
                  </div>
                )}
                
                <ButtonGroup>
                  <CancelButton 
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    취소
                  </CancelButton>
                  <SaveButton 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.date || !formData.reason}
                  >
                    {isSubmitting ? '저장 중...' : '저장'}
                  </SaveButton>
                </ButtonGroup>
              </EditForm>
            )}
          </>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AttendanceModal;
