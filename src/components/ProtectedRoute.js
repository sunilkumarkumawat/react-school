// src/components/ProtectedRoute.js
import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Login from './Login';

const ProtectedRoute = ({ element }) => {
    const [isLoginOpen, setLoginOpen] = useState(true);

    const openLogin = () => { setLoginOpen(true) };
    const closeLogin = () => { setLoginOpen(false) };
  

    const { isAuthenticated } = useContext(AppContext);

    return isAuthenticated ? element : <Login isOpen={isLoginOpen} onClose={closeLogin} />;
};


export default ProtectedRoute;
