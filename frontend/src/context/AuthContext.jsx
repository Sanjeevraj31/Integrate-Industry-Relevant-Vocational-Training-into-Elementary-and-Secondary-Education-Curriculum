import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true); // Dark mode default for sleek look

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('skillbridge_token');
      if (token) {
        try {
          const profile = await api.get('/auth/profile');
          setUser(profile);
        } catch (error) {
          console.error('Failed to load profile on init:', error.message);
          localStorage.removeItem('skillbridge_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Theme Sync effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('skillbridge_token', res.token);
      setUser({
        _id: res._id,
        name: res.name,
        email: res.email,
        role: res.role,
        status: res.status
      });
      return res;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', userData);
      // Teachers/Mentors status is 'Pending' and won't issue a token, they'll have to wait for admin approval
      if (res.token) {
        localStorage.setItem('skillbridge_token', res.token);
        setUser({
          _id: res._id,
          name: res.name,
          email: res.email,
          role: res.role,
          status: res.status
        });
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('skillbridge_token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const updated = await api.put('/auth/profile', profileData);
    setUser(prev => ({ ...prev, ...updated }));
    return updated;
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      darkMode,
      loginUser,
      registerUser,
      logoutUser,
      updateProfile,
      toggleDarkMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};
