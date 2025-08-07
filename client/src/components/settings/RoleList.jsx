
// client/src/components/settings/RoleList.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getRoles, deleteRole } from '../../features/role/roleSlice';
import { FaEdit, FaTrash, FaShieldAlt } from 'react-icons/fa';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';

function RoleList({ onEdit }) {
  const dispatch = useDispatch();
  const { roles, isLoading, isError, message } = useSelector((state) => state.role);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getRoles());
  }, [dispatch, isError, message]);

  const handleDelete = (role) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบตำแหน่ง "${role.name}"?`)) {
      dispatch(deleteRole(role._id));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-2xl">
        <thead className="bg-pastel-purple-light">
          <tr>
            <th className="py-4 px-6 text-left text-sm font-bold text-pastel-purple-dark uppercase tracking-wider rounded-tl-2xl">ตำแหน่ง</th>
            <th className="py-4 px-6 text-left text-sm font-bold text-pastel-purple-dark uppercase tracking-wider">จำนวนสิทธิ์</th>
            <th className="py-4 px-6 text-left text-sm font-bold text-pastel-purple-dark uppercase tracking-wider">อัปเดตล่าสุด</th>
            <th className="py-4 px-6 text-center text-sm font-bold text-pastel-purple-dark uppercase tracking-wider rounded-tr-2xl">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-pastel-gray-light">
          {roles.map((role) => (
            <tr key={role._id} className="hover:bg-pastel-purple-lightest transition-colors duration-200">
              <td className="py-4 px-6 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-pastel-purple" />
                  <span className="font-medium text-gray-800">{role.name}</span>
                </div>
              </td>
              <td className="py-4 px-6 whitespace-nowrap text-pastel-gray-dark">
                {role.permissions.length} สิทธิ์
              </td>
              <td className="py-4 px-6 whitespace-nowrap text-pastel-gray-dark">
                {new Date(role.updatedAt).toLocaleDateString('th-TH', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </td>
              <td className="py-4 px-6 whitespace-nowrap text-center">
                <div className="flex justify-center items-center gap-4">
                  <button onClick={() => onEdit(role)} className="text-pastel-blue hover:text-pastel-blue-dark transition-transform transform hover:scale-110">
                    <FaEdit size={18} />
                  </button>
                  <button onClick={() => handleDelete(role)} className="text-pastel-red hover:text-pastel-red-dark transition-transform transform hover:scale-110">
                    <FaTrash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RoleList;
