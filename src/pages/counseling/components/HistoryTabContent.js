import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import counselingApi from '../../../api/counselingApi';

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

const PrimaryButton = styled.button`
  background-color: #1D4EB0;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #173d8a;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const DangerButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #d32f2f;
  }
  
  &:disabled {
    background-color: #ffcdd2;
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

const DetailButton = styled.button`
  background-color: #1D4EB0;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #1A44A3;
  }
`;

const RefreshButton = styled.button`
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  padding: 6px 12px;
  font-size: 14px;
  margin-left: 10px;
  cursor: pointer;
  float: right;
  
  &:hover:not(:disabled) {
    background-color: #e0e0e0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #f44336;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const NoDataMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const HistoryTabContent = ({ currentUser, counselingRecords, setCounselingRecords, isLoading, error, onRefresh }) => {
  const [selectedCounseling, setSelectedCounseling] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCounseling, setEditedCounseling] = useState({});
  const [availableTimes, setAvailableTimes] = useState([
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  
  // Sort counseling records by date (newest first)
  const sortedRecords = [...(counselingRecords || [])].sort((a, b) => {
    return new Date(b.counselingDate) - new Date(a.counselingDate);
  });
  
  // Handle detail button click
  const handleDetailClick = (counseling) => {
    // 초기 상태 설정
    setIsModalOpen(true);
    setIsEditing(false);
    setSelectedCounseling(counseling);
    
    // 상담 상세 정보 API 호출
    fetchCounselingDetails(counseling);
  };
  
  // 새로고침 버튼 클릭 핸들러
  const handleRefresh = () => {
    if (typeof onRefresh === 'function') {
      onRefresh();
    }
  };
  
  // 상담 상세 정보 가져오기
  const fetchCounselingDetails = async (counseling) => {
    if (!counseling || !counseling.id) return;
    
    setDetailLoading(true);
    
    try {
      // 학생 ID 처리 로직 (8자리 숫자 형식인 경우 뒤의 4자리에서 앞의 0 제거)
      let studentIdToUse = counseling.studentId;
      
      // 문자열로 변환
      const studentIdStr = String(counseling.studentId);
      
      // 8자리 숫자 형식인지 확인 (예: 20250100)
      if (studentIdStr.length === 8 && /^\d+$/.test(studentIdStr)) {
        // 뒤의 4자리 추출 후 앞의 0 제거 (예: 0100 -> 100)
        const last4Digits = studentIdStr.substring(4);
        studentIdToUse = parseInt(last4Digits, 10);
        console.log(`학생 ID 변환 (fetchCounselingDetails): ${studentIdStr} -> ${studentIdToUse}`);
      } else if (typeof studentIdStr === 'string' && studentIdStr.startsWith('student')) {
        // 'student' 접두사가 있는 경우 제거 (예: 'student100' -> '100')
        const numericPart = studentIdStr.replace('student', '');
        studentIdToUse = numericPart;
        console.log(`학생 ID 변환 (fetchCounselingDetails): ${studentIdStr} -> ${studentIdToUse}`);
      }
      
      // 상담 정보 API 호출 (통합된 API 사용)
      const response = await counselingApi.getStudentCounselings(studentIdToUse, {
        id: counseling.id // 특정 상담 ID만 조회
      });
      
      // API 응답 처리
      let detailedCounseling;
      
      if (response.data && response.data.data) {
        // 응답 데이터에서 해당 상담 정보 찾기
        detailedCounseling = response.data.data.find(item => item.id === counseling.id);
      }
      
      // 상세 정보가 없으면 기존 정보 사용
      if (!detailedCounseling) {
        detailedCounseling = counseling;
      }
      
      // 상담 정보 상태 업데이트
      setSelectedCounseling(detailedCounseling);
      setEditedCounseling({...detailedCounseling});
      
      console.log('상담 상세 정보 가져오기 성공:', detailedCounseling);
    } catch (error) {
      console.error('상담 상세 정보 가져오기 실패:', error);
      // 오류 발생 시 기본 상담 정보 사용
      setSelectedCounseling(counseling);
      setEditedCounseling({...counseling});
    }
  };
  
  // Handle edit button click
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  // Handle save button click
  const handleSaveClick = async () => {
    try {
      // 학생/학부모는 상담 시간과 내용만 수정 가능
      const updateData = {
        counselingTime: editedCounseling.counselingTime,
        requestContent: editedCounseling.requestContent
      };
      
      // API 호출
      const response = await counselingApi.updateCounseling(editedCounseling.id, updateData);
      
      if (response.data && response.data.success) {
        console.log('상담 정보 수정 성공:', response.data);
        alert(response.data.data.message || '상담 정보가 성공적으로 수정되었습니다.');
        
        // 로컬 상태 업데이트
        setCounselingRecords(prevRecords => 
          prevRecords.map(record => 
            record.id === editedCounseling.id ? editedCounseling : record
          )
        );
        setSelectedCounseling(editedCounseling);
        setIsEditing(false);
        
        // 상담 상세 정보 다시 불러오기
        if (selectedCounseling) {
          fetchCounselingDetails(selectedCounseling);
        }
      } else {
        alert('상담 정보 수정 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('상담 정보 수정 실패:', error);
      alert('상담 정보 수정 중 오류가 발생했습니다.');
    }
  };
  
  // Handle cancel button click
  const handleCancelCounseling = async () => {
    if (!selectedCounseling) return;
    
    if (window.confirm('상담 예약을 취소하시겠습니까?')) {
      try {
        // API 호출
        const response = await counselingApi.deleteCounseling(selectedCounseling.id);
        
        if (response.data && response.data.success) {
          console.log('상담 취소 성공:', response.data);
          alert(response.data.data.message || '상담 예약이 취소되었습니다.');
          
          // 로컬 상태 업데이트
          setCounselingRecords(prevRecords => 
            prevRecords.filter(record => record.id !== selectedCounseling.id)
          );
          closeModal();
        } else if (response.data && !response.data.success) {
          // 오류 메시지 처리
          const errorMessage = response.data.error?.message || '상담 취소 중 오류가 발생했습니다.';
          alert(errorMessage);
          
          // 완료된 상담 취소 시도 시 추가 안내
          if (response.data.error?.code === 'CANNOT_CANCEL_COMPLETED') {
            alert('이미 완료된 상담은 취소할 수 없습니다.');
          }
        }
      } catch (error) {
        console.error('상담 취소 실패:', error);
        alert('상담 취소 중 오류가 발생했습니다.');
      }
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
    // 상담 상태가 '완료'가 아닐 때만 수정 가능
    return counseling && counseling.status !== '완료';
  };
  
  return (
    <Container>
      <TableContainer>
        <TableTitle>
          상담 내역
          <RefreshButton onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? '불러오는 중...' : '새로고침'}
          </RefreshButton>
        </TableTitle>
        
        {isLoading ? (
          <LoadingMessage>상담 내역을 불러오는 중입니다...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : sortedRecords.length === 0 ? (
          <NoDataMessage>상담 내역이 없습니다.</NoDataMessage>
        ) : (
          <CounselingTable>
            <TableHeader>
              <tr>
                <TableHeaderCell>신청일</TableHeaderCell>
                <TableHeaderCell>상담일</TableHeaderCell>
                <TableHeaderCell>상담시간</TableHeaderCell>
                <TableHeaderCell>상담유형</TableHeaderCell>
                <TableHeaderCell>상담주제</TableHeaderCell>
                <TableHeaderCell>상담사</TableHeaderCell>
                <TableHeaderCell>상태</TableHeaderCell>
                <TableHeaderCell>상세보기</TableHeaderCell>
              </tr>
            </TableHeader>
            <tbody>
              {sortedRecords.map((counseling, index) => (
                <TableRow key={index}>
                  <TableCell>{counseling.requestDate}</TableCell>
                  <TableCell>{counseling.counselingDate}</TableCell>
                  <TableCell>{counseling.counselingTime}</TableCell>
                  <TableCell>{counseling.counselingType}</TableCell>
                  <TableCell>{counseling.counselingCategory}</TableCell>
                  <TableCell>{counseling.counselorName}</TableCell>
                  <TableCell>
                    <StatusBadge status={counseling.status}>
                      {counseling.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <DetailButton onClick={() => handleDetailClick(counseling)}>
                      상세보기
                    </DetailButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </CounselingTable>
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
                      ? `${currentUser.grade}학년 ${currentUser.classNumber}반 ${currentUser.number}번`
                      : `${selectedCounseling.grade}학년 ${selectedCounseling.classNumber}반 ${selectedCounseling.number}번`
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
              {isEditing ? (
                <>
                  <CancelButton onClick={() => setIsEditing(false)}>
                    취소
                  </CancelButton>
                  <SaveButton onClick={handleSaveClick}>
                    저장
                  </SaveButton>
                </>
              ) : (
                <>
                  <PrimaryButton onClick={handleEditClick} disabled={!canModify(selectedCounseling)}>
                    수정
                  </PrimaryButton>
                  {canModify(selectedCounseling) && (
                    <DangerButton onClick={handleCancelCounseling}>
                      예약취소
                    </DangerButton>
                  )}
                </>
              )}
            </ButtonContainer>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default HistoryTabContent;
