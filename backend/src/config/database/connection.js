import mysql from 'mysql2/promise';

// --- Verification Step: Check if ENV variables are loaded ---
// console.log('DB User:', process.env.DATABASE_USERNAME);
// console.log('DB Pass:', process.env.DATABASE_PASSWORD ? 'Loaded' : 'NOT loaded');
// -----------------------------------------------------------

const connection = mysql.createPool({
  host: '127.0.0.1',
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: 'shop',
  waitForConnections: true,
  multipleStatements: true,
  connectionLimit: 10, // Adjust based on your needs
  queueLimit: 0,
});

export default connection;
