const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['login_alert', 'account_created', 'transaction', 'admin_action', 'system', 'create_user'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: '🔔'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    emailSent: {
        type: Boolean,
        default: false
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Index for efficient queries
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });

module.exports = {
    NotificationSchema,
    createModel: (connection) => connection.models.Notification || connection.model('Notification', NotificationSchema)
};
