const express = require('express');
const router = express.Router();
const { createUser } = require('../models/user.model.js');
const { registerValidation } = require('../validations/user.validation');
const db = require('../config/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticationToken = require('../middlewares/authenticationToken.js');
require('dotenv').config();

//API endpoint để đăng ký người dùng mới
router.post('/register', async (req, res) => {
    try {
        // Kiểm tra dữ liệu đầu vào bằng Joi
        const { error } = registerValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Nếu dữ liệu hợp lệ, tiếp tục tạo user
        const { email, password, role } = req.body;
        const user = await createUser(email, password, role);
        res.status(201).json({
            message: 'Người dùng đã được tạo thành công',
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo người dùng', error: error.message });
    }
});

//API endpoint dang nhap nguoi dung
router.post('/login', async (req, res) => {
    try {
        // Nhận email và password từ client
        const { email, password } = req.body;

        // Kiểm tra email có tồn tại trong database
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        // Nếu không tìm thấy người dùng, trả về lỗi 404
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }
        const user = rows[0];

        // Kiểm tra password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        //Tao token JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'your_jwt_secret', // Thay thế bằng secret key của bạn
            { expiresIn: '1h' } // Token sẽ hết hạn sau 1 giờ
        )

        // Đăng nhập thành công
        res.status(200).json({ message: 'Đăng nhập thành công', user, token });
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi khi đăng nhập', error: error.message });
    }
});

//API cho phep admin truy cap
router.post('/admin-action', authenticationToken, async (req,res)=> {
    try {
       //Lay role tu token
       const { role } = req.user;

       //Kiem tra neu role khong phai la admin
       if (role !== 'admin') {
            return res.status(403).json({ message: 'Khong co quyen truy cap' });
       }

       //Neu la admin, cho phep truy cap
       res.status(200).json({ message: 'Ban la admin, co quyen truy cap' });

    } catch (error) {
        console.error('Lỗi khi kiểm tra quyền truy cập:', error);
        res.status(500).json({ message: 'Lỗi khi kiểm tra quyền truy cập', error: error.message });
    }
})

//API cho phep cap nhat thong tin
router.put('/update', authenticationToken, async (req, res) => {
    try {
        // Lấy thông tin từ token
        const { id, role } = req.user; // id và role từ token
        const { email, password, newRole, targetId } = req.body; // newRole là role mới nếu admin muốn cập nhật

        // Nếu không phải admin, chỉ cho phép cập nhật thông tin của chính mình
        if (role !== 'admin' && targetId !== id) {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        // Mã hóa mật khẩu nếu được gửi
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Cập nhật thông tin trong database
        const query = 'UPDATE users SET email = ?, password = ?, role = ? WHERE id = ?';
        const values = [email || null, hashedPassword || null, newRole || role, targetId || id];
        await db.query(query, values);

        res.status(200).json({ message: 'Cập nhật thông tin thành công' });
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật thông tin', error: error.message });
    }
});
module.exports = router;