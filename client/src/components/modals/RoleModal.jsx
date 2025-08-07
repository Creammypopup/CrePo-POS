// client/src/components/modals/RoleModal.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import { FaTimes, FaSave } from 'react-icons/fa';
import { createRole, updateRole } from '../../features/role/roleSlice';
import { PERMISSION_MODULES, PERMISSIONS } from '../../permissions';
import { toast } from 'react-toastify';

const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '0', width: '90%', maxWidth: '800px', background: '#F9F8FF' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }
};

Modal.setAppElement('#root');

function RoleModal({ isOpen, onClose, role }) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const { isLoading } = useSelector((state) => state.role);

  const allPermissions = useMemo(() => Object.values(PERMISSIONS), []);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setSelectedPermissions(role.permissions || []);
    } else {
      setName('');
      setSelectedPermissions([]);
    }
  }, [role]);

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(p => p !== permissionId) 
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPermissions(allPermissions);
    } else {
      setSelectedPermissions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      toast.error('กรุณาใส่ชื่อตำแหน่ง');
      return;
    }
    const roleData = { name, permissions: selectedPermissions };
    if (role) {
      dispatch(updateRole({ _id: role._id, ...roleData }));
      toast.success(`อัปเดตตำแหน่ง "${name}" สำเร็จ!`);
    } else {
      dispatch(createRole(roleData));
      toast.success(`สร้างตำแหน่ง "${name}" สำเร็จ!`);
    }
    onClose();
  };

  const isAllSelected = allPermissions.length === selectedPermissions.length;

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles} contentLabel="Role Modal">
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-pastel-purple-dark">{role ? 'แก้ไขตำแหน่ง' : 'สร้างตำแหน่งใหม่'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl"><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-lg font-bold mb-2 text-pastel-purple-dark">ชื่อตำแหน่ง</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input w-full text-lg p-3 bg-white shadow-inner-pastel rounded-xl focus:ring-2 focus:ring-pastel-purple"
              placeholder='เช่น ผู้จัดการ, พนักงานขาย'
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-pastel-purple-dark">กำหนดสิทธิ์การเข้าถึง</h3>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={isAllSelected}
                  className="h-5 w-5 rounded text-pastel-purple focus:ring-pastel-purple-dark border-gray-300"
                />
                <span className="font-semibold text-sm text-pastel-purple-dark">เลือกทั้งหมด</span>
              </label>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto p-4 bg-white rounded-2xl shadow-inner-pastel">
              {Object.entries(PERMISSION_MODULES).map(([moduleName, permissions]) => (
                <div key={moduleName}>
                  <h4 className="font-bold text-md text-pastel-purple-dark mb-2 border-b-2 border-pastel-purple-light pb-1">{moduleName}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-2">
                    {permissions.map(p => (
                      <label key={p.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-pastel-purple-lightest cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(p.id)}
                          onChange={() => handlePermissionChange(p.id)}
                          className="h-5 w-5 rounded text-pastel-purple focus:ring-pastel-purple-dark border-gray-300"
                        />
                        <span className="text-gray-700">{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end items-center mt-8 pt-6 border-t border-pastel-gray-light">
            <button type="button" onClick={onClose} className="btn btn-3d-pastel bg-pastel-gray text-gray-700 hover:bg-pastel-gray-dark mr-4">ยกเลิก</button>
            <button type="submit" disabled={isLoading} className="btn btn-3d-pastel btn-primary-pastel flex items-center">
              <FaSave className="mr-2" />
              {isLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default RoleModal;