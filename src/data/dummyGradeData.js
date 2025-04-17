const dummyGradeData = [
  // 20 students from 1학년 7반
  {
    id: 1,
    name: '홍길동1',
    studentId: '20250001',
    grade: '1',
    class: '7',
    number: '1',
    gradeStatus: '미입력',
    profileImage: 'https://cdn-icons-png.flaticon.com/512/8847/8847419.png'
  },
  {
    id: 2,
    name: '홍길동2',
    studentId: '20250002',
    grade: '1',
    class: '7',
    number: '2',
    gradeStatus: '임시저장',
    profileImage: 'https://cdn-icons-png.flaticon.com/512/8847/8847419.png'
  },
  {
    id: 3,
    name: '홍길동3',
    studentId: '20250003',
    grade: '1',
    class: '7',
    number: '3',
    gradeStatus: '입력완료',
    profileImage: 'https://cdn-icons-png.flaticon.com/512/8847/8847419.png'
  },
  {
    id: 4,
    name: '홍길동4',
    studentId: '20250004',
    grade: '1',
    class: '7',
    number: '4',
    gradeStatus: '미입력',
    profileImage: 'https://cdn-icons-png.flaticon.com/512/8847/8847419.png'
  },
  {
    id: 5,
    name: '홍길동5',
    studentId: '20250005',
    grade: '1',
    class: '7',
    number: '5',
    gradeStatus: '입력완료',
    profileImage: 'https://cdn-icons-png.flaticon.com/512/8847/8847419.png'
  },
  {
    id: 6,
    name: '홍길동6',
    studentId: '20250006',
    grade: '1',
    class: '7',
    number: '6',
    gradeStatus: '임시저장',
    profileImage: 'https://cdn-icons-png.flaticon.com/512/8847/8847419.png'
  },
  {
    id: 7,
    name: '홍길동7',
    studentId: '20250007',
    grade: '1',
    class: '7',
    number: '7',
    gradeStatus: '미입력',
    profileImage: 'https://cdn-icons-png.flaticon.com/512/8847/8847419.png'
  },
  {
    id: 8,
    name: '홍길동8',
    studentId: '20250008',
    grade: '1',
    class: '7',
    number: '8',
    gradeStatus: '입력완료',
    profileImage: 'https://cdn-icons-png.flaticon.com/512/8847/8847419.png'
  },
  {
    id: 9,
    name: '홍길동9',
    studentId: '20250009',
    grade: '1',
    class: '7',
    number: '9',
    gradeStatus: '미입력',
    profileImage: 'https://cdn-icons-png.flaticon.com/512/8847/8847419.png'
  },
  {
    id: 10,
    name: '홍길동10',
    studentId: '20250010',
    grade: '1',
    class: '7',
    number: '10',
    gradeStatus: '임시저장',
    profileImage: 'https://cdn-icons-png.flaticon.com/512/8847/8847419.png'
  }
];

// Current grade input period
export const gradeInputPeriod = {
  start: '2025.05.01',
  end: '2025.05.07',
  isActive: true // Set to false to test the period expiration
};

// Semester options
export const semesterOptions = [
  '2025-1학기',
  '2024-2학기',
  '2024-1학기'
];

export default dummyGradeData;
