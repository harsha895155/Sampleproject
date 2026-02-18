const Category = require('../models/Category');

// @desc    Get all categories for a user
// @route   GET /api/categories
// @access  Private
exports.getCategories = async (req, res) => {
    try {
        // Get system categories (user is null) AND user specific categories
        const categories = await Category.find({
            $or: [
                { user: req.user.id },
                { user: null, organization: null }
            ]
        });

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Add a category
// @route   POST /api/categories
// @access  Private
exports.addCategory = async (req, res) => {
    try {
        const { name, type, icon, color } = req.body;

        const category = await Category.create({
            name,
            type,
            icon,
            color,
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            res.status(400).json({ error: messages });
        } else {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
        }
    }
};
