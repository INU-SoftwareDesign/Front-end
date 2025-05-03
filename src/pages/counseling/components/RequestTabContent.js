import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dummyStudentCounselingData from '../../../data/dummyStudentCounselingData';

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

const RequestTabContent = ({ currentUser }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    studentName: '',
    gradeClassNumber: '',
    contactNumber: '',
    counselingDate: '',
    counselingTime: '',
    counselingContent: ''
  });
  const [formValid, setFormValid] = useState(false);
  
  // Available times from dummy data
  const availableTimes = dummyStudentCounselingData.availableTimes;
  
  // Format date as YYYY-MM-DD for form and API
  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Update booked times when date changes
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      const bookedSlotsForDate = dummyStudentCounselingData.bookedSlots[formattedDate] || [];
      setBookedTimes(bookedSlotsForDate);
      
      // Update form data with selected date
      setFormData(prev => ({
        ...prev,
        counselingDate: formattedDate
      }));
    }
  }, [selectedDate]);
  
  // Pre-fill form data based on user role
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'student') {
        setFormData(prev => ({
          ...prev,
          name: currentUser.name,
          gradeClassNumber: `${currentUser.grade}학년 ${currentUser.class}반 ${currentUser.number}번`,
          contactNumber: '010-1234-5678' // In a real app, this would come from the user profile
        }));
      } else if (currentUser.role === 'parent') {
        setFormData(prev => ({
          ...prev,
          name: currentUser.name,
          studentName: currentUser.childName,
          gradeClassNumber: currentUser.childDetail,
          contactNumber: '010-9876-5432' // In a real app, this would come from the user profile
        }));
      }
    }
  }, [currentUser]);
  
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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValid) return;
    
    // In a real app, this would send the data to an API
    console.log('Submitting counseling request:', formData);
    
    // Reset form
    setFormData(prev => ({
      ...prev,
      counselingTime: '',
      counselingContent: ''
    }));
    
    alert('상담 신청이 완료되었습니다.');
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
              {selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} 예약된 시간
            </BookedTimesTitle>
            <BookedTimesList>
              {bookedTimes.length > 0 ? (
                bookedTimes.map((time, index) => (
                  <BookedTimeItem key={index}>{time}</BookedTimeItem>
                ))
              ) : (
                <span>예약된 시간이 없습니다.</span>
              )}
            </BookedTimesList>
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
              >
                <option value="">시간 선택</option>
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
            </FormGroup>
            
            <TextArea
              name="counselingContent"
              value={formData.counselingContent}
              onChange={handleInputChange}
              placeholder="상담 내용을 입력해주세요."
              required
            />
            
            <SubmitButton type="submit" disabled={!formValid}>
              상담 신청
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
