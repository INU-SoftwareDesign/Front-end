import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaBell, FaUser, FaCaretDown } from 'react-icons/fa';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 60px;
`;

const Logo = styled(Link)`
  font-size: 1.25rem;
  font-weight: bold;
  color: #000;
  text-decoration: none;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
  color: #666;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4444;
  color: white;
  border-radius: 50%;
  padding: 0.25rem;
  font-size: 0.75rem;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #333;
`;

const UserRole = styled.span`
  color: #666;
`;

const LogoutButton = styled.button`
  background-color: #4557F1;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #3445E0;
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  z-index: 1000;
  margin-top: 0.5rem;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f5f5f5;
  }
`;

const NotificationTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const NotificationTime = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const ProfileDropdown = styled(DropdownContainer)`
  min-width: 250px;
  padding: 1rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const ProfileImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.875rem;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const ProfileDetail = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
`;

const Navbar = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: '새로운 공지사항이 등록되었습니다.', time: '5분 전' },
    { id: 2, title: '신규 상담 내역이 있습습니다.', time: '1시간 전' },
  ];

  return (
    <NavContainer>
      <Logo to="/">소설고등학교</Logo>
      <NavItems>
        <NavItem ref={notificationRef}>
          <IconWrapper onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
            <FaBell />
            <NotificationBadge>2</NotificationBadge>
          </IconWrapper>
          <DropdownContainer isOpen={isNotificationsOpen}>
            <NotificationList>
              {notifications.map(notification => (
                <NotificationItem key={notification.id}>
                  <NotificationTitle>{notification.title}</NotificationTitle>
                  <NotificationTime>{notification.time}</NotificationTime>
                </NotificationItem>
              ))}
            </NotificationList>
          </DropdownContainer>
        </NavItem>
        <NavItem ref={profileRef}>
          <ProfileSection onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <UserInfo>
              <FaUser />
              <UserName>고길동</UserName>
              <FaCaretDown />
            </UserInfo>
          </ProfileSection>
          <ProfileDropdown isOpen={isProfileOpen}>
            <ProfileHeader>
              <ProfileImage>No Image</ProfileImage>
              <ProfileInfo>
                <ProfileName>고길동</ProfileName>
                <ProfileDetail>2학년 3반 담임</ProfileDetail>
                <ProfileDetail>ID: teacher123</ProfileDetail>
              </ProfileInfo>
            </ProfileHeader>
          </ProfileDropdown>
        </NavItem>
        <NavItem>
          <UserRole>교사</UserRole>
        </NavItem>
        <NavItem>
          <LogoutButton>로그아웃</LogoutButton>
        </NavItem>
      </NavItems>
    </NavContainer>
  );
};

export default Navbar; 