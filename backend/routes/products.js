// backend/routes/products.js
import express from 'express';
import db from '../db.js';
import auth from '../middleware/auth.js';
import { isAdmin } from '../middleware/role.js';

const router = express.Router();

// ============================================
// GET ALL PRODUCTS
// ============================================
router.get('/', auth, async(req, res) => {
    try {
        const products = await db.query(
            'SELECT id, name, price, stock, description, category_id FROM products ORDER BY id'
        );
        res.json(products.rows);
    } catch (err) {
        console.error('Get products error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ============================================
// GET PRODUCT BY ID
// ============================================
router.get('/:id', auth, async(req, res) => {
    try {
        const { id } = req.params;
        const product = await db.query(
            'SELECT id, name, price, stock, description, category_id FROM products WHERE id = $1', [id]
        );

        if (product.rows.length === 0) {
            return res.status(404).json({ msg: 'Produk tidak ditemukan' });
        }

        res.json(product.rows[0]);
    } catch (err) {
        console.error('Get product error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ============================================
// GET PRODUCT STOCK
// ============================================
router.get('/:id/stock', auth, async(req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'SELECT stock FROM products WHERE id = $1', [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Produk tidak ditemukan' });
        }

        res.json({ stock: result.rows[0].stock });
    } catch (err) {
        console.error('Get stock error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ============================================
// CREATE PRODUCT (ADMIN ONLY)
// ============================================
router.post('/', auth, isAdmin, async(req, res) => {
    try {
        const { name, category_id, price, stock, description } = req.body;

        if (!name || !price) {
            return res.status(400).json({ msg: 'Nama dan harga harus diisi' });
        }

        const newProduct = await db.query(
            'INSERT INTO products (name, category_id, price, stock, description) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, price, stock', [name, category_id || null, price, stock || 0, description || '']
        );

        res.status(201).json({
            msg: 'Produk berhasil ditambahkan',
            product: newProduct.rows[0]
        });
    } catch (err) {
        console.error('Create product error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ============================================
// UPDATE PRODUCT (ADMIN ONLY)
// ============================================
router.put('/:id', auth, isAdmin, async(req, res) => {
    try {
        const { id } = req.params;
        const { name, category_id, price, stock, description } = req.body;

        const updatedProduct = await db.query(
            'UPDATE products SET name = $1, category_id = $2, price = $3, stock = $4, description = $5 WHERE id = $6 RETURNING id', [name, category_id, price, stock, description, id]
        );

        if (updatedProduct.rows.length === 0) {
            return res.status(404).json({ msg: 'Produk tidak ditemukan' });
        }

        res.json({ msg: 'Produk berhasil diupdate' });
    } catch (err) {
        console.error('Update product error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ============================================
// DELETE PRODUCT (ADMIN ONLY)
// ============================================
router.delete('/:id', auth, isAdmin, async(req, res) => {
    try {
        const { id } = req.params;

        const inTransactions = await db.query(
            'SELECT id FROM transaction_item WHERE product_id = $1 LIMIT 1', [id]
        );

        if (inTransactions.rows.length > 0) {
            return res.status(400).json({
                msg: 'Produk tidak bisa dihapus karena sudah pernah ditransaksikan'
            });
        }

        const deleted = await db.query(
            'DELETE FROM products WHERE id = $1 RETURNING id', [id]
        );

        if (deleted.rows.length === 0) {
            return res.status(404).json({ msg: 'Produk tidak ditemukan' });
        }

        res.json({ msg: 'Produk berhasil dihapus' });
    } catch (err) {
        console.error('Delete product error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;