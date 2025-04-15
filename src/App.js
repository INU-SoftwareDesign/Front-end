// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import MainPage from "./pages/main/MainPage";
import LoginPage from "./pages/login/LoginPage";
import StudentListPage from "./pages/students/StudentListPage";
import Navbar from "./components/navigation/Navbar";
import Sidebar from "./components/navigation/Sidebar";

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 240px;
  margin-top: 60px;
  padding: 2rem;
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
            <Route path="/students" element={<StudentListPage />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
