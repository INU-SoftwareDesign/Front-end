import { render, screen } from '@testing-library/react';
import StudentDetailPage from './StudentDetailPage';

test('학생 상세 페이지에 "학생 정보" 텍스트가 표시되는가', () => {
  render(<StudentDetailPage />);
  expect(screen.getByText(/학생 정보/i)).toBeInTheDocument();
});
