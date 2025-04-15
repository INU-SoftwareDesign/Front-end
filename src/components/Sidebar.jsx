import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', text: '메인 페이지', icon: '📋' },
    { path: '/students', text: '학생부', icon: '👥' },
    { path: '/grades', text: '성적', icon: '📊' },
    { path: '/counseling', text: '상담', icon: '💬' },
    { path: '/feedback', text: '피드백', icon: '✍️' }
  ];

  return (
    <div className="sidebar">
      {menuItems.map((item) => (
        <div
          key={item.path}
          className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className="icon">{item.icon}</span>
          <span className="text">{item.text}</span>
        </div>
      ))}
      <div className="settings-button">
        <span className="icon">⚙️</span>
      </div>
    </div>
  );
};

export default Sidebar;
