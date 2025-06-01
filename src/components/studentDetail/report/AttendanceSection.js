import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useReportStore } from '../../../stores/useReportStore';
import { getAttendanceRecords } from '../../../api/attendanceApi';
import { useParams } from 'react-router-dom';

const AttendanceSection = () => {
  const { studentId } = useParams();
  const { reportData, setReportData, setError } = useReportStore();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await getAttendanceRecords(studentId);
        setReportData({ attendance: data });
      } catch (error) {
        console.error('Failed to fetch attendance:', error);
        setError('출결 정보를 불러오는데 실패했습니다.');
        // Fallback to dummy data
        setReportData({
          attendance: {
            years: [
              {
                year: 2023,
                totalDays: 190,
                attendance: {
                  present: 185,
                  absent: 2,
                  lateness: 1,
                  earlyLeave: 2,
                  sickLeave: 0
                }
              }
            ]
          }
        });
      }
    };

    if (!reportData.attendance) {
      fetchAttendance();
    }
  }, [studentId, reportData.attendance, setReportData, setError]);

  // 데이터가 없거나 years 배열이 없는 경우 처리
  if (!reportData.attendance || !reportData.attendance.years) {
    return (
      <Section>
        <Title>출결 현황</Title>
        <EmptyMessage>출결 정보가 없습니다.</EmptyMessage>
      </Section>
    );
  }

  // years가 배열이 아닌 경우 처리
  const years = Array.isArray(reportData.attendance.years)
    ? reportData.attendance.years
    : [];

  return (
    <Section>
      <Title>출결 현황</Title>
      <TableContainer>
        <AttendanceTable>
          <thead>
            <tr>
              <TableHeader>학년도</TableHeader>
              <TableHeader>전체 수업일수</TableHeader>
              <TableHeader>출석</TableHeader>
              <TableHeader>결석</TableHeader>
              <TableHeader>지각</TableHeader>
              <TableHeader>조퇴</TableHeader>
              <TableHeader>병결</TableHeader>
            </tr>
          </thead>
          <tbody>
            {years.map((yearData, index) => (
              <tr key={index}>
                <Td>{yearData.year}</Td>
                <Td>{yearData.totalDays}</Td>
                <Td>{yearData.attendance.present}</Td>
                <Td>{yearData.attendance.absent}</Td>
                <Td>{yearData.attendance.lateness}</Td>
                <Td>{yearData.attendance.earlyLeave}</Td>
                <Td>{yearData.attendance.sickLeave}</Td>
              </tr>
            ))}
          </tbody>
        </AttendanceTable>
      </TableContainer>
    </Section>
  );
};

const Section = styled.section`
  margin-bottom: 40px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  page-break-inside: avoid;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #78909c;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
`;

const Title = styled.h2`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 22px;
  color: #1a237e;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1a237e;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const AttendanceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
`;

const TableHeader = styled.th`
  background-color: #f1f3f9;
  padding: 12px;
  text-align: center;
  border: 1px solid #e0e0e0;
  font-weight: bold;
  color: #1a237e;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
`;

export default AttendanceSection;
