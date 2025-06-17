// App.js
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';

import { AppProvider, AppContext } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Dashboard from './components/Dashboard';
// import './css/main.css';
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Layout from './components/Layout';
import BranchPage from './components/branchModule/BranchPage';
import RolePage from './components/roleModule/RolePage';
import ProfilePage from './components/common/ProfilePage';
import { useDispatch } from 'react-redux';
import { fetchBranches } from './redux/branchSlice';
import { fetchRoles } from './redux/rolesSlice';
import UserAdd from './components/UserAdd';
import UserView from './components/UserView';
import { fetchUsersList } from './redux/usersListSlice';
import ExpensePage from './components/Expense/ExpensePage';

function App() {
  return (
    <AppProvider>
      <Router>
        <MainApp />
      </Router>
    </AppProvider>
  );
}

function MainApp() {
  const { user, theme, isAuthenticated, isSidebarCollapsed } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);


  const dispatch = useDispatch();
  const { token ,selectedBranchId} = useContext(AppContext);
  const API_URL = process.env.REACT_APP_BASE_URL || '';
  

  useEffect(() => {
    if (token) {
   
      const currentPath = location.pathname;

      // Prevent dispatching if already on /branches or /roles
      if (!['/branch', '/role','/userView'].includes(currentPath)) {
        dispatch(fetchBranches({ API_URL, token }));
        dispatch(fetchRoles({ API_URL, token }));
        dispatch(fetchUsersList({ API_URL, token ,selectedBranchId}));
      }
    }
    // eslint-disable-next-line
  }, [token,selectedBranchId]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else if (location.pathname === "/") {
      navigate("/Dashboard");
    }
  }, [isAuthenticated, navigate, location.pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className={theme}>
      <Routes>
        <Route path="/" element={<Login />} />
        {isAuthenticated && (
          <Route
            path="/"
            element={<Layout />}
          >
            <Route path="Dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="branch" element={<ProtectedRoute element={<BranchPage />} />} />
            <Route path="role" element={<ProtectedRoute element={<RolePage/>} />} />
            <Route path="profile" element={<ProtectedRoute element={<ProfilePage/>} />} />
            <Route path="userAdd" element={<ProtectedRoute element={<UserAdd/>} />} />
            <Route path="userView" element={<ProtectedRoute element={<UserView/>} />} />
            <Route path="expense" element={<ProtectedRoute element={<ExpensePage/>} />} />
          </Route>
        )}
      </Routes>
    </div>
  );
}

export default App;
