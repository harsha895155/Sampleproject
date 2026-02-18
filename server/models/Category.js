const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a category name'],
        trim: true
    },
    type: {
        type: String,
        enum: ['expense', 'income'],
        required: true
    },
    createdBy: {
        type: String,
        enum: ['system', 'user'],
        default: 'system'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function() { return this.createdBy === 'user'; }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Category', CategorySchema);
