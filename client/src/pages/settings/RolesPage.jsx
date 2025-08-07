
// client/src/pages/settings/RolesPage.jsx
import React, { useState } from 'react';
import { FaUsersCog, FaPlus } from 'react-icons/fa';
import RoleList from '../../components/settings/RoleList';
import RoleModal from '../../components/modals/RoleModal';

function RolesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleOpenModal = (role = null) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRole(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 bg-pastel-purple-lightest min-h-screen animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-md">
            <FaUsersCog className="text-4xl text-pastel-purple" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-pastel-purple-dark">จัดการตำแหน่งและสิทธิ์</h1>
            <p className="text-pastel-gray-dark mt-1">กำหนดบทบาทและสิทธิ์การเข้าถึงสำหรับผู้ใช้งาน</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="btn btn-3d-pastel btn-primary-pastel flex items-center gap-2 transform hover:scale-105 transition-transform duration-200"
        >
          <FaPlus />
          เพิ่มตำแหน่งใหม่
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6">
        <RoleList onEdit={handleOpenModal} />
      </div>

      {isModalOpen && (
        <RoleModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          role={selectedRole} 
        />
      )}
    </div>
  );
}

export default RolesPage;
