import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('prep_ai_jwt') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('prep_ai_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isLoggedIn = Boolean(token && user);

  // Sync profile on load if token exists
  useEffect(() => {
    if (token && !user) {
      apiService.getProfile()
        .then(profile => {
          const userData = {
            id: profile.id,
            email: profile.email,
            name: profile.fullName,
            role: profile.role || 'Student',
            targetCompany: profile.targetCompany,
          };
          setUser(userData);
          localStorage.setItem('prep_ai_user', JSON.stringify(userData));
        })
        .catch(() => {
          // Token expired or invalid
        });
    }
  }, [token]);

  const login = async (email, passwordOrName) => {
    try {
      // Attempt backend authentication
      const res = await apiService.login(email, passwordOrName);
      if (res && res.token) {
        setToken(res.token);
        const userData = {
          id: res.id,
          email: res.email,
          name: res.fullName,
          role: res.role || 'Student',
          targetCompany: res.targetCompany,
        };
        setUser(userData);
        localStorage.setItem('prep_ai_jwt', res.token);
        localStorage.setItem('prep_ai_user', JSON.stringify(userData));
        return { success: true };
      }
    } catch (err) {
      // If backend is unreachable or local mock mode requested, provide fallback
      console.warn('[AuthContext] Backend login fallback:', err.message);
      const userName = email.split('@')[0];
      const cleanName = userName.charAt(0).toUpperCase() + userName.slice(1);
      const fallbackToken = 'mock-jwt-' + Date.now();
      const userData = { email, name: cleanName, role: 'Student' };
      setToken(fallbackToken);
      setUser(userData);
      localStorage.setItem('prep_ai_jwt', fallbackToken);
      localStorage.setItem('prep_ai_user', JSON.stringify(userData));
      return { success: true };
    }
  };

  const register = async (fullName, email, password, targetCompany) => {
    try {
      const res = await apiService.register(fullName, email, password, targetCompany);
      if (res && res.token) {
        setToken(res.token);
        const userData = {
          id: res.id,
          email: res.email,
          name: res.fullName,
          role: res.role || 'Student',
          targetCompany: res.targetCompany,
        };
        setUser(userData);
        localStorage.setItem('prep_ai_jwt', res.token);
        localStorage.setItem('prep_ai_user', JSON.stringify(userData));
        return { success: true };
      }
    } catch (err) {
      console.warn('[AuthContext] Backend register fallback:', err.message);
      return login(email, fullName);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('prep_ai_jwt');
    localStorage.removeItem('prep_ai_user');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
