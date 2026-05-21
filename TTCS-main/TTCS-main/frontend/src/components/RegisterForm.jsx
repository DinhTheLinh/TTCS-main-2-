import { useState } from 'react';
import { UserPlus, ArrowLeft } from 'lucide-react';
import '../styles/AuthForm.css';

function RegisterForm({ onSwitchToLogin, onLoading }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Xác thực biểu mẫu
    if (!username.trim()) {
      setError('Vui lòng nhập tên đăng nhập');
      return;
    }
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }
    if (!confirmPassword.trim()) {
      setError('Vui lòng xác nhận mật khẩu');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);
    onLoading(true);

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || 'Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại.');
        setIsLoading(false);
        onLoading(false);
        return;
      }

      // Sau khi đăng ký thành công, set flag vào localStorage và chuyển sang login
      localStorage.setItem('registerSuccess', 'true');
      setIsLoading(false);
      onLoading(false);
      
      // Reset form và chuyển sang login
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      onSwitchToLogin();
    } catch {
      setError('Lỗi kết nối. Vui lòng kiểm tra backend.');
      setIsLoading(false);
      onLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-box">
        <div className="auth-logo">
          <span className="paper">📄</span>
          <span className="pencil">✏️</span>
        </div>
        
        <h2 className="auth-title">Đăng Ký</h2>
        <p className="auth-subtitle">Tạo tài khoản Draw & Find</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-username">Tên đăng nhập</label>
            <input
              id="reg-username"
              type="text"
              placeholder="Chọn tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Mật khẩu</label>
            <input
              id="reg-password"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm-password">Xác nhận mật khẩu</label>
            <input
              id="reg-confirm-password"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-small"></span>
                Đang đăng ký...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Đăng Ký
              </>
            )}
          </button>
        </form>

        <div className="auth-toggle">
          <p>Đã có tài khoản?</p>
          <button
            type="button"
            className="toggle-btn"
            onClick={onSwitchToLogin}
            disabled={isLoading}
          >
            Đăng nhập tại đây
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
