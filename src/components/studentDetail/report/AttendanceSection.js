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
        <Table>
          <thead>
            <tr>
              <Th>학년도</Th>
              <Th>수업일수</Th>
              <Th>출석</Th>
              <Th>결석</Th>
              <Th>지각</Th>
              <Th>조퇴</Th>
              <Th>병결</Th>
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
        </Table>
      </TableContainer>
    </Section>
  );
};

const Section = styled.section`
  margin-bottom: 30px;
`;

const EmptyMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
`;

const Th = styled.th`
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  text-align: center;
  font-weight: 500;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
`;

export default AttendanceSection;
