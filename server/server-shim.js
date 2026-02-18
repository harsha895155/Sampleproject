const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5011;
function log(msg) {
    console.log(`${new Date().toISOString()} - ${msg}`);
}

log('Backend starting...');

const mockData = {
    stats: { income: 5000, expense: 2500, balance: 2500 },
    transactions: [
        { _id: '1', date: new Date(), category: 'Salary', amount: 5000, type: 'income', description: 'Monthly Salary' },
        { _id: '2', date: new Date(), category: 'Rent', amount: 1500, type: 'expense', description: 'Apartment Rent' },
        { _id: '3', date: new Date(), category: 'Food', amount: 500, type: 'expense', description: 'Groceries' }
    ],
    users: [
        { _id: 'u1', fullName: 'System Admin', email: 'admin@fintechpro.com', role: 'administrator', isEmailVerified: true },
        { _id: 'u2', fullName: 'Tech Corp LLC', email: 'contact@techcorp.com', role: 'business', isEmailVerified: true },
        { _id: 'u3', fullName: 'Global Non-Profit', email: 'info@globalorg.org', role: 'organization', isEmailVerified: true },
        { _id: 'u4', fullName: 'Sarah Parker', email: 'sarah@design.co', role: 'business', isEmailVerified: false }
    ],
    user: { _id: 'u1', fullName: 'System Admin', email: 'admin@fintechpro.com', role: 'administrator', isEmailVerified: true }
};

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    log(`${req.method} ${req.url}`);

    if (req.url.includes('/api/auth/login')) {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: { ...mockData.user, token: 'mock-token' } }));
    } else if (req.url.includes('/api/auth/register') || req.url.includes('/api/auth/signup')) {
        res.writeHead(201);
        res.end(JSON.stringify({ success: true, message: 'Account created!', data: { email: 'test@example.com', needsVerification: true } }));
    } else if (req.url.includes('/api/auth/verify-otp')) {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'Verified', data: { ...mockData.user, token: 'mock-token' } }));
    } else if (req.url.includes('/api/auth/user') || req.url.includes('/api/auth/me')) {
        res.writeHead(200);
        res.end(JSON.stringify(mockData.user));
    } else if (req.url.includes('/api/transactions/stats')) {
        res.writeHead(200);
        res.end(JSON.stringify({ data: mockData.stats }));
    } else if (req.url.includes('/api/transactions')) {
        res.writeHead(200);
        res.end(JSON.stringify({ data: mockData.transactions }));
    } else if (req.url.includes('/api/admin/platform/users')) {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: mockData.users }));
    } else if (req.url.includes('/api/admin/platform/teams')) {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: [] }));
    } else {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'Mock Action Successful', data: [] }));
    }
});

server.listen(PORT, '0.0.0.0', () => {
    log(`Mock Server listening on 0.0.0.0:${PORT}`);
});
