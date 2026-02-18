import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from './shims/react-router-dom';

// ------------------------------------------------------------------
// 1. Global Error & Diagnostic Catcher
// ------------------------------------------------------------------
window.onerror = function(message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; color: #fff; background: #1a1a1a; border: 2px solid #ff4444; font-family: monospace; border-radius: 8px;">
        <h1 style="color: #ff4444; margin-top: 0;">⚠️ RUNTIME ERROR</h1>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Location:</strong> ${source}:${lineno}:${colno}</p>
        <pre style="background: #000; padding: 10px; border-radius: 4px; overflow-x: auto;">${error ? error.stack : 'No stack trace available'}</pre>
        <button onclick="window.location.reload(true)" style="background: #4F46E5; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Hard Reload Page</button>
      </div>
    `;
  }
  return false;
};

// ------------------------------------------------------------------
// 2. High-Compatibility Self-Contained Mock Backend
// ------------------------------------------------------------------
const mockData = {
  user: { 
    id: 'user1', 
    username: 'Harsha User', 
    email: 'user@example.com', 
    role: 'admin',
    department: 'Engineering'
  },
  stats: { 
    income: 12500, 
    expense: 8400, 
    balance: 4100 
  },
  transactions: [
    { _id: '1', date: new Date().toISOString(), category: 'Salary', amount: 8000, type: 'income', description: 'Primary Job' },
    { _id: '2', date: new Date(Date.now() - 86400000).toISOString(), category: 'Rent', amount: 1500, type: 'expense', description: 'Office Rent' },
    { _id: '3', date: new Date(Date.now() - 172800000).toISOString(), category: 'Software', amount: 200, type: 'expense', description: 'SaaS Subscriptions' },
    { _id: '4', date: new Date(Date.now() - 259200000).toISOString(), category: 'Bonus', amount: 4500, type: 'income', description: 'Freelance Project' },
    { _id: '5', date: new Date(Date.now() - 345600000).toISOString(), category: 'Food', amount: 150, type: 'expense', description: 'Team Lunch' }
  ],
  categoryStats: [
    { _id: 'Housing', amount: 1500 },
    { _id: 'Food', amount: 800 },
    { _id: 'Transport', amount: 400 },
    { _id: 'Entertainment', amount: 600 },
    { _id: 'Utilities', amount: 300 }
  ],
  monthlyStats: [
    { month: 'Jan', amount: 4000 },
    { month: 'Feb', amount: 5200 },
    { month: 'Mar', amount: 4800 },
    { month: 'Apr', amount: 6100 },
    { month: 'May', amount: 5500 }
  ]
};

const originalFetch = window.fetch;
window.fetch = async function(url, options) {
  const path = url.toString();
  console.log('[MockFetch]:', path);

  // Helper to simulate network delay
  await new Promise(r => setTimeout(r, 100));

  // Response factory for JSend/Axios compatibility
  const createResponse = (data) => ({
    ok: true,
    status: 200,
    headers: new Headers({ 'Content-Type': 'application/json' }),
    json: async () => ({
      success: true,
      data: data, // For .data.data access
      ...data      // For .data access (destructured)
    }),
    text: async () => JSON.stringify({ success: true, data: data, ...data })
  });

  if (path.includes('/auth/login') || path.includes('/auth/register')) {
    return createResponse({ token: 'mock-jwt-token-123', user: mockData.user });
  }
  
  if (path.includes('/auth/user') || path.includes('/auth/me')) {
    return createResponse(mockData.user);
  }

  if (path.includes('/transactions/stats')) {
    return createResponse(mockData.stats);
  }

  if (path.includes('/transactions/category-stats')) {
    return createResponse(mockData.categoryStats);
  }

  if (path.includes('/transactions/monthly-stats')) {
    return createResponse(mockData.monthlyStats);
  }

  if (path.includes('/transactions')) {
    return createResponse(mockData.transactions);
  }

  if (path.includes('/admin/users')) {
    return createResponse([mockData.user]);
  }

  return originalFetch.apply(this, arguments);
};

// ------------------------------------------------------------------
// 3. Application Mounting
// ------------------------------------------------------------------
const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
  
  console.log('🚀 Application mounted successfully in Debug Mode');
} else {
  console.error('CRITICAL: Root element not found!');
}
