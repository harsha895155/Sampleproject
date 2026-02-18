import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from '../shims/react-router-dom';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
