const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function checkUsers() {
    try {
        console.log('Connecting to:', process.env.MASTER_DB_URI);
        const conn = await mongoose.createConnection(process.env.MASTER_DB_URI);
        const UserSchema = new mongoose.Schema({
            email: String,
            fullName: String,
            role: String
        });
        const User = conn.model('User', UserSchema);
        const users = await User.find({}, 'email fullName role');
        console.log('--- User List ---');
        users.forEach(u => console.log(`${u.email} (${u.fullName}) - Role: ${u.role}`));
        console.log('-----------------');
        await conn.close();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();

