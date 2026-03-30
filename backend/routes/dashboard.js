// backend/routes/dashboard.js
import express from 'express';
import db from '../db.js';
import auth from '../middleware/auth.js';
import { isAdmin } from '../middleware/role.js';

const router = express.Router();

// GET dashboard stats
router.get('/stats', auth, isAdmin, async(req, res) => {
    try {
        // Total penjualan hari ini
        const todaySales = await db.query(`
            SELECT COALESCE(SUM(total), 0) as total
            FROM transaction
            WHERE DATE(transaction_date) = CURRENT_DATE
        `);

        // Total transaksi hari ini
        const todayTransactions = await db.query(`
            SELECT COUNT(*) as count
            FROM transaction
            WHERE DATE(transaction_date) = CURRENT_DATE
        `);

        // Total produk
        const totalProducts = await db.query(`
            SELECT COUNT(*) as count FROM products
        `);

        // Total user
        const totalUsers = await db.query(`
            SELECT COUNT(*) as count FROM users
        `);

        // Produk dengan stok menipis (< 5)
        const lowStock = await db.query(`
            SELECT COUNT(*) as count
            FROM products
            WHERE stock < 5 AND stock > 0
        `);

        // Produk habis
        const outOfStock = await db.query(`
            SELECT COUNT(*) as count
            FROM products
            WHERE stock = 0
        `);

        res.json({
            success: true,
            data: {
                todaySales: parseFloat(todaySales.rows[0].total),
                todayTransactions: parseInt(todayTransactions.rows[0].count),
                totalProducts: parseInt(totalProducts.rows[0].count),
                totalUsers: parseInt(totalUsers.rows[0].count),
                lowStock: parseInt(lowStock.rows[0].count),
                outOfStock: parseInt(outOfStock.rows[0].count)
            }
        });

    } catch (err) {
        console.error('Dashboard stats error:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
});

export default router;