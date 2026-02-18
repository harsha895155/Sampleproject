const jwt = require('jsonwebtoken');
const connectMasterDB = require('../config/masterDb');
const { createModel: createUserModel } = require('../models/master/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Connect to Master DB to find user
            const masterDb = await connectMasterDB();
            console.log(`🗄️ [Auth Middleware] Master DB Ready: ${masterDb.name}, State: ${masterDb.readyState}`);
            
            const User = masterDb.models.User || createUserModel(masterDb);
            console.log(`👤 [Auth Middleware] Looking up user ID: "${decoded.id}"`);

            // Get user from the token, exclude password
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                console.log(`❌ [Auth Middleware] User not found for ID: ${decoded.id}`);
                return res.status(401).json({ success: false, message: 'User not found in master database' });
            }

            console.log(`✅ [Auth Middleware] Authenticated: ${req.user.email} (${req.user.role})`);
            return next();
        } catch (error) {
            console.error('❌ [Auth Middleware] Error:', error.message);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user && req.user.role ? req.user.role.toLowerCase().trim() : '';
        const allowedRoles = roles.map(r => r.toLowerCase().trim());

        if (!req.user || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user ? req.user.role : 'none'} is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
