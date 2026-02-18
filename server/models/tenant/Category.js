const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a category name'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    type: {
        type: String,
        enum: ['expense', 'income'],
        default: 'expense'
    },
    color: {
        type: String,
        default: '#6366F1'
    },
    icon: {
        type: String,
        default: '🏷️'
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate categories for the same user
CategorySchema.index({ name: 1, type: 1, createdBy: 1 }, { unique: true });

module.exports = {
    CategorySchema,
    createModel: (connection) => connection.model('Category', CategorySchema)
};
