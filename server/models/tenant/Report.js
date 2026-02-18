 const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly', 'custom'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalIncome: {
        type: Number,
        default: 0
    },
    totalExpense: {
        type: Number,
        default: 0
    },
    categoryBreakdown: {
        type: Map,
        of: Number
    },
    generatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = {
    ReportSchema,
    createModel: (connection) => connection.model('Report', ReportSchema)
};
