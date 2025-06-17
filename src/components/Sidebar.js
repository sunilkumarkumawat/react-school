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
      const cachedMenu = localStorage.getItem(`menu_${userId}`);
      if (cachedMenu) {
        setMenuItems(JSON.parse(cachedMenu));
      } else {
        const data = await fetchSidebarByUser(userId);
        if (data.error) {
          setError(data.error);
        } else {
          setMenuItems(data?.data || []);
          localStorage.setItem(`menu_${userId}`, JSON.stringify(data?.data));
        }
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
  {loading ? (
    <li className="nav-item">
      <p className="nav-link">Loading...</p>
    </li>
  ) : error ? (
    <li className="nav-item">
      <p className="nav-link text-danger">{error}</p>
    </li>
  ) : (
    menuItems.map((item, index) => (
      <li key={index} className={`nav-item ${item.subItems ? 'has-treeview' : ''}`}>
        {item.subItems ? (
          <>
            <a
              href="#!"
              className={`nav-link ${isParentActive(item) ? 'active' : ''}`}
              onClick={() => toggleMenu(index)}
            >
              <i className={`fa fa-${item.icon || 'folder'} nav-icon`} />
              <p>
                {item.title}
                <i className="fa fa-angle-left right" />
              </p>
            </a>
            <ul className={`nav nav-treeview ${openMenus[index] ? 'menu-open' : ''}`} style={{ display: openMenus[index] ? 'block' : 'none' }}>
              {item.subItems.map((sub, subIndex) => (
                <li key={subIndex} className="nav-item">
                  <Link to={`/${sub.route}`} className={`nav-link ${isActiveRoute(`/${sub.route}`) ? 'active' : ''}`}>
                    <i className={`fa fa-${sub.icon || 'circle'} nav-icon`} />
                    <p>{sub.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Link to={`/${item.route}`} className={`nav-link ${isActiveRoute(`/${item.route}`) ? 'active' : ''}`}>
            <i className={`fa fa-${item.icon || 'circle'} nav-icon`} />
            <p>{item.title}</p>
          </Link>
        )}
      </li>
    ))
  )}
</ul>


        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
