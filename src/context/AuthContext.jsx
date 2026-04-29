import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('naattukoli_token');
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      API.get('/auth/me')
        .then(res => setAdmin(res.data.admin))
        .catch(() => { localStorage.removeItem('naattukoli_token'); delete API.defaults.headers.common['Authorization']; })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('naattukoli_token', data.token);
    API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('naattukoli_token');
    delete API.defaults.headers.common['Authorization'];
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
