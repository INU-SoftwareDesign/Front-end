import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAttendanceRecords } from '../../../api/attendanceApi';
import AttendanceModal from '../AttendanceModal';

const TabContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  min-height: 500px;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const TableHeader = styled.th`
  background-color: #f2f6fd;
  color: #1D4EB0;
  padding: 14px 12px;
  text-align: center;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
`;

const TableCell = styled.td`
  padding: 14px 12px;
  text-align: center;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  background-color: ${props => props.isEven ? '#f9f9f9' : '#fff'};
`;

const AttendanceNumber = styled.span`
  ${props => props.clickable && `
    cursor: pointer;
    color: #1D4EB0;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  `}
`;

const EditButton = styled.button`
  background-color: #1D4EB0;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #1A44A3;
  }
`;

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 24px;
  margin-top: 20px;
`;

const NoDataText = styled.p`
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 18px;
  color: #666;
  text-align: center;
`;

const TabTitle = styled.h3`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 18px;
  color: #1D4EB0;
  margin-bottom: 16px;
`;

const AttendanceTab = ({ student, currentUser, forceLoad, studentUrlId }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterYear, setFilterYear] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    attendanceType: '',
    reasonType: '',
    details: [],
    grade: '',
    canEdit: false,
    studentId: ''
  });
  
  // Load attendance data
  const fetchAttendanceData = async () => {
    if (!student || (!student.id && !student.studentId && !studentUrlId)) {
      console.warn('학생 정보가 없어 출결 데이터를 가져올 수 없습니다.');
      setError('학생 정보가 없습니다.');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 필터 파라미터 설정
      const params = {};
      if (filterGrade) params.grade = filterGrade;
      if (filterYear) params.year = filterYear;
      
      // 학생 ID 결정 (우선순위: student.id -> student.studentId -> studentUrlId)
      let studentIdToUse;
      if (student && student.id) {
        studentIdToUse = student.id;
      } else if (student && student.studentId) {
        studentIdToUse = student.studentId;
      } else {
        studentIdToUse = studentUrlId;
      }
      
      // studentId가 문자열인지 확인하고 수정
      const processedStudentId = typeof studentIdToUse === 'string' ? studentIdToUse : String(studentIdToUse);
      console.log(`출결 데이터 요청: 학생 ID ${processedStudentId}, 파라미터:`, params);
      
      // Call API
      const data = await getAttendanceRecords(processedStudentId, params);
      console.log('출결 데이터 응답:', data);
      
      // 현재 연도 가져오기
      const currentYear = new Date().getFullYear();
      
      // 응답 데이터 구조 확인 및 처리
      let processedData = [];
      
      if (data && data.attendance) {
        // API가 { attendance: [...] } 형태로 응답한 경우
        processedData = data.attendance;
      } else if (data && Array.isArray(data)) {
        // 배열로 응답이 온 경우
        processedData = data;
      } else if (data && typeof data === 'object') {
        // 단일 객체로 응답이 온 경우 (더미 데이터 형태)
        processedData = [{
          ...data,
          // attendance 객체가 없으면 기본 구조 생성
          attendance: data.attendance || {
            absent: { illness: 0, unauthorized: 0, etc: 0 },
            tardy: { illness: 0, unauthorized: 0, etc: 0 },
            earlyLeave: { illness: 0, unauthorized: 0, etc: 0 },
            result: { illness: 0, unauthorized: 0, etc: 0 }
          }
        }];
      } else {
        // 데이터가 없는 경우 빈 배열
        processedData = [];
      }
      
      // 현재 사용자가 담임인 학년이 데이터에 없으면 추가
      if (currentUser && currentUser.grade) {
        const currentGrade = String(currentUser.grade);
        const hasCurrentGrade = processedData.some(item => String(item.grade) === currentGrade);
        
        if (!hasCurrentGrade) {
          // 현재 담임 학년 데이터 추가
          processedData.push({
            grade: currentGrade,
            year: currentYear,
            totalDays: 0,
            homeTeacher: currentUser.id,
            remarks: '',
            attendance: {
              absent: { illness: 0, unauthorized: 0, etc: 0 },
              tardy: { illness: 0, unauthorized: 0, etc: 0 },
              earlyLeave: { illness: 0, unauthorized: 0, etc: 0 },
              result: { illness: 0, unauthorized: 0, etc: 0 }
            },
            details: {
              absent: { illness: [], unauthorized: [], etc: [] },
              tardy: { illness: [], unauthorized: [], etc: [] },
              earlyLeave: { illness: [], unauthorized: [], etc: [] }
            }
          });
        }
      }
      
      // 학년 순으로 정렬
      processedData.sort((a, b) => {
        const gradeA = parseInt(a.grade) || 0;
        const gradeB = parseInt(b.grade) || 0;
        return gradeB - gradeA; // 내림차순 정렬 (최신 학년이 위로)
      });
      
      console.log('최종 처리된 출결 데이터:', processedData);
      setAttendanceData(processedData);
    } catch (error) {
      console.error('출결 데이터 조회 오류:', error);
      setError('출결 데이터를 불러오는데 실패했습니다: ' + (error.message || '알 수 없는 오류'));
      setAttendanceData([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data load
  useEffect(() => {
    console.log('AttendanceTab useEffect 호출:', { 
      studentId: student?.id, 
      studentIdFromObject: student?.studentId,
      studentUrlId,
      forceLoad 
    });
    fetchAttendanceData();
  }, [student, studentUrlId, filterYear, filterGrade, forceLoad]); // studentUrlId와 forceLoad를 의존성 배열에 추가
  
  if (!student) return null;
  
  // Check if current user is the home teacher for a specific grade/class
  const isHomeTeacher = (gradeData) => {
    if (!currentUser) return false;
    
    // 현재 사용자가 교사이고, 해당 학년의 담임인지 확인
    if (currentUser.role === 'teacher' && currentUser.grade && gradeData && gradeData.grade) {
      return String(currentUser.grade) === String(gradeData.grade);
    }
    
    // 기존 로직 유지 (학생 ID 직접 비교)
    return currentUser.id === gradeData.homeTeacher;
  };
  
  // Handle click on attendance number
  const handleAttendanceClick = (gradeData, attendanceType, reasonType) => {
    // 과거 데이터는 누구나 볼 수 있음, 현재 담임인 학년만 수정 가능
    const canView = true; // 모든 사용자가 조회 가능
    const canEdit = isHomeTeacher(gradeData); // 현재 담임인 학년만 수정 가능
    
    // Get details for this attendance type and reason
    const details = gradeData.details?.[attendanceType]?.[reasonType] || [];
    
    setModalData({
      attendanceType,
      reasonType,
      details,
      grade: gradeData.grade,
      canEdit: canEdit,
      studentId: student.id
    });
    
    setModalOpen(true);
  };
  
  // Handle save new attendance record
  const handleSaveAttendance = async (formData) => {
    try {
      console.log('출결 데이터 저장 요청:', formData);
      
      // 성공적으로 저장되면 데이터 다시 불러오기
      await fetchAttendanceData();
      
      // 모달 닫기
      setModalOpen(false);
    } catch (error) {
      console.error('출결 데이터 저장 실패:', error);
      // 에러 처리는 AttendanceModal에서 처리함
    }
  };
  
  // Render attendance number with conditional styling
  const renderAttendanceNumber = (gradeData, type, reason) => {
    // 데이터 구조 안전성 검사
    if (!gradeData || !gradeData.attendance) {
      console.warn('출결 데이터 구조 오류:', { gradeData, type, reason });
      return <AttendanceNumber>.</AttendanceNumber>;
    }
    
    // attendance[type]이 존재하는지 확인
    if (!gradeData.attendance[type]) {
      console.warn(`출결 데이터에 ${type} 타입이 없습니다:`, gradeData.attendance);
      return <AttendanceNumber>.</AttendanceNumber>;
    }
    
    // 안전하게 값 가져오기
    const count = (gradeData.attendance[type][reason] !== undefined) ? gradeData.attendance[type][reason] : 0;
    
    // 값이 있으면 누구나 클릭 가능
    const isClickable = count > 0;
    
    return (
      <AttendanceNumber 
        clickable={isClickable}
        onClick={(e) => {
          if (isClickable) {
            e.preventDefault();
            handleAttendanceClick(gradeData, type, reason);
          }
        }}
      >
        {count > 0 ? count : '.'}
      </AttendanceNumber>
    );
  };
  
  // Loading state component
  const LoadingMessage = () => (
    <NoDataContainer>
      <NoDataText>출결 데이터를 불러오는 중입니다...</NoDataText>
    </NoDataContainer>
  );
  
  // Error state component
  const ErrorMessage = () => (
    <NoDataContainer>
      <NoDataText>{error}</NoDataText>
    </NoDataContainer>
  );
  
  // If no attendance data is available
  if (!isLoading && !error && attendanceData.length === 0) {
    return (
      <TabContainer>
        <TabTitle>{student.name} 학생의 출결 현황</TabTitle>
        <NoDataContainer>
          <NoDataText>
            출결 정보가 존재하지 않습니다.
          </NoDataText>
        </NoDataContainer>
      </TabContainer>
    );
  }
  
  return (
    <TabContainer>
      <TabTitle>{student.name} 학생의 출결 현황</TabTitle>
      
      {isLoading ? (
        <LoadingMessage />
      ) : error ? (
        <ErrorMessage />
      ) : (
        <>
        <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <TableHeader rowSpan="2">학년</TableHeader>
              <TableHeader rowSpan="2">수업일수</TableHeader>
              <TableHeader colSpan="3">결석일수</TableHeader>
              <TableHeader colSpan="3">지각</TableHeader>
              <TableHeader colSpan="3">조퇴</TableHeader>
              <TableHeader colSpan="3">결과</TableHeader>
              <TableHeader rowSpan="2">특기사항</TableHeader>
              <TableHeader rowSpan="2">관리</TableHeader>
            </tr>
            <tr>
              <TableHeader>질병</TableHeader>
              <TableHeader>미인정</TableHeader>
              <TableHeader>기타</TableHeader>
              <TableHeader>질병</TableHeader>
              <TableHeader>미인정</TableHeader>
              <TableHeader>기타</TableHeader>
              <TableHeader>질병</TableHeader>
              <TableHeader>미인정</TableHeader>
              <TableHeader>기타</TableHeader>
              <TableHeader>질병</TableHeader>
              <TableHeader>미인정</TableHeader>
              <TableHeader>기타</TableHeader>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((gradeData, index) => (
              <tr key={index}>
                <TableCell isEven={index % 2 === 1}>{gradeData.grade}학년</TableCell>
                <TableCell isEven={index % 2 === 1}>{gradeData.totalDays}</TableCell>
                
                {/* 결석 */}
                <TableCell isEven={index % 2 === 1}>
                  {renderAttendanceNumber(gradeData, 'absent', 'illness')}
                </TableCell>
                <TableCell isEven={index % 2 === 1}>
                  {renderAttendanceNumber(gradeData, 'absent', 'unauthorized')}
                </TableCell>
                <TableCell isEven={index % 2 === 1}>
                  {renderAttendanceNumber(gradeData, 'absent', 'etc')}
                </TableCell>
                
                {/* 지각 */}
                <TableCell isEven={index % 2 === 1}>
                  {renderAttendanceNumber(gradeData, 'tardy', 'illness')}
                </TableCell>
                <TableCell isEven={index % 2 === 1}>
                  {renderAttendanceNumber(gradeData, 'tardy', 'unauthorized')}
                </TableCell>
                <TableCell isEven={index % 2 === 1}>
                  {renderAttendanceNumber(gradeData, 'tardy', 'etc')}
                </TableCell>
                
                {/* 조퇴 */}
                <TableCell isEven={index % 2 === 1}>
                  {renderAttendanceNumber(gradeData, 'earlyLeave', 'illness')}
                </TableCell>
                <TableCell isEven={index % 2 === 1}>
                  {renderAttendanceNumber(gradeData, 'earlyLeave', 'unauthorized')}
                </TableCell>
                <TableCell isEven={index % 2 === 1}>
                  {renderAttendanceNumber(gradeData, 'earlyLeave', 'etc')}
                </TableCell>
                
                {/* 결과 */}
                <TableCell isEven={index % 2 === 1}>
                  {renderAttendanceNumber(gradeData, 'result', 'illness')}
                </TableCell>
                <TableCell isEven={index % 2 === 1}>
                  {renderAttendanceNumber(gradeData, 'result', 'unauthorized')}
                </TableCell>
                <TableCell isEven={index % 2 === 1}>
                  {renderAttendanceNumber(gradeData, 'result', 'etc')}
                </TableCell>
                
                <TableCell isEven={index % 2 === 1}>{gradeData.remarks || '-'}</TableCell>
                <TableCell isEven={index % 2 === 1}>
                  {/* 현재 담임인 학년에만 출결 수정 버튼 표시 */}
                  {isHomeTeacher(gradeData) && (
                    <EditButton onClick={() => {
                      // 학생 ID 결정 (우선순위: student.id -> student.studentId -> studentUrlId)
                      let studentIdToUse;
                      if (student && student.id) {
                        studentIdToUse = student.id;
                      } else if (student && student.studentId) {
                        studentIdToUse = student.studentId;
                      } else {
                        studentIdToUse = studentUrlId;
                      }
                      
                      // studentId가 없을 경우 경고 로그
                      if (!studentIdToUse) {
                        console.warn('학생 ID가 없습니다. 현재 학생:', student, '경로 파라미터:', studentUrlId);
                      }
                      
                      setModalData({
                        attendanceType: 'absent',
                        reasonType: 'illness',
                        details: [],
                        grade: gradeData.grade,
                        canEdit: true,
                        studentId: studentIdToUse
                      });
                      setModalOpen(true);
                    }}>
                      출결 수정
                    </EditButton>
                  )}
                </TableCell>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>
      
      {/* Attendance Modal */}
      <AttendanceModal 
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          // 모달이 닫힐 때 출결 데이터 다시 불러오기
          fetchAttendanceData();
        }}
        attendanceType={modalData.attendanceType}
        reasonType={modalData.reasonType}
        details={modalData.details}
        canEdit={modalData.canEdit}
        studentName={student?.name}
        grade={modalData.grade}
        studentId={modalData.studentId}
        onSave={() => {
          // 저장 후 출결 데이터 다시 불러오기
          fetchAttendanceData();
        }}
      />
        </>
      )}
    </TabContainer>
  );
};

export default AttendanceTab;
