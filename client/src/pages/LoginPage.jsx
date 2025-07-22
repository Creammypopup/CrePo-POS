import { useState, useEffect } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

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

    const userData = {
      username,
      password,
    };

    dispatch(login(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <section className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            <FaSignInAlt className="mr-2" /> เข้าสู่ระบบ
          </h1>
          <p className="mt-2 text-gray-600">กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
        </section>

        <section>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="form-group">
              <input
                type="text"
                className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                id="username"
                name="username"
                value={username}
                placeholder="กรอกชื่อผู้ใช้ของคุณ"
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                id="password"
                name="password"
                value={password}
                placeholder="กรอกรหัสผ่านของคุณ"
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="w-full py-3 font-semibold text-white bg-purple-500 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
