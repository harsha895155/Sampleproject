const mongoose = require('mongoose');
const uri = 'mongodb://127.0.0.1:27017/auth_db';

console.log('--- DB CONNECTION TEST ---');
console.log('Connecting to:', uri);

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('✅ SUCCESS: Connected to MongoDB');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ FAILURE:', err.message);
        process.exit(1);
    });

setTimeout(() => {
    console.log('⏰ TIMEOUT: Still waiting for MongoDB...');
    process.exit(1);
}, 10000);
