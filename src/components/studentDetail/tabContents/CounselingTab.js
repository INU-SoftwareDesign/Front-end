import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import counselingApi from '../../../api/counselingApi';

const TabContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  min-height: 300px;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 20px;
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

const DetailButton = styled.button`
  background-color: #1D4EB0;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Pretendard-Medium', sans-serif;
  
  &:hover {
    background-color: #1A44A3;
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
      case '대기': return '#FFC107';
      case '보류': return '#F44336';
      default: return '#9E9E9E';
    }
  }};
  color: white;
`;

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
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Pretendard-Regular', sans-serif;
  margin-top: 8px;
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

const CounselingTab = ({ student, studentUrlId, forceLoad = false, currentUser }) => {
  // 디버깅용 로그
  console.log('CounselingTab 컴포넌트 렌더링:', { studentUrlId, studentId: student?.studentId, forceLoad });
  
  const [counselingRecords, setCounselingRecords] = useState([]);
  const [selectedCounseling, setSelectedCounseling] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCounseling, setEditedCounseling] = useState({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 상담 데이터 가져오기
  useEffect(() => {
    // URL에서 가져온 ID가 있으면 그것을 사용, 없으면 student 객체의 studentId 필요
    if (studentUrlId || (student && student.studentId)) {
      console.log('CounselingTab 컴포넌트 마운트 시 데이터 가져오기 시도:', { studentUrlId, studentId: student?.studentId });
      const idToUse = studentUrlId || student.studentId;
      fetchCounselingRecords(idToUse);
    }
  }, [studentUrlId, student]);
  
  // forceLoad prop이 변경될 때 데이터 다시 가져오기 (탭 클릭 시)
  useEffect(() => {
    // URL에서 가져온 ID가 있으면 그것을 사용, 없으면 student 객체의 studentId 필요
    if (studentUrlId || (student && student.studentId)) {
      console.log('forceLoad useEffect 호출:', { forceLoad, studentUrlId, studentId: student?.studentId });
      
      // forceLoad가 변경되면 항상 API 호출
      console.log('CounselingTab이 활성화되어 데이터를 다시 가져옵니다.');
      // 비동기 함수 호출을 위해 setTimeout 사용
      setTimeout(() => {
        console.log('상담 데이터 가져오기 시작...');
        const idToUse = studentUrlId || student.studentId;
        fetchCounselingRecords(idToUse);
      }, 0);
    }
  }, [forceLoad, studentUrlId, student]);

  // Function to fetch counseling records from API
  const fetchCounselingRecords = async (studentId) => {
    if (!studentId) {
      console.error('유효한 studentId가 없습니다.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      console.log('API 호출 studentId:', studentId);
      
      // 임시 해결책: 더미 데이터 직접 사용
      const dummyData = [
        {
          id: 401,
          studentId: 1, // 홍길동1의 ID가 1인 경우를 가정
          studentName: '홍길동1',
          grade: '1',
          classNumber: '7',
          number: '1',
          requestDate: '2025-04-25',
          counselingDate: '2025-05-05',
          counselingTime: '10:00',
          counselorName: '김교수',
          counselingType: '교수상담',
          counselingCategory: '학업',
          status: '예약확정',
          location: '교수연구실 A-301',
          requestContent: '중간고사 결과에 대한 피드백을 받고 싶습니다.',
          resultContent: '',
          contactNumber: '010-1234-5678'
        }
      ];
      
      // API 호출 시도
      const response = await counselingApi.getStudentCounselings(studentId);
      
      if (response.data && response.data.success) {
        console.log('API 응답 데이터:', response.data.data);
        
        // API 응답 데이터가 비어있으면 더미 데이터 사용
        if (response.data.data && response.data.data.length > 0) {
          setCounselingRecords(response.data.data);
          console.log('학생 상담 내역 조회 성공:', response.data.data);
        } else {
          console.log('API 응답이 비어있어 더미 데이터 사용');
          // 학생 ID에 맞는 더미 데이터만 필터링
          const filteredDummyData = dummyData.filter(
            record => String(record.studentId) === String(studentId)
          );
          setCounselingRecords(filteredDummyData.length > 0 ? filteredDummyData : dummyData);
          console.log('필터링된 더미 데이터:', filteredDummyData.length > 0 ? filteredDummyData : dummyData);
        }
      }
    } catch (err) {
      console.error('학생 상담 내역 조회 실패:', err);
      setError('상담 내역을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 상담 상세 정보 가져오기
  const handleDetailClick = async (counseling) => {
    setIsLoading(true);
    setIsModalOpen(true);
    setIsEditing(false);
    
    try {
      // URL에서 가져온 ID를 우선적으로 사용
      const idToUse = studentUrlId || student.studentId;
      // 상담 상세 정보 API 호출
      const response = await counselingApi.getStudentCounselings(idToUse, {
        status: counseling.status
      });
      
      // API 응답에서 해당 상담 정보 찾기
      const detailedCounseling = response.data.data.find(item => item.id === counseling.id) || counseling;
      
      // 상담 정보 상태 업데이트
      setSelectedCounseling(detailedCounseling);
      setEditedCounseling({...detailedCounseling});
      
      console.log('상담 상세 정보 가져오기 성공:', detailedCounseling);
    } catch (error) {
      console.error('상담 상세 정보 가져오기 실패:', error);
      // 오류 발생 시 기본 상담 정보 사용
      setSelectedCounseling(counseling);
      setEditedCounseling({...counseling});
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCounseling(null);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // In a real application, this would make an API call to update the counseling record
    setCounselingRecords(prevRecords => 
      prevRecords.map(record => 
        record.id === editedCounseling.id ? editedCounseling : record
      )
    );
    setSelectedCounseling(editedCounseling);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCounseling(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Check if the current user is the counselor of the selected counseling
  const isUserCounselor = selectedCounseling && 
    currentUser && 
    currentUser.role === 'teacher' && 
    selectedCounseling.counselorName === '김교수'; // In a real app, this would compare with the actual user name

  if (!student) return null;
  
  return (
    <TabContainer>
      {isLoading && <div style={{ textAlign: 'center', padding: '20px' }}>상담 내역을 불러오는 중...</div>}
      {error && <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>}
      
      <TableContainer>
        {!isLoading && !error && counselingRecords.length > 0 ? (
          <CounselingTable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>번호</TableHeaderCell>
                <TableHeaderCell>상담일자</TableHeaderCell>
                <TableHeaderCell>상담시간</TableHeaderCell>
                <TableHeaderCell>상담자명</TableHeaderCell>
                <TableHeaderCell>상담종류</TableHeaderCell>
                <TableHeaderCell>상담유형</TableHeaderCell>
                <TableHeaderCell>상태</TableHeaderCell>
                <TableHeaderCell>상세보기</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {counselingRecords.map((counseling, index) => (
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
                    <DetailButton onClick={() => handleDetailClick(counseling)}>
                      상세보기
                    </DetailButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </CounselingTable>
        ) : (
          <EmptyState>
            <EmptyStateText>
              {student.name} 학생의 상담 내역이 없습니다.
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
              <InfoTitle>학생 정보</InfoTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>이름</InfoLabel>
                  <InfoValue>{student.name}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>학년/반/번호</InfoLabel>
                  <InfoValue>{student.grade}학년 {student.class}반 {student.number}번</InfoValue>
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
                  <InfoLabel>상담일자</InfoLabel>
                  {isEditing ? (
                    <Input
                      type="date"
                      name="counselingDate"
                      value={editedCounseling.counselingDate}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <InfoValue>{selectedCounseling.counselingDate}</InfoValue>
                  )}
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상담시간</InfoLabel>
                  {isEditing ? (
                    <Input
                      type="time"
                      name="counselingTime"
                      value={editedCounseling.counselingTime}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <InfoValue>{selectedCounseling.counselingTime}</InfoValue>
                  )}
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상담상태</InfoLabel>
                  {isEditing ? (
                    <Select
                      name="status"
                      value={editedCounseling.status}
                      onChange={handleInputChange}
                    >
                      <option value="완료">완료</option>
                      <option value="대기">대기</option>
                      <option value="보류">보류</option>
                    </Select>
                  ) : (
                    <StatusBadge status={selectedCounseling.status}>
                      {selectedCounseling.status}
                    </StatusBadge>
                  )}
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상담자</InfoLabel>
                  <InfoValue>{selectedCounseling.counselorName}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상담장소</InfoLabel>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="location"
                      value={editedCounseling.location}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <InfoValue>{selectedCounseling.location}</InfoValue>
                  )}
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상담유형</InfoLabel>
                  <InfoValue>{selectedCounseling.counselingCategory}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </InfoSection>

            <InfoSection>
              <InfoTitle>상담 신청 내용</InfoTitle>
              <InfoValue>{selectedCounseling.requestContent}</InfoValue>
            </InfoSection>

            <InfoSection>
              <InfoTitle>상담 결과</InfoTitle>
              {isEditing ? (
                <TextArea
                  name="resultContent"
                  value={editedCounseling.resultContent}
                  onChange={handleInputChange}
                  placeholder="상담 결과를 입력하세요."
                />
              ) : (
                <InfoValue>
                  {selectedCounseling.resultContent || "상담 결과가 아직 입력되지 않았습니다."}
                </InfoValue>
              )}
            </InfoSection>

            <ButtonContainer>
              {isUserCounselor && !isEditing && (
                <DetailButton onClick={handleEditClick}>
                  수정하기
                </DetailButton>
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
            </ButtonContainer>
          </ModalContainer>
        </ModalOverlay>
      )}
    </TabContainer>
  );
};

export default CounselingTab;
