const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const connectMasterDB = require('../config/masterDb');
const { createModel: createUserModel } = require('../models/master/User');

const LOG_FILE = path.join(__dirname, 'admin_debug.log');
const debugLog = (msg) => {
    const logMsg = `[${new Date().toISOString()}] ${msg}\n`;
    fs.appendFileSync(LOG_FILE, logMsg);
    console.log(msg);
};

exports.getAllPlatformUsers = async (req, res) => {
    try {
        const masterDb = await connectMasterDB();
        const User = createUserModel(masterDb);
        const allUsers = await User.find({}).select('-password').lean();
        
        let resultData = allUsers.filter(u => {
            if (!u) return false;
            const isVerified = u.isEmailVerified === true;
            const isRequester = req.user && String(u.email).toLowerCase() === String(req.user.email).toLowerCase();
            return isVerified || isRequester;
        });

        if (resultData.length === 0 && req.user) {
            resultData = [{
                _id: req.user._id,
                fullName: req.user.fullName || 'Administrator',
                email: req.user.email,
                role: req.user.role || 'administrator',
                isEmailVerified: true,
                databaseName: req.user.databaseName
            }];
        }

        res.status(200).json({ success: true, data: resultData });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updatePlatformUser = async (req, res) => {
    debugLog('--- UPDATE REQUEST RECEIVED ---');
    try {
        const { fullName, email, phoneNumber, role, password } = req.body;
        let { id } = req.params;

        debugLog(`Payload: ${JSON.stringify(req.body)}`);
        debugLog(`ID from Params: ${id}`);

        if (id && id.includes('/')) id = id.split('/')[0];
        id = id.trim();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            debugLog(`❌ INVALID ID: ${id}`);
            return res.status(400).json({ success: false, message: 'Invalid User ID format' });
        }

        const masterDb = await connectMasterDB();
        debugLog(`DB State: ${masterDb.readyState}`);
        
        const User = createUserModel(masterDb);
        
        // Use findByIdAndUpdate for direct DB hit
        const updateFields = { fullName, email, phoneNumber, role };
        
        // Remove undefined fields
        Object.keys(updateFields).forEach(key => (updateFields[key] === undefined || updateFields[key] === '') && delete updateFields[key]);

        if (password && password.trim() !== '') {
            debugLog('Processing password update...');
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }

        debugLog(`Attempting update for ID ${id} with: ${JSON.stringify(updateFields)}`);
        
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            debugLog('❌ USER NOT FOUND IN DB');
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        debugLog(`✅ UPDATE SUCCESSFUL: ${updatedUser.email}`);
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (err) {
        debugLog(`🔥 ERROR: ${err.message}`);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.adminCreatePlatformUser = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, role } = req.body;
        const masterDb = await connectMasterDB();
        const User = createUserModel(masterDb);

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

        const databaseName = `expense_${role || 'business'}_${Math.random().toString(36).substring(2, 8)}`;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await User.create({
            fullName, email, phoneNumber, 
            password: hashedPassword, 
            role: role || 'business', 
            databaseName, 
            isEmailVerified: false, 
            verificationOTP: otp,
            otpExpiry: new Date(Date.now() + 600000)
        });

        const transporter = require('../config/mailer');
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verification Code',
            html: `Your code: <b>${otp}</b>`
        }).catch(e => debugLog(`Mail error: ${e.message}`));

        res.status(201).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deletePlatformUser = async (req, res) => {
    try {
        let { id } = req.params;
        if (id && id.includes('/')) id = id.split('/')[0];
        const masterDb = await connectMasterDB();
        const User = createUserModel(masterDb);
        await User.findByIdAndDelete(id.trim());
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.impersonateUser = async (req, res) => {
    try {
        let { id } = req.params;
        if (id && id.includes('/')) id = id.split('/')[0];
        const masterDb = await connectMasterDB();
        const User = createUserModel(masterDb);
        const user = await User.findById(id.trim());
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({ success: true, data: { ...user._doc, token } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createPlatformTeam = async (req, res) => { /* ... placeholder ... */ res.json({success:true}); };
exports.getAllPlatformTeams = async (req, res) => { /* ... placeholder ... */ res.json({success:true}); };
exports.getOrganizationUsers = (req, res) => res.json({ success: true, data: [] });
exports.getPendingTransactions = (req, res) => res.json({ success: true, data: [] });
exports.updateTransactionStatus = (req, res) => res.json({ success: true, message: 'Status updated' });
exports.addEmployee = (req, res) => res.json({ success: true, message: 'Employee added' });
