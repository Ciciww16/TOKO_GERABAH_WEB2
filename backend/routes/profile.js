const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// GET /profile
router.get('/', authenticateToken, async(req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
        const user = result.rows[0];

        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;