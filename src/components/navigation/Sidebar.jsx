import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaChartBar, FaComments, FaClipboardList, FaCog } from 'react-icons/fa';

const SidebarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 60px;
  height: calc(100vh - 60px);
  width: 240px;
  background-color: #4557F1;
  z-index: 900;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 1rem 0;
  margin: 0;
`;

const MenuItem = styled.li`
  margin: 0;
`;

const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: ${props => props.active ? '#4557F1' : 'white'};
  text-decoration: none;
  transition: all 0.2s;
  opacity: ${props => props.active ? 1 : 0.8};
  background-color: ${props => props.active ? '#ffffff' : 'transparent'};
  font-weight: ${props => props.active ? '500' : 'normal'};

  &:hover {
    background-color: ${props => props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.1)'};
    opacity: 1;
  }

  svg {
    color: ${props => props.active ? '#4557F1' : 'white'};
  }
`;

const IconWrapper = styled.span`
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  font-size: 1.2rem;
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

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    opacity: 1;
  }
`;

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: <FaHome />, label: '메인 페이지' },
    { path: '/students', icon: <FaUserGraduate />, label: '학생부' },
    { path: '/grades', icon: <FaChartBar />, label: '성적' },
    { path: '/counseling', icon: <FaComments />, label: '상담' },
    { path: '/feedback', icon: <FaClipboardList />, label: '피드백' },
  ];

  return (
    <SidebarContainer>
      <MenuList>
        {menuItems.map((item) => (
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
      <SettingsButton>
        <IconWrapper>
          <FaCog />
        </IconWrapper>
        설정
      </SettingsButton>
    </SidebarContainer>
  );
};

export default Sidebar;