// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";

import Navbar from "./components/navigation/Navbar";
import Sidebar from "./components/navigation/Sidebar";
import MainPage from "./pages/main/MainPage";
import LoginPage from "./pages/login/LoginPage";
import StudentRecordPage from "./pages/studentsRecord/StudentRecordPage";
import StudentDetailPage from "./pages/students/StudentDetailPage";

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 240px; /* Sidebar 너비 */
  margin-top: 60px; /* Navbar 높이 */
  background-color: #f5f5f5;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Navbar />
        <Sidebar />
        <MainContent>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/students" element={<StudentRecordPage />} />
            <Route path="/student/:id" element={<StudentDetailPage />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
