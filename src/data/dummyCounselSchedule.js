// src/data/dummyCounselSchedule.js
// 상담 일정 더미 데이터

export const counselSchedule = {
  "teacher123": [
    {
      id: 1,
      studentName: "김학생",
      studentId: "student001",
      class: "1-3",
      date: "2025-04-17",
      time: "16:00 - 16:30",
      topic: "학업 상담",
      status: "예정"
    },
    {
      id: 2,
      studentName: "이민준",
      studentId: "student002",
      class: "1-3",
      date: "2025-04-18",
      time: "15:30 - 16:00",
      topic: "진로 상담",
      status: "예정"
    },
    {
      id: 3,
      studentName: "박서연",
      studentId: "student003",
      class: "2-1",
      date: "2025-04-19",
      time: "14:00 - 14:30",
      topic: "학교생활 적응",
      status: "예정"
    },
    {
      id: 4,
      studentName: "최지우",
      studentId: "student004",
      class: "2-1",
      date: "2025-04-22",
      time: "16:30 - 17:00",
      topic: "학업 성취도",
      status: "예정"
    },
    {
      id: 5,
      studentName: "정도윤",
      studentId: "student005",
      class: "3-2",
      date: "2025-04-24",
      time: "15:00 - 15:30",
      topic: "진로 상담",
      status: "예정"
    },
    {
      id: 6,
      studentName: "강하은",
      studentId: "student006",
      class: "3-2",
      date: "2025-04-25",
      time: "16:00 - 16:30",
      topic: "대입 준비",
      status: "예정"
    },
    {
      id: 7,
      studentName: "윤서준",
      studentId: "student007",
      class: "1-3",
      date: "2025-04-26",
      time: "14:30 - 15:00",
      topic: "학교생활 적응",
      status: "예정"
    },
    {
      id: 8,
      studentName: "임지민",
      studentId: "student008",
      class: "2-1",
      date: "2025-04-29",
      time: "15:30 - 16:00",
      topic: "학업 성취도",
      status: "예정"
    },
    {
      id: 9,
      studentName: "한예준",
      studentId: "student009",
      class: "3-2",
      date: "2025-05-02",
      time: "16:00 - 16:30",
      topic: "대입 준비",
      status: "예정"
    },
    {
      id: 10,
      studentName: "오서영",
      studentId: "student010",
      class: "1-3",
      date: "2025-05-03",
      time: "14:00 - 14:30",
      topic: "학교생활 적응",
      status: "예정"
    }
  ],
  "teacher456": [
    {
      id: 11,
      studentName: "신지호",
      studentId: "student011",
      class: "2-1",
      date: "2025-04-17",
      time: "15:00 - 15:30",
      topic: "수학 학습 방법",
      status: "예정"
    },
    {
      id: 12,
      studentName: "조은서",
      studentId: "student012",
      class: "2-1",
      date: "2025-04-18",
      time: "16:00 - 16:30",
      topic: "수학 성적 향상",
      status: "예정"
    },
    {
      id: 13,
      studentName: "권민석",
      studentId: "student013",
      class: "3-2",
      date: "2025-04-20",
      time: "14:30 - 15:00",
      topic: "수학 심화 학습",
      status: "예정"
    },
    {
      id: 14,
      studentName: "황서진",
      studentId: "student014",
      class: "3-2",
      date: "2025-04-23",
      time: "15:30 - 16:00",
      topic: "대입 수학 준비",
      status: "예정"
    },
    {
      id: 15,
      studentName: "송현우",
      studentId: "student015",
      class: "1-3",
      date: "2025-04-24",
      time: "16:30 - 17:00",
      topic: "수학 기초 학습",
      status: "예정"
    },
    {
      id: 16,
      studentName: "백수아",
      studentId: "student016",
      class: "1-3",
      date: "2025-04-27",
      time: "14:00 - 14:30",
      topic: "수학 학습 방법",
      status: "예정"
    },
    {
      id: 17,
      studentName: "유준호",
      studentId: "student017",
      class: "2-1",
      date: "2025-04-28",
      time: "15:00 - 15:30",
      topic: "수학 성적 향상",
      status: "예정"
    },
    {
      id: 18,
      studentName: "홍지아",
      studentId: "student018",
      class: "3-2",
      date: "2025-04-30",
      time: "16:00 - 16:30",
      topic: "대입 수학 준비",
      status: "예정"
    },
    {
      id: 19,
      studentName: "안도현",
      studentId: "student019",
      class: "1-3",
      date: "2025-05-01",
      time: "14:30 - 15:00",
      topic: "수학 기초 학습",
      status: "예정"
    },
    {
      id: 20,
      studentName: "문서윤",
      studentId: "student020",
      class: "2-1",
      date: "2025-05-04",
      time: "15:30 - 16:00",
      topic: "수학 심화 학습",
      status: "예정"
    }
  ]
};

// 오늘 날짜 기준으로 가까운 상담 일정 가져오기
export const getUpcomingCounsels = (teacherId, count = 8) => {
  if (!counselSchedule[teacherId]) return [];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return counselSchedule[teacherId]
    .filter(counsel => {
      const counselDate = new Date(counsel.date);
      return counselDate >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, count);
};
