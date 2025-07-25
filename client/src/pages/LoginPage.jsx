import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { GiMushroomHouse } from 'react-icons/gi';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { username, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) { toast.error(message); }
    if (isSuccess || user) { navigate('/'); }
    dispatch(reset());
  }, [isError, isSuccess, user, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { username, password };
    dispatch(login(userData));
  };

  if (isLoading) { return <Spinner />; }

  return (
    <div className="min-h-screen flex items-center justify-center w-full p-4">
      {/* --- START OF EDIT --- */}
      <div className="bg-white/60 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl w-full max-w-md border-2 border-white/50">
        <div className="text-center mb-8">
          <GiMushroomHouse className="mx-auto text-7xl text-pastel-purple-dark" />
          <h1 className="text-4xl font-bold text-gray-800 mt-4">CrePo POS</h1>
          <p className="text-gray-500">เข้าสู่ระบบเพื่อจัดการร้านค้าของคุณ</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input type="text" id="username" name="username" value={username} onChange={onChange} placeholder="ชื่อผู้ใช้" required className="w-full pl-12 pr-4 py-3 bg-gray-50/70 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition" />
          </div>
          <div className="relative">
            <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={password} onChange={onChange} placeholder="รหัสผ่าน" required className="w-full pl-12 pr-12 py-3 bg-gray-50/70 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-purple-500">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" className="w-full btn-3d btn-3d-purple shadow-lg hover:shadow-purple-300">
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
      {/* --- END OF EDIT --- */}
    </div>
  );
}

export default LoginPage;