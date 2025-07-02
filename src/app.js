const express = require('express');
const authRouter = require('./routes/auth.routes.js');

const app = express();

// Middleware, routes sẽ thêm ở đây
app.use(express.json());

//Router
app.use('/auth', authRouter);

//Middlware xu ly loi 404
app.use((req, res, next) => {
    res.status(404).json({message: "Route khong ton tai"});
});

module.exports = app;