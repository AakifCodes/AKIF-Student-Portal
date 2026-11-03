import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const AdminRoute: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/student" replace />;
  }

  return <Outlet />;
};

export const StudentRoute: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (user?.role !== 'STUDENT') {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};
