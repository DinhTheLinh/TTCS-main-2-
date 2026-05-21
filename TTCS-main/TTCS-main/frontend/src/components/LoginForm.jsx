// Nhập các thư viện cần thiết từ React và các package khác
import { useState, useEffect } from 'react'; // Hook để quản lý trạng thái (state)
import { LogIn } from 'lucide-react'; // Icon đăng nhập
import '../styles/AuthForm.css'; // Tệp CSS để styling


function LoginForm({ onLoginSuccess, onSwitchToRegister, onLoading }) {
  // Khai báo các state để quản lý dữ liệu của form
  const [username, setUsername] = useState(''); // Lưu tên đăng nhập
  const [password, setPassword] = useState(''); // Lưu mật khẩu
  const [error, setError] = useState(''); // Lưu thông báo lỗi nếu có
  const [isLoading, setIsLoading] = useState(false); // Theo dõi trạng thái đang tải
  const [registerSuccess, setRegisterSuccess] = useState(() => {
    // Check localStorage on initial load only
    const success = localStorage.getItem('registerSuccess');
    if (success) {
      localStorage.removeItem('registerSuccess');
      return true;
    }
    return false;
  });

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (registerSuccess) {
      const timer = setTimeout(() => {
        setRegisterSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [registerSuccess]);

  // Hàm xử lý khi người dùng nhấn nút đăng nhập
  const handleSubmit = async (e) => { 
    e.preventDefault(); // Ngăn chặn hành động mặc định của form (reload trang)
    setError(''); // Xóa message lỗi cũ

    // Kiểm tra xem người dùng đã nhập tên đăng nhập chưa
    if (!username.trim()) {
      setError('Vui lòng nhập tên đăng nhập');
      return;
    }
    // Kiểm tra xem người dùng đã nhập mật khẩu chưa
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    // Bật trạng thái loading để hiển thị spinner khi đang xử lý
    setIsLoading(true);
    onLoading(true);

    try {
      // Gửi yêu cầu POST đến backend để xác thực người dùng
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST', // Phương thức POST
        headers: {
          'Content-Type': 'application/json', // Loại dữ liệu gửi đi
        },
        body: JSON.stringify({ username, password }), // Dữ liệu gửi đi (tên đăng nhập và mật khẩu)
      });

      // Kiểm tra xem phản hồi từ server có thành công không
      if (!response.ok) { 
        const data = await response.json(); // Đọc dữ liệu lỗi từ response
        setError(data.detail || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        setIsLoading(false);
        onLoading(false);
        return;
      }

      // Nếu đăng nhập thành công, lấy dữ liệu từ response
      const data = await response.json();
      
      // Lưu token đăng nhập và thông tin người dùng vào localStorage (bộ nhớ cục bộ của trình duyệt)
      localStorage.setItem('authToken', data.access_token || 'token_' + Date.now());
      localStorage.setItem('username', username);
      localStorage.setItem('isAuthenticated', 'true');

      // Tắt trạng thái loading và gọi hàm callback thông báo đăng nhập thành công
      setIsLoading(false);
      onLoading(false);
      onLoginSuccess();
    } catch {
      // Nếu có lỗi kết nối (mạng, server, v.v.)
      setError('Lỗi kết nối. Vui lòng kiểm tra backend.');
      setIsLoading(false);
      onLoading(false);
    }
  };

  // Return JSX - Giao diện người dùng của component
  return ( 
    <div className="auth-form-container">
      <div className="auth-form-box">
        {/* Logo của ứng dụng */}
        <div className="auth-logo">
          <span className="paper">📄</span>
          <span className="pencil">✏️</span>
        </div>
        
        {/* Tiêu đề của form */}
        <h2 className="auth-title">Đăng Nhập</h2>
        <p className="auth-subtitle">Draw & Find</p>

        {/* Hiển thị success message nếu vừa đăng ký */}
        {registerSuccess && (
          <div style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '14px',
            textAlign: 'center',
            border: '1px solid #c3e6cb'
          }}>
            ✓ Đăng ký thành công! Vui lòng đăng nhập tại đây.
          </div>
        )}

        {/* Form đăng nhập */}
        <form onSubmit={handleSubmit}>
          {/* Trường nhập tên đăng nhập */}
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Trường nhập mật khẩu */}
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Hiển thị thông báo lỗi nếu có */}
          {error && <div className="error-message">{error}</div>}

          {/* Nút đăng nhập */}
          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-small"></span>
                Đang đăng nhập...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Đăng Nhập
              </>
            )}
          </button>
        </form>

        {/* Phần chuyển sang trang đăng ký */}
        <div className="auth-toggle">
          <p>Chưa có tài khoản?</p>
          <button
            type="button"
            className="toggle-btn"
            onClick={onSwitchToRegister}
          >
            Đăng ký tại đây
          </button>
        </div>
      </div>
    </div>
  );
}

// Xuất component LoginForm để sử dụng ở những nơi khác trong ứng dụng
export default LoginForm;
