import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import counselingApi from '../../../api/counselingApi';

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
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

const BookedTimesContainer = styled.div`
  margin-top: 20px;
  padding: 16px;
  background-color: #f8f8fa;
  border-radius: 8px;
`;

const BookedTimesTitle = styled.h3`
  font-family: 'Pretendard-Medium', sans-serif;
  color: #333;
  margin-bottom: 12px;
  font-size: 1rem;
`;

const BookedTimesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const BookedTimeItem = styled.div`
  padding: 6px 12px;
  background-color: #e0e0e0;
  border-radius: 16px;
  font-size: 0.9rem;
  color: #666;
`;

const FormSection = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const FormTitle = styled.h2`
  font-family: 'Pretendard-SemiBold', sans-serif;
  color: #333;
  margin-bottom: 16px;
  font-size: 1.2rem;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Pretendard-Regular', sans-serif;
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Pretendard-Regular', sans-serif;
  
  option:disabled {
    color: #999;
    background-color: #f5f5f5;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Pretendard-Regular', sans-serif;
  resize: vertical;
  min-height: 120px;
  grid-column: 1 / -1;
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  background-color: #1D4EB0;
  color: white;
  border: none;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
  cursor: pointer;
  grid-column: 1 / -1;
  justify-self: end;
  margin-top: 16px;
  
  &:hover:not(:disabled) {
    background-color: #1A44A3;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NoDateSelectedMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
`;

