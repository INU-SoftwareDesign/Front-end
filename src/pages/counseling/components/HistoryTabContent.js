import React, { useState } from 'react';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TableContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-x: auto;
`;

const TableTitle = styled.h2`
  font-family: 'Pretendard-SemiBold', sans-serif;
  color: #333;
  margin-bottom: 16px;
  font-size: 1.2rem;
`;

const CounselingTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const TableHeader = styled.thead`
  background-color: #1D4EB0;
  color: white;
`;

const TableHeaderCell = styled.th`
  padding: 12px 15px;
  text-align: center;
  font-weight: 500;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
  &:hover {
    background-color: #e9e9e9;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  text-align: center;
`;

const ActionButton = styled.button`
  background-color: ${props => props.color || '#1D4EB0'};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Pretendard-Medium', sans-serif;
  margin: 0 4px;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${props => {
    switch(props.status) {
      case '완료': return '#4CAF50';
      case '예약확정': return '#2196F3';
      case '대기': return '#FFC107';
      default: return '#9E9E9E';
    }
  }};
  color: white;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
`;

const EmptyStateText = styled.p`
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 18px;
  color: #666;
`;

// Modal Components
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
  padding: 24px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-family: 'Pretendard-Bold', sans-serif;
  color: #1D4EB0;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const InfoSection = styled.div`
  margin-bottom: 20px;
`;

const InfoTitle = styled.h3`
  font-family: 'Pretendard-Medium', sans-serif;
  color: #333;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const InfoItem = styled.div`
  margin-bottom: 8px;
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: #666;
  display: block;
  margin-bottom: 4px;
`;

const InfoValue = styled.span`
  color: #333;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Pretendard-Regular', sans-serif;
  resize: vertical;
  min-height: 100px;
  margin-top: 8px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Pretendard-Regular', sans-serif;
  margin-top: 8px;
  
  option:disabled {
    color: #999;
    background-color: #f5f5f5;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SaveButton = styled(Button)`
  background-color: #4CAF50;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #45a049;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f44336;
  color: white;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const HistoryTabContent = ({ currentUser, counselingRecords, setCounselingRecords }) => {
  const [selectedCounseling, setSelectedCounseling] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCounseling, setEditedCounseling] = useState({});
  const [availableTimes, setAvailableTimes] = useState([
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ]);
  const [bookedTimes, setBookedTimes] = useState([]);
  
  // Sort counseling records by date (newest first)
  const sortedRecords = [...counselingRecords].sort((a, b) => {
    return new Date(b.counselingDate) - new Date(a.counselingDate);
  });
  
  // Handle detail button click
  const handleDetailClick = (counseling) => {
    setSelectedCounseling(counseling);
    setEditedCounseling({...counseling});
    setIsModalOpen(true);
    setIsEditing(false);
    
    // Get booked times for the counseling date
    // In a real app, this would be fetched from an API
    const bookedForDate = Object.entries(dummyBookedTimes)
      .find(([date]) => date === counseling.counselingDate);
    
    if (bookedForDate) {
      setBookedTimes(bookedForDate[1].filter(time => time !== counseling.counselingTime));
    } else {
      setBookedTimes([]);
    }
  };
  
  // Handle edit button click
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  // Handle save button click
  const handleSaveClick = () => {
    // In a real app, this would make an API call to update the counseling record
    setCounselingRecords(prevRecords => 
      prevRecords.map(record => 
        record.id === editedCounseling.id ? editedCounseling : record
      )
    );
    setSelectedCounseling(editedCounseling);
    setIsEditing(false);
  };
  
  // Handle cancel button click
  const handleCancelCounseling = () => {
    if (window.confirm('상담 예약을 취소하시겠습니까?')) {
      // In a real app, this would make an API call to cancel the counseling
      setCounselingRecords(prevRecords => 
        prevRecords.filter(record => record.id !== selectedCounseling.id)
      );
      closeModal();
    }
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCounseling(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCounseling(null);
    setIsEditing(false);
  };
  
  // Dummy booked times for demonstration
  const dummyBookedTimes = {
    "2025-05-05": ["10:00", "13:30", "15:00"],
    "2025-05-06": ["09:30", "11:00", "14:30"],
    "2025-05-10": ["09:00", "13:00", "16:30"],
    "2025-05-12": ["10:30", "15:30"],
    "2025-05-15": ["11:30", "14:00", "17:00"]
  };
  
  // Check if counseling can be canceled or modified
  const canModify = (counseling) => {
    return counseling.status !== '완료';
  };
  
  return (
    <Container>
      <TableContainer>
        <TableTitle>상담 내역</TableTitle>
        
        {sortedRecords.length > 0 ? (
          <CounselingTable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>번호</TableHeaderCell>
                <TableHeaderCell>상담 날짜</TableHeaderCell>
                <TableHeaderCell>상담 시간</TableHeaderCell>
                <TableHeaderCell>상담자명</TableHeaderCell>
                <TableHeaderCell>상담종류</TableHeaderCell>
                <TableHeaderCell>상담유형</TableHeaderCell>
                <TableHeaderCell>상태</TableHeaderCell>
                <TableHeaderCell>상세보기</TableHeaderCell>
                <TableHeaderCell>예약취소</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {sortedRecords.map((counseling, index) => (
                <TableRow key={counseling.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{counseling.counselingDate}</TableCell>
                  <TableCell>{counseling.counselingTime}</TableCell>
                  <TableCell>{counseling.counselorName}</TableCell>
                  <TableCell>{counseling.counselingType}</TableCell>
                  <TableCell>{counseling.counselingCategory}</TableCell>
                  <TableCell>
                    <StatusBadge status={counseling.status}>
                      {counseling.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleDetailClick(counseling)}>
                      상세보기
                    </ActionButton>
                  </TableCell>
                  <TableCell>
                    <ActionButton 
                      color="#f44336"
                      onClick={() => {
                        setSelectedCounseling(counseling);
                        handleCancelCounseling();
                      }}
                      disabled={!canModify(counseling)}
                    >
                      취소
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </CounselingTable>
        ) : (
          <EmptyState>
            <EmptyStateText>
              상담 내역이 없습니다.
            </EmptyStateText>
          </EmptyState>
        )}
      </TableContainer>
      
      {isModalOpen && selectedCounseling && (
        <ModalOverlay>
          <ModalContainer>
            <ModalHeader>
              <ModalTitle>상담 상세 정보</ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            
            <InfoSection>
              <InfoTitle>{currentUser.role === 'student' ? '학생 정보' : '학생/학부모 정보'}</InfoTitle>
              <InfoGrid>
                {currentUser.role === 'parent' && (
                  <InfoItem>
                    <InfoLabel>학부모 이름</InfoLabel>
                    <InfoValue>{currentUser.name}</InfoValue>
                  </InfoItem>
                )}
                <InfoItem>
                  <InfoLabel>학생 이름</InfoLabel>
                  <InfoValue>{currentUser.role === 'student' ? currentUser.name : selectedCounseling.studentName}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>학년/반/번호</InfoLabel>
                  <InfoValue>
                    {currentUser.role === 'student' 
                      ? `${currentUser.grade}학년 ${currentUser.class}반 ${currentUser.number}번`
                      : `${selectedCounseling.grade}학년 ${selectedCounseling.class}반 ${selectedCounseling.number}번`
                    }
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>연락처</InfoLabel>
                  <InfoValue>{selectedCounseling.contactNumber}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </InfoSection>
            
            <InfoSection>
              <InfoTitle>상담 정보</InfoTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>상담 날짜</InfoLabel>
                  <InfoValue>{selectedCounseling.counselingDate}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상담 시간</InfoLabel>
                  {isEditing ? (
                    <Select
                      name="counselingTime"
                      value={editedCounseling.counselingTime}
                      onChange={handleInputChange}
                    >
                      <option value={selectedCounseling.counselingTime}>
                        {selectedCounseling.counselingTime} (현재)
                      </option>
                      {availableTimes.map((time) => (
                        <option 
                          key={time} 
                          value={time}
                          disabled={bookedTimes.includes(time)}
                        >
                          {time}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <InfoValue>{selectedCounseling.counselingTime}</InfoValue>
                  )}
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상담자</InfoLabel>
                  <InfoValue>{selectedCounseling.counselorName}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상담 장소</InfoLabel>
                  <InfoValue>{selectedCounseling.location || '미정'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상담 종류</InfoLabel>
                  <InfoValue>{selectedCounseling.counselingType}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상담 유형</InfoLabel>
                  <InfoValue>{selectedCounseling.counselingCategory}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상담 상태</InfoLabel>
                  <StatusBadge status={selectedCounseling.status}>
                    {selectedCounseling.status}
                  </StatusBadge>
                </InfoItem>
              </InfoGrid>
            </InfoSection>
            
            <InfoSection>
              <InfoTitle>상담 내용</InfoTitle>
              {isEditing ? (
                <TextArea
                  name="requestContent"
                  value={editedCounseling.requestContent}
                  onChange={handleInputChange}
                  placeholder="상담 내용을 입력하세요."
                />
              ) : (
                <InfoValue>{selectedCounseling.requestContent}</InfoValue>
              )}
            </InfoSection>
            
            {selectedCounseling.status === '완료' && (
              <InfoSection>
                <InfoTitle>상담 결과</InfoTitle>
                <InfoValue>
                  {selectedCounseling.resultContent || '상담 결과가 아직 입력되지 않았습니다.'}
                </InfoValue>
              </InfoSection>
            )}
            
            <ButtonContainer>
              {canModify(selectedCounseling) && !isEditing && (
                <ActionButton onClick={handleEditClick}>
                  수정하기
                </ActionButton>
              )}
              {isEditing && (
                <>
                  <CancelButton onClick={() => setIsEditing(false)}>
                    취소
                  </CancelButton>
                  <SaveButton onClick={handleSaveClick}>
                    저장
                  </SaveButton>
                </>
              )}
              {canModify(selectedCounseling) && (
                <CancelButton onClick={handleCancelCounseling}>
                  예약 취소
                </CancelButton>
              )}
            </ButtonContainer>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default HistoryTabContent;
