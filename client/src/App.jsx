import React from 'react';
import { Routes, Route } from './shims/react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={
            <Layout>
                <Dashboard />
            </Layout>
        } />
        <Route path="/transactions" element={
            <Layout>
                <Transactions />
            </Layout>
        } />
        <Route path="/reports" element={
            <Layout>
                <Reports />
            </Layout>
        } />
        <Route path="/admin" element={
            <Layout>
                <Admin />
            </Layout>
        } />
        <Route path="/settings" element={
            <Layout>
                <Settings />
            </Layout>
        } />

        {/* Add more protected routes here */}
      </Route>
    </Routes>
  );
}

export default App;
