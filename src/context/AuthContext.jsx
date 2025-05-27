import {jwtDecode} from 'jwt-decode';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user: userData } = response.data;
      console.log('Login response:', response.data);
      sessionStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    sessionStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // ✅ FIXED: useEffect is now inside the function block
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        console.log("Token expired");
        signOut();
        setLoading(false);
        return;
      }

      setLoading(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('http://localhost:5000/api/auth/verify')
        .then(response => {
          setUser(response.data.user);
        })
        .catch((error) => {
          console.error('Verify error:', error);
          signOut();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    role: user?.role || null,
    loading,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
