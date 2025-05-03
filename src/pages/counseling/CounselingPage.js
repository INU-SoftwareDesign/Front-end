import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import dummyTeacherCounselingData from '../../data/dummyTeacherCounselingData';

// Styled Components
const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const PageTitle = styled.h1`
  font-family: 'Pretendard-Bold', sans-serif;
  color: #1D4EB0;
  margin-bottom: 24px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const CalendarSection = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const CalendarTitle = styled.h2`
  font-family: 'Pretendard-SemiBold', sans-serif;
  color: #333;
  margin-bottom: 16px;
  font-size: 1.2rem;
`;

const StyledCalendar = styled(Calendar)`
  width: 100%;
  border: none;
  
  .react-calendar__tile {
    padding: 10px;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  
  .react-calendar__tile--active {
    background-color: rgba(29, 78, 176, 0.1);
    color: #1D4EB0;
  }
  
  .react-calendar__tile--now {
    background-color: rgba(29, 78, 176, 0.05);
  }
  
  .react-calendar__month-view__days__day--weekend {
    color: #f44336;
  }
  
  .react-calendar__navigation {
    margin-bottom: 16px;
  }
  
  .react-calendar__navigation button {
    min-width: 44px;
    background: none;
  }
  
  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: #f8f8fa;
  }
  
  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.8em;
  }
  
  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5em;
  }
  
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #f8f8fa;
  }
`;

const CounselingDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.status === '신청' ? '#FFC107' : props.status === '확정' ? '#2196F3' : '#4CAF50'};
  margin-top: 2px;
`;

const CounselingName = styled.span`
  font-size: 0.7rem;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  color: #555;
`;

const ListsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ListContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const ListTitle = styled.h2`
  font-family: 'Pretendard-SemiBold', sans-serif;
  color: #333;
  margin-bottom: 16px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Badge = styled.span`
  background-color: ${props => props.type === 'pending' ? '#FFC107' : '#2196F3'};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const CounselingList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CounselingItem = styled.li`
  padding: 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8f8fa;
  }
`;

const CounselingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const StudentName = styled.span`
  font-weight: 600;
  color: #333;
`;

const CounselingDate = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const CounselingInfo = styled.div`
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 0.9rem;
`;

const CounselingType = styled.span`
  color: #1D4EB0;
  font-weight: 500;
`;

