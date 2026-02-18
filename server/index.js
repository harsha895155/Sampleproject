const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectMasterDB = require('./config/masterDb');

// Load environment variables relative to this file
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5011; 
// Initialize Master Database Connection
console.log('🚀 [Server] Target Port:', PORT);
console.log('🚀 [Server] Initializing Master Database Connection...');
connectMasterDB()
    .then(conn => {
        console.log('✅ [Server] Master Database connected successfully:', conn.name);
    })
    .catch(err => {
        console.error('❌ [Server] Initial Master Database connection failed!');
        console.error('❌ Error Message:', err.message);
    });

// Global Request Logger for Debugging
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`🌐 [${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
});

// Standard Middlewares
app.use(cors());
app.use(express.json());

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multi-Tenant Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/income', require('./routes/incomeRoutes'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/support', require('./routes/support'));
app.use('/api/notifications', require('./routes/notifications'));

// Health Check
app.get('/', (req, res) => {
    res.json({ 
        message: 'Professional Multi-Tenant API is running',
        status: 'Healthy',
        version: '1.0.0'
    });
});

// 404 Not Found Handling - Force JSON
app.use((req, res, next) => {
    console.log(`⚠️  [404] Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: `API Route ${req.method} ${req.originalUrl} not found on this server`
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});


// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');
// const connectMasterDB = require('./config/masterDb');

// // Load environment variables relative to this file
// dotenv.config({ path: path.join(__dirname, '.env') });

// const app = express();
// const PORT = process.env.PORT || 5011; // Explicitly default to 5011 to match Vite proxy

// // Initialize Master Database Connection
// console.log('🚀 [Server] Initializing Master Database Connection...');
// connectMasterDB()
//     .then(() => console.log('✅ [Server] Master Database connected successfully.'))
//     .catch(err => console.error('❌ [Server] Initial Master Database connection failed:', err.message));

// // Global Request Logger for Debugging
// app.use((req, res, next) => {
//     console.log(`🌐 [Incoming Request] ${req.method} ${req.originalUrl}`);
//     next();
// });

// // Standard Middlewares
// app.use(cors());
// app.use(express.json());

// // Serve Static Files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Multi-Tenant Routes
// app.use('/api/notifications', require('./routes/notifications'));
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/expenses', require('./routes/expenseRoutes'));
// app.use('/api/income', require('./routes/incomeRoutes'));
// app.use('/api/admin', require('./routes/admin'));
// app.use('/api/support', require('./routes/support'));

// // Health Check
// app.get('/', (req, res) => {
//     res.json({ 
//         message: 'Professional Multi-Tenant API is running',
//         status: 'Healthy',
//         version: '1.0.0'
//     });
// });

// // 404 Not Found Handling - Force JSON
// app.use((req, res, next) => {
//     console.log(`⚠️  [404] Route not found: ${req.method} ${req.originalUrl}`);
//     res.status(404).json({
//         success: false,
//         message: `API Route ${req.method} ${req.originalUrl} not found on this server`
//     });
// });

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({
//         success: false,
//         message: 'Something went wrong!',
//         error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
// });

// app.listen(PORT, () => {
//     console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });
