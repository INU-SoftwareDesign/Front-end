import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthRoute from './AuthRoute';
import useUserStore from '../../stores/useUserStore';

jest.mock('../../stores/useUserStore');

test('비로그인 상태일 경우 자식 컴포넌트가 렌더링됨', () => {
  useUserStore.mockReturnValue({ isAuthenticated: false });

  render(
    <MemoryRouter>
      <AuthRoute>
        <div>Auth Content</div>
      </AuthRoute>
    </MemoryRouter>
  );

  expect(screen.getByText(/Auth Content/i)).toBeInTheDocument();
});

test('로그인 상태일 경우 메인 페이지로 리다이렉트됨', () => {
  useUserStore.mockReturnValue({ isAuthenticated: true });

  render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthRoute>
        <div>Should not show</div>
      </AuthRoute>
    </MemoryRouter>
  );

  expect(screen.queryByText(/Should not show/)).toBeNull();
});
