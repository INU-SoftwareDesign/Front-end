import React, { useEffect } from "react";
import styled from "styled-components";
import useStudentStore from "../../store/useStudentStore";
import { classOptions, grades } from "../../data/dummyStudentBarData";

const StudentFilterBar = ({
  userRole,
  userGrade,
  userClass,
  onFilterChange,
}) => {
  const {
    search,
    selectedGrade,
    selectedClass,
    setSearch,
    setGrade,
    setClass,
  } = useStudentStore();

  const isEditable =
    userRole === "teacher" &&
    userGrade === selectedGrade &&
    userClass === selectedClass;

  useEffect(() => {
    onFilterChange({
      search,
      grade: selectedGrade,
      className: selectedClass,
    });
  }, [search, selectedGrade, selectedClass]);

  return (
    <FilterBarContainer>
      <LeftSection>
        <SearchInput
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Dropdown
          value={selectedGrade}
          onChange={(e) => {
            setGrade(e.target.value);
            setClass(classOptions[e.target.value][0]);
          }}
        >
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </Dropdown>
        <Dropdown
          value={selectedClass}
          onChange={(e) => setClass(e.target.value)}
        >
          {classOptions[selectedGrade].map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </Dropdown>
      </LeftSection>
      {isEditable && <EditButton>수정하기</EditButton>}
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

const SearchInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-family: "Pretendard-Medium";
`;

const Dropdown = styled.select`
  padding: 8px 12px;
  border: 2px solid #0033a0;
  border-radius: 6px;
  background-color: #fff;
  font-family: "Pretendard-Medium";
`;

const EditButton = styled.button`
  background-color: #6c4eff;
  color: white;
  padding: 12px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-family: "Pretendard-Medium";
`;

export default StudentFilterBar;
