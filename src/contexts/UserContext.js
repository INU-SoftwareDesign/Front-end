import React, { createContext, useState, useContext, useEffect } from 'react';

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

// Create the user context with default value for development
const UserContext = createContext();

// Sample user data for testing
export const dummyUsers = {
  teacher: {
    id: 'teacher123',
    name: '김선생',
    role: 'teacher',
    profileDetail: '2학년 3반 담임',
    subjects: ['국어', '문학'],
    isHomeroom: true,
    gradeLevel: '1',
    classNumber: '7'
  },
  student: {
    id: 'student456',
    name: '이학생',
    role: 'student',
    profileDetail: '1학년 7반 15번',
    grade: '1',
    class: '7',
    number: '15'
  },
  parent: {
    id: 'parent789',
    name: '박부모',
    role: 'parent',
    childName: '박자녀',
    childDetail: '3학년 5반 8번',
    relationship: 'father',
    profileDetail: '자녀: 박자녀 (3학년 5반 8번)'
  }
};

// Create a provider component
export const UserProvider = ({ children, mockUser = null }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Login function
  const login = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    // You could store user data in localStorage/sessionStorage here
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    // Clear stored user data
    localStorage.removeItem('user');
  };

  // Check if user is already logged in (from localStorage)
  const checkAuth = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const storedUser = localStorage.getItem('user');
      
      // If we have a stored user, use it
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      }
      
      // If we're in development and have a mockUser, use it
      if (isDev && mockUser) {
        setCurrentUser(mockUser);
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      }
      
      // If we're in development but no mockUser was provided, use a default dummy user
      if (isDev) {
        // Get user role from localStorage or default to 'teacher'
        const savedRole = localStorage.getItem('devUserRole') || 'teacher';
        const dummyUser = dummyUsers[savedRole];
        setCurrentUser(dummyUser);
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (err) {
      console.error('Error checking authentication:', err);
      setError('인증 확인 중 오류가 발생했습니다.');
      setIsLoading(false);
      return false;
    }
  };
  
  // Set development user role (for testing different user types)
  const setDevUserRole = (role) => {
    if (!isDev) return;
    if (!['teacher', 'student', 'parent'].includes(role)) {
      console.error('Invalid role. Must be one of: teacher, student, parent');
      return;
    }
    
    localStorage.setItem('devUserRole', role);
    const dummyUser = dummyUsers[role];
    setCurrentUser(dummyUser);
    setIsAuthenticated(true);
  };

  // Auto-check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      isLoading,
      error,
      login, 
      logout,
      checkAuth,
      setDevUserRole: isDev ? setDevUserRole : undefined
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a hook for using the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    // In development, provide a default context with dummy data instead of throwing an error
    if (isDev) {
      console.warn('useUser was called outside of a UserProvider. Using dummy teacher data for development.');
      const savedRole = localStorage.getItem('devUserRole') || 'teacher';
      return {
        currentUser: dummyUsers[savedRole],
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: () => console.log('Mock login called'),
        logout: () => console.log('Mock logout called'),
        checkAuth: () => true,
        setDevUserRole: (role) => {
          if (!['teacher', 'student', 'parent'].includes(role)) {
            console.error('Invalid role. Must be one of: teacher, student, parent');
            return;
          }
          localStorage.setItem('devUserRole', role);
        }
      };
    }
    
    // In production, still throw the error
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Export a component for development user switching
export const DevUserSwitcher = () => {
  const { setDevUserRole, currentUser } = useUser();
  
  if (!isDev || !setDevUserRole) return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: '#f0f0f0',
      padding: '10px',
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      zIndex: 9999
    }}>
      <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
        개발 모드: {currentUser?.role} ({currentUser?.name})
      </div>
      <div style={{ display: 'flex', gap: '5px' }}>
        <button 
          onClick={() => setDevUserRole('teacher')}
          style={{ 
            padding: '5px 10px', 
            backgroundColor: currentUser?.role === 'teacher' ? '#1D4EB0' : '#ddd',
            color: currentUser?.role === 'teacher' ? 'white' : 'black',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          교사
        </button>
        <button 
          onClick={() => setDevUserRole('student')}
          style={{ 
            padding: '5px 10px', 
            backgroundColor: currentUser?.role === 'student' ? '#1D4EB0' : '#ddd',
            color: currentUser?.role === 'student' ? 'white' : 'black',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          학생
        </button>
        <button 
          onClick={() => setDevUserRole('parent')}
          style={{ 
            padding: '5px 10px', 
            backgroundColor: currentUser?.role === 'parent' ? '#1D4EB0' : '#ddd',
            color: currentUser?.role === 'parent' ? 'white' : 'black',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          학부모
        </button>
      </div>
    </div>
  );
};
