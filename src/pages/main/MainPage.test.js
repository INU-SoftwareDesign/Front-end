import { render, screen } from '@testing-library/react';
import MainPage from './MainPage';

test('메인 페이지에 "학생관리 시스템" 제목이 표시되는가', () => {
  render(<MainPage />);
  const heading = screen.getByText(/학생관리 시스템/i);
  expect(heading).toBeInTheDocument();
});
