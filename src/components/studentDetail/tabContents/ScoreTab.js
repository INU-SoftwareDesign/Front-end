import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getStudentGradeOverview } from '../../../api/gradeApi';
import ScoreTable from '../ScoreTable';
import ScoreRadarChart from '../ScoreRadarChart';
import dummyStudentScoreData from '../../../data/dummyStudentScoreData';

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
  const [selectedGrade, setSelectedGrade] = useState('1');
  const [selectedSemester, setSelectedSemester] = useState('1학기');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gradeData, setGradeData] = useState(null);
  const [availableGrades, setAvailableGrades] = useState(['1', '2', '3']);
  const [availableSemesters, setAvailableSemesters] = useState(['1학기', '2학기']);
  const [availableSubjects, setAvailableSubjects] = useState(['all', '국어', '수학', '영어', '과학', '사회', '음악', '미술', '체육']);

  // Fetch student grade data when filters change
  useEffect(() => {
    const fetchStudentGradeData = async () => {
      if (!student || !student.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getStudentGradeOverview(
          student.id,
          selectedGrade,
          selectedSemester
        );
        
        if (data && Object.keys(data).length > 0) {
          setGradeData(data);
        } else {
          // API에서 데이터가 없거나 빈 객체를 반환한 경우 더미 데이터 사용
          const dummyData = getDummyGradeData(student.id, selectedGrade, selectedSemester);
          setGradeData(dummyData);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching student grade data:', err);
        // API 호출 실패 시 더미 데이터 사용
        const dummyData = getDummyGradeData(student.id, selectedGrade, selectedSemester);
        setGradeData(dummyData);
        setIsLoading(false);
      }
    };
    
    fetchStudentGradeData();
  }, [student, selectedGrade, selectedSemester]);
  
  // 더미 데이터 가져오기 함수
  const getDummyGradeData = (studentId, grade, semester) => {
    console.log('Getting dummy data for student:', studentId, grade, semester);
    
    // 학생 ID와 더미 데이터 키 매핑
    // 예: 20250001 -> 1, 20250002 -> 2 등
    let dummyId = 1; // 기본값은 1
    
    if (studentId) {
      // 학생 ID에서 마지막 숫자 추출
      const lastDigits = studentId.toString().slice(-1);
      const numericId = parseInt(lastDigits, 10);
      
      // 유효한 숫자이고 dummyStudentScoreData에 해당 키가 있으면 사용
      if (!isNaN(numericId) && numericId > 0 && dummyStudentScoreData[numericId]) {
        dummyId = numericId;
      }
    }
    
    console.log('Using dummy ID:', dummyId);
    
    // 더미 데이터에서 매핑된 ID에 해당하는 데이터 찾기
    const studentData = dummyStudentScoreData[dummyId];
    
    if (!studentData) {
      console.log('No dummy data found for ID:', dummyId);
      return null;
    }
    
    // 학년과 학기에 맞는 데이터 찾기
    const gradeData = studentData.find(data => 
      data.grade === `${grade}학년` && data.semester === semester
    );
    
    // 해당 학년/학기 데이터가 없으면 첫 번째 데이터 사용
    const finalData = gradeData || studentData[0];
    
    if (!finalData) {
      console.log('No grade data found for grade/semester:', grade, semester);
      return null;
    }
    
    console.log('Found dummy data:', finalData);
    
    // API 응답 형식에 맞게 데이터 변환
    return {
      studentId: student.studentId || studentId,
      studentName: student.name || '홍길동',
      grade: grade || '1',
      classNumber: student.classNumber || '7',
      number: student.number || '1',
      subjects: finalData.scores.map(score => ({
        name: score.subject,
        credits: score.unit,
        midterm: score.midterm,
        final: score.final,
        performance: score.task,
        totalScore: score.total,
        rank: score.rank,
        grade: score.grade
      }))
    };
  };

  // Loading state component
  const LoadingMessage = () => (
    <NoDataContainer>
      <NoDataText>성적 정보를 불러오는 중입니다...</NoDataText>
    </NoDataContainer>
  );
  
  // Error state component
  const ErrorMessage = () => (
    <NoDataContainer>
      <NoDataText>{error}</NoDataText>
    </NoDataContainer>
  );

  if (!student) return null;

  return (
    <TabContainer>
      <FilterContainer>
        <FilterGroup>
          <FilterLabel>학년</FilterLabel>
          <FilterSelect 
            value={selectedGrade} 
            onChange={(e) => setSelectedGrade(e.target.value)}
            disabled={isLoading}
          >
            {availableGrades.map((grade) => (
              <option key={grade} value={grade}>{grade}학년</option>
            ))}
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>학기</FilterLabel>
          <FilterSelect 
            value={selectedSemester} 
            onChange={(e) => setSelectedSemester(e.target.value)}
            disabled={isLoading}
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

      {isLoading ? (
        <LoadingMessage />
      ) : error ? (
        <ErrorMessage />
      ) : !gradeData ? (
        <NoDataContainer>
          <NoDataText>
            선택한 학년/학기에 해당하는 성적 데이터가 존재하지 않습니다.
          </NoDataText>
        </NoDataContainer>
      ) : (
        <ScoreCardContainer>
          <ContentContainer>
            <ScoreTable 
              subjects={gradeData.subjects} 
              totals={gradeData.totals}
              finalSummary={gradeData.finalSummary}
              title={`${selectedGrade}학년 ${selectedSemester} 성적표`}
              grade={selectedGrade}
              semester={selectedSemester}
            />
            <ScoreRadarChart 
              labels={gradeData.radarChart.labels}
              data={gradeData.radarChart.data}
              title="과목별 성적 분포" 
            />
          </ContentContainer>
        </ScoreCardContainer>
      )}
    </TabContainer>
  );
};

export default ScoreTab;
