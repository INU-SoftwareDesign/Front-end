// src/pages/login/RegisterPage.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { FaCheck, FaTimes, FaInfoCircle } from "react-icons/fa";
import { registerUser, checkUserIdAvailability } from "../../api/userApi";
import logoImage from "../../assets/logo/soseol_logo.png";

// 페이지 레이아웃 스타일
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #1D4EB0 50%, white 50%);
  overflow-y: auto;
`;

const LogoContainer = styled.div`
  padding: 20px;
  margin-left: 20px;
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 50px;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
  background-color: rgba(255, 255, 255, 0.15);
  padding: 8px 12px;
  border-radius: 8px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  margin-bottom: 80px;
`;

const RegisterCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  margin-bottom: 40px;
  /* Remove scroll from card */
  overflow-y: visible;
`;

const RegisterHeader = styled.h2`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
`;

const UserTypeContainer = styled.div`
  display: flex;
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
`;

const UserTypeButton = styled.button`
  flex: 1;
  padding: 12px 0;
  border: none;
  background-color: ${props => props.selected ? '#1D4EB0' : 'white'};
  color: ${props => props.selected ? 'white' : '#666'};
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.selected ? '#1D4EB0' : '#f5f5f5'};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

const FormLabel = styled.label`
  display: block;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const InputGroup = styled.div`
  position: relative;
  flex: ${props => props.flex || 1};
`;

const InputWithButton = styled.div`
  display: flex;
  gap: 8px;
`;

const CheckButton = styled.button`
  background-color: #1D4EB0;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 16px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    background-color: #1A44A3;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ValidationIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.valid ? '#2ecc71' : '#e74c3c'};
  display: ${props => props.show ? 'block' : 'none'};
`;

const HelpText = styled.p`
  font-size: 12px;
  color: ${props => props.error ? '#e74c3c' : '#666'};
  margin-top: 4px;
  margin-bottom: 0;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const ExampleText = styled.span`
  font-size: 12px;
  color: #888;
  margin-top: 4px;
  display: block;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  
  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
  
  label {
    font-family: 'Pretendard-Regular', sans-serif;
    font-size: 14px;
    color: #333;
    cursor: pointer;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid ${props => props.error ? '#e74c3c' : '#e0e0e0'};
  border-radius: 8px;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 16px;
  transition: border 0.2s ease;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#e74c3c' : '#1D4EB0'};
  }
`;

const MultiSelect = styled.div`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.div`
  background-color: #f0f5ff;
  border: 1px solid #d0e0ff;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  button {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    font-size: 12px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid ${props => props.error ? '#e74c3c' : '#e0e0e0'};
  border-radius: 8px;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 16px;
  transition: border 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#e74c3c' : '#1D4EB0'};
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 14px;
  margin-top: 6px;
  margin-bottom: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 30px;
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #1D4EB0;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #1A44A3;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const LoginLink = styled(Link)`
  display: block;
  text-align: center;
  color: #1D4EB0;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 14px;
  margin-top: 20px;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

