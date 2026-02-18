// const mongoose = require('mongoose');

// const IncomeSchema = new mongoose.Schema({
//     source: {
//         type: String,
//         required: [true, 'Source is required'],
//         trim: true
//     },
//     amount: {
//         type: Number,
//         required: [true, 'Amount is required']
//     },
//     category: {
//         type: String,
//         required: [true, 'Category is required']
//     },
//     description: {
//         type: String,
//         trim: true
//     },
//     date: {
//         type: Date,
//         default: Date.now
//     },
//     paymentMethod: {
//         type: String,
//         enum: ['Cash', 'Bank Transfer', 'Cheque', 'Other'],
//         default: 'Bank Transfer'
//     },
//     createdBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true
//     }
// }, {
//     timestamps: true
// });

// module.exports = {
//     IncomeSchema,
//     createModel: (connection) => connection.model('Income', IncomeSchema)
// };


const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    source: {
        type: String,
        required: [true, 'Source is required'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Bank Transfer', 'Cheque', 'Other'],
        default: 'Bank Transfer'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
});

module.exports = {
    IncomeSchema,
    createModel: (connection) => connection.model('Income', IncomeSchema)
};
