import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';
import { FaUser, FaLock } from 'react-icons/fa';
import { GiMushroomHouse } from 'react-icons/gi';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    // Redirect when logged in
    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [isError, isSuccess, user, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white/70 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <GiMushroomHouse className="mx-auto text-7xl text-pastel-purple-dark" />
          <h1 className="text-4xl font-bold text-gray-800 mt-4">CrePo POS</h1>
          <p className="text-gray-500">เข้าสู่ระบบเพื่อจัดการร้านค้าของคุณ</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="อีเมล"
              required
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pastel-purple focus:border-transparent transition"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="รหัสผ่าน"
              required
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pastel-purple focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-pastel-purple-dark text-white font-bold rounded-xl hover:bg-purple-700 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-purple-200"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          ยังไม่มีบัญชี?{' '}
          <a href="/register" className="font-semibold text-pastel-purple-dark hover:underline">
            ลงทะเบียนที่นี่
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
