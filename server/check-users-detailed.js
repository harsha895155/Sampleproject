const mongoose = require('mongoose');
require('dotenv').config();
const { createModel: createUserModel } = require('./models/master/User');

async function count() {
    try {
        const conn = await mongoose.createConnection(process.env.MASTER_DB_URI).asPromise();
        const User = createUserModel(conn);
        const users = await User.find({}).lean();
        console.log('COUNT:' + users.length);
        users.forEach(u => console.log('USER:' + u.email + '|' + u.role + '|' + u.isEmailVerified));
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
count();
