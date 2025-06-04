import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/useUserStore';
import counselingApi from '../../api/counselingApi';
import * as studentApi from '../../api/studentApi';
import { useRef } from 'react';

// Styled Components
const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
`;

const Tab = styled.div`
  padding: 12px 24px;
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  color: ${props => props.active ? '#1D4EB0' : '#666'};
  border-bottom: ${props => props.active ? '2px solid #1D4EB0' : 'none'};
  transition: all 0.2s ease;
  
  &:hover {
    color: #1D4EB0;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  color: #666;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  min-width: 100px;
`;

const RejectButton = styled.button`
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #fa5252;
  }
`;

const CancelButton = styled.button`
  background-color: #868e96;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #495057;
  }
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

const StatusBadge = styled.span`
  background-color: ${props => {
    // 영문 상태값 처리
    switch(props.status) {
      case 'pending': return '#FFC107'; // 노란색 - 신청
      case 'scheduled': return '#2196F3'; // 파란색 - 예약확정
      case 'completed': return '#4CAF50'; // 초록색 - 완료
      case 'canceled': return '#F44336'; // 빨간색 - 취소
      
      // 한글 상태값 처리
      case '신청': return '#FFC107'; // 노란색
      case '예약확정': return '#2196F3'; // 파란색
      case '완료': return '#4CAF50'; // 초록색
      case '취소': return '#F44336'; // 빨간색
      
      default: return '#9E9E9E'; // 회색 - 기본값
    }
  }};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-left: auto;
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

const ModalContent = styled.div`
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
  const currentUser = useUserStore(state => state.currentUser);
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
  
  // 탭 관련 상태
  const [activeTab, setActiveTab] = useState('myCounselings'); // 'myCounselings' 또는 'otherStudents'
  
  // 다른 학생 상담 내역 조회 관련 상태
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentCounselingRecords, setStudentCounselingRecords] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isStudentCounselingModalOpen, setIsStudentCounselingModalOpen] = useState(false);
  const [selectedStudentCounseling, setSelectedStudentCounseling] = useState(null);

  // Check if user is a teacher
  useEffect(() => {
    if (currentUser && currentUser.role !== 'teacher') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Load counseling data
  const loadPendingCounselings = async () => {
    if (!currentUser || !currentUser.id) {
      console.error('사용자 정보가 없어 상담 신청 내역을 로드할 수 없습니다.');
      return;
    }
    
    console.log('상담 신청 내역 로딩 시작, 사용자 ID:', currentUser.id);
    try {
      // API 호출 전 로그
      console.log('API 호출 직전 - getTeacherCounselingRequests:', currentUser.id, { status: '신청' });
      const response = await counselingApi.getTeacherCounselingRequests(currentUser.id, { status: '신청' });
      console.log('API 응답 (신청):', response);
      
      // 다양한 응답 구조 처리
      if (response && response.data) {
        let counselingsData = [];
        
        // response.data.counselings가 있는 경우 (정상 응답)
        if (response.data.counselings) {
          counselingsData = response.data.counselings;
          console.log('상담 신청 내역 로드 성공 (counselings 형식):', counselingsData);
        }
        // response.data.data가 있는 경우 (대체 형식)
        else if (response.data.data) {
          counselingsData = response.data.data;
          console.log('상담 신청 내역 로드 성공 (data 형식):', counselingsData);
        }
        // response.data 자체가 배열인 경우
        else if (Array.isArray(response.data)) {
          counselingsData = response.data;
          console.log('상담 신청 내역 로드 성공 (배열 형식):', counselingsData);
        }
        
        // 배열인지 한번 더 확인
        if (Array.isArray(counselingsData)) {
          setPendingCounselings(counselingsData);
        } else {
          console.error('상담 신청 내역 데이터가 배열이 아닙니다:', counselingsData);
          setPendingCounselings([]);
        }
      } else {
        setPendingCounselings([]);
        console.error('상담 신청 내역 로딩 실패: 서버 응답 오류');
      }
    } catch (error) {
      setPendingCounselings([]);
      console.error('상담 신청 내역 로딩 실패:', error);
      console.error('상담 신청 내역을 불러오는데 실패했습니다.');
    }
  };

  const loadScheduledCounselings = async () => {
    if (!currentUser || !currentUser.id) {
      console.error('사용자 정보가 없어 상담 예정 내역을 로드할 수 없습니다.');
      return;
    }
    
    console.log('상담 예정 내역 로딩 시작, 사용자 ID:', currentUser.id);
    try {
      // API 호출 전 로그
      console.log('API 호출 직전 - getTeacherScheduledCounselings:', currentUser.id, { status: '예약확정' });
      const response = await counselingApi.getTeacherScheduledCounselings(currentUser.id, { status: '예약확정' });
      console.log('API 응답 (예약확정):', response);
      
      // 다양한 응답 구조 처리
      if (response && response.data) {
        let counselingsData = [];
        
        // response.data.counselings가 있는 경우 (정상 응답)
        if (response.data.counselings) {
          counselingsData = response.data.counselings;
          console.log('상담 예정 내역 로드 성공 (counselings 형식):', counselingsData);
        }
        // response.data.data가 있는 경우 (대체 형식)
        else if (response.data.data) {
          counselingsData = response.data.data;
          console.log('상담 예정 내역 로드 성공 (data 형식):', counselingsData);
        }
        // response.data 자체가 배열인 경우
        else if (Array.isArray(response.data)) {
          counselingsData = response.data;
          console.log('상담 예정 내역 로드 성공 (배열 형식):', counselingsData);
        }
        
        // 배열인지 한번 더 확인
        if (Array.isArray(counselingsData)) {
          setScheduledCounselings(counselingsData);
        } else {
          console.error('상담 예정 내역 데이터가 배열이 아닙니다:', counselingsData);
          setScheduledCounselings([]);
        }
      } else {
        setScheduledCounselings([]);
        console.error('상담 예정 내역 로딩 실패: 서버 응답 오류');
      }
    } catch (error) {
      setScheduledCounselings([]);
      console.error('상담 예정 내역 로딩 실패:', error);
      console.error('상담 예정 내역을 불러오는데 실패했습니다.');
    }
  };

  const loadCompletedCounselings = async () => {
    if (!currentUser || !currentUser.id) {
      console.error('사용자 정보가 없어 상담 완료 내역을 로드할 수 없습니다.');
      return;
    }
    
    console.log('상담 완료 내역 로딩 시작, 사용자 ID:', currentUser.id);
    try {
      // API 호출 전 로그
      console.log('API 호출 직전 - getTeacherScheduledCounselings:', currentUser.id, { status: '완료' });
      const response = await counselingApi.getTeacherScheduledCounselings(currentUser.id, { status: '완료' });
      console.log('API 응답 (완료):', response);
      
      // 다양한 응답 구조 처리
      if (response && response.data) {
        let counselingsData = [];
        
        // response.data.counselings가 있는 경우 (정상 응답)
        if (response.data.counselings) {
          counselingsData = response.data.counselings;
          console.log('상담 완료 내역 로드 성공 (counselings 형식):', counselingsData);
        }
        // response.data.data가 있는 경우 (대체 형식)
        else if (response.data.data) {
          counselingsData = response.data.data;
          console.log('상담 완료 내역 로드 성공 (data 형식):', counselingsData);
        }
        // response.data 자체가 배열인 경우
        else if (Array.isArray(response.data)) {
          counselingsData = response.data;
          console.log('상담 완료 내역 로드 성공 (배열 형식):', counselingsData);
        }
        
        // 배열인지 한번 더 확인
        if (Array.isArray(counselingsData)) {
          setCompletedCounselings(counselingsData);
        } else {
          console.error('상담 완료 내역 데이터가 배열이 아닙니다:', counselingsData);
          setCompletedCounselings([]);
        }
      } else {
        setCompletedCounselings([]);
        console.error('상담 완료 내역 로딩 실패: 서버 응답 오류');
      }
    } catch (error) {
      setCompletedCounselings([]);
      console.error('상담 완료 내역 로딩 실패:', error);
      console.error('상담 완료 내역을 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    console.log('CounselingPage useEffect 실행, 현재 사용자:', currentUser);
    if (currentUser && activeTab === 'myCounselings') {
      console.log('상담 API 호출 시작, 사용자 ID:', currentUser.id);
      loadPendingCounselings();
      loadScheduledCounselings();
      loadCompletedCounselings();
    } else {
      console.log('API 호출 조건 미충족:', { 
        '사용자 존재': !!currentUser, 
        '사용자 ID 존재': !!(currentUser && currentUser.id), 
        '활성 탭이 myCounselings': activeTab === 'myCounselings' 
      });
    }
  }, [currentUser, activeTab]);

  // Get all counselings for calendar display
  const allCounselings = [...pendingCounselings, ...scheduledCounselings, ...completedCounselings];
  
  // 디버깅용 로그 추가
  useEffect(() => {
    console.log('상담 데이터 현황:', {
      '신청 상담 수': pendingCounselings.length,
      '예정 상담 수': scheduledCounselings.length,
      '완료 상담 수': completedCounselings.length,
      '캘린더용 전체 상담 수': allCounselings.length
    });
    
    // 상담 데이터의 날짜 형식 확인
    if (pendingCounselings.length > 0) {
      console.log('신청 상담 데이터 예시:', pendingCounselings[0]);
      console.log('신청 상담 날짜 형식:', pendingCounselings[0].counselingDate);
    }
    
    if (scheduledCounselings.length > 0) {
      console.log('예정 상담 데이터 예시:', scheduledCounselings[0]);
      console.log('예정 상담 날짜 형식:', scheduledCounselings[0].counselingDate);
    }
    
    if (completedCounselings.length > 0) {
      console.log('완료 상담 데이터 예시:', completedCounselings[0]);
      console.log('완료 상담 날짜 형식:', completedCounselings[0].counselingDate);
    }
    
    // 전체 상담 데이터 중 일부만 로그
    console.log('신청 상담 데이터 일부:', pendingCounselings.slice(0, 2));
    console.log('예정 상담 데이터 일부:', scheduledCounselings.slice(0, 2));
  }, [pendingCounselings, scheduledCounselings, completedCounselings]);

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
  const handleApproveCounseling = async () => {
    // 장소 입력 검증
    if (!location.trim()) {
      alert('상담 장소를 입력해주세요.');
      return;
    }

    try {
      // 상담 예약확정 API 호출
      const response = await counselingApi.approveCounseling(selectedCounseling.id, {
        location: location
      });

      if (response.data && response.data.success) {
        alert('상담 신청이 성공적으로 확정되었습니다.');
        
        // 상담 데이터 다시 불러오기
        loadPendingCounselings();
        loadScheduledCounselings();
        
        closeModal();
      }
    } catch (error) {
      console.error('상담 예약확정 실패:', error);
      alert('상담 예약확정 처리에 실패했습니다.');
    }
  };

  // Function to handle saving counseling results
  const handleSaveCounselingResult = async () => {
    // 장소 입력 검증
    if (!location || !location.trim()) {
      alert('상담 장소를 입력해주세요.');
      return;
    }

    try {
      // API로 전송할 데이터 구성
      const updateData = {
        counselingDate: counselingDate,
        counselingTime: counselingTime,
        location: location,
        status: '완료',
        resultContent: resultContent
      };

      // API 호출
      const response = await counselingApi.updateCounseling(selectedCounseling.id, updateData);

      if (response.data && response.data.success) {
        console.log('상담 결과 저장 성공:', response.data);
        alert(response.data.data.message || '상담 결과가 성공적으로 저장되었습니다.');
        
        // 상담 데이터 다시 불러오기
        loadScheduledCounselings();
        loadCompletedCounselings();
        
        closeModal();
      } else {
        alert('상담 결과 저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('상담 결과 저장 실패:', error);
      alert('상담 결과 저장 중 오류가 발생했습니다.');
    }
  };

  // Function to get counselings for a specific date (for calendar)
  const getCounselingsForDate = (date) => {
    // 캘린더 날짜를 YYYY-MM-DD 형식으로 변환
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // 디버깅 로그 추가
    const counselingsForDate = allCounselings.filter(counseling => {
      if (!counseling.counselingDate) return false;
      
      // 상담 데이터의 날짜 처리
      let isMatch = false;
      
      // 1. 정확한 문자열 비교 (YYYY-MM-DD 형식)
      if (counseling.counselingDate === dateStr) {
        isMatch = true;
      } 
      // 2. Date 객체로 변환하여 비교 (다른 형식의 날짜 문자열이거나 Date 객체인 경우)
      else {
        try {
          const counselingDate = new Date(counseling.counselingDate);
          // 유효한 날짜인지 확인
          if (!isNaN(counselingDate.getTime())) {
            // 날짜만 비교 (시간 제외)
            isMatch = (
              counselingDate.getDate() === date.getDate() &&
              counselingDate.getMonth() === date.getMonth() &&
              counselingDate.getFullYear() === date.getFullYear()
            );
          }
        } catch (error) {
          console.error('날짜 변환 오류:', counseling.counselingDate, error);
        }
      }
      
      // 디버깅을 위해 날짜 비교 로그 (전체 로그는 너무 많으므로 일치하는 경우만 로그)
      if (isMatch) {
        console.log(`날짜 일치: 캘린더 날짜=${dateStr}, 상담 날짜=${counseling.counselingDate}, 학생=${counseling.studentName}`);
      }
      
      return isMatch;
    });
    
    // 해당 날짜에 상담이 있는 경우 로그
    if (counselingsForDate.length > 0) {
      console.log(`${dateStr} 날짜에 ${counselingsForDate.length}개의 상담이 있습니다:`, counselingsForDate);
    }
    
    return counselingsForDate;
  };

  // Custom tile content for calendar
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const counselingsForDate = getCounselingsForDate(date);
    if (counselingsForDate.length === 0) return null;
    
    // 디버깅용 로그 - 상담 일정이 있는 날짜의 타일 렌더링
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    console.log(`타일 렌더링: ${dateStr}에 ${counselingsForDate.length}개의 상담 일정 표시`);
    
    // 상태에 따른 색상 매핑 함수
    const getStatusColor = (status) => {
      if (!status) return '#9E9E9E'; // 상태가 없는 경우 회색
      
      // 한글 상태
      if (status === '신청') return '#FFC107'; // 노란색
      if (status === '예약확정') return '#2196F3'; // 파란색
      if (status === '완료') return '#4CAF50'; // 초록색
      if (status === '취소') return '#F44336'; // 빨간색
      
      // 영문 상태
      if (status.toLowerCase() === 'pending') return '#FFC107';
      if (status.toLowerCase() === 'scheduled') return '#2196F3';
      if (status.toLowerCase() === 'completed') return '#4CAF50';
      if (status.toLowerCase() === 'canceled') return '#F44336';
      
      return '#9E9E9E'; // 기본값
    };
    
    return (
      <div style={{ marginTop: '2px', width: '100%' }}>
        {counselingsForDate.slice(0, 2).map((counseling, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            marginBottom: '2px',
            fontSize: '10px',
            lineHeight: '1.2',
            width: '100%',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              backgroundColor: getStatusColor(counseling.status),
              flexShrink: 0
            }} />
            <span style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              fontSize: '9px'
            }}>
              {counseling.studentName}
            </span>
          </div>
        ))}
        {counselingsForDate.length > 2 && 
          <div style={{ fontSize: '9px', textAlign: 'center' }}>+{counselingsForDate.length - 2}개 더</div>
        }
      </div>
    );
  };

  // 상담 신청 거절 처리 함수
  const handleRejectCounseling = async (counselingId, event) => {
    // 이벤트 전파 방지 (클릭 이벤트가 부모 요소로 전파되지 않도록)
    event.stopPropagation();
    
    if (window.confirm('상담 신청을 거절하시겠습니까?')) {
      try {
        // API 호출
        const response = await counselingApi.deleteCounseling(counselingId);
        
        if (response.data && response.data.success) {
          console.log('상담 신청 거절 성공:', response.data);
          alert(response.data.data.message || '상담 신청이 거절되었습니다.');
          
          // 상담 데이터 다시 불러오기
          loadPendingCounselings();
        } else if (response.data && !response.data.success) {
          alert(response.data.error.message || '상담 신청 거절 중 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('상담 신청 거절 실패:', error);
        alert('상담 신청 거절 중 오류가 발생했습니다.');
      }
    }
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
              <StudentName>{counseling.studentName} ({counseling.grade}학년 {counseling.classNumber}반 {counseling.number}번)</StudentName>
              <CounselingDate>{counseling.counselingDate} {counseling.counselingTime}</CounselingDate>
            </CounselingHeader>
            <CounselingInfo>
              <CounselingType>{counseling.counselingType}</CounselingType>
              <span>{counseling.counselingCategory}</span>
              <StatusBadge status="pending">신청</StatusBadge>
            </CounselingInfo>
            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
              <RejectButton onClick={(e) => handleRejectCounseling(counseling.id, e)}>
                거절하기
              </RejectButton>
            </div>
          </CounselingItem>
        ))}
      </CounselingList>
    );
  };

  // 상담 예약 취소 함수
  const handleCancelScheduledCounseling = async (counselingId, event) => {
    // 이벤트 전파 방지
    event.stopPropagation();
    
    if (window.confirm('상담 예약을 취소하시겠습니까?')) {
      try {
        // API 호출
        const response = await counselingApi.deleteCounseling(counselingId);
        
        if (response.data && response.data.success) {
          console.log('상담 예약 취소 성공:', response.data);
          alert(response.data.data.message || '상담 예약이 취소되었습니다.');
          
          // 상담 데이터 다시 불러오기
          loadScheduledCounselings();
        } else if (response.data && !response.data.success) {
          alert(response.data.error.message || '상담 예약 취소 중 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('상담 예약 취소 실패:', error);
        alert('상담 예약 취소 중 오류가 발생했습니다.');
      }
    }
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
              <StudentName>{counseling.studentName} ({counseling.grade}학년 {counseling.classNumber}반 {counseling.number}번)</StudentName>
              <CounselingDate>{counseling.counselingDate} {counseling.counselingTime}</CounselingDate>
            </CounselingHeader>
            <CounselingInfo>
              <CounselingType>{counseling.counselingType}</CounselingType>
              <span>{counseling.counselingCategory}</span>
              <StatusBadge status="scheduled">예약확정</StatusBadge>
            </CounselingInfo>
            <div style={{ marginTop: '8px', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>장소: {counseling.location || '미정'}</span>
              <CancelButton onClick={(e) => handleCancelScheduledCounseling(counseling.id, e)}>
                예약 취소
              </CancelButton>
            </div>
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
              disabled={!location || !location.trim()}
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
                disabled={!location || !location.trim()}
              >
                상담 결과 저장
              </PrimaryButton>
            </>
          )}
        </ButtonContainer>
      </>
    );
  };

  // API 요청 취소를 위한 컨트롤러 참조 저장
  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);

  // 필터링된 학생 목록 조회
  const loadFilteredStudents = async () => {
    // 학년과 반이 모두 선택되었을 때만 API 호출
    if (!selectedGrade || !selectedClass) {
      setFilteredStudents([]);
      return;
    }
    
    // 이전 요청이 있으면 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // 새 AbortController 생성
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    // 현재 요청 ID 저장
    const currentRequestId = ++requestIdRef.current;
    
    setIsLoadingStudents(true);
    try {
      const params = {
        grade: selectedGrade,
        classNumber: selectedClass
      };
      
      console.log(`학생 목록 요청 #${currentRequestId}: 학년=${selectedGrade}, 반=${selectedClass}`);
      
      // signal을 통해 취소 가능한 API 호출
      const response = await studentApi.getStudents(params, { signal });
      
      // 현재 요청이 최신 요청이 아니면 결과 무시
      if (currentRequestId !== requestIdRef.current) {
        console.log(`요청 #${currentRequestId} 결과 무시: 더 최신 요청이 있음`);
        return;
      }
      
      console.log(`요청 #${currentRequestId} 응답 처리 중:`, response);
      
      // API에서 반환하는 실제 데이터 형식에 맞게 처리
      let students = [];
      if (Array.isArray(response)) {
        students = response;
      } else if (response && Array.isArray(response.data)) {
        students = response.data;
      } else if (response && response.data && response.data.success && Array.isArray(response.data.data)) {
        students = response.data.data;
      } else {
        console.warn('학생 데이터를 찾을 수 없습니다:', response);
      }
      
      // 추가 필터링 - 선택한 학년과 반에 맞는 학생만 필터링
      const gradeStr = String(selectedGrade);
      const classStr = String(selectedClass);
      
      students = students.filter(student => {
        const studentGrade = String(student.grade);
        const studentClass = String(student.classNumber);
        return studentGrade === gradeStr && studentClass === classStr;
      });
      
      console.log(`추가 필터링 후 학생 수: ${students.length}, 학년=${gradeStr}, 반=${classStr}`);
      
      if (students.length === 0) {
        console.warn(`필터링 후 학생이 없습니다. 학년=${gradeStr}, 반=${classStr}`);
      }
      
      // 학생 목록을 번호순으로 정렬
      const sortedStudents = students.sort((a, b) => {
        // number가 문자열인 경우를 대비해 숫자로 변환
        const numA = typeof a.number === 'string' ? parseInt(a.number, 10) : a.number;
        const numB = typeof b.number === 'string' ? parseInt(b.number, 10) : b.number;
        return numA - numB;
      });
      
      console.log(`요청 #${currentRequestId} 처리 완료: ${sortedStudents.length}개 학생 데이터 로드`);
      setFilteredStudents(sortedStudents);
    } catch (error) {
      // 취소된 요청이 아니고 오류가 발생한 경우에만 처리
      if (error.name !== 'AbortError') {
        console.error(`요청 #${currentRequestId} 오류:`, error);
        // 현재 요청이 최신 요청인 경우에만 상태 업데이트
        if (currentRequestId === requestIdRef.current) {
          setFilteredStudents([]);
        }
      } else {
        console.log(`요청 #${currentRequestId} 취소됨`);
      }
    } finally {
      // 현재 요청이 최신 요청인 경우에만 로딩 상태 업데이트
      if (currentRequestId === requestIdRef.current) {
        setIsLoadingStudents(false);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'otherStudents') {
      loadFilteredStudents();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGrade, selectedClass, activeTab]);

  // 학생 상담 내역 조회
  const loadStudentCounselingRecords = async (student) => {
    setSelectedStudent(student);
    setStudentCounselingRecords([]);
    
    try {
      // studentId 또는 id 중 존재하는 값을 사용
      let studentIdToUse = student.studentId || student.id;
      
      // 학생 ID가 8자리 숫자인 경우 (예: 20250100) 뒤의 4자리에서 앞의 0을 제외한 값(100)만 사용
      if (typeof studentIdToUse === 'string' && studentIdToUse.length === 8 && !isNaN(studentIdToUse)) {
        // 뒤의 4자리 추출 후 앞의 0 제거
        const last4Digits = studentIdToUse.slice(4);
        studentIdToUse = parseInt(last4Digits, 10).toString();
        console.log(`학생 ID 변환: ${student.studentId || student.id} -> ${studentIdToUse}`);
      }
      
      const response = await counselingApi.getStudentCounselings(studentIdToUse);
      
      console.log('학생 상담 내역 응답:', response);
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setStudentCounselingRecords(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setStudentCounselingRecords(response.data);
      } else if (Array.isArray(response)) {
        setStudentCounselingRecords(response);
      } else {
        console.warn('상담 내역을 찾을 수 없습니다:', response);
        setStudentCounselingRecords([]);
      }
    } catch (error) {
      console.error('학생 상담 내역 조회 실패:', error);
    }
  };

  
  // 학생 상담 내역 상세보기 모달 열기
  const openStudentCounselingModal = (counseling) => {
    setSelectedStudentCounseling(counseling);
    setIsStudentCounselingModalOpen(true);
  };
  
  // 학생 상담 내역 상세보기 모달 닫기
  const closeStudentCounselingModal = () => {
    setIsStudentCounselingModalOpen(false);
    setSelectedStudentCounseling(null);
  };

  // 다른 학생 상담 내역 렌더링
  const renderOtherStudentsCounselings = () => {
    return (
      <div>
        <FilterContainer>
          <FilterLabel>학년:</FilterLabel>
          <FilterSelect 
            value={selectedGrade} 
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="">전체</option>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
          </FilterSelect>
          
          <FilterLabel>반:</FilterLabel>
          <FilterSelect 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">전체</option>
            <option value="1">1반</option>
            <option value="2">2반</option>
            <option value="3">3반</option>
            <option value="4">4반</option>
            <option value="5">5반</option>
            <option value="6">6반</option>
            <option value="7">7반</option>
          </FilterSelect>
        </FilterContainer>
        
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* 학생 목록 */}
          <div style={{ flex: '1', maxWidth: '300px' }}>
            <ListTitle>학생 목록</ListTitle>
            {isLoadingStudents ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>학생 목록을 불러오는 중...</div>
            ) : filteredStudents.length > 0 ? (
              <div style={{
                maxHeight: '500px',
                overflowY: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                {filteredStudents.map(student => (
                  <div 
                    key={student.id || student.studentId}
                    onClick={() => loadStudentCounselingRecords(student)}
                    style={{ 
                      padding: '12px 16px',
                      borderBottom: '1px solid #e0e0e0',
                      backgroundColor: selectedStudent && 
                        (selectedStudent.id === student.id || selectedStudent.studentId === student.studentId) 
                        ? '#f0f7ff' : 'white',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <div style={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      marginBottom: '4px',
                      color: '#333'
                    }}>{student.name}</div>
                    <div style={{
                      fontSize: '14px',
                      color: '#666',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        backgroundColor: '#1D4EB0',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        marginRight: '8px',
                        fontSize: '12px'
                      }}>{student.grade}학년</span>
                      <span style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        marginRight: '8px',
                        fontSize: '12px'
                      }}>{student.classNumber}반</span>
                      <span style={{
                        backgroundColor: '#FF9800',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>{student.number}번</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyList>
                {selectedGrade || selectedClass ? 
                  '조건에 맞는 학생이 없습니다.' : 
                  '학년과 반을 선택하세요.'}
              </EmptyList>
            )}
          </div>
          
          {/* 상담 내역 */}
          <div style={{ flex: '2' }}>
            <ListTitle>
              {selectedStudent ? `${selectedStudent.name} 학생의 상담 내역` : '상담 내역'}
            </ListTitle>
            {selectedStudent ? (
              studentCounselingRecords.length > 0 ? (
                <table className="counseling-table" style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '16px',
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <thead>
                    <tr>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold'
                      }}>번호</th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold'
                      }}>상담일자</th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold'
                      }}>상담시간</th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold'
                      }}>상담자명</th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold'
                      }}>상담종류</th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold'
                      }}>상담유형</th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold'
                      }}>상태</th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'center',
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold'
                      }}>상세보기</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentCounselingRecords.map((counseling, index) => (
                      <tr key={counseling.id}>
                        <td style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #e0e0e0'
                        }}>{index + 1}</td>
                        <td style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #e0e0e0'
                        }}>{counseling.counselingDate}</td>
                        <td style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #e0e0e0'
                        }}>{counseling.counselingTime}</td>
                        <td style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #e0e0e0'
                        }}>{counseling.counselorName}</td>
                        <td style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #e0e0e0'
                        }}>{counseling.counselingType}</td>
                        <td style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #e0e0e0'
                        }}>{counseling.counselingCategory}</td>
                        <td style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #e0e0e0'
                        }}>
                          <StatusBadge status={counseling.status}>
                            {counseling.status}
                          </StatusBadge>
                        </td>
                        <td style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #e0e0e0',
                          textAlign: 'center'
                        }}>
                          <button 
                            onClick={() => openStudentCounselingModal(counseling)}
                            style={{
                              backgroundColor: '#1D4EB0',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              cursor: 'pointer'
                            }}
                          >
                            상세보기
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyList>
                  {selectedStudent.name} 학생의 상담 내역이 없습니다.
                </EmptyList>
              )
            ) : (
              <EmptyList>
                좌측에서 학생을 선택하세요.
              </EmptyList>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageContainer>
      <PageTitle>상담 관리</PageTitle>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'myCounselings'} 
          onClick={() => setActiveTab('myCounselings')}
        >
          내 상담 관리
        </Tab>
        <Tab 
          active={activeTab === 'otherStudents'} 
          onClick={() => setActiveTab('otherStudents')}
        >
          다른 학생 상담 내역
        </Tab>
      </TabContainer>
      
      {activeTab === 'myCounselings' ? (
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
      ) : (
        renderOtherStudentsCounselings()
      )}
      
      {isModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            {renderModalContent()}
          </ModalContainer>
        </ModalOverlay>
      )}
      
      {/* 학생 상담 내역 상세보기 모달 */}
      {isStudentCounselingModalOpen && selectedStudentCounseling && (
        <ModalOverlay onClick={closeStudentCounselingModal}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <ModalHeader>
              <h3>상담 내역 상세보기</h3>
              <CloseButton onClick={closeStudentCounselingModal}>&times;</CloseButton>
            </ModalHeader>
            
            <InfoSection>
              <InfoTitle>학생 정보</InfoTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>학생명</InfoLabel>
                  <InfoValue>{selectedStudentCounseling.studentName}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>학년/반/번호</InfoLabel>
                  <InfoValue>{selectedStudentCounseling.grade}학년 {selectedStudentCounseling.classNumber}반 {selectedStudentCounseling.number}번</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>연락처</InfoLabel>
                  <InfoValue>{selectedStudentCounseling.contactNumber}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </InfoSection>
            
            <InfoSection>
              <InfoTitle>상담 정보</InfoTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>신청일</InfoLabel>
                  <InfoValue>{selectedStudentCounseling.requestDate}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상담일</InfoLabel>
                  <InfoValue>{selectedStudentCounseling.counselingDate}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상담 시간</InfoLabel>
                  <InfoValue>{selectedStudentCounseling.counselingTime}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상담 종류</InfoLabel>
                  <InfoValue>{selectedStudentCounseling.counselingType}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상담 유형</InfoLabel>
                  <InfoValue>{selectedStudentCounseling.counselingCategory}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상담 장소</InfoLabel>
                  <InfoValue>{selectedStudentCounseling.location}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상태</InfoLabel>
                  <InfoValue>
                    <StatusBadge status={selectedStudentCounseling.status === '예약확정' ? 'scheduled' : selectedStudentCounseling.status === '완료' ? 'completed' : 'pending'}>
                      {selectedStudentCounseling.status}
                    </StatusBadge>
                  </InfoValue>
                </InfoItem>
              </InfoGrid>
            </InfoSection>
            
            <InfoSection>
              <InfoTitle>상담 신청 내용</InfoTitle>
              <InfoValue style={{ whiteSpace: 'pre-wrap' }}>{selectedStudentCounseling.requestContent}</InfoValue>
            </InfoSection>
            
            {selectedStudentCounseling.resultContent && (
              <InfoSection>
                <InfoTitle>상담 결과</InfoTitle>
                <InfoValue style={{ whiteSpace: 'pre-wrap' }}>{selectedStudentCounseling.resultContent}</InfoValue>
              </InfoSection>
            )}
            
            <ButtonContainer>
              <SecondaryButton onClick={closeStudentCounselingModal}>
                닫기
              </SecondaryButton>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default CounselingPage;
