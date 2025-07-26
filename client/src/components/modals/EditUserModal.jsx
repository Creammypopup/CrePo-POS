import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { updateUser } from '../../features/user/userSlice';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', width: '90%', maxWidth: '500px', background: '#fff' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }
};

Modal.setAppElement('#root');

function EditUserModal({ isOpen, onClose, user }) {
  const dispatch = useDispatch();
  const { roles } = useSelector((state) => state.roles);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    role: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user._id,
        name: user.name,
        role: user.role._id,
        password: '',
      });
    }
  }, [user]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { id: formData.id, name: formData.name, role: formData.role };
    if (formData.password) {
        userData.password = formData.password;
    }
    dispatch(updateUser(userData));
    toast.success(`อัปเดตข้อมูลผู้ใช้ ${formData.name} สำเร็จ`);
    onClose();
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles} contentLabel="Edit User Modal">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">แก้ไขข้อมูลผู้ใช้</h2>
            <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-gray-600 text-2xl"/></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-bold mb-2 text-gray-600">ชื่อ-นามสกุล</label>
                <input type="text" name="name" value={formData.name} onChange={onChange} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors" required />
            </div>
            <div>
                <label className="block text-sm font-bold mb-2 text-gray-600">ตำแหน่ง</label>
                <select name="role" value={formData.role} onChange={onChange} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors" required>
                    {roles.map((r) => (
                        <option key={r._id} value={r._id}>{r.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-bold mb-2 text-gray-600">รหัสผ่านใหม่ (ไม่บังคับ)</label>
                <input type="password" name="password" value={formData.password} onChange={onChange} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors" placeholder="กรอกเพื่อเปลี่ยนรหัสผ่าน" />
            </div>
            <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
                <button type="button" onClick={onClose} className="text-gray-600 font-bold uppercase px-6 py-2 text-sm rounded-lg hover:bg-gray-200 transition-colors mr-4">ยกเลิก</button>
                <button type="submit" className="bg-pastel-green-dark text-white font-bold uppercase text-sm px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-green-600 transition-all duration-300">
                    บันทึกการเปลี่ยนแปลง
                </button>
            </div>
        </form>
    </Modal>
  );
}

export default EditUserModal;