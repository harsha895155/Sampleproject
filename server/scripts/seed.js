const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Transaction = require('../models/Transaction');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expense-tracker');
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Organization.deleteMany();
        await Transaction.deleteMany();

        console.log('Previous data cleared.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // 1. Create Organization
        const orgId = new mongoose.Types.ObjectId();
        const adminId = new mongoose.Types.ObjectId();

        const org = await Organization.create({
            _id: orgId,
            name: 'Pixel Tech Solutions',
            admin: adminId,
            budgetLimit: 5000,
            currency: 'USD'
        });

        // 2. Create Admin User
        const admin = await User.create({
            _id: adminId,
            username: 'admin',
            email: 'admin@pixel.com',
            password: hashedPassword,
            role: 'admin',
            organization: orgId
        });

        // 3. Create Employee
        const employee = await User.create({
            username: 'john_employee',
            email: 'john@pixel.com',
            password: hashedPassword,
            role: 'employee',
            department: 'Development',
            organization: orgId
        });

        // 4. Create Individual User
        const individual = await User.create({
            username: 'jane_doe',
            email: 'jane@example.com',
            password: hashedPassword,
            role: 'user'
        });

        // 5. Create Sample Transactions
        const transactions = [
            // Admin transactions (Org expenses)
            { user: adminId, type: 'expense', amount: 1200, category: 'Rent', description: 'Office Rent - Feb', status: 'approved' },
            { user: adminId, type: 'income', amount: 8000, category: 'Business', description: 'Client Project Alpha', status: 'approved' },
            
            // Employee transactions (Pending)
            { user: employee._id, type: 'expense', amount: 45.50, category: 'Travel', description: 'Uber to Client Office', status: 'pending' },
            { user: employee._id, type: 'expense', amount: 12.00, category: 'Food', description: 'Team Coffee', status: 'pending' },

            // Individual transactions
            { user: individual._id, type: 'income', amount: 3000, category: 'Salary', description: 'Jan Salary', status: 'approved' },
            { user: individual._id, type: 'expense', amount: 60, category: 'Food', description: 'Grocery shopping', status: 'approved' },
            { user: individual._id, type: 'expense', amount: 15, category: 'Entertainment', description: 'Netflix Subscription', status: 'approved' },
            { user: individual._id, type: 'expense', amount: 200, category: 'Rent', description: 'Utilities', status: 'approved' }
        ];

        await Transaction.insertMany(transactions);

        console.log('Database Seeded Successfully!');
        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedData();
