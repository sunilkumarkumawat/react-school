import React, { useContext, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { AppContext } from "../context/AppContext";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import "../css/preloader.css"; // Move your styles here

const Layout = ({ children }) => {
  const { user, isSidebarCollapsed, theme } = useContext(AppContext);
  const branches = useSelector((state) => state.branches.branches || []);

  useEffect(() => {
    const progress = document.getElementById("progress");
    if (progress) {
      let width = 0;
      const interval = setInterval(() => {
        width += 10;
        if (width <= 100) {
          progress.style.width = `${width}%`;
        } else {
          clearInterval(interval);
        }
      }, 200);
    }
  }, [branches]);

  

  return (
    <div className={`layout-wrapper ${theme}`}>
      <Navbar />
      <Sidebar collapsed={isSidebarCollapsed} userId={user?.id} />
      <div className="content-wrapper">
        <section className="content">
          <div className="container-fluid">
            {branches.length === 0 ? 
   
      <div id="preloader">
        <div className="loader-container">
          <div className="cube">
            <div className="cube-face front"></div>
            <div className="cube-face back"></div>
            <div className="cube-face right"></div>
            <div className="cube-face left"></div>
            <div className="cube-face top"></div>
            <div className="cube-face bottom"></div>
          </div>
          <div className="progress-bar">
            <div className="progress" id="progress"></div>
          </div>
          <div className="loading-text">Loading</div>
        </div>
      </div>

      :
     <Outlet />
  }
           
          </div>
        </section>
      </div>
    </div>
  );
};

export default Layout;
