import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';

test('Sidebar에 "학생 관리" 메뉴가 존재하는가', () => {
  render(<Sidebar />);
  expect(screen.getByText(/학생 관리/i)).toBeInTheDocument();
});

test('Sidebar에 "성적 관리" 메뉴가 존재하는가', () => {
  render(<Sidebar />);
  expect(screen.getByText(/성적 관리/i)).toBeInTheDocument();
});
