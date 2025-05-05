// src/pages/login/LoginPage.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../stores/useUserStore";
import logoImage from "../../assets/logo/soseol_logo.png";

// 페이지 레이아웃 스타일
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #1D4EB0 50%, white 50%);
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

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  margin-bottom: 80px; /* 로그인 카드 위치 조정 */
`;

const LoginCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 40px;
  width: 100%;
  max-width: 450px;
`;

const LoginHeader = styled.h2`
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

const LoginButton = styled.button`
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

const RegisterButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: transparent;
  color: #1D4EB0;
  border: 1px solid #1D4EB0;
  border-radius: 8px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(29, 78, 176, 0.05);
  }
`;

const ForgotPasswordLink = styled.a`
  display: block;
  text-align: center;
  color: #666;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 14px;
  margin-top: 20px;
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    color: #1D4EB0;
    text-decoration: underline;
  }
`;

// API login function
const apiLogin = async (id, password) => {
  try {
    // Prepare login credentials
    const credentials = {
      id,
      password
    };
    
    // Call login API
    const response = await loginUser(credentials);
    
    // Extract user data and tokens from response
    return {
      success: true,
      userData: response.user,
      token: response.token,
      refreshToken: response.refresh
    };
  } catch (error) {
    throw error;
  }
};

function LoginPage() {
  const navigate = useNavigate();
  const loginWithCredentials = useUserStore(state => state.loginWithCredentials);
  const isAuthenticated = useUserStore(state => state.isAuthenticated);
  
  // State for form fields
  const [userType, setUserType] = useState('teacher'); // Default to teacher
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  
  // State for validation and errors
  const [idError, setIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Handle user type selection
  const handleUserTypeChange = (type) => {
    setUserType(type);
    // Clear any errors when changing user type
    setLoginError('');
  };
  
  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setIdError('');
    setPasswordError('');
    setLoginError('');
    
    // Validate ID
    if (!id.trim()) {
      setIdError('아이디를 입력해주세요.');
      isValid = false;
    }
    
    // Validate password
    if (!password.trim()) {
      setPasswordError('비밀번호를 입력해주세요.');
      isValid = false;
    }
    
    return isValid;
  };
  
  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    // Log login attempt
    console.log('로그인 시도됨', { id, password });
    
    setIsLoading(true);
    
    try {
      // Call loginWithCredentials from Zustand store
      const result = await loginWithCredentials(id, password);
      
      if (result.success) {
        // Handle successful login
        console.log('로그인 성공');
        
        // Redirect to main page (or dashboard)
        navigate('/');
      } else {
        // Handle login error
        setLoginError(result.message || '로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('로그인 실패:', error);
      setLoginError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <LogoContainer>
        <LogoImage src={logoImage} alt="소설고등학교 로고" />
      </LogoContainer>
      
      <LoginContainer>
        <LoginCard>
          <LoginHeader>로그인</LoginHeader>
          
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
          
          {/* Login Form */}
          <form onSubmit={handleLogin}>
            {/* Show login error if any */}
            {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
            
            {/* ID Field */}
            <FormGroup>
              <Input 
                type="text"
                placeholder="아이디를 입력해주세요."
                value={id}
                onChange={(e) => setId(e.target.value)}
                error={!!idError}
              />
              {idError && <ErrorMessage>{idError}</ErrorMessage>}
            </FormGroup>
            
            {/* Password Field */}
            <FormGroup>
              <Input 
                type="password"
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
              />
              {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
            </FormGroup>
            
            {/* Buttons */}
            <ButtonContainer>
              <LoginButton type="submit" disabled={isLoading}>
                {isLoading ? '로그인 중...' : '로그인'}
              </LoginButton>
              <RegisterButton type="button" onClick={() => navigate('/register')}>
                회원가입
              </RegisterButton>
            </ButtonContainer>
            
            {/* Forgot Password Link */}
            <ForgotPasswordLink href="#">
              비밀번호를 잊으셨나요?
            </ForgotPasswordLink>
          </form>
        </LoginCard>
      </LoginContainer>
    </PageContainer>
  );
}

export default LoginPage;
