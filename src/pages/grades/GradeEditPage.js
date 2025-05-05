import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import dummyGradeData from "../../data/dummyGradeData";
import { initialSubjectData } from "../../data/dummySubjectData";
import { getGradeInputPeriod, getStudentGrades, submitStudentGrades } from "../../api/gradeApi";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const PageContainer = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  margin: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
`;

const LeftSection = styled.div`
  overflow-x: auto;
`;

const RightSection = styled.div`
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
`;

const SubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SemesterInfo = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const SemesterText = styled.div`
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 18px;
  color: #333;
  background-color: #f0f4ff;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #d0d9ff;
`;

const Title = styled.h1`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 24px;
  color: #333;
`;

const PeriodInfo = styled.div`
  padding: 8px 16px;
  background-color: ${(props) => (props.isActive ? "#e6f7e6" : "#ffe6e6")};
  border-radius: 6px;
  font-family: "Pretendard-Medium", sans-serif;
  color: ${(props) => (props.isActive ? "#2e7d32" : "#c62828")};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StudentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const ProfileImage = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StudentName = styled.div`
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 20px;
  margin-bottom: 4px;
`;

const StudentDetails = styled.div`
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 14px;
  color: #666;
`;

const ScoreTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 14px;
`;

const TableHead = styled.thead`
  background-color: #314a95;
  color: white;
`;

const TableBody = styled.tbody`
  & tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableFoot = styled.tfoot`
  background-color: #f0f4ff;
  font-weight: bold;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const TableCell = styled.td`
  padding: 8px 12px;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  min-width: 80px;
`;

const TableHeader = styled.th`
  padding: 8px 12px;
  text-align: center;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 14px;
`;

const Input = styled.input`
  width: 60px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 14px;

  &:focus {
    border-color: #0033a0;
    outline: none;
  }
`;

const SubjectInput = styled.input`
  width: 100px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 14px;

  &:focus {
    border-color: #0033a0;
    outline: none;
  }
`;

const ScoreButton = styled.button`
  padding: 4px 8px;
  border-radius: 4px;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => (props.isSet ? "#7b1fa2" : "#0033a0")};
  color: white;
  border: none;

  &:hover {
    opacity: 0.9;
  }
`;

const AddButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f0f4ff;
  color: #0033a0;
  border: 1px solid #0033a0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;

  &:hover {
    background-color: #d0d9ff;
  }
`;

const FinalGradeSummary = styled.div`
  margin-top: 24px;
  padding: 16px;
  background-color: #f5f9ff;
  border-radius: 8px;
  border: 1px solid #d0d9ff;
`;

const SummaryTitle = styled.h3`
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
`;

const SummaryContent = styled.div`
  display: flex;
  gap: 24px;
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SummaryLabel = styled.span`
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 14px;
  color: #555;
`;

const SummaryValue = styled.span`
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 16px;
  color: #0033a0;
  background-color: white;
  padding: 4px 12px;
  border-radius: 4px;
  border: 1px solid #d0d9ff;
`;

const StatusBadge = styled.div`
  padding: 6px 12px;
  border-radius: 20px;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 14px;
  color: white;
  background-color: ${(props) => {
    switch (props.status) {
      case "미입력":
        return "#555";
      case "임시저장":
        return "#8C52FF";
      case "입력완료":
        return "#28B463";
      default:
        return "#555";
    }
  }};
  display: inline-block;
  margin-left: 16px;
`;

// Modal components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 24px;
  width: 90%;
  max-width: 500px;
`;

const ModalTitle = styled.h3`
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
`;

const ModalContent = styled.div`
  margin-bottom: 24px;
`;

const RatioGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
`;

const RatioLabel = styled.label`
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 16px;
  color: #333;
  width: 100px;
`;

const RatioInput = styled.input`
  width: 60px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-family: "Pretendard-Regular", sans-serif;

  &:focus {
    border-color: #0033a0;
    outline: none;
  }
