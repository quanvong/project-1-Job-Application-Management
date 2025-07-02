const db = require('../config/database.js');

exports.getAllUser = async () => {
    const [rows] = await db.execute('SELECT * FROM users');
    return rows;
}

exports.getUserById = async (id) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
}

exports.deleteUser = async (id) => {
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
}

exports.createUser = async (data) => {
    const {username, email, password, role, status, email_verified} = data;

    const [result] = await db.execute(
        'INSERT INTO users(username, email, password, role, status, email_verified) VALUES(?,?,?,?,?,?)',
        [username, email, password, role, status, email_verified]
    );
    return result.insertId;
}

exports.updateUser = async (id, data) => {
    const {username, email, password, role, status, email_verified} = data;

    const [result] = await db.execute(
        'UPDATE users SET username = ?, email = ?, password = ?, role = ?, status =?, email_verified = ? WHERE id = ?',
        [username, email, password, role, status, email_verified, id]
    );
    return result.affectedRows;
}