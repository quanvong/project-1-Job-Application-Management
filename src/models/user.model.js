const bcrypt = require('bcrypt');
const db = require('../config/db.js');

const createUser = async (email, password, role) => {
    try {
        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Thực hiện truy vấn để thêm người dùng mới vào bảng users
        const [result] = await db.query(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [email, hashedPassword, role || 'user']
        );

        // Trả về thông tin người dùng mới được tạo
        return {
            id: result.insertId,
            email: email,
            role: role || 'user',
            createdAt: new Date()
        };
    } catch (error) {
        console.error('Lỗi tạo user:', error);
        throw error;
    }
};

module.exports = { createUser };