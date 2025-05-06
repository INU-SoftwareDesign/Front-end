import React, { useState, useEffect, useCallback } from 'react';
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

const ScoreTab = ({ student, studentUrlId, forceLoad = false }) => {
  // URL에서 가져온 ID 값 디버깅
  console.log('전달받은 URL ID:', studentUrlId);
  // 디버깅용 로그
  console.log('ScoreTab 컴포넌트 렌더링:', { studentUrlId, studentId: student?.studentId, forceLoad });
  const [selectedGrade, setSelectedGrade] = useState('1');
  const [selectedSemester, setSelectedSemester] = useState('1학기');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gradeData, setGradeData] = useState(null);
  const [availableGrades, setAvailableGrades] = useState(['1', '2', '3']);
  const [availableSemesters, setAvailableSemesters] = useState(['1학기', '2학기']);
  const [availableSubjects, setAvailableSubjects] = useState(['all', '국어', '수학', '영어', '과학', '사회', '음악', '미술', '체육']);

  // 데이터 가져오는 함수 - useCallback으로 감싸서 메모이제이션
  const fetchStudentGradeData = useCallback(async () => {
    // URL에서 가져온 ID가 있으면 그것을 사용, 없으면 student 객체의 studentId 사용
    if (!studentUrlId && (!student || !student.studentId)) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // URL에서 가져온 ID를 우선적으로 사용
      const idToUse = studentUrlId || student.studentId;
      console.log(`학생 ID: ${idToUse}, 학년: ${selectedGrade}, 학기: ${selectedSemester.replace('학기', '')}`);
      console.log('성적 데이터 API 호출 중...');
      
      // gradeApi의 getStudentGradeOverview로 데이터 가져오기
      const data = await getStudentGradeOverview(
        idToUse, // URL에서 가져온 ID를 우선적으로 사용
        selectedGrade,
        selectedSemester.replace('학기', '') // '학기' 부분 제거
      );
      
      if (data && Object.keys(data).length > 0) {
        console.log('API에서 성적 데이터 수신 성공:', data);
        setGradeData(data);
        
        // 과목 목록 업데이트
        if (data.subjects && data.subjects.length > 0) {
          const subjects = data.subjects.map(subject => subject.name);
          setAvailableSubjects(['all', ...subjects]);
        }
      } else {
        console.log('API에서 데이터가 없어 더미 데이터 사용');
        // API에서 데이터가 없거나 빈 객체를 반환한 경우 더미 데이터 사용
        const dummyData = getDummyGradeData(idToUse, selectedGrade, selectedSemester);
        setGradeData(dummyData);
        
        // 더미 데이터의 과목 목록 업데이트
        if (dummyData && dummyData.subjects && dummyData.subjects.length > 0) {
          const subjects = dummyData.subjects.map(subject => subject.name);
          setAvailableSubjects(['all', ...subjects]);
        }
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching student grade data:', err);
      // URL에서 가져온 ID를 우선적으로 사용
      const idToUse = studentUrlId || student.studentId;
      // API 호출 실패 시 더미 데이터 사용
      const dummyData = getDummyGradeData(idToUse, selectedGrade, selectedSemester);
      setGradeData(dummyData);
      
      // 더미 데이터의 과목 목록 업데이트
      if (dummyData && dummyData.subjects && dummyData.subjects.length > 0) {
        const subjects = dummyData.subjects.map(subject => subject.name);
        setAvailableSubjects(['all', ...subjects]);
      }
      
      setIsLoading(false);
    }
  }, [student, studentUrlId, selectedGrade, selectedSemester]);

  // 필터 변경 시 데이터 가져오기
  useEffect(() => {
    if (student && student.id) {
      fetchStudentGradeData();
    }
  }, [student, selectedGrade, selectedSemester, fetchStudentGradeData]); // 필터 변경 시 리렌더링
  
  // 컴포넌트 마운트 시 성적 데이터 가져오기
  useEffect(() => {
    // URL에서 가져온 ID가 있으면 그것을 사용, 없으면 student 객체의 studentId 필요
    if (studentUrlId || (student && student.studentId)) {
      console.log('ScoreTab 컴포넌트 마운트 시 데이터 가져오기 시도:', { studentUrlId, studentId: student?.studentId });
      fetchStudentGradeData();
    }
  }, [studentUrlId, student, fetchStudentGradeData]); // studentUrlId, student와 fetchStudentGradeData 의존성 추가
  
  // forceLoad prop이 변경될 때 데이터 다시 가져오기 (탭 클릭 시)
  useEffect(() => {
    // URL에서 가져온 ID가 있으면 그것을 사용, 없으면 student 객체의 studentId 필요
    if (studentUrlId || (student && student.studentId)) {
      console.log('forceLoad useEffect 호출:', { forceLoad, studentUrlId, studentId: student?.studentId });
      
      // forceLoad가 true이거나 false에 상관없이 항상 API 호출
      console.log('ScoreTab이 활성화되어 데이터를 다시 가져옵니다.');
      // 비동기 함수 호출을 위해 setTimeout 사용
      setTimeout(() => {
        console.log('성적 데이터 가져오기 시작...');
        fetchStudentGradeData();
      }, 0);
    }
  }, [forceLoad, studentUrlId, student, fetchStudentGradeData]);
  
  // 더미 데이터 가져오기 함수
  const getDummyGradeData = (studentId, grade, semester) => {
    console.log('Getting dummy data for student:', studentId, grade, semester);
    
    // 학생 ID와 더미 데이터 키 매핑
    // 예: 20250001 -> 1, 20250002 -> 2 등
    let dummyId = 1; // 기본값은 1
    
    if (studentId) {
      // URL에서 가져온 ID 또는 student.studentId 사용
      const idToUse = studentId;
      
      // 학생 ID에서 마지막 숫자 추출
      const lastDigits = idToUse.toString().slice(-1);
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
    const semesterValue = semester.replace('학기', '');
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
    
    // 레이더 차트를 위한 데이터 처리
    const subjects = finalData.scores.map(score => score.subject);
    const radarData = finalData.scores.map(score => score.total);
    
    // API 응답 형식에 맞게 데이터 변환
    return {
      studentId: studentUrlId || student.studentId || studentId,
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
        gradeLevel: score.grade
      })),
      totals: {
        totalCredits: finalData.scores.reduce((sum, score) => sum + score.unit, 0),
        sumMidterm: finalData.scores.reduce((sum, score) => sum + score.midterm, 0) / finalData.scores.length,
        sumFinal: finalData.scores.reduce((sum, score) => sum + score.final, 0) / finalData.scores.length,
        sumPerformance: finalData.scores.reduce((sum, score) => sum + score.task, 0) / finalData.scores.length,
        sumTotalScore: finalData.scores.reduce((sum, score) => sum + score.total, 0) / finalData.scores.length
      },
      finalSummary: {
        totalStudents: 30,
        finalRank: finalData.rank || '??',
        finalConvertedGrade: finalData.grade || '??'
      },
      radarChart: {
        labels: subjects,
        data: radarData
      }
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

  // 학년/학기/과목 변경 핸들러
  const handleGradeChange = (e) => {
    setSelectedGrade(e.target.value);
    // 학년 변경 시 과목 필터 초기화
    setSelectedSubject('all');
  };
  
  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
    // 학기 변경 시 과목 필터 초기화
    setSelectedSubject('all');
  };
  
  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };
  
  // URL에서 가져온 ID 또는 student 객체가 없으면 오류 메시지 표시
  if (!studentUrlId && (!student || !student.studentId)) {
    console.error('ScoreTab에 전달된 student 객체와 URL ID가 유효하지 않습니다:', { student, studentUrlId });
    return (
      <NoDataContainer>
        <NoDataText>학생 정보를 찾을 수 없습니다.</NoDataText>
      </NoDataContainer>
    );
  }
  
  return (
    <TabContainer>
      <FilterContainer>
        <FilterGroup>
          <FilterLabel>학년</FilterLabel>
          <FilterSelect 
            value={selectedGrade} 
            onChange={handleGradeChange}
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
            onChange={handleSemesterChange}
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
            onChange={handleSubjectChange}
            disabled={isLoading || availableSubjects.length <= 1}
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
              subjects={selectedSubject === 'all' 
                ? gradeData.subjects 
                : gradeData.subjects.filter(subject => subject.name === selectedSubject)} 
              totals={gradeData.totals}
              finalSummary={gradeData.finalSummary}
              title={`${selectedGrade}학년 ${selectedSemester} 성적표 ${selectedSubject !== 'all' ? `(${selectedSubject})` : ''}`}
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