`;

const TotalRatio = styled.div`
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 16px;
  color: ${(props) => (props.isValid ? "#2e7d32" : "#c62828")};
  margin-top: 16px;
  text-align: right;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 6px;
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const SaveButton = styled(Button)`
  background-color: #7b1fa2;
  color: white;
  border: none;

  &:hover {
    background-color: #6a1b9a;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #2e7d32;
  color: white;
  border: none;

  &:hover {
    background-color: #1b5e20;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const PeriodWarning = styled.div`
  background-color: #ffe6e6;
  color: #c62828;
  padding: 16px;
  border-radius: 6px;
  font-family: "Pretendard-Medium", sans-serif;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GradeEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find student by ID
  const student = dummyGradeData.students.find(
    (student) => student.id === parseInt(id)
  );

  // State for grade input period
  const [gradeInputPeriod, setGradeInputPeriod] = useState({
    isActive: true,
    start: '2025-05-01',
    end: '2025-05-15'
  });

  // Initial state
  const [subjects, setSubjects] = useState([
    { ...initialSubjectData, id: 1 },
    { ...initialSubjectData, id: 2, name: "수학" },
    { ...initialSubjectData, id: 3, name: "영어" },
  ]);
  const [status, setStatus] = useState("미입력"); // 미입력, 임시저장, 입력완료
  const [semester, setSemester] = useState("1학기");
  const [showRatioModal, setShowRatioModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(null);
  const [tempRatios, setTempRatios] = useState({
    midterm: 40,
    final: 40,
    performance: 20,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch grade input period and student grades on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch grade input period
        const periodData = await getGradeInputPeriod();
        setGradeInputPeriod(periodData);
        
        // Fetch student grades if student exists
        if (student) {
          const gradeData = await getStudentGrades(
            id, 
            student.grade, 
            semester.replace('학기', '')
          );
          
          if (gradeData.subjects && gradeData.subjects.length > 0) {
            // Map API data to component state format
            const mappedSubjects = gradeData.subjects.map((subject, index) => ({
              id: index + 1,
              name: subject.subject,
              credits: subject.credits,
              midtermScore: subject.midterm,
              finalScore: subject.final,
              performanceScore: subject.performance,
              calculatedScore: subject.totalScore,
              ratios: {
                midterm: 40,
                final: 40,
                performance: 20
              }
            }));
            setSubjects(mappedSubjects);
            setStatus(gradeData.gradeStatus || '미입력');
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, student, semester]);

  // Calculate grade based on percentile
  const calculateGradeFromPercentile = (percentile) => {
    if (percentile <= 4) return "1";
    if (percentile <= 11) return "2";
    if (percentile <= 23) return "3";
    if (percentile <= 40) return "4";
    if (percentile <= 60) return "5";
    if (percentile <= 77) return "6";
    if (percentile <= 89) return "7";
    if (percentile <= 96) return "8";
    return "9";
  };

  // Calculate final grade (weighted average of all subject grades)
  const calculateFinalGrade = () => {
    let totalWeightedGrade = 0;
    let totalCredits = 0;
    
    subjects.forEach(subject => {
      if (subject.grade && subject.grade !== "-" && subject.credits) {
        totalWeightedGrade += Number(subject.grade) * Number(subject.credits);
        totalCredits += Number(subject.credits);
      }
    });
    
    if (totalCredits === 0) return "-";
    
    const avgGrade = (totalWeightedGrade / totalCredits).toFixed(2);
    return avgGrade;
  };
  
  // Calculate final rank
  const calculateFinalRank = () => {
    // This would typically be based on the student's position in the class
    // For now, we'll use a placeholder
    return "12/30";
  };

  // Calculate totals and averages
  const calculateTotals = () => {
    const totalCredits = subjects.reduce(
      (sum, subject) => sum + Number(subject.credits || 0),
      0
    );
    const totalMidterm = subjects.reduce(
      (sum, subject) => sum + Number(subject.midtermScore || 0),
      0
    );
    const totalFinal = subjects.reduce(
      (sum, subject) => sum + Number(subject.finalScore || 0),
      0
    );
    const totalPerformance = subjects.reduce(
      (sum, subject) => sum + Number(subject.performanceScore || 0),
      0
    );
    const totalCalculated = subjects.reduce(
      (sum, subject) => sum + Number(subject.calculatedScore || 0),
      0
    );

    const avgMidterm = totalCredits
      ? (totalMidterm / subjects.length).toFixed(2)
      : 0;
    const avgFinal = totalCredits
      ? (totalFinal / subjects.length).toFixed(2)
      : 0;
    const avgPerformance = totalCredits
      ? (totalPerformance / subjects.length).toFixed(2)
      : 0;
    const avgCalculated = totalCredits
      ? (totalCalculated / subjects.length).toFixed(2)
      : 0;

    return {
      totalCredits,
      totalMidterm,
      totalFinal,
      totalPerformance,
      totalCalculated,
      avgMidterm,
      avgFinal,
      avgPerformance,
      avgCalculated,
    };
  };

  // Calculate radar chart data
  const getChartData = () => {
    return {
      labels: subjects.map((subject) => subject.name),
      datasets: [
        {
          label: "환산점수",
          data: subjects.map((subject) => subject.calculatedScore),
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Handle input changes
  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;

    // Recalculate score if all required fields are filled
    if (
      field === "midtermScore" ||
      field === "finalScore" ||
      field === "performanceScore"
    ) {
      const subject = updatedSubjects[index];
      if (
        subject.midtermScore &&
        subject.finalScore &&
        subject.performanceScore &&
        subject.ratios
      ) {
        const calculatedScore = (
          (Number(subject.midtermScore) * subject.ratios.midterm) / 100 +
          (Number(subject.finalScore) * subject.ratios.final) / 100 +
          (Number(subject.performanceScore) * subject.ratios.performance) / 100
        ).toFixed(2);
        updatedSubjects[index].calculatedScore = calculatedScore;
        
        // Calculate rank and grade when score is calculated
        // For this example, we'll use a simplified approach
        // In a real application, this would be based on the student's position in the class
        const totalStudents = 30; // Assuming 30 students in the class
        const randomRank = Math.floor(Math.random() * totalStudents) + 1;
        updatedSubjects[index].rank = `${randomRank}/${totalStudents}`;
        
        // Calculate grade based on percentile
        const percentile = (randomRank / totalStudents) * 100;
        updatedSubjects[index].grade = calculateGradeFromPercentile(percentile);
      }
    }

    setSubjects(updatedSubjects);
    // Update status to at least 임시저장 if any changes are made
    if (status === "미입력") setStatus("임시저장");
  };

  // Open ratio modal
  const openRatioModal = (index) => {
    setCurrentSubjectIndex(index);
    setTempRatios({
      midterm: subjects[index].ratios?.midterm || 30,
      final: subjects[index].ratios?.final || 40,
      performance: subjects[index].ratios?.performance || 30,
    });
    setShowRatioModal(true);
  };

  // Save ratios
  const saveRatios = () => {
    // Check if ratios sum to 100
    const total =
      Number(tempRatios.midterm) +
      Number(tempRatios.final) +
      Number(tempRatios.performance);
    if (total !== 100) {
      alert("비율의 합이 100%가 되어야 합니다.");
      return;
    }

    const updatedSubjects = [...subjects];
    updatedSubjects[currentSubjectIndex].ratios = tempRatios;

    // Recalculate score
    const subject = updatedSubjects[currentSubjectIndex];
    if (
      subject.midtermScore &&
      subject.finalScore &&
      subject.performanceScore
    ) {
      const calculatedScore = (
        (Number(subject.midtermScore) * tempRatios.midterm) / 100 +
        (Number(subject.finalScore) * tempRatios.final) / 100 +
        (Number(subject.performanceScore) * tempRatios.performance) / 100
      ).toFixed(2);
      updatedSubjects[currentSubjectIndex].calculatedScore = calculatedScore;
      
      // Update rank and grade when ratio changes
      const totalStudents = 30; // Assuming 30 students in the class
      const randomRank = Math.floor(Math.random() * totalStudents) + 1;
      updatedSubjects[currentSubjectIndex].rank = `${randomRank}/${totalStudents}`;
      
      // Calculate grade based on percentile
      const percentile = (randomRank / totalStudents) * 100;
      updatedSubjects[currentSubjectIndex].grade = calculateGradeFromPercentile(percentile);
    }

    setSubjects(updatedSubjects);
    setShowRatioModal(false);
    // Update status to at least 임시저장 if any changes are made
    if (status === "미입력") setStatus("임시저장");
  };

  // Add new subject
  const addSubject = () => {
    const newId = Math.max(...subjects.map((s) => s.id)) + 1;
    const newSubject = {
      id: newId,
      name: "",
      credits: 0,
      midtermScore: 0,
      finalScore: 0,
      performanceScore: 0,
      calculatedScore: 0,
      rank: "-",
      grade: "-",
      ratios: {
        midterm: 30,
        final: 40,
        performance: 30,
      },
    };
    setSubjects([...subjects, newSubject]);
  };

  // Prepare grade data for API submission
  const prepareGradeData = (saveStatus) => {
    return {
      grade: student.grade,
      semester: semester.replace('학기', ''),
      gradeStatus: saveStatus,
      updatedAt: new Date().toISOString(),
      subjects: subjects.map(subject => ({
        subject: subject.name,
        credits: parseInt(subject.credits) || 0,
        midterm: parseInt(subject.midtermScore) || 0,
        final: parseInt(subject.finalScore) || 0,
        performance: parseInt(subject.performanceScore) || 0,
        totalScore: parseFloat(subject.calculatedScore) || 0
      }))
    };
  };

  // Handle save
  const handleSave = async () => {
    try {
      const gradeData = prepareGradeData("임시저장");
      await submitStudentGrades(id, gradeData);
      setStatus("임시저장");
      setShowSaveModal(true);
    } catch (error) {
      alert(error.message);
    }
  };
  
  // Close save modal and navigate back to grade management page
  const closeSaveModal = () => {
    setShowSaveModal(false);
    navigate('/grades');
  };

  // Handle submit
  const handleSubmit = () => {
    setShowConfirmModal(true);
  };

  // Confirm submission
  const confirmSubmission = async () => {
    try {
      const gradeData = prepareGradeData("입력완료");
      await submitStudentGrades(id, gradeData);
      setStatus("입력완료");
      setShowConfirmModal(false);
      alert("성적이 제출되었습니다.");
      navigate("/grades");
    } catch (error) {
      setShowConfirmModal(false);
      alert(error.message);
    }
  };

  // Calculate totals for display
  const totals = calculateTotals();

  if (!gradeInputPeriod.isActive) {
    return (
      <PageContainer>
        <PeriodWarning>
          성적 입력 기간이 아닙니다. ({gradeInputPeriod.start} ~{" "}
          {gradeInputPeriod.end})
        </PeriodWarning>
        <ButtonGroup>
          <CancelButton onClick={() => navigate("/grades")}>
            돌아가기
          </CancelButton>
        </ButtonGroup>
      </PageContainer>
    );
  }

  if (!student) {
    return (
      <PageContainer>
        <div>학생을 찾을 수 없습니다.</div>
        <ButtonGroup>
          <CancelButton onClick={() => navigate("/grades")}>
            돌아가기
          </CancelButton>
        </ButtonGroup>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>성적 입력/수정</Title>
        <StatusBadge status={status}>{status}</StatusBadge>
      </Header>

      <StudentInfo>
        <ProfileImage src={student.profileImage} />
        <InfoContainer>
          <StudentName>{student.name}</StudentName>
          <StudentDetails>
            {student.grade}학년 {student.class}반 {student.number}번 | 학번:{" "}
            {student.studentId}
          </StudentDetails>
        </InfoContainer>
      </StudentInfo>

      <SubHeader>
        <SemesterInfo>
          <SemesterText>{student.grade}학년</SemesterText>
          <SemesterText>{semester}</SemesterText>
        </SemesterInfo>
        <PeriodInfo isActive={gradeInputPeriod.isActive}>
          성적 입력 기간: {gradeInputPeriod.start} ~ {gradeInputPeriod.end}
        </PeriodInfo>
      </SubHeader>

      <ContentContainer>
        <LeftSection>
          <ScoreTable>
            <TableHead>
              <TableRow>
                <TableHeader>과목명</TableHeader>
                <TableHeader>단위수</TableHeader>
                <TableHeader>중간고사</TableHeader>
                <TableHeader>기말고사</TableHeader>
                <TableHeader>수행평가</TableHeader>
                <TableHeader>환산점수</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjects.map((subject, index) => (
                <TableRow key={subject.id}>
                  <TableCell>
                    <SubjectInput
                      type="text"
                      value={subject.name}
                      onChange={(e) =>
                        handleSubjectChange(index, "name", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={subject.credits}
                      onChange={(e) =>
                        handleSubjectChange(index, "credits", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={subject.midtermScore}
                      onChange={(e) =>
                        handleSubjectChange(
                          index,
                          "midtermScore",
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={subject.finalScore}
                      onChange={(e) =>
                        handleSubjectChange(index, "finalScore", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={subject.performanceScore}
                      onChange={(e) =>
                        handleSubjectChange(
                          index,
                          "performanceScore",
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {subject.calculatedScore || "-"}
                    <br />
                    <ScoreButton
                      isSet={subject.ratios}
                      onClick={() => openRatioModal(index)}
                    >
                      {subject.ratios ? "수정" : "설정"}
                    </ScoreButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFoot>
              <TableRow>
                <TableCell>총합</TableCell>
                <TableCell>{totals.totalCredits}</TableCell>
                <TableCell>{totals.totalMidterm}</TableCell>
                <TableCell>{totals.totalFinal}</TableCell>
                <TableCell>{totals.totalPerformance}</TableCell>
                <TableCell>{Number(totals.totalCalculated).toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>평균</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{totals.avgMidterm}</TableCell>
                <TableCell>{totals.avgFinal}</TableCell>
                <TableCell>{totals.avgPerformance}</TableCell>
                <TableCell>{totals.avgCalculated}</TableCell>
              </TableRow>
            </TableFoot>
          </ScoreTable>

          <AddButton onClick={addSubject}>+ 과목 추가</AddButton>
        </LeftSection>

        <RightSection>
          <div style={{ height: "300px", width: "100%" }}>
            <Radar
              data={getChartData()}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </RightSection>
      </ContentContainer>

      <ButtonGroup>
        <CancelButton onClick={() => navigate("/grades")}>취소</CancelButton>
        <SaveButton onClick={handleSave}>임시저장</SaveButton>
        <SubmitButton onClick={handleSubmit}>제출</SubmitButton>
      </ButtonGroup>

      {/* Ratio Modal */}
      {showRatioModal && (
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>환산점수 비율 설정</ModalTitle>
            <ModalContent>
              <RatioGroup>
                <RatioLabel>중간고사:</RatioLabel>
                <RatioInput
                  type="number"
                  min="0"
                  max="100"
                  value={tempRatios.midterm}
                  onChange={(e) =>
                    setTempRatios({ ...tempRatios, midterm: e.target.value })
                  }
                />
                <span>%</span>
              </RatioGroup>
              <RatioGroup>
                <RatioLabel>기말고사:</RatioLabel>
                <RatioInput
                  type="number"
                  min="0"
                  max="100"
                  value={tempRatios.final}
                  onChange={(e) =>
                    setTempRatios({ ...tempRatios, final: e.target.value })
                  }
                />
                <span>%</span>
              </RatioGroup>
              <RatioGroup>
                <RatioLabel>수행평가:</RatioLabel>
                <RatioInput
                  type="number"
                  min="0"
                  max="100"
                  value={tempRatios.performance}
                  onChange={(e) =>
                    setTempRatios({
                      ...tempRatios,
                      performance: e.target.value,
                    })
                  }
                />
                <span>%</span>
              </RatioGroup>
              <TotalRatio
                isValid={
                  Number(tempRatios.midterm) +
                    Number(tempRatios.final) +
                    Number(tempRatios.performance) ===
                  100
                }
              >
                합계:{" "}
                {Number(tempRatios.midterm) +
                  Number(tempRatios.final) +
                  Number(tempRatios.performance)}
                %
              </TotalRatio>
            </ModalContent>
            <ModalButtonGroup>
              <CancelButton onClick={() => setShowRatioModal(false)}>
                취소
              </CancelButton>
              <SubmitButton onClick={saveRatios}>확인</SubmitButton>
            </ModalButtonGroup>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>성적 제출 확인</ModalTitle>
            <ModalContent>
              정말 제출하시겠습니까? 제출 후에도 입력 기간 내에는 수정이 가능합니다.
            </ModalContent>
            <ModalButtonGroup>
              <CancelButton onClick={() => setShowConfirmModal(false)}>
                취소
              </CancelButton>
              <SubmitButton onClick={confirmSubmission}>확인</SubmitButton>
            </ModalButtonGroup>
          </ModalContainer>
        </ModalOverlay>
      )}
      
      {/* Save Modal */}
      {showSaveModal && (
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>임시저장 완료</ModalTitle>
            <ModalContent>
              성적이 임시저장 되었습니다.
            </ModalContent>
            <ModalButtonGroup>
              <SubmitButton onClick={closeSaveModal}>확인</SubmitButton>
            </ModalButtonGroup>
          </ModalContainer>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default GradeEditPage;
