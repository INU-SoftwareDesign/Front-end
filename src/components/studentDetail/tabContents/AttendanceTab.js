import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import dummyAttendanceData from '../../../data/dummyAttendanceData';
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

const AttendanceTab = ({ student, currentUser }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    attendanceType: '',
    reasonType: '',
    details: [],
    grade: '',
    canEdit: false
  });
  
  // Load attendance data
  useEffect(() => {
    if (student && student.id) {
      const data = dummyAttendanceData[student.id] || [];
      setAttendanceData(data);
    }
  }, [student]);
  
  if (!student) return null;
  
  // Check if current user is the home teacher for a specific grade/class
  const isHomeTeacher = (gradeData) => {
    if (!currentUser) return false;
    return currentUser.id === gradeData.homeTeacher;
  };
  
  // Handle click on attendance number
  const handleAttendanceClick = (gradeData, attendanceType, reasonType) => {
    // Only allow click if user is home teacher
    if (!isHomeTeacher(gradeData)) return;
    
    // Get details for this attendance type and reason
    const details = gradeData.details?.[attendanceType]?.[reasonType] || [];
    
    setModalData({
      attendanceType,
      reasonType,
      details,
      grade: gradeData.grade,
      canEdit: isHomeTeacher(gradeData)
    });
    
    setModalOpen(true);
  };
  
  // Handle save new attendance record
  const handleSaveAttendance = (formData) => {
    const { attendanceType, reasonType, date, reason } = formData;
    
    // Find the grade data to update
    const updatedAttendanceData = attendanceData.map(gradeData => {
      if (gradeData.grade.toString() === modalData.grade.toString()) {
        // Create a deep copy of the grade data
        const updatedGradeData = JSON.parse(JSON.stringify(gradeData));
        
        // Initialize details object structure if it doesn't exist
        if (!updatedGradeData.details) updatedGradeData.details = {};
        if (!updatedGradeData.details[attendanceType]) updatedGradeData.details[attendanceType] = {};
        if (!updatedGradeData.details[attendanceType][reasonType]) {
          updatedGradeData.details[attendanceType][reasonType] = [];
        }
        
        // Add new attendance record
        updatedGradeData.details[attendanceType][reasonType].push({
          date,
          reason
        });
        
        // Update attendance count
        if (!updatedGradeData.attendance[attendanceType]) {
          updatedGradeData.attendance[attendanceType] = { illness: 0, unauthorized: 0, etc: 0 };
        }
        updatedGradeData.attendance[attendanceType][reasonType] += 1;
        
        return updatedGradeData;
      }
      return gradeData;
    });
    
    setAttendanceData(updatedAttendanceData);
    
    // Update modal data to show the new record
    const updatedGradeData = updatedAttendanceData.find(
      g => g.grade.toString() === modalData.grade.toString()
    );
    
    if (updatedGradeData) {
      setModalData({
        ...modalData,
        details: updatedGradeData.details[attendanceType][reasonType] || []
      });
    }
  };
  
  // Render attendance number with conditional styling
  const renderAttendanceNumber = (gradeData, type, reason) => {
    const count = gradeData.attendance[type][reason] || 0;
    const isClickable = count > 0 && isHomeTeacher(gradeData);
    
    return (
      <AttendanceNumber 
        clickable={isClickable}
        onClick={() => isClickable && handleAttendanceClick(gradeData, type, reason)}
      >
        {count > 0 ? count : '.'}
      </AttendanceNumber>
    );
  };
  
  // If no attendance data is available
  if (attendanceData.length === 0) {
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
                  {isHomeTeacher(gradeData) && (
                    <EditButton onClick={() => {
                      setModalData({
                        attendanceType: 'absent',
                        reasonType: 'illness',
                        details: [],
                        grade: gradeData.grade,
                        canEdit: true
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
        onClose={() => setModalOpen(false)}
        attendanceType={modalData.attendanceType}
        reasonType={modalData.reasonType}
        details={modalData.details}
        canEdit={modalData.canEdit}
        studentName={student.name}
        grade={modalData.grade}
        onSave={handleSaveAttendance}
      />
    </TabContainer>
  );
};

export default AttendanceTab;
