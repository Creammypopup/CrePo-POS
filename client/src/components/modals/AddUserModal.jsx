import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { FaEye, FaEyeSlash, FaUserPlus, FaTimes } from 'react-icons/fa';
import { register, reset as resetAuth } from '../../features/auth/authSlice';
import { getRoles, reset as resetRoles } from '../../features/role/roleSlice';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', width: '90%', maxWidth: '500px', background: '#fff' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }
};

Modal.setAppElement('#root');

function AddUserModal({ isOpen, onClose }) {
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

  const dispatch = useDispatch();

  const { isLoading: authLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  const { roles, isLoading: rolesLoading } = useSelector((state) => state.roles);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
        toast.success(`สร้างผู้ใช้ "${name}" สำเร็จ!`);
        dispatch(resetAuth());
        onClose(); // ปิด Modal เมื่อสำเร็จ
    }
  }, [isError, isSuccess, name, dispatch, onClose]);

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
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles} contentLabel="Add User Modal">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">สร้างผู้ใช้ใหม่</h2>
            <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-gray-600 text-2xl"/></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-bold mb-2 text-gray-600">ชื่อ-นามสกุล</label>
                <input type="text" name="name" value={name} onChange={onChange} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors" required />
            </div>
            <div>
                <label className="block text-sm font-bold mb-2 text-gray-600">ชื่อผู้ใช้ (สำหรับ Login)</label>
                <input type="text" name="username" value={username} onChange={onChange} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors" required />
            </div>
            <div className="relative">
                <label className="block text-sm font-bold mb-2 text-gray-600">รหัสผ่าน</label>
                <input type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={onChange} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-4 mt-3 text-gray-400 hover:text-purple-500">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
            <div className="relative">
                <label className="block text-sm font-bold mb-2 text-gray-600">ยืนยันรหัสผ่าน</label>
                <input type={showPassword2 ? 'text' : 'password'} name="password2" value={password2} onChange={onChange} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors" required />
                <button type="button" onClick={() => setShowPassword2(!showPassword2)} className="absolute top-1/2 right-4 mt-3 text-gray-400 hover:text-purple-500">
                    {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
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
            <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
                <button type="button" onClick={onClose} className="text-gray-600 font-bold uppercase px-6 py-2 text-sm rounded-lg hover:bg-gray-200 transition-colors mr-4">ยกเลิก</button>
                <button type="submit" disabled={authLoading} className="bg-pastel-purple-dark text-white font-bold py-3 px-6 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg hover:bg-purple-700 disabled:opacity-50">
                    <FaUserPlus className="mr-2" />
                    {authLoading ? 'กำลังสร้าง...' : 'สร้างผู้ใช้งาน'}
                </button>
            </div>
        </form>
    </Modal>
  );
}

export default AddUserModal;