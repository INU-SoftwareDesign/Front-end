import React, { useState } from 'react';
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

const AttendanceModal = ({ 
  isOpen, 
  onClose, 
  attendanceType, 
  reasonType, 
  details, 
  canEdit,
  studentName,
  grade,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    attendanceType: attendanceType || 'absent',
    reasonType: reasonType || 'illness',
    date: new Date().toISOString().split('T')[0],
    reason: ''
  });
  
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
  
  const handleSubmit = () => {
    onSave({
      ...formData,
      attendanceType: formData.attendanceType || attendanceType,
      reasonType: formData.reasonType || reasonType
    });
    setIsEditing(false);
    setFormData({
      attendanceType: attendanceType || 'absent',
      reasonType: reasonType || 'illness',
      date: new Date().toISOString().split('T')[0],
      reason: ''
    });
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
                
                <ButtonGroup>
                  <CancelButton onClick={() => setIsEditing(false)}>
                    취소
                  </CancelButton>
                  <SaveButton 
                    onClick={handleSubmit}
                    disabled={!formData.date || !formData.reason}
                  >
                    저장
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
