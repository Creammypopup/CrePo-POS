// client/src/components/modals/AddUserModal.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { FaEye, FaEyeSlash, FaUserPlus, FaTimes } from 'react-icons/fa';
import { register, reset as resetAuth } from '../../features/auth/authSlice';
import { getRoles } from '../../features/role/roleSlice'; // reset for roles is not needed here

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', width: '90%', maxWidth: '500px', background: '#fff' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }
};

Modal.setAppElement('#root');

function AddUserModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', username: '', password: '', password2: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { name, username, password, password2, role } = formData;
  const dispatch = useDispatch();
  const { isLoading: authLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  // --- START OF EDIT ---
  const { roles, isLoading: rolesLoading } = useSelector((state) => state.role);
  // --- END OF EDIT ---

  useEffect(() => {
    if (isOpen) {
        dispatch(getRoles());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (isError) { toast.error(message); }
    if (isSuccess) {
        toast.success(`สร้างผู้ใช้ "${name}" สำเร็จ!`);
        dispatch(resetAuth());
        onClose();
    }
  }, [isError, isSuccess, name, dispatch, onClose]);

  const onChange = (e) => {
    setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) { toast.error('รหัสผ่านไม่ตรงกัน'); } 
    else if (!role) { toast.error('กรุณาเลือกตำแหน่ง'); } 
    else { dispatch(register({ name, username, password, role })); }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles} contentLabel="Add User Modal">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">สร้างผู้ใช้ใหม่</h2>
            <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-gray-600 text-2xl"/></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
            {/* (โค้ดฟอร์มเหมือนเดิม) */}
            <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
                <button type="button" onClick={onClose} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 mr-4">ยกเลิก</button>
                <button type="submit" disabled={authLoading} className="btn btn-3d-pastel btn-primary flex items-center">
                    <FaUserPlus className="mr-2" />
                    {authLoading ? 'กำลังสร้าง...' : 'สร้างผู้ใช้งาน'}
                </button>
            </div>
        </form>
    </Modal>
  );
}

export default AddUserModal;