import { render, screen } from '@testing-library/react';
import GradeEditPage from './GradeEditPage';

test('성적 수정 페이지에 "성적 수정" 또는 저장 버튼이 표시되는가', () => {
  render(<GradeEditPage />);
  expect(screen.getByRole('button', { name: /저장/i })).toBeInTheDocument();
});
