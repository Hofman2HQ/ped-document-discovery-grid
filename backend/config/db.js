
const sql = require('mssql');

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourPassword',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'PedDatabase',
  options: {
    encrypt: true, // Use this if you're on Azure
    trustServerCertificate: true, // Change to false for production
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Create a connection pool
const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

// Handle pool errors
pool.on('error', err => {
  console.error('SQL Server connection error:', err);
});

module.exports = {
  pool,
  poolConnect,
  sql
};
