const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to Master DB User ID (logical reference)
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

AuditLogSchema.index({ performedBy: 1, timestamp: -1 });

module.exports = {
    AuditLogSchema,
    createModel: (connection) => connection.model('AuditLog', AuditLogSchema)
};
