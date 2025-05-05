import React, { useEffect, useState } from "react";
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

  // Ensure we have valid data for dropdown options
  const [availableGrades, setAvailableGrades] = useState(grades || []);
  const [availableClasses, setAvailableClasses] = useState([]);
  
  // Update available classes when grade changes
  useEffect(() => {
    // Safely get classes for the selected grade with fallback to empty array
    const classes = classOptions && classOptions[selectedGrade] ? classOptions[selectedGrade] : [];
    setAvailableClasses(classes);
  }, [selectedGrade]);
  
  const isEditable =
    userRole === "teacher" &&
    userGrade === selectedGrade &&
    userClass === selectedClass;

  useEffect(() => {
    // Only call onFilterChange if it exists (defensive programming)
    if (typeof onFilterChange === 'function') {
      onFilterChange({
        search,
        grade: selectedGrade,
        className: selectedClass,
      });
    }
  }, [search, selectedGrade, selectedClass, onFilterChange]);

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
            // Safely get the first class for the selected grade
            const firstClass = classOptions && classOptions[e.target.value] && 
              classOptions[e.target.value].length > 0 ? 
              classOptions[e.target.value][0] : "1";
            setClass(firstClass);
          }}
        >
          {availableGrades && availableGrades.length > 0 ? (
            availableGrades.map((grade) => (
              <option key={grade} value={grade}>
                {grade}학년
              </option>
            ))
          ) : (
            <option value="1">1학년</option>
          )}
        </Dropdown>
        <Dropdown
          value={selectedClass}
          onChange={(e) => setClass(e.target.value)}
        >
          {availableClasses && availableClasses.length > 0 ? (
            availableClasses.map((cls) => (
              <option key={cls} value={cls}>
                {cls}반
              </option>
            ))
          ) : (
            <option value="1">1반</option>
          )}
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
