const express = require('express');
const app = express();

// Middleware để parse JSON
app.use(express.json());

// Định nghĩa route cho API
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
