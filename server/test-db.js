require('dotenv').config();
const mongoose = require('mongoose');
const { createModel: createUserModel } = require('./models/master/User');

async function testDB() {
    try {
        console.log('🔗 Connecting to:', process.env.MASTER_DB_URI);
        const connection = await mongoose.createConnection(process.env.MASTER_DB_URI, {
            serverSelectionTimeoutMS: 2000
        }).asPromise();
        
        console.log('✅ Connected to MongoDB');
        
        const User = connection.model('User', require('./models/master/User').UserSchema);
        
        const count = await User.countDocuments();
        console.log(`📊 Current user count: ${count}`);
        
        const testEmail = `test_${Date.now()}@example.com`;
        console.log(`📝 Attempting to create user: ${testEmail}`);
        
        const newUser = await User.create({
            fullName: 'Test User',
            email: testEmail,
            phoneNumber: '1234567890',
            password: 'hashed_password',
            role: 'admin',
            databaseName: 'test_db'
        });
        
        console.log('✅ User created successfully:', newUser._id);
        
        const foundUser = await User.findById(newUser._id);
        console.log('🔍 Verified user in DB:', foundUser.email);
        
        await User.deleteOne({ _id: newUser._id });
        console.log('🗑️ Test user deleted');
        
        await connection.close();
        console.log('🔌 Connection closed');
        process.exit(0);
    } catch (err) {
        console.error('❌ Database Test Failed:', err.message);
        if (err.stack) console.error(err.stack);
        process.exit(1);
    }
}

testDB();
