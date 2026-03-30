// backend/routes/profile.js
import express from 'express';
import db from '../db.js';
import auth from '../middleware/auth.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// GET profile user sendiri
router.get('/', auth, async(req, res) => {
    try {
        const user = await db.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = $1', [req.user.id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ msg: 'User tidak ditemukan' });
        }

        res.json({ success: true, user: user.rows[0] });
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// PUT update profile
router.put('/', auth, async(req, res) => {
    try {
        const { name, email } = req.body;

        // Cek email sudah dipakai user lain
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1 AND id != $2', [email, req.user.id]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ msg: 'Email sudah digunakan user lain' });
        }

        const updated = await db.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role', [name, email, req.user.id]
        );

        res.json({
            success: true,
            msg: 'Profil berhasil diupdate',
            user: updated.rows[0]
        });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// PUT change password
router.put('/password', auth, async(req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Ambil user dari database
        const user = await db.query(
            'SELECT password FROM users WHERE id = $1', [req.user.id]
        );

        // Verifikasi password lama
        if (currentPassword !== user.rows[0].password) {
            return res.status(401).json({ msg: 'Password lama salah' });
        }

        // Hash password baru
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.query(
            'UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.user.id]
        );

        res.json({ success: true, msg: 'Password berhasil diubah' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;