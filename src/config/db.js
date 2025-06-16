const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'job_application_management',
};

async function connectDB() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Kết nối MySQL thành công!');
    return connection;
  } catch (error) {
    console.error('Lỗi kết nối MySQL:', error.message);
    throw error;
  }
}

module.exports = connectDB;