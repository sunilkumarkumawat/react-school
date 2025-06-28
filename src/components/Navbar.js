import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import AppImage from "../utils/AppImage";
import { fetchBranches } from '../redux/branchSlice';
import Cookies from 'js-cookie';
import Breadcrumb from "./common/Breadcrumb";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase-messaging";
const Navbar = () => {
  const {
    isSidebarCollapsed,
    toggleSidebar,
    user,
    logout,
    token,
    selectedBranchId,
    setSelectedBranchId,
  } = useContext(AppContext);

    const API_URL = process.env.REACT_APP_BASE_URL || "";

  const dispatch = useDispatch();
  const branches = useSelector(state => state.branches.branches || []);
  const branchStatus = useSelector(state => state.branches.status);

  useEffect(() => {
    if (token && branchStatus === 'idle') {
      dispatch(fetchBranches({ API_URL: process.env.REACT_APP_BASE_URL || '', token }));
    }
    // eslint-disable-next-line
  }, [token, branchStatus, dispatch]);

  // Load selectedBranchId from cookie on mount
  useEffect(() => {
    const cookieBranchId = Cookies.get('selectedBranchId');
    if (cookieBranchId && cookieBranchId !== selectedBranchId) {
      setSelectedBranchId(cookieBranchId);
    }
    // eslint-disable-next-line
  }, []);

  // Auto-select first branch if selectedBranchId is not set and branches exist
  useEffect(() => {
    if (
      (!selectedBranchId || selectedBranchId === "") &&
      branches.length > 0
    ) {
      const firstBranchId = user?.role_id === 1 ? "-1" : branches[0].id;
      setSelectedBranchId(firstBranchId);
      Cookies.set('selectedBranchId', firstBranchId, { expires: 7, secure: true, sameSite: 'Strict' });
    }
    // eslint-disable-next-line
  }, [branches, selectedBranchId, user]);

  const onBranchChange = (e) => {
    setSelectedBranchId(e.target.value);
    Cookies.set('selectedBranchId', e.target.value, { expires: 7, secure: true, sameSite: 'Strict' });
    // Any additional logic for branch change can go here
  };


   const handleNotificationPermission = async () => {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("🔓 Notification permission granted");

      try {
        const currentToken = await getToken(messaging, {
          vapidKey:
            "BG9XARjfZLAJZavsp1rhcL_jXZ3_rrTAlZ4oeObdc_NQANsSnzUrXDpuhV4bd13yhFq5tT0i0mnTGRiCFKXhoRg", // Replace this
        });

        if (currentToken) {
          console.log("✅ FCM Token:", currentToken);
          // TODO: send this token to your backend
          handleFcmToken(user.id,currentToken);
        } else {
          console.warn("⚠️ No token available");
        }
      } catch (error) {
        console.error("❌ Error retrieving token:", error);
      }
    } else if (permission === "denied") {
      alert(
        "⚠️ You've blocked notifications. Please enable them from browser settings."
      );
    } else {
      alert(" i Notification permission was dismissed.");
    }
  };


  onMessage(messaging, (payload) => {
  console.log("🔔 Foreground FCM received", payload);
  alert(`${payload.notification.title}\n${payload.notification.body}`);
});



 const handleFcmToken = async (id, fcmToken) => {
  try {
    const response = await fetch(`${API_URL}/saveFcmToken/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fcm_token: fcmToken,
      }),
    });

    const data = await response.json(); // ✅ parse response

    if (response.ok) {
      console.log("✅ FCM Token Saved"); // ✅ correct
    }
  } catch (error) {
    console.error("FCM Token Error:", error);
  }
};

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light p-0">
      {/* <ul className="navbar-nav">
        <li className="nav-item ml-1">
          <button className="nav-link border-0" onClick={toggleSidebar} id="sidebarToggle">
            <i className="fa fa-bars"></i>
          </button>
        </li>
      </ul> */}
<ul className="navbar-nav ml-3">

      <Breadcrumb />
</ul>

      <ul className="navbar-nav ml-auto d-flex align-items-center">
        {/* Student View Button */}
        <li className="nav-item mr-2">
        <button onClick={handleNotificationPermission}>
              Enable Notifications
            </button>
        </li>
        <li className="nav-item mr-2">
          <Link to="/studentView">
            <button type="button" className="btn btn-primary btn-head">
              Student View
            </button>
          </Link>
        </li>

        {/* Branch Dropdown */}
        <li className="nav-item mr-2">
          <select
            className="form-control form-control-sm"
            id="headerBranchSelect"
            onChange={onBranchChange}
            value={selectedBranchId || "-1"}
          >
            {user?.role_id === 1 && (
              <option value="-1">All</option>
            )}
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </li>

        {/* Profile Dropdown */}
        <li className="nav-item dropdown">
          <a className="user-panel dropdown-toggle" href="#" data-toggle="dropdown">
            <AppImage category="png" name="avatar" alt="User" width={40} height={40} />
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <div className="dropdown-item border-bottom d-flex align-items-center">
              <AppImage category="png" name="avatar" alt="User" width={30} height={30} />
              <div className="ml-2">
                <h5 className="mb-0">{user?.name || 'Hello Guest'}</h5>
                <p className="mb-0">{user?.role_name}</p>
              </div>
            </div>
            <Link to="/profile" className="dropdown-item border-bottom">
              <i className="fa fa-user-circle mr-2"></i> Profile Setting
            </Link>
            <Link to="/change-password" className="dropdown-item border-bottom">
              <i className="fa fa-key mr-2"></i> Change Password
            </Link>
            <Link onClick={logout} className="dropdown-item border-bottom text-danger">
              <i className="fa fa-sign-out mr-2"></i> Log Out
            </Link>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;