const EmptyList = styled.div`
  padding: 24px;
  text-align: center;
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

const PrimaryButton = styled(Button)`
  background-color: #1D4EB0;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #1A44A3;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #f44336;
  color: white;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const CounselingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [pendingCounselings, setPendingCounselings] = useState([]);
  const [scheduledCounselings, setScheduledCounselings] = useState([]);
  const [completedCounselings, setCompletedCounselings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCounseling, setSelectedCounseling] = useState(null);
  const [location, setLocation] = useState('');
  const [resultContent, setResultContent] = useState('');
  const [counselingDate, setCounselingDate] = useState('');
  const [counselingTime, setCounselingTime] = useState('');

  // Check if user is a teacher
  useEffect(() => {
    if (currentUser && currentUser.role !== 'teacher') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Load counseling data
  useEffect(() => {
    setPendingCounselings(dummyTeacherCounselingData.pendingCounselings);
    setScheduledCounselings(dummyTeacherCounselingData.scheduledCounselings);
    setCompletedCounselings(dummyTeacherCounselingData.completedCounselings);
  }, []);

  // Get all counselings for calendar display
  const allCounselings = [...pendingCounselings, ...scheduledCounselings, ...completedCounselings];

  // Function to handle opening the modal for a pending counseling
  const handlePendingCounselingClick = (counseling) => {
    setSelectedCounseling(counseling);
    setLocation(counseling.location);
    setIsModalOpen(true);
  };

  // Function to handle opening the modal for a scheduled counseling
  const handleScheduledCounselingClick = (counseling) => {
    setSelectedCounseling(counseling);
    setLocation(counseling.location);
    setResultContent(counseling.resultContent);
    setCounselingDate(counseling.counselingDate);
    setCounselingTime(counseling.counselingTime);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCounseling(null);
    setLocation('');
    setResultContent('');
    setCounselingDate('');
    setCounselingTime('');
  };

  // Function to handle approving a counseling request
  const handleApproveCounseling = () => {
    if (!location.trim()) return;

    const updatedCounseling = {
      ...selectedCounseling,
      status: '확정',
      location: location
    };

    // Remove from pending and add to scheduled
    setPendingCounselings(prev => prev.filter(c => c.id !== selectedCounseling.id));
    setScheduledCounselings(prev => [...prev, updatedCounseling]);
    
    closeModal();
  };

  // Function to handle saving counseling results
  const handleSaveCounselingResult = () => {
    const updatedCounseling = {
      ...selectedCounseling,
      status: '완료',
      resultContent: resultContent,
      counselingDate: counselingDate,
      counselingTime: counselingTime,
      location: location
    };

    // Remove from scheduled and add to completed
    setScheduledCounselings(prev => prev.filter(c => c.id !== selectedCounseling.id));
    setCompletedCounselings(prev => [...prev, updatedCounseling]);
    
    closeModal();
  };

  // Function to get counselings for a specific date (for calendar)
  const getCounselingsForDate = (date) => {
    return allCounselings.filter(counseling => {
      const counselingDate = new Date(counseling.counselingDate);
      return (
        counselingDate.getDate() === date.getDate() &&
        counselingDate.getMonth() === date.getMonth() &&
        counselingDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Custom tile content for calendar
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const counselingsForDate = getCounselingsForDate(date);
    if (counselingsForDate.length === 0) return null;
    
    return (
      <>
        {counselingsForDate.slice(0, 2).map((counseling, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <CounselingDot status={counseling.status} />
            <CounselingName>{counseling.studentName}</CounselingName>
          </div>
        ))}
        {counselingsForDate.length > 2 && <CounselingName>+{counselingsForDate.length - 2}명</CounselingName>}
      </>
    );
  };

  // Render pending counseling list
  const renderPendingCounselings = () => {
    if (pendingCounselings.length === 0) {
      return <EmptyList>신청된 상담이 없습니다.</EmptyList>;
    }

    return (
      <CounselingList>
        {pendingCounselings.map(counseling => (
          <CounselingItem 
            key={counseling.id}
            onClick={() => handlePendingCounselingClick(counseling)}
          >
            <CounselingHeader>
              <StudentName>{counseling.studentName} ({counseling.grade}학년 {counseling.class}반 {counseling.number}번)</StudentName>
              <CounselingDate>{counseling.counselingDate} {counseling.counselingTime}</CounselingDate>
            </CounselingHeader>
            <CounselingInfo>
              <CounselingType>{counseling.counselingType}</CounselingType>
              <span>{counseling.counselingCategory}</span>
            </CounselingInfo>
          </CounselingItem>
        ))}
      </CounselingList>
    );
  };

  // Render scheduled counseling list
  const renderScheduledCounselings = () => {
    if (scheduledCounselings.length === 0) {
      return <EmptyList>예정된 상담이 없습니다.</EmptyList>;
    }

    return (
      <CounselingList>
        {scheduledCounselings.map(counseling => (
          <CounselingItem 
            key={counseling.id}
            onClick={() => handleScheduledCounselingClick(counseling)}
          >
            <CounselingHeader>
              <StudentName>{counseling.studentName} ({counseling.grade}학년 {counseling.class}반 {counseling.number}번)</StudentName>
              <CounselingDate>{counseling.counselingDate} {counseling.counselingTime}</CounselingDate>
            </CounselingHeader>
            <CounselingInfo>
              <CounselingType>{counseling.counselingType}</CounselingType>
              <span>{counseling.counselingCategory}</span>
              <span>장소: {counseling.location}</span>
            </CounselingInfo>
          </CounselingItem>
        ))}
      </CounselingList>
    );
  };

  // Render the appropriate modal content based on the selected counseling
  const renderModalContent = () => {
    if (!selectedCounseling) return null;

    const isPending = selectedCounseling.status === '신청';
    
    return (
      <>
        <ModalHeader>
          <ModalTitle>
            {isPending ? '상담 신청 상세' : '상담 일정 상세'}
          </ModalTitle>
          <CloseButton onClick={closeModal}>&times;</CloseButton>
        </ModalHeader>

        <InfoSection>
          <InfoTitle>학생 정보</InfoTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>이름</InfoLabel>
              <InfoValue>{selectedCounseling.studentName}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>학년/반/번호</InfoLabel>
              <InfoValue>{selectedCounseling.grade}학년 {selectedCounseling.class}반 {selectedCounseling.number}번</InfoValue>
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
            {isPending ? (
              <>
                <InfoItem>
                  <InfoLabel>신청일</InfoLabel>
                  <InfoValue>{selectedCounseling.requestDate}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>희망 상담일</InfoLabel>
                  <InfoValue>{selectedCounseling.counselingDate}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>희망 시간</InfoLabel>
                  <InfoValue>{selectedCounseling.counselingTime}</InfoValue>
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
                  <InfoLabel>상담 장소</InfoLabel>
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="상담 장소를 입력하세요"
                  />
                </InfoItem>
              </>
            ) : (
              <>
                <InfoItem>
                  <InfoLabel>상담일</InfoLabel>
                  <Input
                    type="date"
                    value={counselingDate}
                    onChange={(e) => setCounselingDate(e.target.value)}
                  />
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상담 시간</InfoLabel>
                  <Input
                    type="time"
                    value={counselingTime}
                    onChange={(e) => setCounselingTime(e.target.value)}
                  />
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
                  <InfoLabel>상담 장소</InfoLabel>
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </InfoItem>
              </>
            )}
          </InfoGrid>
        </InfoSection>

        <InfoSection>
          <InfoTitle>상담 신청 내용</InfoTitle>
          <InfoValue>{selectedCounseling.requestContent}</InfoValue>
        </InfoSection>

        {!isPending && (
          <InfoSection>
            <InfoTitle>상담 결과</InfoTitle>
            <TextArea
              value={resultContent}
              onChange={(e) => setResultContent(e.target.value)}
              placeholder="상담 결과를 입력하세요"
            />
          </InfoSection>
        )}

        <ButtonContainer>
          {isPending ? (
            <PrimaryButton 
              onClick={handleApproveCounseling}
              disabled={!location.trim()}
            >
              신청 완료
            </PrimaryButton>
          ) : (
            <>
              <SecondaryButton onClick={closeModal}>
                취소
              </SecondaryButton>
              <PrimaryButton 
                onClick={handleSaveCounselingResult}
                disabled={!location.trim()}
              >
                상담 결과 저장
              </PrimaryButton>
            </>
          )}
        </ButtonContainer>
      </>
    );
  };

  return (
    <PageContainer>
      <PageTitle>상담 관리</PageTitle>
      
      <ContentGrid>
        <CalendarSection>
          <CalendarTitle>상담 일정</CalendarTitle>
          <StyledCalendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
          />
        </CalendarSection>
        
        <ListsSection>
          <ListContainer>
            <ListTitle>
              상담 신청 내역
              <Badge type="pending">{pendingCounselings.length}건</Badge>
            </ListTitle>
            {renderPendingCounselings()}
          </ListContainer>
          
          <ListContainer>
            <ListTitle>
              상담 예정 내역
              <Badge type="scheduled">{scheduledCounselings.length}건</Badge>
            </ListTitle>
            {renderScheduledCounselings()}
          </ListContainer>
        </ListsSection>
      </ContentGrid>
      
      {isModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            {renderModalContent()}
          </ModalContainer>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default CounselingPage;
