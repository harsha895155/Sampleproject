const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    source: {
        type: String,
        required: [true, 'Please add an income source'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    incomeDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

IncomeSchema.index({ userId: 1, incomeDate: -1 });

module.exports = mongoose.model('Income', IncomeSchema);
