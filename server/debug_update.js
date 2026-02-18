const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const connectMasterDB = require('./config/masterDb');
const { createModel: createUserModel } = require('./models/master/User');

async function debugUpdate() {
    try {
        console.log('--- START DEBUG UPDATE ---');
        const db = await connectMasterDB();
        const User = createUserModel(db);

        const users = await User.find({}).limit(1);
        if (users.length === 0) {
            console.log('❌ No users found to test update.');
            process.exit(0);
        }

        const testUser = users[0];
        console.log(`🎯 Testing update on: ${testUser.email} (Current Name: ${testUser.fullName})`);

        const originalName = testUser.fullName;
        const newName = originalName + ' (Updated)';

        testUser.fullName = newName;
        await testUser.save();
        console.log('✅ Local save() called.');

        const verifiedUser = await User.findById(testUser._id);
        console.log(`🔍 Verification - Name in DB: ${verifiedUser.fullName}`);

        if (verifiedUser.fullName === newName) {
            console.log('🎊 SUCCESS: Data updated in MongoDB.');
        } else {
            console.log('💀 FAILURE: Data did not change in MongoDB.');
        }

        // Revert change
        verifiedUser.fullName = originalName;
        await verifiedUser.save();
        console.log('🔙 Reverted change to original.');

        process.exit(0);
    } catch (err) {
        console.error('🔥 Error:', err);
        process.exit(1);
    }
}

debugUpdate();
