// backend/db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'toko_gerabah',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

pool.connect((err) => {
    if (err) {
        console.error('❌ Koneksi database gagal:', err.message);
    } else {
        console.log('✅ Terhubung ke database PostgreSQL');
    }
});

export default pool;