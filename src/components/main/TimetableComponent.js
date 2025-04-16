// src/components/main/TimetableComponent.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { teacherTimetable, classTimetable, getCurrentDayNumber, getCurrentDayName } from "../../data/dummyTimetable";
import { dailySchedule } from "../../data/dummyDailySchedule";

const TimetableContainer = styled.div`
  display: flex;
  gap: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
`;

const TimetableWrapper = styled.div`
  flex: 3.5;
  width: 100%;
`;

const TodayScheduleWrapper = styled.div`
  flex: 1;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  min-width: 180px;
`;

const Title = styled.h2`
  color: #1D4EB0;
  font-size: 1.5rem;
  margin-bottom: 15px;
  border-bottom: 2px solid #1D4EB0;
  padding-bottom: 8px;
`;

const SubTitle = styled.h3`
  color: #1D4EB0;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin-bottom: 15px;
`;

const Th = styled.th`
  background-color: #1D4EB0;
  color: white;
  padding: 8px 5px;
  text-align: center;
  border: 1px solid #ddd;
  font-size: 14px;
  width: ${props => props.isPeriod ? '60px' : 'auto'};
`;

const Td = styled.td`
  padding: 8px 5px;
  text-align: center;
  border: 1px solid #ddd;
  background-color: ${props => props.isToday ? '#e8f4fc' : 'white'};
  font-weight: ${props => props.isToday ? 'bold' : 'normal'};
  font-size: 14px;
`;

const EmptyCell = styled(Td)`
  background-color: #f8f9fa;
`;

const ScheduleList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ScheduleItem = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  
  &:last-child {
    border-bottom: none;
  }
`;

const Time = styled.span`
  font-weight: bold;
  color: #1D4EB0;
  margin-right: 10px;
  font-size: 13px;
  min-width: 80px;
`;

const Activity = styled.span`
  flex: 1;
  font-size: 13px;
`;

const TimetableComponent = ({ userRole = "teacher", userId = "teacher123", classId = "1-1" }) => {
  const [timetableData, setTimetableData] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const currentDay = getCurrentDayNumber();
  const currentDayName = getCurrentDayName();
  
  useEffect(() => {
    // 시간표 데이터 설정
    if (userRole === "teacher") {
      if (teacherTimetable[userId]) {
        setTimetableData(teacherTimetable[userId].timetable);
      }
      if (dailySchedule.teacher[userId]) {
        setTodaySchedule(dailySchedule.teacher[userId]);
      }
    } else {
      if (classTimetable[classId]) {
        // 학생/학부모용 시간표는 요일별로 다르게 구성되어 있어 변환 필요
        const transformedData = {};
        const dayMap = {
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5
        };
        
        for (const [day, schedule] of Object.entries(classTimetable[classId])) {
          transformedData[dayMap[day]] = schedule;
        }
        
        setTimetableData(transformedData);
      }
      if (dailySchedule.student[classId]) {
        setTodaySchedule(dailySchedule.student[classId]);
      }
    }
  }, [userRole, userId, classId]);
  
  const periods = ["1", "2", "3", "4", "점심", "5", "6", "7", "방과후"];
  const days = ["월", "화", "수", "목", "금"];
  
  return (
    <TimetableContainer>
      <TimetableWrapper>
        <Title>시간표</Title>
        <Table>
          <thead>
            <tr>
              <Th>교시</Th>
              {days.map((day, index) => (
                <Th key={index} isToday={index + 1 === currentDay}>{day}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period, periodIndex) => (
              <tr key={periodIndex}>
                <Th isPeriod>{period}</Th>
                {days.map((day, dayIndex) => {
                  const dayNumber = dayIndex + 1;
                  const cellData = timetableData[dayNumber]?.[periodIndex];
                  
                  if (!cellData) {
                    return <EmptyCell key={dayIndex} isToday={dayNumber === currentDay} />;
                  }
                  
                  return (
                    <Td key={dayIndex} isToday={dayNumber === currentDay}>
                      {userRole === "teacher" ? (
                        <>
                          {cellData.class && (
                            <>
                              <div style={{ fontSize: '14px' }}>{cellData.class}</div>
                              <div style={{ fontSize: '14px' }}>{cellData.subject}</div>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: '14px' }}>{cellData.subject}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{cellData.teacher}</div>
                        </>
                      )}
                    </Td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </TimetableWrapper>
      
      <TodayScheduleWrapper>
        <SubTitle>오늘의 일정</SubTitle>
        <ScheduleList>
          {todaySchedule.map((item, index) => (
            <ScheduleItem key={index}>
              <Time>{item.time}</Time>
              <Activity>{item.activity}</Activity>
            </ScheduleItem>
          ))}
        </ScheduleList>
      </TodayScheduleWrapper>
    </TimetableContainer>
  );
};

export default TimetableComponent;
