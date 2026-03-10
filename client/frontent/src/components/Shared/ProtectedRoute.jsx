import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ user, children }) {
  // If no user, kick them to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, let them through to the children (MainLayout)
  return children;
}