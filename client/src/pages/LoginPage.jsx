import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { login, reset } from '../features/auth/authSlice';

function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { username, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate('/');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* App Name Frame */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-text-primary drop-shadow-lg">CrePo POS</h1>
          <p className="text-text-secondary mt-2">กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
        </div>

        {/* Login Form Frame (Card) */}
        <div className="bg-theme-surface p-8 rounded-2xl shadow-clay">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-text-primary">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={onChange}
                className="w-full px-4 py-3 bg-theme-bg rounded-lg border-2 border-transparent focus:border-theme-primary focus:bg-white focus:outline-none transition-all shadow-clay-inset"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-bold mb-2 text-text-primary">
                รหัสผ่าน
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={onChange}
                className="w-full px-4 py-3 bg-theme-bg rounded-lg border-2 border-transparent focus:border-theme-primary focus:bg-white focus:outline-none transition-all shadow-clay-inset"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center top-7 text-text-secondary"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-theme-primary text-white font-bold py-3 px-6 rounded-lg shadow-clay hover:brightness-110 active:shadow-clay-button-active transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;