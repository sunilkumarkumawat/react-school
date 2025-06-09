import React, { createContext, useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import ToastrContainer from '../components/ToastrContainer';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!Cookies.get('authToken'));
  const [token, setToken] = useState(() => Cookies.get('authToken') || null);
  const [user, setUser] = useState(() => {
    const storedUser = Cookies.get('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const loggedIN = (authToken, userData) => {
    setIsAuthenticated(true);
    setToken(authToken);
    setUser(userData);
    Cookies.set('authToken', authToken, { expires: 7, secure: true, sameSite: 'Strict' });
    Cookies.set('user', JSON.stringify(userData), { expires: 7, secure: true, sameSite: 'Strict' });
  };

const logout = () => {
  // Remove all cookies
  Object.keys(Cookies.get()).forEach(cookieName => Cookies.remove(cookieName));
  setToken(null);
  setUser(null);
  setIsAuthenticated(false);
  setSelectedBranchId("");
  window.location.href = '/';
};

  useEffect(() => {
    const storedToken = Cookies.get('authToken');
    const storedUser = Cookies.get('user');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  // Toastr integration
  const [toasts, setToasts] = useState([]);
  const showToastr = useCallback((message, {
    position = 'top-right',
    duration = 3000,
    id = Date.now()
  } = {}) => {
    const newToast = { id, message, position, duration };
    setToasts(prev => [...prev, newToast]);

    if (duration) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToastr = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        loggedIN,
        logout,
        user,
        token,
        theme,
        toggleTheme,
        selectedBranchId,
        setSelectedBranchId,
        isSidebarCollapsed,
        toggleSidebar,
        showToastr,
      }}
    >
      {children}
      <ToastrContainer toasts={toasts} removeToastr={removeToastr} />
    </AppContext.Provider>
  );
};