// client/src/pages/settings/RolesPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getRoles, createRole, updateRole, deleteRole, reset } from '../../features/role/roleSlice';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { ALL_PERMISSIONS } from '../../permissions'; // Make sure this path is correct

function RolesPage() {
  const dispatch = useDispatch();
  // --- START OF EDIT ---
      const { roles, isLoading, isError, message } = useSelector((state) => state.role);
  // --- END OF EDIT ---

  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', currentRole: null });
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, roleId: null, roleName: '' });

  useEffect(() => {
    dispatch(getRoles());
    return () => { dispatch(reset()); };
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((p) => p !== permissionId) : [...prev, permissionId]
    );
  };

  const openModal = (mode = 'add', role = null) => {
    setModalState({ isOpen: true, mode, currentRole: role });
    if (mode === 'edit' && role) {
      setRoleName(role.name);
      setSelectedPermissions(role.permissions);
    } else {
      setRoleName('');
      setSelectedPermissions([]);
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'add', currentRole: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roleName) {
      toast.error('กรุณาใส่ชื่อตำแหน่ง');
      return;
    }
    const roleData = { name: roleName, permissions: selectedPermissions };

    if (modalState.mode === 'edit') {
        dispatch(updateRole({ ...roleData, id: modalState.currentRole._id }));
        toast.success(`อัปเดตตำแหน่ง "${roleName}" สำเร็จ!`);
    } else {
        dispatch(createRole(roleData));
        toast.success(`สร้างตำแหน่ง "${roleName}" สำเร็จ!`);
    }
    closeModal();
  };

  const handleDelete = (roleId) => {
    dispatch(deleteRole(roleId));
    toast.success('ลบตำแหน่งเรียบร้อยแล้ว');
    setDeleteConfirm({ isOpen: false, roleId: null, roleName: '' });
  };

  if (isLoading && roles.length === 0) {
    return <p>กำลังโหลดข้อมูลตำแหน่ง...</p>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">ตำแหน่งและสิทธิ์</h1>
        <button onClick={() => openModal('add')} className="btn btn-3d-pastel btn-primary">
          <FaPlus className="mr-2" /> สร้างตำแหน่งใหม่
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2">
                <th className="p-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">ชื่อตำแหน่ง</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">จำนวนสิทธิ์</th>
                <th className="p-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{role.name}</td>
                  <td className="p-4 text-gray-600">{role.permissions.length}</td>
                  <td className="p-4 flex justify-center space-x-2">
                    <button onClick={() => openModal('edit', role)} className="btn btn-3d-pastel bg-brand-warning text-yellow-800"><FaEdit /></button>
                    <button onClick={() => setDeleteConfirm({ isOpen: true, roleId: role._id, roleName: role.name })} className="btn btn-3d-pastel bg-brand-danger text-red-800"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    
      {/* Add/Edit Modal */}
      {modalState.isOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4 animate-fade-in">
         <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300">
           <h2 className="text-2xl font-bold mb-6 text-gray-700">{modalState.mode === 'add' ? 'สร้างตำแหน่งใหม่' : 'แก้ไขตำแหน่ง'}</h2>
           <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2">
             <div className="mb-6">
               <label className="block text-sm font-bold mb-2 text-gray-600">ชื่อตำแหน่ง</label>
               <input type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors" placeholder="เช่น พนักงานแคชเชียร์"/>
             </div>
             <div>
               <label className="block text-sm font-bold mb-4 text-gray-600">กำหนดสิทธิ์การเข้าถึง</label>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl">
                   {ALL_PERMISSIONS.map((permission) => (
                       <label key={permission.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white cursor-pointer">
                           <input type="checkbox" className="form-checkbox h-5 w-5 text-purple-600 rounded-md border-gray-300 focus:ring-purple-500 transition-colors" checked={selectedPermissions.includes(permission.id)} onChange={() => handlePermissionChange(permission.id)}/>
                           <span className="text-gray-700 select-none">{permission.name}</span>
                       </label>
                   ))}
               </div>
             </div>
           </form>
            <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-200">
               <button type="button" onClick={closeModal} className="text-gray-600 font-bold uppercase px-6 py-2 text-sm rounded-lg hover:bg-gray-200 transition-colors mr-4">ยกเลิก</button>
               <button onClick={handleSubmit} className="bg-pastel-purple-dark text-white font-bold uppercase text-sm px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-300">
                 บันทึก
               </button>
             </div>
         </div>
       </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                <h3 className="text-xl font-bold text-gray-800">ยืนยันการลบ</h3>
                <p className="text-gray-600 my-4">คุณแน่ใจหรือไม่ว่าต้องการลบตำแหน่งนี้? <br/>การกระทำนี้ไม่สามารถย้อนกลับได้</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={() => setDeleteConfirm({ isOpen: false, roleId: null })} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">ยกเลิก</button>
                    <button onClick={() => handleDelete(deleteConfirm.roleId)} className="px-6 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 font-semibold">ยืนยันการลบ</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default RolesPage;