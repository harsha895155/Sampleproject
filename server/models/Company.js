const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, 'Please add a company name'],
        trim: true
    },
    industry: {
        type: String,
        required: [true, 'Please add an industry type']
    },
    budgetLimit: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Company', CompanySchema);
