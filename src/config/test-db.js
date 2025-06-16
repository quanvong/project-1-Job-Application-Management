const connectDB = require('./db'); // Import the connectDB function from db.js

async function testConnection() {
  try {
    const db = await connectDB();
    console.log('Kiểm tra kết nối thành công!');
    await db.end(); // Đóng kết nối sau khi kiểm tra
  } catch (error) {
    console.error('Kiểm tra kết nối thất bại:', error.message);
  }
}

testConnection();