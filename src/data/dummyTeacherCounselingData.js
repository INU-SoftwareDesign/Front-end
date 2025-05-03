const dummyTeacherCounselingData = {
  // 상담 신청 내역 (아직 확정되지 않은 상담)
  pendingCounselings: [
    {
      id: 101,
      studentId: 1,
      studentName: '홍길동1',
      grade: '1',
      class: '7',
      number: '1',
      requestDate: '2025-05-01',
      counselingDate: '2025-05-10',
      counselingTime: '14:30',
      counselingType: '교수상담',
      counselingCategory: '학업',
      status: '신청',
      location: '',
      requestContent: '성적 향상을 위한 학습 방법 상담을 요청합니다.',
      resultContent: '',
      contactNumber: '010-1234-5678'
    },
    {
      id: 102,
      studentId: 3,
      studentName: '홍길동3',
      grade: '1',
      class: '7',
      number: '3',
      requestDate: '2025-05-02',
      counselingDate: '2025-05-12',
      counselingTime: '15:00',
      counselingType: '교수상담',
      counselingCategory: '진로',
      status: '신청',
      location: '',
      requestContent: '진로 선택에 대한 상담을 요청합니다.',
      resultContent: '',
      contactNumber: '010-3456-7890'
    },
    {
      id: 103,
      studentId: 5,
      studentName: '홍길동5',
      grade: '1',
      class: '7',
      number: '5',
      requestDate: '2025-05-02',
      counselingDate: '2025-05-15',
      counselingTime: '10:00',
      counselingType: '교수상담',
      counselingCategory: '심리',
      status: '신청',
      location: '',
      requestContent: '학교 적응에 어려움이 있어 상담을 요청합니다.',
      resultContent: '',
      contactNumber: '010-5678-9012'
    }
  ],
  
  // 상담 예정 내역 (확정된 상담)
  scheduledCounselings: [
    {
      id: 201,
      studentId: 2,
      studentName: '홍길동2',
      grade: '1',
      class: '7',
      number: '2',
      requestDate: '2025-04-25',
      counselingDate: '2025-05-05',
      counselingTime: '13:00',
      counselingType: '교수상담',
      counselingCategory: '학업',
      status: '확정',
      location: '교수연구실 A-301',
      requestContent: '중간고사 결과에 대한 피드백을 받고 싶습니다.',
      resultContent: '',
      contactNumber: '010-2345-6789'
    },
    {
      id: 202,
      studentId: 4,
      studentName: '홍길동4',
      grade: '1',
      class: '7',
      number: '4',
      requestDate: '2025-04-28',
      counselingDate: '2025-05-07',
      counselingTime: '16:30',
      counselingType: '교수상담',
      counselingCategory: '진로',
      status: '확정',
      location: '상담실 C-105',
      requestContent: '진로 탐색을 위한 상담을 요청합니다.',
      resultContent: '',
      contactNumber: '010-4567-8901'
    }
  ],
  
  // 완료된 상담 내역
  completedCounselings: [
    {
      id: 301,
      studentId: 6,
      studentName: '홍길동6',
      grade: '1',
      class: '7',
      number: '6',
      requestDate: '2025-04-10',
      counselingDate: '2025-04-20',
      counselingTime: '11:30',
      counselingType: '교수상담',
      counselingCategory: '학업',
      status: '완료',
      location: '교수연구실 A-301',
      requestContent: '학습 방법에 대한 조언을 구하고 싶습니다.',
      resultContent: '학습 계획 수립 및 자기주도학습 방법에 대해 논의함. 주 2회 학습 일지 작성 권고.',
      contactNumber: '010-6789-0123'
    },
    {
      id: 302,
      studentId: 7,
      studentName: '홍길동7',
      grade: '1',
      class: '7',
      number: '7',
      requestDate: '2025-04-12',
      counselingDate: '2025-04-22',
      counselingTime: '14:00',
      counselingType: '글쓰기상담',
      counselingCategory: '진로',
      status: '완료',
      location: '글쓰기센터 B-201',
      requestContent: '자기소개서 작성 관련 조언을 구하고 싶습니다.',
      resultContent: '자기소개서 초안 검토 및 수정 방향 제시. 다음 주까지 수정본 제출 요청.',
      contactNumber: '010-7890-1234'
    }
  ]
};

export default dummyTeacherCounselingData;
