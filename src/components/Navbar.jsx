import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // 임시 알림 데이터
  const notifications = [
    { id: 1, text: '중간고사 성적이 등록되었습니다.', date: '2025.04.01' },
    { id: 2, text: '상담 신청이 승인되었습니다.', date: '2025.03.28' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>소설고등학교</span>
      </div>
      
      <div className="navbar-right">
        <div className="notification-container">
          <button 
            className="notification-button"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#606060"/>
            </svg>
          </button>
          {showNotifications && (
            <div className="notifications-dropdown">
              {notifications.map(notification => (
                <div key={notification.id} className="notification-item">
                  <span>{notification.text}</span>
                  <span className="notification-date">{notification.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="profile-container">
          <button 
            className="profile-button"
            onClick={() => setShowProfile(!showProfile)}
          >
            <img src="/profile-placeholder.png" alt="프로필" className="profile-image" />
            <span className="profile-name">고길동</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L4.5 7.5H13.5L9 12Z" fill="#606060"/>
            </svg>
          </button>
          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <img src="/profile-placeholder.png" alt="프로필" />
                <div>
                  <h3>고길동</h3>
                  <p>교사</p>
                </div>
              </div>
              <div className="profile-menu">
                <button>프로필 설정</button>
                <button>알림 설정</button>
              </div>
            </div>
          )}
        </div>

        <span className="role-badge">교사</span>

        <button className="logout-button">
          로그아웃
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 