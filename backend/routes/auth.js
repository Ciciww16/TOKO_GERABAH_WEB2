import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();

router.post("/login", async(req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({ msg: "Name dan password wajib diisi" });
        }

        // 🔍 cari user berdasarkan name
        const result = await pool.query(
            "SELECT * FROM users WHERE name = $1", [name]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ msg: "User tidak ditemukan" });
        }

        const user = result.rows[0];

        // 🔐 cek password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Password salah" });
        }

        // 🎟️ buat token
        const token = jwt.sign({ id: user.id, name: user.name, role: user.role },
            process.env.JWT_SECRET, { expiresIn: "1h" }
        );

        res.json({
            msg: "Login berhasil",
            token,
            name: user.name,
            role: user.role,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
});

export default router;