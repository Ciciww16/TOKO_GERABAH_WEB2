// backend/routes/categories.js
import express from 'express';
import db from '../db.js';
import auth from '../middleware/auth.js';
import { isAdmin } from '../middleware/role.js';

const router = express.Router();

// ============================================
// GET ALL CATEGORIES
// ============================================
router.get('/', auth, async(req, res) => {
    try {
        const categories = await db.query(
            'SELECT id, name, description FROM categories ORDER BY id'
        );

        const categoriesWithCount = await Promise.all(
            categories.rows.map(async(cat) => {
                const productCount = await db.query(
                    'SELECT COUNT(*) FROM products WHERE category_id = $1', [cat.id]
                );
                return {
                    id: cat.id,
                    name: cat.name,
                    description: cat.description,
                    product_count: parseInt(productCount.rows[0].count)
                };
            })
        );

        res.json(categoriesWithCount);
    } catch (err) {
        console.error('Get categories error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ============================================
// GET CATEGORY BY ID
// ============================================
router.get('/:id', auth, async(req, res) => {
    try {
        const { id } = req.params;
        const category = await db.query(
            'SELECT id, name, description FROM categories WHERE id = $1', [id]
        );

        if (category.rows.length === 0) {
            return res.status(404).json({ msg: 'Kategori tidak ditemukan' });
        }

        res.json(category.rows[0]);
    } catch (err) {
        console.error('Get category error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ============================================
// CREATE CATEGORY (ADMIN ONLY)
// ============================================
router.post('/', auth, isAdmin, async(req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ msg: 'Nama kategori harus diisi' });
        }

        const newCategory = await db.query(
            'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id, name, description', [name, description || '']
        );

        res.status(201).json({
            msg: 'Kategori berhasil ditambahkan',
            category: newCategory.rows[0]
        });
    } catch (err) {
        console.error('Create category error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ============================================
// UPDATE CATEGORY (ADMIN ONLY)
// ============================================
router.put('/:id', auth, isAdmin, async(req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const updatedCategory = await db.query(
            'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING id, name, description', [name, description, id]
        );

        if (updatedCategory.rows.length === 0) {
            return res.status(404).json({ msg: 'Kategori tidak ditemukan' });
        }

        res.json({
            msg: 'Kategori berhasil diupdate',
            category: updatedCategory.rows[0]
        });
    } catch (err) {
        console.error('Update category error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ============================================
// DELETE CATEGORY (ADMIN ONLY)
// ============================================
router.delete('/:id', auth, isAdmin, async(req, res) => {
    try {
        const { id } = req.params;

        const products = await db.query(
            'SELECT id FROM products WHERE category_id = $1 LIMIT 1', [id]
        );

        if (products.rows.length > 0) {
            return res.status(400).json({
                msg: 'Kategori tidak bisa dihapus karena masih memiliki produk'
            });
        }

        const deleted = await db.query(
            'DELETE FROM categories WHERE id = $1 RETURNING id', [id]
        );

        if (deleted.rows.length === 0) {
            return res.status(404).json({ msg: 'Kategori tidak ditemukan' });
        }

        res.json({ msg: 'Kategori berhasil dihapus' });
    } catch (err) {
        console.error('Delete category error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;