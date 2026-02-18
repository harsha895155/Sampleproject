const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, 'server/.env') });

const connectMasterDB = async () => {
    try {
        const conn = await mongoose.createConnection(process.env.MASTER_DB_URI).asPromise();
        console.log(`Connected to Master DB: ${conn.name}`);
        return conn;
    } catch (err) {
        console.error('Master DB Connection Error:', err);
        process.exit(1);
    }
};

const UserSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    role: String
}, { strict: false });

const checkUser = async () => {
    const conn = await connectMasterDB();
    const User = conn.model('User', UserSchema);
    
    const targetId = '698b7ee04905e169f340011c';
    console.log(`Searching for User ID: ${targetId}`);
    
    try {
        const user = await User.findById(targetId);
        if (user) {
            console.log('User Found:');
            console.log(JSON.stringify(user, null, 2));
        } else {
            console.log('User NOT found in database.');
        }
        
        // Let's also list first few users to see what IDs look like
        const someUsers = await User.find({}).limit(5);
        console.log('\nSample Users in DB:');
        someUsers.forEach(u => console.log(`${u._id} - ${u.email} (${u.role})`));
        
    } catch (err) {
        console.error('Error searching user:', err);
    } finally {
        await conn.close();
        process.exit(0);
    }
};

checkUser();
