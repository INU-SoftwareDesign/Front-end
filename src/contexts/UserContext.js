import React, { createContext, useState, useContext } from 'react';

// Create the user context
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
    gradeLevel: '2',
    classNumber: '3'
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
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      login, 
      logout,
      checkAuth
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a hook for using the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
