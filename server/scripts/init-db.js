const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('../models/Company');
const User = require('../models/User');
const Category = require('../models/Category');

dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:21017/expense_tracker');
        console.log('Connected to MongoDB');

        // Clear existing data
        await Company.deleteMany({});
        await User.deleteMany({});
        await Category.deleteMany({});

        // Create a default company
        const company = await Company.create({
            name: 'Default Corp',
            email: 'admin@default.com',
            settings: {
                currency: 'USD',
                fiscalYearStart: 1
            }
        });

        // Create default categories
        const categories = [
            { name: 'Salary', type: 'income', icon: 'DollarSign', color: '#10B981' },
            { name: 'Rent', type: 'expense', icon: 'Home', color: '#EF4444' },
            { name: 'Food', type: 'expense', icon: 'ShoppingBag', color: '#F59E0B' },
            { name: 'Travel', type: 'expense', icon: 'Map', color: '#3B82F6' }
        ];
        await Category.insertMany(categories);

        console.log('Database seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Seed failed:', err);
        process.exit(1);
    }
};

seedDB();
