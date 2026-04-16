const db = require('./db');

async function testConnection() {
    try {
        console.log('Testing connection...');
        const [rows] = await db.execute('SELECT 1 as result');
        console.log('Connection successful!');
        console.log(rows);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        process.exit();
    }
}
testConnection();
