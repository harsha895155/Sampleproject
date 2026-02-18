const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const auditLog = require('../middleware/auditLogger');
const { 
    getTransactions, 
    addTransaction, 
    deleteTransaction, 
    updateTransaction, 
    getStats,
    getCategoryStats,
    getMonthlyStats
} = require('../controllers/transactionController');

router.use(protect); // All routes are protected

router.route('/')
    .get(getTransactions)
    .post(auditLog('Added Transaction'), addTransaction);

router.route('/stats')
    .get(getStats);

router.route('/category-stats')
    .get(getCategoryStats);

router.route('/monthly-stats')
    .get(getMonthlyStats);

router.route('/:id')
    .put(auditLog('Updated Transaction'), updateTransaction)
    .delete(auditLog('Deleted Transaction'), deleteTransaction);

module.exports = router;
