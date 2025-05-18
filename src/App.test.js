import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import useUserStore from './stores/useUserStore';

// useUserStore mock 설정
jest.mock('./stores/useUserStore');

test('루트 경로에서 "학생관리 시스템" 텍스트가 보이는가', () => {
  // 로그인 상태라고 가정하여 ProtectedRoute가 MainPage 렌더링하게 함
  useUserStore.mockReturnValue({
    isAuthenticated: true,
    currentUser: { name: '홍길동', profileDetail: '', role: '학생' },
    checkAuth: jest.fn(),
  });

  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText(/학생관리 시스템/i)).toBeInTheDocument();
});
