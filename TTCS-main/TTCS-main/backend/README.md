# 🔐 Draw & Find Backend (FastAPI)

Backend authentication server cho ứng dụng Draw & Find.

## 📋 Yêu cầu

- Python 3.8+
- pip (Python package manager)

## 🚀 Hướng dẫn chạy

### 1️⃣ Cài đặt Python dependencies

```bash
pip install -r requirements.txt
```

### 2️⃣ Chạy server

```bash
python main.py
```

Hoặc sử dụng `uvicorn` trực tiếp:

```bash
uvicorn main:app --reload --port 8000
```

### 3️⃣ Kiểm tra server

Server sẽ chạy tại: **http://localhost:8000**

Mở browser và truy cập:
- **Root**: http://localhost:8000/
- **Health Check**: http://localhost:8000/health
- **API Docs (Swagger UI)**: http://localhost:8000/docs
- **Alternative Docs (ReDoc)**: http://localhost:8000/redoc

---

## 📚 API Endpoints

### POST `/register` - Đăng ký tài khoản mới

**Request Body:**
```json
{
  "username": "myuser",
  "password": "mypassword123"
}
```

**Validation:**
- Username: ≥ 3 ký tự, không được trống, phải unique
- Password: ≥ 6 ký tự, không được trống

**Success Response (200):**
```json
{
  "access_token": "base64_encoded_token",
  "token_type": "bearer"
}
```

**Error Response (400):**
```json
{
  "detail": "Tên đăng nhập đã tồn tại"
}
```

---

### POST `/login` - Đăng nhập

**Request Body:**
```json
{
  "username": "myuser",
  "password": "mypassword123"
}
```

**Success Response (200):**
```json
{
  "access_token": "base64_encoded_token",
  "token_type": "bearer"
}
```

**Error Response (401):**
```json
{
  "detail": "Mật khẩu không chính xác"
}
```

---

## 🧪 Test Endpoints (sử dụng curl)

### Đăng ký

```bash
curl -X POST "http://localhost:8000/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'
```

### Đăng nhập

```bash
curl -X POST "http://localhost:8000/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'
```

---

## 💾 Database

- **Type**: SQLite
- **File**: `auth.db` (tự động tạo khi chạy)
- **Tables**: 
  - `users` - Lưu trữ thông tin người dùng

Database tự động khởi tạo khi server khởi động lần đầu tiên.

---

## 🔐 Security Features

✅ **Password Hashing** - Sử dụng bcrypt để mã hóa mật khẩu  
✅ **CORS Enabled** - Cho phép React frontend kết nối (localhost:5173, 5174)  
✅ **Input Validation** - Validate username và password  
✅ **Unique Username** - Tên đăng nhập không được trùng  
✅ **Error Handling** - Xử lý lỗi toàn diện  

---

## 📝 File Structure

```
backend/
├── main.py              # FastAPI server chính
├── requirements.txt     # Dependencies
├── README.md           # Hướng dẫn này
└── auth.db             # SQLite database (tự động tạo)
```

---

## 🔗 Kết nối với Frontend

Frontend (React) tại **http://localhost:5174** sẽ gửi request đến:
- `http://localhost:8000/register`
- `http://localhost:8000/login`

Đảm bảo:
1. ✅ Backend chạy tại `http://localhost:8000`
2. ✅ Frontend chạy tại `http://localhost:5174`
3. ✅ CORS được enable (đã cấu hình)

---

## ⚠️ Troubleshooting

### Lỗi: "Port 8000 is already in use"
Thay đổi port:
```bash
uvicorn main:app --port 8001
```
Sau đó update URL trong LoginForm.jsx từ `localhost:8000` thành `localhost:8001`

### Lỗi: "ModuleNotFoundError: No module named 'fastapi'"
Cài đặt dependencies lại:
```bash
pip install -r requirements.txt
```

### Lỗi CORS trong browser
Backend CORS đã được cấu hình cho localhost:5173 và 5174. Kiểm tra frontend đang chạy ở cổng nào.

---

## 📖 Tài liệu FastAPI

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Passlib Documentation](https://passlib.readthedocs.io/)

---

**Tạo bởi:** Draw & Find Team  
**Ngày tạo:** March 15, 2026
