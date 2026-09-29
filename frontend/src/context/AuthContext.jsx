import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        } catch (e) {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, { username, password });
      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setUser(userData);

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  };


  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAdmin = user?.role === 'admin';
  const isVisitor = user?.role === 'visitor';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isVisitor }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
