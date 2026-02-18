/**
 * Middleware to log specific actions
 * @param {string} action - The action description
 */
const auditLog = (action) => {
    return async (req, res, next) => {
        const originalSend = res.send;
        
        res.send = function (data) {
            // Log only successful operations
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const logEntry = {
                    action,
                    performedBy: req.user ? req.user._id : null,
                    targetId: req.params.id || null,
                    details: {
                        method: req.method,
                        url: req.originalUrl,
                        body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined
                    },
                    timestamp: new Date()
                };

                // Save log entry to tenant database without blocking the response
                if (req.tenantModels && req.tenantModels.AuditLog) {
                    req.tenantModels.AuditLog.create(logEntry).catch(err => console.error('Audit Log Error (Tenant):', err));
                } else {
                    console.warn('Audit Log Skipped: No tenant database resolved');
                }
            }
            
            originalSend.call(this, data);
        };
        
        next();
    };
};

module.exports = auditLog;