const RequestTabContent = ({ currentUser, childInfo }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    studentName: '',
    gradeClassNumber: '',
    contactNumber: '',
    counselingDate: '',
    counselingTime: '',
    counselingType: '교수상담', // 기본값 설정
    counselingCategory: '학업', // 기본값 설정
    counselingContent: ''
  });
  const [formValid, setFormValid] = useState(false);
  
  // Format date as YYYY-MM-DD for form and API
  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Fetch available times when date changes
  useEffect(() => {
    if (selectedDate && currentUser) {
      const formattedDate = formatDate(selectedDate);
      
      // Update form data with selected date
      setFormData(prev => ({
        ...prev,
        counselingDate: formattedDate
      }));
      
      // Fetch available times from API
      fetchAvailableTimes(formattedDate);
    }
  }, [selectedDate, currentUser]);
  
  // Function to fetch available times from API
  const fetchAvailableTimes = async (date) => {
    if (!date || !currentUser) return;
    
    setIsLoading(true);
    try {
      // 상담 교사 ID - 실제 구현에서는 선택된 교사 ID를 사용해야 함
      // 현재는 임시로 '1'을 사용
      const teacherId = '1';
      
      const response = await counselingApi.getAvailableTimes(teacherId, date);
      
      if (response.data && response.data.success) {
        const { availableTimes, bookedTimes } = response.data.data;
        
        setAvailableTimes(availableTimes || []);
        setBookedTimes(bookedTimes || []);
        
        console.log('상담 가능 시간 조회 성공:', { availableTimes, bookedTimes });
      }
    } catch (error) {
      console.error('상담 가능 시간 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Pre-fill form data based on user role
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'student') {
        setFormData(prev => ({
          ...prev,
          name: currentUser.name,
          gradeClassNumber: `${currentUser.grade}학년 ${currentUser.classNumber}반 ${currentUser.number}번`,
          contactNumber: '010-1234-5678' // In a real app, this would come from the user profile
        }));
      } else if (currentUser.role === 'parent') {
        // 자녀 정보가 있는 경우 사용
        if (childInfo) {
          console.log('%c[RequestTabContent] 자녀 정보 사용:', 'color: #2ecc71; font-weight: bold;', childInfo);
          setFormData(prev => ({
            ...prev,
            name: currentUser.name,
            studentName: childInfo.name,
            gradeClassNumber: `${childInfo.grade}학년 ${childInfo.classNumber}반 ${childInfo.number}번`,
            contactNumber: currentUser.contactNumber || '010-9876-5432' // In a real app, this would come from the user profile
          }));
        } else if (currentUser.childName && currentUser.childDetail) {
          // 기존 방식 (스토어에 저장된 정보 사용)
          console.log('%c[RequestTabContent] 스토어에 저장된 자녀 정보 사용:', 'color: #3498db; font-weight: bold;', { 
            childName: currentUser.childName, 
            childDetail: currentUser.childDetail 
          });
          setFormData(prev => ({
            ...prev,
            name: currentUser.name,
            studentName: currentUser.childName,
            gradeClassNumber: currentUser.childDetail,
            contactNumber: currentUser.contactNumber || '010-9876-5432' // In a real app, this would come from the user profile
          }));
        } else {
          // 자녀 정보가 없는 경우
          console.warn('%c[RequestTabContent] 자녀 정보 없음:', 'color: #e74c3c; font-weight: bold;');
          setFormData(prev => ({
            ...prev,
            name: currentUser.name,
            studentName: '정보 없음',
            gradeClassNumber: '정보 없음',
            contactNumber: currentUser.contactNumber || '010-9876-5432' // In a real app, this would come from the user profile
          }));
        }
      }
    }
  }, [currentUser, childInfo]);
  
  // Validate form
  useEffect(() => {
    const isValid = 
      formData.counselingDate.trim() !== '' &&
      formData.counselingTime.trim() !== '' &&
      formData.counselingContent.trim() !== '';
    
    setFormValid(isValid);
  }, [formData]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid || isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // 상담 신청 API 호출을 위한 데이터 구성
      let studentIdToUse;
      
      if (currentUser.role === 'student') {
        // 학생인 경우 자신의 ID 사용
        studentIdToUse = currentUser.id;
      } else if (currentUser.role === 'parent') {
        // 학부모인 경우 자녀 ID 결정 로직
        if (childInfo && childInfo.id) {
          // 1. childInfo에서 자녀 ID 사용 (가장 우선)
          studentIdToUse = childInfo.id;
          console.log('%c[RequestTabContent] 자녀 정보에서 ID 사용:', 'color: #2ecc71; font-weight: bold;', studentIdToUse);
        } else if (currentUser.childStudentId) {
          // 2. childStudentId 사용
          studentIdToUse = currentUser.childStudentId;
          console.log('%c[RequestTabContent] childStudentId 사용:', 'color: #3498db; font-weight: bold;', studentIdToUse);
        } else if (currentUser.childrenIds && currentUser.childrenIds.length > 0) {
          // 3. childrenIds 배열의 첫 번째 ID 사용
          studentIdToUse = currentUser.childrenIds[0];
          console.log('%c[RequestTabContent] childrenIds 배열에서 ID 사용:', 'color: #9b59b6; font-weight: bold;', studentIdToUse);
        } else {
          // 4. 폴백: 개발 환경에서는 더미 ID 사용
          studentIdToUse = '20250001';
          console.warn('%c[RequestTabContent] 자녀 ID를 찾을 수 없어 더미 ID 사용:', 'color: #e74c3c; font-weight: bold;', studentIdToUse);
        }
      }
      
      // 학생 ID 처리 로직 (8자리 숫자 형식인 경우 뒤의 4자리에서 앞의 0 제거)
      if (studentIdToUse) {
        // 문자열로 변환
        const studentIdStr = String(studentIdToUse);
        
        // 8자리 숫자 형식인지 확인 (예: 20250100)
        if (studentIdStr.length === 8 && /^\d+$/.test(studentIdStr)) {
          // 뒤의 4자리 추출 후 앞의 0 제거 (예: 0100 -> 100)
          const last4Digits = studentIdStr.substring(4);
          const processedId = parseInt(last4Digits, 10);
          console.log(`학생 ID 변환: ${studentIdStr} -> ${processedId}`);
          studentIdToUse = processedId;
        }
      }
      
      const requestData = {
        studentId: studentIdToUse,
        teacherId: '1', // 테스트용 교사 ID, 실제로는 선택한 교사 ID를 사용해야 함
        counselingDate: formData.counselingDate,
        counselingTime: formData.counselingTime,
        counselingType: formData.counselingType,
        counselingCategory: formData.counselingCategory,
        requestContent: formData.counselingContent,
        contactNumber: formData.contactNumber
      };
      
      console.log('상담 신청 데이터:', requestData);
      
      // API 호출
      const response = await counselingApi.createCounselingRequest(requestData);
      
      // 응답 처리
      if (response.data.success) {
        console.log('상담 신청 성공:', response.data.data);
        setSubmitSuccess(true);
        
        // 폼 초기화
        setFormData(prev => ({
          ...prev,
          counselingTime: '',
          counselingContent: ''
        }));
        
        // 선택한 날짜에 대한 가능 시간 다시 불러오기
        if (selectedDate) {
          fetchAvailableTimes(formatDate(selectedDate));
        }
        
        alert(response.data.data.message || '상담 신청이 완료되었습니다.');
      } else {
        // 에러 처리
        console.error('상담 신청 실패:', response.data.error);
        setSubmitError(response.data.error.message || '상담 신청 중 오류가 발생했습니다.');
        alert(response.data.error.message || '상담 신청 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('상담 신청 API 호출 오류:', error);
      setSubmitError('서버 연결 오류가 발생했습니다. 다시 시도해주세요.');
      alert('서버 연결 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container>
      <CalendarSection>
        <CalendarTitle>상담 일정 선택</CalendarTitle>
        <StyledCalendar
          onChange={setSelectedDate}
          value={selectedDate}
          minDate={new Date()}
        />
        
        {selectedDate && (
          <BookedTimesContainer>
            <BookedTimesTitle>
              {selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} 상황
            </BookedTimesTitle>
            {isLoading ? (
              <div>상담 가능 시간을 불러오는 중...</div>
            ) : (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <h4 style={{ margin: '10px 0 5px 0', fontSize: '0.95rem' }}>예약 가능 시간</h4>
                  <BookedTimesList>
                    {availableTimes.length > 0 ? (
                      availableTimes.map((time, index) => (
                        <BookedTimeItem key={index} style={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}>{time}</BookedTimeItem>
                      ))
                    ) : (
                      <span>예약 가능한 시간이 없습니다.</span>
                    )}
                  </BookedTimesList>
                </div>
                
                <div>
                  <h4 style={{ margin: '10px 0 5px 0', fontSize: '0.95rem' }}>예약된 시간</h4>
                  <BookedTimesList>
                    {bookedTimes.length > 0 ? (
                      bookedTimes.map((time, index) => (
                        <BookedTimeItem key={index}>{time}</BookedTimeItem>
                      ))
                    ) : (
                      <span>예약된 시간이 없습니다.</span>
                    )}
                  </BookedTimesList>
                </div>
              </>
            )}
          </BookedTimesContainer>
        )}
      </CalendarSection>
      
      {selectedDate ? (
        <FormSection>
          <FormTitle>상담 신청</FormTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>이름</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                disabled
              />
            </FormGroup>
            
            {currentUser && currentUser.role === 'parent' && (
              <FormGroup>
                <Label>학생 이름 (자녀)</Label>
                <Input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  disabled
                />
              </FormGroup>
            )}
            
            <FormGroup>
              <Label>{currentUser && currentUser.role === 'student' ? '학년/반/번호' : '자녀 학년/반/번호'}</Label>
              <Input
                type="text"
                name="gradeClassNumber"
                value={formData.gradeClassNumber}
                disabled
              />
            </FormGroup>
            
            <FormGroup>
              <Label>연락처</Label>
              <Input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                disabled
              />
            </FormGroup>
            
            <FormGroup>
              <Label>상담 날짜</Label>
              <Input
                type="date"
                name="counselingDate"
                value={formData.counselingDate}
                disabled
              />
            </FormGroup>
            
            <FormGroup>
              <Label>상담 시간</Label>
              <Select
                name="counselingTime"
                value={formData.counselingTime}
                onChange={handleInputChange}
                required
                disabled={isLoading || availableTimes.length === 0 || isSubmitting}
              >
                <option value="">시간 선택</option>
                {isLoading ? (
                  <option value="" disabled>상담 가능 시간을 불러오는 중...</option>
                ) : availableTimes.length === 0 ? (
                  <option value="" disabled>예약 가능한 시간이 없습니다</option>
                ) : (
                  availableTimes.map((time) => (
                    <option 
                      key={time} 
                      value={time}
                    >
                      {time}
                    </option>
                  ))
                )}
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>상담 유형</Label>
              <Select
                name="counselingType"
                value={formData.counselingType}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              >
                <option value="교수상담">교수상담</option>
                <option value="진로상담">진로상담</option>
                <option value="학생상담">학생상담</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>상담 카테고리</Label>
              <Select
                name="counselingCategory"
                value={formData.counselingCategory}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              >
                <option value="학업">학업</option>
                <option value="진로">진로</option>
                <option value="생활">생활</option>
                <option value="심리">심리</option>
                <option value="기타">기타</option>
              </Select>
            </FormGroup>
            
            <TextArea
              name="counselingContent"
              value={formData.counselingContent}
              onChange={handleInputChange}
              placeholder="상담 내용을 입력해주세요."
              required
              disabled={isSubmitting}
            />
            
            {submitError && (
              <div style={{ color: 'red', marginTop: '10px', marginBottom: '10px' }}>
                {submitError}
              </div>
            )}
            
            {submitSuccess && (
              <div style={{ color: 'green', marginTop: '10px', marginBottom: '10px' }}>
                상담 신청이 성공적으로 완료되었습니다.
              </div>
            )}
            
            <SubmitButton type="submit" disabled={!formValid || isSubmitting}>
              {isSubmitting ? '신청 중...' : '상담 신청'}
            </SubmitButton>
          </Form>
        </FormSection>
      ) : (
        <FormSection>
          <NoDateSelectedMessage>
            달력에서 상담 날짜를 선택해주세요.
          </NoDateSelectedMessage>
        </FormSection>
      )}
    </Container>
  );
};

export default RequestTabContent;
