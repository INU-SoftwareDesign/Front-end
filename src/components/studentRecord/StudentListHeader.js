import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 2fr 0.8fr 0.8fr 0.8fr 1.5fr;
  align-items: center;
  background-color: #314A95;
  color: white;
  padding: 16px;
  margin-bottom: 16px;
`;

const HeaderItem = styled.div`
  text-align: center;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 18px;
`;

const StudentListHeader = () => {
  return (
    <HeaderContainer>
      <HeaderItem>Serial</HeaderItem>
      <HeaderItem>Name</HeaderItem>
      <HeaderItem>Grade</HeaderItem>
      <HeaderItem>Class</HeaderItem>
      <HeaderItem>No.</HeaderItem>
      <HeaderItem>최근 상담일자</HeaderItem>
    </HeaderContainer>
  );
};

export default StudentListHeader;