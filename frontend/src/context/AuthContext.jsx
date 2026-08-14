import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('sukoon_token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');

        setUser(data.data);
        localStorage.setItem(
          'sukoon_user',
          JSON.stringify(data.data)
        );
      } catch (err) {
        console.error('AUTH BOOTSTRAP ERROR:', err);

        localStorage.removeItem('sukoon_token');
        localStorage.removeItem('sukoon_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const saveAuth = (data) => {
    localStorage.setItem(
      'sukoon_token',
      data.token
    );

    localStorage.setItem(
      'sukoon_user',
      JSON.stringify(data)
    );

    setUser(data);

    return data;
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post(
        '/auth/login',
        {
          email: email.trim().toLowerCase(),
          password,
        }
      );

      return saveAuth(data.data);
    } catch (err) {
      console.error(
        'LOGIN ERROR:',
        err.response?.data || err.message
      );

      throw err;
    }
  };

  const register = async (
    name,
    email,
    password
  ) => {
    try {
      const { data } = await api.post(
        '/auth/register',
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }
      );

      return saveAuth(data.data);
    } catch (err) {
      console.error(
        'REGISTER ERROR:',
        {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          url:
            err.config?.baseURL +
            err.config?.url,
        }
      );

      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('sukoon_token');
    localStorage.removeItem('sukoon_user');
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await api.get('/auth/me');

    setUser(data.data);

    localStorage.setItem(
      'sukoon_user',
      JSON.stringify(data.data)
    );

    return data.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);