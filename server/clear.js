require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'abstechnologieso_tulip',
  });
  try {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    await conn.query('TRUNCATE TABLE sales');
    await conn.query('TRUNCATE TABLE sales_dispatched');
    await conn.query('TRUNCATE TABLE batches');
    await conn.query('TRUNCATE TABLE brands');
    await conn.query('TRUNCATE TABLE agents');
    await conn.query('TRUNCATE TABLE users');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('All data cleared. Database is now empty.');
  } finally {
    await conn.end();
  }
})();
