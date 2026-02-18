const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { createModel: createUserModel } = require('./models/master/User');
const connectMasterDB = require('./config/masterDb');

const adminLogFile = path.join(__dirname, 'admin_debug_test.log');
function adminFileLog(msg) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(adminLogFile, `[${timestamp}] ${msg}\n`);
}

async function test() {
    try {
        adminFileLog('Testing getAllPlatformUsers logic...');
        const masterDb = await connectMasterDB();
        const User = masterDb.models.User || createUserModel(masterDb);

        const allUsers = await User.find({}).select('-password').lean();
        adminFileLog(`Total records: ${allUsers.length}`);

        let resultData = allUsers.filter(u => 
            u.isEmailVerified === true || 
            u.role === 'administrator' || 
            u.role === 'admin'
        );
        adminFileLog(`Filtered users: ${resultData.length}`);

        console.log('SUCCESS');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE:', err.message);
        process.exit(1);
    }
}

test();
