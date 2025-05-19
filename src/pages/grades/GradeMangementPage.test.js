import { render, screen } from '@testing-library/react';
import GradeManagementPage from './GradeManagementPage';

test('성적 관리 페이지에 "성적 관리" 제목이 표시되는가', () => {
  render(<GradeManagementPage />);
  expect(screen.getByText(/성적 관리/i)).toBeInTheDocument();
});
