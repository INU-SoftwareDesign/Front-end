import { render, screen } from '@testing-library/react';
import CounselingPage from './CounselingPage';

test('상담 목록 페이지에 "상담" 또는 상담 항목이 표시되는가', () => {
  render(<CounselingPage />);
  expect(screen.getByText(/상담/i)).toBeInTheDocument();
});
