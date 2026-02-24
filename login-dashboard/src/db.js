const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "toko_gerabah",
    password: "password_pgAdminmu",
    port: 5432,
});

module.exports = pool;