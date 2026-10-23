import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Prevent redirect while restoring session on page reload!
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user's role is not allowed, redirect to their role home
    if (user.role === 'admin') return <Navigate to="/dashboard/admin-home" replace />;
    if (user.role === 'creator') return <Navigate to="/dashboard/creator-home" replace />;
    return <Navigate to="/dashboard/supporter-home" replace />;
  }

  return children;
};

export default PrivateRoute;
