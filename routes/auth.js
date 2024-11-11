const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

router.post('/login', [
    body('f_userName').notEmpty().withMessage('Username is required'),
    body('f_Pwd').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { f_userName, f_Pwd } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ f_userName });
        
        if (user && await bcrypt.compare(f_Pwd, user.f_Pwd)) {
            // Generate JWT token with user ID and username
            const token = jwt.sign(
                { id: user._id, f_userName: user.f_userName }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1h' }
            );

            // Respond with the token and username
            res.json({ token, f_userName: user.f_userName });
        } else {
            res.status(401).json({ message: 'Invalid login details' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

