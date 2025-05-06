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
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Only redirect to login if it's not a logout request
      if (!isLogoutRequest) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
