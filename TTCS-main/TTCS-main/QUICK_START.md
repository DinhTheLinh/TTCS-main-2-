# 🚀 Quick Start Guide - Draw & Find

## 📁 Cấu trúc Dự án

```
BTL_TTCS/
├── frontend/        # React app (localhost:5174)
│   ├── src/
│   ├── package.json
│   └── ...
└── backend/         # FastAPI server (localhost:8000)
    ├── main.py
    ├── requirements.txt
    └── README.md
```

---

## 🎯 Bước 1: Cài đặt Dependencies

### Frontend (React)
Dependencies đã cài sẵn, kiểm tra bằng:
```bash
cd frontend
npm list
```

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
```

---

## 🚀 Bước 2: Chạy Backend

**Terminal 1** - Chạy Backend Server:
```bash
cd backend
python main.py
```

Output sẽ hiển thị:
```
🚀 Starting Draw & Find Backend...
📍 Server running at http://localhost:8000
📚 API Docs at http://localhost:8000/docs
```

---

## 🎨 Bước 3: Chạy Frontend

**Terminal 2** - Chạy Frontend App:
```bash
cd frontend
npm run dev
```

Output sẽ hiển thị:
```
VITE v7.3.1  ready in XXX ms
➜  Local:   http://localhost:5174/
```

---

## ✅ Bước 4: Test Ứng dụng

1. Mở browser → `http://localhost:5174`
2. Bạn sẽ thấy form **Đăng nhập**
3. Nhấn **"Chưa có tài khoản? Đăng ký"**
4. Tạo tài khoản mới:
   - Username: `testuser`
   - Password: `123456`
   - Confirm: `123456`
5. Nhấn **Đăng ký**
6. Tự động đăng nhập & vào giao diện vẽ
7. Thành công! 🎉

---

## 🔗 Endpoints có sẵn

| Endpoint | Mô tả | URL |
|---|---|---|
| Root | Thông tin API | http://localhost:8000/ |
| Health | Kiểm tra server | http://localhost:8000/health |
| API Docs | Swagger UI | http://localhost:8000/docs |
| ReDoc | Tài liệu chi tiết | http://localhost:8000/redoc |

---

## 🧪 Test Thủ công (Optional)

Dùng Swagger UI tại `http://localhost:8000/docs`:
1. Nhấn "Try it out" trên endpoint `/register`
2. Nhập: `{"username": "test2", "password": "123456"}`
3. Nhấn "Execute"
4. Xem response

---

## ⚠️ Troubleshooting

### Port 5174 đã dùng
```bash
npm run dev -- --port 5175
```

### Port 8000 đã dùng
```bash
python main.py --port 8001
# Sau đó update URL trong LoginForm.jsx
```

### Lỗi CORS
Kiểm tra:
- Backend chạy ở `http://localhost:8000`
- Frontend chạy ở `http://localhost:5173` hoặc `5174`
- Backend CORS đã cấu hình cho cả hai port

### Lỗi "Module not found"
```bash
cd backend
pip install -r requirements.txt
```

---

## 📝 Default Test Account

Sau khi đăng ký, bạn tạo được tài khoản. Ví dụ:
- **Username**: `testuser`
- **Password**: `123456`

Dùng thông tin này để đăng nhập lần sau.

---

## 🔐 Tính năng Bảo mật

✅ Mật khẩu được mã hóa bằng bcrypt  
✅ localStorage lưu trữ token  
✅ Session persist (F5 không cần đăng nhập lại)  
✅ Logout xóa dữ liệu  
✅ CORS được cấu hình  

---

## 📚 Tài liệu Thêm

- Frontend README: `frontend/README.md`
- Backend README: `backend/README.md`
- FastAPI Docs: `http://localhost:8000/docs`

---

**Bắt đầu ngay!** 🎯  
Chạy cả frontend và backend để thử các tính năng đăng nhập/đăng ký.
