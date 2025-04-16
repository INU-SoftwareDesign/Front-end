const dummyAttendanceData = {
  // Each student's attendance data is stored by their ID
  1: [
    {
      grade: 1,
      class: '7',
      homeTeacher: 'teacher123', // ID of the teacher for this grade/class
      totalDays: 190,
      attendance: {
        absent: { illness: 2, unauthorized: 0, etc: 1 },
        tardy: { illness: 1, unauthorized: 0, etc: 0 },
        earlyLeave: { illness: 0, unauthorized: 0, etc: 0 },
        result: { illness: 0, unauthorized: 0, etc: 0 },
      },
      remarks: '개근상 수상',
      details: {
        absent: {
          illness: [
            { date: '2025-03-14', reason: '고열로 병가' },
            { date: '2025-04-01', reason: '병원 진료' }
          ],
          etc: [
            { date: '2025-05-10', reason: '가족 행사' }
          ]
        },
        tardy: {
          illness: [
            { date: '2025-03-03', reason: '몸살' }
          ]
        }
      }
    },
    {
      grade: 2,
      class: '3',
      homeTeacher: 'teacher456',
      totalDays: 195,
      attendance: {
        absent: { illness: 3, unauthorized: 1, etc: 0 },
        tardy: { illness: 2, unauthorized: 1, etc: 0 },
        earlyLeave: { illness: 1, unauthorized: 0, etc: 0 },
        result: { illness: 0, unauthorized: 0, etc: 0 },
      },
      remarks: '',
      details: {
        absent: {
          illness: [
            { date: '2024-04-10', reason: '감기' },
            { date: '2024-06-15', reason: '병원 진료' },
            { date: '2024-09-22', reason: '몸살' }
          ],
          unauthorized: [
            { date: '2024-11-05', reason: '무단결석' }
          ]
        },
        tardy: {
          illness: [
            { date: '2024-05-12', reason: '두통' },
            { date: '2024-10-08', reason: '병원 진료' }
          ],
          unauthorized: [
            { date: '2024-12-01', reason: '무단지각' }
          ]
        },
        earlyLeave: {
          illness: [
            { date: '2024-07-19', reason: '발열' }
          ]
        }
      }
    },
    {
      grade: 3,
      class: '5',
      homeTeacher: 'teacher789',
      totalDays: 185,
      attendance: {
        absent: { illness: 1, unauthorized: 0, etc: 2 },
        tardy: { illness: 0, unauthorized: 0, etc: 1 },
        earlyLeave: { illness: 1, unauthorized: 0, etc: 0 },
        result: { illness: 0, unauthorized: 0, etc: 0 },
      },
      remarks: '출석 우수',
      details: {
        absent: {
          illness: [
            { date: '2023-05-20', reason: '병원 입원' }
          ],
          etc: [
            { date: '2023-06-10', reason: '가족 행사' },
            { date: '2023-10-15', reason: '개인 사정' }
          ]
        },
        tardy: {
          etc: [
            { date: '2023-09-01', reason: '교통 지연' }
          ]
        },
        earlyLeave: {
          illness: [
            { date: '2023-11-22', reason: '발열' }
          ]
        }
      }
    }
  ],
  2: [
    {
      grade: 1,
      class: '7',
      homeTeacher: 'teacher123',
      totalDays: 190,
      attendance: {
        absent: { illness: 0, unauthorized: 0, etc: 0 },
        tardy: { illness: 0, unauthorized: 0, etc: 0 },
        earlyLeave: { illness: 0, unauthorized: 0, etc: 0 },
        result: { illness: 0, unauthorized: 0, etc: 0 },
      },
      remarks: '개근상 수상',
      details: {}
    },
    {
      grade: 2,
      class: '3',
      homeTeacher: 'teacher456',
      totalDays: 195,
      attendance: {
        absent: { illness: 1, unauthorized: 0, etc: 0 },
        tardy: { illness: 0, unauthorized: 0, etc: 0 },
        earlyLeave: { illness: 0, unauthorized: 0, etc: 0 },
        result: { illness: 0, unauthorized: 0, etc: 0 },
      },
      remarks: '출석 우수',
      details: {
        absent: {
          illness: [
            { date: '2024-08-15', reason: '병원 진료' }
          ]
        }
      }
    }
  ]
};

export default dummyAttendanceData;
