import { render, screen } from '@testing-library/react';
import StudentRecordPage from './StudentRecordPage';

test('학생 목록 페이지에 "학생 목록" 또는 테이블이 표시되는가', () => {
  render(<StudentRecordPage />);
  expect(screen.getByText(/학생 목록/i)).toBeInTheDocument();
});
test('학생 목록 페이지에 "학생 필터" 또는 필터 바가 표시되는가', () => {
  render(<StudentRecordPage />);
  expect(screen.getByText(/학생 필터/i)).toBeInTheDocument();
});