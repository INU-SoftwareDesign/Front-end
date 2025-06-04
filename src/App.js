import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";

// Import Auth Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthRoute from "./components/auth/AuthRoute";

// Import UserProvider
import { UserProvider } from "./contexts/UserContext";

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
    <UserProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
            <Route path="/" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute><StudentRecordPage /></ProtectedRoute>} />
            <Route path="/student/:id" element={<ProtectedRoute><StudentDetailPage /></ProtectedRoute>} />
            <Route path="/grades" element={<ProtectedRoute><GradeManagementPage /></ProtectedRoute>} />
            <Route path="/grades/edit/:id" element={<ProtectedRoute><GradeEditPage /></ProtectedRoute>} />
            <Route path="/counseling" element={<ProtectedRoute><CounselingPage /></ProtectedRoute>} />
            <Route path="/student-counseling" element={<ProtectedRoute><StudentCounselingPage /></ProtectedRoute>} />
          </Routes>
        </AppLayout>
      </Router>
    </UserProvider>
  );
}

export default App;
