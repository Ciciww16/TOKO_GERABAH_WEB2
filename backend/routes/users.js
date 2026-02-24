const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Activate / Deactivate user → admin only
router.put('/:id/status', auth, role(['admin']), async(req, res) => {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
        return res.status(400).json({ msg: 'is_active harus boolean' });
    }

    try {
        const result = await pool.query(
            'UPDATE users SET is_active=$1 WHERE id=$2 RETURNING id,name,email,role,is_active', [is_active, id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ msg: 'User tidak ditemukan' });

        res.json({
            msg: is_active ? 'User diaktifkan' : 'User dinonaktifkan',
            user: result.rows[0],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;