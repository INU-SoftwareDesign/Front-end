import React from 'react';
import { Navigate } from 'react-router-dom';
import useUserStore from '../../stores/useUserStore';

/**
 * AuthRoute component to handle authentication-based routing for auth pages
 * Redirects authenticated users to the main page
 */
const AuthRoute = ({ children }) => {
  const isAuthenticated = useUserStore(state => state.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default AuthRoute;
