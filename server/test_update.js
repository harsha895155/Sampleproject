const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });

const OUTPUT = path.join(__dirname, 'test_result.txt');
const log = (msg) => {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    fs.appendFileSync(OUTPUT, line);
};

// Clear previous results
fs.writeFileSync(OUTPUT, '=== DB UPDATE TEST ===\n');

async function main() {
    try {
        log('URI: ' + (process.env.MASTER_DB_URI ? 'SET' : 'MISSING'));
        
        const conn = await mongoose.createConnection(process.env.MASTER_DB_URI, {
            serverSelectionTimeoutMS: 5000
        }).asPromise();
        
        log('Connected to DB: ' + conn.name + ' (state: ' + conn.readyState + ')');

        const { UserSchema } = require('./models/master/User');
        const User = conn.models.User || conn.model('User', UserSchema);

        const allUsers = await User.find({}).select('fullName email role').lean();
        log('Total users: ' + allUsers.length);
        allUsers.forEach(u => log(`  - ${u.email} | ${u.fullName} | ${u.role} | ID: ${u._id}`));

        if (allUsers.length === 0) {
            log('FAIL: No users in DB');
            await conn.close();
            process.exit(0);
        }

        // Test update on first user
        const testUser = allUsers[0];
        log(`\nTesting update on: ${testUser.email} (ID: ${testUser._id})`);

        const result = await User.findByIdAndUpdate(
            testUser._id,
            { $set: { fullName: testUser.fullName + ' [TEST]' } },
            { new: true }
        );

        log('After update: ' + result.fullName);

        // Verify from fresh read
        const verify = await User.findById(testUser._id).lean();
        log('Verified in DB: ' + verify.fullName);

        if (verify.fullName.includes('[TEST]')) {
            log('✅ SUCCESS: DB update works!');
            // Revert
            await User.findByIdAndUpdate(testUser._id, { $set: { fullName: testUser.fullName } });
            log('Reverted to original name.');
        } else {
            log('❌ FAIL: DB did not update.');
        }

        await conn.close();
        log('Done.');
    } catch (err) {
        log('ERROR: ' + err.message);
        log('Stack: ' + err.stack);
    }
    process.exit(0);
}

main();
