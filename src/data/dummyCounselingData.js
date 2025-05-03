const dummyCounselingData = [
  {
    id: 1,
    studentId: 1,
    counselingDate: '2025-04-10',
    counselingTime: '14:30',
    counselorName: '김교수',
    counselingType: '교수상담',
    counselingCategory: '학업',
    status: '완료',
    location: '교수연구실 A-301',
    requestContent: '성적 향상을 위한 학습 방법 상담을 요청합니다.',
    resultContent: '학습 계획 수립 및 자기주도학습 방법에 대해 논의함. 주 2회 학습 일지 작성 권고.',
    contactNumber: '010-1234-5678'
  },
  {
    id: 2,
    studentId: 1,
    counselingDate: '2025-03-15',
    counselingTime: '10:00',
    counselorName: '이교수',
    counselingType: '글쓰기상담',
    counselingCategory: '진로',
    status: '완료',
    location: '글쓰기센터 B-201',
    requestContent: '자기소개서 작성 관련 조언을 구하고 싶습니다.',
    resultContent: '자기소개서 초안 검토 및 수정 방향 제시. 다음 주까지 수정본 제출 요청.',
    contactNumber: '010-1234-5678'
  },
  {
    id: 3,
    studentId: 1,
    counselingDate: '2025-05-05',
    counselingTime: '15:00',
    counselorName: '김교수',
    counselingType: '교수상담',
    counselingCategory: '학업',
    status: '대기',
    location: '교수연구실 A-301',
    requestContent: '중간고사 결과에 대한 피드백을 받고 싶습니다.',
    resultContent: '',
    contactNumber: '010-1234-5678'
  },
  {
    id: 4,
    studentId: 2,
    counselingDate: '2025-04-20',
    counselingTime: '13:00',
    counselorName: '박교수',
    counselingType: '교수상담',
    counselingCategory: '심리',
    status: '완료',
    location: '상담실 C-105',
    requestContent: '학업 스트레스 관리에 대해 상담하고 싶습니다.',
    resultContent: '스트레스 관리 기법 안내 및 주기적인 상담 일정 수립.',
    contactNumber: '010-2345-6789'
  },
  {
    id: 5,
    studentId: 3,
    counselingDate: '2025-04-25',
    counselingTime: '16:30',
    counselorName: '최교수',
    counselingType: '교수상담',
    counselingCategory: '진로',
    status: '보류',
    location: '교수연구실 D-402',
    requestContent: '대학원 진학 관련 상담을 요청합니다.',
    resultContent: '교수 일정 변경으로 인한 상담 일정 조정 필요.',
    contactNumber: '010-3456-7890'
  },
  {
    id: 6,
    studentId: 1,
    counselingDate: '2025-02-10',
    counselingTime: '11:30',
    counselorName: '정교수',
    counselingType: '교수상담',
    counselingCategory: '학업',
    status: '완료',
    location: '교수연구실 E-205',
    requestContent: '수강 신청 과목 선택에 대한 조언을 구합니다.',
    resultContent: '학생의 관심 분야와 진로 목표를 고려한 수강 과목 추천.',
    contactNumber: '010-1234-5678'
  }
];

export default dummyCounselingData;
