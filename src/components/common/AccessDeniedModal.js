import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h3`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 18px;
  color: #e74c3c;
  margin-bottom: 16px;
  text-align: center;
`;

const ModalMessage = styled.p`
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 16px;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
  line-height: 1.5;
`;

const ModalButton = styled.button`
  background-color: #1D4EB0;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 16px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 16px;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #1A44A3;
  }
`;

const AccessDeniedModal = ({ message, onClose }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalTitle>접근 권한 없음</ModalTitle>
        <ModalMessage>{message}</ModalMessage>
        <ModalButton onClick={onClose}>확인</ModalButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AccessDeniedModal;
