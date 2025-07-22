import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getUsers, updateUser, deleteUser, reset as resetUsers } from '../../features/user/userSlice';
import { getRoles, reset as resetRoles } from '../../features/role/roleSlice';
import { toast } from 'react-toastify';

function UsersPage() {
    const dispatch = useDispatch();
    const { users, isLoading: usersLoading } = useSelector((state) => state.users);
    const { roles } = useSelector((state) => state.roles);
    const { user: loggedInUser } = useSelector((state) => state.auth); // Get the logged-in user

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
        // Prevent admin from deleting themselves
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
                <h1 className="text-3xl font-bold text-candy-text-primary">จัดการผู้ใช้งาน</h1>
                <Link to="/register" className="bg-candy-pink-action hover:brightness-105 text-white font-bold py-2 px-4 rounded-xl flex items-center transition-all duration-300 shadow-lg shadow-pink-100">
                    <FaPlus className="mr-2" /> เพิ่มผู้ใช้ใหม่
                </Link>
            </div>
            <div className="bg-candy-content-bg p-6 rounded-2xl shadow-lg shadow-purple-100">
                <h2 className="text-xl font-semibold mb-4 text-candy-text-primary">รายชื่อผู้ใช้งานทั้งหมด</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-candy-bg">
                                <th className="p-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                                <th className="p-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">ชื่อผู้ใช้</th>
                                <th className="p-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">ตำแหน่ง</th>
                                <th className="p-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">การกระทำ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersLoading ? (
                                <tr><td colSpan="4" className="text-center p-4">กำลังโหลด...</td></tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="border-b border-candy-bg hover:bg-candy-bg">
                                        <td className="p-4 font-medium text-candy-text-primary">{user.name}</td>
                                        <td className="p-4 text-gray-600">{user.username}</td>
                                        <td className="p-4 text-gray-600">{user.role?.name || 'N/A'}</td>
                                        <td className="p-4 flex space-x-4">
                                            <button onClick={() => openEditModal(user)} className="text-yellow-500 bg-yellow-50 p-2 rounded-full hover:bg-yellow-100 transition-colors"><FaEdit size={16} /></button>
                                            <button onClick={() => openDeleteModal(user)} className="text-red-500 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={user._id === loggedInUser._id}><FaTrash size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {isEditModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4 animate-fade-in">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col">
                        <h2 className="text-2xl font-bold mb-6 text-candy-text-primary">แก้ไขข้อมูลผู้ใช้</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-candy-text-primary">ชื่อ-นามสกุล</label>
                                <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full px-4 py-3 bg-candy-bg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-candy-purple transition-colors" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-candy-text-primary">ตำแหน่ง</label>
                                <select name="role" value={formData.role} onChange={handleFormChange} className="w-full px-4 py-3 bg-candy-bg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-candy-purple transition-colors" required>
                                    {roles.map((r) => (
                                        <option key={r._id} value={r._id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-candy-text-primary">รหัสผ่านใหม่ (ไม่บังคับ)</label>
                                <input type="password" name="password" value={formData.password} onChange={handleFormChange} className="w-full px-4 py-3 bg-candy-bg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-candy-purple transition-colors" placeholder="กรอกเพื่อเปลี่ยนรหัสผ่าน" />
                            </div>
                            <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-200">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-gray-600 font-bold uppercase px-6 py-2 text-sm rounded-lg hover:bg-gray-200 transition-colors mr-4">ยกเลิก</button>
                                <button type="submit" className="bg-candy-purple-action text-white font-bold uppercase text-sm px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:brightness-110">บันทึกการเปลี่ยนแปลง</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 animate-fade-in">
                    <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                        <h3 className="text-xl font-bold text-candy-text-primary">ยืนยันการลบ</h3>
                        <p className="text-gray-600 my-4">คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ <br/><strong className="text-red-500">{selectedUser.name}</strong>?</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">ยกเลิก</button>
                            <button onClick={handleDelete} className="px-6 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 font-semibold">ยืนยันการลบ</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default UsersPage;
