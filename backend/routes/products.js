const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// ================= GET ALL PRODUCTS → Semua yang login =================
router.get("/", auth, async(req, res) => {
    try {
        const result = await pool.query(`
      SELECT p.id, p.name, p.category_id, c.name AS category_name, p.price, p.stock, p.description, p.is_active
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.is_active IS DISTINCT FROM false
      ORDER BY p.id ASC
    `);
        res.json({ msg: "All active products", data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

// ================= GET PRODUCT BY ID → Semua yang login =================
router.get("/:id", auth, async(req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
      SELECT p.id, p.name, p.category_id, c.name AS category_name, p.price, p.stock, p.description, p.is_active
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = $1 AND p.is_active IS DISTINCT FROM false
    `, [id]);

        if (result.rows.length === 0)
            return res.status(404).json({ msg: "Product not found" });

        res.json({ msg: "Product found", data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

// ================= CREATE PRODUCT → Admin only =================
router.post("/", auth, role(["admin"]), async(req, res) => {
    const { name, category_id, price, stock, description } = req.body;

    if (!name || !price || !stock) {
        return res.status(400).json({ msg: "name, price, and stock are required" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO products (name, category_id, price, stock, description, is_active)
       VALUES ($1, $2, $3, $4, $5, true) RETURNING *`, [name, category_id || null, price, stock, description || null]
        );
        res.status(201).json({ msg: "Product created", product: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

// ================= UPDATE PRODUCT → Admin only =================
router.put("/:id", auth, role(["admin"]), async(req, res) => {
    const { id } = req.params;
    const { name, category_id, price, stock, description } = req.body;

    try {
        const result = await pool.query(
            `UPDATE products SET
         name = COALESCE($1, name),
         category_id = COALESCE($2, category_id),
         price = COALESCE($3, price),
         stock = COALESCE($4, stock),
         description = COALESCE($5, description)
       WHERE id = $6
       RETURNING *`, [name, category_id, price, stock, description, id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ msg: "Product not found" });

        res.json({ msg: "Product updated", product: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

// ================= DELETE PRODUCT → Admin only (soft delete) =================
router.delete("/:id", auth, role(["admin"]), async(req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE products SET is_active = false WHERE id = $1 RETURNING *`, [id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ msg: "Product not found" });

        res.json({ msg: "Product berhasil dihapus", product: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;