// client/src/pages/settings/UsersPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getUsers, updateUser, deleteUser, reset as resetUsers } from '../../features/user/userSlice';
import { getRoles, reset as resetRoles } from '../../features/role/roleSlice';
import { toast } from 'react-toastify';
import AddUserModal from '../../components/modals/AddUserModal';
import Spinner from '../../components/Spinner';

function UsersPage() {
    const dispatch = useDispatch();
    const { users, isLoading: usersLoading } = useSelector((state) => state.users);
    const { user: loggedInUser } = useSelector((state) => state.auth);
    const { roles } = useSelector((state) => state.role); // Correctly select from 'role' slice

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', role: '', password: '' });

    useEffect(() => {
        dispatch(getUsers());
        dispatch(getRoles());
        return () => {
            dispatch(resetUsers());
            dispatch(resetRoles());
        }
    }, [dispatch]);

    const openEditModal = (user) => {
        setSelectedUser(user);
        setFormData({ name: user.name, role: user.role._id, password: '' });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (user) => {
        if (user._id === loggedInUser._id) {
            toast.error("คุณไม่สามารถลบบัญชีของตัวเองได้");
            return;
        }
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleFormChange = (e) => {
        setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const userData = { id: selectedUser._id, name: formData.name, role: formData.role };
        if (formData.password) {
            userData.password = formData.password;
        }
        dispatch(updateUser(userData));
        toast.success(`อัปเดตข้อมูลผู้ใช้ ${formData.name} สำเร็จ`);
        setIsEditModalOpen(false);
    };

    const handleDelete = () => {
        dispatch(deleteUser(selectedUser._id));
        toast.success(`ลบผู้ใช้ ${selectedUser.name} สำเร็จ`);
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">จัดการผู้ใช้งาน</h1>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn btn-3d-pastel btn-primary"
                >
                    <FaPlus className="mr-2" /> เพิ่มผู้ใช้ใหม่
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
                {usersLoading ? <Spinner /> : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2">
                                    <th className="p-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">ชื่อผู้ใช้</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">ตำแหน่ง</th>
                                    <th className="p-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">การกระทำ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-800">{user.name}</td>
                                        <td className="p-4 text-gray-600">{user.username}</td>
                                        <td className="p-4 text-gray-600">{user.role?.name || 'N/A'}</td>
                                        <td className="p-4 flex justify-center space-x-2">
                                            <button onClick={() => openEditModal(user)} className="btn btn-3d-pastel bg-brand-warning text-yellow-800 p-2.5"><FaEdit /></button>
                                            <button onClick={() => openDeleteModal(user)} className="btn btn-3d-pastel bg-brand-danger text-red-800 p-2.5" disabled={user._id === loggedInUser._id}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isEditModalOpen && selectedUser && (
                 <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4 animate-fade-in">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col">
                        <h2 className="text-2xl font-bold mb-6 text-gray-700">แก้ไขข้อมูลผู้ใช้</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-600">ชื่อ-นามสกุล</label>
                                <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="form-input" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-600">ตำแหน่ง</label>
                                <select name="role" value={formData.role} onChange={handleFormChange} className="form-input" required>
                                    {roles.map((r) => (
                                        <option key={r._id} value={r._id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-600">รหัสผ่านใหม่ (ไม่บังคับ)</label>
                                <input type="password" name="password" value={formData.password} onChange={handleFormChange} className="form-input" placeholder="กรอกเพื่อเปลี่ยนรหัสผ่าน" />
                            </div>
                            <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-200">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 mr-4">ยกเลิก</button>
                                <button type="submit" className="btn btn-3d-pastel btn-success">บันทึกการเปลี่ยนแปลง</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 animate-fade-in">
                    <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                        <h3 className="text-xl font-bold text-gray-800">ยืนยันการลบ</h3>
                        <p className="text-gray-600 my-4">คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ <br/><strong className="text-red-500">{selectedUser.name}</strong>?</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="btn bg-gray-200 hover:bg-gray-300">ยกเลิก</button>
                            <button onClick={handleDelete} className="btn btn-3d-pastel btn-danger">ยืนยันการลบ</button>
                        </div>
                    </div>
                </div>
            )}

            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}

export default UsersPage;