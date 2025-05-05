import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";

import Navbar from "./components/navigation/Navbar";
import Sidebar from "./components/navigation/Sidebar";

import MainPage from "./pages/main/MainPage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/login/RegisterPage";
import StudentRecordPage from "./pages/studentsRecord/StudentRecordPage";
import StudentDetailPage from "./pages/students/StudentDetailPage";
import GradeManagementPage from "./pages/grades/GradeManagementPage";
import GradeEditPage from "./pages/grades/GradeEditPage";
import CounselingPage from "./pages/counseling/CounselingPage";
import StudentCounselingPage from "./pages/counseling/StudentCounselingPage";

// Import Zustand store
import useUserStore from "./stores/useUserStore";

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 240px;
  margin-top: 60px;
  background-color: #f5f5f5;
`;

const FullContent = styled.main`
  width: 100%;
  height: 100vh;
`;

const AppLayout = ({ children }) => {
  const location = useLocation();
  const currentUser = useUserStore(state => state.currentUser);
  const isAuthenticated = useUserStore(state => state.isAuthenticated);
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  // 로그인, 회원가입 페이지일 경우
  if (isAuthPage) {
    return <FullContent>{children}</FullContent>;
  }

  // 일반 페이지일 경우 (Navbar + Sidebar 포함)
  return (
    <AppContainer>
      <Navbar 
        userName={currentUser?.name}
        profileName={currentUser?.name}
        profileDetail={currentUser?.profileDetail}
        userRole={currentUser?.role}
      />
      <Sidebar />
      <MainContent>{children}</MainContent>
    </AppContainer>
  );
};

function App() {
  // Check if user is already logged in from localStorage
  const checkAuth = useUserStore(state => state.checkAuth);
  
  useEffect(() => {
    // Try to restore user session from localStorage
    checkAuth();
  }, [checkAuth]);
  
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/students" element={<StudentRecordPage />} />
          <Route path="/student/:id" element={<StudentDetailPage />} />
          <Route path="/grades" element={<GradeManagementPage />} />
          <Route path="/grades/edit/:id" element={<GradeEditPage />} />
          <Route path="/counseling" element={<CounselingPage />} />
          <Route path="/student-counseling" element={<StudentCounselingPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
