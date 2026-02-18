require('dotenv').config();
const mongoose = require('mongoose');

async function test() {
    console.log('Testing DB connection...');
    try {
        const conn = await mongoose.connect(process.env.MASTER_DB_URI);
        console.log('✅ Connected successfully to:', process.env.MASTER_DB_URI);
        
        const testSchema = new mongoose.Schema({ name: String });
        const TestModel = mongoose.model('ConnectionTest', testSchema);
        
        await TestModel.deleteMany({});
        const doc = await TestModel.create({ name: 'test' });
        console.log('✅ Created document:', doc._id);
        
        const found = await TestModel.findById(doc._id);
        console.log('✅ Found document:', found.name);
        
        await mongoose.disconnect();
        console.log('✅ Disconnected');
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

test();
