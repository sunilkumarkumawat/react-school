// components/Layout.js
import React, { useContext } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { AppContext } from "../context/AppContext";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  const { user, isSidebarCollapsed, theme } = useContext(AppContext);

  return (
    <div
    //  className={`layout-wrapper ${theme}`}
    >

        <Navbar />
      <Sidebar collapsed={isSidebarCollapsed} userId={user?.id} />

    
      
      <div class="content-wrapper">
        <section class="content">
            <div class="container-fluid">
          <Outlet />
        </div>
        </section>
        </div>
    

  
  
    </div>
  );
};

export default Layout;
