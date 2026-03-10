import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import UploadPage from './pages/UploadPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';

// Layout & Protection
import MainLayout from './components/Layout/MainLayout.jsx';
import ProtectedRoute from './components/Shared/ProtectedRoute.jsx';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-black text-slate-300 animate-pulse uppercase tracking-[0.5em] text-[10px]">
        Verifying Security Credentials...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ACCESS: If logged in, redirect away from login */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
        />

        {/* PROTECTED ACCESS WRAPPED IN LAYOUT */}
        <Route element={
          <ProtectedRoute user={user}>
            <MainLayout />
          </ProtectedRoute>
        }>
          {/* Default Route */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Universal Protected Routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reports" element={<ReportsPage />} />

          {/* Role-Specific Guarding: Admin & Director */}
          <Route 
            path="upload" 
            element={
              (user?.role === 'Admin' || user?.role === 'Director') 
                ? <UploadPage /> 
                : <Navigate to="/dashboard" replace />
            } 
          />

          {/* Role-Specific Guarding: Admin Only */}
          <Route 
            path="admin" 
            element={
              user?.role === 'Admin' 
                ? <AdminPanel /> 
                : <Navigate to="/dashboard" replace />
            } 
          />
        </Route>

        {/* GLOBAL REDIRECT for 404s */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}