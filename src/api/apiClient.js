import axios from 'axios';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include authentication token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Check if this is a logout request
      const isLogoutRequest = error.config && 
                             error.config.url && 
                             error.config.url.includes('/auth/logout');
      
      // 로그인 요청인 경우에는 리다이렉트하지 않음
      const isLoginRequest = error.config && 
                            error.config.url && 
                            error.config.url.includes('/auth/login');
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // 로그인 요청이 아니고 로그아웃 요청도 아닌 경우에만 리다이렉트
      if (!isLogoutRequest && !isLoginRequest) {
        // 무한 리다이렉트 방지를 위한 플래그 설정
        const redirectFlag = localStorage.getItem('auth_redirect');
        if (!redirectFlag) {
          localStorage.setItem('auth_redirect', 'true');
          localStorage.removeItem('user');
          window.location.href = '/login';
          
          // 5초 후에 플래그 제거 (다음 요청을 위해)
          setTimeout(() => {
            localStorage.removeItem('auth_redirect');
          }, 5000);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
