import React, { useState } from "react";
import styled from "styled-components";
import GradeFilterBar from "../../components/grade/GradeFilterBar";
import GradeListHeader from "../../components/grade/GradeListHeader";
import GradeListItem from "../../components/grade/GradeListItem";
import dummyGradeData from "../../data/dummyGradeData";
import { useUser } from "../../contexts/UserContext";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  const [filteredData, setFilteredData] = useState(dummyGradeData);

  const handleFilterChange = (filter) => {
    console.log(filter);
    // In a real app, you would filter the data based on the filter criteria
    // For now, we'll just use the original data
    setFilteredData(dummyGradeData);
  };

  return (
    <PageContainer>
      <GradeFilterBar
        userRole={userRole}
        userGrade="1학년"
        userClass="7반"
        onFilterChange={handleFilterChange}
      />
      {userRole === "teacher" && (
        <>
          <GradeListHeader />
          {filteredData.map((student, index) => (
            <GradeListItem key={student.id} student={student} index={index} />
          ))}
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
