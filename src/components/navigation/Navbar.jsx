import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaUser, FaCaretDown, FaSignOutAlt, FaCog, FaUserCircle } from 'react-icons/fa';
import { useUser } from '../../contexts/UserContext';
import logoImage from '../../assets/logo/soseol_logo.png';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 60px;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const Logo = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: 100%;
`;

const NavItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 0.5rem;
`;

const IconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  cursor: pointer;
  color: #555;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
    color: #1D4EB0;
  }
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
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Pretendard-Medium', sans-serif;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #333;
  font-family: 'Pretendard-Medium', sans-serif;
`;

const UserRole = styled.span`
  font-size: 0.875rem;
  color: #666;
  font-family: 'Pretendard-Regular', sans-serif;
  background-color: #f0f0f0;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
`;

const LogoutButton = styled.button`
  background-color: #1D4EB0;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-family: 'Pretendard-Medium', sans-serif;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #1A44A3;
  }
  
  svg {
    font-size: 14px;
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  z-index: 1000;
  margin-top: 0.75rem;
  display: ${props => props.isOpen ? 'block' : 'none'};
  overflow: hidden;
  font-family: 'Pretendard-Regular', sans-serif;
  border: 1px solid #f0f0f0;
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
  position: relative;
  
  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f5f5f5;
  }
  
  ${props => !props.isRead && `
    &::before {
      content: '';
      position: absolute;
      left: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #1D4EB0;
    }
  `}
`;

const NotificationTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
  font-family: 'Pretendard-Medium', sans-serif;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const NotificationTime = styled.div`
  font-size: 0.75rem;
  color: #888;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const NotificationContent = styled.div`
  font-size: 0.8rem;
  color: #666;
  font-family: 'Pretendard-Regular', sans-serif;
  margin-bottom: 0.25rem;
`;

const NotificationCategory = styled.span`
  font-size: 0.7rem;
  color: #fff;
  background-color: #1D4EB0;
  padding: 2px 6px;
  border-radius: 10px;
  font-family: 'Pretendard-Medium', sans-serif;
  margin-left: 0.5rem;
`;

const ProfileDropdown = styled(DropdownContainer)`
  min-width: 280px;
  padding: 0;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f9f9f9;
`;

const ProfileImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #e8f0fe;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1D4EB0;
  font-size: 1.5rem;
  font-family: 'Pretendard-Medium', sans-serif;
  border: 2px solid #d0e0ff;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-family: 'Pretendard-SemiBold', sans-serif;
  color: #333;
  font-size: 1rem;
`;

const ProfileDetail = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-family: 'Pretendard-Regular', sans-serif;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// Logout Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 24px;
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const ModalTitle = styled.h3`
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
`;

const ConfirmButton = styled(ModalButton)`
  background-color: #1D4EB0;
  color: white;
  border: none;
  
  &:hover {
    background-color: #1A44A3;
  }
`;

const CancelButton = styled(ModalButton)`
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  color: #666;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ProfileMenuItem = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: #333;
  font-family: 'Pretendard-Regular', sans-serif;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  svg {
    color: #666;
    font-size: 1rem;
  }
`;

const ProfileMenuDivider = styled.div`
  height: 1px;
  background-color: #f0f0f0;
  margin: 4px 0;
`;

// Navbar component that accepts user information as props
const Navbar = ({ userName, profileName, profileDetail, userRole }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useUser();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  
  // Use props or fallback to currentUser from context
  const displayName = userName || (currentUser ? currentUser.name : '사용자');
  const displayProfileName = profileName || (currentUser ? currentUser.name : '사용자');
  const displayProfileDetail = profileDetail || (currentUser ? currentUser.profileDetail : '');
  const displayUserRole = userRole || (currentUser ? currentUser.role : '');
  
  // Format role for display
  const formatRole = (role) => {
    if (!role) return '';
    
    switch(role) {
      case 'teacher': return '교사';
      case 'student': return '학생';
      case 'parent': return '학부모';
      default: return role;
    }
  };

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
  
  // Handle logout confirmation
  const handleLogout = () => {
    // Close the modal
    setIsLogoutModalOpen(false);
    // Call logout from context
    logout();
    // Redirect to login page
    navigate('/login');
  };

  // Dummy notification data
  const notifications = [
    { 
      id: 1, 
      title: '새로운 공지사항이 등록되었습니다.', 
      content: '2학기 기말고사 일정 공지',
      time: '5분 전',
      isRead: false,
      category: '공지'
    },
    { 
      id: 2, 
      title: '성적이 업데이트되었습니다.', 
      content: '국어, 수학 과목 성적 업데이트',
      time: '1시간 전',
      isRead: false,
      category: '성적'
    },
    { 
      id: 3, 
      title: '상담 일정이 잡혔습니다.', 
      content: '학생 상담 일정 - 4월 20일 14:00',
      time: '3시간 전',
      isRead: true,
      category: '상담'
    },
    { 
      id: 4, 
      title: '학부모 면담회 일정 안내', 
      content: '1학기 학부모 면담회 일정 안내',
      time: '1일 전',
      isRead: true,
      category: '학교'
    },
  ];

  return (
    <>
    <NavContainer>
      <Logo to="/">
        <LogoImage src={logoImage} alt="소설고등학교 로고" />
      </Logo>
      <NavItems>
        <NavItem ref={notificationRef}>
          <IconWrapper onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
            <FaBell />
            <NotificationBadge>2</NotificationBadge>
          </IconWrapper>
          <DropdownContainer isOpen={isNotificationsOpen}>
            <NotificationList>
              {notifications.map(notification => (
                <NotificationItem key={notification.id} isRead={notification.isRead}>
                  <NotificationTitle>
                    {notification.title}
                    <NotificationCategory>{notification.category}</NotificationCategory>
                  </NotificationTitle>
                  <NotificationContent>{notification.content}</NotificationContent>
                  <NotificationTime>{notification.time}</NotificationTime>
                </NotificationItem>
              ))}
            </NotificationList>
          </DropdownContainer>
        </NavItem>
        <NavItem ref={profileRef}>
          <ProfileSection onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <UserInfo>
              <FaUserCircle />
              <UserName>{displayName}</UserName>
              <FaCaretDown />
            </UserInfo>
          </ProfileSection>
          <ProfileDropdown isOpen={isProfileOpen}>
            <ProfileHeader>
              <ProfileImage>
                {displayProfileName ? displayProfileName.charAt(0) : 'U'}
              </ProfileImage>
              <ProfileInfo>
                <ProfileName>{displayProfileName}</ProfileName>
                <ProfileDetail>{displayProfileDetail}</ProfileDetail>
                {currentUser && currentUser.id && (
                  <ProfileDetail>ID: {currentUser.id}</ProfileDetail>
                )}
              </ProfileInfo>
            </ProfileHeader>
            
            <ProfileMenuItem>
              <FaUserCircle />
              내 프로필
            </ProfileMenuItem>
          </ProfileDropdown>
        </NavItem>
        <NavItem>
          <UserRole>{formatRole(displayUserRole)}</UserRole>
        </NavItem>
        <NavItem>
          <LogoutButton onClick={() => setIsLogoutModalOpen(true)}>
            <FaSignOutAlt />
            로그아웃
          </LogoutButton>
        </NavItem>
      </NavItems>
    </NavContainer>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>정말 로그아웃하시겠습니까?</ModalTitle>
            <ModalButtonGroup>
              <CancelButton onClick={() => setIsLogoutModalOpen(false)}>취소</CancelButton>
              <ConfirmButton onClick={handleLogout}>확인</ConfirmButton>
            </ModalButtonGroup>
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  );
};

export default Navbar; 