const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, 'server/.env') });

const connectMasterDB = async () => {
    try {
        console.log(`Connecting to: ${process.env.MASTER_DB_URI}`);
        // Add timeout
        const conn = await mongoose.createConnection(process.env.MASTER_DB_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000
        }).asPromise();
        console.log(`Connected to Master DB: ${conn.name}`);
        return conn;
    } catch (err) {
        console.error('Master DB Connection Error:', err.message);
        process.exit(1);
    }
};

const deleteUserForce = async () => {
    try {
        const conn = await connectMasterDB();
        const UserSchema = new mongoose.Schema({}, { strict: false });
        const User = conn.model('User', UserSchema);
        
        const targetId = '698b7ee04905e169f340011c';
        console.log(`FORCE deleting User ID: ${targetId}`);
        
        const user = await User.findByIdAndDelete(targetId);
        if (user) {
            console.log('User Force Deleted Successfully:');
            console.log(JSON.stringify(user, null, 2));
        } else {
            console.log('User NOT found, might already be deleted.');
        }
        await conn.close();
    } catch (err) {
        console.error('Error in deletion script:', err.message);
    } finally {
        process.exit(0);
    }
};

deleteUserForce();
