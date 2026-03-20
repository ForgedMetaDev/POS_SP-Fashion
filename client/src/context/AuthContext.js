import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import axiosInstance, { setUnauthorizedHandler } from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [storedToken, storedUser] = await AsyncStorage.multiGet(['token', 'user']);
        const tokenValue = storedToken?.[1];
        const userValue = storedUser?.[1];

        if (tokenValue && userValue) {
          setToken(tokenValue);
          setUser(JSON.parse(userValue));
        }
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async ({ username, password }) => {
    const response = await axiosInstance.post('/auth/login', { username, password });
    const payload = response?.data?.data;

    await AsyncStorage.multiSet([
      ['token', payload.token],
      ['user', JSON.stringify(payload.user)]
    ]);

    setToken(payload.token);
    setUser(payload.user);

    return payload.user;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
