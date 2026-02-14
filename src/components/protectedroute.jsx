import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false, memberOnly = false }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Parse user data
  const userData = JSON.parse(user);
  const isAdmin = userData.role === 'admin' || userData.role === 'Admin';

  // Admin-only route check
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Member-only route check (only member can access, not admin)
  if (memberOnly && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // For routes that are neither adminOnly nor memberOnly, allow both
  return children;
};

export default ProtectedRoute;