// backend/hash-passwords.js
import bcrypt from 'bcrypt';
import db from './db.js';

const users = [
    { name: 'Ciciw', password: 'passCiciw' },
    { name: 'Sapedtx', password: 'passSapedtx' },
    { name: 'Tsabitha', password: 'passTsabitha' },
    { name: 'Ncitra', password: 'passNcitra' },
    { name: 'Rinda', password: 'passRinda' }
];

async function hashPasswords() {
    try {
        for (const user of users) {
            const hash = await bcrypt.hash(user.password, 10);
            await db.query('UPDATE users SET password = $1 WHERE name = $2', [hash, user.name]);
            console.log(`✅ ${user.name} -> ${hash.substring(0, 30)}...`);
        }
        console.log('\n✨ Semua password berhasil di-hash!');
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        process.exit();
    }
}

hashPasswords();