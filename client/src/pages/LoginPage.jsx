import React, { useState, useEffect } from "react";
import { FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";

function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State สำหรับดูรหัสผ่าน

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
      navigate("/");
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              CrePo-POS
            </h1>
            <p className="text-gray-600 mt-2">เข้าสู่ระบบเพื่อจัดการร้านค้าของคุณ</p>
          </div>

          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <input
                type="text"
                className="form-input"
                id="username"
                name="username"
                value={username}
                placeholder="กรอกชื่อผู้ใช้ของคุณ"
                onChange={onChange}
                required
              />
            </div>
            <div className="mb-6 relative">
              <input
                type={showPassword ? "text" : "password"} // เปลี่ยน type ตาม state
                className="form-input pr-10" // เพิ่ม padding ด้านขวา
                id="password"
                name="password"
                value={password}
                placeholder="กรอกรหัสผ่าน"
                onChange={onChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-purple-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-3d w-full flex items-center justify-center">
                <FaSignInAlt className="mr-2" /> เข้าสู่ระบบ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
