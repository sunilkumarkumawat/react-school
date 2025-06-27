// App.js
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';

import BranchPage from './components/branchModule/BranchPage';
import RolePage from './components/roleModule/RolePage';
import ProfilePage from './components/common/ProfilePage';
import UserAdd from './components/UserAdd';
import UserView from './components/UserView';
import ExpensePage from './components/Expense/ExpensePage';
import StudentAdd from './components/studentModule/StudentAdd';
import StudentView from './components/studentModule/StudentView';
import ClassPage from './components/master/ClassPage';
import EventCalender from './components/master/EventCalender';
import SubjectAdd from './components/master/SubjectAdd';
import AcademicCalendarView from './components/master/AcademicCalendarView';
import FeesGroup from './components/FeesManagment/FeesGroup';
import FeesType from './components/FeesManagment/FeesType';
import FeesMaster from './components/FeesManagment/FeesMaster';
import ChatBox from './components/ChatBox';

import { useDispatch } from 'react-redux';
import { fetchBranches } from './redux/branchSlice';
import { fetchRoles } from './redux/rolesSlice';
import { fetchUsersList } from './redux/usersListSlice';

import { messaging, getToken, onMessage } from "./firebase-messaging";

function App() {
  // useEffect(() => {
  //   // Ask permission for FCM push notifications
  //   Notification.requestPermission().then((permission) => {
  //     if (permission === "granted") {
  //       getToken(messaging, {
  //         vapidKey: "BG9XARjfZLAJZavsp1rhcL_jXZ3_rrTAlZ4oeObdc_NQANsSnzUrXDpuhV4bd13yhFq5tT0i0mnTGRiCFKXhoRg", // 👈 Replace this
  //       })
  //         .then((currentToken) => {
  //           if (currentToken) {
  //             console.log("✅ FCM Token:", currentToken);
  //             // 👉 You can now send this token to your backend via axios
  //             // axios.post('/api/save-fcm-token', { token: currentToken });
  //           } else {
  //             console.warn("No registration token available.");
  //           }
  //         })
  //         .catch((err) => {
  //           console.error("An error occurred while retrieving token.", err);
  //         });
  //     } else {
  //       console.warn("Notification permission denied.");
  //     }
  //   });

  //   // Listen to messages in foreground
  //   onMessage(messaging, (payload) => {
  //     console.log("🔔 Foreground message received:", payload);
  //     alert(`${payload?.notification?.title}\n${payload?.notification?.body}`);
  //   });
  // }, []);

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
  const { token, selectedBranchId } = useContext(AppContext);
  const API_URL = process.env.REACT_APP_BASE_URL || '';

const handleNotificationPermission = async () => {
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    console.log("🔓 Notification permission granted");

    try {
      const currentToken = await getToken(messaging, {
        vapidKey: "BG9XARjfZLAJZavsp1rhcL_jXZ3_rrTAlZ4oeObdc_NQANsSnzUrXDpuhV4bd13yhFq5tT0i0mnTGRiCFKXhoRg", // Replace this
      });

      if (currentToken) {
        console.log("✅ FCM Token:", currentToken);
        // TODO: send this token to your backend
      } else {
        console.warn("⚠️ No token available");
      }

    } catch (error) {
      console.error("❌ Error retrieving token:", error);
    }

  } else if (permission === 'denied') {
    alert("⚠️ You've blocked notifications. Please enable them from browser settings.");
  } else {
    alert(" i Notification permission was dismissed.");
  }
};

  useEffect(() => {
    if (token) {
      const currentPath = location.pathname;

      if (!['/branch', '/role', '/userView'].includes(currentPath)) {
        dispatch(fetchBranches({ API_URL, token }));
        dispatch(fetchRoles({ API_URL, token }));
        dispatch(fetchUsersList({ API_URL, token, selectedBranchId }));
      }
    }
  }, [token, selectedBranchId, dispatch, API_URL, location.pathname]);

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
<button onClick={handleNotificationPermission}>
  Enable Notifications
</button>
      <Routes>
        <Route path="/" element={<Login />} />
        {isAuthenticated && (
          <Route path="/" element={<Layout />}>
            <Route path="Dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="branch" element={<ProtectedRoute element={<BranchPage />} />} />
            <Route path="role" element={<ProtectedRoute element={<RolePage />} />} />
            <Route path="profile" element={<ProtectedRoute element={<ProfilePage />} />} />
            <Route path="userAdd" element={<ProtectedRoute element={<UserAdd />} />} />
            <Route path="userView" element={<ProtectedRoute element={<UserView />} />} />
            <Route path="expense" element={<ProtectedRoute element={<ExpensePage />} />} />
            <Route path="studentAdd" element={<ProtectedRoute element={<StudentAdd />} />} />
            <Route path="studentView" element={<ProtectedRoute element={<StudentView />} />} />
            <Route path="class" element={<ProtectedRoute element={<ClassPage />} />} />
            <Route path="eventcalender" element={<ProtectedRoute element={<EventCalender />} />} />
            <Route path="subjectAdd" element={<ProtectedRoute element={<SubjectAdd />} />} />
            <Route path="academicCalendar" element={<ProtectedRoute element={<AcademicCalendarView />} />} />
            <Route path="feesGroup" element={<ProtectedRoute element={<FeesGroup />} />} />
            <Route path="feesType" element={<ProtectedRoute element={<FeesType />} />} />
            <Route path="feesMaster" element={<ProtectedRoute element={<FeesMaster />} />} />
            <Route path="chatBox" element={<ProtectedRoute element={<ChatBox />} />} />
          </Route>
        )}
      </Routes>
    </div>
  );
}

export default App;
