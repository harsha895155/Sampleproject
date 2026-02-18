const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'dark'
    },
    notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        monthlyReport: { type: Boolean, default: true }
    },
    dateFormat: {
        type: String,
        default: 'DD/MM/YYYY'
    }
}, {
    timestamps: true
});

module.exports = {
    SettingsSchema,
    createModel: (connection) => connection.model('Settings', SettingsSchema)
};
