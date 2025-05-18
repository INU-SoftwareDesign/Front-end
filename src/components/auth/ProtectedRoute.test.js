import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import useUserStore from '../../stores/useUserStore';

jest.mock('../../stores/useUserStore');

test('인증된 유저일 경우 자식 컴포넌트를 렌더링함', () => {
  useUserStore.mockReturnValue({ isAuthenticated: true });

  render(
    <MemoryRouter>
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    </MemoryRouter>
  );

  expect(screen.getByText(/Protected Content/i)).toBeInTheDocument();
});

test('비인증 유저일 경우 로그인 페이지로 리다이렉트됨', () => {
  useUserStore.mockReturnValue({ isAuthenticated: false });

  render(
    <MemoryRouter initialEntries={['/']}>
      <ProtectedRoute>
        <div>Should not appear</div>
      </ProtectedRoute>
    </MemoryRouter>
  );

  expect(screen.queryByText(/Should not appear/)).toBeNull();
});
