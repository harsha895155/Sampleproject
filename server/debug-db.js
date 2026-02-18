const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const logFile = 'debug_db.log';
function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

async function test() {
    fs.writeFileSync(logFile, '--- Debug Start ---\n');
    log('URI: ' + process.env.MASTER_DB_URI);
    try {
        log('Connecting...');
        await mongoose.connect(process.env.MASTER_DB_URI, { serverSelectionTimeoutMS: 5000 });
        log('✅ Connected');
        
        const count = await mongoose.connection.db.listCollections().toArray();
        log('Collections: ' + JSON.stringify(count.map(c => c.name)));
        
        await mongoose.disconnect();
        log('✅ Disconnected');
    } catch (err) {
        log('❌ Error: ' + err.message);
    }
    log('--- Debug End ---');
    process.exit();
}

test();
