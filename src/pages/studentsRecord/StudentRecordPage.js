import React, { useState } from "react";
import styled from "styled-components";
import StudentFilterBar from "../../components/studentRecord/StudentFilterBar";
import StudentListHeader from "../../components/studentRecord/StudentListHeader";
import StudentListItem from "../../components/studentRecord/StudentListItem";
import dummyStudentData from "../../data/dummyStudentData";

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

const StudentRecordPage = () => {
  const [userRole, setUserRole] = useState("teacher"); // In a real app, this would come from auth context
  const [filteredData, setFilteredData] = useState(dummyStudentData);

  const handleFilterChange = (filter) => {
    console.log(filter);
    // In a real app, you would filter the data based on the filter criteria
    // For now, we'll just use the original data
    setFilteredData(dummyStudentData);
  };

  return (
    <PageContainer>
      <StudentFilterBar
        userRole={userRole}
        userGrade="1학년"
        userClass="7반"
        onFilterChange={handleFilterChange}
      />
      {userRole === "teacher" && (
        <>
          <StudentListHeader />
          {filteredData.map((student, index) => (
            <StudentListItem key={student.id} student={student} index={index} />
          ))}
        </>
      )}
      {userRole !== "teacher" && (
        <NoAccessMessage>
          학생 기록에 접근할 수 있는 권한이 없습니다.
        </NoAccessMessage>
      )}
    </PageContainer>
  );
};

export default StudentRecordPage;
