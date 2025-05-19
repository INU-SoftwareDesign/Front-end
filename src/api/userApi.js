import apiClient from './apiClient';

/**
 * User API functions for authentication and user management
 */

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Promise with registration response
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/users/register', userData);
    return response.data;
  } catch (error) {
    // Handle specific error cases
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.error || '회원가입에 실패했습니다.');
    }
    throw new Error('서버 연결에 문제가 발생했습니다. 나중에 다시 시도해주세요.');
  }
};

/**
 * Check if user ID is available
 * @param {string} userId - User ID to check
 * @returns {Promise<boolean>} - Promise with availability status
 */
export const checkUserIdAvailability = async (userId) => {
  try {
    const response = await apiClient.get(`/users/check-id/${userId}`);
    return response.data.available;
  } catch (error) {
    throw new Error('아이디 중복 확인에 실패했습니다.');
  }
};

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @returns {Promise} - Promise with login response including token
 */
export const loginUser = async (credentials) => {
  try {
    console.log('Attempting login with credentials:', credentials);
    const response = await apiClient.post('/auth/login', credentials);
    console.log('Login API response:', response.data);
    
    // Store tokens in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    if (response.data.refresh) {
      localStorage.setItem('refreshToken', response.data.refresh);
    }
    
    // Check if the response contains user data
    if (!response.data.data || !response.data.data.user) {
      console.error('Login response missing user data:', response.data);
      // If the API doesn't return user data, create a default structure
      // This ensures the Zustand store has the expected format
      return {
        success: true,
        data: {
          user: response.data.user || {
            id: credentials.id,
            name: response.data.name || '사용자',
            role: response.data.role || 'teacher',
            ...response.data
          }
        }
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error details:', error);
    if (error.response) {
      console.error('Login error response:', error.response.data);
    }
    
    if (error.response && error.response.status === 401) {
      throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
    throw new Error('로그인에 실패했습니다. 나중에 다시 시도해주세요. ' + (error.message || ''));
  }
};

/**
 * Logout user - call logout API and clear tokens
 * @returns {Promise} - Promise with logout response
 */
export const logoutUser = async () => {
  try {
    // Get refresh token from localStorage
    const refreshToken = localStorage.getItem('refreshToken');
    
    // Call logout API with refresh token
    const response = await apiClient.post('/auth/logout', {
      refresh: refreshToken
    });
    
    // Clear tokens from localStorage regardless of API response
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    return response.data;
  } catch (error) {
    // Still clear tokens even if API call fails
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    throw new Error('로그아웃 처리 중 오류가 발생했습니다.');
  }
};

/**
 * Get current user profile
 * @returns {Promise} - Promise with user profile data
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/users/profile');
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }
    throw new Error('사용자 정보를 가져오는데 실패했습니다.');
  }
};

/**
 * Update user profile
 * @param {Object} profileData - User profile data to update
 * @returns {Promise} - Promise with update response
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.patch('/users/profile', profileData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.error || '유효하지 않은 정보가 포함되어 있습니다.');
    } else if (error.response && error.response.status === 401) {
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }
    throw new Error('프로필 업데이트 중 오류가 발생했습니다.');
  }
};

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} - Promise with change password response
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await apiClient.post('/users/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.error || '현재 비밀번호가 일치하지 않습니다.');
    } else if (error.response && error.response.status === 401) {
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }
    throw new Error('비밀번호 변경 중 오류가 발생했습니다.');
  }
};
