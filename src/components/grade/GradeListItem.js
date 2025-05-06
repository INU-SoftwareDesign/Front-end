import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getGradeInputPeriod } from '../../api/gradeApi';
import { getStudentGradeOverview } from '../../api/gradeApi';

const ListItemContainer = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 2fr 0.8fr 0.8fr 0.8fr 1.5fr;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  &:hover {
    background-color: #f9f9f9;
  }
`;

const SerialNumber = styled.div`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 20px;
  text-align: center;
`;

const NameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProfileImage = styled.div`
  width: 49px;
  height: 49px;
  border-radius: 50%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const NameInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Name = styled.div`
  font-family: 'Pretendard-SemiBold', sans-serif;
  font-size: 20px;
`;

const StudentId = styled.div`
  font-family: 'Pretendard-SemiBold', sans-serif;
  font-size: 13px;
  color: #B1B1B1;
`;

const InfoText = styled.div`
  font-family: 'Pretendard-SemiBold', sans-serif;
  font-size: 20px;
  text-align: center;
`;

const GradeStatusContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GradeStatus = styled.div`
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 16px;
  background-color: ${props => {
    switch(props.status) {
      case '미입력': return '#9e9e9e';
      case '임시저장': return '#7b1fa2';
      case '입력완료': return '#2e7d32';
      default: return '#9e9e9e';
    }
  }};
`;

const GradeListItem = ({ student, index }) => {
  const navigate = useNavigate();
  const [gradeInputPeriod, setGradeInputPeriod] = useState({ isActive: false });
  const [gradeStatus, setGradeStatus] = useState(student.gradeStatus || '미입력');

  // 학생의 성적 데이터 확인
  useEffect(() => {
    // 성적 입력 기간 정보 가져오기
    const fetchGradeInputPeriod = async () => {
      try {
        const periodData = await getGradeInputPeriod();
        setGradeInputPeriod(periodData);
      } catch (error) {
        console.error('Error fetching grade input period:', error);
      }
    };

    // 학생의 성적 데이터 확인
    const checkStudentGradeStatus = async () => {
      if (!student.id || !student.currentGrade || !student.currentSemester) return;
      
      try {
        // 현재 선택된 학년/학기에 대한 학생 성적 데이터 조회
        const gradeData = await getStudentGradeOverview(
          student.id,
          student.currentGrade,
          student.currentSemester
        );
        
        // 성적 데이터가 있으면 '입력완료'로 상태 변경
        if (gradeData && gradeData.subjects && gradeData.subjects.length > 0) {
          // 모든 과목에 점수가 입력되었는지 확인
          const allSubjectsComplete = gradeData.subjects.every(subject => 
            subject.midterm !== undefined && 
            subject.final !== undefined && 
            subject.performance !== undefined
          );
          
          if (allSubjectsComplete) {
            setGradeStatus('입력완료');
          } else {
            setGradeStatus('임시저장');
          }
        }
      } catch (error) {
        console.error('Error checking student grade status:', error);
        // API 호출 실패 시 기존 상태 유지
      }
    };

    fetchGradeInputPeriod();
    checkStudentGradeStatus();
  }, [student.id, student.currentGrade, student.currentSemester]);

  const handleClick = () => {
    // Only navigate if the grade input period is active
    if (gradeInputPeriod.isActive) {
      navigate(`/grades/edit/${student.id}`);
    } else {
      alert('성적 입력 기간이 아닙니다.');
    }
  };

  return (
    <ListItemContainer onClick={handleClick}>
      <SerialNumber>{index + 1}.</SerialNumber>
      <NameContainer>
        <ProfileImage src={student.profileImage} />
        <NameInfo>
          <Name>{student.name}</Name>
          <StudentId>{student.studentId}</StudentId>
        </NameInfo>
      </NameContainer>
      <InfoText>{student.grade}</InfoText>
      <InfoText>{student.classNumber}</InfoText>
      <InfoText>{student.number}</InfoText>
      <GradeStatusContainer>
        <GradeStatus status={gradeStatus}>
          {gradeStatus}
        </GradeStatus>
      </GradeStatusContainer>
    </ListItemContainer>
  );
};

export default GradeListItem;
