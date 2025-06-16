# Ghi chú Task 1 - Buổi 1, Tuần 1

## REST API và đăng ký người dùng
- REST API: Dùng HTTP (POST /api/users/register) để nhận JSON (email, password, role).
- Quy trình:
  1. Client gửi { email, password, role }.
  2. Server xác thực (Joi), kiểm tra email trùng, băm password (bcrypt), lưu vào MySQL.
  3. Trả về { id, email } với status 201.
- Status codes: 201 (thành công), 400 (lỗi dữ liệu), 500 (lỗi server).

## bcrypt
- Thư viện mã hóa mật khẩu, tạo chuỗi băm an toàn.
- Hàm chính:
  - bcrypt.hash(password, 10): Băm mật khẩu.
  - bcrypt.compare(password, hash): So sánh (dùng khi đăng nhập).
- Lưu ý: Lưu chuỗi băm vào cột password, không lưu mật khẩu gốc.

## Các bước áp dụng
1. Tạo schema Joi để kiểm tra email/password (Task 2: src/validations/user.validation.js).
2. Viết hàm createUser, dùng bcrypt để băm password, lưu vào bảng users (Task 3: src/models/user.model.js).
3. Tạo route POST /register, gọi validation và createUser (Task 4: src/routes/user.routes.js).
4. Kiểm tra API bằng Postman (Task 5).
5. Xử lý lỗi trùng email (Task 6) và thêm try-catch (Task 7).