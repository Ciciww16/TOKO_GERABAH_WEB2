// backend/routes/transaction.js
import express from 'express';
import db from '../db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ============================================
// GET TRANSACTIONS BY USER ID
// ============================================
router.get('/user/:userId', auth, async(req, res) => {
    try {
        const { userId } = req.params;

        console.log(`Fetching transactions for user ID: ${userId}`);

        // Query untuk mendapatkan transaksi user
        const transactions = await db.query(`
      SELECT 
        t.id, 
        t.user_id, 
        t.total, 
        t.transaction_date,
        u.name as user_name
      FROM transaction t
      JOIN users u ON t.user_id = u.id
      WHERE t.user_id = $1
      ORDER BY t.transaction_date DESC
    `, [userId]);

        console.log(`Found ${transactions.rows.length} transactions`);

        // Untuk setiap transaksi, ambil itemnya
        const result = await Promise.all(transactions.rows.map(async(tx) => {
            const items = await db.query(`
        SELECT 
          ti.id,
          ti.product_id,
          p.name as product_name,
          ti.quantity,
          ti.subtotal
        FROM transaction_item ti
        JOIN products p ON ti.product_id = p.id
        WHERE ti.transaction_id = $1
      `, [tx.id]);

            return {
                id: tx.id,
                user_id: tx.user_id,
                user_name: tx.user_name,
                total: parseFloat(tx.total),
                transaction_date: tx.transaction_date,
                items: items.rows,
                invoice: `INV-${new Date(tx.transaction_date).getFullYear()}${String(new Date(tx.transaction_date).getMonth()+1).padStart(2,'0')}${String(new Date(tx.transaction_date).getDate()).padStart(2,'0')}-${tx.id}`
            };
        }));

        res.json(result);

    } catch (err) {
        console.error('❌ Get user transactions error:', err);
        res.status(500).json({
            msg: 'Server error',
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// ============================================
// GET ALL TRANSACTIONS (ADMIN & CASHIER)
// ============================================
router.get('/', auth, async(req, res) => {
    try {
        if (req.user.role === 'customer') {
            return res.status(403).json({ msg: 'Akses ditolak' });
        }

        const transactions = await db.query(`
      SELECT 
        t.id, 
        t.user_id, 
        t.total, 
        t.transaction_date,
        u.name as customer_name
      FROM transaction t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.transaction_date DESC
    `);

        const result = await Promise.all(transactions.rows.map(async(tx) => {
            const items = await db.query(`
        SELECT 
          ti.id,
          ti.product_id,
          p.name as product_name,
          ti.quantity,
          ti.subtotal
        FROM transaction_item ti
        JOIN products p ON ti.product_id = p.id
        WHERE ti.transaction_id = $1
      `, [tx.id]);

            return {
                id: tx.id,
                user_id: tx.user_id,
                customer: tx.customer_name,
                total: parseFloat(tx.total),
                transaction_date: tx.transaction_date,
                items: items.rows,
                invoice: `INV-${new Date(tx.transaction_date).getFullYear()}${String(new Date(tx.transaction_date).getMonth()+1).padStart(2,'0')}${String(new Date(tx.transaction_date).getDate()).padStart(2,'0')}-${tx.id}`
            };
        }));

        res.json(result);

    } catch (err) {
        console.error('❌ Get all transactions error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ============================================
// CREATE TRANSACTION (CHECKOUT)
// ============================================
router.post('/', auth, async(req, res) => {
    const client = await db.connect();

    try {
        const { user_id, total, items } = req.body;

        console.log('📦 Transaction request:', { user_id, total, items });

        if (!user_id || !total || !items || items.length === 0) {
            return res.status(400).json({ msg: 'Data transaksi tidak lengkap' });
        }

        await client.query('BEGIN');

        // INSERT KE TABLE TRANSACTION
        const transactionResult = await client.query(
            'INSERT INTO transaction (user_id, total, transaction_date) VALUES ($1, $2, NOW()) RETURNING id', [user_id, total]
        );

        const transactionId = transactionResult.rows[0].id;
        console.log('✅ Transaction created with ID:', transactionId);

        // INSERT KE TRANSACTION_ITEM DAN UPDATE STOK
        for (const item of items) {
            // Cek stok
            const stockCheck = await client.query(
                'SELECT stock FROM products WHERE id = $1', [item.product_id]
            );

            if (stockCheck.rows.length === 0) {
                throw new Error(`Produk ID ${item.product_id} tidak ditemukan`);
            }

            if (stockCheck.rows[0].stock < item.quantity) {
                throw new Error(`Stok tidak cukup untuk produk ID ${item.product_id}`);
            }

            // Insert item
            await client.query(
                'INSERT INTO transaction_item (transaction_id, product_id, quantity, subtotal) VALUES ($1, $2, $3, $4)', [transactionId, item.product_id, item.quantity, item.subtotal]
            );

            // Update stok
            await client.query(
                'UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]
            );
        }

        await client.query('COMMIT');

        const date = new Date();
        const invoice = `INV-${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}-${transactionId}`;

        res.status(201).json({
            msg: 'Transaksi berhasil',
            transaction_id: transactionId,
            invoice
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Transaction error:', err);
        res.status(500).json({ msg: `Server error: ${err.message}` });
    } finally {
        client.release();
    }
});

export default router;