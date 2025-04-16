// src/components/main/CalendarComponent.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { calendarSchedule, getEventsByMonth } from "../../data/dummyCalendarSchedule";

const CalendarContainer = styled.div`
  display: flex;
  gap: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
`;

const CalendarWrapper = styled.div`
  flex: 3.5;
  width: 100%;
`;

const EventsWrapper = styled.div`
  flex: 1;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  min-width: 180px;
`;

const Title = styled.h2`
  color: #1D4EB0;
  font-size: 1.4rem;
  margin-bottom: 15px;
  border-bottom: 2px solid #1D4EB0;
  padding-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SubTitle = styled.h3`
  color: #1D4EB0;
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  width: 100%;
`;

const DayHeader = styled.div`
  text-align: center;
  font-weight: bold;
  padding: 8px 5px;
  background-color: #1D4EB0;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
`;

const Day = styled.div`
  height: 75px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px;
  background-color: ${props => props.isToday ? '#e8f4fc' : 'white'};
  opacity: ${props => props.isCurrentMonth ? 1 : 0.5};
  position: relative;
  width: 100%;
  
  &:hover {
    background-color: ${props => props.isToday ? '#d0e8f7' : '#f0f0f0'};
  }
`;

const DayNumber = styled.div`
  font-weight: ${props => props.isToday ? 'bold' : 'normal'};
  color: ${props => props.isToday ? '#1D4EB0' : 'inherit'};
  font-size: 13px;
`;

const EventDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.type) {
      case '중요': return '#e74c3c';
      case '행사': return '#3498db';
      case '휴일': return '#2ecc71';
      default: return '#f39c12';
    }
  }};
  display: inline-block;
  margin-right: 3px;
`;

const EventTitle = styled.div`
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
  color: ${props => {
    switch (props.type) {
      case '중요': return '#e74c3c';
      case '행사': return '#3498db';
      case '휴일': return '#2ecc71';
      default: return '#f39c12';
    }
  }};
`;

const EventsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const EventItem = styled.li`
  padding: 6px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const EventDate = styled.span`
  font-weight: bold;
  color: #1D4EB0;
  margin-right: 8px;
  font-size: 13px;
  min-width: 45px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  color: #1D4EB0;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  font-size: 16px;
`;

const YearMonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 15px;
`;

const MonthButton = styled.button`
  padding: 6px;
  background-color: ${props => props.selected ? '#1D4EB0' : '#f0f0f0'};
  color: ${props => props.selected ? 'white' : 'black'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  
  &:hover {
    background-color: ${props => props.selected ? '#1D4EB0' : '#e0e0e0'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 15px;
  background-color: ${props => props.primary ? '#1D4EB0' : '#f0f0f0'};
  color: ${props => props.primary ? 'white' : 'black'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.primary ? '#153a8c' : '#e0e0e0'};
  }
`;

const CalendarComponent = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [calendarDays, setCalendarDays] = useState([]);
  const [monthEvents, setMonthEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  // 달력 날짜 계산
  useEffect(() => {
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
    
    // 이전 달의 마지막 날짜들
    const prevMonthDays = [];
    if (firstDayOfMonth > 0) {
      const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const prevMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      const daysInPrevMonth = new Date(prevMonthYear, prevMonth, 0).getDate();
      
      for (let i = 0; i < firstDayOfMonth; i++) {
        prevMonthDays.push({
          day: daysInPrevMonth - i,
          month: prevMonth,
          year: prevMonthYear,
          isCurrentMonth: false
        });
      }
      prevMonthDays.reverse();
    }
    
    // 현재 달의 날짜들
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true
      });
    }
    
    // 다음 달의 날짜들
    const nextMonthDays = [];
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const remainingDays = 42 - totalDays; // 6주 표시를 위해 42칸 확보
    
    if (remainingDays > 0) {
      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;
      
      for (let i = 1; i <= remainingDays; i++) {
        nextMonthDays.push({
          day: i,
          month: nextMonth,
          year: nextMonthYear,
          isCurrentMonth: false
        });
      }
    }
    
    setCalendarDays([...prevMonthDays, ...currentMonthDays, ...nextMonthDays]);
    
    // 이번 달 이벤트 가져오기
    const events = getEventsByMonth(currentYear, currentMonth);
    setMonthEvents(events);
  }, [currentYear, currentMonth]);
  
  // 이전 달로 이동
  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // 다음 달로 이동
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // 날짜에 해당하는 이벤트 찾기
  const findEventForDay = (year, month, day) => {
    const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return monthEvents.find(event => event.date === dateString);
  };
  
  // 월 선택 모달 열기
  const openMonthSelector = () => {
    setSelectedYear(currentYear);
    setShowModal(true);
  };
  
  // 월 선택 적용
  const applyMonthSelection = (month) => {
    setCurrentMonth(month);
    setShowModal(false);
  };
  
  // 요일 헤더
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  
  return (
    <CalendarContainer>
      <CalendarWrapper>
        <Title>
          <span>학사 일정</span>
          <MonthSelector onClick={openMonthSelector}>
            {currentYear}년 {currentMonth}월 ▼
          </MonthSelector>
        </Title>
        
        <CalendarGrid>
          {dayNames.map((day, index) => (
            <DayHeader key={index}>{day}</DayHeader>
          ))}
          
          {calendarDays.map((dayInfo, index) => {
            const isToday = 
              dayInfo.year === today.getFullYear() && 
              dayInfo.month === today.getMonth() + 1 && 
              dayInfo.day === today.getDate();
            
            const event = findEventForDay(dayInfo.year, dayInfo.month, dayInfo.day);
            
            return (
              <Day 
                key={index} 
                isToday={isToday}
                isCurrentMonth={dayInfo.isCurrentMonth}
              >
                <DayNumber isToday={isToday}>{dayInfo.day}</DayNumber>
                {event && (
                  <EventTitle type={event.type}>
                    <EventDot type={event.type} />
                    {event.title}
                  </EventTitle>
                )}
              </Day>
            );
          })}
        </CalendarGrid>
      </CalendarWrapper>
      
      <EventsWrapper>
        <SubTitle>{currentMonth}월 주요 일정</SubTitle>
        <EventsList>
          {monthEvents.map((event, index) => {
            const date = new Date(event.date);
            const day = date.getDate();
            
            return (
              <EventItem key={index}>
                <EventDate>{currentMonth}/{day}</EventDate>
                <EventDot type={event.type} />
                <span>{event.title}</span>
              </EventItem>
            );
          })}
        </EventsList>
      </EventsWrapper>
      
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>년/월 선택</ModalTitle>
            
            <div>
              <label>년도: </label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {[2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>{year}년</option>
                ))}
              </select>
            </div>
            
            <YearMonthGrid>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <MonthButton 
                  key={month}
                  selected={currentMonth === month && currentYear === selectedYear}
                  onClick={() => applyMonthSelection(month)}
                >
                  {month}월
                </MonthButton>
              ))}
            </YearMonthGrid>
            
            <ButtonGroup>
              <Button onClick={() => setShowModal(false)}>취소</Button>
              <Button primary onClick={() => setShowModal(false)}>확인</Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </CalendarContainer>
  );
};

export default CalendarComponent;
