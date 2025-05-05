const dummyStudentCounselingData = {
  // 담임교수 상담 가능 시간 (시간별)
  availableTimes: [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ],
  
  // 이미 예약된 상담 시간 (날짜별)
  bookedSlots: {
    "2025-05-05": ["10:00", "13:30", "15:00"],
    "2025-05-06": ["09:30", "11:00", "14:30"],
    "2025-05-10": ["09:00", "13:00", "16:30"],
    "2025-05-12": ["10:30", "15:30"],
    "2025-05-15": ["11:30", "14:00", "17:00"]
  },
  
  // 학생 상담 내역
  studentCounselings: [
    {
      id: 401,
      studentId: 1,
      studentName: "홍길동1",
      grade: "1",
      classNumber: "7",
      number: "1",
      requestDate: "2025-04-25",
      counselingDate: "2025-05-05",
      counselingTime: "10:00",
      counselorName: "김교수",
      counselingType: "교수상담",
      counselingCategory: "학업",
      status: "예약확정",
      location: "교수연구실 A-301",
      requestContent: "중간고사 결과에 대한 피드백을 받고 싶습니다.",
      resultContent: "",
      contactNumber: "010-1234-5678"
    },
    {
      id: 402,
      studentId: 1,
      studentName: "홍길동1",
      grade: "1",
      classNumber: "7",
      number: "1",
      requestDate: "2025-04-15",
      counselingDate: "2025-04-20",
      counselingTime: "14:30",
      counselorName: "김교수",
      counselingType: "교수상담",
      counselingCategory: "진로",
      status: "완료",
      location: "교수연구실 A-301",
      requestContent: "진로 선택에 대한 상담을 요청합니다.",
      resultContent: "학생의 관심 분야와 적성을 고려한 진로 방향 논의. 관련 학과 및 직업군 정보 제공.",
      contactNumber: "010-1234-5678"
    },
    {
      id: 403,
      studentId: 1,
      studentName: "홍길동1",
      grade: "1",
      classNumber: "7",
      number: "1",
      requestDate: "2025-05-01",
      counselingDate: "2025-05-15",
      counselingTime: "11:30",
      counselorName: "김교수",
      counselingType: "교수상담",
      counselingCategory: "학업",
      status: "대기",
      location: "",
      requestContent: "학습 계획 수립에 대한 조언을 구하고 싶습니다.",
      resultContent: "",
      contactNumber: "010-1234-5678"
    },
    {
      id: 404,
      studentId: 2,
      studentName: "홍길동2",
      grade: "1",
      classNumber: "7",
      number: "2",
      requestDate: "2025-04-28",
      counselingDate: "2025-05-10",
      counselingTime: "13:00",
      counselorName: "박교수",
      counselingType: "교수상담",
      counselingCategory: "심리",
      status: "예약확정",
      location: "상담실 C-105",
      requestContent: "학업 스트레스 관리에 대해 상담하고 싶습니다.",
      resultContent: "",
      contactNumber: "010-2345-6789"
    }
  ],
  
  // 학부모 상담 내역 (자녀 기준)
  parentCounselings: [
    {
      id: 501,
      parentId: "parent789",
      parentName: "박부모",
      studentId: 3,
      studentName: "박자녀",
      grade: "3",
      classNumber: "5",
      number: "8",
      requestDate: "2025-04-20",
      counselingDate: "2025-05-06",
      counselingTime: "14:30",
      counselorName: "이교수",
      counselingType: "학부모상담",
      counselingCategory: "학업",
      status: "예약확정",
      location: "교수연구실 B-205",
      requestContent: "자녀의 학업 성취도와 향후 학습 방향에 대해 상담하고 싶습니다.",
      resultContent: "",
      contactNumber: "010-9876-5432"
    },
    {
      id: 502,
      parentId: "parent789",
      parentName: "박부모",
      studentId: 3,
      studentName: "박자녀",
      grade: "3",
      classNumber: "5",
      number: "8",
      requestDate: "2025-04-10",
      counselingDate: "2025-04-15",
      counselingTime: "16:00",
      counselorName: "이교수",
      counselingType: "학부모상담",
      counselingCategory: "진로",
      status: "완료",
      location: "교수연구실 B-205",
      requestContent: "자녀의 진로 방향과 대학 진학에 대해 상담하고 싶습니다.",
      resultContent: "학생의 성적과 관심사를 고려한 진로 방향 논의. 대학 입시 준비를 위한 계획 수립.",
      contactNumber: "010-9876-5432"
    }
  ]
};

export default dummyStudentCounselingData;
