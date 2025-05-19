import { render, screen } from '@testing-library/react';
import LoginPage from './LoginPage';

test('로그인 페이지에 이메일, 비밀번호 입력창과 로그인 버튼이 있는가', () => {
  render(<LoginPage />);
  expect(screen.getByPlaceholderText(/이메일/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/비밀번호/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /로그인/i })).toBeInTheDocument();
});
