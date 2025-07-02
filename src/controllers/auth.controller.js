const db = require('../config/database.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: "Thiếu trường username, password hoặc email" });
    }

    try {
        // Kiểm tra username hoặc email đã tồn tại chưa
        const [users] = await db.execute(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );
        if (users.length > 0) {
            return res.status(409).json({ message: 'Username hoặc email đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Lưu user mới vào database
        const [result] = await db.execute(
            'INSERT INTO users(username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: "Đăng ký thành công", id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Đăng ký thất bại", error: error.message });
    }
};

exports.login = async (req, res) => {
    const {username, password} = req.body;
    
    if(!username || !password) {
        return res.status(409).json({message: "Thieu username haoc password"});
    }

    try {
        const [result] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if(result.length === 0) {
            return res.status(404).json({message: 'Username chua ton tai'});
        }

        //Kiem tra password da nhap va password luu trong database
        user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({message: "Password khong dung"});
        }

        //Tao token xac thuc
        const token = jwt.sign(
            {userId: user.id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        return res.status(200).json({
            message: "Dang nhap thanh cong",
            token
        });
        
    } catch (error) {
        res.status(500).json({message: "Dang nhap that bai", error: error.message});
    }
}