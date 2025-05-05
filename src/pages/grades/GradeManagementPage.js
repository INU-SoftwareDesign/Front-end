import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GradeFilterBar from "../../components/grade/GradeFilterBar";
import GradeListHeader from "../../components/grade/GradeListHeader";
import GradeListItem from "../../components/grade/GradeListItem";
import { getGradeManagementStatus } from "../../api/gradeApi";
import { useUser } from "../../contexts/UserContext";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoadingMessage = styled.div`
  margin: 32px auto;
  padding: 24px;
  background-color: #f0f7ff;
  border-radius: 8px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 18px;
  color: #1D4EB0;
  text-align: center;
`;

const ErrorMessage = styled.div`
  margin: 32px auto;
  padding: 24px;
  background-color: #fff0f0;
  border-radius: 8px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 18px;
  color: #e74c3c;
  text-align: center;
`;

const SemesterPeriod = styled.div`
  margin: 16px 24px;
  padding: 12px 16px;
  background-color: #f0f7ff;
  border-radius: 6px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 14px;
  color: #1D4EB0;
`;

const NoAccessMessage = styled.div`
  margin: 32px auto;
  padding: 24px;
  background-color: #f8f8f8;
  border-radius: 8px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 18px;
  color: #666;
  text-align: center;
`;

const GradeManagementPage = () => {
  const { currentUser } = useUser();
  const userRole = currentUser?.role || "teacher"; // Default to teacher for testing
  
  const [students, setStudents] = useState([]);
  const [semesterPeriod, setSemesterPeriod] = useState({ start: '', end: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    grade: "1",
    classNumber: "7",
    semester: "1"
  });

  // Fetch grade management status when component mounts or filter changes
  useEffect(() => {
    const fetchGradeManagementStatus = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getGradeManagementStatus(
          filter.grade,
          filter.classNumber,
          filter.semester
        );
        
        setStudents(data.students || []);
        setSemesterPeriod(data.semesterPeriod || { start: '', end: '' });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching grade management status:', error);
        setError(error.message || '성적 목록을 불러오는데 실패했습니다.');
        setIsLoading(false);
      }
    };
    
    fetchGradeManagementStatus();
  }, [filter]);

  const handleFilterChange = (newFilter) => {
    setFilter({
      grade: newFilter.grade || "1",
      classNumber: newFilter.classNumber || "7",
      semester: newFilter.semester || "1"
    });
  };

  return (
    <PageContainer>
      <GradeFilterBar
        userRole={userRole}
        userGrade={filter.grade}
        userClass={`${filter.classNumber}반`}
        onFilterChange={handleFilterChange}
      />
      
      {semesterPeriod.start && semesterPeriod.end && (
        <SemesterPeriod>
          성적 입력 기간: {semesterPeriod.start} ~ {semesterPeriod.end}
        </SemesterPeriod>
      )}
      
      {userRole === "teacher" && (
        <>
          <GradeListHeader />
          {isLoading ? (
            <LoadingMessage>성적 정보를 불러오는 중입니다...</LoadingMessage>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : students.length === 0 ? (
            <NoAccessMessage>해당 학급의 성적 정보가 없습니다.</NoAccessMessage>
          ) : (
            students.map((student, index) => (
              <GradeListItem key={student.id} student={student} index={index} />
            ))
          )}
        </>
      )}
      {userRole !== "teacher" && (
        <NoAccessMessage>
          성적 관리 페이지에 접근할 수 있는 권한이 없습니다.
        </NoAccessMessage>
      )}
    </PageContainer>
  );
};

export default GradeManagementPage;
