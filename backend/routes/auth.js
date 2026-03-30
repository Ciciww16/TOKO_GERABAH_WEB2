// backend/routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ============================================
// LOGIN
// ============================================
router.post('/login', async(req, res) => {
    try {
        const { name, password } = req.body;

        console.log('📝 Login attempt:', { name });
        console.log('🔐 Password received:', password);

        if (!name || !password) {
            return res.status(400).json({ msg: 'Nama dan password harus diisi' });
        }

        // Cari user berdasarkan name
        const userQuery = await db.query(
            'SELECT id, name, email, password, role FROM users WHERE name = $1', [name]
        );

        console.log('👤 User found:', userQuery.rows.length > 0 ? '✅ Yes' : '❌ No');

        if (userQuery.rows.length === 0) {
            return res.status(401).json({ msg: 'Nama atau password salah' });
        }

        const user = userQuery.rows[0];
        console.log('🔑 Password in DB (hash):', user.password.substring(0, 30) + '...');

        // 🔥 VERIFIKASI PASSWORD DENGAN BCRYPT
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('🔐 Password match:', validPassword ? '✅ Yes' : '❌ No');

        if (!validPassword) {
            return res.status(401).json({ msg: 'Nama atau password salah' });
        }

        // Generate token
        const token = jwt.sign({ id: user.id, name: user.name, role: user.role },
            process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' }
        );

        console.log('✅ Login successful for:', user.name);

        res.json({
            msg: 'Login berhasil',
            token,
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });

    } catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ============================================
// REGISTER
// ============================================
router.post('/register', async(req, res) => {
    try {
        const { name, email, password, role = 'customer' } = req.body;

        console.log('📝 Register attempt:', { name, email, role });

        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'Semua field harus diisi' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: 'Format email tidak valid' });
        }

        if (password.length < 6) {
            return res.status(400).json({ msg: 'Password minimal 6 karakter' });
        }

        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1 OR name = $2', [email, name]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ msg: 'Email atau nama sudah digunakan' });
        }

        // 🔥 HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at', [name, email, hashedPassword, role]
        );

        console.log('✅ User registered successfully:', newUser.rows[0].name);

        res.status(201).json({
            msg: 'Registrasi berhasil',
            user: newUser.rows[0]
        });

    } catch (err) {
        console.error('❌ Register error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ============================================
// LOGOUT
// ============================================
router.post('/logout', auth, async(req, res) => {
    try {
        res.json({ msg: 'Logout berhasil' });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ============================================
// GET PROFILE
// ============================================
router.get('/profile', auth, async(req, res) => {
    try {
        const userQuery = await db.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = $1', [req.user.id]
        );

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ msg: 'User tidak ditemukan' });
        }

        res.json({ user: userQuery.rows[0] });
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ============================================
// VERIFY TOKEN
// ============================================
router.get('/verify', auth, (req, res) => {
    res.json({
        msg: 'Token valid',
        user: {
            id: req.user.id,
            name: req.user.name,
            role: req.user.role
        }
    });
});

// ============================================
// ⚠️ INI YANG PENTING - EXPORT DEFAULT
// ============================================
export default router;