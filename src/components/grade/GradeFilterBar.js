import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { gradeInputPeriod } from "../../data/dummyGradeData";

const GradeFilterBar = ({
  userRole,
  userGrade,
  userClass,
  onFilterChange,
}) => {
  const [search, setSearch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("1학기");
  
  // Fixed values from teacher's information
  const gradeText = userGrade || "1학년";
  const classText = userClass || "7반";

  useEffect(() => {
    onFilterChange({
      search,
      grade: gradeText,
      className: classText,
      semester: selectedSemester,
    });
  }, [search, gradeText, classText, selectedSemester, onFilterChange]);

  return (
    <FilterBarContainer>
      <LeftSection>
        <SearchInput
          type="text"
          placeholder="이름 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <GradeClassText>
          {gradeText} {classText}
        </GradeClassText>
        <Dropdown
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
        >
          <option value="1학기">1학기</option>
          <option value="2학기">2학기</option>
        </Dropdown>
      </LeftSection>
      <RightSection>
        <PeriodInfo isActive={gradeInputPeriod.isActive}>
          성적 입력 기간: {gradeInputPeriod.start} ~ {gradeInputPeriod.end}
          {!gradeInputPeriod.isActive && (
            <ExpiredLabel>기간 만료</ExpiredLabel>
          )}
        </PeriodInfo>
      </RightSection>
    </FilterBarContainer>
  );
};

const FilterBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-family: "Pretendard-Medium", sans-serif;
`;

const GradeClassText = styled.div`
  padding: 8px 12px;
  border: 2px solid #0033a0;
  border-radius: 6px;
  background-color: #f0f4ff;
  font-family: "Pretendard-Medium", sans-serif;
  color: #0033a0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dropdown = styled.select`
  padding: 8px 12px;
  border: 2px solid #0033a0;
  border-radius: 6px;
  background-color: #fff;
  font-family: "Pretendard-Medium", sans-serif;
`;

const PeriodInfo = styled.div`
  padding: 8px 16px;
  background-color: ${props => props.isActive ? '#e6f7e6' : '#ffe6e6'};
  border-radius: 6px;
  font-family: "Pretendard-Medium", sans-serif;
  color: ${props => props.isActive ? '#2e7d32' : '#c62828'};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ExpiredLabel = styled.span`
  background-color: #c62828;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
`;

export default GradeFilterBar;
