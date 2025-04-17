import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import dummyStudentScoreData from '../../../data/dummyStudentScoreData';
import ScoreTable from '../ScoreTable';
import ScoreRadarChart from '../ScoreRadarChart';

const TabContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  min-height: 500px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 14px;
  color: #555;
`;

const FilterSelect = styled.select`
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 14px;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #1D4EB0;
  }
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  
  @media (min-width: 1024px) {
    grid-template-columns: 3fr 2fr;
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
`;

const NoDataText = styled.p`
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 18px;
  color: #666;
  text-align: center;
`;

const ScoreCardContainer = styled.div`
  margin-bottom: 32px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ScoreTab = ({ student }) => {
  const [studentScores, setStudentScores] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [filteredScores, setFilteredScores] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);

  // Load student score data
  useEffect(() => {
    if (student && student.id) {
      const scores = dummyStudentScoreData[student.id] || [];
      setStudentScores(scores);
      
      // Set available filter options
      const grades = [...new Set(scores.map(item => item.grade))];
      setAvailableGrades(grades);
      
      // Set default selected grade if available
      if (grades.length > 0 && !selectedGrade) {
        setSelectedGrade(grades[0]);
      }
    }
  }, [student]);

  // Update available semesters when grade changes
  useEffect(() => {
    if (selectedGrade) {
      const semesters = [...new Set(
        studentScores
          .filter(item => item.grade === selectedGrade)
          .map(item => item.semester)
      )];
      setAvailableSemesters(semesters);
      
      // Set default selected semester if available
      if (semesters.length > 0) {
        setSelectedSemester(semesters[0]);
      } else {
        setSelectedSemester('');
      }
    }
  }, [selectedGrade, studentScores]);

  // Update available subjects when grade or semester changes
  useEffect(() => {
    if (selectedGrade && selectedSemester) {
      const scoreData = studentScores.find(
        item => item.grade === selectedGrade && item.semester === selectedSemester
      );
      
      if (scoreData && scoreData.scores) {
        const subjects = ['all', ...scoreData.scores.map(item => item.subject)];
        setAvailableSubjects(subjects);
        setSelectedSubject('all');
      } else {
        setAvailableSubjects(['all']);
        setSelectedSubject('all');
      }
    }
  }, [selectedGrade, selectedSemester, studentScores]);

  // Filter scores based on selected filters
  useEffect(() => {
    if (selectedGrade && selectedSemester) {
      const scoreData = studentScores.find(
        item => item.grade === selectedGrade && item.semester === selectedSemester
      );
      
      if (scoreData) {
        // If a specific subject is selected, filter the scores
        if (selectedSubject !== 'all') {
          const filteredScoreData = {
            ...scoreData,
            scores: scoreData.scores.filter(item => item.subject === selectedSubject)
          };
          setFilteredScores([filteredScoreData]);
        } else {
          setFilteredScores([scoreData]);
        }
      } else {
        setFilteredScores([]);
      }
    } else {
      setFilteredScores([]);
    }
  }, [selectedGrade, selectedSemester, selectedSubject, studentScores]);

  if (!student) return null;

  // If no score data is available for this student
  if (studentScores.length === 0) {
    return (
      <TabContainer>
        <NoDataContainer>
          <NoDataText>
            {student.name} 학생의 성적 정보가 존재하지 않습니다.
          </NoDataText>
        </NoDataContainer>
      </TabContainer>
    );
  }

  return (
    <TabContainer>
      <FilterContainer>
        <FilterGroup>
          <FilterLabel>학년</FilterLabel>
          <FilterSelect 
            value={selectedGrade} 
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            {availableGrades.map((grade) => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>학기</FilterLabel>
          <FilterSelect 
            value={selectedSemester} 
            onChange={(e) => setSelectedSemester(e.target.value)}
            disabled={availableSemesters.length === 0}
          >
            {availableSemesters.map((semester) => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>과목</FilterLabel>
          <FilterSelect 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={availableSubjects.length <= 1}
          >
            {availableSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject === 'all' ? '전체 과목' : subject}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>
      </FilterContainer>

      {filteredScores.length > 0 ? (
        filteredScores.map((scoreData, index) => (
          <ScoreCardContainer key={index}>
            <ContentContainer>
              <ScoreTable 
                scoreData={scoreData} 
                title={`${scoreData.grade} ${scoreData.semester} 성적표`} 
              />
              <ScoreRadarChart 
                scores={scoreData.scores} 
                title="과목별 성적 분포" 
              />
            </ContentContainer>
          </ScoreCardContainer>
        ))
      ) : (
        <NoDataContainer>
          <NoDataText>
            선택한 학년/학기에 해당하는 성적 데이터가 존재하지 않습니다.
          </NoDataText>
        </NoDataContainer>
      )}
    </TabContainer>
  );
};

export default ScoreTab;
