const express = require('express');
const pool = require('./config/database');

//Ham kiem tra ket noi MySQL
async function testDBConnection() {
    const connection = await pool.getConnection();
    try {
        await connection.ping();
        console.log('Database connection is successful!');
        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'Welcome to Project 1: Job Application Management API'});
})

const PORT = process.env.PORT || 3000;


// Kiểm tra kết nối MySQL trước khi khởi động server
testDBConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Could not start server due to database connection issues:', err);
  });