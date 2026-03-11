import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set your Backend URL here
  const API_URL =process.env.VITE_API_URL || "http://localhost:5000/api";

  // 1. Check for existing token on load
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Fetch fresh user data (populated with committee objects)
        const res = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error("Session expired or invalid token");
        localStorage.removeItem('token');
        setUser(null);
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // 2. Login Function
// 2. Updated Login Function
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      // The backend returns { token, user: { name, role, ... } }
      const { token, user: userData } = res.data;

      // 1. Save Token
      localStorage.setItem('token', token);
      
      // 2. Store user info directly from the backend object
      // This ensures all fields (name, role, assignedCommittees) are preserved
      setUser(userData); 

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login Failed";
      return { success: false, message };
    }
  };

  // 3. Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/'; // Redirect to landing or login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, API_URL }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);