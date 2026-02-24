const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// ================= GET ALL CATEGORIES → Semua yang login =================
router.get("/", auth, async(req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, description FROM categories ORDER BY id ASC"
        );
        res.json({ msg: "Semua Kategori", data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

// ================= GET CATEGORY BY ID → Semua yang login =================
router.get("/:id", auth, async(req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "SELECT id, name, description FROM categories WHERE id=$1", [id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ msg: "Kategori tidak ditemukan" });

        res.json({ msg: "Kategori ditemukan", data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

// ================= CREATE CATEGORY → Admin only =================
router.post("/", auth, role(["admin"]), async(req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ msg: "Name is required" });

    try {
        const result = await pool.query(
            "INSERT INTO categories (name, description) VALUES ($1,$2) RETURNING *", [name, description || null]
        );
        res.status(201).json({ msg: "Category ditambahkan", category: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

// ================= UPDATE CATEGORY → Admin only =================
router.put("/:id", auth, role(["admin"]), async(req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const result = await pool.query(
            "UPDATE categories SET name=COALESCE($1,name), description=COALESCE($2,description) WHERE id=$3 RETURNING *", [name, description, id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ msg: "Category tidak ditemukan" });

        res.json({ msg: "Category diperbarui", category: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

// ================= DELETE CATEGORY → Admin only =================
router.delete("/:id", auth, role(["admin"]), async(req, res) => {
    const { id } = req.params;
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Ambil semua produk di kategori ini
        const products = await client.query("SELECT id FROM products WHERE category_id = $1", [id]);

        for (const prod of products.rows) {
            // Hapus semua transaction_item yang pakai produk ini
            await client.query("DELETE FROM transaction_item WHERE product_id = $1", [prod.id]);
        }

        // Hapus semua produk di kategori
        await client.query("DELETE FROM products WHERE category_id = $1", [id]);

        // Hapus kategori
        const result = await client.query("DELETE FROM categories WHERE id=$1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ msg: "Category tidak ditemukan" });
        }

        await client.query("COMMIT");
        res.json({ msg: "Category dan semua produk terkait berhasil dihapus", category: result.rows[0] });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    } finally {
        client.release();
    }
});

module.exports = router;