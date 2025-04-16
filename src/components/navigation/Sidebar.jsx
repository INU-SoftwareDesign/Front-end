import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaChartBar, FaComments, FaClipboardList, FaCog, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { useUser } from '../../contexts/UserContext';

const SidebarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 60px;
  height: calc(100vh - 60px);
  width: 240px;
  background-color: #1D4EB0;
  z-index: 900;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  font-family: 'Pretendard-Regular', sans-serif;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 1rem 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MenuItem = styled.li`
  margin: 0;
`;

const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  color: ${props => props.active ? '#1D4EB0' : 'white'};
  text-decoration: none;
  transition: all 0.2s ease;
  opacity: ${props => props.active ? 1 : 0.85};
  background-color: ${props => props.active ? '#ffffff' : 'transparent'};
  font-weight: ${props => props.active ? '600' : 'normal'};
  border-radius: ${props => props.active ? '0 24px 24px 0' : '0'};
  margin-right: ${props => props.active ? '1rem' : '0'};
  font-family: ${props => props.active ? "'Pretendard-SemiBold'" : "'Pretendard-Medium'"}, sans-serif;

  &:hover {
    background-color: ${props => props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.15)'};
    opacity: 1;
  }

  svg {
    color: ${props => props.active ? '#1D4EB0' : 'white'};
  }
`;

const IconWrapper = styled.span`
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  font-size: 1.2rem;
  transition: transform 0.2s ease;
  
  ${MenuLink}:hover & {
    transform: translateX(2px);
  }
`;

const SettingsButton = styled.button`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.8;
  width: 100%;
  text-align: left;
  font-size: 1rem;
  font-family: 'Pretendard-Medium', sans-serif;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
    opacity: 1;
  }
  
  svg {
    margin-right: 1rem;
  }
`;

const SidebarFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
`;



const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useUser();
  
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

  const menuItems = [
    { path: '/', icon: <FaHome />, label: '메인 페이지' },
    { path: '/students', icon: <FaUserGraduate />, label: '학생부' },
    { path: '/grades', icon: <FaChartBar />, label: '성적' },
    { path: '/counseling', icon: <FaComments />, label: '상담' },
    { path: '/feedback', icon: <FaClipboardList />, label: '피드백' },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = currentUser ? menuItems.filter(item => {
    // Example: Only show grades to teachers and students, not parents
    if (item.path === '/grades' && currentUser.role === 'parent') return false;
    return true;
  }) : menuItems;

  return (
    <SidebarContainer>
      <MenuList>
        {filteredMenuItems.map((item) => (
          <MenuItem key={item.path}>
            <MenuLink to={item.path} active={location.pathname === item.path ? 1 : 0}>
              <IconWrapper>
                {item.icon}
              </IconWrapper>
              {item.label}
            </MenuLink>
          </MenuItem>
        ))}
      </MenuList>
      <SidebarFooter>
        <SettingsButton>
          <FaCog />
          설정
        </SettingsButton>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;