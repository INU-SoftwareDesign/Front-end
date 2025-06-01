import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAttendanceRecords } from '../../../api/attendanceApi';

const AttendanceSection = ({ studentId }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const data = await getAttendanceRecords(studentId);
        // 학년과 연도를 기준으로 정렬
        const sortedAttendance = data.attendance.sort((a, b) => {
          if (Number(a.year) !== Number(b.year)) {
            return Number(b.year) - Number(a.year);
          }
          return Number(b.grade) - Number(a.grade);
        });
        setAttendanceData({ ...data, attendance: sortedAttendance });
      } catch (error) {
        console.error('Failed to fetch attendance data:', error);
        setError('출결 정보를 불러오는데 실패했습니다.');
      }
    };

    if (studentId) {
      fetchAttendanceData();
    }
  }, [studentId]);

  if (error) {
    return (
      <Section>
        <Title>출결</Title>
        <EmptyMessage>{error}</EmptyMessage>
      </Section>
    );
  }

  if (!attendanceData || !attendanceData.attendance.length) {
    return (
      <Section>
        <Title>출결</Title>
        <EmptyMessage>출결 정보가 없습니다.</EmptyMessage>
      </Section>
    );
  }

  return (
    <Section>
      <Title>출결</Title>
      <TableContainer>
        <TableTitle>출결 현황</TableTitle>
        <AttendanceTable>
          <thead>
            <tr>
              <TableHeader rowSpan="2">학년</TableHeader>
              <TableHeader rowSpan="2">연도</TableHeader>
              <TableHeader rowSpan="2">총 수업일수</TableHeader>
              <TableHeader rowSpan="2">특기사항</TableHeader>
              <TableHeader colSpan="3">구분(질병/무단/기타)</TableHeader>
            </tr>
            <tr>
              <SubTableHeader>결석</SubTableHeader>
              <SubTableHeader>지각</SubTableHeader>
              <SubTableHeader>조퇴</SubTableHeader>
            </tr>
          </thead>
          <tbody>
            {attendanceData.attendance.map((record) => (
              <tr key={`${record.grade}-${record.year}`}>
                <TableCell>{record.grade}학년</TableCell>
                <TableCell>{record.year}</TableCell>
                <TableCell>{record.totalDays}일</TableCell>
                <TableCell>{record.remarks || '-'}</TableCell>
                <TableCell>
                  {record.attendance.absence.illness} / {record.attendance.absence.unauthorized} / {record.attendance.absence.etc}
                </TableCell>
                <TableCell>
                  {record.attendance.lateness.illness} / {record.attendance.lateness.unauthorized} / {record.attendance.lateness.etc}
                </TableCell>
                <TableCell>
                  {record.attendance.earlyLeave.illness} / {record.attendance.earlyLeave.unauthorized} / {record.attendance.earlyLeave.etc}
                </TableCell>
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

const Title = styled.h2`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 22px;
  color: #1a237e;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1a237e;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #78909c;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
`;

const TableContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 900px;
`;

const AttendanceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
  table-layout: fixed;
  
  th {
    padding: 8px;
    text-align: center;
    border-bottom: 2px solid #1a237e;
    white-space: nowrap;
    font-size: 14px;
  }

  tbody tr:nth-child(even) {
    background-color: #fafafa;
  }

  tbody tr:last-child td {
    border-bottom: 2px solid #e0e0e0;
  }
`;

const TableHeader = styled.th`
  background-color: #f5f5f5;
  font-weight: 600;
  color: #1a237e;
`;

const TableTitle = styled.h3`
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 16px;
  color: #1a237e;
  margin-bottom: 10px;
`;

const SubTableHeader = styled(TableHeader)`
  background-color: #f8f9fa;
  border-bottom: 1px solid #1a237e;
  font-size: 13px;
`;

const TableCell = styled.td`
  color: #333;
  font-family: 'Pretendard-Regular', sans-serif;
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
`;

export default AttendanceSection;
