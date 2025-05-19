import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { getStudentGradeOverview } from '../../../api/gradeApi';
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

const ScoreTab = ({ student, studentUrlId, forceLoad = false }) => {
  // URL에서 가져온 ID 값 디버깅
  console.log('전달받은 URL ID:', studentUrlId);
  // 디버깅용 로그
  console.log('ScoreTab 컴포넌트 렌더링:', { studentUrlId, studentId: student?.studentId, forceLoad });
  const [selectedGrade, setSelectedGrade] = useState('1');
  const [selectedSemester, setSelectedSemester] = useState('1학기');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gradeData, setGradeData] = useState(null);
  
  // 탭 로드에 대한 추적을 위한 ref
  const dataLoaded = useRef(false);
  
  // 캐시를 위한 ref - 학년/학기별 데이터 저장
  const cachedData = useRef({});
  const [availableGrades, setAvailableGrades] = useState(['1', '2', '3']);
  const [availableSemesters, setAvailableSemesters] = useState(['1학기', '2학기']);
  const [availableSubjects, setAvailableSubjects] = useState(['all', '국어', '수학', '영어', '과학', '사회', '음악', '미술', '체육']);

  // 학생 성적 데이터 가져오기 - 의존성 배열 문제 해결
  const fetchStudentGradeData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const idToUse = studentUrlId || (student && student.studentId);
      if (!idToUse) {
        throw new Error('학생 ID를 찾을 수 없습니다.');
      }
      
      // 함수 내부에서 최신 상태값 직접 참조
      const currentGrade = selectedGrade;
      const currentSemester = selectedSemester;
      
      console.log(`성적 데이터 가져오기: 학생ID=${idToUse}, 학년=${currentGrade}, 학기=${currentSemester}`);
      
      // 학기 값에서 '학기' 제거
      const semesterValue = currentSemester.replace('학기', '');
      
      // API 호출
      const data = await getStudentGradeOverview(idToUse, currentGrade, semesterValue);
      console.log('가져온 성적 데이터:', data);
      
      if (data && data.subjects && data.subjects.length > 0) {
        console.log('API에서 성적 데이터 수신 성공:', data);
        
        // 데이터 구조 확인 및 디버깅
        console.log('데이터 구조 확인:', {
          subjects: data.subjects,
          totals: data.totals,
          finalSummary: data.finalSummary,
          radarChart: data.radarChart
        });
        
        // ScoreTable 컴포넌트에 맞게 데이터 구조 변환
        const processedSubjects = data.subjects.map(subject => ({
          name: subject.name,
          credits: subject.credits || 1,
          midterm: subject.midterm || 0,
          final: subject.final || 0,
          performance: subject.performance || 0,
          totalScore: (subject.midterm || 0) + (subject.final || 0) + (subject.performance || 0),
          rank: subject.rank || '1',
          gradeLevel: subject.gradeLevel || 'A'
        }));
        
        // 총합 점수 계산
        const totalCredits = processedSubjects.reduce((sum, subject) => sum + subject.credits, 0);
        const sumMidterm = processedSubjects.reduce((sum, subject) => sum + subject.midterm, 0);
        const sumFinal = processedSubjects.reduce((sum, subject) => sum + subject.final, 0);
        const sumPerformance = processedSubjects.reduce((sum, subject) => sum + subject.performance, 0);
        const sumTotalScore = sumMidterm + sumFinal + sumPerformance;
        
        // totals 데이터 구성
        const totals = {
          totalCredits,
          sumMidterm,
          sumFinal,
          sumPerformance,
          sumTotalScore
        };
        
        // finalSummary 데이터 구성
        const finalSummary = {
          totalStudents: 30,
          finalRank: '1',
          finalConvertedGrade: 'A'
        };
        
        // radarChart 데이터 구성
        const radarChart = {
          labels: processedSubjects.map(subject => subject.name),
          data: processedSubjects.map(subject => subject.totalScore / 3)
        };
        
        // 최종 데이터 구성
        const processedData = {
          subjects: processedSubjects,
          totals,
          finalSummary,
          radarChart
        };
        
        console.log('변환된 데이터:', processedData);
        setGradeData(processedData);
        
        // 과목 목록 업데이트
        const subjectNames = processedSubjects.map(subject => subject.name);
        setAvailableSubjects(['all', ...subjectNames]);
      } else {
        console.log('API에서 데이터가 없습니다');
        setGradeData(null);
        setError('해당 학년 학기에 성적 데이터가 없습니다.');
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching grade data:', err);
      setError('성적 데이터를 가져오는 중 오류가 발생했습니다.');
      setGradeData(null);
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student, studentUrlId, selectedGrade, selectedSemester, setAvailableSubjects]); // ESLint 경고 해결을 위해 의존성 추가

  // 필터 변경 시 데이터 가져오기 - 사용자 액션에 의한 변경일 때만 실행
  const [isUserAction, setIsUserAction] = useState(false);
  
  // 디바운싱을 위한 타이머 ID
  const timerRef = useRef(null);
  
  useEffect(() => {
    // 사용자 액션에 의한 변경일 때만 실행
    if (student && student.id && isUserAction) {
      console.log(`사용자 액션에 의한 변경: 학년=${selectedGrade}, 학기=${selectedSemester}`);
      
      // 이전 타이머 취소
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // 300ms 디바운싱 적용 - 연속적인 상태 변경에 대해 한 번만 API 호출
      timerRef.current = setTimeout(() => {
        fetchStudentGradeData();
        setIsUserAction(false); // 액션 처리 후 초기화
      }, 300);
    }
    
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student, isUserAction, fetchStudentGradeData, selectedGrade, selectedSemester]); // ESLint 경고 해결을 위해 의존성 추가
  
  // 학생의 성적 입력 상태 확인 및 가용한 학년/학기 데이터 가져오기
  const fetchAvailableGradeData = useCallback(async (shouldSetInitialValues = true) => {
    if (!studentUrlId && (!student || !student.studentId)) return;
    
    try {
      // 모든 학년과 학기 조합에 대해 성적 데이터 확인
      const availableGradeData = [];
      const idToUse = studentUrlId || student.studentId;
      
      for (const grade of availableGrades) {
        for (const semester of availableSemesters) {
          try {
            const semesterValue = semester.replace('학기', '');
            const data = await getStudentGradeOverview(idToUse, grade, semesterValue);
            
            // 성적 데이터가 있고 모든 과목에 점수가 입력되어 있는지 확인
            if (data && data.subjects && data.subjects.length > 0) {
              const allSubjectsComplete = data.subjects.every(subject => 
                subject.midterm !== undefined && 
                subject.final !== undefined && 
                subject.performance !== undefined
              );
              
              if (allSubjectsComplete) {
                availableGradeData.push({
                  grade,
                  semester: semesterValue,
                  status: '입력완료'
                });
              }
            }
          } catch (error) {
            // 특정 학년/학기 조합에 대한 오류는 무시하고 계속 진행
            console.error(`Error checking grade data for ${grade}-${semester}:`, error);
          }
        }
      }
      
      console.log('사용 가능한 성적 데이터:', availableGradeData);
      
      // 초기 로딩 시에만 값을 설정하고, 드롭다운 변경 시에는 설정하지 않음
      if (shouldSetInitialValues && availableGradeData.length > 0) {
        const firstData = availableGradeData[0];
        setSelectedGrade(firstData.grade);
        setSelectedSemester(`${firstData.semester}학기`);
        // 직접 fetchStudentGradeData 호출 대신 isUserAction 플래그 설정
        // 이렇게 하면 다른 useEffect에서 한 번만 API를 호출함
        setIsUserAction(true);
      }
    } catch (error) {
      console.error('Error fetching available grade data:', error);
    }
  }, [studentUrlId, student, availableGrades, availableSemesters, setIsUserAction]); // fetchStudentGradeData 제거, setIsUserAction 추가
  
  // 모든 학년/학기 데이터를 가져와서 캐시에 저장하는 함수
  const fetchAllGradeData = useCallback(async () => {
    if (!studentUrlId && (!student || !student.studentId)) return;
    
    const idToUse = studentUrlId || student.studentId;
    console.log('모든 학년/학기 데이터 가져오기 시작:', idToUse);
    
    setIsLoading(true);
    
    try {
      // 모든 학년과 학기 조합에 대해 성적 데이터 가져오기
      for (const grade of availableGrades) {
        for (const semester of availableSemesters) {
          const semesterValue = semester.replace('학기', '');
          const cacheKey = `${grade}-${semesterValue}`;
          
          // 이미 캐시에 있는 데이터는 건너뛰기
          if (cachedData.current[cacheKey]) continue;
          
          try {
            console.log(`학년 ${grade}, 학기 ${semesterValue} 데이터 가져오기...`);
            const data = await getStudentGradeOverview(idToUse, grade, semesterValue);
            
            if (data && data.subjects && data.subjects.length > 0) {
              // 데이터 가공 처리
              const processedData = processGradeData(data);
              
              // 캐시에 저장
              cachedData.current[cacheKey] = processedData;
              console.log(`학년 ${grade}, 학기 ${semesterValue} 데이터 캐싱 완료`);
              
              // 과목 목록 업데이트
              if (grade === selectedGrade && semester === selectedSemester) {
                const subjectNames = processedData.subjects.map(subject => subject.name);
                setAvailableSubjects(['all', ...subjectNames]);
                setGradeData(processedData);
              }
            }
          } catch (error) {
            console.error(`Error fetching grade data for ${grade}-${semester}:`, error);
          }
        }
      }
      
      // 전체 캐싱 완료 후 현재 선택된 학년/학기 데이터 표시
      const currentKey = `${selectedGrade}-${selectedSemester.replace('학기', '')}`;
      if (cachedData.current[currentKey]) {
        setGradeData(cachedData.current[currentKey]);
        const subjectNames = cachedData.current[currentKey].subjects.map(subject => subject.name);
        setAvailableSubjects(['all', ...subjectNames]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching all grade data:', error);
      setIsLoading(false);
    }
  }, [availableGrades, availableSemesters, selectedGrade, selectedSemester, student, studentUrlId]);
  
  // 데이터 가공 처리 함수 - API 응답 데이터 최대한 활용
  const processGradeData = useCallback((data) => {
    console.log('원본 API 데이터 확인:', data);
    
    // ScoreTable 컴포넌트에 맞게 데이터 구조 변환
    const processedSubjects = data.subjects.map(subject => ({
      name: subject.name,
      credits: subject.credits || 1,
      midterm: subject.midterm || 0,
      final: subject.final || 0,
      performance: subject.performance || 0,
      totalScore: (subject.midterm || 0) + (subject.final || 0) + (subject.performance || 0),
      // API에서 석차와 등급 정보가 있으면 사용
      rank: subject.rank || '1',
      gradeLevel: subject.gradeLevel || 'A'
    }));
    
    // 총합 점수 계산
    const totalCredits = processedSubjects.reduce((sum, subject) => sum + subject.credits, 0);
    const sumMidterm = processedSubjects.reduce((sum, subject) => sum + subject.midterm, 0);
    const sumFinal = processedSubjects.reduce((sum, subject) => sum + subject.final, 0);
    const sumPerformance = processedSubjects.reduce((sum, subject) => sum + subject.performance, 0);
    const sumTotalScore = sumMidterm + sumFinal + sumPerformance;
    
    // totals 데이터 구성 - API에서 제공하는 경우 사용
    const totals = data.totals || {
      totalCredits,
      sumMidterm,
      sumFinal,
      sumPerformance,
      sumTotalScore
    };
    
    // finalSummary 데이터 구성 - API에서 제공하는 경우 사용
    const finalSummary = {};
    
    // 학년 총 인원
    if (data.finalSummary && data.finalSummary.totalStudents) {
      finalSummary.totalStudents = data.finalSummary.totalStudents;
    } else if (data.classInfo && data.classInfo.totalStudents) {
      finalSummary.totalStudents = data.classInfo.totalStudents;
    } else {
      finalSummary.totalStudents = 30; // 기본값
    }
    
    // 해당 학생의 석차
    if (data.finalSummary && data.finalSummary.finalRank) {
      finalSummary.finalRank = data.finalSummary.finalRank;
    } else if (data.finalSummary && data.finalSummary.rank) {
      finalSummary.finalRank = data.finalSummary.rank;
    } else if (data.studentRank) {
      finalSummary.finalRank = data.studentRank;
    } else {
      finalSummary.finalRank = '1/30'; // 기본값
    }
    
    // 최종 등급
    if (data.finalSummary && data.finalSummary.finalConvertedGrade !== undefined) {
      finalSummary.finalConvertedGrade = data.finalSummary.finalConvertedGrade;
    } else if (data.finalSummary && data.finalSummary.grade !== undefined) {
      finalSummary.finalConvertedGrade = data.finalSummary.grade;
    } else if (data.studentGrade !== undefined) {
      finalSummary.finalConvertedGrade = data.studentGrade;
    } else {
      finalSummary.finalConvertedGrade = 4.5; // 기본값
    }
    
    // radarChart 데이터 구성 - API에서 제공하는 경우 사용
    const radarChart = data.radarChart || {
      labels: processedSubjects.map(subject => subject.name),
      data: processedSubjects.map(subject => subject.totalScore / 3)
    };
    
    // 최종 데이터 구성
    const processedData = {
      subjects: processedSubjects,
      totals,
      finalSummary,
      radarChart
    };
    
    console.log('가공된 데이터:', processedData);
    return processedData;
  }, []);
  
  // 컴포넌트 마운트 시 성적 데이터 가져오기 - 모든 학년/학기 데이터 가져오기
  useEffect(() => {
    // 이미 데이터가 로드되었는지 확인
    if ((studentUrlId || (student && student.studentId)) && !dataLoaded.current) {
      console.log('ScoreTab 컴포넌트 마운트 시 초기 데이터 가져오기:', { studentUrlId, studentId: student?.studentId });
      
      // 초기 로드 플래그 설정
      dataLoaded.current = true;
      
      // 1학년 1학기로 값 설정
      setSelectedGrade('1');
      setSelectedSemester('1학기');
      
      // 비동기 함수 호출을 위해 setTimeout 사용
      setTimeout(() => {
        console.log('모든 학년/학기 데이터 가져오기');
        // 모든 학년/학기 데이터 가져오기
        fetchAllGradeData();
      }, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentUrlId, student]); // 의존성 수정
  
  // forceLoad prop이 변경될 때 데이터 다시 가져오기 (탭 클릭 시)
  // 이 useEffect는 탭이 처음 로드될 때만 실행되도록 수정
  useEffect(() => {
    // URL에서 가져온 ID가 있으면 그것을 사용, 없으면 student 객체의 studentId 필요
    if ((studentUrlId || (student && student.studentId)) && !dataLoaded.current) {
      console.log('ScoreTab 초기 로드 시 데이터 가져오기');
      
      // 초기 로드 플래그 설정
      dataLoaded.current = true;
      
      // 비동기 함수 호출을 위해 setTimeout 사용
      setTimeout(() => {
        console.log('성적 데이터 가져오기 시작...');
        fetchAvailableGradeData(true); // 초기 로드시에만 초기값 설정
      }, 0);
    }
  }, [studentUrlId, student, fetchAvailableGradeData]);
  
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

  // 학년/학기/과목 변경 핸들러 - 캐시된 데이터 사용
  const handleGradeChange = (e) => {
    const newGrade = e.target.value;
    console.log(`학년 변경: ${newGrade}`);
    setSelectedGrade(newGrade);
    // 학년 변경 시 과목 필터 초기화
    setSelectedSubject('all');
    
    // 캐시에서 데이터 가져오기
    const cacheKey = `${newGrade}-${selectedSemester.replace('학기', '')}`;
    if (cachedData.current[cacheKey]) {
      console.log(`캐시에서 ${cacheKey} 데이터 가져오기`);
      setGradeData(cachedData.current[cacheKey]);
      
      // 과목 목록 업데이트
      const subjectNames = cachedData.current[cacheKey].subjects.map(subject => subject.name);
      setAvailableSubjects(['all', ...subjectNames]);
    } else {
      console.log(`${cacheKey} 데이터가 캐시에 없음, API 호출 필요`);
      // 캐시에 없는 경우에만 API 호출
      setIsUserAction(true);
    }
  };
  
  const handleSemesterChange = (e) => {
    const newSemester = e.target.value;
    console.log(`학기 변경: ${newSemester}`);
    setSelectedSemester(newSemester);
    // 학기 변경 시 과목 필터 초기화
    setSelectedSubject('all');
    
    // 캐시에서 데이터 가져오기
    const semesterValue = newSemester.replace('학기', '');
    const cacheKey = `${selectedGrade}-${semesterValue}`;
    if (cachedData.current[cacheKey]) {
      console.log(`캐시에서 ${cacheKey} 데이터 가져오기`);
      setGradeData(cachedData.current[cacheKey]);
      
      // 과목 목록 업데이트
      const subjectNames = cachedData.current[cacheKey].subjects.map(subject => subject.name);
      setAvailableSubjects(['all', ...subjectNames]);
    } else {
      console.log(`${cacheKey} 데이터가 캐시에 없음, API 호출 필요`);
      // 캐시에 없는 경우에만 API 호출
      setIsUserAction(true);
    }
  };
  
  const handleSubjectChange = (e) => {
    const newSubject = e.target.value;
    console.log(`과목 변경: ${newSubject}`);
    setSelectedSubject(newSubject);
    // 과목 변경은 서버 호출이 필요없으로 플래그 설정 안함
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
