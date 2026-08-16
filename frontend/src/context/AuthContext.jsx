import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Helper to safely parse JWT payload
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('pastebin_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('pastebin_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) { return null; }
    }
    const savedToken = localStorage.getItem('pastebin_token');
    if (savedToken) {
      const decoded = parseJwt(savedToken);
      return decoded ? { id: decoded.userId } : null;
    }
    return null;
  });
  
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const loginUser = (authToken, refreshToken, userInfo = null) => {
    localStorage.setItem('pastebin_token', authToken);
    if (refreshToken) {
      localStorage.setItem('pastebin_refresh', refreshToken);
    }
    
    let decodedUser = userInfo;
    if (!decodedUser && authToken) {
      const decoded = parseJwt(authToken);
      decodedUser = decoded ? { id: decoded.userId } : null;
    }

    if (decodedUser) {
      localStorage.setItem('pastebin_user', JSON.stringify(decodedUser));
    }
    
    setToken(authToken);
    setUser(decodedUser);
  };

  const logoutUser = () => {
    localStorage.removeItem('pastebin_token');
    localStorage.removeItem('pastebin_refresh');
    localStorage.removeItem('pastebin_user');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login: loginUser,
        logout: logoutUser,
        toast,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
