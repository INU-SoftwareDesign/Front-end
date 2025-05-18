import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';

test('Navbar에 사용자 이름이 표시되는가', () => {
  render(<Navbar userName="홍길동" profileName="홍길동" userRole="학생" />);
  expect(screen.getByText(/홍길동/)).toBeInTheDocument();
});

test('Navbar에 로그아웃 버튼이 존재하는가', () => {
  render(<Navbar userName="홍길동" profileName="홍길동" userRole="학생" />);
  expect(screen.getByRole('button', { name: /로그아웃/i })).toBeInTheDocument();
});
