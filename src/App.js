// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MainPage from "./pages/main/MainPage";
import LoginPage from "./pages/login/LoginPage";
import StudentListPage from "./pages/students/StudentListPage";

function App() {
  return (

    <Router>
      <div style={{ padding: "1rem", background: "#eee" }}>
        <Link to="/">메인</Link> | <Link to="/login">로그인</Link> |{" "}
        <Link to="/students">학생 목록</Link>
      </div>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/students" element={<StudentListPage />} />
      </Routes>
    </Router>

  );
}

export default App;
