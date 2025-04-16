// src/data/dummyTimetable.js
// 교사와 학생용 시간표 더미 데이터

// 교사용 시간표 (교사 ID 기준)
export const teacherTimetable = {
  "teacher123": {
    name: "김선생",
    timetable: {
      // 요일별 시간표 (1: 월요일, 2: 화요일, 3: 수요일, 4: 목요일, 5: 금요일)
      1: [
        { period: 1, class: "1-3", subject: "국어" },
        { period: 2, class: "1-3", subject: "국어" },
        { period: 3, class: "2-1", subject: "국어" },
        { period: 4, class: "2-1", subject: "국어" },
        { period: "점심", class: "", subject: "점심시간" },
        { period: 5, class: "3-2", subject: "국어" },
        { period: 6, class: "", subject: "" },
        { period: 7, class: "", subject: "" },
        { period: "방과후", class: "1-3", subject: "독서논술" }
      ],
      2: [
        { period: 1, class: "2-2", subject: "국어" },
        { period: 2, class: "2-2", subject: "국어" },
        { period: 3, class: "1-1", subject: "국어" },
        { period: 4, class: "1-1", subject: "국어" },
        { period: "점심", class: "", subject: "점심시간" },
        { period: 5, class: "", subject: "" },
        { period: 6, class: "3-1", subject: "국어" },
        { period: 7, class: "3-1", subject: "국어" },
        { period: "방과후", class: "", subject: "" }
      ],
      3: [
        { period: 1, class: "3-3", subject: "국어" },
        { period: 2, class: "3-3", subject: "국어" },
        { period: 3, class: "", subject: "" },
        { period: 4, class: "1-2", subject: "국어" },
        { period: "점심", class: "", subject: "점심시간" },
        { period: 5, class: "1-2", subject: "국어" },
        { period: 6, class: "2-3", subject: "국어" },
        { period: 7, class: "2-3", subject: "국어" },
        { period: "방과후", class: "3-2", subject: "문학토론" }
      ],
      4: [
        { period: 1, class: "", subject: "" },
        { period: 2, class: "1-3", subject: "국어" },
        { period: 3, class: "3-2", subject: "국어" },
        { period: 4, class: "3-2", subject: "국어" },
        { period: "점심", class: "", subject: "점심시간" },
        { period: 5, class: "2-1", subject: "국어" },
        { period: 6, class: "2-1", subject: "국어" },
        { period: 7, class: "", subject: "" },
        { period: "방과후", class: "", subject: "" }
      ],
      5: [
        { period: 1, class: "1-1", subject: "국어" },
        { period: 2, class: "1-1", subject: "국어" },
        { period: 3, class: "3-1", subject: "국어" },
        { period: 4, class: "3-1", subject: "국어" },
        { period: "점심", class: "", subject: "점심시간" },
        { period: 5, class: "2-2", subject: "국어" },
        { period: 6, class: "2-2", subject: "국어" },
        { period: 7, class: "", subject: "" },
        { period: "방과후", class: "2-1", subject: "작문" }
      ]
    }
  },
  "teacher456": {
    name: "이수학",
    timetable: {
      1: [
        { period: 1, class: "2-1", subject: "수학" },
        { period: 2, class: "2-1", subject: "수학" },
        { period: 3, class: "3-2", subject: "수학" },
        { period: 4, class: "3-2", subject: "수학" },
        { period: "점심", class: "", subject: "점심시간" },
        { period: 5, class: "1-3", subject: "수학" },
        { period: 6, class: "1-3", subject: "수학" },
        { period: 7, class: "", subject: "" },
        { period: "방과후", class: "3-2", subject: "수학심화" }
      ],
      // 다른 요일 시간표 생략...
      2: [
        { period: 1, class: "1-1", subject: "수학" },
        { period: 2, class: "1-1", subject: "수학" },
        { period: 3, class: "3-3", subject: "수학" },
        { period: 4, class: "3-3", subject: "수학" },
        { period: "점심", class: "", subject: "점심시간" },
        { period: 5, class: "2-2", subject: "수학" },
        { period: 6, class: "2-2", subject: "수학" },
        { period: 7, class: "", subject: "" },
        { period: "방과후", class: "", subject: "" }
      ],
      3: [
        { period: 1, class: "1-2", subject: "수학" },
        { period: 2, class: "1-2", subject: "수학" },
        { period: 3, class: "2-3", subject: "수학" },
        { period: 4, class: "2-3", subject: "수학" },
        { period: "점심", class: "", subject: "점심시간" },
        { period: 5, class: "3-1", subject: "수학" },
        { period: 6, class: "3-1", subject: "수학" },
        { period: 7, class: "", subject: "" },
        { period: "방과후", class: "1-1", subject: "수학기초" }
      ],
      4: [
        { period: 1, class: "3-2", subject: "수학" },
        { period: 2, class: "3-2", subject: "수학" },
        { period: 3, class: "1-3", subject: "수학" },
        { period: 4, class: "1-3", subject: "수학" },
        { period: "점심", class: "", subject: "점심시간" },
        { period: 5, class: "2-1", subject: "수학" },
        { period: 6, class: "2-1", subject: "수학" },
        { period: 7, class: "", subject: "" },
        { period: "방과후", class: "", subject: "" }
      ],
      5: [
        { period: 1, class: "2-2", subject: "수학" },
        { period: 2, class: "2-2", subject: "수학" },
        { period: 3, class: "1-1", subject: "수학" },
        { period: 4, class: "1-1", subject: "수학" },
        { period: "점심", class: "", subject: "점심시간" },
        { period: 5, class: "3-3", subject: "수학" },
        { period: 6, class: "3-3", subject: "수학" },
        { period: 7, class: "", subject: "" },
        { period: "방과후", class: "2-2", subject: "수학심화" }
      ]
    }
  }
};

