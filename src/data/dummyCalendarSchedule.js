// src/data/dummyCalendarSchedule.js
// 학사 일정 더미 데이터

export const calendarSchedule = {
  // 2025년 4월 학사 일정
  "2025-04": [
    { date: "2025-04-01", title: "새 학기 시작", type: "일반" },
    { date: "2025-04-05", title: "학부모 상담의 날", type: "행사" },
    { date: "2025-04-08", title: "입학식", type: "중요" },
    { date: "2025-04-12", title: "교내 체육대회", type: "행사" },
    { date: "2025-04-15", title: "교직원 연수", type: "일반" },
    { date: "2025-04-20", title: "중간고사", type: "중요" },
    { date: "2025-04-21", title: "중간고사", type: "중요" },
    { date: "2025-04-22", title: "중간고사", type: "중요" },
    { date: "2025-04-25", title: "과학의 날 행사", type: "행사" },
    { date: "2025-04-30", title: "학생회 선거", type: "일반" }
  ],
  // 2025년 5월 학사 일정
  "2025-05": [
    { date: "2025-05-01", title: "근로자의 날", type: "휴일" },
    { date: "2025-05-05", title: "어린이날", type: "휴일" },
    { date: "2025-05-08", title: "학부모 공개수업", type: "행사" },
    { date: "2025-05-15", title: "스승의 날", type: "일반" },
    { date: "2025-05-19", title: "부처님 오신 날", type: "휴일" },
    { date: "2025-05-22", title: "진로체험의 날", type: "행사" },
    { date: "2025-05-27", title: "학교 축제 준비", type: "일반" },
    { date: "2025-05-28", title: "학교 축제", type: "중요" },
    { date: "2025-05-29", title: "학교 축제", type: "중요" },
    { date: "2025-05-30", title: "학교 축제 정리", type: "일반" }
  ],
  // 2025년 6월 학사 일정
  "2025-06": [
    { date: "2025-06-06", title: "현충일", type: "휴일" },
    { date: "2025-06-10", title: "학생회 간담회", type: "일반" },
    { date: "2025-06-15", title: "기말고사 대비 특강", type: "일반" },
    { date: "2025-06-20", title: "기말고사", type: "중요" },
    { date: "2025-06-21", title: "기말고사", type: "중요" },
    { date: "2025-06-22", title: "기말고사", type: "중요" },
    { date: "2025-06-25", title: "방학식", type: "중요" },
    { date: "2025-06-26", title: "여름방학 시작", type: "일반" },
    { date: "2025-06-30", title: "교직원 연수", type: "일반" }
  ]
};

// 날짜별 이벤트 가져오기
export const getEventsByDate = (year, month, day) => {
  const dateKey = `${year}-${month.toString().padStart(2, '0')}`;
  const fullDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  
  if (!calendarSchedule[dateKey]) return null;
  
  return calendarSchedule[dateKey].find(event => event.date === fullDate);
};

// 월별 이벤트 가져오기
export const getEventsByMonth = (year, month) => {
  const dateKey = `${year}-${month.toString().padStart(2, '0')}`;
  return calendarSchedule[dateKey] || [];
};
