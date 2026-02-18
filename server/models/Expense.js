const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default: null
    },
    amount: {
        type: Number,
        required: [true, 'Please add an expense amount']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    paymentMode: {
        type: String,
        enum: ['cash', 'card', 'upi', 'bank'],
        default: 'cash'
    },
    description: {
        type: String,
        trim: true
    },
    expenseDate: {
        type: Date,
        default: Date.now
    },
    receiptUrl: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
ExpenseSchema.index({ userId: 1, expenseDate: -1 });
ExpenseSchema.index({ companyId: 1, status: 1 });

module.exports = mongoose.model('Expense', ExpenseSchema);
