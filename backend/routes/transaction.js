const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// GET ALL → Admin only
router.get("/", auth, role(["admin"]), async(req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, user_id, total, transaction_date FROM transaction ORDER BY id ASC"
        );
        res.json({ msg: "Semua transactions", data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

// GET BY ID → Customer can only see their own, Admin can see all
router.get("/:id", auth, async(req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "SELECT id, user_id, total, transaction_date FROM transaction WHERE id=$1", [id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ msg: "Transaction tidak ditemukan" });

        const tx = result.rows[0];
        if (req.user.role === "customer" && req.user.id !== tx.user_id)
            return res.status(403).json({ msg: "Akses ditolak" });

        res.json({ msg: "Transaction ditemukan", transaction: tx });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

// CREATE → Kasir & Customer
router.post("/", auth, role(["kasir", "customer"]), async(req, res) => {
    const { user_id, items } = req.body;
    if (!user_id || !items || items.length === 0)
        return res
            .status(400)
            .json({ msg: "user_id and items required" });

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Validasi product_id sebelum insert
        for (const item of items) {
            const prodCheck = await client.query(
                "SELECT id, stock FROM products WHERE id=$1", [item.product_id]
            );
            if (prodCheck.rows.length === 0)
                throw new Error(
                    `Product dengan id ${item.product_id} tidak ada`
                );

            // Optional: cek stock cukup
            if (prodCheck.rows[0].stock < item.quantity)
                throw new Error(
                    `Stock untuk product id ${item.product_id} tidak cukup`
                );
        }

        // Hitung total
        const total = items.reduce(
            (sum, item) => sum + parseFloat(item.subtotal),
            0
        );

        // Insert transaction
        const txResult = await client.query(
            "INSERT INTO transaction (user_id, total) VALUES ($1,$2) RETURNING *", [user_id, total]
        );
        const tx = txResult.rows[0];

        // Insert transaction_item & update stock
        for (const item of items) {
            await client.query(
                "INSERT INTO transaction_item (transaction_id, product_id, quantity, subtotal) VALUES ($1,$2,$3,$4)", [tx.id, item.product_id, item.quantity, item.subtotal]
            );
            await client.query(
                "UPDATE products SET stock = stock - $1 WHERE id = $2", [item.quantity, item.product_id]
            );
        }

        await client.query("COMMIT");
        res.status(201).json({ msg: "Transaksi dibuat", transaction: tx });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({ msg: err.message || "Server Error" });
    } finally {
        client.release();
    }
});

// UPDATE → Kasir only
router.put("/:id", auth, role(["kasir"]), async(req, res) => {
    const { id } = req.params;
    const { user_id, total } = req.body;
    if (!user_id && !total)
        return res.status(400).json({ msg: "user_id or total required" });

    try {
        const exist = await pool.query(
            "SELECT * FROM transaction WHERE id=$1", [id]
        );
        if (exist.rows.length === 0)
            return res.status(404).json({ msg: "Transaction tidak ditemukan" });

        const updated = await pool.query(
            "UPDATE transaction SET user_id=COALESCE($1,user_id), total=COALESCE($2,total) WHERE id=$3 RETURNING *", [user_id, total, id]
        );
        res.json({ msg: "Transaksi diperbarui", transaction: updated.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;