function RegisterPage() {
  const navigate = useNavigate();
  
  // State for form fields - Common fields
  const [userType, setUserType] = useState('teacher'); // Default to teacher
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State for teacher-specific fields
  const [teacherId, setTeacherId] = useState('');
  const [isHomeroom, setIsHomeroom] = useState(false);
  const [gradeLevel, setGradeLevel] = useState('1');
  const [classNumber, setClassNumber] = useState('1');
  const [subjects, setSubjects] = useState([]);
  
  // State for student-specific fields
  const [studentId, setStudentId] = useState('');
  const [studentGrade, setStudentGrade] = useState('1');
  const [studentClass, setStudentClass] = useState('1');
  const [studentNumber, setStudentNumber] = useState('');
  
  // State for parent-specific fields
  const [relationship, setRelationship] = useState('father');
  const [childStudentId, setChildStudentId] = useState('');
  
  // State for validation and errors
  const [nameError, setNameError] = useState('');
  const [idError, setIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [teacherIdError, setTeacherIdError] = useState('');
  const [studentIdError, setStudentIdError] = useState('');
  const [studentNumberError, setStudentNumberError] = useState('');
  const [childStudentIdError, setChildStudentIdError] = useState('');
  const [registerError, setRegisterError] = useState('');
  
  // State for ID validation
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isIdAvailable, setIsIdAvailable] = useState(false);
  const [isIdCheckLoading, setIsIdCheckLoading] = useState(false);
  
  // State for form submission
  const [isLoading, setIsLoading] = useState(false);
  
  // Available subjects for teachers
  const availableSubjects = [
    '국어', '수학', '영어', '과학', '사회', '역사', '지리', '물리', '화학', 
    '생물', '지구과학', '음악', '미술', '체육', '기술가정', '정보', '제2외국어'
  ];
  
  // Handle user type selection
  const handleUserTypeChange = (type) => {
    setUserType(type);
    // Reset role-specific fields and errors
    resetRoleSpecificFields();
    // Clear any errors when changing user type
    setRegisterError('');
  };
  
  // Reset role-specific fields
  const resetRoleSpecificFields = () => {
    // Reset teacher fields
    setTeacherId('');
    setIsHomeroom(false);
    setGradeLevel('1');
    setClassNumber('1');
    setSubjects([]);
    setTeacherIdError('');
    
    // Reset student fields
    setStudentId('');
    setStudentGrade('1');
    setStudentClass('1');
    setStudentNumber('');
    setStudentIdError('');
    setStudentNumberError('');
    
    // Reset parent fields
    setRelationship('father');
    setChildStudentId('');
    setChildStudentIdError('');
  };
  
  // Handle ID duplication check
  const handleIdCheck = async () => {
    // Reset ID validation states
    setIsIdChecked(false);
    setIsIdAvailable(false);
    
    // Validate ID format
    if (!id.trim()) {
      setIdError('아이디를 입력해주세요.');
      return;
    }
    
    if (id.length < 4) {
      setIdError('아이디는 최소 4자 이상이어야 합니다.');
      return;
    }
    
    // Call API for ID check
    setIsIdCheckLoading(true);
    
    try {
      const isAvailable = await checkUserIdAvailability(id);
      
      setIsIdChecked(true);
      setIsIdAvailable(isAvailable);
      setIdError(isAvailable ? '' : '이미 사용 중인 아이디입니다.');
    } catch (error) {
      setIdError('아이디 중복 확인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsIdCheckLoading(false);
    }
  };
  
  // Handle subject selection
  const handleSubjectToggle = (subject) => {
    if (subjects.includes(subject)) {
      setSubjects(subjects.filter(item => item !== subject));
    } else {
      setSubjects([...subjects, subject]);
    }
  };
  
  // Remove a subject from the selected list
  const removeSubject = (subject) => {
    setSubjects(subjects.filter(item => item !== subject));
  };
  
  // Validate password strength
  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar
    ].filter(Boolean).length;
    
    // Return password strength (0-5)
    return {
      score: strength,
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar
    };
  };
  
  // Get password strength message
  const getPasswordStrengthMessage = () => {
    if (!password) return '';
    
    const { score } = validatePassword(password);
    
    if (score <= 2) return '약함';
    if (score <= 4) return '보통';
    return '강함';
  };
  
  // Get password strength color
  const getPasswordStrengthColor = () => {
    if (!password) return '#ccc';
    
    const { score } = validatePassword(password);
    
    if (score <= 2) return '#e74c3c';
    if (score <= 4) return '#f39c12';
    return '#2ecc71';
  };
  
  // Check if passwords match
  const doPasswordsMatch = () => {
    return password === confirmPassword && confirmPassword !== '';
  };
  
  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setNameError('');
    setIdError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setTeacherIdError('');
    setStudentIdError('');
    setStudentNumberError('');
    setChildStudentIdError('');
    setRegisterError('');
    
    // Validate name
    if (!name.trim()) {
      setNameError('이름을 입력해주세요.');
      isValid = false;
    }
    
    // Validate ID
    if (!id.trim()) {
      setIdError('아이디를 입력해주세요.');
      isValid = false;
    } else if (!isIdChecked) {
      setIdError('아이디 중복 확인을 해주세요.');
      isValid = false;
    } else if (!isIdAvailable) {
      setIdError('사용할 수 없는 아이디입니다.');
      isValid = false;
    }
    
    // Validate password
    if (!password.trim()) {
      setPasswordError('비밀번호를 입력해주세요.');
      isValid = false;
    } else {
      const { score, hasMinLength } = validatePassword(password);
      if (!hasMinLength) {
        setPasswordError('비밀번호는 8자 이상이어야 합니다.');
        isValid = false;
      } else if (score < 3) {
        setPasswordError('비밀번호가 너무 약합니다. 대문자, 소문자, 숫자, 특수문자를 포함해주세요.');
        isValid = false;
      }
    }
    
    // Validate confirm password
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('비밀번호 확인을 입력해주세요.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      isValid = false;
    }
    
    // Validate role-specific fields
    if (userType === 'teacher') {
      if (!teacherId.trim()) {
        setTeacherIdError('사번을 입력해주세요.');
        isValid = false;
      } else if (!/^T\d{4}-\d{3}$/.test(teacherId)) {
        setTeacherIdError('올바른 사번 형식이 아닙니다. (예: T2025-001)');
        isValid = false;
      }
    } else if (userType === 'student') {
      if (!studentNumber.trim()) {
        setStudentNumberError('번호를 입력해주세요.');
        isValid = false;
      } else if (!/^\d{1,2}$/.test(studentNumber) || parseInt(studentNumber) < 1 || parseInt(studentNumber) > 40) {
        setStudentNumberError('번호는 1~40 사이의 숫자여야 합니다.');
        isValid = false;
      }
      
      // Generate and validate student ID
      const generatedStudentId = `${studentGrade}${studentClass}${studentNumber.padStart(2, '0')}`;
      if (generatedStudentId.length !== 4) {
        setStudentIdError('학번 형식이 올바르지 않습니다.');
        isValid = false;
      }
    } else if (userType === 'parent') {
      if (!childStudentId.trim()) {
        setChildStudentIdError('자녀 학번을 입력해주세요.');
        isValid = false;
      } else if (!/^\d{8}$/.test(childStudentId)) {
        setChildStudentIdError('자녀 학번은 8자리 숫자여야 합니다. (예: 20251234)');
        isValid = false;
      }
    }
    
    return isValid;
  };
  
  // Handle register form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    // Prepare form data based on user type
    let formData = {
      role: userType,
      name,
      id,
      password,
      // Add common fields that are required in the API spec
      phone: '010-0000-0000', // This would be added to the form in a real implementation
      birth_date: '2000-01-01', // This would be added to the form in a real implementation
      address: '서울특별시' // This would be added to the form in a real implementation
    };
    
    // Add role-specific data
    if (userType === 'teacher') {
      formData = {
        ...formData,
        teacherCode: teacherId,
        grade: isHomeroom ? gradeLevel : '',
        class: isHomeroom ? classNumber : '',
        subjects: subjects
      };
    } else if (userType === 'student') {
      const fullStudentId = `2025${studentGrade}${studentClass}${studentNumber.padStart(2, '0')}`;
      formData = {
        ...formData,
        studentId: fullStudentId,
        grade: studentGrade,
        class: studentClass,
        number: studentNumber
      };
    } else if (userType === 'parent') {
      formData = {
        ...formData,
        relationship,
        childStudentId
      };
    }
    
    // Log register attempt
    console.log('회원가입 시도됨', formData);
    
    setIsLoading(true);
    setRegisterError('');
    
    try {
      // Call API to register user
      const response = await registerUser(formData);
      console.log('회원가입 성공:', response);
      
      // Show success message and redirect to login page
      alert('회원가입이 성공적으로 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      // Handle register error
      console.error('회원가입 실패:', error);
      setRegisterError(error.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <LogoContainer>
        <LogoImage src={logoImage} alt="소설고등학교 로고" />
      </LogoContainer>
      
      <RegisterContainer>
        <RegisterCard>
          <RegisterHeader>회원가입</RegisterHeader>
          
          {/* User Type Selection */}
          <UserTypeContainer>
            <UserTypeButton 
              selected={userType === 'teacher'}
              onClick={() => handleUserTypeChange('teacher')}
            >
              교사
            </UserTypeButton>
            <UserTypeButton 
              selected={userType === 'parent'}
              onClick={() => handleUserTypeChange('parent')}
            >
              학부모
            </UserTypeButton>
            <UserTypeButton 
              selected={userType === 'student'}
              onClick={() => handleUserTypeChange('student')}
            >
              학생
            </UserTypeButton>
          </UserTypeContainer>
          
          {/* Register Form */}
          <form onSubmit={handleRegister}>
            {/* Show register error if any */}
            {registerError && <ErrorMessage>{registerError}</ErrorMessage>}
            
            {/* Common Fields */}
            <FormGroup>
              <FormLabel>이름</FormLabel>
              <Input 
                type="text"
                placeholder="이름을 입력해주세요."
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!nameError}
              />
              {nameError && <ErrorMessage>{nameError}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <FormLabel>아이디</FormLabel>
              <InputWithButton>
                <Input 
                  type="text"
                  placeholder="아이디를 입력해주세요."
                  value={id}
                  onChange={(e) => {
                    setId(e.target.value);
                    setIsIdChecked(false);
                    setIsIdAvailable(false);
                  }}
                  error={!!idError}
                />
                <CheckButton 
                  type="button" 
                  onClick={handleIdCheck}
                  disabled={isIdCheckLoading}
                >
                  {isIdCheckLoading ? '확인 중...' : '중복 확인'}
                </CheckButton>
              </InputWithButton>
              {idError && <ErrorMessage>{idError}</ErrorMessage>}
              {isIdChecked && isIdAvailable && <HelpText>사용 가능한 아이디입니다.</HelpText>}
            </FormGroup>
            
            <FormGroup>
              <FormLabel>비밀번호</FormLabel>
              <InputGroup>
                <Input 
                  type="password"
                  placeholder="비밀번호를 입력해주세요."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!passwordError}
                />
                {password && (
                  <HelpText error={getPasswordStrengthColor() === '#e74c3c'}>
                    비밀번호 강도: <span style={{ color: getPasswordStrengthColor() }}>{getPasswordStrengthMessage()}</span>
                  </HelpText>
                )}
                {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
              </InputGroup>
            </FormGroup>
            
            <FormGroup>
              <FormLabel>비밀번호 확인</FormLabel>
              <InputGroup>
                <Input 
                  type="password"
                  placeholder="비밀번호를 다시 입력해주세요."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!confirmPasswordError}
                />
                {confirmPassword && (
                  <ValidationIcon show={true} valid={doPasswordsMatch()}>
                    {doPasswordsMatch() ? <FaCheck /> : <FaTimes />}
                  </ValidationIcon>
                )}
                {confirmPasswordError && <ErrorMessage>{confirmPasswordError}</ErrorMessage>}
              </InputGroup>
            </FormGroup>
            
            {/* Role-specific Fields */}
            {userType === 'teacher' && (
              <>
                <FormGroup>
                  <FormLabel>사번</FormLabel>
                  <Input 
                    type="text"
                    placeholder="사번을 입력해주세요."
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    error={!!teacherIdError}
                  />
                  <ExampleText>예: T2025-001</ExampleText>
                  {teacherIdError && <ErrorMessage>{teacherIdError}</ErrorMessage>}
                </FormGroup>
                
                <Checkbox>
                  <input 
                    type="checkbox" 
                    id="isHomeroom" 
                    checked={isHomeroom}
                    onChange={(e) => setIsHomeroom(e.target.checked)}
                  />
                  <label htmlFor="isHomeroom">담임 교사입니다.</label>
                </Checkbox>
                
                {isHomeroom && (
                  <FormRow>
                    <InputGroup>
                      <FormLabel>학년</FormLabel>
                      <Select 
                        value={gradeLevel}
                        onChange={(e) => setGradeLevel(e.target.value)}
                      >
                        <option value="1">1학년</option>
                        <option value="2">2학년</option>
                        <option value="3">3학년</option>
                      </Select>
                    </InputGroup>
                    
                    <InputGroup>
                      <FormLabel>반</FormLabel>
                      <Select 
                        value={classNumber}
                        onChange={(e) => setClassNumber(e.target.value)}
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num}반</option>
                        ))}
                      </Select>
                    </InputGroup>
                  </FormRow>
                )}
                
                <FormGroup>
                  <FormLabel>담당 과목 (중복 선택 가능)</FormLabel>
                  <Select 
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleSubjectToggle(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  >
                    <option value="">과목을 선택해주세요</option>
                    {availableSubjects
                      .filter(subject => !subjects.includes(subject))
                      .map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))
                    }
                  </Select>
                  
                  {subjects.length > 0 && (
                    <MultiSelect>
                      {subjects.map(subject => (
                        <Tag key={subject}>
                          {subject}
                          <button type="button" onClick={() => removeSubject(subject)}>
                            <FaTimes />
                          </button>
                        </Tag>
                      ))}
                    </MultiSelect>
                  )}
                </FormGroup>
              </>
            )}
            
            {userType === 'student' && (
              <>
                <FormRow>
                  <InputGroup>
                    <FormLabel>학년</FormLabel>
                    <Select 
                      value={studentGrade}
                      onChange={(e) => setStudentGrade(e.target.value)}
                    >
                      <option value="1">1학년</option>
                      <option value="2">2학년</option>
                      <option value="3">3학년</option>
                    </Select>
                  </InputGroup>
                  
                  <InputGroup>
                    <FormLabel>반</FormLabel>
                    <Select 
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}반</option>
                      ))}
                    </Select>
                  </InputGroup>
                  
                  <InputGroup>
                    <FormLabel>번호</FormLabel>
                    <Input 
                      type="text"
                      placeholder="번호를 입력해주세요."
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e.target.value)}
                      error={!!studentNumberError}
                    />
                    {studentNumberError && <ErrorMessage>{studentNumberError}</ErrorMessage>}
                  </InputGroup>
                </FormRow>
                
                <FormGroup>
                  <FormLabel>학번</FormLabel>
                  <Input 
                    type="text"
                    value={`2025${studentGrade}${studentClass}${studentNumber.padStart(2, '0')}`}
                    disabled
                  />
                  <ExampleText>학번은 학년, 반, 번호를 기반으로 자동 생성됩니다.</ExampleText>
                  {studentIdError && <ErrorMessage>{studentIdError}</ErrorMessage>}
                </FormGroup>
              </>
            )}
            
            {userType === 'parent' && (
              <>
                <FormGroup>
                  <FormLabel>학생과의 관계</FormLabel>
                  <Select 
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                  >
                    <option value="father">아버지</option>
                    <option value="mother">어머니</option>
                    <option value="guardian">보호자</option>
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>자녀 학번</FormLabel>
                  <Input 
                    type="text"
                    placeholder="자녀의 학번을 입력해주세요."
                    value={childStudentId}
                    onChange={(e) => setChildStudentId(e.target.value)}
                    error={!!childStudentIdError}
                  />
                  <ExampleText>예: 20251234 (8자리)</ExampleText>
                  {childStudentIdError && <ErrorMessage>{childStudentIdError}</ErrorMessage>}
                </FormGroup>
              </>
            )}
            
            {/* Register Button */}
            <ButtonContainer>
              <RegisterButton type="submit" disabled={isLoading}>
                {isLoading ? '처리 중...' : '회원가입'}
              </RegisterButton>
            </ButtonContainer>
            
            {/* Login Link */}
            <LoginLink to="/login">
              이미 계정이 있으신가요? 로그인하기
            </LoginLink>
          </form>
        </RegisterCard>
      </RegisterContainer>
    </PageContainer>
  );
}

export default RegisterPage;
