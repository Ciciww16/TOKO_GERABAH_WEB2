// backend/test-db.js
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

async function testConnection() {
    console.log('🔍 Testing database connection...');
    console.log('Configuration:', {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    try {
        const client = await pool.connect();
        console.log('✅ Database connected successfully!');

        const result = await client.query('SELECT NOW()');
        console.log('📅 Server time:', result.rows[0].now);

        const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
        console.log('📋 Tables in database:', tables.rows.map(t => t.table_name));

        client.release();
    } catch (err) {
        console.error('❌ Database connection failed!');
        console.error('Error message:', err.message);
        console.error('Error code:', err.code);
    } finally {
        await pool.end();
        process.exit();
    }
}

testConnection();