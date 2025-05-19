import { render, screen } from '@testing-library/react';
import RegisterPage from './RegisterPage';

test('회원가입 페이지에 이름, 이메일, 비밀번호 입력창과 가입 버튼이 있는가', () => {
  render(<RegisterPage />);
  expect(screen.getByPlaceholderText(/이름/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/이메일/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/비밀번호/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /가입/i })).toBeInTheDocument();
});
