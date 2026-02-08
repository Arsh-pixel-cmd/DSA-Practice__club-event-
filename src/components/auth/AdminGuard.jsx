import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminGuard = ({ isAdmin }) => {
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default AdminGuard;