// 학생용 시간표 (학년-반 기준)
export const classTimetable = {
  "1-1": {
    monday: [
      { period: 1, subject: "영어", teacher: "박영어" },
      { period: 2, subject: "영어", teacher: "박영어" },
      { period: 3, subject: "체육", teacher: "정체육" },
      { period: 4, subject: "체육", teacher: "정체육" },
      { period: "점심", subject: "점심시간", teacher: "" },
      { period: 5, subject: "과학", teacher: "최과학" },
      { period: 6, subject: "과학", teacher: "최과학" },
      { period: 7, subject: "창체", teacher: "담임" },
      { period: "방과후", subject: "축구", teacher: "정체육" }
    ],
    tuesday: [
      { period: 1, subject: "수학", teacher: "이수학" },
      { period: 2, subject: "수학", teacher: "이수학" },
      { period: 3, subject: "국어", teacher: "김선생" },
      { period: 4, subject: "국어", teacher: "김선생" },
      { period: "점심", subject: "점심시간", teacher: "" },
      { period: 5, subject: "사회", teacher: "한사회" },
      { period: 6, subject: "사회", teacher: "한사회" },
      { period: 7, subject: "미술", teacher: "임미술" },
      { period: "방과후", subject: "", teacher: "" }
    ],
    wednesday: [
      { period: 1, subject: "과학", teacher: "최과학" },
      { period: 2, subject: "과학", teacher: "최과학" },
      { period: 3, subject: "영어", teacher: "박영어" },
      { period: 4, subject: "영어", teacher: "박영어" },
      { period: "점심", subject: "점심시간", teacher: "" },
      { period: 5, subject: "음악", teacher: "송음악" },
      { period: 6, subject: "음악", teacher: "송음악" },
      { period: 7, subject: "창체", teacher: "담임" },
      { period: "방과후", subject: "수학기초", teacher: "이수학" }
    ],
    thursday: [
      { period: 1, subject: "사회", teacher: "한사회" },
      { period: 2, subject: "사회", teacher: "한사회" },
      { period: 3, subject: "미술", teacher: "임미술" },
      { period: 4, subject: "미술", teacher: "임미술" },
      { period: "점심", subject: "점심시간", teacher: "" },
      { period: 5, subject: "체육", teacher: "정체육" },
      { period: 6, subject: "체육", teacher: "정체육" },
      { period: 7, subject: "창체", teacher: "담임" },
      { period: "방과후", subject: "", teacher: "" }
    ],
    friday: [
      { period: 1, subject: "국어", teacher: "김선생" },
      { period: 2, subject: "국어", teacher: "김선생" },
      { period: 3, subject: "수학", teacher: "이수학" },
      { period: 4, subject: "수학", teacher: "이수학" },
      { period: "점심", subject: "점심시간", teacher: "" },
      { period: 5, subject: "영어", teacher: "박영어" },
      { period: 6, subject: "영어", teacher: "박영어" },
      { period: 7, subject: "창체", teacher: "담임" },
      { period: "방과후", subject: "영어회화", teacher: "박영어" }
    ]
  },
  // 다른 반 시간표는 생략...
  "2-1": {
    monday: [
      { period: 1, subject: "수학", teacher: "이수학" },
      { period: 2, subject: "수학", teacher: "이수학" },
      { period: 3, subject: "국어", teacher: "김선생" },
      { period: 4, subject: "국어", teacher: "김선생" },
      { period: "점심", subject: "점심시간", teacher: "" },
      { period: 5, subject: "영어", teacher: "박영어" },
      { period: 6, subject: "영어", teacher: "박영어" },
      { period: 7, subject: "창체", teacher: "담임" },
      { period: "방과후", subject: "", teacher: "" }
    ],
    // 다른 요일 생략...
    tuesday: [
      { period: 1, subject: "국어", teacher: "김선생" },
      { period: 2, subject: "국어", teacher: "김선생" },
      { period: 3, subject: "과학", teacher: "최과학" },
      { period: 4, subject: "과학", teacher: "최과학" },
      { period: "점심", subject: "점심시간", teacher: "" },
      { period: 5, subject: "음악", teacher: "송음악" },
      { period: 6, subject: "음악", teacher: "송음악" },
      { period: 7, subject: "창체", teacher: "담임" },
      { period: "방과후", subject: "", teacher: "" }
    ],
    wednesday: [
      { period: 1, subject: "영어", teacher: "박영어" },
      { period: 2, subject: "영어", teacher: "박영어" },
      { period: 3, subject: "체육", teacher: "정체육" },
      { period: 4, subject: "체육", teacher: "정체육" },
      { period: "점심", subject: "점심시간", teacher: "" },
      { period: 5, subject: "사회", teacher: "한사회" },
      { period: 6, subject: "사회", teacher: "한사회" },
      { period: 7, subject: "창체", teacher: "담임" },
      { period: "방과후", subject: "", teacher: "" }
    ],
    thursday: [
      { period: 1, subject: "미술", teacher: "임미술" },
      { period: 2, subject: "미술", teacher: "임미술" },
      { period: 3, subject: "사회", teacher: "한사회" },
      { period: 4, subject: "사회", teacher: "한사회" },
      { period: "점심", subject: "점심시간", teacher: "" },
      { period: 5, subject: "수학", teacher: "이수학" },
      { period: 6, subject: "수학", teacher: "이수학" },
      { period: 7, subject: "창체", teacher: "담임" },
      { period: "방과후", subject: "", teacher: "" }
    ],
    friday: [
      { period: 1, subject: "과학", teacher: "최과학" },
      { period: 2, subject: "과학", teacher: "최과학" },
      { period: 3, subject: "체육", teacher: "정체육" },
      { period: 4, subject: "체육", teacher: "정체육" },
      { period: "점심", subject: "점심시간", teacher: "" },
      { period: 5, subject: "국어", teacher: "김선생" },
      { period: 6, subject: "국어", teacher: "김선생" },
      { period: 7, subject: "창체", teacher: "담임" },
      { period: "방과후", subject: "작문", teacher: "김선생" }
    ]
  }
};

// 현재 요일 번호 구하기 (1: 월요일, 2: 화요일, ...)
export const getCurrentDayNumber = () => {
  const day = new Date().getDay();
  return day === 0 ? 7 : day; // 일요일(0)을 7로 변환
};

// 현재 요일 이름 구하기
export const getCurrentDayName = () => {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return days[new Date().getDay()];
};
