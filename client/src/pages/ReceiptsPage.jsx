import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import { register, reset as resetAuth } from '../features/auth/authSlice';
import { getRoles, reset as resetRoles } from '../features/role/roleSlice';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    password2: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const { name, username, password, password2, role } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading: authLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  const { roles, isLoading: rolesLoading } = useSelector((state) => state.roles);

  useEffect(() => {
    dispatch(getRoles());
    return () => {
        dispatch(resetRoles());
        dispatch(resetAuth());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
        toast.success(`สร้างผู้ใช้ "${name}" สำเร็จ!`);
        navigate('/settings/users'); // **จุดแก้ไข:** กลับไปหน้า Users
    }
  }, [isError, isSuccess, message, name, navigate]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error('รหัสผ่านไม่ตรงกัน');
    } else if (!role) {
      toast.error('กรุณาเลือกตำแหน่ง');
    } else {
      dispatch(register({ name, username, password, role }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-700">สร้างผู้ใช้ใหม่</h1>
        </div>
        <div>
            <form onSubmit={onSubmit} className="space-y-6">
                {/* Name and Username fields */}
                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-600">ชื่อ-นามสกุล</label>
                    <input type="text" name="name" value={name} onChange={onChange} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors" required />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-600">ชื่อผู้ใช้ (สำหรับ Login)</label>
                    <input type="text" name="username" value={username} onChange={onChange} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors" required />
                </div>
                {/* Password fields */}
                <div className="relative">
                    <label className="block text-sm font-bold mb-2 text-gray-600">รหัสผ่าน</label>
                    <input type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={onChange} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors" required />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pt-8">
                        {showPassword ? <FaEyeSlash className="h-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(false)} /> : <FaEye className="h-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(true)} />}
                    </div>
                </div>
                <div className="relative">
                    <label className="block text-sm font-bold mb-2 text-gray-600">ยืนยันรหัสผ่าน</label>
                    <input type={showPassword2 ? 'text' : 'password'} name="password2" value={password2} onChange={onChange} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors" required />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pt-8">
                        {showPassword2 ? <FaEyeSlash className="h-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword2(false)} /> : <FaEye className="h-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword2(true)} />}
                    </div>
                </div>
                {/* Role Dropdown */}
                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-600">ตำแหน่ง</label>
                    <select name="role" value={role} onChange={onChange} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors" required disabled={rolesLoading}>
                        <option value="" disabled>
                            {rolesLoading ? "กำลังโหลดตำแหน่ง..." : "-- กรุณาเลือกตำแหน่ง --"}
                        </option>
                        {roles.map((r) => (
                            <option key={r._id} value={r._id}>{r.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={authLoading} className="bg-pastel-purple-dark text-white font-bold py-3 px-6 rounded-xl flex items-center transition-all duration-300 shadow-lg hover:bg-purple-700 disabled:opacity-50">
                        <FaUserPlus className="mr-2" />
                        {authLoading ? 'กำลังสร้าง...' : 'สร้างผู้ใช้งาน'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}

export default RegisterPage;