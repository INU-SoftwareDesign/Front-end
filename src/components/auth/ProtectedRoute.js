import React from 'react';
import { Navigate } from 'react-router-dom';
import useUserStore from '../../stores/useUserStore';

/**
 * ProtectedRoute component to handle authentication-based routing
 * Redirects unauthenticated users to the login page
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useUserStore(state => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
