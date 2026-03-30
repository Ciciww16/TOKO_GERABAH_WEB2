// backend/routes/users.js
import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js';
import auth from '../middleware/auth.js';
import { isAdmin } from '../middleware/role.js';

const router = express.Router();

// ============================================
// GET ALL USERS (ADMIN ONLY)
// ============================================
router.get('/', auth, isAdmin, async(req, res) => {
    try {
        const users = await db.query(`
      SELECT id, name, email, role, 
             CASE WHEN is_active THEN 'Aktif' ELSE 'Nonaktif' END as status
      FROM users
      ORDER BY id
    `);

        res.json({
            success: true,
            users: users.rows
        });

    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({
            success: false,
            msg: 'Server error'
        });
    }
});

// ============================================
// GET USER BY ID (ADMIN ONLY)
// ============================================
router.get('/:id', auth, isAdmin, async(req, res) => {
    try {
        const { id } = req.params;
        const user = await db.query(
            'SELECT id, name, email, role, is_active, created_at FROM users WHERE id = $1', [id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'User tidak ditemukan'
            });
        }

        res.json({
            success: true,
            user: user.rows[0]
        });

    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({
            success: false,
            msg: 'Server error'
        });
    }
});

// ============================================
// CREATE NEW USER (ADMIN ONLY)
// ============================================
router.post('/', auth, isAdmin, async(req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validasi input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                msg: 'Nama, email, dan password harus diisi'
            });
        }

        // Validasi email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                msg: 'Format email tidak valid'
            });
        }

        // Validasi password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                msg: 'Password minimal 6 karakter'
            });
        }

        // Cek email sudah terdaftar
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1', [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                msg: 'Email sudah digunakan'
            });
        }

        // 🔥 HASH PASSWORD DENGAN BCRYPT
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user baru
        const newUser = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role', [name, email, hashedPassword, role]
        );

        res.status(201).json({
            success: true,
            msg: 'User berhasil ditambahkan',
            user: newUser.rows[0]
        });

    } catch (err) {
        console.error('Create user error:', err);
        res.status(500).json({
            success: false,
            msg: 'Server error'
        });
    }
});

// ============================================
// UPDATE USER (ADMIN ONLY)
// ============================================
router.put('/:id', auth, isAdmin, async(req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

        // Cek apakah user ada
        const existingUser = await db.query(
            'SELECT id FROM users WHERE id = $1', [id]
        );

        if (existingUser.rows.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'User tidak ditemukan'
            });
        }

        // Cek email sudah dipakai user lain
        const emailCheck = await db.query(
            'SELECT id FROM users WHERE email = $1 AND id != $2', [email, id]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(400).json({
                success: false,
                msg: 'Email sudah digunakan user lain'
            });
        }

        let query = 'UPDATE users SET name = $1, email = $2, role = $3';
        let params = [name, email, role];

        // Jika password diisi, update juga password
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    msg: 'Password minimal 6 karakter'
                });
            }

            // 🔥 HASH PASSWORD BARU
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', password = $4';
            params.push(hashedPassword);
        }

        query += ' WHERE id = $' + (params.length + 1) + ' RETURNING id';
        params.push(id);

        await db.query(query, params);

        res.json({
            success: true,
            msg: 'User berhasil diupdate'
        });

    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({
            success: false,
            msg: 'Server error'
        });
    }
});

// ============================================
// DELETE USER (ADMIN ONLY)
// ============================================
router.delete('/:id', auth, isAdmin, async(req, res) => {
    try {
        const { id } = req.params;

        // Cek apakah user memiliki transaksi
        const hasTransactions = await db.query(
            'SELECT id FROM transaction WHERE user_id = $1 LIMIT 1', [id]
        );

        if (hasTransactions.rows.length > 0) {
            return res.status(400).json({
                success: false,
                msg: 'User tidak bisa dihapus karena memiliki riwayat transaksi'
            });
        }

        const deleted = await db.query(
            'DELETE FROM users WHERE id = $1 RETURNING id', [id]
        );

        if (deleted.rows.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'User tidak ditemukan'
            });
        }

        res.json({
            success: true,
            msg: 'User berhasil dihapus'
        });

    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({
            success: false,
            msg: 'Server error'
        });
    }
});

// ============================================
// DEACTIVATE USER (ADMIN ONLY)
// ============================================
router.put('/:id/deactivate', auth, isAdmin, async(req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'UPDATE users SET is_active = false WHERE id = $1 RETURNING id', [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'User tidak ditemukan'
            });
        }

        res.json({
            success: true,
            msg: 'User berhasil dinonaktifkan'
        });

    } catch (err) {
        console.error('Deactivate user error:', err);
        res.status(500).json({
            success: false,
            msg: 'Server error'
        });
    }
});

// ============================================
// ACTIVATE USER (ADMIN ONLY)
// ============================================
router.put('/:id/activate', auth, isAdmin, async(req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'UPDATE users SET is_active = true WHERE id = $1 RETURNING id', [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'User tidak ditemukan'
            });
        }

        res.json({
            success: true,
            msg: 'User berhasil diaktifkan'
        });

    } catch (err) {
        console.error('Activate user error:', err);
        res.status(500).json({
            success: false,
            msg: 'Server error'
        });
    }
});

export default router;