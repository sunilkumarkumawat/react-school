import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchSidebarByUser } from "../api/apiHelper";
import { AppContext } from "../context/AppContext";
import AppImage from "../utils/AppImage";
const Sidebar = ({ collapsed, userId = 1, userName = "Prashant" }) => {
  // Default username is "Prashant"
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openMenus, setOpenMenus] = useState({});
  const { user, logout,toggleSidebar } = useContext(AppContext);

  useEffect(() => {
    const loadMenuItems = async () => {
      setLoading(true);
      try {
        const data = await fetchSidebarByUser(userId);
        if (data.error) {
          setError(data.error);
        } else {
          setMenuItems(data);
        }
      } catch (err) {
        setError("Something went wrong. Please try again later.");
      }
      setLoading(false);
    };

    loadMenuItems();
  }, [userId]);


  const location = useLocation();

  const toggleMenu = (menuId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const isActiveRoute = (route) => location.pathname === route;
  const isParentActive = (item) => {
    if (isActiveRoute(item.route)) return true;
    return item.submenus?.some((submenu) => isActiveRoute(submenu.route));
  };

  // const handleLogout = () => {
  //     // Perform any necessary logout action here (e.g., clearing cookies, tokens)
  //     // Redirect to login or perform logout functionality
  //     window.location.href = "/login"; // Example redirect to login page after logout
  // };

  return (
    <aside className="main-sidebar bg-light d-none d-md-block" style={{ marginLeft: true ? '0px' : '' }}id="sidebar">
      {/* Brand Logo */}
      <Link to="/">
        <div className="top_brand_section" style={{  padding: '20px' }}>
           <AppImage category="webp" name="admin" alt="logo" width={33} height={33} customImageClass='brand-image img-circle elevation-3'/>
           
          <p className="brand-text font-weight-light">Rukmani Software School</p>
        </div>
      </Link>

      {/* Sidebar */}
      <div className="sidebar ">
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

            {/* Dashboard */}
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link">
                <i className="fa fa-dashboard nav-icon"></i>
                <p>Dashboard</p>
              </Link>
            </li>

            {/* Branch */}
            <li className="nav-item">
              <Link to="/branch" className="nav-link">
                <i className="fa fa-code-branch nav-icon"></i>
                <p>Branch</p>
              </Link>
            </li>

            {/* Role */}
            <li className="nav-item">
              <Link to="/role" className="nav-link">
                <i className="fa fa-user-circle nav-icon"></i>
                <p>Role</p>
              </Link>
            </li>

            {/* User Menu */}
            <li className="nav-item has-treeview">
              <a href="#user" className="nav-link">
                <i className="fa fa-user nav-icon"></i>
                <p>User <i className="fa fa-angle-left right"></i></p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/userAdd" className="nav-link">
                    <i className="fa fa-plus-circle nav-icon"></i>
                    <p>Add User</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/userView" className="nav-link">
                    <i className="fa fa-eye nav-icon"></i>
                    <p>View List</p>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Student Menu */}
            <li className="nav-item has-treeview">
              <a href="#student" className="nav-link">
                <i className="fa fa-graduation-cap nav-icon"></i>
                <p>Student <i className="fa fa-angle-left right"></i></p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/studentAdd" className="nav-link">
                    <i className="fa fa-plus-circle nav-icon"></i>
                    <p>Add Student</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/studentView" className="nav-link">
                    <i className="fa fa-eye nav-icon"></i>
                    <p>View List</p>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Message Menu */}
            <li className="nav-item has-treeview">
              <a href="#message" className="nav-link">
                <i className="fa fa-envelope nav-icon"></i>
                <p>Message <i className="fa fa-angle-left right"></i></p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/messageTypeAdd" className="nav-link">
                    <i className="fa fa-plus-circle nav-icon"></i>
                    <p>Add Message</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/messageTemplate" className="nav-link">
                    <i className="fa fa-envelope-square nav-icon"></i>
                    <p>Message Template</p>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Expense */}
            <li className="nav-item">
              <Link to="/expense" className="nav-link">
                <i className="fa fa-credit-card nav-icon"></i>
                <p>Expense</p>
              </Link>
            </li>

            {/* Library Management */}
            <li className="nav-item has-treeview">
              <a href="#library" className="nav-link">
                <i className="fa fa-eraser nav-icon"></i>
                <p>Library Management <i className="fa fa-angle-left right"></i></p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/cabin" className="nav-link">
                    <i className="fa fa-home nav-icon"></i>
                    <p>Cabin</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/locker" className="nav-link">
                    <i className="fa fa-lock nav-icon"></i>
                    <p>Locker</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/subscription" className="nav-link">
                    <i className="fa fa-bookmark nav-icon"></i>
                    <p>Subscription</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/billing" className="nav-link">
                    <i className="fa fa-file-text nav-icon"></i>
                    <p>Bill</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/due" className="nav-link">
                    <i className="fa fa-list nav-icon"></i>
                    <p>Due List</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/wallet" className="nav-link">
                    <i className="fa fa-money nav-icon"></i>
                    <p>Wallet</p>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Book Management */}
            <li className="nav-item has-treeview">
              <a href="#book" className="nav-link">
                <i className="fa fa-book nav-icon"></i>
                <p>Book Management <i className="fa fa-angle-left right"></i></p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/bookAdd" className="nav-link">
                    <i className="fa fa-plus nav-icon"></i>
                    <p>Book Add</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/bookAssign" className="nav-link">
                    <i className="fa fa-book nav-icon"></i>
                    <p>Book Assign</p>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Log Out */}
            <li className="nav-item">
              <Link to="/login" className="nav-link text-danger">
                <i className="fa fa-sign-out nav-icon"></i>
                <p>Log Out</p>
              </Link>
            </li>

          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
