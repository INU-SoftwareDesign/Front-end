import { render, screen } from '@testing-library/react';
import StudentCounselingPage from './StudentCounselingPage';

test('학생 상담 페이지에 "학생 상담" 제목 또는 상담 내역이 보이는가', () => {
  render(<StudentCounselingPage />);
  expect(screen.getByText(/학생 상담/i)).toBeInTheDocument();
});
